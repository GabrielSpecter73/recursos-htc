/* Recursos grátis do High Ticket Clube. Gerado por tools/recursos.py (fonte: tools/recursos_site.js no YouTube Hub).
   1) repassa os UTMs que chegaram na URL pro botão do trial e pros links internos
   2) botão Copiar dos blocos de código   3) vídeo do YouTube só carrega no clique   4) filtro por tema   5) nome na entrega */
(function () {
  var q = new URLSearchParams(location.search);
  var CHAVES = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fp_sid', 'fbclid', 'gclid', 'ttclid'];
  var veio = {}, tem = false;
  CHAVES.forEach(function (k) { var v = q.get(k); if (v) { veio[k] = v; tem = true; } });
  try {
    if (tem) sessionStorage.setItem('htc_utm', JSON.stringify(veio));
    else { veio = JSON.parse(sessionStorage.getItem('htc_utm') || '{}'); tem = Object.keys(veio).length > 0; }
  } catch (e) {}

  function pronto(fn) { if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  pronto(function () {
    if (tem) {
      document.querySelectorAll('a[data-trial]').forEach(function (a) {
        var u = new URL(a.href);
        Object.keys(veio).forEach(function (k) { u.searchParams.set(k, veio[k]); });
        a.href = u.toString();
      });
      document.querySelectorAll('a[data-leva]').forEach(function (a) {
        var u = new URL(a.getAttribute('href'), location.href);
        Object.keys(veio).forEach(function (k) { if (k.indexOf('utm_') === 0 || k === 'fp_sid') u.searchParams.set(k, veio[k]); });
        a.href = u.pathname + u.search + u.hash;
      });
    }

    var nome = (q.get('nome') || q.get('first_name') || '').trim();
    var alvo = document.querySelector('[data-nome]');
    if (nome && alvo) alvo.textContent = ', ' + nome.split(/\s+/)[0].slice(0, 30);

    document.querySelectorAll('[data-yt]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var f = document.createElement('iframe');
        f.src = 'https://www.youtube-nocookie.com/embed/' + a.getAttribute('data-yt') + '?autoplay=1&rel=0';
        f.title = 'Vídeo do YouTube';
        f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        f.allowFullscreen = true;
        a.replaceWith(f);
      });
    });

    var chips = document.querySelectorAll('[data-filtro]');
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        var t = c.getAttribute('data-filtro');
        chips.forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
        document.querySelectorAll('.card[data-tema]').forEach(function (k) {
          k.hidden = !(t === 'todos' || k.getAttribute('data-tema') === t);
        });
      });
    });
  });

  function copiar(texto) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(texto).catch(function () { return copiarVelho(texto); });
    }
    return copiarVelho(texto);
  }

  function copiarVelho(texto) {
    return new Promise(function (ok, erro) {
      var t = document.createElement('textarea');
      t.value = texto; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy') ? ok() : erro(); } catch (e) { erro(e); }
      document.body.removeChild(t);
    });
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.copiar');
    if (!b) return;
    var pre = b.closest('.codigo').querySelector('pre');
    copiar(pre.innerText).then(function () {
      b.textContent = 'Copiado'; b.classList.add('ok');
      setTimeout(function () { b.textContent = 'Copiar'; b.classList.remove('ok'); }, 1600);
    }, function () { b.textContent = 'Selecione e copie'; });
  });
})();
