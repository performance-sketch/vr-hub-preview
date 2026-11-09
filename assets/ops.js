// SERVIDOR DE OPERAÇÃO: voos, PAX, status, pulseiras e avisos vêm do verticalrio-operacoes (Programação)
// e são os mesmos em todas as telas. ?api=http://localhost:8888/api usa um servidor local de testes.
var OPS_API = (new URLSearchParams(location.search).get('api')) || 'https://vr-hub-teste.netlify.app/api'; // /api do vr-hub repassa para o servidor (verticalrio-operacoes)
var OPS_TOKEN = 'vrhub_op_token';
var OPS_PULSEIRAS = { BRANCA: '#f4f2ee', PRETA: '#1c1c1e', AMARELA: '#f5c400', VERDE: '#2e9d4f', AZUL: '#2f6fdf' };
var OPS_PRODUTOS = { DOORS_OFF_30: 'Doors Off 30 min', DOORS_OFF_45: 'Doors Off 45 min', DOORS_ON_30: 'Doors On 30 min' };
// 3.5 — status padronizados: fundo e cor da letra iguais em todas as telas
var OPS_STATUS = ['CONFIRMADO', 'EMBARCANDO', 'VOANDO', 'FINALIZADO', 'ATRASADO', 'CANCELADO', 'A CONFIRMAR'];
var OPS_STATUS_TV = ['CONFIRMADO', 'EMBARCANDO', 'VOANDO', 'ATRASADO']; // únicos que a TV dos passageiros mostra (FINALIZADO, CANCELADO e A CONFIRMAR são só internos)
var OPS_TXT_STATUS = { CONFIRMADO: '#fff', EMBARCANDO: '#fff', VOANDO: '#fff', FINALIZADO: '#000', ATRASADO: '#fff', CANCELADO: '#fff', 'A CONFIRMAR': '#fff' };
var OPS_COR_STATUS = { CONFIRMADO: '#16a34a', EMBARCANDO: '#e6a800', VOANDO: '#2563eb', FINALIZADO: '#ffffff', ATRASADO: '#f97316', CANCELADO: '#dc2626', 'A CONFIRMAR': '#71717a' };
var OPS_FUNDO_STATUS = OPS_COR_STATUS;
var OPS_TIPOS_AVISO = { embarque: 'Embarque autorizado', ultima: 'Última chamada', checkin: 'Check-in aberto', atraso: 'Voo atrasado', cancelado: 'Voo cancelado' };

var OPS = { rev: -1, voos: [], avisos: [], config: { tvVoos: 6 }, operador: null, hoje: null, erro: null, ok: false };

function opsToken() { try { return localStorage.getItem(OPS_TOKEN) || ''; } catch (e) { return ''; } }
function opsApi(path, opts) {
  opts = opts || {};
  var h = { 'Content-Type': 'application/json' }, t = opsToken();
  if (t) h.Authorization = 'Bearer ' + t;
  return fetch(OPS_API + path, { method: opts.method || 'GET', body: opts.body, headers: h }).then(function (r) {
    return r.json().catch(function () { return { erro: 'Resposta inválida do servidor' }; }).then(function (d) {
      if (r.status === 401 && t && path !== '/login') { try { localStorage.removeItem(OPS_TOKEN); } catch (e) {} OPS.operador = null; }
      if (!r.ok) { var e = new Error(d.erro || ('Erro ' + r.status)); e.status = r.status; throw e; }
      return d;
    });
  });
}
// busca o estado do dia; resolve true se mudou
function opsCarregar(forcar) {
  return opsApi('/estado' + (!forcar && OPS.rev >= 0 ? '?rev=' + OPS.rev : '')).then(function (d) {
    OPS.erro = null; OPS.ok = true;
    if (d.igual) return false;
    OPS.rev = d.rev; OPS.voos = d.voos; OPS.avisos = d.avisos || []; OPS.config = d.config || OPS.config; OPS.operador = d.operador; OPS.hoje = d.hoje;
    return true;
  }).catch(function (e) { var mudou = OPS.erro !== e.message; OPS.erro = e.message; return mudou; });
}
// atualização contínua: onChange() a cada mudança; pausa com a aba escondida
function opsAcompanhar(onChange, segundos) {
  var ms = Math.max(2, segundos || 5) * 1000;
  function tick() { if (document.hidden) return; opsCarregar(false).then(function (m) { if (m) onChange(); }); }
  opsCarregar(true).then(onChange);
  setInterval(tick, ms);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) tick(); });
}
function opsAcao(body) {
  if (!opsToken()) return opsLogin().then(function () { return opsAcao(body); });
  return opsApi('/acao', { method: 'POST', body: JSON.stringify(body) }).then(function (r) { return opsCarregar(true).then(function () { return r; }); })
    .catch(function (e) { if (e.status === 401) return opsLogin().then(function () { return opsAcao(body); }); throw e; });
}
function opsSair() { try { localStorage.removeItem(OPS_TOKEN); } catch (e) {} OPS.operador = null; return opsCarregar(true); }

// login de operador (nome + PIN): janela simples, independente do visual de cada tela
// pedidos simultâneos (ex.: voz + aviso na TV ao clicar em Falar) compartilham a mesma janela
var opsLoginPendente = null;
function opsLogin() {
  if (opsLoginPendente) return opsLoginPendente;
  opsLoginPendente = new Promise(function (ok, falha) {
    var v = document.createElement('div');
    v.setAttribute('style', 'position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;z-index:9999;font:16px -apple-system,Inter,Segoe UI,Roboto,sans-serif');
    v.innerHTML = '<form style="background:#fff;color:#1d1d1f;border-radius:18px;padding:28px;width:360px;max-width:92vw;box-shadow:0 30px 80px rgba(0,0,0,.35)">' +
      '<div style="font-size:20px;font-weight:700;margin-bottom:4px">Entrar como operador</div><div style="color:#6e6e73;font-size:14px;margin-bottom:16px">Suas alterações ficam registradas no histórico.</div>' +
      '<label style="display:block;font-size:13px;font-weight:600;margin-bottom:4px">Nome</label><input name="nome" autocomplete="username" required style="width:100%;padding:10px 12px;border:1px solid #d2d2d7;border-radius:10px;font:inherit;margin-bottom:12px">' +
      '<label style="display:block;font-size:13px;font-weight:600;margin-bottom:4px">PIN ou senha</label><input name="pin" type="password" autocomplete="current-password" required style="width:100%;padding:10px 12px;border:1px solid #d2d2d7;border-radius:10px;font:inherit">' +
      '<div data-erro style="color:#d93025;font-size:13px;min-height:18px;margin:8px 0"></div>' +
      '<div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" data-x style="padding:10px 16px;border-radius:10px;border:1px solid #d2d2d7;background:#fff;font:inherit;cursor:pointer">Cancelar</button><button style="padding:10px 16px;border-radius:10px;border:0;background:#1d1d1f;color:#fff;font:inherit;font-weight:600;cursor:pointer">Entrar</button></div></form>';
    document.body.appendChild(v);
    var f = v.querySelector('form'); f.nome.focus();
    v.querySelector('[data-x]').onclick = function () { v.remove(); falha(new Error('Login cancelado')); };
    f.onsubmit = function (e) {
      e.preventDefault();
      opsApi('/login', { method: 'POST', body: JSON.stringify({ nome: f.nome.value, pin: f.pin.value }) }).then(function (d) {
        try { localStorage.setItem(OPS_TOKEN, d.token); } catch (err) {}
        OPS.operador = d.operador; v.remove(); return opsCarregar(true).then(function () { ok(d.operador); });
      }).catch(function (err) { v.querySelector('[data-erro]').textContent = err.message; });
    };
  });
  var limpa = function () { opsLoginPendente = null; };
  opsLoginPendente.then(limpa, limpa);
  return opsLoginPendente;
}
function opsEsc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
