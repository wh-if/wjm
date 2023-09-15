import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";
import { ElMessageBox } from "element-plus";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: "/login"
    },
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
          path: "/stat",
          name: "stat",
          meta: {
            needLogin: true
          },
          component: () => import("../views/Stat/index.vue"),
          children: [
            {
              path: "/stat/overview",
              alias: "/stat/",
              name: "overview",
              meta: {
                needLogin: true
              },
              component: () => import("../views/Stat/Overview/index.vue")
            },
            {
              path: "/stat/detail",
              name: "detail",
              meta: {
                needLogin: true
              },
              component: () => import("../views/Stat/Detail/index.vue")
            }
          ]
        }
      ]
    },
    {
      path: "/s/:surveyId",
      name: "answer",
      component: () => import("../views/AnswerView.vue")
    },
    {
      path: "/a/:surveyId/:answerId",
      name: "answer-result",
      component: () => import("../views/AnswerView.vue")
    },
    {
      path: "/result",
      name: "result",
      component: () => import("../views/ResultView.vue")
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
