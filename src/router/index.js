import { createRouter, createWebHistory } from 'vue-router'
import { useConfigureStore } from '@/store/configure'
const routes = [
  {
    path: '/',
    name: "music-app-layout",
    component: () => import("@/components/layouts/MusicAppLayout.vue"),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/home/HomePage.vue')
      },
      {
        path: 'song-list',
        name: 'song-list',
        component: () => import('@/pages/songList/songList.vue')
      },
      {
        path: 'community',
        name: 'community',
        component: () => import('@/pages/community/communityPage.vue')
      },
      {
        path:'upload',
        name:'upload',
        component: () => import('@/pages/upload/uploadPage.vue')
      },
      {
        path: 'search',
        name: 'search',
        component: () => import('@/pages/search/searchPage.vue')
      },
      {
        path: 'sign-in',
        name: 'sign-in',
        component: () => import('@/pages/signIn/signIn.vue')
      },
      {
        path:'sign-up',
        name:'sign-up',
        component: () => import('@/pages/signUp/signUp.vue')
      },
      {
        path: "personal-data",
        name: "personal-data",
        component: () => import("@/pages/user/PersonalData.vue"),
      },
      {
        path: "setting",
        name: "setting",
        meta: {
          requireAuth: true,
        },
        component: () => import("@/pages/user/UserSetting.vue"),
        children: [
          {
            path: "PersonalData",
            name: "personalData",
            meta: {
              requireAuth: true,
            },
            component: () => import("@/pages/user/PersonalData.vue"),
          }
        ]
     }
    ]
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const store = useConfigureStore()
  const token = store.token

  // 未登录 且 目标不是登录页 → 强制跳登录页
  if (!token && to.path !== '/sign-in') {
    return next('/sign-in')
  }
  // 已登录还访问登录页 → 跳首页
  if (token && to.path === '/sign-in') {
    return next('/')
  }
  next()
})

export default router