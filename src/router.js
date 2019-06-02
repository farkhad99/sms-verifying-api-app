import Vue          from 'vue'
import Router       from 'vue-router'
import Home         from './views/Home.vue'
import About        from './views/About.vue'
import Contacts     from './views/Contacts.vue'
import Instructions from './views/Instructions.vue'
import Login        from './views/Login.vue'
import SmsReceive   from './views/SmsReceive.vue'
import Register  from './views/Register.vue'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
     {
      path: '/sms-receive',
      name: 'sms-receive',
      component: SmsReceive,
       meta: { 
                 requiresAuth: true
            }
    },
     {
      path: '/contacts',
      name: 'contacts',
      component: Contacts
    },
     {
      path: '/Instructions',
      name: 'instructions',
      component: Instructions
    },
      {
      path: '/login',
      name: 'login',
      component: Login,
       meta: { 
                guest: true
            }
    },
     {
      path: '/register',
      name: 'register',
      component: Register,
       meta: { 
                guest: true
            }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth)) {
        if (localStorage.getItem('jwt') == null) {
            next({
                path: '/login',
                params: { nextUrl: to.fullPath }
            })
        } else {
            let user = JSON.parse(localStorage.getItem('user-sms-service'))
            if(to.matched.some(record => record.meta.is_admin)) {
                if(user.is_admin == 1){
                    next()
                }
                else{
                    next({ name: 'sms-receive'})
                }
            }else {
                next()
            }
        }
    } else if(to.matched.some(record => record.meta.guest)) {
        if(localStorage.getItem('jwt') == null){
            next()
        }
        else{
            next({ name: 'sms-receive'})
        }
    }else {
        next() 
    }
})


export default router