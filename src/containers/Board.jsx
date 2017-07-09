import React, { Component } from 'react';
import patterns from './patterns';

class Board extends Component {
  constructor() {
    super();
    this.state = {
      width: 75,
      height: 50,
      cellSize: 14,
      cells: [],
      nextCells: [],
      generation: 0,
      running: true,
      paused: false,
      changed: [],
      static: [],
      trails: true,
    };

    this.step = this.step.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    this.randomBoard();
    this.play();
  }

  randomBoard() {
    const cells = new Array(this.state.height * this.state.width).fill(0).map(() => {
      if (Math.random() >= 0.8) {
        return 1;
      }
      return 0;
    });
    this.setState(() => ({ cells }), () => {
      this.drawCells(cells);
    });
  }

  drawCell(x, y, bool) {
    const { cellSize } = this.state;
    const canvas = document.getElementById('board');
    const ctx = canvas.getContext('2d');
    const radius = 0.4 * cellSize;
    const hue = ((x + y) / 4) % 360;
    if (bool) {
      ctx.lineJoin = 'round';
      ctx.lineWidth = radius;
      ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.strokeRect(x + (radius / 2), y + (radius / 2), cellSize - radius, cellSize - radius);
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.fillRect(x + (radius / 2), y + (radius / 2), cellSize - radius, cellSize - radius);
    } else {
      ctx.fillStyle = 'black';
      ctx.fillRect(x, y, cellSize, cellSize);
    }
  }

  drawCells(arr) {
    arr.forEach((cell, idx) => {
      if (cell !== undefined) {
        const x = this.state.cellSize * (idx % this.state.width);
        const y = this.state.cellSize * (Math.floor(idx / this.state.width));
        const bool = this.state.cells[idx];
        this.drawCell(x, y, bool);
      }
    });
  }

  xyToIdx(x, y) {
    const c = Math.floor(x / this.state.cellSize);
    const r = Math.floor(y / this.state.cellSize);
    return c + (r * this.state.width);
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
    const changed = nextCells.map((cell, i) => {
      if (cell !== currentBoard[i]) {
        return cell;
      }
      return undefined;
    });
    this.setState(() => ({ cells: nextCells }), () => {
      this.drawCells(changed);
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
      running: false, generation: 0,
    }, () => {
      this.randomBoard();
      this.play();
    });
  }

  loadPattern(pattern) {
    const cells = patterns[pattern];
    this.setState(() => ({ cells, generation: 0 }), () => {
      this.drawCells(cells);
    });
  }

  handleClick(e) {
    const target = e.target || e.srcElement;
    const rect = target.getBoundingClientRect();
    const offsetX = Math.floor(e.clientX - rect.left);
    const offsetY = Math.floor(e.clientY - rect.top);
    const x = offsetX - (offsetX % this.state.cellSize);
    const y = offsetY - (offsetY % this.state.cellSize);
    this.drawCell(x, y, true);
    const idx = this.xyToIdx(x, y);
    const cells = this.state.cells;
    cells.splice(idx, 1, 1);
    this.setState({ cells }, () => {
      this.step();
    });
  }


  render() {
    return (
      <div>
        <h2>Conway&rsquo;s Game of Life</h2>
        <h3><a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank" rel="noopener noreferrer">About the game</a>
        &nbsp;•&nbsp;<a href="https://github.com/rifkegribenes/game-of-life" target="_blank" rel="noopener noreferrer">See code on GitHub</a></h3>
        <p className="center">Click cells next to static patterns to re-activate them</p>
        <div className="controls">
          <div className="generation">Generation:
          <div className="counter">{this.state.generation}</div>
          </div>
          <button className="btn waves-effect play" onClick={() => this.play()} />
          <button className="btn waves-effect pause" onClick={() => this.pause()} />
          <button className="btn waves-effect random" onClick={() => this.reset()} />
          <button className="btn waves-effect pattern" onClick={() => this.loadPattern('gliderGun')}>glider gun</button>
          <button className="btn waves-effect pattern" onClick={() => this.loadPattern('acorn')}>acorn</button>
        </div>
        <canvas
          id="board"
          className="board"
          onClick={e => this.handleClick(e)}
          width={this.state.width * this.state.cellSize}
          height={this.state.height * this.state.cellSize}
        />
      </div>
    );
  }


}

export default Board;
