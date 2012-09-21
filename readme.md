nodejs-fb-sample-app
====================

A sample Facebook application. This application can be run
standalone or on [Heroku](http://www.heroku.com/).

Make sure you have [nodejs](http://nodejs.org/) installed.

```sh
git clone https://github.com/daaku/nodejs-fb-sample-app
cd nodejs-fb-sample-app
npm install

export FACEBOOK_APP_ID=123
export FACEBOOK_SECRET=fixme
export FACEBOOK_NAMESPACE=fixme
./app.js
```

Live Demo
---------

**Canvas**: https://apps.facebook.com/nodejssample/

**Website**: https://nodejs-fb-sample-app.herokuapp.com/


FAQ
---

### String contat for HTML?

Please use this sample as a guide for a Facebook application. You
should probably use one of the various template engines, and maybe
something other than [express](http://expressjs.com/) and/or
[request](https://github.com/mikeal/request) if that doesn't suit your
needs.
