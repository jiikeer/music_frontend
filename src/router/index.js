import { createRouter, createWebHistory } from 'vue-router'
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
        path:"/post/detail/:id",
        name:"PostDetail",
        component:()=>import("@/pages/post/PostDetail.vue")
      },
      {
          path:"/song/detail/:id",
          name:"SongDetail",
          component:()=>import("@/pages/song/SongDetail.vue")
      },
      {
          path:"/artist/:id",
          name:"ArtistDetail",
          component:()=>import("@/pages/artist/ArtistDetail.vue")
      },
      {
          path:"/user-page/:id",
          name:"UserPage",
          component:()=>import("@/pages/artist/ArtistDetail.vue")
      },
      {
        path: '/rank',
        name: 'Rank',
        component: () => import('@/pages/rank/Rank.vue')
      },
      {
        path: '/singer',
        name: 'Singer',
        component: () => import('@/pages/singer/SingerList.vue')
      },
    ]
  },
  {
    path: "/user-personal",
    name: "user-personal",
    meta: { requireAuth: true },
    component: () => import("@/pages/user/UserPersonal.vue")
  },
  {
    path: "/setting",
    name: "setting",
    meta: {
      requireAuth: true
    },
    component: () => import("@/pages/user/UserSetting.vue"),
  },

  {
    path: "/user/post/detail/:id",
    name: "UserPostDetail",
    component: () => import('@/pages/user/UserPostDetail.vue')
  },
  {
    path: "/user/song/detail/:id",
    name: "UserSongDetail",
    component: () => import('@/pages/user/UserSongDetail.vue')
  },
  {
    path: '/admin',
    name: 'admin-layout',
    component: () => import('@/admin/layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/admin/users'
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/admin/views/user/UserManage.vue')
      },
      {
        path: 'songs',
        name: 'admin-songs',
        component: () => import('@/admin/views/song/SongManage.vue')
      },
      {
        path: 'posts',
        name: 'admin-posts',
        component: () => import('@/admin/views/post/PostManage.vue')
      },
      {
        path: 'singer',
        name: 'admin-singer',
        component: () => import('@/admin/views/singer/SingerManage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router