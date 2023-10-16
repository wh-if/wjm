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
      meta: {
        title: "登录"
      },
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
            needLogin: true,
            title: "主页"
          },
          component: () => import("../views/Mine/index.vue")
        },
        {
          path: "/edit/:surveyId",
          name: "edit",
          meta: {
            needLogin: true,
            title: "编辑"
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
                needLogin: true,
                title: "统计概览"
              },
              component: () => import("../views/Stat/Overview/index.vue")
            },
            {
              path: "/stat/detail",
              name: "detail",
              meta: {
                needLogin: true,
                title: "统计详情"
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
      meta: {
        title: "填写问卷"
      },
      component: () => import("../views/AnswerView.vue")
    },
    {
      path: "/a/:surveyId/:answerId",
      name: "answer-review",
      meta: {
        needLogin: true,
        title: "详情"
      },
      component: () => import("../views/AnswerView.vue")
    },
    {
      path: "/result",
      name: "result",
      meta: {
        title: "提交结果"
      },
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

router.afterEach((to) => {
  if (document) {
    document.title = `${to.meta.title as string} | 问卷猫`;
  }
});
export default router;
