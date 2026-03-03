function createAudioContext() {
  return new (window.AudioContext || window.webkitAudioContext)();
}

// Som satisfatório a cada ponto — "coin" estilo arcade
export function playPointSound() {
  const ctx = createAudioContext();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "square";

  // Frequência sobe rápido, dando sensação de "ding"
  osc.frequency.setValueAtTime(988, ctx.currentTime); // Si
  osc.frequency.setValueAtTime(1319, ctx.currentTime + 0.08); // Mi alto

  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.setValueAtTime(0.25, ctx.currentTime + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.25);
}

// Som de 1-UP do Mario (sequência de 6 notas exatas)
export function play1UpSound() {
  const ctx = createAudioContext();

  // Notas do 1-UP do Mario em Hz (E5, G5, E6, C6, D6, G6)
  const notes = [
    { freq: 659, start: 0.0, duration: 0.1 },
    { freq: 784, start: 0.1, duration: 0.1 },
    { freq: 1319, start: 0.2, duration: 0.1 },
    { freq: 1047, start: 0.3, duration: 0.1 },
    { freq: 1175, start: 0.4, duration: 0.1 },
    { freq: 1568, start: 0.5, duration: 0.2 },
  ];

  notes.forEach(({ freq, start, duration }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "square";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

    gain.gain.setValueAtTime(0.0, ctx.currentTime + start);
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + start + 0.01);
    gain.gain.setValueAtTime(0.25, ctx.currentTime + start + duration - 0.02);
    gain.gain.linearRampToValueAtTime(0.0, ctx.currentTime + start + duration);

    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + duration);
  });
}
