import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/home.vue'
import Callback from '../views/callback.vue'
import Content from '../views/content.vue'
import Done from '../views/done.vue'
import Reminder from '../views/reminder.vue'

const routes = [
  {
    path: '/callback',
    name: 'Callback',
    component: Callback
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/content/:content',
    name: 'Content',
    component: Content,
    props: true
  },
  {
    path: '/done/:content',
    name: 'Done',
    component: Done,
    props: true
  },
  {
    path: '/reminder/:content',
    name: 'Reminder',
    component: Reminder,
    props: true
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
