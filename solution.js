/**
* Develop an API that moves a rover around a grid
* 
* 1.) You are given the initial starting point (x,y) of a rover and the direction (N,S,E,W) it is facing
* 
* 2.) The rover receives a character array of commands.
* 
* 3.) Implement commands that move the rover forward/backward (f,b)
* 
* 4.) Implement wrapping from one edge of the grid to another. (planets are spheres after all)
* 
* 5.) Implement obstacle detection before each move to a new square. If a given sequence of commands 
* 	  encounters an obstacle, the rover moves up to the last possible point and reports the obstacle.
 

* 	  Goal - build api that would take in a string of commands and output the final position
* 	  assume path is a string containing single character commands: fflrbbrrllffffb
* 	  assume obstacles is a coordinate position within the grid: [[x0, y0], [x1, y1], [xn,yn]]
* 	  - if rover detects obstacle, stop at that point and report it
* 	  Earth is not flat so neither is the grid the rover roams 
* 	  position - point within grid: [x, y]
**/
;
Kata = window.Kata || {};
Kata = (function() {
	'use strict';
	var solutionDiv;
	



	function init() {
		bindElements();

		var startingPos = [0, 0];
		var startingDir = 'n';
		var obs = [[22, 25], [5, 8], [12, 18]];
		var commandChain = 'bfffffrfrffllfflffbrrrf';
		var gHeight = 100;
		var gWidth = 100;

		appendElement( 'Beginning Mission', true );
		appendElement('Starting Position: ' + JSON.stringify(startingPos) );
		appendElement('Grid dimensions: ' + gWidth + 'x' + gHeight );
		appendElement( 'Coordinates of obstacles: ' + JSON.stringify(obs) );
		solutionDiv.appendChild(document.createElement('br'));
		
		// Rover - theExploreX
		var theExplorerX = new Rover( startingPos, startingDir, obs, commandChain, gHeight, gWidth );
		var missionStatus = theExplorerX.explore(); 

		
		appendElement( 'Mission over, final data..' );
		appendElement( JSON.stringify(missionStatus) );



	}

	function bindElements() {
		solutionDiv = document.querySelector('.solution');
	}

	function appendElement( content, strong ) {
		var p = document.createElement('p');
		var el = document.createTextNode( content );
		if (strong) {
			var s = document.createElement('strong');
			s.appendChild(el);
			p.appendChild(s);
		} else {
			p.appendChild(el);

		}
		solutionDiv.appendChild(p);

	}

	// Initiate rover constructor
	function Rover( position, direction, obstacles, commands, gridHeight, gridWidth ) {
		// init starting position and direction
		this.position = position;
		// [n, e, s, w] - > [0, 1, 2, 3]
		this.direction = ['n', 'e', 's', 'w'].indexOf(direction);

		// x and y coordinates
		this.x = position[0];
		this.y = position[1];

		// path completed thus far
		this.commandsCompleted = [];
		// command chain
		this.commands = commands.split('');

		this.grid = new Grid( gridHeight, gridWidth, obstacles );


	};

	function Grid( gridHeight, gridWidth, obstacles ) {
		// grid dimensions
		this.boundLeft = 0;
		this.boundRight = gridWidth;
		this.boundBottom = 0;
		this.boundTop = gridHeight;

		// obstacles - 2d array of sets of x,y points [[x,y]]
		this.obstacles = obstacles;
	};

	Grid.prototype.detectObstacle = function( x, y ) {

		// check for obstacles
		// true if obstacle is detected, false otherwise
		return this.obstacles.some(function(coords) {
			return ( x === coords[0] && y === coords[1] ); 
		});
	};

	// turn left - l
	Rover.prototype.turnLeft = function() {
		// n -> w, e -> n, s -> e, w -> s
		this.direction = ( this.direction > 0 ) ? this.direction - 1 : 3;
	};

	// turn right - r
	Rover.prototype.turnRight = function() {
		// n -> e, e -> s, s -> w, w -> n
		this.direction = ( this.direction < 3 ) ? this.direction + 1 : 0;
	};

	// move forward - f or move backward - b
	Rover.prototype.move = function( char ) {
		var dir = ( char == 'f' ) ? 1 : -1;
		
		// if heading in south or west direction should be opposite
		if ( this.direction === 3 || this.direction === 2 ) {
			dir = dir * -1;
		}
		
		// north and south are even indices, east and west are odd
		this.position = ( this.direction % 2 === 0 ) ? [this.x, this.y + dir] : [this.x + dir, this.y];

		// update x and y vals
		this.updateXandY();

		// check grid and adjust position
		this.checkGrid();
	};

	// update X and Y coords
	Rover.prototype.updateXandY = function() {
		this.x = this.position[0];
		this.y = this.position[1];
	}

	// check rovers position on grid and update accordingly
	Rover.prototype.checkGrid = function() {
		if ( this.x < this.grid.boundLeft ) {
			this.position = [this.grid.boundRight, this.y];
			this.updateXandY();
		}

		if ( this.x > this.grid.boundRight ) {
			this.position = [this.grid.boundLeft, this.y];
			this.updateXandY();
		}

		if ( this.y < this.grid.boundBottom ) {
			this.position = [this.x, this.grid.boundTop];
			this.updateXandY();
		}

		if ( this.y > this.grid.boundTop ) {
			this.position = [this.x, this.grid.boundBottom];
			this.updateXandY();
		}
	};

	Rover.prototype.explore = function() {
		// Start Expoloring
		
		appendElement( 'Rover is facing ' + ['n', 'e', 's', 'w'][this.direction].toUpperCase() );
		appendElement( 'and has to execute these moves [' + this.commands.toString() + ']');




		for ( var i = 0; i < this.commands.length; i++ ) {
			
			if ( this.commands[i] == 'l' ) {
				this.turnLeft();
				this.commandsCompleted.push(this.commands[i]);
				

				appendElement( 'Rover is turning left' );
				appendElement( 'Rover position is still at [' + this.position.toString() + ']' );
				appendElement( 'Rover direction is now facing ' + ['n', 'e', 's', 'w'][this.direction].toUpperCase() );
			}

			if ( this.commands[i] == 'r' ) {
				this.turnRight();
				this.commandsCompleted.push(this.commands[i]);
				
				
				appendElement( 'Rover is turning right' );
				appendElement( 'Rover position is still at [' + this.position.toString() + ']' );
				appendElement( 'Rover direction is now facing ' + ['n', 'e', 's', 'w'][this.direction].toUpperCase() );

			}

			if ( this.commands[i] == 'f' || this.commands[i] == 'b' ) {
				this.move( this.commands[i] );
				if ( this.grid.detectObstacle(this.x, this.y) ) {
					
					appendElement( 'AVOIDING COLLISION - STOPPING THE ROVER', true );
					
					return {
						position: this.position,
						pathCompleted: this.commandsCompleted,
						obstaclesDetected: true,
						direction: ['n', 'e', 's', 'w'][this.direction].toUpperCase()
					};
					
				}

				// good to keep moving
				appendElement( 'Rover is moving ' + this.commands[i] );
				appendElement( 'Rover has moved to [' + this.position.toString() + ']');

				// push command
				this.commandsCompleted.push(this.commands[i]);
			}

		}

		appendElement( 'Mission Complete - Successful', true );

		return {
			position: this.position,
			pathCompleted: this.commandsCompleted, 
			obstaclesDetected: false,
			direction: ['n', 'e', 's', 'w'][this.direction].toUpperCase()
		};
	};




	return  {
		init: init
	};
})()

