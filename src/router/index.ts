import store from "@/store"
import Vue from "vue"
import VueRouter, { RouteConfig, RouterMode } from "vue-router"
import { component } from 'vue/types/umd'

Vue.use(VueRouter)

const mode: RouterMode = "history"

const routes: RouteConfig[] = [
  {
    path: "/",
    component: () => import("@/layouts/default.vue"),
    children: [
      {
        path: "/",
        component: () => import("@/pages/index.vue")
      },
      {
        path: "/announce",
        component: () => import("@/pages/announce.vue")
      },
      {
        path: "/poll",
        component: () => import("@/pages/poll.vue")
      }
    ]
  },
  {
    path: "/bot-authorize",
    component: () => import("@/pages/auth/bot-authorize.vue"),
  }
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  store.dispatch("clearFlash")
  next()
})

export default router
