$(document).ready(function(){
	SNAKE.init();
});


var SNAKE = (function() {
	var width = 30,
		height = 30,
		segmentSize = 15,
		borderSize = 4,
		$mainArea,		
		snake = [],
		direction = 'right',
		oldDirection,
		interval = 150,
		intervalVariavle,
		obstaclesQuantity = 50,
		obstacles = [],
		$food,
		food = false,
		eating = false,
		mainAreaBorderSize = 20,
		$snakeLengthText;


	initSnake = function()
	{
		for(var i=0; i<snake.length;i++)
		{
			var $segment = $(document.createElement('div')),
				top = snake[i].x * segmentSize + $mainArea.offset().top + mainAreaBorderSize,
				left =  snake[i].y * segmentSize + $mainArea.offset().left + mainAreaBorderSize;
			$segment.attr({name: i})
				.addClass('snakeSegment')
				.offset({top: top, left:left})
				.width(segmentSize-borderSize)
				.height(segmentSize-borderSize);
			$mainArea.prepend($segment);
		}
	}	

	obstaclesCreation = function ()
	{
		var x=0 , y=0;
		for (var i = 0; i < obstaclesQuantity; i++)
		{	
			x = Math.round(Math.random() * width);
			y = Math.round(Math.random() * height);
			if(x==1) x = y;
			obstacles.push({x: x, y: y});
		}
	};

	initObstacle = function()
	{
 		var $obstacle;
		for(var i = 0; i < obstacles.length; i++)
		{
			$obstacle =	$(document.createElement('div'))
					.addClass('obstacle')
					.width(segmentSize - borderSize)
					.height(segmentSize - borderSize)
					.offset({top: obstacles[i].x * segmentSize + $mainArea.offset().top +  mainAreaBorderSize,
							 left: obstacles[i].y * segmentSize + $mainArea.offset().left +  mainAreaBorderSize});
			$mainArea.append($obstacle);
		}
	}

	foodCreator = function()
	{
		var x, y, colide;

		do
		{
			colide = false;
			x = Math.round(Math.random() * width);
			y = Math.round(Math.random() * height);

			for( var i = 0; i < snake.length; i++)
			{
				if((snake[i].x == x) && (snake[i].y == y))
				{
					colide = true;
				}
			}

			for(var i = 0; i < obstacles.length; i++)
			{
				if((obstacles[i].x == x) && (obstacles[i].y == y))
				{
					colide = true;
				}
			}

		}while(colide)
		
		food = {x: x, y: y};
		x = x * segmentSize + $mainArea.offset().top + mainAreaBorderSize;
		y = y * segmentSize + $mainArea.offset().left + mainAreaBorderSize;
		$food = $(document.createElement('div'))
				.addClass('food')
				.width(segmentSize - borderSize)
				.height(segmentSize - borderSize)
				.offset({top: x, left: y});			
		console.log(food);
		$mainArea.append($food);
	}

	drawScene = function()
	{		
		var top, left;
		for(var i = 0; i < snake.length; i++)
		{
			top = snake[i].x * segmentSize + $mainArea.offset().top + mainAreaBorderSize;
			left =  snake[i].y * segmentSize + $mainArea.offset().left + mainAreaBorderSize;
			var string = '.snakeSegment[name=\''+(snake.length-i-1)+'\']';
			var $temp = $(string);
			$temp.offset({top: top, left: left});
		}
	};

	mainLoopStart = function()
	{
		intervalVariable = setInterval(reecalcutePosition, interval);
	
	}

	reecalcutePosition = function()
	{
		var x = 0,
			y = 0;

		switch (direction)
		{
			case 'up': x--; break;
			case 'down': x++; break;
			case 'left': y--; break;
			case 'right': y++; break;
		}

		var lastSegmentPosition = snake[0];
		moveSnake();
		snake[snake.length-1].x+=x;
		snake[snake.length-1].y+=y;
		colisionCheck();
		if(eating)
			{
				addSnakeSegment(lastSegmentPosition.x, lastSegmentPosition.y);
				eating = false;
			}
		if(!food) foodCreator();
		drawScene();
	}	

	moveSnake = function()
	{
		for(var i = 0; i < snake.length-1; i++)
		{
		  	snake[i].x = snake[i+1].x;
		  	snake[i].y = snake[i+1].y;
		}
	}

	addSnakeSegment = function(x,y)
	{
		snake.unshift({x: x, y: y});
		var $segment = $(document.createElement('div')),
				top = snake[0].x * segmentSize + $mainArea.offset().top,
				left =  snake[0].y * segmentSize + $mainArea.offset().left;
			$segment.attr({name: snake.length-1});
			$segment.addClass('snakeSegment').offset({top: top, left:left})
				.height(segmentSize - borderSize)
				.width(segmentSize - borderSize);
			$mainArea.prepend($segment);
			$snakeLengthText.text('SNAKE LENGTH: '+ snake.length);
	}

	colisionCheck = function()
	{	
		/////////////////////////////////////////////////// SELF COLISION
		for(var i = 0; i < snake.length-1; i++)
			for(var j = 0; j < snake.length-1; j++)
			{
				if(i==j) continue;
				if((snake[i].x == snake[j].x) && (snake[i].y == snake[j].y))
					onColision();
			}

		////////////////////////////////////////////////////BORDER COLISION
		for(var i = 0; i < snake.length; i++)
		{
			if((snake[i].x < 0) || (snake[i].x > width) ||
			   (snake[i].y < 0) || (snake[i].y > height))
					onColision();
		}

		///////////////////////////////////////////////////OBSTACLE COLISION
		for(var i=0; i<obstacles.length; i++)
		{
			if((snake[snake.length-1].x == obstacles[i].x) && (snake[snake.length-1].y == obstacles[i].y))
				onColision();
		}
		//////////////////////////////////////////////////////FOOD COLISION
		if((snake[snake.length-1].x == food.x) &&  (snake[snake.length-1].y == food.y))
		{
			eating = true;
			$food.remove();
			food = false;
		}
		
	}

	onColision = function()
	{
		clearInterval(intervalVariable);
		$('.snakeSegment').css({'background-color': 'red', border: '1px dotted white'});

	}

	onFoodColision = function()
	{

	}

	directionSet = function(event)
	{	
		oldDirection = direction;
		switch (event.keyCode)
		{
			case 38: direction = 'up';  event.preventDefault(); break;
			case 40: direction = 'down';  event.preventDefault(); break;
			case 37: direction = 'left';  event.preventDefault(); break;
			case 39: direction = 'right';  event.preventDefault(); break;
		}
		if((oldDirection == 'up') && (direction == 'down')) direction = oldDirection;
		if((oldDirection == 'down') && (direction == 'up')) direction = oldDirection;
		if((oldDirection == 'left') && (direction == 'right')) direction = oldDirection;
		if((oldDirection == 'right') && (direction == 'left')) direction = oldDirection;
	}



	return{
		init: function()
			{
				$mainArea = $(document.createElement('div'));
				$mainArea.addClass('mainArea').width(width * segmentSize + segmentSize + 2).height(height * segmentSize + segmentSize + 2);
				$('body').prepend($mainArea);
				$(document).on('keydown', directionSet);
				snake.push({x:1,y:1}, {x:1,y:2}, {x:1,y:3}, {x:1,y:4}, {x:1,y:5});
				direction = 'right'	;
				$snakeLengthText = $(document.createElement('div'))
									.addClass('snakeLengthText')
									.text("SNAKE LENGTH: "+snake.length)
									.width($mainArea.width() - 20);
				var $startText = $(document.createElement('div'))
								.text('Click here to start')
								.addClass('startText').
								on('click', function(){ 
									initSnake();
									mainLoopStart();
									obstaclesCreation();
									initObstacle();	
									$mainArea.after($snakeLengthText);
									$(this).remove();
								});
				$mainArea.prepend($startText);
				//$('body').append($('<div class = \'smth\'></div>').text('buraczanka'));
			}
	};
})();

	
