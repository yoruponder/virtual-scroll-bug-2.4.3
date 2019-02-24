<template>
<div class="txt-center">
  <p class="mxfs">
    Here is Nuxt 2.4.3<br>
    vue-virtual-scroll-list 存在offset設置定位不准問題<br>
  </p>
  <p class="b1fs blue" style="text-align:left;margin-top:.5rem;">
    重現步驟：<br>
    1.點擊右側的字母定位相關欄位<br>
    2.觀察列表的欄位變化，1.4.5版本定位正常，2.4.3定位不正常<br>
    ps: 猜測根本原因是vue版本更新改動造成
  </p>
  <p class="mxfs" style="margin-top:.5rem;">
    <nuxt-link class="orange" to="/game/mobile">bug入口</nuxt-link>
  </p>
</div>
  
</template>

<script>

export default {
  data() {
    return {
      
    }
  },
  mounted() {
    
  }
}
</script>
