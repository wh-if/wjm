import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useUserStore } from "@/stores/user";
import { ElMessageBox } from "element-plus";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue")
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue")
    },
    {
      path: "/",
      component: () => import("../views/MainLayout.vue"),
      children: [
        {
          path: "/mine",
          name: "mine",
          meta: {
            needLogin: true
          },
          component: () => import("../views/Mine/index.vue")
        },
        {
          path: "/edit",
          name: "edit",
          meta: {
            needLogin: true
          },
          component: () => import("../views/Edit/index.vue")
        },
        {
          path: "/edit",
          name: "edit",
          meta: {
            needLogin: true
          },
          component: () => import("../views/Edit/index.vue")
        },
      ]
    }
  ]
});
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.meta.needLogin && !userStore.user.token) {
    ElMessageBox.confirm("请先登录！", "提示", {
      showCancelButton: false,
      confirmButtonText: "确认"
    })
      .then(() => {
        router.push("/login");
        // next()
      })
      .catch(() => {
        // router.back()
      });
  } else {
    next();
  }
});
export default router;
