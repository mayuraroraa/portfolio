import { useEffect, useState } from "react";
import "./App.css";

/* -----------------------------
   XP / DIFFICULTY CONFIG
----------------------------- */

const DIFFICULTIES = {
  Trivial: { xp: 10, coins: 5 },
  Easy: { xp: 25, coins: 10 },
  Normal: { xp: 50, coins: 20 },
  Hard: { xp: 100, coins: 40 },
  Elite: { xp: 250, coins: 100 },
  Legendary: { xp: 500, coins: 250 },
};

/* -----------------------------
   SOUND EFFECTS
   Uses Web Audio API.
   No audio files required.
----------------------------- */

function playSound(type) {
  const AudioContext =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) return;

  const ctx = new AudioContext();

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  if (type === "complete") {
    oscillator.frequency.setValueAtTime(500, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      900,
      ctx.currentTime + 0.15
    );

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.15,
      ctx.currentTime + 0.02
    );
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + 0.4
    );

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.4);
  }

  if (type === "delete") {
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(300, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      100,
      ctx.currentTime + 0.15
    );

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + 0.2
    );

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.2);
  }

  if (type === "levelup") {
    oscillator.frequency.setValueAtTime(500, ctx.currentTime);
    oscillator.frequency.setValueAtTime(
      700,
      ctx.currentTime + 0.15
    );
    oscillator.frequency.setValueAtTime(
      1000,
      ctx.currentTime + 0.3
    );

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.15,
      ctx.currentTime + 0.03
    );
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + 0.7
    );

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.7);
  }

  if (type === "add") {
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(650, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.08,
      ctx.currentTime + 0.02
    );
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + 0.15
    );

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.15);
  }
}

/* -----------------------------
   LEVEL CALCULATIONS
----------------------------- */

function calculateRequiredXP(level) {
  return Math.floor(100 * Math.pow(level, 1.5));
}

function calculateLevelFromXP(totalXP) {
  let level = 1;

  while (
    level < 1000 &&
    totalXP >= calculateRequiredXP(level)
  ) {
    totalXP -= calculateRequiredXP(level);
    level++;
  }

  return level;
}

function calculateProgress(totalXP) {
  let level = 1;
  let remainingXP = totalXP;

  while (
    level < 1000 &&
    remainingXP >= calculateRequiredXP(level)
  ) {
    remainingXP -= calculateRequiredXP(level);
    level++;
  }

  const required = calculateRequiredXP(level);

  return {
    level,
    currentXP: remainingXP,
    requiredXP: required,
    percentage: Math.min(
      100,
      Math.round((remainingXP / required) * 100)
    ),
  };
}

/* -----------------------------
   INITIAL TASKS
----------------------------- */

const initialTasks = [
  {
    id: 1,
    title: "Complete JavaScript Practice",
    description: "Finish today's JavaScript exercises.",
    difficulty: "Normal",
    completed: false,
  },
  {
    id: 2,
    title: "Badminton Training",
    description: "Complete today's training session.",
    difficulty: "Hard",
    completed: false,
  },
];

/* -----------------------------
   APP
----------------------------- */

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);

  const [showModal, setShowModal] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    difficulty: "Normal",
  });

  const [notification, setNotification] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  /* -----------------------------
     LOCAL STORAGE
  ----------------------------- */

  useEffect(() => {
    const savedTasks = localStorage.getItem("system_tasks");
    const savedXP = localStorage.getItem("system_xp");
    const savedCoins = localStorage.getItem("system_coins");

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedXP) setXp(Number(savedXP));
    if (savedCoins) setCoins(Number(savedCoins));
  }, []);

  useEffect(() => {
    localStorage.setItem("system_tasks", JSON.stringify(tasks));
    localStorage.setItem("system_xp", xp);
    localStorage.setItem("system_coins", coins);
  }, [tasks, xp, coins]);

  /* -----------------------------
     PROGRESSION
  ----------------------------- */

  const progression = calculateProgress(xp);

  /* -----------------------------
     NOTIFICATION
  ----------------------------- */

  function showNotification(message, type = "success") {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification(null);
    }, 2500);
  }

  /* -----------------------------
     ADD TASK
  ----------------------------- */

  function addTask(e) {
    e.preventDefault();

    if (!newTask.title.trim()) {
      showNotification("Enter a quest title.", "error");
      return;
    }

    const task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      difficulty: newTask.difficulty,
      completed: false,
    };

    setTasks((prev) => [task, ...prev]);

    if (soundEnabled) playSound("add");

    showNotification("Quest added.");

    setNewTask({
      title: "",
      description: "",
      difficulty: "Normal",
    });

    setShowModal(false);
  }

  /* -----------------------------
     DELETE TASK
  ----------------------------- */

  function deleteTask(id) {
    setTasks((prev) =>
      prev.filter((task) => task.id !== id)
    );

    if (soundEnabled) playSound("delete");

    showNotification("Quest removed.");
  }

  /* -----------------------------
     COMPLETE TASK
  ----------------------------- */

  function completeTask(task) {
    if (task.completed) return;

    const reward = DIFFICULTIES[task.difficulty];

    const oldLevel = progression.level;

    setTasks((prev) =>
      prev.map((item) =>
        item.id === task.id
          ? { ...item, completed: true }
          : item
      )
    );

    setXp((prev) => prev + reward.xp);
    setCoins((prev) => prev + reward.coins);

    const newTotalXP = xp + reward.xp;
    const newLevel = calculateLevelFromXP(newTotalXP);

    if (soundEnabled) {
      playSound("complete");

      if (newLevel > oldLevel) {
        setTimeout(() => playSound("levelup"), 350);
      }
    }

    showNotification(
      `+${reward.xp} XP  •  +${reward.coins} Coins`
    );
  }

  /* -----------------------------
     UNDO TASK
  ----------------------------- */

  function undoTask(task) {
    if (!task.completed) return;

    const reward = DIFFICULTIES[task.difficulty];

    setTasks((prev) =>
      prev.map((item) =>
        item.id === task.id
          ? { ...item, completed: false }
          : item
      )
    );

    setXp((prev) => Math.max(0, prev - reward.xp));
    setCoins((prev) => Math.max(0, prev - reward.coins));

    showNotification("Quest restored.");
  }

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const completionPercentage =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100);

  return (
    <div className="app">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">S</div>

          <div>
            <h2>SYSTEM</h2>
            <span>LIFE PROGRESSION</span>
          </div>
        </div>

        <nav>
          <button className="nav-item active">
            <span>⌂</span>
            Quests
          </button>

          <button className="nav-item">
            <span>◈</span>
            Progress
          </button>

          <button className="nav-item">
            <span>✦</span>
            Achievements
          </button>
        </nav>

        <div className="sidebar-bottom">

          <button
            className="sound-button"
            onClick={() =>
              setSoundEnabled((prev) => !prev)
            }
          >
            {soundEnabled ? "🔊 Sound On" : "🔇 Sound Off"}
          </button>

          <div className="version">
            SYSTEM v1.0
          </div>

        </div>

      </aside>

      {/* MAIN */}

      <main className="main">

        {/* TOP BAR */}

        <header className="topbar">

          <div>
            <p className="eyebrow">
              PERSONAL PROGRESSION CONSOLE
            </p>

            <h1>
              Make the next move{" "}
              <span>count.</span>
            </h1>
          </div>

          <button
            className="add-button"
            onClick={() => setShowModal(true)}
          >
            <span>＋</span>
            Add Quest
          </button>

        </header>

        {/* PLAYER PROGRESS */}

        <section className="player-card">

          <div className="player-info">

            <div className="avatar">
              M
            </div>

            <div>
              <span className="small-label">
                CURRENT PLAYER
              </span>

              <h2>Mayur</h2>

              <div className="rank">
                RANK E
              </div>
            </div>

          </div>

          <div className="level-info">

            <div className="level-row">

              <strong>
                LEVEL {progression.level}
              </strong>

              <span>
                {progression.currentXP} /{" "}
                {progression.requiredXP} XP
              </span>

            </div>

            <div className="xp-bar">
              <div
                className="xp-fill"
                style={{
                  width: `${progression.percentage}%`,
                }}
              />
            </div>

            <span className="xp-text">
              {progression.requiredXP -
                progression.currentXP}{" "}
              XP until next level
            </span>

          </div>

          <div className="currency">

            <div>
              <span>COINS</span>
              <strong>🪙 {coins}</strong>
            </div>

            <div>
              <span>STREAK</span>
              <strong>🔥 0 DAYS</strong>
            </div>

          </div>

        </section>

        {/* STATS */}

        <section className="stats">

          <div className="stat-card">
            <span>TODAY'S PROGRESS</span>
            <strong>
              {completedTasks}/{tasks.length}
            </strong>

            <div className="mini-progress">
              <div
                style={{
                  width: `${completionPercentage}%`,
                }}
              />
            </div>
          </div>

          <div className="stat-card">
            <span>TOTAL XP</span>
            <strong>{xp}</strong>
            <small>Experience earned</small>
          </div>

          <div className="stat-card">
            <span>AVAILABLE QUESTS</span>
            <strong>
              {tasks.filter((t) => !t.completed).length}
            </strong>
            <small>Keep moving</small>
          </div>

        </section>

        {/* QUEST HEADER */}

        <section className="quest-header">

          <div>
            <p className="eyebrow">
              ACTIVE QUESTS
            </p>

            <h2>Your current missions</h2>
          </div>

          <span className="quest-count">
            {tasks.length} QUESTS
          </span>

        </section>

        {/* QUEST LIST */}

        <section className="quest-list">

          {tasks.length === 0 && (
            <div className="empty-state">

              <div className="empty-icon">
                ◇
              </div>

              <h3>
                Your System is waiting.
              </h3>

              <p>
                Create your first quest and start
                building momentum.
              </p>

              <button
                onClick={() => setShowModal(true)}
              >
                CREATE FIRST QUEST
              </button>

            </div>
          )}

          {tasks.map((task) => {

            const reward =
              DIFFICULTIES[task.difficulty];

            return (
              <article
                key={task.id}
                className={`quest-card ${
                  task.completed
                    ? "completed"
                    : ""
                }`}
              >

                <button
                  className={`complete-circle ${
                    task.completed
                      ? "checked"
                      : ""
                  }`}
                  onClick={() =>
                    task.completed
                      ? undoTask(task)
                      : completeTask(task)
                  }
                  aria-label="Complete quest"
                >
                  {task.completed ? "✓" : ""}
                </button>

                <div className="quest-content">

                  <div className="quest-title-row">

                    <h3>{task.title}</h3>

                    <span
                      className={`difficulty ${task.difficulty.toLowerCase()}`}
                    >
                      {task.difficulty}
                    </span>

                  </div>

                  <p>
                    {task.description ||
                      "No description provided."}
                  </p>

                  <div className="quest-rewards">

                    <span>
                      ✦ +{reward.xp} XP
                    </span>

                    <span>
                      🪙 +{reward.coins}
                    </span>

                  </div>

                </div>

                <button
                  className="delete-button"
                  onClick={() =>
                    deleteTask(task.id)
                  }
                >
                  ×
                </button>

              </article>
            );
          })}

        </section>

      </main>

      {/* NOTIFICATION */}

      {notification && (
        <div
          className={`notification ${notification.type}`}
        >
          <span>✦</span>
          {notification.message}
        </div>
      )}

      {/* CREATE QUEST MODAL */}

      {showModal && (
        <div
          className="modal-overlay"
          onMouseDown={() => setShowModal(false)}
        >

          <div
            className="modal"
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>
                <span className="eyebrow">
                  NEW MISSION
                </span>

                <h2>Create Quest</h2>
              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
              >
                ×
              </button>

            </div>

            <form onSubmit={addTask}>

              <label>
                QUEST TITLE

                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      title: e.target.value,
                    })
                  }
                  autoFocus
                />
              </label>

              <label>
                DESCRIPTION

                <textarea
                  placeholder="Describe your mission..."
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      description:
                        e.target.value,
                    })
                  }
                />
              </label>

              <label>
                DIFFICULTY

                <div className="difficulty-grid">

                  {Object.entries(
                    DIFFICULTIES
                  ).map(([name, reward]) => (

                    <button
                      type="button"
                      key={name}
                      className={
                        newTask.difficulty === name
                          ? "difficulty-option selected"
                          : "difficulty-option"
                      }
                      onClick={() =>
                        setNewTask({
                          ...newTask,
                          difficulty: name,
                        })
                      }
                    >

                      <strong>{name}</strong>

                      <span>
                        +{reward.xp} XP
                      </span>

                      <small>
                        +{reward.coins} Coins
                      </small>

                    </button>

                  ))}

                </div>

              </label>

              <div className="modal-reward">

                <span>QUEST REWARD</span>

                <strong>
                  +{DIFFICULTIES[
                    newTask.difficulty
                  ].xp} XP
                </strong>

                <strong>
                  +{DIFFICULTIES[
                    newTask.difficulty
                  ].coins} COINS
                </strong>

              </div>

              <button
                type="submit"
                className="create-button"
              >
                CREATE QUEST →
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}