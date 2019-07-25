import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from "./components/HelloWorld";
import CollapsibleTree from "./components/CollapsibleTree";
// import Home from './views/Home.vue'

Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/plants', component: CollapsibleTree
    },
    {
      path: '/home', component: HelloWorld
    }
  ]
})
