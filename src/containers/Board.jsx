import React, { Component } from 'react';

class Board extends Component {
  constructor() {
    super();
    this.state = {
      width: 72,
      height: 54,
      cellSize: 10,
      cells: [],
      nextCells: [],
      generation: 0,
      running: true,
      paused: false,
      changed: [],
      static: [],
      grid: false,
      trails: true,
    };

    this.step = this.step.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.reset = this.reset.bind(this);
    this.toggleGrid = this.toggleGrid.bind(this);
    // this.toggleTrails = this.toggleTrails.bind(this);
  }

  componentDidMount() {
    this.randomBoard();
    this.drawGrid();
    this.play();
  }

  randomBoard() {
    const cells = new Array(this.state.height * this.state.width).fill(0).map(() => {
      if (Math.random() >= 0.7) {
        return 1;
      }
      return 0;
    });
    this.setState(() => ({ cells }), () => {
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

  drawCell(x, y, bool) {
    const canvas = document.getElementById('board');
    const ctx = canvas.getContext('2d');
    const size = this.state.cellSize;
    const radius = 0.4 * size;
    if (bool) {
      ctx.lineJoin = 'round';
      ctx.lineWidth = radius;
      ctx.strokeRect(x + (radius / 2), y + (radius / 2), size - radius, size - radius);
      ctx.fillStyle = `hsl(${(x + y) % 255}, 50%, 50%)`;
      ctx.fillRect(x + (radius / 2), y + (radius / 2), size - radius, size - radius);
    } else {
      ctx.fillStyle = 'black';
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

  step() {
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

  play() {
    this.setState({
      running: true,
    }, () => { this.run(); });
  }

  run() {
    const self = this;
    function nextStep() {
      if (!self.state.running) { window.clearInterval(window.interval); return; }
      const generation = self.state.generation + 1;
      self.setState({
        generation,
      }, () => {
        self.step();
      });
    }
    if (this.state.running) {
      window.interval = window.setInterval(nextStep, 10);
    }
  }

  pause() {
    window.clearInterval(window.interval);
    this.setState({
      running: false,
    });
  }

  reset() {
    window.clearInterval(window.interval);
    this.setState({
      running: false,
    }, () => { this.randomBoard(); });
  }

  toggleGrid() {
    const grid = !this.state.grid;
    this.setState({ grid });
  }

  toggleSpeed() {
    const speed = this.state.speed;
    let newSpeed = speed;
    if (speed === 10) {
      newSpeed = 100;
    } else if (speed === 100) {
      newSpeed = 200;
    } else {
      newSpeed = 10;
    }
    this.setState({
      speed: newSpeed,
    }, () => { this.play(); });
  }

  // toggleTrails() {}


  render() {
    return (
      <div>
        <button onClick={() => this.step()}>Step</button>
        <button onClick={() => this.play()}>Play</button>
        <button onClick={() => this.pause()}>Pause</button>
        <button onClick={() => this.reset()}>Reset</button>
        <button onClick={() => this.toggleGrid()}>{this.state.grid ? 'Hide Grid' : 'Show Grid'}</button>
        <button onClick={() => this.toggleTrails()}>{this.state.trails ? 'Hide Trails' : 'Show Trails'}</button>
        <div>Generation: {this.state.generation}</div>
        <canvas id="board" width={this.state.width * this.state.cellSize} height={this.state.height * this.state.cellSize} />
        <canvas id="grid" className={this.state.grid ? 'visible' : 'hidden'} width={this.state.width * this.state.cellSize} height={this.state.height * this.state.cellSize} />
      </div>
    );
  }


}

export default Board;
