$(document).ready(function(){
	SNAKE.init();
});


var SNAKE = (function() {
	var width = 50,
		height = 50,
		$mainArea,		
		point = {x: 0, y:0},
		snake = [],
		direction,
		interval = 100;

	initSnake = function()
	{
		for(var i=0; i<snake.length;i++)
		{
			var $segment = $(document.createElement('div')),
				top = snake[i].x * 10 + $mainArea.offset().top,
				left =  snake[i].y * 10 + $mainArea.offset().left;
			$segment.attr({name: i});
			$segment.addClass('snakeSegment').offset({top: top, left:left});
			$mainArea.prepend($segment);
		}
	}	

	render = function()
	{		
		var top, left;
		for(var i = 0; i < snake.length; i++)
		{
			top = snake[i].x * 10 + $mainArea.offset().left;
			left =  snake[i].y * 10 + $mainArea.offset().top;
			var string = '.snakeSegment[name=\''+i+'\']';
			var $temp = $(string);
			$temp.offset({top: top, left: left});
		}
	};

	mainLoopStart = function()
	{
		setInterval(reecalcutePosition, interval);
	
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
		moveSnake();
		snake[snake.length-1].x+=x;
		snake[snake.length-1].y+=y;
		colisionCheck();
		render();
	}	

	moveSnake = function()
	{
		for(var i = 0; i < snake.length-1; i++)
		{
		  	snake[i].x = snake[i+1].x;
		  	snake[i].y = snake[i+1].y;
		}
	}

	colisionCheck = function()
	{
		if ((snake[snake.length-1].x == snake[snake.length-2].x) 
			&& (snake[snake.length-1].y == snake[snake.length-2].y))
				console.log('fail');
	}

	directionSet = function(event)
	{	
		switch (event.keyCode)
		{
			case 38: direction = 'up';  event.preventDefault(); break;
			case 40: direction = 'down';  event.preventDefault(); break;
			case 37: direction = 'left';  event.preventDefault(); break;
			case 39: direction = 'right';  event.preventDefault(); break;
		}
	}


	return{
		init: function()
			{
				$mainArea = $(document.createElement('div'));
				$mainArea.addClass('mainArea').width(width*10+4).height(height*10+4);
				$('body').prepend($mainArea);
				$(document).on('keydown', directionSet);

				snake.push({x:1,y:1}, {x:1,y:2}, {x:1,y:3}, {x:1,y:4}, {x:1,y:5});
				direction = 'right'	;
				initSnake();
				mainLoopStart();	
		

		
			}
	};
})();

	
