<template>
  <a-config-provider class="1234" :locale="locale">
    <div id="app" style="height: 100%;">
      <router-view v-if="isRouterAlive" />
    </div>
  </a-config-provider>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

import Utils from '@/core/utils.js'

export default {
  data() {
    return {
      locale: zhCN,
      isRouterAlive: true
    }
  },
  mounted () {
    Utils.visualFontSizeAdjust(document, window)
  },
  methods: {
    
  }
}
</script>
<style lang="less">
@import './style/common.less';
#app::-webkit-scrollbar { display: none; }
#app { -ms-overflow-style: none; }
#app { overflow: -moz-scrollbars-none; }
#app { scrollbar-width: none; }
#app {
  min-width: 1280px; //最小宽度1280
}
// 屏幕宽度小于1329px的时候，可以滚动
@media screen and (max-width: 1329px) {
  #app {
    overflow: auto;
    height: auto; 
    position: relative;
  }
}
</style>
