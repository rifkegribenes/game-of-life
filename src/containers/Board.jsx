import React, { Component } from 'react';

class Board extends Component {
  constructor() {
    super();
    this.state = {
      width: 72,
      height: 54,
      cells: [],
      generation: 0,
      running: false,
      changed: [],
      static: [],
    };
  }

  componentDidMount() {
    this.randomBoard();
  }

  randomBoard() {
    const cells = new Array(this.state.height * this.state.width).fill(0).map(cell => Math.random() >= 0.5 ? 1 : 0);
    console.log(cells);
    this.setState((prevState, props) => ({ cells }), () => {
      this.drawCells();
    });
  }

  drawCell(x, y, bool) {
    if (bool) {
      const canvas = document.getElementById('board');
      const ctx = canvas.getContext('2d');
      ctx.lineJoin = 'round';
      ctx.lineWidth = 4;
      ctx.strokeRect(x + 2, y + 2, 6, 6);
      ctx.fillStyle = 'black';
      ctx.fillRect(x + 2, y + 2, 6, 6);
    }
  }

  drawCells() {
    this.state.cells.forEach((cell, idx) => {
      const x = 10 * (idx % this.state.width);
      const y = 10 * (Math.floor(idx / this.state.width));
      const bool = this.state.cells[idx];
      this.drawCell(x, y, bool);
    });
  }


  render() {
    return (
      <div />
    );
  }


	}

export default Board;
