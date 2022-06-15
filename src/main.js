import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/core/lazy_lib/components_use'
// import bootstrap from './core/bootstrap'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')

import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

Vue.config.productionTip = false;

Vue.filter("imgPre", (path) => {
  if (path) {
    if(path && (path.indexOf("http://") > -1 || path.indexOf("https://") > -1)) {
      return path;
    } else {
      return constant.imgPre + path;
    }
  } else {
    return '/images/demo.png'
  }
})

new Vue({
  router,
  store,
  // created: bootstrap,
  render: h => h(App)
}).$mount('#app')

Vue.mixin({
  data() {
    return {
      
    }
  },
  computed: {
    
  },
  watch: {
    
  },
  methods: {
    
  },
})
