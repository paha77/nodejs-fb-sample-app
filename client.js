function boot(conf) {
  function safeReload() {
    if (window !== top) {
      top.location = conf.canvasURL + window.location.pathname.substr(1)
    } else {
      window.location.reload()
    }
  }

  // This is copy pasted from:
  // https://developers.facebook.com/docs/reference/javascript/
  window.fbAsyncInit = function() {
    if (conf.reloadOnLogin) FB.Event.subscribe('auth.login', safeReload)
    if (conf.reloadOnLogout) FB.Event.subscribe('auth.logout', safeReload)
    FB.init({
      appId: String(conf.appId),
      status: true,
      cookie: true,
      xfbml: true
    })

    var disconnectBtn = document.getElementById('sample-disconnect')
    if (disconnectBtn) {
      disconnectBtn.onclick = function() {
        FB.api({ method: 'auth.revokeauthorization' }, safeReload)
      }
    }

    var logoutBtn = document.getElementById('sample-logout')
    if (logoutBtn) {
      logoutBtn.onclick = function() {
        FB.logout()
      }
    }
  }

  // Load the Facebook JS SDK
  window.setTimeout(function() {
  (function(d) {
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = '//connect.facebook.net/en_US/all.js';
    ref.parentNode.insertBefore(js, ref);
  }(document));
  }, 0)
}
