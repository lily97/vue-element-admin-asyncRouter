import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";
import {error404} from './router'
import Layout from "@/layout"; // 引入Layout
const _import = require("@/router/_import_" + process.env.NODE_ENV); // 引入获取组件的方法

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();

  if (hasToken) {
    if (to.path === "/login") {
      // if is logged in, redirect to the home page
      next({ path: "/" });
      NProgress.done();
    } else {
      const hasGetUserInfo = store.getters.name;
      if (hasGetUserInfo) {
        next();
      } else {
        try {
          // get user info
          await store.dispatch("user/getInfo");
          // **在这里做动态路由**
          if (store.getters.menus.length < 1) {
            global.antRouter = [];
            next();
          }
          const menus = filterAsyncRouter(store.getters.menus); // 过滤路由
          router.addRoutes([...menus,error404]); // 动态添加路由 把404放到最后面 防止刷新页面的时候跳转404页面
          global.antRouter = menus; // 将路由数据传递给全局变量，做侧边栏菜单渲染工作
          next({ ...to, replace: true });
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch("user/resetToken");
          Message.error(error || "Has Error");
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

function filterAsyncRouter(asyncRouterMap) {
  let arr = [];
  let father = {};
  let children = {};
  asyncRouterMap.forEach((item) => {
    // 判断是否有子级
    if (item.children && item.children.length) {
      // 处理父级
      father = {
        path: "/" + item.path,
        component: Layout,
        redirect: "/" + item.path + "/" + item.children[0].path,
        name: item.meta.title,
        meta: { title: item.meta.title, icon: item.meta.icon },
        children: [],
      };
      // 处理子级
      item.children.forEach((ele) => {
        children = {
          path: ele.path,
          name: ele.meta.title,
          // component: () => import('@/views/' + ele.path + '/index'),
          // component: _import(ele.path), // 动态写法 避免无法进入到页面的情况

          component: _import(ele.component), // 动态写法 避免无法进入到页面的情况
          meta: { title: ele.meta.title, icon: ele.meta.icon },
        };
        father.children.push(children);
      });
    } else {
      // 如果没有子级  直接处理父级
      father = {
        path: "/" + item.path,
        component: Layout,
        children: [
          {
            path: "",
            name: item.meta.title,
            // component: () => import('@/views/' + item.path + '/index'),
            component: _import(item.path), // 动态写法 避免无法进入到页面的情况
            meta: { title: item.meta.title, icon: item.meta.icon },
          },
        ],
      };
    }
    arr.push(father);
  });
  return arr;
}

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
