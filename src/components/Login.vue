<template>
  <div class="bg">
    登录{{count}}
    <!-- <img src="~assets/imgs/bg.jpg" alt=""> -->
    <time-picker :format="timeFormat" id="start" select-time-type="selectHour" :value="timeDataStart" @change="changeStartTime">></time-picker>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState } from 'vuex'
import TimePicker from 'components/public/TimePicker'
export default {
  data () {
    return {
      timeFormat: 'HH:mm',
      timeDataStart: {
        HH: '10',
        mm: '00'
      },
    }
  },
  methods: {
    changeStartTime(data) {
      console.log(data)
    }
  },
  components: {
    TimePicker
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
