/* global game */

var RemotePlayer = function (index, game, player, startX, startY) {
    var x = startX
    var y = startY
  
    this.game = game
    this.player = player
  
    this.player = game.add.sprite(startX, startY, 'ball');
  
    this.player.name = index.toString()
  
    this.lastPosition = { x: x, y: y }
  }
  
  RemotePlayer.prototype.update = function () {
    if (this.player.x !== this.lastPosition.x || this.player.y !== this.lastPosition.y) {
      this.player.play('move')
    } else {
      this.player.play('stop')
    }
  
    this.lastPosition.x = this.player.x
    this.lastPosition.y = this.player.y
  }
  
  window.RemotePlayer = RemotePlayer
  