// Formulář: demo režim neodesílá nic, ostrý režim posílá na endpoint ze site.json (data-endpoint).
(function () {
  document.querySelectorAll('form.formular').forEach(function (f) {
    var stav = f.querySelector('.formular-stav');
    f.addEventListener('submit', function (e) {
      var endpoint = f.getAttribute('data-endpoint');
      var demo = f.getAttribute('data-demo') === '1';
      if (f.querySelector('.past input').value) { e.preventDefault(); return; }   // robot
      if (demo || !endpoint) {
        e.preventDefault();
        stav.textContent = 'Ukážka formulára: nič sa neodosiela. Po spustení webu príde správa na e-mail Martiny Cibuľovej.';
        return;
      }
      e.preventDefault();
      stav.textContent = 'Odosielam…';
      fetch(endpoint, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); f.reset(); stav.textContent = 'Ďakujem, správa bola odoslaná.'; })
        .catch(function () { stav.textContent = 'Odoslanie sa nepodarilo. Napíšte mi prosím e-mailom.'; });
    });
  });
})();

// Filter ponuky + detail v <dialog>
(function () {
  var karty = document.querySelectorAll('.karta'), tl = document.querySelectorAll('.filter button');
  tl.forEach(function (b) { b.addEventListener('click', function () {
    tl.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    var f = b.getAttribute('data-f');
    karty.forEach(function (k) { k.hidden = !(f === 'all' || k.getAttribute('data-typ') === f); });
  }); });
  var dlg = document.getElementById('detail');
  if (!dlg) return;
  document.querySelectorAll('.karta-btn').forEach(function (b) { b.addEventListener('click', function () {
    var id = b.getAttribute('data-id');
    dlg.querySelectorAll('.det').forEach(function (d) { d.hidden = d.getAttribute('data-id') !== id; });
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    dlg.scrollTop = 0;
  }); });
  dlg.querySelector('.zavriet').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  document.querySelectorAll('[data-zaujem]').forEach(function (a) { a.addEventListener('click', function () {
    if (dlg.open) dlg.close();
    var z = document.getElementById('zprava');
    if (z && !z.value) z.value = 'Dobrý deň, mám záujem o: ' + a.getAttribute('data-zaujem') + '.';
  }); });
})();

// Mobil: zbalený seznam (6 karet) + tlačítko
(function () {
  var m = document.getElementById('mriezka'), v = document.getElementById('viac');
  if (!m || !v || !window.matchMedia('(max-width: 44rem)').matches) return;
  m.classList.add('zbalene'); v.hidden = false;
  v.addEventListener('click', function () { m.classList.remove('zbalene'); v.hidden = true; });
  document.querySelectorAll('.filter button').forEach(function (b) { b.addEventListener('click', function () { m.classList.remove('zbalene'); v.hidden = true; }); });
})();
