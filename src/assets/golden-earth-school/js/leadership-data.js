/* ============================================================
   GOLDEN EARTH CONVENT SCHOOL — LEADERSHIP DATA
   Single source of truth for all leadership profiles.
   Used by: index.html, leadership.html, admin.html

   Storage key: 'gecs_leadership_data' in localStorage
   Admin changes are persisted here and automatically reflected
   on all public-facing pages.
   ============================================================ */

(function () {
  'use strict';

  // ─── DEFAULT LEADERSHIP DATA ────────────────────────────────
  var DEFAULTS = {
    chairman: {
      key: 'chairman',
      name: 'Sh Baldev Krishan Arora',
      designation: 'Chairman & Founder',
      image: 'assets/images/chairman.png',
      shortMessage: 'As the Founder of Golden Earth Convent School, my vision has always been to provide world-class education accessible to the rural communities of Punjab. Since 2017, we have expanded our reach to 56+ villages, touching thousands of lives.',
      fullMessage: 'As the Founder of Golden Earth Convent School, my vision has always been to provide world-class education accessible to the rural communities of Punjab. Since 2017, we have expanded our reach to 56+ villages, touching thousands of lives.<br><br>Our commitment to building a strong educational foundation for every child remains the cornerstone of our institution\'s mission. We believe in nurturing young minds through a blend of traditional values and modern education, preparing them to become responsible citizens and leaders of tomorrow.<br><br>The journey from a single school to an educational network serving over 56 villages has been one of dedication, hard work, and unwavering commitment to quality education.'
    },
    president: {
      key: 'president',
      name: 'Dr Maninder Pal Arora',
      designation: 'President',
      image: 'assets/images/president.png',
      shortMessage: 'At Golden Earth Convent School, we believe that education is the most powerful instrument to shape the future. Our commitment to nurturing every child\'s unique potential through quality education, moral values, and holistic development remains unwavering.',
      fullMessage: 'At Golden Earth Convent School, we believe that education is the most powerful instrument to shape the future. Our commitment to nurturing every child\'s unique potential through quality education, moral values, and holistic development remains unwavering.<br><br>We strive to create an environment where students not only excel academically but also develop into compassionate, responsible citizens ready to face the challenges of the modern world with confidence and integrity.<br><br>Our institution stands firm in its belief that every child deserves access to world-class education, regardless of their background. This vision has guided us since our founding, and continues to drive our mission as we expand our reach across rural Punjab.'
    },
    principal: {
      key: 'principal',
      name: 'Mrs. Gurpreet Kaur',
      designation: 'Principal',
      image: 'assets/images/principalmam.png',
      shortMessage: 'Golden Earth Convent School aims to be a premier global educational institution developing young minds into the leaders of tomorrow. As a 21st century organization, the school envisions an approach of learning that incorporates inquiry, research, analytical thinking and an ethical approach that becomes a lifetime habit.',
      fullMessage: '"Train up a child in the way he should go; even when he is old he will not depart from it."<br><br>Golden Earth Convent School aims to be a premier global educational institution developing young minds into the leaders of tomorrow. As a 21st century organization the school envisions to set an approach of learning that incorporates inquiry, research, analytical thinking and an ethical approach that becomes a lifetime habit which is sustainable and adapts to the current scenario.<br><br>To make the world a better place is what we aim to develop in our students. Our approach therefore is to impart education and create a renewed sense of enlightenment. The magnitude of which is well capable of establishing an individual\'s development to the highest level.'
    }
  };

  // ─── LOAD FROM LOCALSTORAGE (admin overrides) ───────────────
  function loadSaved() {
    try {
      var raw = localStorage.getItem('gecs_leadership_data');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  // ─── MERGE DEFAULTS WITH SAVED DATA ─────────────────────────
  function buildData() {
    var saved = loadSaved();
    var data = {};

    ['chairman', 'president', 'principal'].forEach(function (key) {
      var def = DEFAULTS[key];
      var override = saved && saved[key] ? saved[key] : {};
      data[key] = {
        key: key,
        name: override.name || def.name,
        designation: override.designation || def.designation,
        // Image: if admin uploaded a base64 image, use it; otherwise use local file path
        image: override.image || def.image,
        shortMessage: override.shortMessage || def.shortMessage,
        fullMessage: override.fullMessage || def.fullMessage
      };
    });

    return data;
  }

  // ─── PUBLIC API ──────────────────────────────────────────────

  /**
   * Save leadership data to localStorage.
   * Called by admin.html when saving changes.
   * @param {object} data - full leadership data object
   */
  function saveData(data) {
    try {
      localStorage.setItem('gecs_leadership_data', JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('GECS: Could not save leadership data', e);
      return false;
    }
  }

  /**
   * Update a single leader's data and save.
   * @param {string} key - 'chairman' | 'president' | 'principal'
   * @param {object} fields - fields to update (name, designation, image, shortMessage, fullMessage)
   */
  function updateLeader(key, fields) {
    var saved = loadSaved() || {};
    saved[key] = saved[key] || {};
    Object.keys(fields).forEach(function (f) {
      if (fields[f] !== undefined && fields[f] !== null) {
        saved[key][f] = fields[f];
      }
    });
    return saveData(saved);
  }

  /**
   * Reset a single leader back to defaults.
   * @param {string} key
   */
  function resetLeader(key) {
    var saved = loadSaved() || {};
    delete saved[key];
    return saveData(saved);
  }

  /**
   * Get the current merged data (defaults + admin overrides).
   * @returns {object}
   */
  function getData() {
    return buildData();
  }

  /**
   * Get a fallback placeholder for a missing image.
   * Returns a data URI of a simple navy-gold placeholder SVG.
   */
  function getPlaceholderImage(name) {
    var initials = (name || 'L').split(' ').map(function (w) { return w[0]; }).join('').toUpperCase().slice(0, 2);
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">' +
      '<rect width="400" height="500" fill="#082B66"/>' +
      '<text x="200" y="280" font-family="serif" font-size="120" fill="#C9A84C" text-anchor="middle" dominant-baseline="middle">' + initials + '</text>' +
      '</svg>';
    return 'data:image/svg+xml;base64,' + btoa(svg);
  }

  /**
   * Apply a leadership image to an <img> element safely.
   * Shows placeholder on error.
   */
  function applyImage(imgEl, src, name) {
    if (!imgEl) return;
    if (!src) {
      imgEl.src = getPlaceholderImage(name);
      return;
    }
    imgEl.onerror = function () {
      this.onerror = null;
      this.src = getPlaceholderImage(name);
    };
    imgEl.src = src;
  }

  // ─── EXPOSE GLOBALLY ─────────────────────────────────────────
  window.GECS_LEADERSHIP = {
    getData: getData,
    updateLeader: updateLeader,
    resetLeader: resetLeader,
    saveData: saveData,
    applyImage: applyImage,
    getPlaceholderImage: getPlaceholderImage,
    DEFAULTS: DEFAULTS
  };

})();
