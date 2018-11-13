<template>
  <a-locale-provider :locale="zh_CN">
    <div>
      antd demo
      <!-- <a-range-picker @change="onChange"></a-range-picker> -->

      <a-time-picker></a-time-picker>
    </div>
  </a-locale-provider>
</template>

<script>
/* eslint-disable */
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'
export default {
  data () {
    return {
      zh_CN
    }
  },
  methods: {
    onChange (date, dateString) {
      console.log(date)
      console.log(dateString)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
