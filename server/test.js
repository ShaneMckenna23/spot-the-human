setInterval(function() {
  easystar.findPath(cuurentBotX,currentBotY,currentPlayerX,currentPlayerY,
    function(path) {
      if (path) {
        currentNextPointX = path[1].x;
        currentNextPointY = path[1].y;
      }

      if (
        currentNextPointX < cuurentBotX &&
        currentNextPointY < currentBotY
      ) {
        enemyDirection = "NW";
      } 
      
      else if (
        currentNextPointX == cuurentBotX &&
        currentNextPointY < currentBotY
      ) {
        enemyDirection = "N";
      } 
      
      else if (
        currentNextPointX > cuurentBotX &&
        currentNextPointY < currentBotY
      ) {
        enemyDirection = "NE";
      } 
      
      else if (
        currentNextPointX < cuurentBotX &&
        currentNextPointY == currentBotY
      ) {
        enemyDirection = "W";
      } 
      
      else if (
        currentNextPointX > cuurentBotX &&
        currentNextPointY == currentBotY
      ) {
        enemyDirection = "E";
      } 
      
      else if (
        currentNextPointX > cuurentBotX &&
        currentNextPointY > currentBotY
      ) {
        console.log("GO RIGHT DOWN");
        enemyDirection = "SE";
      } 
      
      else if (
        currentNextPointX == cuurentBotX &&
        currentNextPointY > currentBotY
      ) {
        enemyDirection = "S";
      } 
      
      else if (
        currentNextPointX < cuurentBotX &&
        currentNextPointY > currentBotY
      ) {
        enemyDirection = "SW";
      } 
      
      else {
        enemyDirection = "STOP";
      }
    }
  );

  easystar.calculate();
}, 10);
