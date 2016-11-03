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
		snakeLength,
		direction = 'right',
		oldDirection,
		interval = 50,
		intervalVariavle,
		obstaclesQuantity = 50,
		obstacles = [],
		//$food,
		food = false,
		eating = false,
		mainAreaBorderSize = 20,
		$settings;

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
				top = snake[0].x * segmentSize + $mainArea.offset().top + mainAreaBorderSize,
				left =  snake[0].y * segmentSize + $mainArea.offset().left + mainAreaBorderSize;
			$segment.attr({name: snake.length-1});
			$segment.addClass('snakeSegment').offset({top: top, left:left})
				.height(segmentSize - borderSize)
				.width(segmentSize - borderSize);
			$mainArea.prepend($segment);
	}

	colisionCheck = function()
	{	
		/////////////////////////////////////////////////// SELF COLISION
		for(var i = 0; i < snake.length-1; i++)
			for(var j = 0; j < snake.length-1; j++)
			{
				if(i==j) continue;
				if((snake[i].x == snake[j].x) && (snake[i].y == snake[j].y))
				{	
					snakeLength = snake.length;
					snake.length = 0;
					onColision();
				}
			}

		////////////////////////////////////////////////////BORDER COLISION
		for(var i = 0; i < snake.length; i++)
		{
			if((snake[i].x < 0) || (snake[i].x > width) ||
			   (snake[i].y < 0) || (snake[i].y > height))
				{	
					snakeLength = snake.length;
					onColision();
				}
		}

		///////////////////////////////////////////////////OBSTACLE COLISION
		for(var i=0; i<obstacles.length; i++)
		{
			if((snake[snake.length-1].x == obstacles[i].x) && (snake[snake.length-1].y == obstacles[i].y))
				{
					snakeLength = snake.length;
					onColision();
				}
		}
		//////////////////////////////////////////////////////FOOD COLISION
		if((snake[snake.length-1].x == food.x) &&  (snake[snake.length-1].y == food.y))
		{
			eating = true;
			$food.remove();
			food = false;
			onFoodColision();
		}
		
	}

	onColision = function()
	{
		clearInterval(intervalVariable);
		$('.snakeSegment').css({opacity: '0'});
		$settings.fadeIn(400);
		endTextShow();
	}

	onFoodColision = function()
	{
		$('.snakeSegment').each(function(i){
			$(this).delay(200*(snake.length-i)).animate({'background-color':'#00ff00'}, 200, function(){
				$(this).animate({'background-color':'#777777'}, 200);
			});
		});
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

	settingsInit = function()
	{		
	 	$settings =	$('<form>').addClass('settings')
			 			  .append('<div class=\'obstaclesDensity\'>')
			 			  .append('<div class=\'snakeSpeed\'>');
		$('body').append($settings);

		$('.obstaclesDensity').append('<label>Obstacle density: </label>')
							  .append('<span class=\'obstaclesSpan\'>'+obstaclesQuantity+'</span>')
							  .append('<input type=\'range\' min=\'0\' max =\'100\'>');
		$('.obstaclesDensity input').on('change', function ()
				{ obstaclesQuantity = $(this).val(); $('.obstaclesSpan').text(obstaclesQuantity);});

		$('.snakeSpeed').append('<label>Snake speed: </label>')
						.append('<span class=\'snakeSpan\'>'+5)
						.append('<input type=\'range\' min=\'1\' max=\'10\' value = \'5\'>');
		$settings.css({	width: $mainArea.width() });
		$('.snakeSpeed input').on('change', function ()
				{ var speed = $(this).val();
					$('.snakeSpan').text(speed);
				 	interval = 250 - (speed * 25);
				});
		interval = 250 - (5 * 25);
	}

	endTextShow = function()
	{
		var $endText = $('<div>').addClass('endText')
								.text('You achieve '+snakeLength+' length of snake!')
								.append($('<p>Click here to play again.</p>'));
		$mainArea.append($endText);
		$endText.on('click', function()
		{
			$(this).remove();
			startGame();
		})
	}

	startGame = function()
	{
		food = false;
		$('.food').remove();
		obstacles.length = 0;
		snake.length = 0;
		$('.obstacle').remove();
		$('.snakeSegment').remove();
		snake.push({x:1,y:1}, {x:1,y:2}, {x:1,y:3}, {x:1,y:4}, {x:1,y:5});
		direction = 'right';
		initSnake();
		mainLoopStart();
		obstaclesCreation();
		initObstacle();	
		$settings.fadeOut(400);
	}

	return{
		init: function()
			{
				$mainArea = $(document.createElement('div'));
				$mainArea.addClass('mainArea').width(width * segmentSize + segmentSize + 2).height(height * segmentSize + segmentSize + 2);
				$('body').prepend($mainArea);
				$(document).on('keydown', directionSet);
				var $startText = $(document.createElement('div'))
								.text('Click here to start')
								.addClass('startText').
								on('click', function(){ 
									$(this).remove();
									startGame();								
								});
				$mainArea.prepend($startText);
				settingsInit();
			}
	};
})();

	
