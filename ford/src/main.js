import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import request from "@/utils/request";
import JsonExcel from 'vue-json-excel'


Vue.component('downloadExcel', JsonExcel)
Vue.config.productionTip = false
Vue.use(ElementUI);


Vue.prototype.request= request
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
