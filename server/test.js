setInterval(function(){             	
easystar.findPath(0, 0, 5, 5, function( path ) {
        	    
if (path) {
    currentNextPointX = path[1].x;
    currentNextPointY = path[1].y;
}
	        	    
if (currentNextPointX < 5 && currentNextPointY < 5) {
       // left up
	        	    	
       console.log("GO LEFT UP");
	        	    	
       enemyDirection = "NW";
    }
    else if (currentNextPointX == 5 && currentNextPointY < 5)
    {
       // up
	        	    	
       console.log("GO UP");
	        	    	
       enemyDirection = "N";
	        	    	
    }
    else if (currentNextPointX > 5 && currentNextPointY < 5)
    {
       // right up
	        	    	
       console.log("GO RIGHT UP");
	        	    	
       enemyDirection = "NE";
	        	    	
   }
   else if (currentNextPointX < 5 && currentNextPointY == 5)
   {
      // left
	        	    	
       console.log("GO LEFT");
	        	    	
       enemyDirection = "W";
	        	    	
   }
   else if (currentNextPointX > 5 && currentNextPointY == 5)
   {
      // right
	        	    	
       console.log("GO RIGHT");
	        	    	
       enemyDirection = "E";
	        	    
   }
   else if (currentNextPointX > 5 && currentNextPointY > 5)
   {
      // right down
	        	    	
	console.log("GO RIGHT DOWN");
	        	    	
	enemyDirection = "SE";
	        	    	
   }
   else if (currentNextPointX == 5 && currentNextPointY > 5)
   {
      // down
	        	    	
	 console.log("GO DOWN");
	        	    	
	 enemyDirection = "S";
	        	    	
   }
   else if (currentNextPointX < 5 && currentNextPointY > 5)
   {
     // left down
	        	    	
	console.log("GO LEFT DOWN");
	        	    	
	enemyDirection = "SW";
	        	    	
   }
   else
   {       	    	
	enemyDirection = "STOP";        	    	
   }


   easystar.calculate();       	
}, 100)
