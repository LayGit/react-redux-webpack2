import { App, Dashboard } from '../views'

export const routes = [
  {
    component: App,
    routes: [
      {
        path: '/',
        exact: true,
        component: Dashboard
      }
    ]
  }
]
