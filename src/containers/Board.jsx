import React from 'react';

const Board = () => (
  <div>
    <h2>GameBoard</h2>
  </div>
);

/*
@@@@@@@@@@@@@@@@@@@@@
components:
	board
	cell
	game
	controls
	canvass





@@@@@@@@@@@@@@@@@@@@@@@
seed patterns:
	acorn
	glider
	gliderGun
	line
	still
	switchEngine
	pufferTrain
	heart


@@@@@@@@@@@@@@@@@@@@@@@
board state:
	width
	height
	array of cells
	generation
	running?
	speed
	changelist (each time only need to check cells that changed in last tick)
	staticlist (when board is all static then stop generations)

	use requestAnimationFrame :
		update: function() {
      this.step();
      this.intervalID = requestAnimationFrame(this.update);
    },

    handleToggle: function() {
      if (this.state.running) {
        this.setState({running:false});
        cancelAnimationFrame(this.intervalID);
      } else {
        this.setState({running:true});
        this.intervalID = requestAnimationFrame(this.update);
      }
    },
  });
@@@@@@@@@@@@@@@@@@@@@@@@@
board methods:
	set size?
	startGame/resumeGame
	pauseGame
	step
	loadSeedPattern
	handleClick
	clearBoard
	drawCells

	toggle gridlines?
	findNeighbors
		isWithinGrid: function (row, col) {
		return row >= 0 && row < this.state.size && col >= 0 && col < this.state.size;
	},

	getNeighbors: function (row, col) {
		var cell = this.state.grid[row][col];
		cell.neighbors = 0;
		for (var i = 0; i < this.state.neighborCells.length; i++) {
			var position = this.state.neighborCells[i];
			var r = position[0];
			var c = position[1];
			if (this.isWithinGrid(row + r, col + c)) {
				var neighbor = this.state.grid[row + r][col + c];
				if (neighbor.isAlive) cell.neighbors++;
			}
		}
	},
	checkRules
	generateRandomBoard
		var game = new Array(data.rows * data.cols).fill(0).map(cell => {
  if (Math.floor(Math.random() * data.randomLive) == 0) {
    cell = 1
  }
  return cell
})

var randomBoard = this.state.game.map(cell => Math.floor(Math.random() * this.state.randomLive) == 0 ? 1 : 0)

data.game = game



@@@@@@@@@@@@@@@@@@@

cell state:
	alive
	age (=> color/opacity?)
	visited
	mouseDown

if(arr[i] == 1) {
    ctx.fillStyle = '#ff0000'
} else {
    fillStyle = '#000000'
}

@@@@@@@@@@@@@@@@@@@@@

cell methods:
	handle mouseOver (?)
	handleClick
	onClick: function () {
		Actions.updateCellStatus(this.props.row, this.props.col);
		this.setState({ isAlive: !this.state.isAlive });
	},

*/

export default Board;