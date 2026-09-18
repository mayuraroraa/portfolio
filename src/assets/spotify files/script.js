/* ==========================================================================
   1. SPOTIFY MUSIC DATABASE (All Homepage Cards)
   ========================================================================== */
const musicDatabase = {
  albums: {
    // Trending Songs & Singles
    "barsaat": {
      title: "Barsaat",
      type: "Single",
      artist: "Roni",
      artistId: "roni",
      image: "images/Screenshot 1.png",
      meta: "• 2023 • 1 song, 3 min 12 sec",
      tracks: [
        { number: 1, title: "Barsaat", artists: "Roni, Banjaare", duration: "3:12", src: "audio/barsaat.mp3" }
      ]
    },
    "kalyani": {
      title: "KALYANI",
      type: "Single",
      artist: "ARJN",
      artistId: "arjn",
      image: "images/Screenshot 2.png",
      meta: "• 2024 • 1 song, 2 min 45 sec",
      tracks: [
        { number: 1, title: "KALYANI (Remix)", artists: "ARJN, KDS, Shreya Ghoshal", duration: "2:45", src: "audio/kalyani.mp3" }
      ]
    },
    "her": {
      title: "Her",
      type: "Single",
      artist: "Shubh",
      artistId: "shubh",
      image: "images/Screenshot 3.png",
      meta: "• 2022 • 1 song, 2 min 50 sec",
      tracks: [
        { number: 1, title: "Her", artists: "Shubh", duration: "2:50", src: "audio/her.mp3" }
      ]
    },
    "deewane": {
      title: "Deewane",
      type: "Single",
      artist: "Navaan Sandhu",
      artistId: "navaansandhu",
      image: "images/Screenshot 4.png",
      meta: "• 2024 • 1 song, 3 min 18 sec",
      tracks: [
        { number: 1, title: "Deewane", artists: "Navaan Sandhu, Bir, Daaku", duration: "3:18", src: "audio/deewane.mp3" }
      ]
    },
    "pichetere": {
      title: "Piche Tere",
      type: "Single",
      artist: "Kunwaar",
      artistId: "kunwaar",
      image: "images/Screenshot 5.png",
      meta: "• 2024 • 1 song, 3 min 05 sec",
      tracks: [
        { number: 1, title: "Piche Tere", artists: "Kunwaar, Dishant", duration: "3:05", src: "audio/pichetere.mp3" }
      ]
    },

    // Popular Albums
    "sicario": {
      title: "Sicario",
      type: "Album",
      artist: "Shubh",
      artistId: "shubh",
      image: "images/album 1.png",
      meta: "• 2024 • 8 songs, 24 min",
      tracks: [
        { number: 1, title: "Sicario Intro", artists: "Shubh", duration: "2:10", src: "audio/sicario1.mp3" },
        { number: 2, title: "King Shit", artists: "Shubh", duration: "3:40", src: "audio/sicario2.mp3" },
        { number: 3, title: "Bandana", artists: "Shubh", duration: "2:58", src: "audio/sicario3.mp3" }
      ]
    },
    "glory": {
      title: "GLORY",
      type: "Album",
      artist: "Yo Yo Honey Singh",
      artistId: "honeysingh",
      image: "images/album 2.png",
      meta: "• 2024 • 18 songs, 52 min",
      tracks: [
        { number: 1, title: "Millionaire", artists: "Yo Yo Honey Singh", duration: "3:14", src: "audio/millionaire.mp3" },
        { number: 2, title: "Jatt Mehkma", artists: "Yo Yo Honey Singh", duration: "2:58", src: "audio/jatt.mp3" },
        { number: 3, title: "Payal", artists: "Yo Yo Honey Singh, Nora Fatehi", duration: "3:42", src: "audio/payal.mp3" }
      ]
    },
    "younggoat": {
      title: "Young G.O.A.T",
      type: "Album",
      artist: "Chemma Y",
      artistId: "chemmay",
      image: "images/album 3.png",
      meta: "• 2024 • 6 songs, 18 min",
      tracks: [
        { number: 1, title: "Young G.O.A.T", artists: "Chemma Y, Gur Sidhu", duration: "3:10", src: "audio/goat.mp3" }
      ]
    },
    "jotum": {
      title: "Jo Tum Mere Ho",
      type: "Single",
      artist: "Anuv Jain",
      artistId: "anuvjain",
      image: "images/album 4.png",
      meta: "• 2024 • 1 song, 4 min 12 sec",
      tracks: [
        { number: 1, title: "Jo Tum Mere Ho", artists: "Anuv Jain", duration: "4:12", src: "audio/jotum.mp3" }
      ]
    },
    "withoutprejudice": {
      title: "WITHOUT PREJUDICE",
      type: "Album",
      artist: "Guru Randhawa",
      artistId: "gururandhawa",
      image: "images/album 5.png",
      meta: "• 2024 • 10 songs, 31 min",
      tracks: [
        { number: 1, title: "Prejudice", artists: "Guru Randhawa", duration: "3:02", src: "audio/prejudice.mp3" }
      ]
    },

    // Featured Charts
    "chart1": {
      title: "Top Songs - Global",
      type: "Playlist",
      artist: "Spotify",
      artistId: "spotify",
      image: "images/chart 1.png",
      meta: "• Weekly Music Charts • 50 songs",
      tracks: [
        { number: 1, title: "Die With A Smile", artists: "Lady Gaga, Bruno Mars", duration: "4:11", src: "audio/diewithasmile.mp3" },
        { number: 2, title: "Birds of a Feather", artists: "Billie Eilish", duration: "3:10", src: "audio/birds.mp3" }
      ]
    },
    "chart2": {
      title: "Top Songs - India",
      type: "Playlist",
      artist: "Spotify",
      artistId: "spotify",
      image: "images/chart 2.png",
      meta: "• Weekly Music Charts • 50 songs",
      tracks: [
        { number: 1, title: "Tauba Tauba", artists: "Karan Aujla", duration: "3:27", src: "audio/tauba.mp3" },
        { number: 2, title: "Aaj Ki Raat", artists: "Sachin-Jigar, Madhubanti Bagchi", duration: "3:48", src: "audio/aajkiraat.mp3" }
      ]
    },
    "chart3": {
      title: "Top 50 - Global",
      type: "Playlist",
      artist: "Spotify",
      artistId: "spotify",
      image: "images/chart 3.png",
      meta: "• Daily update of most played tracks",
      tracks: [
        { number: 1, title: "Espresso", artists: "Sabrina Carpenter", duration: "2:55", src: "audio/espresso.mp3" }
      ]
    },
    "chart4": {
      title: "Top 50 - India",
      type: "Playlist",
      artist: "Spotify",
      artistId: "spotify",
      image: "images/chart 4.png",
      meta: "• Daily update of most played tracks in India",
      tracks: [
        { number: 1, title: "Millionaire", artists: "Yo Yo Honey Singh", duration: "3:14", src: "audio/millionaire.mp3" }
      ]
    }
  },

  artists: {
    "pritam": {
      name: "Pritam",
      image: "images/artist 1.png",
      listeners: "42,156,908 monthly listeners",
      popularTracks: [
        { number: 1, title: "Tum Hi Ho", listens: "542,123,000", duration: "4:22", src: "audio/tumhiho.mp3" },
        { number: 2, title: "Kesariya", listens: "321,544,112", duration: "4:28", src: "audio/kesariya.mp3" },
        { number: 3, title: "Chaleya", listens: "198,432,555", duration: "3:20", src: "audio/chaleya.mp3" }
      ]
    },
    "arrahman": {
      name: "A.R. Rahman",
      image: "images/artist 2.png",
      listeners: "35,892,104 monthly listeners",
      popularTracks: [
        { number: 1, title: "Kun Faya Kun", listens: "410,200,500", duration: "7:53", src: "audio/kunfayakun.mp3" },
        { number: 2, title: "Agar Tum Saath Ho", listens: "389,150,000", duration: "5:41", src: "audio/agartum.mp3" },
        { number: 3, title: "Jai Ho", listens: "285,120,400", duration: "3:42", src: "audio/jaiho.mp3" }
      ]
    },
    "arijit": {
      name: "Arijit Singh",
      image: "images/artist 3.png",
      listeners: "48,930,120 monthly listeners",
      popularTracks: [
        { number: 1, title: "Apna Bana Le", listens: "620,400,100", duration: "4:21", src: "audio/apnabanale.mp3" },
        { number: 2, title: "O Maahi", listens: "310,220,190", duration: "3:53", src: "audio/omaahi.mp3" }
      ]
    },
    "sachinjigar": {
      name: "Sachin-Jigar",
      image: "images/artist 4.png",
      listeners: "29,400,812 monthly listeners",
      popularTracks: [
        { number: 1, title: "Aaj Ki Raat", listens: "210,450,000", duration: "3:48", src: "audio/aajkiraat.mp3" },
        { number: 2, title: "Apna Bana Le", listens: "620,400,100", duration: "4:21", src: "audio/apnabanale.mp3" }
      ]
    },
    "honeysingh": {
      name: "Yo Yo Honey Singh",
      image: "images/artist 5.png",
      listeners: "24,810,900 monthly listeners",
      popularTracks: [
        { number: 1, title: "Millionaire", listens: "180,450,200", duration: "3:14", src: "audio/millionaire.mp3" },
        { number: 2, title: "Blue Eyes", listens: "490,200,120", duration: "3:40", src: "audio/blueeyes.mp3" }
      ]
    }
  }
};

/* ==========================================================================
   2. DYNAMIC PAGE ROUTING & DOM INJECTION
   ========================================================================== */
const urlParams = new URLSearchParams(window.location.search);
const currentId = urlParams.get('id');

// ROUTE 1: ALBUM / SINGLE / PLAYLIST PAGE
if (document.getElementById("album-title") && currentId && musicDatabase.albums[currentId]) {
  const data = musicDatabase.albums[currentId];

  document.getElementById("album-cover").src = data.image;
  document.getElementById("album-title").innerText = data.title;
  document.getElementById("album-type").innerText = data.type;
  document.getElementById("album-artist").innerText = data.artist;
  document.getElementById("album-meta-info").innerText = data.meta;

  const trackListContainer = document.getElementById("track-list");
  trackListContainer.innerHTML = `
    <div class="tracklist-header d-flex text-secondary border-bottom border-secondary pb-2 mb-3 px-3">
        <div class="col-1 text-center">#</div>
        <div class="col-10">Title</div>
        <div class="col-1 text-end"><i class="fa-regular fa-clock"></i></div>
    </div>
  `;

  data.tracks.forEach(track => {
    trackListContainer.innerHTML += `
      <div class="tracklist-row d-flex align-items-center text-white py-2 px-3 rounded" onclick="playMusic('${track.title}', '${track.artists}', '${data.image}', '${track.src}')">
          <div class="col-1 text-center text-secondary track-number">${track.number}</div>
          <div class="col-10 d-flex flex-column justify-content-center">
              <span class="fw-bold text-white">${track.title}</span>
              <span class="text-secondary small">${track.artists}</span>
          </div>
          <div class="col-1 text-end text-secondary">${track.duration}</div>
      </div>
    `;
  });
}

// ROUTE 2: ARTIST PAGE
if (document.getElementById("artist-name") && currentId && musicDatabase.artists[currentId]) {
  const data = musicDatabase.artists[currentId];

  const artistBanner = document.querySelector('.artist-banner');
  if (artistBanner) {
    artistBanner.style.backgroundImage = `linear-gradient(transparent 0, rgba(0,0,0,0.8) 100%), url('${data.image}')`;
  }
  document.getElementById("artist-name").innerText = data.name;
  document.getElementById("artist-listeners").innerText = data.listeners;

  const trackListContainer = document.getElementById("artist-track-list");
  trackListContainer.innerHTML = "";

  data.popularTracks.forEach(track => {
    trackListContainer.innerHTML += `
      <div class="tracklist-row d-flex align-items-center text-white py-2 px-3 rounded" onclick="playMusic('${track.title}', '${data.name}', '${data.image}', '${track.src}')">
          <div class="col-1 text-center text-secondary track-number">${track.number}</div>
          <div class="col-9 d-flex flex-column justify-content-center">
              <span class="fw-bold text-white">${track.title}</span>
          </div>
          <div class="col-1 text-secondary small">${track.listens}</div>
          <div class="col-1 text-end text-secondary">${track.duration}</div>
      </div>
    `;
  });
}

/* ==========================================================================
   3. AUDIO ENGINE & PLAYBACK CONTROLLER
   ========================================================================== */
const globalAudio = new Audio();
let isPlaying = false;

function playMusic(title, artist, image, audioSrc) {
  // Update Footer UI
  const footerImg = document.getElementById("now-playing-img");
  const footerTitle = document.getElementById("now-playing-title");
  const footerArtist = document.getElementById("now-playing-artist");
  const playBtnIcon = document.getElementById("master-play-icon");

  if (footerImg) footerImg.src = image;
  if (footerTitle) footerTitle.innerText = title;
  if (footerArtist) footerArtist.innerText = artist;

  // Set audio source & play
  if (audioSrc) {
    globalAudio.src = audioSrc;
    globalAudio.play().then(() => {
      isPlaying = true;
      if (playBtnIcon) {
        playBtnIcon.classList.remove("fa-play");
        playBtnIcon.classList.add("fa-pause");
      }
    }).catch(err => {
      // Audio playback simulated if file doesn't exist locally
      console.log("Audio simulation active:", title);
      isPlaying = true;
      if (playBtnIcon) {
        playBtnIcon.classList.remove("fa-play");
        playBtnIcon.classList.add("fa-pause");
      }
    });
  }
}

// Master Play / Pause Toggle
function togglePlayPause() {
  const playBtnIcon = document.getElementById("master-play-icon");
  if (!globalAudio.src) return;

  if (isPlaying) {
    globalAudio.pause();
    isPlaying = false;
    if (playBtnIcon) {
      playBtnIcon.classList.remove("fa-pause");
      playBtnIcon.classList.add("fa-play");
    }
  } else {
    globalAudio.play();
    isPlaying = true;
    if (playBtnIcon) {
      playBtnIcon.classList.remove("fa-play");
      playBtnIcon.classList.add("fa-pause");
    }
  }
}

// Audio Time Update & Timeline Tracking
globalAudio.addEventListener("timeupdate", () => {
  const progressBar = document.getElementById("audio-progress-bar");
  const currentTimeLabel = document.getElementById("current-time");
  const durationLabel = document.getElementById("total-duration");

  if (globalAudio.duration) {
    const progressPercent = (globalAudio.currentTime / globalAudio.duration) * 100;
    if (progressBar) progressBar.style.width = `${progressPercent}%`;

    const currentMins = Math.floor(globalAudio.currentTime / 60);
    const currentSecs = Math.floor(globalAudio.currentTime % 60).toString().padStart(2, '0');
    if (currentTimeLabel) currentTimeLabel.innerText = `${currentMins}:${currentSecs}`;

    const totalMins = Math.floor(globalAudio.duration / 60);
    const totalSecs = Math.floor(globalAudio.duration % 60).toString().padStart(2, '0');
    if (durationLabel) durationLabel.innerText = `${totalMins}:${totalSecs}`;
  }
});

// Seek Track on Timeline Click
function seekTimeline(event) {
  const progressContainer = document.getElementById("timeline-container");
  if (globalAudio.duration && progressContainer) {
    const rect = progressContainer.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;
    globalAudio.currentTime = (clickX / width) * globalAudio.duration;
  }
}

// Volume Control
function adjustVolume(event) {
  const volContainer = document.getElementById("volume-container");
  const volBar = document.getElementById("volume-bar");
  if (volContainer) {
    const rect = volContainer.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;
    let volume = clickX / width;
    if (volume < 0) volume = 0;
    if (volume > 1) volume = 1;
    globalAudio.volume = volume;
    if (volBar) volBar.style.width = `${volume * 100}%`;
  }
}