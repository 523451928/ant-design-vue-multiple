<template>
  <div class="cube-loading">
    <span class="cube-loading-spinners" :style="style">
      <i class="cube-loading-spinner" v-for="item in balde"></i>
    </span>
  </div>
</template>
<script type="text/ecmascript-6">
  /* eslint-disable */
  const COMPONENT_NAME = 'cube-loading'

  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        balde: 12
      }
    },
    props: {
      size: {
        type: Number
      }
    },
    computed: {
      style() {
        if (!this.size) {
          return
        }
        const value = `${this.size}px`
        return {
          width: value,
          height: value
        }
      }
    }
  }
</script>


<style lang="scss" scoped>
.cube-loading {
  font-size: 24px;
  .cube-loading-spinners {
    position: relative;
    display: block;
    width: 1em;
    height: 1em;
    .cube-loading-spinner {
      position: absolute;
      left: 44.5%;
      top: 37%;
      width: 2px;
      height: 25%;
      border-radius: 50% 20%;
      opacity: .25;
      background-color: currentColor;
      animation: spinner-fade 1s linear infinite;
      @for $i from 1 through 12 {
        &:nth-child(#{$i}) {
          animation-delay: (($i - 1) / 12) + s;
          transform: rotate(30deg * ($i - 6)) translateY(-150%);
        }
      }
    }
  }
  @keyframes spinner-fade {
    0% {
      opacity: .85;
    }
    50% {
      opacity: .25;
    }
    100% {
      opacity: .25;
    }
  }
}
</style>
