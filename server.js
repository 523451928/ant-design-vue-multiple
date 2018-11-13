let express = require('express')
let app = express()

app.use(express.static('./dist'))

app.get('/', function(req, res) {
  res.send('Hello Antd')
})
console.log('server is listen at 2333')
app.listen(2333)
