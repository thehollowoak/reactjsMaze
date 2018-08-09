import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  render() {
    return (
      <div className={this.props.className}></div>
    );
  }
}
///

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      directions: [[0,1,0], [0,0,1], [0,0,-1], [0,-1,0], [1,0,0], [-1,0,0]],
      map: this.startingBoard(5,15,15),
    };
    this.makeMaze();
  }

  startingBoard(floors, rows, cols) {
	if (floors%2==0) { floors += 1; }
	if (rows%2==0) { rows += 1; }
	if (cols%2==0) { cols += 1; }
    var map = new Array(floors);
    for(var floor = 0; floor < floors; floor++) {
	    map[floor] = new Array(rows);
	    map[floor][0] = new Array(cols).fill('wall');
	    for(var row = 1; row < rows-1; row++) {
	        map[floor][row] = new Array(cols);
	        map[floor][row][0] = 'wall';
	        for(var col = 1; col < cols-1; col++) {
	          if (floor%2 == 0) {
	            map[floor][row][col] = (col%2 == 1 || row%2 == 1 ? 'space' : 'wall');
	          } else {
	            map[floor][row][col] = (col%2 == 1 && row%2 == 1 && Math.floor(Math.random()*2) == 1 ? 'space' : 'wall');
	          }
	        }
	        map[floor][row][cols-1] = 'wall';
	    }
	    map[floor][rows-1] = new Array(cols);
	    map[floor][rows-1].fill('wall');
	}
    return map;
  }

  makeMaze() {
  	const floors = this.state.map.length;
  	const rows = this.state.map[0].length;
  	const cols = this.state.map[0][0].length;

  	for (var i = 1; i < floors*rows*cols/4; i++) {
      var floor = Math.floor(Math.random()*floors);
      if (floor%2 == 1) { 
      	var row = Math.floor(Math.random()*(rows-1)/2)*2+1;
        var col = Math.floor(Math.random()*(cols-1)/2)*2+1;
      } else {
        var row = Math.floor(Math.random()*(rows-2)+1);
        var col = Math.floor(Math.random()*(cols-2)+1);
        if (row%2 == col%2) { col == (cols-2) ? col-- : col++ }
      }
      if (this.getSquare(floor, row, col) != 'wall') {
        this.setSquare('wall', floor, row, col);
        if (this.blocksPath(floor, row, col, i)) {
          this.setSquare(i, floor, row, col);
        }
      }
    }

    this.markPath(0, 1, 1, 'space');
    const end = Math.floor(Math.random()*((cols-1)/2))*2+1;
    this.setSquare('space', 0, 0, (cols-1)/2);
    this.setSquare('space', floors-1, rows-1, end);
  }

  blocksPath(floor, row, col, i) {
    var paths = new Array();
    for(var dir of this.state.directions) {
      if (this.getSquare(floor, row, col, dir) != 'wall') {
        paths.push([floor+dir[0], row+dir[1], col+dir[2]]);
      }
    }
    this.markPath(paths[0][0], paths[0][1], paths[0][2], i);
    return this.getSquare(paths[0][0], paths[0][1], paths[0][2]) != this.getSquare(paths[1][0], paths[1][1], paths[1][2]);
  }

  markPath(floor, row, col, i) {
    this.setSquare(i, floor, row, col);
    for(var dir of this.state.directions) {
      var next = this.getSquare(floor, row, col, dir);
      if (next != 'wall' && next != i) {
    	this.setSquare(i, floor, row, col, dir);
        this.markPath(floor+2*dir[0], row+2*dir[1], col+2*dir[2], i);
      }
    }
  }

  getSquare(floor, row, col, dir) {
  	if (dir) {
  		floor += dir[0];
  		row += dir[1];
  		col += dir[2];
  	}
  	if (floor < 0 || floor >= this.state.map.length) {
  	  return 'wall';
  	} else {
  	  return this.state.map[floor][row][col];
  	}
  }

  setSquare(value, floor, row, col, dir) {
  	if (dir) {
  		floor += dir[0];
  		row += dir[1];
  		col += dir[2];
  	}
  	this.state.map[floor][row][col] = value;
  }

  renderSquare(z,y,x) {
  	let floor = z;
  	if (this.getSquare(z,y,x,[1,0,0]) != 'wall') {
  	  floor += 2;
  	} else if (this.getSquare(z,y,x,[-1,0,0]) != 'wall') {
  	  floor -= 2;
  	}
  	let className = "square " + this.state.map[z][y][x] + floor;
    return <Square className={className} />;
  }

  renderRow(z,y) {
  	var squares = [];
	for (var i = 0; i < this.state.map[0][0].length; i++) {
	  squares.push(this.renderSquare(z,y,i));
	}
  	return <div className="board-row"> {squares} </div>
  }
  ///

  renderFloor(z) {
  	var rows = [];
	for (var i = 0; i < this.state.map[0].length; i++) {
	  rows.push(this.renderRow(z,i));
	}
  	return <div className="board-row"> {rows} </div>
  }
  ///

  render() {
  	var rows = [];
	for (var i = 0; i < this.state.map.length; i+=2) {
	  rows.push(this.renderFloor(i));
	}
  	return <div> {rows} </div>
  }
  ///
}

ReactDOM.render(
  <Board />,
  document.getElementById('root')
);