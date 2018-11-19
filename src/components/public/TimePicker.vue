<template>
  <span class="time-picker" :class="{'hm-time-picker': selectTimeType == 'selectHM'}">
    <input class="display-time" @keydown.down.prevent="nextHover" @keypress.down.prevent="nextHover"
      @keydown.up.prevent="prevHover" @keypress.up.prevent="prevHover" @keyup.enter="confirmSelect" :style="{width: width + 'px'}"
      :class="{active: showDropdown}" :id="id" v-model="displayTime" @click.stop="toggleDropdown" type="text" readonly />
    <span class="icon-juke time-icon">&#xe632;</span>
    <span class="clear-btn" v-if="!hideClearButton" v-show="!showDropdown && showClearBtn" @click.stop="clearTime">&times;</span>
    <div class="time-picker-overlay" v-if="showDropdown" @click.stop="toggleDropdown"></div>
    <div class="dropdown" v-show="showDropdown" transition="fold" :style="{width: width + 'px'}">
      <div class="select-list" :style="{width: width + 'px'}">
        <ul class="hours" :class="'hours' + id" @mousemove="hoverSelect" v-if="selectTimeType == 'selectHour' || selectTimeType == 'selectHM'">
          <li class="hint" v-text="hourType" v-if="!hideHint"></li>
          <li v-for="(hr, index) in hours" :index="index" class="hour"
            :key="index"
            :class="{active: hour === hr, disable: hr > maxHour || hr < minHour, hover: index == hoverHourIndex}" @click.stop="select('hour', hr)">
            {{hr}} <span v-if="selectTimeType == 'selectHour'"> : 00</span>
          </li>
        </ul>
        <ul class="minutes" :class="'minutes' + id" @mousemove="hoverSelect" v-if="selectTimeType == 'selectMinute' || selectTimeType == 'selectHM'">
          <li class="hint" v-text="minuteType" v-if="!hideHint"></li>
          <li v-for="(m, index) in minutes" :index="index" class="minute"
            :key="index"
            :class="{active: minute == m, disable: hour === maxHour && m > maxMinute || hour === minHour && m < minMinute, hover: index == hoverMinuteIndex}" @click.stop="select('minute', m)">
            {{m}}
          </li>
        </ul>
        <ul class="seconds" v-if="secondType">
          <li class="hint" v-text="secondType" v-if="!hideHint"></li>
          <li v-for="s in seconds" v-text="s" :class="{active: second === s}" :key="s" @click.stop="select('second', s)"></li>
        </ul>
        <ul class="apms" v-if="apmType">
          <li class="hint" v-text="apmType" v-if="!hideHint"></li>
          <li v-for="a in apms" v-text="a" :class="{active: apm === a}" :key="a" @click.stop="select('apm', a)"></li>
        </ul>
      </div>
    </div>
  </span>
</template>

<script>
/* eslint-disable */
const CONFIG = {
  HOUR_TOKENS: ['HH', 'H', 'hh', 'h', 'kk', 'k'],
  MINUTE_TOKENS: ['mm', 'm'],
  SECOND_TOKENS: ['ss', 's'],
  APM_TOKENS: ['A', 'a']
}
export default {
  name: 'JukeTimepicker',
  props: {
    value: {type: Object},
    hideClearButton: {
      type: Boolean,
      default: true
    },
    hideHint: {
      type: Boolean,
      default: true
    },
    format: {type: String},
    selectTimeType: {
      type: String,
      default: 'selectMinute' // selectHour 选择小时  selectMinute 选择分钟  selectHM 选择时分
    },
    minuteStart: {
      type: [Number, String],
      default: 0
    },
    timeRange: {
      type: Number,
      default: 4
    },
    maxTime: {
      type: Object,
      default () {
        return {
          HH: '23',
          mm: '59'
        }
      }
    },
    minTime: {
      type: Object,
      default () {
        return {
          HH: '00',
          mm: '00'
        }
      }
    },
    minuteInterval: {type: Number},
    secondInterval: {type: Number},
    id: {type: String},
    width: {
      type: [Number, String],
      default: 120
    }
  },
  data () {
    return {
      hours: [],
      minutes: [],
      seconds: [],
      apms: [],
      showDropdown: false,
      muteWatch: false,
      hourType: 'HH',
      minuteType: 'mm',
      secondType: '',
      apmType: '',
      hour: '',
      minute: '',
      second: '',
      apm: '',
      fullValues: undefined,
      hoverHourIndex: -1,
      hoverMinuteIndex: -1,
      currentHover: ''
    }
  },
  computed: {
    displayTime () {
      let formatString = String((this.format || 'HH:mm'))
      if (this.hour) {
        formatString = formatString.replace(new RegExp(this.hourType, 'g'), this.hour)
      }
      if (this.minute) {
        formatString = this.selectTimeType == 'selectMinute' ? this.minute + '分' : formatString.replace(new RegExp(this.minuteType, 'g'), this.minute)
      }
      if (this.second && this.secondType) {
        formatString = formatString.replace(new RegExp(this.secondType, 'g'), this.second)
      }
      if (this.apm && this.apmType) {
        formatString = formatString.replace(new RegExp(this.apmType, 'g'), this.apm)
      }
      return formatString
    },
    showClearBtn () {
      if ((this.hour && this.hour !== '') || (this.minute && this.minute !== '')) {
        return true
      }
      return false
    },
    maxHour () {
      return this.maxTime.HH
    },
    maxMinute () {
      return this.maxTime.mm
    },
    minHour () {
      return this.minTime.HH
    },
    minMinute () {
      return this.minTime.mm
    }
  },
  watch: {
    'format': 'renderFormat',
    minuteInterval (newInteval) {
      this.renderList('minute', newInteval)
    },
    secondInterval (newInteval) {
      this.renderList('second', newInteval)
    },
    'value': 'readValues',
    'displayTime': 'fillValues',
    maxMinute (newVal) {
      if (this.maxHour < this.hour && newVal > this.minute) {
        this.minute = newVal
      }
    },
    minMinute (newVal) {
      if (this.minHour > this.hour && newVal < this.minute) {
        this.minute = newVal
      }
    }
  },
  methods: {
    hoverSelect (e) {
      let classes = e.target.getAttribute('class')
      let index = e.target.getAttribute('index')
      if (classes && classes.includes('hour')) {
        this.currentHover = 'hourWrapper'
        if (index) this.hoverHourIndex = index
      } else if (classes && classes.includes('minute')) {
        this.currentHover = 'minuteWrapper'
        if (index) this.hoverMinuteIndex = index
      }
    },
    nextHover () {
      if (this.currentHover == 'hourWrapper') {
        this.hoverHourIndex++
        if (this.hoverHourIndex > this.hours.length - 1) {
          this.hoverHourIndex = 0
        }
      }
      if (this.currentHover == 'minuteWrapper') {
        this.hoverMinuteIndex++
        if (this.hoverMinuteIndex > this.minutes.length - 1) {
          this.hoverMinuteIndex = 0
        }
      }
      this.scroll()
    },
    prevHover () {
      if (this.currentHover == 'hourWrapper') {
        this.hoverHourIndex--
        if (this.hoverHourIndex < 0) {
          this.hoverHourIndex = this.hours.length - 1
        }
      }
      if (this.currentHover == 'minuteWrapper') {
        this.hoverMinuteIndex--
        if (this.hoverMinuteIndex < 0) {
          this.hoverMinuteIndex = this.minutes.length - 1
        }
      }
      this.scroll()
    },
    confirmSelect () {
      if (this.selectTimeType == 'selectHM') {
        if (this.currentHover == 'hourWrapper') {
          this.select('hour', this.hours[this.hoverHourIndex])
        } else if (this.currentHover == 'minuteWrapper') {
          this.select('minute', this.minutes[this.hoverMinuteIndex])
        }
      } else {
        if (this.selectTimeType == 'selectHour') {
          this.select('hour', this.hours[this.hoverHourIndex])
        } else {
          this.select('minute', this.minutes[this.hoverMinuteIndex])
        }
      }
    },
    formatValue (type, i) {
      switch (type) {
        case 'H':
        case 'm':
        case 's':
          return String(i)
        case 'HH':
        case 'mm':
        case 'ss':
          return i < 10 ? `0${i}` : String(i)
        case 'h':
        case 'k':
          return String(i + 1)
        case 'hh':
        case 'kk':
          return (i + 1) < 10 ? `0${i + 1}` : String(i + 1)
        default:
          return ''
      }
    },
    checkAcceptingType (validValues, formatString, fallbackValue) {
      if (!validValues || !formatString || !formatString.length) { return '' }
      for (let i = 0; i < validValues.length; i++) {
        if (formatString.indexOf(validValues[i]) > -1) {
          return validValues[i]
        }
      }
      return fallbackValue || ''
    },
    renderFormat (newFormat) {
      newFormat = newFormat || this.format
      if (!newFormat || !newFormat.length) {
        newFormat = 'HH:mm'
      }
      this.hourType = this.checkAcceptingType(CONFIG.HOUR_TOKENS, newFormat, 'HH')
      this.minuteType = this.checkAcceptingType(CONFIG.MINUTE_TOKENS, newFormat, 'mm')
      this.secondType = this.checkAcceptingType(CONFIG.SECOND_TOKENS, newFormat)
      this.apmType = this.checkAcceptingType(CONFIG.APM_TOKENS, newFormat)
      this.renderHoursList()
      this.renderList('minute')
      if (this.secondType) {
        this.renderList('second')
      }
      if (this.apmType) {
        this.renderApmList()
      }
      this.$nextTick(() => {
        this.readValues()
      })
    },
    renderHoursList () {
      const hoursCount = (this.hourType === 'h' || this.hourType === 'hh') ? 12 : 24
      this.hours = []
      for (let i = 0; i < hoursCount; i++) {
        this.hours.push(this.formatValue(this.hourType, i))
      }
    },
    renderList (listType, interval) {
      if (listType === 'second') {
        interval = interval || this.secondInterval
      } else if (listType === 'minute') {
        interval = interval || this.minuteInterval
      } else {
        return
      }
      if (interval === 0) {
        interval = 60
      } else if (interval > 60) {
        window.console.warn('`' + listType + '-interval` should be less than 60. Current value is', interval)
        interval = 1
      } else if (interval < 1) {
        window.console.warn('`' + listType + '-interval` should be NO less than 1. Current value is', interval)
        interval = 1
      } else if (!interval) {
        interval = 1
      }
      if (listType === 'minute') {
        this.minutes = []
      } else {
        this.seconds = []
      }
      for (let i = 0; i < 60; i += interval) {
        if (listType === 'minute') {
          this.minutes.push(this.formatValue(this.minuteType, Number(this.minuteStart) == 1 ? i + 1 : i))
        } else {
          this.seconds.push(this.formatValue(this.secondType, i))
        }
      }
    },
    renderApmList () {
      this.apms = []
      if (!this.apmType) { return }
      this.apms = this.apmType === 'A' ? ['AM', 'PM'] : ['am', 'pm']
    },
    readValues () {
      if (!this.value || this.muteWatch) { return }
      const timeValue = JSON.parse(JSON.stringify(this.value || {}))
      const values = Object.keys(timeValue)
      if (values.length === 0) { return }
      if (values.indexOf(this.hourType) > -1) {
        this.hour = timeValue[this.hourType]
      }
      if (values.indexOf(this.minuteType) > -1) {
        this.minute = timeValue[this.minuteType]
      }
      if (values.indexOf(this.secondType) > -1) {
        this.second = timeValue[this.secondType]
      } else {
        this.second = 0
      }
      if (values.indexOf(this.apmType) > -1) {
        this.apm = timeValue[this.apmType]
      }
      this.fillValues()
    },
    fillValues () {
      let fullValues = {}
      const baseHour = this.hour
      const baseHourType = this.hourType
      const hourValue = baseHour || baseHour === 0 ? Number(baseHour) : ''
      const baseOnTwelveHours = this.isTwelveHours(baseHourType)
      const apmValue = (baseOnTwelveHours && this.apm) ? String(this.apm).toLowerCase() : false
      CONFIG.HOUR_TOKENS.forEach((token) => {
        if (token === baseHourType) {
          fullValues[token] = baseHour
          return
        }
        let value
        let apm
        switch (token) {
          case 'H':
          case 'HH':
            if (!String(hourValue).length) {
              fullValues[token] = ''
              return
            } else if (baseOnTwelveHours) {
              if (apmValue === 'pm') {
                value = hourValue < 12 ? hourValue + 12 : hourValue
              } else {
                value = hourValue % 12
              }
            } else {
              value = hourValue % 24
            }
            fullValues[token] = (token === 'HH' && value < 10) ? `0${value}` : String(value)
            break
          case 'k':
          case 'kk':
            if (!String(hourValue).length) {
              fullValues[token] = ''
              return
            } else if (baseOnTwelveHours) {
              if (apmValue === 'pm') {
                value = hourValue < 12 ? hourValue + 12 : hourValue
              } else {
                value = hourValue === 12 ? 24 : hourValue
              }
            } else {
              value = hourValue === 0 ? 24 : hourValue
            }
            fullValues[token] = (token === 'kk' && value < 10) ? `0${value}` : String(value)
            break
          case 'h':
          case 'hh':
            if (apmValue) {
              value = hourValue
              apm = apmValue || 'am'
            } else {
              if (!String(hourValue).length) {
                fullValues[token] = ''
                fullValues.a = ''
                fullValues.A = ''
                return
              } else if (hourValue > 11) {
                apm = 'pm'
                value = hourValue === 12 ? 12 : hourValue % 12
              } else {
                if (baseOnTwelveHours) {
                  apm = ''
                } else {
                  apm = 'am'
                }
                value = hourValue % 12 === 0 ? 12 : hourValue
              }
            }
            fullValues[token] = (token === 'hh' && value < 10) ? `0${value}` : String(value)
            fullValues.a = apm
            fullValues.A = apm.toUpperCase()
            break
        }
      })
      if (this.minute || this.minute === 0) {
        const minuteValue = Number(this.minute)
        fullValues.m = String(minuteValue)
        fullValues.mm = minuteValue < 10 ? `0${minuteValue}` : String(minuteValue)
      } else {
        fullValues.m = ''
        fullValues.mm = ''
      }
      if (this.second || this.second === 0) {
        const secondValue = Number(this.second)
        fullValues.s = String(secondValue)
        fullValues.ss = secondValue < 10 ? `0${secondValue}` : String(secondValue)
      } else {
        fullValues.s = ''
        fullValues.ss = ''
      }
      this.fullValues = fullValues
      this.updateTimeValue(fullValues)
      this.$emit('change', {data: fullValues})
    },
    updateTimeValue (fullValues) {
      this.muteWatch = true
      const self = this
      const baseTimeValue = JSON.parse(JSON.stringify(this.value || {}))
      let timeValue = {}
      Object.keys(baseTimeValue).forEach((key) => {
        timeValue[key] = fullValues[key]
      })
      this.$emit('input', timeValue)
      this.$nextTick(() => {
        self.muteWatch = false
      })
    },
    isTwelveHours (token) {
      return token === 'h' || token === 'hh'
    },
    scroll () {
      this.$nextTick(() => {
        let hourDom = document.querySelector(`.hours${this.id}`)
        let minuteDom = document.querySelector(`.minutes${this.id}`)
        if (hourDom) {
          hourDom.scrollTop = 30 * (this.hours[this.hoverHourIndex] - 3)
        }
        if (minuteDom) {
          let step = Number(this.minuteStart) == 1 ? 4 : 3
          minuteDom.scrollTop = 30 * (this.minutes[this.hoverMinuteIndex] - step)
        }
        // this.popperInstance.update()
      })
    },
    toggleDropdown () {
      this.showDropdown = !this.showDropdown
      this.hoverHourIndex = this.hours.findIndex(i => i == this.hour)
      this.hoverMinuteIndex = this.minutes.findIndex(i => i == this.minute)
      if (this.showDropdown) {
        this.scroll()
      } else {
        this.$emit('change', {data: this.fullValues})
      }
    },
    select (type, value) {
      if (this.selectTimeType != 'selectHM') {
        this.showDropdown = false
      }
      if (type === 'hour') {
        if (value > this.maxHour || value < this.minHour) {
          return
        }
        this.hour = value
        if (this.hour === this.maxHour && this.minute > this.maxMinute) {
          this.minute = this.maxMinute
        }
        if (this.hour === this.minHour && this.minute < this.minMinute) {
          this.minute = this.minMinute
        }
      } else if (type === 'minute') {
        if (this.hour === this.maxHour && value > this.maxMinute || this.hour === this.minHour && value < this.minMinute) {
          return
        }
        this.minute = value
      } else if (type === 'second') {
        this.second = value
      } else if (type === 'apm') {
        this.apm = value
      }
    },
    clearTime () {
      this.hour = ''
      this.minute = ''
      this.second = ''
      this.apm = ''
    }
  },
  mounted () {
    this.renderFormat()
    if (this.selectTimeType == 'selectHour') {
      this.currentHover = 'hourWrapper'
    } else {
      this.currentHover = 'minuteWrapper'
    }
    // let refrence = document.querySelector('.display-time')
    // let popper = document.querySelector('.dropdown')
    // this.popperInstance = new Popper(refrence, popper, {
    //   placement: 'bottom',
    //   offsetDirection: 'top',
    //   offset: -1,
    // })
    document.addEventListener('keydown', (e) => {
      if (e.keyCode == 27) {
        this.showDropdown = false
      }
    })
  }
}
</script>

<style lang="scss" scoped>

.time-picker {
  display: inline-block;
  position: relative;
  font-size: 1em;
  font-family: sans-serif;
  vertical-align: middle;
  bottom: 4px;
}

.time-picker * {
  box-sizing: border-box;
}

.time-picker input.display-time {
  border: 1px solid #e7e7e7;
  box-sizing: border-box;
  text-indent: 20px;
  width: 120px;
  height: 30px;
  padding: 0.3em 0.5em;
  margin: 0;
  font-size: 12px;
}

.time-picker input.active {
  border: 1px solid #00bf8f;
}

.time-picker .clear-btn {
  position: absolute;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  top: 0;
  right: 0;
  bottom: 0;
  margin-top: -0.15em;
  z-index: 3;
  font-size: 1.1em;
  line-height: 1em;
  vertical-align: middle;
  width: 1.3em;
  color: #d2d2d2;
  background: rgba(255,255,255,0);
  text-align: center;
  font-style: normal;

  -webkit-transition: color .2s;
  transition: color .2s;
}
.time-picker .time-icon {
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  font-size: 16px;
  color: #cccccc;
  margin-top: 1px;
}
.time-picker .clear-btn:hover {
  color: #797979;
  cursor: pointer;
}

.time-picker .time-picker-overlay {
  z-index: 2;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.time-picker .dropdown {
  position: absolute;
  z-index: 5;
  top: 29px;
  left: 0;
  background: #fff;
  // box-shadow: 0 1px 6px rgba(0,0,0,0.15);
  width: 120px;
  height: 210px;
  font-weight: normal;
  border: 1px solid #00bf8f;
}

.time-picker .dropdown .select-list {
  width: 120px;
  height: 210px;
  overflow: hidden;
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  justify-content: space-between;
}

.time-picker .dropdown ul {
  padding: 0;
  margin: 0;
  list-style: none;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;

}

.time-picker .dropdown ul.minutes,
.time-picker .dropdown ul.seconds,
.time-picker .dropdown ul.apms{
  border-left: 1px solid #fff;
}

.time-picker .dropdown ul li {
  text-align: left;
  line-height: 30px;
  color: #333333;
  padding-left: 10px;
  font-size: 12px;
}

// .time-picker .dropdown ul li:not(.hint):hover {
//   background: #f5f8fb;
//   color: #333333;
//   cursor: pointer;
// }

// .hm-time-picker .dropdown ul li:not(.hint):hover {
//   background: #f5f8fb;
//   color: #333;
//   cursor: pointer;
// }

.time-picker .dropdown ul .hover {
  background: #f5f8fb;
  color: #333333;
  cursor: pointer;
}

.time-picker .dropdown ul li.active,
.time-picker .dropdown ul li.active:hover {
  background: #00bf8f;
  color: #fff;
}

.time-picker .dropdown ul li.disable {
  cursor: not-allowed !important;
  background: #b0b0b0;
}
.time-picker .dropdown ul li.disable:hover {
  background: #b0b0b0;
}

.time-picker .dropdown .hint {
  color: #a5a5a5;
  cursor: default;
  font-size: 0.8em;
}

::-webkit-scrollbar-track-piece {
    border-radius: 0;
}

::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-thumb {
    height: 20px;
    background-color: #e2e2e2;
    -webkit-border-radius: 4px;
    outline-offset: -2px;
    border: 2px solid #e0e0e0;
}

::-webkit-scrollbar-thumb:hover {
    height: 50px;
    background-color: #999;
    border-radius: 4px;
}
// .fold-transition{
//     transition: height .3s ease;
//     height: 260px;
//     z-index: 1;
//     top: 30px;
//     width: 100%;
//     box-sizing: border-box;
//     overflow: hidden;
// }
// .fold-enter,.fold-leave{
//     height: 0 !important;
// }
</style>
