import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ShardsVue from 'shards-vue'
import Countdown from '@/components/Countdown'

// Import base styles (Bootstrap and Shards)
import 'bootstrap/dist/css/bootstrap.css'
import 'shards-ui/dist/css/shards.css'

Vue.use(ShardsVue);
Vue.use(VueAxios, axios)

Vue.config.productionTip = false
Vue.component('countdown', Countdown)

 const store = Vue.observable({
  username: '' 
});

const mutations = {
  setUsername(login) {
    store.username = login;
  }
};

new Vue({
  router,
  store, mutations,
  render: h => h(App)
}).$mount('#app')
