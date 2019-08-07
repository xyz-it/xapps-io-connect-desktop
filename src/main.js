import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import { xAppsSettings } from 'xapps-io-core-api'

Vue.config.productionTip = false
xAppsSettings.sapBackendConnection.host = "xyzsap01.xapps.io"
xAppsSettings.sapBackendConnection.user = "xyz"
xAppsSettings.sapBackendConnection.password = "xyzS@p01"
xAppsSettings.sapBackendConnection.client = 100

xAppsSettings.sapBackendConnection.rfc.port = 8443

xAppsSettings.sapOdataConnection.host = "xyzsap01.xapps.io"
xAppsSettings.sapOdataConnection.user = "xyz"
xAppsSettings.sapOdataConnection.password = "xyzS@p01"
xAppsSettings.sapOdataConnection.client = 100


new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')