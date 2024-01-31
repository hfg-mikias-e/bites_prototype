import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from "@auth0/auth0-vue";

import Home from '../views/home.vue'
import Callback from '../views/callback.vue'
import Profile from '../views/profile.vue'
import Explore from '../views/explore.vue'
import Category from '../views/category.vue'
import Bookmark from '../views/bookmark.vue'
import Content from '../views/content.vue'
import Done from '../views/done.vue'
import Reminder from '../views/reminder.vue'
import Onboarding from '../views/onboarding.vue'

const routes = [
  {
    path: '/',
    name: 'Onboarding',
    component: Onboarding
  },
  {
    path: '/callback',
    name: 'Callback',
    component: Callback
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    beforeEnter: authGuard
  },
  {
    path: '/explore',
    name: 'Explore',
    component: Explore,
    beforeEnter: authGuard
  },
  {
    path: '/explore/:category',
    name: 'Category',
    component: Category,
    beforeEnter: authGuard
  },
  {
    path: '/bookmark',
    name: 'Bookmark',
    component: Bookmark,
    beforeEnter: authGuard
  },
  {
    path: '/content/:content',
    name: 'Content',
    component: Content,
    props: true,
    beforeEnter: authGuard
  },
  {
    path: '/done/:content',
    name: 'Done',
    component: Done,
    props: true,
    beforeEnter: authGuard
  },
  {
    path: '/reminder/:content',
    name: 'Reminder',
    component: Reminder,
    props: true,
    beforeEnter: authGuard
  },
  /*
  {
    path: '/sip/:content',
    name: 'Sip',
    component: Sip,
    props: true,
    beforeEnter: authGuard
  },
  */
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    beforeEnter: authGuard
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
