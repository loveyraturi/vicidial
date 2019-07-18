var server = require('./server/main')
// start server
const port = process.env.PORT || 5011
serverInfo = server.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.log('Case Manager Portal listening ')
    console.info('==> 🌐  Server running in %s mode', process.env.NODE_ENV || 'development')
    console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port)
  }
})
