// VERSÃO DEFINITIVA COM BLINDAGEM CIRÚRGICA PARA O LABEL

(() => {
  if (!("speechSynthesis" in window)) {
    console.warn("Sem Web Speech API.");
    return;
  }

  // ====== ESTILO FINAL COM A CORREÇÃO PARA O LABEL ======
  const css = `
      .tts-fab {
        border: 1px solid #b3aeae;
        background: #fff;
        border-radius: 999px;
        padding: .55rem .7rem;
        box-shadow: 0 8px 24px rgba(0,0,0,.12);
        cursor: pointer;
        font-size: 1.1em;
        transition: transform 0.2s ease-in-out;
      }
      .tts-fab:hover {
        transform: translateY(-5px);
      }
      .tts-panel {
        position: absolute;
        top: 0;
        right: calc(100% + 15px);
        z-index: 99999;
        min-width: 180px;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: .75rem;
        box-shadow: 0 12px 28px rgba(0,0,0,.15);
        padding: .5rem;
        display: none;
        font-family: sans-serif;
      }
      .tts-row {
        display: flex;
        flex-wrap: wrap;
        gap: .5rem;
        align-items: center;
        margin-bottom: .5rem;
      }
      .tts-btn {
        padding: .45rem .55rem;
        border: 1px solid #ccc;
        border-radius: .5rem;
        background: #f7f7f7;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        font-size: .9em;
        flex-grow: 1;
        color: #000;
        text-align: center;
      }
      .tts-status {
        min-height: 1.2em;
        color: #333;
        font-size: .8em;
        width: 100%;
        text-align: center;
        margin-top: .2rem;
      }
      #ttsRate {
        -webkit-appearance: auto;
        appearance: auto;
        width: 100%;
      }

      /* ======================================================= */
      /* ===== BLINDAGEM FINAL PARA O LABEL DE VELOCIDADE ====== */
      /* ======================================================= */
      .tts-panel label[for="ttsRate"] {
        all: unset !important; /* Reseta TUDO que vem do style.css */

        /* Agora, reconstruímos o estilo que queremos para ele */
        display: block !important;
        width: 100% !important;
        text-align: center !important;
        font-size: .9em !important;
        margin-bottom: 5px !important;
        color: #333 !important;
      }
    `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // ====== UI SEM O STYLE EM LINHA, POIS O CSS ACIMA RESOLVE TUDO ======
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

  // ====== LÓGICA DA VELOCIDADE AO VIVO (JÁ ESTÁ CORRETA) ======
  const $ = (sel) => panel.querySelector(sel);
  const status = (msg) => ($("#ttsStatus").textContent = msg || "");
  const state = { rate: 1, voice: null, voices: [], currentText: "" };
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
    state.currentText = text;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.trim());
    u.rate = state.rate;
    if (state.voice) u.voice = state.voice;
    u.lang = (state.voice && state.voice.lang) || "pt-BR";
    u.onstart = () => status("Lendo…");
    u.onend = () => {
      status("Concluído.");
      state.currentText = "";
    };
    u.onerror = () => {
      status("Erro ao reproduzir.");
      state.currentText = "";
    };
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
    state.currentText = "";
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
    if (speechSynthesis.speaking && state.currentText) {
      speak(state.currentText);
    }
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
