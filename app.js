/* VERTICAL RIO · Operations Hub — voos/PAX/avisos no servidor (/api), demais módulos no navegador */
(function () {
  'use strict';

  const KEY = 'vro-operacoes-v1';
  const STATUS = ['CONFIRMADO', 'EMBARCANDO', 'VOANDO', 'FINALIZADO', 'ATRASADO', 'CANCELADO', 'A CONFIRMAR'];
  const FITAS = { BRANCA: '#ffffff', PRETA: '#111111', AMARELA: '#facc15', VERDE: '#15803d', AZUL: '#2563eb' };
  const PRODUTOS = { DOORS_OFF_30: 'Doors Off 30 min', DOORS_OFF_45: 'Doors Off 45 min', DOORS_ON_30: 'Doors On 30 min' };
  const PROD_CURTO = { DOORS_OFF_30: 'DOORS OFF 30', DOORS_OFF_45: 'DOORS OFF 45', DOORS_ON_30: 'DOORS ON 30' };
  const PROD_MIN = { DOORS_OFF_30: 30, DOORS_OFF_45: 45, DOORS_ON_30: 30 };
  const TIPOS_LOG = { cadastro: 'Cadastro', alteracao: 'Alteração', status: 'Status', horario: 'Horário', pax: 'PAX', pulseira: 'Pulseira', exclusao: 'Exclusão', aviso: 'Aviso', config: 'Configuração', registro: 'Registro de voos', acesso: 'Acesso (login)', usuario: 'Usuários e permissões', venda: 'Câmeras' };
  const SETORES = { gestao: 'Gestão', coordenacao: 'Coordenação do Terminal', operacao: 'Operação', vendas: 'Vendas' };
  const SETOR_ORDER = ['gestao', 'coordenacao', 'operacao', 'vendas'];
  const ESC = { T: 'Trabalho', F: 'Folga', V: 'Férias', M: 'Dispensa médica' };
  const PRES = { T: 'Presente', F: 'Folga', V: 'Férias', M: 'Disp. médica', N: 'Não informado' };
  const MODELOS = { GoPro: 'GoPro', '360': 'Câmera 360°' };
  const DOW = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const MES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  // ---------- Ícones (traços no estilo lucide) ----------
  const ICONS = {
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    heli: '<path d="M3 4h18M12 4v4"/><path d="M5 12a4 4 0 0 1 4-4h6a4 4 0 0 1 0 8H9a4 4 0 0 1-4-4Z"/><path d="M5 12H2M9 16v4M15 16v4M7 20h10"/><path d="M15 8v4h4"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    coins: '<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18M7 6h1v4M16.71 13.88l.7.71-2.82 2.82"/>',
    tv: '<rect x="2" y="7" width="20" height="15" rx="2"/><path d="m17 2-5 5-5-5"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
    chart: '<path d="M12 20V10M18 20V4M6 20v-4"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    checkc: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    pencil: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
    trash: '<path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    copy: '<rect x="8" y="8" width="14" height="14" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    copyplus: '<path d="M15 12v6M12 15h6"/><rect x="8" y="8" width="14" height="14" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    plus: '<path d="M5 12h14M12 5v14"/>',
    minus: '<path d="M5 12h14"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/>'
  };
  const SETOR_ICON = { gestao: 'cal', coordenacao: 'heli', operacao: 'plane', vendas: 'chart' };
  const icon = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24">${ICONS[n]}</svg>`;

  // ---------- Datas ----------
  const pad = n => String(n).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const today = () => iso(new Date());
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
  const br = s => s.split('-').reverse().join('/');
  const brShort = s => br(s).slice(0, 5);
  const dowName = s => DOW[parse(s).getDay()];
  const longDate = s => `${dowName(s)} · ${br(s)}`;
  const monthKey = s => s.slice(0, 7);
  const monthLabel = k => `${MES[+k.slice(5) - 1]} ${k.slice(0, 4)}`;
  const addMonths = (k, n) => { const d = new Date(+k.slice(0, 4), +k.slice(5) - 1 + n, 1); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`; };
  const daysInMonth = k => new Date(+k.slice(0, 4), +k.slice(5), 0).getDate();

  // Ciclo vai do dia 26 ao dia 25 do mês seguinte
  function cycleOf(s) {
    const d = parse(s);
    const start = d.getDate() >= 26 ? new Date(d.getFullYear(), d.getMonth(), 26) : new Date(d.getFullYear(), d.getMonth() - 1, 26);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 25);
    return { start: iso(start), end: iso(end) };
  }
  const shiftCycle = (c, n) => cycleOf(iso(new Date(parse(c.start).getFullYear(), parse(c.start).getMonth() + n, 26)));
  const cycleLabel = c => `${brShort(c.start)} – ${br(c.end)}`;
  function cycleDays(c) { const out = []; for (let s = c.start; s <= c.end; s = addDays(s, 1)) out.push(s); return out; }

  const hhmm = min => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
  const money = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Math.random().toString(36).slice(2, 10);

  // ---------- Servidor de operação (voos, PAX, avisos, log) ----------
  const API = 'https://vr-hub-teste.netlify.app/api';
  const TOKEN_KEY = 'vro-op-token';
  const OPS = { date: null, rev: -1, voos: [], config: { tvVoos: 6 }, avisos: [], operador: null, erro: null, carregando: false, registros: null, vendas: null };
  // voos dos últimos 6 ciclos: as horas de cada dia saem dos voos FINALIZADOS (todos os usuários veem o mesmo)
  const VOOS_CICLOS = { de: null, rev: -2, voos: [], carregando: false };
  const token = () => { try { return localStorage.getItem(TOKEN_KEY) || ''; } catch (e) { return ''; } };
  // permissões do perfil (vêm do servidor, que confere cada ação): ver_pax, registros, dados (escala/comissões),
  // historico, voo, pulseira, pax, aviso, registro, config, usuarios
  const pode = p => !!(OPS.operador && (OPS.operador.permissoes || []).includes(p));
  // sessão encerrada (expirou, senha trocada, usuário desativado): volta para a tela de login
  function travar() { try { localStorage.removeItem(TOKEN_KEY); } catch (e) { /* */ } location.reload(); }
  const sairConta = travar;
  async function api(path, opts = {}) {
    const h = { 'Content-Type': 'application/json' }; const t = token(); if (t) h.Authorization = `Bearer ${t}`;
    const r = await fetch(API + path, { ...opts, headers: { ...h, ...(opts.headers || {}) } });
    const d = await r.json().catch(() => ({ erro: 'Resposta inválida do servidor' }));
    if (r.status === 401 && t && path !== '/login') { try { localStorage.removeItem(TOKEN_KEY); } catch (e) { /* */ } OPS.operador = null; }
    if (!r.ok) throw Object.assign(new Error(d.erro || `Erro ${r.status}`), { status: r.status });
    return d;
  }
  async function loadOps(date, force) {
    if (OPS.carregando) return false;
    const same = OPS.date === date && !force;
    OPS.carregando = true;
    try {
      const d = await api(`/estado?de=${date}${same ? `&rev=${OPS.rev}` : ''}`);
      OPS.erro = null;
      if (d.igual) return false;
      if (!d.operador && !window.SEED_DEV) { travar(); return false; }
      Object.assign(OPS, { date, rev: d.rev, voos: d.voos, config: d.config, avisos: d.avisos, operador: d.operador, hoje: d.hoje });
      // perfil mudou: quem perdeu o acesso à escala/comissões tem os dados apagados deste aparelho; quem ganhou, recebe
      if (DB && !window.SEED_DEV && (!!DB.restrito === pode('dados'))) { try { localStorage.removeItem(KEY); } catch (e) { /* */ } location.reload(); return false; }
      if (d.registros !== undefined) OPS.registros = d.registros;
      if (d.vendas !== undefined) OPS.vendas = d.vendas;
      importarRegistros(); importarVendas();
      return true;
    } catch (e) { OPS.erro = e.message; if (!same) Object.assign(OPS, { date, voos: [], rev: -1 }); return true; } finally { OPS.carregando = false; }
  }
  async function loadCiclos(force) {
    const de = shiftCycle(cycleOf(today()), -5).start;
    if (VOOS_CICLOS.carregando || (!force && VOOS_CICLOS.de === de && VOOS_CICLOS.rev === OPS.rev)) return false;
    VOOS_CICLOS.carregando = true;
    try {
      const d = await api(`/estado?de=${de}&ate=${today()}`);
      Object.assign(VOOS_CICLOS, { de, rev: d.rev, voos: d.voos });
      if (d.registros !== undefined) OPS.registros = d.registros;
      if (d.vendas !== undefined) OPS.vendas = d.vendas;
      return true;
    } catch (e) { return false; } finally { VOOS_CICLOS.carregando = false; }
  }
  // uma vez só: se o servidor ainda não tem os registros da tela Voos, o primeiro administrador leva os deste navegador
  let importando = false;
  function importarRegistros() {
    if (importando || OPS.registros !== null || !OPS.operador || !OPS.operador.admin || !DB || !DB.registros || !DB.registros.length) return;
    importando = true;
    api('/acao', { method: 'POST', body: JSON.stringify({ tipo: 'registros_importar', registros: DB.registros }) })
      .then(r => { if (r.resultado && r.resultado.importados) toast(`${r.resultado.importados} registros de voos enviados para o servidor`); return loadCiclos(true); })
      .then(() => render()).catch(() => { importando = false; });
  }
  // vendas de câmeras: antes ficavam só no navegador de cada um. Cada aparelho com acesso leva as suas para o
  // servidor uma vez (o servidor junta pelo id, sem duplicar); depois disso todos os logins veem as mesmas vendas.
  const VENDAS_ENVIADAS = 'vro-vendas-enviadas';
  let importandoVendas = false;
  function importarVendas() {
    if (importandoVendas || window.SEED_DEV || !pode('dados') || !DB || DB.restrito || !(DB.vendas || []).length) return;
    const marca = `${OPS.operador.id}:${DB.version || 0}`;
    try { if (localStorage.getItem(VENDAS_ENVIADAS) === marca) return; } catch (e) { return; }
    importandoVendas = true;
    api('/acao', { method: 'POST', body: JSON.stringify({ tipo: 'vendas_importar', vendas: DB.vendas }) })
      .then(r => { try { localStorage.setItem(VENDAS_ENVIADAS, marca); } catch (e) { /* */ } if (r.resultado && r.resultado.importados) toast(`${r.resultado.importados} vendas de câmeras enviadas para o servidor`); return loadOps(OPS.date || today(), true); })
      .then(() => render()).catch(() => { importandoVendas = false; });
  }
  async function acaoOps(body, okMsg) {
    if (!OPS.operador) { travar(); return null; }
    try { const r = await api('/acao', { method: 'POST', body: JSON.stringify(body) }); if (okMsg) toast(okMsg); await loadOps(OPS.date, true); await loadCiclos(true); render(); return r; }
    catch (e) { if (e.status === 401) travar(); else toast(e.message); return null; }
  }
  function loginModal(then) {
    modal('Entrar como operador', 'Suas alterações ficam registradas no histórico com o seu nome.', `<form id="opLogin">
        <div class="field"><label class="f">Nome</label><input class="input" name="nome" autocomplete="username" required></div>
        <div class="field"><label class="f">PIN ou senha</label><input class="input" name="pin" type="password" autocomplete="current-password" required></div>
        <p class="small" id="opErr" style="color:var(--red);min-height:16px;margin:0"></p>
        <div class="actions"><button type="button" class="btn" data-x>Cancelar</button><button class="btn primary">Entrar</button></div></form>`,
    (m, close) => {
      const f = m.querySelector('#opLogin'); f.nome.focus();
      f.onsubmit = async e => {
        e.preventDefault();
        try {
          const d = await api('/login', { method: 'POST', body: JSON.stringify({ nome: f.nome.value, pin: f.pin.value }) });
          try { localStorage.setItem(TOKEN_KEY, d.token); } catch (err) { /* */ }
          OPS.operador = d.operador; close(); toast(`Olá, ${d.operador.nome}`);
          await loadOps(OPS.date || today(), true); render(); then && then();
        } catch (err) { m.querySelector('#opErr').textContent = err.message; }
      };
    });
  }
  function logoutOp() { sairConta(); }
  const vooMin = v => PROD_MIN[v.produto] || 30;

  // ---------- Estado ----------
  function fromSeed() {
    const S = JSON.parse(JSON.stringify(window.SEED));
    const ops = S.team.filter(t => t.setor === 'operacao').map(t => t.id);
    const escalaOp = {};
    Object.entries(S.escalaOpRaw).forEach(([k, str]) => {
      str.split(' ').forEach((tok, i) => {
        const day = `${k}-${pad(i + 1)}`;
        escalaOp[day] = {};
        [...tok].forEach((c, j) => { if (c !== '-') escalaOp[day][ops[j]] = { s: c, obs: '' }; });
      });
    });
    const escalaDiaria = {};
    const dIds = ['thomas', 'veloso', 'lais', 'lucas'];
    S.escalaDiariaRaw.forEach(([day, ...vals]) => {
      escalaDiaria[day] = {};
      vals.forEach((v, j) => { if (v) escalaDiaria[day][dIds[j]] = { s: v, obs: '' }; });
    });
    return { version: S.version, team: S.team, programacao: S.programacao, registros: S.registros, escalaOp, escalaDiaria, vendas: S.vendas };
  }
  // perfis sem acesso à escala/comissões (Operacional, Balcão) usam dados locais vazios: nada sensível fica no aparelho
  const DB_VAZIO = () => ({ version: 0, restrito: true, team: [], programacao: [], registros: [], escalaOp: {}, escalaDiaria: {}, vendas: [] });
  function load() {
    try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch (e) { /* sem storage */ }
    return window.SEED ? fromSeed() : DB_VAZIO();
  }
  let DB = null;
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) { toast('Não foi possível salvar neste navegador'); }
    render();
  }
  window.addEventListener('storage', e => { if (DB && e.key === KEY) { DB = load(); render(); } });

  const person = id => DB.team.find(t => t.id === id);
  const pname = id => person(id)?.name || '—';
  const bySetor = s => DB.team.filter(t => t.setor === s);

  // ---------- Cálculos ----------
  const regVoos = r => r.v30 + r.v45;
  const regMin = r => r.v30 * 30 + r.v45 * 45;
  // registros manuais: do servidor (iguais para todos); enquanto o servidor não tem, os deste navegador
  const regsManuais = () => (Array.isArray(OPS.registros) ? OPS.registros : DB.registros);
  const regManual = s => regsManuais().find(r => r.date === s);
  // dia AUTOMÁTICO: cada voo FINALIZADO soma o tempo do produto (Doors Off 30 = 30 min, Doors Off 45 = 45, Doors On 30 = 30)
  function regAuto(s) {
    const vs = VOOS_CICLOS.voos.filter(v => v.data === s && (v.status === 'FINALIZADO' || v.status === 'CANCELADO'));
    if (!vs.length) return null;
    const r = { date: s, v30: 0, v45: 0, priv: 0, doorsOn: 0, canc: 0, obs: '', auto: true };
    vs.forEach(v => {
      if (v.status === 'CANCELADO') { r.canc++; return; }
      if (vooMin(v) === 45) r.v45++; else r.v30++;
      if (v.tipo === 'PRIVADO') r.priv++;
      if (v.produto === 'DOORS_ON_30') r.doorsOn++;
    });
    return r;
  }
  // o dia vale pelos voos da Programação; o registro manual fica para dias sem voos no sistema (histórico antigo)
  const regOf = s => regAuto(s) || regManual(s);
  function regsEntre(a, b) {
    const out = []; for (let s = a; s <= b; s = addDays(s, 1)) { const r = regOf(s); if (r) out.push(r); }
    return out;
  }
  function dayFlights(s) { const r = regOf(s); return r ? { voos: regVoos(r), min: regMin(r) } : { voos: 0, min: 0 }; }
  function cycleTotals(c) {
    const regs = regsEntre(c.start, c.end);
    const t = { voos: 0, min: 0, dias: regs.length, v30: 0, v45: 0, priv: 0, doorsOn: 0, canc: 0 };
    regs.forEach(r => { t.voos += regVoos(r); t.min += regMin(r); t.v30 += r.v30; t.v45 += r.v45; t.priv += r.priv; t.doorsOn += r.doorsOn; t.canc += r.canc; });
    return t;
  }
  function opStatus(id, s) { return DB.escalaOp[s]?.[id]; }
  function dailyStatus(id, s) { return DB.escalaDiaria[s]?.[id]; }
  function statusOn(p, s) { return (p.setor === 'operacao' ? opStatus(p.id, s) : dailyStatus(p.id, s))?.s || 'N'; }

  // vendas de câmeras por CICLO (26 a 25), o mesmo período da tela Voos
  // do servidor (iguais para todos os logins); enquanto o servidor não tem, as deste navegador
  const vendas = () => (Array.isArray(OPS.vendas) ? OPS.vendas : DB.vendas);
  function salesOf(c) { return vendas().filter(v => v.date >= c.start && v.date <= c.end); }
  function sellerRank(c) {
    const sales = salesOf(c);
    return DB.team.map(t => {
      const mine = sales.filter(v => v.vendedor === t.id);
      const valor = mine.reduce((a, v) => a + v.valor, 0);
      return { id: t.id, name: t.name, qtd: mine.reduce((a, v) => a + v.qtd, 0), valor, com: valor * 0.1 };
    }).sort((a, b) => b.valor - a.valor || b.qtd - a.qtd);
  }

  // ---------- UI helpers ----------
  function toast(msg) {
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), 2200);
  }
  function modal(title, desc, body, onMount) {
    const ov = document.createElement('div'); ov.className = 'overlay';
    ov.innerHTML = `<div class="modal" role="dialog" aria-modal="true"><button class="icon-btn ghost close" data-x aria-label="Fechar">${icon('x')}</button><h3>${title}</h3>${desc ? `<p class="desc">${desc}</p>` : ''}<div class="mbody">${body}</div></div>`;
    const close = () => { ov.remove(); document.removeEventListener('keydown', onKey); };
    const onKey = e => { if (e.key === 'Escape') close(); };
    ov.addEventListener('click', e => { if (e.target === ov || e.target.closest('[data-x]')) close(); });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(ov);
    onMount && onMount(ov.querySelector('.modal'), close);
    return close;
  }
  function badge(st) { return `<span class="badge st-${st.replace(' ', '-')}">${st === 'FINALIZADO' ? icon('checkc') : ''}${st}</span>`; }
  function bars(values, labels, opts = {}) {
    const max = Math.max(1, ...values.map(v => v.v));
    return `<div class="bars ${opts.cls || ''}">${values.map(v => `<div class="b ${v.v ? '' : 'zero'} ${v.cur ? 'cur' : ''}" style="height:${(v.v / max) * 100}%" data-tip="${esc(v.tip)}"></div>`).join('')}</div>
      <div class="axis">${labels.map(l => `<span>${l}</span>`).join('')}</div>`;
  }
  function cycleAxis(days) { return days.map((d, i) => (i % 3 === 0 ? d.slice(8) : '')); }

  // ---------- Header ----------
  // sem barra de abas: o início é o hub do gabrielcruz-teste no Netlify (logo e "← Início" voltam para lá)
  const HUB = './';   // tudo no mesmo domínio (vr-hub): o hub fica na raiz
  function header() {
    return `<header class="top"><div class="wrap wide">
        <a href="${HUB}" title="Menu principal"><img class="logo" src="brand/vertical-rio-logo-black.png" alt="VERTICAL.RIO"></a>
        <span class="brand-sep"></span><span class="brand-sub">Operations Hub</span>
        <div class="clock">${clockHTML()}
          <button class="user-btn" id="userBtn" aria-label="Menu">${icon('user')}</button>
        </div></div><div class="top-m">${clockHTML()}</div></header>`;
  }
  function clockHTML() {
    const n = new Date();
    return `<div class="date"><div>${DOW[n.getDay()]}</div><div>${br(iso(n))}</div></div><span class="sep"></span><div class="time" data-clock>${pad(n.getHours())}:${pad(n.getMinutes())}</div>`;
  }
  // aparência (3.1): automático (segue o aparelho), claro ou escuro; aplicada pelo index.html (window.vroTema)
  const temaAtual = () => { try { return localStorage.getItem('vro-tema') || 'auto'; } catch (e) { return 'auto'; } };
  function bindUserMenu() {
    const btn = document.getElementById('userBtn'); if (!btn) return;
    btn.onclick = e => {
      e.stopPropagation();
      const old = btn.querySelector('.menu'); if (old) { old.remove(); return; }
      const m = document.createElement('div'); m.className = 'menu';
      const dados = pode('dados') || window.SEED_DEV;
      m.innerHTML = `${OPS.operador ? `<div class="hint" style="margin:0 0 6px">${esc(OPS.operador.nome)} · ${esc(OPS.operador.perfilNome || '')}</div><button data-a="opout">Sair</button>` : '<button data-a="opin">Entrar</button>'}
        ${dados ? `<button data-a="export">Exportar backup (.json)</button>
        <label>Importar backup<input type="file" accept="application/json" hidden></label>
        <button data-a="reset">Restaurar dados originais</button>` : ''}
        ${window.SEED_ENC ? '<button data-a="lock">Sair e apagar os dados deste aparelho</button>' : ''}
        <div class="hint" style="margin:8px 0 0">Aparência</div>
        <div class="tema-op">${[['auto', 'Automático'], ['claro', 'Claro'], ['escuro', 'Escuro']].map(([k, l]) => `<button data-tema="${k}" class="${temaAtual() === k ? 'on' : ''}">${l}</button>`).join('')}</div>
        <div class="hint">${dados ? 'A escala fica salva neste navegador; vendas de câmeras, voos e registros ficam no servidor.' : 'Não deixe sua sessão aberta em aparelho compartilhado.'}</div>`;
      m.onclick = ev => ev.stopPropagation();
      m.querySelectorAll('[data-tema]').forEach(b => b.onclick = () => {
        if (window.vroTema) window.vroTema(b.dataset.tema);
        m.querySelectorAll('[data-tema]').forEach(x => x.classList.toggle('on', x === b));
      });
      const oin = m.querySelector('[data-a=opin]'); if (oin) oin.onclick = () => { m.remove(); loginModal(); };
      const oout = m.querySelector('[data-a=opout]'); if (oout) oout.onclick = () => { m.remove(); logoutOp(); };
      if (dados) m.querySelector('[data-a=export]').onclick = () => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([JSON.stringify(DB, null, 2)], { type: 'application/json' }));
        a.download = `verticalrio-operacoes-${today()}.json`; a.click(); m.remove();
      };
      if (dados) m.querySelector('input').onchange = ev => {
        const f = ev.target.files[0]; if (!f) return;
        f.text().then(t => { const d = JSON.parse(t); if (!d.team || !d.registros) throw new Error(); DB = d; save(); toast('Backup importado'); })
          .catch(() => toast('Arquivo inválido'));
        m.remove();
      };
      if (dados) m.querySelector('[data-a=reset]').onclick = () => {
        if (confirm('Apagar as alterações feitas neste navegador e voltar aos dados originais?')) {
          if (window.SEED) { DB = fromSeed(); save(); toast('Dados restaurados'); }
          else { try { localStorage.removeItem(KEY); localStorage.removeItem(UNLOCK); } catch (e) { /* */ } location.reload(); }
        }
        m.remove();
      };
      const lockBtn = m.querySelector('[data-a=lock]');
      if (lockBtn) lockBtn.onclick = () => {
        if (confirm('Sair e apagar os dados deste aparelho? Será preciso entrar de novo.')) {
          try { localStorage.removeItem(KEY); localStorage.removeItem(UNLOCK); localStorage.removeItem(TOKEN_KEY); } catch (e) { /* */ }
          location.hash = ''; location.reload();
        }
      };
      btn.appendChild(m);
      document.addEventListener('click', () => m.remove(), { once: true });
    };
  }

  // ---------- Blocos compartilhados (Dashboard / TV) ----------
  function flightBoard(s, withFoot) {
    const list = OPS.date === s ? OPS.voos.filter(v => v.data === s) : [];
    const flip = t => `<span class="flip">${[...t].map(c => (c === ':' ? '<i>:</i>' : `<b>${c}</b>`)).join('')}</span>`;
    const adm = withFoot && pode('edicao_rapida');      // horário e PAX: edição rápida (Administrador e Balcão)
    const qePul = withFoot && pode('pulseira');         // pulseira: administrador, operacional e balcão
    const stEdit = withFoot && pode('voo'), sino = withFoot && pode('aviso');
    const rows = list.length ? list.map(v => `<tr>
        <td class="c-hora">${adm ? `<input type="time" class="qe qe-hora" data-qe="hora" data-id="${esc(v.id)}" value="${esc(v.hora)}" aria-label="Horário do voo">` : flip(v.hora)}</td>
        <td class="c-fita">${qePul ? `<label class="qe-fita" title="Pulseira"><span class="dot" style="background:${FITAS[v.pulseira]}"></span><select data-qe="pulseira" data-id="${esc(v.id)}" aria-label="Pulseira">${Object.keys(FITAS).map(f => `<option value="${f}" ${f === v.pulseira ? 'selected' : ''}>${f.charAt(0) + f.slice(1).toLowerCase()}</option>`).join('')}</select></label>` : `<span class="dot" style="background:${FITAS[v.pulseira]}"></span>`}</td>
        <td class="c-pax">${adm ? `<input type="number" min="0" max="99" inputmode="numeric" class="pax qe qe-pax" data-qe="pax" data-id="${esc(v.id)}" value="${v.pax}" aria-label="PAX">` : `<span class="pax">${v.pax}</span>`}</td>
        <td class="c-voo"><span class="voo">${v.tipo === 'PRIVADO' ? 'PRIVADO ' + PROD_MIN[v.produto] : PROD_CURTO[v.produto]}</span></td>
        <td class="c-st">${stEdit ? `<select class="badge st-${v.status.replace(' ', '-')} stsel" data-status="${esc(v.id)}" aria-label="Status do voo ${esc(v.codigo || v.hora)}">${STATUS.map(x => `<option ${x === v.status ? 'selected' : ''}>${x}</option>`).join('')}</select>` : badge(v.status)}</td>${withFoot ? `<td class="c-aviso">${sino && anuncioDe(v) ? `<button type="button" class="sino${anuncio && anuncio.id === v.id ? ' tocando' : ''}" data-sino="${esc(v.id)}" title="${esc(anuncioDe(v).nome)} do voo ${esc(v.codigo || v.hora)}" aria-label="${esc(anuncioDe(v).nome)} do voo ${esc(v.codigo || v.hora)}">${icon('bell')}</button>` : '<span class="muted small">—</span>'}</td>` : ''}</tr>`).join('')
      : `<tr class="empty-row"><td colspan="${withFoot ? 6 : 5}">${OPS.erro ? 'Sem conexão com o servidor de voos.' : 'Nenhum voo programado para hoje.'}</td></tr>`;
    return `<div class="board"><div class="board-head">${icon('heli')}<h2>Status de Voo</h2>${withFoot && pode('voo') ? `<a class="board-edit" href="#/programacao" title="Editar voos na Programação">${icon('pencil')}Editar</a>` : ''}</div>
      <table><thead><tr><th style="width:17%">HORÁRIO</th><th style="width:8%">FITA</th><th style="width:9%">PAX</th><th style="width:21%">VOO</th><th>STATUS</th>${withFoot ? '<th style="width:9%">AVISO</th>' : ''}</tr></thead><tbody>${rows}</tbody></table>
      ${withFoot && OPS.operador && !adm && list.length ? `<div class="qe-nota">Horário e PAX: edição rápida para Administrador e Balcão${pode('voo') ? ' (use Editar na Programação)' : ''}.${qePul ? '' : ' Seu perfil só consulta os voos.'}</div>` : ''}
      ${withFoot ? `<div class="board-foot"><a href="#/programacao">${pode('voo') ? 'Cadastrar e editar voos →' : 'Ver voos e passageiros →'}</a></div>` : ''}</div>`;
  }
  function totalsBox(s) {
    const t = cycleTotals(cycleOf(s));
    return `<div class="card totals">
      <div class="t">${icon('heli')}<div><div class="k">Total de voos do ciclo</div><div class="v">${t.voos} voos</div></div></div>
      <span class="bar"></span>
      <div class="t">${icon('clock')}<div><div class="k">Horas voadas do ciclo</div><div class="v">${hhmm(t.min)}h</div></div></div></div>`;
  }
  function escalaDia(s, withLink) {
    if (!pode('dados') && !window.SEED_DEV) return `<div class="esc-card"><div class="esc-head">${icon('users')}<h2>Escala do dia</h2></div><div class="esc-body"><span class="muted small">Disponível só para Gestão e Administração.</span></div></div>`;
    const groups = SETOR_ORDER.map(sec => {
      const ps = bySetor(sec); if (!ps.length) return '';
      return `<div class="esc-group">${icon(SETOR_ICON[sec])} ${SETORES[sec]}</div>` +
        ps.map(p => { const st = statusOn(p, s); return `<div class="esc-person">${esc(p.name)}<span class="badge pres ${st}">${PRES[st]}</span></div>`; }).join('');
    }).join('');
    return `<div class="esc-card"><div class="esc-head">${icon('users')}<h2>Escala do dia</h2>${withLink ? '<a href="#/escala">Abrir escala →</a>' : ''}</div><div class="esc-body">${groups}</div></div>`;
  }
  function cameraBlock(c, withLink) {
    if (!pode('dados') && !window.SEED_DEV) return `<div class="esc-card"><div class="esc-head">${icon('users')}<h2>Vendas de câmeras</h2></div><div class="esc-body"><span class="muted small">Disponível só para Gestão e Administração.</span></div></div>`;
    const sales = salesOf(c);
    const qtd = sales.reduce((a, v) => a + v.qtd, 0), valor = sales.reduce((a, v) => a + v.valor, 0);
    const rank = sellerRank(c).filter(r => r.qtd > 0);
    const max = Math.max(1, ...rank.map(r => r.valor));
    return `<div class="cam-head">${icon('camera')}<h2>Vendas de câmeras</h2><span class="when">· CICLO ${cycleLabel(c)}</span>${withLink ? '<a href="#/cameras">Registrar venda →</a>' : ''}</div>
      <div class="cam-body">
        <div class="card pad"><div class="k">${icon('camera')} Câmeras vendidas no mês</div><div class="v">${qtd}</div></div>
        <div class="card pad"><div class="k">${icon('coins')} Faturamento com câmeras</div><div class="v">${money(valor)}</div></div>
        <div class="rank"><b>RANKING DOS VENDEDORES</b><div style="margin-top:12px">${rank.length ? rank.map((r, i) => rankRow(r, i, max)).join('') : '<span class="muted">Nenhuma venda registrada neste mês.</span>'}</div></div>
      </div>`;
  }
  function rankRow(r, i, max) {
    return `<div class="rank-row"><div class="top-line"><span class="pos">${i + 1}</span><span class="name">${esc(r.name)}</span><span class="amt">${money(r.valor)}<span class="un">${r.qtd} un.</span></span></div><div class="track"><div class="fill" style="width:${(r.valor / max) * 100}%"></div></div></div>`;
  }

  // ---------- Dashboard ----------
  function pageDashboard() {
    const s = today(), c = cycleOf(s), days = cycleDays(c);
    const evo = days.map(d => { const f = dayFlights(d); return { v: f.voos, tip: `${brShort(d)}: ${f.voos} voos` }; });
    const folgas = [];
    for (let i = 1; i < 14; i++) {
      const d = addDays(s, i);
      DB.team.forEach(p => { if (statusOn(p, d) === 'F') folgas.push([d, p.name]); });
    }
    // indicadores do ciclo (total de voos, horas, evolução): só para quem acessa a tela Voos (não para o Balcão)
    if (!pode('registros') && !window.SEED_DEV) return `<div class="dash-grid"><div>${flightBoard(s, true)}</div><div>${escalaDia(s, true)}</div></div>`;
    return `<div class="dash-grid">
        <div>${flightBoard(s, true)}${totalsBox(s)}
          <div class="foot-note"><span>Resultados realizados · Ciclo ${cycleLabel(c)}</span><a href="#/voos">Registrar voos →</a></div></div>
        <div>${escalaDia(s, true)}</div>
      </div>
      <div class="section-title">Evolução e próximas folgas</div>
      <div class="dash-grid">
        <div class="card pad"><div class="chart-head"><b>Evolução dos voos no ciclo</b><span class="muted small">voos por dia</span></div>${bars(evo, cycleAxis(days))}</div>
        <div class="card pad"><div class="muted small" style="margin-bottom:10px">Próximas folgas (14 dias)</div>
          ${folgas.length ? folgas.map(([d, n]) => `<div style="display:flex;justify-content:space-between;padding:5px 0"><span class="muted">${brShort(d)}</span><span>${esc(n)}</span></div>`).join('') : '<span class="muted">Nenhuma folga nos próximos dias.</span>'}
        </div>
      </div>`;
  }

  // ---------- Anúncio pelo sino (dashboard): publica na TV e fala na hora, sem sair da página ----------
  // mesmo texto da Central de Avisos (PT, EN, ES) e mesma voz da ElevenLabs (rota /api/tts)
  const PT_UN = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez', 'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const PT_DEZ = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta'];
  const ptNum = (n, fem) => { const u = k => (fem && k === 1 ? 'uma' : fem && k === 2 ? 'duas' : PT_UN[k]); if (n < 20) return u(n); const d = Math.floor(n / 10), x = n % 10; return PT_DEZ[d] + (x ? ' e ' + u(x) : ''); };
  const horaPT = (h, m) => (h === 0 ? 'meia-noite' : h === 12 ? 'meio-dia' : ptNum(h, true)) + (m ? ' e ' + ptNum(m, false) : '');
  const EN_UN = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const EN_DEZ = ['', '', 'twenty', 'thirty', 'forty', 'fifty'];
  const enNum = n => { if (n < 20) return EN_UN[n]; const d = Math.floor(n / 10), x = n % 10; return EN_DEZ[d] + (x ? '-' + EN_UN[x] : ''); };
  const horaEN = (h, m) => { if (h === 0 && m === 0) return 'midnight'; if (h === 12 && m === 0) return 'twelve noon'; const h12 = h % 12 || 12; return m === 0 ? enNum(h12) + " o'clock" : m < 10 ? enNum(h12) + ' oh ' + enNum(m) : enNum(h12) + ' ' + enNum(m); };
  const ES_UN = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
  const ES_DEZ = ['', '', '', 'treinta', 'cuarenta', 'cincuenta'];
  const esNum = n => { if (n < 30) return ES_UN[n]; const d = Math.floor(n / 10), x = n % 10; return ES_DEZ[d] + (x ? ' y ' + ES_UN[x] : ''); };
  const horaES = (h, m) => { if (h === 0 && m === 0) return 'de la medianoche'; if (h === 12 && m === 0) return 'del mediodía'; const h12 = h % 12 || 12; return 'de ' + (h12 === 1 ? 'la una' : 'las ' + esNum(h12)) + (m === 15 ? ' y cuarto' : m === 30 ? ' y media' : m > 0 ? ' y ' + esNum(m) : ''); };
  const COR_FALA = { BRANCA: ['branca', 'white', 'blanca'], PRETA: ['preta', 'black', 'negra'], AMARELA: ['amarela', 'yellow', 'amarilla'], VERDE: ['verde', 'green', 'verde'], AZUL: ['azul', 'blue', 'azul'] };
  // o texto falado e o aviso na TV acompanham o status do voo
  const ANUNCIO_STATUS = {
    EMBARCANDO: { aviso: 'embarque', nome: 'chamada para o embarque',
      pt: 'Por favor, dirijam-se à sala um. Bom voo.', en: 'Please proceed to room one. Have a nice flight.', es: 'Por favor, diríjanse a la sala uno. Buen vuelo.' },
    'A CONFIRMAR': { aviso: 'geral', nome: 'aviso de espera',
      pt: 'Por favor, aguardem na sala de espera. Em breve chamaremos para o embarque.', en: 'Please wait in the waiting room. We will call you for boarding shortly.', es: 'Por favor, esperen en la sala de espera. En breve los llamaremos para el embarque.' },
    ATRASADO: { aviso: 'atraso', nome: 'aviso de atraso',
      pt: 'Informamos que o voo está atrasado. Por favor, aguardem na sala de espera. Agradecemos a compreensão.', en: 'Please be advised that the flight is delayed. Please wait in the waiting room. Thank you for your understanding.', es: 'Les informamos que el vuelo está retrasado. Por favor, esperen en la sala de espera. Gracias por su comprensión.' },
    CANCELADO: { aviso: 'cancelado', nome: 'aviso de cancelamento',
      pt: 'Informamos que o voo foi cancelado. Por favor, dirijam-se à recepção. Pedimos desculpas pelo transtorno.', en: 'Please be advised that the flight has been cancelled. Please proceed to the reception desk. We apologize for the inconvenience.', es: 'Les informamos que el vuelo ha sido cancelado. Por favor, diríjanse a la recepción. Pedimos disculpas por las molestias.' }
  };
  ANUNCIO_STATUS.CONFIRMADO = ANUNCIO_STATUS.EMBARCANDO; // 3.6: CONFIRMADO voltou e chama para o embarque, como antes
  const anuncioDe = v => ANUNCIO_STATUS[v.status] || null; // VOANDO e FINALIZADO: sem anúncio
  // avisa o servidor que a fala acabou: a TV fecha o alerta nessa hora (o aviso foi publicado com fala: true)
  function fimAvisoSino(ex) { ex.terminou = true; if (ex.avisoId && !ex.fimEnviado) { ex.fimEnviado = true; api('/acao', { method: 'POST', body: JSON.stringify({ tipo: 'aviso_fim', avisoId: ex.avisoId }) }).catch(() => {}); } }
  function textosChamada(v) {
    const [h, m] = v.hora.split(':').map(Number), c = COR_FALA[v.pulseira] || COR_FALA.BRANCA, a = anuncioDe(v) || ANUNCIO_STATUS.EMBARCANDO;
    return [
      `Atenção, passageiros do voo das ${horaPT(h, m)}, pulseira ${c[0]}. ${a.pt}`.replace(/\b(das|da|do) (uma|meia-noite)\b/g, 'da $2').replace(/\b(das|da|do) meio-dia\b/g, 'do meio-dia'),
      `Attention, passengers on the ${horaEN(h, m)} flight, ${c[1]} wristband. ${a.en}`,
      `Atención, pasajeros del vuelo ${horaES(h, m)}, pulsera ${c[2]}. ${a.es}`
    ];
  }
  let anuncio = null, audioCtx = null;
  // aviso sonoro = a mesma marimba da Central de Avisos (brand/gongo_C.mp3); se não carregar, usa as duas notas
  let gongoBytes = null, gongoBuf = null;
  const baixaGongo = () => (gongoBytes = gongoBytes || fetch('brand/gongo_C.mp3').then(r => { if (!r.ok) throw new Error(); return r.arrayBuffer(); }));
  async function gongoBuffer(ac) {
    if (gongoBuf) return gongoBuf;
    const ab = (await baixaGongo()).slice(0);
    gongoBuf = await new Promise((ok, falha) => ac.decodeAudioData(ab, ok, falha));
    return gongoBuf;
  }
  async function tocaGongo(ac, ex) { // toca já e devolve o instante em que termina
    try {
      const b = await gongoBuffer(ac), t = ac.currentTime + 0.05, s = ac.createBufferSource();
      s.buffer = b; s.connect(ac.destination); s.start(t); ex.fontes.push(s);
      return t + b.duration;
    } catch (e) { return gongo(ac, ac.currentTime + 0.05, ex); }
  }
  function gongo(ac, t, ex) { // reserva: duas notas suaves
    [[659.25, 0], [523.25, 0.45]].forEach(([f, d]) => {
      const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0, t + d); g.gain.linearRampToValueAtTime(0.35, t + d + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t + d + 1.4);
      o.connect(g).connect(ac.destination); o.start(t + d); o.stop(t + d + 1.5); ex.fontes.push(o);
    });
    return t + 1.6;
  }
  function pararAnuncio(msg) {
    if (!anuncio) return; anuncio.cancelado = true;
    anuncio.fontes.forEach(n => { try { n.stop(0); } catch (e) { /* */ } });
    fimAvisoSino(anuncio);
    anuncio = null; render(); if (msg) toast(msg);
  }
  async function anunciar(id) {
    if (anuncio) { const mesmo = anuncio.id === id; pararAnuncio('Anúncio interrompido'); if (mesmo) return; }
    const v = OPS.voos.find(x => x.id === id); if (!v) return;
    const a = anuncioDe(v);
    if (!a) { toast(`Voo ${v.status.toLowerCase()}: não há anúncio para esse status.`); return; }
    // som liberado no mesmo toque (exigência dos navegadores), antes de qualquer espera
    try { audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)(); audioCtx.resume(); } catch (e) { toast('Este navegador não toca áudio.'); return; }
    if (!OPS.operador) { loginModal(() => anunciar(id)); return; }
    const ex = anuncio = { id, fontes: [], cancelado: false }; render();
    toast(`Voo ${v.codigo || v.hora}: ${a.nome}...`);
    // 1º o aviso sonoro (na hora do toque), enquanto a voz é gerada; 2º o texto falado, depois que o som termina
    const fimGongo = tocaGongo(audioCtx, ex);
    // a TV mostra o aviso só durante a fala: publica quando as vozes ficam prontas e tira quando a fala termina
    let pub = Promise.resolve(null);
    const publica = () => { pub = api('/acao', { method: 'POST', body: JSON.stringify({ tipo: 'aviso', id, aviso: a.aviso, texto: a.aviso === 'geral' ? textosChamada(v)[0] : '', fala: true }) })
      .then(r => { ex.avisoId = r && r.resultado && r.resultado.id; if (ex.terminou) fimAvisoSino(ex); return null; }, e => e); };
    try {
      const bufs = await Promise.all(textosChamada(v).map(texto => api('/tts', { method: 'POST', body: JSON.stringify({ texto, velocidade: 0.95 }) })
        .then(d => { const bin = atob(d.audioContent), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u.buffer; })
        .then(ab => new Promise((ok, falha) => audioCtx.decodeAudioData(ab, ok, () => falha(new Error('Áudio inválido')))))));
      if (ex.cancelado) return;
      await audioCtx.resume();
      let t = Math.max(await fimGongo + 0.5, audioCtx.currentTime + 0.1), ultima = null;
      if (ex.cancelado) return;
      publica();
      bufs.forEach(b => { const s = audioCtx.createBufferSource(); s.buffer = b; s.connect(audioCtx.destination); s.start(t); t += b.duration + 0.7; ex.fontes.push(s); ultima = s; });
      ultima.onended = () => { fimAvisoSino(ex); if (anuncio === ex) { anuncio = null; render(); } };
    } catch (e) {
      if (ex.cancelado) return;
      fimAvisoSino(ex);
      if (anuncio === ex) { anuncio = null; render(); }
      if (e.status === 401) { loginModal(() => anunciar(id)); return; }
      toast('Não foi possível falar: ' + e.message);
    }
    const errPub = await pub;
    if (errPub && !ex.cancelado) toast('Não publicou na TV: ' + errPub.message);
  }
  function bindDashboard(app) {
    app.querySelectorAll('[data-sino]').forEach(b => { b.onclick = () => anunciar(b.dataset.sino); });
    app.querySelectorAll('select[data-status]').forEach(sel => {
      sel.onchange = () => acaoOps({ tipo: 'editar_voo', id: sel.dataset.status, mudancas: { status: sel.value } }, `Status alterado para ${sel.value}`);
    });
    // edição rápida: salva no servidor e sincroniza TV, Central e Programação
    app.querySelectorAll('[data-qe]').forEach(el => {
      el.onchange = () => {
        const k = el.dataset.qe, v = OPS.voos.find(x => x.id === el.dataset.id); if (!v) return;
        let val = el.value;
        if (k === 'hora' && !/^\d{2}:\d{2}$/.test(val)) { toast('Horário inválido'); el.value = v.hora; return; }
        if (k === 'pax') { val = Math.max(0, Math.min(99, parseInt(val, 10) || 0)); if (val === v.pax) { el.value = v.pax; return; } }
        if (val === v[k]) return;
        const nome = { hora: 'Horário', pulseira: 'Pulseira', pax: 'PAX' }[k];
        acaoOps({ tipo: 'editar_voo', id: v.id, mudancas: { [k]: val } }, `${nome} atualizado`);
      };
      if (el.tagName === 'INPUT') el.onkeydown = e => { if (e.key === 'Enter') el.blur(); };
    });
  }

  // ---------- Programação (servidor) ----------
  let progDate = today();
  let progEdit = null;
  let progOpen = null; // voo com a lista de PAX aberta
  const emptyFlight = () => ({ hora: '', pax: 1, pulseira: 'BRANCA', produto: 'DOORS_OFF_30', tipo: 'REGULAR', status: 'A CONFIRMAR', obs: '', obsTv: false });
  let progForm = emptyFlight();

  function opBar() {
    return `<div class="card pad" style="display:flex;align-items:center;gap:12px;margin-bottom:24px;flex-wrap:wrap">
      ${icon('user')}${OPS.operador ? `<span><b>${esc(OPS.operador.nome)}</b> <span class="muted">· ${esc(OPS.operador.perfilNome || '')}</span></span><button class="btn" id="opOut" style="margin-left:auto">Sair</button>`
        : `<span class="muted">Entre com seu nome e PIN para cadastrar ou alterar voos. Tudo fica registrado no histórico.</span><button class="btn primary" id="opIn" style="margin-left:auto">Entrar como operador</button>`}
      ${OPS.erro ? `<span class="small" style="color:var(--red);width:100%">Sem conexão com o servidor: ${esc(OPS.erro)}</span>` : ''}</div>`;
  }
  function pageProgramacao() {
    if (OPS.date !== progDate && OPS.pedido !== progDate) { OPS.pedido = progDate; loadOps(progDate, true).then(() => { OPS.pedido = null; render(); }); }
    const list = OPS.date === progDate ? OPS.voos.slice() : [];
    const f = progForm;
    const seg = (key, opts, cols = 2) => `<div class="seg" style="grid-template-columns:repeat(${cols},1fr)">${opts.map(([v, l]) => `<button type="button" data-k="${key}" data-v="${v}" class="${String(f[key]) === String(v) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
    return `<div class="page-head"><div><h1>Programação de voos</h1><p>Fonte única dos voos e PAX: alimenta o Status de Voo, a TV da sala de espera, a TV do escritório e a Central de Avisos.</p></div>
        <a class="btn" href="#/painel">${icon('tv')} Abrir painel da TV</a></div>
      ${opBar()}
      <div class="datebar"><button class="icon-btn" data-nav="-1">${icon('left')}</button><input type="date" class="input" id="progDate" value="${progDate}"><button class="icon-btn" data-nav="1">${icon('right')}</button><span class="muted">${dowName(progDate)}, ${br(progDate)}</span></div>
      <div class="prog-grid">
        <div>${pode('voo') ? `<div class="section-title" style="margin-top:0">${progEdit ? 'Editar voo' : 'Novo voo'}</div>
          <form class="card pad" id="flightForm">
            <div class="row2"><div><label class="f">Horário</label><input type="time" class="input" name="hora" value="${f.hora}" required></div>
              <div><label class="f">PAX</label><div class="stepper"><button type="button" class="icon-btn" data-pax="-1">${icon('minus')}</button><input class="input" name="pax" type="number" min="0" max="30" value="${f.pax}"><button type="button" class="icon-btn" data-pax="1">${icon('plus')}</button></div></div></div>
            <div class="field"><label class="f">Produto</label>${seg('produto', Object.entries(PRODUTOS), 1)}</div>
            <div class="field"><label class="f">Fita / pulseira</label>${seg('pulseira', Object.keys(FITAS).map(k => [k, `<span class="swatch" style="background:${FITAS[k]}"></span>${k}`]))}</div>
            <div class="field"><label class="f">Tipo</label>${seg('tipo', [['REGULAR', 'REGULAR'], ['PRIVADO', 'PRIVADO']])}</div>
            <div class="field"><label class="f">Status</label><select class="input" name="status">${STATUS.map(s => `<option ${s === f.status ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
            <div class="field"><label class="f">Observação (opcional)</label><input class="input" name="obs" maxlength="300" value="${esc(f.obs)}">
              <label class="obs-tv"><input type="checkbox" name="obsTv" ${f.obsTv ? 'checked' : ''}> Mostrar no Painel de Status (TV)</label></div>
            <button class="btn primary" style="width:100%;justify-content:center">${progEdit ? 'Salvar alterações' : 'Cadastrar voo'}</button>
            ${progEdit ? '<button type="button" class="btn" id="cancelEdit" style="width:100%;justify-content:center;margin-top:8px">Cancelar edição</button>' : ''}
          </form>` : `<div class="section-title" style="margin-top:0">Seu acesso</div><div class="card pad muted small">Perfil <b>${esc(OPS.operador?.perfilNome || '')}</b>: ${pode('pax') ? 'consulta os voos, faz o check-in dos passageiros e troca a cor da pulseira. Horário e PAX: pela edição rápida do Dashboard. Status e cadastro de voos ficam com a operação.' : 'consulta os voos e passageiros, sem alterar.'}</div>`}
          ${pode('config') ? `<div class="section-title">TV da sala de espera</div>
          <div class="card pad"><label class="f">Voos exibidos ao mesmo tempo</label>
            <div class="stepper"><input class="input" id="tvVoos" type="number" min="1" max="12" value="${OPS.config.tvVoos}"><button class="btn" id="saveTv">Salvar</button></div></div>` : ''}
        </div>
        <div><div class="section-title" style="margin-top:0">Voos programados · ${br(progDate)} <span>${list.length} voo${list.length === 1 ? '' : 's'} · ${list.reduce((a, v) => a + v.pax, 0)} PAX</span></div>
          ${list.length ? `<div class="list">${list.map(v => `<div class="item" style="flex-wrap:wrap">
              <span class="f-time">${v.hora}</span>
              <div class="grow"><div class="title" style="display:flex;align-items:center;gap:8px"><span class="muted small">${v.codigo}</span><span class="swatch" style="background:${FITAS[v.pulseira]}"></span>${v.pulseira}</div>
                <div class="meta">${v.pax} PAX · ${PRODUTOS[v.produto]} · ${v.tipo}</div></div>
              ${badge(v.status)}
              ${pode('voo') ? `<select class="input" style="width:150px" data-status="${v.id}">${STATUS.map(s => `<option ${s === v.status ? 'selected' : ''}>${s}</option>`).join('')}</select>`
                : pode('pulseira') ? `<select class="input" style="width:130px" data-pulseira="${v.id}" aria-label="Pulseira do voo ${v.codigo}">${Object.keys(FITAS).map(k => `<option value="${k}" ${k === v.pulseira ? 'selected' : ''}>${k}</option>`).join('')}</select>` : ''}
              <button class="icon-btn" data-paxopen="${v.id}" title="Passageiros" aria-label="Passageiros">${icon('users')}</button>
              ${pode('voo') ? `<button class="icon-btn" data-edit="${v.id}" aria-label="Editar">${icon('pencil')}</button>
              <button class="icon-btn" data-del="${v.id}" aria-label="Excluir">${icon('trash')}</button>` : ''}
              ${v.obs ? `<div class="prog-obs"><span class="prog-obs-txt">${esc(v.obs)}</span>
                ${pode('voo') ? `<button class="btn tv-obs ${v.obsTv ? 'on' : ''}" data-obstv="${v.id}" title="${v.obsTv ? 'A observação aparece no Painel de Status. Clique para esconder.' : 'Clique para a observação aparecer no Painel de Status.'}">${icon('tv')} ${v.obsTv ? 'Na TV' : 'Mostrar na TV'}</button>` : ''}</div>` : ''}
              ${progOpen === v.id ? paxPanel(v) : ''}</div>`).join('')}</div>`
            : `<div class="empty">${OPS.erro ? 'Sem conexão com o servidor de voos.' : 'Nenhum voo programado para este dia.'}</div>`}
        </div>
      </div>`;
  }
  function paxPanel(v) {
    if (!OPS.operador) return `<div style="width:100%;padding-top:10px" class="muted small">Entre como operador para ver e editar os nomes dos passageiros.</div>`;
    const lst = v.paxList || [];
    if (!pode('pax')) return `<div style="width:100%;border-top:1px solid var(--border);margin-top:12px;padding-top:12px">
      <div class="small muted" style="margin-bottom:8px">Passageiros identificados: ${lst.length} de ${v.pax} · pulseira ${v.pulseira} · somente consulta</div>
      ${lst.map(p => `<div style="display:flex;gap:8px;align-items:center;margin-bottom:6px"><span class="swatch" style="background:${FITAS[v.pulseira]}"></span><span>${esc(p.nome)}</span>${p.obs ? `<span class="muted small">· ${esc(p.obs)}</span>` : ''}</div>`).join('') || '<span class="muted small">Nenhum passageiro identificado.</span>'}</div>`;
    return `<div style="width:100%;border-top:1px solid var(--border);margin-top:12px;padding-top:12px">
      <div class="small muted" style="margin-bottom:8px">Passageiros identificados: ${lst.length} de ${v.pax} · pulseira ${v.pulseira}</div>
      ${lst.map(p => `<div style="display:flex;gap:8px;align-items:center;margin-bottom:6px"><span class="swatch" style="background:${FITAS[v.pulseira]}"></span>
        <input class="input" data-pxnome="${v.id}|${p.id}" value="${esc(p.nome)}" style="flex:2"><input class="input" data-pxobs="${v.id}|${p.id}" value="${esc(p.obs || '')}" placeholder="Obs. (peso, idioma...)" style="flex:1">
        <button class="icon-btn ghost" data-pxdel="${v.id}|${p.id}" aria-label="Remover">${icon('trash')}</button></div>`).join('')}
      <form data-pxadd="${v.id}" style="display:flex;gap:8px;margin-top:8px"><input class="input" name="nome" placeholder="Nome do passageiro" required style="flex:2"><input class="input" name="obs" placeholder="Obs." style="flex:1"><button class="btn primary">${icon('plus')} Adicionar</button></form></div>`;
  }
  function bindProgramacao(root) {
    const oi = root.querySelector('#opIn'); if (oi) oi.onclick = () => loginModal();
    const oo = root.querySelector('#opOut'); if (oo) oo.onclick = logoutOp;
    root.querySelectorAll('[data-nav]').forEach(b => b.onclick = () => { progDate = addDays(progDate, +b.dataset.nav); render(); });
    root.querySelector('#progDate').onchange = e => { if (e.target.value) { progDate = e.target.value; render(); } };
    const form = root.querySelector('#flightForm');
    root.querySelectorAll('[data-pulseira]').forEach(s => s.onchange = () => acaoOps({ tipo: 'editar_voo', id: s.dataset.pulseira, mudancas: { pulseira: s.value } }, 'Pulseira atualizada'));
    if (form) {
    const sync = () => { progForm.hora = form.hora.value; progForm.pax = Math.max(0, +form.pax.value || 0); progForm.status = form.status.value; progForm.obs = form.obs.value; progForm.obsTv = form.obsTv.checked; };
    form.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { sync(); progForm[b.dataset.k] = b.dataset.v; render(); });
    form.querySelectorAll('[data-pax]').forEach(b => b.onclick = () => { sync(); progForm.pax = Math.max(0, progForm.pax + +b.dataset.pax); form.pax.value = progForm.pax; });
    form.onsubmit = async e => {
      e.preventDefault(); sync();
      if (!progForm.hora) return toast('Informe o horário');
      const r = progEdit
        ? await acaoOps({ tipo: 'editar_voo', id: progEdit, mudancas: { ...progForm, pax: +progForm.pax } }, 'Voo atualizado')
        : await acaoOps({ tipo: 'criar_voo', voo: { ...progForm, data: progDate, pax: +progForm.pax } }, 'Voo cadastrado');
      if (r) { progEdit = null; progForm = emptyFlight(); render(); }
    };
    const ce = root.querySelector('#cancelEdit'); if (ce) ce.onclick = () => { progEdit = null; progForm = emptyFlight(); render(); };
    }
    const st = root.querySelector('#saveTv'); if (st) st.onclick = () => acaoOps({ tipo: 'config', tvVoos: +root.querySelector('#tvVoos').value }, 'Configuração da TV salva');
    root.querySelectorAll('[data-status]').forEach(s => s.onchange = () => acaoOps({ tipo: 'editar_voo', id: s.dataset.status, mudancas: { status: s.value } }));
    root.querySelectorAll('[data-obstv]').forEach(b => b.onclick = () => { const v = OPS.voos.find(x => x.id === b.dataset.obstv);
      acaoOps({ tipo: 'editar_voo', id: v.id, mudancas: { obsTv: !v.obsTv } }, v.obsTv ? 'Observação escondida da TV' : 'Observação aparecendo no Painel de Status'); });
    root.querySelectorAll('[data-paxopen]').forEach(b => b.onclick = () => { progOpen = progOpen === b.dataset.paxopen ? null : b.dataset.paxopen; render(); });
    root.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => {
      const v = OPS.voos.find(x => x.id === b.dataset.edit); progEdit = v.id;
      progForm = { hora: v.hora, pax: v.pax, pulseira: v.pulseira, produto: v.produto, tipo: v.tipo, status: v.status, obs: v.obs || '', obsTv: !!v.obsTv }; render(); window.scrollTo(0, 0);
    });
    root.querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
      const v = OPS.voos.find(x => x.id === b.dataset.del);
      if (confirm(`Excluir o voo ${v.codigo} (${v.hora})? O registro continua no histórico.`)) acaoOps({ tipo: 'excluir_voo', id: v.id }, 'Voo excluído');
    });
    root.querySelectorAll('[data-pxadd]').forEach(f => f.onsubmit = e => { e.preventDefault(); acaoOps({ tipo: 'pax_add', id: f.dataset.pxadd, nome: f.nome.value, obs: f.obs.value }, 'Passageiro adicionado'); });
    root.querySelectorAll('[data-pxnome]').forEach(i => i.onchange = () => { const [id, paxId] = i.dataset.pxnome.split('|'); acaoOps({ tipo: 'pax_editar', id, paxId, nome: i.value }, 'Passageiro atualizado'); });
    root.querySelectorAll('[data-pxobs]').forEach(i => i.onchange = () => { const [id, paxId] = i.dataset.pxobs.split('|'); acaoOps({ tipo: 'pax_editar', id, paxId, obs: i.value }, 'Observação salva'); });
    root.querySelectorAll('[data-pxdel]').forEach(b => b.onclick = () => { const [id, paxId] = b.dataset.pxdel.split('|'); if (confirm('Remover este passageiro do voo?')) acaoOps({ tipo: 'pax_remover', id, paxId }, 'Passageiro removido'); });
  }

  // ---------- Histórico (auditoria) ----------
  const histF = { de: addDays(today(), -7), ate: today(), operador: '', voo: '', pax: '', tipo: '', q: '' };
  let HIST = null;
  async function loadHist() {
    const qs = new URLSearchParams(Object.entries(histF).filter(([, v]) => v)).toString();
    try { HIST = await api(`/log?${qs}`); } catch (e) { HIST = { erro: e.message, status: e.status }; }
    render();
  }
  function pageHistorico() {
    if (!OPS.operador) return `<div class="page-head"><div><h1>Histórico operacional</h1><p>Registro de todas as alterações em voos, PAX, pulseiras, status e avisos.</p></div></div>${opBar()}`;
    if (!HIST) { loadHist(); return `<div class="page-head"><div><h1>Histórico operacional</h1></div></div><div class="empty">Carregando...</div>`; }
    if (HIST.erro) return `<div class="page-head"><div><h1>Histórico operacional</h1></div></div>${opBar()}<div class="empty">${esc(HIST.erro)}</div>`;
    const ops = HIST.operadores || [];
    return `<div class="page-head"><div><h1>Histórico operacional</h1><p>Registro de todas as alterações. Os registros continuam mesmo depois que um voo é excluído ou cancelado.</p></div>
        <button class="btn" id="histCsv">${icon('copy')} Exportar CSV</button></div>
      ${opBar()}
      <form id="histForm" class="card pad" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;align-items:end">
        <div><label class="f">De</label><input class="input" type="date" name="de" value="${histF.de}"></div>
        <div><label class="f">Até</label><input class="input" type="date" name="ate" value="${histF.ate}"></div>
        <div><label class="f">Operador</label><select class="input" name="operador"><option value="">Todos</option>${ops.map(o => `<option value="${o.id}" ${o.id === histF.operador ? 'selected' : ''}>${esc(o.nome)}</option>`).join('')}</select></div>
        <div><label class="f">Tipo</label><select class="input" name="tipo"><option value="">Todos</option>${Object.entries(TIPOS_LOG).map(([k, l]) => `<option value="${k}" ${k === histF.tipo ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        <div><label class="f">Voo</label><input class="input" name="voo" placeholder="VR-024" value="${esc(histF.voo)}"></div>
        <div><label class="f">PAX</label><input class="input" name="pax" placeholder="Nome" value="${esc(histF.pax)}"></div>
        <div style="grid-column:span 2"><label class="f">Busca</label><input class="input" name="q" placeholder="Palavra ou termo" value="${esc(histF.q)}"></div>
        <button class="btn primary" style="justify-content:center">Filtrar</button>
      </form>
      <div class="section-title">${HIST.total} registro${HIST.total === 1 ? '' : 's'}${HIST.total > HIST.itens.length ? ` <span>mostrando os ${HIST.itens.length} mais recentes</span>` : ''}</div>
      ${HIST.itens.length ? `<div class="list">${HIST.itens.map(e => `<div class="item" style="align-items:flex-start">
          <div style="width:118px;flex:none"><b>${new Date(e.em).toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</b><div class="muted small">${new Date(e.em).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</div></div>
          <div class="grow"><div class="small muted">${esc(e.por.nome)} · <b style="color:var(--fg)">${TIPOS_LOG[e.tipo] || e.tipo}</b>${e.voo ? ` · ${e.voo}` : ''}</div><div style="margin-top:3px">${esc(e.descricao)}</div></div></div>`).join('')}</div>`
        : '<div class="empty">Nenhum registro com esses filtros.</div>'}
      ${OPS.operador.admin ? `<p class="muted small" style="margin-top:16px">Para cadastrar ou excluir operadores, use a tela <a href="#/operadores" style="text-decoration:underline">Operadores</a>.</p>` : ''}`;
  }
  function bindHistorico(root) {
    const oi = root.querySelector('#opIn'); if (oi) oi.onclick = () => loginModal(() => { HIST = null; render(); });
    const oo = root.querySelector('#opOut'); if (oo) oo.onclick = () => { HIST = null; logoutOp(); };
    const f = root.querySelector('#histForm');
    if (f) f.onsubmit = e => { e.preventDefault(); Object.keys(histF).forEach(k => histF[k] = f[k].value.trim()); HIST = null; render(); };
    const csv = root.querySelector('#histCsv');
    if (csv) csv.onclick = () => {
      const q = s => `"${String(s ?? '').replace(/"/g, '""')}"`;
      const rows = [['data_hora', 'operador', 'tipo', 'voo', 'pax', 'descricao', 'valor_anterior', 'valor_novo'].join(';')].concat(HIST.itens.map(e => [new Date(e.em).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }), e.por.nome, TIPOS_LOG[e.tipo] || e.tipo, e.voo, e.pax, e.descricao, typeof e.de === 'object' ? JSON.stringify(e.de) : e.de, e.para].map(q).join(';')));
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + rows.join('\n')], { type: 'text/csv' })); a.download = `historico-operacao-${histF.de}-a-${histF.ate}.csv`; a.click();
    };
  }

  // ---------- Voos ----------
  let voosCycle = cycleOf(today());
  function pageVoos() {
    const c = voosCycle, t = cycleTotals(c), prev = cycleTotals(shiftCycle(c, -1));
    const isCur = c.start === cycleOf(today()).start;
    const dv = t.voos - prev.voos, dm = t.min - prev.min;
    const sign = n => (n > 0 ? '+' : n < 0 ? '−' : '±');
    const days = cycleDays(c);
    const regs = regsEntre(c.start, c.end).sort((a, b) => b.date.localeCompare(a.date));
    const six = [0, -1, -2, -3, -4, -5].map(n => shiftCycle(c, n));
    const sixT = six.map(x => ({ c: x, t: cycleTotals(x) }));
    const stat = (l, v, sub) => `<div class="card pad stat"><div class="label">${l}</div><div class="value">${v}</div>${sub ? `<div class="sub">${sub}</div>` : ''}</div>`;
    return `<div class="page-head"><div><h1>Controle de voos</h1><p>Cada voo marcado como FINALIZADO na Programação soma o tempo do produto (30 ou 45 min), na hora, para todos. Privados e Doors On são classificações e não somam ao total.</p></div>
        <button class="btn primary" id="newDay">${icon('plus')} Registrar dia</button></div>
      <div class="period"><button class="icon-btn ghost" data-cy="-1">${icon('left')}</button><div class="mid">Ciclo ${cycleLabel(c)}<small>${isCur ? 'Ciclo atual' : 'Ciclo selecionado'}</small></div><button class="icon-btn ghost" data-cy="1">${icon('right')}</button></div>
      <div class="section-title">Totais do ciclo</div>
      <div class="grid g3">
        ${stat('Total de voos', t.voos, `${sign(dv)}${Math.abs(dv)} vs. ciclo anterior`)}
        ${stat('Horas voadas', `${hhmm(t.min)}h`, `${sign(dm)}${hhmm(Math.abs(dm))}h vs. ciclo anterior`)}
        ${stat('Dias com operação', t.dias)}
        ${stat('Voos de 30 min', t.v30)}${stat('Voos de 45 min', t.v45)}${stat('Privados · Doors On', `${t.priv} · ${t.doorsOn}`)}
        ${stat('Voos cancelados', t.canc, 'Fora do total de voos e das horas')}
      </div>
      <div class="card pad" style="margin-top:12px"><div class="chart-head"><b>Horas por dia</b><span class="muted small">${c.start.slice(8)} → ${c.end.slice(8)}</span></div>
        ${bars(days.map(d => { const r = regOf(d); const m = r ? regMin(r) : 0; return { v: m, tip: `${brShort(d)}: ${hhmm(m)}h` }; }), cycleAxis(days))}</div>
      <div class="section-title">Registros</div>
      ${regs.length ? `<div class="list">${regs.map(r => `<div class="item"><div class="grow"><div class="title">${longDate(r.date)}</div>
          <div class="meta">${r.auto ? '<span class="badge st-CONFIRMADO" style="margin-right:6px">Automático</span>' : '<span class="badge" style="margin-right:6px">Manual</span>'}30min: ${r.v30} · 45min: ${r.v45} · Privados: ${r.priv} · Doors On: ${r.doorsOn} · Cancelados: ${r.canc}${r.obs ? ` · ${esc(r.obs)}` : ''}</div></div>
          <div class="right"><b>${regVoos(r)} voos</b><small>${hhmm(regMin(r))}h</small></div>
          <button class="btn" data-wa="${r.date}">${icon('copy')} WhatsApp</button>
          ${r.auto ? `<button class="btn" data-prog="${r.date}" title="Os números deste dia vêm dos voos da Programação">${icon('pencil')} Ver voos</button>`
            : `<button class="icon-btn ghost" data-edit="${r.date}" aria-label="Editar">${icon('pencil')}</button>
          <button class="icon-btn ghost" data-del="${r.date}" aria-label="Excluir">${icon('trash')}</button>`}</div>`).join('')}</div>`
        : '<div class="empty">Nenhum registro neste ciclo.</div>'}
      <div class="section-title">Comparativo entre ciclos</div>
      <div class="grid g2">
        <div class="card pad"><div class="chart-head"><b>Horas voadas · últimos 6 ciclos</b></div>
          ${bars(sixT.slice().reverse().map((x, i) => ({ v: x.t.min, cur: i === 5, tip: `${cycleLabel(x.c)}: ${hhmm(x.t.min)}h` })), sixT.slice().reverse().map(x => brShort(x.c.start)), { cls: 'gray' })}</div>
        <div class="card pad"><div class="chart-head"><b>Voos por ciclo</b></div>
          ${sixT.map((x, i) => `<div style="display:flex;gap:12px;padding:7px 0;border-top:${i ? '1px solid var(--border)' : '0'}"><span class="muted" style="width:14px">${i + 1}</span><span style="flex:1">${cycleLabel(x.c)}</span><b>${x.t.voos}</b><span class="muted" style="width:64px;text-align:right">${hhmm(x.t.min)}h</span></div>`).join('')}</div>
      </div>`;
  }
  function waText(s) {
    const r = regOf(s), c = cycleOf(s);
    const upto = regsEntre(c.start, s);
    const v = upto.reduce((a, x) => a + regVoos(x), 0), m = upto.reduce((a, x) => a + regMin(x), 0);
    return `${dowName(s)} – ${br(s)} 🚁\n\n• Voos de 30min: ${r.v30}\n• Voos de 45min: ${r.v45}\n• Total Horas Dia: ${hhmm(regMin(r))}h\n\nTotal Horas Ciclo: ${hhmm(m)}h\nTotal Voos Ciclo: ${v}`;
  }
  function dayModal(date) {
    const r = regManual(date) || { date, v30: 0, v45: 0, priv: 0, doorsOn: 0, canc: 0, obs: '' };
    const num = (n, l) => `<div><label class="f">${l}</label><input class="input" type="number" min="0" name="${n}" value="${r[n]}"></div>`;
    modal('Registrar operação', 'Um registro por dia de operação.', `<form id="dayForm">
        <div class="field"><label class="f">Data da operação</label><input class="input" type="date" name="date" value="${date}" required></div>
        <div class="row2">${num('v30', 'Voos de 30 min')}${num('v45', 'Voos de 45 min')}</div>
        <div class="row2">${num('priv', 'Voos privados')}${num('doorsOn', 'Voos Doors On')}</div>
        <div class="row2" style="margin-bottom:4px">${num('canc', 'Voos cancelados')}</div><p class="muted small" style="margin:0 0 14px">Não entram no total nem nas horas.</p>
        <div class="field"><label class="f">Observações (opcional)</label><textarea class="input" name="obs">${esc(r.obs)}</textarea></div>
        <p class="small" id="dayAuto" style="color:var(--amber);margin:0 0 12px;display:none">Este dia já tem voos FINALIZADOS na Programação: os números dele são calculados automaticamente e este registro manual não será usado.</p>
        <div class="summary" id="daySum"></div>
        <div class="actions"><button type="button" class="btn" data-x>Cancelar</button><button class="btn primary">Salvar</button></div></form>`,
    (m, close) => {
      const f = m.querySelector('#dayForm');
      const read = () => ({ date: f.date.value, v30: +f.v30.value || 0, v45: +f.v45.value || 0, priv: +f.priv.value || 0, doorsOn: +f.doorsOn.value || 0, canc: +f.canc.value || 0, obs: f.obs.value.trim() });
      const upd = () => {
        const x = read(); if (!x.date) return;
        m.querySelector('#dayAuto').style.display = regAuto(x.date) ? 'block' : 'none';
        const c = cycleOf(x.date); const others = regsEntre(c.start, c.end).filter(o => o.date !== x.date);
        const cv = others.reduce((a, o) => a + regVoos(o), 0) + regVoos(x), cm = others.reduce((a, o) => a + regMin(o), 0) + regMin(x);
        const cc = others.reduce((a, o) => a + o.canc, 0) + x.canc;
        m.querySelector('#daySum').innerHTML = `<div><small>Voos do dia</small><b>${regVoos(x)}</b></div><div><small>Horas do dia</small><b>${hhmm(regMin(x))}h</b></div>
          <div><small>Voos do ciclo</small><b>${cv}</b></div><div><small>Horas do ciclo</small><b>${hhmm(cm)}h</b></div>
          <div><small>Cancelados no dia</small><b>${x.canc}</b></div><div><small>Cancelados no ciclo</small><b>${cc}</b></div>`;
      };
      f.oninput = upd; upd();
      f.date.onchange = () => { const e = regManual(f.date.value); if (e) ['v30', 'v45', 'priv', 'doorsOn', 'canc', 'obs'].forEach(k => f[k].value = e[k]); upd(); };
      f.onsubmit = e => {
        e.preventDefault(); const x = read();
        acaoOps({ tipo: 'registro_salvar', registro: x, dataAntiga: date }, 'Registro salvo para todos').then(r => { if (r) close(); });
      };
    });
  }
  function bindVoos(root) {
    root.querySelectorAll('[data-cy]').forEach(b => b.onclick = () => { voosCycle = shiftCycle(voosCycle, +b.dataset.cy); render(); });
    root.querySelector('#newDay').onclick = () => dayModal(today());
    root.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => dayModal(b.dataset.edit));
    root.querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
      if (!confirm(`Excluir o registro de ${br(b.dataset.del)}?`)) return;
      acaoOps({ tipo: 'registro_excluir', date: b.dataset.del }, 'Registro excluído');
    });
    root.querySelectorAll('[data-prog]').forEach(b => b.onclick = () => { progDate = b.dataset.prog; location.hash = '#/programacao'; });
    root.querySelectorAll('[data-wa]').forEach(b => b.onclick = () => {
      const t = waText(b.dataset.wa);
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast('Texto copiado para o WhatsApp'), () => { prompt('Copie o texto:', t); });
    });
  }

  // ---------- Escala ----------
  let escTab = 'op', escMonth = monthKey(today()), escMode = 'full', escPerson = null, escDate = today();
  function pageEscala() {
    const head = `<div class="page-head"><div><h1>Escala de funcionários</h1><p>${escTab === 'op' ? 'Operação · calendário mensal, semana começa no domingo.' : 'Gestão, Coordenação do Terminal e Vendas · edição dia a dia.'}</p></div>
        <button class="btn" id="teamBtn">${icon('users')} Equipe</button></div>
      <div class="tabs"><button data-tab="op" class="${escTab === 'op' ? 'on' : ''}">Operação · mensal</button><button data-tab="daily" class="${escTab === 'daily' ? 'on' : ''}">Demais setores · diária</button></div>`;
    return head + (escTab === 'op' ? escalaMensal() : escalaDiaria());
  }
  function escalaMensal() {
    const ops = bySetor('operacao');
    if (!escPerson || !ops.find(p => p.id === escPerson)) escPerson = ops[0]?.id;
    const k = escMonth, n = daysInMonth(k), first = parse(`${k}-01`).getDay(), td = today();
    const cells = [];
    for (let i = 0; i < first; i++) cells.push('<div class="day out"></div>');
    const conflicts = [];
    for (let d = 1; d <= n; d++) {
      const s = `${k}-${pad(d)}`, day = DB.escalaOp[s] || {};
      const defined = ops.filter(p => day[p.id]);
      const working = defined.filter(p => day[p.id].s === 'T').length;
      if (defined.length && !working) conflicts.push(s);
      let inner = '';
      if (escMode === 'full') {
        inner = defined.map(p => { const e = day[p.id]; return `<div class="chip ${e.s} ${e.obs ? 'obs' : ''}" title="${esc(e.obs)}">${esc(p.name)}${e.s === 'V' ? ' · Férias' : e.s === 'M' ? ' · Disp. méd.' : ''}</div>`; }).join('');
        if (defined.length) inner += `<div class="count ${working ? '' : 'warn'}">${working ? `${working} trabalhando` : '⚠ ninguém trabalhando'}</div>`;
      } else {
        const e = day[escPerson];
        if (e) inner = `<div class="chip big-chip ${e.s}">${ESC[e.s]}</div>${e.obs ? `<div class="small muted">${esc(e.obs)}</div>` : ''}`;
      }
      cells.push(`<div class="day" data-day="${s}"><span class="num ${s === td ? 'today' : ''}">${d}</span>${inner}</div>`);
    }
    while (cells.length % 7) cells.push('<div class="day out"></div>');
    const resumo = ops.map(p => {
      const c = { T: 0, F: 0, V: 0, M: 0 };
      for (let d = 1; d <= n; d++) { const e = DB.escalaOp[`${k}-${pad(d)}`]?.[p.id]; if (e) c[e.s]++; }
      return `<tr><td>${esc(p.name)}</td><td>${c.T}</td><td>${c.F}</td><td>${c.V}</td><td>${c.M}</td></tr>`;
    }).join('');
    return `<div class="cal-bar"><div class="month-nav"><button class="icon-btn ghost" data-m="-1">${icon('left')}</button><b>${monthLabel(k)}</b><button class="icon-btn ghost" data-m="1">${icon('right')}</button></div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          ${escMode === 'ind' ? `<select class="input" id="escPerson" style="width:auto">${ops.map(p => `<option value="${p.id}" ${p.id === escPerson ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}</select>` : ''}
          <div class="toggle"><button data-mode="full" class="${escMode === 'full' ? 'on' : ''}">Escala completa</button><button data-mode="ind" class="${escMode === 'ind' ? 'on' : ''}">Individual</button></div>
          <button class="btn" id="copyPrev">${icon('copyplus')} Copiar mês anterior</button></div></div>
      <div class="cal">${['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(d => `<div class="dow">${d}</div>`).join('')}${cells.join('')}</div>
      <div class="legend"><span><i class="lg-T"></i>Trabalho</span><span><i class="lg-F"></i>Folga</span><span><i class="lg-V"></i>Férias</span><span><i class="lg-M"></i>Dispensa médica</span><span>✎ Observação</span><span>⚠ Conflito</span></div>
      <div class="grid g2" style="gap:32px">
        <div><div class="section-title" style="margin-top:0">Resumo do mês</div><div class="card"><table class="tbl"><thead><tr><th>Funcionário</th><th>Trabalho</th><th>Folgas</th><th>Férias</th><th>Disp. méd.</th></tr></thead><tbody>${resumo || '<tr><td colspan="5" class="muted">Ninguém no setor Operação.</td></tr>'}</tbody></table></div></div>
        <div><div class="section-title" style="margin-top:0">Conflitos (${conflicts.length})</div>
          ${conflicts.length ? `<div class="list">${conflicts.map(s => `<div class="item"><div class="grow">${longDate(s)}</div><span class="muted small">Ninguém da Operação trabalhando</span></div>`).join('')}</div>` : '<div class="empty">Nenhum conflito de escala neste mês.</div>'}</div>
      </div>`;
  }
  function opDayModal(s) {
    const ops = bySetor('operacao'); const day = DB.escalaOp[s] || {};
    const opts = [['', 'Não escalado'], ['T', 'Trabalho'], ['F', 'Folga'], ['V', 'Férias'], ['M', 'Disp. médica']];
    modal(`Escala · ${longDate(s)}`, 'Operação — defina a situação de cada funcionário neste dia.', `<form id="opForm">
        ${ops.map(p => `<div class="person-card" data-p="${p.id}"><div class="ph">${esc(p.name)}</div>
          <div class="seg5">${opts.map(([v, l]) => `<button type="button" data-v="${v}" class="${(day[p.id]?.s || '') === v ? 'on' : ''}">${l}</button>`).join('')}</div>
          <input class="input" name="obs-${p.id}" placeholder="Observação (opcional)" value="${esc(day[p.id]?.obs || '')}"></div>`).join('')}
        <div class="actions"><button type="button" class="btn" data-x>Cancelar</button><button class="btn primary">Salvar</button></div></form>`,
    (m, close) => {
      m.querySelectorAll('.seg5 button').forEach(b => b.onclick = () => { b.parentElement.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); });
      m.querySelector('#opForm').onsubmit = e => {
        e.preventDefault(); const out = {};
        m.querySelectorAll('[data-p]').forEach(card => {
          const v = card.querySelector('.seg5 .on')?.dataset.v; const obs = card.querySelector('input').value.trim();
          if (v) out[card.dataset.p] = { s: v, obs };
        });
        DB.escalaOp[s] = out; close(); save();
      };
    });
  }
  function escalaDiaria() {
    const s = escDate;
    const opts = [['N', 'Não informado'], ['T', 'Trabalho'], ['F', 'Folga'], ['V', 'Férias'], ['M', 'Dispensa médica']];
    const secs = SETOR_ORDER.filter(x => x !== 'operacao').map(sec => {
      const ps = bySetor(sec); if (!ps.length) return '';
      return `<div class="card" style="margin-bottom:16px"><div class="sector-head">${SETORES[sec]}</div>${ps.map(p => {
        const e = dailyStatus(p.id, s); const st = e?.s || 'N';
        return `<div class="person-card"><div class="ph">${esc(p.name)}<span class="muted small">${st === 'N' ? 'Não informado' : ESC[st]}</span></div>
          <div class="seg5">${opts.map(([v, l]) => `<button data-ds="${p.id}" data-v="${v}" class="${st === v ? 'on' : ''}">${l}</button>`).join('')}</div>
          <label class="f small">OBSERVAÇÕES</label><textarea class="input" data-dobs="${p.id}" placeholder="Alteração de horário, saída antecipada, atraso...">${esc(e?.obs || '')}</textarea></div>`;
      }).join('')}</div>`;
    }).join('');
    const hist = [];
    Object.keys(DB.escalaDiaria).sort().reverse().forEach(d => {
      Object.entries(DB.escalaDiaria[d]).sort((a, b) => pname(a[0]).localeCompare(pname(b[0]))).forEach(([id, e]) => { if (person(id)) hist.push([d, id, e]); });
    });
    return `<div class="daily-grid"><div>
        <div class="datebar" style="margin-bottom:12px"><label class="f" style="margin:0">Data</label><input type="date" class="input" id="escDate" value="${s}"><button class="icon-btn" data-dn="-1">${icon('left')}</button><button class="icon-btn" data-dn="1">${icon('right')}</button></div>
        <p style="font-weight:500;margin:0 0 16px">${longDate(s)}</p>${secs || '<div class="empty">Nenhum funcionário nos demais setores.</div>'}</div>
      <div><div class="section-title" style="margin-top:0">Histórico (últimos registros)</div>
        ${hist.length ? `<div class="list hist">${hist.slice(0, 40).map(([d, id, e]) => `<div class="item"><span class="muted">${brShort(d)}</span><span class="grow">${esc(pname(id))}</span><span class="muted small">${ESC[e.s]}${e.obs ? ' · ✎' : ''}</span></div>`).join('')}</div>` : '<div class="empty">Sem registros.</div>'}</div></div>`;
  }
  function teamModal() {
    const body = () => `<div class="card" id="teamList">${DB.team.map(p => `<div class="team-row" data-id="${p.id}"><span class="nm">${esc(p.name)}</span>
        <select class="input" data-setor>${SETOR_ORDER.map(s => `<option value="${s}" ${p.setor === s ? 'selected' : ''}>${SETORES[s]}</option>`).join('')}</select>
        <button class="icon-btn ghost" data-ren aria-label="Renomear">${icon('pencil')}</button><button class="icon-btn ghost" data-rm aria-label="Remover">${icon('trash')}</button></div>`).join('')}</div>
      <form id="addP" class="row2" style="margin-top:16px;margin-bottom:10px"><input class="input" name="nm" placeholder="Nome do novo funcionário" required><select class="input" name="setor">${SETOR_ORDER.map(s => `<option value="${s}" ${s === 'operacao' ? 'selected' : ''}>${SETORES[s]}</option>`).join('')}</select></form>
      <button class="btn primary" form="addP">Adicionar</button>`;
    modal('Equipe', 'Adicione, edite ou remova funcionários e defina o setor de cada um. Operação usa a escala mensal; os demais setores, a escala diária.', '<div id="teamBody"></div>', m => {
      const draw = () => {
        m.querySelector('#teamBody').innerHTML = body();
        m.querySelectorAll('.team-row').forEach(row => {
          const p = person(row.dataset.id);
          row.querySelector('[data-setor]').onchange = e => { p.setor = e.target.value; save(); draw(); };
          row.querySelector('[data-ren]').onclick = () => { const n = prompt('Nome do funcionário:', p.name); if (n && n.trim()) { p.name = n.trim(); save(); draw(); } };
          row.querySelector('[data-rm]').onclick = () => { if (confirm(`Remover ${p.name} da equipe?`)) { DB.team = DB.team.filter(t => t.id !== p.id); save(); draw(); } };
        });
        m.querySelector('#addP').onsubmit = e => { e.preventDefault(); const f = e.target; DB.team.push({ id: uid(), name: f.nm.value.trim(), setor: f.setor.value }); save(); draw(); };
      };
      draw();
    });
  }
  function bindEscala(root) {
    root.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { escTab = b.dataset.tab; render(); });
    root.querySelector('#teamBtn').onclick = teamModal;
    if (escTab === 'op') {
      root.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { escMonth = addMonths(escMonth, +b.dataset.m); render(); });
      root.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => { escMode = b.dataset.mode; render(); });
      const sel = root.querySelector('#escPerson'); if (sel) sel.onchange = () => { escPerson = sel.value; render(); };
      root.querySelectorAll('[data-day]').forEach(c => c.onclick = () => opDayModal(c.dataset.day));
      root.querySelector('#copyPrev').onclick = () => {
        const prev = addMonths(escMonth, -1);
        const has = Object.keys(DB.escalaOp).some(d => d.startsWith(prev) && Object.keys(DB.escalaOp[d]).length);
        if (!has) return toast(`Não há escala em ${monthLabel(prev)} para copiar`);
        if (!confirm(`Copiar a escala de ${monthLabel(prev)} para ${monthLabel(escMonth)}? Os dias já preenchidos serão substituídos.`)) return;
        for (let d = 1; d <= daysInMonth(escMonth); d++) {
          const src = DB.escalaOp[`${prev}-${pad(d)}`];
          if (src) DB.escalaOp[`${escMonth}-${pad(d)}`] = JSON.parse(JSON.stringify(src));
        }
        save(); toast('Escala copiada');
      };
    } else {
      root.querySelector('#escDate').onchange = e => { if (e.target.value) { escDate = e.target.value; render(); } };
      root.querySelectorAll('[data-dn]').forEach(b => b.onclick = () => { escDate = addDays(escDate, +b.dataset.dn); render(); });
      root.querySelectorAll('[data-ds]').forEach(b => b.onclick = () => {
        const day = DB.escalaDiaria[escDate] = DB.escalaDiaria[escDate] || {};
        if (b.dataset.v === 'N') delete day[b.dataset.ds];
        else day[b.dataset.ds] = { s: b.dataset.v, obs: day[b.dataset.ds]?.obs || '' };
        save();
      });
      root.querySelectorAll('[data-dobs]').forEach(t => t.onchange = () => {
        const day = DB.escalaDiaria[escDate] = DB.escalaDiaria[escDate] || {};
        const id = t.dataset.dobs;
        if (!day[id]) { if (!t.value.trim()) return; day[id] = { s: 'T', obs: '' }; }
        day[id].obs = t.value.trim(); save();
      });
    }
  }

  // ---------- Câmeras ----------
  let camCycle = cycleOf(today());
  function pageCameras() {
    const k = camCycle, isCur = k.start === cycleOf(today()).start, sales = salesOf(k).sort((a, b) => b.date.localeCompare(a.date));
    const qtd = sales.reduce((a, v) => a + v.qtd, 0), valor = sales.reduce((a, v) => a + v.valor, 0);
    const gp = sales.filter(v => v.modelo === 'GoPro').reduce((a, v) => a + v.qtd, 0), c360 = qtd - gp;
    const rank = sellerRank(k), anySale = rank.some(r => r.qtd > 0);
    const max = Math.max(1, ...rank.map(r => r.valor)), maxQ = Math.max(1, ...rank.map(r => r.qtd));
    const ciclos = [-5, -4, -3, -2, -1, 0].map(n => shiftCycle(k, n));
    return `<div class="page-head"><div><h1>Venda de câmeras</h1><p>GoPro e 360° · comissão automática de 10% sobre o valor vendido.</p></div>
        ${pode('venda') || window.SEED_DEV ? `<button class="btn primary" id="newSale">${icon('plus')} Registrar venda</button>` : ''}</div>
      <div class="period"><button class="icon-btn ghost" data-cm="-1">${icon('left')}</button><div class="mid">Ciclo ${cycleLabel(k)}<small>${isCur ? 'Ciclo atual' : 'Ciclo selecionado'}</small></div><button class="icon-btn ghost" data-cm="1">${icon('right')}</button></div>
      <div class="section-title">Indicadores do ciclo</div>
      <div class="grid g3">
        <div class="card pad stat"><div class="label">Câmeras vendidas</div><div class="value">${qtd}</div><div class="sub">GoPro: ${gp} · Câmera 360°: ${c360}</div></div>
        <div class="card pad stat"><div class="label">Total de vendas</div><div class="value">${money(valor)}</div></div>
        <div class="card pad stat"><div class="label">Comissão da equipe</div><div class="value">${money(valor * 0.1)}</div></div>
      </div>
      <div class="grid g2" style="gap:32px">
        <div><div class="section-title">Ranking de vendedores do ciclo</div><div class="card pad">${anySale ? rank.map((r, i) => rankRow(r, i, max)).join('') : '<div class="empty">Nenhuma venda neste ciclo.</div>'}</div></div>
        <div><div class="section-title">Comissão individual</div><div class="card"><table class="tbl"><thead><tr><th>Vendedor</th><th>Un.</th><th>Vendido</th><th>Comissão</th></tr></thead>
          <tbody>${rank.map(r => `<tr><td>${esc(r.name)}</td><td>${r.qtd}</td><td>${money(r.valor)}</td><td><b>${money(r.com)}</b></td></tr>`).join('')}</tbody></table></div></div>
      </div>
      <div class="section-title">Comparativo de desempenho</div>
      <div class="grid g2">
        <div class="card pad"><div class="chart-head"><b>Câmeras vendidas por funcionário</b></div>
          ${anySale ? rank.slice().sort((a, b) => b.qtd - a.qtd).map((r, i) => `<div class="rank-row"><div class="top-line"><span class="pos">${i + 1}</span><span class="name">${esc(r.name)}</span><span class="amt">${r.qtd} un.<span class="un">${money(r.com)}</span></span></div><div class="track"><div class="fill" style="width:${(r.qtd / maxQ) * 100}%"></div></div></div>`).join('') : '<div class="empty">Sem vendas para comparar.</div>'}</div>
        <div class="card pad"><div class="chart-head"><b>Faturamento · últimos 6 ciclos</b></div>
          ${bars(ciclos.map((c, i) => { const v = salesOf(c).reduce((a, x) => a + x.valor, 0); return { v, cur: i === 5, tip: `${cycleLabel(c)}: ${money(v)}` }; }), ciclos.map(c => brShort(c.start)), { cls: 'gray' })}</div>
      </div>
      <div class="section-title">Vendas registradas</div>
      ${sales.length ? `<div class="list">${sales.map(v => `<div class="item"><div class="grow"><div class="title">${v.qtd} × ${MODELOS[v.modelo]} · ${money(v.valor)}</div>
          <div class="meta">${br(v.date)} · ${esc(pname(v.vendedor))} · comissão ${money(v.valor * 0.1)}</div></div>
          ${pode('venda') || window.SEED_DEV ? `<button class="icon-btn ghost" data-edit="${v.id}" aria-label="Editar">${icon('pencil')}</button><button class="icon-btn ghost" data-del="${v.id}" aria-label="Excluir">${icon('trash')}</button>` : ''}</div>`).join('')}</div>`
        : `<div class="empty">Nenhuma venda registrada no ciclo ${cycleLabel(k)}.</div>`}`;
  }
  function saleModal(id) {
    const v = vendas().find(x => x.id === id) || { date: today() >= camCycle.start && today() <= camCycle.end ? today() : camCycle.start, modelo: 'GoPro', vendedor: DB.team[0]?.id, qtd: 1, valor: 0 };
    modal(id ? 'Editar venda' : 'Registrar venda', 'Informe o valor total efetivamente vendido.', `<form id="saleForm">
        <div class="row2"><div><label class="f">Data da venda</label><input class="input" type="date" name="date" value="${v.date}" required></div>
          <div><label class="f">Modelo da câmera</label><select class="input" name="modelo">${Object.entries(MODELOS).map(([k, l]) => `<option value="${k}" ${v.modelo === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div></div>
        <div class="field"><label class="f">Funcionário vendedor</label><select class="input" name="vendedor">${DB.team.map(t => `<option value="${t.id}" ${v.vendedor === t.id ? 'selected' : ''}>${esc(t.name)}</option>`).join('')}</select></div>
        <div class="row2"><div><label class="f">Quantidade de câmeras</label><input class="input" type="number" min="1" name="qtd" value="${v.qtd}"></div>
          <div><label class="f">Valor total vendido (R$)</label><input class="input" name="valor" inputmode="decimal" placeholder="0,00" value="${v.valor ? String(v.valor.toFixed(2)).replace('.', ',') : ''}"></div></div>
        <div class="commission">Comissão (10%) <b id="com">R$ 0,00</b></div>
        <div class="actions"><button type="button" class="btn" data-x>Cancelar</button><button class="btn primary">Salvar</button></div></form>`,
    (m, close) => {
      const f = m.querySelector('#saleForm');
      const val = () => +String(f.valor.value).replace(/\./g, '').replace(',', '.') || 0;
      const upd = () => { m.querySelector('#com').textContent = money(val() * 0.1); };
      f.oninput = upd; upd();
      f.onsubmit = e => {
        e.preventDefault();
        if (val() <= 0) return toast('Informe o valor vendido');
        const data = { id: id || uid(), date: f.date.value, modelo: f.modelo.value, vendedor: f.vendedor.value, qtd: Math.max(1, +f.qtd.value || 1), valor: val() };
        const btn = f.querySelector('.primary'); btn.disabled = true;
        acaoOps({ tipo: 'venda_salvar', venda: data }, 'Venda salva').then(r => { btn.disabled = false; if (r) { camCycle = cycleOf(data.date); close(); render(); } });
      };
    });
  }
  function bindCameras(root) {
    root.querySelectorAll('[data-cm]').forEach(b => b.onclick = () => { camCycle = shiftCycle(camCycle, +b.dataset.cm); render(); });
    const nova = root.querySelector('#newSale'); if (nova) nova.onclick = () => saleModal();
    root.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => saleModal(b.dataset.edit));
    root.querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
      if (!confirm('Excluir esta venda?')) return;
      acaoOps({ tipo: 'venda_excluir', vendaId: b.dataset.del }, 'Venda excluída');
    });
  }

  // ---------- Painel da TV ----------
  function tvTotais(s) {
    const c = cycleOf(s), t = cycleTotals(c);
    return `<div class="tv-totais">
      <div class="tv-stat">${icon('heli')}<div><div class="k">Total de voos do ciclo</div><div class="v">${t.voos}</div></div></div>
      <div class="tv-stat">${icon('clock')}<div><div class="k">Horas voadas no ciclo</div><div class="v">${hhmm(t.min)}h</div></div></div>
      <div class="tv-ciclo">Ciclo ${cycleLabel(c)}</div></div>`;
  }
  function pagePainel() {
    const s = today();
    return `<div class="tv-top"><div class="sky"></div><a href="${HUB}" title="Menu principal"><img class="logo" src="brand/vertical-rio-logo-black.png" alt="VERTICAL.RIO"></a><span class="brand-sep" style="position:relative"></span><span class="ttl">DASHBOARD</span>
        <div class="clock">${clockHTML()}</div></div>
      <div class="tv-main"><div>${flightBoard(s, false)}${tvTotais(s)}</div><div>${escalaDia(s, false)}</div></div>`;
  }

  // ---------- Operadores (login, cadastro e exclusão) ----------
  let OPERS = null, operErro = null;
  const PERFIS = { adm: 'Administrador', gestao: 'Gestão', operacional: 'Operacional', balcao: 'Balcão' };
  const PERFIS_DESC = {
    adm: 'controle completo: voos, PAX, avisos, escala e comissões, histórico, usuários e configurações',
    gestao: 'visualização geral: voos, passageiros, resultados, escala, comissões e histórico, sem alterar',
    operacional: 'cadastra, edita e gerencia voos, PAX, avisos (Central) e registros de voos',
    balcao: 'consulta voos e passageiros, faz o check-in, troca a cor da pulseira e ajusta horário e PAX no Dashboard; não altera status nem vê os indicadores do ciclo'
  };
  const perfilDe = o => (PERFIS[o.perfil] ? o.perfil : o.admin ? 'adm' : o.auditor ? 'gestao' : 'operacional');
  const perfilBody = v => ({ perfil: v });
  const quando = iso => { if (!iso) return 'nunca entrou'; const d = new Date(iso); return `último acesso ${d.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })} ${d.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' })}`; };
  async function loadOpers() {
    try { OPERS = (await api('/operadores')).operadores; operErro = null; } catch (e) { OPERS = []; operErro = e.message; }
    render();
  }
  function pageOperadores() {
    const head = `<div class="page-head"><div><h1>Usuários e permissões</h1><p>Cada pessoa tem login próprio. Não use contas compartilhadas. Cada usuário vê só o que o perfil dele permite, e os acessos e alterações ficam no histórico.</p></div></div>`;
    if (!OPS.operador) {
      return `${head}<div class="op-login card pad">
        <h2 style="margin:0 0 4px;font-size:20px">Entrar</h2><p class="muted" style="margin:0 0 18px">Use o nome e o PIN que o administrador cadastrou para você.</p>
        <form id="opPageLogin">
          <div class="field"><label class="f" for="lgNome">Nome</label><input id="lgNome" class="input" name="nome" autocomplete="username" required></div>
          <div class="field"><label class="f" for="lgPin">PIN ou senha</label><input id="lgPin" class="input" name="pin" type="password" autocomplete="current-password" required></div>
          <p id="lgErr" class="small" style="color:var(--red);min-height:16px;margin:0 0 8px"></p>
          <button class="btn primary" style="width:100%;justify-content:center">Entrar</button>
        </form>
        ${OPS.erro ? `<p class="small" style="color:var(--red);margin:12px 0 0">Sem conexão com o servidor: ${esc(OPS.erro)}</p>` : ''}</div>`;
    }
    const eu = OPS.operador;
    const minha = `<div class="card pad" style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
        ${icon('user')}<div><b>${esc(eu.nome)}</b><div class="muted small">${PERFIS[perfilDe(eu)]}</div></div>
        <button class="btn" id="meuPin" style="margin-left:auto">Alterar meu PIN</button><button class="btn" id="opOut">Sair</button></div>`;
    if (!pode('usuarios')) return `${head}${minha}<div class="empty" style="margin-top:16px">Seu perfil: ${PERFIS_DESC[perfilDe(eu)]}. Só administradores cadastram, alteram e excluem usuários.</div>`;
    if (!OPERS) { loadOpers(); return `${head}${minha}<div class="empty" style="margin-top:16px">Carregando operadores...</div>`; }
    const ativos = OPERS.filter(o => o.ativo).length;
    const porPerfil = Object.entries(PERFIS).map(([k, l]) => { const n = OPERS.filter(o => o.ativo && perfilDe(o) === k).length; return `<div class="card pad"><div class="muted small">${l}</div><div style="font-size:24px;font-weight:700">${n}</div></div>`; }).join('');
    return `${head}${minha}
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin-top:16px">${porPerfil}</div>
      <div class="section-title">Novo usuário</div>
      <form id="novoOp" class="card pad op-form">
        <div><label class="f">Nome</label><input class="input" name="nome" placeholder="Ex.: Veloso" maxlength="40" required></div>
        <div><label class="f">PIN ou senha</label><input class="input" name="pin" type="password" minlength="4" maxlength="32" placeholder="4 a 32 caracteres" required></div>
        <div><label class="f">Confirmar</label><input class="input" name="pin2" type="password" minlength="4" maxlength="32" required></div>
        <div><label class="f">Perfil</label><select class="input" name="perfil">${Object.entries(PERFIS).map(([k, l]) => `<option value="${k}" ${k === 'balcao' ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        <button class="btn primary" style="justify-content:center">${icon('plus')} Cadastrar</button>
      </form>
      <p class="muted small" style="margin:8px 2px 0">${Object.entries(PERFIS).map(([k, l]) => `<b>${l}</b>: ${PERFIS_DESC[k]}.`).join(' ')} <b>Telas públicas</b> (TV da sala de espera): sem login, só horário, produto, pulseira, status e observações marcadas para a TV.</p>
      <div class="section-title">Usuários cadastrados <span>${ativos} ativo${ativos === 1 ? '' : 's'} de ${OPERS.length}</span></div>
      ${operErro ? `<div class="empty">${esc(operErro)}</div>` : `<div class="list">${OPERS.map(o => `<div class="item op-row" data-oid="${o.id}">
          <div class="grow"><div class="title" style="${o.ativo ? '' : 'text-decoration:line-through;color:var(--muted-fg)'}">${esc(o.nome)}${o.id === eu.id ? ' <span class="muted small">(você)</span>' : ''}</div>
            <div class="meta">${o.ativo ? 'Ativo' : 'Desativado'} · ${PERFIS[perfilDe(o)]} · ${quando(o.ultimoAcesso)}</div></div>
          <select class="input" data-operfil style="width:200px" ${o.id === eu.id ? 'disabled' : ''}>${Object.entries(PERFIS).map(([k, l]) => `<option value="${k}" ${perfilDe(o) === k ? 'selected' : ''}>${l}</option>`).join('')}</select>
          <button class="btn" data-opin>Nova senha</button>
          ${o.id === eu.id ? '' : `<button class="btn" data-oativo>${o.ativo ? 'Desativar' : 'Reativar'}</button><button class="btn danger" data-odel>${icon('trash')} Excluir</button>`}
        </div>`).join('')}</div>`}`;
  }
  function pinModal(titulo, desc, comAtual, onOk) {
    modal(titulo, desc, `<form id="pinForm">
        ${comAtual ? '<div class="field"><label class="f">PIN atual</label><input class="input" name="atual" type="password" autocomplete="current-password" required></div>' : ''}
        <div class="field"><label class="f">Novo PIN ou senha</label><input class="input" name="novo" type="password" minlength="4" maxlength="32" placeholder="4 a 32 caracteres" autocomplete="new-password" required></div>
        <div class="field"><label class="f">Confirmar novo PIN</label><input class="input" name="novo2" type="password" autocomplete="new-password" required></div>
        <p class="small" id="pinErr" style="color:var(--red);min-height:16px;margin:0"></p>
        <div class="actions"><button type="button" class="btn" data-x>Cancelar</button><button class="btn primary">Salvar PIN</button></div></form>`,
    (m, close) => {
      const f = m.querySelector('#pinForm');
      f.onsubmit = async e => {
        e.preventDefault();
        if (f.novo.value !== f.novo2.value) { m.querySelector('#pinErr').textContent = 'Os PINs não conferem.'; return; }
        try { await onOk(f.novo.value, comAtual ? f.atual.value : null); close(); } catch (err) { m.querySelector('#pinErr').textContent = err.message; }
      };
    });
  }
  function bindOperadores(root) {
    const lg = root.querySelector('#opPageLogin');
    if (lg) lg.onsubmit = async e => {
      e.preventDefault();
      try {
        const d = await api('/login', { method: 'POST', body: JSON.stringify({ nome: lg.nome.value, pin: lg.pin.value }) });
        try { localStorage.setItem(TOKEN_KEY, d.token); } catch (err) { /* */ }
        OPS.operador = d.operador; OPERS = null; toast(`Olá, ${d.operador.nome}`); render();
      } catch (err) { root.querySelector('#lgErr').textContent = err.message; }
    };
    const oo = root.querySelector('#opOut'); if (oo) oo.onclick = () => { OPERS = null; logoutOp(); };
    const mp = root.querySelector('#meuPin');
    if (mp) mp.onclick = () => pinModal('Alterar meu PIN', 'Informe o PIN atual e o novo.', true, async (novo, atual) => {
      const d = await api('/meu-pin', { method: 'POST', body: JSON.stringify({ atual, novo }) });
      try { localStorage.setItem(TOKEN_KEY, d.token); } catch (err) { /* */ }
      toast('PIN alterado');
    });
    const opCall = async (body, msg) => { try { OPERS = (await api('/operadores', { method: 'POST', body: JSON.stringify(body) })).operadores; toast(msg); render(); } catch (e) { toast(e.message); } };
    const no = root.querySelector('#novoOp');
    if (no) no.onsubmit = e => {
      e.preventDefault();
      if (no.pin.value !== no.pin2.value) return toast('Os PINs não conferem');
      opCall({ op: 'criar', nome: no.nome.value.trim(), pin: no.pin.value, ...perfilBody(no.perfil.value) }, `Usuário ${no.nome.value.trim()} cadastrado`);
    };
    root.querySelectorAll('[data-oid]').forEach(row => {
      const id = row.dataset.oid, o = OPERS.find(x => x.id === id);
      row.querySelector('[data-operfil]').onchange = e => opCall({ op: 'perfil', id, ...perfilBody(e.target.value) }, 'Permissão atualizada');
      row.querySelector('[data-opin]').onclick = () => (o.id === OPS.operador.id ? mp.click()
        : pinModal(`Novo PIN · ${o.nome}`, 'O operador passa a entrar com este PIN. Sessões abertas com o PIN antigo são encerradas.', false, novo =>
          api('/operadores', { method: 'POST', body: JSON.stringify({ op: 'pin', id, pin: novo }) }).then(d => { OPERS = d.operadores; toast('PIN redefinido'); render(); })));
      const at = row.querySelector('[data-oativo]');
      if (at) at.onclick = () => opCall({ op: 'ativo', id, ativo: !o.ativo }, o.ativo ? 'Usuário desativado: o acesso foi revogado na hora' : 'Usuário reativado');
      const del = row.querySelector('[data-odel]');
      if (del) del.onclick = () => { if (confirm(`Excluir o usuário ${o.nome}? Ele não poderá mais entrar. O que ele já fez continua no histórico.`)) opCall({ op: 'excluir', id }, `Usuário ${o.nome} excluído`); };
    });
  }

  // ---------- Menu lateral (todas as telas internas): Dashboard no topo + grupos em dropdown ----------
  // o Início É o Dashboard; o card "Dashboard" saiu do menu e #/dashboard volta para o início
  const DASH_ICO = "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"3\" y=\"3\" width=\"7\" height=\"9\" rx=\"1.5\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"5\" rx=\"1.5\"/><rect x=\"14\" y=\"12\" width=\"7\" height=\"9\" rx=\"1.5\"/><rect x=\"3\" y=\"16\" width=\"7\" height=\"5\" rx=\"1.5\"/></svg>";
  const MENU_GRUPOS = [["telas", "Telas da sala", [["tv_sala_espera.html", "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"6\" y=\"3\" width=\"12\" height=\"18\" rx=\"2\"/><path d=\"M10 18h4\"/></svg>", "Painel de Status", "TV da Sala de Espera", false, true], ["central_avisos.html", "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z\"/><path d=\"M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13\"/></svg>", "Central de Avisos", "Chamada de passageiros por voz", false, true]]], ["operacao", "Operação", [["#/programacao", "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"17\" rx=\"2\"/><path d=\"M3 9h18M8 2v4M16 2v4M7 13h4M7 17h7\"/></svg>", "Programação", "Cadastro de voos, PAX e status", false, false], ["#/voos", "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M3 3v18h18\"/><path d=\"M7 15l4-4 3 3 5-6\"/></svg>", "Voos", "Resultados e horas por ciclo", false, false], ["#/escala", "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"9\" cy=\"8\" r=\"3.5\"/><path d=\"M2.5 20a6.5 6.5 0 0 1 13 0\"/><circle cx=\"17.5\" cy=\"9\" r=\"2.5\"/><path d=\"M16 14.2a5 5 0 0 1 6 4.8\"/></svg>", "Escala", "Escala mensal e diária da equipe", false, false], ["#/cameras", "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 7h3l2-2.5h6L17 7h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z\"/><circle cx=\"12\" cy=\"13\" r=\"3.5\"/></svg>", "Câmeras", "Vendas e comissão de GoPro e 360°", false, false]]], ["admin", "Administração", [["#/historico", "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M3 12a9 9 0 1 0 3-6.7L3 8\"/><path d=\"M3 3v5h5M12 7v5l3 2\"/></svg>", "Histórico", "Quem alterou o quê e quando", true, false], ["#/operadores", "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"8\" cy=\"15\" r=\"4\"/><path d=\"M11 12l8-8M16 7l3 3M14 9l2 2\"/></svg>", "Usuários", "Logins, perfis e permissões", true, false]]]];
  // telas que dependem de permissão (as demais: qualquer usuário logado)
  const PERM_ROTA = { voos: 'registros', escala: 'dados', cameras: 'dados', historico: 'historico', 'central_avisos.html': 'aviso' };
  const podeRota = r => window.SEED_DEV || !PERM_ROTA[r] || pode(PERM_ROTA[r]);
  const SIDE_KEY = 'vro-side-grupos';
  const sideState = () => { try { return JSON.parse(localStorage.getItem(SIDE_KEY)) || {}; } catch (e) { return {}; } };
  let sideAberto = false; // celular: menu recolhido atrás do botão "Menu"
  function sidebar(r) {
    const st = sideState();
    const link = ([href, svg, t, s, restrito, hub]) => {
      const on = href === '#/' + r;
      return `<a class="sd-item${on ? ' on' : ''}" href="${hub ? HUB + href : href}"${on ? ' aria-current="page"' : ''} title="${esc(s)}"><span class="sd-ico">${svg}</span><span class="sd-txt">${t}</span>${restrito ? '<span class="sd-cad" title="Acesso restrito">Restrito</span>' : ''}</a>`;
    };
    const grupos = MENU_GRUPOS.map(([id, nome, todos]) => {
      const itens = todos.filter(i => podeRota(i[0].replace(/^#\//, '')));
      if (!itens.length) return '';
      const temAtivo = itens.some(i => i[0] === '#/' + r);
      const aberto = temAtivo || st[id] !== false;
      return `<details class="sd-grp" data-grp="${id}"${aberto ? ' open' : ''}><summary><span>${nome}</span><svg class="sd-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary><div class="sd-lista">${itens.map(link).join('')}</div></details>`;
    }).join('');
    return `<aside class="side${sideAberto ? ' aberto' : ''}" aria-label="Menu principal">
      <button type="button" class="sd-toggle" id="sdToggle" aria-expanded="${sideAberto}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>Menu</button>
      <nav class="sd-nav">
        <a class="sd-item sd-dash${r === '' ? ' on' : ''}" href="#/"${r === '' ? ' aria-current="page"' : ''}><span class="sd-ico">${DASH_ICO}</span><span class="sd-txt">Dashboard</span></a>
        ${grupos}
      </nav></aside>`;
  }
  function bindSidebar(app) {
    app.querySelectorAll('.sd-grp').forEach(d => {
      d.addEventListener('toggle', () => { const st = sideState(); st[d.dataset.grp] = d.open; try { localStorage.setItem(SIDE_KEY, JSON.stringify(st)); } catch (e) { /* */ } });
    });
    const t = app.querySelector('#sdToggle');
    if (t) t.onclick = () => { sideAberto = !sideAberto; t.setAttribute('aria-expanded', sideAberto); t.closest('.side').classList.toggle('aberto', sideAberto); };
    app.querySelectorAll('.sd-item').forEach(a => a.addEventListener('click', () => { sideAberto = false; }));
  }

  // ---------- Router ----------
  const PAGES = {
    '': [pageDashboard, bindDashboard, 'Dashboard · VERTICAL RIO'],
    programacao: [pageProgramacao, bindProgramacao, 'Programação de voos · VERTICAL RIO'],
    voos: [pageVoos, bindVoos, 'Voos · VERTICAL RIO'],
    escala: [pageEscala, bindEscala, 'Escala · VERTICAL RIO'],
    cameras: [pageCameras, bindCameras, 'Câmeras · VERTICAL RIO'],
    historico: [pageHistorico, bindHistorico, 'Histórico · VERTICAL RIO'],
    operadores: [pageOperadores, bindOperadores, 'Operadores · VERTICAL RIO'],
    painel: [pagePainel, null, 'Dashboard · VERTICAL RIO']
  };
  // #/dashboard (endereço antigo) = início
  function route() { const r = location.hash.replace(/^#\/?/, '').split('?')[0]; return PAGES[r] ? r : ''; }
  function render() {
    if (!DB) return;
    const r = route(), app = document.getElementById('app');
    const [page, bind, title] = podeRota(r) ? PAGES[r] : [() => `<div class="page-head"><div><h1>Acesso restrito</h1><p>Seu perfil (${esc(OPS.operador?.perfilNome || '')}) não tem acesso a esta tela. Se precisar, peça a um administrador.</p></div></div>`, null, 'Acesso restrito · VERTICAL RIO'];
    if (/^#\/?dashboard/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search + '#/');
    const y = window.scrollY;
    document.title = title;
    document.body.classList.toggle('tv', r === 'painel');
    app.innerHTML = r === 'painel' ? pagePainel() : `${header(r)}<div class="shell">${sidebar(r)}<main class="wrap ${r === '' ? 'wide' : ''}">${page()}</main></div>`;
    bind && bind(app);
    if (r !== 'painel') bindSidebar(app);
    bindUserMenu();
    window.scrollTo(0, y);
  }
  let lastRoute = null;
  window.addEventListener('hashchange', () => { render(); if (route() !== lastRoute) window.scrollTo(0, 0); lastRoute = route(); });

  function start() {
    DB = load();
    try { if (!localStorage.getItem(KEY)) localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) { /* sem storage */ }
    // Relógio e atualização automática (TV e dashboard)
    let lastMin = '';
    setInterval(() => {
      const n = new Date(), t = `${pad(n.getHours())}:${pad(n.getMinutes())}`;
      document.querySelectorAll('[data-clock]').forEach(el => el.textContent = t);
      if (t !== lastMin) { if (lastMin && (route() === 'painel' || route() === '') && !document.querySelector('.overlay') && !(document.activeElement && document.activeElement.matches('input,select,textarea'))) render(); lastMin = t; }
    }, 1000);
    lastRoute = route();
    render();
    baixaGongo().catch(() => {});
    loadOps(today(), true).then(() => loadCiclos(true)).then(render);
    // servidor: confere a cada 5 s em TODAS as telas (aba visível); o que um operador muda aparece para todos.
    // Só baixa de novo quando algo mudou (rev) e não redesenha enquanto alguém digita ou com janela aberta.
    let pendente = false;
    const atualiza = async () => {
      if (document.hidden) return;
      const r = route();
      const a = await loadOps(r === 'programacao' ? progDate : today());
      const b = await loadCiclos();
      const busy = document.querySelector('.overlay') || (document.activeElement && document.activeElement.matches('input,select,textarea'));
      if (a || b || pendente) { if (busy) pendente = true; else { pendente = false; render(); } }
    };
    setInterval(atualiza, 5000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) atualiza(); });
  }

  // ---------- Senha (versão publicada: dados criptografados em data.enc.js) ----------
  const UNLOCK = 'vro-operacoes-unlock';
  const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  async function decryptSeed(senha) {
    const E = window.SEED_ENC;
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(senha), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: b64(E.salt), iterations: E.iter, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(E.iv) }, key, b64(E.ct));
    return JSON.parse(new TextDecoder().decode(plain));
  }
  function lockScreen() {
    document.title = 'Entrar · VERTICAL RIO';
    document.getElementById('app').innerHTML = `<header class="top"><div class="wrap wide"><a href="${HUB}" title="Menu principal"><img class="logo" src="brand/vertical-rio-logo-black.png" alt="VERTICAL.RIO"></a><span class="brand-sep"></span><span class="brand-sub">Operations Hub</span></div></header>
      <main class="wrap" style="max-width:420px;padding-top:64px">
        <form id="lockForm" class="card pad"><h1 style="font-size:22px;margin:0 0 6px">Entrar</h1><p class="muted" style="margin:0 0 18px">Acesso restrito à equipe da Vertical Rio. Use seu login e senha individuais. Não compartilhe sua senha nem a deixe anotada em local visível.</p>
          <div class="field"><label class="f" for="login">Login</label><input id="login" class="input" name="login" autocomplete="username" autocapitalize="none" spellcheck="false" required autofocus></div>
          <div class="field"><label class="f" for="senha">Senha</label><input id="senha" class="input" name="senha" type="password" autocomplete="current-password" required></div>
          <p id="lockErr" class="small" style="color:var(--red);min-height:18px;margin:0 0 8px"></p>
          <button class="btn primary" style="width:100%;justify-content:center">Entrar</button></form></main>`;
    const f = document.getElementById('lockForm');
    f.onsubmit = async e => {
      e.preventDefault();
      const btn = f.querySelector('button'); btn.disabled = true; btn.textContent = 'Verificando...';
      try {
        // login de operador (qualquer operador cadastrado em Operadores); o servidor devolve a chave dos dados
        const d = await api('/login', { method: 'POST', body: JSON.stringify({ nome: f.login.value.trim(), pin: f.senha.value }) });
        try { localStorage.setItem(TOKEN_KEY, d.token); } catch (err) { /* sem storage */ }
        OPS.operador = d.operador;
        await prepararDados();
        start();
      } catch (err) {
        document.getElementById('lockErr').textContent = err.status === 401 ? 'Login ou senha incorretos.' : (err.message || 'Não foi possível entrar.');
        btn.disabled = false; btn.textContent = 'Entrar'; f.senha.select();
      }
    };
  }
  // escala/comissões: só Gestão e Administrador recebem a chave do servidor. Os demais perfis não guardam
  // esses dados no aparelho (se havia, de outro usuário com acesso, são apagados).
  async function prepararDados() {
    let local = null;
    try { local = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { /* */ }
    if (!pode('dados')) {
      window.SEED = null;
      if (local && !local.restrito) try { localStorage.removeItem(KEY); localStorage.removeItem(UNLOCK); } catch (e) { /* */ }
      return;
    }
    if (local && !local.restrito) return;   // usa as alterações de escala/câmeras já salvas neste aparelho
    const { chave } = await api('/chave');
    window.SEED = await decryptSeed(chave);
    try { localStorage.removeItem(KEY); localStorage.setItem(UNLOCK, window.SEED_ENC.salt); } catch (err) { /* sem storage */ }
  }
  // sempre exige um usuário logado (sessão válida no servidor) antes de abrir qualquer tela
  async function boot() {
    if (window.SEED) { window.SEED_DEV = true; return start(); }   // versão local de desenvolvimento (data.js aberto)
    if (!token()) return lockScreen();
    try {
      const d = await api('/eu');
      OPS.operador = d.operador;
      await prepararDados();
      start();
    } catch (e) {
      if (e.status === 401 || e.status === 403) { try { localStorage.removeItem(TOKEN_KEY); } catch (err) { /* */ } return lockScreen(); }
      lockScreen();
      const el = document.getElementById('lockErr'); if (el) el.textContent = 'Sem conexão com o servidor. Tente de novo em instantes.';
    }
  }
  boot();
})();
