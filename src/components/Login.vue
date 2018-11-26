<template>
  <!-- <div class="bg">
    登录{{count}}
    <img src="~assets/imgs/bg.jpg" alt="">
    <time-picker :format="timeFormat" id="start" select-time-type="selectHour" :value="timeDataStart" @change="changeStartTime">></time-picker>
  </div> -->
  <div class="view-wrapper">
    <cube-recycle-list class="list" :size="size" :on-fetch="onFetch" :offset="offset">
      <template slot="item" slot-scope="{ data }">
        <div :id="data.id" class="item" @click="handleClick(data)">
          <div class="avatar" :style="{backgroundImage: 'url(' + (data.avatar || '') + ')'}"></div>
          <div class="bubble">
            <p>{{data.id}} {{ data.msg }}</p>
            <div class="meta">
              <time class="posted-date">{{ data.time }}</time>
            </div>
          </div>
        </div>
      </template>
      <template slot="noMore">
        <div>没有更多了</div>
      </template>
    </cube-recycle-list>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState } from 'vuex'
import TimePicker from 'components/public/TimePicker'
import CubeRecycleList from 'components/public/RecycleList'
export default {
  data () {
    return {
      timeFormat: 'HH:mm',
      timeDataStart: {
        HH: '10',
        mm: '00'
      },
      size: 20,
      offset: 100,
      index: 0
    }
  },
  methods: {
    changeStartTime(data) {
      console.log(data)
    },
    onFetch() {
      let items = []
      return new Promise((resolve) => {
        // 模拟请求 50 条数据，因为 size 设置为 50
        setTimeout(() => {
          for (let i = 0; i < 10; i++) {
            items.push({
              id: this.index + i,
              avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/danpliego/128.jpg',
              msg: '123',
              time: new Date(Math.floor(i * this.size * 1000 + Math.random() * this.size * 1000)).toString()
            })
          }
          this.index += 20
          if (this.index > 100) {
            return resolve()
          }
          resolve(items)
        }, 1000)
      })
    },
    handleClick(data) {
      console.log(data)
    }
  },
  components: {
    TimePicker,
    CubeRecycleList
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
.avatar{
  width: 50px;
  height: 50px;
  background: #f5f5f5;
}
.view-wrapper{
  position: fixed;
  top: 0px;
  left: 0;
  bottom: 0;
  width: 100%;
}

</style>
