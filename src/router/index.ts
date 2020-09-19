import Vue from "vue"
import VueRouter, { RouteConfig, RouterMode } from "vue-router"

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
  }
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
})

export default router
