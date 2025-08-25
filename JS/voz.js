(() => {
    if (!('speechSynthesis' in window)) { console.warn('Sem Web Speech API.'); return; }

    // ====== ESTILO ======
    const css = `
    .tts-fab{position:fixed;right:1rem;bottom:6.5rem;z-index:99999;border:1px solid #ddd;background:#fff;border-radius:999px;padding:.55rem .7rem;box-shadow:0 8px 24px rgba(0,0,0,.12);cursor:pointer}
    .tts-fab:focus{outline:2px solid #000;outline-offset:2px}
    .tts-panel{position:fixed;right:1rem;bottom:10.8rem;z-index:99999;min-width:240px;background:#fff;border:1px solid #ddd;border-radius:.75rem;box-shadow:0 12px 28px rgba(0,0,0,.15);padding:.75rem;display:none}
    .tts-row{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;margin-bottom:.5rem}
    .tts-btn{padding:.45rem .55rem;border:1px solid #ddd;border-radius:.5rem;background:#fafafa;cursor:pointer}
    .tts-btn:focus{outline:2px solid #000;outline-offset:2px}
    .tts-status{min-height:1.2em;color:#333}
    @media(max-width:640px){.tts-fab{right:.75rem;bottom:6.5rem}.tts-panel{right:.5rem;left:.5rem}}
    `;
    const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

    // ====== UI ======
    const fab = document.createElement('button');
    fab.className = 'tts-fab'; fab.type = 'button'; fab.title = 'Leitura em voz alta';
    fab.textContent = '🔊';

    const panel = document.createElement('div');
    panel.className = 'tts-panel';
    panel.innerHTML = `
    <div class="tts-row">
        <button type="button" class="tts-btn" data-act="readSelection" aria-label="Ler texto selecionado">Ler seleção</button>
        <button type="button" class="tts-btn" data-act="readPage" aria-label="Ler conteúdo principal">Ler página</button>
    </div>
    <div class="tts-row">
        <button type="button" class="tts-btn" data-act="pause">Pausar</button>
        <button type="button" class="tts-btn" data-act="resume">Retomar</button>
        <button type="button" class="tts-btn" data-act="stop">Parar</button>
    </div>
    <div class="tts-row" style="gap:.6rem">
        <label for="ttsRate">Velocidade</label>
        <input id="ttsRate" type="range" min="0.5" max="1.6" step="0.1" value="1">
    </div>
    <div class="tts-status" id="ttsStatus" role="status" aria-live="polite"></div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    // ====== LÓGICA ======
    const $ = sel => panel.querySelector(sel);
    const status = msg => $('#ttsStatus').textContent = msg || '';

    const state = { rate: 1, voice: null, voices: [] };

    function refreshVoices() {
    state.voices = speechSynthesis.getVoices() || [];
    state.voice = state.voices.find(v=>/pt-BR/i.test(v.lang))
                || state.voices.find(v=>/pt/i.test(v.lang))
                || state.voices[0] || null;
    }
    refreshVoices();
    speechSynthesis.onvoiceschanged = refreshVoices;

    function getMainText() {
    const el = document.querySelector('main, article, [role="main"]') || document.body;
    return el.innerText || el.textContent || '';
    }

    function speak(text) {
    if (!text || !text.trim()) { status('Selecione um texto ou use “Ler página”.'); return; }
    stop();
    const u = new SpeechSynthesisUtterance(text.trim());
    u.rate = state.rate;
    if (state.voice) u.voice = state.voice;
    u.lang = (state.voice && state.voice.lang) || 'pt-BR';
    u.onstart = ()=>status('Lendo…');
    u.onend = ()=>status('Concluído.');
    u.onerror = ()=>status('Erro ao reproduzir. Verifique permissões de áudio.');
    speechSynthesis.speak(u);
    }

    function pause(){ if (speechSynthesis.speaking && !speechSynthesis.paused){ speechSynthesis.pause(); status('Pausado.'); } }
    function resume(){ if (speechSynthesis.paused){ speechSynthesis.resume(); status('Lendo…'); } }
    function stop(){ speechSynthesis.cancel(); }

    panel.addEventListener('click', (e)=>{
    const act = e.target?.dataset?.act;
    if (!act) return;
    if (act==='readSelection'){
        const txt = String(window.getSelection()||'').trim();
        speak(txt || getMainText());
    }
    if (act==='readPage') speak(getMainText());
    if (act==='pause') pause();
    if (act==='resume') resume();
    if (act==='stop') { stop(); status(''); }
    });
    $('#ttsRate').addEventListener('input', e=>{
    state.rate = Number(e.target.value || 1);
    });

    fab.addEventListener('click', ()=>{
    panel.style.display = panel.style.display==='block' ? 'none' : 'block';
    });
    document.addEventListener('click', (e)=>{
    if (!panel.contains(e.target) && e.target!==fab) panel.style.display='none';
    });

    // Atalhos: Ctrl+Alt+L/P/S
    document.addEventListener('keydown', (e)=>{
    if (!(e.ctrlKey && e.altKey)) return;
    const k = e.key.toLowerCase();
    if (k==='l'){ e.preventDefault(); const t=String(window.getSelection()||'').trim(); speak(t || getMainText()); }
    if (k==='p'){ e.preventDefault(); speechSynthesis.paused ? resume() : pause(); }
    if (k==='s'){ e.preventDefault(); stop(); status(''); }
    });
})();