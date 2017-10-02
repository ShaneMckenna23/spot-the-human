var config = {
  apiKey: "AIzaSyDJhFgFb2cMRO6RddCibBOXToa0OaFoLf8",
  authDomain: "spot-the-human.firebaseapp.com",
  databaseURL: "https://spot-the-human.firebaseio.com",
  projectId: "spot-the-human",
  storageBucket: "spot-the-human.appspot.com",
  messagingSenderId: "185370764051"
};
firebase.initializeApp(config);

// Reference messages collection
var userRef = firebase.database().ref('user');
var userDataKey;

///Set up score
var username = localStorage.getItem("user");
document.getElementById('username').innerHTML = username;

displayUsernames();
getUserDetails(username)

// Save message to firebase
function getUserDetails(username){
  findUser(username)
}

function findUser(username){
  firebase.database().ref().on('value', function(snapshot) {
    var data = snapshot.val();
    if(data){
      for (item in data.user) {
        var user = data.user[item].username
        if(user == username){
          userDataKey = item
          return processUser(data.user[item])
        }
      }
    }
    return processUser(false) 
  });
}

//bad code everywhere :D
setTimeout(function(){
  setUserActive();
},2000)


function processUser(user){
  if(user == false){
    createNewUser(username);
  }else{
    score = user.score
  }
}

function createNewUser(username){
  var newUserRef = userRef.push();
  newUserRef.set({
      username: username,
      score: 0,
      active: 1
  });
}

function displayUsernames(){
  firebase.database().ref().on('value', function(snapshot) {
      var activeUsers = [];
      var data = snapshot.val();
      if(data){
        for (item in data.user) {
          var active = data.user[item].active
          if(active == 1){
            activeUsers.push(data.user[item])
          }
        }   
      }
      if(activeUsers.length > 0){
        document.getElementById("userList").innerHTML = ""
        activeUsers.forEach(function(item){
          if(typeof item != 'undefined'){
            document.getElementById("userList").innerHTML += "<p><h3>" + item.username + " score: " + item.score+ "<h3/></p>";     
          }
        })
      }
  });
}

//save score
setInterval(function(){
  var userDataRef = userRef.child(userDataKey);
  userDataRef.update({
    "score": score
  });
}, 2000)

function setUserActive(){
  var userDataRef2 = userRef.child(userDataKey);
  userDataRef2.update({
    "active": 1
  });
}

function leaveGame() {
  var userDataRef3 = userRef.child(userDataKey);
  userDataRef3.update({
    "active": 0
  });
  window.location.replace("https://spot-the-human.herokuapp.com/");
};


//Game
var game = new Phaser.Game(1105, 600, Phaser.CANVAS, 'phaser', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('backdrop', 'assets/backdrop.png');
    game.load.image('ball', 'assets/ball.png');
}

var player;
var cursors;

var socket // Socket connection

var enemies

var currentGameTime = 10000

var gameTime = 10000
var intermissionTime = 5000
var isIntermission = true

function create() {
    socket = io.connect()

    game.world.setBounds(0, 0, 1105, 600);

    game.add.sprite(0, 0, 'backdrop');

    var startX = Math.round(Math.random() * (400) + 200)
    var startY = Math.round(Math.random() * (350) + 150)
    player = game.add.sprite(startX, startY, 'ball');

    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();

    game.input.mouse.capture = true;

    enemies = []

    setEventHandlers()
}

var setEventHandlers = function () {
    // Socket connection successful
    socket.on('connect', onSocketConnected)
  
    // Socket disconnection
    socket.on('disconnect', onSocketDisconnect)
  
    // New player message received
    socket.on('new player', onNewPlayer)
  
    // Player move message received
    socket.on('move player', onMovePlayer)
  
    // Player removed message received
    socket.on('remove player', onRemovePlayer)

    socket.on('game time', initTime)
  }
  
  function initTime(data){
    currentGameTime = data.currentGameTime
    isIntermission = data.isIntermission
    startGameTimer();
    gameTime = data.gameTime
    intermissionTime = data.intermissionTime
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

  // Socket connected
  function onSocketConnected () {
    console.log('Connected to socket server')
  
    // Reset enemies on reconnect
    enemies.forEach(function (enemy) {
      enemy.player.kill()
    })
    enemies = []
  
    // Send local player data to the game server
    socket.emit('new player', { x: player.x, y: player.y})
  }
  
  // Socket disconnected
  function onSocketDisconnect () {
    console.log('Disconnected from socket server')
  }
  
  // New player
  function onNewPlayer (data) {
    console.log('New player connected:', data.id)
  
    // Avoid possible duplicate players
    var duplicate = playerById(data.id)
    if (duplicate) {
      console.log('Duplicate player!')
      return
    }
  
    // Add new player to the remote players array
    enemies.push(new RemotePlayer(data.id, game, player, data.x, data.y))
  }
  
  // Move player
  function onMovePlayer (data) {
    var movePlayer = playerById(data.id)
    // Player not found
    if (!movePlayer) {
      console.log('Player not found: ', data.id)
      return
    }
  
    // Update player position
    movePlayer.player.x = data.x
    movePlayer.player.y = data.y
  }
  
  // Remove player
  function onRemovePlayer (data) {
    var removePlayer = playerById(data.id)
  
    // Player not found
    if (!removePlayer) {
      console.log('Player not found: ', data.id)
      return
    }
  
    removePlayer.player.kill()
  
    // Remove player from array
    enemies.splice(enemies.indexOf(removePlayer), 1)
  }
  

function update() {
    if (cursors.left.isDown)
    {
        player.x -= 3;
    }
    else if (cursors.right.isDown)
    {
        player.x += 3;
    }

    if (cursors.up.isDown)
    {
        player.y -= 3;
    }
    else if (cursors.down.isDown)
    {
        player.y += 3;
    }

    if(game.input.activePointer.leftButton.isDown){
      isPlayer(game.input.activePointer.x,game.input.activePointer.y)
    }

    game.world.wrap(player, 0, true);

    socket.emit('move player', { x: player.x, y: player.y})
}

function render() {
    //game.debug.cameraInfo(game.camera, 500, 32);
    //game.debug.spriteCoords(player, 32, 32);
}

// Find player by ID
function playerById (id) {
    for (var i = 0; i < enemies.length; i++) {
      if (enemies[i].player.name === id) {
        return enemies[i]
      }
    }
  
    return false
  }

function isPlayer (x,y) {
  for (var i = 0; i < enemies.length; i++) {
    var xPos = enemies[i].player.x
    var yPos = enemies[i].player.y

    if ( x > xPos && x < xPos+64) {
      if( y > yPos && y < yPos+64){
        var isBot = enemies[i].player.name.substring(0, 3);
        if(isBot == "BOT"){
          decreaseScore()
        }else{
          increaseScore()
        }
      }
    }
  }
  return false
}

var score = 0;

function increaseScore(){
  score++;
  document.getElementById('score').innerHTML = "Score: " + score
}

function decreaseScore(){
  score-= 100;
  document.getElementById('score').innerHTML = "Score: " + score
}