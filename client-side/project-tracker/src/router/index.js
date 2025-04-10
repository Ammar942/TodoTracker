import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    path: "/",
    component: () => import("../layouts/HeaderLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("../views/HomeView.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/projects",
        component: () => import("../views/HomeView.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/projects/:id",
        component: () => import("../views/ProjectDetailsView.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/add-project",
        component: () => import("../views/AddprojectView.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/add-task",
        component: () => import("../views/AddtaskView.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/:pathMatch(.*)*",
        component: () => import("../views/NotFoundView.vue"),
      },
    ],
  },
  { path: "/signup", component: () => import("../views/SignupView.vue") },
  { path: "/login", component: () => import("../views/LoginView.vue") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");
  if (to.path == "/login" && isAuthenticated) {
    next("/");
  }
  if (to.path == "/signup" && isAuthenticated) {
    next("/");
  }
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});
export default router;
