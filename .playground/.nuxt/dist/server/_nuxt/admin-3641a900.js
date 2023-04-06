import { defineComponent, h, Suspense, nextTick, Transition, computed, provide, reactive, mergeProps, useSSRContext, ref } from "vue";
import { RouterView } from "vue-router";
import { defu } from "defu";
import { u as useNuxtApp, a as appPageTransition, _ as _wrapIf, b as appKeepalive } from "../server.mjs";
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrRenderComponent } from "vue/server-renderer";
import "ofetch";
import "#internal/nitro";
import "hookable";
import "unctx";
import "@unhead/ssr";
import "unhead";
import "@unhead/shared";
import "h3";
import "ufo";
import "destr";
const interpolatePath = (route, match) => {
  return match.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
};
const generateRouteKey = (routeProps, override) => {
  const matchedRoute = routeProps.route.matched.find((m) => {
    var _a;
    return ((_a = m.components) == null ? void 0 : _a.default) === routeProps.Component.type;
  });
  const source = override ?? (matchedRoute == null ? void 0 : matchedRoute.meta.key) ?? (matchedRoute && interpolatePath(routeProps.route, matchedRoute));
  return typeof source === "function" ? source(routeProps.route) : source;
};
const wrapInKeepAlive = (props, children) => {
  return { default: () => children };
};
const __nuxt_component_0 = /* @__PURE__ */ defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs }) {
    const nuxtApp = useNuxtApp();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          if (!routeProps.Component) {
            return;
          }
          const key = generateRouteKey(routeProps, props.pageKey);
          const done = nuxtApp.deferHydration();
          const hasTransition = !!(props.transition ?? routeProps.route.meta.pageTransition ?? appPageTransition);
          const transitionProps = hasTransition && _mergeTransitionProps([
            props.transition,
            routeProps.route.meta.pageTransition,
            appPageTransition,
            { onAfterLeave: () => {
              nuxtApp.callHook("page:transition:finish", routeProps.Component);
            } }
          ].filter(Boolean));
          return _wrapIf(
            Transition,
            hasTransition && transitionProps,
            wrapInKeepAlive(
              props.keepalive ?? routeProps.route.meta.keepalive ?? appKeepalive,
              h(Suspense, {
                onPending: () => nuxtApp.callHook("page:start", routeProps.Component),
                onResolve: () => {
                  nextTick(() => nuxtApp.callHook("page:finish", routeProps.Component).finally(done));
                }
              }, { default: () => h(RouteProvider, { key, routeProps, pageKey: key, hasTransition }) })
            )
          ).default();
        }
      });
    };
  }
});
function _toArray(val) {
  return Array.isArray(val) ? val : val ? [val] : [];
}
function _mergeTransitionProps(routeProps) {
  const _props = routeProps.map((prop) => ({
    ...prop,
    onAfterLeave: _toArray(prop.onAfterLeave)
  }));
  return defu(..._props);
}
const RouteProvider = /* @__PURE__ */ defineComponent({
  name: "RouteProvider",
  // TODO: Type props
  // eslint-disable-next-line vue/require-prop-types
  props: ["routeProps", "pageKey", "hasTransition"],
  setup(props) {
    const previousKey = props.pageKey;
    const previousRoute = props.routeProps.route;
    const route = {};
    for (const key in props.routeProps.route) {
      route[key] = computed(() => previousKey === props.pageKey ? props.routeProps.route[key] : previousRoute[key]);
    }
    provide("_route", reactive(route));
    return () => {
      return h(props.routeProps.Component);
    };
  }
});
const _imports_0 = "data:image/jpeg;base64,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";
const _imports_1 = "" + __buildAssetsURL("user8-128x128.2ca5bfaa.jpg");
const _imports_2 = "data:image/jpeg;base64,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";
const _imports_3 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAACslBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+/v79/f37+/v5+fn////+/v74+PjR0dGioqJ6enpdXV1aWlpbW1uhoaHQ0ND4+Pj6+vq0tLRNTU0AAAAAAAAODg4oKCgpKSlKSkqxsbHe3t5QUFAxMTFDQ0NAQEA9PT06Ojo6OjpAQEAyMjJQUFDc3NzNzc0AAAArKytEREQ5OTk2NjY3NzdEREQqKioAAADFxcXS0tIAAAA+Pj49PT08PDxBQUEAAADMzMzt7e0MDAw4ODg7OzsAAADo6Oj///+CgoI/Pz8LCwt2dnb////a2tpFRUXR0dGSkpI+Pj6FhYX39/dFRUUzMzM5OTkuLi7v7+/e3t4AAABCQkLU1NTKysoAAAA/Pz+8vLy/v7+tra3///+/v783NzeKioqWlpaTk5OUlJSXl5eEhIQuLi6urq43Nzf29vbr6+s3Nzfv7+/8/Pzl5eXw8PDn5+fm5ub////////////////w8PDy8vJxcXF6enp4eHhsbGwyMjIZGRkKCgoPDw8ICAgeHh48PDw7Ozv///////84ODhBQUHAwMBISEg+Pj7x8fEQEBCvr6////+9vb0AAAAdHR0AAADw8PDl5eUAAAAPDw8aGhqrq6v19fXn5+fp6eno6Ojp6en8/Pzo6Ojn5+fz8/P////////////e2BDzAAAA5nRSTlMAAQMEDCpNcI+qwNHh8Pn+JFmSw+j/Ag1Kk9L8+/0HpOmL4ka1Usn6BUfKtolD3pEp1FuMsg7NF90b5BjlzrNcRIor///3+0j+9fDx9PT5+fHx9PPs9v3/////9ejr7////v/+////8uzw+P///v///v/65e38//7+//nr7vX//vfv9+3+//D27f/r7v7y9Pb///j08fv/7/D+//H4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";
const _imports_4 = "" + __buildAssetsURL("user2-160x160.680f6c82.jpg");
const SideBarMenu_vue_vue_type_style_index_0_lang = "";
const _sfc_main$1 = {
  __name: "SideBarMenu",
  __ssrInlineRender: true,
  props: {
    menuItems: {
      type: Array,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(mergeProps({ class: "mt-2" }, _attrs))}><ul class="nav nav-pills nav-sidebar flex-column"><!--[-->`);
      ssrRenderList(__props.menuItems, (item, index) => {
        _push(`<li class="${ssrRenderClass([{ "menu-open": item.isOpen }, "nav-item"])}"><a${ssrRenderAttr("href", item.link)} class="${ssrRenderClass([{ active: item.active }, "nav-link"])}"><i class="${ssrRenderClass(["nav-icon", ...item.iconClasses])}"></i><p>${ssrInterpolate(item.title)} `);
        if (item.subItems) {
          _push(`<i class="right fas fa-angle-left"></i>`);
        } else {
          _push(`<!---->`);
        }
        if (item.badge) {
          _push(`<span class="${ssrRenderClass(["badge", ...item.badgeClasses])}">${ssrInterpolate(item.badge)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</p></a>`);
        if (item.subItems) {
          _push(`<ul style="${ssrRenderStyle(item.isOpen ? null : { display: "none" })}" class="nav nav-treeview pl-3"><!--[-->`);
          ssrRenderList(item.subItems, (subItem, subIndex) => {
            _push(`<li class="nav-item"><a${ssrRenderAttr("href", subItem.link)} class="${ssrRenderClass([{ active: subItem.active }, "nav-link"])}"><i class="${ssrRenderClass(["nav-icon", ...subItem.iconClasses])}"></i><p>${ssrInterpolate(subItem.title)}</p></a></li>`);
          });
          _push(`<!--]--></ul>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ul></nav>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../src/components/SideBarMenu.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const SideBarMenu = _sfc_main$1;
const _sfc_main = {
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    class MenuItem {
      constructor(title, iconClasses, link) {
        this.title = title;
        this.iconClasses = iconClasses;
        this.link = link;
        this.active = false;
        this.subItems = [];
        this.badge = null;
        this.badgeClasses = null;
        this.isOpen = false;
      }
      setActive(active) {
        this.active = active;
        return this;
      }
      addSubItem(subItem) {
        if (subItem instanceof SubMenuItem) {
          this.subItems.push(subItem);
        } else {
          throw new Error("Invalid subItem. Expected instance of SubMenuItem.");
        }
        return this;
      }
      setBadge(badge, badgeClasses) {
        this.badge = badge;
        this.badgeClasses = badgeClasses;
        return this;
      }
    }
    class SubMenuItem {
      constructor(title, iconClasses, link) {
        this.title = title;
        this.iconClasses = iconClasses;
        this.link = link;
        this.active = false;
      }
      setActive(active) {
        this.active = active;
        return this;
      }
    }
    const dashboard = new MenuItem("Dashboard", ["pi", "pi-home"], "#").setActive(true).addSubItem(new SubMenuItem("Dashboard v1", ["pi", "pi-circle-on"], "../../index.html")).addSubItem(new SubMenuItem("Dashboard v2", ["pi", "pi-circle-on"], "../../index2.html")).addSubItem(new SubMenuItem("Dashboard v3", ["pi", "pi-circle-on"], "../../index3.html"));
    const widgets = new MenuItem("Widgets", ["pi", "pi-calculator"], "../widgets.html").setBadge("New", ["badge-danger"]).addSubItem(new SubMenuItem("Dashboard v1", ["pi", "pi-circle-on"], "../../index.html")).addSubItem(new SubMenuItem("Dashboard v2", ["pi", "pi-circle-on"], "../../index2.html")).addSubItem(new SubMenuItem("Dashboard v3", ["pi", "pi-circle-on"], "../../index3.html"));
    const calendar = new MenuItem("Calendar", ["pi", "pi-calendar"], "../calendar.html").setBadge("2", ["badge-info"]).addSubItem(new SubMenuItem("Dashboard v1", ["pi", "pi-circle-on"], "../../index.html")).addSubItem(new SubMenuItem("Dashboard v2", ["pi", "pi-circle-on"], "../../index2.html")).addSubItem(new SubMenuItem("Dashboard v3", ["pi", "pi-circle-on"], "../../index3.html"));
    const kanbanBoard = new MenuItem("Kanban Board", ["pi", "pi-clone"], "../kanban.html");
    const menuItems = ref([dashboard, widgets, calendar, kanbanBoard]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_page = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "wrapper" }, _attrs))}><nav class="main-header navbar navbar-expand navbar-white navbar-light"><ul class="navbar-nav"><li class="nav-item"><a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a></li><li class="nav-item d-none d-sm-inline-block"><a href="../../index3.html" class="nav-link">Home</a></li><li class="nav-item d-none d-sm-inline-block"><a href="#" class="nav-link">Contact</a></li></ul><ul class="navbar-nav ml-auto"><li class="nav-item"><a class="nav-link" data-widget="navbar-search" href="#" role="button"><i class="fas fa-search"></i></a><div class="navbar-search-block"><form class="form-inline"><div class="input-group input-group-sm"><input class="form-control form-control-navbar" type="search" placeholder="Search" aria-label="Search"><div class="input-group-append"><button class="btn btn-navbar" type="submit"><i class="fas fa-search"></i></button><button class="btn btn-navbar" type="button" data-widget="navbar-search"><i class="fas fa-times"></i></button></div></div></form></div></li><li class="nav-item dropdown"><a class="nav-link" data-toggle="dropdown" href="#"><i class="far fa-comments"></i><span class="badge badge-danger navbar-badge">3</span></a><div class="dropdown-menu dropdown-menu-lg dropdown-menu-right"><a href="#" class="dropdown-item"><div class="media"><img${ssrRenderAttr("src", _imports_0)} alt="User Avatar" class="img-size-50 mr-3 img-circle"><div class="media-body"><h3 class="dropdown-item-title"> Brad Diesel <span class="float-right text-sm text-danger"><i class="fas fa-star"></i></span></h3><p class="text-sm">Call me whenever you can...</p><p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> 4 Hours Ago</p></div></div></a><div class="dropdown-divider"></div><a href="#" class="dropdown-item"><div class="media"><img${ssrRenderAttr("src", _imports_1)} alt="User Avatar" class="img-size-50 img-circle mr-3"><div class="media-body"><h3 class="dropdown-item-title"> John Pierce <span class="float-right text-sm text-muted"><i class="fas fa-star"></i></span></h3><p class="text-sm">I got your message bro</p><p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> 4 Hours Ago</p></div></div></a><div class="dropdown-divider"></div><a href="#" class="dropdown-item"><div class="media"><img${ssrRenderAttr("src", _imports_2)} alt="User Avatar" class="img-size-50 img-circle mr-3"><div class="media-body"><h3 class="dropdown-item-title"> Nora Silvester <span class="float-right text-sm text-warning"><i class="fas fa-star"></i></span></h3><p class="text-sm">The subject goes here</p><p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> 4 Hours Ago</p></div></div></a><div class="dropdown-divider"></div><a href="#" class="dropdown-item dropdown-footer">See All Messages</a></div></li><li class="nav-item dropdown"><a class="nav-link" data-toggle="dropdown" href="#"><i class="far fa-bell"></i><span class="badge badge-warning navbar-badge">15</span></a><div class="dropdown-menu dropdown-menu-lg dropdown-menu-right"><span class="dropdown-item dropdown-header">15 Notifications</span><div class="dropdown-divider"></div><a href="#" class="dropdown-item"><i class="fas fa-envelope mr-2"></i> 4 new messages <span class="float-right text-muted text-sm">3 mins</span></a><div class="dropdown-divider"></div><a href="#" class="dropdown-item"><i class="fas fa-users mr-2"></i> 8 friend requests <span class="float-right text-muted text-sm">12 hours</span></a><div class="dropdown-divider"></div><a href="#" class="dropdown-item"><i class="fas fa-file mr-2"></i> 3 new reports <span class="float-right text-muted text-sm">2 days</span></a><div class="dropdown-divider"></div><a href="#" class="dropdown-item dropdown-footer">See All Notifications</a></div></li><li class="nav-item"><a class="nav-link" data-widget="fullscreen" href="#" role="button"><i class="fas fa-expand-arrows-alt"></i></a></li><li class="nav-item"><a class="nav-link" data-widget="control-sidebar" data-slide="true" href="#" role="button"><i class="fas fa-th-large"></i></a></li></ul></nav><aside class="main-sidebar sidebar-dark-primary elevation-4"><a href="../../index3.html" class="brand-link"><img${ssrRenderAttr("src", _imports_3)} alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style="${ssrRenderStyle({ "opacity": ".8" })}"><span class="brand-text font-weight-light">AdminLTE 3</span></a><div class="sidebar"><div class="user-panel mt-3 pb-3 mb-3 d-flex"><div class="image"><img${ssrRenderAttr("src", _imports_4)} class="img-circle elevation-2" alt="User Image"></div><div class="info"><a href="#" class="d-block">Alexander Pierce</a></div></div><div class="form-inline"><div class="input-group" data-widget="sidebar-search"><input class="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search"><div class="input-group-append"><button class="btn btn-sidebar"><i class="fas fa-search fa-fw"></i></button></div></div></div>`);
      _push(ssrRenderComponent(SideBarMenu, { "menu-items": menuItems.value }, null, _parent));
      _push(`</div></aside><div class="content-wrapper"><section class="content-header"><div class="container-fluid"><div class="row mb-2"><div class="col-sm-6"><h1>Blank Page</h1></div><div class="col-sm-6"><ol class="breadcrumb float-sm-right"><li class="breadcrumb-item"><a href="#">Home</a></li><li class="breadcrumb-item active"> Blank Page </li></ol></div></div></div></section><section class="content"><div class="card"><div class="card-header"><h3 class="card-title"> Title </h3><div class="card-tools"><button type="button" class="btn btn-tool" data-card-widget="collapse" title="Collapse"><i class="fas fa-minus"></i></button><button type="button" class="btn btn-tool" data-card-widget="remove" title="Remove"><i class="fas fa-times"></i></button></div></div><div class="card-body">`);
      _push(ssrRenderComponent(_component_nuxt_page, null, null, _parent));
      _push(`</div><div class="card-footer"> Footer </div></div></section></div><footer class="main-footer"><div class="float-right d-none d-sm-block"><b>Version</b> 3.2.0 </div><strong>Copyright © 2014-2021 <a href="https://adminlte.io">AdminLTE.io</a>.</strong> All rights reserved. </footer><aside class="control-sidebar control-sidebar-dark"></aside></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../src/layouts/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=admin-3641a900.js.map
