!function e(n,t,r){function i(a,u){if(!t[a]){if(!n[a]){var s="function"==typeof require&&require;if(!u&&s)return s(a,!0);if(o)return o(a,!0);var c=new Error("Cannot find module '"+a+"'");throw c.code="MODULE_NOT_FOUND",c}var l=t[a]={exports:{}};n[a][0].call(l.exports,function(e){var t=n[a][1][e];return i(t?t:e)},l,l.exports,e,n,t,r)}return t[a].exports}for(var o="function"==typeof require&&require,a=0;a<r.length;a++)i(r[a]);return i}({1:[function(e,n,t){"use strict";function r(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}var i=function(){function e(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(n,t,r){return t&&e(n.prototype,t),r&&e(n,r),n}}(),o=function(){function e(){r(this,e),this._testCounter=0,this._testTime=(new Date).getTime()}return i(e,[{key:"_onStateChangePromise",value:function(e,n){return new Promise(function(t,r){if(null===e.installing)throw new Error("Service worker is not installing. Did you call cleanState() to unregister this service?");var i=e.installing,o=function a(){return this.state===n?(i.removeEventListener("statechange",a),void t()):"redundant"===this.state?(i.removeEventListener("statechange",a),void r(new Error("Installing servier worker became redundant"))):void 0};i.addEventListener("statechange",o)})}},{key:"getIframe",value:function(){var e=this;return new Promise(function(n){var t=document.querySelector(".js-test-iframe");if(t)return n(t);e._testCounter++;var r=document.createElement("iframe");r.classList.add("js-test-iframe"),r.addEventListener("load",function(){n(r)}),r.src="/test/iframe/"+e._testTime+e._testCounter,document.body.appendChild(r)})}},{key:"unregisterAllRegistrations",value:function(){return navigator.serviceWorker.getRegistrations().then(function(e){return Promise.all(e.map(function(e){return e.unregister()}))})}},{key:"clearAllCaches",value:function(){return window.caches.keys().then(function(e){return Promise.all(e.map(function(e){return window.caches["delete"](e)}))})}},{key:"installSW",value:function(e){var n=this;return new Promise(function(t,r){var i;n.getIframe().then(function(n){var t=null;return n&&(i=n,t={scope:n.contentWindow.location.pathname}),navigator.serviceWorker.register(e,t)}).then(function(e){return n._onStateChangePromise(e,"installed")}).then(function(){return t(i)})["catch"](function(e){return r(e)})})}},{key:"activateSW",value:function(e){var n=this;return new Promise(function(t,r){var i;n.getIframe().then(function(n){var t=null;return n&&(t={scope:n.contentWindow.location.pathname},i=n),navigator.serviceWorker.register(e,t)}).then(function(e){return n._onStateChangePromise(e,"activated")}).then(function(){return t(i)})["catch"](function(e){return r(e)})})}},{key:"getAllCachedAssets",value:function(e){var n=null;return window.caches.has(e).then(function(n){if(!n)throw new Error("Cache doesn't exist.");return window.caches.open(e)}).then(function(e){return n=e,n.keys()}).then(function(e){return Promise.all(e.map(function(e){return n.match(e).then(function(n){return{request:e,response:n}})}))}).then(function(e){var n={};return e.forEach(function(e){n[e.request.url]=e.response}),n})}},{key:"cleanState",value:function(){return Promise.all([this.unregisterAllRegistrations(),this.clearAllCaches()]).then(function(){for(var e=document.querySelectorAll(".js-test-iframe"),n=0;n<e.length;n++)e[n].parentElement.removeChild(e[n])})}}]),e}();window.goog=window.goog||{},window.goog.swUtils=window.goog.swUtils||new o},{}]},{},[1]);
//# sourceMappingURL=sw-utils.js.map