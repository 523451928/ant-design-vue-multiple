<template>
  <div class="bg">
    登录{{count}}
    <!-- <img src="~assets/imgs/bg.jpg" alt=""> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {

    }
  },
  computed: {
    ...mapState([
      'count'
    ])
  }
}
</script>

<style lang="scss" scoped>
.bg{
  height: 100px;
  width: 100%;
  background: url('../assets/imgs/bg.jpg');
}
</style>
