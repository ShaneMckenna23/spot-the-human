/* ************************************************
** GAME PLAYER CLASS
************************************************ */
var Player = function (startX, startY) {
    var x = startX
    var y = startY
    var id
    var score
  
    // Getters and setters
    var getX = function () {
      return x
    }
  
    var getY = function () {
      return y
    }
    
    var getScore = function () {
      return score
    }

    var setScore = function (newScore) {
      score = newScore
    }

    var setX = function (newX) {
      x = newX
    }
  
    var setY = function (newY) {
      y = newY
    }

    // Define which variables and methods can be accessed
    return {
      getX: getX,
      getY: getY,
      setX: setX,
      setY: setY,
      id: id
    }
  }
  
  // Export the Player class so you can use it in
  // other files by using require("Player")
  module.exports = Player
  