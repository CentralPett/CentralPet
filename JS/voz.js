// VERSÃO FINAL E BLINDADA CONTRA ESTILOS EXTERNOS

(() => {
  if (!("speechSynthesis" in window)) {
    console.warn("Sem Web Speech API.");
    return;
  }

  // ====== ESTILO FINAL COM REGRAS DE BLINDAGEM ======
  const css = `
      .tts-fab {
        border: 1px solid #b3aeae;
        background: #fff;
        border-radius: 999px;
        padding: .55rem .7rem;
        box-shadow: 0 8px 24px rgba(0,0,0,.12);
        cursor: pointer;
        font-size: 1.1em;
        position: relative;
      }
      .tts-fab:focus {
        outline: 2px solid #000;
        outline-offset: 2px;
      }
      .tts-panel {
        position: absolute;
        bottom: calc(100% + 10px);
        right: 0;
        z-index: 99999;
        min-width: 180px;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: .75rem;
        box-shadow: 0 12px 28px rgba(0,0,0,.15);
        padding: .4rem;
        display: none;
      }
      .tts-row {
        display: flex;
        flex-wrap: wrap;
        gap: .3rem;
        align-items: center;
        margin-bottom: .4rem;
      }
      .tts-row:last-child {
        margin-bottom: 0;
      }
      .tts-btn {
        padding: .2rem .4rem;
        border: 1px solid #ddd;
        border-radius: .5rem;
        background: #fafafa;
        cursor: pointer;
        font-size: 1em;
        box-shadow: 0px 0px px #000;
        flex-grow: 1;
      }
      .tts-btn:focus {
        outline: 2px solid #000;
        outline-offset: 2px;
      }
      .tts-status {
        min-height: 1.2em;
        color: #333;
        font-size: .8em;
        width: 100%;
        text-align: center;
      }
      #ttsRate {
        max-width: 90px;
        margin: 0 auto;
      }
      .tts-row label {
        font-size: .8em;
        width: 100%;
        text-align: center;
        margin-bottom: -5px;
      }

      /* ================================================ */
      /* ===== REGRAS DE BLINDAGEM (A CORREÇÃO) ===== */
      /* ================================================ */

      /* Anula o estilo geral de 'label' que estava vazando */
      .tts-panel label {
        all: unset; /* Reseta TODOS os estilos herdados */
        display: block; /* Devolve o display necessário */
        font-size: .8em;
        width: 100%;
        text-align: center;
        margin-bottom: -5px;
        /* Adicione aqui qualquer outra propriedade que o label precise */
      }
      
      /* Garante que os divs internos (tts-row) não peguem estilos de card */
      .tts-panel .tts-row {
        all: unset; /* Reseta TODOS os estilos herdados */
        display: flex; /* Devolve o display flex necessário */
        flex-wrap: wrap;
        gap: .3rem;
        align-items: center;
        margin-bottom: .4rem;
      }
    `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // O restante do arquivo JavaScript continua exatamente o mesmo...
  const fab = document.createElement("button");
  fab.className = "tts-fab";
  fab.type = "button";
  fab.title = "Leitura em voz alta";
  fab.textContent = "🔊";

  const panel = document.createElement("div");
  panel.className = "tts-panel";
  panel.innerHTML = `
      <div class="tts-row">
          <button type="button" class="tts-btn" data-act="readSelection">Ler seleção</button>
          <button type="button" class="tts-btn" data-act="readPage">Ler página</button>
      </div>
      <div class="tts-row">
          <button type="button" class="tts-btn" data-act="pause">Pausar</button>
          <button type="button" class="tts-btn" data-act="resume">Retomar</button>
          <button type="button" class="tts-btn" data-act="stop">Parar</button>
      </div>
      <div class="tts-row">
          <label for="ttsRate">Velocidade</label>
          <input id="ttsRate" type="range" min="0.5" max="1.6" step="0.1" value="1">
      </div>
      <div class="tts-status" id="ttsStatus" role="status" aria-live="polite"></div>
      `;

  const containerAcessibilidade = document.querySelector(
    ".acessibilidade-container"
  );
  if (containerAcessibilidade) {
    containerAcessibilidade.appendChild(fab);
    containerAcessibilidade.appendChild(panel);
  } else {
    document.body.appendChild(fab);
    document.body.appendChild(panel);
  }

  const $ = (sel) => panel.querySelector(sel);
  const status = (msg) => ($("#ttsStatus").textContent = msg || "");
  const state = { rate: 1, voice: null, voices: [] };
  function refreshVoices() {
    state.voices = speechSynthesis.getVoices() || [];
    state.voice =
      state.voices.find((v) => /pt-BR/i.test(v.lang)) ||
      state.voices.find((v) => /pt/i.test(v.lang)) ||
      state.voices[0] ||
      null;
  }
  refreshVoices();
  speechSynthesis.onvoiceschanged = refreshVoices;
  function getMainText() {
    const el =
      document.querySelector('main, article, [role="main"]') || document.body;
    return el.innerText || el.textContent || "";
  }
  function speak(text) {
    if (!text || !text.trim()) {
      status("Selecione um texto ou use “Ler página”.");
      return;
    }
    stop();
    const u = new SpeechSynthesisUtterance(text.trim());
    u.rate = state.rate;
    if (state.voice) u.voice = state.voice;
    u.lang = (state.voice && state.voice.lang) || "pt-BR";
    u.onstart = () => status("Lendo…");
    u.onend = () => status("Concluído.");
    u.onerror = () =>
      status("Erro ao reproduzir. Verifique permissões de áudio.");
    speechSynthesis.speak(u);
  }
  function pause() {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      status("Pausado.");
    }
  }
  function resume() {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      status("Lendo…");
    }
  }
  function stop() {
    speechSynthesis.cancel();
  }
  panel.addEventListener("click", (e) => {
    const act = e.target?.dataset?.act;
    if (!act) return;
    if (act === "readSelection") {
      const txt = String(window.getSelection() || "").trim();
      speak(txt || getMainText());
    }
    if (act === "readPage") speak(getMainText());
    if (act === "pause") pause();
    if (act === "resume") resume();
    if (act === "stop") {
      stop();
      status("");
    }
  });
  $("#ttsRate").addEventListener("input", (e) => {
    state.rate = Number(e.target.value || 1);
  });
  fab.addEventListener("click", () => {
    panel.style.display = panel.style.display === "block" ? "none" : "block";
  });
  document.addEventListener("click", (e) => {
    if (!panel.contains(e.target) && e.target !== fab)
      panel.style.display = "none";
  });
  document.addEventListener("keydown", (e) => {
    if (!(e.ctrlKey && e.altKey)) return;
    const k = e.key.toLowerCase();
    if (k === "l") {
      e.preventDefault();
      const t = String(window.getSelection() || "").trim();
      speak(t || getMainText());
    }
    if (k === "p") {
      e.preventDefault();
      speechSynthesis.paused ? resume() : pause();
    }
    if (k === "s") {
      e.preventDefault();
      stop();
      status("");
    }
  });
})();
