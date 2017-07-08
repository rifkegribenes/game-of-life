import React, { Component } from 'react';

class Board extends Component {
  constructor() {
    super();
    this.state = {
      // width: 72,
      // height: 54,
      width: 12,
      height: 9,
      cellSize: 16,
      cells: [],
      nextCells: [],
      generation: 0,
      running: false,
      changed: [],
      static: [],
      testIndex: 8,
    };

    this.newBoard = this.newBoard.bind(this);
  }

  componentDidMount() {
    this.randomBoard();
  }

  handleChange(e) {
  	let testIndex = e.target.value;
    this.setState((prevState, props) => ({ testIndex }));
  }

  randomBoard() {
    const cells = new Array(this.state.height * this.state.width).fill(0).map(cell => Math.random() >= 0.5 ? 1 : 0);
    this.setState((prevState, props) => ({ cells }), () => {
      this.drawCells(this.state.cells);
    });
  }

  drawCell(x, y, bool) {
	  const canvas = document.getElementById('board');
    const ctx = canvas.getContext('2d');
    const size = this.state.cellSize;
    const radius = .4 * size;
    if (bool) {
      ctx.lineJoin = 'round';
      ctx.lineWidth = radius;
      ctx.strokeRect(x + radius/2, y + radius/2, size-radius, size-radius);
      ctx.fillStyle = 'black';
      ctx.fillRect(x + radius/2, y + radius/2, size-radius, size-radius);
    } else {
    	ctx.fillStyle = 'white'
      ctx.fillRect(x, y, size, size);
    }
  }

  drawCells(changed) {
  	if (this.state.changed && this.state.changed.length) {
  		console.log('changes');
    this.state.cells.forEach((cell, idx) => {
    	if (changed.indexOf(idx) !== -1) {
      const x = this.state.cellSize * (idx % this.state.width);
      const y = this.state.cellSize * (Math.floor(idx / this.state.width));
      const bool = this.state.cells[idx];
      this.drawCell(x, y, bool);
    }
    });
  } else {
  	console.log('newBoard');
  	this.state.cells.forEach((cell, idx) => {
      const x = this.state.cellSize * (idx % this.state.width);
      const y = this.state.cellSize * (Math.floor(idx / this.state.width));
      const bool = this.state.cells[idx];
      this.drawCell(x, y, bool);
  });
  }
}

  wrapAdjust(c,r) {
  	if (c=-1) {c=this.state.width-1};
  	if (r=-1) {r=this.state.height-1};
  	if (c=this.state.width) {c=0};
  	if (r=this.state.height) {r=0};
  	return[c,r];
  }

  idxToCR(i) {
  	let c = i % this.state.width;
  	let r = Math.floor(i / this.state.width);
  	return[c,r];
  }

// given a columnn and row, adjust for wrapping to other side of board and return index (move this to utlis later, then clean up 'this')
  crAdjToI(c,r) {
  	if (c==-1) {c=this.state.width-1};
  	if (r==-1) {r=this.state.height-1};
  	if (c==this.state.width) {c=0};
  	if (r==this.state.height) {r=0};
  	return c + (r*this.state.width);
  }

  liveNbCount(i){
  	let neighbors = [];
  	let neighborVals = []
  	let c = i % this.state.width;
  	let r = Math.floor(i / this.state.width);
  	let cells = this.state.cells;
  	neighbors.push(
  		cells[this.crAdjToI(c, r-1)],
  		cells[this.crAdjToI(c+1, r-1)],
  		cells[this.crAdjToI(c-1, r-1)],
  		cells[this.crAdjToI(c+1, r)],
  		cells[this.crAdjToI(c-1, r)],
  		cells[this.crAdjToI(c, r+1)],
  		cells[this.crAdjToI(c+1, r+1)],
  		cells[this.crAdjToI(c+1, r+1)]
  		);
		return neighbors.reduce((a, b) => a + b);
	}

	newBoard() {
		let nextCells = [];
		if (!this.state.changed || !this.state.changed.length) {
			let currentBoard = this.state.cells;
			let nextCells = currentBoard.map((cell, i) => {
				 return ((cell == 1) && (this.liveNbCount(i) == 2 || this.liveNbCount(i) == 3)) || ((cell == 0) && this.liveNbCount(i) == 3) ? 1 : 0;
			});
			let changed = [];
			nextCells.map((cell, i) => {
				if (cell !== currentBoard[i]) {changed.push(i)}
			});
			console.log('121 nextCells: ', nextCells);
			console.log('122 changed: ', changed);
			this.setState((prevState, props) => ({ cells: nextCells, changed }), () => {
      	this.drawCells(changed);
    });
			}  else {
		let changed = this.state.changed;
		let nextCells = changed.map((cell, i) => {
				 return ((cell == 1) && (this.liveNbCount(i) == 2 || this.liveNbCount(i) == 3)) || ((cell == 0) && this.liveNbCount(i) == 3) ? 1 : 0;
			});
	}
	console.log('123', nextCells);
		let changed = nextCells.forEach((cell, i) => {
				if (cell !== currentBoard[i]) {return i}
			});
			console.log('nextCells: ', nextCells);
			console.log('changed: ', changed);
		this.setState((prevState, props) => ({ cells: nextCells, changed }), () => {
      this.drawCells(changed);
    });
	}


  render() {
  	let arr = this.idxToCR(this.state.testIndex);
    return (
    	<div>
    	<input type="number" name="testIndex" value={this.state.testIndex} onChange={(e)=>this.handleChange(e)} />
    	<br />
    	<button onClick={()=>this.newBoard()}>New Board</button>
    	<div>Live Neighbors of cell at index {this.state.testIndex}: {this.liveNbCount(this.state.testIndex)}</div>
    	<div>crAdjToI of cell at index {this.state.testIndex}: {this.crAdjToI(arr[0], arr[1])}</div>
    	<div>idxToCR of cell at index {this.state.testIndex}: c: {arr[0]}, r: {arr[1]}</div>
      <canvas id="board" width={this.state.width*this.state.cellSize} height={this.state.height*this.state.cellSize} />
      </div>
    );
  }


	}

export default Board;
