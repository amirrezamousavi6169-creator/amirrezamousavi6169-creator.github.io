document.getElementById('y').textContent = new Date().getFullYear();

/* PWA install prompt (Chrome/Android/desktop; iOS uses Share > Add to Home Screen) */
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
