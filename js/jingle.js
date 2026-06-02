/* ============================================================
   "Hızlı O!" – Konsey Jingle Sonic Boom
   Web Audio API ile sentezlenen, kulağa kazınan jingle melodisi.
   - Başta düşük frekanslı bir "boom" vuruşu (sonic boom)
   - Punchy synth lead + bas + kick ile akılda kalıcı nakarat
   ============================================================ */

(function () {
  'use strict';

  const NOTE = {
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, REST: 0,
  };

  const BEAT = 0.30; // saniye / vuruş

  /* Jingle satırları – [nota, vuruş] dizileri. REST = sus. */
  const SECTIONS = [
    {
      // Bas-te-le-fo-na gel-sin o  (yükselen)
      label: 'Bas telefona, gelsin o!',
      notes: [['G4', 0.75], ['G4', 0.75], ['A4', 0.75], ['A4', 0.75],
              ['B4', 0.75], ['C5', 0.75], ['D5', 0.75], ['C5', 1.4], ['REST', 0.3]],
    },
    {
      // "Ooo Hızlı O!" – yüksek inişli viral kanca
      label: 'Ooo — Hızlı O!',
      notes: [['G5', 1.3], ['G5', 0.75], ['E5', 0.75], ['C5', 1.8], ['REST', 0.4]],
    },
    {
      // Ku-rye o, kar-go o  (sıçrayan)
      label: 'Kurye o, kargo o,',
      notes: [['C5', 0.75], ['C5', 0.75], ['G4', 1.0], ['REST', 0.2],
              ['A4', 0.75], ['A4', 0.75], ['G4', 1.2], ['REST', 0.3]],
    },
    {
      // Ge-ce gün-düz yol-da o  (yükselip çözülen)
      label: 'Gece gündüz yolda o!',
      notes: [['G4', 0.75], ['A4', 0.75], ['B4', 0.75], ['C5', 0.75],
              ['D5', 0.75], ['E5', 0.9], ['C5', 2.0]],
    },
  ];

  let ctx = null;

  function ensureCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /* Punchy synth notası: triangle (sıcak) + hafif detune square (parlaklık) */
  function playNote(freq, start, dur, master) {
    if (!freq) return;
    const t = start;
    const gain = ctx.createGain();
    gain.connect(master);
    const peak = 0.22;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(peak, t + 0.012);     // hızlı atak
    gain.gain.exponentialRampToValueAtTime(peak * 0.6, t + 0.08); // decay
    gain.gain.setValueAtTime(peak * 0.6, t + dur * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);      // release

    const o1 = ctx.createOscillator();
    o1.type = 'triangle';
    o1.frequency.value = freq;
    const o2 = ctx.createOscillator();
    o2.type = 'square';
    o2.frequency.value = freq;
    o2.detune.value = 6;
    const o2g = ctx.createGain();
    o2g.gain.value = 0.18;
    o2.connect(o2g).connect(gain);
    o1.connect(gain);

    o1.start(t); o2.start(t);
    o1.stop(t + dur + 0.02); o2.stop(t + dur + 0.02);
  }

  /* Bas notası – melodinin altını doldurur */
  function playBass(freq, start, dur, master) {
    if (!freq) return;
    const gain = ctx.createGain();
    gain.connect(master);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = freq / 2; // bir oktav alt
    o.connect(gain);
    o.start(start); o.stop(start + dur + 0.02);
  }

  /* Kick / "boom" – düşük sine sweep */
  function playBoom(start, master, big) {
    const gain = ctx.createGain();
    gain.connect(master);
    const peak = big ? 0.9 : 0.5;
    gain.gain.setValueAtTime(peak, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + (big ? 0.7 : 0.28));
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(big ? 180 : 150, start);
    o.frequency.exponentialRampToValueAtTime(big ? 38 : 55, start + (big ? 0.55 : 0.25));
    o.connect(gain);
    o.start(start);
    o.stop(start + (big ? 0.75 : 0.3));
  }

  function setNowPlaying(idx) {
    document.querySelectorAll('.jingle-line').forEach((el, i) => {
      el.classList.toggle('active', i === idx);
    });
  }

  function play(btn) {
    ensureCtx();
    const master = ctx.createGain();
    master.gain.value = 0.9;
    const out = ctx.createGain();
    out.gain.value = 1.0;
    master.connect(out).connect(ctx.destination);

    let t = ctx.currentTime + 0.08;

    /* === SONIC BOOM girişi === */
    playBoom(t, master, true);
    t += 0.85;

    const timers = [];
    SECTIONS.forEach((sec, i) => {
      const lineStart = t;
      timers.push(setTimeout(() => setNowPlaying(i),
        (lineStart - ctx.currentTime) * 1000));
      let beatPos = 0;
      sec.notes.forEach(([name, beats]) => {
        const dur = beats * BEAT;
        const freq = NOTE[name];
        playNote(freq, t, dur, master);
        playBass(freq, t, dur, master);
        // her tam vuruşta hafif kick → ritim hissi
        if (freq && Math.floor(beatPos) !== Math.floor(beatPos + beats)) {
          playBoom(t, master, false);
        }
        beatPos += beats;
        t += dur;
      });
      t += 0.15; // satır arası nefes
    });

    const total = (t - ctx.currentTime) * 1000;
    timers.push(setTimeout(() => {
      setNowPlaying(-1);
      btn.disabled = false;
      btn.textContent = '▶  Tekrar Çal';
    }, total + 100));

    btn.disabled = true;
    btn.textContent = '♪  Çalıyor…';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('play-jingle');
    if (btn) btn.addEventListener('click', () => play(btn));
  });
})();
