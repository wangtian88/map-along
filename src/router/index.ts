import type { App } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { basicRoutes } from './routes/index'

// app router
export const router = createRouter({
  history: createWebHashHistory(),
  routes: basicRoutes,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

// 设置标题
router.afterEach(to => {
  document.title = to.meta.title as string
})

router.beforeEach(async (to, from, next) => {
  console.log('from-----', from)
  console.log('to-----', to)

  next()
})

// config router
export function setupRouter(app: App<Element>) {
  app.use(router)
}
