var server = require('./server/main')
// start server
const port = process.env.PORT || 4011
serverInfo = server.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.log('Case Manager Portal listening ')
    console.info('==> 🌐  Server running in %s mode', process.env.NODE_ENV || 'development')
    console.info('==> 🌎  Listening on port %s. Open up http://192.168.1.222:%s/ in your browser.', port, port)
  }
})
