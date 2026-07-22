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
