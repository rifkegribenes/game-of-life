import React, { Component } from 'react';

class Board extends Component {
  constructor() {
    super();
    this.state = {
      width: 72,
      height: 54,
      cellSize: 12,
      cells: [],
      nextCells: [],
      generation: 0,
      running: false,
      changed: [],
      cellsToUpdate: [],
      static: [],
    };

    this.newBoard = this.newBoard.bind(this);
  }

  componentDidMount() {
    this.randomBoard();
    this.drawGrid();
  }

  handleChange(e) {
    const testIndex = e.target.value;
    this.setState(() => ({ testIndex }));
  }

  randomBoard() {
    const cells = new Array(this.state.height * this.state.width).fill(0).map(() => {
      if (Math.random() >= 0.7) {
        return 1;
      }
      return 0;
    });
    const testIndex = Math.floor(Math.random() * this.state.height * this.state.width);
    this.setState(() => ({ cells, testIndex }), () => {
      this.drawCells();
    });
  }

  drawGrid() {
    const canvas = document.getElementById('grid');
    const ctx = canvas.getContext('2d');
    for (let i = 0; i <= this.state.width; i++) {
      ctx.beginPath();
      ctx.moveTo(i * this.state.cellSize, 0);
      ctx.lineTo(i * this.state.cellSize, this.state.height * this.state.cellSize);
      ctx.strokeStyle = '#cecece';
      ctx.stroke();
    }
    for (let i = 0; i <= this.state.width; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * this.state.cellSize);
      ctx.lineTo(this.state.width * this.state.cellSize, i * this.state.cellSize);
      ctx.strokeStyle = '#cecece';
      ctx.stroke();
    }
  }

  drawCell(x, y, bool, test) {
    const canvas = document.getElementById('board');
    const ctx = canvas.getContext('2d');
    const size = this.state.cellSize;
    const radius = 0.4 * size;
    if (bool) {
      ctx.lineJoin = 'round';
      ctx.lineWidth = radius;
      ctx.strokeRect(x + (radius / 2), y + (radius / 2), size - radius, size - radius);
      if (test) {
        ctx.fillStyle = 'red';
      } else { ctx.fillStyle = 'black'; }
      ctx.fillRect(x + (radius / 2), y + (radius / 2), size - radius, size - radius);
    } else {
      if (test) {
        ctx.fillStyle = 'pink';
      } else { ctx.fillStyle = 'white'; }
      ctx.fillRect(x, y, size, size);
    }
  }

  drawCells() {
    this.state.cells.forEach((cell, idx) => {
      const x = this.state.cellSize * (idx % this.state.width);
      const y = this.state.cellSize * (Math.floor(idx / this.state.width));
      const bool = this.state.cells[idx];
      const test = idx === this.state.testIndex;
      this.drawCell(x, y, bool, test);
    });
  }

  idxToCR(i) {
    const c = i % this.state.width;
    const r = Math.floor(i / this.state.width);
    return [c, r];
  }

// given a columnn and row, adjust for wrapping to other side of board and return index
// (move this to utlis later, then clean up 'this')
  crAdjToI(c, r) {
    let adjC = c;
    let adjR = r;
    if (c === -1) { adjC = this.state.width - 1; }
    if (r === -1) { adjR = this.state.height - 1; }
    if (c === this.state.width) { adjC = 0; }
    if (r === this.state.height) { adjR = 0; }
    return adjC + (adjR * this.state.width);
  }

  liveNbCount(i) {
    const neighbors = [];
    const c = i % this.state.width;
    const r = Math.floor(i / this.state.width);
    const cells = this.state.cells;
    neighbors.push(
cells[this.crAdjToI(c, r - 1)],
cells[this.crAdjToI(c + 1, r - 1)],
cells[this.crAdjToI(c - 1, r - 1)],
cells[this.crAdjToI(c + 1, r)],
cells[this.crAdjToI(c - 1, r)],
cells[this.crAdjToI(c, r + 1)],
cells[this.crAdjToI(c + 1, r + 1)],
cells[this.crAdjToI(c - 1, r + 1)],
);
    return neighbors.reduce((a, b) => a + b);
  }

  newBoard() {
    let nextCells = [];
    const currentBoard = this.state.cells;
    nextCells = currentBoard.map((cell, i) => {
      if (((cell === 1) && (this.liveNbCount(i) === 2 || this.liveNbCount(i) === 3))
|| ((cell === 0) && this.liveNbCount(i) === 3)) {
        return 1;
      }
      return 0;
    });
    this.setState(() => ({ cells: nextCells }), () => {
      this.drawCells();
    });
  }


  render() {
    const arr = this.idxToCR(this.state.testIndex);
    return (
      <div>
        <input type="number" name="testIndex" value={this.state.testIndex} onChange={e => this.handleChange(e)} />
        <br />
        <button onClick={() => this.newBoard()}>New Board</button>
        <div>Live Neighbors of cell at index {this.state.testIndex}:
<br /> {this.liveNbCount(this.state.testIndex)}</div>
        <div>crAdjToI of cell at index {this.state.testIndex}:
<br /> {this.crAdjToI(arr[0], arr[1])}</div>
        <div>idxToCR of cell at index {this.state.testIndex}:
<br /> c: {arr[0]}, r: {arr[1]}</div>
        <canvas id="board" width={this.state.width * this.state.cellSize} height={this.state.height * this.state.cellSize} />
        <canvas id="grid" width={this.state.width * this.state.cellSize} height={this.state.height * this.state.cellSize} />
      </div>
    );
  }


}

export default Board;
