const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        name: "dashboard",
      },
      {
        path: "login",
        component: () => import("pages/LoginPage.vue"),
        name: "login",
      },
      {
        path: "treinos",
        component: () => import("pages/ExercisesPage.vue"),
        name: "treinos",
      },
    ],
  },
  {
    path: "/unauthorized",
    component: () => import("pages/ErrorUnauthorized.vue"),
    name: "unauthorized",
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
