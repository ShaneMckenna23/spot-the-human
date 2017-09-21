var http = require('http')
var path = require('path')
var ecstatic = require('ecstatic')
var io = require('socket.io')

var port = process.env.PORT || 8080

/* ************************************************
** GAME VARIABLES
************************************************ */


/* ************************************************
** GAME INITIALISATION
************************************************ */

// Create and start the http server
var server = http.createServer(
  ecstatic({ root: path.resolve(__dirname, '../public') })
).listen(port, function (err) {
  if (err) {
    throw err
  }
})
