import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
// import { xAppsSettings } from 'xapps-io-core-api'
import { xapps_init } from "./xapps.private";

Vue.config.productionTip = false

xapps_init()


new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')