// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"iWEe2":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = 1234;
var HMR_SECURE = false;
var HMR_ENV_HASH = "7b4c78780e548846";
module.bundle.HMR_BUNDLE_ID = "36849f37d88acd7f";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, chrome, browser, globalThis, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: mixed;
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = "__parcel__error__overlay__";
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData,
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData = undefined;
}
module.bundle.Module = Module;
var checkedAssets, acceptedAssets, assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? "wss" : "ws";
    var ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/"); // Web extension context
    var extCtx = typeof chrome === "undefined" ? typeof browser === "undefined" ? null : browser : chrome; // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    } // $FlowFixMe
    ws.onmessage = async function(event) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        acceptedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        var data = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH); // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear(); // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets);
                for(var i = 0; i < assetsToAccept.length; i++){
                    var id = assetsToAccept[i][1];
                    if (!acceptedAssets[id]) hmrAcceptRun(assetsToAccept[i][0], id);
                }
            } else fullReload();
        }
        if (data.type === "error") {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
            }
            if (typeof document !== "undefined") {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html); // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        console.error(e.message);
    };
    ws.onclose = function() {
        console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] ✨ Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, "") : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + "</div>").join("")}
        </div>
        ${diagnostic.documentation ? `<div>📝 <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `;
    }
    errorHTML += "</div>";
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ("reload" in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute("href", link.getAttribute("href").split("?")[0] + "?" + Date.now()); // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href = links[i].getAttribute("href");
            var hostname = getHostname();
            var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === "js") {
        if (typeof document !== "undefined") {
            let script = document.createElement("script");
            script.src = asset.url + "?t=" + Date.now();
            if (asset.outputFormat === "esmodule") script.type = "module";
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === "function") {
            // Worker scripts
            if (asset.outputFormat === "esmodule") return import(asset.url + "?t=" + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + "?t=" + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension bugfix for Chromium
                    // https://bugs.chromium.org/p/chromium/issues/detail?id=1255412#c12
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3) {
                        if (typeof ServiceWorkerGlobalScope != "undefined" && global instanceof ServiceWorkerGlobalScope) {
                            extCtx.runtime.reload();
                            return;
                        }
                        asset.url = extCtx.runtime.getURL("/__parcel_hmr_proxy__?url=" + encodeURIComponent(asset.url + "?t=" + Date.now()));
                        return hmrDownload(asset);
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle, asset) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === "css") reloadCSS();
    else if (asset.type === "js") {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
             // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        } // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id]; // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle, id, depsByBundle) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
     // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle, id, depsByBundle) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToAccept.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) return true;
}
function hmrAcceptRun(bundle, id) {
    var cached = bundle.cache[id];
    bundle.hotData = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData;
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData);
    });
    delete bundle.cache[id];
    bundle(id);
    cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) // $FlowFixMe[method-unbinding]
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
    });
    acceptedAssets[id] = true;
}

},{}],"3fArG":[function(require,module,exports) {
/* eslint-disable no-unused-vars */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _nodecgApiContext = require("./util/nodecg-api-context");
var _chatListener = require("./ChatListener");
var _chatListenerDefault = parcelHelpers.interopDefault(_chatListener);
var _dashboardListener = require("./DashboardListener");
var _dashboardListenerDefault = parcelHelpers.interopDefault(_dashboardListener);
exports.default = function(nodecg) {
    (0, _nodecgApiContext.setContext)(nodecg);
    const utilityItemList = nodecg.Replicant("utilityItemList", {
        defaultValue: []
    });
    // TODO: currentUtilityItem needs a default, and should not persist
    const currentUtilityItem = nodecg.Replicant("currentUtilityItem", {
        defaultValue: {}
    });
    const lastUtilityItem = nodecg.Replicant("lastUtilityItem", {
        defaultValue: "none",
        persistent: false
    });
    const debugMessageRep = nodecg.Replicant("debugMessageRep", {
        defaultValue: {
            active: true,
            destination: "log",
            msg: ""
        },
        persistent: false
    });
    const statusRep = nodecg.Replicant("statusRep", {
        defaultValue: {
            chatConnected: null
        },
        persistent: false
    });
    const giveawayRep = nodecg.Replicant("giveawayRep", {
        defaultValue: {
            defaultKeyword: {
                name: "Example",
                active: false,
                winner: [],
                finalWinner: [],
                entries: [],
                newEntries: []
            }
        }
    });
    (0, _chatListenerDefault.default)(nodecg);
    (0, _dashboardListenerDefault.default)(nodecg);
// TODO: debugMessageRep event listener
// TODO: Commands/Timers
// TODO: Nat 20/Nat 1 announcements with per-player stats
// TODO: Sub/Follow Alerts
// TODO: Spotify Connect(song info)
// TODO: Discord Connect(twitch chat / stream message when someone joins the discord)
};

},{"./util/nodecg-api-context":"jgEKf","./ChatListener":"d96gq","./DashboardListener":"2TCkC","@parcel/transformer-js/src/esmodule-helpers.js":"i8bdk"}],"jgEKf":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "getContext", ()=>getContext);
parcelHelpers.export(exports, "setContext", ()=>setContext);
let context;
function getContext() {
    return context;
}
function setContext(ctx) {
    context = ctx;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"i8bdk"}],"i8bdk":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"d96gq":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _nodecgIoCore = require("nodecg-io-core");
var _chatclientContext = require("./util/chatclient-context");
var _chatHandler = require("./ChatHandler");
var _chatHandlerDefault = parcelHelpers.interopDefault(_chatHandler);
function addListeners(nodecg, client, channel) {
    client.join(channel).then(()=>{
        nodecg.log.info(`Connected to twitch channel "${channel}"`);
        client.onMessage((chan, user, message, _msg)=>{
            (0, _chatHandlerDefault.default)(client, chan, user, message, _msg);
        });
    }).catch((reason)=>{
        nodecg.log.error(`Couldn't connect to twitch: ${reason}.`);
        nodecg.log.info("Retrying in 5 seconds.");
        setTimeout(()=>addListeners(nodecg, client, channel), 5000);
    });
}
function ChatListener(nodecg) {
    // Require the twitch service.
    const twitch = (0, _nodecgIoCore.requireService)(nodecg, "twitch-chat");
    const statusRep = nodecg.Replicant("statusRep");
    // Hardcoded channels for testing purposes.
    // Note that this does need a # before the channel name and is case-insensitive.
    const twitchChannels = [
        "#arcanarama"
    ];
    // Once the service instance has been set we add listeners for messages in the corresponding channels.
    twitch?.onAvailable((client)=>{
        nodecg.log.info("Twitch chat client has been updated, adding handlers for messages.");
        twitchChannels.forEach((channel)=>{
            client.say(channel, `connected to ${channel}! how wild is that`);
            (0, _chatclientContext.setChatClient)(client);
            (0, _chatclientContext.setChatChannel)(channel);
            statusRep.value.chatConnected = true;
        });
        twitchChannels.forEach((channel)=>{
            addListeners(nodecg, client, channel);
        });
    });
    twitch?.onUnavailable(()=>{
        nodecg.log.info("Twitch chat client has been unset.");
        (0, _chatclientContext.setChatClient)(undefined);
        (0, _chatclientContext.setChatChannel)(undefined);
        statusRep.value.chatConnected = false;
    });
}
exports.default = ChatListener;

},{"./util/chatclient-context":"jvCCP","./ChatHandler":"jbClP","@parcel/transformer-js/src/esmodule-helpers.js":"i8bdk"}],"jvCCP":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "getChatClient", ()=>getChatClient);
parcelHelpers.export(exports, "setChatClient", ()=>setChatClient);
parcelHelpers.export(exports, "getChatChannel", ()=>getChatChannel);
parcelHelpers.export(exports, "setChatChannel", ()=>setChatChannel);
let chatClient;
let chatChannel;
function getChatClient() {
    return chatClient;
}
function setChatClient(c) {
    chatClient = c;
}
function getChatChannel() {
    return chatChannel;
}
function setChatChannel(c) {
    chatChannel = c;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"i8bdk"}],"jbClP":[function(require,module,exports) {
/* eslint-disable prefer-destructuring */ /* eslint-disable no-unused-vars */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _giveaway = require("./modules/Giveaway");
var _nodecgApiContext = require("./util/nodecg-api-context");
var _commonActions = require("./modules/CommonActions");
function handleMessage(client, channel, user, message, _msg) {
    const nodecg = (0, _nodecgApiContext.getContext)();
    const giveawayRep = nodecg.Replicant("giveawayRep");
    // First, check for commands
    if (typeof message === "string" && _msg.userInfo.displayName !== "autonorama" && _msg.userInfo.displayName !== "Moobot") {
        if (message.startsWith("!") && message.length > 1 && message.charAt(1) !== " ") {
            // Split message into array and get command
            const splitMessage = message.split(" ");
            const command = splitMessage[0].slice(1);
            // Get a lowercase array of params, but drop empty strings
            let params;
            let paramsPreservedCase;
            if (splitMessage.length > 1) {
                const dirtyParams = splitMessage.slice(1).filter((str)=>str !== "");
                if (dirtyParams[0] === undefined) params = undefined;
                else {
                    params = dirtyParams.map((element)=>element.toLowerCase());
                    paramsPreservedCase = dirtyParams;
                }
            }
            // Route Commands here
            switch(command.toLowerCase()){
                // General Commands
                case "vibecheck":
                case "vibes":
                case "vc":
                    client.say(channel, (0, _commonActions.getVibeCheck)(user));
                    break;
                case "entries":
                    {
                        const entryList = _giveaway.getActiveEntries(giveawayRep, user);
                        if (entryList.length !== 0) {
                            const entryListNames = [];
                            entryList.forEach((element)=>{
                                entryListNames.push(giveawayRep.value[element].name);
                            });
                            client.say(channel, `You are currently entered in ${entryList.length} active ${entryList.length === 1 ? "giveaway" : "giveaways"}: ${entryListNames.toString()}`, {
                                replyTo: _msg.id
                            });
                        } else client.say(channel, `You are not currently entered in any active giveaways.`, {
                            replyTo: _msg.id
                        });
                    }
                    break;
                case "claim":
                    {
                        const winKeys = _giveaway.getActiveWins(giveawayRep, user);
                        const winNames = [];
                        if (winKeys.length > 0) {
                            winKeys.forEach((key)=>{
                                winNames.push(giveawayRep.value[key].name);
                                _giveaway.finalizeGiveaway(giveawayRep, key, user);
                            });
                            client.say(channel, `${user} claimed the following ${winNames.length === 1 ? "giveaway" : "giveaways"}: ${winNames.toString()}! ${winNames.length === 1 ? "It is" : "They are"} now closed`);
                        }
                    }
                    break;
                // Mod-Only Commands
                case "giveaway":
                case "g":
                    if (_msg.userInfo.isMod || _msg.userInfo.isBroadcaster) {
                        if (params !== undefined) switch(params[0]){
                            case "list":
                            case "l":
                                {
                                    const keys = _giveaway.getKeys(giveawayRep);
                                    const activeKeys = [];
                                    const inactiveKeys = [];
                                    keys.forEach((key)=>{
                                        if (giveawayRep.value[key]?.active) activeKeys.push(key);
                                        else inactiveKeys.push(key);
                                    });
                                    if (activeKeys.length === 0 && inactiveKeys.length === 0) client.say(channel, `No giveaways found`);
                                    else {
                                        if (activeKeys.length !== 0) client.say(channel, `Current active giveaway keywords: ${activeKeys.toString()}`);
                                        else client.say(channel, `There are currently no active giveaways`);
                                        if (inactiveKeys.length !== 0) client.say(channel, `Current inactive giveaway keywords: ${inactiveKeys.toString()}`);
                                        else client.say(channel, `There are currently no inactive giveaways`);
                                    }
                                }
                                break;
                            case "info":
                            case "i":
                                if (params.length > 1) {
                                    if (_giveaway.keyExists(giveawayRep, params[1])) {
                                        const key = params[1];
                                        const fullName = giveawayRep.value[key].name;
                                        const status = giveawayRep.value[key].active;
                                        const numEntries = giveawayRep.value[key].entries.length;
                                        client.say(channel, `Giveaway info: Keyword: "${key}", 
                        Name: "${fullName}" 
                        Active: ${status}, 
                        Total Entries: ${numEntries}`);
                                    } else client.say(channel, `Giveaway with key ${params[1]} not found. 
                        Current keys are: ${Object.keys(giveawayRep.value).toString()}`);
                                } else ;
                                break;
                            case "draw":
                            case "d":
                                if (params.length > 1) {
                                    const key1 = params[1];
                                    if (_giveaway.drawGiveaway(giveawayRep, key1)) {
                                        const winner = giveawayRep.value[key1].winner.slice(-1);
                                        const giveawayName = giveawayRep.value[key1].name;
                                        client.say(channel, `${winner} was drawn for the ${giveawayName} giveaway! 
                        ${winner}, please type "!claim" in chat to confirm`);
                                    } else if (_giveaway.keyExists(giveawayRep, key1)) {
                                        const giveawayName1 = giveawayRep.value[key1].name;
                                        client.say(channel, `${giveawayName1} giveaway drawing failed: No entries`);
                                    }
                                }
                                break;
                            case "reset":
                            case "r":
                                switch(params[1]){
                                    case "all":
                                        if (_giveaway.resetAllActiveGiveaways(giveawayRep)) client.say(channel, `Resetting all giveaways.`);
                                        break;
                                    default:
                                        if (params[1] !== undefined) {
                                            const key2 = params[1];
                                            if (_giveaway.resetGiveaway(giveawayRep, key2)) client.say(channel, `Resetting giveaway with key ${key2}.`);
                                            else client.say(channel, `Giveaway with key ${params[1]} not found. Current keys are: ${Object.keys(giveawayRep.value).toString()}`);
                                        }
                                        break;
                                }
                                break;
                            case "set":
                            case "s":
                                if (params.length >= 3) {
                                    const key3 = params[1];
                                    let newActiveState = false;
                                    switch(params[2]){
                                        case "active":
                                        case "a":
                                        case "on":
                                            newActiveState = true;
                                            if (Object.keys(giveawayRep.value).includes(key3)) {
                                                giveawayRep.value[key3].active = newActiveState;
                                                client.say(channel, `Giveaway with key ${key3} is now ${giveawayRep.value[key3].active ? "active" : "inactive"}.`);
                                            }
                                            break;
                                        case "inactive":
                                        case "i":
                                        case "off":
                                            newActiveState = false;
                                            if (Object.keys(giveawayRep.value).includes(key3)) {
                                                giveawayRep.value[key3].active = newActiveState;
                                                client.say(channel, `Giveaway with key ${key3} is now ${giveawayRep.value[key3].active ? "Active" : "Inactive"}`);
                                            }
                                            break;
                                        default:
                                            break;
                                    }
                                }
                                break;
                            case "add":
                            case "a":
                                if (params.length >= 3 && (params[2] === "active" || params[2] === "inactive")) {
                                    const key4 = params[1];
                                    const data = {};
                                    data[key4] = {};
                                    const fullName1 = paramsPreservedCase.slice(3).toString().replaceAll(",", " ");
                                    if (key4 === "all") {
                                        client.say(channel, `'all' cannot be used as a keyword`);
                                        break;
                                    }
                                    data[key4].name = fullName1;
                                    data[key4].active = false;
                                    if (params[2] === "active") data[key4].active = true;
                                    if (_giveaway.addGiveaway(giveawayRep, data)) client.say(channel, `Added ${data[key4].active ? "active" : "inactive"} giveaway '${fullName1}' with keyword '${key4}'`);
                                    else client.say(channel, `A giveaway with keyword '${key4}' already exists`);
                                } else client.say(channel, `Add Giveaway syntax is: !giveaway add [keyword] [active/inactive] 
                      [Name (spaces allowed)]`);
                                break;
                            case "delete":
                                if (params.length > 1) {
                                    const key5 = params[1];
                                    if (key5 === "all") {
                                        if (_giveaway.deleteAllGiveaways(giveawayRep)) client.say(channel, `All giveaways deleted`);
                                        else client.say(channel, `No giveaways found to delete`);
                                    } else if (_giveaway.deleteGiveaway(giveawayRep, key5)) client.say(channel, `Giveaway with keyword ${key5} deleted`);
                                    else client.say(channel, `Giveaway with keyword ${key5} not found.  Current keywords are:
                        ${Object.keys(giveawayRep.value).toString()}`);
                                }
                                break;
                            default:
                                break;
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        // Other tests run here
        // Giveaway Keyword Check
        Object.keys(giveawayRep.value).forEach((key)=>{
            // Check for the keyword, but ignore the keyword if part of a command
            if (message.toLowerCase().includes(key.toLowerCase()) && !message.toLowerCase().startsWith("!")) _giveaway.handleEntry(client, channel, user, key, _msg);
        });
    }
}
exports.default = handleMessage;

},{"./modules/Giveaway":"4a7Wx","./util/nodecg-api-context":"jgEKf","./modules/CommonActions":"h9MHW","@parcel/transformer-js/src/esmodule-helpers.js":"i8bdk"}],"4a7Wx":[function(require,module,exports) {
/* eslint-disable no-param-reassign */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Checks if a given key exists in the giveawayRep Replicant
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @param {string} key - the keyword for the giveaway
 */ parcelHelpers.export(exports, "keyExists", ()=>keyExists);
/**
 * Checks if a user already has an entry in the specified giveaway
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @param {string} key - the keyword for the giveaway
 * @param {string} userName - the username to be searched for
 * @returns {bool}
 */ parcelHelpers.export(exports, "entryExists", ()=>entryExists);
/**
 * Returns an array containing keys for each giveaway the user has entered
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @param {string} userName - The user to search for
 * @returns {array<string>} The keys of each active giveaway the user has entered
 */ parcelHelpers.export(exports, "getActiveEntries", ()=>getActiveEntries);
/**
 * Returns a bool for the active status of a giveaway
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @param {string} key - the keyword for the giveaway
 * @return {bool} Returns true if the giveaway is active
 */ parcelHelpers.export(exports, "getActiveStatus", ()=>getActiveStatus);
/**
 * Gets an array of keys for giveaways that the user was drawn for
 * @param {Replicant} giveawayRep  The replicant holding the giveaway objects
 * @param {string} userName - The user to search for
 * @returns {array<string>}
 */ parcelHelpers.export(exports, "getActiveWins", ()=>getActiveWins);
/**
 * Deletes a specified user's entry from the specified giveaway
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @param {string} key - the keyword for the giveaway
 * @param {string} userName - the user whose entry should be deleted
 * @return {bool} Returns true on success
 */ parcelHelpers.export(exports, "deleteEntry", ()=>deleteEntry);
/**
 * Returns an array containing each key for all stored giveaway objects
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @returns {array<string>} A list of the keywords for each stored giveaway
 */ parcelHelpers.export(exports, "getKeys", ()=>getKeys);
/**
 * Adds a giveaway with the provided data
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @param {Object} data - An object containing properties for the new giveaway
 * @return {bool} Returns true on success
 */ parcelHelpers.export(exports, "addGiveaway", ()=>addGiveaway);
/**
 * Sets a giveaway's properties using the data provided
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @param {string} key - the keyword for the giveaway
 * @param {Object} data - and object containing the desired changes
 * @return {bool} Returns true on success
 */ parcelHelpers.export(exports, "setGiveaway", ()=>setGiveaway);
/**
 * Deletes a giveaway
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @param {string} key - the keyword for the giveaway
 * @return {bool} Returns true on success
 */ parcelHelpers.export(exports, "deleteGiveaway", ()=>deleteGiveaway);
/**
 * Deletes all giveaways
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @return {bool} Returns true on success
 */ parcelHelpers.export(exports, "deleteAllGiveaways", ()=>deleteAllGiveaways);
/**
 * Removes all entries from a giveaway
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @param {string} key - the keyword for the giveaway
 * @return {bool} Returns true on success
 */ parcelHelpers.export(exports, "resetGiveaway", ()=>resetGiveaway);
/**
 * Removes all entries from all active giveaways
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @return {bool} Returns true on success
 */ parcelHelpers.export(exports, "resetAllActiveGiveaways", ()=>resetAllActiveGiveaways);
/**
 * Draws a random winner and updates the giveaway object
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @param {string} key - The keyword for the giveaway
 * @returns {bool} Returns true if successful
 */ parcelHelpers.export(exports, "drawGiveaway", ()=>drawGiveaway);
/**
 * Confirms a giveaway winner and sets the giveaway inactive
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @param {string} key - The key of the giveaway to finalize
 * @param {string} userName - The winning user
 * @returns {bool} Returns true if successful
 */ parcelHelpers.export(exports, "finalizeGiveaway", ()=>finalizeGiveaway);
/**
 * Returns the number of entries for a giveaway
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @param {string} key - the keyword for the giveaway
 * @return {number}
 */ parcelHelpers.export(exports, "getEntryCount", ()=>getEntryCount);
/**
 * Returns the number of new (unannounced) entries for a giveaway
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @param {string} key - the keyword for the giveaway
 * @return {number}
 */ parcelHelpers.export(exports, "getNewEntryCount", ()=>getNewEntryCount);
/**
 * Attempts to add a giveaway entry for the single corresponding keyword.
 * @param {ChatClient} client - a ChatClient object
 * @param {string} channel - Channel name prefixed with '#'
 * @param {string} user
 * @param {string} keyword - the keyword detected
 * @param {TwitchPrivateMessage} _msg - Raw message data
 */ // eslint-disable-next-line no-unused-vars
parcelHelpers.export(exports, "handleEntry", ()=>handleEntry);
var _nodecgApiContext = require("../util/nodecg-api-context");
// Since we aren't declaring nodecg globally, declare it inside the debug message func
// const debugMessageRep = nodecg.Replicant('debugMessageRep');
const announcerTimer = {};
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function keyExists(giveawayRep, key) {
    return Object.keys(giveawayRep.value).includes(key);
}
function entryExists(giveawayRep, key, userName) {
    let result = false;
    if (keyExists(giveawayRep, key)) result = giveawayRep.value[key].entries.includes(userName);
    return result;
}
function getActiveEntries(giveawayRep, userName) {
    const entryList = [];
    Object.keys(giveawayRep.value).forEach((key)=>{
        if (giveawayRep.value[key].active && giveawayRep.value[key].entries.includes(userName)) entryList.push(key);
    });
    return entryList;
}
function getActiveStatus(giveawayRep, key) {
    if (keyExists(giveawayRep, key)) return giveawayRep.value[key].active;
    // Failstate
    return false;
}
function getActiveWins(giveawayRep, userName) {
    const winList = [];
    Object.keys(giveawayRep.value).forEach((key)=>{
        if (giveawayRep.value[key].active && giveawayRep.value[key].winner.includes(userName)) winList.push(key);
    });
    return winList;
}
function deleteEntry(giveawayRep, key, userName) {
    if (entryExists(giveawayRep, key, userName)) {
        const index = giveawayRep.value[key].entries.indexOf(userName);
        if (index !== -1) {
            giveawayRep.value[key].entries.splice(index, 1);
            return true;
        }
    }
    // Failstate
    return false;
}
function getKeys(giveawayRep) {
    return Object.keys(giveawayRep?.value);
}
function addGiveaway(giveawayRep, data) {
    const keyArray = Object.keys(data);
    if (keyArray.length === 1) {
        const key = keyArray[0];
        if (!keyExists(giveawayRep, key)) {
            const defaultGiveaway = {
                active: false,
                name: "Default",
                winner: [],
                finalWinner: "",
                entries: [],
                newEntries: []
            };
            const newGiveaway = Object.assign(defaultGiveaway, data[key]);
            giveawayRep.value[key] = newGiveaway;
            return true;
        }
    // say A giveaway with this key already exists
    }
    // Failstate
    return false;
}
function setGiveaway(giveawayRep, key, data) {
    if (keyExists(giveawayRep, key)) {
        Object.assign(giveawayRep.value[key], data);
        return true;
    }
    // Failstate
    return false;
}
function deleteGiveaway(giveawayRep, key) {
    if (keyExists(giveawayRep, key)) {
        delete giveawayRep.value[key];
        return true;
    }
    // Failstate
    return false;
}
function deleteAllGiveaways(giveawayRep) {
    const keys = getKeys(giveawayRep);
    const successes = [];
    keys.forEach((element)=>{
        const result = deleteGiveaway(giveawayRep, element);
        successes.push(result);
    });
    if (successes.length !== 0 && !successes.includes(false)) return true;
    // Failstate
    return false;
}
function resetGiveaway(giveawayRep, key) {
    if (keyExists(giveawayRep, key)) {
        giveawayRep.value[key].entries = [];
        giveawayRep.value[key].newEntries = [];
        giveawayRep.value[key].winner = [];
        giveawayRep.value[key].finalWinner = "";
        return true;
    }
    // Failstate
    return false;
}
function resetAllActiveGiveaways(giveawayRep) {
    const keys = getKeys(giveawayRep);
    const successes = [];
    keys.forEach((key)=>{
        if (getActiveStatus(giveawayRep, key)) {
            const result = resetGiveaway(giveawayRep, key);
            successes.push(result);
        }
    });
    if (!successes.includes(false)) return true;
    // Failstate
    return false;
}
function drawGiveaway(giveawayRep, key) {
    if (keyExists(giveawayRep, key)) {
        const numEntries = giveawayRep.value[key].entries.length;
        let winningIndex;
        if (numEntries !== 0) {
            winningIndex = getRandomNumber(0, numEntries - 1);
            giveawayRep.value[key].winner.push(giveawayRep.value[key].entries[winningIndex]);
            giveawayRep.value[key].entries.splice(winningIndex, 1);
            return true;
        }
    }
    // Failstate
    return false;
}
function finalizeGiveaway(giveawayRep, key, userName) {
    if (keyExists(giveawayRep, key)) {
        giveawayRep.value[key].finalWinner = userName;
        giveawayRep.value[key].active = false;
        return true;
    }
    // Failstate
    return false;
}
function getEntryCount(giveawayRep, key) {
    if (keyExists(giveawayRep, key)) return giveawayRep.value[key].entries.length;
    // Failstate
    return false;
}
function getNewEntryCount(giveawayRep, key) {
    if (keyExists(giveawayRep, key)) return giveawayRep.value[key].newEntries.length;
    // Failstate
    return false;
}
/**
 * Sends a message to the channel enumerating the new and total entries.
 * @param {ChatClient} client - Twurple ChatClient object
 * @param {string} channel - the channel to send the message to
 * @param {string} keyword - the keyword to enter the giveaway
 * @param {Replicant} giveaway - The replicant holding the giveaway objects
 * @return {bool} Returns true on success
 */ function announceEntries(client, channel, keyword, giveaway) {
    if (giveaway?.newEntries?.length >= 1) {
        client.say(channel, `Added ${giveaway.newEntries.length} new ${giveaway.newEntries.length === 1 ? "entry" : "entries"} to the ${giveaway.name} giveaway! 
      (Total entries: ${giveaway.entries.length}) Type "${keyword}" to enter. You can check your entry status with !entries`);
        // eslint-disable-next-line no-param-reassign
        giveaway.newEntries = [];
        return true;
    }
    // Failstate
    return false;
}
function handleEntry(client, channel, user, keyword, _msg) {
    const nodecg = (0, _nodecgApiContext.getContext)();
    const giveawayRep = nodecg.Replicant("giveawayRep");
    if (giveawayRep.value[keyword]?.active) {
        if (!giveawayRep.value[keyword].entries.includes(user)) {
            giveawayRep.value[keyword].entries.push(user);
            giveawayRep.value[keyword].newEntries.push(user);
            clearTimeout(announcerTimer?.[keyword]);
            announcerTimer[keyword] = setTimeout(()=>{
                announceEntries(client, channel, keyword, giveawayRep.value[keyword]);
            }, 4000);
        }
    }
}

},{"../util/nodecg-api-context":"jgEKf","@parcel/transformer-js/src/esmodule-helpers.js":"i8bdk"}],"h9MHW":[function(require,module,exports) {
/**
 * Returns a random number between min and max
 * @param {number} min
 * @param {number} max
 * @returns result
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "getRandomNumber", ()=>getRandomNumber);
parcelHelpers.export(exports, "getVibeCheck", ()=>getVibeCheck);
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getVibeCheck(user) {
    const roll = getRandomNumber(1, 20);
    const randomMessage = getRandomNumber(0, 3);
    const article = `${roll === 8 || roll === 11 || roll === 18 ? "an" : "a"}`;
    const monsters = [
        "a Shambling Mound",
        "an Owlbear",
        "a Purple Worm",
        "a Gelatinous Cube",
        "a Dragon",
        "a Tarrasque",
        "a Displacer Beast"
    ];
    const planes = [
        "the Astral Plane",
        "a warehouse in the middle of nowhere",
        "Cleveland, Ohio",
        "the Abyss",
        "the Feywild",
        "Pandemonium"
    ];
    const responses = [
        // roll = 1
        [
            `${user} rolled a [1] on their vibe check :(`,
            `quick, send <3 to ${user}! their vibe check was a 1`,
            `${user} rolled a [1] on their vibe check and was tragically devoured by ${monsters[getRandomNumber(0, monsters.length - 1)]}. you hate to see it`,
            `${user} critically fails the vibe check and is temporarily banished to ${planes[getRandomNumber(0, planes.length - 1)]}.`
        ],
        // 2 <= roll <= 5
        [
            `${user} rolled a [${roll}] for their vibes! it could be worse (but not much)`,
            `look on the bright side ${user}, a [${roll}] is better than a 1`,
            `how about a [${roll}], ${user}? that's not the worst thing in the world`,
            `${user}, your vibe check is a [${roll}]! at least you didn't roll a 1. sometimes ${monsters[getRandomNumber(0, monsters.length - 1)]} eats you when you roll a 1`
        ],
        // 6 <= roll <= 10
        [
            `hey ${user}! you rolled ${article} [${roll}], but who cares what a robot thinks `,
            `${user}, it's not a bad day. your vibe check is ${article} [${roll}]`,
            `[${roll}]! i've seen worse vibes, ${user}`,
            `${user} rolled ${article} [${roll}] for their vibes today`
        ],
        // 11 <= roll <= 15
        [
            `hey ${user}! [${roll}]! that's pretty good`,
            `${user}, it's a good day. your vibe check is ${article} [${roll}]`,
            `[${roll}]! nice vibes, ${user}`,
            `${user} rolled ${article} [${roll}] for their vibes today!`
        ],
        // 15 <= roll <= 19
        [
            `hey ${user}! [${roll}]! nice!`,
            `${user}, it's a great day! your vibe check is [${roll}]`,
            `[${roll}]! well done, ${user}`,
            `${user} rolled [${roll}] for their vibes today! very nice`
        ],
        // roll = 20
        [
            `a nat [20] vibe check! well done, ${user}!`,
            `${user} rolls a nat [20] on their vibe check! they become the temporary ruler of ${planes[getRandomNumber(0, planes.length - 1)]}.`,
            `it's a beautiful day! that's a big ol' nat [20] there, ${user}`,
            `${user} rolled a nat [20] for their vibes. everyone becomes deeply envious.`
        ]
    ];
    if (roll === 20) return `${responses[5][randomMessage]}`;
    if (roll > 14) return `${responses[4][randomMessage]}`;
    if (roll > 9) return `${responses[3][randomMessage]}`;
    if (roll > 4) return `${responses[2][randomMessage]}`;
    if (roll > 1) return `${responses[1][randomMessage]}`;
    return `${responses[0][randomMessage]}`;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"i8bdk"}],"2TCkC":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _giveaway = require("./modules/Giveaway");
var _nodecgApiContext = require("./util/nodecg-api-context");
var _chatclientContext = require("./util/chatclient-context");
function dashboardHandler(data) {
    const nodecg = (0, _nodecgApiContext.getContext)();
    const client = (0, _chatclientContext.getChatClient)();
    const channel = (0, _chatclientContext.getChatChannel)();
    const giveawayRep = nodecg.Replicant("giveawayRep");
    if (typeof data === "object") {
        const command = Object.keys(data)[0];
        const { key  } = data[command];
        switch(command){
            case "add":
                {
                    const newGiveawayData = {};
                    newGiveawayData[key] = {
                        name: data[command].name,
                        active: data[command].active
                    };
                    _giveaway.addGiveaway(giveawayRep, newGiveawayData);
                }
                break;
            case "delete":
                _giveaway.deleteGiveaway(giveawayRep, key);
                break;
            case "reset":
                break;
            case "toggle":
                giveawayRep.value[key].active = !giveawayRep.value[key].active;
                break;
            case "announce":
                if (client) {
                    const { name  } = giveawayRep.value[key];
                    client.say(channel, `The ${name} giveaway is now open! Type "${key}" to enter!`);
                    _giveaway.setGiveaway(giveawayRep, key, {
                        active: true
                    });
                }
                break;
            case "draw":
                _giveaway.drawGiveaway(giveawayRep, key);
                break;
            case "announceWinner":
                if (client) {
                    const { name: name1  } = giveawayRep.value[key];
                    const winner = data[command].user;
                    client.say(channel, `${winner} has been drawn for the ${name1} giveaway!`);
                    giveawayRep.value[key].finalWinner = winner;
                }
                break;
            default:
                break;
        }
    }
}
function dashboardListener(nodecg) {
    nodecg.listenFor("giveaway", dashboardHandler);
}
exports.default = dashboardListener;

},{"./modules/Giveaway":"4a7Wx","./util/nodecg-api-context":"jgEKf","./util/chatclient-context":"jvCCP","@parcel/transformer-js/src/esmodule-helpers.js":"i8bdk"}]},["iWEe2","3fArG"], "3fArG", "parcelRequire3ffd")

//# sourceMappingURL=index.js.map
