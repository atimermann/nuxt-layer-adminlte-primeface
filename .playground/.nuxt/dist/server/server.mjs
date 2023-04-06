import { reactive, getCurrentInstance, version, unref, inject, ref, watchEffect, watch, toRef, isRef, nextTick, shallowRef, computed, isReadonly, resolveComponent, resolveDirective, openBlock, createElementBlock, Fragment as Fragment$1, renderList, normalizeStyle, normalizeClass, createElementVNode, createBlock, withCtx, withDirectives, createCommentVNode, toDisplayString, resolveDynamicComponent, createVNode, Transition, vShow, renderSlot, Teleport, mergeProps, createTextVNode, createSlots, toHandlers, withKeys, withModifiers, vModelText, h, defineComponent, useSSRContext, provide, onErrorCaptured, onServerPrefetch, defineAsyncComponent, createApp } from "vue";
import { $fetch } from "ofetch";
import { useRuntimeConfig as useRuntimeConfig$1 } from "#internal/nitro";
import { createHooks } from "hookable";
import { getContext, executeAsync } from "unctx";
import { renderSSRHead } from "@unhead/ssr";
import { createServerHead as createServerHead$1, getActiveHead } from "unhead";
import { defineHeadPlugin } from "@unhead/shared";
import { createMemoryHistory, createRouter, useRoute as useRoute$1 } from "vue-router";
import { setResponseStatus as setResponseStatus$1, sendRedirect, createError as createError$1 } from "h3";
import { hasProtocol, parseURL, joinURL, isEqual } from "ufo";
import "destr";
import { ssrRenderComponent, ssrRenderSuspense } from "vue/server-renderer";
const appConfig = useRuntimeConfig$1().app;
const baseURL = () => appConfig.baseURL;
const nuxtAppCtx = /* @__PURE__ */ getContext("nuxt-app");
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.3.3";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: reactive({
      data: {},
      state: {},
      _errors: {},
      ...{ serverRendered: true }
    }),
    static: {
      data: {}
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: {},
    ...options
  };
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    async function contextCaller(hooks, args) {
      for (const hook of hooks) {
        await nuxtAppCtx.call(nuxtApp, () => hook(...args));
      }
    }
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  {
    if (nuxtApp.ssrContext) {
      nuxtApp.ssrContext.nuxt = nuxtApp;
    }
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    if (nuxtApp.ssrContext.payload) {
      Object.assign(nuxtApp.payload, nuxtApp.ssrContext.payload);
    }
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.payload.config = {
      public: options.ssrContext.runtimeConfig.public,
      app: options.ssrContext.runtimeConfig.app
    };
  }
  const runtimeConfig = options.ssrContext.runtimeConfig;
  const compatibilityConfig = new Proxy(runtimeConfig, {
    get(target, prop) {
      if (prop === "public") {
        return target.public;
      }
      return target[prop] ?? target.public[prop];
    },
    set(target, prop, value) {
      {
        return false;
      }
    }
  });
  nuxtApp.provide("config", compatibilityConfig);
  return nuxtApp;
}
async function applyPlugin(nuxtApp, plugin) {
  if (typeof plugin !== "function") {
    return;
  }
  const { provide: provide2 } = await callWithNuxt(nuxtApp, plugin, [nuxtApp]) || {};
  if (provide2 && typeof provide2 === "object") {
    for (const key in provide2) {
      nuxtApp.provide(key, provide2[key]);
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  for (const plugin of plugins2) {
    await applyPlugin(nuxtApp, plugin);
  }
}
function normalizePlugins(_plugins2) {
  const plugins2 = _plugins2.map((plugin) => {
    if (typeof plugin !== "function") {
      return null;
    }
    if (plugin.length > 1) {
      return (nuxtApp) => plugin(nuxtApp, nuxtApp.provide);
    }
    return plugin;
  }).filter(Boolean);
  return plugins2;
}
function defineNuxtPlugin(plugin) {
  plugin[NuxtPluginIndicator] = true;
  return plugin;
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => args ? setup(...args) : setup();
  {
    return nuxtAppCtx.callAsync(nuxt, fn);
  }
}
function useNuxtApp() {
  const nuxtAppInstance = nuxtAppCtx.tryUse();
  if (!nuxtAppInstance) {
    const vm = getCurrentInstance();
    if (!vm) {
      throw new Error("nuxt instance unavailable");
    }
    return vm.appContext.app.$nuxt;
  }
  return nuxtAppInstance;
}
function useRuntimeConfig() {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const theme = "";
const primevue_min = "";
const primeicons = "";
const primeflex = "";
const adminlte = "";
const components = {};
const components_plugin_KR1HBZs4kY = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  for (const name in components) {
    nuxtApp.vueApp.component(name, components[name]);
    nuxtApp.vueApp.component("Lazy" + name, components[name]);
  }
});
function resolveUnref(r) {
  return typeof r === "function" ? r() : unref(r);
}
function resolveUnrefHeadInput(ref2, lastKey = "") {
  if (ref2 instanceof Promise)
    return ref2;
  const root = resolveUnref(ref2);
  if (!ref2 || !root)
    return root;
  if (Array.isArray(root))
    return root.map((r) => resolveUnrefHeadInput(r, lastKey));
  if (typeof root === "object") {
    return Object.fromEntries(
      Object.entries(root).map(([k, v]) => {
        if (k === "titleTemplate" || k.startsWith("on"))
          return [k, unref(v)];
        return [k, resolveUnrefHeadInput(v, k)];
      })
    );
  }
  return root;
}
const Vue3 = version.startsWith("3");
const headSymbol = "usehead";
function injectHead() {
  return getCurrentInstance() && inject(headSymbol) || getActiveHead();
}
function vueInstall(head) {
  const plugin = {
    install(app) {
      if (Vue3) {
        app.config.globalProperties.$unhead = head;
        app.config.globalProperties.$head = head;
        app.provide(headSymbol, head);
      }
    }
  };
  return plugin.install;
}
function createServerHead(options = {}) {
  const head = createServerHead$1({
    ...options,
    plugins: [
      VueReactiveUseHeadPlugin(),
      ...(options == null ? void 0 : options.plugins) || []
    ]
  });
  head.install = vueInstall(head);
  return head;
}
const VueReactiveUseHeadPlugin = () => {
  return defineHeadPlugin({
    hooks: {
      "entries:resolve": function(ctx) {
        for (const entry2 of ctx.entries)
          entry2.resolvedInput = resolveUnrefHeadInput(entry2.input);
      }
    }
  });
};
function clientUseHead(input, options = {}) {
  const head = injectHead();
  const deactivated = ref(false);
  const resolvedInput = ref({});
  watchEffect(() => {
    resolvedInput.value = deactivated.value ? {} : resolveUnrefHeadInput(input);
  });
  const entry2 = head.push(resolvedInput.value, options);
  watch(resolvedInput, (e) => {
    entry2.patch(e);
  });
  getCurrentInstance();
  return entry2;
}
function serverUseHead(input, options = {}) {
  const head = injectHead();
  return head.push(input, options);
}
function useHead(input, options = {}) {
  var _a;
  const head = injectHead();
  if (head) {
    const isBrowser = !!((_a = head.resolvedOptions) == null ? void 0 : _a.document);
    if (options.mode === "server" && isBrowser || options.mode === "client" && !isBrowser)
      return;
    return isBrowser ? clientUseHead(input, options) : serverUseHead(input, options);
  }
}
const appHead = { "meta": [{ "name": "viewport", "content": "width=device-width, initial-scale=1" }, { "charset": "utf-8" }], "link": [], "style": [], "script": [], "noscript": [] };
const appLayoutTransition = false;
const appPageTransition = false;
const appKeepalive = false;
const unhead_3Bi0E2Ktsf = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const createHead = createServerHead;
  const head = createHead();
  head.push(appHead);
  nuxtApp.vueApp.use(head);
  {
    nuxtApp.ssrContext.renderMeta = async () => {
      const meta = await renderSSRHead(head);
      return {
        ...meta,
        bodyScriptsPrepend: meta.bodyTagsOpen,
        // resolves naming difference with NuxtMeta and Unhead
        bodyScripts: meta.bodyTags
      };
    };
  }
});
function polyfillAsVueUseHead(head) {
  const polyfilled = head;
  polyfilled.headTags = head.resolveTags;
  polyfilled.addEntry = head.push;
  polyfilled.addHeadObjs = head.push;
  polyfilled.addReactiveEntry = (input, options) => {
    const api = useHead(input, options);
    if (typeof api !== "undefined")
      return api.dispose;
    return () => {
    };
  };
  polyfilled.removeHeadObjs = () => {
  };
  polyfilled.updateDOM = () => {
    head.hooks.callHook("entries:updated", head);
  };
  polyfilled.unhead = head;
  return polyfilled;
}
const vueuse_head_polyfill_I556vu5uhL = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  polyfillAsVueUseHead(nuxtApp.vueApp._context.provides.usehead);
});
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = "$s" + _key;
  const nuxt = useNuxtApp();
  const state = toRef(nuxt.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxt.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
function useRequestEvent(nuxtApp = useNuxtApp()) {
  var _a;
  return (_a = nuxtApp.ssrContext) == null ? void 0 : _a.event;
}
function setResponseStatus(arg1, arg2, arg3) {
  if (arg1 && typeof arg1 !== "number") {
    return setResponseStatus$1(arg1, arg2, arg3);
  }
  return setResponseStatus$1(useRequestEvent(), arg1, arg2);
}
const useRouter = () => {
  var _a;
  return (_a = useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  if (getCurrentInstance()) {
    return inject("_route", useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
const defineNuxtRouteMiddleware = (middleware) => middleware;
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return true;
  }
  return false;
};
const navigateTo = (to, options) => {
  if (!to) {
    to = "/";
  }
  const toPath = typeof to === "string" ? to : to.path || "/";
  const isExternal = (options == null ? void 0 : options.external) || hasProtocol(toPath, { acceptRelative: true });
  if (isExternal && !(options == null ? void 0 : options.external)) {
    throw new Error("Navigating to external URL is not allowed by default. Use `navigateTo (url, { external: true })`.");
  }
  if (isExternal && parseURL(toPath).protocol === "script:") {
    throw new Error("Cannot navigate to an URL with script protocol.");
  }
  const router = useRouter();
  {
    const nuxtApp = useNuxtApp();
    if (nuxtApp.ssrContext && nuxtApp.ssrContext.event) {
      if (isProcessingMiddleware() && !isExternal) {
        setResponseStatus(nuxtApp.ssrContext.event, (options == null ? void 0 : options.redirectCode) || 302);
        return to;
      }
      const redirectLocation = isExternal ? toPath : joinURL(useRuntimeConfig().app.baseURL, router.resolve(to).fullPath || "/");
      return nuxtApp.callHook("app:redirected").then(() => sendRedirect(nuxtApp.ssrContext.event, redirectLocation, (options == null ? void 0 : options.redirectCode) || 302));
    }
  }
  if (isExternal) {
    if (options == null ? void 0 : options.replace) {
      location.replace(toPath);
    } else {
      location.href = toPath;
    }
    return Promise.resolve();
  }
  return (options == null ? void 0 : options.replace) ? router.replace(to) : router.push(to);
};
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (_err) => {
  const err = createError(_err);
  try {
    const nuxtApp = useNuxtApp();
    nuxtApp.callHook("app:error", err);
    const error = useError();
    error.value = error.value || err;
  } catch {
    throw err;
  }
  return err;
};
const createError = (err) => {
  const _err = createError$1(err);
  _err.__nuxt_error = true;
  return _err;
};
const __nuxt_page_meta = {
  layout: "admin"
};
const _routes = [
  {
    name: (__nuxt_page_meta == null ? void 0 : __nuxt_page_meta.name) ?? "index",
    path: (__nuxt_page_meta == null ? void 0 : __nuxt_page_meta.path) ?? "/",
    meta: __nuxt_page_meta || {},
    alias: (__nuxt_page_meta == null ? void 0 : __nuxt_page_meta.alias) || [],
    redirect: (__nuxt_page_meta == null ? void 0 : __nuxt_page_meta.redirect) || void 0,
    component: () => import("./_nuxt/index-73e96795.js").then((m) => m.default || m)
  }
];
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    let position = savedPosition || void 0;
    if (!position && from && to && to.meta.scrollToTop !== false && _isDifferentRoute(from, to)) {
      position = { left: 0, top: 0 };
    }
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash) };
      }
    }
    const hasTransition = (route) => !!(route.meta.pageTransition ?? appPageTransition);
    const hookToWait = hasTransition(from) && hasTransition(to) ? "page:transition:finish" : "page:finish";
    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce(hookToWait, async () => {
        await nextTick();
        if (to.hash) {
          position = { el: to.hash, top: _getHashElementScrollMarginTop(to.hash) };
        }
        resolve(position);
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = document.querySelector(selector);
    if (elem) {
      return parseFloat(getComputedStyle(elem).scrollMarginTop);
    }
  } catch {
  }
  return 0;
}
function _isDifferentRoute(a, b) {
  const samePageComponent = a.matched[0] === b.matched[0];
  if (!samePageComponent) {
    return true;
  }
  if (samePageComponent && JSON.stringify(a.params) !== JSON.stringify(b.params)) {
    return true;
  }
  return false;
}
const configRouterOptions = {};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  var _a;
  let __temp, __restore;
  if (!((_a = to.meta) == null ? void 0 : _a.validate)) {
    return;
  }
  useNuxtApp();
  useRouter();
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  {
    return result;
  }
});
const globalMiddleware = [
  validate
];
const namedMiddleware = {};
const router_CrWB4n4PyO = /* @__PURE__ */ defineNuxtPlugin(async (nuxtApp) => {
  var _a, _b;
  let __temp, __restore;
  let routerBase = useRuntimeConfig().app.baseURL;
  if (routerOptions.hashMode && !routerBase.includes("#")) {
    routerBase += "#";
  }
  const history = ((_a = routerOptions.history) == null ? void 0 : _a.call(routerOptions, routerBase)) ?? createMemoryHistory(routerBase);
  const routes = ((_b = routerOptions.routes) == null ? void 0 : _b.call(routerOptions, _routes)) ?? _routes;
  const initialURL = nuxtApp.ssrContext.url;
  const router = createRouter({
    ...routerOptions,
    history,
    routes
  });
  nuxtApp.vueApp.use(router);
  const previousRoute = shallowRef(router.currentRoute.value);
  router.afterEach((_to, from) => {
    previousRoute.value = from;
  });
  Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
    get: () => previousRoute.value
  });
  const _route = shallowRef(router.resolve(initialURL));
  const syncCurrentRoute = () => {
    _route.value = router.currentRoute.value;
  };
  nuxtApp.hook("page:finish", syncCurrentRoute);
  router.afterEach((to, from) => {
    var _a2, _b2, _c, _d;
    if (((_b2 = (_a2 = to.matched[0]) == null ? void 0 : _a2.components) == null ? void 0 : _b2.default) === ((_d = (_c = from.matched[0]) == null ? void 0 : _c.components) == null ? void 0 : _d.default)) {
      syncCurrentRoute();
    }
  });
  const route = {};
  for (const key in _route.value) {
    route[key] = computed(() => _route.value[key]);
  }
  nuxtApp._route = reactive(route);
  nuxtApp._middleware = nuxtApp._middleware || {
    global: [],
    named: {}
  };
  useError();
  try {
    if (true) {
      ;
      [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
      ;
    }
    ;
    [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
    ;
  } catch (error2) {
    [__temp, __restore] = executeAsync(() => callWithNuxt(nuxtApp, showError, [error2])), await __temp, __restore();
  }
  const initialLayout = useState("_layout");
  router.beforeEach(async (to, from) => {
    var _a2;
    to.meta = reactive(to.meta);
    if (nuxtApp.isHydrating && initialLayout.value && !isReadonly(to.meta.layout)) {
      to.meta.layout = initialLayout.value;
    }
    nuxtApp._processingMiddleware = true;
    const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
    for (const component of to.matched) {
      const componentMiddleware = component.meta.middleware;
      if (!componentMiddleware) {
        continue;
      }
      if (Array.isArray(componentMiddleware)) {
        for (const entry2 of componentMiddleware) {
          middlewareEntries.add(entry2);
        }
      } else {
        middlewareEntries.add(componentMiddleware);
      }
    }
    for (const entry2 of middlewareEntries) {
      const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_a2 = namedMiddleware[entry2]) == null ? void 0 : _a2.call(namedMiddleware).then((r) => r.default || r)) : entry2;
      if (!middleware) {
        throw new Error(`Unknown route middleware: '${entry2}'.`);
      }
      const result = await callWithNuxt(nuxtApp, middleware, [to, from]);
      {
        if (result === false || result instanceof Error) {
          const error2 = result || createError$1({
            statusCode: 404,
            statusMessage: `Page Not Found: ${initialURL}`
          });
          await callWithNuxt(nuxtApp, showError, [error2]);
          return false;
        }
      }
      if (result || result === false) {
        return result;
      }
    }
  });
  router.afterEach(async (to) => {
    delete nuxtApp._processingMiddleware;
    if (to.matched.length === 0) {
      await callWithNuxt(nuxtApp, showError, [createError$1({
        statusCode: 404,
        fatal: false,
        statusMessage: `Page not found: ${to.fullPath}`
      })]);
    } else {
      const currentURL = to.fullPath || "/";
      if (!isEqual(currentURL, initialURL, { trailingSlash: true })) {
        const event2 = await callWithNuxt(nuxtApp, useRequestEvent);
        const options = { redirectCode: event2.node.res.statusCode !== 200 ? event2.node.res.statusCode || 302 : 302 };
        await callWithNuxt(nuxtApp, navigateTo, [currentURL, options]);
      }
    }
  });
  nuxtApp.hooks.hookOnce("app:created", async () => {
    try {
      await router.replace({
        ...router.resolve(initialURL),
        name: void 0,
        // #4920, #$4982
        force: true
      });
    } catch (error2) {
      await callWithNuxt(nuxtApp, showError, [error2]);
    }
  });
  return { provide: { router } };
});
var DomHandler = {
  innerWidth(el) {
    if (el) {
      let width = el.offsetWidth;
      let style = getComputedStyle(el);
      width += parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      return width;
    }
    return 0;
  },
  width(el) {
    if (el) {
      let width = el.offsetWidth;
      let style = getComputedStyle(el);
      width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      return width;
    }
    return 0;
  },
  getWindowScrollTop() {
    let doc = document.documentElement;
    return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
  },
  getWindowScrollLeft() {
    let doc = document.documentElement;
    return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
  },
  getOuterWidth(el, margin) {
    if (el) {
      let width = el.offsetWidth;
      if (margin) {
        let style = getComputedStyle(el);
        width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      }
      return width;
    }
    return 0;
  },
  getOuterHeight(el, margin) {
    if (el) {
      let height = el.offsetHeight;
      if (margin) {
        let style = getComputedStyle(el);
        height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
      }
      return height;
    }
    return 0;
  },
  getClientHeight(el, margin) {
    if (el) {
      let height = el.clientHeight;
      if (margin) {
        let style = getComputedStyle(el);
        height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
      }
      return height;
    }
    return 0;
  },
  getViewport() {
    let win = window, d = document, e = d.documentElement, g = d.getElementsByTagName("body")[0], w = win.innerWidth || e.clientWidth || g.clientWidth, h2 = win.innerHeight || e.clientHeight || g.clientHeight;
    return { width: w, height: h2 };
  },
  getOffset(el) {
    if (el) {
      let rect = el.getBoundingClientRect();
      return {
        top: rect.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0),
        left: rect.left + (window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0)
      };
    }
    return {
      top: "auto",
      left: "auto"
    };
  },
  index(element) {
    if (element) {
      let children = element.parentNode.childNodes;
      let num = 0;
      for (let i = 0; i < children.length; i++) {
        if (children[i] === element)
          return num;
        if (children[i].nodeType === 1)
          num++;
      }
    }
    return -1;
  },
  addMultipleClasses(element, className) {
    if (element && className) {
      if (element.classList) {
        let styles = className.split(" ");
        for (let i = 0; i < styles.length; i++) {
          element.classList.add(styles[i]);
        }
      } else {
        let styles = className.split(" ");
        for (let i = 0; i < styles.length; i++) {
          element.className += " " + styles[i];
        }
      }
    }
  },
  addClass(element, className) {
    if (element && className) {
      if (element.classList)
        element.classList.add(className);
      else
        element.className += " " + className;
    }
  },
  removeClass(element, className) {
    if (element && className) {
      if (element.classList)
        element.classList.remove(className);
      else
        element.className = element.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    }
  },
  hasClass(element, className) {
    if (element) {
      if (element.classList)
        return element.classList.contains(className);
      else
        return new RegExp("(^| )" + className + "( |$)", "gi").test(element.className);
    }
    return false;
  },
  find(element, selector) {
    return this.isElement(element) ? element.querySelectorAll(selector) : [];
  },
  findSingle(element, selector) {
    return this.isElement(element) ? element.querySelector(selector) : null;
  },
  getHeight(el) {
    if (el) {
      let height = el.offsetHeight;
      let style = getComputedStyle(el);
      height -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
      return height;
    }
    return 0;
  },
  getWidth(el) {
    if (el) {
      let width = el.offsetWidth;
      let style = getComputedStyle(el);
      width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
      return width;
    }
    return 0;
  },
  absolutePosition(element, target) {
    if (element) {
      let elementDimensions = element.offsetParent ? { width: element.offsetWidth, height: element.offsetHeight } : this.getHiddenElementDimensions(element);
      let elementOuterHeight = elementDimensions.height;
      let elementOuterWidth = elementDimensions.width;
      let targetOuterHeight = target.offsetHeight;
      let targetOuterWidth = target.offsetWidth;
      let targetOffset = target.getBoundingClientRect();
      let windowScrollTop = this.getWindowScrollTop();
      let windowScrollLeft = this.getWindowScrollLeft();
      let viewport = this.getViewport();
      let top, left;
      if (targetOffset.top + targetOuterHeight + elementOuterHeight > viewport.height) {
        top = targetOffset.top + windowScrollTop - elementOuterHeight;
        element.style.transformOrigin = "bottom";
        if (top < 0) {
          top = windowScrollTop;
        }
      } else {
        top = targetOuterHeight + targetOffset.top + windowScrollTop;
        element.style.transformOrigin = "top";
      }
      if (targetOffset.left + elementOuterWidth > viewport.width)
        left = Math.max(0, targetOffset.left + windowScrollLeft + targetOuterWidth - elementOuterWidth);
      else
        left = targetOffset.left + windowScrollLeft;
      element.style.top = top + "px";
      element.style.left = left + "px";
    }
  },
  relativePosition(element, target) {
    if (element) {
      let elementDimensions = element.offsetParent ? { width: element.offsetWidth, height: element.offsetHeight } : this.getHiddenElementDimensions(element);
      const targetHeight = target.offsetHeight;
      const targetOffset = target.getBoundingClientRect();
      const viewport = this.getViewport();
      let top, left;
      if (targetOffset.top + targetHeight + elementDimensions.height > viewport.height) {
        top = -1 * elementDimensions.height;
        element.style.transformOrigin = "bottom";
        if (targetOffset.top + top < 0) {
          top = -1 * targetOffset.top;
        }
      } else {
        top = targetHeight;
        element.style.transformOrigin = "top";
      }
      if (elementDimensions.width > viewport.width) {
        left = targetOffset.left * -1;
      } else if (targetOffset.left + elementDimensions.width > viewport.width) {
        left = (targetOffset.left + elementDimensions.width - viewport.width) * -1;
      } else {
        left = 0;
      }
      element.style.top = top + "px";
      element.style.left = left + "px";
    }
  },
  getParents(element, parents = []) {
    return element["parentNode"] === null ? parents : this.getParents(element.parentNode, parents.concat([element.parentNode]));
  },
  getScrollableParents(element) {
    let scrollableParents = [];
    if (element) {
      let parents = this.getParents(element);
      const overflowRegex = /(auto|scroll)/;
      const overflowCheck = (node) => {
        let styleDeclaration = window["getComputedStyle"](node, null);
        return overflowRegex.test(styleDeclaration.getPropertyValue("overflow")) || overflowRegex.test(styleDeclaration.getPropertyValue("overflowX")) || overflowRegex.test(styleDeclaration.getPropertyValue("overflowY"));
      };
      for (let parent of parents) {
        let scrollSelectors = parent.nodeType === 1 && parent.dataset["scrollselectors"];
        if (scrollSelectors) {
          let selectors = scrollSelectors.split(",");
          for (let selector of selectors) {
            let el = this.findSingle(parent, selector);
            if (el && overflowCheck(el)) {
              scrollableParents.push(el);
            }
          }
        }
        if (parent.nodeType !== 9 && overflowCheck(parent)) {
          scrollableParents.push(parent);
        }
      }
    }
    return scrollableParents;
  },
  getHiddenElementOuterHeight(element) {
    if (element) {
      element.style.visibility = "hidden";
      element.style.display = "block";
      let elementHeight = element.offsetHeight;
      element.style.display = "none";
      element.style.visibility = "visible";
      return elementHeight;
    }
    return 0;
  },
  getHiddenElementOuterWidth(element) {
    if (element) {
      element.style.visibility = "hidden";
      element.style.display = "block";
      let elementWidth = element.offsetWidth;
      element.style.display = "none";
      element.style.visibility = "visible";
      return elementWidth;
    }
    return 0;
  },
  getHiddenElementDimensions(element) {
    if (element) {
      let dimensions = {};
      element.style.visibility = "hidden";
      element.style.display = "block";
      dimensions.width = element.offsetWidth;
      dimensions.height = element.offsetHeight;
      element.style.display = "none";
      element.style.visibility = "visible";
      return dimensions;
    }
    return 0;
  },
  fadeIn(element, duration) {
    if (element) {
      element.style.opacity = 0;
      let last = +/* @__PURE__ */ new Date();
      let opacity = 0;
      let tick = function() {
        opacity = +element.style.opacity + ((/* @__PURE__ */ new Date()).getTime() - last) / duration;
        element.style.opacity = opacity;
        last = +/* @__PURE__ */ new Date();
        if (+opacity < 1) {
          window.requestAnimationFrame && requestAnimationFrame(tick) || setTimeout(tick, 16);
        }
      };
      tick();
    }
  },
  fadeOut(element, ms) {
    if (element) {
      let opacity = 1, interval = 50, duration = ms, gap = interval / duration;
      let fading = setInterval(() => {
        opacity -= gap;
        if (opacity <= 0) {
          opacity = 0;
          clearInterval(fading);
        }
        element.style.opacity = opacity;
      }, interval);
    }
  },
  getUserAgent() {
    return navigator.userAgent;
  },
  appendChild(element, target) {
    if (this.isElement(target))
      target.appendChild(element);
    else if (target.el && target.elElement)
      target.elElement.appendChild(element);
    else
      throw new Error("Cannot append " + target + " to " + element);
  },
  isElement(obj) {
    return typeof HTMLElement === "object" ? obj instanceof HTMLElement : obj && typeof obj === "object" && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === "string";
  },
  scrollInView(container, item) {
    let borderTopValue = getComputedStyle(container).getPropertyValue("borderTopWidth");
    let borderTop = borderTopValue ? parseFloat(borderTopValue) : 0;
    let paddingTopValue = getComputedStyle(container).getPropertyValue("paddingTop");
    let paddingTop = paddingTopValue ? parseFloat(paddingTopValue) : 0;
    let containerRect = container.getBoundingClientRect();
    let itemRect = item.getBoundingClientRect();
    let offset = itemRect.top + document.body.scrollTop - (containerRect.top + document.body.scrollTop) - borderTop - paddingTop;
    let scroll = container.scrollTop;
    let elementHeight = container.clientHeight;
    let itemHeight = this.getOuterHeight(item);
    if (offset < 0) {
      container.scrollTop = scroll + offset;
    } else if (offset + itemHeight > elementHeight) {
      container.scrollTop = scroll + offset - elementHeight + itemHeight;
    }
  },
  clearSelection() {
    if (window.getSelection) {
      if (window.getSelection().empty) {
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges && window.getSelection().rangeCount > 0 && window.getSelection().getRangeAt(0).getClientRects().length > 0) {
        window.getSelection().removeAllRanges();
      }
    } else if (document["selection"] && document["selection"].empty) {
      try {
        document["selection"].empty();
      } catch (error) {
      }
    }
  },
  getSelection() {
    if (window.getSelection)
      return window.getSelection().toString();
    else if (document.getSelection)
      return document.getSelection().toString();
    else if (document["selection"])
      return document["selection"].createRange().text;
    return null;
  },
  calculateScrollbarWidth() {
    if (this.calculatedScrollbarWidth != null)
      return this.calculatedScrollbarWidth;
    let scrollDiv = document.createElement("div");
    scrollDiv.className = "p-scrollbar-measure";
    document.body.appendChild(scrollDiv);
    let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    this.calculatedScrollbarWidth = scrollbarWidth;
    return scrollbarWidth;
  },
  getBrowser() {
    if (!this.browser) {
      let matched = this.resolveUserAgent();
      this.browser = {};
      if (matched.browser) {
        this.browser[matched.browser] = true;
        this.browser["version"] = matched.version;
      }
      if (this.browser["chrome"]) {
        this.browser["webkit"] = true;
      } else if (this.browser["webkit"]) {
        this.browser["safari"] = true;
      }
    }
    return this.browser;
  },
  resolveUserAgent() {
    let ua = navigator.userAgent.toLowerCase();
    let match = /(chrome)[ ]([\w.]+)/.exec(ua) || /(webkit)[ ]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ ]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
    return {
      browser: match[1] || "",
      version: match[2] || "0"
    };
  },
  isVisible(element) {
    return element && element.offsetParent != null;
  },
  invokeElementMethod(element, methodName, args) {
    element[methodName].apply(element, args);
  },
  isExist(element) {
    return !!(element !== null && typeof element !== "undefined" && element.nodeName && element.parentNode);
  },
  isClient() {
    return false;
  },
  focus(el, options) {
    el && document.activeElement !== el && el.focus(options);
  },
  isFocusableElement(element, selector = "") {
    return this.isElement(element) ? element.matches(`button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector}`) : false;
  },
  getFocusableElements(element, selector = "") {
    let focusableElements = this.find(
      element,
      `button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector}`
    );
    let visibleFocusableElements = [];
    for (let focusableElement of focusableElements) {
      if (getComputedStyle(focusableElement).display != "none" && getComputedStyle(focusableElement).visibility != "hidden")
        visibleFocusableElements.push(focusableElement);
    }
    return visibleFocusableElements;
  },
  getFirstFocusableElement(element, selector) {
    const focusableElements = this.getFocusableElements(element, selector);
    return focusableElements.length > 0 ? focusableElements[0] : null;
  },
  getLastFocusableElement(element, selector) {
    const focusableElements = this.getFocusableElements(element, selector);
    return focusableElements.length > 0 ? focusableElements[focusableElements.length - 1] : null;
  },
  getNextFocusableElement(container, element, selector) {
    const focusableElements = this.getFocusableElements(container, selector);
    const index = focusableElements.length > 0 ? focusableElements.findIndex((el) => el === element) : -1;
    const nextIndex = index > -1 && focusableElements.length >= index + 1 ? index + 1 : -1;
    return nextIndex > -1 ? focusableElements[nextIndex] : null;
  },
  isClickable(element) {
    if (element) {
      const targetNode = element.nodeName;
      const parentNode = element.parentElement && element.parentElement.nodeName;
      return targetNode === "INPUT" || targetNode === "TEXTAREA" || targetNode === "BUTTON" || targetNode === "A" || parentNode === "INPUT" || parentNode === "TEXTAREA" || parentNode === "BUTTON" || parentNode === "A" || !!element.closest(".p-button, .p-checkbox, .p-radiobutton");
    }
    return false;
  },
  applyStyle(element, style) {
    if (typeof style === "string") {
      element.style.cssText = style;
    } else {
      for (let prop in style) {
        element.style[prop] = style[prop];
      }
    }
  },
  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window["MSStream"];
  },
  isAndroid() {
    return /(android)/i.test(navigator.userAgent);
  },
  isTouchDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  },
  exportCSV(csv, filename) {
    let blob = new Blob([csv], {
      type: "application/csv;charset=utf-8;"
    });
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, filename + ".csv");
    } else {
      let link = document.createElement("a");
      if (link.download !== void 0) {
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", filename + ".csv");
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        csv = "data:text/csv;charset=utf-8," + csv;
        window.open(encodeURI(csv));
      }
    }
  }
};
class ConnectedOverlayScrollHandler {
  constructor(element, listener = () => {
  }) {
    this.element = element;
    this.listener = listener;
  }
  bindScrollListener() {
    this.scrollableParents = DomHandler.getScrollableParents(this.element);
    for (let i = 0; i < this.scrollableParents.length; i++) {
      this.scrollableParents[i].addEventListener("scroll", this.listener);
    }
  }
  unbindScrollListener() {
    if (this.scrollableParents) {
      for (let i = 0; i < this.scrollableParents.length; i++) {
        this.scrollableParents[i].removeEventListener("scroll", this.listener);
      }
    }
  }
  destroy() {
    this.unbindScrollListener();
    this.element = null;
    this.listener = null;
    this.scrollableParents = null;
  }
}
function primebus() {
  const allHandlers = /* @__PURE__ */ new Map();
  return {
    on(type, handler2) {
      let handlers = allHandlers.get(type);
      if (!handlers)
        handlers = [handler2];
      else
        handlers.push(handler2);
      allHandlers.set(type, handlers);
    },
    off(type, handler2) {
      let handlers = allHandlers.get(type);
      if (handlers) {
        handlers.splice(handlers.indexOf(handler2) >>> 0, 1);
      }
    },
    emit(type, evt) {
      let handlers = allHandlers.get(type);
      if (handlers) {
        handlers.slice().map((handler2) => {
          handler2(evt);
        });
      }
    }
  };
}
var ObjectUtils = {
  equals(obj1, obj2, field) {
    if (field)
      return this.resolveFieldData(obj1, field) === this.resolveFieldData(obj2, field);
    else
      return this.deepEquals(obj1, obj2);
  },
  deepEquals(a, b) {
    if (a === b)
      return true;
    if (a && b && typeof a == "object" && typeof b == "object") {
      var arrA = Array.isArray(a), arrB = Array.isArray(b), i, length, key;
      if (arrA && arrB) {
        length = a.length;
        if (length != b.length)
          return false;
        for (i = length; i-- !== 0; )
          if (!this.deepEquals(a[i], b[i]))
            return false;
        return true;
      }
      if (arrA != arrB)
        return false;
      var dateA = a instanceof Date, dateB = b instanceof Date;
      if (dateA != dateB)
        return false;
      if (dateA && dateB)
        return a.getTime() == b.getTime();
      var regexpA = a instanceof RegExp, regexpB = b instanceof RegExp;
      if (regexpA != regexpB)
        return false;
      if (regexpA && regexpB)
        return a.toString() == b.toString();
      var keys = Object.keys(a);
      length = keys.length;
      if (length !== Object.keys(b).length)
        return false;
      for (i = length; i-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(b, keys[i]))
          return false;
      for (i = length; i-- !== 0; ) {
        key = keys[i];
        if (!this.deepEquals(a[key], b[key]))
          return false;
      }
      return true;
    }
    return a !== a && b !== b;
  },
  resolveFieldData(data, field) {
    if (data && Object.keys(data).length && field) {
      if (this.isFunction(field)) {
        return field(data);
      } else if (field.indexOf(".") === -1) {
        return data[field];
      } else {
        let fields = field.split(".");
        let value = data;
        for (var i = 0, len = fields.length; i < len; ++i) {
          if (value == null) {
            return null;
          }
          value = value[fields[i]];
        }
        return value;
      }
    } else {
      return null;
    }
  },
  isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  },
  getItemValue(obj, ...params) {
    return this.isFunction(obj) ? obj(...params) : obj;
  },
  filter(value, fields, filterValue) {
    var filteredItems = [];
    if (value) {
      for (let item of value) {
        for (let field of fields) {
          if (String(this.resolveFieldData(item, field)).toLowerCase().indexOf(filterValue.toLowerCase()) > -1) {
            filteredItems.push(item);
            break;
          }
        }
      }
    }
    return filteredItems;
  },
  reorderArray(value, from, to) {
    if (value && from !== to) {
      if (to >= value.length) {
        to %= value.length;
        from %= value.length;
      }
      value.splice(to, 0, value.splice(from, 1)[0]);
    }
  },
  findIndexInList(value, list) {
    let index = -1;
    if (list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i] === value) {
          index = i;
          break;
        }
      }
    }
    return index;
  },
  contains(value, list) {
    if (value != null && list && list.length) {
      for (let val of list) {
        if (this.equals(value, val))
          return true;
      }
    }
    return false;
  },
  insertIntoOrderedArray(item, index, arr, sourceArr) {
    if (arr.length > 0) {
      let injected = false;
      for (let i = 0; i < arr.length; i++) {
        let currentItemIndex = this.findIndexInList(arr[i], sourceArr);
        if (currentItemIndex > index) {
          arr.splice(i, 0, item);
          injected = true;
          break;
        }
      }
      if (!injected) {
        arr.push(item);
      }
    } else {
      arr.push(item);
    }
  },
  removeAccents(str) {
    if (str && str.search(/[\xC0-\xFF]/g) > -1) {
      str = str.replace(/[\xC0-\xC5]/g, "A").replace(/[\xC6]/g, "AE").replace(/[\xC7]/g, "C").replace(/[\xC8-\xCB]/g, "E").replace(/[\xCC-\xCF]/g, "I").replace(/[\xD0]/g, "D").replace(/[\xD1]/g, "N").replace(/[\xD2-\xD6\xD8]/g, "O").replace(/[\xD9-\xDC]/g, "U").replace(/[\xDD]/g, "Y").replace(/[\xDE]/g, "P").replace(/[\xE0-\xE5]/g, "a").replace(/[\xE6]/g, "ae").replace(/[\xE7]/g, "c").replace(/[\xE8-\xEB]/g, "e").replace(/[\xEC-\xEF]/g, "i").replace(/[\xF1]/g, "n").replace(/[\xF2-\xF6\xF8]/g, "o").replace(/[\xF9-\xFC]/g, "u").replace(/[\xFE]/g, "p").replace(/[\xFD\xFF]/g, "y");
    }
    return str;
  },
  getVNodeProp(vnode, prop) {
    let props = vnode.props;
    if (props) {
      let kebapProp = prop.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      let propName = Object.prototype.hasOwnProperty.call(props, kebapProp) ? kebapProp : prop;
      return vnode.type.props[prop].type === Boolean && props[propName] === "" ? true : props[propName];
    }
    return null;
  },
  isEmpty(value) {
    return value === null || value === void 0 || value === "" || Array.isArray(value) && value.length === 0 || !(value instanceof Date) && typeof value === "object" && Object.keys(value).length === 0;
  },
  isNotEmpty(value) {
    return !this.isEmpty(value);
  },
  isPrintableCharacter(char = "") {
    return this.isNotEmpty(char) && char.length === 1 && char.match(/\S| /);
  },
  /**
   * Firefox-v103 does not currently support the "findLast" method. It is stated that this method will be supported with Firefox-v104.
   * https://caniuse.com/mdn-javascript_builtins_array_findlast
   */
  findLast(arr, callback) {
    let item;
    if (this.isNotEmpty(arr)) {
      try {
        item = arr.findLast(callback);
      } catch {
        item = [...arr].reverse().find(callback);
      }
    }
    return item;
  },
  /**
   * Firefox-v103 does not currently support the "findLastIndex" method. It is stated that this method will be supported with Firefox-v104.
   * https://caniuse.com/mdn-javascript_builtins_array_findlastindex
   */
  findLastIndex(arr, callback) {
    let index = -1;
    if (this.isNotEmpty(arr)) {
      try {
        index = arr.findLastIndex(callback);
      } catch {
        index = arr.lastIndexOf([...arr].reverse().find(callback));
      }
    }
    return index;
  }
};
var lastId = 0;
function UniqueComponentId(prefix = "pv_id_") {
  lastId++;
  return `${prefix}${lastId}`;
}
function handler() {
  let zIndexes = [];
  const generateZIndex = (key, autoZIndex, baseZIndex = 999) => {
    const lastZIndex = getLastZIndex(key, autoZIndex, baseZIndex);
    const newZIndex = lastZIndex.value + (lastZIndex.key === key ? 0 : baseZIndex) + 1;
    zIndexes.push({ key, value: newZIndex });
    return newZIndex;
  };
  const revertZIndex = (zIndex) => {
    zIndexes = zIndexes.filter((obj) => obj.value !== zIndex);
  };
  const getCurrentZIndex = (key, autoZIndex) => {
    return getLastZIndex(key, autoZIndex).value;
  };
  const getLastZIndex = (key, autoZIndex, baseZIndex = 0) => {
    return [...zIndexes].reverse().find((obj) => autoZIndex ? true : obj.key === key) || { key, value: baseZIndex };
  };
  const getZIndex = (el) => {
    return el ? parseInt(el.style.zIndex, 10) || 0 : 0;
  };
  return {
    get: getZIndex,
    set: (key, el, baseZIndex) => {
      if (el) {
        el.style.zIndex = String(generateZIndex(key, true, baseZIndex));
      }
    },
    clear: (el) => {
      if (el) {
        revertZIndex(getZIndex(el));
        el.style.zIndex = "";
      }
    },
    getCurrent: (key) => getCurrentZIndex(key, true)
  };
}
var ZIndexUtils = handler();
const FilterMatchMode = {
  STARTS_WITH: "startsWith",
  CONTAINS: "contains",
  NOT_CONTAINS: "notContains",
  ENDS_WITH: "endsWith",
  EQUALS: "equals",
  NOT_EQUALS: "notEquals",
  IN: "in",
  LESS_THAN: "lt",
  LESS_THAN_OR_EQUAL_TO: "lte",
  GREATER_THAN: "gt",
  GREATER_THAN_OR_EQUAL_TO: "gte",
  BETWEEN: "between",
  DATE_IS: "dateIs",
  DATE_IS_NOT: "dateIsNot",
  DATE_BEFORE: "dateBefore",
  DATE_AFTER: "dateAfter"
};
const FilterOperator = {
  AND: "and",
  OR: "or"
};
const FilterService = {
  filter(value, fields, filterValue, filterMatchMode, filterLocale) {
    let filteredItems = [];
    if (value) {
      for (let item of value) {
        for (let field of fields) {
          let fieldValue = ObjectUtils.resolveFieldData(item, field);
          if (this.filters[filterMatchMode](fieldValue, filterValue, filterLocale)) {
            filteredItems.push(item);
            break;
          }
        }
      }
    }
    return filteredItems;
  },
  filters: {
    startsWith(value, filter, filterLocale) {
      if (filter === void 0 || filter === null || filter.trim() === "") {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      let filterValue = ObjectUtils.removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
      let stringValue = ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale);
      return stringValue.slice(0, filterValue.length) === filterValue;
    },
    contains(value, filter, filterLocale) {
      if (filter === void 0 || filter === null || typeof filter === "string" && filter.trim() === "") {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      let filterValue = ObjectUtils.removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
      let stringValue = ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale);
      return stringValue.indexOf(filterValue) !== -1;
    },
    notContains(value, filter, filterLocale) {
      if (filter === void 0 || filter === null || typeof filter === "string" && filter.trim() === "") {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      let filterValue = ObjectUtils.removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
      let stringValue = ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale);
      return stringValue.indexOf(filterValue) === -1;
    },
    endsWith(value, filter, filterLocale) {
      if (filter === void 0 || filter === null || filter.trim() === "") {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      let filterValue = ObjectUtils.removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
      let stringValue = ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale);
      return stringValue.indexOf(filterValue, stringValue.length - filterValue.length) !== -1;
    },
    equals(value, filter, filterLocale) {
      if (filter === void 0 || filter === null || typeof filter === "string" && filter.trim() === "") {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      if (value.getTime && filter.getTime)
        return value.getTime() === filter.getTime();
      else
        return ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale) == ObjectUtils.removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
    },
    notEquals(value, filter, filterLocale) {
      if (filter === void 0 || filter === null || typeof filter === "string" && filter.trim() === "") {
        return false;
      }
      if (value === void 0 || value === null) {
        return true;
      }
      if (value.getTime && filter.getTime)
        return value.getTime() !== filter.getTime();
      else
        return ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale) != ObjectUtils.removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
    },
    in(value, filter) {
      if (filter === void 0 || filter === null || filter.length === 0) {
        return true;
      }
      for (let i = 0; i < filter.length; i++) {
        if (ObjectUtils.equals(value, filter[i])) {
          return true;
        }
      }
      return false;
    },
    between(value, filter) {
      if (filter == null || filter[0] == null || filter[1] == null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      if (value.getTime)
        return filter[0].getTime() <= value.getTime() && value.getTime() <= filter[1].getTime();
      else
        return filter[0] <= value && value <= filter[1];
    },
    lt(value, filter) {
      if (filter === void 0 || filter === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      if (value.getTime && filter.getTime)
        return value.getTime() < filter.getTime();
      else
        return value < filter;
    },
    lte(value, filter) {
      if (filter === void 0 || filter === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      if (value.getTime && filter.getTime)
        return value.getTime() <= filter.getTime();
      else
        return value <= filter;
    },
    gt(value, filter) {
      if (filter === void 0 || filter === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      if (value.getTime && filter.getTime)
        return value.getTime() > filter.getTime();
      else
        return value > filter;
    },
    gte(value, filter) {
      if (filter === void 0 || filter === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      if (value.getTime && filter.getTime)
        return value.getTime() >= filter.getTime();
      else
        return value >= filter;
    },
    dateIs(value, filter) {
      if (filter === void 0 || filter === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      return value.toDateString() === filter.toDateString();
    },
    dateIsNot(value, filter) {
      if (filter === void 0 || filter === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      return value.toDateString() !== filter.toDateString();
    },
    dateBefore(value, filter) {
      if (filter === void 0 || filter === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      return value.getTime() < filter.getTime();
    },
    dateAfter(value, filter) {
      if (filter === void 0 || filter === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      return value.getTime() > filter.getTime();
    }
  },
  register(rule, fn) {
    this.filters[rule] = fn;
  }
};
const defaultOptions = {
  ripple: false,
  inputStyle: "outlined",
  locale: {
    startsWith: "Starts with",
    contains: "Contains",
    notContains: "Not contains",
    endsWith: "Ends with",
    equals: "Equals",
    notEquals: "Not equals",
    noFilter: "No Filter",
    lt: "Less than",
    lte: "Less than or equal to",
    gt: "Greater than",
    gte: "Greater than or equal to",
    dateIs: "Date is",
    dateIsNot: "Date is not",
    dateBefore: "Date is before",
    dateAfter: "Date is after",
    clear: "Clear",
    apply: "Apply",
    matchAll: "Match All",
    matchAny: "Match Any",
    addRule: "Add Rule",
    removeRule: "Remove Rule",
    accept: "Yes",
    reject: "No",
    choose: "Choose",
    upload: "Upload",
    cancel: "Cancel",
    completed: "Completed",
    pending: "Pending",
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    chooseYear: "Choose Year",
    chooseMonth: "Choose Month",
    chooseDate: "Choose Date",
    prevDecade: "Previous Decade",
    nextDecade: "Next Decade",
    prevYear: "Previous Year",
    nextYear: "Next Year",
    prevMonth: "Previous Month",
    nextMonth: "Next Month",
    prevHour: "Previous Hour",
    nextHour: "Next Hour",
    prevMinute: "Previous Minute",
    nextMinute: "Next Minute",
    prevSecond: "Previous Second",
    nextSecond: "Next Second",
    am: "am",
    pm: "pm",
    today: "Today",
    weekHeader: "Wk",
    firstDayOfWeek: 0,
    dateFormat: "mm/dd/yy",
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
    passwordPrompt: "Enter a password",
    emptyFilterMessage: "No results found",
    // @deprecated Use 'emptySearchMessage' option instead.
    searchMessage: "{0} results are available",
    selectionMessage: "{0} items selected",
    emptySelectionMessage: "No selected item",
    emptySearchMessage: "No results found",
    emptyMessage: "No available options",
    aria: {
      trueLabel: "True",
      falseLabel: "False",
      nullLabel: "Not Selected",
      star: "1 star",
      stars: "{star} stars",
      selectAll: "All items selected",
      unselectAll: "All items unselected",
      close: "Close",
      previous: "Previous",
      next: "Next",
      navigation: "Navigation",
      scrollTop: "Scroll Top",
      moveTop: "Move Top",
      moveUp: "Move Up",
      moveDown: "Move Down",
      moveBottom: "Move Bottom",
      moveToTarget: "Move to Target",
      moveToSource: "Move to Source",
      moveAllToTarget: "Move All to Target",
      moveAllToSource: "Move All to Source",
      pageLabel: "{page}",
      firstPageLabel: "First Page",
      lastPageLabel: "Last Page",
      nextPageLabel: "Next Page",
      prevPageLabel: "Previous Page",
      rowsPerPageLabel: "Rows per page",
      jumpToPageDropdownLabel: "Jump to Page Dropdown",
      jumpToPageInputLabel: "Jump to Page Input",
      selectRow: "Row Selected",
      unselectRow: "Row Unselected",
      expandRow: "Row Expanded",
      collapseRow: "Row Collapsed",
      showFilterMenu: "Show Filter Menu",
      hideFilterMenu: "Hide Filter Menu",
      filterOperator: "Filter Operator",
      filterConstraint: "Filter Constraint",
      editRow: "Row Edit",
      saveEdit: "Save Edit",
      cancelEdit: "Cancel Edit",
      listView: "List View",
      gridView: "Grid View",
      slide: "Slide",
      slideNumber: "{slideNumber}",
      zoomImage: "Zoom Image",
      zoomIn: "Zoom In",
      zoomOut: "Zoom Out",
      rotateRight: "Rotate Right",
      rotateLeft: "Rotate Left"
    }
  },
  filterMatchModeOptions: {
    text: [FilterMatchMode.STARTS_WITH, FilterMatchMode.CONTAINS, FilterMatchMode.NOT_CONTAINS, FilterMatchMode.ENDS_WITH, FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS],
    numeric: [FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS, FilterMatchMode.LESS_THAN, FilterMatchMode.LESS_THAN_OR_EQUAL_TO, FilterMatchMode.GREATER_THAN, FilterMatchMode.GREATER_THAN_OR_EQUAL_TO],
    date: [FilterMatchMode.DATE_IS, FilterMatchMode.DATE_IS_NOT, FilterMatchMode.DATE_BEFORE, FilterMatchMode.DATE_AFTER]
  },
  zIndex: {
    modal: 1100,
    overlay: 1e3,
    menu: 1e3,
    tooltip: 1100
  }
};
const PrimeVueSymbol = Symbol();
function switchTheme(currentTheme, newTheme, linkElementId, callback) {
  const linkElement = document.getElementById(linkElementId);
  const cloneLinkElement = linkElement.cloneNode(true);
  const newThemeUrl = linkElement.getAttribute("href").replace(currentTheme, newTheme);
  cloneLinkElement.setAttribute("id", linkElementId + "-clone");
  cloneLinkElement.setAttribute("href", newThemeUrl);
  cloneLinkElement.addEventListener("load", () => {
    linkElement.remove();
    cloneLinkElement.setAttribute("id", linkElementId);
    if (callback) {
      callback();
    }
  });
  linkElement.parentNode && linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);
}
var PrimeVue = {
  install: (app, options) => {
    let configOptions = options ? { ...defaultOptions, ...options } : { ...defaultOptions };
    const PrimeVue2 = {
      config: reactive(configOptions),
      changeTheme: switchTheme
    };
    app.config.globalProperties.$primevue = PrimeVue2;
    app.provide(PrimeVueSymbol, PrimeVue2);
  }
};
const pt = {
  startsWith: "Começa com",
  contains: "Contém",
  notContains: "Não contém",
  endsWith: "Termina com",
  equals: "Igual",
  notEquals: "Diferente",
  noFilter: "Sem filtro",
  lt: "Menor que",
  lte: "Menor que ou igual a",
  gt: "Maior que",
  gte: "Maior que ou igual a",
  dateIs: "Data é",
  dateIsNot: "Data não é",
  dateBefore: "Date é anterior",
  dateAfter: "Data é posterior",
  custom: "Customizado",
  clear: "Limpar",
  apply: "Aplicar",
  matchAll: "Match All",
  matchAny: "Match Any",
  addRule: "Adicionar Regra",
  removeRule: "Remover Regra",
  accept: "Sim",
  reject: "Não",
  choose: "Escolha",
  upload: "Upload",
  cancel: "Cancelar",
  dayNames: ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"],
  dayNamesShort: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"],
  dayNamesMin: ["Do", "Se", "Te", "Qa", "Qi", "Sx", "Sa"],
  monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
  monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
  today: "Hoje",
  weekHeader: "Sem",
  firstDayOfWeek: 0,
  dateFormat: "dd/mm/yy",
  weak: "Fraco",
  medium: "Médio",
  strong: "Forte",
  passwordPrompt: "Digite uma senha",
  emptyFilterMessage: "Sem opções disponíveis",
  emptyMessage: "Sem resultados",
  aria: {
    trueLabel: "True",
    falseLabel: "False",
    nullLabel: "Não selecionado",
    pageLabel: "Página",
    firstPageLabel: "Primeira Página",
    lastPageLabel: "Última Página",
    nextPageLabel: "Próxima",
    previousPageLabel: "Anterior"
  }
};
let timeout;
function bindEvents(el) {
  el.addEventListener("mousedown", onMouseDown);
}
function unbindEvents(el) {
  el.removeEventListener("mousedown", onMouseDown);
}
function create(el) {
  let ink = document.createElement("span");
  ink.className = "p-ink";
  ink.setAttribute("role", "presentation");
  ink.setAttribute("aria-hidden", "true");
  el.appendChild(ink);
  ink.addEventListener("animationend", onAnimationEnd);
}
function remove(el) {
  let ink = getInk(el);
  if (ink) {
    unbindEvents(el);
    ink.removeEventListener("animationend", onAnimationEnd);
    ink.remove();
  }
}
function onMouseDown(event2) {
  let target = event2.currentTarget;
  let ink = getInk(target);
  if (!ink || getComputedStyle(ink, null).display === "none") {
    return;
  }
  DomHandler.removeClass(ink, "p-ink-active");
  if (!DomHandler.getHeight(ink) && !DomHandler.getWidth(ink)) {
    let d = Math.max(DomHandler.getOuterWidth(target), DomHandler.getOuterHeight(target));
    ink.style.height = d + "px";
    ink.style.width = d + "px";
  }
  let offset = DomHandler.getOffset(target);
  let x = event2.pageX - offset.left + document.body.scrollTop - DomHandler.getWidth(ink) / 2;
  let y = event2.pageY - offset.top + document.body.scrollLeft - DomHandler.getHeight(ink) / 2;
  ink.style.top = y + "px";
  ink.style.left = x + "px";
  DomHandler.addClass(ink, "p-ink-active");
  timeout = setTimeout(() => {
    if (ink) {
      DomHandler.removeClass(ink, "p-ink-active");
    }
  }, 401);
}
function onAnimationEnd(event2) {
  if (timeout) {
    clearTimeout(timeout);
  }
  DomHandler.removeClass(event2.currentTarget, "p-ink-active");
}
function getInk(el) {
  for (let i = 0; i < el.children.length; i++) {
    if (typeof el.children[i].className === "string" && el.children[i].className.indexOf("p-ink") !== -1) {
      return el.children[i];
    }
  }
  return null;
}
const Ripple = {
  mounted(el, binding) {
    if (binding.instance.$primevue && binding.instance.$primevue.config && binding.instance.$primevue.config.ripple) {
      create(el);
      bindEvents(el);
    }
  },
  unmounted(el) {
    remove(el);
  }
};
var script$2$3 = {
  name: "PanelMenuSub",
  emits: ["item-toggle"],
  props: {
    panelId: {
      type: String,
      default: null
    },
    focusedItemId: {
      type: String,
      default: null
    },
    items: {
      type: Array,
      default: null
    },
    level: {
      type: Number,
      default: 0
    },
    template: {
      type: Function,
      default: null
    },
    activeItemPath: {
      type: Object,
      default: null
    },
    exact: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    getItemId(processedItem) {
      return `${this.panelId}_${processedItem.key}`;
    },
    getItemKey(processedItem) {
      return this.getItemId(processedItem);
    },
    getItemProp(processedItem, name, params) {
      return processedItem && processedItem.item ? ObjectUtils.getItemValue(processedItem.item[name], params) : void 0;
    },
    getItemLabel(processedItem) {
      return this.getItemProp(processedItem, "label");
    },
    isItemActive(processedItem) {
      return this.activeItemPath.some((path) => path.key === processedItem.key);
    },
    isItemVisible(processedItem) {
      return this.getItemProp(processedItem, "visible") !== false;
    },
    isItemDisabled(processedItem) {
      return this.getItemProp(processedItem, "disabled");
    },
    isItemFocused(processedItem) {
      return this.focusedItemId === this.getItemId(processedItem);
    },
    isItemGroup(processedItem) {
      return ObjectUtils.isNotEmpty(processedItem.items);
    },
    onItemClick(event2, processedItem) {
      this.getItemProp(processedItem, "command", { originalEvent: event2, item: processedItem.item });
      this.$emit("item-toggle", { processedItem, expanded: !this.isItemActive(processedItem) });
    },
    onItemToggle(event2) {
      this.$emit("item-toggle", event2);
    },
    onItemActionClick(event2, navigate) {
      navigate && navigate(event2);
    },
    getAriaSetSize() {
      return this.items.filter((processedItem) => this.isItemVisible(processedItem) && !this.getItemProp(processedItem, "separator")).length;
    },
    getAriaPosInset(index) {
      return index - this.items.slice(0, index).filter((processedItem) => this.isItemVisible(processedItem) && this.getItemProp(processedItem, "separator")).length + 1;
    },
    getItemClass(processedItem) {
      return [
        "p-menuitem",
        this.getItemProp(processedItem, "class"),
        {
          "p-focus": this.isItemFocused(processedItem),
          "p-disabled": this.isItemDisabled(processedItem)
        }
      ];
    },
    getItemActionClass(processedItem, routerProps) {
      return [
        "p-menuitem-link",
        {
          "router-link-active": routerProps && routerProps.isActive,
          "router-link-active-exact": this.exact && routerProps && routerProps.isExactActive
        }
      ];
    },
    getItemIconClass(processedItem) {
      return ["p-menuitem-icon", this.getItemProp(processedItem, "icon")];
    },
    getItemToggleIconClass(processedItem) {
      return ["p-submenu-icon", this.isItemActive(processedItem) ? "pi pi-fw pi-chevron-down" : "pi pi-fw pi-chevron-right"];
    },
    getSeparatorItemClass(processedItem) {
      return ["p-menuitem-separator", this.getItemProp(processedItem, "class")];
    }
  },
  directives: {
    ripple: Ripple
  }
};
const _hoisted_1$1$5 = { class: "p-submenu-list" };
const _hoisted_2$1$5 = ["id", "aria-label", "aria-expanded", "aria-level", "aria-setsize", "aria-posinset"];
const _hoisted_3$1$4 = ["onClick"];
const _hoisted_4$1$4 = ["href", "onClick"];
const _hoisted_5$1$2 = { class: "p-menuitem-text" };
const _hoisted_6$1$2 = ["href", "target"];
const _hoisted_7$1$2 = { class: "p-menuitem-text" };
const _hoisted_8$1$2 = { class: "p-toggleable-content" };
function render$2$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");
  const _component_PanelMenuSub = resolveComponent("PanelMenuSub", true);
  const _directive_ripple = resolveDirective("ripple");
  return openBlock(), createElementBlock("ul", _hoisted_1$1$5, [
    (openBlock(true), createElementBlock(Fragment$1, null, renderList($props.items, (processedItem, index) => {
      return openBlock(), createElementBlock(Fragment$1, {
        key: $options.getItemKey(processedItem)
      }, [
        $options.isItemVisible(processedItem) && !$options.getItemProp(processedItem, "separator") ? (openBlock(), createElementBlock("li", {
          key: 0,
          id: $options.getItemId(processedItem),
          style: normalizeStyle($options.getItemProp(processedItem, "style")),
          class: normalizeClass($options.getItemClass(processedItem)),
          role: "treeitem",
          "aria-label": $options.getItemLabel(processedItem),
          "aria-expanded": $options.isItemGroup(processedItem) ? $options.isItemActive(processedItem) : void 0,
          "aria-level": $props.level + 1,
          "aria-setsize": $options.getAriaSetSize(),
          "aria-posinset": $options.getAriaPosInset(index)
        }, [
          createElementVNode("div", {
            class: "p-menuitem-content",
            onClick: ($event) => $options.onItemClick($event, processedItem)
          }, [
            !$props.template ? (openBlock(), createElementBlock(Fragment$1, { key: 0 }, [
              $options.getItemProp(processedItem, "to") && !$options.isItemDisabled(processedItem) ? (openBlock(), createBlock(_component_router_link, {
                key: 0,
                to: $options.getItemProp(processedItem, "to"),
                custom: ""
              }, {
                default: withCtx(({ navigate, href, isActive, isExactActive }) => [
                  withDirectives((openBlock(), createElementBlock("a", {
                    href,
                    class: normalizeClass($options.getItemActionClass(processedItem, { isActive, isExactActive })),
                    tabindex: "-1",
                    "aria-hidden": "true",
                    onClick: ($event) => $options.onItemActionClick($event, navigate)
                  }, [
                    $options.getItemProp(processedItem, "icon") ? (openBlock(), createElementBlock("span", {
                      key: 0,
                      class: normalizeClass($options.getItemIconClass(processedItem))
                    }, null, 2)) : createCommentVNode("", true),
                    createElementVNode("span", _hoisted_5$1$2, toDisplayString($options.getItemLabel(processedItem)), 1)
                  ], 10, _hoisted_4$1$4)), [
                    [_directive_ripple]
                  ])
                ]),
                _: 2
              }, 1032, ["to"])) : withDirectives((openBlock(), createElementBlock("a", {
                key: 1,
                href: $options.getItemProp(processedItem, "url"),
                class: normalizeClass($options.getItemActionClass(processedItem)),
                target: $options.getItemProp(processedItem, "target"),
                tabindex: "-1",
                "aria-hidden": "true"
              }, [
                $options.isItemGroup(processedItem) ? (openBlock(), createElementBlock("span", {
                  key: 0,
                  class: normalizeClass($options.getItemToggleIconClass(processedItem))
                }, null, 2)) : createCommentVNode("", true),
                $options.getItemProp(processedItem, "icon") ? (openBlock(), createElementBlock("span", {
                  key: 1,
                  class: normalizeClass($options.getItemIconClass(processedItem))
                }, null, 2)) : createCommentVNode("", true),
                createElementVNode("span", _hoisted_7$1$2, toDisplayString($options.getItemLabel(processedItem)), 1)
              ], 10, _hoisted_6$1$2)), [
                [_directive_ripple]
              ])
            ], 64)) : (openBlock(), createBlock(resolveDynamicComponent($props.template), {
              key: 1,
              item: processedItem.item
            }, null, 8, ["item"]))
          ], 8, _hoisted_3$1$4),
          createVNode(Transition, { name: "p-toggleable-content" }, {
            default: withCtx(() => [
              withDirectives(createElementVNode("div", _hoisted_8$1$2, [
                $options.isItemVisible(processedItem) && $options.isItemGroup(processedItem) ? (openBlock(), createBlock(_component_PanelMenuSub, {
                  key: 0,
                  id: $options.getItemId(processedItem) + "_list",
                  role: "group",
                  panelId: $props.panelId,
                  focusedItemId: $props.focusedItemId,
                  items: processedItem.items,
                  level: $props.level + 1,
                  template: $props.template,
                  activeItemPath: $props.activeItemPath,
                  exact: $props.exact,
                  onItemToggle: $options.onItemToggle
                }, null, 8, ["id", "panelId", "focusedItemId", "items", "level", "template", "activeItemPath", "exact", "onItemToggle"])) : createCommentVNode("", true)
              ], 512), [
                [vShow, $options.isItemActive(processedItem)]
              ])
            ]),
            _: 2
          }, 1024)
        ], 14, _hoisted_2$1$5)) : createCommentVNode("", true),
        $options.isItemVisible(processedItem) && $options.getItemProp(processedItem, "separator") ? (openBlock(), createElementBlock("li", {
          key: 1,
          style: normalizeStyle($options.getItemProp(processedItem, "style")),
          class: normalizeClass($options.getSeparatorItemClass(processedItem)),
          role: "separator"
        }, null, 6)) : createCommentVNode("", true)
      ], 64);
    }), 128))
  ]);
}
script$2$3.render = render$2$3;
var script$1$5 = {
  name: "PanelMenuList",
  emits: ["item-toggle", "header-focus"],
  props: {
    panelId: {
      type: String,
      default: null
    },
    items: {
      type: Array,
      default: null
    },
    template: {
      type: Function,
      default: null
    },
    expandedKeys: {
      type: Object,
      default: null
    },
    exact: {
      type: Boolean,
      default: true
    }
  },
  searchTimeout: null,
  searchValue: null,
  data() {
    return {
      focused: false,
      focusedItem: null,
      activeItemPath: []
    };
  },
  watch: {
    expandedKeys(newValue) {
      this.autoUpdateActiveItemPath(newValue);
    }
  },
  mounted() {
    this.autoUpdateActiveItemPath(this.expandedKeys);
  },
  methods: {
    getItemProp(processedItem, name) {
      return processedItem && processedItem.item ? ObjectUtils.getItemValue(processedItem.item[name]) : void 0;
    },
    getItemLabel(processedItem) {
      return this.getItemProp(processedItem, "label");
    },
    isItemVisible(processedItem) {
      return this.getItemProp(processedItem, "visible") !== false;
    },
    isItemDisabled(processedItem) {
      return this.getItemProp(processedItem, "disabled");
    },
    isItemActive(processedItem) {
      return this.activeItemPath.some((path) => path.key === processedItem.parentKey);
    },
    isItemGroup(processedItem) {
      return ObjectUtils.isNotEmpty(processedItem.items);
    },
    onFocus(event2) {
      this.focused = true;
      this.focusedItem = this.focusedItem || (this.isElementInPanel(event2, event2.relatedTarget) ? this.findFirstItem() : this.findLastItem());
    },
    onBlur() {
      this.focused = false;
      this.focusedItem = null;
      this.searchValue = "";
    },
    onKeyDown(event2) {
      const metaKey = event2.metaKey || event2.ctrlKey;
      switch (event2.code) {
        case "ArrowDown":
          this.onArrowDownKey(event2);
          break;
        case "ArrowUp":
          this.onArrowUpKey(event2);
          break;
        case "ArrowLeft":
          this.onArrowLeftKey(event2);
          break;
        case "ArrowRight":
          this.onArrowRightKey(event2);
          break;
        case "Home":
          this.onHomeKey(event2);
          break;
        case "End":
          this.onEndKey(event2);
          break;
        case "Space":
          this.onSpaceKey(event2);
          break;
        case "Enter":
          this.onEnterKey(event2);
          break;
        case "Escape":
        case "Tab":
        case "PageDown":
        case "PageUp":
        case "Backspace":
        case "ShiftLeft":
        case "ShiftRight":
          break;
        default:
          if (!metaKey && ObjectUtils.isPrintableCharacter(event2.key)) {
            this.searchItems(event2, event2.key);
          }
          break;
      }
    },
    onArrowDownKey(event2) {
      const processedItem = ObjectUtils.isNotEmpty(this.focusedItem) ? this.findNextItem(this.focusedItem) : this.findFirstItem();
      this.changeFocusedItem({ originalEvent: event2, processedItem, focusOnNext: true });
      event2.preventDefault();
    },
    onArrowUpKey(event2) {
      const processedItem = ObjectUtils.isNotEmpty(this.focusedItem) ? this.findPrevItem(this.focusedItem) : this.findLastItem();
      this.changeFocusedItem({ originalEvent: event2, processedItem, selfCheck: true });
      event2.preventDefault();
    },
    onArrowLeftKey(event2) {
      if (ObjectUtils.isNotEmpty(this.focusedItem)) {
        const matched = this.activeItemPath.some((p) => p.key === this.focusedItem.key);
        if (matched) {
          this.activeItemPath = this.activeItemPath.filter((p) => p.key !== this.focusedItem.key);
        } else {
          this.focusedItem = ObjectUtils.isNotEmpty(this.focusedItem.parent) ? this.focusedItem.parent : this.focusedItem;
        }
        event2.preventDefault();
      }
    },
    onArrowRightKey(event2) {
      if (ObjectUtils.isNotEmpty(this.focusedItem)) {
        const grouped = this.isItemGroup(this.focusedItem);
        if (grouped) {
          const matched = this.activeItemPath.some((p) => p.key === this.focusedItem.key);
          if (matched) {
            this.onArrowDownKey(event2);
          } else {
            this.activeItemPath = this.activeItemPath.filter((p) => p.parentKey !== this.focusedItem.parentKey);
            this.activeItemPath.push(this.focusedItem);
          }
        }
        event2.preventDefault();
      }
    },
    onHomeKey(event2) {
      this.changeFocusedItem({ originalEvent: event2, processedItem: this.findFirstItem(), allowHeaderFocus: false });
      event2.preventDefault();
    },
    onEndKey(event2) {
      this.changeFocusedItem({ originalEvent: event2, processedItem: this.findLastItem(), focusOnNext: true, allowHeaderFocus: false });
      event2.preventDefault();
    },
    onEnterKey(event2) {
      if (ObjectUtils.isNotEmpty(this.focusedItem)) {
        const element = DomHandler.findSingle(this.$el, `li[id="${`${this.focusedItemId}`}"]`);
        const anchorElement = element && (DomHandler.findSingle(element, ".p-menuitem-link") || DomHandler.findSingle(element, "a,button"));
        anchorElement ? anchorElement.click() : element && element.click();
      }
      event2.preventDefault();
    },
    onSpaceKey(event2) {
      this.onEnterKey(event2);
    },
    onItemToggle(event2) {
      const { processedItem, expanded } = event2;
      if (this.expandedKeys) {
        this.$emit("item-toggle", { item: processedItem.item, expanded });
      } else {
        this.activeItemPath = this.activeItemPath.filter((p) => p.parentKey !== processedItem.parentKey);
        expanded && this.activeItemPath.push(processedItem);
      }
      this.focusedItem = processedItem;
      DomHandler.focus(this.$el);
    },
    isElementInPanel(event2, element) {
      const panel = event2.currentTarget.closest(".p-panelmenu-panel");
      return panel && panel.contains(element);
    },
    isItemMatched(processedItem) {
      return this.isValidItem(processedItem) && this.getItemLabel(processedItem).toLocaleLowerCase(this.searchLocale).startsWith(this.searchValue.toLocaleLowerCase(this.searchLocale));
    },
    isVisibleItem(processedItem) {
      return !!processedItem && (processedItem.level === 0 || this.isItemActive(processedItem)) && this.isItemVisible(processedItem);
    },
    isValidItem(processedItem) {
      return !!processedItem && !this.isItemDisabled(processedItem);
    },
    findFirstItem() {
      return this.visibleItems.find((processedItem) => this.isValidItem(processedItem));
    },
    findLastItem() {
      return ObjectUtils.findLast(this.visibleItems, (processedItem) => this.isValidItem(processedItem));
    },
    findNextItem(processedItem) {
      const index = this.visibleItems.findIndex((item) => item.key === processedItem.key);
      const matchedItem = index < this.visibleItems.length - 1 ? this.visibleItems.slice(index + 1).find((pItem) => this.isValidItem(pItem)) : void 0;
      return matchedItem || processedItem;
    },
    findPrevItem(processedItem) {
      const index = this.visibleItems.findIndex((item) => item.key === processedItem.key);
      const matchedItem = index > 0 ? ObjectUtils.findLast(this.visibleItems.slice(0, index), (pItem) => this.isValidItem(pItem)) : void 0;
      return matchedItem || processedItem;
    },
    searchItems(event2, char) {
      this.searchValue = (this.searchValue || "") + char;
      let matchedItem = null;
      let matched = false;
      if (ObjectUtils.isNotEmpty(this.focusedItem)) {
        const focusedItemIndex = this.visibleItems.findIndex((processedItem) => processedItem.key === this.focusedItem.key);
        matchedItem = this.visibleItems.slice(focusedItemIndex).find((processedItem) => this.isItemMatched(processedItem));
        matchedItem = ObjectUtils.isEmpty(matchedItem) ? this.visibleItems.slice(0, focusedItemIndex).find((processedItem) => this.isItemMatched(processedItem)) : matchedItem;
      } else {
        matchedItem = this.visibleItems.find((processedItem) => this.isItemMatched(processedItem));
      }
      if (ObjectUtils.isNotEmpty(matchedItem)) {
        matched = true;
      }
      if (ObjectUtils.isEmpty(matchedItem) && ObjectUtils.isEmpty(this.focusedItem)) {
        matchedItem = this.findFirstItem();
      }
      if (ObjectUtils.isNotEmpty(matchedItem)) {
        this.changeFocusedItem({
          originalEvent: event2,
          processedItem: matchedItem,
          allowHeaderFocus: false
        });
      }
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(() => {
        this.searchValue = "";
        this.searchTimeout = null;
      }, 500);
      return matched;
    },
    changeFocusedItem(event2) {
      const { originalEvent, processedItem, focusOnNext, selfCheck, allowHeaderFocus = true } = event2;
      if (ObjectUtils.isNotEmpty(this.focusedItem) && this.focusedItem.key !== processedItem.key) {
        this.focusedItem = processedItem;
        this.scrollInView();
      } else if (allowHeaderFocus) {
        this.$emit("header-focus", { originalEvent, focusOnNext, selfCheck });
      }
    },
    scrollInView() {
      const element = DomHandler.findSingle(this.$el, `li[id="${`${this.focusedItemId}`}"]`);
      if (element) {
        element.scrollIntoView && element.scrollIntoView({ block: "nearest", inline: "start" });
      }
    },
    autoUpdateActiveItemPath(expandedKeys) {
      this.activeItemPath = Object.entries(expandedKeys || {}).reduce((acc, [key, val]) => {
        if (val) {
          const processedItem = this.findProcessedItemByItemKey(key);
          processedItem && acc.push(processedItem);
        }
        return acc;
      }, []);
    },
    findProcessedItemByItemKey(key, processedItems, level = 0) {
      processedItems = processedItems || level === 0 && this.processedItems;
      if (!processedItems)
        return null;
      for (let i = 0; i < processedItems.length; i++) {
        const processedItem = processedItems[i];
        if (this.getItemProp(processedItem, "key") === key)
          return processedItem;
        const matchedItem = this.findProcessedItemByItemKey(key, processedItem.items, level + 1);
        if (matchedItem)
          return matchedItem;
      }
    },
    createProcessedItems(items, level = 0, parent = {}, parentKey = "") {
      const processedItems = [];
      items && items.forEach((item, index) => {
        const key = (parentKey !== "" ? parentKey + "_" : "") + index;
        const newItem = {
          item,
          index,
          level,
          key,
          parent,
          parentKey
        };
        newItem["items"] = this.createProcessedItems(item.items, level + 1, newItem, key);
        processedItems.push(newItem);
      });
      return processedItems;
    },
    flatItems(processedItems, processedFlattenItems = []) {
      processedItems && processedItems.forEach((processedItem) => {
        if (this.isVisibleItem(processedItem)) {
          processedFlattenItems.push(processedItem);
          this.flatItems(processedItem.items, processedFlattenItems);
        }
      });
      return processedFlattenItems;
    }
  },
  computed: {
    processedItems() {
      return this.createProcessedItems(this.items || []);
    },
    visibleItems() {
      return this.flatItems(this.processedItems);
    },
    focusedItemId() {
      return ObjectUtils.isNotEmpty(this.focusedItem) ? `${this.panelId}_${this.focusedItem.key}` : null;
    }
  },
  components: {
    PanelMenuSub: script$2$3
  }
};
function render$1$5(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_PanelMenuSub = resolveComponent("PanelMenuSub");
  return openBlock(), createBlock(_component_PanelMenuSub, {
    id: $props.panelId + "_list",
    class: "p-panelmenu-root-list",
    role: "tree",
    tabindex: -1,
    "aria-activedescendant": $data.focused ? $options.focusedItemId : void 0,
    panelId: $props.panelId,
    focusedItemId: $data.focused ? $options.focusedItemId : void 0,
    items: $options.processedItems,
    template: $props.template,
    activeItemPath: $data.activeItemPath,
    exact: $props.exact,
    onFocus: $options.onFocus,
    onBlur: $options.onBlur,
    onKeydown: $options.onKeyDown,
    onItemToggle: $options.onItemToggle
  }, null, 8, ["id", "aria-activedescendant", "panelId", "focusedItemId", "items", "template", "activeItemPath", "exact", "onFocus", "onBlur", "onKeydown", "onItemToggle"]);
}
script$1$5.render = render$1$5;
var script$j = {
  name: "PanelMenu",
  emits: ["update:expandedKeys", "panel-open", "panel-close"],
  props: {
    model: {
      type: Array,
      default: null
    },
    expandedKeys: {
      type: Object,
      default: null
    },
    exact: {
      type: Boolean,
      default: true
    },
    tabindex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      id: this.$attrs.id,
      activeItem: null
    };
  },
  watch: {
    "$attrs.id": function(newValue) {
      this.id = newValue || UniqueComponentId();
    }
  },
  mounted() {
    this.id = this.id || UniqueComponentId();
  },
  methods: {
    getItemProp(item, name) {
      return item ? ObjectUtils.getItemValue(item[name]) : void 0;
    },
    getItemLabel(item) {
      return this.getItemProp(item, "label");
    },
    isItemActive(item) {
      return this.expandedKeys ? this.expandedKeys[this.getItemProp(item, "key")] : ObjectUtils.equals(item, this.activeItem);
    },
    isItemVisible(item) {
      return this.getItemProp(item, "visible") !== false;
    },
    isItemDisabled(item) {
      return this.getItemProp(item, "disabled");
    },
    getPanelId(index) {
      return `${this.id}_${index}`;
    },
    getPanelKey(index) {
      return this.getPanelId(index);
    },
    getHeaderId(index) {
      return `${this.getPanelId(index)}_header`;
    },
    getContentId(index) {
      return `${this.getPanelId(index)}_content`;
    },
    onHeaderClick(event2, item) {
      if (this.isItemDisabled(item)) {
        event2.preventDefault();
        return;
      }
      if (item.command) {
        item.command({ originalEvent: event2, item });
      }
      this.changeActiveItem(event2, item);
      DomHandler.focus(event2.currentTarget);
    },
    onHeaderKeyDown(event2, item) {
      switch (event2.code) {
        case "ArrowDown":
          this.onHeaderArrowDownKey(event2);
          break;
        case "ArrowUp":
          this.onHeaderArrowUpKey(event2);
          break;
        case "Home":
          this.onHeaderHomeKey(event2);
          break;
        case "End":
          this.onHeaderEndKey(event2);
          break;
        case "Enter":
        case "Space":
          this.onHeaderEnterKey(event2, item);
          break;
      }
    },
    onHeaderArrowDownKey(event2) {
      const rootList = DomHandler.hasClass(event2.currentTarget, "p-highlight") ? DomHandler.findSingle(event2.currentTarget.nextElementSibling, ".p-panelmenu-root-list") : null;
      rootList ? DomHandler.focus(rootList) : this.updateFocusedHeader({ originalEvent: event2, focusOnNext: true });
      event2.preventDefault();
    },
    onHeaderArrowUpKey(event2) {
      const prevHeader = this.findPrevHeader(event2.currentTarget.parentElement) || this.findLastHeader();
      const rootList = DomHandler.hasClass(prevHeader, "p-highlight") ? DomHandler.findSingle(prevHeader.nextElementSibling, ".p-panelmenu-root-list") : null;
      rootList ? DomHandler.focus(rootList) : this.updateFocusedHeader({ originalEvent: event2, focusOnNext: false });
      event2.preventDefault();
    },
    onHeaderHomeKey(event2) {
      this.changeFocusedHeader(event2, this.findFirstHeader());
      event2.preventDefault();
    },
    onHeaderEndKey(event2) {
      this.changeFocusedHeader(event2, this.findLastHeader());
      event2.preventDefault();
    },
    onHeaderEnterKey(event2, item) {
      const headerAction = DomHandler.findSingle(event2.currentTarget, ".p-panelmenu-header-action");
      headerAction ? headerAction.click() : this.onHeaderClick(event2, item);
      event2.preventDefault();
    },
    onHeaderActionClick(event2, navigate) {
      navigate && navigate(event2);
    },
    findNextHeader(panelElement, selfCheck = false) {
      const nextPanelElement = selfCheck ? panelElement : panelElement.nextElementSibling;
      const headerElement = DomHandler.findSingle(nextPanelElement, ".p-panelmenu-header");
      return headerElement ? DomHandler.hasClass(headerElement, "p-disabled") ? this.findNextHeader(headerElement.parentElement) : headerElement : null;
    },
    findPrevHeader(panelElement, selfCheck = false) {
      const prevPanelElement = selfCheck ? panelElement : panelElement.previousElementSibling;
      const headerElement = DomHandler.findSingle(prevPanelElement, ".p-panelmenu-header");
      return headerElement ? DomHandler.hasClass(headerElement, "p-disabled") ? this.findPrevHeader(headerElement.parentElement) : headerElement : null;
    },
    findFirstHeader() {
      return this.findNextHeader(this.$el.firstElementChild, true);
    },
    findLastHeader() {
      return this.findPrevHeader(this.$el.lastElementChild, true);
    },
    updateFocusedHeader(event2) {
      const { originalEvent, focusOnNext, selfCheck } = event2;
      const panelElement = originalEvent.currentTarget.closest(".p-panelmenu-panel");
      const header = selfCheck ? DomHandler.findSingle(panelElement, ".p-panelmenu-header") : focusOnNext ? this.findNextHeader(panelElement) : this.findPrevHeader(panelElement);
      header ? this.changeFocusedHeader(originalEvent, header) : focusOnNext ? this.onHeaderHomeKey(originalEvent) : this.onHeaderEndKey(originalEvent);
    },
    changeActiveItem(event2, item, selfActive = false) {
      if (!this.isItemDisabled(item)) {
        const active = this.isItemActive(item);
        const eventName = !active ? "panel-open" : "panel-close";
        this.activeItem = selfActive ? item : this.activeItem && ObjectUtils.equals(item, this.activeItem) ? null : item;
        this.changeExpandedKeys({ item, expanded: !active });
        this.$emit(eventName, { originalEvent: event2, item });
      }
    },
    changeExpandedKeys({ item, expanded = false }) {
      if (this.expandedKeys) {
        let _keys = { ...this.expandedKeys };
        if (expanded)
          _keys[item.key] = true;
        else
          delete _keys[item.key];
        this.$emit("update:expandedKeys", _keys);
      }
    },
    changeFocusedHeader(event2, element) {
      element && DomHandler.focus(element);
    },
    getPanelClass(item) {
      return ["p-panelmenu-panel", this.getItemProp(item, "class")];
    },
    getHeaderClass(item) {
      return [
        "p-panelmenu-header",
        this.getItemProp(item, "headerClass"),
        {
          "p-highlight": this.isItemActive(item),
          "p-disabled": this.isItemDisabled(item)
        }
      ];
    },
    getHeaderActionClass(item, routerProps) {
      return [
        "p-panelmenu-header-action",
        {
          "router-link-active": routerProps && routerProps.isActive,
          "router-link-active-exact": this.exact && routerProps && routerProps.isExactActive
        }
      ];
    },
    getHeaderIconClass(item) {
      return ["p-menuitem-icon", this.getItemProp(item, "icon")];
    },
    getHeaderToggleIconClass(item) {
      return ["p-submenu-icon", this.isItemActive(item) ? "pi pi-chevron-down" : "pi pi-chevron-right"];
    }
  },
  components: {
    PanelMenuList: script$1$5
  }
};
const _hoisted_1$i = ["id"];
const _hoisted_2$f = ["id", "tabindex", "aria-label", "aria-expanded", "aria-controls", "aria-disabled", "onClick", "onKeydown"];
const _hoisted_3$a = { class: "p-panelmenu-header-content" };
const _hoisted_4$8 = ["href", "onClick"];
const _hoisted_5$6 = { class: "p-menuitem-text" };
const _hoisted_6$6 = ["href"];
const _hoisted_7$5 = { class: "p-menuitem-text" };
const _hoisted_8$5 = ["id", "aria-labelledby"];
const _hoisted_9$4 = {
  key: 0,
  class: "p-panelmenu-content"
};
function render$j(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");
  const _component_PanelMenuList = resolveComponent("PanelMenuList");
  return openBlock(), createElementBlock("div", {
    id: $data.id,
    class: "p-panelmenu p-component"
  }, [
    (openBlock(true), createElementBlock(Fragment$1, null, renderList($props.model, (item, index) => {
      return openBlock(), createElementBlock(Fragment$1, {
        key: $options.getPanelKey(index)
      }, [
        $options.isItemVisible(item) ? (openBlock(), createElementBlock("div", {
          key: 0,
          style: normalizeStyle($options.getItemProp(item, "style")),
          class: normalizeClass($options.getPanelClass(item))
        }, [
          createElementVNode("div", {
            id: $options.getHeaderId(index),
            class: normalizeClass($options.getHeaderClass(item)),
            tabindex: $options.isItemDisabled(item) ? -1 : $props.tabindex,
            role: "button",
            "aria-label": $options.getItemLabel(item),
            "aria-expanded": $options.isItemActive(item),
            "aria-controls": $options.getContentId(index),
            "aria-disabled": $options.isItemDisabled(item),
            onClick: ($event) => $options.onHeaderClick($event, item),
            onKeydown: ($event) => $options.onHeaderKeyDown($event, item)
          }, [
            createElementVNode("div", _hoisted_3$a, [
              !_ctx.$slots.item ? (openBlock(), createElementBlock(Fragment$1, { key: 0 }, [
                $options.getItemProp(item, "to") && !$options.isItemDisabled(item) ? (openBlock(), createBlock(_component_router_link, {
                  key: 0,
                  to: $options.getItemProp(item, "to"),
                  custom: ""
                }, {
                  default: withCtx(({ navigate, href, isActive, isExactActive }) => [
                    createElementVNode("a", {
                      href,
                      class: normalizeClass($options.getHeaderActionClass(item, { isActive, isExactActive })),
                      tabindex: -1,
                      onClick: ($event) => $options.onHeaderActionClick($event, navigate)
                    }, [
                      $options.getItemProp(item, "icon") ? (openBlock(), createElementBlock("span", {
                        key: 0,
                        class: normalizeClass($options.getHeaderIconClass(item))
                      }, null, 2)) : createCommentVNode("", true),
                      createElementVNode("span", _hoisted_5$6, toDisplayString($options.getItemLabel(item)), 1)
                    ], 10, _hoisted_4$8)
                  ]),
                  _: 2
                }, 1032, ["to"])) : (openBlock(), createElementBlock("a", {
                  key: 1,
                  href: $options.getItemProp(item, "url"),
                  class: normalizeClass($options.getHeaderActionClass(item)),
                  tabindex: -1
                }, [
                  $options.getItemProp(item, "items") ? (openBlock(), createElementBlock("span", {
                    key: 0,
                    class: normalizeClass($options.getHeaderToggleIconClass(item))
                  }, null, 2)) : createCommentVNode("", true),
                  $options.getItemProp(item, "icon") ? (openBlock(), createElementBlock("span", {
                    key: 1,
                    class: normalizeClass($options.getHeaderIconClass(item))
                  }, null, 2)) : createCommentVNode("", true),
                  createElementVNode("span", _hoisted_7$5, toDisplayString($options.getItemLabel(item)), 1)
                ], 10, _hoisted_6$6))
              ], 64)) : (openBlock(), createBlock(resolveDynamicComponent(_ctx.$slots.item), {
                key: 1,
                item
              }, null, 8, ["item"]))
            ])
          ], 42, _hoisted_2$f),
          createVNode(Transition, { name: "p-toggleable-content" }, {
            default: withCtx(() => [
              withDirectives(createElementVNode("div", {
                id: $options.getContentId(index),
                class: "p-toggleable-content",
                role: "region",
                "aria-labelledby": $options.getHeaderId(index)
              }, [
                $options.getItemProp(item, "items") ? (openBlock(), createElementBlock("div", _hoisted_9$4, [
                  createVNode(_component_PanelMenuList, {
                    panelId: $options.getPanelId(index),
                    items: $options.getItemProp(item, "items"),
                    template: _ctx.$slots.item,
                    expandedKeys: $props.expandedKeys,
                    onItemToggle: $options.changeExpandedKeys,
                    onHeaderFocus: $options.updateFocusedHeader,
                    exact: $props.exact
                  }, null, 8, ["panelId", "items", "template", "expandedKeys", "onItemToggle", "onHeaderFocus", "exact"])
                ])) : createCommentVNode("", true)
              ], 8, _hoisted_8$5), [
                [vShow, $options.isItemActive(item)]
              ])
            ]),
            _: 2
          }, 1024)
        ], 6)) : createCommentVNode("", true)
      ], 64);
    }), 128))
  ], 8, _hoisted_1$i);
}
function styleInject$9(css, ref2) {
  if (ref2 === void 0)
    ref2 = {};
  var insertAt = ref2.insertAt;
  if (!css || true) {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
var css_248z$9 = "\n.p-panelmenu .p-panelmenu-header-action {\n    display: flex;\n    align-items: center;\n    user-select: none;\n    cursor: pointer;\n    position: relative;\n    text-decoration: none;\n}\n.p-panelmenu .p-panelmenu-header-action:focus {\n    z-index: 1;\n}\n.p-panelmenu .p-submenu-list {\n    margin: 0;\n    padding: 0;\n    list-style: none;\n}\n.p-panelmenu .p-menuitem-link {\n    display: flex;\n    align-items: center;\n    user-select: none;\n    cursor: pointer;\n    text-decoration: none;\n    position: relative;\n    overflow: hidden;\n}\n.p-panelmenu .p-menuitem-text {\n    line-height: 1;\n}\n";
styleInject$9(css_248z$9);
script$j.render = render$j;
var script$i = {
  name: "Button",
  props: {
    label: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    iconPos: {
      type: String,
      default: "left"
    },
    iconClass: {
      type: String,
      default: null
    },
    badge: {
      type: String,
      default: null
    },
    badgeClass: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingIcon: {
      type: String,
      default: "pi pi-spinner pi-spin"
    },
    link: {
      type: Boolean,
      default: false
    },
    severity: {
      type: String,
      default: null
    },
    raised: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    },
    text: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: null
    },
    plain: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    buttonClass() {
      return [
        "p-button p-component",
        {
          "p-button-icon-only": this.icon && !this.label,
          "p-button-vertical": (this.iconPos === "top" || this.iconPos === "bottom") && this.label,
          "p-disabled": this.$attrs.disabled || this.loading,
          "p-button-loading": this.loading,
          "p-button-loading-label-only": this.loading && !this.icon && this.label,
          "p-button-link": this.link,
          [`p-button-${this.severity}`]: this.severity,
          "p-button-raised": this.raised,
          "p-button-rounded": this.rounded,
          "p-button-text": this.text,
          "p-button-outlined": this.outlined,
          "p-button-sm": this.size === "small",
          "p-button-lg": this.size === "large",
          "p-button-plain": this.plain
        }
      ];
    },
    iconStyleClass() {
      return [
        this.loading ? "p-button-loading-icon " + this.loadingIcon : this.icon,
        "p-button-icon",
        this.iconClass,
        {
          "p-button-icon-left": this.iconPos === "left" && this.label,
          "p-button-icon-right": this.iconPos === "right" && this.label,
          "p-button-icon-top": this.iconPos === "top" && this.label,
          "p-button-icon-bottom": this.iconPos === "bottom" && this.label
        }
      ];
    },
    badgeStyleClass() {
      return [
        "p-badge p-component",
        this.badgeClass,
        {
          "p-badge-no-gutter": this.badge && String(this.badge).length === 1
        }
      ];
    },
    disabled() {
      return this.$attrs.disabled || this.loading;
    },
    defaultAriaLabel() {
      return this.label ? this.label + (this.badge ? " " + this.badge : "") : this.$attrs["aria-label"];
    }
  },
  directives: {
    ripple: Ripple
  }
};
const _hoisted_1$h = ["aria-label", "disabled"];
const _hoisted_2$e = { class: "p-button-label" };
function render$i(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_ripple = resolveDirective("ripple");
  return withDirectives((openBlock(), createElementBlock("button", {
    class: normalizeClass($options.buttonClass),
    type: "button",
    "aria-label": $options.defaultAriaLabel,
    disabled: $options.disabled
  }, [
    renderSlot(_ctx.$slots, "default", {}, () => [
      $props.loading && !$props.icon ? (openBlock(), createElementBlock("span", {
        key: 0,
        class: normalizeClass($options.iconStyleClass)
      }, null, 2)) : createCommentVNode("", true),
      $props.icon ? (openBlock(), createElementBlock("span", {
        key: 1,
        class: normalizeClass($options.iconStyleClass)
      }, null, 2)) : createCommentVNode("", true),
      createElementVNode("span", _hoisted_2$e, toDisplayString($props.label || " "), 1),
      $props.badge ? (openBlock(), createElementBlock("span", {
        key: 2,
        class: normalizeClass($options.badgeStyleClass)
      }, toDisplayString($props.badge), 3)) : createCommentVNode("", true)
    ])
  ], 10, _hoisted_1$h)), [
    [_directive_ripple]
  ]);
}
script$i.render = render$i;
var OverlayEventBus = primebus();
var script$h = {
  name: "Portal",
  props: {
    appendTo: {
      type: String,
      default: "body"
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mounted: false
    };
  },
  mounted() {
    this.mounted = DomHandler.isClient();
  },
  computed: {
    inline() {
      return this.disabled || this.appendTo === "self";
    }
  }
};
function render$h(_ctx, _cache, $props, $setup, $data, $options) {
  return $options.inline ? renderSlot(_ctx.$slots, "default", { key: 0 }) : $data.mounted ? (openBlock(), createBlock(Teleport, {
    key: 1,
    to: $props.appendTo
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 8, ["to"])) : createCommentVNode("", true);
}
script$h.render = render$h;
var script$g = {
  name: "VirtualScroller",
  emits: ["update:numToleratedItems", "scroll", "scroll-index-change", "lazy-load"],
  props: {
    id: {
      type: String,
      default: null
    },
    style: null,
    class: null,
    items: {
      type: Array,
      default: null
    },
    itemSize: {
      type: [Number, Array],
      default: 0
    },
    scrollHeight: null,
    scrollWidth: null,
    orientation: {
      type: String,
      default: "vertical"
    },
    numToleratedItems: {
      type: Number,
      default: null
    },
    delay: {
      type: Number,
      default: 0
    },
    resizeDelay: {
      type: Number,
      default: 10
    },
    lazy: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loaderDisabled: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    showSpacer: {
      type: Boolean,
      default: true
    },
    showLoader: {
      type: Boolean,
      default: false
    },
    tabindex: {
      type: Number,
      default: 0
    },
    inline: {
      type: Boolean,
      default: false
    },
    step: {
      type: Number,
      default: 0
    },
    appendOnly: {
      type: Boolean,
      default: false
    },
    autoSize: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      first: this.isBoth() ? { rows: 0, cols: 0 } : 0,
      last: this.isBoth() ? { rows: 0, cols: 0 } : 0,
      page: this.isBoth() ? { rows: 0, cols: 0 } : 0,
      numItemsInViewport: this.isBoth() ? { rows: 0, cols: 0 } : 0,
      lastScrollPos: this.isBoth() ? { top: 0, left: 0 } : 0,
      d_numToleratedItems: this.numToleratedItems,
      d_loading: this.loading,
      loaderArr: [],
      spacerStyle: {},
      contentStyle: {}
    };
  },
  element: null,
  content: null,
  lastScrollPos: null,
  scrollTimeout: null,
  resizeTimeout: null,
  defaultWidth: 0,
  defaultHeight: 0,
  defaultContentWidth: 0,
  defaultContentHeight: 0,
  isRangeChanged: false,
  lazyLoadState: {},
  resizeListener: null,
  initialized: false,
  watch: {
    numToleratedItems(newValue) {
      this.d_numToleratedItems = newValue;
    },
    loading(newValue) {
      this.d_loading = newValue;
    },
    items(newValue, oldValue) {
      if (!oldValue || oldValue.length !== (newValue || []).length) {
        this.init();
        this.calculateAutoSize();
      }
    },
    itemSize() {
      this.init();
      this.calculateAutoSize();
    },
    orientation() {
      this.lastScrollPos = this.isBoth() ? { top: 0, left: 0 } : 0;
    },
    scrollHeight() {
      this.init();
      this.calculateAutoSize();
    },
    scrollWidth() {
      this.init();
      this.calculateAutoSize();
    }
  },
  mounted() {
    this.viewInit();
    this.lastScrollPos = this.isBoth() ? { top: 0, left: 0 } : 0;
    this.lazyLoadState = this.lazyLoadState || {};
  },
  updated() {
    !this.initialized && this.viewInit();
  },
  unmounted() {
    this.unbindResizeListener();
    this.initialized = false;
  },
  methods: {
    viewInit() {
      if (DomHandler.isVisible(this.element)) {
        this.setContentEl(this.content);
        this.init();
        this.bindResizeListener();
        this.defaultWidth = DomHandler.getWidth(this.element);
        this.defaultHeight = DomHandler.getHeight(this.element);
        this.defaultContentWidth = DomHandler.getWidth(this.content);
        this.defaultContentHeight = DomHandler.getHeight(this.content);
        this.initialized = true;
      }
    },
    init() {
      if (!this.disabled) {
        this.setSize();
        this.calculateOptions();
        this.setSpacerSize();
      }
    },
    isVertical() {
      return this.orientation === "vertical";
    },
    isHorizontal() {
      return this.orientation === "horizontal";
    },
    isBoth() {
      return this.orientation === "both";
    },
    scrollTo(options) {
      this.lastScrollPos = this.both ? { top: 0, left: 0 } : 0;
      this.element && this.element.scrollTo(options);
    },
    scrollToIndex(index, behavior = "auto") {
      const both = this.isBoth();
      const horizontal = this.isHorizontal();
      const first = this.first;
      const { numToleratedItems } = this.calculateNumItems();
      const contentPos = this.getContentPosition();
      const itemSize = this.itemSize;
      const calculateFirst = (_index = 0, _numT) => _index <= _numT ? 0 : _index;
      const calculateCoord = (_first, _size, _cpos) => _first * _size + _cpos;
      const scrollTo = (left = 0, top = 0) => this.scrollTo({ left, top, behavior });
      let newFirst = both ? { rows: 0, cols: 0 } : 0;
      let isRangeChanged = false;
      if (both) {
        newFirst = { rows: calculateFirst(index[0], numToleratedItems[0]), cols: calculateFirst(index[1], numToleratedItems[1]) };
        scrollTo(calculateCoord(newFirst.cols, itemSize[1], contentPos.left), calculateCoord(newFirst.rows, itemSize[0], contentPos.top));
        isRangeChanged = newFirst.rows !== first.rows || newFirst.cols !== first.cols;
      } else {
        newFirst = calculateFirst(index, numToleratedItems);
        horizontal ? scrollTo(calculateCoord(newFirst, itemSize, contentPos.left), 0) : scrollTo(0, calculateCoord(newFirst, itemSize, contentPos.top));
        isRangeChanged = newFirst !== first;
      }
      this.isRangeChanged = isRangeChanged;
      this.first = newFirst;
    },
    scrollInView(index, to, behavior = "auto") {
      if (to) {
        const both = this.isBoth();
        const horizontal = this.isHorizontal();
        const { first, viewport } = this.getRenderedRange();
        const scrollTo = (left = 0, top = 0) => this.scrollTo({ left, top, behavior });
        const isToStart = to === "to-start";
        const isToEnd = to === "to-end";
        if (isToStart) {
          if (both) {
            if (viewport.first.rows - first.rows > index[0]) {
              scrollTo(viewport.first.cols * this.itemSize[1], (viewport.first.rows - 1) * this.itemSize[0]);
            } else if (viewport.first.cols - first.cols > index[1]) {
              scrollTo((viewport.first.cols - 1) * this.itemSize[1], viewport.first.rows * this.itemSize[0]);
            }
          } else {
            if (viewport.first - first > index) {
              const pos = (viewport.first - 1) * this.itemSize;
              horizontal ? scrollTo(pos, 0) : scrollTo(0, pos);
            }
          }
        } else if (isToEnd) {
          if (both) {
            if (viewport.last.rows - first.rows <= index[0] + 1) {
              scrollTo(viewport.first.cols * this.itemSize[1], (viewport.first.rows + 1) * this.itemSize[0]);
            } else if (viewport.last.cols - first.cols <= index[1] + 1) {
              scrollTo((viewport.first.cols + 1) * this.itemSize[1], viewport.first.rows * this.itemSize[0]);
            }
          } else {
            if (viewport.last - first <= index + 1) {
              const pos = (viewport.first + 1) * this.itemSize;
              horizontal ? scrollTo(pos, 0) : scrollTo(0, pos);
            }
          }
        }
      } else {
        this.scrollToIndex(index, behavior);
      }
    },
    getRenderedRange() {
      const calculateFirstInViewport = (_pos, _size) => Math.floor(_pos / (_size || _pos));
      let firstInViewport = this.first;
      let lastInViewport = 0;
      if (this.element) {
        const both = this.isBoth();
        const horizontal = this.isHorizontal();
        const { scrollTop, scrollLeft } = this.element.scrollTop;
        if (both) {
          firstInViewport = { rows: calculateFirstInViewport(scrollTop, this.itemSize[0]), cols: calculateFirstInViewport(scrollLeft, this.itemSize[1]) };
          lastInViewport = { rows: firstInViewport.rows + this.numItemsInViewport.rows, cols: firstInViewport.cols + this.numItemsInViewport.cols };
        } else {
          const scrollPos = horizontal ? scrollLeft : scrollTop;
          firstInViewport = calculateFirstInViewport(scrollPos, this.itemSize);
          lastInViewport = firstInViewport + this.numItemsInViewport;
        }
      }
      return {
        first: this.first,
        last: this.last,
        viewport: {
          first: firstInViewport,
          last: lastInViewport
        }
      };
    },
    calculateNumItems() {
      const both = this.isBoth();
      const horizontal = this.isHorizontal();
      const itemSize = this.itemSize;
      const contentPos = this.getContentPosition();
      const contentWidth = this.element ? this.element.offsetWidth - contentPos.left : 0;
      const contentHeight = this.element ? this.element.offsetHeight - contentPos.top : 0;
      const calculateNumItemsInViewport = (_contentSize, _itemSize) => Math.ceil(_contentSize / (_itemSize || _contentSize));
      const calculateNumToleratedItems = (_numItems) => Math.ceil(_numItems / 2);
      const numItemsInViewport = both ? { rows: calculateNumItemsInViewport(contentHeight, itemSize[0]), cols: calculateNumItemsInViewport(contentWidth, itemSize[1]) } : calculateNumItemsInViewport(horizontal ? contentWidth : contentHeight, itemSize);
      const numToleratedItems = this.d_numToleratedItems || (both ? [calculateNumToleratedItems(numItemsInViewport.rows), calculateNumToleratedItems(numItemsInViewport.cols)] : calculateNumToleratedItems(numItemsInViewport));
      return { numItemsInViewport, numToleratedItems };
    },
    calculateOptions() {
      const both = this.isBoth();
      const first = this.first;
      const { numItemsInViewport, numToleratedItems } = this.calculateNumItems();
      const calculateLast = (_first, _num, _numT, _isCols = false) => this.getLast(_first + _num + (_first < _numT ? 2 : 3) * _numT, _isCols);
      const last = both ? { rows: calculateLast(first.rows, numItemsInViewport.rows, numToleratedItems[0]), cols: calculateLast(first.cols, numItemsInViewport.cols, numToleratedItems[1], true) } : calculateLast(first, numItemsInViewport, numToleratedItems);
      this.last = last;
      this.numItemsInViewport = numItemsInViewport;
      this.d_numToleratedItems = numToleratedItems;
      this.$emit("update:numToleratedItems", this.d_numToleratedItems);
      if (this.showLoader) {
        this.loaderArr = both ? Array.from({ length: numItemsInViewport.rows }).map(() => Array.from({ length: numItemsInViewport.cols })) : Array.from({ length: numItemsInViewport });
      }
      if (this.lazy) {
        Promise.resolve().then(() => {
          this.lazyLoadState = {
            first: this.step ? both ? { rows: 0, cols: first.cols } : 0 : first,
            last: Math.min(this.step ? this.step : last, this.items.length)
          };
          this.$emit("lazy-load", this.lazyLoadState);
        });
      }
    },
    calculateAutoSize() {
      if (this.autoSize && !this.d_loading) {
        Promise.resolve().then(() => {
          if (this.content) {
            const both = this.isBoth();
            const horizontal = this.isHorizontal();
            const vertical = this.isVertical();
            this.content.style.minHeight = this.content.style.minWidth = "auto";
            this.content.style.position = "relative";
            this.element.style.contain = "none";
            const [contentWidth, contentHeight] = [DomHandler.getWidth(this.content), DomHandler.getHeight(this.content)];
            contentWidth !== this.defaultContentWidth && (this.element.style.width = "");
            contentHeight !== this.defaultContentHeight && (this.element.style.height = "");
            const [width, height] = [DomHandler.getWidth(this.element), DomHandler.getHeight(this.element)];
            (both || horizontal) && (this.element.style.width = width < this.defaultWidth ? width + "px" : this.scrollWidth || this.defaultWidth + "px");
            (both || vertical) && (this.element.style.height = height < this.defaultHeight ? height + "px" : this.scrollHeight || this.defaultHeight + "px");
            this.content.style.minHeight = this.content.style.minWidth = "";
            this.content.style.position = "";
            this.element.style.contain = "";
          }
        });
      }
    },
    getLast(last = 0, isCols) {
      return this.items ? Math.min(isCols ? (this.columns || this.items[0]).length : this.items.length, last) : 0;
    },
    getContentPosition() {
      if (this.content) {
        const style = getComputedStyle(this.content);
        const left = parseFloat(style.paddingLeft) + Math.max(parseFloat(style.left) || 0, 0);
        const right = parseFloat(style.paddingRight) + Math.max(parseFloat(style.right) || 0, 0);
        const top = parseFloat(style.paddingTop) + Math.max(parseFloat(style.top) || 0, 0);
        const bottom = parseFloat(style.paddingBottom) + Math.max(parseFloat(style.bottom) || 0, 0);
        return { left, right, top, bottom, x: left + right, y: top + bottom };
      }
      return { left: 0, right: 0, top: 0, bottom: 0, x: 0, y: 0 };
    },
    setSize() {
      if (this.element) {
        const both = this.isBoth();
        const horizontal = this.isHorizontal();
        const parentElement = this.element.parentElement;
        const width = this.scrollWidth || `${this.element.offsetWidth || parentElement.offsetWidth}px`;
        const height = this.scrollHeight || `${this.element.offsetHeight || parentElement.offsetHeight}px`;
        const setProp = (_name, _value) => this.element.style[_name] = _value;
        if (both || horizontal) {
          setProp("height", height);
          setProp("width", width);
        } else {
          setProp("height", height);
        }
      }
    },
    setSpacerSize() {
      const items = this.items;
      if (items) {
        const both = this.isBoth();
        const horizontal = this.isHorizontal();
        const contentPos = this.getContentPosition();
        const setProp = (_name, _value, _size, _cpos = 0) => this.spacerStyle = { ...this.spacerStyle, ...{ [`${_name}`]: (_value || []).length * _size + _cpos + "px" } };
        if (both) {
          setProp("height", items, this.itemSize[0], contentPos.y);
          setProp("width", this.columns || items[1], this.itemSize[1], contentPos.x);
        } else {
          horizontal ? setProp("width", this.columns || items, this.itemSize, contentPos.x) : setProp("height", items, this.itemSize, contentPos.y);
        }
      }
    },
    setContentPosition(pos) {
      if (this.content && !this.appendOnly) {
        const both = this.isBoth();
        const horizontal = this.isHorizontal();
        const first = pos ? pos.first : this.first;
        const calculateTranslateVal = (_first, _size) => _first * _size;
        const setTransform = (_x = 0, _y = 0) => this.contentStyle = { ...this.contentStyle, ...{ transform: `translate3d(${_x}px, ${_y}px, 0)` } };
        if (both) {
          setTransform(calculateTranslateVal(first.cols, this.itemSize[1]), calculateTranslateVal(first.rows, this.itemSize[0]));
        } else {
          const translateVal = calculateTranslateVal(first, this.itemSize);
          horizontal ? setTransform(translateVal, 0) : setTransform(0, translateVal);
        }
      }
    },
    onScrollPositionChange(event2) {
      const target = event2.target;
      const both = this.isBoth();
      const horizontal = this.isHorizontal();
      const contentPos = this.getContentPosition();
      const calculateScrollPos = (_pos, _cpos) => _pos ? _pos > _cpos ? _pos - _cpos : _pos : 0;
      const calculateCurrentIndex = (_pos, _size) => Math.floor(_pos / (_size || _pos));
      const calculateTriggerIndex = (_currentIndex, _first, _last, _num, _numT, _isScrollDownOrRight) => {
        return _currentIndex <= _numT ? _numT : _isScrollDownOrRight ? _last - _num - _numT : _first + _numT - 1;
      };
      const calculateFirst = (_currentIndex, _triggerIndex, _first, _last, _num, _numT, _isScrollDownOrRight) => {
        if (_currentIndex <= _numT)
          return 0;
        else
          return Math.max(0, _isScrollDownOrRight ? _currentIndex < _triggerIndex ? _first : _currentIndex - _numT : _currentIndex > _triggerIndex ? _first : _currentIndex - 2 * _numT);
      };
      const calculateLast = (_currentIndex, _first, _last, _num, _numT, _isCols) => {
        let lastValue = _first + _num + 2 * _numT;
        if (_currentIndex >= _numT) {
          lastValue += _numT + 1;
        }
        return this.getLast(lastValue, _isCols);
      };
      const scrollTop = calculateScrollPos(target.scrollTop, contentPos.top);
      const scrollLeft = calculateScrollPos(target.scrollLeft, contentPos.left);
      let newFirst = both ? { rows: 0, cols: 0 } : 0;
      let newLast = this.last;
      let isRangeChanged = false;
      let newScrollPos = this.lastScrollPos;
      if (both) {
        const isScrollDown = this.lastScrollPos.top <= scrollTop;
        const isScrollRight = this.lastScrollPos.left <= scrollLeft;
        if (!this.appendOnly || this.appendOnly && (isScrollDown || isScrollRight)) {
          const currentIndex = { rows: calculateCurrentIndex(scrollTop, this.itemSize[0]), cols: calculateCurrentIndex(scrollLeft, this.itemSize[1]) };
          const triggerIndex = {
            rows: calculateTriggerIndex(currentIndex.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], isScrollDown),
            cols: calculateTriggerIndex(currentIndex.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], isScrollRight)
          };
          newFirst = {
            rows: calculateFirst(currentIndex.rows, triggerIndex.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], isScrollDown),
            cols: calculateFirst(currentIndex.cols, triggerIndex.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], isScrollRight)
          };
          newLast = {
            rows: calculateLast(currentIndex.rows, newFirst.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0]),
            cols: calculateLast(currentIndex.cols, newFirst.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], true)
          };
          isRangeChanged = newFirst.rows !== this.first.rows || newLast.rows !== this.last.rows || newFirst.cols !== this.first.cols || newLast.cols !== this.last.cols || this.isRangeChanged;
          newScrollPos = { top: scrollTop, left: scrollLeft };
        }
      } else {
        const scrollPos = horizontal ? scrollLeft : scrollTop;
        const isScrollDownOrRight = this.lastScrollPos <= scrollPos;
        if (!this.appendOnly || this.appendOnly && isScrollDownOrRight) {
          const currentIndex = calculateCurrentIndex(scrollPos, this.itemSize);
          const triggerIndex = calculateTriggerIndex(currentIndex, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, isScrollDownOrRight);
          newFirst = calculateFirst(currentIndex, triggerIndex, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, isScrollDownOrRight);
          newLast = calculateLast(currentIndex, newFirst, this.last, this.numItemsInViewport, this.d_numToleratedItems);
          isRangeChanged = newFirst !== this.first || newLast !== this.last || this.isRangeChanged;
          newScrollPos = scrollPos;
        }
      }
      return {
        first: newFirst,
        last: newLast,
        isRangeChanged,
        scrollPos: newScrollPos
      };
    },
    onScrollChange(event2) {
      const { first, last, isRangeChanged, scrollPos } = this.onScrollPositionChange(event2);
      if (isRangeChanged) {
        const newState = { first, last };
        this.setContentPosition(newState);
        this.first = first;
        this.last = last;
        this.lastScrollPos = scrollPos;
        this.$emit("scroll-index-change", newState);
        if (this.lazy && this.isPageChanged(first)) {
          const lazyLoadState = {
            first: this.step ? Math.min(this.getPageByFirst(first) * this.step, this.items.length - this.step) : first,
            last: Math.min(this.step ? (this.getPageByFirst(first) + 1) * this.step : last, this.items.length)
          };
          const isLazyStateChanged = this.lazyLoadState.first !== lazyLoadState.first || this.lazyLoadState.last !== lazyLoadState.last;
          isLazyStateChanged && this.$emit("lazy-load", lazyLoadState);
          this.lazyLoadState = lazyLoadState;
        }
      }
    },
    onScroll(event2) {
      this.$emit("scroll", event2);
      if (this.delay && this.isPageChanged()) {
        if (this.scrollTimeout) {
          clearTimeout(this.scrollTimeout);
        }
        if (!this.d_loading && this.showLoader) {
          const { isRangeChanged } = this.onScrollPositionChange(event2);
          const changed = isRangeChanged || (this.step ? this.isPageChanged() : false);
          changed && (this.d_loading = true);
        }
        this.scrollTimeout = setTimeout(() => {
          this.onScrollChange(event2);
          if (this.d_loading && this.showLoader && (!this.lazy || this.loading === void 0)) {
            this.d_loading = false;
            this.page = this.getPageByFirst();
          }
        }, this.delay);
      } else {
        this.onScrollChange(event2);
      }
    },
    onResize() {
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
      this.resizeTimeout = setTimeout(() => {
        if (DomHandler.isVisible(this.element)) {
          const both = this.isBoth();
          const vertical = this.isVertical();
          const horizontal = this.isHorizontal();
          const [width, height] = [DomHandler.getWidth(this.element), DomHandler.getHeight(this.element)];
          const [isDiffWidth, isDiffHeight] = [width !== this.defaultWidth, height !== this.defaultHeight];
          const reinit = both ? isDiffWidth || isDiffHeight : horizontal ? isDiffWidth : vertical ? isDiffHeight : false;
          if (reinit) {
            this.d_numToleratedItems = this.numToleratedItems;
            this.defaultWidth = width;
            this.defaultHeight = height;
            this.defaultContentWidth = DomHandler.getWidth(this.content);
            this.defaultContentHeight = DomHandler.getHeight(this.content);
            this.init();
          }
        }
      }, this.resizeDelay);
    },
    bindResizeListener() {
      if (!this.resizeListener) {
        this.resizeListener = this.onResize.bind(this);
        window.addEventListener("resize", this.resizeListener);
        window.addEventListener("orientationchange", this.resizeListener);
      }
    },
    unbindResizeListener() {
      if (this.resizeListener) {
        window.removeEventListener("resize", this.resizeListener);
        window.removeEventListener("orientationchange", this.resizeListener);
        this.resizeListener = null;
      }
    },
    getOptions(renderedIndex) {
      const count = (this.items || []).length;
      const index = this.isBoth() ? this.first.rows + renderedIndex : this.first + renderedIndex;
      return {
        index,
        count,
        first: index === 0,
        last: index === count - 1,
        even: index % 2 === 0,
        odd: index % 2 !== 0
      };
    },
    getLoaderOptions(index, extOptions) {
      let count = this.loaderArr.length;
      return {
        index,
        count,
        first: index === 0,
        last: index === count - 1,
        even: index % 2 === 0,
        odd: index % 2 !== 0,
        ...extOptions
      };
    },
    getPageByFirst(first) {
      return Math.floor(((first ?? this.first) + this.d_numToleratedItems * 4) / (this.step || 1));
    },
    isPageChanged(first) {
      return this.step ? this.page !== this.getPageByFirst(first ?? this.first) : true;
    },
    setContentEl(el) {
      this.content = el || this.content || DomHandler.findSingle(this.element, ".p-virtualscroller-content");
    },
    elementRef(el) {
      this.element = el;
    },
    contentRef(el) {
      this.content = el;
    }
  },
  computed: {
    containerClass() {
      return [
        "p-virtualscroller",
        {
          "p-virtualscroller-inline": this.inline,
          "p-virtualscroller-both p-both-scroll": this.isBoth(),
          "p-virtualscroller-horizontal p-horizontal-scroll": this.isHorizontal()
        },
        this.class
      ];
    },
    contentClass() {
      return [
        "p-virtualscroller-content",
        {
          "p-virtualscroller-loading": this.d_loading
        }
      ];
    },
    loaderClass() {
      return [
        "p-virtualscroller-loader",
        {
          "p-component-overlay": !this.$slots.loader
        }
      ];
    },
    loadedItems() {
      if (this.items && !this.d_loading) {
        if (this.isBoth())
          return this.items.slice(this.appendOnly ? 0 : this.first.rows, this.last.rows).map((item) => this.columns ? item : item.slice(this.appendOnly ? 0 : this.first.cols, this.last.cols));
        else if (this.isHorizontal() && this.columns)
          return this.items;
        else
          return this.items.slice(this.appendOnly ? 0 : this.first, this.last);
      }
      return [];
    },
    loadedRows() {
      return this.d_loading ? this.loaderDisabled ? this.loaderArr : [] : this.loadedItems;
    },
    loadedColumns() {
      if (this.columns) {
        const both = this.isBoth();
        const horizontal = this.isHorizontal();
        if (both || horizontal) {
          return this.d_loading && this.loaderDisabled ? both ? this.loaderArr[0] : this.loaderArr : this.columns.slice(both ? this.first.cols : this.first, both ? this.last.cols : this.last);
        }
      }
      return this.columns;
    }
  }
};
const _hoisted_1$g = ["tabindex"];
const _hoisted_2$d = {
  key: 1,
  class: "p-virtualscroller-loading-icon pi pi-spinner pi-spin"
};
function render$g(_ctx, _cache, $props, $setup, $data, $options) {
  return !$props.disabled ? (openBlock(), createElementBlock("div", {
    key: 0,
    ref: $options.elementRef,
    class: normalizeClass($options.containerClass),
    tabindex: $props.tabindex,
    style: normalizeStyle($props.style),
    onScroll: _cache[0] || (_cache[0] = (...args) => $options.onScroll && $options.onScroll(...args))
  }, [
    renderSlot(_ctx.$slots, "content", {
      styleClass: $options.contentClass,
      items: $options.loadedItems,
      getItemOptions: $options.getOptions,
      loading: $data.d_loading,
      getLoaderOptions: $options.getLoaderOptions,
      itemSize: $props.itemSize,
      rows: $options.loadedRows,
      columns: $options.loadedColumns,
      contentRef: $options.contentRef,
      spacerStyle: $data.spacerStyle,
      contentStyle: $data.contentStyle,
      vertical: $options.isVertical(),
      horizontal: $options.isHorizontal(),
      both: $options.isBoth()
    }, () => [
      createElementVNode("div", {
        ref: $options.contentRef,
        class: normalizeClass($options.contentClass),
        style: normalizeStyle($data.contentStyle)
      }, [
        (openBlock(true), createElementBlock(Fragment$1, null, renderList($options.loadedItems, (item, index) => {
          return renderSlot(_ctx.$slots, "item", {
            key: index,
            item,
            options: $options.getOptions(index)
          });
        }), 128))
      ], 6)
    ]),
    $props.showSpacer ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: "p-virtualscroller-spacer",
      style: normalizeStyle($data.spacerStyle)
    }, null, 4)) : createCommentVNode("", true),
    !$props.loaderDisabled && $props.showLoader && $data.d_loading ? (openBlock(), createElementBlock("div", {
      key: 1,
      class: normalizeClass($options.loaderClass)
    }, [
      _ctx.$slots && _ctx.$slots.loader ? (openBlock(true), createElementBlock(Fragment$1, { key: 0 }, renderList($data.loaderArr, (_, index) => {
        return renderSlot(_ctx.$slots, "loader", {
          key: index,
          options: $options.getLoaderOptions(index, $options.isBoth() && { numCols: _ctx.d_numItemsInViewport.cols })
        });
      }), 128)) : (openBlock(), createElementBlock("i", _hoisted_2$d))
    ], 2)) : createCommentVNode("", true)
  ], 46, _hoisted_1$g)) : (openBlock(), createElementBlock(Fragment$1, { key: 1 }, [
    renderSlot(_ctx.$slots, "default"),
    renderSlot(_ctx.$slots, "content", {
      items: $props.items,
      rows: $props.items,
      columns: $options.loadedColumns
    })
  ], 64));
}
function styleInject$8(css, ref2) {
  if (ref2 === void 0)
    ref2 = {};
  var insertAt = ref2.insertAt;
  if (!css || true) {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
var css_248z$8 = "\n.p-virtualscroller {\n    position: relative;\n    overflow: auto;\n    contain: strict;\n    transform: translateZ(0);\n    will-change: scroll-position;\n    outline: 0 none;\n}\n.p-virtualscroller-content {\n    position: absolute;\n    top: 0;\n    left: 0;\n    /* contain: content; */\n    min-height: 100%;\n    min-width: 100%;\n    will-change: transform;\n}\n.p-virtualscroller-spacer {\n    position: absolute;\n    top: 0;\n    left: 0;\n    height: 1px;\n    width: 1px;\n    transform-origin: 0 0;\n    pointer-events: none;\n}\n.p-virtualscroller .p-virtualscroller-loader {\n    position: sticky;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n}\n.p-virtualscroller-loader.p-component-overlay {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n.p-virtualscroller-loading-icon {\n    font-size: 2rem;\n}\n.p-virtualscroller-horizontal > .p-virtualscroller-content {\n    display: flex;\n}\n\n/* Inline */\n.p-virtualscroller-inline .p-virtualscroller-content {\n    position: static;\n}\n";
styleInject$8(css_248z$8);
script$g.render = render$g;
var script$f = {
  name: "Dropdown",
  emits: ["update:modelValue", "change", "focus", "blur", "before-show", "before-hide", "show", "hide", "filter"],
  props: {
    modelValue: null,
    options: Array,
    optionLabel: null,
    optionValue: null,
    optionDisabled: null,
    optionGroupLabel: null,
    optionGroupChildren: null,
    scrollHeight: {
      type: String,
      default: "200px"
    },
    filter: Boolean,
    filterPlaceholder: String,
    filterLocale: String,
    filterMatchMode: {
      type: String,
      default: "contains"
    },
    filterFields: {
      type: Array,
      default: null
    },
    editable: Boolean,
    placeholder: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    dataKey: null,
    showClear: {
      type: Boolean,
      default: false
    },
    inputId: {
      type: String,
      default: null
    },
    inputClass: {
      type: [String, Object],
      default: null
    },
    inputStyle: {
      type: Object,
      default: null
    },
    inputProps: {
      type: null,
      default: null
    },
    panelClass: {
      type: [String, Object],
      default: null
    },
    panelStyle: {
      type: Object,
      default: null
    },
    panelProps: {
      type: null,
      default: null
    },
    filterInputProps: {
      type: null,
      default: null
    },
    clearIconProps: {
      type: null,
      default: null
    },
    appendTo: {
      type: String,
      default: "body"
    },
    loading: {
      type: Boolean,
      default: false
    },
    clearIcon: {
      type: String,
      default: "pi pi-times"
    },
    dropdownIcon: {
      type: String,
      default: "pi pi-chevron-down"
    },
    filterIcon: {
      type: String,
      default: "pi pi-search"
    },
    loadingIcon: {
      type: String,
      default: "pi pi-spinner pi-spin"
    },
    resetFilterOnHide: {
      type: Boolean,
      default: false
    },
    virtualScrollerOptions: {
      type: Object,
      default: null
    },
    autoOptionFocus: {
      type: Boolean,
      default: true
    },
    autoFilterFocus: {
      type: Boolean,
      default: false
    },
    selectOnFocus: {
      type: Boolean,
      default: false
    },
    filterMessage: {
      type: String,
      default: null
    },
    selectionMessage: {
      type: String,
      default: null
    },
    emptySelectionMessage: {
      type: String,
      default: null
    },
    emptyFilterMessage: {
      type: String,
      default: null
    },
    emptyMessage: {
      type: String,
      default: null
    },
    tabindex: {
      type: Number,
      default: 0
    },
    "aria-label": {
      type: String,
      default: null
    },
    "aria-labelledby": {
      type: String,
      default: null
    }
  },
  outsideClickListener: null,
  scrollHandler: null,
  resizeListener: null,
  overlay: null,
  list: null,
  virtualScroller: null,
  searchTimeout: null,
  searchValue: null,
  isModelValueChanged: false,
  focusOnHover: false,
  data() {
    return {
      id: this.$attrs.id,
      focused: false,
      focusedOptionIndex: -1,
      filterValue: null,
      overlayVisible: false
    };
  },
  watch: {
    "$attrs.id": function(newValue) {
      this.id = newValue || UniqueComponentId();
    },
    modelValue() {
      this.isModelValueChanged = true;
    },
    options() {
      this.autoUpdateModel();
    }
  },
  mounted() {
    this.id = this.id || UniqueComponentId();
    this.autoUpdateModel();
  },
  updated() {
    if (this.overlayVisible && this.isModelValueChanged) {
      this.scrollInView(this.findSelectedOptionIndex());
    }
    this.isModelValueChanged = false;
  },
  beforeUnmount() {
    this.unbindOutsideClickListener();
    this.unbindResizeListener();
    if (this.scrollHandler) {
      this.scrollHandler.destroy();
      this.scrollHandler = null;
    }
    if (this.overlay) {
      ZIndexUtils.clear(this.overlay);
      this.overlay = null;
    }
  },
  methods: {
    getOptionIndex(index, fn) {
      return this.virtualScrollerDisabled ? index : fn && fn(index)["index"];
    },
    getOptionLabel(option) {
      return this.optionLabel ? ObjectUtils.resolveFieldData(option, this.optionLabel) : option;
    },
    getOptionValue(option) {
      return this.optionValue ? ObjectUtils.resolveFieldData(option, this.optionValue) : option;
    },
    getOptionRenderKey(option, index) {
      return (this.dataKey ? ObjectUtils.resolveFieldData(option, this.dataKey) : this.getOptionLabel(option)) + "_" + index;
    },
    isOptionDisabled(option) {
      return this.optionDisabled ? ObjectUtils.resolveFieldData(option, this.optionDisabled) : false;
    },
    isOptionGroup(option) {
      return this.optionGroupLabel && option.optionGroup && option.group;
    },
    getOptionGroupLabel(optionGroup) {
      return ObjectUtils.resolveFieldData(optionGroup, this.optionGroupLabel);
    },
    getOptionGroupChildren(optionGroup) {
      return ObjectUtils.resolveFieldData(optionGroup, this.optionGroupChildren);
    },
    getAriaPosInset(index) {
      return (this.optionGroupLabel ? index - this.visibleOptions.slice(0, index).filter((option) => this.isOptionGroup(option)).length : index) + 1;
    },
    show(isFocus) {
      this.$emit("before-show");
      this.overlayVisible = true;
      this.focusedOptionIndex = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : -1;
      isFocus && DomHandler.focus(this.$refs.focusInput);
    },
    hide(isFocus) {
      const _hide = () => {
        this.$emit("before-hide");
        this.overlayVisible = false;
        this.focusedOptionIndex = -1;
        this.searchValue = "";
        this.resetFilterOnHide && (this.filterValue = null);
        isFocus && DomHandler.focus(this.$refs.focusInput);
      };
      setTimeout(() => {
        _hide();
      }, 0);
    },
    onFocus(event2) {
      if (this.disabled) {
        return;
      }
      this.focused = true;
      this.focusedOptionIndex = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : this.overlayVisible && this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : -1;
      this.overlayVisible && this.scrollInView(this.focusedOptionIndex);
      this.$emit("focus", event2);
    },
    onBlur(event2) {
      this.focused = false;
      this.focusedOptionIndex = -1;
      this.searchValue = "";
      this.$emit("blur", event2);
    },
    onKeyDown(event2) {
      if (this.disabled) {
        event2.preventDefault();
        return;
      }
      const metaKey = event2.metaKey || event2.ctrlKey;
      switch (event2.code) {
        case "ArrowDown":
          this.onArrowDownKey(event2);
          break;
        case "ArrowUp":
          this.onArrowUpKey(event2, this.editable);
          break;
        case "ArrowLeft":
        case "ArrowRight":
          this.onArrowLeftKey(event2, this.editable);
          break;
        case "Home":
          this.onHomeKey(event2, this.editable);
          break;
        case "End":
          this.onEndKey(event2, this.editable);
          break;
        case "PageDown":
          this.onPageDownKey(event2);
          break;
        case "PageUp":
          this.onPageUpKey(event2);
          break;
        case "Space":
          this.onSpaceKey(event2, this.editable);
          break;
        case "Enter":
        case "NumpadEnter":
          this.onEnterKey(event2);
          break;
        case "Escape":
          this.onEscapeKey(event2);
          break;
        case "Tab":
          this.onTabKey(event2);
          break;
        case "Backspace":
          this.onBackspaceKey(event2, this.editable);
          break;
        case "ShiftLeft":
        case "ShiftRight":
          break;
        default:
          if (!metaKey && ObjectUtils.isPrintableCharacter(event2.key)) {
            !this.overlayVisible && this.show();
            !this.editable && this.searchOptions(event2, event2.key);
          }
          break;
      }
    },
    onEditableInput(event2) {
      const value = event2.target.value;
      this.searchValue = "";
      const matched = this.searchOptions(event2, value);
      !matched && (this.focusedOptionIndex = -1);
      this.updateModel(event2, value);
    },
    onContainerClick(event2) {
      if (this.disabled || this.loading) {
        return;
      }
      if (DomHandler.hasClass(event2.target, "p-dropdown-clear-icon") || event2.target.tagName === "INPUT") {
        return;
      } else if (!this.overlay || !this.overlay.contains(event2.target)) {
        this.overlayVisible ? this.hide(true) : this.show(true);
      }
    },
    onClearClick(event2) {
      this.updateModel(event2, null);
    },
    onFirstHiddenFocus(event2) {
      const focusableEl = event2.relatedTarget === this.$refs.focusInput ? DomHandler.getFirstFocusableElement(this.overlay, ":not(.p-hidden-focusable)") : this.$refs.focusInput;
      DomHandler.focus(focusableEl);
    },
    onLastHiddenFocus(event2) {
      const focusableEl = event2.relatedTarget === this.$refs.focusInput ? DomHandler.getLastFocusableElement(this.overlay, ":not(.p-hidden-focusable)") : this.$refs.focusInput;
      DomHandler.focus(focusableEl);
    },
    onOptionSelect(event2, option, isHide = true) {
      const value = this.getOptionValue(option);
      this.updateModel(event2, value);
      isHide && this.hide(true);
    },
    onOptionMouseMove(event2, index) {
      if (this.focusOnHover) {
        this.changeFocusedOptionIndex(event2, index);
      }
    },
    onFilterChange(event2) {
      const value = event2.target.value;
      this.filterValue = value;
      this.focusedOptionIndex = -1;
      this.$emit("filter", { originalEvent: event2, value });
      !this.virtualScrollerDisabled && this.virtualScroller.scrollToIndex(0);
    },
    onFilterKeyDown(event2) {
      switch (event2.code) {
        case "ArrowDown":
          this.onArrowDownKey(event2);
          break;
        case "ArrowUp":
          this.onArrowUpKey(event2, true);
          break;
        case "ArrowLeft":
        case "ArrowRight":
          this.onArrowLeftKey(event2, true);
          break;
        case "Home":
          this.onHomeKey(event2, true);
          break;
        case "End":
          this.onEndKey(event2, true);
          break;
        case "Enter":
          this.onEnterKey(event2);
          break;
        case "Escape":
          this.onEscapeKey(event2);
          break;
        case "Tab":
          this.onTabKey(event2, true);
          break;
      }
    },
    onFilterBlur() {
      this.focusedOptionIndex = -1;
    },
    onFilterUpdated() {
      if (this.overlayVisible) {
        this.alignOverlay();
      }
    },
    onOverlayClick(event2) {
      OverlayEventBus.emit("overlay-click", {
        originalEvent: event2,
        target: this.$el
      });
    },
    onOverlayKeyDown(event2) {
      switch (event2.code) {
        case "Escape":
          this.onEscapeKey(event2);
          break;
      }
    },
    onArrowDownKey(event2) {
      const optionIndex = this.focusedOptionIndex !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex) : this.findFirstFocusedOptionIndex();
      this.changeFocusedOptionIndex(event2, optionIndex);
      !this.overlayVisible && this.show();
      event2.preventDefault();
    },
    onArrowUpKey(event2, pressedInInputText = false) {
      if (event2.altKey && !pressedInInputText) {
        if (this.focusedOptionIndex !== -1) {
          this.onOptionSelect(event2, this.visibleOptions[this.focusedOptionIndex]);
        }
        this.overlayVisible && this.hide();
        event2.preventDefault();
      } else {
        const optionIndex = this.focusedOptionIndex !== -1 ? this.findPrevOptionIndex(this.focusedOptionIndex) : this.findLastFocusedOptionIndex();
        this.changeFocusedOptionIndex(event2, optionIndex);
        !this.overlayVisible && this.show();
        event2.preventDefault();
      }
    },
    onArrowLeftKey(event2, pressedInInputText = false) {
      pressedInInputText && (this.focusedOptionIndex = -1);
    },
    onHomeKey(event2, pressedInInputText = false) {
      if (pressedInInputText) {
        event2.currentTarget.setSelectionRange(0, 0);
        this.focusedOptionIndex = -1;
      } else {
        this.changeFocusedOptionIndex(event2, this.findFirstOptionIndex());
        !this.overlayVisible && this.show();
      }
      event2.preventDefault();
    },
    onEndKey(event2, pressedInInputText = false) {
      if (pressedInInputText) {
        const target = event2.currentTarget;
        const len = target.value.length;
        target.setSelectionRange(len, len);
        this.focusedOptionIndex = -1;
      } else {
        this.changeFocusedOptionIndex(event2, this.findLastOptionIndex());
        !this.overlayVisible && this.show();
      }
      event2.preventDefault();
    },
    onPageUpKey(event2) {
      this.scrollInView(0);
      event2.preventDefault();
    },
    onPageDownKey(event2) {
      this.scrollInView(this.visibleOptions.length - 1);
      event2.preventDefault();
    },
    onEnterKey(event2) {
      if (!this.overlayVisible) {
        this.onArrowDownKey(event2);
      } else {
        if (this.focusedOptionIndex !== -1) {
          this.onOptionSelect(event2, this.visibleOptions[this.focusedOptionIndex]);
        }
        this.hide();
      }
      event2.preventDefault();
    },
    onSpaceKey(event2, pressedInInputText = false) {
      !pressedInInputText && this.onEnterKey(event2);
    },
    onEscapeKey(event2) {
      this.overlayVisible && this.hide(true);
      event2.preventDefault();
    },
    onTabKey(event2, pressedInInputText = false) {
      if (!pressedInInputText) {
        if (this.overlayVisible && this.hasFocusableElements()) {
          DomHandler.focus(this.$refs.firstHiddenFocusableElementOnOverlay);
          event2.preventDefault();
        } else {
          if (this.focusedOptionIndex !== -1) {
            this.onOptionSelect(event2, this.visibleOptions[this.focusedOptionIndex]);
          }
          this.overlayVisible && this.hide(this.filter);
        }
      }
    },
    onBackspaceKey(event2, pressedInInputText = false) {
      if (pressedInInputText) {
        !this.overlayVisible && this.show();
      }
    },
    onOverlayEnter(el) {
      ZIndexUtils.set("overlay", el, this.$primevue.config.zIndex.overlay);
      this.alignOverlay();
      this.scrollInView();
      this.autoFilterFocus && DomHandler.focus(this.$refs.filterInput);
    },
    onOverlayAfterEnter() {
      this.bindOutsideClickListener();
      this.bindScrollListener();
      this.bindResizeListener();
      this.$emit("show");
    },
    onOverlayLeave() {
      this.unbindOutsideClickListener();
      this.unbindScrollListener();
      this.unbindResizeListener();
      this.$emit("hide");
      this.overlay = null;
    },
    onOverlayAfterLeave(el) {
      ZIndexUtils.clear(el);
    },
    alignOverlay() {
      if (this.appendTo === "self") {
        DomHandler.relativePosition(this.overlay, this.$el);
      } else {
        this.overlay.style.minWidth = DomHandler.getOuterWidth(this.$el) + "px";
        DomHandler.absolutePosition(this.overlay, this.$el);
      }
    },
    bindOutsideClickListener() {
      if (!this.outsideClickListener) {
        this.outsideClickListener = (event2) => {
          if (this.overlayVisible && this.overlay && !this.$el.contains(event2.target) && !this.overlay.contains(event2.target)) {
            this.hide();
          }
        };
        document.addEventListener("click", this.outsideClickListener);
      }
    },
    unbindOutsideClickListener() {
      if (this.outsideClickListener) {
        document.removeEventListener("click", this.outsideClickListener);
        this.outsideClickListener = null;
      }
    },
    bindScrollListener() {
      if (!this.scrollHandler) {
        this.scrollHandler = new ConnectedOverlayScrollHandler(this.$refs.container, () => {
          if (this.overlayVisible) {
            this.hide();
          }
        });
      }
      this.scrollHandler.bindScrollListener();
    },
    unbindScrollListener() {
      if (this.scrollHandler) {
        this.scrollHandler.unbindScrollListener();
      }
    },
    bindResizeListener() {
      if (!this.resizeListener) {
        this.resizeListener = () => {
          if (this.overlayVisible && !DomHandler.isTouchDevice()) {
            this.hide();
          }
        };
        window.addEventListener("resize", this.resizeListener);
      }
    },
    unbindResizeListener() {
      if (this.resizeListener) {
        window.removeEventListener("resize", this.resizeListener);
        this.resizeListener = null;
      }
    },
    hasFocusableElements() {
      return DomHandler.getFocusableElements(this.overlay, ":not(.p-hidden-focusable)").length > 0;
    },
    isOptionMatched(option) {
      return this.isValidOption(option) && this.getOptionLabel(option).toLocaleLowerCase(this.filterLocale).startsWith(this.searchValue.toLocaleLowerCase(this.filterLocale));
    },
    isValidOption(option) {
      return option && !(this.isOptionDisabled(option) || this.isOptionGroup(option));
    },
    isValidSelectedOption(option) {
      return this.isValidOption(option) && this.isSelected(option);
    },
    isSelected(option) {
      return this.isValidOption(option) && ObjectUtils.equals(this.modelValue, this.getOptionValue(option), this.equalityKey);
    },
    findFirstOptionIndex() {
      return this.visibleOptions.findIndex((option) => this.isValidOption(option));
    },
    findLastOptionIndex() {
      return ObjectUtils.findLastIndex(this.visibleOptions, (option) => this.isValidOption(option));
    },
    findNextOptionIndex(index) {
      const matchedOptionIndex = index < this.visibleOptions.length - 1 ? this.visibleOptions.slice(index + 1).findIndex((option) => this.isValidOption(option)) : -1;
      return matchedOptionIndex > -1 ? matchedOptionIndex + index + 1 : index;
    },
    findPrevOptionIndex(index) {
      const matchedOptionIndex = index > 0 ? ObjectUtils.findLastIndex(this.visibleOptions.slice(0, index), (option) => this.isValidOption(option)) : -1;
      return matchedOptionIndex > -1 ? matchedOptionIndex : index;
    },
    findSelectedOptionIndex() {
      return this.hasSelectedOption ? this.visibleOptions.findIndex((option) => this.isValidSelectedOption(option)) : -1;
    },
    findFirstFocusedOptionIndex() {
      const selectedIndex = this.findSelectedOptionIndex();
      return selectedIndex < 0 ? this.findFirstOptionIndex() : selectedIndex;
    },
    findLastFocusedOptionIndex() {
      const selectedIndex = this.findSelectedOptionIndex();
      return selectedIndex < 0 ? this.findLastOptionIndex() : selectedIndex;
    },
    searchOptions(event2, char) {
      this.searchValue = (this.searchValue || "") + char;
      let optionIndex = -1;
      let matched = false;
      if (this.focusedOptionIndex !== -1) {
        optionIndex = this.visibleOptions.slice(this.focusedOptionIndex).findIndex((option) => this.isOptionMatched(option));
        optionIndex = optionIndex === -1 ? this.visibleOptions.slice(0, this.focusedOptionIndex).findIndex((option) => this.isOptionMatched(option)) : optionIndex + this.focusedOptionIndex;
      } else {
        optionIndex = this.visibleOptions.findIndex((option) => this.isOptionMatched(option));
      }
      if (optionIndex !== -1) {
        matched = true;
      }
      if (optionIndex === -1 && this.focusedOptionIndex === -1) {
        optionIndex = this.findFirstFocusedOptionIndex();
      }
      if (optionIndex !== -1) {
        this.changeFocusedOptionIndex(event2, optionIndex);
      }
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(() => {
        this.searchValue = "";
        this.searchTimeout = null;
      }, 500);
      return matched;
    },
    changeFocusedOptionIndex(event2, index) {
      if (this.focusedOptionIndex !== index) {
        this.focusedOptionIndex = index;
        this.scrollInView();
        if (this.selectOnFocus) {
          this.onOptionSelect(event2, this.visibleOptions[index], false);
        }
      }
    },
    scrollInView(index = -1) {
      const id = index !== -1 ? `${this.id}_${index}` : this.focusedOptionId;
      const element = DomHandler.findSingle(this.list, `li[id="${id}"]`);
      if (element) {
        element.scrollIntoView && element.scrollIntoView({ block: "nearest", inline: "start" });
      } else if (!this.virtualScrollerDisabled) {
        setTimeout(() => {
          this.virtualScroller && this.virtualScroller.scrollToIndex(index !== -1 ? index : this.focusedOptionIndex);
        }, 0);
      }
    },
    autoUpdateModel() {
      if (this.selectOnFocus && this.autoOptionFocus && !this.hasSelectedOption) {
        this.focusedOptionIndex = this.findFirstFocusedOptionIndex();
        this.onOptionSelect(null, this.visibleOptions[this.focusedOptionIndex], false);
      }
    },
    updateModel(event2, value) {
      this.$emit("update:modelValue", value);
      this.$emit("change", { originalEvent: event2, value });
    },
    flatOptions(options) {
      return (options || []).reduce((result, option, index) => {
        result.push({ optionGroup: option, group: true, index });
        const optionGroupChildren = this.getOptionGroupChildren(option);
        optionGroupChildren && optionGroupChildren.forEach((o) => result.push(o));
        return result;
      }, []);
    },
    overlayRef(el) {
      this.overlay = el;
    },
    listRef(el, contentRef) {
      this.list = el;
      contentRef && contentRef(el);
    },
    virtualScrollerRef(el) {
      this.virtualScroller = el;
    }
  },
  computed: {
    containerClass() {
      return [
        "p-dropdown p-component p-inputwrapper",
        {
          "p-disabled": this.disabled,
          "p-dropdown-clearable": this.showClear && !this.disabled,
          "p-focus": this.focused,
          "p-inputwrapper-filled": this.modelValue,
          "p-inputwrapper-focus": this.focused || this.overlayVisible,
          "p-overlay-open": this.overlayVisible
        }
      ];
    },
    inputStyleClass() {
      return [
        "p-dropdown-label p-inputtext",
        this.inputClass,
        {
          "p-placeholder": !this.editable && this.label === this.placeholder,
          "p-dropdown-label-empty": !this.editable && !this.$slots["value"] && (this.label === "p-emptylabel" || this.label.length === 0)
        }
      ];
    },
    panelStyleClass() {
      return [
        "p-dropdown-panel p-component",
        this.panelClass,
        {
          "p-input-filled": this.$primevue.config.inputStyle === "filled",
          "p-ripple-disabled": this.$primevue.config.ripple === false
        }
      ];
    },
    dropdownIconClass() {
      return ["p-dropdown-trigger-icon", this.loading ? this.loadingIcon : this.dropdownIcon];
    },
    visibleOptions() {
      const options = this.optionGroupLabel ? this.flatOptions(this.options) : this.options || [];
      if (this.filterValue) {
        const filteredOptions = FilterService.filter(options, this.searchFields, this.filterValue, this.filterMatchMode, this.filterLocale);
        if (this.optionGroupLabel) {
          const optionGroups = this.options || [];
          const filtered = [];
          optionGroups.forEach((group) => {
            const groupChildren = this.getOptionGroupChildren(group);
            const filteredItems = groupChildren.filter((item) => filteredOptions.includes(item));
            if (filteredItems.length > 0)
              filtered.push({ ...group, [typeof this.optionGroupChildren === "string" ? this.optionGroupChildren : "items"]: [...filteredItems] });
          });
          return this.flatOptions(filtered);
        }
        return filteredOptions;
      }
      return options;
    },
    hasSelectedOption() {
      return ObjectUtils.isNotEmpty(this.modelValue);
    },
    label() {
      const selectedOptionIndex = this.findSelectedOptionIndex();
      return selectedOptionIndex !== -1 ? this.getOptionLabel(this.visibleOptions[selectedOptionIndex]) : this.placeholder || "p-emptylabel";
    },
    editableInputValue() {
      const selectedOptionIndex = this.findSelectedOptionIndex();
      return selectedOptionIndex !== -1 ? this.getOptionLabel(this.visibleOptions[selectedOptionIndex]) : this.modelValue || "";
    },
    equalityKey() {
      return this.optionValue ? null : this.dataKey;
    },
    searchFields() {
      return this.filterFields || [this.optionLabel];
    },
    filterResultMessageText() {
      return ObjectUtils.isNotEmpty(this.visibleOptions) ? this.filterMessageText.replaceAll("{0}", this.visibleOptions.length) : this.emptyFilterMessageText;
    },
    filterMessageText() {
      return this.filterMessage || this.$primevue.config.locale.searchMessage || "";
    },
    emptyFilterMessageText() {
      return this.emptyFilterMessage || this.$primevue.config.locale.emptySearchMessage || this.$primevue.config.locale.emptyFilterMessage || "";
    },
    emptyMessageText() {
      return this.emptyMessage || this.$primevue.config.locale.emptyMessage || "";
    },
    selectionMessageText() {
      return this.selectionMessage || this.$primevue.config.locale.selectionMessage || "";
    },
    emptySelectionMessageText() {
      return this.emptySelectionMessage || this.$primevue.config.locale.emptySelectionMessage || "";
    },
    selectedMessageText() {
      return this.hasSelectedOption ? this.selectionMessageText.replaceAll("{0}", "1") : this.emptySelectionMessageText;
    },
    focusedOptionId() {
      return this.focusedOptionIndex !== -1 ? `${this.id}_${this.focusedOptionIndex}` : null;
    },
    ariaSetSize() {
      return this.visibleOptions.filter((option) => !this.isOptionGroup(option)).length;
    },
    virtualScrollerDisabled() {
      return !this.virtualScrollerOptions;
    }
  },
  directives: {
    ripple: Ripple
  },
  components: {
    VirtualScroller: script$g,
    Portal: script$h
  }
};
const _hoisted_1$f = ["id"];
const _hoisted_2$c = ["id", "value", "placeholder", "tabindex", "disabled", "aria-label", "aria-labelledby", "aria-expanded", "aria-controls", "aria-activedescendant"];
const _hoisted_3$9 = ["id", "tabindex", "aria-label", "aria-labelledby", "aria-expanded", "aria-controls", "aria-activedescendant", "aria-disabled"];
const _hoisted_4$7 = { class: "p-dropdown-trigger" };
const _hoisted_5$5 = {
  key: 0,
  class: "p-dropdown-header"
};
const _hoisted_6$5 = { class: "p-dropdown-filter-container" };
const _hoisted_7$4 = ["value", "placeholder", "aria-owns", "aria-activedescendant"];
const _hoisted_8$4 = {
  role: "status",
  "aria-live": "polite",
  class: "p-hidden-accessible"
};
const _hoisted_9$3 = ["id"];
const _hoisted_10$3 = ["id"];
const _hoisted_11$3 = ["id", "aria-label", "aria-selected", "aria-disabled", "aria-setsize", "aria-posinset", "onClick", "onMousemove"];
const _hoisted_12$3 = {
  key: 0,
  class: "p-dropdown-empty-message",
  role: "option"
};
const _hoisted_13$3 = {
  key: 1,
  class: "p-dropdown-empty-message",
  role: "option"
};
const _hoisted_14$1 = {
  key: 1,
  role: "status",
  "aria-live": "polite",
  class: "p-hidden-accessible"
};
const _hoisted_15$1 = {
  role: "status",
  "aria-live": "polite",
  class: "p-hidden-accessible"
};
function render$f(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_VirtualScroller = resolveComponent("VirtualScroller");
  const _component_Portal = resolveComponent("Portal");
  const _directive_ripple = resolveDirective("ripple");
  return openBlock(), createElementBlock("div", {
    ref: "container",
    id: $data.id,
    class: normalizeClass($options.containerClass),
    onClick: _cache[16] || (_cache[16] = (...args) => $options.onContainerClick && $options.onContainerClick(...args))
  }, [
    $props.editable ? (openBlock(), createElementBlock("input", mergeProps({
      key: 0,
      ref: "focusInput",
      id: $props.inputId,
      type: "text",
      style: $props.inputStyle,
      class: $options.inputStyleClass,
      value: $options.editableInputValue,
      placeholder: $props.placeholder,
      tabindex: !$props.disabled ? $props.tabindex : -1,
      disabled: $props.disabled,
      autocomplete: "off",
      role: "combobox",
      "aria-label": _ctx.ariaLabel,
      "aria-labelledby": _ctx.ariaLabelledby,
      "aria-haspopup": "listbox",
      "aria-expanded": $data.overlayVisible,
      "aria-controls": $data.id + "_list",
      "aria-activedescendant": $data.focused ? $options.focusedOptionId : void 0,
      onFocus: _cache[0] || (_cache[0] = (...args) => $options.onFocus && $options.onFocus(...args)),
      onBlur: _cache[1] || (_cache[1] = (...args) => $options.onBlur && $options.onBlur(...args)),
      onKeydown: _cache[2] || (_cache[2] = (...args) => $options.onKeyDown && $options.onKeyDown(...args)),
      onInput: _cache[3] || (_cache[3] = (...args) => $options.onEditableInput && $options.onEditableInput(...args))
    }, $props.inputProps), null, 16, _hoisted_2$c)) : (openBlock(), createElementBlock("span", mergeProps({
      key: 1,
      ref: "focusInput",
      id: $props.inputId,
      style: $props.inputStyle,
      class: $options.inputStyleClass,
      tabindex: !$props.disabled ? $props.tabindex : -1,
      role: "combobox",
      "aria-label": _ctx.ariaLabel || ($options.label === "p-emptylabel" ? void 0 : $options.label),
      "aria-labelledby": _ctx.ariaLabelledby,
      "aria-haspopup": "listbox",
      "aria-expanded": $data.overlayVisible,
      "aria-controls": $data.id + "_list",
      "aria-activedescendant": $data.focused ? $options.focusedOptionId : void 0,
      "aria-disabled": $props.disabled,
      onFocus: _cache[4] || (_cache[4] = (...args) => $options.onFocus && $options.onFocus(...args)),
      onBlur: _cache[5] || (_cache[5] = (...args) => $options.onBlur && $options.onBlur(...args)),
      onKeydown: _cache[6] || (_cache[6] = (...args) => $options.onKeyDown && $options.onKeyDown(...args))
    }, $props.inputProps), [
      renderSlot(_ctx.$slots, "value", {
        value: $props.modelValue,
        placeholder: $props.placeholder
      }, () => [
        createTextVNode(toDisplayString($options.label === "p-emptylabel" ? " " : $options.label || "empty"), 1)
      ])
    ], 16, _hoisted_3$9)),
    $props.showClear && $props.modelValue != null ? (openBlock(), createElementBlock("i", mergeProps({
      key: 2,
      class: ["p-dropdown-clear-icon", $props.clearIcon],
      onClick: _cache[7] || (_cache[7] = (...args) => $options.onClearClick && $options.onClearClick(...args))
    }, $props.clearIconProps), null, 16)) : createCommentVNode("", true),
    createElementVNode("div", _hoisted_4$7, [
      renderSlot(_ctx.$slots, "indicator", {}, () => [
        createElementVNode("span", {
          class: normalizeClass($options.dropdownIconClass),
          "aria-hidden": "true"
        }, null, 2)
      ])
    ]),
    createVNode(_component_Portal, { appendTo: $props.appendTo }, {
      default: withCtx(() => [
        createVNode(Transition, {
          name: "p-connected-overlay",
          onEnter: $options.onOverlayEnter,
          onAfterEnter: $options.onOverlayAfterEnter,
          onLeave: $options.onOverlayLeave,
          onAfterLeave: $options.onOverlayAfterLeave
        }, {
          default: withCtx(() => [
            $data.overlayVisible ? (openBlock(), createElementBlock("div", mergeProps({
              key: 0,
              ref: $options.overlayRef,
              style: $props.panelStyle,
              class: $options.panelStyleClass,
              onClick: _cache[14] || (_cache[14] = (...args) => $options.onOverlayClick && $options.onOverlayClick(...args)),
              onKeydown: _cache[15] || (_cache[15] = (...args) => $options.onOverlayKeyDown && $options.onOverlayKeyDown(...args))
            }, $props.panelProps), [
              createElementVNode("span", {
                ref: "firstHiddenFocusableElementOnOverlay",
                role: "presentation",
                "aria-hidden": "true",
                class: "p-hidden-accessible p-hidden-focusable",
                tabindex: 0,
                onFocus: _cache[8] || (_cache[8] = (...args) => $options.onFirstHiddenFocus && $options.onFirstHiddenFocus(...args))
              }, null, 544),
              renderSlot(_ctx.$slots, "header", {
                value: $props.modelValue,
                options: $options.visibleOptions
              }),
              $props.filter ? (openBlock(), createElementBlock("div", _hoisted_5$5, [
                createElementVNode("div", _hoisted_6$5, [
                  createElementVNode("input", mergeProps({
                    ref: "filterInput",
                    type: "text",
                    value: $data.filterValue,
                    onVnodeUpdated: _cache[9] || (_cache[9] = (...args) => $options.onFilterUpdated && $options.onFilterUpdated(...args)),
                    class: "p-dropdown-filter p-inputtext p-component",
                    placeholder: $props.filterPlaceholder,
                    role: "searchbox",
                    autocomplete: "off",
                    "aria-owns": $data.id + "_list",
                    "aria-activedescendant": $options.focusedOptionId,
                    onKeydown: _cache[10] || (_cache[10] = (...args) => $options.onFilterKeyDown && $options.onFilterKeyDown(...args)),
                    onBlur: _cache[11] || (_cache[11] = (...args) => $options.onFilterBlur && $options.onFilterBlur(...args)),
                    onInput: _cache[12] || (_cache[12] = (...args) => $options.onFilterChange && $options.onFilterChange(...args))
                  }, $props.filterInputProps), null, 16, _hoisted_7$4),
                  createElementVNode("span", {
                    class: normalizeClass(["p-dropdown-filter-icon", $props.filterIcon])
                  }, null, 2)
                ]),
                createElementVNode("span", _hoisted_8$4, toDisplayString($options.filterResultMessageText), 1)
              ])) : createCommentVNode("", true),
              createElementVNode("div", {
                class: "p-dropdown-items-wrapper",
                style: normalizeStyle({ "max-height": $options.virtualScrollerDisabled ? $props.scrollHeight : "" })
              }, [
                createVNode(_component_VirtualScroller, mergeProps({ ref: $options.virtualScrollerRef }, $props.virtualScrollerOptions, {
                  items: $options.visibleOptions,
                  style: { height: $props.scrollHeight },
                  tabindex: -1,
                  disabled: $options.virtualScrollerDisabled
                }), createSlots({
                  content: withCtx(({ styleClass, contentRef, items, getItemOptions, contentStyle, itemSize }) => [
                    createElementVNode("ul", {
                      ref: (el) => $options.listRef(el, contentRef),
                      id: $data.id + "_list",
                      class: normalizeClass(["p-dropdown-items", styleClass]),
                      style: normalizeStyle(contentStyle),
                      role: "listbox"
                    }, [
                      (openBlock(true), createElementBlock(Fragment$1, null, renderList(items, (option, i) => {
                        return openBlock(), createElementBlock(Fragment$1, {
                          key: $options.getOptionRenderKey(option, $options.getOptionIndex(i, getItemOptions))
                        }, [
                          $options.isOptionGroup(option) ? (openBlock(), createElementBlock("li", {
                            key: 0,
                            id: $data.id + "_" + $options.getOptionIndex(i, getItemOptions),
                            style: normalizeStyle({ height: itemSize ? itemSize + "px" : void 0 }),
                            class: "p-dropdown-item-group",
                            role: "option"
                          }, [
                            renderSlot(_ctx.$slots, "optiongroup", {
                              option: option.optionGroup,
                              index: $options.getOptionIndex(i, getItemOptions)
                            }, () => [
                              createTextVNode(toDisplayString($options.getOptionGroupLabel(option.optionGroup)), 1)
                            ])
                          ], 12, _hoisted_10$3)) : withDirectives((openBlock(), createElementBlock("li", {
                            key: 1,
                            id: $data.id + "_" + $options.getOptionIndex(i, getItemOptions),
                            style: normalizeStyle({ height: itemSize ? itemSize + "px" : void 0 }),
                            class: normalizeClass(["p-dropdown-item", { "p-highlight": $options.isSelected(option), "p-focus": $data.focusedOptionIndex === $options.getOptionIndex(i, getItemOptions), "p-disabled": $options.isOptionDisabled(option) }]),
                            role: "option",
                            "aria-label": $options.getOptionLabel(option),
                            "aria-selected": $options.isSelected(option),
                            "aria-disabled": $options.isOptionDisabled(option),
                            "aria-setsize": $options.ariaSetSize,
                            "aria-posinset": $options.getAriaPosInset($options.getOptionIndex(i, getItemOptions)),
                            onClick: ($event) => $options.onOptionSelect($event, option),
                            onMousemove: ($event) => $options.onOptionMouseMove($event, $options.getOptionIndex(i, getItemOptions))
                          }, [
                            renderSlot(_ctx.$slots, "option", {
                              option,
                              index: $options.getOptionIndex(i, getItemOptions)
                            }, () => [
                              createTextVNode(toDisplayString($options.getOptionLabel(option)), 1)
                            ])
                          ], 46, _hoisted_11$3)), [
                            [_directive_ripple]
                          ])
                        ], 64);
                      }), 128)),
                      $data.filterValue && (!items || items && items.length === 0) ? (openBlock(), createElementBlock("li", _hoisted_12$3, [
                        renderSlot(_ctx.$slots, "emptyfilter", {}, () => [
                          createTextVNode(toDisplayString($options.emptyFilterMessageText), 1)
                        ])
                      ])) : !$props.options || $props.options && $props.options.length === 0 ? (openBlock(), createElementBlock("li", _hoisted_13$3, [
                        renderSlot(_ctx.$slots, "empty", {}, () => [
                          createTextVNode(toDisplayString($options.emptyMessageText), 1)
                        ])
                      ])) : createCommentVNode("", true)
                    ], 14, _hoisted_9$3)
                  ]),
                  _: 2
                }, [
                  _ctx.$slots.loader ? {
                    name: "loader",
                    fn: withCtx(({ options }) => [
                      renderSlot(_ctx.$slots, "loader", { options })
                    ]),
                    key: "0"
                  } : void 0
                ]), 1040, ["items", "style", "disabled"])
              ], 4),
              renderSlot(_ctx.$slots, "footer", {
                value: $props.modelValue,
                options: $options.visibleOptions
              }),
              !$props.options || $props.options && $props.options.length === 0 ? (openBlock(), createElementBlock("span", _hoisted_14$1, toDisplayString($options.emptyMessageText), 1)) : createCommentVNode("", true),
              createElementVNode("span", _hoisted_15$1, toDisplayString($options.selectedMessageText), 1),
              createElementVNode("span", {
                ref: "lastHiddenFocusableElementOnOverlay",
                role: "presentation",
                "aria-hidden": "true",
                class: "p-hidden-accessible p-hidden-focusable",
                tabindex: 0,
                onFocus: _cache[13] || (_cache[13] = (...args) => $options.onLastHiddenFocus && $options.onLastHiddenFocus(...args))
              }, null, 544)
            ], 16)) : createCommentVNode("", true)
          ]),
          _: 3
        }, 8, ["onEnter", "onAfterEnter", "onLeave", "onAfterLeave"])
      ]),
      _: 3
    }, 8, ["appendTo"])
  ], 10, _hoisted_1$f);
}
function styleInject$7(css, ref2) {
  if (ref2 === void 0)
    ref2 = {};
  var insertAt = ref2.insertAt;
  if (!css || true) {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
var css_248z$7 = "\n.p-dropdown {\n    display: inline-flex;\n    cursor: pointer;\n    position: relative;\n    user-select: none;\n}\n.p-dropdown-clear-icon {\n    position: absolute;\n    top: 50%;\n    margin-top: -0.5rem;\n}\n.p-dropdown-trigger {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    flex-shrink: 0;\n}\n.p-dropdown-label {\n    display: block;\n    white-space: nowrap;\n    overflow: hidden;\n    flex: 1 1 auto;\n    width: 1%;\n    text-overflow: ellipsis;\n    cursor: pointer;\n}\n.p-dropdown-label-empty {\n    overflow: hidden;\n    opacity: 0;\n}\ninput.p-dropdown-label {\n    cursor: default;\n}\n.p-dropdown .p-dropdown-panel {\n    min-width: 100%;\n}\n.p-dropdown-panel {\n    position: absolute;\n    top: 0;\n    left: 0;\n}\n.p-dropdown-items-wrapper {\n    overflow: auto;\n}\n.p-dropdown-item {\n    cursor: pointer;\n    font-weight: normal;\n    white-space: nowrap;\n    position: relative;\n    overflow: hidden;\n}\n.p-dropdown-item-group {\n    cursor: auto;\n}\n.p-dropdown-items {\n    margin: 0;\n    padding: 0;\n    list-style-type: none;\n}\n.p-dropdown-filter {\n    width: 100%;\n}\n.p-dropdown-filter-container {\n    position: relative;\n}\n.p-dropdown-filter-icon {\n    position: absolute;\n    top: 50%;\n    margin-top: -0.5rem;\n}\n.p-fluid .p-dropdown {\n    display: flex;\n}\n.p-fluid .p-dropdown .p-dropdown-label {\n    width: 1%;\n}\n";
styleInject$7(css_248z$7);
script$f.render = render$f;
var script$e = {
  name: "InputText",
  emits: ["update:modelValue"],
  props: {
    modelValue: null
  },
  methods: {
    onInput(event2) {
      this.$emit("update:modelValue", event2.target.value);
    }
  },
  computed: {
    filled() {
      return this.modelValue != null && this.modelValue.toString().length > 0;
    }
  }
};
const _hoisted_1$e = ["value"];
function render$e(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("input", {
    class: normalizeClass(["p-inputtext p-component", { "p-filled": $options.filled }]),
    value: $props.modelValue,
    onInput: _cache[0] || (_cache[0] = (...args) => $options.onInput && $options.onInput(...args))
  }, null, 42, _hoisted_1$e);
}
script$e.render = render$e;
var script$d = {
  name: "InputNumber",
  emits: ["update:modelValue", "input", "focus", "blur"],
  props: {
    modelValue: {
      type: Number,
      default: null
    },
    format: {
      type: Boolean,
      default: true
    },
    showButtons: {
      type: Boolean,
      default: false
    },
    buttonLayout: {
      type: String,
      default: "stacked"
    },
    incrementButtonClass: {
      type: String,
      default: null
    },
    decrementButtonClass: {
      type: String,
      default: null
    },
    incrementButtonIcon: {
      type: String,
      default: "pi pi-angle-up"
    },
    decrementButtonIcon: {
      type: String,
      default: "pi pi-angle-down"
    },
    locale: {
      type: String,
      default: void 0
    },
    localeMatcher: {
      type: String,
      default: void 0
    },
    mode: {
      type: String,
      default: "decimal"
    },
    prefix: {
      type: String,
      default: null
    },
    suffix: {
      type: String,
      default: null
    },
    currency: {
      type: String,
      default: void 0
    },
    currencyDisplay: {
      type: String,
      default: void 0
    },
    useGrouping: {
      type: Boolean,
      default: true
    },
    minFractionDigits: {
      type: Number,
      default: void 0
    },
    maxFractionDigits: {
      type: Number,
      default: void 0
    },
    min: {
      type: Number,
      default: null
    },
    max: {
      type: Number,
      default: null
    },
    step: {
      type: Number,
      default: 1
    },
    allowEmpty: {
      type: Boolean,
      default: true
    },
    highlightOnFocus: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: null
    },
    inputId: {
      type: String,
      default: null
    },
    inputClass: {
      type: [String, Object],
      default: null
    },
    inputStyle: {
      type: Object,
      default: null
    },
    inputProps: {
      type: null,
      default: null
    },
    incrementButtonProps: {
      type: null,
      default: null
    },
    decrementButtonProps: {
      type: null,
      default: null
    },
    "aria-labelledby": {
      type: String,
      default: null
    },
    "aria-label": {
      type: String,
      default: null
    }
  },
  numberFormat: null,
  _numeral: null,
  _decimal: null,
  _group: null,
  _minusSign: null,
  _currency: null,
  _suffix: null,
  _prefix: null,
  _index: null,
  groupChar: "",
  isSpecialChar: null,
  prefixChar: null,
  suffixChar: null,
  timer: null,
  data() {
    return {
      d_modelValue: this.modelValue,
      focused: false
    };
  },
  watch: {
    modelValue(newValue) {
      this.d_modelValue = newValue;
    },
    locale(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },
    localeMatcher(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },
    mode(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },
    currency(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },
    currencyDisplay(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },
    useGrouping(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },
    minFractionDigits(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },
    maxFractionDigits(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },
    suffix(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },
    prefix(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    }
  },
  created() {
    this.constructParser();
  },
  methods: {
    getOptions() {
      return {
        localeMatcher: this.localeMatcher,
        style: this.mode,
        currency: this.currency,
        currencyDisplay: this.currencyDisplay,
        useGrouping: this.useGrouping,
        minimumFractionDigits: this.minFractionDigits,
        maximumFractionDigits: this.maxFractionDigits
      };
    },
    constructParser() {
      this.numberFormat = new Intl.NumberFormat(this.locale, this.getOptions());
      const numerals = [...new Intl.NumberFormat(this.locale, { useGrouping: false }).format(9876543210)].reverse();
      const index = new Map(numerals.map((d, i) => [d, i]));
      this._numeral = new RegExp(`[${numerals.join("")}]`, "g");
      this._group = this.getGroupingExpression();
      this._minusSign = this.getMinusSignExpression();
      this._currency = this.getCurrencyExpression();
      this._decimal = this.getDecimalExpression();
      this._suffix = this.getSuffixExpression();
      this._prefix = this.getPrefixExpression();
      this._index = (d) => index.get(d);
    },
    updateConstructParser(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.constructParser();
      }
    },
    escapeRegExp(text) {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    },
    getDecimalExpression() {
      const formatter = new Intl.NumberFormat(this.locale, { ...this.getOptions(), useGrouping: false });
      return new RegExp(`[${formatter.format(1.1).replace(this._currency, "").trim().replace(this._numeral, "")}]`, "g");
    },
    getGroupingExpression() {
      const formatter = new Intl.NumberFormat(this.locale, { useGrouping: true });
      this.groupChar = formatter.format(1e6).trim().replace(this._numeral, "").charAt(0);
      return new RegExp(`[${this.groupChar}]`, "g");
    },
    getMinusSignExpression() {
      const formatter = new Intl.NumberFormat(this.locale, { useGrouping: false });
      return new RegExp(`[${formatter.format(-1).trim().replace(this._numeral, "")}]`, "g");
    },
    getCurrencyExpression() {
      if (this.currency) {
        const formatter = new Intl.NumberFormat(this.locale, { style: "currency", currency: this.currency, currencyDisplay: this.currencyDisplay, minimumFractionDigits: 0, maximumFractionDigits: 0 });
        return new RegExp(`[${formatter.format(1).replace(/\s/g, "").replace(this._numeral, "").replace(this._group, "")}]`, "g");
      }
      return new RegExp(`[]`, "g");
    },
    getPrefixExpression() {
      if (this.prefix) {
        this.prefixChar = this.prefix;
      } else {
        const formatter = new Intl.NumberFormat(this.locale, { style: this.mode, currency: this.currency, currencyDisplay: this.currencyDisplay });
        this.prefixChar = formatter.format(1).split("1")[0];
      }
      return new RegExp(`${this.escapeRegExp(this.prefixChar || "")}`, "g");
    },
    getSuffixExpression() {
      if (this.suffix) {
        this.suffixChar = this.suffix;
      } else {
        const formatter = new Intl.NumberFormat(this.locale, { style: this.mode, currency: this.currency, currencyDisplay: this.currencyDisplay, minimumFractionDigits: 0, maximumFractionDigits: 0 });
        this.suffixChar = formatter.format(1).split("1")[1];
      }
      return new RegExp(`${this.escapeRegExp(this.suffixChar || "")}`, "g");
    },
    formatValue(value) {
      if (value != null) {
        if (value === "-") {
          return value;
        }
        if (this.format) {
          let formatter = new Intl.NumberFormat(this.locale, this.getOptions());
          let formattedValue = formatter.format(value);
          if (this.prefix) {
            formattedValue = this.prefix + formattedValue;
          }
          if (this.suffix) {
            formattedValue = formattedValue + this.suffix;
          }
          return formattedValue;
        }
        return value.toString();
      }
      return "";
    },
    parseValue(text) {
      let filteredText = text.replace(this._suffix, "").replace(this._prefix, "").trim().replace(/\s/g, "").replace(this._currency, "").replace(this._group, "").replace(this._minusSign, "-").replace(this._decimal, ".").replace(this._numeral, this._index);
      if (filteredText) {
        if (filteredText === "-")
          return filteredText;
        let parsedValue = +filteredText;
        return isNaN(parsedValue) ? null : parsedValue;
      }
      return null;
    },
    repeat(event2, interval, dir) {
      if (this.readonly) {
        return;
      }
      let i = interval || 500;
      this.clearTimer();
      this.timer = setTimeout(() => {
        this.repeat(event2, 40, dir);
      }, i);
      this.spin(event2, dir);
    },
    spin(event2, dir) {
      if (this.$refs.input) {
        let step = this.step * dir;
        let currentValue = this.parseValue(this.$refs.input.$el.value) || 0;
        let newValue = this.validateValue(currentValue + step);
        this.updateInput(newValue, null, "spin");
        this.updateModel(event2, newValue);
        this.handleOnInput(event2, currentValue, newValue);
      }
    },
    onUpButtonMouseDown(event2) {
      if (!this.disabled) {
        this.$refs.input.$el.focus();
        this.repeat(event2, null, 1);
        event2.preventDefault();
      }
    },
    onUpButtonMouseUp() {
      if (!this.disabled) {
        this.clearTimer();
      }
    },
    onUpButtonMouseLeave() {
      if (!this.disabled) {
        this.clearTimer();
      }
    },
    onUpButtonKeyUp() {
      if (!this.disabled) {
        this.clearTimer();
      }
    },
    onUpButtonKeyDown(event2) {
      if (event2.keyCode === 32 || event2.keyCode === 13) {
        this.repeat(event2, null, 1);
      }
    },
    onDownButtonMouseDown(event2) {
      if (!this.disabled) {
        this.$refs.input.$el.focus();
        this.repeat(event2, null, -1);
        event2.preventDefault();
      }
    },
    onDownButtonMouseUp() {
      if (!this.disabled) {
        this.clearTimer();
      }
    },
    onDownButtonMouseLeave() {
      if (!this.disabled) {
        this.clearTimer();
      }
    },
    onDownButtonKeyUp() {
      if (!this.disabled) {
        this.clearTimer();
      }
    },
    onDownButtonKeyDown(event2) {
      if (event2.keyCode === 32 || event2.keyCode === 13) {
        this.repeat(event2, null, -1);
      }
    },
    onUserInput() {
      if (this.isSpecialChar) {
        this.$refs.input.$el.value = this.lastValue;
      }
      this.isSpecialChar = false;
    },
    onInputKeyDown(event2) {
      if (this.readonly) {
        return;
      }
      this.lastValue = event2.target.value;
      if (event2.shiftKey || event2.altKey) {
        this.isSpecialChar = true;
        return;
      }
      let selectionStart = event2.target.selectionStart;
      let selectionEnd = event2.target.selectionEnd;
      let inputValue = event2.target.value;
      let newValueStr = null;
      if (event2.altKey) {
        event2.preventDefault();
      }
      switch (event2.code) {
        case "ArrowUp":
          this.spin(event2, 1);
          event2.preventDefault();
          break;
        case "ArrowDown":
          this.spin(event2, -1);
          event2.preventDefault();
          break;
        case "ArrowLeft":
          if (!this.isNumeralChar(inputValue.charAt(selectionStart - 1))) {
            event2.preventDefault();
          }
          break;
        case "ArrowRight":
          if (!this.isNumeralChar(inputValue.charAt(selectionStart))) {
            event2.preventDefault();
          }
          break;
        case "Tab":
        case "Enter":
          newValueStr = this.validateValue(this.parseValue(inputValue));
          this.$refs.input.$el.value = this.formatValue(newValueStr);
          this.$refs.input.$el.setAttribute("aria-valuenow", newValueStr);
          this.updateModel(event2, newValueStr);
          break;
        case "Backspace": {
          event2.preventDefault();
          if (selectionStart === selectionEnd) {
            const deleteChar = inputValue.charAt(selectionStart - 1);
            const { decimalCharIndex, decimalCharIndexWithoutPrefix } = this.getDecimalCharIndexes(inputValue);
            if (this.isNumeralChar(deleteChar)) {
              const decimalLength = this.getDecimalLength(inputValue);
              if (this._group.test(deleteChar)) {
                this._group.lastIndex = 0;
                newValueStr = inputValue.slice(0, selectionStart - 2) + inputValue.slice(selectionStart - 1);
              } else if (this._decimal.test(deleteChar)) {
                this._decimal.lastIndex = 0;
                if (decimalLength) {
                  this.$refs.input.$el.setSelectionRange(selectionStart - 1, selectionStart - 1);
                } else {
                  newValueStr = inputValue.slice(0, selectionStart - 1) + inputValue.slice(selectionStart);
                }
              } else if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
                const insertedText = this.isDecimalMode() && (this.minFractionDigits || 0) < decimalLength ? "" : "0";
                newValueStr = inputValue.slice(0, selectionStart - 1) + insertedText + inputValue.slice(selectionStart);
              } else if (decimalCharIndexWithoutPrefix === 1) {
                newValueStr = inputValue.slice(0, selectionStart - 1) + "0" + inputValue.slice(selectionStart);
                newValueStr = this.parseValue(newValueStr) > 0 ? newValueStr : "";
              } else {
                newValueStr = inputValue.slice(0, selectionStart - 1) + inputValue.slice(selectionStart);
              }
            }
            this.updateValue(event2, newValueStr, null, "delete-single");
          } else {
            newValueStr = this.deleteRange(inputValue, selectionStart, selectionEnd);
            this.updateValue(event2, newValueStr, null, "delete-range");
          }
          break;
        }
        case "Delete":
          event2.preventDefault();
          if (selectionStart === selectionEnd) {
            const deleteChar = inputValue.charAt(selectionStart);
            const { decimalCharIndex, decimalCharIndexWithoutPrefix } = this.getDecimalCharIndexes(inputValue);
            if (this.isNumeralChar(deleteChar)) {
              const decimalLength = this.getDecimalLength(inputValue);
              if (this._group.test(deleteChar)) {
                this._group.lastIndex = 0;
                newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 2);
              } else if (this._decimal.test(deleteChar)) {
                this._decimal.lastIndex = 0;
                if (decimalLength) {
                  this.$refs.input.$el.setSelectionRange(selectionStart + 1, selectionStart + 1);
                } else {
                  newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 1);
                }
              } else if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
                const insertedText = this.isDecimalMode() && (this.minFractionDigits || 0) < decimalLength ? "" : "0";
                newValueStr = inputValue.slice(0, selectionStart) + insertedText + inputValue.slice(selectionStart + 1);
              } else if (decimalCharIndexWithoutPrefix === 1) {
                newValueStr = inputValue.slice(0, selectionStart) + "0" + inputValue.slice(selectionStart + 1);
                newValueStr = this.parseValue(newValueStr) > 0 ? newValueStr : "";
              } else {
                newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 1);
              }
            }
            this.updateValue(event2, newValueStr, null, "delete-back-single");
          } else {
            newValueStr = this.deleteRange(inputValue, selectionStart, selectionEnd);
            this.updateValue(event2, newValueStr, null, "delete-range");
          }
          break;
        case "Home":
          if (this.min) {
            this.updateModel(event2, this.min);
            event2.preventDefault();
          }
          break;
        case "End":
          if (this.max) {
            this.updateModel(event2, this.max);
            event2.preventDefault();
          }
          break;
      }
    },
    onInputKeyPress(event2) {
      if (this.readonly) {
        return;
      }
      event2.preventDefault();
      let code = event2.which || event2.keyCode;
      let char = String.fromCharCode(code);
      const isDecimalSign = this.isDecimalSign(char);
      const isMinusSign = this.isMinusSign(char);
      if (48 <= code && code <= 57 || isMinusSign || isDecimalSign) {
        this.insert(event2, char, { isDecimalSign, isMinusSign });
      }
    },
    onPaste(event2) {
      event2.preventDefault();
      let data = (event2.clipboardData || window["clipboardData"]).getData("Text");
      if (data) {
        let filteredData = this.parseValue(data);
        if (filteredData != null) {
          this.insert(event2, filteredData.toString());
        }
      }
    },
    allowMinusSign() {
      return this.min === null || this.min < 0;
    },
    isMinusSign(char) {
      if (this._minusSign.test(char) || char === "-") {
        this._minusSign.lastIndex = 0;
        return true;
      }
      return false;
    },
    isDecimalSign(char) {
      if (this._decimal.test(char)) {
        this._decimal.lastIndex = 0;
        return true;
      }
      return false;
    },
    isDecimalMode() {
      return this.mode === "decimal";
    },
    getDecimalCharIndexes(val) {
      let decimalCharIndex = val.search(this._decimal);
      this._decimal.lastIndex = 0;
      const filteredVal = val.replace(this._prefix, "").trim().replace(/\s/g, "").replace(this._currency, "");
      const decimalCharIndexWithoutPrefix = filteredVal.search(this._decimal);
      this._decimal.lastIndex = 0;
      return { decimalCharIndex, decimalCharIndexWithoutPrefix };
    },
    getCharIndexes(val) {
      const decimalCharIndex = val.search(this._decimal);
      this._decimal.lastIndex = 0;
      const minusCharIndex = val.search(this._minusSign);
      this._minusSign.lastIndex = 0;
      const suffixCharIndex = val.search(this._suffix);
      this._suffix.lastIndex = 0;
      const currencyCharIndex = val.search(this._currency);
      this._currency.lastIndex = 0;
      return { decimalCharIndex, minusCharIndex, suffixCharIndex, currencyCharIndex };
    },
    insert(event2, text, sign = { isDecimalSign: false, isMinusSign: false }) {
      const minusCharIndexOnText = text.search(this._minusSign);
      this._minusSign.lastIndex = 0;
      if (!this.allowMinusSign() && minusCharIndexOnText !== -1) {
        return;
      }
      const selectionStart = this.$refs.input.$el.selectionStart;
      const selectionEnd = this.$refs.input.$el.selectionEnd;
      let inputValue = this.$refs.input.$el.value.trim();
      const { decimalCharIndex, minusCharIndex, suffixCharIndex, currencyCharIndex } = this.getCharIndexes(inputValue);
      let newValueStr;
      if (sign.isMinusSign) {
        if (selectionStart === 0) {
          newValueStr = inputValue;
          if (minusCharIndex === -1 || selectionEnd !== 0) {
            newValueStr = this.insertText(inputValue, text, 0, selectionEnd);
          }
          this.updateValue(event2, newValueStr, text, "insert");
        }
      } else if (sign.isDecimalSign) {
        if (decimalCharIndex > 0 && selectionStart === decimalCharIndex) {
          this.updateValue(event2, inputValue, text, "insert");
        } else if (decimalCharIndex > selectionStart && decimalCharIndex < selectionEnd) {
          newValueStr = this.insertText(inputValue, text, selectionStart, selectionEnd);
          this.updateValue(event2, newValueStr, text, "insert");
        } else if (decimalCharIndex === -1 && this.maxFractionDigits) {
          newValueStr = this.insertText(inputValue, text, selectionStart, selectionEnd);
          this.updateValue(event2, newValueStr, text, "insert");
        }
      } else {
        const maxFractionDigits = this.numberFormat.resolvedOptions().maximumFractionDigits;
        const operation = selectionStart !== selectionEnd ? "range-insert" : "insert";
        if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
          if (selectionStart + text.length - (decimalCharIndex + 1) <= maxFractionDigits) {
            const charIndex = currencyCharIndex >= selectionStart ? currencyCharIndex - 1 : suffixCharIndex >= selectionStart ? suffixCharIndex : inputValue.length;
            newValueStr = inputValue.slice(0, selectionStart) + text + inputValue.slice(selectionStart + text.length, charIndex) + inputValue.slice(charIndex);
            this.updateValue(event2, newValueStr, text, operation);
          }
        } else {
          newValueStr = this.insertText(inputValue, text, selectionStart, selectionEnd);
          this.updateValue(event2, newValueStr, text, operation);
        }
      }
    },
    insertText(value, text, start, end) {
      let textSplit = text === "." ? text : text.split(".");
      if (textSplit.length === 2) {
        const decimalCharIndex = value.slice(start, end).search(this._decimal);
        this._decimal.lastIndex = 0;
        return decimalCharIndex > 0 ? value.slice(0, start) + this.formatValue(text) + value.slice(end) : value || this.formatValue(text);
      } else if (end - start === value.length) {
        return this.formatValue(text);
      } else if (start === 0) {
        return text + value.slice(end);
      } else if (end === value.length) {
        return value.slice(0, start) + text;
      } else {
        return value.slice(0, start) + text + value.slice(end);
      }
    },
    deleteRange(value, start, end) {
      let newValueStr;
      if (end - start === value.length)
        newValueStr = "";
      else if (start === 0)
        newValueStr = value.slice(end);
      else if (end === value.length)
        newValueStr = value.slice(0, start);
      else
        newValueStr = value.slice(0, start) + value.slice(end);
      return newValueStr;
    },
    initCursor() {
      let selectionStart = this.$refs.input.$el.selectionStart;
      let inputValue = this.$refs.input.$el.value;
      let valueLength = inputValue.length;
      let index = null;
      let prefixLength = (this.prefixChar || "").length;
      inputValue = inputValue.replace(this._prefix, "");
      selectionStart = selectionStart - prefixLength;
      let char = inputValue.charAt(selectionStart);
      if (this.isNumeralChar(char)) {
        return selectionStart + prefixLength;
      }
      let i = selectionStart - 1;
      while (i >= 0) {
        char = inputValue.charAt(i);
        if (this.isNumeralChar(char)) {
          index = i + prefixLength;
          break;
        } else {
          i--;
        }
      }
      if (index !== null) {
        this.$refs.input.$el.setSelectionRange(index + 1, index + 1);
      } else {
        i = selectionStart;
        while (i < valueLength) {
          char = inputValue.charAt(i);
          if (this.isNumeralChar(char)) {
            index = i + prefixLength;
            break;
          } else {
            i++;
          }
        }
        if (index !== null) {
          this.$refs.input.$el.setSelectionRange(index, index);
        }
      }
      return index || 0;
    },
    onInputClick() {
      const currentValue = this.$refs.input.$el.value;
      if (!this.readonly && currentValue !== DomHandler.getSelection()) {
        this.initCursor();
      }
    },
    isNumeralChar(char) {
      if (char.length === 1 && (this._numeral.test(char) || this._decimal.test(char) || this._group.test(char) || this._minusSign.test(char))) {
        this.resetRegex();
        return true;
      }
      return false;
    },
    resetRegex() {
      this._numeral.lastIndex = 0;
      this._decimal.lastIndex = 0;
      this._group.lastIndex = 0;
      this._minusSign.lastIndex = 0;
    },
    updateValue(event2, valueStr, insertedValueStr, operation) {
      let currentValue = this.$refs.input.$el.value;
      let newValue = null;
      if (valueStr != null) {
        newValue = this.parseValue(valueStr);
        newValue = !newValue && !this.allowEmpty ? 0 : newValue;
        this.updateInput(newValue, insertedValueStr, operation, valueStr);
        this.handleOnInput(event2, currentValue, newValue);
      }
    },
    handleOnInput(event2, currentValue, newValue) {
      if (this.isValueChanged(currentValue, newValue)) {
        this.$emit("input", { originalEvent: event2, value: newValue, formattedValue: currentValue });
      }
    },
    isValueChanged(currentValue, newValue) {
      if (newValue === null && currentValue !== null) {
        return true;
      }
      if (newValue != null) {
        let parsedCurrentValue = typeof currentValue === "string" ? this.parseValue(currentValue) : currentValue;
        return newValue !== parsedCurrentValue;
      }
      return false;
    },
    validateValue(value) {
      if (value === "-" || value == null) {
        return null;
      }
      if (this.min != null && value < this.min) {
        return this.min;
      }
      if (this.max != null && value > this.max) {
        return this.max;
      }
      return value;
    },
    updateInput(value, insertedValueStr, operation, valueStr) {
      insertedValueStr = insertedValueStr || "";
      let inputValue = this.$refs.input.$el.value;
      let newValue = this.formatValue(value);
      let currentLength = inputValue.length;
      if (newValue !== valueStr) {
        newValue = this.concatValues(newValue, valueStr);
      }
      if (currentLength === 0) {
        this.$refs.input.$el.value = newValue;
        this.$refs.input.$el.setSelectionRange(0, 0);
        const index = this.initCursor();
        const selectionEnd = index + insertedValueStr.length;
        this.$refs.input.$el.setSelectionRange(selectionEnd, selectionEnd);
      } else {
        let selectionStart = this.$refs.input.$el.selectionStart;
        let selectionEnd = this.$refs.input.$el.selectionEnd;
        this.$refs.input.$el.value = newValue;
        let newLength = newValue.length;
        if (operation === "range-insert") {
          const startValue = this.parseValue((inputValue || "").slice(0, selectionStart));
          const startValueStr = startValue !== null ? startValue.toString() : "";
          const startExpr = startValueStr.split("").join(`(${this.groupChar})?`);
          const sRegex = new RegExp(startExpr, "g");
          sRegex.test(newValue);
          const tExpr = insertedValueStr.split("").join(`(${this.groupChar})?`);
          const tRegex = new RegExp(tExpr, "g");
          tRegex.test(newValue.slice(sRegex.lastIndex));
          selectionEnd = sRegex.lastIndex + tRegex.lastIndex;
          this.$refs.input.$el.setSelectionRange(selectionEnd, selectionEnd);
        } else if (newLength === currentLength) {
          if (operation === "insert" || operation === "delete-back-single")
            this.$refs.input.$el.setSelectionRange(selectionEnd + 1, selectionEnd + 1);
          else if (operation === "delete-single")
            this.$refs.input.$el.setSelectionRange(selectionEnd - 1, selectionEnd - 1);
          else if (operation === "delete-range" || operation === "spin")
            this.$refs.input.$el.setSelectionRange(selectionEnd, selectionEnd);
        } else if (operation === "delete-back-single") {
          let prevChar = inputValue.charAt(selectionEnd - 1);
          let nextChar = inputValue.charAt(selectionEnd);
          let diff = currentLength - newLength;
          let isGroupChar = this._group.test(nextChar);
          if (isGroupChar && diff === 1) {
            selectionEnd += 1;
          } else if (!isGroupChar && this.isNumeralChar(prevChar)) {
            selectionEnd += -1 * diff + 1;
          }
          this._group.lastIndex = 0;
          this.$refs.input.$el.setSelectionRange(selectionEnd, selectionEnd);
        } else if (inputValue === "-" && operation === "insert") {
          this.$refs.input.$el.setSelectionRange(0, 0);
          const index = this.initCursor();
          const selectionEnd2 = index + insertedValueStr.length + 1;
          this.$refs.input.$el.setSelectionRange(selectionEnd2, selectionEnd2);
        } else {
          selectionEnd = selectionEnd + (newLength - currentLength);
          this.$refs.input.$el.setSelectionRange(selectionEnd, selectionEnd);
        }
      }
      this.$refs.input.$el.setAttribute("aria-valuenow", value);
    },
    concatValues(val1, val2) {
      if (val1 && val2) {
        let decimalCharIndex = val2.search(this._decimal);
        this._decimal.lastIndex = 0;
        if (this.suffixChar) {
          return val1.replace(this.suffixChar, "").split(this._decimal)[0] + val2.replace(this.suffixChar, "").slice(decimalCharIndex) + this.suffixChar;
        } else {
          return decimalCharIndex !== -1 ? val1.split(this._decimal)[0] + val2.slice(decimalCharIndex) : val1;
        }
      }
      return val1;
    },
    getDecimalLength(value) {
      if (value) {
        const valueSplit = value.split(this._decimal);
        if (valueSplit.length === 2) {
          return valueSplit[1].replace(this._suffix, "").trim().replace(/\s/g, "").replace(this._currency, "").length;
        }
      }
      return 0;
    },
    updateModel(event2, value) {
      this.d_modelValue = value;
      this.$emit("update:modelValue", value);
    },
    onInputFocus(event2) {
      this.focused = true;
      if (!this.disabled && !this.readonly && this.$refs.input.$el.value !== DomHandler.getSelection() && this.highlightOnFocus) {
        event2.target.select();
      }
      this.$emit("focus", event2);
    },
    onInputBlur(event2) {
      this.focused = false;
      let input = event2.target;
      let newValue = this.validateValue(this.parseValue(input.value));
      this.$emit("blur", { originalEvent: event2, value: input.value });
      input.value = this.formatValue(newValue);
      input.setAttribute("aria-valuenow", newValue);
      this.updateModel(event2, newValue);
    },
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
    maxBoundry() {
      return this.d_modelValue >= this.max;
    },
    minBoundry() {
      return this.d_modelValue <= this.min;
    }
  },
  computed: {
    containerClass() {
      return [
        "p-inputnumber p-component p-inputwrapper",
        {
          "p-inputwrapper-filled": this.filled,
          "p-inputwrapper-focus": this.focused,
          "p-inputnumber-buttons-stacked": this.showButtons && this.buttonLayout === "stacked",
          "p-inputnumber-buttons-horizontal": this.showButtons && this.buttonLayout === "horizontal",
          "p-inputnumber-buttons-vertical": this.showButtons && this.buttonLayout === "vertical"
        }
      ];
    },
    upButtonClass() {
      return [
        "p-inputnumber-button p-inputnumber-button-up",
        this.incrementButtonClass,
        {
          "p-disabled": this.showButtons && this.max !== null && this.maxBoundry()
        }
      ];
    },
    downButtonClass() {
      return [
        "p-inputnumber-button p-inputnumber-button-down",
        this.decrementButtonClass,
        {
          "p-disabled": this.showButtons && this.min !== null && this.minBoundry()
        }
      ];
    },
    filled() {
      return this.modelValue != null && this.modelValue.toString().length > 0;
    },
    upButtonListeners() {
      return {
        mousedown: (event2) => this.onUpButtonMouseDown(event2),
        mouseup: (event2) => this.onUpButtonMouseUp(event2),
        mouseleave: (event2) => this.onUpButtonMouseLeave(event2),
        keydown: (event2) => this.onUpButtonKeyDown(event2),
        keyup: (event2) => this.onUpButtonKeyUp(event2)
      };
    },
    downButtonListeners() {
      return {
        mousedown: (event2) => this.onDownButtonMouseDown(event2),
        mouseup: (event2) => this.onDownButtonMouseUp(event2),
        mouseleave: (event2) => this.onDownButtonMouseLeave(event2),
        keydown: (event2) => this.onDownButtonKeyDown(event2),
        keyup: (event2) => this.onDownButtonKeyUp(event2)
      };
    },
    formattedValue() {
      const val = !this.modelValue && !this.allowEmpty ? 0 : this.modelValue;
      return this.formatValue(val);
    },
    getFormatter() {
      return this.numberFormat;
    }
  },
  components: {
    INInputText: script$e,
    INButton: script$i
  }
};
const _hoisted_1$d = {
  key: 0,
  class: "p-inputnumber-button-group"
};
function render$d(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_INInputText = resolveComponent("INInputText");
  const _component_INButton = resolveComponent("INButton");
  return openBlock(), createElementBlock("span", {
    class: normalizeClass($options.containerClass)
  }, [
    createVNode(_component_INInputText, mergeProps({
      ref: "input",
      id: $props.inputId,
      class: ["p-inputnumber-input", $props.inputClass],
      role: "spinbutton",
      style: $props.inputStyle,
      value: $options.formattedValue,
      "aria-valuemin": $props.min,
      "aria-valuemax": $props.max,
      "aria-valuenow": $props.modelValue,
      disabled: $props.disabled,
      readonly: $props.readonly,
      placeholder: $props.placeholder,
      "aria-labelledby": _ctx.ariaLabelledby,
      "aria-label": _ctx.ariaLabel,
      onInput: $options.onUserInput,
      onKeydown: $options.onInputKeyDown,
      onKeypress: $options.onInputKeyPress,
      onPaste: $options.onPaste,
      onClick: $options.onInputClick,
      onFocus: $options.onInputFocus,
      onBlur: $options.onInputBlur
    }, $props.inputProps), null, 16, ["id", "class", "style", "value", "aria-valuemin", "aria-valuemax", "aria-valuenow", "disabled", "readonly", "placeholder", "aria-labelledby", "aria-label", "onInput", "onKeydown", "onKeypress", "onPaste", "onClick", "onFocus", "onBlur"]),
    $props.showButtons && $props.buttonLayout === "stacked" ? (openBlock(), createElementBlock("span", _hoisted_1$d, [
      createVNode(_component_INButton, mergeProps({
        class: $options.upButtonClass,
        icon: $props.incrementButtonIcon
      }, toHandlers($options.upButtonListeners), {
        disabled: $props.disabled,
        tabindex: -1,
        "aria-hidden": "true"
      }, $props.incrementButtonProps), null, 16, ["class", "icon", "disabled"]),
      createVNode(_component_INButton, mergeProps({
        class: $options.downButtonClass,
        icon: $props.decrementButtonIcon
      }, toHandlers($options.downButtonListeners), {
        disabled: $props.disabled,
        tabindex: -1,
        "aria-hidden": "true"
      }, $props.decrementButtonProps), null, 16, ["class", "icon", "disabled"])
    ])) : createCommentVNode("", true),
    $props.showButtons && $props.buttonLayout !== "stacked" ? (openBlock(), createBlock(_component_INButton, mergeProps({
      key: 1,
      class: $options.upButtonClass,
      icon: $props.incrementButtonIcon
    }, toHandlers($options.upButtonListeners), {
      disabled: $props.disabled,
      tabindex: -1,
      "aria-hidden": "true"
    }, $props.incrementButtonProps), null, 16, ["class", "icon", "disabled"])) : createCommentVNode("", true),
    $props.showButtons && $props.buttonLayout !== "stacked" ? (openBlock(), createBlock(_component_INButton, mergeProps({
      key: 2,
      class: $options.downButtonClass,
      icon: $props.decrementButtonIcon
    }, toHandlers($options.downButtonListeners), {
      disabled: $props.disabled,
      tabindex: -1,
      "aria-hidden": "true"
    }, $props.decrementButtonProps), null, 16, ["class", "icon", "disabled"])) : createCommentVNode("", true)
  ], 2);
}
function styleInject$6(css, ref2) {
  if (ref2 === void 0)
    ref2 = {};
  var insertAt = ref2.insertAt;
  if (!css || true) {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
var css_248z$6 = "\n.p-inputnumber {\n    display: inline-flex;\n}\n.p-inputnumber-button {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    flex: 0 0 auto;\n}\n.p-inputnumber-buttons-stacked .p-button.p-inputnumber-button .p-button-label,\n.p-inputnumber-buttons-horizontal .p-button.p-inputnumber-button .p-button-label {\n    display: none;\n}\n.p-inputnumber-buttons-stacked .p-button.p-inputnumber-button-up {\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n    border-bottom-right-radius: 0;\n    padding: 0;\n}\n.p-inputnumber-buttons-stacked .p-inputnumber-input {\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n}\n.p-inputnumber-buttons-stacked .p-button.p-inputnumber-button-down {\n    border-top-left-radius: 0;\n    border-top-right-radius: 0;\n    border-bottom-left-radius: 0;\n    padding: 0;\n}\n.p-inputnumber-buttons-stacked .p-inputnumber-button-group {\n    display: flex;\n    flex-direction: column;\n}\n.p-inputnumber-buttons-stacked .p-inputnumber-button-group .p-button.p-inputnumber-button {\n    flex: 1 1 auto;\n}\n.p-inputnumber-buttons-horizontal .p-button.p-inputnumber-button-up {\n    order: 3;\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n}\n.p-inputnumber-buttons-horizontal .p-inputnumber-input {\n    order: 2;\n    border-radius: 0;\n}\n.p-inputnumber-buttons-horizontal .p-button.p-inputnumber-button-down {\n    order: 1;\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n}\n.p-inputnumber-buttons-vertical {\n    flex-direction: column;\n}\n.p-inputnumber-buttons-vertical .p-button.p-inputnumber-button-up {\n    order: 1;\n    border-bottom-left-radius: 0;\n    border-bottom-right-radius: 0;\n    width: 100%;\n}\n.p-inputnumber-buttons-vertical .p-inputnumber-input {\n    order: 2;\n    border-radius: 0;\n    text-align: center;\n}\n.p-inputnumber-buttons-vertical .p-button.p-inputnumber-button-down {\n    order: 3;\n    border-top-left-radius: 0;\n    border-top-right-radius: 0;\n    width: 100%;\n}\n.p-inputnumber-input {\n    flex: 1 1 auto;\n}\n.p-fluid .p-inputnumber {\n    width: 100%;\n}\n.p-fluid .p-inputnumber .p-inputnumber-input {\n    width: 1%;\n}\n.p-fluid .p-inputnumber-buttons-vertical .p-inputnumber-input {\n    width: 100%;\n}\n";
styleInject$6(css_248z$6);
script$d.render = render$d;
var script$9$1 = {
  name: "CurrentPageReport",
  props: {
    pageCount: {
      type: Number,
      default: 0
    },
    currentPage: {
      type: Number,
      default: 0
    },
    page: {
      type: Number,
      default: 0
    },
    first: {
      type: Number,
      default: 0
    },
    rows: {
      type: Number,
      default: 0
    },
    totalRecords: {
      type: Number,
      default: 0
    },
    template: {
      type: String,
      default: "({currentPage} of {totalPages})"
    }
  },
  computed: {
    text() {
      let text = this.template.replace("{currentPage}", this.currentPage).replace("{totalPages}", this.pageCount).replace("{first}", this.pageCount > 0 ? this.first + 1 : 0).replace("{last}", Math.min(this.first + this.rows, this.totalRecords)).replace("{rows}", this.rows).replace("{totalRecords}", this.totalRecords);
      return text;
    }
  }
};
const _hoisted_1$6$1 = { class: "p-paginator-current" };
function render$9$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", _hoisted_1$6$1, toDisplayString($options.text), 1);
}
script$9$1.render = render$9$1;
var script$8$1 = {
  name: "FirstPageLink",
  computed: {
    containerClass() {
      return [
        "p-paginator-first p-paginator-element p-link",
        {
          "p-disabled": this.$attrs.disabled
        }
      ];
    }
  },
  directives: {
    ripple: Ripple
  }
};
const _hoisted_1$5$1 = /* @__PURE__ */ createElementVNode("span", { class: "p-paginator-icon pi pi-angle-double-left" }, null, -1);
const _hoisted_2$5$1 = [
  _hoisted_1$5$1
];
function render$8$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_ripple = resolveDirective("ripple");
  return withDirectives((openBlock(), createElementBlock("button", {
    class: normalizeClass($options.containerClass),
    type: "button"
  }, _hoisted_2$5$1, 2)), [
    [_directive_ripple]
  ]);
}
script$8$1.render = render$8$1;
var script$7$1 = {
  name: "JumpToPageDropdown",
  emits: ["page-change"],
  props: {
    page: Number,
    pageCount: Number,
    disabled: Boolean
  },
  methods: {
    onChange(value) {
      this.$emit("page-change", value);
    }
  },
  computed: {
    pageOptions() {
      let opts = [];
      for (let i = 0; i < this.pageCount; i++) {
        opts.push({ label: String(i + 1), value: i });
      }
      return opts;
    }
  },
  components: {
    JTPDropdown: script$f
  }
};
function render$7$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_JTPDropdown = resolveComponent("JTPDropdown");
  return openBlock(), createBlock(_component_JTPDropdown, {
    modelValue: $props.page,
    options: $options.pageOptions,
    optionLabel: "label",
    optionValue: "value",
    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $options.onChange($event)),
    class: "p-paginator-page-options",
    disabled: $props.disabled
  }, null, 8, ["modelValue", "options", "disabled"]);
}
script$7$1.render = render$7$1;
var script$6$1 = {
  name: "JumpToPageInput",
  inheritAttrs: false,
  emits: ["page-change"],
  props: {
    page: Number,
    pageCount: Number,
    disabled: Boolean
  },
  data() {
    return {
      d_page: this.page
    };
  },
  watch: {
    page(newValue) {
      this.d_page = newValue;
    }
  },
  methods: {
    onChange(value) {
      if (value !== this.page) {
        this.d_page = value;
        this.$emit("page-change", value - 1);
      }
    }
  },
  computed: {
    inputArialabel() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.jumpToPageInputLabel : void 0;
    }
  },
  components: {
    JTPInput: script$d
  }
};
function render$6$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_JTPInput = resolveComponent("JTPInput");
  return openBlock(), createBlock(_component_JTPInput, {
    ref: "jtpInput",
    modelValue: $data.d_page,
    class: "p-paginator-page-input",
    "aria-label": $options.inputArialabel,
    disabled: $props.disabled,
    "onUpdate:modelValue": $options.onChange
  }, null, 8, ["modelValue", "aria-label", "disabled", "onUpdate:modelValue"]);
}
script$6$1.render = render$6$1;
var script$5$1 = {
  name: "LastPageLink",
  computed: {
    containerClass() {
      return [
        "p-paginator-last p-paginator-element p-link",
        {
          "p-disabled": this.$attrs.disabled
        }
      ];
    }
  },
  directives: {
    ripple: Ripple
  }
};
const _hoisted_1$4$1 = /* @__PURE__ */ createElementVNode("span", { class: "p-paginator-icon pi pi-angle-double-right" }, null, -1);
const _hoisted_2$4$1 = [
  _hoisted_1$4$1
];
function render$5$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_ripple = resolveDirective("ripple");
  return withDirectives((openBlock(), createElementBlock("button", {
    class: normalizeClass($options.containerClass),
    type: "button"
  }, _hoisted_2$4$1, 2)), [
    [_directive_ripple]
  ]);
}
script$5$1.render = render$5$1;
var script$4$2 = {
  name: "NextPageLink",
  computed: {
    containerClass() {
      return [
        "p-paginator-next p-paginator-element p-link",
        {
          "p-disabled": this.$attrs.disabled
        }
      ];
    }
  },
  directives: {
    ripple: Ripple
  }
};
const _hoisted_1$3$2 = /* @__PURE__ */ createElementVNode("span", { class: "p-paginator-icon pi pi-angle-right" }, null, -1);
const _hoisted_2$3$2 = [
  _hoisted_1$3$2
];
function render$4$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_ripple = resolveDirective("ripple");
  return withDirectives((openBlock(), createElementBlock("button", {
    class: normalizeClass($options.containerClass),
    type: "button"
  }, _hoisted_2$3$2, 2)), [
    [_directive_ripple]
  ]);
}
script$4$2.render = render$4$1;
var script$3$2 = {
  name: "PageLinks",
  inheritAttrs: false,
  emits: ["click"],
  props: {
    value: Array,
    page: Number
  },
  methods: {
    onPageLinkClick(event2, pageLink) {
      this.$emit("click", {
        originalEvent: event2,
        value: pageLink
      });
    },
    ariaPageLabel(value) {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.pageLabel.replace(/{page}/g, value) : void 0;
    }
  },
  computed: {},
  directives: {
    ripple: Ripple
  }
};
const _hoisted_1$2$2 = { class: "p-paginator-pages" };
const _hoisted_2$2$2 = ["aria-label", "aria-current", "onClick"];
function render$3$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_ripple = resolveDirective("ripple");
  return openBlock(), createElementBlock("span", _hoisted_1$2$2, [
    (openBlock(true), createElementBlock(Fragment$1, null, renderList($props.value, (pageLink) => {
      return withDirectives((openBlock(), createElementBlock("button", {
        key: pageLink,
        class: normalizeClass(["p-paginator-page p-paginator-element p-link", { "p-highlight": pageLink - 1 === $props.page }]),
        type: "button",
        "aria-label": $options.ariaPageLabel(pageLink),
        "aria-current": pageLink - 1 === $props.page ? "page" : void 0,
        onClick: ($event) => $options.onPageLinkClick($event, pageLink)
      }, [
        createTextVNode(toDisplayString(pageLink), 1)
      ], 10, _hoisted_2$2$2)), [
        [_directive_ripple]
      ]);
    }), 128))
  ]);
}
script$3$2.render = render$3$2;
var script$2$2 = {
  name: "PrevPageLink",
  computed: {
    containerClass() {
      return [
        "p-paginator-prev p-paginator-element p-link",
        {
          "p-disabled": this.$attrs.disabled
        }
      ];
    }
  },
  directives: {
    ripple: Ripple
  }
};
const _hoisted_1$1$4 = /* @__PURE__ */ createElementVNode("span", { class: "p-paginator-icon pi pi-angle-left" }, null, -1);
const _hoisted_2$1$4 = [
  _hoisted_1$1$4
];
function render$2$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_ripple = resolveDirective("ripple");
  return withDirectives((openBlock(), createElementBlock("button", {
    class: normalizeClass($options.containerClass),
    type: "button"
  }, _hoisted_2$1$4, 2)), [
    [_directive_ripple]
  ]);
}
script$2$2.render = render$2$2;
var script$1$4 = {
  name: "RowsPerPageDropdown",
  emits: ["rows-change"],
  props: {
    options: Array,
    rows: Number,
    disabled: Boolean
  },
  methods: {
    onChange(value) {
      this.$emit("rows-change", value);
    }
  },
  computed: {
    rowsOptions() {
      let opts = [];
      if (this.options) {
        for (let i = 0; i < this.options.length; i++) {
          opts.push({ label: String(this.options[i]), value: this.options[i] });
        }
      }
      return opts;
    }
  },
  components: {
    RPPDropdown: script$f
  }
};
function render$1$4(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_RPPDropdown = resolveComponent("RPPDropdown");
  return openBlock(), createBlock(_component_RPPDropdown, {
    modelValue: $props.rows,
    options: $options.rowsOptions,
    optionLabel: "label",
    optionValue: "value",
    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $options.onChange($event)),
    class: "p-paginator-rpp-options",
    disabled: $props.disabled
  }, null, 8, ["modelValue", "options", "disabled"]);
}
script$1$4.render = render$1$4;
var script$c = {
  name: "Paginator",
  emits: ["update:first", "update:rows", "page"],
  props: {
    totalRecords: {
      type: Number,
      default: 0
    },
    rows: {
      type: Number,
      default: 0
    },
    first: {
      type: Number,
      default: 0
    },
    pageLinkSize: {
      type: Number,
      default: 5
    },
    rowsPerPageOptions: {
      type: Array,
      default: null
    },
    template: {
      type: [Object, String],
      default: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
    },
    currentPageReportTemplate: {
      type: null,
      default: "({currentPage} of {totalPages})"
    },
    alwaysShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      d_first: this.first,
      d_rows: this.rows
    };
  },
  watch: {
    first(newValue) {
      this.d_first = newValue;
    },
    rows(newValue) {
      this.d_rows = newValue;
    },
    totalRecords(newValue) {
      if (this.page > 0 && newValue && this.d_first >= newValue) {
        this.changePage(this.pageCount - 1);
      }
    }
  },
  mounted() {
    this.setPaginatorAttribute();
    this.createStyle();
  },
  methods: {
    changePage(p) {
      const pc = this.pageCount;
      if (p >= 0 && p < pc) {
        this.d_first = this.d_rows * p;
        const state = {
          page: p,
          first: this.d_first,
          rows: this.d_rows,
          pageCount: pc
        };
        this.$emit("update:first", this.d_first);
        this.$emit("update:rows", this.d_rows);
        this.$emit("page", state);
      }
    },
    changePageToFirst(event2) {
      if (!this.isFirstPage) {
        this.changePage(0);
      }
      event2.preventDefault();
    },
    changePageToPrev(event2) {
      this.changePage(this.page - 1);
      event2.preventDefault();
    },
    changePageLink(event2) {
      this.changePage(event2.value - 1);
      event2.originalEvent.preventDefault();
    },
    changePageToNext(event2) {
      this.changePage(this.page + 1);
      event2.preventDefault();
    },
    changePageToLast(event2) {
      if (!this.isLastPage) {
        this.changePage(this.pageCount - 1);
      }
      event2.preventDefault();
    },
    onRowChange(value) {
      this.d_rows = value;
      this.changePage(this.page);
    },
    createStyle() {
      if (this.hasBreakpoints()) {
        this.styleElement = document.createElement("style");
        this.styleElement.type = "text/css";
        document.head.appendChild(this.styleElement);
        let innerHTML = "";
        const keys = Object.keys(this.template);
        const sortedBreakpoints = {};
        keys.sort((a, b) => parseInt(a) - parseInt(b)).forEach((key) => {
          sortedBreakpoints[key] = this.template[key];
        });
        for (const [index, [key]] of Object.entries(Object.entries(sortedBreakpoints))) {
          const minValue = Object.entries(sortedBreakpoints)[index - 1] ? `and (min-width:${Object.keys(sortedBreakpoints)[index - 1]})` : "";
          if (key === "default") {
            innerHTML += `
                            @media screen ${minValue} {
                                .paginator[${this.attributeSelector}],
                                .p-paginator-default{
                                    display: flex !important;
                                }
                            }
                        `;
          } else {
            innerHTML += `
                        .paginator[${this.attributeSelector}], .p-paginator-${key} {
                                display: none !important;
                            }
                        @media screen ${minValue} and (max-width: ${key}) {
                            .paginator[${this.attributeSelector}], .p-paginator-${key} {
                                display: flex !important;
                            }
                            .paginator[${this.attributeSelector}],
                            .p-paginator-default{
                                display: none !important;
                            }
                        }
                    `;
          }
        }
        this.styleElement.innerHTML = innerHTML;
      }
    },
    hasBreakpoints() {
      return typeof this.template === "object";
    },
    getPaginatorClasses(key) {
      return [
        {
          "p-paginator-default": !this.hasBreakpoints(),
          [`p-paginator-${key}`]: this.hasBreakpoints()
        }
      ];
    },
    setPaginatorAttribute() {
      if (this.$refs.paginator && this.$refs.paginator.length >= 0) {
        [...this.$refs.paginator].forEach((el) => {
          el.setAttribute(this.attributeSelector, "");
        });
      }
    },
    getAriaLabel(labelType) {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria[labelType] : void 0;
    }
  },
  computed: {
    templateItems() {
      let keys = {};
      if (this.hasBreakpoints()) {
        keys = this.template;
        if (!keys.default) {
          keys.default = "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown";
        }
        for (const item in keys) {
          keys[item] = this.template[item].split(" ").map((value) => {
            return value.trim();
          });
        }
        return keys;
      }
      keys["default"] = this.template.split(" ").map((value) => {
        return value.trim();
      });
      return keys;
    },
    page() {
      return Math.floor(this.d_first / this.d_rows);
    },
    pageCount() {
      return Math.ceil(this.totalRecords / this.d_rows);
    },
    isFirstPage() {
      return this.page === 0;
    },
    isLastPage() {
      return this.page === this.pageCount - 1;
    },
    calculatePageLinkBoundaries() {
      const numberOfPages = this.pageCount;
      const visiblePages = Math.min(this.pageLinkSize, numberOfPages);
      let start = Math.max(0, Math.ceil(this.page - visiblePages / 2));
      let end = Math.min(numberOfPages - 1, start + visiblePages - 1);
      const delta = this.pageLinkSize - (end - start + 1);
      start = Math.max(0, start - delta);
      return [start, end];
    },
    pageLinks() {
      let pageLinks = [];
      let boundaries = this.calculatePageLinkBoundaries;
      let start = boundaries[0];
      let end = boundaries[1];
      for (var i = start; i <= end; i++) {
        pageLinks.push(i + 1);
      }
      return pageLinks;
    },
    currentState() {
      return {
        page: this.page,
        first: this.d_first,
        rows: this.d_rows
      };
    },
    empty() {
      return this.pageCount === 0;
    },
    currentPage() {
      return this.pageCount > 0 ? this.page + 1 : 0;
    },
    attributeSelector() {
      return UniqueComponentId();
    }
  },
  components: {
    CurrentPageReport: script$9$1,
    FirstPageLink: script$8$1,
    LastPageLink: script$5$1,
    NextPageLink: script$4$2,
    PageLinks: script$3$2,
    PrevPageLink: script$2$2,
    RowsPerPageDropdown: script$1$4,
    JumpToPageDropdown: script$7$1,
    JumpToPageInput: script$6$1
  }
};
const _hoisted_1$c = { key: 0 };
const _hoisted_2$b = {
  key: 0,
  class: "p-paginator-left-content"
};
const _hoisted_3$8 = {
  key: 1,
  class: "p-paginator-right-content"
};
function render$c(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_FirstPageLink = resolveComponent("FirstPageLink");
  const _component_PrevPageLink = resolveComponent("PrevPageLink");
  const _component_NextPageLink = resolveComponent("NextPageLink");
  const _component_LastPageLink = resolveComponent("LastPageLink");
  const _component_PageLinks = resolveComponent("PageLinks");
  const _component_CurrentPageReport = resolveComponent("CurrentPageReport");
  const _component_RowsPerPageDropdown = resolveComponent("RowsPerPageDropdown");
  const _component_JumpToPageDropdown = resolveComponent("JumpToPageDropdown");
  const _component_JumpToPageInput = resolveComponent("JumpToPageInput");
  return ($props.alwaysShow ? true : $options.pageLinks && $options.pageLinks.length > 1) ? (openBlock(), createElementBlock("nav", _hoisted_1$c, [
    (openBlock(true), createElementBlock(Fragment$1, null, renderList($options.templateItems, (value, key) => {
      return openBlock(), createElementBlock("div", {
        key,
        ref_for: true,
        ref: "paginator",
        class: normalizeClass(["p-paginator p-component", $options.getPaginatorClasses(key)])
      }, [
        _ctx.$slots.start ? (openBlock(), createElementBlock("div", _hoisted_2$b, [
          renderSlot(_ctx.$slots, "start", { state: $options.currentState })
        ])) : createCommentVNode("", true),
        (openBlock(true), createElementBlock(Fragment$1, null, renderList(value, (item) => {
          return openBlock(), createElementBlock(Fragment$1, { key: item }, [
            item === "FirstPageLink" ? (openBlock(), createBlock(_component_FirstPageLink, {
              key: 0,
              "aria-label": $options.getAriaLabel("firstPageLabel"),
              onClick: _cache[0] || (_cache[0] = ($event) => $options.changePageToFirst($event)),
              disabled: $options.isFirstPage || $options.empty
            }, null, 8, ["aria-label", "disabled"])) : item === "PrevPageLink" ? (openBlock(), createBlock(_component_PrevPageLink, {
              key: 1,
              "aria-label": $options.getAriaLabel("prevPageLabel"),
              onClick: _cache[1] || (_cache[1] = ($event) => $options.changePageToPrev($event)),
              disabled: $options.isFirstPage || $options.empty
            }, null, 8, ["aria-label", "disabled"])) : item === "NextPageLink" ? (openBlock(), createBlock(_component_NextPageLink, {
              key: 2,
              "aria-label": $options.getAriaLabel("nextPageLabel"),
              onClick: _cache[2] || (_cache[2] = ($event) => $options.changePageToNext($event)),
              disabled: $options.isLastPage || $options.empty
            }, null, 8, ["aria-label", "disabled"])) : item === "LastPageLink" ? (openBlock(), createBlock(_component_LastPageLink, {
              key: 3,
              "aria-label": $options.getAriaLabel("lastPageLabel"),
              onClick: _cache[3] || (_cache[3] = ($event) => $options.changePageToLast($event)),
              disabled: $options.isLastPage || $options.empty
            }, null, 8, ["aria-label", "disabled"])) : item === "PageLinks" ? (openBlock(), createBlock(_component_PageLinks, {
              key: 4,
              "aria-label": $options.getAriaLabel("pageLabel"),
              value: $options.pageLinks,
              page: $options.page,
              onClick: _cache[4] || (_cache[4] = ($event) => $options.changePageLink($event))
            }, null, 8, ["aria-label", "value", "page"])) : item === "CurrentPageReport" ? (openBlock(), createBlock(_component_CurrentPageReport, {
              key: 5,
              "aria-live": "polite",
              template: $props.currentPageReportTemplate,
              currentPage: $options.currentPage,
              page: $options.page,
              pageCount: $options.pageCount,
              first: $data.d_first,
              rows: $data.d_rows,
              totalRecords: $props.totalRecords
            }, null, 8, ["template", "currentPage", "page", "pageCount", "first", "rows", "totalRecords"])) : item === "RowsPerPageDropdown" && $props.rowsPerPageOptions ? (openBlock(), createBlock(_component_RowsPerPageDropdown, {
              key: 6,
              "aria-label": $options.getAriaLabel("rowsPerPageLabel"),
              rows: $data.d_rows,
              options: $props.rowsPerPageOptions,
              onRowsChange: _cache[5] || (_cache[5] = ($event) => $options.onRowChange($event)),
              disabled: $options.empty
            }, null, 8, ["aria-label", "rows", "options", "disabled"])) : item === "JumpToPageDropdown" ? (openBlock(), createBlock(_component_JumpToPageDropdown, {
              key: 7,
              "aria-label": $options.getAriaLabel("jumpToPageDropdownLabel"),
              page: $options.page,
              pageCount: $options.pageCount,
              onPageChange: _cache[6] || (_cache[6] = ($event) => $options.changePage($event)),
              disabled: $options.empty
            }, null, 8, ["aria-label", "page", "pageCount", "disabled"])) : item === "JumpToPageInput" ? (openBlock(), createBlock(_component_JumpToPageInput, {
              key: 8,
              page: $options.currentPage,
              onPageChange: _cache[7] || (_cache[7] = ($event) => $options.changePage($event)),
              disabled: $options.empty
            }, null, 8, ["page", "disabled"])) : createCommentVNode("", true)
          ], 64);
        }), 128)),
        _ctx.$slots.end ? (openBlock(), createElementBlock("div", _hoisted_3$8, [
          renderSlot(_ctx.$slots, "end", { state: $options.currentState })
        ])) : createCommentVNode("", true)
      ], 2);
    }), 128))
  ])) : createCommentVNode("", true);
}
function styleInject$5(css, ref2) {
  if (ref2 === void 0)
    ref2 = {};
  var insertAt = ref2.insertAt;
  if (!css || true) {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
var css_248z$5 = "\n.p-paginator-default {\n    display: flex;\n}\n.p-paginator {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    flex-wrap: wrap;\n}\n.p-paginator-left-content {\n    margin-right: auto;\n}\n.p-paginator-right-content {\n    margin-left: auto;\n}\n.p-paginator-page,\n.p-paginator-next,\n.p-paginator-last,\n.p-paginator-first,\n.p-paginator-prev,\n.p-paginator-current {\n    cursor: pointer;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    line-height: 1;\n    user-select: none;\n    overflow: hidden;\n    position: relative;\n}\n.p-paginator-element:focus {\n    z-index: 1;\n    position: relative;\n}\n";
styleInject$5(css_248z$5);
script$c.render = render$c;
function bind(el, binding) {
  const { onFocusIn, onFocusOut } = binding.value || {};
  el.$_pfocustrap_mutationobserver = new MutationObserver((mutationList) => {
    mutationList.forEach((mutation) => {
      if (mutation.type === "childList" && !el.contains(document.activeElement)) {
        const findNextFocusableElement = (el2) => {
          const focusableElement = DomHandler.isFocusableElement(el2) ? el2 : DomHandler.getFirstFocusableElement(el2);
          return ObjectUtils.isNotEmpty(focusableElement) ? focusableElement : findNextFocusableElement(el2.nextSibling);
        };
        DomHandler.focus(findNextFocusableElement(mutation.nextSibling));
      }
    });
  });
  el.$_pfocustrap_mutationobserver.disconnect();
  el.$_pfocustrap_mutationobserver.observe(el, {
    childList: true
  });
  el.$_pfocustrap_focusinlistener = (event2) => onFocusIn && onFocusIn(event2);
  el.$_pfocustrap_focusoutlistener = (event2) => onFocusOut && onFocusOut(event2);
  el.addEventListener("focusin", el.$_pfocustrap_focusinlistener);
  el.addEventListener("focusout", el.$_pfocustrap_focusoutlistener);
}
function unbind(el) {
  el.$_pfocustrap_mutationobserver && el.$_pfocustrap_mutationobserver.disconnect();
  el.$_pfocustrap_focusinlistener && el.removeEventListener("focusin", el.$_pfocustrap_focusinlistener) && (el.$_pfocustrap_focusinlistener = null);
  el.$_pfocustrap_focusoutlistener && el.removeEventListener("focusout", el.$_pfocustrap_focusoutlistener) && (el.$_pfocustrap_focusoutlistener = null);
}
function autoFocus(el, binding) {
  const { autoFocusSelector = "", firstFocusableSelector = "", autoFocus: autoFocus2 = false } = binding.value || {};
  let focusableElement = DomHandler.getFirstFocusableElement(el, `[autofocus]:not(.p-hidden-focusable)${autoFocusSelector}`);
  autoFocus2 && !focusableElement && (focusableElement = DomHandler.getFirstFocusableElement(el, `:not(.p-hidden-focusable)${firstFocusableSelector}`));
  DomHandler.focus(focusableElement);
}
function onFirstHiddenElementFocus(event2) {
  const { currentTarget, relatedTarget } = event2;
  const focusableElement = relatedTarget === currentTarget.$_pfocustrap_lasthiddenfocusableelement ? DomHandler.getFirstFocusableElement(currentTarget.parentElement, `:not(.p-hidden-focusable)${currentTarget.$_pfocustrap_focusableselector}`) : currentTarget.$_pfocustrap_lasthiddenfocusableelement;
  DomHandler.focus(focusableElement);
}
function onLastHiddenElementFocus(event2) {
  const { currentTarget, relatedTarget } = event2;
  const focusableElement = relatedTarget === currentTarget.$_pfocustrap_firsthiddenfocusableelement ? DomHandler.getLastFocusableElement(currentTarget.parentElement, `:not(.p-hidden-focusable)${currentTarget.$_pfocustrap_focusableselector}`) : currentTarget.$_pfocustrap_firsthiddenfocusableelement;
  DomHandler.focus(focusableElement);
}
function createHiddenFocusableElements(el, binding) {
  const { tabIndex = 0, firstFocusableSelector = "", lastFocusableSelector = "" } = binding.value || {};
  const createFocusableElement = (onFocus) => {
    const element = document.createElement("span");
    element.classList = "p-hidden-accessible p-hidden-focusable";
    element.tabIndex = tabIndex;
    element.setAttribute("aria-hidden", "true");
    element.setAttribute("role", "presentation");
    element.addEventListener("focus", onFocus);
    return element;
  };
  const firstFocusableElement = createFocusableElement(onFirstHiddenElementFocus);
  const lastFocusableElement = createFocusableElement(onLastHiddenElementFocus);
  firstFocusableElement.$_pfocustrap_lasthiddenfocusableelement = lastFocusableElement;
  firstFocusableElement.$_pfocustrap_focusableselector = firstFocusableSelector;
  lastFocusableElement.$_pfocustrap_firsthiddenfocusableelement = firstFocusableElement;
  lastFocusableElement.$_pfocustrap_focusableselector = lastFocusableSelector;
  el.prepend(firstFocusableElement);
  el.append(lastFocusableElement);
}
const FocusTrap = {
  mounted(el, binding) {
    const { disabled } = binding.value || {};
    if (!disabled) {
      createHiddenFocusableElements(el, binding);
      bind(el, binding);
      autoFocus(el, binding);
    }
  },
  updated(el, binding) {
    const { disabled } = binding.value || {};
    disabled && unbind(el);
  },
  unmounted(el) {
    unbind(el);
  }
};
var script$a = {
  name: "RowCheckbox",
  emits: ["change"],
  props: {
    value: null,
    checked: null
  },
  data() {
    return {
      focused: false
    };
  },
  methods: {
    onClick(event2) {
      if (!this.$attrs.disabled) {
        this.$emit("change", {
          originalEvent: event2,
          data: this.value
        });
        DomHandler.focus(this.$refs.input);
      }
      event2.preventDefault();
    },
    onFocus() {
      this.focused = true;
    },
    onBlur() {
      this.focused = false;
    },
    onKeydown(event2) {
      switch (event2.code) {
        case "Space": {
          this.onClick(event2);
          break;
        }
      }
    }
  },
  computed: {
    checkboxAriaLabel() {
      return this.$primevue.config.locale.aria ? this.checked ? this.$primevue.config.locale.aria.selectRow : this.$primevue.config.locale.aria.unselectRow : void 0;
    }
  }
};
const _hoisted_1$a = { class: "p-hidden-accessible" };
const _hoisted_2$9 = ["checked", "disabled", "tabindex", "aria-label"];
function render$a(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["p-checkbox p-component", { "p-checkbox-focused": $data.focused }]),
    onClick: _cache[3] || (_cache[3] = (...args) => $options.onClick && $options.onClick(...args))
  }, [
    createElementVNode("div", _hoisted_1$a, [
      createElementVNode("input", {
        ref: "input",
        type: "checkbox",
        checked: $props.checked,
        disabled: _ctx.$attrs.disabled,
        tabindex: _ctx.$attrs.disabled ? null : "0",
        "aria-label": $options.checkboxAriaLabel,
        onFocus: _cache[0] || (_cache[0] = ($event) => $options.onFocus($event)),
        onBlur: _cache[1] || (_cache[1] = ($event) => $options.onBlur($event)),
        onKeydown: _cache[2] || (_cache[2] = (...args) => $options.onKeydown && $options.onKeydown(...args))
      }, null, 40, _hoisted_2$9)
    ]),
    createElementVNode("div", {
      ref: "box",
      class: normalizeClass(["p-checkbox-box p-component", { "p-highlight": $props.checked, "p-disabled": _ctx.$attrs.disabled, "p-focus": $data.focused }])
    }, [
      createElementVNode("span", {
        class: normalizeClass(["p-checkbox-icon", { "pi pi-check": $props.checked }])
      }, null, 2)
    ], 2)
  ], 2);
}
script$a.render = render$a;
var script$9 = {
  name: "RowRadioButton",
  inheritAttrs: false,
  emits: ["change"],
  props: {
    value: null,
    checked: null,
    name: null
  },
  data() {
    return {
      focused: false
    };
  },
  methods: {
    onClick(event2) {
      if (!this.disabled) {
        if (!this.checked) {
          this.$emit("change", {
            originalEvent: event2,
            data: this.value
          });
          DomHandler.focus(this.$refs.input);
        }
      }
    },
    onFocus() {
      this.focused = true;
    },
    onBlur() {
      this.focused = false;
    }
  }
};
const _hoisted_1$9 = { class: "p-hidden-accessible" };
const _hoisted_2$8 = ["checked", "disabled", "name"];
const _hoisted_3$6 = /* @__PURE__ */ createElementVNode("div", { class: "p-radiobutton-icon" }, null, -1);
const _hoisted_4$5 = [
  _hoisted_3$6
];
function render$9(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["p-radiobutton p-component", { "p-radiobutton-focused": $data.focused }]),
    onClick: _cache[3] || (_cache[3] = (...args) => $options.onClick && $options.onClick(...args))
  }, [
    createElementVNode("div", _hoisted_1$9, [
      createElementVNode("input", {
        ref: "input",
        type: "radio",
        checked: $props.checked,
        disabled: _ctx.$attrs.disabled,
        name: $props.name,
        tabindex: "0",
        onFocus: _cache[0] || (_cache[0] = ($event) => $options.onFocus($event)),
        onBlur: _cache[1] || (_cache[1] = ($event) => $options.onBlur($event)),
        onKeydown: _cache[2] || (_cache[2] = withKeys(withModifiers((...args) => $options.onClick && $options.onClick(...args), ["prevent"]), ["space"]))
      }, null, 40, _hoisted_2$8)
    ]),
    createElementVNode("div", {
      ref: "box",
      class: normalizeClass(["p-radiobutton-box p-component", { "p-highlight": $props.checked, "p-disabled": _ctx.$attrs.disabled, "p-focus": $data.focused }])
    }, _hoisted_4$5, 2)
  ], 2);
}
script$9.render = render$9;
var script$8 = {
  name: "BodyCell",
  emits: ["cell-edit-init", "cell-edit-complete", "cell-edit-cancel", "row-edit-init", "row-edit-save", "row-edit-cancel", "row-toggle", "radio-change", "checkbox-change", "editing-meta-change"],
  props: {
    rowData: {
      type: Object,
      default: null
    },
    column: {
      type: Object,
      default: null
    },
    frozenRow: {
      type: Boolean,
      default: false
    },
    rowIndex: {
      type: Number,
      default: null
    },
    index: {
      type: Number,
      default: null
    },
    rowTogglerIcon: {
      type: Array,
      default: null
    },
    selected: {
      type: Boolean,
      default: false
    },
    editing: {
      type: Boolean,
      default: false
    },
    editingMeta: {
      type: Object,
      default: null
    },
    editMode: {
      type: String,
      default: null
    },
    responsiveLayout: {
      type: String,
      default: "stack"
    },
    virtualScrollerContentProps: {
      type: Object,
      default: null
    },
    ariaControls: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    }
  },
  documentEditListener: null,
  selfClick: false,
  overlayEventListener: null,
  data() {
    return {
      d_editing: this.editing,
      styleObject: {},
      isRowExpanded: false
    };
  },
  watch: {
    editing(newValue) {
      this.d_editing = newValue;
    },
    "$data.d_editing": function(newValue) {
      this.$emit("editing-meta-change", { data: this.rowData, field: this.field || `field_${this.index}`, index: this.rowIndex, editing: newValue });
    }
  },
  mounted() {
    if (this.columnProp("frozen")) {
      this.updateStickyPosition();
    }
  },
  updated() {
    if (this.columnProp("frozen")) {
      this.updateStickyPosition();
    }
    if (this.d_editing && (this.editMode === "cell" || this.editMode === "row" && this.columnProp("rowEditor"))) {
      setTimeout(() => {
        const focusableEl = DomHandler.getFirstFocusableElement(this.$el);
        focusableEl && focusableEl.focus();
      }, 1);
    }
  },
  beforeUnmount() {
    if (this.overlayEventListener) {
      OverlayEventBus.off("overlay-click", this.overlayEventListener);
      this.overlayEventListener = null;
    }
  },
  methods: {
    columnProp(prop) {
      return ObjectUtils.getVNodeProp(this.column, prop);
    },
    resolveFieldData() {
      return ObjectUtils.resolveFieldData(this.rowData, this.field);
    },
    toggleRow(event2) {
      this.isRowExpanded = !this.isRowExpanded;
      this.$emit("row-toggle", {
        originalEvent: event2,
        data: this.rowData
      });
    },
    toggleRowWithRadio(event2, index) {
      this.$emit("radio-change", { originalEvent: event2.originalEvent, index, data: event2.data });
    },
    toggleRowWithCheckbox(event2, index) {
      this.$emit("checkbox-change", { originalEvent: event2.originalEvent, index, data: event2.data });
    },
    isEditable() {
      return this.column.children && this.column.children.editor != null;
    },
    bindDocumentEditListener() {
      if (!this.documentEditListener) {
        this.documentEditListener = (event2) => {
          if (!this.selfClick) {
            this.completeEdit(event2, "outside");
          }
          this.selfClick = false;
        };
        document.addEventListener("click", this.documentEditListener);
      }
    },
    unbindDocumentEditListener() {
      if (this.documentEditListener) {
        document.removeEventListener("click", this.documentEditListener);
        this.documentEditListener = null;
        this.selfClick = false;
      }
    },
    switchCellToViewMode() {
      this.d_editing = false;
      this.unbindDocumentEditListener();
      OverlayEventBus.off("overlay-click", this.overlayEventListener);
      this.overlayEventListener = null;
    },
    onClick(event2) {
      if (this.editMode === "cell" && this.isEditable()) {
        this.selfClick = true;
        if (!this.d_editing) {
          this.d_editing = true;
          this.bindDocumentEditListener();
          this.$emit("cell-edit-init", { originalEvent: event2, data: this.rowData, field: this.field, index: this.rowIndex });
          this.overlayEventListener = (e) => {
            if (this.$el && this.$el.contains(e.target)) {
              this.selfClick = true;
            }
          };
          OverlayEventBus.on("overlay-click", this.overlayEventListener);
        }
      }
    },
    completeEdit(event2, type) {
      const completeEvent = {
        originalEvent: event2,
        data: this.rowData,
        newData: this.editingRowData,
        value: this.rowData[this.field],
        newValue: this.editingRowData[this.field],
        field: this.field,
        index: this.rowIndex,
        type,
        defaultPrevented: false,
        preventDefault: function() {
          this.defaultPrevented = true;
        }
      };
      this.$emit("cell-edit-complete", completeEvent);
      if (!completeEvent.defaultPrevented) {
        this.switchCellToViewMode();
      }
    },
    onKeyDown(event2) {
      if (this.editMode === "cell") {
        switch (event2.code) {
          case "Enter":
            this.completeEdit(event2, "enter");
            break;
          case "Escape":
            this.switchCellToViewMode();
            this.$emit("cell-edit-cancel", { originalEvent: event2, data: this.rowData, field: this.field, index: this.rowIndex });
            break;
          case "Tab":
            this.completeEdit(event2, "tab");
            if (event2.shiftKey)
              this.moveToPreviousCell(event2);
            else
              this.moveToNextCell(event2);
            break;
        }
      }
    },
    moveToPreviousCell(event2) {
      let currentCell = this.findCell(event2.target);
      let targetCell = this.findPreviousEditableColumn(currentCell);
      if (targetCell) {
        DomHandler.invokeElementMethod(targetCell, "click");
        event2.preventDefault();
      }
    },
    moveToNextCell(event2) {
      let currentCell = this.findCell(event2.target);
      let targetCell = this.findNextEditableColumn(currentCell);
      if (targetCell) {
        DomHandler.invokeElementMethod(targetCell, "click");
        event2.preventDefault();
      }
    },
    findCell(element) {
      if (element) {
        let cell = element;
        while (cell && !DomHandler.hasClass(cell, "p-cell-editing")) {
          cell = cell.parentElement;
        }
        return cell;
      } else {
        return null;
      }
    },
    findPreviousEditableColumn(cell) {
      let prevCell = cell.previousElementSibling;
      if (!prevCell) {
        let previousRow = cell.parentElement.previousElementSibling;
        if (previousRow) {
          prevCell = previousRow.lastElementChild;
        }
      }
      if (prevCell) {
        if (DomHandler.hasClass(prevCell, "p-editable-column"))
          return prevCell;
        else
          return this.findPreviousEditableColumn(prevCell);
      } else {
        return null;
      }
    },
    findNextEditableColumn(cell) {
      let nextCell = cell.nextElementSibling;
      if (!nextCell) {
        let nextRow = cell.parentElement.nextElementSibling;
        if (nextRow) {
          nextCell = nextRow.firstElementChild;
        }
      }
      if (nextCell) {
        if (DomHandler.hasClass(nextCell, "p-editable-column"))
          return nextCell;
        else
          return this.findNextEditableColumn(nextCell);
      } else {
        return null;
      }
    },
    isEditingCellValid() {
      return DomHandler.find(this.$el, ".p-invalid").length === 0;
    },
    onRowEditInit(event2) {
      this.$emit("row-edit-init", { originalEvent: event2, data: this.rowData, newData: this.editingRowData, field: this.field, index: this.rowIndex });
    },
    onRowEditSave(event2) {
      this.$emit("row-edit-save", { originalEvent: event2, data: this.rowData, newData: this.editingRowData, field: this.field, index: this.rowIndex });
    },
    onRowEditCancel(event2) {
      this.$emit("row-edit-cancel", { originalEvent: event2, data: this.rowData, newData: this.editingRowData, field: this.field, index: this.rowIndex });
    },
    editorInitCallback(event2) {
      this.$emit("row-edit-init", { originalEvent: event2, data: this.rowData, newData: this.editingRowData, field: this.field, index: this.rowIndex });
    },
    editorSaveCallback(event2) {
      if (this.editMode === "row") {
        this.$emit("row-edit-save", { originalEvent: event2, data: this.rowData, newData: this.editingRowData, field: this.field, index: this.rowIndex });
      } else {
        this.completeEdit(event2, "enter");
      }
    },
    editorCancelCallback(event2) {
      if (this.editMode === "row") {
        this.$emit("row-edit-cancel", { originalEvent: event2, data: this.rowData, newData: this.editingRowData, field: this.field, index: this.rowIndex });
      } else {
        this.switchCellToViewMode();
        this.$emit("cell-edit-cancel", { originalEvent: event2, data: this.rowData, field: this.field, index: this.rowIndex });
      }
    },
    updateStickyPosition() {
      if (this.columnProp("frozen")) {
        let align = this.columnProp("alignFrozen");
        if (align === "right") {
          let right = 0;
          let next = this.$el.nextElementSibling;
          if (next) {
            right = DomHandler.getOuterWidth(next) + parseFloat(next.style.right || 0);
          }
          this.styleObject.right = right + "px";
        } else {
          let left = 0;
          let prev = this.$el.previousElementSibling;
          if (prev) {
            left = DomHandler.getOuterWidth(prev) + parseFloat(prev.style.left || 0);
          }
          this.styleObject.left = left + "px";
        }
      }
    },
    getVirtualScrollerProp(option) {
      return this.virtualScrollerContentProps ? this.virtualScrollerContentProps[option] : null;
    }
  },
  computed: {
    editingRowData() {
      return this.editingMeta[this.rowIndex] ? this.editingMeta[this.rowIndex].data : this.rowData;
    },
    field() {
      return this.columnProp("field");
    },
    containerClass() {
      return [
        this.columnProp("bodyClass"),
        this.columnProp("class"),
        {
          "p-selection-column": this.columnProp("selectionMode") != null,
          "p-editable-column": this.isEditable(),
          "p-cell-editing": this.d_editing,
          "p-frozen-column": this.columnProp("frozen")
        }
      ];
    },
    containerStyle() {
      let bodyStyle = this.columnProp("bodyStyle");
      let columnStyle = this.columnProp("style");
      return this.columnProp("frozen") ? [columnStyle, bodyStyle, this.styleObject] : [columnStyle, bodyStyle];
    },
    loading() {
      return this.getVirtualScrollerProp("loading");
    },
    loadingOptions() {
      const getLoaderOptions = this.getVirtualScrollerProp("getLoaderOptions");
      return getLoaderOptions && getLoaderOptions(this.rowIndex, {
        cellIndex: this.index,
        cellFirst: this.index === 0,
        cellLast: this.index === this.getVirtualScrollerProp("columns").length - 1,
        cellEven: this.index % 2 === 0,
        cellOdd: this.index % 2 !== 0,
        column: this.column,
        field: this.field
      });
    },
    expandButtonAriaLabel() {
      return this.$primevue.config.locale.aria ? this.isRowExpanded ? this.$primevue.config.locale.aria.expandRow : this.$primevue.config.locale.aria.collapseRow : void 0;
    },
    initButtonAriaLabel() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.editRow : void 0;
    },
    saveButtonAriaLabel() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.saveEdit : void 0;
    },
    cancelButtonAriaLabel() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.cancelEdit : void 0;
    }
  },
  components: {
    DTRadioButton: script$9,
    DTCheckbox: script$a
  },
  directives: {
    ripple: Ripple
  }
};
const _hoisted_1$8 = {
  key: 0,
  class: "p-column-title"
};
const _hoisted_2$7 = ["aria-expanded", "aria-controls", "aria-label"];
const _hoisted_3$5 = ["aria-label"];
const _hoisted_4$4 = /* @__PURE__ */ createElementVNode("span", { class: "p-row-editor-init-icon pi pi-fw pi-pencil" }, null, -1);
const _hoisted_5$3$1 = [
  _hoisted_4$4
];
const _hoisted_6$3 = ["aria-label"];
const _hoisted_7$2 = /* @__PURE__ */ createElementVNode("span", { class: "p-row-editor-save-icon pi pi-fw pi-check" }, null, -1);
const _hoisted_8$2 = [
  _hoisted_7$2
];
const _hoisted_9$1$1 = ["aria-label"];
const _hoisted_10$1$1 = /* @__PURE__ */ createElementVNode("span", { class: "p-row-editor-cancel-icon pi pi-fw pi-times" }, null, -1);
const _hoisted_11$1$1 = [
  _hoisted_10$1$1
];
function render$8(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_DTRadioButton = resolveComponent("DTRadioButton");
  const _component_DTCheckbox = resolveComponent("DTCheckbox");
  const _directive_ripple = resolveDirective("ripple");
  return $options.loading ? (openBlock(), createElementBlock("td", {
    key: 0,
    style: normalizeStyle($options.containerStyle),
    class: normalizeClass($options.containerClass)
  }, [
    (openBlock(), createBlock(resolveDynamicComponent($props.column.children.loading), {
      data: $props.rowData,
      column: $props.column,
      field: $options.field,
      index: $props.rowIndex,
      frozenRow: $props.frozenRow,
      loadingOptions: $options.loadingOptions
    }, null, 8, ["data", "column", "field", "index", "frozenRow", "loadingOptions"]))
  ], 6)) : (openBlock(), createElementBlock("td", {
    key: 1,
    style: normalizeStyle($options.containerStyle),
    class: normalizeClass($options.containerClass),
    onClick: _cache[6] || (_cache[6] = (...args) => $options.onClick && $options.onClick(...args)),
    onKeydown: _cache[7] || (_cache[7] = (...args) => $options.onKeyDown && $options.onKeyDown(...args)),
    role: "cell"
  }, [
    $props.responsiveLayout === "stack" ? (openBlock(), createElementBlock("span", _hoisted_1$8, toDisplayString($options.columnProp("header")), 1)) : createCommentVNode("", true),
    $props.column.children && $props.column.children.body && !$data.d_editing ? (openBlock(), createBlock(resolveDynamicComponent($props.column.children.body), {
      key: 1,
      data: $props.rowData,
      column: $props.column,
      field: $options.field,
      index: $props.rowIndex,
      frozenRow: $props.frozenRow,
      editorInitCallback: $options.editorInitCallback
    }, null, 8, ["data", "column", "field", "index", "frozenRow", "editorInitCallback"])) : $props.column.children && $props.column.children.editor && $data.d_editing ? (openBlock(), createBlock(resolveDynamicComponent($props.column.children.editor), {
      key: 2,
      data: $options.editingRowData,
      column: $props.column,
      field: $options.field,
      index: $props.rowIndex,
      frozenRow: $props.frozenRow,
      editorSaveCallback: $options.editorSaveCallback,
      editorCancelCallback: $options.editorCancelCallback
    }, null, 8, ["data", "column", "field", "index", "frozenRow", "editorSaveCallback", "editorCancelCallback"])) : $props.column.children && $props.column.children.body && !$props.column.children.editor && $data.d_editing ? (openBlock(), createBlock(resolveDynamicComponent($props.column.children.body), {
      key: 3,
      data: $options.editingRowData,
      column: $props.column,
      field: $options.field,
      index: $props.rowIndex,
      frozenRow: $props.frozenRow
    }, null, 8, ["data", "column", "field", "index", "frozenRow"])) : $options.columnProp("selectionMode") ? (openBlock(), createElementBlock(Fragment$1, { key: 4 }, [
      $options.columnProp("selectionMode") === "single" ? (openBlock(), createBlock(_component_DTRadioButton, {
        key: 0,
        value: $props.rowData,
        name: $props.name,
        checked: $props.selected,
        onChange: _cache[0] || (_cache[0] = ($event) => $options.toggleRowWithRadio($event, $props.rowIndex))
      }, null, 8, ["value", "name", "checked"])) : $options.columnProp("selectionMode") === "multiple" ? (openBlock(), createBlock(_component_DTCheckbox, {
        key: 1,
        value: $props.rowData,
        checked: $props.selected,
        "aria-selected": $props.selected ? true : void 0,
        onChange: _cache[1] || (_cache[1] = ($event) => $options.toggleRowWithCheckbox($event, $props.rowIndex))
      }, null, 8, ["value", "checked", "aria-selected"])) : createCommentVNode("", true)
    ], 64)) : $options.columnProp("rowReorder") ? (openBlock(), createElementBlock("i", {
      key: 5,
      class: normalizeClass(["p-datatable-reorderablerow-handle", $options.columnProp("rowReorderIcon") || "pi pi-bars"])
    }, null, 2)) : $options.columnProp("expander") ? withDirectives((openBlock(), createElementBlock("button", {
      key: 6,
      class: "p-row-toggler p-link",
      type: "button",
      "aria-expanded": $data.isRowExpanded,
      "aria-controls": $props.ariaControls,
      "aria-label": $options.expandButtonAriaLabel,
      onClick: _cache[2] || (_cache[2] = (...args) => $options.toggleRow && $options.toggleRow(...args))
    }, [
      createElementVNode("span", {
        class: normalizeClass($props.rowTogglerIcon)
      }, null, 2)
    ], 8, _hoisted_2$7)), [
      [_directive_ripple]
    ]) : $props.editMode === "row" && $options.columnProp("rowEditor") ? (openBlock(), createElementBlock(Fragment$1, { key: 7 }, [
      !$data.d_editing ? withDirectives((openBlock(), createElementBlock("button", {
        key: 0,
        class: "p-row-editor-init p-link",
        type: "button",
        "aria-label": $options.initButtonAriaLabel,
        onClick: _cache[3] || (_cache[3] = (...args) => $options.onRowEditInit && $options.onRowEditInit(...args))
      }, _hoisted_5$3$1, 8, _hoisted_3$5)), [
        [_directive_ripple]
      ]) : createCommentVNode("", true),
      $data.d_editing ? withDirectives((openBlock(), createElementBlock("button", {
        key: 1,
        class: "p-row-editor-save p-link",
        type: "button",
        "aria-label": $options.saveButtonAriaLabel,
        onClick: _cache[4] || (_cache[4] = (...args) => $options.onRowEditSave && $options.onRowEditSave(...args))
      }, _hoisted_8$2, 8, _hoisted_6$3)), [
        [_directive_ripple]
      ]) : createCommentVNode("", true),
      $data.d_editing ? withDirectives((openBlock(), createElementBlock("button", {
        key: 2,
        class: "p-row-editor-cancel p-link",
        type: "button",
        "aria-label": $options.cancelButtonAriaLabel,
        onClick: _cache[5] || (_cache[5] = (...args) => $options.onRowEditCancel && $options.onRowEditCancel(...args))
      }, _hoisted_11$1$1, 8, _hoisted_9$1$1)), [
        [_directive_ripple]
      ]) : createCommentVNode("", true)
    ], 64)) : (openBlock(), createElementBlock(Fragment$1, { key: 8 }, [
      createTextVNode(toDisplayString($options.resolveFieldData()), 1)
    ], 64))
  ], 38));
}
script$8.render = render$8;
var script$7 = {
  name: "TableBody",
  emits: [
    "rowgroup-toggle",
    "row-click",
    "row-dblclick",
    "row-rightclick",
    "row-touchend",
    "row-keydown",
    "row-mousedown",
    "row-dragstart",
    "row-dragover",
    "row-dragleave",
    "row-dragend",
    "row-drop",
    "row-toggle",
    "radio-change",
    "checkbox-change",
    "cell-edit-init",
    "cell-edit-complete",
    "cell-edit-cancel",
    "row-edit-init",
    "row-edit-save",
    "row-edit-cancel",
    "editing-meta-change"
  ],
  props: {
    value: {
      type: Array,
      default: null
    },
    columns: {
      type: null,
      default: null
    },
    frozenRow: {
      type: Boolean,
      default: false
    },
    empty: {
      type: Boolean,
      default: false
    },
    rowGroupMode: {
      type: String,
      default: null
    },
    groupRowsBy: {
      type: [Array, String, Function],
      default: null
    },
    expandableRowGroups: {
      type: Boolean,
      default: false
    },
    expandedRowGroups: {
      type: Array,
      default: null
    },
    first: {
      type: Number,
      default: 0
    },
    dataKey: {
      type: String,
      default: null
    },
    expandedRowIcon: {
      type: String,
      default: null
    },
    collapsedRowIcon: {
      type: String,
      default: null
    },
    expandedRows: {
      type: Array,
      default: null
    },
    expandedRowKeys: {
      type: null,
      default: null
    },
    selection: {
      type: [Array, Object],
      default: null
    },
    selectionKeys: {
      type: null,
      default: null
    },
    selectionMode: {
      type: String,
      default: null
    },
    contextMenu: {
      type: Boolean,
      default: false
    },
    contextMenuSelection: {
      type: Object,
      default: null
    },
    rowClass: {
      type: null,
      default: null
    },
    rowStyle: {
      type: null,
      default: null
    },
    editMode: {
      type: String,
      default: null
    },
    compareSelectionBy: {
      type: String,
      default: "deepEquals"
    },
    editingRows: {
      type: Array,
      default: null
    },
    editingRowKeys: {
      type: null,
      default: null
    },
    editingMeta: {
      type: Object,
      default: null
    },
    templates: {
      type: null,
      default: null
    },
    scrollable: {
      type: Boolean,
      default: false
    },
    responsiveLayout: {
      type: String,
      default: "stack"
    },
    virtualScrollerContentProps: {
      type: Object,
      default: null
    },
    isVirtualScrollerDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rowGroupHeaderStyleObject: {},
      tabindexArray: [],
      isARowSelected: false
    };
  },
  mounted() {
    if (this.frozenRow) {
      this.updateFrozenRowStickyPosition();
    }
    if (this.scrollable && this.rowGroupMode === "subheader") {
      this.updateFrozenRowGroupHeaderStickyPosition();
    }
  },
  updated() {
    if (this.frozenRow) {
      this.updateFrozenRowStickyPosition();
    }
    if (this.scrollable && this.rowGroupMode === "subheader") {
      this.updateFrozenRowGroupHeaderStickyPosition();
    }
  },
  methods: {
    columnProp(col, prop) {
      return ObjectUtils.getVNodeProp(col, prop);
    },
    shouldRenderRowGroupHeader(value, rowData, i) {
      let currentRowFieldData = ObjectUtils.resolveFieldData(rowData, this.groupRowsBy);
      let prevRowData = value[i - 1];
      if (prevRowData) {
        let previousRowFieldData = ObjectUtils.resolveFieldData(prevRowData, this.groupRowsBy);
        return currentRowFieldData !== previousRowFieldData;
      } else {
        return true;
      }
    },
    getRowKey(rowData, index) {
      return this.dataKey ? ObjectUtils.resolveFieldData(rowData, this.dataKey) : this.getRowIndex(index);
    },
    getRowIndex(index) {
      const getItemOptions = this.getVirtualScrollerProp("getItemOptions");
      return getItemOptions ? getItemOptions(index).index : this.first + index;
    },
    getRowStyle(rowData) {
      if (this.rowStyle) {
        return this.rowStyle(rowData);
      }
    },
    getRowClass(rowData) {
      let rowStyleClass = [];
      if (this.selectionMode) {
        rowStyleClass.push("p-selectable-row");
      }
      if (this.selection) {
        rowStyleClass.push({
          "p-highlight": this.isSelected(rowData)
        });
      }
      if (this.contextMenuSelection) {
        rowStyleClass.push({
          "p-highlight-contextmenu": this.isSelectedWithContextMenu(rowData)
        });
      }
      if (this.rowClass) {
        let rowClassValue = this.rowClass(rowData);
        if (rowClassValue) {
          rowStyleClass.push(rowClassValue);
        }
      }
      return rowStyleClass;
    },
    shouldRenderRowGroupFooter(value, rowData, i) {
      if (this.expandableRowGroups && !this.isRowGroupExpanded(rowData)) {
        return false;
      } else {
        let currentRowFieldData = ObjectUtils.resolveFieldData(rowData, this.groupRowsBy);
        let nextRowData = value[i + 1];
        if (nextRowData) {
          let nextRowFieldData = ObjectUtils.resolveFieldData(nextRowData, this.groupRowsBy);
          return currentRowFieldData !== nextRowFieldData;
        } else {
          return true;
        }
      }
    },
    shouldRenderBodyCell(value, column, i) {
      if (this.rowGroupMode) {
        if (this.rowGroupMode === "subheader") {
          return this.groupRowsBy !== this.columnProp(column, "field");
        } else if (this.rowGroupMode === "rowspan") {
          if (this.isGrouped(column)) {
            let prevRowData = value[i - 1];
            if (prevRowData) {
              let currentRowFieldData = ObjectUtils.resolveFieldData(value[i], this.columnProp(column, "field"));
              let previousRowFieldData = ObjectUtils.resolveFieldData(prevRowData, this.columnProp(column, "field"));
              return currentRowFieldData !== previousRowFieldData;
            } else {
              return true;
            }
          } else {
            return true;
          }
        }
      } else {
        return !this.columnProp(column, "hidden");
      }
    },
    calculateRowGroupSize(value, column, index) {
      if (this.isGrouped(column)) {
        let currentRowFieldData = ObjectUtils.resolveFieldData(value[index], this.columnProp(column, "field"));
        let nextRowFieldData = currentRowFieldData;
        let groupRowSpan = 0;
        while (currentRowFieldData === nextRowFieldData) {
          groupRowSpan++;
          let nextRowData = value[++index];
          if (nextRowData) {
            nextRowFieldData = ObjectUtils.resolveFieldData(nextRowData, this.columnProp(column, "field"));
          } else {
            break;
          }
        }
        return groupRowSpan === 1 ? null : groupRowSpan;
      } else {
        return null;
      }
    },
    rowTogglerIcon(rowData) {
      const icon = this.isRowExpanded(rowData) ? this.expandedRowIcon : this.collapsedRowIcon;
      return ["p-row-toggler-icon pi", icon];
    },
    rowGroupTogglerIcon(rowData) {
      const icon = this.isRowGroupExpanded(rowData) ? this.expandedRowIcon : this.collapsedRowIcon;
      return ["p-row-toggler-icon pi", icon];
    },
    isGrouped(column) {
      if (this.groupRowsBy && this.columnProp(column, "field")) {
        if (Array.isArray(this.groupRowsBy))
          return this.groupRowsBy.indexOf(column.props.field) > -1;
        else
          return this.groupRowsBy === column.props.field;
      } else {
        return false;
      }
    },
    isRowEditing(rowData) {
      if (rowData && this.editingRows) {
        if (this.dataKey)
          return this.editingRowKeys ? this.editingRowKeys[ObjectUtils.resolveFieldData(rowData, this.dataKey)] !== void 0 : false;
        else
          return this.findIndex(rowData, this.editingRows) > -1;
      }
      return false;
    },
    isRowExpanded(rowData) {
      if (rowData && this.expandedRows) {
        if (this.dataKey)
          return this.expandedRowKeys ? this.expandedRowKeys[ObjectUtils.resolveFieldData(rowData, this.dataKey)] !== void 0 : false;
        else
          return this.findIndex(rowData, this.expandedRows) > -1;
      }
      return false;
    },
    isRowGroupExpanded(rowData) {
      if (this.expandableRowGroups && this.expandedRowGroups) {
        let groupFieldValue = ObjectUtils.resolveFieldData(rowData, this.groupRowsBy);
        return this.expandedRowGroups.indexOf(groupFieldValue) > -1;
      }
      return false;
    },
    isSelected(rowData) {
      if (rowData && this.selection) {
        if (this.dataKey) {
          return this.selectionKeys ? this.selectionKeys[ObjectUtils.resolveFieldData(rowData, this.dataKey)] !== void 0 : false;
        } else {
          if (this.selection instanceof Array)
            return this.findIndexInSelection(rowData) > -1;
          else
            return this.equals(rowData, this.selection);
        }
      }
      return false;
    },
    isSelectedWithContextMenu(rowData) {
      if (rowData && this.contextMenuSelection) {
        return this.equals(rowData, this.contextMenuSelection, this.dataKey);
      }
      return false;
    },
    findIndexInSelection(rowData) {
      return this.findIndex(rowData, this.selection);
    },
    findIndex(rowData, collection) {
      let index = -1;
      if (collection && collection.length) {
        for (let i = 0; i < collection.length; i++) {
          if (this.equals(rowData, collection[i])) {
            index = i;
            break;
          }
        }
      }
      return index;
    },
    equals(data1, data2) {
      return this.compareSelectionBy === "equals" ? data1 === data2 : ObjectUtils.equals(data1, data2, this.dataKey);
    },
    onRowGroupToggle(event2, data) {
      this.$emit("rowgroup-toggle", { originalEvent: event2, data });
    },
    onRowClick(event2, rowData, rowIndex) {
      this.$emit("row-click", { originalEvent: event2, data: rowData, index: rowIndex });
    },
    onRowDblClick(event2, rowData, rowIndex) {
      this.$emit("row-dblclick", { originalEvent: event2, data: rowData, index: rowIndex });
    },
    onRowRightClick(event2, rowData, rowIndex) {
      this.$emit("row-rightclick", { originalEvent: event2, data: rowData, index: rowIndex });
    },
    onRowTouchEnd(event2) {
      this.$emit("row-touchend", event2);
    },
    onRowKeyDown(event2, rowData, rowIndex) {
      this.$emit("row-keydown", { originalEvent: event2, data: rowData, index: rowIndex });
    },
    onRowMouseDown(event2) {
      this.$emit("row-mousedown", event2);
    },
    onRowDragStart(event2, rowIndex) {
      this.$emit("row-dragstart", { originalEvent: event2, index: rowIndex });
    },
    onRowDragOver(event2, rowIndex) {
      this.$emit("row-dragover", { originalEvent: event2, index: rowIndex });
    },
    onRowDragLeave(event2) {
      this.$emit("row-dragleave", event2);
    },
    onRowDragEnd(event2) {
      this.$emit("row-dragend", event2);
    },
    onRowDrop(event2) {
      this.$emit("row-drop", event2);
    },
    onRowToggle(event2) {
      this.$emit("row-toggle", event2);
    },
    onRadioChange(event2) {
      this.$emit("radio-change", event2);
    },
    onCheckboxChange(event2) {
      this.$emit("checkbox-change", event2);
    },
    onCellEditInit(event2) {
      this.$emit("cell-edit-init", event2);
    },
    onCellEditComplete(event2) {
      this.$emit("cell-edit-complete", event2);
    },
    onCellEditCancel(event2) {
      this.$emit("cell-edit-cancel", event2);
    },
    onRowEditInit(event2) {
      this.$emit("row-edit-init", event2);
    },
    onRowEditSave(event2) {
      this.$emit("row-edit-save", event2);
    },
    onRowEditCancel(event2) {
      this.$emit("row-edit-cancel", event2);
    },
    onEditingMetaChange(event2) {
      this.$emit("editing-meta-change", event2);
    },
    updateFrozenRowStickyPosition() {
      this.$el.style.top = DomHandler.getOuterHeight(this.$el.previousElementSibling) + "px";
    },
    updateFrozenRowGroupHeaderStickyPosition() {
      let tableHeaderHeight = DomHandler.getOuterHeight(this.$el.previousElementSibling);
      this.rowGroupHeaderStyleObject.top = tableHeaderHeight + "px";
    },
    getVirtualScrollerProp(option, options) {
      options = options || this.virtualScrollerContentProps;
      return options ? options[option] : null;
    },
    bodyRef(el) {
      const contentRef = this.getVirtualScrollerProp("contentRef");
      contentRef && contentRef(el);
    },
    setRowTabindex(index) {
      if (this.selection === null && (this.selectionMode === "single" || this.selectionMode === "multiple")) {
        return index === 0 ? 0 : -1;
      }
      return -1;
    }
  },
  computed: {
    columnsLength() {
      let hiddenColLength = 0;
      this.columns.forEach((column) => {
        if (this.columnProp(column, "selectionMode") === "single")
          hiddenColLength--;
        if (this.columnProp(column, "hidden"))
          hiddenColLength++;
      });
      return this.columns ? this.columns.length - hiddenColLength : 0;
    },
    rowGroupHeaderStyle() {
      if (this.scrollable) {
        return { top: this.rowGroupHeaderStyleObject.top };
      }
      return null;
    },
    bodyStyle() {
      return this.getVirtualScrollerProp("contentStyle");
    },
    expandedRowId() {
      return UniqueComponentId();
    },
    nameAttributeSelector() {
      return UniqueComponentId();
    }
  },
  components: {
    DTBodyCell: script$8
  }
};
const _hoisted_1$7 = ["colspan"];
const _hoisted_2$6 = ["onClick"];
const _hoisted_3$4 = ["tabindex", "aria-selected", "onClick", "onDblclick", "onContextmenu", "onKeydown", "onDragstart", "onDragover"];
const _hoisted_4$3$1 = ["id"];
const _hoisted_5$2$1 = ["colspan"];
const _hoisted_6$2 = ["colspan"];
const _hoisted_7$1$1 = {
  key: 1,
  class: "p-datatable-emptymessage",
  role: "row"
};
const _hoisted_8$1$1 = ["colspan"];
function render$7(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_DTBodyCell = resolveComponent("DTBodyCell");
  return openBlock(), createElementBlock("tbody", {
    ref: $options.bodyRef,
    class: "p-datatable-tbody",
    role: "rowgroup",
    style: normalizeStyle($options.bodyStyle)
  }, [
    !$props.empty ? (openBlock(true), createElementBlock(Fragment$1, { key: 0 }, renderList($props.value, (rowData, index) => {
      return openBlock(), createElementBlock(Fragment$1, null, [
        $props.templates["groupheader"] && $props.rowGroupMode === "subheader" && $options.shouldRenderRowGroupHeader($props.value, rowData, $options.getRowIndex(index)) ? (openBlock(), createElementBlock("tr", {
          key: $options.getRowKey(rowData, $options.getRowIndex(index)) + "_subheader",
          class: "p-rowgroup-header",
          style: normalizeStyle($options.rowGroupHeaderStyle),
          role: "row"
        }, [
          createElementVNode("td", {
            colspan: $options.columnsLength - 1
          }, [
            $props.expandableRowGroups ? (openBlock(), createElementBlock("button", {
              key: 0,
              class: "p-row-toggler p-link",
              onClick: ($event) => $options.onRowGroupToggle($event, rowData),
              type: "button"
            }, [
              createElementVNode("span", {
                class: normalizeClass($options.rowGroupTogglerIcon(rowData))
              }, null, 2)
            ], 8, _hoisted_2$6)) : createCommentVNode("", true),
            (openBlock(), createBlock(resolveDynamicComponent($props.templates["groupheader"]), {
              data: rowData,
              index: $options.getRowIndex(index)
            }, null, 8, ["data", "index"]))
          ], 8, _hoisted_1$7)
        ], 4)) : createCommentVNode("", true),
        ($props.expandableRowGroups ? $options.isRowGroupExpanded(rowData) : true) ? (openBlock(), createElementBlock("tr", {
          key: $options.getRowKey(rowData, $options.getRowIndex(index)),
          class: normalizeClass($options.getRowClass(rowData)),
          style: normalizeStyle($options.getRowStyle(rowData)),
          tabindex: $options.setRowTabindex(index),
          role: "row",
          "aria-selected": $props.selectionMode ? $options.isSelected(rowData) : null,
          onClick: ($event) => $options.onRowClick($event, rowData, $options.getRowIndex(index)),
          onDblclick: ($event) => $options.onRowDblClick($event, rowData, $options.getRowIndex(index)),
          onContextmenu: ($event) => $options.onRowRightClick($event, rowData, $options.getRowIndex(index)),
          onTouchend: _cache[9] || (_cache[9] = ($event) => $options.onRowTouchEnd($event)),
          onKeydown: ($event) => $options.onRowKeyDown($event, rowData, $options.getRowIndex(index)),
          onMousedown: _cache[10] || (_cache[10] = ($event) => $options.onRowMouseDown($event)),
          onDragstart: ($event) => $options.onRowDragStart($event, $options.getRowIndex(index)),
          onDragover: ($event) => $options.onRowDragOver($event, $options.getRowIndex(index)),
          onDragleave: _cache[11] || (_cache[11] = ($event) => $options.onRowDragLeave($event)),
          onDragend: _cache[12] || (_cache[12] = ($event) => $options.onRowDragEnd($event)),
          onDrop: _cache[13] || (_cache[13] = ($event) => $options.onRowDrop($event))
        }, [
          (openBlock(true), createElementBlock(Fragment$1, null, renderList($props.columns, (col, i) => {
            return openBlock(), createElementBlock(Fragment$1, null, [
              $options.shouldRenderBodyCell($props.value, col, $options.getRowIndex(index)) ? (openBlock(), createBlock(_component_DTBodyCell, {
                key: $options.columnProp(col, "columnKey") || $options.columnProp(col, "field") || i,
                rowData,
                column: col,
                rowIndex: $options.getRowIndex(index),
                index: i,
                selected: $options.isSelected(rowData),
                rowTogglerIcon: $options.columnProp(col, "expander") ? $options.rowTogglerIcon(rowData) : null,
                frozenRow: $props.frozenRow,
                rowspan: $props.rowGroupMode === "rowspan" ? $options.calculateRowGroupSize($props.value, col, $options.getRowIndex(index)) : null,
                editMode: $props.editMode,
                editing: $props.editMode === "row" && $options.isRowEditing(rowData),
                editingMeta: $props.editingMeta,
                responsiveLayout: $props.responsiveLayout,
                virtualScrollerContentProps: $props.virtualScrollerContentProps,
                ariaControls: $options.expandedRowId + "_" + index + "_expansion",
                name: $options.nameAttributeSelector,
                onRadioChange: _cache[0] || (_cache[0] = ($event) => $options.onRadioChange($event)),
                onCheckboxChange: _cache[1] || (_cache[1] = ($event) => $options.onCheckboxChange($event)),
                onRowToggle: _cache[2] || (_cache[2] = ($event) => $options.onRowToggle($event)),
                onCellEditInit: _cache[3] || (_cache[3] = ($event) => $options.onCellEditInit($event)),
                onCellEditComplete: _cache[4] || (_cache[4] = ($event) => $options.onCellEditComplete($event)),
                onCellEditCancel: _cache[5] || (_cache[5] = ($event) => $options.onCellEditCancel($event)),
                onRowEditInit: _cache[6] || (_cache[6] = ($event) => $options.onRowEditInit($event)),
                onRowEditSave: _cache[7] || (_cache[7] = ($event) => $options.onRowEditSave($event)),
                onRowEditCancel: _cache[8] || (_cache[8] = ($event) => $options.onRowEditCancel($event)),
                onEditingMetaChange: $options.onEditingMetaChange
              }, null, 8, ["rowData", "column", "rowIndex", "index", "selected", "rowTogglerIcon", "frozenRow", "rowspan", "editMode", "editing", "editingMeta", "responsiveLayout", "virtualScrollerContentProps", "ariaControls", "name", "onEditingMetaChange"])) : createCommentVNode("", true)
            ], 64);
          }), 256))
        ], 46, _hoisted_3$4)) : createCommentVNode("", true),
        $props.templates["expansion"] && $props.expandedRows && $options.isRowExpanded(rowData) ? (openBlock(), createElementBlock("tr", {
          key: $options.getRowKey(rowData, $options.getRowIndex(index)) + "_expansion",
          id: $options.expandedRowId + "_" + index + "_expansion",
          class: "p-datatable-row-expansion",
          role: "row"
        }, [
          createElementVNode("td", { colspan: $options.columnsLength }, [
            (openBlock(), createBlock(resolveDynamicComponent($props.templates["expansion"]), {
              data: rowData,
              index: $options.getRowIndex(index)
            }, null, 8, ["data", "index"]))
          ], 8, _hoisted_5$2$1)
        ], 8, _hoisted_4$3$1)) : createCommentVNode("", true),
        $props.templates["groupfooter"] && $props.rowGroupMode === "subheader" && $options.shouldRenderRowGroupFooter($props.value, rowData, $options.getRowIndex(index)) ? (openBlock(), createElementBlock("tr", {
          key: $options.getRowKey(rowData, $options.getRowIndex(index)) + "_subfooter",
          class: "p-rowgroup-footer",
          role: "row"
        }, [
          createElementVNode("td", {
            colspan: $options.columnsLength - 1
          }, [
            (openBlock(), createBlock(resolveDynamicComponent($props.templates["groupfooter"]), {
              data: rowData,
              index: $options.getRowIndex(index)
            }, null, 8, ["data", "index"]))
          ], 8, _hoisted_6$2)
        ])) : createCommentVNode("", true)
      ], 64);
    }), 256)) : (openBlock(), createElementBlock("tr", _hoisted_7$1$1, [
      createElementVNode("td", { colspan: $options.columnsLength }, [
        $props.templates.empty ? (openBlock(), createBlock(resolveDynamicComponent($props.templates.empty), { key: 0 })) : createCommentVNode("", true)
      ], 8, _hoisted_8$1$1)
    ]))
  ], 4);
}
script$7.render = render$7;
var script$6 = {
  name: "FooterCell",
  props: {
    column: {
      type: null,
      default: null
    }
  },
  data() {
    return {
      styleObject: {}
    };
  },
  mounted() {
    if (this.columnProp("frozen")) {
      this.updateStickyPosition();
    }
  },
  updated() {
    if (this.columnProp("frozen")) {
      this.updateStickyPosition();
    }
  },
  methods: {
    columnProp(prop) {
      return ObjectUtils.getVNodeProp(this.column, prop);
    },
    updateStickyPosition() {
      if (this.columnProp("frozen")) {
        let align = this.columnProp("alignFrozen");
        if (align === "right") {
          let right = 0;
          let next = this.$el.nextElementSibling;
          if (next) {
            right = DomHandler.getOuterWidth(next) + parseFloat(next.style.right || 0);
          }
          this.styleObject.right = right + "px";
        } else {
          let left = 0;
          let prev = this.$el.previousElementSibling;
          if (prev) {
            left = DomHandler.getOuterWidth(prev) + parseFloat(prev.style.left || 0);
          }
          this.styleObject.left = left + "px";
        }
      }
    }
  },
  computed: {
    containerClass() {
      return [
        this.columnProp("footerClass"),
        this.columnProp("class"),
        {
          "p-frozen-column": this.columnProp("frozen")
        }
      ];
    },
    containerStyle() {
      let bodyStyle = this.columnProp("footerStyle");
      let columnStyle = this.columnProp("style");
      return this.columnProp("frozen") ? [columnStyle, bodyStyle, this.styleObject] : [columnStyle, bodyStyle];
    }
  }
};
const _hoisted_1$6 = ["colspan", "rowspan"];
function render$6(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("td", {
    style: normalizeStyle($options.containerStyle),
    class: normalizeClass($options.containerClass),
    role: "cell",
    colspan: $options.columnProp("colspan"),
    rowspan: $options.columnProp("rowspan")
  }, [
    $props.column.children && $props.column.children.footer ? (openBlock(), createBlock(resolveDynamicComponent($props.column.children.footer), {
      key: 0,
      column: $props.column
    }, null, 8, ["column"])) : createCommentVNode("", true),
    createTextVNode(" " + toDisplayString($options.columnProp("footer")), 1)
  ], 14, _hoisted_1$6);
}
script$6.render = render$6;
var script$5 = {
  name: "TableFooter",
  props: {
    columnGroup: {
      type: null,
      default: null
    },
    columns: {
      type: null,
      default: null
    }
  },
  methods: {
    columnProp(col, prop) {
      return ObjectUtils.getVNodeProp(col, prop);
    },
    getFooterRows() {
      let rows = [];
      let columnGroup = this.columnGroup;
      if (columnGroup.children && columnGroup.children.default) {
        for (let child of columnGroup.children.default()) {
          if (child.type.name === "Row") {
            rows.push(child);
          } else if (child.children && child.children instanceof Array) {
            rows = child.children;
          }
        }
        return rows;
      }
    },
    getFooterColumns(row) {
      let cols = [];
      if (row.children && row.children.default) {
        row.children.default().forEach((child) => {
          if (child.children && child.children instanceof Array)
            cols = [...cols, ...child.children];
          else if (child.type.name === "Column")
            cols.push(child);
        });
        return cols;
      }
    }
  },
  computed: {
    hasFooter() {
      let hasFooter = false;
      if (this.columnGroup) {
        hasFooter = true;
      } else if (this.columns) {
        for (let col of this.columns) {
          if (this.columnProp(col, "footer") || col.children && col.children.footer) {
            hasFooter = true;
            break;
          }
        }
      }
      return hasFooter;
    }
  },
  components: {
    DTFooterCell: script$6
  }
};
const _hoisted_1$5 = {
  key: 0,
  class: "p-datatable-tfoot",
  role: "rowgroup"
};
const _hoisted_2$5 = {
  key: 0,
  role: "row"
};
function render$5(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_DTFooterCell = resolveComponent("DTFooterCell");
  return $options.hasFooter ? (openBlock(), createElementBlock("tfoot", _hoisted_1$5, [
    !$props.columnGroup ? (openBlock(), createElementBlock("tr", _hoisted_2$5, [
      (openBlock(true), createElementBlock(Fragment$1, null, renderList($props.columns, (col, i) => {
        return openBlock(), createElementBlock(Fragment$1, {
          key: $options.columnProp(col, "columnKey") || $options.columnProp(col, "field") || i
        }, [
          !$options.columnProp(col, "hidden") ? (openBlock(), createBlock(_component_DTFooterCell, {
            key: 0,
            column: col
          }, null, 8, ["column"])) : createCommentVNode("", true)
        ], 64);
      }), 128))
    ])) : (openBlock(true), createElementBlock(Fragment$1, { key: 1 }, renderList($options.getFooterRows(), (row, i) => {
      return openBlock(), createElementBlock("tr", {
        key: i,
        role: "row"
      }, [
        (openBlock(true), createElementBlock(Fragment$1, null, renderList($options.getFooterColumns(row), (col, j) => {
          return openBlock(), createElementBlock(Fragment$1, {
            key: $options.columnProp(col, "columnKey") || $options.columnProp(col, "field") || j
          }, [
            !$options.columnProp(col, "hidden") ? (openBlock(), createBlock(_component_DTFooterCell, {
              key: 0,
              column: col
            }, null, 8, ["column"])) : createCommentVNode("", true)
          ], 64);
        }), 128))
      ]);
    }), 128))
  ])) : createCommentVNode("", true);
}
script$5.render = render$5;
var script$4$1 = {
  name: "ColumnFilter",
  emits: ["filter-change", "filter-apply", "operator-change", "matchmode-change", "constraint-add", "constraint-remove", "filter-clear", "apply-click"],
  props: {
    field: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: "text"
    },
    display: {
      type: String,
      default: null
    },
    showMenu: {
      type: Boolean,
      default: true
    },
    matchMode: {
      type: String,
      default: null
    },
    showOperator: {
      type: Boolean,
      default: true
    },
    showClearButton: {
      type: Boolean,
      default: true
    },
    showApplyButton: {
      type: Boolean,
      default: true
    },
    showMatchModes: {
      type: Boolean,
      default: true
    },
    showAddButton: {
      type: Boolean,
      default: true
    },
    matchModeOptions: {
      type: Array,
      default: null
    },
    maxConstraints: {
      type: Number,
      default: 2
    },
    filterElement: null,
    filterHeaderTemplate: null,
    filterFooterTemplate: null,
    filterClearTemplate: null,
    filterApplyTemplate: null,
    filters: {
      type: Object,
      default: null
    },
    filtersStore: {
      type: Object,
      default: null
    },
    filterMenuClass: {
      type: String,
      default: null
    },
    filterMenuStyle: {
      type: null,
      default: null
    },
    filterInputProps: {
      type: null,
      default: null
    }
  },
  data() {
    return {
      overlayVisible: false,
      defaultMatchMode: null,
      defaultOperator: null
    };
  },
  overlay: null,
  selfClick: false,
  overlayEventListener: null,
  beforeUnmount() {
    if (this.overlayEventListener) {
      OverlayEventBus.off("overlay-click", this.overlayEventListener);
      this.overlayEventListener = null;
    }
    if (this.overlay) {
      ZIndexUtils.clear(this.overlay);
      this.onOverlayHide();
    }
  },
  mounted() {
    if (this.filters && this.filters[this.field]) {
      let fieldFilters = this.filters[this.field];
      if (fieldFilters.operator) {
        this.defaultMatchMode = fieldFilters.constraints[0].matchMode;
        this.defaultOperator = fieldFilters.operator;
      } else {
        this.defaultMatchMode = this.filters[this.field].matchMode;
      }
    }
  },
  methods: {
    clearFilter() {
      let _filters = { ...this.filters };
      if (_filters[this.field].operator) {
        _filters[this.field].constraints.splice(1);
        _filters[this.field].operator = this.defaultOperator;
        _filters[this.field].constraints[0] = { value: null, matchMode: this.defaultMatchMode };
      } else {
        _filters[this.field].value = null;
        _filters[this.field].matchMode = this.defaultMatchMode;
      }
      this.$emit("filter-clear");
      this.$emit("filter-change", _filters);
      this.$emit("filter-apply");
      this.hide();
    },
    applyFilter() {
      this.$emit("apply-click", { field: this.field, constraints: this.filters[this.field] });
      this.$emit("filter-apply");
      this.hide();
    },
    hasFilter() {
      if (this.filtersStore) {
        let fieldFilter = this.filtersStore[this.field];
        if (fieldFilter) {
          if (fieldFilter.operator)
            return !this.isFilterBlank(fieldFilter.constraints[0].value);
          else
            return !this.isFilterBlank(fieldFilter.value);
        }
      }
      return false;
    },
    hasRowFilter() {
      return this.filters[this.field] && !this.isFilterBlank(this.filters[this.field].value);
    },
    isFilterBlank(filter) {
      if (filter !== null && filter !== void 0) {
        if (typeof filter === "string" && filter.trim().length == 0 || filter instanceof Array && filter.length == 0)
          return true;
        else
          return false;
      }
      return true;
    },
    toggleMenu() {
      this.overlayVisible = !this.overlayVisible;
    },
    onToggleButtonKeyDown(event2) {
      switch (event2.code) {
        case "Enter":
        case "Space":
          this.toggleMenu();
          event2.preventDefault();
          break;
        case "Escape":
          this.overlayVisible = false;
          break;
      }
    },
    onRowMatchModeChange(matchMode) {
      let _filters = { ...this.filters };
      _filters[this.field].matchMode = matchMode;
      this.$emit("matchmode-change", { field: this.field, matchMode });
      this.$emit("filter-change", _filters);
      this.$emit("filter-apply");
      this.hide();
    },
    onRowMatchModeKeyDown(event2) {
      let item = event2.target;
      switch (event2.code) {
        case "ArrowDown":
          var nextItem = this.findNextItem(item);
          if (nextItem) {
            item.removeAttribute("tabindex");
            nextItem.tabIndex = "0";
            nextItem.focus();
          }
          event2.preventDefault();
          break;
        case "ArrowUp":
          var prevItem = this.findPrevItem(item);
          if (prevItem) {
            item.removeAttribute("tabindex");
            prevItem.tabIndex = "0";
            prevItem.focus();
          }
          event2.preventDefault();
          break;
      }
    },
    isRowMatchModeSelected(matchMode) {
      return this.filters[this.field].matchMode === matchMode;
    },
    onOperatorChange(value) {
      let _filters = { ...this.filters };
      _filters[this.field].operator = value;
      this.$emit("filter-change", _filters);
      this.$emit("operator-change", { field: this.field, operator: value });
      if (!this.showApplyButton) {
        this.$emit("filter-apply");
      }
    },
    onMenuMatchModeChange(value, index) {
      let _filters = { ...this.filters };
      _filters[this.field].constraints[index].matchMode = value;
      this.$emit("matchmode-change", { field: this.field, matchMode: value, index });
      if (!this.showApplyButton) {
        this.$emit("filter-apply");
      }
    },
    addConstraint() {
      let _filters = { ...this.filters };
      let newConstraint = { value: null, matchMode: this.defaultMatchMode };
      _filters[this.field].constraints.push(newConstraint);
      this.$emit("constraint-add", { field: this.field, constraing: newConstraint });
      this.$emit("filter-change", _filters);
      if (!this.showApplyButton) {
        this.$emit("filter-apply");
      }
    },
    removeConstraint(index) {
      let _filters = { ...this.filters };
      let removedConstraint = _filters[this.field].constraints.splice(index, 1);
      this.$emit("constraint-remove", { field: this.field, constraing: removedConstraint });
      this.$emit("filter-change", _filters);
      if (!this.showApplyButton) {
        this.$emit("filter-apply");
      }
    },
    filterCallback() {
      this.$emit("filter-apply");
    },
    findNextItem(item) {
      let nextItem = item.nextElementSibling;
      if (nextItem)
        return DomHandler.hasClass(nextItem, "p-column-filter-separator") ? this.findNextItem(nextItem) : nextItem;
      else
        return item.parentElement.firstElementChild;
    },
    findPrevItem(item) {
      let prevItem = item.previousElementSibling;
      if (prevItem)
        return DomHandler.hasClass(prevItem, "p-column-filter-separator") ? this.findPrevItem(prevItem) : prevItem;
      else
        return item.parentElement.lastElementChild;
    },
    hide() {
      this.overlayVisible = false;
      DomHandler.focus(this.$refs.icon);
    },
    onContentClick(event2) {
      this.selfClick = true;
      OverlayEventBus.emit("overlay-click", {
        originalEvent: event2,
        target: this.overlay
      });
    },
    onContentMouseDown() {
      this.selfClick = true;
    },
    onOverlayEnter(el) {
      if (this.filterMenuStyle) {
        DomHandler.applyStyle(this.overlay, this.filterMenuStyle);
      }
      ZIndexUtils.set("overlay", el, this.$primevue.config.zIndex.overlay);
      DomHandler.absolutePosition(this.overlay, this.$refs.icon);
      this.bindOutsideClickListener();
      this.bindScrollListener();
      this.bindResizeListener();
      this.overlayEventListener = (e) => {
        if (!this.isOutsideClicked(e.target)) {
          this.selfClick = true;
        }
      };
      OverlayEventBus.on("overlay-click", this.overlayEventListener);
    },
    onOverlayLeave() {
      this.onOverlayHide();
    },
    onOverlayAfterLeave(el) {
      ZIndexUtils.clear(el);
    },
    onOverlayHide() {
      this.unbindOutsideClickListener();
      this.unbindResizeListener();
      this.unbindScrollListener();
      this.overlay = null;
      OverlayEventBus.off("overlay-click", this.overlayEventListener);
      this.overlayEventListener = null;
    },
    overlayRef(el) {
      this.overlay = el;
    },
    isOutsideClicked(target) {
      return !this.isTargetClicked(target) && this.overlay && !(this.overlay.isSameNode(target) || this.overlay.contains(target));
    },
    isTargetClicked(target) {
      return this.$refs.icon && (this.$refs.icon.isSameNode(target) || this.$refs.icon.contains(target));
    },
    bindOutsideClickListener() {
      if (!this.outsideClickListener) {
        this.outsideClickListener = (event2) => {
          if (this.overlayVisible && !this.selfClick && this.isOutsideClicked(event2.target)) {
            this.overlayVisible = false;
          }
          this.selfClick = false;
        };
        document.addEventListener("click", this.outsideClickListener);
      }
    },
    unbindOutsideClickListener() {
      if (this.outsideClickListener) {
        document.removeEventListener("click", this.outsideClickListener);
        this.outsideClickListener = null;
        this.selfClick = false;
      }
    },
    bindScrollListener() {
      if (!this.scrollHandler) {
        this.scrollHandler = new ConnectedOverlayScrollHandler(this.$refs.icon, () => {
          if (this.overlayVisible) {
            this.hide();
          }
        });
      }
      this.scrollHandler.bindScrollListener();
    },
    unbindScrollListener() {
      if (this.scrollHandler) {
        this.scrollHandler.unbindScrollListener();
      }
    },
    bindResizeListener() {
      if (!this.resizeListener) {
        this.resizeListener = () => {
          if (this.overlayVisible && !DomHandler.isTouchDevice()) {
            this.hide();
          }
        };
        window.addEventListener("resize", this.resizeListener);
      }
    },
    unbindResizeListener() {
      if (this.resizeListener) {
        window.removeEventListener("resize", this.resizeListener);
        this.resizeListener = null;
      }
    }
  },
  computed: {
    containerClass() {
      return [
        "p-column-filter p-fluid",
        {
          "p-column-filter-row": this.display === "row",
          "p-column-filter-menu": this.display === "menu"
        }
      ];
    },
    overlayClass() {
      return [
        this.filterMenuClass,
        {
          "p-column-filter-overlay p-component p-fluid": true,
          "p-column-filter-overlay-menu": this.display === "menu",
          "p-input-filled": this.$primevue.config.inputStyle === "filled",
          "p-ripple-disabled": this.$primevue.config.ripple === false
        }
      ];
    },
    showMenuButton() {
      return this.showMenu && (this.display === "row" ? this.type !== "boolean" : true);
    },
    overlayId() {
      return UniqueComponentId();
    },
    matchModes() {
      return this.matchModeOptions || this.$primevue.config.filterMatchModeOptions[this.type].map((key) => {
        return { label: this.$primevue.config.locale[key], value: key };
      });
    },
    isShowMatchModes() {
      return this.type !== "boolean" && this.showMatchModes && this.matchModes;
    },
    operatorOptions() {
      return [
        { label: this.$primevue.config.locale.matchAll, value: FilterOperator.AND },
        { label: this.$primevue.config.locale.matchAny, value: FilterOperator.OR }
      ];
    },
    noFilterLabel() {
      return this.$primevue.config.locale ? this.$primevue.config.locale.noFilter : void 0;
    },
    isShowOperator() {
      return this.showOperator && this.filters[this.field].operator;
    },
    operator() {
      return this.filters[this.field].operator;
    },
    fieldConstraints() {
      return this.filters[this.field].constraints || [this.filters[this.field]];
    },
    showRemoveIcon() {
      return this.fieldConstraints.length > 1;
    },
    removeRuleButtonLabel() {
      return this.$primevue.config.locale ? this.$primevue.config.locale.removeRule : void 0;
    },
    addRuleButtonLabel() {
      return this.$primevue.config.locale ? this.$primevue.config.locale.addRule : void 0;
    },
    isShowAddConstraint() {
      return this.showAddButton && this.filters[this.field].operator && this.fieldConstraints && this.fieldConstraints.length < this.maxConstraints;
    },
    clearButtonLabel() {
      return this.$primevue.config.locale ? this.$primevue.config.locale.clear : void 0;
    },
    applyButtonLabel() {
      return this.$primevue.config.locale ? this.$primevue.config.locale.apply : void 0;
    },
    filterMenuButtonAriaLabel() {
      return this.$primevue.config.locale ? this.overlayVisible ? this.$primevue.config.locale.showFilterMenu : this.$primevue.config.locale.hideFilterMenu : void 0;
    },
    filterOperatorAriaLabel() {
      return this.$primevue.config.locale ? this.$primevue.config.locale.filterOperator : void 0;
    },
    filterConstraintAriaLabel() {
      return this.$primevue.config.locale ? this.$primevue.config.locale.filterConstraint : void 0;
    }
  },
  components: {
    CFDropdown: script$f,
    CFButton: script$i,
    Portal: script$h
  },
  directives: {
    focustrap: FocusTrap
  }
};
const _hoisted_1$4 = ["aria-label", "aria-expanded", "aria-controls"];
const _hoisted_2$4 = /* @__PURE__ */ createElementVNode("span", { class: "pi pi-filter-icon pi-filter" }, null, -1);
const _hoisted_3$3$1 = [
  _hoisted_2$4
];
const _hoisted_4$2$1 = /* @__PURE__ */ createElementVNode("span", { class: "pi pi-filter-slash" }, null, -1);
const _hoisted_5$1$1 = [
  _hoisted_4$2$1
];
const _hoisted_6$1$1 = ["id", "aria-modal"];
const _hoisted_7$3 = {
  key: 0,
  class: "p-column-filter-row-items"
};
const _hoisted_8$3 = ["onClick", "onKeydown", "tabindex"];
const _hoisted_9$2 = /* @__PURE__ */ createElementVNode("li", { class: "p-column-filter-separator" }, null, -1);
const _hoisted_10$2 = {
  key: 0,
  class: "p-column-filter-operator"
};
const _hoisted_11$2 = { class: "p-column-filter-constraints" };
const _hoisted_12$2 = {
  key: 1,
  class: "p-column-filter-add-rule"
};
const _hoisted_13$2 = { class: "p-column-filter-buttonbar" };
function render$4(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_CFDropdown = resolveComponent("CFDropdown");
  const _component_CFButton = resolveComponent("CFButton");
  const _component_Portal = resolveComponent("Portal");
  const _directive_focustrap = resolveDirective("focustrap");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.containerClass)
  }, [
    $props.display === "row" ? (openBlock(), createElementBlock("div", mergeProps({
      key: 0,
      class: "p-fluid p-column-filter-element"
    }, $props.filterInputProps), [
      (openBlock(), createBlock(resolveDynamicComponent($props.filterElement), {
        field: $props.field,
        filterModel: $props.filters[$props.field],
        filterCallback: $options.filterCallback
      }, null, 8, ["field", "filterModel", "filterCallback"]))
    ], 16)) : createCommentVNode("", true),
    $options.showMenuButton ? (openBlock(), createElementBlock("button", {
      key: 1,
      ref: "icon",
      type: "button",
      class: normalizeClass(["p-column-filter-menu-button p-link", { "p-column-filter-menu-button-open": $data.overlayVisible, "p-column-filter-menu-button-active": $options.hasFilter() }]),
      "aria-label": $options.filterMenuButtonAriaLabel,
      "aria-haspopup": "true",
      "aria-expanded": $data.overlayVisible,
      "aria-controls": $options.overlayId,
      onClick: _cache[0] || (_cache[0] = ($event) => $options.toggleMenu()),
      onKeydown: _cache[1] || (_cache[1] = ($event) => $options.onToggleButtonKeyDown($event))
    }, _hoisted_3$3$1, 42, _hoisted_1$4)) : createCommentVNode("", true),
    $props.showClearButton && $props.display === "row" ? (openBlock(), createElementBlock("button", {
      key: 2,
      class: normalizeClass([{ "p-hidden-space": !$options.hasRowFilter() }, "p-column-filter-clear-button p-link"]),
      type: "button",
      onClick: _cache[2] || (_cache[2] = ($event) => $options.clearFilter())
    }, _hoisted_5$1$1, 2)) : createCommentVNode("", true),
    createVNode(_component_Portal, null, {
      default: withCtx(() => [
        createVNode(Transition, {
          name: "p-connected-overlay",
          onEnter: $options.onOverlayEnter,
          onLeave: $options.onOverlayLeave,
          onAfterLeave: $options.onOverlayAfterLeave
        }, {
          default: withCtx(() => [
            $data.overlayVisible ? withDirectives((openBlock(), createElementBlock("div", {
              key: 0,
              ref: $options.overlayRef,
              id: $options.overlayId,
              "aria-modal": $data.overlayVisible,
              role: "dialog",
              class: normalizeClass($options.overlayClass),
              onKeydown: _cache[10] || (_cache[10] = withKeys((...args) => $options.hide && $options.hide(...args), ["escape"])),
              onClick: _cache[11] || (_cache[11] = (...args) => $options.onContentClick && $options.onContentClick(...args)),
              onMousedown: _cache[12] || (_cache[12] = (...args) => $options.onContentMouseDown && $options.onContentMouseDown(...args))
            }, [
              (openBlock(), createBlock(resolveDynamicComponent($props.filterHeaderTemplate), {
                field: $props.field,
                filterModel: $props.filters[$props.field],
                filterCallback: $options.filterCallback
              }, null, 8, ["field", "filterModel", "filterCallback"])),
              $props.display === "row" ? (openBlock(), createElementBlock("ul", _hoisted_7$3, [
                (openBlock(true), createElementBlock(Fragment$1, null, renderList($options.matchModes, (matchMode, i) => {
                  return openBlock(), createElementBlock("li", {
                    key: matchMode.label,
                    class: normalizeClass(["p-column-filter-row-item", { "p-highlight": $options.isRowMatchModeSelected(matchMode.value) }]),
                    onClick: ($event) => $options.onRowMatchModeChange(matchMode.value),
                    onKeydown: [
                      _cache[3] || (_cache[3] = ($event) => $options.onRowMatchModeKeyDown($event)),
                      withKeys(withModifiers(($event) => $options.onRowMatchModeChange(matchMode.value), ["prevent"]), ["enter"])
                    ],
                    tabindex: i === 0 ? "0" : null
                  }, toDisplayString(matchMode.label), 43, _hoisted_8$3);
                }), 128)),
                _hoisted_9$2,
                createElementVNode("li", {
                  class: "p-column-filter-row-item",
                  onClick: _cache[4] || (_cache[4] = ($event) => $options.clearFilter()),
                  onKeydown: [
                    _cache[5] || (_cache[5] = ($event) => $options.onRowMatchModeKeyDown($event)),
                    _cache[6] || (_cache[6] = withKeys(($event) => _ctx.onRowClearItemClick(), ["enter"]))
                  ]
                }, toDisplayString($options.noFilterLabel), 33)
              ])) : (openBlock(), createElementBlock(Fragment$1, { key: 1 }, [
                $options.isShowOperator ? (openBlock(), createElementBlock("div", _hoisted_10$2, [
                  createVNode(_component_CFDropdown, {
                    options: $options.operatorOptions,
                    modelValue: $options.operator,
                    "aria-label": $options.filterOperatorAriaLabel,
                    class: "p-column-filter-operator-dropdown",
                    optionLabel: "label",
                    optionValue: "value",
                    "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $options.onOperatorChange($event))
                  }, null, 8, ["options", "modelValue", "aria-label"])
                ])) : createCommentVNode("", true),
                createElementVNode("div", _hoisted_11$2, [
                  (openBlock(true), createElementBlock(Fragment$1, null, renderList($options.fieldConstraints, (fieldConstraint, i) => {
                    return openBlock(), createElementBlock("div", {
                      key: i,
                      class: "p-column-filter-constraint"
                    }, [
                      $options.isShowMatchModes ? (openBlock(), createBlock(_component_CFDropdown, {
                        key: 0,
                        options: $options.matchModes,
                        modelValue: fieldConstraint.matchMode,
                        class: "p-column-filter-matchmode-dropdown",
                        optionLabel: "label",
                        optionValue: "value",
                        "aria-label": $options.filterConstraintAriaLabel,
                        "onUpdate:modelValue": ($event) => $options.onMenuMatchModeChange($event, i)
                      }, null, 8, ["options", "modelValue", "aria-label", "onUpdate:modelValue"])) : createCommentVNode("", true),
                      $props.display === "menu" ? (openBlock(), createBlock(resolveDynamicComponent($props.filterElement), {
                        key: 1,
                        field: $props.field,
                        filterModel: fieldConstraint,
                        filterCallback: $options.filterCallback
                      }, null, 8, ["field", "filterModel", "filterCallback"])) : createCommentVNode("", true),
                      createElementVNode("div", null, [
                        $options.showRemoveIcon ? (openBlock(), createBlock(_component_CFButton, {
                          key: 0,
                          type: "button",
                          icon: "pi pi-trash",
                          class: "p-column-filter-remove-button p-button-text p-button-danger p-button-sm",
                          onClick: ($event) => $options.removeConstraint(i),
                          label: $options.removeRuleButtonLabel
                        }, null, 8, ["onClick", "label"])) : createCommentVNode("", true)
                      ])
                    ]);
                  }), 128))
                ]),
                $options.isShowAddConstraint ? (openBlock(), createElementBlock("div", _hoisted_12$2, [
                  createVNode(_component_CFButton, {
                    type: "button",
                    label: $options.addRuleButtonLabel,
                    icon: "pi pi-plus",
                    class: "p-column-filter-add-button p-button-text p-button-sm",
                    onClick: _cache[8] || (_cache[8] = ($event) => $options.addConstraint())
                  }, null, 8, ["label"])
                ])) : createCommentVNode("", true),
                createElementVNode("div", _hoisted_13$2, [
                  !$props.filterClearTemplate && $props.showClearButton ? (openBlock(), createBlock(_component_CFButton, {
                    key: 0,
                    type: "button",
                    class: "p-button-outlined p-button-sm",
                    label: $options.clearButtonLabel,
                    onClick: $options.clearFilter
                  }, null, 8, ["label", "onClick"])) : (openBlock(), createBlock(resolveDynamicComponent($props.filterClearTemplate), {
                    key: 1,
                    field: $props.field,
                    filterModel: $props.filters[$props.field],
                    filterCallback: $options.clearFilter
                  }, null, 8, ["field", "filterModel", "filterCallback"])),
                  $props.showApplyButton ? (openBlock(), createElementBlock(Fragment$1, { key: 2 }, [
                    !$props.filterApplyTemplate ? (openBlock(), createBlock(_component_CFButton, {
                      key: 0,
                      type: "button",
                      class: "p-button-sm",
                      label: $options.applyButtonLabel,
                      onClick: _cache[9] || (_cache[9] = ($event) => $options.applyFilter())
                    }, null, 8, ["label"])) : (openBlock(), createBlock(resolveDynamicComponent($props.filterApplyTemplate), {
                      key: 1,
                      field: $props.field,
                      filterModel: $props.filters[$props.field],
                      filterCallback: $options.applyFilter
                    }, null, 8, ["field", "filterModel", "filterCallback"]))
                  ], 64)) : createCommentVNode("", true)
                ])
              ], 64)),
              (openBlock(), createBlock(resolveDynamicComponent($props.filterFooterTemplate), {
                field: $props.field,
                filterModel: $props.filters[$props.field],
                filterCallback: $options.filterCallback
              }, null, 8, ["field", "filterModel", "filterCallback"]))
            ], 42, _hoisted_6$1$1)), [
              [_directive_focustrap, { autoFocus: true }]
            ]) : createCommentVNode("", true)
          ]),
          _: 1
        }, 8, ["onEnter", "onLeave", "onAfterLeave"])
      ]),
      _: 1
    })
  ], 2);
}
script$4$1.render = render$4;
var script$3$1 = {
  name: "HeaderCheckbox",
  emits: ["change"],
  props: {
    checked: null,
    disabled: null
  },
  data() {
    return {
      focused: false
    };
  },
  methods: {
    onClick(event2) {
      if (!this.disabled) {
        this.$emit("change", {
          originalEvent: event2,
          checked: !this.checked
        });
        DomHandler.focus(this.$refs.input);
      }
    },
    onFocus() {
      this.focused = true;
    },
    onBlur() {
      this.focused = false;
    }
  },
  computed: {
    headerCheckboxAriaLabel() {
      return this.$primevue.config.locale.aria ? this.checked ? this.$primevue.config.locale.aria.selectAll : this.$primevue.config.locale.aria.unselectAll : void 0;
    }
  }
};
const _hoisted_1$3$1 = { class: "p-hidden-accessible" };
const _hoisted_2$3$1 = ["checked", "disabled", "tabindex", "aria-label"];
function render$3$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["p-checkbox p-component", { "p-checkbox-focused": $data.focused, "p-disabled": $props.disabled }]),
    onClick: _cache[2] || (_cache[2] = (...args) => $options.onClick && $options.onClick(...args)),
    onKeydown: _cache[3] || (_cache[3] = withKeys(withModifiers((...args) => $options.onClick && $options.onClick(...args), ["prevent"]), ["space"]))
  }, [
    createElementVNode("div", _hoisted_1$3$1, [
      createElementVNode("input", {
        ref: "input",
        type: "checkbox",
        checked: $props.checked,
        disabled: $props.disabled,
        tabindex: $props.disabled ? null : "0",
        "aria-label": $options.headerCheckboxAriaLabel,
        onFocus: _cache[0] || (_cache[0] = ($event) => $options.onFocus($event)),
        onBlur: _cache[1] || (_cache[1] = ($event) => $options.onBlur($event))
      }, null, 40, _hoisted_2$3$1)
    ]),
    createElementVNode("div", {
      ref: "box",
      class: normalizeClass(["p-checkbox-box p-component", { "p-highlight": $props.checked, "p-disabled": $props.disabled, "p-focus": $data.focused }])
    }, [
      createElementVNode("span", {
        class: normalizeClass(["p-checkbox-icon", { "pi pi-check": $props.checked }])
      }, null, 2)
    ], 2)
  ], 34);
}
script$3$1.render = render$3$1;
var script$2$1 = {
  name: "HeaderCell",
  emits: [
    "column-click",
    "column-mousedown",
    "column-dragstart",
    "column-dragover",
    "column-dragleave",
    "column-drop",
    "column-resizestart",
    "checkbox-change",
    "filter-change",
    "filter-apply",
    "operator-change",
    "matchmode-change",
    "constraint-add",
    "constraint-remove",
    "filter-clear",
    "apply-click"
  ],
  props: {
    column: {
      type: Object,
      default: null
    },
    resizableColumns: {
      type: Boolean,
      default: false
    },
    groupRowsBy: {
      type: [Array, String, Function],
      default: null
    },
    sortMode: {
      type: String,
      default: "single"
    },
    groupRowSortField: {
      type: [String, Function],
      default: null
    },
    sortField: {
      type: [String, Function],
      default: null
    },
    sortOrder: {
      type: Number,
      default: null
    },
    multiSortMeta: {
      type: Array,
      default: null
    },
    allRowsSelected: {
      type: Boolean,
      default: false
    },
    empty: {
      type: Boolean,
      default: false
    },
    filterDisplay: {
      type: String,
      default: null
    },
    filters: {
      type: Object,
      default: null
    },
    filtersStore: {
      type: Object,
      default: null
    },
    filterColumn: {
      type: Boolean,
      default: false
    },
    reorderableColumns: {
      type: Boolean,
      default: false
    },
    filterInputProps: {
      type: null,
      default: null
    }
  },
  data() {
    return {
      styleObject: {}
    };
  },
  mounted() {
    if (this.columnProp("frozen")) {
      this.updateStickyPosition();
    }
  },
  updated() {
    if (this.columnProp("frozen")) {
      this.updateStickyPosition();
    }
  },
  methods: {
    columnProp(prop) {
      return ObjectUtils.getVNodeProp(this.column, prop);
    },
    onClick(event2) {
      this.$emit("column-click", { originalEvent: event2, column: this.column });
    },
    onKeyDown(event2) {
      if ((event2.code === "Enter" || event2.code === "Space") && event2.currentTarget.nodeName === "TH" && DomHandler.hasClass(event2.currentTarget, "p-sortable-column")) {
        this.$emit("column-click", { originalEvent: event2, column: this.column });
        event2.preventDefault();
      }
    },
    onMouseDown(event2) {
      this.$emit("column-mousedown", { originalEvent: event2, column: this.column });
    },
    onDragStart(event2) {
      this.$emit("column-dragstart", event2);
    },
    onDragOver(event2) {
      this.$emit("column-dragover", event2);
    },
    onDragLeave(event2) {
      this.$emit("column-dragleave", event2);
    },
    onDrop(event2) {
      this.$emit("column-drop", event2);
    },
    onResizeStart(event2) {
      this.$emit("column-resizestart", event2);
    },
    getMultiSortMetaIndex() {
      return this.multiSortMeta.findIndex((meta) => meta.field === this.columnProp("field") || meta.field === this.columnProp("sortField"));
    },
    getBadgeValue() {
      let index = this.getMultiSortMetaIndex();
      return this.groupRowsBy && this.groupRowsBy === this.groupRowSortField && index > -1 ? index : index + 1;
    },
    isMultiSorted() {
      return this.sortMode === "multiple" && this.columnProp("sortable") && this.getMultiSortMetaIndex() > -1;
    },
    isColumnSorted() {
      return this.sortMode === "single" ? this.sortField && (this.sortField === this.columnProp("field") || this.sortField === this.columnProp("sortField")) : this.isMultiSorted();
    },
    updateStickyPosition() {
      if (this.columnProp("frozen")) {
        let align = this.columnProp("alignFrozen");
        if (align === "right") {
          let right = 0;
          let next = this.$el.nextElementSibling;
          if (next) {
            right = DomHandler.getOuterWidth(next) + parseFloat(next.style.right || 0);
          }
          this.styleObject.right = right + "px";
        } else {
          let left = 0;
          let prev = this.$el.previousElementSibling;
          if (prev) {
            left = DomHandler.getOuterWidth(prev) + parseFloat(prev.style.left || 0);
          }
          this.styleObject.left = left + "px";
        }
        let filterRow = this.$el.parentElement.nextElementSibling;
        if (filterRow) {
          let index = DomHandler.index(this.$el);
          filterRow.children[index].style.left = this.styleObject.left;
          filterRow.children[index].style.right = this.styleObject.right;
        }
      }
    },
    onHeaderCheckboxChange(event2) {
      this.$emit("checkbox-change", event2);
    }
  },
  computed: {
    containerClass() {
      return [
        this.filterColumn ? this.columnProp("filterHeaderClass") : this.columnProp("headerClass"),
        this.columnProp("class"),
        {
          "p-sortable-column": this.columnProp("sortable"),
          "p-resizable-column": this.resizableColumns,
          "p-highlight": this.isColumnSorted(),
          "p-filter-column": this.filterColumn,
          "p-frozen-column": this.columnProp("frozen"),
          "p-reorderable-column": this.reorderableColumns
        }
      ];
    },
    containerStyle() {
      let headerStyle = this.filterColumn ? this.columnProp("filterHeaderStyle") : this.columnProp("headerStyle");
      let columnStyle = this.columnProp("style");
      return this.columnProp("frozen") ? [columnStyle, headerStyle, this.styleObject] : [columnStyle, headerStyle];
    },
    sortableColumnIcon() {
      let sorted = false;
      let sortOrder = null;
      if (this.sortMode === "single") {
        sorted = this.sortField && (this.sortField === this.columnProp("field") || this.sortField === this.columnProp("sortField"));
        sortOrder = sorted ? this.sortOrder : 0;
      } else if (this.sortMode === "multiple") {
        let metaIndex = this.getMultiSortMetaIndex();
        if (metaIndex > -1) {
          sorted = true;
          sortOrder = this.multiSortMeta[metaIndex].order;
        }
      }
      return [
        "p-sortable-column-icon pi pi-fw",
        {
          "pi-sort-alt": !sorted,
          "pi-sort-amount-up-alt": sorted && sortOrder > 0,
          "pi-sort-amount-down": sorted && sortOrder < 0
        }
      ];
    },
    ariaSort() {
      if (this.columnProp("sortable")) {
        const sortIcon = this.sortableColumnIcon;
        if (sortIcon[1]["pi-sort-amount-down"])
          return "descending";
        else if (sortIcon[1]["pi-sort-amount-up-alt"])
          return "ascending";
        else
          return "none";
      } else {
        return null;
      }
    }
  },
  components: {
    DTHeaderCheckbox: script$3$1,
    DTColumnFilter: script$4$1
  }
};
const _hoisted_1$2$1 = ["tabindex", "colspan", "rowspan", "aria-sort"];
const _hoisted_2$2$1 = { class: "p-column-header-content" };
const _hoisted_3$2$1 = {
  key: 1,
  class: "p-column-title"
};
const _hoisted_4$1$3 = {
  key: 3,
  class: "p-sortable-column-badge"
};
function render$2$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_DTHeaderCheckbox = resolveComponent("DTHeaderCheckbox");
  const _component_DTColumnFilter = resolveComponent("DTColumnFilter");
  return openBlock(), createElementBlock("th", {
    style: normalizeStyle($options.containerStyle),
    class: normalizeClass($options.containerClass),
    tabindex: $options.columnProp("sortable") ? "0" : null,
    role: "columnheader",
    colspan: $options.columnProp("colspan"),
    rowspan: $options.columnProp("rowspan"),
    "aria-sort": $options.ariaSort,
    onClick: _cache[8] || (_cache[8] = (...args) => $options.onClick && $options.onClick(...args)),
    onKeydown: _cache[9] || (_cache[9] = (...args) => $options.onKeyDown && $options.onKeyDown(...args)),
    onMousedown: _cache[10] || (_cache[10] = (...args) => $options.onMouseDown && $options.onMouseDown(...args)),
    onDragstart: _cache[11] || (_cache[11] = (...args) => $options.onDragStart && $options.onDragStart(...args)),
    onDragover: _cache[12] || (_cache[12] = (...args) => $options.onDragOver && $options.onDragOver(...args)),
    onDragleave: _cache[13] || (_cache[13] = (...args) => $options.onDragLeave && $options.onDragLeave(...args)),
    onDrop: _cache[14] || (_cache[14] = (...args) => $options.onDrop && $options.onDrop(...args))
  }, [
    $props.resizableColumns && !$options.columnProp("frozen") ? (openBlock(), createElementBlock("span", {
      key: 0,
      class: "p-column-resizer",
      onMousedown: _cache[0] || (_cache[0] = (...args) => $options.onResizeStart && $options.onResizeStart(...args))
    }, null, 32)) : createCommentVNode("", true),
    createElementVNode("div", _hoisted_2$2$1, [
      $props.column.children && $props.column.children.header ? (openBlock(), createBlock(resolveDynamicComponent($props.column.children.header), {
        key: 0,
        column: $props.column
      }, null, 8, ["column"])) : createCommentVNode("", true),
      $options.columnProp("header") ? (openBlock(), createElementBlock("span", _hoisted_3$2$1, toDisplayString($options.columnProp("header")), 1)) : createCommentVNode("", true),
      $options.columnProp("sortable") ? (openBlock(), createElementBlock("span", {
        key: 2,
        class: normalizeClass($options.sortableColumnIcon)
      }, null, 2)) : createCommentVNode("", true),
      $options.isMultiSorted() ? (openBlock(), createElementBlock("span", _hoisted_4$1$3, toDisplayString($options.getBadgeValue()), 1)) : createCommentVNode("", true),
      $options.columnProp("selectionMode") === "multiple" && $props.filterDisplay !== "row" ? (openBlock(), createBlock(_component_DTHeaderCheckbox, {
        key: 4,
        checked: $props.allRowsSelected,
        onChange: $options.onHeaderCheckboxChange,
        disabled: $props.empty
      }, null, 8, ["checked", "onChange", "disabled"])) : createCommentVNode("", true),
      $props.filterDisplay === "menu" && $props.column.children && $props.column.children.filter ? (openBlock(), createBlock(_component_DTColumnFilter, {
        key: 5,
        field: $options.columnProp("filterField") || $options.columnProp("field"),
        type: $options.columnProp("dataType"),
        display: "menu",
        showMenu: $options.columnProp("showFilterMenu"),
        filterElement: $props.column.children && $props.column.children.filter,
        filterHeaderTemplate: $props.column.children && $props.column.children.filterheader,
        filterFooterTemplate: $props.column.children && $props.column.children.filterfooter,
        filterClearTemplate: $props.column.children && $props.column.children.filterclear,
        filterApplyTemplate: $props.column.children && $props.column.children.filterapply,
        filters: $props.filters,
        filtersStore: $props.filtersStore,
        filterInputProps: $props.filterInputProps,
        onFilterChange: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("filter-change", $event)),
        onFilterApply: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("filter-apply")),
        filterMenuStyle: $options.columnProp("filterMenuStyle"),
        filterMenuClass: $options.columnProp("filterMenuClass"),
        showOperator: $options.columnProp("showFilterOperator"),
        showClearButton: $options.columnProp("showClearButton"),
        showApplyButton: $options.columnProp("showApplyButton"),
        showMatchModes: $options.columnProp("showFilterMatchModes"),
        showAddButton: $options.columnProp("showAddButton"),
        matchModeOptions: $options.columnProp("filterMatchModeOptions"),
        maxConstraints: $options.columnProp("maxConstraints"),
        onOperatorChange: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("operator-change", $event)),
        onMatchmodeChange: _cache[4] || (_cache[4] = ($event) => _ctx.$emit("matchmode-change", $event)),
        onConstraintAdd: _cache[5] || (_cache[5] = ($event) => _ctx.$emit("constraint-add", $event)),
        onConstraintRemove: _cache[6] || (_cache[6] = ($event) => _ctx.$emit("constraint-remove", $event)),
        onApplyClick: _cache[7] || (_cache[7] = ($event) => _ctx.$emit("apply-click", $event))
      }, null, 8, ["field", "type", "showMenu", "filterElement", "filterHeaderTemplate", "filterFooterTemplate", "filterClearTemplate", "filterApplyTemplate", "filters", "filtersStore", "filterInputProps", "filterMenuStyle", "filterMenuClass", "showOperator", "showClearButton", "showApplyButton", "showMatchModes", "showAddButton", "matchModeOptions", "maxConstraints"])) : createCommentVNode("", true)
    ])
  ], 46, _hoisted_1$2$1);
}
script$2$1.render = render$2$1;
var script$1$3 = {
  name: "TableHeader",
  emits: [
    "column-click",
    "column-mousedown",
    "column-dragstart",
    "column-dragover",
    "column-dragleave",
    "column-drop",
    "column-resizestart",
    "checkbox-change",
    "filter-change",
    "filter-apply",
    "operator-change",
    "matchmode-change",
    "constraint-add",
    "constraint-remove",
    "filter-clear",
    "apply-click"
  ],
  props: {
    columnGroup: {
      type: null,
      default: null
    },
    columns: {
      type: null,
      default: null
    },
    rowGroupMode: {
      type: String,
      default: null
    },
    groupRowsBy: {
      type: [Array, String, Function],
      default: null
    },
    resizableColumns: {
      type: Boolean,
      default: false
    },
    allRowsSelected: {
      type: Boolean,
      default: false
    },
    empty: {
      type: Boolean,
      default: false
    },
    sortMode: {
      type: String,
      default: "single"
    },
    groupRowSortField: {
      type: [String, Function],
      default: null
    },
    sortField: {
      type: [String, Function],
      default: null
    },
    sortOrder: {
      type: Number,
      default: null
    },
    multiSortMeta: {
      type: Array,
      default: null
    },
    filterDisplay: {
      type: String,
      default: null
    },
    filters: {
      type: Object,
      default: null
    },
    filtersStore: {
      type: Object,
      default: null
    },
    reorderableColumns: {
      type: Boolean,
      default: false
    },
    filterInputProps: {
      type: null,
      default: null
    }
  },
  methods: {
    columnProp(col, prop) {
      return ObjectUtils.getVNodeProp(col, prop);
    },
    getFilterColumnHeaderClass(column) {
      return [
        "p-filter-column",
        this.columnProp(column, "filterHeaderClass"),
        this.columnProp(column, "class"),
        {
          "p-frozen-column": this.columnProp(column, "frozen")
        }
      ];
    },
    getFilterColumnHeaderStyle(column) {
      return [this.columnProp(column, "filterHeaderStyle"), this.columnProp(column, "style")];
    },
    getHeaderRows() {
      let rows = [];
      let columnGroup = this.columnGroup;
      if (columnGroup.children && columnGroup.children.default) {
        for (let child of columnGroup.children.default()) {
          if (child.type.name === "Row") {
            rows.push(child);
          } else if (child.children && child.children instanceof Array) {
            rows = child.children;
          }
        }
        return rows;
      }
    },
    getHeaderColumns(row) {
      let cols = [];
      if (row.children && row.children.default) {
        row.children.default().forEach((child) => {
          if (child.children && child.children instanceof Array)
            cols = [...cols, ...child.children];
          else if (child.type.name === "Column")
            cols.push(child);
        });
        return cols;
      }
    }
  },
  components: {
    DTHeaderCell: script$2$1,
    DTHeaderCheckbox: script$3$1,
    DTColumnFilter: script$4$1
  }
};
const _hoisted_1$1$3 = {
  class: "p-datatable-thead",
  role: "rowgroup"
};
const _hoisted_2$1$3 = { role: "row" };
const _hoisted_3$1$3 = {
  key: 0,
  role: "row"
};
function render$1$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_DTHeaderCell = resolveComponent("DTHeaderCell");
  const _component_DTHeaderCheckbox = resolveComponent("DTHeaderCheckbox");
  const _component_DTColumnFilter = resolveComponent("DTColumnFilter");
  return openBlock(), createElementBlock("thead", _hoisted_1$1$3, [
    !$props.columnGroup ? (openBlock(), createElementBlock(Fragment$1, { key: 0 }, [
      createElementVNode("tr", _hoisted_2$1$3, [
        (openBlock(true), createElementBlock(Fragment$1, null, renderList($props.columns, (col, i) => {
          return openBlock(), createElementBlock(Fragment$1, {
            key: $options.columnProp(col, "columnKey") || $options.columnProp(col, "field") || i
          }, [
            !$options.columnProp(col, "hidden") && ($props.rowGroupMode !== "subheader" || $props.groupRowsBy !== $options.columnProp(col, "field")) ? (openBlock(), createBlock(_component_DTHeaderCell, {
              key: 0,
              column: col,
              onColumnClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("column-click", $event)),
              onColumnMousedown: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("column-mousedown", $event)),
              onColumnDragstart: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("column-dragstart", $event)),
              onColumnDragover: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("column-dragover", $event)),
              onColumnDragleave: _cache[4] || (_cache[4] = ($event) => _ctx.$emit("column-dragleave", $event)),
              onColumnDrop: _cache[5] || (_cache[5] = ($event) => _ctx.$emit("column-drop", $event)),
              groupRowsBy: $props.groupRowsBy,
              groupRowSortField: $props.groupRowSortField,
              reorderableColumns: $props.reorderableColumns,
              resizableColumns: $props.resizableColumns,
              onColumnResizestart: _cache[6] || (_cache[6] = ($event) => _ctx.$emit("column-resizestart", $event)),
              sortMode: $props.sortMode,
              sortField: $props.sortField,
              sortOrder: $props.sortOrder,
              multiSortMeta: $props.multiSortMeta,
              allRowsSelected: $props.allRowsSelected,
              empty: $props.empty,
              onCheckboxChange: _cache[7] || (_cache[7] = ($event) => _ctx.$emit("checkbox-change", $event)),
              filters: $props.filters,
              filterDisplay: $props.filterDisplay,
              filtersStore: $props.filtersStore,
              filterInputProps: $props.filterInputProps,
              onFilterChange: _cache[8] || (_cache[8] = ($event) => _ctx.$emit("filter-change", $event)),
              onFilterApply: _cache[9] || (_cache[9] = ($event) => _ctx.$emit("filter-apply")),
              onOperatorChange: _cache[10] || (_cache[10] = ($event) => _ctx.$emit("operator-change", $event)),
              onMatchmodeChange: _cache[11] || (_cache[11] = ($event) => _ctx.$emit("matchmode-change", $event)),
              onConstraintAdd: _cache[12] || (_cache[12] = ($event) => _ctx.$emit("constraint-add", $event)),
              onConstraintRemove: _cache[13] || (_cache[13] = ($event) => _ctx.$emit("constraint-remove", $event)),
              onApplyClick: _cache[14] || (_cache[14] = ($event) => _ctx.$emit("apply-click", $event))
            }, null, 8, ["column", "groupRowsBy", "groupRowSortField", "reorderableColumns", "resizableColumns", "sortMode", "sortField", "sortOrder", "multiSortMeta", "allRowsSelected", "empty", "filters", "filterDisplay", "filtersStore", "filterInputProps"])) : createCommentVNode("", true)
          ], 64);
        }), 128))
      ]),
      $props.filterDisplay === "row" ? (openBlock(), createElementBlock("tr", _hoisted_3$1$3, [
        (openBlock(true), createElementBlock(Fragment$1, null, renderList($props.columns, (col, i) => {
          return openBlock(), createElementBlock(Fragment$1, {
            key: $options.columnProp(col, "columnKey") || $options.columnProp(col, "field") || i
          }, [
            !$options.columnProp(col, "hidden") && ($props.rowGroupMode !== "subheader" || $props.groupRowsBy !== $options.columnProp(col, "field")) ? (openBlock(), createElementBlock("th", {
              key: 0,
              style: normalizeStyle($options.getFilterColumnHeaderStyle(col)),
              class: normalizeClass($options.getFilterColumnHeaderClass(col))
            }, [
              $options.columnProp(col, "selectionMode") === "multiple" ? (openBlock(), createBlock(_component_DTHeaderCheckbox, {
                key: 0,
                checked: $props.allRowsSelected,
                disabled: $props.empty,
                onChange: _cache[15] || (_cache[15] = ($event) => _ctx.$emit("checkbox-change", $event))
              }, null, 8, ["checked", "disabled"])) : createCommentVNode("", true),
              col.children && col.children.filter ? (openBlock(), createBlock(_component_DTColumnFilter, {
                key: 1,
                field: $options.columnProp(col, "filterField") || $options.columnProp(col, "field"),
                type: $options.columnProp(col, "dataType"),
                display: "row",
                showMenu: $options.columnProp(col, "showFilterMenu"),
                filterElement: col.children && col.children.filter,
                filterHeaderTemplate: col.children && col.children.filterheader,
                filterFooterTemplate: col.children && col.children.filterfooter,
                filterClearTemplate: col.children && col.children.filterclear,
                filterApplyTemplate: col.children && col.children.filterapply,
                filters: $props.filters,
                filtersStore: $props.filtersStore,
                filterInputProps: $props.filterInputProps,
                onFilterChange: _cache[16] || (_cache[16] = ($event) => _ctx.$emit("filter-change", $event)),
                onFilterApply: _cache[17] || (_cache[17] = ($event) => _ctx.$emit("filter-apply")),
                filterMenuStyle: $options.columnProp(col, "filterMenuStyle"),
                filterMenuClass: $options.columnProp(col, "filterMenuClass"),
                showOperator: $options.columnProp(col, "showFilterOperator"),
                showClearButton: $options.columnProp(col, "showClearButton"),
                showApplyButton: $options.columnProp(col, "showApplyButton"),
                showMatchModes: $options.columnProp(col, "showFilterMatchModes"),
                showAddButton: $options.columnProp(col, "showAddButton"),
                matchModeOptions: $options.columnProp(col, "filterMatchModeOptions"),
                maxConstraints: $options.columnProp(col, "maxConstraints"),
                onOperatorChange: _cache[18] || (_cache[18] = ($event) => _ctx.$emit("operator-change", $event)),
                onMatchmodeChange: _cache[19] || (_cache[19] = ($event) => _ctx.$emit("matchmode-change", $event)),
                onConstraintAdd: _cache[20] || (_cache[20] = ($event) => _ctx.$emit("constraint-add", $event)),
                onConstraintRemove: _cache[21] || (_cache[21] = ($event) => _ctx.$emit("constraint-remove", $event)),
                onApplyClick: _cache[22] || (_cache[22] = ($event) => _ctx.$emit("apply-click", $event))
              }, null, 8, ["field", "type", "showMenu", "filterElement", "filterHeaderTemplate", "filterFooterTemplate", "filterClearTemplate", "filterApplyTemplate", "filters", "filtersStore", "filterInputProps", "filterMenuStyle", "filterMenuClass", "showOperator", "showClearButton", "showApplyButton", "showMatchModes", "showAddButton", "matchModeOptions", "maxConstraints"])) : createCommentVNode("", true)
            ], 6)) : createCommentVNode("", true)
          ], 64);
        }), 128))
      ])) : createCommentVNode("", true)
    ], 64)) : (openBlock(true), createElementBlock(Fragment$1, { key: 1 }, renderList($options.getHeaderRows(), (row, i) => {
      return openBlock(), createElementBlock("tr", {
        key: i,
        role: "row"
      }, [
        (openBlock(true), createElementBlock(Fragment$1, null, renderList($options.getHeaderColumns(row), (col, j) => {
          return openBlock(), createElementBlock(Fragment$1, {
            key: $options.columnProp(col, "columnKey") || $options.columnProp(col, "field") || j
          }, [
            !$options.columnProp(col, "hidden") && ($props.rowGroupMode !== "subheader" || $props.groupRowsBy !== $options.columnProp(col, "field")) && typeof col.children !== "string" ? (openBlock(), createBlock(_component_DTHeaderCell, {
              key: 0,
              column: col,
              onColumnClick: _cache[23] || (_cache[23] = ($event) => _ctx.$emit("column-click", $event)),
              onColumnMousedown: _cache[24] || (_cache[24] = ($event) => _ctx.$emit("column-mousedown", $event)),
              groupRowsBy: $props.groupRowsBy,
              groupRowSortField: $props.groupRowSortField,
              sortMode: $props.sortMode,
              sortField: $props.sortField,
              sortOrder: $props.sortOrder,
              multiSortMeta: $props.multiSortMeta,
              allRowsSelected: $props.allRowsSelected,
              empty: $props.empty,
              onCheckboxChange: _cache[25] || (_cache[25] = ($event) => _ctx.$emit("checkbox-change", $event)),
              filters: $props.filters,
              filterDisplay: $props.filterDisplay,
              filtersStore: $props.filtersStore,
              onFilterChange: _cache[26] || (_cache[26] = ($event) => _ctx.$emit("filter-change", $event)),
              onFilterApply: _cache[27] || (_cache[27] = ($event) => _ctx.$emit("filter-apply")),
              onOperatorChange: _cache[28] || (_cache[28] = ($event) => _ctx.$emit("operator-change", $event)),
              onMatchmodeChange: _cache[29] || (_cache[29] = ($event) => _ctx.$emit("matchmode-change", $event)),
              onConstraintAdd: _cache[30] || (_cache[30] = ($event) => _ctx.$emit("constraint-add", $event)),
              onConstraintRemove: _cache[31] || (_cache[31] = ($event) => _ctx.$emit("constraint-remove", $event)),
              onApplyClick: _cache[32] || (_cache[32] = ($event) => _ctx.$emit("apply-click", $event))
            }, null, 8, ["column", "groupRowsBy", "groupRowSortField", "sortMode", "sortField", "sortOrder", "multiSortMeta", "allRowsSelected", "empty", "filters", "filterDisplay", "filtersStore"])) : createCommentVNode("", true)
          ], 64);
        }), 128))
      ]);
    }), 128))
  ]);
}
script$1$3.render = render$1$3;
var script$b = {
  name: "DataTable",
  emits: [
    "value-change",
    "update:first",
    "update:rows",
    "page",
    "update:sortField",
    "update:sortOrder",
    "update:multiSortMeta",
    "sort",
    "filter",
    "row-click",
    "row-dblclick",
    "update:selection",
    "row-select",
    "row-unselect",
    "update:contextMenuSelection",
    "row-contextmenu",
    "row-unselect-all",
    "row-select-all",
    "select-all-change",
    "column-resize-end",
    "column-reorder",
    "row-reorder",
    "update:expandedRows",
    "row-collapse",
    "row-expand",
    "update:expandedRowGroups",
    "rowgroup-collapse",
    "rowgroup-expand",
    "update:filters",
    "state-restore",
    "state-save",
    "cell-edit-init",
    "cell-edit-complete",
    "cell-edit-cancel",
    "update:editingRows",
    "row-edit-init",
    "row-edit-save",
    "row-edit-cancel"
  ],
  props: {
    value: {
      type: Array,
      default: null
    },
    dataKey: {
      type: [String, Function],
      default: null
    },
    rows: {
      type: Number,
      default: 0
    },
    first: {
      type: Number,
      default: 0
    },
    totalRecords: {
      type: Number,
      default: 0
    },
    paginator: {
      type: Boolean,
      default: false
    },
    paginatorPosition: {
      type: String,
      default: "bottom"
    },
    alwaysShowPaginator: {
      type: Boolean,
      default: true
    },
    paginatorTemplate: {
      type: [Object, String],
      default: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
    },
    pageLinkSize: {
      type: Number,
      default: 5
    },
    rowsPerPageOptions: {
      type: Array,
      default: null
    },
    currentPageReportTemplate: {
      type: String,
      default: "({currentPage} of {totalPages})"
    },
    lazy: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingIcon: {
      type: String,
      default: "pi pi-spinner"
    },
    sortField: {
      type: [String, Function],
      default: null
    },
    sortOrder: {
      type: Number,
      default: null
    },
    defaultSortOrder: {
      type: Number,
      default: 1
    },
    multiSortMeta: {
      type: Array,
      default: null
    },
    sortMode: {
      type: String,
      default: "single"
    },
    removableSort: {
      type: Boolean,
      default: false
    },
    filters: {
      type: Object,
      default: null
    },
    filterDisplay: {
      type: String,
      default: null
    },
    globalFilterFields: {
      type: Array,
      default: null
    },
    filterLocale: {
      type: String,
      default: void 0
    },
    selection: {
      type: [Array, Object],
      default: null
    },
    selectionMode: {
      type: String,
      default: null
    },
    compareSelectionBy: {
      type: String,
      default: "deepEquals"
    },
    metaKeySelection: {
      type: Boolean,
      default: true
    },
    contextMenu: {
      type: Boolean,
      default: false
    },
    contextMenuSelection: {
      type: Object,
      default: null
    },
    selectAll: {
      type: Boolean,
      default: null
    },
    rowHover: {
      type: Boolean,
      default: false
    },
    csvSeparator: {
      type: String,
      default: ","
    },
    exportFilename: {
      type: String,
      default: "download"
    },
    exportFunction: {
      type: Function,
      default: null
    },
    resizableColumns: {
      type: Boolean,
      default: false
    },
    columnResizeMode: {
      type: String,
      default: "fit"
    },
    reorderableColumns: {
      type: Boolean,
      default: false
    },
    expandedRows: {
      type: Array,
      default: null
    },
    expandedRowIcon: {
      type: String,
      default: "pi-chevron-down"
    },
    collapsedRowIcon: {
      type: String,
      default: "pi-chevron-right"
    },
    rowGroupMode: {
      type: String,
      default: null
    },
    groupRowsBy: {
      type: [Array, String, Function],
      default: null
    },
    expandableRowGroups: {
      type: Boolean,
      default: false
    },
    expandedRowGroups: {
      type: Array,
      default: null
    },
    stateStorage: {
      type: String,
      default: "session"
    },
    stateKey: {
      type: String,
      default: null
    },
    editMode: {
      type: String,
      default: null
    },
    editingRows: {
      type: Array,
      default: null
    },
    rowClass: {
      type: null,
      default: null
    },
    rowStyle: {
      type: null,
      default: null
    },
    scrollable: {
      type: Boolean,
      default: false
    },
    virtualScrollerOptions: {
      type: Object,
      default: null
    },
    scrollHeight: {
      type: String,
      default: null
    },
    frozenValue: {
      type: Array,
      default: null
    },
    responsiveLayout: {
      type: String,
      default: "scroll"
    },
    breakpoint: {
      type: String,
      default: "960px"
    },
    showGridlines: {
      type: Boolean,
      default: false
    },
    stripedRows: {
      type: Boolean,
      default: false
    },
    tableStyle: {
      type: null,
      default: null
    },
    tableClass: {
      type: String,
      default: null
    },
    tableProps: {
      type: null,
      default: null
    },
    filterInputProps: {
      type: null,
      default: null
    }
  },
  data() {
    return {
      d_first: this.first,
      d_rows: this.rows,
      d_sortField: this.sortField,
      d_sortOrder: this.sortOrder,
      d_multiSortMeta: this.multiSortMeta ? [...this.multiSortMeta] : [],
      d_groupRowsSortMeta: null,
      d_selectionKeys: null,
      d_expandedRowKeys: null,
      d_columnOrder: null,
      d_editingRowKeys: null,
      d_editingMeta: {},
      d_filters: this.cloneFilters(this.filters)
    };
  },
  rowTouched: false,
  anchorRowIndex: null,
  rangeRowIndex: null,
  documentColumnResizeListener: null,
  documentColumnResizeEndListener: null,
  lastResizeHelperX: null,
  resizeColumnElement: null,
  columnResizing: false,
  colReorderIconWidth: null,
  colReorderIconHeight: null,
  draggedColumn: null,
  draggedRowIndex: null,
  droppedRowIndex: null,
  rowDragging: null,
  columnWidthsState: null,
  tableWidthState: null,
  columnWidthsRestored: false,
  watch: {
    first(newValue) {
      this.d_first = newValue;
    },
    rows(newValue) {
      this.d_rows = newValue;
    },
    sortField(newValue) {
      this.d_sortField = newValue;
    },
    sortOrder(newValue) {
      this.d_sortOrder = newValue;
    },
    multiSortMeta(newValue) {
      this.d_multiSortMeta = newValue;
    },
    selection: {
      immediate: true,
      handler(newValue) {
        if (this.dataKey) {
          this.updateSelectionKeys(newValue);
        }
      }
    },
    expandedRows(newValue) {
      if (this.dataKey) {
        this.updateExpandedRowKeys(newValue);
      }
    },
    editingRows(newValue) {
      if (this.dataKey) {
        this.updateEditingRowKeys(newValue);
      }
    },
    filters: {
      deep: true,
      handler: function(newValue) {
        this.d_filters = this.cloneFilters(newValue);
      }
    }
  },
  beforeMount() {
    if (this.isStateful()) {
      this.restoreState();
    }
  },
  mounted() {
    this.$el.setAttribute(this.attributeSelector, "");
    if (this.responsiveLayout === "stack" && !this.scrollable) {
      this.createResponsiveStyle();
    }
    if (this.isStateful() && this.resizableColumns) {
      this.restoreColumnWidths();
    }
    if (this.editMode === "row" && this.dataKey && !this.d_editingRowKeys) {
      this.updateEditingRowKeys(this.editingRows);
    }
  },
  beforeUnmount() {
    this.unbindColumnResizeEvents();
    this.destroyStyleElement();
    this.destroyResponsiveStyle();
  },
  updated() {
    if (this.isStateful()) {
      this.saveState();
    }
    if (this.editMode === "row" && this.dataKey && !this.d_editingRowKeys) {
      this.updateEditingRowKeys(this.editingRows);
    }
  },
  methods: {
    columnProp(col, prop) {
      return ObjectUtils.getVNodeProp(col, prop);
    },
    onPage(event2) {
      this.clearEditingMetaData();
      this.d_first = event2.first;
      this.d_rows = event2.rows;
      let pageEvent = this.createLazyLoadEvent(event2);
      pageEvent.pageCount = event2.pageCount;
      pageEvent.page = event2.page;
      this.$emit("update:first", this.d_first);
      this.$emit("update:rows", this.d_rows);
      this.$emit("page", pageEvent);
      this.$emit("value-change", this.processedData);
    },
    onColumnHeaderClick(e) {
      const event2 = e.originalEvent;
      const column = e.column;
      if (this.columnProp(column, "sortable")) {
        const targetNode = event2.target;
        const columnField = this.columnProp(column, "sortField") || this.columnProp(column, "field");
        if (DomHandler.hasClass(targetNode, "p-sortable-column") || DomHandler.hasClass(targetNode, "p-column-title") || DomHandler.hasClass(targetNode, "p-column-header-content") || DomHandler.hasClass(targetNode, "p-sortable-column-icon") || DomHandler.hasClass(targetNode.parentElement, "p-sortable-column-icon")) {
          DomHandler.clearSelection();
          if (this.sortMode === "single") {
            if (this.d_sortField === columnField) {
              if (this.removableSort && this.d_sortOrder * -1 === this.defaultSortOrder) {
                this.d_sortOrder = null;
                this.d_sortField = null;
              } else {
                this.d_sortOrder = this.d_sortOrder * -1;
              }
            } else {
              this.d_sortOrder = this.defaultSortOrder;
              this.d_sortField = columnField;
            }
            this.$emit("update:sortField", this.d_sortField);
            this.$emit("update:sortOrder", this.d_sortOrder);
            this.resetPage();
          } else if (this.sortMode === "multiple") {
            let metaKey = event2.metaKey || event2.ctrlKey;
            if (!metaKey) {
              this.d_multiSortMeta = this.d_multiSortMeta.filter((meta) => meta.field === columnField);
            }
            this.addMultiSortField(columnField);
            this.$emit("update:multiSortMeta", this.d_multiSortMeta);
          }
          this.$emit("sort", this.createLazyLoadEvent(event2));
          this.$emit("value-change", this.processedData);
        }
      }
    },
    sortSingle(value) {
      this.clearEditingMetaData();
      if (this.groupRowsBy && this.groupRowsBy === this.sortField) {
        this.d_multiSortMeta = [
          { field: this.sortField, order: this.sortOrder || this.defaultSortOrder },
          { field: this.d_sortField, order: this.d_sortOrder }
        ];
        return this.sortMultiple(value);
      }
      let data = [...value];
      data.sort((data1, data2) => {
        let value1 = ObjectUtils.resolveFieldData(data1, this.d_sortField);
        let value2 = ObjectUtils.resolveFieldData(data2, this.d_sortField);
        let result = null;
        if (value1 == null && value2 != null)
          result = -1;
        else if (value1 != null && value2 == null)
          result = 1;
        else if (value1 == null && value2 == null)
          result = 0;
        else if (typeof value1 === "string" && typeof value2 === "string")
          result = value1.localeCompare(value2, void 0, { numeric: true });
        else
          result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
        return this.d_sortOrder * result;
      });
      return data;
    },
    sortMultiple(value) {
      this.clearEditingMetaData();
      if (this.groupRowsBy && (this.d_groupRowsSortMeta || this.d_multiSortMeta.length && this.groupRowsBy === this.d_multiSortMeta[0].field)) {
        const firstSortMeta = this.d_multiSortMeta[0];
        !this.d_groupRowsSortMeta && (this.d_groupRowsSortMeta = firstSortMeta);
        if (firstSortMeta.field !== this.d_groupRowsSortMeta.field) {
          this.d_multiSortMeta = [this.d_groupRowsSortMeta, ...this.d_multiSortMeta];
        }
      }
      let data = [...value];
      data.sort((data1, data2) => {
        return this.multisortField(data1, data2, 0);
      });
      return data;
    },
    multisortField(data1, data2, index) {
      const value1 = ObjectUtils.resolveFieldData(data1, this.d_multiSortMeta[index].field);
      const value2 = ObjectUtils.resolveFieldData(data2, this.d_multiSortMeta[index].field);
      let result = null;
      if (typeof value1 === "string" || value1 instanceof String) {
        if (value1.localeCompare && value1 !== value2) {
          return this.d_multiSortMeta[index].order * value1.localeCompare(value2, void 0, { numeric: true });
        }
      } else {
        result = value1 < value2 ? -1 : 1;
      }
      if (value1 === value2) {
        return this.d_multiSortMeta.length - 1 > index ? this.multisortField(data1, data2, index + 1) : 0;
      }
      return this.d_multiSortMeta[index].order * result;
    },
    addMultiSortField(field) {
      let index = this.d_multiSortMeta.findIndex((meta) => meta.field === field);
      if (index >= 0) {
        if (this.removableSort && this.d_multiSortMeta[index].order * -1 === this.defaultSortOrder)
          this.d_multiSortMeta.splice(index, 1);
        else
          this.d_multiSortMeta[index] = { field, order: this.d_multiSortMeta[index].order * -1 };
      } else {
        this.d_multiSortMeta.push({ field, order: this.defaultSortOrder });
      }
      this.d_multiSortMeta = [...this.d_multiSortMeta];
    },
    filter(data) {
      if (!data) {
        return;
      }
      this.clearEditingMetaData();
      let globalFilterFieldsArray;
      if (this.filters["global"]) {
        globalFilterFieldsArray = this.globalFilterFields || this.columns.map((col) => this.columnProp(col, "filterField") || this.columnProp(col, "field"));
      }
      let filteredValue = [];
      for (let i = 0; i < data.length; i++) {
        let localMatch = true;
        let globalMatch = false;
        let localFiltered = false;
        for (let prop in this.filters) {
          if (Object.prototype.hasOwnProperty.call(this.filters, prop) && prop !== "global") {
            localFiltered = true;
            let filterField = prop;
            let filterMeta = this.filters[filterField];
            if (filterMeta.operator) {
              for (let filterConstraint of filterMeta.constraints) {
                localMatch = this.executeLocalFilter(filterField, data[i], filterConstraint);
                if (filterMeta.operator === FilterOperator.OR && localMatch || filterMeta.operator === FilterOperator.AND && !localMatch) {
                  break;
                }
              }
            } else {
              localMatch = this.executeLocalFilter(filterField, data[i], filterMeta);
            }
            if (!localMatch) {
              break;
            }
          }
        }
        if (this.filters["global"] && !globalMatch && globalFilterFieldsArray) {
          for (let j = 0; j < globalFilterFieldsArray.length; j++) {
            let globalFilterField = globalFilterFieldsArray[j];
            globalMatch = FilterService.filters[this.filters["global"].matchMode || FilterMatchMode.CONTAINS](ObjectUtils.resolveFieldData(data[i], globalFilterField), this.filters["global"].value, this.filterLocale);
            if (globalMatch) {
              break;
            }
          }
        }
        let matches;
        if (this.filters["global"]) {
          matches = localFiltered ? localFiltered && localMatch && globalMatch : globalMatch;
        } else {
          matches = localFiltered && localMatch;
        }
        if (matches) {
          filteredValue.push(data[i]);
        }
      }
      if (filteredValue.length === this.value.length) {
        filteredValue = data;
      }
      let filterEvent = this.createLazyLoadEvent();
      filterEvent.filteredValue = filteredValue;
      this.$emit("filter", filterEvent);
      this.$emit("value-change", filteredValue);
      return filteredValue;
    },
    executeLocalFilter(field, rowData, filterMeta) {
      let filterValue = filterMeta.value;
      let filterMatchMode = filterMeta.matchMode || FilterMatchMode.STARTS_WITH;
      let dataFieldValue = ObjectUtils.resolveFieldData(rowData, field);
      let filterConstraint = FilterService.filters[filterMatchMode];
      return filterConstraint(dataFieldValue, filterValue, this.filterLocale);
    },
    onRowClick(e) {
      const event2 = e.originalEvent;
      const index = e.index;
      const body = this.$refs.bodyRef && this.$refs.bodyRef.$el;
      const focusedItem = DomHandler.findSingle(body, 'tr.p-selectable-row[tabindex="0"]');
      if (DomHandler.isClickable(event2.target)) {
        return;
      }
      this.$emit("row-click", e);
      if (this.selectionMode) {
        const rowData = e.data;
        const rowIndex = this.d_first + e.index;
        if (this.isMultipleSelectionMode() && event2.shiftKey && this.anchorRowIndex != null) {
          DomHandler.clearSelection();
          this.rangeRowIndex = rowIndex;
          this.selectRange(event2);
        } else {
          const selected = this.isSelected(rowData);
          const metaSelection = this.rowTouched ? false : this.metaKeySelection;
          this.anchorRowIndex = rowIndex;
          this.rangeRowIndex = rowIndex;
          if (metaSelection) {
            let metaKey = event2.metaKey || event2.ctrlKey;
            if (selected && metaKey) {
              if (this.isSingleSelectionMode()) {
                this.$emit("update:selection", null);
              } else {
                const selectionIndex = this.findIndexInSelection(rowData);
                const _selection = this.selection.filter((val, i) => i != selectionIndex);
                this.$emit("update:selection", _selection);
              }
              this.$emit("row-unselect", { originalEvent: event2, data: rowData, index: rowIndex, type: "row" });
            } else {
              if (this.isSingleSelectionMode()) {
                this.$emit("update:selection", rowData);
              } else if (this.isMultipleSelectionMode()) {
                let _selection = metaKey ? this.selection || [] : [];
                _selection = [..._selection, rowData];
                this.$emit("update:selection", _selection);
              }
              this.$emit("row-select", { originalEvent: event2, data: rowData, index: rowIndex, type: "row" });
            }
          } else {
            if (this.selectionMode === "single") {
              if (selected) {
                this.$emit("update:selection", null);
                this.$emit("row-unselect", { originalEvent: event2, data: rowData, index: rowIndex, type: "row" });
              } else {
                this.$emit("update:selection", rowData);
                this.$emit("row-select", { originalEvent: event2, data: rowData, index: rowIndex, type: "row" });
              }
            } else if (this.selectionMode === "multiple") {
              if (selected) {
                const selectionIndex = this.findIndexInSelection(rowData);
                const _selection = this.selection.filter((val, i) => i != selectionIndex);
                this.$emit("update:selection", _selection);
                this.$emit("row-unselect", { originalEvent: event2, data: rowData, index: rowIndex, type: "row" });
              } else {
                const _selection = this.selection ? [...this.selection, rowData] : [rowData];
                this.$emit("update:selection", _selection);
                this.$emit("row-select", { originalEvent: event2, data: rowData, index: rowIndex, type: "row" });
              }
            }
          }
        }
      }
      this.rowTouched = false;
      if (focusedItem) {
        focusedItem.tabIndex = "-1";
        DomHandler.find(body, "tr.p-selectable-row")[index].tabIndex = "0";
      }
    },
    onRowDblClick(e) {
      const event2 = e.originalEvent;
      if (DomHandler.isClickable(event2.target)) {
        return;
      }
      this.$emit("row-dblclick", e);
    },
    onRowRightClick(event2) {
      DomHandler.clearSelection();
      event2.originalEvent.target.focus();
      this.$emit("update:contextMenuSelection", event2.data);
      this.$emit("row-contextmenu", event2);
    },
    onRowTouchEnd() {
      this.rowTouched = true;
    },
    onRowKeyDown(e, slotProps) {
      const event2 = e.originalEvent;
      const rowData = e.data;
      const rowIndex = e.index;
      const metaKey = event2.metaKey || event2.ctrlKey;
      if (this.selectionMode) {
        const row = event2.target;
        switch (event2.code) {
          case "ArrowDown":
            this.onArrowDownKey(event2, row, rowIndex, slotProps);
            break;
          case "ArrowUp":
            this.onArrowUpKey(event2, row, rowIndex, slotProps);
            break;
          case "Home":
            this.onHomeKey(event2, row, rowIndex, slotProps);
            break;
          case "End":
            this.onEndKey(event2, row, rowIndex, slotProps);
            break;
          case "Enter":
            this.onEnterKey(event2, rowData, rowIndex);
            break;
          case "Space":
            this.onSpaceKey(event2, rowData, rowIndex, slotProps);
            break;
          case "Tab":
            this.onTabKey(event2, rowIndex);
            break;
          default:
            if (event2.code === "KeyA" && metaKey) {
              const data = this.dataToRender(slotProps.rows);
              this.$emit("update:selection", data);
            }
            break;
        }
      }
    },
    onArrowDownKey(event2, row, rowIndex, slotProps) {
      const nextRow = this.findNextSelectableRow(row);
      nextRow && this.focusRowChange(row, nextRow);
      if (event2.shiftKey) {
        const data = this.dataToRender(slotProps.rows);
        const nextRowIndex = rowIndex + 1 >= data.length ? data.length - 1 : rowIndex + 1;
        this.onRowClick({ originalEvent: event2, data: data[nextRowIndex], index: nextRowIndex });
      }
      event2.preventDefault();
    },
    onArrowUpKey(event2, row, rowIndex, slotProps) {
      const prevRow = this.findPrevSelectableRow(row);
      prevRow && this.focusRowChange(row, prevRow);
      if (event2.shiftKey) {
        const data = this.dataToRender(slotProps.rows);
        const prevRowIndex = rowIndex - 1 <= 0 ? 0 : rowIndex - 1;
        this.onRowClick({ originalEvent: event2, data: data[prevRowIndex], index: prevRowIndex });
      }
      event2.preventDefault();
    },
    onHomeKey(event2, row, rowIndex, slotProps) {
      const firstRow = this.findFirstSelectableRow();
      firstRow && this.focusRowChange(row, firstRow);
      if (event2.ctrlKey && event2.shiftKey) {
        const data = this.dataToRender(slotProps.rows);
        this.$emit("update:selection", data.slice(0, rowIndex + 1));
      }
      event2.preventDefault();
    },
    onEndKey(event2, row, rowIndex, slotProps) {
      const lastRow = this.findLastSelectableRow();
      lastRow && this.focusRowChange(row, lastRow);
      if (event2.ctrlKey && event2.shiftKey) {
        const data = this.dataToRender(slotProps.rows);
        this.$emit("update:selection", data.slice(rowIndex, data.length));
      }
      event2.preventDefault();
    },
    onEnterKey(event2, rowData, rowIndex) {
      this.onRowClick({ originalEvent: event2, data: rowData, index: rowIndex });
      event2.preventDefault();
    },
    onSpaceKey(event2, rowData, rowIndex, slotProps) {
      this.onEnterKey(event2, rowData, rowIndex);
      if (event2.shiftKey && this.selection !== null) {
        const data = this.dataToRender(slotProps.rows);
        let index;
        if (this.selection.length > 0) {
          let firstSelectedRowIndex, lastSelectedRowIndex;
          firstSelectedRowIndex = ObjectUtils.findIndexInList(this.selection[0], data);
          lastSelectedRowIndex = ObjectUtils.findIndexInList(this.selection[this.selection.length - 1], data);
          index = rowIndex <= firstSelectedRowIndex ? lastSelectedRowIndex : firstSelectedRowIndex;
        } else {
          index = ObjectUtils.findIndexInList(this.selection, data);
        }
        const _selection = index !== rowIndex ? data.slice(Math.min(index, rowIndex), Math.max(index, rowIndex) + 1) : rowData;
        this.$emit("update:selection", _selection);
      }
    },
    onTabKey(event2, rowIndex) {
      const body = this.$refs.bodyRef && this.$refs.bodyRef.$el;
      const rows = DomHandler.find(body, "tr.p-selectable-row");
      if (event2.code === "Tab" && rows && rows.length > 0) {
        const firstSelectedRow = DomHandler.findSingle(body, "tr.p-highlight");
        const focusedItem = DomHandler.findSingle(body, 'tr.p-selectable-row[tabindex="0"]');
        if (firstSelectedRow) {
          firstSelectedRow.tabIndex = "0";
          focusedItem && focusedItem !== firstSelectedRow && (focusedItem.tabIndex = "-1");
        } else {
          rows[0].tabIndex = "0";
          focusedItem !== rows[0] && (rows[rowIndex].tabIndex = "-1");
        }
      }
    },
    findNextSelectableRow(row) {
      let nextRow = row.nextElementSibling;
      if (nextRow) {
        if (DomHandler.hasClass(nextRow, "p-selectable-row"))
          return nextRow;
        else
          return this.findNextSelectableRow(nextRow);
      } else {
        return null;
      }
    },
    findPrevSelectableRow(row) {
      let prevRow = row.previousElementSibling;
      if (prevRow) {
        if (DomHandler.hasClass(prevRow, "p-selectable-row"))
          return prevRow;
        else
          return this.findPrevSelectableRow(prevRow);
      } else {
        return null;
      }
    },
    findFirstSelectableRow() {
      const firstRow = DomHandler.findSingle(this.$refs.table, ".p-selectable-row");
      return firstRow;
    },
    findLastSelectableRow() {
      const rows = DomHandler.find(this.$refs.table, ".p-selectable-row");
      return rows ? rows[rows.length - 1] : null;
    },
    focusRowChange(firstFocusableRow, currentFocusedRow) {
      firstFocusableRow.tabIndex = "-1";
      currentFocusedRow.tabIndex = "0";
      DomHandler.focus(currentFocusedRow);
    },
    toggleRowWithRadio(event2) {
      const rowData = event2.data;
      if (this.isSelected(rowData)) {
        this.$emit("update:selection", null);
        this.$emit("row-unselect", { originalEvent: event2.originalEvent, data: rowData, index: event2.index, type: "radiobutton" });
      } else {
        this.$emit("update:selection", rowData);
        this.$emit("row-select", { originalEvent: event2.originalEvent, data: rowData, index: event2.index, type: "radiobutton" });
      }
    },
    toggleRowWithCheckbox(event2) {
      const rowData = event2.data;
      if (this.isSelected(rowData)) {
        const selectionIndex = this.findIndexInSelection(rowData);
        const _selection = this.selection.filter((val, i) => i != selectionIndex);
        this.$emit("update:selection", _selection);
        this.$emit("row-unselect", { originalEvent: event2.originalEvent, data: rowData, index: event2.index, type: "checkbox" });
      } else {
        let _selection = this.selection ? [...this.selection] : [];
        _selection = [..._selection, rowData];
        this.$emit("update:selection", _selection);
        this.$emit("row-select", { originalEvent: event2.originalEvent, data: rowData, index: event2.index, type: "checkbox" });
      }
    },
    toggleRowsWithCheckbox(event2) {
      if (this.selectAll !== null) {
        this.$emit("select-all-change", event2);
      } else {
        const { originalEvent, checked } = event2;
        let _selection = [];
        if (checked) {
          _selection = this.frozenValue ? [...this.frozenValue, ...this.processedData] : this.processedData;
          this.$emit("row-select-all", { originalEvent, data: _selection });
        } else {
          this.$emit("row-unselect-all", { originalEvent });
        }
        this.$emit("update:selection", _selection);
      }
    },
    isSingleSelectionMode() {
      return this.selectionMode === "single";
    },
    isMultipleSelectionMode() {
      return this.selectionMode === "multiple";
    },
    isSelected(rowData) {
      if (rowData && this.selection) {
        if (this.dataKey) {
          return this.d_selectionKeys ? this.d_selectionKeys[ObjectUtils.resolveFieldData(rowData, this.dataKey)] !== void 0 : false;
        } else {
          if (this.selection instanceof Array)
            return this.findIndexInSelection(rowData) > -1;
          else
            return this.equals(rowData, this.selection);
        }
      }
      return false;
    },
    findIndexInSelection(rowData) {
      return this.findIndex(rowData, this.selection);
    },
    findIndex(rowData, collection) {
      let index = -1;
      if (collection && collection.length) {
        for (let i = 0; i < collection.length; i++) {
          if (this.equals(rowData, collection[i])) {
            index = i;
            break;
          }
        }
      }
      return index;
    },
    updateSelectionKeys(selection) {
      this.d_selectionKeys = {};
      if (Array.isArray(selection)) {
        for (let data of selection) {
          this.d_selectionKeys[String(ObjectUtils.resolveFieldData(data, this.dataKey))] = 1;
        }
      } else {
        this.d_selectionKeys[String(ObjectUtils.resolveFieldData(selection, this.dataKey))] = 1;
      }
    },
    updateExpandedRowKeys(expandedRows) {
      if (expandedRows && expandedRows.length) {
        this.d_expandedRowKeys = {};
        for (let data of expandedRows) {
          this.d_expandedRowKeys[String(ObjectUtils.resolveFieldData(data, this.dataKey))] = 1;
        }
      } else {
        this.d_expandedRowKeys = null;
      }
    },
    updateEditingRowKeys(editingRows) {
      if (editingRows && editingRows.length) {
        this.d_editingRowKeys = {};
        for (let data of editingRows) {
          this.d_editingRowKeys[String(ObjectUtils.resolveFieldData(data, this.dataKey))] = 1;
        }
      } else {
        this.d_editingRowKeys = null;
      }
    },
    equals(data1, data2) {
      return this.compareSelectionBy === "equals" ? data1 === data2 : ObjectUtils.equals(data1, data2, this.dataKey);
    },
    selectRange(event2) {
      let rangeStart, rangeEnd;
      if (this.rangeRowIndex > this.anchorRowIndex) {
        rangeStart = this.anchorRowIndex;
        rangeEnd = this.rangeRowIndex;
      } else if (this.rangeRowIndex < this.anchorRowIndex) {
        rangeStart = this.rangeRowIndex;
        rangeEnd = this.anchorRowIndex;
      } else {
        rangeStart = this.rangeRowIndex;
        rangeEnd = this.rangeRowIndex;
      }
      if (this.lazy && this.paginator) {
        rangeStart -= this.first;
        rangeEnd -= this.first;
      }
      const value = this.processedData;
      let _selection = [];
      for (let i = rangeStart; i <= rangeEnd; i++) {
        let rangeRowData = value[i];
        _selection.push(rangeRowData);
        this.$emit("row-select", { originalEvent: event2, data: rangeRowData, type: "row" });
      }
      this.$emit("update:selection", _selection);
    },
    exportCSV(options, data) {
      let csv = "\uFEFF";
      if (!data) {
        data = this.processedData;
        if (options && options.selectionOnly)
          data = this.selection || [];
        else if (this.frozenValue)
          data = data ? [...this.frozenValue, ...data] : this.frozenValue;
      }
      let headerInitiated = false;
      for (let i = 0; i < this.columns.length; i++) {
        let column = this.columns[i];
        if (this.columnProp(column, "exportable") !== false && this.columnProp(column, "field")) {
          if (headerInitiated)
            csv += this.csvSeparator;
          else
            headerInitiated = true;
          csv += '"' + (this.columnProp(column, "exportHeader") || this.columnProp(column, "header") || this.columnProp(column, "field")) + '"';
        }
      }
      if (data) {
        data.forEach((record) => {
          csv += "\n";
          let rowInitiated = false;
          for (let i = 0; i < this.columns.length; i++) {
            let column = this.columns[i];
            if (this.columnProp(column, "exportable") !== false && this.columnProp(column, "field")) {
              if (rowInitiated)
                csv += this.csvSeparator;
              else
                rowInitiated = true;
              let cellData = ObjectUtils.resolveFieldData(record, this.columnProp(column, "field"));
              if (cellData != null) {
                if (this.exportFunction) {
                  cellData = this.exportFunction({
                    data: cellData,
                    field: this.columnProp(column, "field")
                  });
                } else
                  cellData = String(cellData).replace(/"/g, '""');
              } else
                cellData = "";
              csv += '"' + cellData + '"';
            }
          }
        });
      }
      let footerInitiated = false;
      for (let i = 0; i < this.columns.length; i++) {
        let column = this.columns[i];
        if (i === 0)
          csv += "\n";
        if (this.columnProp(column, "exportable") !== false && this.columnProp(column, "exportFooter")) {
          if (footerInitiated)
            csv += this.csvSeparator;
          else
            footerInitiated = true;
          csv += '"' + (this.columnProp(column, "exportFooter") || this.columnProp(column, "footer") || this.columnProp(column, "field")) + '"';
        }
      }
      DomHandler.exportCSV(csv, this.exportFilename);
    },
    resetPage() {
      this.d_first = 0;
      this.$emit("update:first", this.d_first);
    },
    onColumnResizeStart(event2) {
      let containerLeft = DomHandler.getOffset(this.$el).left;
      this.resizeColumnElement = event2.target.parentElement;
      this.columnResizing = true;
      this.lastResizeHelperX = event2.pageX - containerLeft + this.$el.scrollLeft;
      this.bindColumnResizeEvents();
    },
    onColumnResize(event2) {
      let containerLeft = DomHandler.getOffset(this.$el).left;
      DomHandler.addClass(this.$el, "p-unselectable-text");
      this.$refs.resizeHelper.style.height = this.$el.offsetHeight + "px";
      this.$refs.resizeHelper.style.top = "0px";
      this.$refs.resizeHelper.style.left = event2.pageX - containerLeft + this.$el.scrollLeft + "px";
      this.$refs.resizeHelper.style.display = "block";
    },
    onColumnResizeEnd() {
      let delta = this.$refs.resizeHelper.offsetLeft - this.lastResizeHelperX;
      let columnWidth = this.resizeColumnElement.offsetWidth;
      let newColumnWidth = columnWidth + delta;
      let minWidth = this.resizeColumnElement.style.minWidth || 15;
      if (columnWidth + delta > parseInt(minWidth, 10)) {
        if (this.columnResizeMode === "fit") {
          let nextColumn = this.resizeColumnElement.nextElementSibling;
          let nextColumnWidth = nextColumn.offsetWidth - delta;
          if (newColumnWidth > 15 && nextColumnWidth > 15) {
            this.resizeTableCells(newColumnWidth, nextColumnWidth);
          }
        } else if (this.columnResizeMode === "expand") {
          const tableWidth = this.$refs.table.offsetWidth + delta + "px";
          const updateTableWidth = (el) => {
            !!el && (el.style.width = el.style.minWidth = tableWidth);
          };
          updateTableWidth(this.$refs.table);
          if (!this.virtualScrollerDisabled) {
            const body = this.$refs.bodyRef && this.$refs.bodyRef.$el;
            const frozenBody = this.$refs.frozenBodyRef && this.$refs.frozenBodyRef.$el;
            updateTableWidth(body);
            updateTableWidth(frozenBody);
          }
          this.resizeTableCells(newColumnWidth);
        }
        this.$emit("column-resize-end", {
          element: this.resizeColumnElement,
          delta
        });
      }
      this.$refs.resizeHelper.style.display = "none";
      this.resizeColumn = null;
      DomHandler.removeClass(this.$el, "p-unselectable-text");
      this.unbindColumnResizeEvents();
      if (this.isStateful()) {
        this.saveState();
      }
    },
    resizeTableCells(newColumnWidth, nextColumnWidth) {
      let colIndex = DomHandler.index(this.resizeColumnElement);
      let widths = [];
      let headers = DomHandler.find(this.$refs.table, ".p-datatable-thead > tr > th");
      headers.forEach((header) => widths.push(DomHandler.getOuterWidth(header)));
      this.destroyStyleElement();
      this.createStyleElement();
      let innerHTML = "";
      let selector = `.p-datatable[${this.attributeSelector}] > .p-datatable-wrapper ${this.virtualScrollerDisabled ? "" : "> .p-virtualscroller"} > .p-datatable-table`;
      widths.forEach((width, index) => {
        let colWidth = index === colIndex ? newColumnWidth : nextColumnWidth && index === colIndex + 1 ? nextColumnWidth : width;
        let style = `width: ${colWidth}px !important; max-width: ${colWidth}px !important`;
        innerHTML += `
                    ${selector} > .p-datatable-thead > tr > th:nth-child(${index + 1}),
                    ${selector} > .p-datatable-tbody > tr > td:nth-child(${index + 1}),
                    ${selector} > .p-datatable-tfoot > tr > td:nth-child(${index + 1}) {
                        ${style}
                    }
                `;
      });
      this.styleElement.innerHTML = innerHTML;
    },
    bindColumnResizeEvents() {
      if (!this.documentColumnResizeListener) {
        this.documentColumnResizeListener = document.addEventListener("mousemove", () => {
          if (this.columnResizing) {
            this.onColumnResize(event);
          }
        });
      }
      if (!this.documentColumnResizeEndListener) {
        this.documentColumnResizeEndListener = document.addEventListener("mouseup", () => {
          if (this.columnResizing) {
            this.columnResizing = false;
            this.onColumnResizeEnd();
          }
        });
      }
    },
    unbindColumnResizeEvents() {
      if (this.documentColumnResizeListener) {
        document.removeEventListener("document", this.documentColumnResizeListener);
        this.documentColumnResizeListener = null;
      }
      if (this.documentColumnResizeEndListener) {
        document.removeEventListener("document", this.documentColumnResizeEndListener);
        this.documentColumnResizeEndListener = null;
      }
    },
    onColumnHeaderMouseDown(e) {
      const event2 = e.originalEvent;
      const column = e.column;
      if (this.reorderableColumns && this.columnProp(column, "reorderableColumn") !== false) {
        if (event2.target.nodeName === "INPUT" || event2.target.nodeName === "TEXTAREA" || DomHandler.hasClass(event2.target, "p-column-resizer"))
          event2.currentTarget.draggable = false;
        else
          event2.currentTarget.draggable = true;
      }
    },
    onColumnHeaderDragStart(event2) {
      if (this.columnResizing) {
        event2.preventDefault();
        return;
      }
      this.colReorderIconWidth = DomHandler.getHiddenElementOuterWidth(this.$refs.reorderIndicatorUp);
      this.colReorderIconHeight = DomHandler.getHiddenElementOuterHeight(this.$refs.reorderIndicatorUp);
      this.draggedColumn = this.findParentHeader(event2.target);
      event2.dataTransfer.setData("text", "b");
    },
    onColumnHeaderDragOver(event2) {
      let dropHeader = this.findParentHeader(event2.target);
      if (this.reorderableColumns && this.draggedColumn && dropHeader) {
        event2.preventDefault();
        let containerOffset = DomHandler.getOffset(this.$el);
        let dropHeaderOffset = DomHandler.getOffset(dropHeader);
        if (this.draggedColumn !== dropHeader) {
          let targetLeft = dropHeaderOffset.left - containerOffset.left;
          let columnCenter = dropHeaderOffset.left + dropHeader.offsetWidth / 2;
          this.$refs.reorderIndicatorUp.style.top = dropHeaderOffset.top - containerOffset.top - (this.colReorderIconHeight - 1) + "px";
          this.$refs.reorderIndicatorDown.style.top = dropHeaderOffset.top - containerOffset.top + dropHeader.offsetHeight + "px";
          if (event2.pageX > columnCenter) {
            this.$refs.reorderIndicatorUp.style.left = targetLeft + dropHeader.offsetWidth - Math.ceil(this.colReorderIconWidth / 2) + "px";
            this.$refs.reorderIndicatorDown.style.left = targetLeft + dropHeader.offsetWidth - Math.ceil(this.colReorderIconWidth / 2) + "px";
            this.dropPosition = 1;
          } else {
            this.$refs.reorderIndicatorUp.style.left = targetLeft - Math.ceil(this.colReorderIconWidth / 2) + "px";
            this.$refs.reorderIndicatorDown.style.left = targetLeft - Math.ceil(this.colReorderIconWidth / 2) + "px";
            this.dropPosition = -1;
          }
          this.$refs.reorderIndicatorUp.style.display = "block";
          this.$refs.reorderIndicatorDown.style.display = "block";
        }
      }
    },
    onColumnHeaderDragLeave(event2) {
      if (this.reorderableColumns && this.draggedColumn) {
        event2.preventDefault();
        this.$refs.reorderIndicatorUp.style.display = "none";
        this.$refs.reorderIndicatorDown.style.display = "none";
      }
    },
    onColumnHeaderDrop(event2) {
      event2.preventDefault();
      if (this.draggedColumn) {
        let dragIndex = DomHandler.index(this.draggedColumn);
        let dropIndex = DomHandler.index(this.findParentHeader(event2.target));
        let allowDrop = dragIndex !== dropIndex;
        if (allowDrop && (dropIndex - dragIndex === 1 && this.dropPosition === -1 || dropIndex - dragIndex === -1 && this.dropPosition === 1)) {
          allowDrop = false;
        }
        if (allowDrop) {
          ObjectUtils.reorderArray(this.columns, dragIndex, dropIndex);
          this.updateReorderableColumns();
          this.$emit("column-reorder", {
            originalEvent: event2,
            dragIndex,
            dropIndex
          });
        }
        this.$refs.reorderIndicatorUp.style.display = "none";
        this.$refs.reorderIndicatorDown.style.display = "none";
        this.draggedColumn.draggable = false;
        this.draggedColumn = null;
        this.dropPosition = null;
      }
    },
    findParentHeader(element) {
      if (element.nodeName === "TH") {
        return element;
      } else {
        let parent = element.parentElement;
        while (parent.nodeName !== "TH") {
          parent = parent.parentElement;
          if (!parent)
            break;
        }
        return parent;
      }
    },
    findColumnByKey(columns, key) {
      if (columns && columns.length) {
        for (let i = 0; i < columns.length; i++) {
          let column = columns[i];
          if (this.columnProp(column, "columnKey") === key || this.columnProp(column, "field") === key) {
            return column;
          }
        }
      }
      return null;
    },
    onRowMouseDown(event2) {
      if (DomHandler.hasClass(event2.target, "p-datatable-reorderablerow-handle"))
        event2.currentTarget.draggable = true;
      else
        event2.currentTarget.draggable = false;
    },
    onRowDragStart(e) {
      const event2 = e.originalEvent;
      const index = e.index;
      this.rowDragging = true;
      this.draggedRowIndex = index;
      event2.dataTransfer.setData("text", "b");
    },
    onRowDragOver(e) {
      const event2 = e.originalEvent;
      const index = e.index;
      if (this.rowDragging && this.draggedRowIndex !== index) {
        let rowElement = event2.currentTarget;
        let rowY = DomHandler.getOffset(rowElement).top + DomHandler.getWindowScrollTop();
        let pageY = event2.pageY;
        let rowMidY = rowY + DomHandler.getOuterHeight(rowElement) / 2;
        let prevRowElement = rowElement.previousElementSibling;
        if (pageY < rowMidY) {
          DomHandler.removeClass(rowElement, "p-datatable-dragpoint-bottom");
          this.droppedRowIndex = index;
          if (prevRowElement)
            DomHandler.addClass(prevRowElement, "p-datatable-dragpoint-bottom");
          else
            DomHandler.addClass(rowElement, "p-datatable-dragpoint-top");
        } else {
          if (prevRowElement)
            DomHandler.removeClass(prevRowElement, "p-datatable-dragpoint-bottom");
          else
            DomHandler.addClass(rowElement, "p-datatable-dragpoint-top");
          this.droppedRowIndex = index + 1;
          DomHandler.addClass(rowElement, "p-datatable-dragpoint-bottom");
        }
        event2.preventDefault();
      }
    },
    onRowDragLeave(event2) {
      let rowElement = event2.currentTarget;
      let prevRowElement = rowElement.previousElementSibling;
      if (prevRowElement) {
        DomHandler.removeClass(prevRowElement, "p-datatable-dragpoint-bottom");
      }
      DomHandler.removeClass(rowElement, "p-datatable-dragpoint-bottom");
      DomHandler.removeClass(rowElement, "p-datatable-dragpoint-top");
    },
    onRowDragEnd(event2) {
      this.rowDragging = false;
      this.draggedRowIndex = null;
      this.droppedRowIndex = null;
      event2.currentTarget.draggable = false;
    },
    onRowDrop(event2) {
      if (this.droppedRowIndex != null) {
        let dropIndex = this.draggedRowIndex > this.droppedRowIndex ? this.droppedRowIndex : this.droppedRowIndex === 0 ? 0 : this.droppedRowIndex - 1;
        let processedData = [...this.processedData];
        ObjectUtils.reorderArray(processedData, this.draggedRowIndex + this.d_first, dropIndex + this.d_first);
        this.$emit("row-reorder", {
          originalEvent: event2,
          dragIndex: this.draggedRowIndex,
          dropIndex,
          value: processedData
        });
      }
      this.onRowDragLeave(event2);
      this.onRowDragEnd(event2);
      event2.preventDefault();
    },
    toggleRow(event2) {
      let rowData = event2.data;
      let expanded;
      let expandedRowIndex;
      let _expandedRows = this.expandedRows ? [...this.expandedRows] : [];
      if (this.dataKey) {
        expanded = this.d_expandedRowKeys ? this.d_expandedRowKeys[ObjectUtils.resolveFieldData(rowData, this.dataKey)] !== void 0 : false;
      } else {
        expandedRowIndex = this.findIndex(rowData, this.expandedRows);
        expanded = expandedRowIndex > -1;
      }
      if (expanded) {
        if (expandedRowIndex == null) {
          expandedRowIndex = this.findIndex(rowData, this.expandedRows);
        }
        _expandedRows.splice(expandedRowIndex, 1);
        this.$emit("update:expandedRows", _expandedRows);
        this.$emit("row-collapse", event2);
      } else {
        _expandedRows.push(rowData);
        this.$emit("update:expandedRows", _expandedRows);
        this.$emit("row-expand", event2);
      }
    },
    toggleRowGroup(e) {
      const event2 = e.originalEvent;
      const data = e.data;
      const groupFieldValue = ObjectUtils.resolveFieldData(data, this.groupRowsBy);
      let _expandedRowGroups = this.expandedRowGroups ? [...this.expandedRowGroups] : [];
      if (this.isRowGroupExpanded(data)) {
        _expandedRowGroups = _expandedRowGroups.filter((group) => group !== groupFieldValue);
        this.$emit("update:expandedRowGroups", _expandedRowGroups);
        this.$emit("rowgroup-collapse", { originalEvent: event2, data: groupFieldValue });
      } else {
        _expandedRowGroups.push(groupFieldValue);
        this.$emit("update:expandedRowGroups", _expandedRowGroups);
        this.$emit("rowgroup-expand", { originalEvent: event2, data: groupFieldValue });
      }
    },
    isRowGroupExpanded(rowData) {
      if (this.expandableRowGroups && this.expandedRowGroups) {
        let groupFieldValue = ObjectUtils.resolveFieldData(rowData, this.groupRowsBy);
        return this.expandedRowGroups.indexOf(groupFieldValue) > -1;
      }
      return false;
    },
    isStateful() {
      return this.stateKey != null;
    },
    getStorage() {
      switch (this.stateStorage) {
        case "local":
          return window.localStorage;
        case "session":
          return window.sessionStorage;
        default:
          throw new Error(this.stateStorage + ' is not a valid value for the state storage, supported values are "local" and "session".');
      }
    },
    saveState() {
      const storage = this.getStorage();
      let state = {};
      if (this.paginator) {
        state.first = this.d_first;
        state.rows = this.d_rows;
      }
      if (this.d_sortField) {
        state.sortField = this.d_sortField;
        state.sortOrder = this.d_sortOrder;
      }
      if (this.d_multiSortMeta) {
        state.multiSortMeta = this.d_multiSortMeta;
      }
      if (this.hasFilters) {
        state.filters = this.filters;
      }
      if (this.resizableColumns) {
        this.saveColumnWidths(state);
      }
      if (this.reorderableColumns) {
        state.columnOrder = this.d_columnOrder;
      }
      if (this.expandedRows) {
        state.expandedRows = this.expandedRows;
        state.expandedRowKeys = this.d_expandedRowKeys;
      }
      if (this.expandedRowGroups) {
        state.expandedRowGroups = this.expandedRowGroups;
      }
      if (this.selection) {
        state.selection = this.selection;
        state.selectionKeys = this.d_selectionKeys;
      }
      if (Object.keys(state).length) {
        storage.setItem(this.stateKey, JSON.stringify(state));
      }
      this.$emit("state-save", state);
    },
    restoreState() {
      const storage = this.getStorage();
      const stateString = storage.getItem(this.stateKey);
      const dateFormat = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;
      const reviver = function(key, value) {
        if (typeof value === "string" && dateFormat.test(value)) {
          return new Date(value);
        }
        return value;
      };
      if (stateString) {
        let restoredState = JSON.parse(stateString, reviver);
        if (this.paginator) {
          this.d_first = restoredState.first;
          this.d_rows = restoredState.rows;
        }
        if (restoredState.sortField) {
          this.d_sortField = restoredState.sortField;
          this.d_sortOrder = restoredState.sortOrder;
        }
        if (restoredState.multiSortMeta) {
          this.d_multiSortMeta = restoredState.multiSortMeta;
        }
        if (restoredState.filters) {
          this.$emit("update:filters", restoredState.filters);
        }
        if (this.resizableColumns) {
          this.columnWidthsState = restoredState.columnWidths;
          this.tableWidthState = restoredState.tableWidth;
        }
        if (this.reorderableColumns) {
          this.d_columnOrder = restoredState.columnOrder;
        }
        if (restoredState.expandedRows) {
          this.d_expandedRowKeys = restoredState.expandedRowKeys;
          this.$emit("update:expandedRows", restoredState.expandedRows);
        }
        if (restoredState.expandedRowGroups) {
          this.$emit("update:expandedRowGroups", restoredState.expandedRowGroups);
        }
        if (restoredState.selection) {
          this.d_selectionKeys = restoredState.d_selectionKeys;
          this.$emit("update:selection", restoredState.selection);
        }
        this.$emit("state-restore", restoredState);
      }
    },
    saveColumnWidths(state) {
      let widths = [];
      let headers = DomHandler.find(this.$el, ".p-datatable-thead > tr > th");
      headers.forEach((header) => widths.push(DomHandler.getOuterWidth(header)));
      state.columnWidths = widths.join(",");
      if (this.columnResizeMode === "expand") {
        state.tableWidth = DomHandler.getOuterWidth(this.$refs.table) + "px";
      }
    },
    restoreColumnWidths() {
      if (this.columnWidthsState) {
        let widths = this.columnWidthsState.split(",");
        if (this.columnResizeMode === "expand" && this.tableWidthState) {
          this.$refs.table.style.width = this.tableWidthState;
          this.$refs.table.style.minWidth = this.tableWidthState;
          this.$el.style.width = this.tableWidthState;
        }
        if (ObjectUtils.isNotEmpty(widths)) {
          this.createStyleElement();
          let innerHTML = "";
          let selector = `.p-datatable[${this.attributeSelector}] > .p-datatable-wrapper ${this.virtualScrollerDisabled ? "" : "> .p-virtualscroller"} > .p-datatable-table`;
          widths.forEach((width, index) => {
            let style = `width: ${width}px !important; max-width: ${width}px !important`;
            innerHTML += `
                            ${selector} > .p-datatable-thead > tr > th:nth-child(${index + 1}),
                            ${selector} > .p-datatable-tbody > tr > td:nth-child(${index + 1}),
                            ${selector} > .p-datatable-tfoot > tr > td:nth-child(${index + 1}) {
                                ${style}
                            }
                        `;
          });
          this.styleElement.innerHTML = innerHTML;
        }
      }
    },
    onCellEditInit(event2) {
      this.$emit("cell-edit-init", event2);
    },
    onCellEditComplete(event2) {
      this.$emit("cell-edit-complete", event2);
    },
    onCellEditCancel(event2) {
      this.$emit("cell-edit-cancel", event2);
    },
    onRowEditInit(event2) {
      let _editingRows = this.editingRows ? [...this.editingRows] : [];
      _editingRows.push(event2.data);
      this.$emit("update:editingRows", _editingRows);
      this.$emit("row-edit-init", event2);
    },
    onRowEditSave(event2) {
      let _editingRows = [...this.editingRows];
      _editingRows.splice(this.findIndex(event2.data, _editingRows), 1);
      this.$emit("update:editingRows", _editingRows);
      this.$emit("row-edit-save", event2);
    },
    onRowEditCancel(event2) {
      let _editingRows = [...this.editingRows];
      _editingRows.splice(this.findIndex(event2.data, _editingRows), 1);
      this.$emit("update:editingRows", _editingRows);
      this.$emit("row-edit-cancel", event2);
    },
    onEditingMetaChange(event2) {
      let { data, field, index, editing } = event2;
      let editingMeta = { ...this.d_editingMeta };
      let meta = editingMeta[index];
      if (editing) {
        !meta && (meta = editingMeta[index] = { data: { ...data }, fields: [] });
        meta["fields"].push(field);
      } else if (meta) {
        const fields = meta["fields"].filter((f) => f !== field);
        !fields.length ? delete editingMeta[index] : meta["fields"] = fields;
      }
      this.d_editingMeta = editingMeta;
    },
    clearEditingMetaData() {
      if (this.editMode) {
        this.d_editingMeta = {};
      }
    },
    createLazyLoadEvent(event2) {
      return {
        originalEvent: event2,
        first: this.d_first,
        rows: this.d_rows,
        sortField: this.d_sortField,
        sortOrder: this.d_sortOrder,
        multiSortMeta: this.d_multiSortMeta,
        filters: this.d_filters
      };
    },
    hasGlobalFilter() {
      return this.filters && Object.prototype.hasOwnProperty.call(this.filters, "global");
    },
    getChildren() {
      return this.$slots.default ? this.$slots.default() : null;
    },
    onFilterChange(filters) {
      this.d_filters = filters;
    },
    onFilterApply() {
      this.d_first = 0;
      this.$emit("update:first", this.d_first);
      this.$emit("update:filters", this.d_filters);
      if (this.lazy) {
        this.$emit("filter", this.createLazyLoadEvent());
      }
    },
    cloneFilters() {
      let cloned = {};
      if (this.filters) {
        Object.entries(this.filters).forEach(([prop, value]) => {
          cloned[prop] = value.operator ? {
            operator: value.operator,
            constraints: value.constraints.map((constraint) => {
              return { ...constraint };
            })
          } : { ...value };
        });
      }
      return cloned;
    },
    updateReorderableColumns() {
      let columnOrder = [];
      this.columns.forEach((col) => columnOrder.push(this.columnProp(col, "columnKey") || this.columnProp(col, "field")));
      this.d_columnOrder = columnOrder;
    },
    createStyleElement() {
      this.styleElement = document.createElement("style");
      this.styleElement.type = "text/css";
      document.head.appendChild(this.styleElement);
    },
    createResponsiveStyle() {
      if (!this.responsiveStyleElement) {
        this.responsiveStyleElement = document.createElement("style");
        this.responsiveStyleElement.type = "text/css";
        document.head.appendChild(this.responsiveStyleElement);
        let tableSelector = `.p-datatable-wrapper ${this.virtualScrollerDisabled ? "" : "> .p-virtualscroller"} > .p-datatable-table`;
        let selector = `.p-datatable[${this.attributeSelector}] > ${tableSelector}`;
        let gridLinesSelector = `.p-datatable[${this.attributeSelector}].p-datatable-gridlines > ${tableSelector}`;
        let innerHTML = `
@media screen and (max-width: ${this.breakpoint}) {
    ${selector} > .p-datatable-thead > tr > th,
    ${selector} > .p-datatable-tfoot > tr > td {
        display: none !important;
    }

    ${selector} > .p-datatable-tbody > tr > td {
        display: flex;
        width: 100% !important;
        align-items: center;
        justify-content: space-between;
    }

    ${selector} > .p-datatable-tbody > tr > td:not(:last-child) {
        border: 0 none;
    }

    ${gridLinesSelector} > .p-datatable-tbody > tr > td:last-child {
        border-top: 0;
        border-right: 0;
        border-left: 0;
    }

    ${selector} > .p-datatable-tbody > tr > td > .p-column-title {
        display: block;
    }
}
`;
        this.responsiveStyleElement.innerHTML = innerHTML;
      }
    },
    destroyResponsiveStyle() {
      if (this.responsiveStyleElement) {
        document.head.removeChild(this.responsiveStyleElement);
        this.responsiveStyleElement = null;
      }
    },
    destroyStyleElement() {
      if (this.styleElement) {
        document.head.removeChild(this.styleElement);
        this.styleElement = null;
      }
    },
    recursiveGetChildren(children, results) {
      if (!results) {
        results = [];
      }
      if (children && children.length) {
        children.forEach((child) => {
          if (child.children instanceof Array) {
            results.concat(this.recursiveGetChildren(child.children, results));
          } else if (child.type.name == "Column") {
            results.push(child);
          }
        });
      }
      return results;
    },
    dataToRender(data) {
      const _data = data || this.processedData;
      if (_data && this.paginator) {
        const first = this.lazy ? 0 : this.d_first;
        return _data.slice(first, first + this.d_rows);
      }
      return _data;
    },
    getVirtualScrollerRef() {
      return this.$refs.virtualScroller;
    },
    hasSpacerStyle(style) {
      return ObjectUtils.isNotEmpty(style);
    }
  },
  computed: {
    containerClass() {
      return [
        "p-datatable p-component",
        {
          "p-datatable-hoverable-rows": this.rowHover || this.selectionMode,
          "p-datatable-resizable": this.resizableColumns,
          "p-datatable-resizable-fit": this.resizableColumns && this.columnResizeMode === "fit",
          "p-datatable-scrollable": this.scrollable,
          "p-datatable-flex-scrollable": this.scrollable && this.scrollHeight === "flex",
          "p-datatable-responsive-stack": this.responsiveLayout === "stack",
          "p-datatable-responsive-scroll": this.responsiveLayout === "scroll",
          "p-datatable-striped": this.stripedRows,
          "p-datatable-gridlines": this.showGridlines,
          "p-datatable-grouped-header": this.headerColumnGroup != null,
          "p-datatable-grouped-footer": this.footerColumnGroup != null
        }
      ];
    },
    tableStyleClass() {
      return [
        "p-datatable-table",
        {
          "p-datatable-scrollable-table": this.scrollable,
          "p-datatable-resizable-table": this.resizableColumns,
          "p-datatable-resizable-table-fit": this.resizableColumns && this.columnResizeMode === "fit"
        },
        this.tableClass
      ];
    },
    columns() {
      let children = this.getChildren();
      if (!children) {
        return;
      }
      const cols = this.recursiveGetChildren(children, []);
      if (this.reorderableColumns && this.d_columnOrder) {
        let orderedColumns = [];
        for (let columnKey of this.d_columnOrder) {
          let column = this.findColumnByKey(cols, columnKey);
          if (column && !this.columnProp(column, "hidden")) {
            orderedColumns.push(column);
          }
        }
        return [...orderedColumns, ...cols.filter((item) => orderedColumns.indexOf(item) < 0)];
      }
      return cols;
    },
    headerColumnGroup() {
      const children = this.getChildren();
      if (children) {
        for (let child of children) {
          if (child.type.name === "ColumnGroup" && this.columnProp(child, "type") === "header") {
            return child;
          }
        }
      }
      return null;
    },
    footerColumnGroup() {
      const children = this.getChildren();
      if (children) {
        for (let child of children) {
          if (child.type.name === "ColumnGroup" && this.columnProp(child, "type") === "footer") {
            return child;
          }
        }
      }
      return null;
    },
    hasFilters() {
      return this.filters && Object.keys(this.filters).length > 0 && this.filters.constructor === Object;
    },
    processedData() {
      let data = this.value || [];
      if (!this.lazy) {
        if (data && data.length) {
          if (this.hasFilters) {
            data = this.filter(data);
          }
          if (this.sorted) {
            if (this.sortMode === "single")
              data = this.sortSingle(data);
            else if (this.sortMode === "multiple")
              data = this.sortMultiple(data);
          }
        }
      }
      return data;
    },
    totalRecordsLength() {
      if (this.lazy) {
        return this.totalRecords;
      } else {
        const data = this.processedData;
        return data ? data.length : 0;
      }
    },
    empty() {
      const data = this.processedData;
      return !data || data.length === 0;
    },
    paginatorTop() {
      return this.paginator && (this.paginatorPosition !== "bottom" || this.paginatorPosition === "both");
    },
    paginatorBottom() {
      return this.paginator && (this.paginatorPosition !== "top" || this.paginatorPosition === "both");
    },
    sorted() {
      return this.d_sortField || this.d_multiSortMeta && this.d_multiSortMeta.length > 0;
    },
    loadingIconClass() {
      return ["p-datatable-loading-icon pi-spin", this.loadingIcon];
    },
    allRowsSelected() {
      if (this.selectAll !== null) {
        return this.selectAll;
      } else {
        const val = this.frozenValue ? [...this.frozenValue, ...this.processedData] : this.processedData;
        return ObjectUtils.isNotEmpty(val) && this.selection && Array.isArray(this.selection) && val.every((v) => this.selection.some((s) => this.equals(s, v)));
      }
    },
    attributeSelector() {
      return UniqueComponentId();
    },
    groupRowSortField() {
      return this.sortMode === "single" ? this.sortField : this.d_groupRowsSortMeta ? this.d_groupRowsSortMeta.field : null;
    },
    virtualScrollerDisabled() {
      return ObjectUtils.isEmpty(this.virtualScrollerOptions) || !this.scrollable;
    }
  },
  components: {
    DTPaginator: script$c,
    DTTableHeader: script$1$3,
    DTTableBody: script$7,
    DTTableFooter: script$5,
    DTVirtualScroller: script$g
  }
};
const _hoisted_1$b = {
  key: 0,
  class: "p-datatable-loading-overlay p-component-overlay"
};
const _hoisted_2$a = {
  key: 1,
  class: "p-datatable-header"
};
const _hoisted_3$7 = {
  key: 3,
  class: "p-datatable-footer"
};
const _hoisted_4$6 = {
  ref: "resizeHelper",
  class: "p-column-resizer-helper",
  style: { "display": "none" }
};
const _hoisted_5$4 = {
  key: 5,
  ref: "reorderIndicatorUp",
  class: "pi pi-arrow-down p-datatable-reorder-indicator-up",
  style: { "position": "absolute", "display": "none" }
};
const _hoisted_6$4 = {
  key: 6,
  ref: "reorderIndicatorDown",
  class: "pi pi-arrow-up p-datatable-reorder-indicator-down",
  style: { "position": "absolute", "display": "none" }
};
function render$b(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_DTPaginator = resolveComponent("DTPaginator");
  const _component_DTTableHeader = resolveComponent("DTTableHeader");
  const _component_DTTableBody = resolveComponent("DTTableBody");
  const _component_DTTableFooter = resolveComponent("DTTableFooter");
  const _component_DTVirtualScroller = resolveComponent("DTVirtualScroller");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.containerClass),
    "data-scrollselectors": ".p-datatable-wrapper"
  }, [
    renderSlot(_ctx.$slots, "default"),
    $props.loading ? (openBlock(), createElementBlock("div", _hoisted_1$b, [
      _ctx.$slots.loading ? renderSlot(_ctx.$slots, "loading", { key: 0 }) : (openBlock(), createElementBlock("i", {
        key: 1,
        class: normalizeClass($options.loadingIconClass)
      }, null, 2))
    ])) : createCommentVNode("", true),
    _ctx.$slots.header ? (openBlock(), createElementBlock("div", _hoisted_2$a, [
      renderSlot(_ctx.$slots, "header")
    ])) : createCommentVNode("", true),
    $options.paginatorTop ? (openBlock(), createBlock(_component_DTPaginator, {
      key: 2,
      rows: $data.d_rows,
      first: $data.d_first,
      totalRecords: $options.totalRecordsLength,
      pageLinkSize: $props.pageLinkSize,
      template: $props.paginatorTemplate,
      rowsPerPageOptions: $props.rowsPerPageOptions,
      currentPageReportTemplate: $props.currentPageReportTemplate,
      class: "p-paginator-top",
      onPage: _cache[0] || (_cache[0] = ($event) => $options.onPage($event)),
      alwaysShow: $props.alwaysShowPaginator
    }, createSlots({ _: 2 }, [
      _ctx.$slots.paginatorstart ? {
        name: "start",
        fn: withCtx(() => [
          renderSlot(_ctx.$slots, "paginatorstart")
        ]),
        key: "0"
      } : void 0,
      _ctx.$slots.paginatorend ? {
        name: "end",
        fn: withCtx(() => [
          renderSlot(_ctx.$slots, "paginatorend")
        ]),
        key: "1"
      } : void 0
    ]), 1032, ["rows", "first", "totalRecords", "pageLinkSize", "template", "rowsPerPageOptions", "currentPageReportTemplate", "alwaysShow"])) : createCommentVNode("", true),
    createElementVNode("div", {
      class: "p-datatable-wrapper",
      style: normalizeStyle({ maxHeight: $options.virtualScrollerDisabled ? $props.scrollHeight : "" })
    }, [
      createVNode(_component_DTVirtualScroller, mergeProps({ ref: "virtualScroller" }, $props.virtualScrollerOptions, {
        items: $options.processedData,
        columns: $options.columns,
        style: $props.scrollHeight !== "flex" ? { height: $props.scrollHeight } : void 0,
        scrollHeight: $props.scrollHeight !== "flex" ? void 0 : "100%",
        disabled: $options.virtualScrollerDisabled,
        loaderDisabled: "",
        inline: "",
        autoSize: "",
        showSpacer: false
      }), {
        content: withCtx((slotProps) => [
          createElementVNode("table", mergeProps({
            ref: "table",
            role: "table",
            class: $options.tableStyleClass,
            style: [$props.tableStyle, slotProps.spacerStyle]
          }, $props.tableProps), [
            createVNode(_component_DTTableHeader, {
              columnGroup: $options.headerColumnGroup,
              columns: slotProps.columns,
              rowGroupMode: $props.rowGroupMode,
              groupRowsBy: $props.groupRowsBy,
              groupRowSortField: $options.groupRowSortField,
              reorderableColumns: $props.reorderableColumns,
              resizableColumns: $props.resizableColumns,
              allRowsSelected: $options.allRowsSelected,
              empty: $options.empty,
              sortMode: $props.sortMode,
              sortField: $data.d_sortField,
              sortOrder: $data.d_sortOrder,
              multiSortMeta: $data.d_multiSortMeta,
              filters: $data.d_filters,
              filtersStore: $props.filters,
              filterDisplay: $props.filterDisplay,
              filterInputProps: $props.filterInputProps,
              onColumnClick: _cache[1] || (_cache[1] = ($event) => $options.onColumnHeaderClick($event)),
              onColumnMousedown: _cache[2] || (_cache[2] = ($event) => $options.onColumnHeaderMouseDown($event)),
              onFilterChange: $options.onFilterChange,
              onFilterApply: $options.onFilterApply,
              onColumnDragstart: _cache[3] || (_cache[3] = ($event) => $options.onColumnHeaderDragStart($event)),
              onColumnDragover: _cache[4] || (_cache[4] = ($event) => $options.onColumnHeaderDragOver($event)),
              onColumnDragleave: _cache[5] || (_cache[5] = ($event) => $options.onColumnHeaderDragLeave($event)),
              onColumnDrop: _cache[6] || (_cache[6] = ($event) => $options.onColumnHeaderDrop($event)),
              onColumnResizestart: _cache[7] || (_cache[7] = ($event) => $options.onColumnResizeStart($event)),
              onCheckboxChange: _cache[8] || (_cache[8] = ($event) => $options.toggleRowsWithCheckbox($event))
            }, null, 8, ["columnGroup", "columns", "rowGroupMode", "groupRowsBy", "groupRowSortField", "reorderableColumns", "resizableColumns", "allRowsSelected", "empty", "sortMode", "sortField", "sortOrder", "multiSortMeta", "filters", "filtersStore", "filterDisplay", "filterInputProps", "onFilterChange", "onFilterApply"]),
            $props.frozenValue ? (openBlock(), createBlock(_component_DTTableBody, {
              key: 0,
              ref: "frozenBodyRef",
              value: $props.frozenValue,
              frozenRow: true,
              class: "p-datatable-frozen-tbody",
              columns: slotProps.columns,
              first: $data.d_first,
              dataKey: $props.dataKey,
              selection: $props.selection,
              selectionKeys: $data.d_selectionKeys,
              selectionMode: $props.selectionMode,
              contextMenu: $props.contextMenu,
              contextMenuSelection: $props.contextMenuSelection,
              rowGroupMode: $props.rowGroupMode,
              groupRowsBy: $props.groupRowsBy,
              expandableRowGroups: $props.expandableRowGroups,
              rowClass: $props.rowClass,
              rowStyle: $props.rowStyle,
              editMode: $props.editMode,
              compareSelectionBy: $props.compareSelectionBy,
              scrollable: $props.scrollable,
              expandedRowIcon: $props.expandedRowIcon,
              collapsedRowIcon: $props.collapsedRowIcon,
              expandedRows: $props.expandedRows,
              expandedRowKeys: $data.d_expandedRowKeys,
              expandedRowGroups: $props.expandedRowGroups,
              editingRows: $props.editingRows,
              editingRowKeys: $data.d_editingRowKeys,
              templates: _ctx.$slots,
              responsiveLayout: $props.responsiveLayout,
              isVirtualScrollerDisabled: true,
              onRowgroupToggle: $options.toggleRowGroup,
              onRowClick: _cache[9] || (_cache[9] = ($event) => $options.onRowClick($event)),
              onRowDblclick: _cache[10] || (_cache[10] = ($event) => $options.onRowDblClick($event)),
              onRowRightclick: _cache[11] || (_cache[11] = ($event) => $options.onRowRightClick($event)),
              onRowTouchend: $options.onRowTouchEnd,
              onRowKeydown: $options.onRowKeyDown,
              onRowMousedown: $options.onRowMouseDown,
              onRowDragstart: _cache[12] || (_cache[12] = ($event) => $options.onRowDragStart($event)),
              onRowDragover: _cache[13] || (_cache[13] = ($event) => $options.onRowDragOver($event)),
              onRowDragleave: _cache[14] || (_cache[14] = ($event) => $options.onRowDragLeave($event)),
              onRowDragend: _cache[15] || (_cache[15] = ($event) => $options.onRowDragEnd($event)),
              onRowDrop: _cache[16] || (_cache[16] = ($event) => $options.onRowDrop($event)),
              onRowToggle: _cache[17] || (_cache[17] = ($event) => $options.toggleRow($event)),
              onRadioChange: _cache[18] || (_cache[18] = ($event) => $options.toggleRowWithRadio($event)),
              onCheckboxChange: _cache[19] || (_cache[19] = ($event) => $options.toggleRowWithCheckbox($event)),
              onCellEditInit: _cache[20] || (_cache[20] = ($event) => $options.onCellEditInit($event)),
              onCellEditComplete: _cache[21] || (_cache[21] = ($event) => $options.onCellEditComplete($event)),
              onCellEditCancel: _cache[22] || (_cache[22] = ($event) => $options.onCellEditCancel($event)),
              onRowEditInit: _cache[23] || (_cache[23] = ($event) => $options.onRowEditInit($event)),
              onRowEditSave: _cache[24] || (_cache[24] = ($event) => $options.onRowEditSave($event)),
              onRowEditCancel: _cache[25] || (_cache[25] = ($event) => $options.onRowEditCancel($event)),
              editingMeta: $data.d_editingMeta,
              onEditingMetaChange: $options.onEditingMetaChange
            }, null, 8, ["value", "columns", "first", "dataKey", "selection", "selectionKeys", "selectionMode", "contextMenu", "contextMenuSelection", "rowGroupMode", "groupRowsBy", "expandableRowGroups", "rowClass", "rowStyle", "editMode", "compareSelectionBy", "scrollable", "expandedRowIcon", "collapsedRowIcon", "expandedRows", "expandedRowKeys", "expandedRowGroups", "editingRows", "editingRowKeys", "templates", "responsiveLayout", "onRowgroupToggle", "onRowTouchend", "onRowKeydown", "onRowMousedown", "editingMeta", "onEditingMetaChange"])) : createCommentVNode("", true),
            createVNode(_component_DTTableBody, {
              ref: "bodyRef",
              value: $options.dataToRender(slotProps.rows),
              class: normalizeClass(slotProps.styleClass),
              columns: slotProps.columns,
              empty: $options.empty,
              first: $data.d_first,
              dataKey: $props.dataKey,
              selection: $props.selection,
              selectionKeys: $data.d_selectionKeys,
              selectionMode: $props.selectionMode,
              contextMenu: $props.contextMenu,
              contextMenuSelection: $props.contextMenuSelection,
              rowGroupMode: $props.rowGroupMode,
              groupRowsBy: $props.groupRowsBy,
              expandableRowGroups: $props.expandableRowGroups,
              rowClass: $props.rowClass,
              rowStyle: $props.rowStyle,
              editMode: $props.editMode,
              compareSelectionBy: $props.compareSelectionBy,
              scrollable: $props.scrollable,
              expandedRowIcon: $props.expandedRowIcon,
              collapsedRowIcon: $props.collapsedRowIcon,
              expandedRows: $props.expandedRows,
              expandedRowKeys: $data.d_expandedRowKeys,
              expandedRowGroups: $props.expandedRowGroups,
              editingRows: $props.editingRows,
              editingRowKeys: $data.d_editingRowKeys,
              templates: _ctx.$slots,
              responsiveLayout: $props.responsiveLayout,
              virtualScrollerContentProps: slotProps,
              isVirtualScrollerDisabled: $options.virtualScrollerDisabled,
              onRowgroupToggle: $options.toggleRowGroup,
              onRowClick: _cache[26] || (_cache[26] = ($event) => $options.onRowClick($event)),
              onRowDblclick: _cache[27] || (_cache[27] = ($event) => $options.onRowDblClick($event)),
              onRowRightclick: _cache[28] || (_cache[28] = ($event) => $options.onRowRightClick($event)),
              onRowTouchend: $options.onRowTouchEnd,
              onRowKeydown: ($event) => $options.onRowKeyDown($event, slotProps),
              onRowMousedown: $options.onRowMouseDown,
              onRowDragstart: _cache[29] || (_cache[29] = ($event) => $options.onRowDragStart($event)),
              onRowDragover: _cache[30] || (_cache[30] = ($event) => $options.onRowDragOver($event)),
              onRowDragleave: _cache[31] || (_cache[31] = ($event) => $options.onRowDragLeave($event)),
              onRowDragend: _cache[32] || (_cache[32] = ($event) => $options.onRowDragEnd($event)),
              onRowDrop: _cache[33] || (_cache[33] = ($event) => $options.onRowDrop($event)),
              onRowToggle: _cache[34] || (_cache[34] = ($event) => $options.toggleRow($event)),
              onRadioChange: _cache[35] || (_cache[35] = ($event) => $options.toggleRowWithRadio($event)),
              onCheckboxChange: _cache[36] || (_cache[36] = ($event) => $options.toggleRowWithCheckbox($event)),
              onCellEditInit: _cache[37] || (_cache[37] = ($event) => $options.onCellEditInit($event)),
              onCellEditComplete: _cache[38] || (_cache[38] = ($event) => $options.onCellEditComplete($event)),
              onCellEditCancel: _cache[39] || (_cache[39] = ($event) => $options.onCellEditCancel($event)),
              onRowEditInit: _cache[40] || (_cache[40] = ($event) => $options.onRowEditInit($event)),
              onRowEditSave: _cache[41] || (_cache[41] = ($event) => $options.onRowEditSave($event)),
              onRowEditCancel: _cache[42] || (_cache[42] = ($event) => $options.onRowEditCancel($event)),
              editingMeta: $data.d_editingMeta,
              onEditingMetaChange: $options.onEditingMetaChange
            }, null, 8, ["value", "class", "columns", "empty", "first", "dataKey", "selection", "selectionKeys", "selectionMode", "contextMenu", "contextMenuSelection", "rowGroupMode", "groupRowsBy", "expandableRowGroups", "rowClass", "rowStyle", "editMode", "compareSelectionBy", "scrollable", "expandedRowIcon", "collapsedRowIcon", "expandedRows", "expandedRowKeys", "expandedRowGroups", "editingRows", "editingRowKeys", "templates", "responsiveLayout", "virtualScrollerContentProps", "isVirtualScrollerDisabled", "onRowgroupToggle", "onRowTouchend", "onRowKeydown", "onRowMousedown", "editingMeta", "onEditingMetaChange"]),
            $options.hasSpacerStyle(slotProps.spacerStyle) ? (openBlock(), createElementBlock("tbody", {
              key: 1,
              style: normalizeStyle({ height: `calc(${slotProps.spacerStyle.height} - ${slotProps.rows.length * slotProps.itemSize}px)` }),
              class: "p-datatable-virtualscroller-spacer"
            }, null, 4)) : createCommentVNode("", true),
            createVNode(_component_DTTableFooter, {
              columnGroup: $options.footerColumnGroup,
              columns: slotProps.columns
            }, null, 8, ["columnGroup", "columns"])
          ], 16)
        ]),
        _: 1
      }, 16, ["items", "columns", "style", "scrollHeight", "disabled"])
    ], 4),
    _ctx.$slots.footer ? (openBlock(), createElementBlock("div", _hoisted_3$7, [
      renderSlot(_ctx.$slots, "footer")
    ])) : createCommentVNode("", true),
    $options.paginatorBottom ? (openBlock(), createBlock(_component_DTPaginator, {
      key: 4,
      rows: $data.d_rows,
      first: $data.d_first,
      totalRecords: $options.totalRecordsLength,
      pageLinkSize: $props.pageLinkSize,
      template: $props.paginatorTemplate,
      rowsPerPageOptions: $props.rowsPerPageOptions,
      currentPageReportTemplate: $props.currentPageReportTemplate,
      class: "p-paginator-bottom",
      onPage: _cache[43] || (_cache[43] = ($event) => $options.onPage($event)),
      alwaysShow: $props.alwaysShowPaginator
    }, createSlots({ _: 2 }, [
      _ctx.$slots.paginatorstart ? {
        name: "start",
        fn: withCtx(() => [
          renderSlot(_ctx.$slots, "paginatorstart")
        ]),
        key: "0"
      } : void 0,
      _ctx.$slots.paginatorend ? {
        name: "end",
        fn: withCtx(() => [
          renderSlot(_ctx.$slots, "paginatorend")
        ]),
        key: "1"
      } : void 0
    ]), 1032, ["rows", "first", "totalRecords", "pageLinkSize", "template", "rowsPerPageOptions", "currentPageReportTemplate", "alwaysShow"])) : createCommentVNode("", true),
    createElementVNode("div", _hoisted_4$6, null, 512),
    $props.reorderableColumns ? (openBlock(), createElementBlock("span", _hoisted_5$4, null, 512)) : createCommentVNode("", true),
    $props.reorderableColumns ? (openBlock(), createElementBlock("span", _hoisted_6$4, null, 512)) : createCommentVNode("", true)
  ], 2);
}
function styleInject$4(css, ref2) {
  if (ref2 === void 0)
    ref2 = {};
  var insertAt = ref2.insertAt;
  if (!css || true) {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
var css_248z$4 = "\n.p-datatable {\n    position: relative;\n}\n.p-datatable > .p-datatable-wrapper {\n    overflow: auto;\n}\n.p-datatable-table {\n    border-spacing: 0px;\n    width: 100%;\n}\n.p-datatable .p-sortable-column {\n    cursor: pointer;\n    user-select: none;\n}\n.p-datatable .p-sortable-column .p-column-title,\n.p-datatable .p-sortable-column .p-sortable-column-icon,\n.p-datatable .p-sortable-column .p-sortable-column-badge {\n    vertical-align: middle;\n}\n.p-datatable .p-sortable-column .p-sortable-column-badge {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n}\n.p-datatable-hoverable-rows .p-selectable-row {\n    cursor: pointer;\n}\n\n/* Scrollable */\n.p-datatable-scrollable > .p-datatable-wrapper {\n    position: relative;\n}\n.p-datatable-scrollable-table > .p-datatable-thead {\n    position: sticky;\n    top: 0;\n    z-index: 1;\n}\n.p-datatable-scrollable-table > .p-datatable-frozen-tbody {\n    position: sticky;\n    z-index: 1;\n}\n.p-datatable-scrollable-table > .p-datatable-tfoot {\n    position: sticky;\n    bottom: 0;\n    z-index: 1;\n}\n.p-datatable-scrollable .p-frozen-column {\n    position: sticky;\n    background: inherit;\n}\n.p-datatable-scrollable th.p-frozen-column {\n    z-index: 1;\n}\n.p-datatable-flex-scrollable {\n    display: flex;\n    flex-direction: column;\n    height: 100%;\n}\n.p-datatable-flex-scrollable > .p-datatable-wrapper {\n    display: flex;\n    flex-direction: column;\n    flex: 1;\n    height: 100%;\n}\n.p-datatable-scrollable-table > .p-datatable-tbody > .p-rowgroup-header {\n    position: sticky;\n    z-index: 1;\n}\n\n/* Resizable */\n.p-datatable-resizable-table > .p-datatable-thead > tr > th,\n.p-datatable-resizable-table > .p-datatable-tfoot > tr > td,\n.p-datatable-resizable-table > .p-datatable-tbody > tr > td {\n    overflow: hidden;\n    white-space: nowrap;\n}\n.p-datatable-resizable-table > .p-datatable-thead > tr > th.p-resizable-column:not(.p-frozen-column) {\n    background-clip: padding-box;\n    position: relative;\n}\n.p-datatable-resizable-table-fit > .p-datatable-thead > tr > th.p-resizable-column:last-child .p-column-resizer {\n    display: none;\n}\n.p-datatable .p-column-resizer {\n    display: block;\n    position: absolute !important;\n    top: 0;\n    right: 0;\n    margin: 0;\n    width: 0.5rem;\n    height: 100%;\n    padding: 0px;\n    cursor: col-resize;\n    border: 1px solid transparent;\n}\n.p-datatable .p-column-header-content {\n    display: flex;\n    align-items: center;\n}\n.p-datatable .p-column-resizer-helper {\n    width: 1px;\n    position: absolute;\n    z-index: 10;\n    display: none;\n}\n.p-datatable .p-row-editor-init,\n.p-datatable .p-row-editor-save,\n.p-datatable .p-row-editor-cancel {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    overflow: hidden;\n    position: relative;\n}\n\n/* Expand */\n.p-datatable .p-row-toggler {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    overflow: hidden;\n    position: relative;\n}\n\n/* Reorder */\n.p-datatable-reorder-indicator-up,\n.p-datatable-reorder-indicator-down {\n    position: absolute;\n    display: none;\n}\n.p-reorderable-column,\n.p-datatable-reorderablerow-handle {\n    cursor: move;\n}\n\n/* Loader */\n.p-datatable .p-datatable-loading-overlay {\n    position: absolute;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    z-index: 2;\n}\n\n/* Filter */\n.p-column-filter-row {\n    display: flex;\n    align-items: center;\n    width: 100%;\n}\n.p-column-filter-menu {\n    display: inline-flex;\n    margin-left: auto;\n}\n.p-column-filter-row .p-column-filter-element {\n    flex: 1 1 auto;\n    width: 1%;\n}\n.p-column-filter-menu-button,\n.p-column-filter-clear-button {\n    display: inline-flex;\n    justify-content: center;\n    align-items: center;\n    cursor: pointer;\n    text-decoration: none;\n    overflow: hidden;\n    position: relative;\n}\n.p-column-filter-overlay {\n    position: absolute;\n    top: 0;\n    left: 0;\n}\n.p-column-filter-row-items {\n    margin: 0;\n    padding: 0;\n    list-style: none;\n}\n.p-column-filter-row-item {\n    cursor: pointer;\n}\n.p-column-filter-add-button,\n.p-column-filter-remove-button {\n    justify-content: center;\n}\n.p-column-filter-add-button .p-button-label,\n.p-column-filter-remove-button .p-button-label {\n    flex-grow: 0;\n}\n.p-column-filter-buttonbar {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n}\n.p-column-filter-buttonbar .p-button:not(.p-button-icon-only) {\n    width: auto;\n}\n\n/* Responsive */\n.p-datatable .p-datatable-tbody > tr > td > .p-column-title {\n    display: none;\n}\n\n/* VirtualScroller */\n.p-datatable-virtualscroller-spacer {\n    display: flex;\n}\n.p-datatable .p-virtualscroller .p-virtualscroller-loading {\n    transform: none !important;\n    min-height: 0;\n    position: sticky;\n    top: 0;\n    left: 0;\n}\n";
styleInject$4(css_248z$4);
script$b.render = render$b;
var script$4 = {
  name: "Column",
  props: {
    columnKey: {
      type: null,
      default: null
    },
    field: {
      type: [String, Function],
      default: null
    },
    sortField: {
      type: [String, Function],
      default: null
    },
    filterField: {
      type: [String, Function],
      default: null
    },
    dataType: {
      type: String,
      default: "text"
    },
    sortable: {
      type: Boolean,
      default: false
    },
    header: {
      type: null,
      default: null
    },
    footer: {
      type: null,
      default: null
    },
    style: {
      type: null,
      default: null
    },
    class: {
      type: String,
      default: null
    },
    headerStyle: {
      type: null,
      default: null
    },
    headerClass: {
      type: String,
      default: null
    },
    bodyStyle: {
      type: null,
      default: null
    },
    bodyClass: {
      type: String,
      default: null
    },
    footerStyle: {
      type: null,
      default: null
    },
    footerClass: {
      type: String,
      default: null
    },
    showFilterMenu: {
      type: Boolean,
      default: true
    },
    showFilterOperator: {
      type: Boolean,
      default: true
    },
    showClearButton: {
      type: Boolean,
      default: true
    },
    showApplyButton: {
      type: Boolean,
      default: true
    },
    showFilterMatchModes: {
      type: Boolean,
      default: true
    },
    showAddButton: {
      type: Boolean,
      default: true
    },
    filterMatchModeOptions: {
      type: Array,
      default: null
    },
    maxConstraints: {
      type: Number,
      default: 2
    },
    excludeGlobalFilter: {
      type: Boolean,
      default: false
    },
    filterHeaderClass: {
      type: String,
      default: null
    },
    filterHeaderStyle: {
      type: null,
      default: null
    },
    filterMenuClass: {
      type: String,
      default: null
    },
    filterMenuStyle: {
      type: null,
      default: null
    },
    selectionMode: {
      type: String,
      default: null
    },
    expander: {
      type: Boolean,
      default: false
    },
    colspan: {
      type: Number,
      default: null
    },
    rowspan: {
      type: Number,
      default: null
    },
    rowReorder: {
      type: Boolean,
      default: false
    },
    rowReorderIcon: {
      type: String,
      default: "pi pi-bars"
    },
    reorderableColumn: {
      type: Boolean,
      default: true
    },
    rowEditor: {
      type: Boolean,
      default: false
    },
    frozen: {
      type: Boolean,
      default: false
    },
    alignFrozen: {
      type: String,
      default: "left"
    },
    exportable: {
      type: Boolean,
      default: true
    },
    exportHeader: {
      type: String,
      default: null
    },
    exportFooter: {
      type: String,
      default: null
    },
    filterMatchMode: {
      type: String,
      default: null
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  render() {
    return null;
  }
};
var script$1$2 = {
  name: "BreadcrumbItem",
  props: {
    item: null,
    template: null,
    exact: null
  },
  methods: {
    onClick(event2, navigate) {
      if (this.item.command) {
        this.item.command({
          originalEvent: event2,
          item: this.item
        });
      }
      if (this.item.to && navigate) {
        navigate(event2);
      }
    },
    containerClass() {
      return ["p-menuitem", { "p-disabled": this.disabled() }, this.item.class];
    },
    linkClass(routerProps) {
      return [
        "p-menuitem-link",
        {
          "router-link-active": routerProps && routerProps.isActive,
          "router-link-active-exact": this.exact && routerProps && routerProps.isExactActive
        }
      ];
    },
    visible() {
      return typeof this.item.visible === "function" ? this.item.visible() : this.item.visible !== false;
    },
    disabled() {
      return typeof this.item.disabled === "function" ? this.item.disabled() : this.item.disabled;
    },
    label() {
      return typeof this.item.label === "function" ? this.item.label() : this.item.label;
    },
    isCurrentUrl() {
      const { to, url } = this.item;
      let lastPath = this.$router ? this.$router.currentRoute.path : "";
      return to === lastPath || url === lastPath ? "page" : void 0;
    }
  },
  computed: {
    iconClass() {
      return ["p-menuitem-icon", this.item.icon];
    }
  }
};
const _hoisted_1$1$2 = ["href", "aria-current", "onClick"];
const _hoisted_2$1$2 = {
  key: 1,
  class: "p-menuitem-text"
};
const _hoisted_3$1$2 = ["href", "target", "aria-current"];
const _hoisted_4$1$2 = {
  key: 1,
  class: "p-menuitem-text"
};
function render$1$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");
  return $options.visible() ? (openBlock(), createElementBlock("li", {
    key: 0,
    class: normalizeClass($options.containerClass())
  }, [
    !$props.template ? (openBlock(), createElementBlock(Fragment$1, { key: 0 }, [
      $props.item.to ? (openBlock(), createBlock(_component_router_link, {
        key: 0,
        to: $props.item.to,
        custom: ""
      }, {
        default: withCtx(({ navigate, href, isActive, isExactActive }) => [
          createElementVNode("a", {
            href,
            class: normalizeClass($options.linkClass({ isActive, isExactActive })),
            "aria-current": $options.isCurrentUrl(),
            onClick: ($event) => $options.onClick($event, navigate)
          }, [
            $props.item.icon ? (openBlock(), createElementBlock("span", {
              key: 0,
              class: normalizeClass($options.iconClass)
            }, null, 2)) : createCommentVNode("", true),
            $props.item.label ? (openBlock(), createElementBlock("span", _hoisted_2$1$2, toDisplayString($options.label()), 1)) : createCommentVNode("", true)
          ], 10, _hoisted_1$1$2)
        ]),
        _: 1
      }, 8, ["to"])) : (openBlock(), createElementBlock("a", {
        key: 1,
        href: $props.item.url || "#",
        class: normalizeClass($options.linkClass()),
        target: $props.item.target,
        "aria-current": $options.isCurrentUrl(),
        onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args))
      }, [
        $props.item.icon ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass($options.iconClass)
        }, null, 2)) : createCommentVNode("", true),
        $props.item.label ? (openBlock(), createElementBlock("span", _hoisted_4$1$2, toDisplayString($options.label()), 1)) : createCommentVNode("", true)
      ], 10, _hoisted_3$1$2))
    ], 64)) : (openBlock(), createBlock(resolveDynamicComponent($props.template), {
      key: 1,
      item: $props.item
    }, null, 8, ["item"]))
  ], 2)) : createCommentVNode("", true);
}
script$1$2.render = render$1$2;
var script$3 = {
  name: "Breadcrumb",
  props: {
    model: {
      type: Array,
      default: null
    },
    home: {
      type: null,
      default: null
    },
    exact: {
      type: Boolean,
      default: true
    }
  },
  components: {
    BreadcrumbItem: script$1$2
  }
};
const _hoisted_1$3 = { class: "p-breadcrumb p-component" };
const _hoisted_2$3 = { class: "p-breadcrumb-list" };
const _hoisted_3$3 = {
  key: 0,
  class: "p-menuitem-separator"
};
const _hoisted_4$3 = /* @__PURE__ */ createElementVNode("span", {
  class: "pi pi-chevron-right",
  "aria-hidden": "true"
}, null, -1);
const _hoisted_5$3 = [
  _hoisted_4$3
];
function render$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_BreadcrumbItem = resolveComponent("BreadcrumbItem");
  return openBlock(), createElementBlock("nav", _hoisted_1$3, [
    createElementVNode("ol", _hoisted_2$3, [
      $props.home ? (openBlock(), createBlock(_component_BreadcrumbItem, {
        key: 0,
        item: $props.home,
        class: "p-breadcrumb-home",
        template: _ctx.$slots.item,
        exact: $props.exact
      }, null, 8, ["item", "template", "exact"])) : createCommentVNode("", true),
      (openBlock(true), createElementBlock(Fragment$1, null, renderList($props.model, (item, i) => {
        return openBlock(), createElementBlock(Fragment$1, {
          key: item.label
        }, [
          $props.home || i !== 0 ? (openBlock(), createElementBlock("li", _hoisted_3$3, _hoisted_5$3)) : createCommentVNode("", true),
          createVNode(_component_BreadcrumbItem, {
            item,
            template: _ctx.$slots.item,
            exact: $props.exact
          }, null, 8, ["item", "template", "exact"])
        ], 64);
      }), 128))
    ])
  ]);
}
function styleInject$3(css, ref2) {
  if (ref2 === void 0)
    ref2 = {};
  var insertAt = ref2.insertAt;
  if (!css || true) {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
var css_248z$3 = "\n.p-breadcrumb {\n    overflow-x: auto;\n}\n.p-breadcrumb .p-breadcrumb-list {\n    margin: 0;\n    padding: 0;\n    list-style-type: none;\n    display: flex;\n    align-items: center;\n    flex-wrap: nowrap;\n}\n.p-breadcrumb .p-menuitem-text {\n    line-height: 1;\n}\n.p-breadcrumb .p-menuitem-link {\n    text-decoration: none;\n    display: flex;\n    align-items: center;\n}\n.p-breadcrumb .p-menuitem-separator {\n    display: flex;\n    align-items: center;\n}\n.p-breadcrumb::-webkit-scrollbar {\n    display: none;\n}\n";
styleInject$3(css_248z$3);
script$3.render = render$3;
var script$1$1 = {
  name: "TreeNode",
  emits: ["node-toggle", "node-click", "checkbox-change"],
  props: {
    node: {
      type: null,
      default: null
    },
    expandedKeys: {
      type: null,
      default: null
    },
    selectionKeys: {
      type: null,
      default: null
    },
    selectionMode: {
      type: String,
      default: null
    },
    templates: {
      type: null,
      default: null
    },
    level: {
      type: Number,
      default: null
    },
    index: {
      type: Number,
      default: null
    }
  },
  nodeTouched: false,
  mounted() {
    const hasTreeSelectParent = this.$refs.currentNode.closest(".p-treeselect-items-wrapper");
    if (hasTreeSelectParent) {
      this.setAllNodesTabIndexes();
    }
  },
  methods: {
    toggle() {
      this.$emit("node-toggle", this.node);
    },
    label(node) {
      return typeof node.label === "function" ? node.label() : node.label;
    },
    onChildNodeToggle(node) {
      this.$emit("node-toggle", node);
    },
    onClick(event2) {
      if (DomHandler.hasClass(event2.target, "p-tree-toggler") || DomHandler.hasClass(event2.target.parentElement, "p-tree-toggler")) {
        return;
      }
      if (this.isCheckboxSelectionMode()) {
        this.toggleCheckbox();
      } else {
        this.$emit("node-click", {
          originalEvent: event2,
          nodeTouched: this.nodeTouched,
          node: this.node
        });
      }
      this.nodeTouched = false;
    },
    onChildNodeClick(event2) {
      this.$emit("node-click", event2);
    },
    onTouchEnd() {
      this.nodeTouched = true;
    },
    onKeyDown(event2) {
      if (!this.isSameNode(event2))
        return;
      switch (event2.code) {
        case "Tab":
          this.onTabKey(event2);
          break;
        case "ArrowDown":
          this.onArrowDown(event2);
          break;
        case "ArrowUp":
          this.onArrowUp(event2);
          break;
        case "ArrowRight":
          this.onArrowRight(event2);
          break;
        case "ArrowLeft":
          this.onArrowLeft(event2);
          break;
        case "Enter":
        case "Space":
          this.onEnterKey(event2);
          break;
      }
    },
    onArrowDown(event2) {
      const nodeElement = event2.target;
      const listElement = nodeElement.children[1];
      if (listElement) {
        this.focusRowChange(nodeElement, listElement.children[0]);
      } else {
        if (nodeElement.nextElementSibling) {
          this.focusRowChange(nodeElement, nodeElement.nextElementSibling);
        } else {
          let nextSiblingAncestor = this.findNextSiblingOfAncestor(nodeElement);
          if (nextSiblingAncestor) {
            this.focusRowChange(nodeElement, nextSiblingAncestor);
          }
        }
      }
      event2.preventDefault();
    },
    onArrowUp(event2) {
      const nodeElement = event2.target;
      if (nodeElement.previousElementSibling) {
        this.focusRowChange(nodeElement, nodeElement.previousElementSibling, this.findLastVisibleDescendant(nodeElement.previousElementSibling));
      } else {
        let parentNodeElement = this.getParentNodeElement(nodeElement);
        if (parentNodeElement) {
          this.focusRowChange(nodeElement, parentNodeElement);
        }
      }
      event2.preventDefault();
    },
    onArrowRight(event2) {
      if (this.leaf || this.expanded)
        return;
      event2.currentTarget.tabIndex = -1;
      this.$emit("node-toggle", this.node);
      this.$nextTick(() => {
        this.onArrowDown(event2);
      });
    },
    onArrowLeft(event2) {
      const togglerElement = DomHandler.findSingle(event2.currentTarget, ".p-tree-toggler");
      if (this.level === 0 && !this.expanded) {
        return false;
      }
      if (this.expanded && !this.leaf) {
        togglerElement.click();
        return false;
      }
      const target = this.findBeforeClickableNode(event2.currentTarget);
      if (target) {
        this.focusRowChange(event2.currentTarget, target);
      }
    },
    onEnterKey(event2) {
      this.setTabIndexForSelectionMode(event2, this.nodeTouched);
      this.onClick(event2);
      event2.preventDefault();
    },
    onTabKey() {
      this.setAllNodesTabIndexes();
    },
    setAllNodesTabIndexes() {
      const nodes = DomHandler.find(this.$refs.currentNode.closest(".p-tree-container"), ".p-treenode");
      const hasSelectedNode = [...nodes].some((node) => node.getAttribute("aria-selected") === "true" || node.getAttribute("aria-checked") === "true");
      [...nodes].forEach((node) => {
        node.tabIndex = -1;
      });
      if (hasSelectedNode) {
        const selectedNodes = [...nodes].filter((node) => node.getAttribute("aria-selected") === "true" || node.getAttribute("aria-checked") === "true");
        selectedNodes[0].tabIndex = 0;
        return;
      }
      [...nodes][0].tabIndex = 0;
    },
    setTabIndexForSelectionMode(event2, nodeTouched) {
      if (this.selectionMode !== null) {
        const elements = [...DomHandler.find(this.$refs.currentNode.parentElement, ".p-treenode")];
        event2.currentTarget.tabIndex = nodeTouched === false ? -1 : 0;
        if (elements.every((element) => element.tabIndex === -1)) {
          elements[0].tabIndex = 0;
        }
      }
    },
    focusRowChange(firstFocusableRow, currentFocusedRow, lastVisibleDescendant) {
      firstFocusableRow.tabIndex = "-1";
      currentFocusedRow.tabIndex = "0";
      this.focusNode(lastVisibleDescendant || currentFocusedRow);
    },
    findBeforeClickableNode(node) {
      const parentListElement = node.closest("ul").closest("li");
      if (parentListElement) {
        const prevNodeButton = DomHandler.findSingle(parentListElement, "button");
        if (prevNodeButton && prevNodeButton.style.visibility !== "hidden") {
          return parentListElement;
        }
        return this.findBeforeClickableNode(node.previousElementSibling);
      }
      return null;
    },
    toggleCheckbox() {
      let _selectionKeys = this.selectionKeys ? { ...this.selectionKeys } : {};
      const _check = !this.checked;
      this.propagateDown(this.node, _check, _selectionKeys);
      this.$emit("checkbox-change", {
        node: this.node,
        check: _check,
        selectionKeys: _selectionKeys
      });
    },
    propagateDown(node, check, selectionKeys) {
      if (check)
        selectionKeys[node.key] = { checked: true, partialChecked: false };
      else
        delete selectionKeys[node.key];
      if (node.children && node.children.length) {
        for (let child of node.children) {
          this.propagateDown(child, check, selectionKeys);
        }
      }
    },
    propagateUp(event2) {
      let check = event2.check;
      let _selectionKeys = { ...event2.selectionKeys };
      let checkedChildCount = 0;
      let childPartialSelected = false;
      for (let child of this.node.children) {
        if (_selectionKeys[child.key] && _selectionKeys[child.key].checked)
          checkedChildCount++;
        else if (_selectionKeys[child.key] && _selectionKeys[child.key].partialChecked)
          childPartialSelected = true;
      }
      if (check && checkedChildCount === this.node.children.length) {
        _selectionKeys[this.node.key] = { checked: true, partialChecked: false };
      } else {
        if (!check) {
          delete _selectionKeys[this.node.key];
        }
        if (childPartialSelected || checkedChildCount > 0 && checkedChildCount !== this.node.children.length)
          _selectionKeys[this.node.key] = { checked: false, partialChecked: true };
        else
          delete _selectionKeys[this.node.key];
      }
      this.$emit("checkbox-change", {
        node: event2.node,
        check: event2.check,
        selectionKeys: _selectionKeys
      });
    },
    onChildCheckboxChange(event2) {
      this.$emit("checkbox-change", event2);
    },
    findNextSiblingOfAncestor(nodeElement) {
      let parentNodeElement = this.getParentNodeElement(nodeElement);
      if (parentNodeElement) {
        if (parentNodeElement.nextElementSibling)
          return parentNodeElement.nextElementSibling;
        else
          return this.findNextSiblingOfAncestor(parentNodeElement);
      } else {
        return null;
      }
    },
    findLastVisibleDescendant(nodeElement) {
      const childrenListElement = nodeElement.children[1];
      if (childrenListElement) {
        const lastChildElement = childrenListElement.children[childrenListElement.children.length - 1];
        return this.findLastVisibleDescendant(lastChildElement);
      } else {
        return nodeElement;
      }
    },
    getParentNodeElement(nodeElement) {
      const parentNodeElement = nodeElement.parentElement.parentElement;
      return DomHandler.hasClass(parentNodeElement, "p-treenode") ? parentNodeElement : null;
    },
    focusNode(element) {
      element.focus();
    },
    isCheckboxSelectionMode() {
      return this.selectionMode === "checkbox";
    },
    isSameNode(event2) {
      return event2.currentTarget && (event2.currentTarget.isSameNode(event2.target) || event2.currentTarget.isSameNode(event2.target.closest(".p-treenode")));
    }
  },
  computed: {
    hasChildren() {
      return this.node.children && this.node.children.length > 0;
    },
    expanded() {
      return this.expandedKeys && this.expandedKeys[this.node.key] === true;
    },
    leaf() {
      return this.node.leaf === false ? false : !(this.node.children && this.node.children.length);
    },
    selectable() {
      return this.node.selectable === false ? false : this.selectionMode != null;
    },
    selected() {
      return this.selectionMode && this.selectionKeys ? this.selectionKeys[this.node.key] === true : false;
    },
    containerClass() {
      return ["p-treenode", { "p-treenode-leaf": this.leaf }];
    },
    contentClass() {
      return [
        "p-treenode-content",
        this.node.styleClass,
        {
          "p-treenode-selectable": this.selectable,
          "p-highlight": this.checkboxMode ? this.checked : this.selected
        }
      ];
    },
    icon() {
      return ["p-treenode-icon", this.node.icon];
    },
    toggleIcon() {
      return ["p-tree-toggler-icon pi pi-fw", this.expanded ? this.node.expandedIcon || "pi-chevron-down" : this.node.collapsedIcon || "pi-chevron-right"];
    },
    checkboxClass() {
      return ["p-checkbox-box", { "p-highlight": this.checked, "p-indeterminate": this.partialChecked }];
    },
    checkboxIcon() {
      return ["p-checkbox-icon", { "pi pi-check": this.checked, "pi pi-minus": this.partialChecked }];
    },
    checkboxMode() {
      return this.selectionMode === "checkbox" && this.node.selectable !== false;
    },
    checked() {
      return this.selectionKeys ? this.selectionKeys[this.node.key] && this.selectionKeys[this.node.key].checked : false;
    },
    partialChecked() {
      return this.selectionKeys ? this.selectionKeys[this.node.key] && this.selectionKeys[this.node.key].partialChecked : false;
    },
    ariaChecked() {
      return this.selectionMode === "single" || this.selectionMode === "multiple" ? this.selected : void 0;
    },
    ariaSelected() {
      return this.checkboxMode ? this.checked : void 0;
    }
  },
  directives: {
    ripple: Ripple
  }
};
const _hoisted_1$1$1 = ["aria-label", "aria-selected", "aria-expanded", "aria-setsize", "aria-posinset", "aria-level", "aria-checked", "tabindex"];
const _hoisted_2$1$1 = {
  key: 0,
  class: "p-checkbox p-component",
  "aria-hidden": "true"
};
const _hoisted_3$1$1 = { class: "p-treenode-label" };
const _hoisted_4$1$1 = {
  key: 0,
  class: "p-treenode-children",
  role: "group"
};
function render$1$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_TreeNode = resolveComponent("TreeNode", true);
  const _directive_ripple = resolveDirective("ripple");
  return openBlock(), createElementBlock("li", {
    ref: "currentNode",
    class: normalizeClass($options.containerClass),
    role: "treeitem",
    "aria-label": $options.label($props.node),
    "aria-selected": $options.ariaSelected,
    "aria-expanded": $options.expanded,
    "aria-setsize": $props.node.children ? $props.node.children.length : 0,
    "aria-posinset": $props.index + 1,
    "aria-level": $props.level,
    "aria-checked": $options.ariaChecked,
    tabindex: $props.index === 0 ? 0 : -1,
    onKeydown: _cache[3] || (_cache[3] = (...args) => $options.onKeyDown && $options.onKeyDown(...args))
  }, [
    createElementVNode("div", {
      class: normalizeClass($options.contentClass),
      onClick: _cache[1] || (_cache[1] = (...args) => $options.onClick && $options.onClick(...args)),
      onTouchend: _cache[2] || (_cache[2] = (...args) => $options.onTouchEnd && $options.onTouchEnd(...args)),
      style: normalizeStyle($props.node.style)
    }, [
      withDirectives((openBlock(), createElementBlock("button", {
        type: "button",
        class: "p-tree-toggler p-link",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.toggle && $options.toggle(...args)),
        tabindex: "-1",
        "aria-hidden": "true"
      }, [
        createElementVNode("span", {
          class: normalizeClass($options.toggleIcon)
        }, null, 2)
      ])), [
        [_directive_ripple]
      ]),
      $options.checkboxMode ? (openBlock(), createElementBlock("div", _hoisted_2$1$1, [
        createElementVNode("div", {
          class: normalizeClass($options.checkboxClass),
          role: "checkbox"
        }, [
          createElementVNode("span", {
            class: normalizeClass($options.checkboxIcon)
          }, null, 2)
        ], 2)
      ])) : createCommentVNode("", true),
      createElementVNode("span", {
        class: normalizeClass($options.icon)
      }, null, 2),
      createElementVNode("span", _hoisted_3$1$1, [
        $props.templates[$props.node.type] || $props.templates["default"] ? (openBlock(), createBlock(resolveDynamicComponent($props.templates[$props.node.type] || $props.templates["default"]), {
          key: 0,
          node: $props.node
        }, null, 8, ["node"])) : (openBlock(), createElementBlock(Fragment$1, { key: 1 }, [
          createTextVNode(toDisplayString($options.label($props.node)), 1)
        ], 64))
      ])
    ], 38),
    $options.hasChildren && $options.expanded ? (openBlock(), createElementBlock("ul", _hoisted_4$1$1, [
      (openBlock(true), createElementBlock(Fragment$1, null, renderList($props.node.children, (childNode) => {
        return openBlock(), createBlock(_component_TreeNode, {
          key: childNode.key,
          node: childNode,
          templates: $props.templates,
          level: $props.level + 1,
          expandedKeys: $props.expandedKeys,
          onNodeToggle: $options.onChildNodeToggle,
          onNodeClick: $options.onChildNodeClick,
          selectionMode: $props.selectionMode,
          selectionKeys: $props.selectionKeys,
          onCheckboxChange: $options.propagateUp
        }, null, 8, ["node", "templates", "level", "expandedKeys", "onNodeToggle", "onNodeClick", "selectionMode", "selectionKeys", "onCheckboxChange"]);
      }), 128))
    ])) : createCommentVNode("", true)
  ], 42, _hoisted_1$1$1);
}
script$1$1.render = render$1$1;
var script$2 = {
  name: "Tree",
  emits: ["node-expand", "node-collapse", "update:expandedKeys", "update:selectionKeys", "node-select", "node-unselect"],
  props: {
    value: {
      type: null,
      default: null
    },
    expandedKeys: {
      type: null,
      default: null
    },
    selectionKeys: {
      type: null,
      default: null
    },
    selectionMode: {
      type: String,
      default: null
    },
    metaKeySelection: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingIcon: {
      type: String,
      default: "pi pi-spinner"
    },
    filter: {
      type: Boolean,
      default: false
    },
    filterBy: {
      type: String,
      default: "label"
    },
    filterMode: {
      type: String,
      default: "lenient"
    },
    filterPlaceholder: {
      type: String,
      default: null
    },
    filterLocale: {
      type: String,
      default: void 0
    },
    scrollHeight: {
      type: String,
      default: null
    },
    level: {
      type: Number,
      default: 0
    },
    "aria-labelledby": {
      type: String,
      default: null
    },
    "aria-label": {
      type: String,
      default: null
    }
  },
  data() {
    return {
      d_expandedKeys: this.expandedKeys || {},
      filterValue: null
    };
  },
  watch: {
    expandedKeys(newValue) {
      this.d_expandedKeys = newValue;
    }
  },
  methods: {
    onNodeToggle(node) {
      const key = node.key;
      if (this.d_expandedKeys[key]) {
        delete this.d_expandedKeys[key];
        this.$emit("node-collapse", node);
      } else {
        this.d_expandedKeys[key] = true;
        this.$emit("node-expand", node);
      }
      this.d_expandedKeys = { ...this.d_expandedKeys };
      this.$emit("update:expandedKeys", this.d_expandedKeys);
    },
    onNodeClick(event2) {
      if (this.selectionMode != null && event2.node.selectable !== false) {
        const metaSelection = event2.nodeTouched ? false : this.metaKeySelection;
        const _selectionKeys = metaSelection ? this.handleSelectionWithMetaKey(event2) : this.handleSelectionWithoutMetaKey(event2);
        this.$emit("update:selectionKeys", _selectionKeys);
      }
    },
    onCheckboxChange(event2) {
      this.$emit("update:selectionKeys", event2.selectionKeys);
      if (event2.check)
        this.$emit("node-select", event2.node);
      else
        this.$emit("node-unselect", event2.node);
    },
    handleSelectionWithMetaKey(event2) {
      const originalEvent = event2.originalEvent;
      const node = event2.node;
      const metaKey = originalEvent.metaKey || originalEvent.ctrlKey;
      const selected = this.isNodeSelected(node);
      let _selectionKeys;
      if (selected && metaKey) {
        if (this.isSingleSelectionMode()) {
          _selectionKeys = {};
        } else {
          _selectionKeys = { ...this.selectionKeys };
          delete _selectionKeys[node.key];
        }
        this.$emit("node-unselect", node);
      } else {
        if (this.isSingleSelectionMode()) {
          _selectionKeys = {};
        } else if (this.isMultipleSelectionMode()) {
          _selectionKeys = !metaKey ? {} : this.selectionKeys ? { ...this.selectionKeys } : {};
        }
        _selectionKeys[node.key] = true;
        this.$emit("node-select", node);
      }
      return _selectionKeys;
    },
    handleSelectionWithoutMetaKey(event2) {
      const node = event2.node;
      const selected = this.isNodeSelected(node);
      let _selectionKeys;
      if (this.isSingleSelectionMode()) {
        if (selected) {
          _selectionKeys = {};
          this.$emit("node-unselect", node);
        } else {
          _selectionKeys = {};
          _selectionKeys[node.key] = true;
          this.$emit("node-select", node);
        }
      } else {
        if (selected) {
          _selectionKeys = { ...this.selectionKeys };
          delete _selectionKeys[node.key];
          this.$emit("node-unselect", node);
        } else {
          _selectionKeys = this.selectionKeys ? { ...this.selectionKeys } : {};
          _selectionKeys[node.key] = true;
          this.$emit("node-select", node);
        }
      }
      return _selectionKeys;
    },
    isSingleSelectionMode() {
      return this.selectionMode === "single";
    },
    isMultipleSelectionMode() {
      return this.selectionMode === "multiple";
    },
    isNodeSelected(node) {
      return this.selectionMode && this.selectionKeys ? this.selectionKeys[node.key] === true : false;
    },
    isChecked(node) {
      return this.selectionKeys ? this.selectionKeys[node.key] && this.selectionKeys[node.key].checked : false;
    },
    isNodeLeaf(node) {
      return node.leaf === false ? false : !(node.children && node.children.length);
    },
    onFilterKeydown(event2) {
      if (event2.which === 13) {
        event2.preventDefault();
      }
    },
    findFilteredNodes(node, paramsWithoutNode) {
      if (node) {
        let matched = false;
        if (node.children) {
          let childNodes = [...node.children];
          node.children = [];
          for (let childNode of childNodes) {
            let copyChildNode = { ...childNode };
            if (this.isFilterMatched(copyChildNode, paramsWithoutNode)) {
              matched = true;
              node.children.push(copyChildNode);
            }
          }
        }
        if (matched) {
          return true;
        }
      }
    },
    isFilterMatched(node, { searchFields, filterText, strict }) {
      let matched = false;
      for (let field of searchFields) {
        let fieldValue = String(ObjectUtils.resolveFieldData(node, field)).toLocaleLowerCase(this.filterLocale);
        if (fieldValue.indexOf(filterText) > -1) {
          matched = true;
        }
      }
      if (!matched || strict && !this.isNodeLeaf(node)) {
        matched = this.findFilteredNodes(node, { searchFields, filterText, strict }) || matched;
      }
      return matched;
    }
  },
  computed: {
    containerClass() {
      return [
        "p-tree p-component",
        {
          "p-tree-selectable": this.selectionMode != null,
          "p-tree-loading": this.loading,
          "p-tree-flex-scrollable": this.scrollHeight === "flex"
        }
      ];
    },
    loadingIconClass() {
      return ["p-tree-loading-icon pi-spin", this.loadingIcon];
    },
    filteredValue() {
      let filteredNodes = [];
      const searchFields = this.filterBy.split(",");
      const filterText = this.filterValue.trim().toLocaleLowerCase(this.filterLocale);
      const strict = this.filterMode === "strict";
      for (let node of this.value) {
        let _node = { ...node };
        let paramsWithoutNode = { searchFields, filterText, strict };
        if (strict && (this.findFilteredNodes(_node, paramsWithoutNode) || this.isFilterMatched(_node, paramsWithoutNode)) || !strict && (this.isFilterMatched(_node, paramsWithoutNode) || this.findFilteredNodes(_node, paramsWithoutNode))) {
          filteredNodes.push(_node);
        }
      }
      return filteredNodes;
    },
    valueToRender() {
      if (this.filterValue && this.filterValue.trim().length > 0)
        return this.filteredValue;
      else
        return this.value;
    }
  },
  components: {
    TreeNode: script$1$1
  }
};
const _hoisted_1$2 = {
  key: 0,
  class: "p-tree-loading-overlay p-component-overlay"
};
const _hoisted_2$2 = {
  key: 1,
  class: "p-tree-filter-container"
};
const _hoisted_3$2 = ["placeholder"];
const _hoisted_4$2 = /* @__PURE__ */ createElementVNode("span", { class: "p-tree-filter-icon pi pi-search" }, null, -1);
const _hoisted_5$2 = ["aria-labelledby", "aria-label"];
function render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_TreeNode = resolveComponent("TreeNode");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.containerClass)
  }, [
    $props.loading ? (openBlock(), createElementBlock("div", _hoisted_1$2, [
      createElementVNode("i", {
        class: normalizeClass($options.loadingIconClass)
      }, null, 2)
    ])) : createCommentVNode("", true),
    $props.filter ? (openBlock(), createElementBlock("div", _hoisted_2$2, [
      withDirectives(createElementVNode("input", {
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.filterValue = $event),
        type: "text",
        autocomplete: "off",
        class: "p-tree-filter p-inputtext p-component",
        placeholder: $props.filterPlaceholder,
        onKeydown: _cache[1] || (_cache[1] = (...args) => $options.onFilterKeydown && $options.onFilterKeydown(...args))
      }, null, 40, _hoisted_3$2), [
        [vModelText, $data.filterValue]
      ]),
      _hoisted_4$2
    ])) : createCommentVNode("", true),
    createElementVNode("div", {
      class: "p-tree-wrapper",
      style: normalizeStyle({ maxHeight: $props.scrollHeight })
    }, [
      createElementVNode("ul", {
        class: "p-tree-container",
        role: "tree",
        "aria-labelledby": _ctx.ariaLabelledby,
        "aria-label": _ctx.ariaLabel
      }, [
        (openBlock(true), createElementBlock(Fragment$1, null, renderList($options.valueToRender, (node, index) => {
          return openBlock(), createBlock(_component_TreeNode, {
            key: node.key,
            node,
            templates: _ctx.$slots,
            level: $props.level + 1,
            index,
            expandedKeys: $data.d_expandedKeys,
            onNodeToggle: $options.onNodeToggle,
            onNodeClick: $options.onNodeClick,
            selectionMode: $props.selectionMode,
            selectionKeys: $props.selectionKeys,
            onCheckboxChange: $options.onCheckboxChange
          }, null, 8, ["node", "templates", "level", "index", "expandedKeys", "onNodeToggle", "onNodeClick", "selectionMode", "selectionKeys", "onCheckboxChange"]);
        }), 128))
      ], 8, _hoisted_5$2)
    ], 4)
  ], 2);
}
function styleInject$2(css, ref2) {
  if (ref2 === void 0)
    ref2 = {};
  var insertAt = ref2.insertAt;
  if (!css || true) {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
var css_248z$2 = "\n.p-tree-container {\n    margin: 0;\n    padding: 0;\n    list-style-type: none;\n    overflow: auto;\n}\n.p-treenode-children {\n    margin: 0;\n    padding: 0;\n    list-style-type: none;\n}\n.p-tree-wrapper {\n    overflow: auto;\n}\n.p-treenode-selectable {\n    cursor: pointer;\n    user-select: none;\n}\n.p-tree-toggler {\n    cursor: pointer;\n    user-select: none;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    overflow: hidden;\n    position: relative;\n    flex-shrink: 0;\n}\n.p-treenode-leaf > .p-treenode-content .p-tree-toggler {\n    visibility: hidden;\n}\n.p-treenode-content {\n    display: flex;\n    align-items: center;\n}\n.p-tree-filter {\n    width: 100%;\n}\n.p-tree-filter-container {\n    position: relative;\n    display: block;\n    width: 100%;\n}\n.p-tree-filter-icon {\n    position: absolute;\n    top: 50%;\n    margin-top: -0.5rem;\n}\n.p-tree-loading {\n    position: relative;\n    min-height: 4rem;\n}\n.p-tree .p-tree-loading-overlay {\n    position: absolute;\n    z-index: 1;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n.p-tree-flex-scrollable {\n    display: flex;\n    flex: 1;\n    height: 100%;\n    flex-direction: column;\n}\n.p-tree-flex-scrollable .p-tree-wrapper {\n    flex: 1;\n}\n";
styleInject$2(css_248z$2);
script$2.render = render$2;
var script$1 = {
  name: "AutoComplete",
  emits: ["update:modelValue", "change", "focus", "blur", "item-select", "item-unselect", "dropdown-click", "clear", "complete", "before-show", "before-hide", "show", "hide"],
  props: {
    modelValue: null,
    suggestions: {
      type: Array,
      default: null
    },
    field: {
      // TODO: Deprecated since v3.16.0
      type: [String, Function],
      default: null
    },
    optionLabel: null,
    optionDisabled: null,
    optionGroupLabel: null,
    optionGroupChildren: null,
    scrollHeight: {
      type: String,
      default: "200px"
    },
    dropdown: {
      type: Boolean,
      default: false
    },
    dropdownMode: {
      type: String,
      default: "blank"
    },
    autoHighlight: {
      // TODO: Deprecated since v3.16.0. Use selectOnFocus property instead.
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: null
    },
    dataKey: {
      type: String,
      default: null
    },
    minLength: {
      type: Number,
      default: 1
    },
    delay: {
      type: Number,
      default: 300
    },
    appendTo: {
      type: String,
      default: "body"
    },
    forceSelection: {
      type: Boolean,
      default: false
    },
    completeOnFocus: {
      type: Boolean,
      default: false
    },
    inputId: {
      type: String,
      default: null
    },
    inputStyle: {
      type: Object,
      default: null
    },
    inputClass: {
      type: [String, Object],
      default: null
    },
    inputProps: {
      type: null,
      default: null
    },
    panelStyle: {
      type: Object,
      default: null
    },
    panelClass: {
      type: [String, Object],
      default: null
    },
    panelProps: {
      type: null,
      default: null
    },
    dropdownIcon: {
      type: String,
      default: "pi pi-chevron-down"
    },
    dropdownClass: {
      type: [String, Object],
      default: null
    },
    loadingIcon: {
      type: String,
      default: "pi pi-spinner"
    },
    removeTokenIcon: {
      type: String,
      default: "pi pi-times-circle"
    },
    virtualScrollerOptions: {
      type: Object,
      default: null
    },
    autoOptionFocus: {
      type: Boolean,
      default: true
    },
    selectOnFocus: {
      type: Boolean,
      default: false
    },
    searchLocale: {
      type: String,
      default: void 0
    },
    searchMessage: {
      type: String,
      default: null
    },
    selectionMessage: {
      type: String,
      default: null
    },
    emptySelectionMessage: {
      type: String,
      default: null
    },
    emptySearchMessage: {
      type: String,
      default: null
    },
    tabindex: {
      type: Number,
      default: 0
    },
    "aria-label": {
      type: String,
      default: null
    },
    "aria-labelledby": {
      type: String,
      default: null
    }
  },
  outsideClickListener: null,
  resizeListener: null,
  scrollHandler: null,
  overlay: null,
  virtualScroller: null,
  searchTimeout: null,
  focusOnHover: false,
  dirty: false,
  data() {
    return {
      id: this.$attrs.id,
      focused: false,
      focusedOptionIndex: -1,
      focusedMultipleOptionIndex: -1,
      overlayVisible: false,
      searching: false
    };
  },
  watch: {
    "$attrs.id": function(newValue) {
      this.id = newValue || UniqueComponentId();
    },
    suggestions() {
      if (this.searching) {
        ObjectUtils.isNotEmpty(this.suggestions) ? this.show() : !!this.$slots.empty ? this.show() : this.hide();
        this.focusedOptionIndex = this.overlayVisible && this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : -1;
        this.searching = false;
      }
      this.autoUpdateModel();
    }
  },
  mounted() {
    this.id = this.id || UniqueComponentId();
    this.autoUpdateModel();
  },
  updated() {
    if (this.overlayVisible) {
      this.alignOverlay();
    }
  },
  beforeUnmount() {
    this.unbindOutsideClickListener();
    this.unbindResizeListener();
    if (this.scrollHandler) {
      this.scrollHandler.destroy();
      this.scrollHandler = null;
    }
    if (this.overlay) {
      ZIndexUtils.clear(this.overlay);
      this.overlay = null;
    }
  },
  methods: {
    getOptionIndex(index, fn) {
      return this.virtualScrollerDisabled ? index : fn && fn(index)["index"];
    },
    getOptionLabel(option) {
      return this.field || this.optionLabel ? ObjectUtils.resolveFieldData(option, this.field || this.optionLabel) : option;
    },
    getOptionValue(option) {
      return option;
    },
    getOptionRenderKey(option, index) {
      return (this.dataKey ? ObjectUtils.resolveFieldData(option, this.dataKey) : this.getOptionLabel(option)) + "_" + index;
    },
    isOptionDisabled(option) {
      return this.optionDisabled ? ObjectUtils.resolveFieldData(option, this.optionDisabled) : false;
    },
    isOptionGroup(option) {
      return this.optionGroupLabel && option.optionGroup && option.group;
    },
    getOptionGroupLabel(optionGroup) {
      return ObjectUtils.resolveFieldData(optionGroup, this.optionGroupLabel);
    },
    getOptionGroupChildren(optionGroup) {
      return ObjectUtils.resolveFieldData(optionGroup, this.optionGroupChildren);
    },
    getAriaPosInset(index) {
      return (this.optionGroupLabel ? index - this.visibleOptions.slice(0, index).filter((option) => this.isOptionGroup(option)).length : index) + 1;
    },
    show(isFocus) {
      this.$emit("before-show");
      this.dirty = true;
      this.overlayVisible = true;
      this.focusedOptionIndex = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : -1;
      isFocus && DomHandler.focus(this.$refs.focusInput);
    },
    hide(isFocus) {
      const _hide = () => {
        this.$emit("before-hide");
        this.dirty = isFocus;
        this.overlayVisible = false;
        this.focusedOptionIndex = -1;
        isFocus && DomHandler.focus(this.$refs.focusInput);
      };
      setTimeout(() => {
        _hide();
      }, 0);
    },
    onFocus(event2) {
      if (this.disabled) {
        return;
      }
      if (!this.dirty && this.completeOnFocus) {
        this.search(event2, event2.target.value, "focus");
      }
      this.dirty = true;
      this.focused = true;
      this.focusedOptionIndex = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : this.overlayVisible && this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : -1;
      this.overlayVisible && this.scrollInView(this.focusedOptionIndex);
      this.$emit("focus", event2);
    },
    onBlur(event2) {
      this.dirty = false;
      this.focused = false;
      this.focusedOptionIndex = -1;
      this.$emit("blur", event2);
    },
    onKeyDown(event2) {
      if (this.disabled) {
        event2.preventDefault();
        return;
      }
      switch (event2.code) {
        case "ArrowDown":
          this.onArrowDownKey(event2);
          break;
        case "ArrowUp":
          this.onArrowUpKey(event2);
          break;
        case "ArrowLeft":
          this.onArrowLeftKey(event2);
          break;
        case "ArrowRight":
          this.onArrowRightKey(event2);
          break;
        case "Home":
          this.onHomeKey(event2);
          break;
        case "End":
          this.onEndKey(event2);
          break;
        case "PageDown":
          this.onPageDownKey(event2);
          break;
        case "PageUp":
          this.onPageUpKey(event2);
          break;
        case "Enter":
          this.onEnterKey(event2);
          break;
        case "Escape":
          this.onEscapeKey(event2);
          break;
        case "Tab":
          this.onTabKey(event2);
          break;
        case "Backspace":
          this.onBackspaceKey(event2);
          break;
      }
    },
    onInput(event2) {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      let query = event2.target.value;
      if (!this.multiple) {
        this.updateModel(event2, query);
      }
      if (query.length === 0) {
        this.hide();
        this.$emit("clear");
      } else {
        if (query.length >= this.minLength) {
          this.focusedOptionIndex = -1;
          this.searchTimeout = setTimeout(() => {
            this.search(event2, query, "input");
          }, this.delay);
        } else {
          this.hide();
        }
      }
    },
    onChange(event2) {
      if (this.forceSelection) {
        let valid = false;
        if (this.visibleOptions) {
          const matchedValue = this.visibleOptions.find((option) => this.isOptionMatched(option, this.$refs.focusInput.value || ""));
          if (matchedValue !== void 0) {
            valid = true;
            !this.isSelected(matchedValue) && this.onOptionSelect(event2, matchedValue);
          }
        }
        if (!valid) {
          this.$refs.focusInput.value = "";
          this.$emit("clear");
          !this.multiple && this.updateModel(event2, null);
        }
      }
    },
    onMultipleContainerFocus() {
      if (this.disabled) {
        return;
      }
      this.focused = true;
    },
    onMultipleContainerBlur() {
      this.focusedMultipleOptionIndex = -1;
      this.focused = false;
    },
    onMultipleContainerKeyDown(event2) {
      if (this.disabled) {
        event2.preventDefault();
        return;
      }
      switch (event2.code) {
        case "ArrowLeft":
          this.onArrowLeftKeyOnMultiple(event2);
          break;
        case "ArrowRight":
          this.onArrowRightKeyOnMultiple(event2);
          break;
        case "Backspace":
          this.onBackspaceKeyOnMultiple(event2);
          break;
      }
    },
    onContainerClick(event2) {
      if (this.disabled || this.searching || this.isInputClicked(event2) || this.isDropdownClicked(event2)) {
        return;
      }
      if (!this.overlay || !this.overlay.contains(event2.target)) {
        DomHandler.focus(this.$refs.focusInput);
      }
    },
    onDropdownClick(event2) {
      let query = void 0;
      if (this.overlayVisible) {
        this.hide(true);
      } else {
        DomHandler.focus(this.$refs.focusInput);
        query = this.$refs.focusInput.value;
        if (this.dropdownMode === "blank")
          this.search(event2, "", "dropdown");
        else if (this.dropdownMode === "current")
          this.search(event2, query, "dropdown");
      }
      this.$emit("dropdown-click", { originalEvent: event2, query });
    },
    onOptionSelect(event2, option, isHide = true) {
      const value = this.getOptionValue(option);
      if (this.multiple) {
        this.$refs.focusInput.value = "";
        if (!this.isSelected(option)) {
          this.updateModel(event2, [...this.modelValue || [], value]);
        }
      } else {
        this.updateModel(event2, value);
      }
      this.$emit("item-select", { originalEvent: event2, value: option });
      isHide && this.hide(true);
    },
    onOptionMouseMove(event2, index) {
      if (this.focusOnHover) {
        this.changeFocusedOptionIndex(event2, index);
      }
    },
    onOverlayClick(event2) {
      OverlayEventBus.emit("overlay-click", {
        originalEvent: event2,
        target: this.$el
      });
    },
    onOverlayKeyDown(event2) {
      switch (event2.code) {
        case "Escape":
          this.onEscapeKey(event2);
          break;
      }
    },
    onArrowDownKey(event2) {
      if (!this.overlayVisible) {
        return;
      }
      const optionIndex = this.focusedOptionIndex !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex) : this.findFirstFocusedOptionIndex();
      this.changeFocusedOptionIndex(event2, optionIndex);
      event2.preventDefault();
    },
    onArrowUpKey(event2) {
      if (!this.overlayVisible) {
        return;
      }
      if (event2.altKey) {
        if (this.focusedOptionIndex !== -1) {
          this.onOptionSelect(event2, this.visibleOptions[this.focusedOptionIndex]);
        }
        this.overlayVisible && this.hide();
        event2.preventDefault();
      } else {
        const optionIndex = this.focusedOptionIndex !== -1 ? this.findPrevOptionIndex(this.focusedOptionIndex) : this.findLastFocusedOptionIndex();
        this.changeFocusedOptionIndex(event2, optionIndex);
        event2.preventDefault();
      }
    },
    onArrowLeftKey(event2) {
      const target = event2.currentTarget;
      this.focusedOptionIndex = -1;
      if (this.multiple) {
        if (ObjectUtils.isEmpty(target.value) && this.hasSelectedOption) {
          DomHandler.focus(this.$refs.multiContainer);
          this.focusedMultipleOptionIndex = this.modelValue.length;
        } else {
          event2.stopPropagation();
        }
      }
    },
    onArrowRightKey(event2) {
      this.focusedOptionIndex = -1;
      this.multiple && event2.stopPropagation();
    },
    onHomeKey(event2) {
      const { currentTarget } = event2;
      const len = currentTarget.value.length;
      currentTarget.setSelectionRange(0, event2.shiftKey ? len : 0);
      this.focusedOptionIndex = -1;
      event2.preventDefault();
    },
    onEndKey(event2) {
      const { currentTarget } = event2;
      const len = currentTarget.value.length;
      currentTarget.setSelectionRange(event2.shiftKey ? 0 : len, len);
      this.focusedOptionIndex = -1;
      event2.preventDefault();
    },
    onPageUpKey(event2) {
      this.scrollInView(0);
      event2.preventDefault();
    },
    onPageDownKey(event2) {
      this.scrollInView(this.visibleOptions.length - 1);
      event2.preventDefault();
    },
    onEnterKey(event2) {
      if (!this.overlayVisible) {
        this.onArrowDownKey(event2);
      } else {
        if (this.focusedOptionIndex !== -1) {
          this.onOptionSelect(event2, this.visibleOptions[this.focusedOptionIndex]);
        }
        this.hide();
      }
      event2.preventDefault();
    },
    onEscapeKey(event2) {
      this.overlayVisible && this.hide(true);
      event2.preventDefault();
    },
    onTabKey(event2) {
      if (this.focusedOptionIndex !== -1) {
        this.onOptionSelect(event2, this.visibleOptions[this.focusedOptionIndex]);
      }
      this.overlayVisible && this.hide();
    },
    onBackspaceKey(event2) {
      if (this.multiple) {
        if (ObjectUtils.isNotEmpty(this.modelValue) && !this.$refs.focusInput.value) {
          const removedValue = this.modelValue[this.modelValue.length - 1];
          const newValue = this.modelValue.slice(0, -1);
          this.$emit("update:modelValue", newValue);
          this.$emit("item-unselect", { originalEvent: event2, value: removedValue });
        }
        event2.stopPropagation();
      }
    },
    onArrowLeftKeyOnMultiple() {
      this.focusedMultipleOptionIndex = this.focusedMultipleOptionIndex < 1 ? 0 : this.focusedMultipleOptionIndex - 1;
    },
    onArrowRightKeyOnMultiple() {
      this.focusedMultipleOptionIndex++;
      if (this.focusedMultipleOptionIndex > this.modelValue.length - 1) {
        this.focusedMultipleOptionIndex = -1;
        DomHandler.focus(this.$refs.focusInput);
      }
    },
    onBackspaceKeyOnMultiple(event2) {
      if (this.focusedMultipleOptionIndex !== -1) {
        this.removeOption(event2, this.focusedMultipleOptionIndex);
      }
    },
    onOverlayEnter(el) {
      ZIndexUtils.set("overlay", el, this.$primevue.config.zIndex.overlay);
      this.alignOverlay();
    },
    onOverlayAfterEnter() {
      this.bindOutsideClickListener();
      this.bindScrollListener();
      this.bindResizeListener();
      this.$emit("show");
    },
    onOverlayLeave() {
      this.unbindOutsideClickListener();
      this.unbindScrollListener();
      this.unbindResizeListener();
      this.$emit("hide");
      this.overlay = null;
    },
    onOverlayAfterLeave(el) {
      ZIndexUtils.clear(el);
    },
    alignOverlay() {
      let target = this.multiple ? this.$refs.multiContainer : this.$refs.focusInput;
      if (this.appendTo === "self") {
        DomHandler.relativePosition(this.overlay, target);
      } else {
        this.overlay.style.minWidth = DomHandler.getOuterWidth(target) + "px";
        DomHandler.absolutePosition(this.overlay, target);
      }
    },
    bindOutsideClickListener() {
      if (!this.outsideClickListener) {
        this.outsideClickListener = (event2) => {
          if (this.overlayVisible && this.overlay && this.isOutsideClicked(event2)) {
            this.hide();
          }
        };
        document.addEventListener("click", this.outsideClickListener);
      }
    },
    unbindOutsideClickListener() {
      if (this.outsideClickListener) {
        document.removeEventListener("click", this.outsideClickListener);
        this.outsideClickListener = null;
      }
    },
    bindScrollListener() {
      if (!this.scrollHandler) {
        this.scrollHandler = new ConnectedOverlayScrollHandler(this.$refs.container, () => {
          if (this.overlayVisible) {
            this.hide();
          }
        });
      }
      this.scrollHandler.bindScrollListener();
    },
    unbindScrollListener() {
      if (this.scrollHandler) {
        this.scrollHandler.unbindScrollListener();
      }
    },
    bindResizeListener() {
      if (!this.resizeListener) {
        this.resizeListener = () => {
          if (this.overlayVisible && !DomHandler.isTouchDevice()) {
            this.hide();
          }
        };
        window.addEventListener("resize", this.resizeListener);
      }
    },
    unbindResizeListener() {
      if (this.resizeListener) {
        window.removeEventListener("resize", this.resizeListener);
        this.resizeListener = null;
      }
    },
    isOutsideClicked(event2) {
      return !this.overlay.contains(event2.target) && !this.isInputClicked(event2) && !this.isDropdownClicked(event2);
    },
    isInputClicked(event2) {
      if (this.multiple)
        return event2.target === this.$refs.multiContainer || this.$refs.multiContainer.contains(event2.target);
      else
        return event2.target === this.$refs.focusInput;
    },
    isDropdownClicked(event2) {
      return this.$refs.dropdownButton ? event2.target === this.$refs.dropdownButton || this.$refs.dropdownButton.$el.contains(event2.target) : false;
    },
    isOptionMatched(option, value) {
      return this.isValidOption(option) && this.getOptionLabel(option).toLocaleLowerCase(this.searchLocale) === value.toLocaleLowerCase(this.searchLocale);
    },
    isValidOption(option) {
      return option && !(this.isOptionDisabled(option) || this.isOptionGroup(option));
    },
    isValidSelectedOption(option) {
      return this.isValidOption(option) && this.isSelected(option);
    },
    isSelected(option) {
      return ObjectUtils.equals(this.modelValue, this.getOptionValue(option), this.equalityKey);
    },
    findFirstOptionIndex() {
      return this.visibleOptions.findIndex((option) => this.isValidOption(option));
    },
    findLastOptionIndex() {
      return ObjectUtils.findLastIndex(this.visibleOptions, (option) => this.isValidOption(option));
    },
    findNextOptionIndex(index) {
      const matchedOptionIndex = index < this.visibleOptions.length - 1 ? this.visibleOptions.slice(index + 1).findIndex((option) => this.isValidOption(option)) : -1;
      return matchedOptionIndex > -1 ? matchedOptionIndex + index + 1 : index;
    },
    findPrevOptionIndex(index) {
      const matchedOptionIndex = index > 0 ? ObjectUtils.findLastIndex(this.visibleOptions.slice(0, index), (option) => this.isValidOption(option)) : -1;
      return matchedOptionIndex > -1 ? matchedOptionIndex : index;
    },
    findSelectedOptionIndex() {
      return this.hasSelectedOption ? this.visibleOptions.findIndex((option) => this.isValidSelectedOption(option)) : -1;
    },
    findFirstFocusedOptionIndex() {
      const selectedIndex = this.findSelectedOptionIndex();
      return selectedIndex < 0 ? this.findFirstOptionIndex() : selectedIndex;
    },
    findLastFocusedOptionIndex() {
      const selectedIndex = this.findSelectedOptionIndex();
      return selectedIndex < 0 ? this.findLastOptionIndex() : selectedIndex;
    },
    search(event2, query, source) {
      if (query === void 0 || query === null) {
        return;
      }
      if (source === "input" && query.trim().length === 0) {
        return;
      }
      this.searching = true;
      this.$emit("complete", { originalEvent: event2, query });
    },
    removeOption(event2, index) {
      const removedOption = this.modelValue[index];
      const value = this.modelValue.filter((_, i) => i !== index).map((option) => this.getOptionValue(option));
      this.updateModel(event2, value);
      this.$emit("item-unselect", { originalEvent: event2, value: removedOption });
      this.dirty = true;
      DomHandler.focus(this.$refs.focusInput);
    },
    changeFocusedOptionIndex(event2, index) {
      if (this.focusedOptionIndex !== index) {
        this.focusedOptionIndex = index;
        this.scrollInView();
        if (this.selectOnFocus || this.autoHighlight) {
          this.onOptionSelect(event2, this.visibleOptions[index], false);
        }
      }
    },
    scrollInView(index = -1) {
      const id = index !== -1 ? `${this.id}_${index}` : this.focusedOptionId;
      const element = DomHandler.findSingle(this.list, `li[id="${id}"]`);
      if (element) {
        element.scrollIntoView && element.scrollIntoView({ block: "nearest", inline: "start" });
      } else if (!this.virtualScrollerDisabled) {
        setTimeout(() => {
          this.virtualScroller && this.virtualScroller.scrollToIndex(index !== -1 ? index : this.focusedOptionIndex);
        }, 0);
      }
    },
    autoUpdateModel() {
      if ((this.selectOnFocus || this.autoHighlight) && this.autoOptionFocus && !this.hasSelectedOption) {
        this.focusedOptionIndex = this.findFirstFocusedOptionIndex();
        this.onOptionSelect(null, this.visibleOptions[this.focusedOptionIndex], false);
      }
    },
    updateModel(event2, value) {
      this.$emit("update:modelValue", value);
      this.$emit("change", { originalEvent: event2, value });
    },
    flatOptions(options) {
      return (options || []).reduce((result, option, index) => {
        result.push({ optionGroup: option, group: true, index });
        const optionGroupChildren = this.getOptionGroupChildren(option);
        optionGroupChildren && optionGroupChildren.forEach((o) => result.push(o));
        return result;
      }, []);
    },
    overlayRef(el) {
      this.overlay = el;
    },
    listRef(el, contentRef) {
      this.list = el;
      contentRef && contentRef(el);
    },
    virtualScrollerRef(el) {
      this.virtualScroller = el;
    }
  },
  computed: {
    containerClass() {
      return [
        "p-autocomplete p-component p-inputwrapper",
        {
          "p-disabled": this.disabled,
          "p-focus": this.focused,
          "p-autocomplete-dd": this.dropdown,
          "p-autocomplete-multiple": this.multiple,
          "p-inputwrapper-filled": this.modelValue || ObjectUtils.isNotEmpty(this.inputValue),
          "p-inputwrapper-focus": this.focused,
          "p-overlay-open": this.overlayVisible
        }
      ];
    },
    inputStyleClass() {
      return [
        "p-autocomplete-input p-inputtext p-component",
        this.inputClass,
        {
          "p-autocomplete-dd-input": this.dropdown
        }
      ];
    },
    multiContainerClass() {
      return ["p-autocomplete-multiple-container p-component p-inputtext"];
    },
    panelStyleClass() {
      return [
        "p-autocomplete-panel p-component",
        this.panelClass,
        {
          "p-input-filled": this.$primevue.config.inputStyle === "filled",
          "p-ripple-disabled": this.$primevue.config.ripple === false
        }
      ];
    },
    loadingIconClass() {
      return ["p-autocomplete-loader pi-spin", this.loadingIcon];
    },
    visibleOptions() {
      return this.optionGroupLabel ? this.flatOptions(this.suggestions) : this.suggestions || [];
    },
    inputValue() {
      if (this.modelValue) {
        if (typeof this.modelValue === "object") {
          const label = this.getOptionLabel(this.modelValue);
          return label != null ? label : this.modelValue;
        } else {
          return this.modelValue;
        }
      } else {
        return "";
      }
    },
    hasSelectedOption() {
      return ObjectUtils.isNotEmpty(this.modelValue);
    },
    equalityKey() {
      return this.dataKey;
    },
    searchResultMessageText() {
      return ObjectUtils.isNotEmpty(this.visibleOptions) && this.overlayVisible ? this.searchMessageText.replaceAll("{0}", this.visibleOptions.length) : this.emptySearchMessageText;
    },
    searchMessageText() {
      return this.searchMessage || this.$primevue.config.locale.searchMessage || "";
    },
    emptySearchMessageText() {
      return this.emptySearchMessage || this.$primevue.config.locale.emptySearchMessage || "";
    },
    selectionMessageText() {
      return this.selectionMessage || this.$primevue.config.locale.selectionMessage || "";
    },
    emptySelectionMessageText() {
      return this.emptySelectionMessage || this.$primevue.config.locale.emptySelectionMessage || "";
    },
    selectedMessageText() {
      return this.hasSelectedOption ? this.selectionMessageText.replaceAll("{0}", this.multiple ? this.modelValue.length : "1") : this.emptySelectionMessageText;
    },
    focusedOptionId() {
      return this.focusedOptionIndex !== -1 ? `${this.id}_${this.focusedOptionIndex}` : null;
    },
    focusedMultipleOptionId() {
      return this.focusedMultipleOptionIndex !== -1 ? `${this.id}_multiple_option_${this.focusedMultipleOptionIndex}` : null;
    },
    ariaSetSize() {
      return this.visibleOptions.filter((option) => !this.isOptionGroup(option)).length;
    },
    virtualScrollerDisabled() {
      return !this.virtualScrollerOptions;
    }
  },
  components: {
    Button: script$i,
    VirtualScroller: script$g,
    Portal: script$h
  },
  directives: {
    ripple: Ripple
  }
};
const _hoisted_1$1 = ["id", "value", "placeholder", "tabindex", "disabled", "aria-label", "aria-labelledby", "aria-expanded", "aria-controls", "aria-activedescendant"];
const _hoisted_2$1 = ["aria-activedescendant"];
const _hoisted_3$1 = ["id", "aria-label", "aria-setsize", "aria-posinset"];
const _hoisted_4$1 = { class: "p-autocomplete-token-label" };
const _hoisted_5$1 = ["onClick"];
const _hoisted_6$1 = {
  class: "p-autocomplete-input-token",
  role: "option"
};
const _hoisted_7$1 = ["id", "placeholder", "tabindex", "disabled", "aria-label", "aria-labelledby", "aria-expanded", "aria-controls", "aria-activedescendant"];
const _hoisted_8$1 = {
  role: "status",
  "aria-live": "polite",
  class: "p-hidden-accessible"
};
const _hoisted_9$1 = ["id"];
const _hoisted_10$1 = ["id"];
const _hoisted_11$1 = ["id", "aria-label", "aria-selected", "aria-disabled", "aria-setsize", "aria-posinset", "onClick", "onMousemove"];
const _hoisted_12$1 = {
  key: 0,
  class: "p-autocomplete-empty-message",
  role: "option"
};
const _hoisted_13$1 = {
  role: "status",
  "aria-live": "polite",
  class: "p-hidden-accessible"
};
function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Button = resolveComponent("Button");
  const _component_VirtualScroller = resolveComponent("VirtualScroller");
  const _component_Portal = resolveComponent("Portal");
  const _directive_ripple = resolveDirective("ripple");
  return openBlock(), createElementBlock("div", {
    ref: "container",
    class: normalizeClass($options.containerClass),
    onClick: _cache[15] || (_cache[15] = (...args) => $options.onContainerClick && $options.onContainerClick(...args))
  }, [
    !$props.multiple ? (openBlock(), createElementBlock("input", mergeProps({
      key: 0,
      ref: "focusInput",
      id: $props.inputId,
      type: "text",
      style: $props.inputStyle,
      class: $options.inputStyleClass,
      value: $options.inputValue,
      placeholder: $props.placeholder,
      tabindex: !$props.disabled ? $props.tabindex : -1,
      disabled: $props.disabled,
      autocomplete: "off",
      role: "combobox",
      "aria-label": _ctx.ariaLabel,
      "aria-labelledby": _ctx.ariaLabelledby,
      "aria-haspopup": "listbox",
      "aria-autocomplete": "list",
      "aria-expanded": $data.overlayVisible,
      "aria-controls": $data.id + "_list",
      "aria-activedescendant": $data.focused ? $options.focusedOptionId : void 0,
      onFocus: _cache[0] || (_cache[0] = (...args) => $options.onFocus && $options.onFocus(...args)),
      onBlur: _cache[1] || (_cache[1] = (...args) => $options.onBlur && $options.onBlur(...args)),
      onKeydown: _cache[2] || (_cache[2] = (...args) => $options.onKeyDown && $options.onKeyDown(...args)),
      onInput: _cache[3] || (_cache[3] = (...args) => $options.onInput && $options.onInput(...args)),
      onChange: _cache[4] || (_cache[4] = (...args) => $options.onChange && $options.onChange(...args))
    }, $props.inputProps), null, 16, _hoisted_1$1)) : createCommentVNode("", true),
    $props.multiple ? (openBlock(), createElementBlock("ul", {
      key: 1,
      ref: "multiContainer",
      class: normalizeClass($options.multiContainerClass),
      tabindex: "-1",
      role: "listbox",
      "aria-orientation": "horizontal",
      "aria-activedescendant": $data.focused ? $options.focusedMultipleOptionId : void 0,
      onFocus: _cache[10] || (_cache[10] = (...args) => $options.onMultipleContainerFocus && $options.onMultipleContainerFocus(...args)),
      onBlur: _cache[11] || (_cache[11] = (...args) => $options.onMultipleContainerBlur && $options.onMultipleContainerBlur(...args)),
      onKeydown: _cache[12] || (_cache[12] = (...args) => $options.onMultipleContainerKeyDown && $options.onMultipleContainerKeyDown(...args))
    }, [
      (openBlock(true), createElementBlock(Fragment$1, null, renderList($props.modelValue, (option, i) => {
        return openBlock(), createElementBlock("li", {
          key: i,
          id: $data.id + "_multiple_option_" + i,
          class: normalizeClass(["p-autocomplete-token", { "p-focus": $data.focusedMultipleOptionIndex === i }]),
          role: "option",
          "aria-label": $options.getOptionLabel(option),
          "aria-selected": true,
          "aria-setsize": $props.modelValue.length,
          "aria-posinset": i + 1
        }, [
          renderSlot(_ctx.$slots, "chip", { value: option }, () => [
            createElementVNode("span", _hoisted_4$1, toDisplayString($options.getOptionLabel(option)), 1)
          ]),
          createElementVNode("span", {
            class: normalizeClass(["p-autocomplete-token-icon", $props.removeTokenIcon]),
            onClick: ($event) => $options.removeOption($event, i),
            "aria-hidden": "true"
          }, null, 10, _hoisted_5$1)
        ], 10, _hoisted_3$1);
      }), 128)),
      createElementVNode("li", _hoisted_6$1, [
        createElementVNode("input", mergeProps({
          ref: "focusInput",
          id: $props.inputId,
          type: "text",
          style: $props.inputStyle,
          class: $props.inputClass,
          placeholder: $props.placeholder,
          tabindex: !$props.disabled ? $props.tabindex : -1,
          disabled: $props.disabled,
          autocomplete: "off",
          role: "combobox",
          "aria-label": _ctx.ariaLabel,
          "aria-labelledby": _ctx.ariaLabelledby,
          "aria-haspopup": "listbox",
          "aria-autocomplete": "list",
          "aria-expanded": $data.overlayVisible,
          "aria-controls": $data.id + "_list",
          "aria-activedescendant": $data.focused ? $options.focusedOptionId : void 0,
          onFocus: _cache[5] || (_cache[5] = (...args) => $options.onFocus && $options.onFocus(...args)),
          onBlur: _cache[6] || (_cache[6] = (...args) => $options.onBlur && $options.onBlur(...args)),
          onKeydown: _cache[7] || (_cache[7] = (...args) => $options.onKeyDown && $options.onKeyDown(...args)),
          onInput: _cache[8] || (_cache[8] = (...args) => $options.onInput && $options.onInput(...args)),
          onChange: _cache[9] || (_cache[9] = (...args) => $options.onChange && $options.onChange(...args))
        }, $props.inputProps), null, 16, _hoisted_7$1)
      ])
    ], 42, _hoisted_2$1)) : createCommentVNode("", true),
    $data.searching ? (openBlock(), createElementBlock("i", {
      key: 2,
      class: normalizeClass($options.loadingIconClass),
      "aria-hidden": "true"
    }, null, 2)) : createCommentVNode("", true),
    $props.dropdown ? (openBlock(), createBlock(_component_Button, {
      key: 3,
      ref: "dropdownButton",
      type: "button",
      icon: $props.dropdownIcon,
      class: normalizeClass(["p-autocomplete-dropdown", $props.dropdownClass]),
      tabindex: "-1",
      disabled: $props.disabled,
      "aria-hidden": "true",
      onClick: $options.onDropdownClick
    }, null, 8, ["icon", "class", "disabled", "onClick"])) : createCommentVNode("", true),
    createElementVNode("span", _hoisted_8$1, toDisplayString($options.searchResultMessageText), 1),
    createVNode(_component_Portal, { appendTo: $props.appendTo }, {
      default: withCtx(() => [
        createVNode(Transition, {
          name: "p-connected-overlay",
          onEnter: $options.onOverlayEnter,
          onAfterEnter: $options.onOverlayAfterEnter,
          onLeave: $options.onOverlayLeave,
          onAfterLeave: $options.onOverlayAfterLeave
        }, {
          default: withCtx(() => [
            $data.overlayVisible ? (openBlock(), createElementBlock("div", mergeProps({
              key: 0,
              ref: $options.overlayRef,
              class: $options.panelStyleClass,
              style: { ...$props.panelStyle, "max-height": $options.virtualScrollerDisabled ? $props.scrollHeight : "" },
              onClick: _cache[13] || (_cache[13] = (...args) => $options.onOverlayClick && $options.onOverlayClick(...args)),
              onKeydown: _cache[14] || (_cache[14] = (...args) => $options.onOverlayKeyDown && $options.onOverlayKeyDown(...args))
            }, $props.panelProps), [
              renderSlot(_ctx.$slots, "header", {
                value: $props.modelValue,
                suggestions: $options.visibleOptions
              }),
              createVNode(_component_VirtualScroller, mergeProps({ ref: $options.virtualScrollerRef }, $props.virtualScrollerOptions, {
                style: { height: $props.scrollHeight },
                items: $options.visibleOptions,
                tabindex: -1,
                disabled: $options.virtualScrollerDisabled
              }), createSlots({
                content: withCtx(({ styleClass, contentRef, items, getItemOptions, contentStyle, itemSize }) => [
                  createElementVNode("ul", {
                    ref: (el) => $options.listRef(el, contentRef),
                    id: $data.id + "_list",
                    class: normalizeClass(["p-autocomplete-items", styleClass]),
                    style: normalizeStyle(contentStyle),
                    role: "listbox"
                  }, [
                    (openBlock(true), createElementBlock(Fragment$1, null, renderList(items, (option, i) => {
                      return openBlock(), createElementBlock(Fragment$1, {
                        key: $options.getOptionRenderKey(option, $options.getOptionIndex(i, getItemOptions))
                      }, [
                        $options.isOptionGroup(option) ? (openBlock(), createElementBlock("li", {
                          key: 0,
                          id: $data.id + "_" + $options.getOptionIndex(i, getItemOptions),
                          style: normalizeStyle({ height: itemSize ? itemSize + "px" : void 0 }),
                          class: "p-autocomplete-item-group",
                          role: "option"
                        }, [
                          renderSlot(_ctx.$slots, "optiongroup", {
                            option: option.optionGroup,
                            item: option.optionGroup,
                            index: $options.getOptionIndex(i, getItemOptions)
                          }, () => [
                            createTextVNode(toDisplayString($options.getOptionGroupLabel(option.optionGroup)), 1)
                          ])
                        ], 12, _hoisted_10$1)) : withDirectives((openBlock(), createElementBlock("li", {
                          key: 1,
                          id: $data.id + "_" + $options.getOptionIndex(i, getItemOptions),
                          style: normalizeStyle({ height: itemSize ? itemSize + "px" : void 0 }),
                          class: normalizeClass(["p-autocomplete-item", { "p-highlight": $options.isSelected(option), "p-focus": $data.focusedOptionIndex === $options.getOptionIndex(i, getItemOptions), "p-disabled": $options.isOptionDisabled(option) }]),
                          role: "option",
                          "aria-label": $options.getOptionLabel(option),
                          "aria-selected": $options.isSelected(option),
                          "aria-disabled": $options.isOptionDisabled(option),
                          "aria-setsize": $options.ariaSetSize,
                          "aria-posinset": $options.getAriaPosInset($options.getOptionIndex(i, getItemOptions)),
                          onClick: ($event) => $options.onOptionSelect($event, option),
                          onMousemove: ($event) => $options.onOptionMouseMove($event, $options.getOptionIndex(i, getItemOptions))
                        }, [
                          _ctx.$slots.option ? renderSlot(_ctx.$slots, "option", {
                            key: 0,
                            option,
                            index: $options.getOptionIndex(i, getItemOptions)
                          }, () => [
                            createTextVNode(toDisplayString($options.getOptionLabel(option)), 1)
                          ]) : renderSlot(_ctx.$slots, "item", {
                            key: 1,
                            item: option,
                            index: $options.getOptionIndex(i, getItemOptions)
                          }, () => [
                            createTextVNode(toDisplayString($options.getOptionLabel(option)), 1)
                          ])
                        ], 46, _hoisted_11$1)), [
                          [_directive_ripple]
                        ])
                      ], 64);
                    }), 128)),
                    !items || items && items.length === 0 ? (openBlock(), createElementBlock("li", _hoisted_12$1, [
                      renderSlot(_ctx.$slots, "empty", {}, () => [
                        createTextVNode(toDisplayString($options.searchResultMessageText), 1)
                      ])
                    ])) : createCommentVNode("", true)
                  ], 14, _hoisted_9$1)
                ]),
                _: 2
              }, [
                _ctx.$slots.loader ? {
                  name: "loader",
                  fn: withCtx(({ options }) => [
                    renderSlot(_ctx.$slots, "loader", { options })
                  ]),
                  key: "0"
                } : void 0
              ]), 1040, ["style", "items", "disabled"]),
              renderSlot(_ctx.$slots, "footer", {
                value: $props.modelValue,
                suggestions: $options.visibleOptions
              }),
              createElementVNode("span", _hoisted_13$1, toDisplayString($options.selectedMessageText), 1)
            ], 16)) : createCommentVNode("", true)
          ]),
          _: 3
        }, 8, ["onEnter", "onAfterEnter", "onLeave", "onAfterLeave"])
      ]),
      _: 3
    }, 8, ["appendTo"])
  ], 2);
}
function styleInject$1(css, ref2) {
  if (ref2 === void 0)
    ref2 = {};
  var insertAt = ref2.insertAt;
  if (!css || true) {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
var css_248z$1 = "\n.p-autocomplete {\n    display: inline-flex;\n    position: relative;\n}\n.p-autocomplete-loader {\n    position: absolute;\n    top: 50%;\n    margin-top: -0.5rem;\n}\n.p-autocomplete-dd .p-autocomplete-input {\n    flex: 1 1 auto;\n    width: 1%;\n}\n.p-autocomplete-dd .p-autocomplete-input,\n.p-autocomplete-dd .p-autocomplete-multiple-container {\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n}\n.p-autocomplete-dd .p-autocomplete-dropdown {\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0px;\n}\n.p-autocomplete .p-autocomplete-panel {\n    min-width: 100%;\n}\n.p-autocomplete-panel {\n    position: absolute;\n    overflow: auto;\n    top: 0;\n    left: 0;\n}\n.p-autocomplete-items {\n    margin: 0;\n    padding: 0;\n    list-style-type: none;\n}\n.p-autocomplete-item {\n    cursor: pointer;\n    white-space: nowrap;\n    position: relative;\n    overflow: hidden;\n}\n.p-autocomplete-multiple-container {\n    margin: 0;\n    padding: 0;\n    list-style-type: none;\n    cursor: text;\n    overflow: hidden;\n    display: flex;\n    align-items: center;\n    flex-wrap: wrap;\n}\n.p-autocomplete-token {\n    cursor: default;\n    display: inline-flex;\n    align-items: center;\n    flex: 0 0 auto;\n}\n.p-autocomplete-token-icon {\n    cursor: pointer;\n}\n.p-autocomplete-input-token {\n    flex: 1 1 auto;\n    display: inline-flex;\n}\n.p-autocomplete-input-token input {\n    border: 0 none;\n    outline: 0 none;\n    background-color: transparent;\n    margin: 0;\n    padding: 0;\n    box-shadow: none;\n    border-radius: 0;\n    width: 100%;\n}\n.p-fluid .p-autocomplete {\n    display: flex;\n}\n.p-fluid .p-autocomplete-dd .p-autocomplete-input {\n    width: 1%;\n}\n";
styleInject$1(css_248z$1);
script$1.render = render$1;
var script = {
  name: "Calendar",
  emits: ["show", "hide", "input", "month-change", "year-change", "date-select", "update:modelValue", "today-click", "clear-click", "focus", "blur", "keydown"],
  props: {
    modelValue: null,
    selectionMode: {
      type: String,
      default: "single"
    },
    dateFormat: {
      type: String,
      default: null
    },
    inline: {
      type: Boolean,
      default: false
    },
    showOtherMonths: {
      type: Boolean,
      default: true
    },
    selectOtherMonths: {
      type: Boolean,
      default: false
    },
    showIcon: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: "pi pi-calendar"
    },
    previousIcon: {
      type: String,
      default: "pi pi-chevron-left"
    },
    nextIcon: {
      type: String,
      default: "pi pi-chevron-right"
    },
    incrementIcon: {
      type: String,
      default: "pi pi-chevron-up"
    },
    decrementIcon: {
      type: String,
      default: "pi pi-chevron-down"
    },
    numberOfMonths: {
      type: Number,
      default: 1
    },
    responsiveOptions: Array,
    view: {
      type: String,
      default: "date"
    },
    touchUI: {
      type: Boolean,
      default: false
    },
    monthNavigator: {
      type: Boolean,
      default: false
    },
    yearNavigator: {
      type: Boolean,
      default: false
    },
    yearRange: {
      type: String,
      default: null
    },
    minDate: {
      type: Date,
      value: null
    },
    maxDate: {
      type: Date,
      value: null
    },
    disabledDates: {
      type: Array,
      value: null
    },
    disabledDays: {
      type: Array,
      value: null
    },
    maxDateCount: {
      type: Number,
      value: null
    },
    showOnFocus: {
      type: Boolean,
      default: true
    },
    autoZIndex: {
      type: Boolean,
      default: true
    },
    baseZIndex: {
      type: Number,
      default: 0
    },
    showButtonBar: {
      type: Boolean,
      default: false
    },
    shortYearCutoff: {
      type: String,
      default: "+10"
    },
    showTime: {
      type: Boolean,
      default: false
    },
    timeOnly: {
      type: Boolean,
      default: false
    },
    hourFormat: {
      type: String,
      default: "24"
    },
    stepHour: {
      type: Number,
      default: 1
    },
    stepMinute: {
      type: Number,
      default: 1
    },
    stepSecond: {
      type: Number,
      default: 1
    },
    showSeconds: {
      type: Boolean,
      default: false
    },
    hideOnDateTimeSelect: {
      type: Boolean,
      default: false
    },
    hideOnRangeSelection: {
      type: Boolean,
      default: false
    },
    timeSeparator: {
      type: String,
      default: ":"
    },
    showWeek: {
      type: Boolean,
      default: false
    },
    manualInput: {
      type: Boolean,
      default: true
    },
    appendTo: {
      type: String,
      default: "body"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: null
    },
    id: {
      type: String,
      default: null
    },
    inputId: {
      type: String,
      default: null
    },
    inputClass: {
      type: [String, Object],
      default: null
    },
    inputStyle: {
      type: Object,
      default: null
    },
    inputProps: {
      type: null,
      default: null
    },
    panelClass: {
      type: [String, Object],
      default: null
    },
    panelStyle: {
      type: Object,
      default: null
    },
    panelProps: {
      type: null,
      default: null
    },
    "aria-labelledby": {
      type: String,
      default: null
    },
    "aria-label": {
      type: String,
      default: null
    }
  },
  navigationState: null,
  timePickerChange: false,
  scrollHandler: null,
  outsideClickListener: null,
  maskClickListener: null,
  resizeListener: null,
  overlay: null,
  input: null,
  mask: null,
  timePickerTimer: null,
  preventFocus: false,
  typeUpdate: false,
  data() {
    return {
      currentMonth: null,
      currentYear: null,
      currentHour: null,
      currentMinute: null,
      currentSecond: null,
      pm: null,
      focused: false,
      overlayVisible: false,
      currentView: this.view
    };
  },
  watch: {
    modelValue(newValue) {
      this.updateCurrentMetaData();
      if (!this.typeUpdate && !this.inline && this.input) {
        this.input.value = this.formatValue(newValue);
      }
      this.typeUpdate = false;
    },
    showTime() {
      this.updateCurrentMetaData();
    },
    months() {
      if (this.overlay) {
        if (!this.focused) {
          if (this.inline) {
            this.preventFocus = true;
          }
          setTimeout(this.updateFocus, 0);
        }
      }
    },
    numberOfMonths() {
      this.destroyResponsiveStyleElement();
      this.createResponsiveStyle();
    },
    responsiveOptions() {
      this.destroyResponsiveStyleElement();
      this.createResponsiveStyle();
    },
    currentView() {
      Promise.resolve(null).then(() => this.alignOverlay());
    }
  },
  created() {
    this.updateCurrentMetaData();
  },
  mounted() {
    this.createResponsiveStyle();
    if (this.inline) {
      this.overlay && this.overlay.setAttribute(this.attributeSelector, "");
      if (!this.disabled) {
        this.preventFocus = true;
        this.initFocusableCell();
        if (this.numberOfMonths === 1) {
          this.overlay.style.width = DomHandler.getOuterWidth(this.$el) + "px";
        }
      }
    } else {
      this.input.value = this.formatValue(this.modelValue);
    }
  },
  updated() {
    if (this.overlay) {
      this.preventFocus = true;
      setTimeout(this.updateFocus, 0);
    }
    if (this.input && this.selectionStart != null && this.selectionEnd != null) {
      this.input.selectionStart = this.selectionStart;
      this.input.selectionEnd = this.selectionEnd;
      this.selectionStart = null;
      this.selectionEnd = null;
    }
  },
  beforeUnmount() {
    if (this.timePickerTimer) {
      clearTimeout(this.timePickerTimer);
    }
    if (this.mask) {
      this.destroyMask();
    }
    this.destroyResponsiveStyleElement();
    this.unbindOutsideClickListener();
    this.unbindResizeListener();
    if (this.scrollHandler) {
      this.scrollHandler.destroy();
      this.scrollHandler = null;
    }
    if (this.overlay && this.autoZIndex) {
      ZIndexUtils.clear(this.overlay);
    }
    this.overlay = null;
  },
  methods: {
    isComparable() {
      return this.modelValue != null && typeof this.modelValue !== "string";
    },
    isSelected(dateMeta) {
      if (!this.isComparable()) {
        return false;
      }
      if (this.modelValue) {
        if (this.isSingleSelection()) {
          return this.isDateEquals(this.modelValue, dateMeta);
        } else if (this.isMultipleSelection()) {
          let selected = false;
          for (let date of this.modelValue) {
            selected = this.isDateEquals(date, dateMeta);
            if (selected) {
              break;
            }
          }
          return selected;
        } else if (this.isRangeSelection()) {
          if (this.modelValue[1])
            return this.isDateEquals(this.modelValue[0], dateMeta) || this.isDateEquals(this.modelValue[1], dateMeta) || this.isDateBetween(this.modelValue[0], this.modelValue[1], dateMeta);
          else {
            return this.isDateEquals(this.modelValue[0], dateMeta);
          }
        }
      }
      return false;
    },
    isMonthSelected(month) {
      if (this.isComparable()) {
        let value = this.isRangeSelection() ? this.modelValue[0] : this.modelValue;
        return !this.isMultipleSelection() ? value.getMonth() === month && value.getFullYear() === this.currentYear : false;
      }
      return false;
    },
    isYearSelected(year) {
      if (this.isComparable()) {
        let value = this.isRangeSelection() ? this.modelValue[0] : this.modelValue;
        return !this.isMultipleSelection() && this.isComparable() ? value.getFullYear() === year : false;
      }
      return false;
    },
    isDateEquals(value, dateMeta) {
      if (value)
        return value.getDate() === dateMeta.day && value.getMonth() === dateMeta.month && value.getFullYear() === dateMeta.year;
      else
        return false;
    },
    isDateBetween(start, end, dateMeta) {
      let between = false;
      if (start && end) {
        let date = new Date(dateMeta.year, dateMeta.month, dateMeta.day);
        return start.getTime() <= date.getTime() && end.getTime() >= date.getTime();
      }
      return between;
    },
    getFirstDayOfMonthIndex(month, year) {
      let day = /* @__PURE__ */ new Date();
      day.setDate(1);
      day.setMonth(month);
      day.setFullYear(year);
      let dayIndex = day.getDay() + this.sundayIndex;
      return dayIndex >= 7 ? dayIndex - 7 : dayIndex;
    },
    getDaysCountInMonth(month, year) {
      return 32 - this.daylightSavingAdjust(new Date(year, month, 32)).getDate();
    },
    getDaysCountInPrevMonth(month, year) {
      let prev = this.getPreviousMonthAndYear(month, year);
      return this.getDaysCountInMonth(prev.month, prev.year);
    },
    getPreviousMonthAndYear(month, year) {
      let m, y;
      if (month === 0) {
        m = 11;
        y = year - 1;
      } else {
        m = month - 1;
        y = year;
      }
      return { month: m, year: y };
    },
    getNextMonthAndYear(month, year) {
      let m, y;
      if (month === 11) {
        m = 0;
        y = year + 1;
      } else {
        m = month + 1;
        y = year;
      }
      return { month: m, year: y };
    },
    daylightSavingAdjust(date) {
      if (!date) {
        return null;
      }
      date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
      return date;
    },
    isToday(today, day, month, year) {
      return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
    },
    isSelectable(day, month, year, otherMonth) {
      let validMin = true;
      let validMax = true;
      let validDate = true;
      let validDay = true;
      if (otherMonth && !this.selectOtherMonths) {
        return false;
      }
      if (this.minDate) {
        if (this.minDate.getFullYear() > year) {
          validMin = false;
        } else if (this.minDate.getFullYear() === year) {
          if (this.minDate.getMonth() > month) {
            validMin = false;
          } else if (this.minDate.getMonth() === month) {
            if (this.minDate.getDate() > day) {
              validMin = false;
            }
          }
        }
      }
      if (this.maxDate) {
        if (this.maxDate.getFullYear() < year) {
          validMax = false;
        } else if (this.maxDate.getFullYear() === year) {
          if (this.maxDate.getMonth() < month) {
            validMax = false;
          } else if (this.maxDate.getMonth() === month) {
            if (this.maxDate.getDate() < day) {
              validMax = false;
            }
          }
        }
      }
      if (this.disabledDates) {
        validDate = !this.isDateDisabled(day, month, year);
      }
      if (this.disabledDays) {
        validDay = !this.isDayDisabled(day, month, year);
      }
      return validMin && validMax && validDate && validDay;
    },
    onOverlayEnter(el) {
      el.setAttribute(this.attributeSelector, "");
      if (this.autoZIndex) {
        if (this.touchUI)
          ZIndexUtils.set("modal", el, this.baseZIndex || this.$primevue.config.zIndex.modal);
        else
          ZIndexUtils.set("overlay", el, this.baseZIndex || this.$primevue.config.zIndex.overlay);
      }
      this.alignOverlay();
      this.$emit("show");
    },
    onOverlayEnterComplete() {
      this.bindOutsideClickListener();
      this.bindScrollListener();
      this.bindResizeListener();
    },
    onOverlayAfterLeave(el) {
      if (this.autoZIndex) {
        ZIndexUtils.clear(el);
      }
    },
    onOverlayLeave() {
      this.currentView = this.view;
      this.unbindOutsideClickListener();
      this.unbindScrollListener();
      this.unbindResizeListener();
      this.$emit("hide");
      if (this.mask) {
        this.disableModality();
      }
      this.overlay = null;
    },
    onPrevButtonClick(event2) {
      if (this.showOtherMonths) {
        this.navigationState = { backward: true, button: true };
        this.navBackward(event2);
      }
    },
    onNextButtonClick(event2) {
      if (this.showOtherMonths) {
        this.navigationState = { backward: false, button: true };
        this.navForward(event2);
      }
    },
    navBackward(event2) {
      event2.preventDefault();
      if (!this.isEnabled()) {
        return;
      }
      if (this.currentView === "month") {
        this.decrementYear();
      } else if (this.currentView === "year") {
        this.decrementDecade();
      } else {
        if (event2.shiftKey) {
          this.decrementYear();
        } else {
          if (this.currentMonth === 0) {
            this.currentMonth = 11;
            this.decrementYear();
          } else {
            this.currentMonth--;
          }
          this.$emit("month-change", { month: this.currentMonth + 1, year: this.currentYear });
        }
      }
    },
    navForward(event2) {
      event2.preventDefault();
      if (!this.isEnabled()) {
        return;
      }
      if (this.currentView === "month") {
        this.incrementYear();
      } else if (this.currentView === "year") {
        this.incrementDecade();
      } else {
        if (event2.shiftKey) {
          this.incrementYear();
        } else {
          if (this.currentMonth === 11) {
            this.currentMonth = 0;
            this.incrementYear();
          } else {
            this.currentMonth++;
          }
          this.$emit("month-change", { month: this.currentMonth + 1, year: this.currentYear });
        }
      }
    },
    decrementYear() {
      this.currentYear--;
    },
    decrementDecade() {
      this.currentYear = this.currentYear - 10;
    },
    incrementYear() {
      this.currentYear++;
    },
    incrementDecade() {
      this.currentYear = this.currentYear + 10;
    },
    switchToMonthView(event2) {
      this.currentView = "month";
      setTimeout(this.updateFocus, 0);
      event2.preventDefault();
    },
    switchToYearView(event2) {
      this.currentView = "year";
      setTimeout(this.updateFocus, 0);
      event2.preventDefault();
    },
    isEnabled() {
      return !this.disabled && !this.readonly;
    },
    updateCurrentTimeMeta(date) {
      let currentHour = date.getHours();
      if (this.hourFormat === "12") {
        this.pm = currentHour > 11;
        if (currentHour >= 12)
          currentHour = currentHour == 12 ? 12 : currentHour - 12;
        else
          currentHour = currentHour == 0 ? 12 : currentHour;
      }
      this.currentHour = Math.floor(currentHour / this.stepHour) * this.stepHour;
      this.currentMinute = Math.floor(date.getMinutes() / this.stepMinute) * this.stepMinute;
      this.currentSecond = Math.floor(date.getSeconds() / this.stepSecond) * this.stepSecond;
    },
    bindOutsideClickListener() {
      if (!this.outsideClickListener) {
        this.outsideClickListener = (event2) => {
          if (this.overlayVisible && this.isOutsideClicked(event2)) {
            this.overlayVisible = false;
          }
        };
        document.addEventListener("mousedown", this.outsideClickListener);
      }
    },
    unbindOutsideClickListener() {
      if (this.outsideClickListener) {
        document.removeEventListener("mousedown", this.outsideClickListener);
        this.outsideClickListener = null;
      }
    },
    bindScrollListener() {
      if (!this.scrollHandler) {
        this.scrollHandler = new ConnectedOverlayScrollHandler(this.$refs.container, () => {
          if (this.overlayVisible) {
            this.overlayVisible = false;
          }
        });
      }
      this.scrollHandler.bindScrollListener();
    },
    unbindScrollListener() {
      if (this.scrollHandler) {
        this.scrollHandler.unbindScrollListener();
      }
    },
    bindResizeListener() {
      if (!this.resizeListener) {
        this.resizeListener = () => {
          if (this.overlayVisible && !DomHandler.isTouchDevice()) {
            this.overlayVisible = false;
          }
        };
        window.addEventListener("resize", this.resizeListener);
      }
    },
    unbindResizeListener() {
      if (this.resizeListener) {
        window.removeEventListener("resize", this.resizeListener);
        this.resizeListener = null;
      }
    },
    isOutsideClicked(event2) {
      return !(this.$el.isSameNode(event2.target) || this.isNavIconClicked(event2) || this.$el.contains(event2.target) || this.overlay && this.overlay.contains(event2.target));
    },
    isNavIconClicked(event2) {
      return DomHandler.hasClass(event2.target, "p-datepicker-prev") || DomHandler.hasClass(event2.target, "p-datepicker-prev-icon") || DomHandler.hasClass(event2.target, "p-datepicker-next") || DomHandler.hasClass(event2.target, "p-datepicker-next-icon");
    },
    alignOverlay() {
      if (this.touchUI) {
        this.enableModality();
      } else if (this.overlay) {
        if (this.appendTo === "self" || this.inline) {
          DomHandler.relativePosition(this.overlay, this.$el);
        } else {
          if (this.view === "date") {
            this.overlay.style.width = DomHandler.getOuterWidth(this.overlay) + "px";
            this.overlay.style.minWidth = DomHandler.getOuterWidth(this.$el) + "px";
          } else {
            this.overlay.style.width = DomHandler.getOuterWidth(this.$el) + "px";
          }
          DomHandler.absolutePosition(this.overlay, this.$el);
        }
      }
    },
    onButtonClick() {
      if (this.isEnabled()) {
        if (!this.overlayVisible) {
          this.input.focus();
          this.overlayVisible = true;
        } else {
          this.overlayVisible = false;
        }
      }
    },
    isDateDisabled(day, month, year) {
      if (this.disabledDates) {
        for (let disabledDate of this.disabledDates) {
          if (disabledDate.getFullYear() === year && disabledDate.getMonth() === month && disabledDate.getDate() === day) {
            return true;
          }
        }
      }
      return false;
    },
    isDayDisabled(day, month, year) {
      if (this.disabledDays) {
        let weekday = new Date(year, month, day);
        let weekdayNumber = weekday.getDay();
        return this.disabledDays.indexOf(weekdayNumber) !== -1;
      }
      return false;
    },
    onMonthDropdownChange(value) {
      this.currentMonth = parseInt(value);
      this.$emit("month-change", { month: this.currentMonth + 1, year: this.currentYear });
    },
    onYearDropdownChange(value) {
      this.currentYear = parseInt(value);
      this.$emit("year-change", { month: this.currentMonth + 1, year: this.currentYear });
    },
    onDateSelect(event2, dateMeta) {
      if (this.disabled || !dateMeta.selectable) {
        return;
      }
      DomHandler.find(this.overlay, ".p-datepicker-calendar td span:not(.p-disabled)").forEach((cell) => cell.tabIndex = -1);
      if (event2) {
        event2.currentTarget.focus();
      }
      if (this.isMultipleSelection() && this.isSelected(dateMeta)) {
        let newValue = this.modelValue.filter((date) => !this.isDateEquals(date, dateMeta));
        this.updateModel(newValue);
      } else {
        if (this.shouldSelectDate(dateMeta)) {
          if (dateMeta.otherMonth) {
            this.currentMonth = dateMeta.month;
            this.currentYear = dateMeta.year;
            this.selectDate(dateMeta);
          } else {
            this.selectDate(dateMeta);
          }
        }
      }
      if (this.isSingleSelection() && (!this.showTime || this.hideOnDateTimeSelect)) {
        setTimeout(() => {
          if (this.input) {
            this.input.focus();
          }
          this.overlayVisible = false;
        }, 150);
      }
    },
    selectDate(dateMeta) {
      let date = new Date(dateMeta.year, dateMeta.month, dateMeta.day);
      if (this.showTime) {
        if (this.hourFormat === "12" && this.pm && this.currentHour != 12)
          date.setHours(this.currentHour + 12);
        else
          date.setHours(this.currentHour);
        date.setMinutes(this.currentMinute);
        date.setSeconds(this.currentSecond);
      }
      if (this.minDate && this.minDate > date) {
        date = this.minDate;
        this.currentHour = date.getHours();
        this.currentMinute = date.getMinutes();
        this.currentSecond = date.getSeconds();
      }
      if (this.maxDate && this.maxDate < date) {
        date = this.maxDate;
        this.currentHour = date.getHours();
        this.currentMinute = date.getMinutes();
        this.currentSecond = date.getSeconds();
      }
      let modelVal = null;
      if (this.isSingleSelection()) {
        modelVal = date;
      } else if (this.isMultipleSelection()) {
        modelVal = this.modelValue ? [...this.modelValue, date] : [date];
      } else if (this.isRangeSelection()) {
        if (this.modelValue && this.modelValue.length) {
          let startDate = this.modelValue[0];
          let endDate = this.modelValue[1];
          if (!endDate && date.getTime() >= startDate.getTime()) {
            endDate = date;
          } else {
            startDate = date;
            endDate = null;
          }
          modelVal = [startDate, endDate];
        } else {
          modelVal = [date, null];
        }
      }
      if (modelVal !== null) {
        this.updateModel(modelVal);
      }
      if (this.isRangeSelection() && this.hideOnRangeSelection && modelVal[1] !== null) {
        setTimeout(() => {
          this.overlayVisible = false;
        }, 150);
      }
      this.$emit("date-select", date);
    },
    updateModel(value) {
      this.$emit("update:modelValue", value);
    },
    shouldSelectDate() {
      if (this.isMultipleSelection())
        return this.maxDateCount != null ? this.maxDateCount > (this.modelValue ? this.modelValue.length : 0) : true;
      else
        return true;
    },
    isSingleSelection() {
      return this.selectionMode === "single";
    },
    isRangeSelection() {
      return this.selectionMode === "range";
    },
    isMultipleSelection() {
      return this.selectionMode === "multiple";
    },
    formatValue(value) {
      if (typeof value === "string") {
        return value;
      }
      let formattedValue = "";
      if (value) {
        try {
          if (this.isSingleSelection()) {
            formattedValue = this.formatDateTime(value);
          } else if (this.isMultipleSelection()) {
            for (let i = 0; i < value.length; i++) {
              let dateAsString = this.formatDateTime(value[i]);
              formattedValue += dateAsString;
              if (i !== value.length - 1) {
                formattedValue += ", ";
              }
            }
          } else if (this.isRangeSelection()) {
            if (value && value.length) {
              let startDate = value[0];
              let endDate = value[1];
              formattedValue = this.formatDateTime(startDate);
              if (endDate) {
                formattedValue += " - " + this.formatDateTime(endDate);
              }
            }
          }
        } catch (err) {
          formattedValue = value;
        }
      }
      return formattedValue;
    },
    formatDateTime(date) {
      let formattedValue = null;
      if (date) {
        if (this.timeOnly) {
          formattedValue = this.formatTime(date);
        } else {
          formattedValue = this.formatDate(date, this.datePattern);
          if (this.showTime) {
            formattedValue += " " + this.formatTime(date);
          }
        }
      }
      return formattedValue;
    },
    formatDate(date, format) {
      if (!date) {
        return "";
      }
      let iFormat;
      const lookAhead = (match) => {
        const matches = iFormat + 1 < format.length && format.charAt(iFormat + 1) === match;
        if (matches) {
          iFormat++;
        }
        return matches;
      }, formatNumber = (match, value, len) => {
        let num = "" + value;
        if (lookAhead(match)) {
          while (num.length < len) {
            num = "0" + num;
          }
        }
        return num;
      }, formatName = (match, value, shortNames, longNames) => {
        return lookAhead(match) ? longNames[value] : shortNames[value];
      };
      let output = "";
      let literal = false;
      if (date) {
        for (iFormat = 0; iFormat < format.length; iFormat++) {
          if (literal) {
            if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
              literal = false;
            } else {
              output += format.charAt(iFormat);
            }
          } else {
            switch (format.charAt(iFormat)) {
              case "d":
                output += formatNumber("d", date.getDate(), 2);
                break;
              case "D":
                output += formatName("D", date.getDay(), this.$primevue.config.locale.dayNamesShort, this.$primevue.config.locale.dayNames);
                break;
              case "o":
                output += formatNumber("o", Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 864e5), 3);
                break;
              case "m":
                output += formatNumber("m", date.getMonth() + 1, 2);
                break;
              case "M":
                output += formatName("M", date.getMonth(), this.$primevue.config.locale.monthNamesShort, this.$primevue.config.locale.monthNames);
                break;
              case "y":
                output += lookAhead("y") ? date.getFullYear() : (date.getFullYear() % 100 < 10 ? "0" : "") + date.getFullYear() % 100;
                break;
              case "@":
                output += date.getTime();
                break;
              case "!":
                output += date.getTime() * 1e4 + this.ticksTo1970;
                break;
              case "'":
                if (lookAhead("'")) {
                  output += "'";
                } else {
                  literal = true;
                }
                break;
              default:
                output += format.charAt(iFormat);
            }
          }
        }
      }
      return output;
    },
    formatTime(date) {
      if (!date) {
        return "";
      }
      let output = "";
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      if (this.hourFormat === "12" && hours > 11 && hours !== 12) {
        hours -= 12;
      }
      if (this.hourFormat === "12") {
        output += hours === 0 ? 12 : hours < 10 ? "0" + hours : hours;
      } else {
        output += hours < 10 ? "0" + hours : hours;
      }
      output += ":";
      output += minutes < 10 ? "0" + minutes : minutes;
      if (this.showSeconds) {
        output += ":";
        output += seconds < 10 ? "0" + seconds : seconds;
      }
      if (this.hourFormat === "12") {
        output += date.getHours() > 11 ? ` ${this.$primevue.config.locale.pm}` : ` ${this.$primevue.config.locale.am}`;
      }
      return output;
    },
    onTodayButtonClick(event2) {
      let date = /* @__PURE__ */ new Date();
      let dateMeta = {
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        otherMonth: date.getMonth() !== this.currentMonth || date.getFullYear() !== this.currentYear,
        today: true,
        selectable: true
      };
      this.onDateSelect(null, dateMeta);
      this.$emit("today-click", date);
      event2.preventDefault();
    },
    onClearButtonClick(event2) {
      this.updateModel(null);
      this.overlayVisible = false;
      this.$emit("clear-click", event2);
      event2.preventDefault();
    },
    onTimePickerElementMouseDown(event2, type, direction) {
      if (this.isEnabled()) {
        this.repeat(event2, null, type, direction);
        event2.preventDefault();
      }
    },
    onTimePickerElementMouseUp(event2) {
      if (this.isEnabled()) {
        this.clearTimePickerTimer();
        this.updateModelTime();
        event2.preventDefault();
      }
    },
    onTimePickerElementMouseLeave() {
      this.clearTimePickerTimer();
    },
    repeat(event2, interval, type, direction) {
      let i = interval || 500;
      this.clearTimePickerTimer();
      this.timePickerTimer = setTimeout(() => {
        this.repeat(event2, 100, type, direction);
      }, i);
      switch (type) {
        case 0:
          if (direction === 1)
            this.incrementHour(event2);
          else
            this.decrementHour(event2);
          break;
        case 1:
          if (direction === 1)
            this.incrementMinute(event2);
          else
            this.decrementMinute(event2);
          break;
        case 2:
          if (direction === 1)
            this.incrementSecond(event2);
          else
            this.decrementSecond(event2);
          break;
      }
    },
    convertTo24Hour(hours, pm) {
      if (this.hourFormat == "12") {
        if (hours === 12) {
          return pm ? 12 : 0;
        } else {
          return pm ? hours + 12 : hours;
        }
      }
      return hours;
    },
    validateTime(hour, minute, second, pm) {
      let value = this.isComparable() ? this.modelValue : this.viewDate;
      const convertedHour = this.convertTo24Hour(hour, pm);
      if (this.isRangeSelection()) {
        value = this.modelValue[1] || this.modelValue[0];
      }
      if (this.isMultipleSelection()) {
        value = this.modelValue[this.modelValue.length - 1];
      }
      const valueDateString = value ? value.toDateString() : null;
      if (this.minDate && valueDateString && this.minDate.toDateString() === valueDateString) {
        if (this.minDate.getHours() > convertedHour) {
          return false;
        }
        if (this.minDate.getHours() === convertedHour) {
          if (this.minDate.getMinutes() > minute) {
            return false;
          }
          if (this.minDate.getMinutes() === minute) {
            if (this.minDate.getSeconds() > second) {
              return false;
            }
          }
        }
      }
      if (this.maxDate && valueDateString && this.maxDate.toDateString() === valueDateString) {
        if (this.maxDate.getHours() < convertedHour) {
          return false;
        }
        if (this.maxDate.getHours() === convertedHour) {
          if (this.maxDate.getMinutes() < minute) {
            return false;
          }
          if (this.maxDate.getMinutes() === minute) {
            if (this.maxDate.getSeconds() < second) {
              return false;
            }
          }
        }
      }
      return true;
    },
    incrementHour(event2) {
      let prevHour = this.currentHour;
      let newHour = this.currentHour + this.stepHour;
      let newPM = this.pm;
      if (this.hourFormat == "24")
        newHour = newHour >= 24 ? newHour - 24 : newHour;
      else if (this.hourFormat == "12") {
        if (prevHour < 12 && newHour > 11) {
          newPM = !this.pm;
        }
        newHour = newHour >= 13 ? newHour - 12 : newHour;
      }
      if (this.validateTime(newHour, this.currentMinute, this.currentSecond, newPM)) {
        this.currentHour = newHour;
        this.pm = newPM;
      }
      event2.preventDefault();
    },
    decrementHour(event2) {
      let newHour = this.currentHour - this.stepHour;
      let newPM = this.pm;
      if (this.hourFormat == "24")
        newHour = newHour < 0 ? 24 + newHour : newHour;
      else if (this.hourFormat == "12") {
        if (this.currentHour === 12) {
          newPM = !this.pm;
        }
        newHour = newHour <= 0 ? 12 + newHour : newHour;
      }
      if (this.validateTime(newHour, this.currentMinute, this.currentSecond, newPM)) {
        this.currentHour = newHour;
        this.pm = newPM;
      }
      event2.preventDefault();
    },
    incrementMinute(event2) {
      let newMinute = this.currentMinute + this.stepMinute;
      if (this.validateTime(this.currentHour, newMinute, this.currentSecond, this.pm)) {
        this.currentMinute = newMinute > 59 ? newMinute - 60 : newMinute;
      }
      event2.preventDefault();
    },
    decrementMinute(event2) {
      let newMinute = this.currentMinute - this.stepMinute;
      newMinute = newMinute < 0 ? 60 + newMinute : newMinute;
      if (this.validateTime(this.currentHour, newMinute, this.currentSecond, this.pm)) {
        this.currentMinute = newMinute;
      }
      event2.preventDefault();
    },
    incrementSecond(event2) {
      let newSecond = this.currentSecond + this.stepSecond;
      if (this.validateTime(this.currentHour, this.currentMinute, newSecond, this.pm)) {
        this.currentSecond = newSecond > 59 ? newSecond - 60 : newSecond;
      }
      event2.preventDefault();
    },
    decrementSecond(event2) {
      let newSecond = this.currentSecond - this.stepSecond;
      newSecond = newSecond < 0 ? 60 + newSecond : newSecond;
      if (this.validateTime(this.currentHour, this.currentMinute, newSecond, this.pm)) {
        this.currentSecond = newSecond;
      }
      event2.preventDefault();
    },
    updateModelTime() {
      this.timePickerChange = true;
      let value = this.isComparable() ? this.modelValue : this.viewDate;
      if (this.isRangeSelection()) {
        value = this.modelValue[1] || this.modelValue[0];
      }
      if (this.isMultipleSelection()) {
        value = this.modelValue[this.modelValue.length - 1];
      }
      value = value ? new Date(value.getTime()) : /* @__PURE__ */ new Date();
      if (this.hourFormat == "12") {
        if (this.currentHour === 12)
          value.setHours(this.pm ? 12 : 0);
        else
          value.setHours(this.pm ? this.currentHour + 12 : this.currentHour);
      } else {
        value.setHours(this.currentHour);
      }
      value.setMinutes(this.currentMinute);
      value.setSeconds(this.currentSecond);
      if (this.isRangeSelection()) {
        if (this.modelValue[1])
          value = [this.modelValue[0], value];
        else
          value = [value, null];
      }
      if (this.isMultipleSelection()) {
        value = [...this.modelValue.slice(0, -1), value];
      }
      this.updateModel(value);
      this.$emit("date-select", value);
      setTimeout(() => this.timePickerChange = false, 0);
    },
    toggleAMPM(event2) {
      const validHour = this.validateTime(this.currentHour, this.currentMinute, this.currentSecond, !this.pm);
      if (!validHour && (this.maxDate || this.minDate))
        return;
      this.pm = !this.pm;
      this.updateModelTime();
      event2.preventDefault();
    },
    clearTimePickerTimer() {
      if (this.timePickerTimer) {
        clearInterval(this.timePickerTimer);
      }
    },
    onMonthSelect(event2, { month, index }) {
      if (this.view === "month") {
        this.onDateSelect(event2, { year: this.currentYear, month: index, day: 1, selectable: true });
      } else {
        this.currentMonth = index;
        this.currentView = "date";
        this.$emit("month-change", { month: this.currentMonth + 1, year: this.currentYear });
      }
      setTimeout(this.updateFocus, 0);
    },
    onYearSelect(event2, year) {
      if (this.view === "year") {
        this.onDateSelect(event2, { year: year.value, month: 0, day: 1, selectable: true });
      } else {
        this.currentYear = year.value;
        this.currentView = "month";
        this.$emit("year-change", { month: this.currentMonth + 1, year: this.currentYear });
      }
      setTimeout(this.updateFocus, 0);
    },
    enableModality() {
      if (!this.mask) {
        this.mask = document.createElement("div");
        this.mask.style.zIndex = String(parseInt(this.overlay.style.zIndex, 10) - 1);
        DomHandler.addMultipleClasses(this.mask, "p-datepicker-mask p-datepicker-mask-scrollblocker p-component-overlay p-component-overlay-enter");
        this.maskClickListener = () => {
          this.overlayVisible = false;
        };
        this.mask.addEventListener("click", this.maskClickListener);
        document.body.appendChild(this.mask);
        DomHandler.addClass(document.body, "p-overflow-hidden");
      }
    },
    disableModality() {
      if (this.mask) {
        DomHandler.addClass(this.mask, "p-component-overlay-leave");
        this.mask.addEventListener("animationend", () => {
          this.destroyMask();
        });
      }
    },
    destroyMask() {
      this.mask.removeEventListener("click", this.maskClickListener);
      this.maskClickListener = null;
      document.body.removeChild(this.mask);
      this.mask = null;
      let bodyChildren = document.body.children;
      let hasBlockerMasks;
      for (let i = 0; i < bodyChildren.length; i++) {
        let bodyChild = bodyChildren[i];
        if (DomHandler.hasClass(bodyChild, "p-datepicker-mask-scrollblocker")) {
          hasBlockerMasks = true;
          break;
        }
      }
      if (!hasBlockerMasks) {
        DomHandler.removeClass(document.body, "p-overflow-hidden");
      }
    },
    updateCurrentMetaData() {
      const viewDate = this.viewDate;
      this.currentMonth = viewDate.getMonth();
      this.currentYear = viewDate.getFullYear();
      if (this.showTime || this.timeOnly) {
        this.updateCurrentTimeMeta(viewDate);
      }
    },
    isValidSelection(value) {
      if (value == null) {
        return true;
      }
      let isValid = true;
      if (this.isSingleSelection()) {
        if (!this.isSelectable(value.getDate(), value.getMonth(), value.getFullYear(), false)) {
          isValid = false;
        }
      } else if (value.every((v) => this.isSelectable(v.getDate(), v.getMonth(), v.getFullYear(), false))) {
        if (this.isRangeSelection()) {
          isValid = value.length > 1 && value[1] > value[0] ? true : false;
        }
      }
      return isValid;
    },
    parseValue(text) {
      if (!text || text.trim().length === 0) {
        return null;
      }
      let value;
      if (this.isSingleSelection()) {
        value = this.parseDateTime(text);
      } else if (this.isMultipleSelection()) {
        let tokens = text.split(",");
        value = [];
        for (let token of tokens) {
          value.push(this.parseDateTime(token.trim()));
        }
      } else if (this.isRangeSelection()) {
        let tokens = text.split(" - ");
        value = [];
        for (let i = 0; i < tokens.length; i++) {
          value[i] = this.parseDateTime(tokens[i].trim());
        }
      }
      return value;
    },
    parseDateTime(text) {
      let date;
      let parts = text.split(" ");
      if (this.timeOnly) {
        date = /* @__PURE__ */ new Date();
        this.populateTime(date, parts[0], parts[1]);
      } else {
        const dateFormat = this.datePattern;
        if (this.showTime) {
          date = this.parseDate(parts[0], dateFormat);
          this.populateTime(date, parts[1], parts[2]);
        } else {
          date = this.parseDate(text, dateFormat);
        }
      }
      return date;
    },
    populateTime(value, timeString, ampm) {
      if (this.hourFormat == "12" && !ampm) {
        throw "Invalid Time";
      }
      this.pm = ampm === this.$primevue.config.locale.pm || ampm === this.$primevue.config.locale.pm.toLowerCase();
      let time = this.parseTime(timeString);
      value.setHours(time.hour);
      value.setMinutes(time.minute);
      value.setSeconds(time.second);
    },
    parseTime(value) {
      let tokens = value.split(":");
      let validTokenLength = this.showSeconds ? 3 : 2;
      let regex = /^[0-9][0-9]$/;
      if (tokens.length !== validTokenLength || !tokens[0].match(regex) || !tokens[1].match(regex) || this.showSeconds && !tokens[2].match(regex)) {
        throw "Invalid time";
      }
      let h2 = parseInt(tokens[0]);
      let m = parseInt(tokens[1]);
      let s = this.showSeconds ? parseInt(tokens[2]) : null;
      if (isNaN(h2) || isNaN(m) || h2 > 23 || m > 59 || this.hourFormat == "12" && h2 > 12 || this.showSeconds && (isNaN(s) || s > 59)) {
        throw "Invalid time";
      } else {
        if (this.hourFormat == "12" && h2 !== 12 && this.pm) {
          h2 += 12;
        }
        return { hour: h2, minute: m, second: s };
      }
    },
    parseDate(value, format) {
      if (format == null || value == null) {
        throw "Invalid arguments";
      }
      value = typeof value === "object" ? value.toString() : value + "";
      if (value === "") {
        return null;
      }
      let iFormat, dim, extra, iValue = 0, shortYearCutoff = typeof this.shortYearCutoff !== "string" ? this.shortYearCutoff : (/* @__PURE__ */ new Date()).getFullYear() % 100 + parseInt(this.shortYearCutoff, 10), year = -1, month = -1, day = -1, doy = -1, literal = false, date, lookAhead = (match) => {
        let matches = iFormat + 1 < format.length && format.charAt(iFormat + 1) === match;
        if (matches) {
          iFormat++;
        }
        return matches;
      }, getNumber = (match) => {
        let isDoubled = lookAhead(match), size = match === "@" ? 14 : match === "!" ? 20 : match === "y" && isDoubled ? 4 : match === "o" ? 3 : 2, minSize = match === "y" ? size : 1, digits = new RegExp("^\\d{" + minSize + "," + size + "}"), num = value.substring(iValue).match(digits);
        if (!num) {
          throw "Missing number at position " + iValue;
        }
        iValue += num[0].length;
        return parseInt(num[0], 10);
      }, getName = (match, shortNames, longNames) => {
        let index = -1;
        let arr = lookAhead(match) ? longNames : shortNames;
        let names = [];
        for (let i = 0; i < arr.length; i++) {
          names.push([i, arr[i]]);
        }
        names.sort((a, b) => {
          return -(a[1].length - b[1].length);
        });
        for (let i = 0; i < names.length; i++) {
          let name = names[i][1];
          if (value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
            index = names[i][0];
            iValue += name.length;
            break;
          }
        }
        if (index !== -1) {
          return index + 1;
        } else {
          throw "Unknown name at position " + iValue;
        }
      }, checkLiteral = () => {
        if (value.charAt(iValue) !== format.charAt(iFormat)) {
          throw "Unexpected literal at position " + iValue;
        }
        iValue++;
      };
      if (this.currentView === "month") {
        day = 1;
      }
      for (iFormat = 0; iFormat < format.length; iFormat++) {
        if (literal) {
          if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
            literal = false;
          } else {
            checkLiteral();
          }
        } else {
          switch (format.charAt(iFormat)) {
            case "d":
              day = getNumber("d");
              break;
            case "D":
              getName("D", this.$primevue.config.locale.dayNamesShort, this.$primevue.config.locale.dayNames);
              break;
            case "o":
              doy = getNumber("o");
              break;
            case "m":
              month = getNumber("m");
              break;
            case "M":
              month = getName("M", this.$primevue.config.locale.monthNamesShort, this.$primevue.config.locale.monthNames);
              break;
            case "y":
              year = getNumber("y");
              break;
            case "@":
              date = new Date(getNumber("@"));
              year = date.getFullYear();
              month = date.getMonth() + 1;
              day = date.getDate();
              break;
            case "!":
              date = new Date((getNumber("!") - this.ticksTo1970) / 1e4);
              year = date.getFullYear();
              month = date.getMonth() + 1;
              day = date.getDate();
              break;
            case "'":
              if (lookAhead("'")) {
                checkLiteral();
              } else {
                literal = true;
              }
              break;
            default:
              checkLiteral();
          }
        }
      }
      if (iValue < value.length) {
        extra = value.substr(iValue);
        if (!/^\s+/.test(extra)) {
          throw "Extra/unparsed characters found in date: " + extra;
        }
      }
      if (year === -1) {
        year = (/* @__PURE__ */ new Date()).getFullYear();
      } else if (year < 100) {
        year += (/* @__PURE__ */ new Date()).getFullYear() - (/* @__PURE__ */ new Date()).getFullYear() % 100 + (year <= shortYearCutoff ? 0 : -100);
      }
      if (doy > -1) {
        month = 1;
        day = doy;
        do {
          dim = this.getDaysCountInMonth(year, month - 1);
          if (day <= dim) {
            break;
          }
          month++;
          day -= dim;
        } while (true);
      }
      date = this.daylightSavingAdjust(new Date(year, month - 1, day));
      if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
        throw "Invalid date";
      }
      return date;
    },
    getWeekNumber(date) {
      let checkDate = new Date(date.getTime());
      checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
      let time = checkDate.getTime();
      checkDate.setMonth(0);
      checkDate.setDate(1);
      return Math.floor(Math.round((time - checkDate.getTime()) / 864e5) / 7) + 1;
    },
    onDateCellKeydown(event2, date, groupIndex) {
      const cellContent = event2.currentTarget;
      const cell = cellContent.parentElement;
      const cellIndex = DomHandler.index(cell);
      switch (event2.code) {
        case "ArrowDown": {
          cellContent.tabIndex = "-1";
          let nextRow = cell.parentElement.nextElementSibling;
          if (nextRow) {
            let tableRowIndex = DomHandler.index(cell.parentElement);
            const tableRows = Array.from(cell.parentElement.parentElement.children);
            const nextTableRows = tableRows.slice(tableRowIndex + 1);
            let hasNextFocusableDate = nextTableRows.find((el) => {
              let focusCell = el.children[cellIndex].children[0];
              return !DomHandler.hasClass(focusCell, "p-disabled");
            });
            if (hasNextFocusableDate) {
              let focusCell = hasNextFocusableDate.children[cellIndex].children[0];
              focusCell.tabIndex = "0";
              focusCell.focus();
            } else {
              this.navigationState = { backward: false };
              this.navForward(event2);
            }
          } else {
            this.navigationState = { backward: false };
            this.navForward(event2);
          }
          event2.preventDefault();
          break;
        }
        case "ArrowUp": {
          cellContent.tabIndex = "-1";
          let prevRow = cell.parentElement.previousElementSibling;
          if (prevRow) {
            let tableRowIndex = DomHandler.index(cell.parentElement);
            const tableRows = Array.from(cell.parentElement.parentElement.children);
            const prevTableRows = tableRows.slice(0, tableRowIndex).reverse();
            let hasNextFocusableDate = prevTableRows.find((el) => {
              let focusCell = el.children[cellIndex].children[0];
              return !DomHandler.hasClass(focusCell, "p-disabled");
            });
            if (hasNextFocusableDate) {
              let focusCell = hasNextFocusableDate.children[cellIndex].children[0];
              focusCell.tabIndex = "0";
              focusCell.focus();
            } else {
              this.navigationState = { backward: true };
              this.navBackward(event2);
            }
          } else {
            this.navigationState = { backward: true };
            this.navBackward(event2);
          }
          event2.preventDefault();
          break;
        }
        case "ArrowLeft": {
          cellContent.tabIndex = "-1";
          let prevCell = cell.previousElementSibling;
          if (prevCell) {
            const cells = Array.from(cell.parentElement.children);
            const prevCells = cells.slice(0, cellIndex).reverse();
            let hasNextFocusableDate = prevCells.find((el) => {
              let focusCell = el.children[0];
              return !DomHandler.hasClass(focusCell, "p-disabled");
            });
            if (hasNextFocusableDate) {
              let focusCell = hasNextFocusableDate.children[0];
              focusCell.tabIndex = "0";
              focusCell.focus();
            } else {
              this.navigateToMonth(event2, true, groupIndex);
            }
          } else {
            this.navigateToMonth(event2, true, groupIndex);
          }
          event2.preventDefault();
          break;
        }
        case "ArrowRight": {
          cellContent.tabIndex = "-1";
          let nextCell = cell.nextElementSibling;
          if (nextCell) {
            const cells = Array.from(cell.parentElement.children);
            const nextCells = cells.slice(cellIndex + 1);
            let hasNextFocusableDate = nextCells.find((el) => {
              let focusCell = el.children[0];
              return !DomHandler.hasClass(focusCell, "p-disabled");
            });
            if (hasNextFocusableDate) {
              let focusCell = hasNextFocusableDate.children[0];
              focusCell.tabIndex = "0";
              focusCell.focus();
            } else {
              this.navigateToMonth(event2, false, groupIndex);
            }
          } else {
            this.navigateToMonth(event2, false, groupIndex);
          }
          event2.preventDefault();
          break;
        }
        case "Enter":
        case "Space": {
          this.onDateSelect(event2, date);
          event2.preventDefault();
          break;
        }
        case "Escape": {
          this.overlayVisible = false;
          event2.preventDefault();
          break;
        }
        case "Tab": {
          if (!this.inline) {
            this.trapFocus(event2);
          }
          break;
        }
        case "Home": {
          cellContent.tabIndex = "-1";
          let currentRow = cell.parentElement;
          let focusCell = currentRow.children[0].children[0];
          if (DomHandler.hasClass(focusCell, "p-disabled")) {
            this.navigateToMonth(event2, true, groupIndex);
          } else {
            focusCell.tabIndex = "0";
            focusCell.focus();
          }
          event2.preventDefault();
          break;
        }
        case "End": {
          cellContent.tabIndex = "-1";
          let currentRow = cell.parentElement;
          let focusCell = currentRow.children[currentRow.children.length - 1].children[0];
          if (DomHandler.hasClass(focusCell, "p-disabled")) {
            this.navigateToMonth(event2, false, groupIndex);
          } else {
            focusCell.tabIndex = "0";
            focusCell.focus();
          }
          event2.preventDefault();
          break;
        }
        case "PageUp": {
          cellContent.tabIndex = "-1";
          if (event2.shiftKey) {
            this.navigationState = { backward: true };
            this.navBackward(event2);
          } else
            this.navigateToMonth(event2, true, groupIndex);
          event2.preventDefault();
          break;
        }
        case "PageDown": {
          cellContent.tabIndex = "-1";
          if (event2.shiftKey) {
            this.navigationState = { backward: false };
            this.navForward(event2);
          } else
            this.navigateToMonth(event2, false, groupIndex);
          event2.preventDefault();
          break;
        }
      }
    },
    navigateToMonth(event2, prev, groupIndex) {
      if (prev) {
        if (this.numberOfMonths === 1 || groupIndex === 0) {
          this.navigationState = { backward: true };
          this.navBackward(event2);
        } else {
          let prevMonthContainer = this.overlay.children[groupIndex - 1];
          let cells = DomHandler.find(prevMonthContainer, ".p-datepicker-calendar td span:not(.p-disabled):not(.p-ink)");
          let focusCell = cells[cells.length - 1];
          focusCell.tabIndex = "0";
          focusCell.focus();
        }
      } else {
        if (this.numberOfMonths === 1 || groupIndex === this.numberOfMonths - 1) {
          this.navigationState = { backward: false };
          this.navForward(event2);
        } else {
          let nextMonthContainer = this.overlay.children[groupIndex + 1];
          let focusCell = DomHandler.findSingle(nextMonthContainer, ".p-datepicker-calendar td span:not(.p-disabled):not(.p-ink)");
          focusCell.tabIndex = "0";
          focusCell.focus();
        }
      }
    },
    onMonthCellKeydown(event2, index) {
      const cell = event2.currentTarget;
      switch (event2.code) {
        case "ArrowUp":
        case "ArrowDown": {
          cell.tabIndex = "-1";
          var cells = cell.parentElement.children;
          var cellIndex = DomHandler.index(cell);
          let nextCell = cells[event2.code === "ArrowDown" ? cellIndex + 3 : cellIndex - 3];
          if (nextCell) {
            nextCell.tabIndex = "0";
            nextCell.focus();
          }
          event2.preventDefault();
          break;
        }
        case "ArrowLeft": {
          cell.tabIndex = "-1";
          let prevCell = cell.previousElementSibling;
          if (prevCell) {
            prevCell.tabIndex = "0";
            prevCell.focus();
          } else {
            this.navigationState = { backward: true };
            this.navBackward(event2);
          }
          event2.preventDefault();
          break;
        }
        case "ArrowRight": {
          cell.tabIndex = "-1";
          let nextCell = cell.nextElementSibling;
          if (nextCell) {
            nextCell.tabIndex = "0";
            nextCell.focus();
          } else {
            this.navigationState = { backward: false };
            this.navForward(event2);
          }
          event2.preventDefault();
          break;
        }
        case "PageUp": {
          if (event2.shiftKey)
            return;
          this.navigationState = { backward: true };
          this.navBackward(event2);
          break;
        }
        case "PageDown": {
          if (event2.shiftKey)
            return;
          this.navigationState = { backward: false };
          this.navForward(event2);
          break;
        }
        case "Enter":
        case "Space": {
          this.onMonthSelect(event2, index);
          event2.preventDefault();
          break;
        }
        case "Escape": {
          this.overlayVisible = false;
          event2.preventDefault();
          break;
        }
        case "Tab": {
          this.trapFocus(event2);
          break;
        }
      }
    },
    onYearCellKeydown(event2, index) {
      const cell = event2.currentTarget;
      switch (event2.code) {
        case "ArrowUp":
        case "ArrowDown": {
          cell.tabIndex = "-1";
          var cells = cell.parentElement.children;
          var cellIndex = DomHandler.index(cell);
          let nextCell = cells[event2.code === "ArrowDown" ? cellIndex + 2 : cellIndex - 2];
          if (nextCell) {
            nextCell.tabIndex = "0";
            nextCell.focus();
          }
          event2.preventDefault();
          break;
        }
        case "ArrowLeft": {
          cell.tabIndex = "-1";
          let prevCell = cell.previousElementSibling;
          if (prevCell) {
            prevCell.tabIndex = "0";
            prevCell.focus();
          } else {
            this.navigationState = { backward: true };
            this.navBackward(event2);
          }
          event2.preventDefault();
          break;
        }
        case "ArrowRight": {
          cell.tabIndex = "-1";
          let nextCell = cell.nextElementSibling;
          if (nextCell) {
            nextCell.tabIndex = "0";
            nextCell.focus();
          } else {
            this.navigationState = { backward: false };
            this.navForward(event2);
          }
          event2.preventDefault();
          break;
        }
        case "PageUp": {
          if (event2.shiftKey)
            return;
          this.navigationState = { backward: true };
          this.navBackward(event2);
          break;
        }
        case "PageDown": {
          if (event2.shiftKey)
            return;
          this.navigationState = { backward: false };
          this.navForward(event2);
          break;
        }
        case "Enter":
        case "Space": {
          this.onYearSelect(event2, index);
          event2.preventDefault();
          break;
        }
        case "Escape": {
          this.overlayVisible = false;
          event2.preventDefault();
          break;
        }
        case "Tab": {
          this.trapFocus(event2);
          break;
        }
      }
    },
    updateFocus() {
      let cell;
      if (this.navigationState) {
        if (this.navigationState.button) {
          this.initFocusableCell();
          if (this.navigationState.backward)
            DomHandler.findSingle(this.overlay, ".p-datepicker-prev").focus();
          else
            DomHandler.findSingle(this.overlay, ".p-datepicker-next").focus();
        } else {
          if (this.navigationState.backward) {
            let cells;
            if (this.currentView === "month") {
              cells = DomHandler.find(this.overlay, ".p-monthpicker .p-monthpicker-month:not(.p-disabled)");
            } else if (this.currentView === "year") {
              cells = DomHandler.find(this.overlay, ".p-yearpicker .p-yearpicker-year:not(.p-disabled)");
            } else {
              cells = DomHandler.find(this.overlay, ".p-datepicker-calendar td span:not(.p-disabled):not(.p-ink)");
            }
            if (cells && cells.length > 0) {
              cell = cells[cells.length - 1];
            }
          } else {
            if (this.currentView === "month") {
              cell = DomHandler.findSingle(this.overlay, ".p-monthpicker .p-monthpicker-month:not(.p-disabled)");
            } else if (this.currentView === "year") {
              cell = DomHandler.findSingle(this.overlay, ".p-yearpicker .p-yearpicker-year:not(.p-disabled)");
            } else {
              cell = DomHandler.findSingle(this.overlay, ".p-datepicker-calendar td span:not(.p-disabled):not(.p-ink)");
            }
          }
          if (cell) {
            cell.tabIndex = "0";
            cell.focus();
          }
        }
        this.navigationState = null;
      } else {
        this.initFocusableCell();
      }
    },
    initFocusableCell() {
      let cell;
      if (this.currentView === "month") {
        let cells = DomHandler.find(this.overlay, ".p-monthpicker .p-monthpicker-month");
        let selectedCell = DomHandler.findSingle(this.overlay, ".p-monthpicker .p-monthpicker-month.p-highlight");
        cells.forEach((cell2) => cell2.tabIndex = -1);
        cell = selectedCell || cells[0];
      } else if (this.currentView === "year") {
        let cells = DomHandler.find(this.overlay, ".p-yearpicker .p-yearpicker-year");
        let selectedCell = DomHandler.findSingle(this.overlay, ".p-yearpicker .p-yearpicker-year.p-highlight");
        cells.forEach((cell2) => cell2.tabIndex = -1);
        cell = selectedCell || cells[0];
      } else {
        cell = DomHandler.findSingle(this.overlay, "span.p-highlight");
        if (!cell) {
          let todayCell = DomHandler.findSingle(this.overlay, "td.p-datepicker-today span:not(.p-disabled):not(.p-ink");
          if (todayCell)
            cell = todayCell;
          else
            cell = DomHandler.findSingle(this.overlay, ".p-datepicker-calendar td span:not(.p-disabled):not(.p-ink");
        }
      }
      if (cell) {
        cell.tabIndex = "0";
        if (!this.inline && (!this.navigationState || !this.navigationState.button) && !this.timePickerChange) {
          cell.focus();
        }
        this.preventFocus = false;
      }
    },
    trapFocus(event2) {
      event2.preventDefault();
      let focusableElements = DomHandler.getFocusableElements(this.overlay);
      if (focusableElements && focusableElements.length > 0) {
        if (!document.activeElement) {
          focusableElements[0].focus();
        } else {
          let focusedIndex = focusableElements.indexOf(document.activeElement);
          if (event2.shiftKey) {
            if (focusedIndex === -1 || focusedIndex === 0)
              focusableElements[focusableElements.length - 1].focus();
            else
              focusableElements[focusedIndex - 1].focus();
          } else {
            if (focusedIndex === -1) {
              if (this.timeOnly) {
                focusableElements[0].focus();
              } else {
                let spanIndex = null;
                for (let i = 0; i < focusableElements.length; i++) {
                  if (focusableElements[i].tagName === "SPAN")
                    spanIndex = i;
                }
                focusableElements[spanIndex].focus();
              }
            } else if (focusedIndex === focusableElements.length - 1)
              focusableElements[0].focus();
            else
              focusableElements[focusedIndex + 1].focus();
          }
        }
      }
    },
    onContainerButtonKeydown(event2) {
      switch (event2.code) {
        case "Tab":
          this.trapFocus(event2);
          break;
        case "Escape":
          this.overlayVisible = false;
          event2.preventDefault();
          break;
      }
      this.$emit("keydown", event2);
    },
    onInput(event2) {
      try {
        this.selectionStart = this.input.selectionStart;
        this.selectionEnd = this.input.selectionEnd;
        let value = this.parseValue(event2.target.value);
        if (this.isValidSelection(value)) {
          this.typeUpdate = true;
          this.updateModel(value);
        }
      } catch (err) {
      }
      this.$emit("input", event2);
    },
    onInputClick() {
      if (this.showOnFocus && this.isEnabled() && !this.overlayVisible) {
        this.overlayVisible = true;
      }
    },
    onFocus(event2) {
      if (this.showOnFocus && this.isEnabled()) {
        this.overlayVisible = true;
      }
      this.focused = true;
      this.$emit("focus", event2);
    },
    onBlur(event2) {
      this.$emit("blur", { originalEvent: event2, value: event2.target.value });
      this.focused = false;
      event2.target.value = this.formatValue(this.modelValue);
    },
    onKeyDown(event2) {
      if (event2.code === "ArrowDown" && this.overlay) {
        this.trapFocus(event2);
      } else if (event2.code === "ArrowDown" && !this.overlay) {
        this.overlayVisible = true;
      } else if (event2.code === "Escape") {
        if (this.overlayVisible) {
          this.overlayVisible = false;
          event2.preventDefault();
        }
      } else if (event2.code === "Tab") {
        if (this.overlay) {
          DomHandler.getFocusableElements(this.overlay).forEach((el) => el.tabIndex = "-1");
        }
        if (this.overlayVisible) {
          this.overlayVisible = false;
        }
      }
    },
    overlayRef(el) {
      this.overlay = el;
    },
    inputRef(el) {
      this.input = el;
    },
    getMonthName(index) {
      return this.$primevue.config.locale.monthNames[index];
    },
    getYear(month) {
      return this.currentView === "month" ? this.currentYear : month.year;
    },
    onOverlayClick(event2) {
      if (!this.inline) {
        OverlayEventBus.emit("overlay-click", {
          originalEvent: event2,
          target: this.$el
        });
      }
    },
    onOverlayKeyDown(event2) {
      switch (event2.code) {
        case "Escape":
          this.input.focus();
          this.overlayVisible = false;
          break;
      }
    },
    onOverlayMouseUp(event2) {
      this.onOverlayClick(event2);
    },
    createResponsiveStyle() {
      if (this.numberOfMonths > 1 && this.responsiveOptions) {
        if (!this.responsiveStyleElement) {
          this.responsiveStyleElement = document.createElement("style");
          this.responsiveStyleElement.type = "text/css";
          document.body.appendChild(this.responsiveStyleElement);
        }
        let innerHTML = "";
        if (this.responsiveOptions) {
          let responsiveOptions = [...this.responsiveOptions].filter((o) => !!(o.breakpoint && o.numMonths)).sort((o1, o2) => -1 * o1.breakpoint.localeCompare(o2.breakpoint, void 0, { numeric: true }));
          for (let i = 0; i < responsiveOptions.length; i++) {
            let { breakpoint, numMonths } = responsiveOptions[i];
            let styles = `
                            .p-datepicker[${this.attributeSelector}] .p-datepicker-group:nth-child(${numMonths}) .p-datepicker-next {
                                display: inline-flex !important;
                            }
                        `;
            for (let j = numMonths; j < this.numberOfMonths; j++) {
              styles += `
                                .p-datepicker[${this.attributeSelector}] .p-datepicker-group:nth-child(${j + 1}) {
                                    display: none !important;
                                }
                            `;
            }
            innerHTML += `
                            @media screen and (max-width: ${breakpoint}) {
                                ${styles}
                            }
                        `;
          }
        }
        this.responsiveStyleElement.innerHTML = innerHTML;
      }
    },
    destroyResponsiveStyleElement() {
      if (this.responsiveStyleElement) {
        this.responsiveStyleElement.remove();
        this.responsiveStyleElement = null;
      }
    }
  },
  computed: {
    viewDate() {
      let propValue = this.modelValue;
      if (propValue && Array.isArray(propValue)) {
        if (this.isRangeSelection()) {
          propValue = this.inline ? propValue[0] : propValue[1] || propValue[0];
        } else if (this.isMultipleSelection()) {
          propValue = propValue[propValue.length - 1];
        }
      }
      if (propValue && typeof propValue !== "string") {
        return propValue;
      } else {
        let today = /* @__PURE__ */ new Date();
        if (this.maxDate && this.maxDate < today) {
          return this.maxDate;
        }
        if (this.minDate && this.minDate > today) {
          return this.minDate;
        }
        return today;
      }
    },
    inputFieldValue() {
      return this.formatValue(this.modelValue);
    },
    containerClass() {
      return [
        "p-calendar p-component p-inputwrapper",
        {
          "p-calendar-w-btn": this.showIcon,
          "p-calendar-timeonly": this.timeOnly,
          "p-calendar-disabled": this.disabled,
          "p-inputwrapper-filled": this.modelValue,
          "p-inputwrapper-focus": this.focused
        }
      ];
    },
    panelStyleClass() {
      return [
        "p-datepicker p-component",
        this.panelClass,
        {
          "p-datepicker-inline": this.inline,
          "p-disabled": this.disabled,
          "p-datepicker-timeonly": this.timeOnly,
          "p-datepicker-multiple-month": this.numberOfMonths > 1,
          "p-datepicker-monthpicker": this.currentView === "month",
          "p-datepicker-yearpicker": this.currentView === "year",
          "p-datepicker-touch-ui": this.touchUI,
          "p-input-filled": this.$primevue.config.inputStyle === "filled",
          "p-ripple-disabled": this.$primevue.config.ripple === false
        }
      ];
    },
    months() {
      let months = [];
      for (let i = 0; i < this.numberOfMonths; i++) {
        let month = this.currentMonth + i;
        let year = this.currentYear;
        if (month > 11) {
          month = month % 11 - 1;
          year = year + 1;
        }
        let dates = [];
        let firstDay = this.getFirstDayOfMonthIndex(month, year);
        let daysLength = this.getDaysCountInMonth(month, year);
        let prevMonthDaysLength = this.getDaysCountInPrevMonth(month, year);
        let dayNo = 1;
        let today = /* @__PURE__ */ new Date();
        let weekNumbers = [];
        let monthRows = Math.ceil((daysLength + firstDay) / 7);
        for (let i2 = 0; i2 < monthRows; i2++) {
          let week = [];
          if (i2 == 0) {
            for (let j = prevMonthDaysLength - firstDay + 1; j <= prevMonthDaysLength; j++) {
              let prev = this.getPreviousMonthAndYear(month, year);
              week.push({ day: j, month: prev.month, year: prev.year, otherMonth: true, today: this.isToday(today, j, prev.month, prev.year), selectable: this.isSelectable(j, prev.month, prev.year, true) });
            }
            let remainingDaysLength = 7 - week.length;
            for (let j = 0; j < remainingDaysLength; j++) {
              week.push({ day: dayNo, month, year, today: this.isToday(today, dayNo, month, year), selectable: this.isSelectable(dayNo, month, year, false) });
              dayNo++;
            }
          } else {
            for (let j = 0; j < 7; j++) {
              if (dayNo > daysLength) {
                let next = this.getNextMonthAndYear(month, year);
                week.push({
                  day: dayNo - daysLength,
                  month: next.month,
                  year: next.year,
                  otherMonth: true,
                  today: this.isToday(today, dayNo - daysLength, next.month, next.year),
                  selectable: this.isSelectable(dayNo - daysLength, next.month, next.year, true)
                });
              } else {
                week.push({ day: dayNo, month, year, today: this.isToday(today, dayNo, month, year), selectable: this.isSelectable(dayNo, month, year, false) });
              }
              dayNo++;
            }
          }
          if (this.showWeek) {
            weekNumbers.push(this.getWeekNumber(new Date(week[0].year, week[0].month, week[0].day)));
          }
          dates.push(week);
        }
        months.push({
          month,
          year,
          dates,
          weekNumbers
        });
      }
      return months;
    },
    weekDays() {
      let weekDays = [];
      let dayIndex = this.$primevue.config.locale.firstDayOfWeek;
      for (let i = 0; i < 7; i++) {
        weekDays.push(this.$primevue.config.locale.dayNamesMin[dayIndex]);
        dayIndex = dayIndex == 6 ? 0 : ++dayIndex;
      }
      return weekDays;
    },
    ticksTo1970() {
      return ((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) + Math.floor(1970 / 400)) * 24 * 60 * 60 * 1e7;
    },
    sundayIndex() {
      return this.$primevue.config.locale.firstDayOfWeek > 0 ? 7 - this.$primevue.config.locale.firstDayOfWeek : 0;
    },
    datePattern() {
      return this.dateFormat || this.$primevue.config.locale.dateFormat;
    },
    yearOptions() {
      if (this.yearRange) {
        let $vm = this;
        const years = this.yearRange.split(":");
        let yearStart = parseInt(years[0]);
        let yearEnd = parseInt(years[1]);
        let yearOptions = [];
        if (this.currentYear < yearStart) {
          $vm.currentYear = yearEnd;
        } else if (this.currentYear > yearEnd) {
          $vm.currentYear = yearStart;
        }
        for (let i = yearStart; i <= yearEnd; i++) {
          yearOptions.push(i);
        }
        return yearOptions;
      } else {
        return null;
      }
    },
    monthPickerValues() {
      let monthPickerValues = [];
      const isSelectableMonth = (baseMonth) => {
        if (this.minDate) {
          const minMonth = this.minDate.getMonth();
          const minYear = this.minDate.getFullYear();
          if (this.currentYear < minYear || this.currentYear === minYear && baseMonth < minMonth) {
            return false;
          }
        }
        if (this.maxDate) {
          const maxMonth = this.maxDate.getMonth();
          const maxYear = this.maxDate.getFullYear();
          if (this.currentYear > maxYear || this.currentYear === maxYear && baseMonth > maxMonth) {
            return false;
          }
        }
        return true;
      };
      for (let i = 0; i <= 11; i++) {
        monthPickerValues.push({ value: this.$primevue.config.locale.monthNamesShort[i], selectable: isSelectableMonth(i) });
      }
      return monthPickerValues;
    },
    yearPickerValues() {
      let yearPickerValues = [];
      let base = this.currentYear - this.currentYear % 10;
      const isSelectableYear = (baseYear) => {
        if (this.minDate) {
          if (this.minDate.getFullYear() > baseYear)
            return false;
        }
        if (this.maxDate) {
          if (this.maxDate.getFullYear() < baseYear)
            return false;
        }
        return true;
      };
      for (let i = 0; i < 10; i++) {
        yearPickerValues.push({ value: base + i, selectable: isSelectableYear(base + i) });
      }
      return yearPickerValues;
    },
    formattedCurrentHour() {
      return this.currentHour < 10 ? "0" + this.currentHour : this.currentHour;
    },
    formattedCurrentMinute() {
      return this.currentMinute < 10 ? "0" + this.currentMinute : this.currentMinute;
    },
    formattedCurrentSecond() {
      return this.currentSecond < 10 ? "0" + this.currentSecond : this.currentSecond;
    },
    todayLabel() {
      return this.$primevue.config.locale.today;
    },
    clearLabel() {
      return this.$primevue.config.locale.clear;
    },
    weekHeaderLabel() {
      return this.$primevue.config.locale.weekHeader;
    },
    monthNames() {
      return this.$primevue.config.locale.monthNames;
    },
    attributeSelector() {
      return UniqueComponentId();
    },
    switchViewButtonDisabled() {
      return this.numberOfMonths > 1 || this.disabled;
    },
    panelId() {
      return UniqueComponentId() + "_panel";
    }
  },
  components: {
    CalendarButton: script$i,
    Portal: script$h
  },
  directives: {
    ripple: Ripple
  }
};
const _hoisted_1 = ["id"];
const _hoisted_2 = ["id", "placeholder", "aria-expanded", "aria-controls", "aria-labelledby", "aria-label", "disabled", "readonly"];
const _hoisted_3 = ["id", "role", "aria-modal", "aria-label"];
const _hoisted_4 = { class: "p-datepicker-group-container" };
const _hoisted_5 = { class: "p-datepicker-header" };
const _hoisted_6 = ["disabled", "aria-label"];
const _hoisted_7 = { class: "p-datepicker-title" };
const _hoisted_8 = ["disabled", "aria-label"];
const _hoisted_9 = ["disabled", "aria-label"];
const _hoisted_10 = {
  key: 2,
  class: "p-datepicker-decade"
};
const _hoisted_11 = ["disabled", "aria-label"];
const _hoisted_12 = {
  key: 0,
  class: "p-datepicker-calendar-container"
};
const _hoisted_13 = {
  class: "p-datepicker-calendar",
  role: "grid"
};
const _hoisted_14 = {
  key: 0,
  scope: "col",
  class: "p-datepicker-weekheader p-disabled"
};
const _hoisted_15 = ["abbr"];
const _hoisted_16 = {
  key: 0,
  class: "p-datepicker-weeknumber"
};
const _hoisted_17 = { class: "p-disabled" };
const _hoisted_18 = {
  key: 0,
  style: { "visibility": "hidden" }
};
const _hoisted_19 = ["aria-label"];
const _hoisted_20 = ["onClick", "onKeydown", "aria-selected"];
const _hoisted_21 = {
  key: 0,
  class: "p-hidden-accessible",
  "aria-live": "polite"
};
const _hoisted_22 = {
  key: 0,
  class: "p-monthpicker"
};
const _hoisted_23 = ["onClick", "onKeydown"];
const _hoisted_24 = {
  key: 0,
  class: "p-hidden-accessible",
  "aria-live": "polite"
};
const _hoisted_25 = {
  key: 1,
  class: "p-yearpicker"
};
const _hoisted_26 = ["onClick", "onKeydown"];
const _hoisted_27 = {
  key: 0,
  class: "p-hidden-accessible",
  "aria-live": "polite"
};
const _hoisted_28 = {
  key: 1,
  class: "p-timepicker"
};
const _hoisted_29 = { class: "p-hour-picker" };
const _hoisted_30 = ["aria-label"];
const _hoisted_31 = ["aria-label"];
const _hoisted_32 = { class: "p-separator" };
const _hoisted_33 = { class: "p-minute-picker" };
const _hoisted_34 = ["aria-label", "disabled"];
const _hoisted_35 = ["aria-label", "disabled"];
const _hoisted_36 = {
  key: 0,
  class: "p-separator"
};
const _hoisted_37 = {
  key: 1,
  class: "p-second-picker"
};
const _hoisted_38 = ["aria-label", "disabled"];
const _hoisted_39 = ["aria-label", "disabled"];
const _hoisted_40 = {
  key: 2,
  class: "p-separator"
};
const _hoisted_41 = {
  key: 3,
  class: "p-ampm-picker"
};
const _hoisted_42 = ["aria-label", "disabled"];
const _hoisted_43 = ["aria-label", "disabled"];
const _hoisted_44 = {
  key: 2,
  class: "p-datepicker-buttonbar"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_CalendarButton = resolveComponent("CalendarButton");
  const _component_Portal = resolveComponent("Portal");
  const _directive_ripple = resolveDirective("ripple");
  return openBlock(), createElementBlock("span", {
    ref: "container",
    id: $props.id,
    class: normalizeClass($options.containerClass)
  }, [
    !$props.inline ? (openBlock(), createElementBlock("input", mergeProps({
      key: 0,
      ref: $options.inputRef,
      id: $props.inputId,
      type: "text",
      role: "combobox",
      class: ["p-inputtext p-component", $props.inputClass],
      style: $props.inputStyle,
      placeholder: $props.placeholder,
      autocomplete: "off",
      "aria-autocomplete": "none",
      "aria-haspopup": "dialog",
      "aria-expanded": $data.overlayVisible,
      "aria-controls": $options.panelId,
      "aria-labelledby": _ctx.ariaLabelledby,
      "aria-label": _ctx.ariaLabel,
      inputmode: "none",
      disabled: $props.disabled,
      readonly: !$props.manualInput || $props.readonly,
      tabindex: 0,
      onInput: _cache[0] || (_cache[0] = (...args) => $options.onInput && $options.onInput(...args)),
      onClick: _cache[1] || (_cache[1] = (...args) => $options.onInputClick && $options.onInputClick(...args)),
      onFocus: _cache[2] || (_cache[2] = (...args) => $options.onFocus && $options.onFocus(...args)),
      onBlur: _cache[3] || (_cache[3] = (...args) => $options.onBlur && $options.onBlur(...args)),
      onKeydown: _cache[4] || (_cache[4] = (...args) => $options.onKeyDown && $options.onKeyDown(...args))
    }, $props.inputProps), null, 16, _hoisted_2)) : createCommentVNode("", true),
    $props.showIcon ? (openBlock(), createBlock(_component_CalendarButton, {
      key: 1,
      icon: $props.icon,
      class: "p-datepicker-trigger",
      disabled: $props.disabled,
      onClick: $options.onButtonClick,
      type: "button",
      "aria-label": _ctx.$primevue.config.locale.chooseDate,
      "aria-haspopup": "dialog",
      "aria-expanded": $data.overlayVisible,
      "aria-controls": $options.panelId
    }, null, 8, ["icon", "disabled", "onClick", "aria-label", "aria-expanded", "aria-controls"])) : createCommentVNode("", true),
    createVNode(_component_Portal, {
      appendTo: $props.appendTo,
      disabled: $props.inline
    }, {
      default: withCtx(() => [
        createVNode(Transition, {
          name: "p-connected-overlay",
          onEnter: _cache[68] || (_cache[68] = ($event) => $options.onOverlayEnter($event)),
          onAfterEnter: $options.onOverlayEnterComplete,
          onAfterLeave: $options.onOverlayAfterLeave,
          onLeave: $options.onOverlayLeave
        }, {
          default: withCtx(() => [
            $props.inline || $data.overlayVisible ? (openBlock(), createElementBlock("div", mergeProps({
              key: 0,
              ref: $options.overlayRef,
              id: $options.panelId,
              class: $options.panelStyleClass,
              style: $props.panelStyle,
              role: $props.inline ? null : "dialog",
              "aria-modal": $props.inline ? null : "true",
              "aria-label": _ctx.$primevue.config.locale.chooseDate,
              onClick: _cache[65] || (_cache[65] = (...args) => $options.onOverlayClick && $options.onOverlayClick(...args)),
              onKeydown: _cache[66] || (_cache[66] = (...args) => $options.onOverlayKeyDown && $options.onOverlayKeyDown(...args)),
              onMouseup: _cache[67] || (_cache[67] = (...args) => $options.onOverlayMouseUp && $options.onOverlayMouseUp(...args))
            }, $props.panelProps), [
              !$props.timeOnly ? (openBlock(), createElementBlock(Fragment$1, { key: 0 }, [
                createElementVNode("div", _hoisted_4, [
                  (openBlock(true), createElementBlock(Fragment$1, null, renderList($options.months, (month, groupIndex) => {
                    return openBlock(), createElementBlock("div", {
                      key: month.month + month.year,
                      class: "p-datepicker-group"
                    }, [
                      createElementVNode("div", _hoisted_5, [
                        renderSlot(_ctx.$slots, "header"),
                        withDirectives((openBlock(), createElementBlock("button", {
                          class: "p-datepicker-prev p-link",
                          onClick: _cache[5] || (_cache[5] = (...args) => $options.onPrevButtonClick && $options.onPrevButtonClick(...args)),
                          type: "button",
                          onKeydown: _cache[6] || (_cache[6] = (...args) => $options.onContainerButtonKeydown && $options.onContainerButtonKeydown(...args)),
                          disabled: $props.disabled,
                          "aria-label": $data.currentView === "year" ? _ctx.$primevue.config.locale.prevDecade : $data.currentView === "month" ? _ctx.$primevue.config.locale.prevYear : _ctx.$primevue.config.locale.prevMonth
                        }, [
                          createElementVNode("span", {
                            class: normalizeClass(["p-datepicker-prev-icon", $props.previousIcon])
                          }, null, 2)
                        ], 40, _hoisted_6)), [
                          [vShow, $props.showOtherMonths ? groupIndex === 0 : false],
                          [_directive_ripple]
                        ]),
                        createElementVNode("div", _hoisted_7, [
                          $data.currentView === "date" ? (openBlock(), createElementBlock("button", {
                            key: 0,
                            type: "button",
                            onClick: _cache[7] || (_cache[7] = (...args) => $options.switchToMonthView && $options.switchToMonthView(...args)),
                            onKeydown: _cache[8] || (_cache[8] = (...args) => $options.onContainerButtonKeydown && $options.onContainerButtonKeydown(...args)),
                            class: "p-datepicker-month p-link",
                            disabled: $options.switchViewButtonDisabled,
                            "aria-label": _ctx.$primevue.config.locale.chooseMonth
                          }, toDisplayString($options.getMonthName(month.month)), 41, _hoisted_8)) : createCommentVNode("", true),
                          $data.currentView !== "year" ? (openBlock(), createElementBlock("button", {
                            key: 1,
                            type: "button",
                            onClick: _cache[9] || (_cache[9] = (...args) => $options.switchToYearView && $options.switchToYearView(...args)),
                            onKeydown: _cache[10] || (_cache[10] = (...args) => $options.onContainerButtonKeydown && $options.onContainerButtonKeydown(...args)),
                            class: "p-datepicker-year p-link",
                            disabled: $options.switchViewButtonDisabled,
                            "aria-label": _ctx.$primevue.config.locale.chooseYear
                          }, toDisplayString($options.getYear(month)), 41, _hoisted_9)) : createCommentVNode("", true),
                          $data.currentView === "year" ? (openBlock(), createElementBlock("span", _hoisted_10, [
                            renderSlot(_ctx.$slots, "decade", { years: $options.yearPickerValues }, () => [
                              createTextVNode(toDisplayString($options.yearPickerValues[0].value) + " - " + toDisplayString($options.yearPickerValues[$options.yearPickerValues.length - 1].value), 1)
                            ])
                          ])) : createCommentVNode("", true)
                        ]),
                        withDirectives((openBlock(), createElementBlock("button", {
                          class: "p-datepicker-next p-link",
                          onClick: _cache[11] || (_cache[11] = (...args) => $options.onNextButtonClick && $options.onNextButtonClick(...args)),
                          type: "button",
                          onKeydown: _cache[12] || (_cache[12] = (...args) => $options.onContainerButtonKeydown && $options.onContainerButtonKeydown(...args)),
                          disabled: $props.disabled,
                          "aria-label": $data.currentView === "year" ? _ctx.$primevue.config.locale.nextDecade : $data.currentView === "month" ? _ctx.$primevue.config.locale.nextYear : _ctx.$primevue.config.locale.nextMonth
                        }, [
                          createElementVNode("span", {
                            class: normalizeClass(["p-datepicker-next-icon", $props.nextIcon])
                          }, null, 2)
                        ], 40, _hoisted_11)), [
                          [vShow, $props.showOtherMonths ? $props.numberOfMonths === 1 ? true : groupIndex === $props.numberOfMonths - 1 : false],
                          [_directive_ripple]
                        ])
                      ]),
                      $data.currentView === "date" ? (openBlock(), createElementBlock("div", _hoisted_12, [
                        createElementVNode("table", _hoisted_13, [
                          createElementVNode("thead", null, [
                            createElementVNode("tr", null, [
                              $props.showWeek ? (openBlock(), createElementBlock("th", _hoisted_14, [
                                createElementVNode("span", null, toDisplayString($options.weekHeaderLabel), 1)
                              ])) : createCommentVNode("", true),
                              (openBlock(true), createElementBlock(Fragment$1, null, renderList($options.weekDays, (weekDay) => {
                                return openBlock(), createElementBlock("th", {
                                  key: weekDay,
                                  scope: "col",
                                  abbr: weekDay
                                }, [
                                  createElementVNode("span", null, toDisplayString(weekDay), 1)
                                ], 8, _hoisted_15);
                              }), 128))
                            ])
                          ]),
                          createElementVNode("tbody", null, [
                            (openBlock(true), createElementBlock(Fragment$1, null, renderList(month.dates, (week, i) => {
                              return openBlock(), createElementBlock("tr", {
                                key: week[0].day + "" + week[0].month
                              }, [
                                $props.showWeek ? (openBlock(), createElementBlock("td", _hoisted_16, [
                                  createElementVNode("span", _hoisted_17, [
                                    month.weekNumbers[i] < 10 ? (openBlock(), createElementBlock("span", _hoisted_18, "0")) : createCommentVNode("", true),
                                    createTextVNode(" " + toDisplayString(month.weekNumbers[i]), 1)
                                  ])
                                ])) : createCommentVNode("", true),
                                (openBlock(true), createElementBlock(Fragment$1, null, renderList(week, (date) => {
                                  return openBlock(), createElementBlock("td", {
                                    key: date.day + "" + date.month,
                                    "aria-label": date.day,
                                    class: normalizeClass({ "p-datepicker-other-month": date.otherMonth, "p-datepicker-today": date.today })
                                  }, [
                                    withDirectives((openBlock(), createElementBlock("span", {
                                      class: normalizeClass({ "p-highlight": $options.isSelected(date), "p-disabled": !date.selectable }),
                                      onClick: ($event) => $options.onDateSelect($event, date),
                                      draggable: "false",
                                      onKeydown: ($event) => $options.onDateCellKeydown($event, date, groupIndex),
                                      "aria-selected": $options.isSelected(date)
                                    }, [
                                      renderSlot(_ctx.$slots, "date", { date }, () => [
                                        createTextVNode(toDisplayString(date.day), 1)
                                      ])
                                    ], 42, _hoisted_20)), [
                                      [_directive_ripple]
                                    ]),
                                    $options.isSelected(date) ? (openBlock(), createElementBlock("div", _hoisted_21, toDisplayString(date.day), 1)) : createCommentVNode("", true)
                                  ], 10, _hoisted_19);
                                }), 128))
                              ]);
                            }), 128))
                          ])
                        ])
                      ])) : createCommentVNode("", true)
                    ]);
                  }), 128))
                ]),
                $data.currentView === "month" ? (openBlock(), createElementBlock("div", _hoisted_22, [
                  (openBlock(true), createElementBlock(Fragment$1, null, renderList($options.monthPickerValues, (m, i) => {
                    return withDirectives((openBlock(), createElementBlock("span", {
                      key: m,
                      onClick: ($event) => $options.onMonthSelect($event, { month: m, index: i }),
                      onKeydown: ($event) => $options.onMonthCellKeydown($event, { month: m, index: i }),
                      class: normalizeClass(["p-monthpicker-month", { "p-highlight": $options.isMonthSelected(i), "p-disabled": !m.selectable }])
                    }, [
                      createTextVNode(toDisplayString(m.value) + " ", 1),
                      $options.isMonthSelected(i) ? (openBlock(), createElementBlock("div", _hoisted_24, toDisplayString(m.value), 1)) : createCommentVNode("", true)
                    ], 42, _hoisted_23)), [
                      [_directive_ripple]
                    ]);
                  }), 128))
                ])) : createCommentVNode("", true),
                $data.currentView === "year" ? (openBlock(), createElementBlock("div", _hoisted_25, [
                  (openBlock(true), createElementBlock(Fragment$1, null, renderList($options.yearPickerValues, (y) => {
                    return withDirectives((openBlock(), createElementBlock("span", {
                      key: y.value,
                      onClick: ($event) => $options.onYearSelect($event, y),
                      onKeydown: ($event) => $options.onYearCellKeydown($event, y),
                      class: normalizeClass(["p-yearpicker-year", { "p-highlight": $options.isYearSelected(y.value), "p-disabled": !y.selectable }])
                    }, [
                      createTextVNode(toDisplayString(y.value) + " ", 1),
                      $options.isYearSelected(y.value) ? (openBlock(), createElementBlock("div", _hoisted_27, toDisplayString(y.value), 1)) : createCommentVNode("", true)
                    ], 42, _hoisted_26)), [
                      [_directive_ripple]
                    ]);
                  }), 128))
                ])) : createCommentVNode("", true)
              ], 64)) : createCommentVNode("", true),
              ($props.showTime || $props.timeOnly) && $data.currentView === "date" ? (openBlock(), createElementBlock("div", _hoisted_28, [
                createElementVNode("div", _hoisted_29, [
                  withDirectives((openBlock(), createElementBlock("button", {
                    class: "p-link",
                    "aria-label": _ctx.$primevue.config.locale.nextHour,
                    onMousedown: _cache[13] || (_cache[13] = ($event) => $options.onTimePickerElementMouseDown($event, 0, 1)),
                    onMouseup: _cache[14] || (_cache[14] = ($event) => $options.onTimePickerElementMouseUp($event)),
                    onKeydown: [
                      _cache[15] || (_cache[15] = (...args) => $options.onContainerButtonKeydown && $options.onContainerButtonKeydown(...args)),
                      _cache[17] || (_cache[17] = withKeys(($event) => $options.onTimePickerElementMouseDown($event, 0, 1), ["enter"])),
                      _cache[18] || (_cache[18] = withKeys(($event) => $options.onTimePickerElementMouseDown($event, 0, 1), ["space"]))
                    ],
                    onMouseleave: _cache[16] || (_cache[16] = ($event) => $options.onTimePickerElementMouseLeave()),
                    onKeyup: [
                      _cache[19] || (_cache[19] = withKeys(($event) => $options.onTimePickerElementMouseUp($event), ["enter"])),
                      _cache[20] || (_cache[20] = withKeys(($event) => $options.onTimePickerElementMouseUp($event), ["space"]))
                    ],
                    type: "button"
                  }, [
                    createElementVNode("span", {
                      class: normalizeClass($props.incrementIcon)
                    }, null, 2)
                  ], 40, _hoisted_30)), [
                    [_directive_ripple]
                  ]),
                  createElementVNode("span", null, toDisplayString($options.formattedCurrentHour), 1),
                  withDirectives((openBlock(), createElementBlock("button", {
                    class: "p-link",
                    "aria-label": _ctx.$primevue.config.locale.prevHour,
                    onMousedown: _cache[21] || (_cache[21] = ($event) => $options.onTimePickerElementMouseDown($event, 0, -1)),
                    onMouseup: _cache[22] || (_cache[22] = ($event) => $options.onTimePickerElementMouseUp($event)),
                    onKeydown: [
                      _cache[23] || (_cache[23] = (...args) => $options.onContainerButtonKeydown && $options.onContainerButtonKeydown(...args)),
                      _cache[25] || (_cache[25] = withKeys(($event) => $options.onTimePickerElementMouseDown($event, 0, -1), ["enter"])),
                      _cache[26] || (_cache[26] = withKeys(($event) => $options.onTimePickerElementMouseDown($event, 0, -1), ["space"]))
                    ],
                    onMouseleave: _cache[24] || (_cache[24] = ($event) => $options.onTimePickerElementMouseLeave()),
                    onKeyup: [
                      _cache[27] || (_cache[27] = withKeys(($event) => $options.onTimePickerElementMouseUp($event), ["enter"])),
                      _cache[28] || (_cache[28] = withKeys(($event) => $options.onTimePickerElementMouseUp($event), ["space"]))
                    ],
                    type: "button"
                  }, [
                    createElementVNode("span", {
                      class: normalizeClass($props.decrementIcon)
                    }, null, 2)
                  ], 40, _hoisted_31)), [
                    [_directive_ripple]
                  ])
                ]),
                createElementVNode("div", _hoisted_32, [
                  createElementVNode("span", null, toDisplayString($props.timeSeparator), 1)
                ]),
                createElementVNode("div", _hoisted_33, [
                  withDirectives((openBlock(), createElementBlock("button", {
                    class: "p-link",
                    "aria-label": _ctx.$primevue.config.locale.nextMinute,
                    onMousedown: _cache[29] || (_cache[29] = ($event) => $options.onTimePickerElementMouseDown($event, 1, 1)),
                    onMouseup: _cache[30] || (_cache[30] = ($event) => $options.onTimePickerElementMouseUp($event)),
                    onKeydown: [
                      _cache[31] || (_cache[31] = (...args) => $options.onContainerButtonKeydown && $options.onContainerButtonKeydown(...args)),
                      _cache[33] || (_cache[33] = withKeys(($event) => $options.onTimePickerElementMouseDown($event, 1, 1), ["enter"])),
                      _cache[34] || (_cache[34] = withKeys(($event) => $options.onTimePickerElementMouseDown($event, 1, 1), ["space"]))
                    ],
                    disabled: $props.disabled,
                    onMouseleave: _cache[32] || (_cache[32] = ($event) => $options.onTimePickerElementMouseLeave()),
                    onKeyup: [
                      _cache[35] || (_cache[35] = withKeys(($event) => $options.onTimePickerElementMouseUp($event), ["enter"])),
                      _cache[36] || (_cache[36] = withKeys(($event) => $options.onTimePickerElementMouseUp($event), ["space"]))
                    ],
                    type: "button"
                  }, [
                    createElementVNode("span", {
                      class: normalizeClass($props.incrementIcon)
                    }, null, 2)
                  ], 40, _hoisted_34)), [
                    [_directive_ripple]
                  ]),
                  createElementVNode("span", null, toDisplayString($options.formattedCurrentMinute), 1),
                  withDirectives((openBlock(), createElementBlock("button", {
                    class: "p-link",
                    "aria-label": _ctx.$primevue.config.locale.prevMinute,
                    onMousedown: _cache[37] || (_cache[37] = ($event) => $options.onTimePickerElementMouseDown($event, 1, -1)),
                    onMouseup: _cache[38] || (_cache[38] = ($event) => $options.onTimePickerElementMouseUp($event)),
                    onKeydown: [
                      _cache[39] || (_cache[39] = (...args) => $options.onContainerButtonKeydown && $options.onContainerButtonKeydown(...args)),
                      _cache[41] || (_cache[41] = withKeys(($event) => $options.onTimePickerElementMouseDown($event, 1, -1), ["enter"])),
                      _cache[42] || (_cache[42] = withKeys(($event) => $options.onTimePickerElementMouseDown($event, 1, -1), ["space"]))
                    ],
                    disabled: $props.disabled,
                    onMouseleave: _cache[40] || (_cache[40] = ($event) => $options.onTimePickerElementMouseLeave()),
                    onKeyup: [
                      _cache[43] || (_cache[43] = withKeys(($event) => $options.onTimePickerElementMouseUp($event), ["enter"])),
                      _cache[44] || (_cache[44] = withKeys(($event) => $options.onTimePickerElementMouseUp($event), ["space"]))
                    ],
                    type: "button"
                  }, [
                    createElementVNode("span", {
                      class: normalizeClass($props.decrementIcon)
                    }, null, 2)
                  ], 40, _hoisted_35)), [
                    [_directive_ripple]
                  ])
                ]),
                $props.showSeconds ? (openBlock(), createElementBlock("div", _hoisted_36, [
                  createElementVNode("span", null, toDisplayString($props.timeSeparator), 1)
                ])) : createCommentVNode("", true),
                $props.showSeconds ? (openBlock(), createElementBlock("div", _hoisted_37, [
                  withDirectives((openBlock(), createElementBlock("button", {
                    class: "p-link",
                    "aria-label": _ctx.$primevue.config.locale.nextSecond,
                    onMousedown: _cache[45] || (_cache[45] = ($event) => $options.onTimePickerElementMouseDown($event, 2, 1)),
                    onMouseup: _cache[46] || (_cache[46] = ($event) => $options.onTimePickerElementMouseUp($event)),
                    onKeydown: [
                      _cache[47] || (_cache[47] = (...args) => $options.onContainerButtonKeydown && $options.onContainerButtonKeydown(...args)),
                      _cache[49] || (_cache[49] = withKeys(($event) => $options.onTimePickerElementMouseDown($event, 2, 1), ["enter"])),
                      _cache[50] || (_cache[50] = withKeys(($event) => $options.onTimePickerElementMouseDown($event, 2, 1), ["space"]))
                    ],
                    disabled: $props.disabled,
                    onMouseleave: _cache[48] || (_cache[48] = ($event) => $options.onTimePickerElementMouseLeave()),
                    onKeyup: [
                      _cache[51] || (_cache[51] = withKeys(($event) => $options.onTimePickerElementMouseUp($event), ["enter"])),
                      _cache[52] || (_cache[52] = withKeys(($event) => $options.onTimePickerElementMouseUp($event), ["space"]))
                    ],
                    type: "button"
                  }, [
                    createElementVNode("span", {
                      class: normalizeClass($props.incrementIcon)
                    }, null, 2)
                  ], 40, _hoisted_38)), [
                    [_directive_ripple]
                  ]),
                  createElementVNode("span", null, toDisplayString($options.formattedCurrentSecond), 1),
                  withDirectives((openBlock(), createElementBlock("button", {
                    class: "p-link",
                    "aria-label": _ctx.$primevue.config.locale.prevSecond,
                    onMousedown: _cache[53] || (_cache[53] = ($event) => $options.onTimePickerElementMouseDown($event, 2, -1)),
                    onMouseup: _cache[54] || (_cache[54] = ($event) => $options.onTimePickerElementMouseUp($event)),
                    onKeydown: [
                      _cache[55] || (_cache[55] = (...args) => $options.onContainerButtonKeydown && $options.onContainerButtonKeydown(...args)),
                      _cache[57] || (_cache[57] = withKeys(($event) => $options.onTimePickerElementMouseDown($event, 2, -1), ["enter"])),
                      _cache[58] || (_cache[58] = withKeys(($event) => $options.onTimePickerElementMouseDown($event, 2, -1), ["space"]))
                    ],
                    disabled: $props.disabled,
                    onMouseleave: _cache[56] || (_cache[56] = ($event) => $options.onTimePickerElementMouseLeave()),
                    onKeyup: [
                      _cache[59] || (_cache[59] = withKeys(($event) => $options.onTimePickerElementMouseUp($event), ["enter"])),
                      _cache[60] || (_cache[60] = withKeys(($event) => $options.onTimePickerElementMouseUp($event), ["space"]))
                    ],
                    type: "button"
                  }, [
                    createElementVNode("span", {
                      class: normalizeClass($props.decrementIcon)
                    }, null, 2)
                  ], 40, _hoisted_39)), [
                    [_directive_ripple]
                  ])
                ])) : createCommentVNode("", true),
                $props.hourFormat == "12" ? (openBlock(), createElementBlock("div", _hoisted_40, [
                  createElementVNode("span", null, toDisplayString($props.timeSeparator), 1)
                ])) : createCommentVNode("", true),
                $props.hourFormat == "12" ? (openBlock(), createElementBlock("div", _hoisted_41, [
                  withDirectives((openBlock(), createElementBlock("button", {
                    class: "p-link",
                    "aria-label": _ctx.$primevue.config.locale.am,
                    onClick: _cache[61] || (_cache[61] = ($event) => $options.toggleAMPM($event)),
                    type: "button",
                    disabled: $props.disabled
                  }, [
                    createElementVNode("span", {
                      class: normalizeClass($props.incrementIcon)
                    }, null, 2)
                  ], 8, _hoisted_42)), [
                    [_directive_ripple]
                  ]),
                  createElementVNode("span", null, toDisplayString($data.pm ? _ctx.$primevue.config.locale.pm : _ctx.$primevue.config.locale.am), 1),
                  withDirectives((openBlock(), createElementBlock("button", {
                    class: "p-link",
                    "aria-label": _ctx.$primevue.config.locale.pm,
                    onClick: _cache[62] || (_cache[62] = ($event) => $options.toggleAMPM($event)),
                    type: "button",
                    disabled: $props.disabled
                  }, [
                    createElementVNode("span", {
                      class: normalizeClass($props.decrementIcon)
                    }, null, 2)
                  ], 8, _hoisted_43)), [
                    [_directive_ripple]
                  ])
                ])) : createCommentVNode("", true)
              ])) : createCommentVNode("", true),
              $props.showButtonBar ? (openBlock(), createElementBlock("div", _hoisted_44, [
                createVNode(_component_CalendarButton, {
                  type: "button",
                  label: $options.todayLabel,
                  onClick: _cache[63] || (_cache[63] = ($event) => $options.onTodayButtonClick($event)),
                  class: "p-button-text",
                  onKeydown: $options.onContainerButtonKeydown
                }, null, 8, ["label", "onKeydown"]),
                createVNode(_component_CalendarButton, {
                  type: "button",
                  label: $options.clearLabel,
                  onClick: _cache[64] || (_cache[64] = ($event) => $options.onClearButtonClick($event)),
                  class: "p-button-text",
                  onKeydown: $options.onContainerButtonKeydown
                }, null, 8, ["label", "onKeydown"])
              ])) : createCommentVNode("", true),
              renderSlot(_ctx.$slots, "footer")
            ], 16, _hoisted_3)) : createCommentVNode("", true)
          ]),
          _: 3
        }, 8, ["onAfterEnter", "onAfterLeave", "onLeave"])
      ]),
      _: 3
    }, 8, ["appendTo", "disabled"])
  ], 10, _hoisted_1);
}
function styleInject(css, ref2) {
  if (ref2 === void 0)
    ref2 = {};
  var insertAt = ref2.insertAt;
  if (!css || true) {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
var css_248z = "\n.p-calendar {\n    position: relative;\n    display: inline-flex;\n    max-width: 100%;\n}\n.p-calendar .p-inputtext {\n    flex: 1 1 auto;\n    width: 1%;\n}\n.p-calendar-w-btn .p-inputtext {\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n}\n.p-calendar-w-btn .p-datepicker-trigger {\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n}\n\n/* Fluid */\n.p-fluid .p-calendar {\n    display: flex;\n}\n.p-fluid .p-calendar .p-inputtext {\n    width: 1%;\n}\n\n/* Datepicker */\n.p-calendar .p-datepicker {\n    min-width: 100%;\n}\n.p-datepicker {\n    width: auto;\n    position: absolute;\n    top: 0;\n    left: 0;\n}\n.p-datepicker-inline {\n    display: inline-block;\n    position: static;\n    overflow-x: auto;\n}\n\n/* Header */\n.p-datepicker-header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n}\n.p-datepicker-header .p-datepicker-title {\n    margin: 0 auto;\n}\n.p-datepicker-prev,\n.p-datepicker-next {\n    cursor: pointer;\n    display: inline-flex;\n    justify-content: center;\n    align-items: center;\n    overflow: hidden;\n    position: relative;\n}\n\n/* Multiple Month DatePicker */\n.p-datepicker-multiple-month .p-datepicker-group-container {\n    display: flex;\n}\n.p-datepicker-multiple-month .p-datepicker-group-container .p-datepicker-group {\n    flex: 1 1 auto;\n}\n\n/* DatePicker Table */\n.p-datepicker table {\n    width: 100%;\n    border-collapse: collapse;\n}\n.p-datepicker td > span {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    cursor: pointer;\n    margin: 0 auto;\n    overflow: hidden;\n    position: relative;\n}\n\n/* Month Picker */\n.p-monthpicker-month {\n    width: 33.3%;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    cursor: pointer;\n    overflow: hidden;\n    position: relative;\n}\n\n/* Year Picker */\n.p-yearpicker-year {\n    width: 50%;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    cursor: pointer;\n    overflow: hidden;\n    position: relative;\n}\n\n/*  Button Bar */\n.p-datepicker-buttonbar {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n}\n\n/* Time Picker */\n.p-timepicker {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n.p-timepicker button {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    cursor: pointer;\n    overflow: hidden;\n    position: relative;\n}\n.p-timepicker > div {\n    display: flex;\n    align-items: center;\n    flex-direction: column;\n}\n\n/* Touch UI */\n.p-datepicker-touch-ui,\n.p-calendar .p-datepicker-touch-ui {\n    position: fixed;\n    top: 50%;\n    left: 50%;\n    min-width: 80vw;\n    transform: translate(-50%, -50%);\n}\n";
styleInject(css_248z);
script.render = render;
const primevue_VlEdmuZMOo = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, { ripple: true, locale: pt });
  nuxtApp.vueApp.component("PanelMenu", script$j);
  nuxtApp.vueApp.component("Button", script$i);
  nuxtApp.vueApp.component("DataTable", script$b);
  nuxtApp.vueApp.component("Column", script$4);
  nuxtApp.vueApp.component("Breadcrumb", script$3);
  nuxtApp.vueApp.component("Tree", script$2);
  nuxtApp.vueApp.component("InputText", script$e);
  nuxtApp.vueApp.component("AutoComplete", script$1);
  nuxtApp.vueApp.component("Calendar", script);
  nuxtApp.vueApp.component("InputNumber", script$d);
});
const _plugins = [
  components_plugin_KR1HBZs4kY,
  unhead_3Bi0E2Ktsf,
  vueuse_head_polyfill_I556vu5uhL,
  router_CrWB4n4PyO,
  primevue_VlEdmuZMOo
];
const Fragment = /* @__PURE__ */ defineComponent({
  name: "FragmentWrapper",
  setup(_props, { slots }) {
    return () => {
      var _a;
      return (_a = slots.default) == null ? void 0 : _a.call(slots);
    };
  }
});
const _wrapIf = (component, props, slots) => {
  return { default: () => props ? h(component, props === true ? {} : props, slots) : h(Fragment, {}, slots) };
};
const layouts = {
  admin: () => import("./_nuxt/admin-3641a900.js").then((m) => m.default || m)
};
const LayoutLoader = /* @__PURE__ */ defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    ...{}
  },
  async setup(props, context) {
    const LayoutComponent = await layouts[props.name]().then((r) => r.default || r);
    return () => {
      return h(LayoutComponent, context.attrs, context.slots);
    };
  }
});
const __nuxt_component_0 = /* @__PURE__ */ defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean, Object],
      default: null
    }
  },
  setup(props, context) {
    const injectedRoute = inject("_route");
    const route = injectedRoute === useRoute() ? useRoute$1() : injectedRoute;
    const layout = computed(() => unref(props.name) ?? route.meta.layout ?? "default");
    return () => {
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = route.meta.layoutTransition ?? appLayoutTransition;
      return _wrapIf(Transition, hasLayout && transitionProps, {
        default: () => _wrapIf(LayoutLoader, hasLayout && {
          key: layout.value,
          name: layout.value,
          ...{},
          ...context.attrs
        }, context.slots).default()
      }).default();
    };
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLayout = __nuxt_component_0;
  _push(ssrRenderComponent(_component_NuxtLayout, _attrs, null, _parent));
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../src/app.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const ErrorComponent = /* @__PURE__ */ defineAsyncComponent(() => import("./_nuxt/error-component-f5fbecbb.js").then((r) => r.default || r));
    const IslandRenderer = /* @__PURE__ */ defineAsyncComponent(() => import("./_nuxt/island-renderer-94fcbf67.js").then((r) => r.default || r));
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    provide("_route", useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = callWithNuxt(nuxtApp, showError, [err]);
        onServerPrefetch(() => p);
        return false;
      }
    });
    const { islandContext } = nuxtApp.ssrContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(error)) {
            _push(ssrRenderComponent(unref(ErrorComponent), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(AppComponent), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RootComponent = _sfc_main;
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
let entry;
const plugins = normalizePlugins(_plugins);
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(RootComponent);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (err) {
      await nuxt.hooks.callHook("app:error", err);
      nuxt.payload.error = nuxt.payload.error || err;
    }
    return vueApp;
  };
}
const entry$1 = (ctx) => entry(ctx);
export {
  _wrapIf as _,
  appPageTransition as a,
  appKeepalive as b,
  createError as c,
  useRouter as d,
  entry$1 as default,
  _export_sfc as e,
  useHead as f,
  navigateTo as n,
  useNuxtApp as u
};
//# sourceMappingURL=server.mjs.map
