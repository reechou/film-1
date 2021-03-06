/*!
 * vue-router v0.7.11
 * (c) 2016 Evan You
 * Released under the MIT License.
 */
define('base/vue-router', ['underscore', '$'], function(require, exports, module) {
    ! function(t, e) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.VueRouter = e()
    }(this, function() {
        "use strict";

        function t(t, e, n) {
            this.path = t, this.matcher = e, this.delegate = n
        }

        function e(t) {
            this.routes = {}, this.children = {}, this.target = t
        }

        function n(e, r, i) {
            return function(o, a) {
                var s = e + o;
                return a ? void a(n(s, r, i)) : new t(e + o, r, i)
            }
        }

        function r(t, e, n) {
            for (var r = 0, i = 0, o = t.length; o > i; i++) r += t[i].path.length;
            e = e.substr(r);
            var a = {
                path: e,
                handler: n
            };
            t.push(a)
        }

        function i(t, e, n, o) {
            var a = e.routes;
            for (var s in a)
                if (a.hasOwnProperty(s)) {
                    var h = t.slice();
                    r(h, s, a[s]), e.children[s] ? i(h, e.children[s], n, o) : n.call(o, h)
                }
        }

        function o(t, r) {
            var o = new e;
            t(n("", o, this.delegate)), i([], o, function(t) {
                r ? r(this, t) : this.add(t)
            }, this)
        }

        function a(t) {
            return "[object Array]" === Object.prototype.toString.call(t)
        }

        function s(t) {
            this.string = t
        }

        function h(t) {
            this.name = t
        }

        function c(t) {
            this.name = t
        }

        function u() {}

        function l(t, e, n) {
            "/" === t.charAt(0) && (t = t.substr(1));
            var r = t.split("/"),
                i = [];
            n.val = "";
            for (var o = 0, a = r.length; a > o; o++) {
                var l, p = r[o];
                (l = p.match(/^:([^\/]+)$/)) ? (i.push(new h(l[1])), e.push(l[1]), n.val += "3") : (l = p.match(/^\*([^\/]+)$/)) ? (i.push(new c(l[1])), n.val += "2", e.push(l[1])) : "" === p ? (i.push(new u), n.val += "1") : (i.push(new s(p)), n.val += "4")
            }
            return n.val = +n.val, i
        }

        function p(t) {
            this.charSpec = t, this.nextStates = []
        }

        function f(t) {
            return t.sort(function(t, e) {
                return e.specificity.val - t.specificity.val
            })
        }

        function d(t, e) {
            for (var n = [], r = 0, i = t.length; i > r; r++) {
                var o = t[r];
                n = n.concat(o.match(e))
            }
            return n
        }

        function v(t) {
            this.queryParams = t || {}
        }

        function g(t, e, n) {
            for (var r = t.handlers, i = t.regex, o = e.match(i), a = 1, s = new v(n), h = 0, c = r.length; c > h; h++) {
                for (var u = r[h], l = u.names, p = {}, f = 0, d = l.length; d > f; f++) p[l[f]] = o[a++];
                s.push({
                    handler: u.handler,
                    params: p,
                    isDynamic: !!l.length
                })
            }
            return s
        }

        function y(t, e) {
            return e.eachChar(function(e) {
                t = t.put(e)
            }), t
        }

        function m(t) {
            return t = t.replace(/\+/gm, "%20"), decodeURIComponent(t)
        }

        function _(t) {
            window.console && (console.warn("[vue-router] " + t), (!B.Vue || B.Vue.config.debug) && console.warn(new Error("warning stack trace:").stack))
        }

        function w(t, e, n) {
            var r = t.match(/(\?.*)$/);
            if (r && (r = r[1], t = t.slice(0, -r.length)), "?" === e.charAt(0)) return t + e;
            var i = t.split("/");
            n && i[i.length - 1] || i.pop();
            for (var o = e.replace(/^\//, "").split("/"), a = 0; a < o.length; a++) {
                var s = o[a];
                "." !== s && (".." === s ? i.pop() : i.push(s))
            }
            return "" !== i[0] && i.unshift(""), i.join("/")
        }

        function b(t) {
            return t && "function" == typeof t.then
        }

        function C(t, e) {
            var n = t && (t.$options || t.options);
            return n && n.route && n.route[e]
        }

        function R(t, e) {
            G ? G.$options.components._ = t.component : G = {
                resolve: B.Vue.prototype._resolveComponent,
                $options: {
                    components: {
                        _: t.component
                    }
                }
            }, G.resolve("_", function(n) {
                t.component = n, e(n)
            })
        }

        function k(t, e, n) {
            return void 0 === e && (e = {}), t = t.replace(/:([^\/]+)/g, function(n, r) {
                var i = e[r];
                return i || _('param "' + r + '" not found when generating path for "' + t + '" with params ' + JSON.stringify(e)), i || ""
            }), n && (t += N(n)), t
        }

        function A(t, e, n) {
            var r = t.childVM;
            if (!r || !e) return !1;
            if (t.Component !== e.component) return !1;
            var i = C(r, "canReuse");
            return "boolean" == typeof i ? i : i ? i.call(r, {
                to: n.to,
                from: n.from
            }) : !0
        }

        function E(t, e, n) {
            var r = t.childVM,
                i = C(r, "canDeactivate");
            i ? e.callHook(i, r, n, {
                expectBoolean: !0
            }) : n()
        }

        function $(t, e, n) {
            R(t, function(t) {
                if (!e.aborted) {
                    var r = C(t, "canActivate");
                    r ? e.callHook(r, null, n, {
                        expectBoolean: !0
                    }) : n()
                }
            })
        }

        function x(t, e, n) {
            var r = t.childVM,
                i = C(r, "deactivate");
            i ? e.callHooks(i, r, n) : n()
        }

        function V(t, e, n, r, i) {
            var o = e.activateQueue[n];
            if (!o) return T(t), t._bound && t.setComponent(null), void(r && r());
            var a = t.Component = o.component,
                s = C(a, "activate"),
                h = C(a, "data"),
                c = C(a, "waitForData");
            t.depth = n, t.activated = !1;
            var u = void 0,
                l = !(!h || c);
            if (i = i && t.childVM && t.childVM.constructor === a) u = t.childVM, u.$loadingRouteData = l;
            else if (T(t), t.unbuild(!0), u = t.build({
                    _meta: {
                        $loadingRouteData: l
                    },
                    created: function() {
                        this._routerView = t
                    }
                }), t.keepAlive) {
                u.$loadingRouteData = l;
                var p = u._keepAliveRouterView;
                p && (t.childView = p, u._keepAliveRouterView = null)
            }
            var f = function() {
                    u.$destroy()
                },
                d = function() {
                    if (i) return void(r && r());
                    var n = e.router;
                    n._rendered || n._transitionOnLoad ? t.transition(u) : (t.setCurrent ? t.setCurrent(u) : t.childVM = u, u.$before(t.anchor, null, !1)), r && r()
                },
                v = function() {
                    t.childView && V(t.childView, e, n + 1, null, i || t.keepAlive), d()
                },
                g = function() {
                    t.activated = !0, h && c ? P(u, e, h, v, f) : (h && P(u, e, h), v())
                };
            s ? e.callHooks(s, u, g, {
                cleanup: f,
                postActivate: !0
            }) : g()
        }

        function S(t, e) {
            var n = t.childVM,
                r = C(n, "data");
            r && P(n, e, r)
        }

        function P(t, e, n, r, i) {
            t.$loadingRouteData = !0, e.callHooks(n, t, function() {
                t.$loadingRouteData = !1, t.$emit("route-data-loaded", t), r && r()
            }, {
                cleanup: i,
                postActivate: !0,
                processData: function(e) {
                    var n = [];
                    return O(e) && Object.keys(e).forEach(function(r) {
                        var i = e[r];
                        b(i) ? n.push(i.then(function(e) {
                            t.$set(r, e)
                        })) : t.$set(r, i)
                    }), n.length ? n[0].constructor.all(n) : void 0
                }
            })
        }

        function T(t) {
            t.keepAlive && t.childVM && t.childView && (t.childVM._keepAliveRouterView = t.childView), t.childView = null
        }

        function O(t) {
            return "[object Object]" === Object.prototype.toString.call(t)
        }

        function H(t) {
            return "[object Object]" === Object.prototype.toString.call(t)
        }

        function j(t) {
            return t ? Array.prototype.slice.call(t) : []
        }

        function q(t) {
            var e = t.util,
                n = e.extend,
                r = e.isArray,
                i = e.defineReactive,
                o = t.prototype._init;
            t.prototype._init = function(t) {
                t = t || {};
                var e = t._parent || t.parent || this,
                    n = e.$router,
                    r = e.$route;
                n && (this.$router = n, n._children.push(this), this._defineMeta ? this._defineMeta("$route", r) : i(this, "$route", r)), o.call(this, t)
            };
            var a = t.prototype._destroy;
            t.prototype._destroy = function() {
                !this._isBeingDestroyed && this.$router && this.$router._children.$remove(this), a.apply(this, arguments)
            };
            var s = t.config.optionMergeStrategies,
                h = /^(data|activate|deactivate)$/;
            s && (s.route = function(t, e) {
                if (!e) return t;
                if (!t) return e;
                var i = {};
                n(i, t);
                for (var o in e) {
                    var a = i[o],
                        s = e[o];
                    a && h.test(o) ? i[o] = (r(a) ? a : [a]).concat(s) : i[o] = s
                }
                return i
            })
        }

        function M(t) {
            var e = t.util,
                n = t.directive("_component") || t.internalDirectives.component,
                r = e.extend({}, n);
            e.extend(r, {
                _isRouterView: !0,
                bind: function() {
                    var t = this.vm.$route;
                    if (!t) return void _("<router-view> can only be used inside a router-enabled app.");
                    this._isDynamicLiteral = !0, n.bind.call(this);
                    for (var e = void 0, r = this.vm; r;) {
                        if (r._routerView) {
                            e = r._routerView;
                            break
                        }
                        r = r.$parent
                    }
                    if (e) this.parentView = e, e.childView = this;
                    else {
                        var i = t.router;
                        i._rootView = this
                    }
                    var o = t.router._currentTransition;
                    if (!e && o.done || e && e.activated) {
                        var a = e ? e.depth + 1 : 0;
                        V(this, o, a)
                    }
                },
                unbind: function() {
                    this.parentView && (this.parentView.childView = null), n.unbind.call(this)
                }
            }), t.elementDirective("router-view", r)
        }

        function D(t) {
            function e(t) {
                return t.protocol === location.protocol && t.hostname === location.hostname && t.port === location.port
            }
            var n = t.util,
                r = n.bind,
                i = n.isObject,
                o = n.addClass,
                a = n.removeClass;
            t.directive("link-active", {
                priority: 1001,
                bind: function() {
                    this.el.__v_link_active = !0
                }
            }), t.directive("link", {
                priority: 1e3,
                bind: function() {
                    var t = this.vm;
                    if (!t.$route) return void _("v-link can only be used inside a router-enabled app.");
                    this.router = t.$route.router, this.unwatch = t.$watch("$route", r(this.onRouteUpdate, this)), this.activeEl = this.el;
                    for (var e = this.el.parentNode; e;) {
                        if (e.__v_link_active) {
                            this.activeEl = e;
                            break
                        }
                        e = e.parentNode
                    }("A" !== this.el.tagName || "_blank" !== this.el.getAttribute("target")) && (this.handler = r(this.onClick, this), this.el.addEventListener("click", this.handler))
                },
                update: function(t) {
                    this.target = t, i(t) && (this.append = t.append, this.exact = t.exact, this.prevActiveClass = this.activeClass, this.activeClass = t.activeClass), this.onRouteUpdate(this.vm.$route)
                },
                onClick: function(t) {
                    if (!(t.metaKey || t.ctrlKey || t.shiftKey || t.defaultPrevented || 0 !== t.button)) {
                        var n = this.target;
                        if (n) t.preventDefault(), this.router.go(n);
                        else {
                            for (var r = t.target;
                                "A" !== r.tagName && r !== this.el;) r = r.parentNode;
                            "A" === r.tagName && e(r) && (t.preventDefault(), this.router.go({
                                path: r.pathname,
                                replace: n && n.replace,
                                append: n && n.append
                            }))
                        }
                    }
                },
                onRouteUpdate: function(t) {
                    var e = this.router._stringifyPath(this.target);
                    this.path !== e && (this.path = e, this.updateActiveMatch(), this.updateHref()), this.updateClasses(t.path)
                },
                updateActiveMatch: function() {
                    this.activeRE = this.path && !this.exact ? new RegExp("^" + this.path.replace(/\/$/, "").replace(rt, "").replace(nt, "\\$&") + "(\\/|$)") : null
                },
                updateHref: function() {
                    if ("A" === this.el.tagName) {
                        var t = this.path,
                            e = this.router,
                            n = "/" === t.charAt(0),
                            r = t && ("hash" === e.mode || n) ? e.history.formatPath(t, this.append) : t;
                        r ? this.el.href = r : this.el.removeAttribute("href")
                    }
                },
                updateClasses: function(t) {
                    var e = this.activeEl,
                        n = this.activeClass || this.router._linkActiveClass;
                    this.prevActiveClass !== n && a(e, this.prevActiveClass);
                    var r = this.path.replace(rt, "");
                    t = t.replace(rt, ""), this.exact ? r === t || "/" !== r.charAt(r.length - 1) && r === t.replace(et, "") ? o(e, n) : a(e, n) : this.activeRE && this.activeRE.test(t) ? o(e, n) : a(e, n)
                },
                unbind: function() {
                    this.el.removeEventListener("click", this.handler), this.unwatch && this.unwatch()
                }
            })
        }

        function z(t, e) {
            var n = e.component;
            ot.util.isPlainObject(n) && (n = e.component = ot.extend(n)), "function" != typeof n && (e.component = null, _('invalid component for route "' + t + '".'))
        }
        var Q = {};
        Q.classCallCheck = function(t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
        }, t.prototype = {
            to: function(t, e) {
                var n = this.delegate;
                if (n && n.willAddRoute && (t = n.willAddRoute(this.matcher.target, t)), this.matcher.add(this.path, t), e) {
                    if (0 === e.length) throw new Error("You must have an argument in the function passed to `to`");
                    this.matcher.addChild(this.path, t, e, this.delegate)
                }
                return this
            }
        }, e.prototype = {
            add: function(t, e) {
                this.routes[t] = e
            },
            addChild: function(t, r, i, o) {
                var a = new e(r);
                this.children[t] = a;
                var s = n(t, a, o);
                o && o.contextEntered && o.contextEntered(r, s), i(s)
            }
        };
        var F = ["/", ".", "*", "+", "?", "|", "(", ")", "[", "]", "{", "}", "\\"],
            U = new RegExp("(\\" + F.join("|\\") + ")", "g");
        s.prototype = {
            eachChar: function(t) {
                for (var e, n = this.string, r = 0, i = n.length; i > r; r++) e = n.charAt(r), t({
                    validChars: e
                })
            },
            regex: function() {
                return this.string.replace(U, "\\$1")
            },
            generate: function() {
                return this.string
            }
        }, h.prototype = {
            eachChar: function(t) {
                t({
                    invalidChars: "/",
                    repeat: !0
                })
            },
            regex: function() {
                return "([^/]+)"
            },
            generate: function(t) {
                var e = t[this.name];
                return null == e ? ":" + this.name : e
            }
        }, c.prototype = {
            eachChar: function(t) {
                t({
                    invalidChars: "",
                    repeat: !0
                })
            },
            regex: function() {
                return "(.+)"
            },
            generate: function(t) {
                var e = t[this.name];
                return null == e ? ":" + this.name : e
            }
        }, u.prototype = {
            eachChar: function() {},
            regex: function() {
                return ""
            },
            generate: function() {
                return ""
            }
        }, p.prototype = {
            get: function(t) {
                for (var e = this.nextStates, n = 0, r = e.length; r > n; n++) {
                    var i = e[n],
                        o = i.charSpec.validChars === t.validChars;
                    if (o = o && i.charSpec.invalidChars === t.invalidChars) return i
                }
            },
            put: function(t) {
                var e;
                return (e = this.get(t)) ? e : (e = new p(t), this.nextStates.push(e), t.repeat && e.nextStates.push(e), e)
            },
            match: function(t) {
                for (var e, n, r, i = this.nextStates, o = [], a = 0, s = i.length; s > a; a++) e = i[a], n = e.charSpec, "undefined" != typeof(r = n.validChars) ? -1 !== r.indexOf(t) && o.push(e) : "undefined" != typeof(r = n.invalidChars) && -1 === r.indexOf(t) && o.push(e);
                return o
            }
        };
        var I = Object.create || function(t) {
            function e() {}
            return e.prototype = t, new e
        };
        v.prototype = I({
            splice: Array.prototype.splice,
            slice: Array.prototype.slice,
            push: Array.prototype.push,
            length: 0,
            queryParams: null
        });
        var L = function() {
            this.rootState = new p, this.names = {}
        };
        L.prototype = {
            add: function(t, e) {
                for (var n, r = this.rootState, i = "^", o = {}, a = [], s = [], h = !0, c = 0, p = t.length; p > c; c++) {
                    var f = t[c],
                        d = [],
                        v = l(f.path, d, o);
                    s = s.concat(v);
                    for (var g = 0, m = v.length; m > g; g++) {
                        var _ = v[g];
                        _ instanceof u || (h = !1, r = r.put({
                            validChars: "/"
                        }), i += "/", r = y(r, _), i += _.regex())
                    }
                    var w = {
                        handler: f.handler,
                        names: d
                    };
                    a.push(w)
                }
                h && (r = r.put({
                    validChars: "/"
                }), i += "/"), r.handlers = a, r.regex = new RegExp(i + "$"), r.specificity = o, (n = e && e.as) && (this.names[n] = {
                    segments: s,
                    handlers: a
                })
            },
            handlersFor: function(t) {
                var e = this.names[t],
                    n = [];
                if (!e) throw new Error("There is no route named " + t);
                for (var r = 0, i = e.handlers.length; i > r; r++) n.push(e.handlers[r]);
                return n
            },
            hasRoute: function(t) {
                return !!this.names[t]
            },
            generate: function(t, e) {
                var n = this.names[t],
                    r = "";
                if (!n) throw new Error("There is no route named " + t);
                for (var i = n.segments, o = 0, a = i.length; a > o; o++) {
                    var s = i[o];
                    s instanceof u || (r += "/", r += s.generate(e))
                }
                return "/" !== r.charAt(0) && (r = "/" + r), e && e.queryParams && (r += this.generateQueryString(e.queryParams)), r
            },
            generateQueryString: function(t) {
                var e = [],
                    n = [];
                for (var r in t) t.hasOwnProperty(r) && n.push(r);
                n.sort();
                for (var i = 0, o = n.length; o > i; i++) {
                    r = n[i];
                    var s = t[r];
                    if (null != s) {
                        var h = encodeURIComponent(r);
                        if (a(s))
                            for (var c = 0, u = s.length; u > c; c++) {
                                var l = r + "[]=" + encodeURIComponent(s[c]);
                                e.push(l)
                            } else h += "=" + encodeURIComponent(s), e.push(h)
                    }
                }
                return 0 === e.length ? "" : "?" + e.join("&")
            },
            parseQueryString: function(t) {
                for (var e = t.split("&"), n = {}, r = 0; r < e.length; r++) {
                    var i, o = e[r].split("="),
                        a = m(o[0]),
                        s = a.length,
                        h = !1;
                    1 === o.length ? i = "true" : (s > 2 && "[]" === a.slice(s - 2) && (h = !0, a = a.slice(0, s - 2), n[a] || (n[a] = [])), i = o[1] ? m(o[1]) : ""), h ? n[a].push(i) : n[a] = i
                }
                return n
            },
            recognize: function(t) {
                var e, n, r, i, o = [this.rootState],
                    a = {},
                    s = !1;
                if (i = t.indexOf("?"), -1 !== i) {
                    var h = t.substr(i + 1, t.length);
                    t = t.substr(0, i), a = this.parseQueryString(h)
                }
                for (t = decodeURI(t), "/" !== t.charAt(0) && (t = "/" + t), e = t.length, e > 1 && "/" === t.charAt(e - 1) && (t = t.substr(0, e - 1), s = !0), n = 0, r = t.length; r > n && (o = d(o, t.charAt(n)), o.length); n++);
                var c = [];
                for (n = 0, r = o.length; r > n; n++) o[n].handlers && c.push(o[n]);
                o = f(c);
                var u = c[0];
                return u && u.handlers ? (s && "(.+)$" === u.regex.source.slice(-5) && (t += "/"), g(u, t, a)) : void 0
            }
        }, L.prototype.map = o, L.VERSION = "0.1.9";
        var N = L.prototype.generateQueryString,
            B = {},
            G = void 0,
            K = /#.*$/,
            X = function() {
                function t(e) {
                    var n = e.root,
                        r = e.onChange;
                    Q.classCallCheck(this, t), n ? ("/" !== n.charAt(0) && (n = "/" + n), this.root = n.replace(/\/$/, ""), this.rootRE = new RegExp("^\\" + this.root)) : this.root = null, this.onChange = r;
                    var i = document.querySelector("base");
                    this.base = i && i.getAttribute("href")
                }
                return t.prototype.start = function() {
                    var t = this;
                    this.listener = function(e) {
                        var n = decodeURI(location.pathname + location.search);
                        t.root && (n = n.replace(t.rootRE, "")), t.onChange(n, e && e.state, location.hash)
                    }, window.addEventListener("popstate", this.listener), this.listener()
                }, t.prototype.stop = function() {
                    window.removeEventListener("popstate", this.listener)
                }, t.prototype.go = function(t, e, n) {
                    var r = this.formatPath(t, n);
                    e ? history.replaceState({}, "", r) : (history.replaceState({
                        pos: {
                            x: window.pageXOffset,
                            y: window.pageYOffset
                        }
                    }, "", location.href), history.pushState({}, "", r));
                    var i = t.match(K),
                        o = i && i[0];
                    t = r.replace(K, "").replace(this.rootRE, ""), this.onChange(t, null, o)
                }, t.prototype.formatPath = function(t, e) {
                    return "/" === t.charAt(0) ? this.root ? this.root + "/" + t.replace(/^\//, "") : t : w(this.base || location.pathname, t, e)
                }, t
            }(),
            Y = function() {
                function t(e) {
                    var n = e.hashbang,
                        r = e.onChange;
                    Q.classCallCheck(this, t), this.hashbang = n, this.onChange = r
                }
                return t.prototype.start = function() {
                    var t = this;
                    this.listener = function() {
                        var e = location.hash,
                            n = e.replace(/^#!?/, "");
                        "/" !== n.charAt(0) && (n = "/" + n);
                        var r = t.formatPath(n);
                        if (r !== e) return void location.replace(r);
                        var i = location.search && e.indexOf("?") > -1 ? "&" + location.search.slice(1) : location.search;
                        t.onChange(decodeURI(e.replace(/^#!?/, "") + i))
                    }, window.addEventListener("hashchange", this.listener), this.listener()
                }, t.prototype.stop = function() {
                    window.removeEventListener("hashchange", this.listener)
                }, t.prototype.go = function(t, e, n) {
                    t = this.formatPath(t, n), e ? location.replace(t) : location.hash = t
                }, t.prototype.formatPath = function(t, e) {
                    var n = "/" === t.charAt(0),
                        r = "#" + (this.hashbang ? "!" : "");
                    return n ? r + t : r + w(location.hash.replace(/^#!?/, ""), t, e)
                }, t
            }(),
            J = function() {
                function t(e) {
                    var n = e.onChange;
                    Q.classCallCheck(this, t), this.onChange = n, this.currentPath = "/"
                }
                return t.prototype.start = function() {
                    this.onChange("/")
                }, t.prototype.stop = function() {}, t.prototype.go = function(t, e, n) {
                    t = this.currentPath = this.formatPath(t, n), this.onChange(t)
                }, t.prototype.formatPath = function(t, e) {
                    return "/" === t.charAt(0) ? t : w(this.currentPath, t, e)
                }, t
            }(),
            W = function() {
                function t(e, n, r) {
                    Q.classCallCheck(this, t), this.router = e, this.to = n, this.from = r, this.next = null, this.aborted = !1, this.done = !1
                }
                return t.prototype.abort = function() {
                    if (!this.aborted) {
                        this.aborted = !0;
                        var t = !this.from.path && "/" === this.to.path;
                        t || this.router.replace(this.from.path || "/")
                    }
                }, t.prototype.redirect = function(t) {
                    this.aborted || (this.aborted = !0, "string" == typeof t ? t = k(t, this.to.params, this.to.query) : (t.params = t.params || this.to.params, t.query = t.query || this.to.query), this.router.replace(t))
                }, t.prototype.start = function(t) {
                    for (var e = this, n = [], r = this.router._rootView; r;) n.unshift(r), r = r.childView;
                    var i = n.slice().reverse(),
                        o = this.activateQueue = j(this.to.matched).map(function(t) {
                            return t.handler
                        }),
                        a = void 0,
                        s = void 0;
                    for (a = 0; a < i.length && A(i[a], o[a], e); a++);
                    a > 0 && (s = i.slice(0, a), n = i.slice(a).reverse(), o = o.slice(a)), e.runQueue(n, E, function() {
                        e.runQueue(o, $, function() {
                            e.runQueue(n, x, function() {
                                if (e.router._onTransitionValidated(e), s && s.forEach(function(t) {
                                        return S(t, e)
                                    }), n.length) {
                                    var r = n[n.length - 1],
                                        i = s ? s.length : 0;
                                    V(r, e, i, t)
                                } else t()
                            })
                        })
                    })
                }, t.prototype.runQueue = function(t, e, n) {
                    function r(o) {
                        o >= t.length ? n() : e(t[o], i, function() {
                            r(o + 1)
                        })
                    }
                    var i = this;
                    r(0)
                }, t.prototype.callHook = function(t, e, n) {
                    var r = arguments.length <= 3 || void 0 === arguments[3] ? {} : arguments[3],
                        i = r.expectBoolean,
                        o = void 0 === i ? !1 : i,
                        a = r.postActivate,
                        s = void 0 === a ? !1 : a,
                        h = r.processData,
                        c = r.cleanup,
                        u = this,
                        l = !1,
                        p = function() {
                            c && c(), u.abort()
                        },
                        f = function(t) {
                            if (s ? v() : p(), t && !u.router._suppress) throw _("Uncaught error during transition: "), t instanceof Error ? t : new Error(t)
                        },
                        d = function(t) {
                            try {
                                f(t)
                            } catch (e) {
                                setTimeout(function() {
                                    throw e
                                }, 0)
                            }
                        },
                        v = function() {
                            return l ? void _("transition.next() should be called only once.") : (l = !0, u.aborted ? void(c && c()) : void(n && n()))
                        },
                        g = function(e) {
                            "boolean" == typeof e ? e ? v() : p() : b(e) ? e.then(function(t) {
                                t ? v() : p()
                            }, d) : t.length || v()
                        },
                        y = function(t) {
                            var e = void 0;
                            try {
                                e = h(t)
                            } catch (n) {
                                return f(n)
                            }
                            b(e) ? e.then(v, d) : v()
                        },
                        m = {
                            to: u.to,
                            from: u.from,
                            abort: p,
                            next: h ? y : v,
                            redirect: function() {
                                u.redirect.apply(u, arguments)
                            }
                        },
                        w = void 0;
                    try {
                        w = t.call(e, m)
                    } catch (C) {
                        return f(C)
                    }
                    o ? g(w) : b(w) ? h ? w.then(y, d) : w.then(v, d) : h && H(w) ? y(w) : t.length || v()
                }, t.prototype.callHooks = function(t, e, n, r) {
                    var i = this;
                    Array.isArray(t) ? this.runQueue(t, function(t, n, o) {
                        i.aborted || i.callHook(t, e, o, r)
                    }, n) : this.callHook(t, e, n, r)
                }, t
            }(),
            Z = /^(component|subRoutes)$/,
            tt = function st(t, e) {
                var n = this;
                Q.classCallCheck(this, st);
                var r = e._recognizer.recognize(t);
                r && ([].forEach.call(r, function(t) {
                    for (var e in t.handler) Z.test(e) || (n[e] = t.handler[e])
                }), this.query = r.queryParams, this.params = [].reduce.call(r, function(t, e) {
                    if (e.params)
                        for (var n in e.params) t[n] = e.params[n];
                    return t
                }, {})), this.path = t, this.router = e, this.matched = r || e._notFoundHandler, Object.freeze(this)
            },
            et = /\/$/,
            nt = /[-.*+?^${}()|[\]\/\\]/g,
            rt = /\?.*$/,
            it = {
                "abstract": J,
                hash: Y,
                html5: X
            },
            ot = void 0,
            at = function() {
                function t() {
                    var e = this,
                        n = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0],
                        r = n.hashbang,
                        i = void 0 === r ? !0 : r,
                        o = n["abstract"],
                        a = void 0 === o ? !1 : o,
                        s = n.history,
                        h = void 0 === s ? !1 : s,
                        c = n.saveScrollPosition,
                        u = void 0 === c ? !1 : c,
                        l = n.transitionOnLoad,
                        p = void 0 === l ? !1 : l,
                        f = n.suppressTransitionError,
                        d = void 0 === f ? !1 : f,
                        v = n.root,
                        g = void 0 === v ? null : v,
                        y = n.linkActiveClass,
                        m = void 0 === y ? "v-link-active" : y;
                    if (Q.classCallCheck(this, t), !t.installed) throw new Error("Please install the Router with Vue.use() before creating an instance.");
                    this.app = null, this._children = [], this._recognizer = new L, this._guardRecognizer = new L, this._started = !1, this._startCb = null, this._currentRoute = {}, this._currentTransition = null, this._previousTransition = null, this._notFoundHandler = null, this._notFoundRedirect = null, this._beforeEachHooks = [], this._afterEachHooks = [], this._rendered = !1, this._transitionOnLoad = p, this._root = g, this._abstract = a, this._hashbang = i;
                    var _ = "undefined" != typeof window && window.history && window.history.pushState;
                    this._history = h && _, this._historyFallback = h && !_;
                    var w = ot.util.inBrowser;
                    this.mode = !w || this._abstract ? "abstract" : this._history ? "html5" : "hash";
                    var b = it[this.mode];
                    this.history = new b({
                        root: g,
                        hashbang: this._hashbang,
                        onChange: function(t, n, r) {
                            e._match(t, n, r)
                        }
                    }), this._saveScrollPosition = u, this._linkActiveClass = m, this._suppress = d
                }
                return t.prototype.map = function(t) {
                    for (var e in t) this.on(e, t[e]);
                    return this
                }, t.prototype.on = function(t, e) {
                    return "*" === t ? this._notFound(e) : this._addRoute(t, e, []), this
                }, t.prototype.redirect = function(t) {
                    for (var e in t) this._addRedirect(e, t[e]);
                    return this
                }, t.prototype.alias = function(t) {
                    for (var e in t) this._addAlias(e, t[e]);
                    return this
                }, t.prototype.beforeEach = function(t) {
                    return this._beforeEachHooks.push(t), this
                }, t.prototype.afterEach = function(t) {
                    return this._afterEachHooks.push(t), this
                }, t.prototype.go = function(t) {
                    var e = !1,
                        n = !1;
                    ot.util.isObject(t) && (e = t.replace, n = t.append), t = this._stringifyPath(t), t && this.history.go(t, e, n)
                }, t.prototype.replace = function(t) {
                    "string" == typeof t && (t = {
                        path: t
                    }), t.replace = !0, this.go(t)
                }, t.prototype.start = function(t, e, n) {
                    if (this._started) return void _("already started.");
                    if (this._started = !0, this._startCb = n, !this.app) {
                        if (!t || !e) throw new Error("Must start vue-router with a component and a root container.");
                        if (t instanceof ot) throw new Error("Must start vue-router with a component, not a Vue instance.");
                        this._appContainer = e;
                        var r = this._appConstructor = "function" == typeof t ? t : ot.extend(t);
                        r.options.name = r.options.name || "RouterApp"
                    }
                    if (this._historyFallback) {
                        var i = window.location,
                            o = new X({
                                root: this._root
                            }),
                            a = o.root ? i.pathname.replace(o.rootRE, "") : i.pathname;
                        if (a && "/" !== a) return void i.assign((o.root || "") + "/" + this.history.formatPath(a) + i.search)
                    }
                    this.history.start()
                }, t.prototype.stop = function() {
                    this.history.stop(), this._started = !1
                }, t.prototype._addRoute = function(t, e, n) {
                    if (z(t, e), e.path = t, e.fullPath = (n.reduce(function(t, e) {
                            return t + e.path
                        }, "") + t).replace("//", "/"), n.push({
                            path: t,
                            handler: e
                        }), this._recognizer.add(n, {
                            as: e.name
                        }), e.subRoutes)
                        for (var r in e.subRoutes) this._addRoute(r, e.subRoutes[r], n.slice())
                }, t.prototype._notFound = function(t) {
                    z("*", t), this._notFoundHandler = [{
                        handler: t
                    }]
                }, t.prototype._addRedirect = function(t, e) {
                    "*" === t ? this._notFoundRedirect = e : this._addGuard(t, e, this.replace)
                }, t.prototype._addAlias = function(t, e) {
                    this._addGuard(t, e, this._match)
                }, t.prototype._addGuard = function(t, e, n) {
                    var r = this;
                    this._guardRecognizer.add([{
                        path: t,
                        handler: function(t, i) {
                            var o = k(e, t.params, i);
                            n.call(r, o)
                        }
                    }])
                }, t.prototype._checkGuard = function(t) {
                    var e = this._guardRecognizer.recognize(t);
                    return e ? (e[0].handler(e[0], e.queryParams), !0) : this._notFoundRedirect && (e = this._recognizer.recognize(t), !e) ? (this.replace(this._notFoundRedirect), !0) : void 0
                }, t.prototype._match = function(t, e, n) {
                    var r = this;
                    if (!this._checkGuard(t)) {
                        var i = this._currentRoute,
                            o = this._currentTransition;
                        if (o) {
                            if (o.to.path === t) return;
                            if (i.path === t) return o.aborted = !0, void(this._currentTransition = this._prevTransition);
                            o.aborted = !0
                        }
                        var a = new tt(t, this),
                            s = new W(this, a, i);
                        this._prevTransition = o, this._currentTransition = s, this.app || ! function() {
                            var t = r;
                            r.app = new r._appConstructor({
                                el: r._appContainer,
                                created: function() {
                                    this.$router = t
                                },
                                _meta: {
                                    $route: a
                                }
                            })
                        }();
                        var h = this._beforeEachHooks,
                            c = function() {
                                s.start(function() {
                                    r._postTransition(a, e, n)
                                })
                            };
                        h.length ? s.runQueue(h, function(t, e, n) {
                            s === r._currentTransition && s.callHook(t, null, n, {
                                expectBoolean: !0
                            })
                        }, c) : c(), !this._rendered && this._startCb && this._startCb.call(null), this._rendered = !0
                    }
                }, t.prototype._onTransitionValidated = function(t) {
                    var e = this._currentRoute = t.to;
                    this.app.$route !== e && (this.app.$route = e, this._children.forEach(function(t) {
                        t.$route = e
                    })), this._afterEachHooks.length && this._afterEachHooks.forEach(function(e) {
                        return e.call(null, {
                            to: t.to,
                            from: t.from
                        })
                    }), this._currentTransition.done = !0
                }, t.prototype._postTransition = function(t, e, n) {
                    var r = e && e.pos;
                    r && this._saveScrollPosition ? ot.nextTick(function() {
                        window.scrollTo(r.x, r.y)
                    }) : n && ot.nextTick(function() {
                        var t = document.getElementById(n.slice(1));
                        t && window.scrollTo(window.scrollX, t.offsetTop)
                    })
                }, t.prototype._stringifyPath = function(t) {
                    var e = "";
                    if (t && "object" == typeof t) {
                        if (t.name) {
                            var n = ot.util.extend,
                                r = this._currentTransition && this._currentTransition.to.params,
                                i = t.params || {},
                                o = r ? n(n({}, r), i) : i;
                            t.query && (o.queryParams = t.query), e = this._recognizer.generate(t.name, o)
                        } else if (t.path && (e = t.path, t.query)) {
                            var a = this._recognizer.generateQueryString(t.query);
                            e += e.indexOf("?") > -1 ? "&" + a.slice(1) : a
                        }
                    } else e = t ? t + "" : "";
                    return encodeURI(e)
                }, t
            }();
        return at.installed = !1, at.install = function(t) {
            return at.installed ? void _("already installed.") : (ot = t, q(ot), M(ot), D(ot), B.Vue = ot, void(at.installed = !0))
        }, "undefined" != typeof window && window.Vue && window.Vue.use(at), at
    });
});
