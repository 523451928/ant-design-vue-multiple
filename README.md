# ant-design-vue-multiple
ant-design-vue-multiple

## time-picker arguments

| Props | Description | Type | Default |
| ---- | ---- | ---- | ---- |
| value | bind  the time picker value| Object | { HH: '00', mm: '00'} |
| hideClearButton | is hide the clear button | Boolean | true |
| selectTimeType | select time type selectHour => only select hour; selectMinute => only select minute; selectHM => select hour and minute | String | selectHour |
| minuteStart | when only select minute, the minute start number | String or Number | 0 |
| timeRange | when has two time picker,two time picker range | Number | 4 |
| maxTime | use maxTime prop to limit select the max time | Object | {HH: '23', mm: '59'} |
| minTime | use minTime prop to limit select the min time | Object | {HH: '00', mm: '00'} |
| id | when multiple pick use id to distinguish diff component | String | |
| minuteInterval | use minuteInterval to set minute interval | Number | |

