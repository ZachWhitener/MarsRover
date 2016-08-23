/**
* Rover API without frontend
**/ 

'use strict';

// initial variables and command chain
var startingPos = [0, 0];
var startingDir = 'n';
var obs = [[1, 12], [5, 8], [12, 18]];
var commandChain = 'ffffffffrfffff'; // hits obstacle 2
var gHeight = 25;
var gWidth = 25;

// Begin
var theExplorerX = new Rover( startingPos, startingDir, obs, commandChain, gHeight, gWidth );
var missionStatus = theExplorerX.explore();

// Rover constructor
function Rover( position, direction, obstacles, commands, gridHeight, gridWidth ) {
	this.position = position;
	this.direction = ['n', 'e', 's', 'w'].indexOf(direction);
	this.x = position[0];
	this.y = position[1];
	this.commandsCompleted = [];
	this.commands = commands.split('');
	this.grid = new Grid( gridHeight, gridWidth, obstacles );
};


function Grid( gridHeight, gridWidth, obstacles ) {
	this.boundLeft = 0;
	this.boundRight = gridWidth;
	this.boundBottom = 0;
	this.boundTop = gridHeight;
	this.obstacles = obstacles;
};

Grid.prototype.detectObstacle = function( x, y ) {
	// check for obstacles
	// true if obstacle is detected, false otherwise
	return this.obstacles.some(function(coords) {
		return ( x === coords[0] && y === coords[1] ); 
	});
};

Rover.prototype.turnLeft = function() {
	this.direction = ( this.direction > 0 ) ? this.direction - 1 : 3;
};

Rover.prototype.turnRight = function() {
	this.direction = ( this.direction < 3 ) ? this.direction + 1 : 0;
};


Rover.prototype.move = function( char ) {
	var dir = ( char == 'f' ) ? 1 : -1;
	// if heading south or west direction should be opposite
	if ( this.direction === 3 || this.direction === 2 ) {
		dir = dir * -1;
	}
	// north and south are even indices, east and west are odd
	this.position = ( this.direction % 2 === 0 ) ? [this.x, this.y + dir] : [this.x + dir, this.y];
	this.updateXandY();
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
	// explore
	for ( var i = 0; i < this.commands.length; i++ ) {
		
		if ( this.commands[i] == 'l' ) {
			this.turnLeft();
			this.commandsCompleted.push(this.commands[i]);
		}

		if ( this.commands[i] == 'r' ) {
			this.turnRight();
			this.commandsCompleted.push(this.commands[i]);
		}

		if ( this.commands[i] == 'f' || this.commands[i] == 'b' ) {
			this.move( this.commands[i] );
			if ( this.grid.detectObstacle(this.x, this.y) ) {
				
				// AVOIDING COLLISION - STOP THE ROVER
				
				return {
					position: this.position,
					pathCompleted: this.commandsCompleted,
					obstaclesDetected: true,
					direction: ['n', 'e', 's', 'w'][this.direction].toUpperCase()
				};
				
			}

			// good to keep moving
			// push command
			this.commandsCompleted.push(this.commands[i]);
		}

	}

	return {
		position: this.position,
		pathCompleted: this.commandsCompleted, 
		obstaclesDetected: false,
		direction: ['n', 'e', 's', 'w'][this.direction].toUpperCase()
	};
};