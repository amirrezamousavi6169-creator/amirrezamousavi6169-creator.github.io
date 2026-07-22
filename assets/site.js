document.getElementById('y').textContent = new Date().getFullYear();

/* Phone numbers are stored split across data attributes and assembled here.
   Harvesting bots that read raw HTML get nothing usable. */
document.querySelectorAll('.phone').forEach(function(el){
  el.addEventListener('click', function(e){
    e.preventDefault();
    if(el.classList.contains('shown')) return;
    var pretty = el.dataset.a + el.dataset.b;
    var raw    = el.dataset.x + el.dataset.y;
    el.textContent = pretty;
    el.href = 'tel:' + raw;
    el.classList.add('shown');
  });
});

/* PWA install prompt (iOS uses Share > Add to Home Screen instead) */
var deferred = null, btn = document.getElementById('install');
window.addEventListener('beforeinstallprompt', function(e){
  e.preventDefault(); deferred = e; if(btn) btn.hidden = false;
});
if(btn) btn.addEventListener('click', function(){
  if(!deferred) return;
  deferred.prompt();
  deferred.userChoice.then(function(){ deferred = null; btn.hidden = true; });
});
window.addEventListener('appinstalled', function(){ if(btn) btn.hidden = true; });

if('serviceWorker' in navigator){
  window.addEventListener('load', function(){
    navigator.serviceWorker.register('../sw.js').catch(function(){});
  });
}

/* ---- email chooser: mailto alone fails silently on many machines ---- */
(function(){
  var wrap = document.querySelector('.mailwrap');
  if(!wrap) return;
  var btn = wrap.querySelector('.mailbtn');
  var pop = wrap.querySelector('.mailpop');
  var copy = wrap.querySelector('.mailcopy');
  var addr = wrap.getAttribute('data-addr');

  btn.addEventListener('click', function(e){
    e.preventDefault();
    pop.classList.toggle('open');
  });
  document.addEventListener('click', function(e){
    if(!wrap.contains(e.target)) pop.classList.remove('open');
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') pop.classList.remove('open');
  });
  if(copy) copy.addEventListener('click', function(){
    var done = function(){
      var t = copy.querySelector('.hint');
      if(t){ var old = t.textContent; t.textContent = '✓'; setTimeout(function(){ t.textContent = old; }, 1600); }
    };
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(addr).then(done).catch(fallback);
    } else { fallback(); }
    function fallback(){
      var ta = document.createElement('textarea');
      ta.value = addr; ta.setAttribute('readonly','');
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch(err){}
      document.body.removeChild(ta);
    }
  });
})();
