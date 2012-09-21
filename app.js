#!/usr/bin/env node
// Sample Facebook Application that runs on Canvas, Page Tabs, Website
// (including Mobile). Please look at the associated readme for more
// information.
// https://github.com/daaku/nodejs-fb-sample-app
var url = require('url')
var signedRequest = require('signed-request')
var express = require('express')
var signedRequestMaxAge = 86400
var FBAPP = {
  id: process.env.FACEBOOK_APP_ID,
  secret: process.env.FACEBOOK_SECRET,
  ns: process.env.FACEBOOK_NAMESPACE,
  scope: process.env.FACEBOOK_SCOPE
}

// The URL to our Canvas Application.
// https://developers.facebook.com/docs/guides/canvas/
var canvasURL = url.format({
  protocol: 'https',
  host: 'apps.facebook.com',
  pathname: FBAPP.ns + '/'
})

// Makes a URL to the Facebook Login dialog.
// https://developers.facebook.com/docs/authentication/canvas/
function loginURL(redirectURI) {
  return url.format({
    protocol: 'https',
    host: 'www.facebook.com',
    pathname: 'dialog/oauth',
    query: {
      client_id: FBAPP.id,
      redirect_uri: redirectURI,
      scope: FBAPP.scope,
      response_type: 'none'
    }
  })
}

// JavaScript SDK initialization.
// https://developers.facebook.com/docs/reference/javascript/
function jssdk(opts) {
  var sdkOpts = {
    appId: String(FBAPP.id),
    status: true,
    cookie: true,
    xfbml: true
  }
  var pre = ''
  if (opts.reloadOnLogin)
    pre += 'FB.Event.subscribe("auth.login", function() { top.reload() });'
  if (opts.reloadOnLogout)
    pre += 'FB.Event.subscribe("auth.logout", function() { top.reload() });'
  return (
    '<div id="fb-root"></div>' +
    '<script>' +
      'window.fbAsyncInit = function() {' +
        pre +
        'FB.init(' + JSON.stringify(sdkOpts) + ');' +
      '};' +

      // This is copy pasted from:
      // https://developers.facebook.com/docs/reference/javascript/
      "(function(d){" +
      "var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];" +
      "if (d.getElementById(id)) {return;}" +
      "js = d.createElement('script'); js.id = id; js.async = true;" +
      "js.src = '//connect.facebook.net/en_US/all.js';" +
      "ref.parentNode.insertBefore(js, ref);" +
      "}(document));" +
    "</script>"
  )
}

// Our Express Application:
// http://expressjs.com/
var app = express()
app.use(express.bodyParser())
app.use(express.cookieParser())

// Notify the developer when the configuration is bad.
app.all('*', function(req, res, next) {
  if (!FBAPP.id || !FBAPP.secret || !FBAPP.ns) {
    return res.send(
      500,
      '<a href="https://github.com/daaku/nodejs-fb-sample-app">' +
        'Facebook application has not been configured. Follow the readme.' +
      '</a>'
    )
  }
  next()
})

// Parses the signed_request sent on Canvas requests or from the cookie.
// https://developers.facebook.com/docs/authentication/signed_request/
app.all('*', function(req, res, next) {
  var raw = req.param('signed_request')
  if (!raw) raw = req.cookies['fbsr_' + FBAPP.id]
  if (!raw) return next()
  try {
    req.signedRequest = signedRequest.parse(
      raw,
      FBAPP.secret,
      signedRequestMaxAge
    )
    return next()
  } catch(e) {
    return res.send(400, String(e))
  }
})

// Sample home page.
app.all('/', function(req, res) {
  if (req.signedRequest && req.signedRequest.user_id) {
    res.send(
      200,
      '<!doctype html>' +
      'Got user ' + req.signedRequest.user_id + '<br>' +
      '<button onclick="FB.logout()">Logout</button>' +
      jssdk({ reloadOnLogout: true })
    )
  } else {
    res.send(
      200,
      '<!doctype html>' +
      'Welcome unknown user. Click one of these to continue:<br><br>' +
      '<a href=' + JSON.stringify(loginURL(canvasURL)) + '>' +
        'Full Page Canvas Login' +
      '</a><br><br>' +
      '<div class="fb-login-button" scope="' + FBAPP.scope + '">' +
        'JS SDK Dialog Login' +
      '</div>' +
      jssdk({ reloadOnLogin: true })
    )
  }
})

// Start your engines.
var port = process.env.PORT || 3000
app.listen(port, function() {
  console.log('Listening on ' + port)
})
