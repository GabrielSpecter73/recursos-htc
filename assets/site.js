/* Recursos grátis do High Ticket Clube. Gerado por tools/recursos.py (fonte: tools/recursos_site.js no YouTube Hub).
   1) repassa os UTMs que chegaram na URL pro botão do trial e pros links internos
   2) botão Copiar dos blocos de código   3) vídeo do YouTube só carrega no clique   4) filtro por tema   5) nome na entrega
   6) buscador da central (18/11/2026): link do Reels, do YouTube (vídeo ou Shorts) ou palavra-chave → o kit certo */
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

    var form = document.querySelector('[data-busca]');
    if (form) buscador(form, document.querySelector('[data-resultado]'));

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

  // ------------------------------------------------------------ buscador
  var FORA = ' de da do das dos e o a os as um uma pra para com no na nos nas em que me meu minha eu se por ou ao como kit '.split(' ');

  function semAcento(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

  function comUtm(href) {
    var u = new URL(href, location.href);
    if (tem) Object.keys(veio).forEach(function (k) { if (k.indexOf('utm_') === 0 || k === 'fp_sid') u.searchParams.set(k, veio[k]); });
    return u.origin === location.origin ? u.pathname + u.search + u.hash : u.toString();
  }

  function qualLink(t) {
    var m = t.match(/(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|shorts\/|live\/|embed\/)|youtu\.be\/)([\w-]{11})/i);
    if (m) return { tipo: 'youtube', id: m[1] };
    m = t.match(/instagram\.com\/(?:[\w.]+\/)?(?:reels?|p|tv)\/([\w-]+)/i);
    if (m) return { tipo: 'reel', id: m[1] };
    if (/tiktok\.com/i.test(t)) return { tipo: 'tiktok' };
    if (/^https?:\/\//i.test(t) || /^www\./i.test(t)) return { tipo: 'outro' };
    return null;
  }

  function procurar(kits, q) {
    var l = qualLink(q);
    if (l && (l.tipo === 'youtube' || l.tipo === 'reel')) {
      var achados = [];
      kits.forEach(function (k) {
        var de = l.tipo === 'youtube' ? k.youtube[l.id] : k.reels[l.id];
        if (de !== undefined) achados.push({ kit: k, de: (l.tipo === 'reel' ? 'Do Reels: ' : 'Do vídeo: ') + de });
      });
      return { link: l, achados: achados };
    }
    if (l) return { link: l, achados: [] };
    var junto = semAcento(q).replace(/[^a-z0-9]/g, '');
    var termos = semAcento(q).split(/[^a-z0-9]+/).filter(function (x) { return x.length > 2 && FORA.indexOf(x) < 0; });
    var res = kits.map(function (k) {
      var pts = 0, tit = semAcento(k.titulo + ' ' + k.tema + ' ' + k.resumo), txt = semAcento(k.texto);
      k.palavras.forEach(function (p) { if (junto === semAcento(p)) pts += 50; });
      termos.forEach(function (x) { if (tit.indexOf(x) >= 0) pts += 3; else if (txt.indexOf(x) >= 0) pts += 1; });
      return { kit: k, pts: pts, de: '' };
    }).filter(function (r) { return r.pts > 0; }).sort(function (a, b) { return b.pts - a.pts; });
    if (res.length && res[0].pts >= 50) res = res.filter(function (r) { return r.pts >= 50; });
    return { link: null, achados: res.slice(0, 3) };
  }

  function el(tag, cls, texto) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (texto) e.textContent = texto;
    return e;
  }

  function cartao(r) {
    var k = r.kit, d = el('div', 'achado');
    d.appendChild(el('p', 'meta', k.tema));
    d.appendChild(el('h3', '', k.titulo));
    if (r.de) d.appendChild(el('p', 'achado-de', r.de.length > 120 ? r.de.slice(0, 117) + '…' : r.de));
    d.appendChild(el('p', 'resumo', k.resumo));
    var acoes = el('p', 'achado-acoes');
    var a = el('a', 'btn btn-g', k.aberto ? 'Abrir o kit' : 'Pegar o kit grátis');
    a.href = comUtm(k.slug + '/');
    var b = el('a', 'btn btn-sec', 'Já sou da comunidade');
    b.href = k.comunidade; b.target = '_blank'; b.rel = 'noopener';
    acoes.appendChild(a); acoes.appendChild(b);
    d.appendChild(acoes);
    if (k.onde) d.appendChild(el('p', 'achado-onde', 'Na comunidade: ' + k.onde + '.'));
    return d;
  }

  function buscador(form, out) {
    var input = form.querySelector('input'), dados = null;
    function carregar() {
      if (dados) return Promise.resolve(dados);
      return fetch('busca.json', { cache: 'no-cache' }).then(function (r) { return r.json(); })
        .then(function (d) { dados = d.kits || []; return dados; });
    }
    function mostrar(q) {
      q = (q || '').trim();
      out.textContent = '';
      if (!q) return;
      carregar().then(function (kits) {
        var r = procurar(kits, q);
        if (r.achados.length) {
          if (!r.link) out.appendChild(el('p', 'achado-titulo', r.achados.length > 1 ? 'Os kits que batem com "' + q + '":' : 'Achei:'));
          r.achados.forEach(function (x) { out.appendChild(cartao(x)); });
        } else {
          var msg = !r.link ? 'Não achei kit com "' + q + '". Tenta outra palavra do vídeo, ou veja todos os kits aqui embaixo.'
            : r.link.tipo === 'tiktok' ? 'Link do TikTok eu ainda não reconheço. Digita a palavra do vídeo (ex.: GROK) ou o assunto.'
            : r.link.tipo === 'outro' ? 'Esse link não é de um Reels nem de um vídeo do YouTube. Cola o link do vídeo ou digita a palavra.'
            : 'Esse vídeo não tem kit grátis. Se ele prometeu um material, digita a palavra que eu falei no vídeo, ou veja todos os kits aqui embaixo.';
          out.appendChild(el('p', 'nada', msg));
        }
      }, function () { out.appendChild(el('p', 'nada', 'Não consegui carregar a busca agora. Veja os kits aqui embaixo.')); });
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      mostrar(input.value);
      try {
        var u = new URL(location.href);
        if (input.value.trim()) u.searchParams.set('q', input.value.trim()); else u.searchParams.delete('q');
        history.replaceState(null, '', u.pathname + u.search);
      } catch (e2) {}
    });
    input.addEventListener('paste', function () { setTimeout(function () { if (qualLink(input.value)) mostrar(input.value); }, 0); });
    var inicial = q.get('q');
    if (inicial) { input.value = inicial; mostrar(inicial); }
  }

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
