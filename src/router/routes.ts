import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', name: 'top', component: () => import('pages/TopPage.vue') }],
  },
  { // Auth Routes
    path: '/auth',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requireAuth: false },
    children: [
      { path: 'login', name: 'login', component: () => import('src/pages/auth/LoginPage.vue') },
      { path: 'signup', name: 'signup', component: () => import('src/pages/auth/SignupPage.vue') },
      { path: 'emailverify', name: 'emailverify', component: () => import('src/pages/auth/EmailVerifyPage.vue') },
      { path: 'twofactor', name: 'twofactor', component: () => import('src/pages/auth/TwoFactorChallengePage.vue') }
    ]
  },
  { // Password Routes
    path: '/password',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requireAuth: false },
    children: [
      { path: 'remind', name: 'password.remind', component: () => import('src/pages/auth/PasswordRemindPage.vue') },
      { path: 'reset', name: 'password.reset', component: () => import('src/pages/auth/PasswordResetPage.vue') }
    ]
  },
  { // User Routes
    path: '/user',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requireAuth: true },
    children: [
      { path: 'home', name: 'home', component: () => import('src/pages/user/HomePage.vue') },
      { path: 'profile', name: 'profile', component: () => import('src/pages/user/ProfilePage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
