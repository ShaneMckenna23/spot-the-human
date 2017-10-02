var http = require('http')
var path = require('path')
var ecstatic = require('ecstatic')
var io = require('socket.io')
var easystarjs = require("easystarjs")

var Player = require('./Player')

var port = process.env.PORT || 8080

var socket	// Socket controller
var players	// Array of connected players

/* ************************************************
** GAME VARIABLES
************************************************ */
var currentGameTime = 10000

var gameTime = 10000
var intermissionTime = 5000
var isIntermission = true

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

  init()
})


var grid = [] // 1100x600 2d array for easystar
var row = [];
for(var i=0; i<1100; i++){
  row.push(0)
}
for(var j = 0; j<600; j++){
  grid.push(row)
}

function init () {
  // Create an empty array to store players
  players = []

  // Attach Socket.IO to server
  socket = io.listen(server)

  // Start listening for events
  setEventHandlers()
  startGameTimer()
  badBot()
//  badBot()
  okBot()
  okBot()
  //copyCatBot();
  copyCatBot();
}

function startGameTimer(){
  var clock = setInterval(function(){
    if(currentGameTime === 0){
      if(isIntermission){
        currentGameTime = intermissionTime
      }else{
        currentGameTime = gameTime 
      }
      isIntermission = !isIntermission
    }
    currentGameTime = currentGameTime - 1000;
  }, 1000);
}

var setEventHandlers = function () {
  // Socket.IO
  socket.sockets.on('connection', onSocketConnection)
}

// New socket connection
function onSocketConnection (client) {
  console.log('New player has connected: ' + client.id)

  // Listen for client disconnected
  client.on('disconnect', onClientDisconnect)

  // Listen for new player message
  client.on('new player', onNewPlayer)

  // Listen for move player message
  client.on('move player', onMovePlayer)

  socket.sockets.emit('game time',{currentGameTime: currentGameTime,gameTime:gameTime,intermissionTime:intermissionTime,isIntermission:isIntermission})
}

// Socket client has disconnected
function onClientDisconnect () {
  console.log('Player has disconnected: ' + this.id)

  var removePlayer = playerById(this.id)

  // Player not found
  if (!removePlayer) {
    console.log('Player not found: ' + this.id)
    return
  }

  // Remove player from players array
  players.splice(players.indexOf(removePlayer), 1)

  // Broadcast removed player to connected socket clients
  this.broadcast.emit('remove player', {id: this.id})
}

// New player has joined
function onNewPlayer (data) {
  // Create a new player
  var newPlayer = new Player(data.x, data.y)
  newPlayer.id = this.id

  // Broadcast new player to connected socket clients
  this.broadcast.emit('new player', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()})

  // Send existing players to the new player
  var i, existingPlayer
  for (i = 0; i < players.length; i++) {
    existingPlayer = players[i]
    this.emit('new player', {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()})
  }

  // Add new player to the players array
  players.push(newPlayer)
}

// Player has moved
function onMovePlayer (data) {
  // Find player in array
  var movePlayer = playerById(this.id)

  // Player not found
  if (!movePlayer) {
    console.log('Player not found: ' + this.id)
    return
  }

  // Update player position
  movePlayer.setX(data.x)
  movePlayer.setY(data.y)

  // Broadcast updated position to connected socket clients
  this.broadcast.emit('move player', {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()})
}

/* ************************************************
** GAME HELPER FUNCTIONS
************************************************ */
// Find player by ID
function playerById (id) {
  var i
  for (i = 0; i < players.length; i++) {
    if (players[i].id === id) {
      return players[i]
    }
  }

  return false
}

var botcount = 1

// New player has joined
function badBot () {
  // Create a new player
  var startX = Math.round(Math.random() * (800) + 100)
  var startY = Math.round(Math.random() * (4) + 100)
  var newPlayer = new Player(startX, startY)
  newPlayer.id = "BOT_" + botcount
  botcount++;

  // Broadcast new player to connected socket clients
  socket.sockets.emit('new player', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()})

  setInterval(function(){
    if(newPlayer.getX()>1105){
      newPlayer.setX(-10)
    }

    if(newPlayer.getX()<-10){
      newPlayer.setX(1105)
    }
    
    if(newPlayer.getY()>600){
      newPlayer.setY(-10)
    } 

    if(newPlayer.getY()<-10){
      newPlayer.setY(600)
    }
        
    var rand = Math.floor(Math.random() * 4);

    switch(rand){
      case 0:
        newPlayer.setX(newPlayer.getX()+4)
      break;
      case 1:
        newPlayer.setX(newPlayer.getX()-4)
      break;
      case 2:
        newPlayer.setY(newPlayer.getY()+4)
      break;
      case 3:
        newPlayer.setY(newPlayer.getY()-4)
      break;
    }
    socket.sockets.emit('move player', { id: newPlayer.id, x: newPlayer.getX(), y:newPlayer.getY()} )  
  },15)
  // Add new player to the players array
  players.push(newPlayer)
}

function okBot () {
  // Create a new player
  var startX = Math.round(Math.random() * (800) + 100)
  var startY = Math.round(Math.random() * (4) + 100)
  var newPlayer = new Player(startX, startY)
  newPlayer.id = "BOT_" + botcount
  botcount++;

  // Broadcast new player to connected socket clients
  socket.sockets.emit('new player', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()})

  var direction = 0;

  setInterval(function(){
    direction = Math.floor(Math.random() * 4);
  },1000)

  setInterval(function(){
    if(newPlayer.getX()>1105){
      newPlayer.setX(-10)
    }

    if(newPlayer.getX()<-10){
      newPlayer.setX(1105)
    }
    
    if(newPlayer.getY()>600){
      newPlayer.setY(-10)
    } 

    if(newPlayer.getY()<-10){
      newPlayer.setY(600)
    }

    switch(direction){
      case 0:
        newPlayer.setX(newPlayer.getX()+2)
      break;
      case 1:
        newPlayer.setX(newPlayer.getX()-2)
      break;
      case 2:
        newPlayer.setY(newPlayer.getY()+2)
      break;
      case 3:
        newPlayer.setY(newPlayer.getY()-2)
      break;
    }
    socket.sockets.emit('move player', { id: newPlayer.id, x: newPlayer.getX(), y:newPlayer.getY()} )  
  },10)
  // Add new player to the players array
  players.push(newPlayer)
}


var easystar = new easystarjs.js();
easystar.setGrid(grid);
easystar.setAcceptableTiles([0]);
easystar.enableDiagonals();

function copyCatBot () {
  // Create a new player
  var startX = Math.round(Math.random() * (400) + 200)
  var startY = Math.round(Math.random() * (350) + 150)
  var newPlayer = new Player(startX, startY)
  newPlayer.id = "BOT_" + botcount
  botcount++;

  // Broadcast new player to connected socket clients
  socket.sockets.emit('new player', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()})

  var currentNextPointX 
  var currentNextPointY

  setInterval(function(){            	
    if(newPlayer.getX()>1105){
      newPlayer.setX(-10)
    }

    if(newPlayer.getX()<-10){
      newPlayer.setX(1105)
    }

    
    if(newPlayer.getY()>600){
      newPlayer.setY(-10)
    } 

    if(newPlayer.getY()<-10){
      newPlayer.setY(600)
    }
    socket.sockets.emit('move player', { id: newPlayer.id, x: newPlayer.getX(), y:newPlayer.getY()} ) 
  },6)


  var PlayerX = 0;
  var PlayerY = 0;
  var followPlayer;



  setInterval(function(){
    if(followPlayer){
      PlayerX = followPlayer.getX()
      PlayerY = followPlayer.getY()   
    }  
  },10)

  setInterval(function(){
    try{
      easystar.findPath(newPlayer.getX(), newPlayer.getY(), PlayerX,PlayerY,
      function(path) {
        if (path.length > 0) {
          currentNextPointX = path[1].x;
          currentNextPointY = path[1].y;
          newPlayer.setY(currentNextPointY)
          newPlayer.setX(currentNextPointX)
        }
      }
    );
    easystar.calculate();
  }
  catch(e){
  }
}, 6)

 setInterval(function(){
  if(players.length > 0){
    var humanPlayers = removeBots()
    if(humanPlayers.length > 0){
      var randPlayer = Math.round(Math.random() * (humanPlayers.length-1) + 0)
      followPlayer = humanPlayers[randPlayer]
    }
  }
 },5000)

  // Add new player to the players array
  players.push(newPlayer)
}

function removeBots(){
  var humanPlayers = []
  var allPlayers = players
  for(var i=0;i<allPlayers.length; i++){
    var item = allPlayers[i]
    if(item.id.substring(0,3) != "BOT"){
      humanPlayers.push(item)
    }
  }
  return humanPlayers
}