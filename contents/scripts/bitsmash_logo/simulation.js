// # Simulation
// The "simulation" that generates the logo.
// Had to rewrite this piece in JS, originally was in Java.

function Simulation(app, gridX, gridY, cellSize, colors) {
	this.app = app;
	this.gridX = gridX;
	this.gridY = gridY;
	this.cellSize = cellSize;
	this.colors = colors;

	// init vars
	this.deadColor = 0;
	this.offset = new app.PVector(0, 0);
	this.hasExploded = false;
	this.randomSeed = null;

	// init state lists
	this.cells = [];
	this.newCells = [];


	// ---------
	// functions
	// ---------

	// ## initialize
	// Initializes the simulation, filling the board with cells
	this.initialize = function () {
		var me = this,
			c, x, y;

		if (me.randomSeed !== null) {
			me.app.randomSeed(me.randomSeed);
		}

		for (x = 0; x < me.gridX; x++) {
			for (y = 0; y < me.gridY; y++) {
				c = new Cell(
					me.app,
					me.cellSize,
					me.colors[Math.floor(app.random(me.colors.length))],
					true
				);
				c.position = app.PVector.add(me.offset, new app.PVector(x * me.cellSize, y * me.cellSize));
				me.cells[x + (y * me.gridX)] = c;
				me.newCells[x + (y * me.gridX)] = c;
			}
		}
	};

	this.draw = function () {
		var me = this,
			c, x, y;

		for (x = 0; x < me.gridX; x++) {
			for (y = 0; y < me.gridY; y++) {
				c = me.cells[x + (y * me.gridX)];
				c.draw();
			}
		}
	};

	// ## sameNeighborCount
	// Returns the number of surrounding neighbors that have the same color
	this.sameNeighborCount = function (x, y) {
		var me = this, 
			radius = 1,
			count = 0,
			posX, posY, c, current;

		current = me.cells[x + (y * gridX)];

		for (var nx = -radius; nx <= radius; nx++) {
			posX = x + nx;
			if (posX < 0 || posX >= gridX) {
				// out of bounds
			} else {
				for (var ny = -radius; ny <= radius; ny++) {
					// skip myself
					if (nx != 0 && ny != 0) {
						posY = y + ny;
						if (posY < 0 || posY >= me.gridY) {
							// out of bounds
						} else {
							// valid position
							// make sure the cell has the same color and is active
							c = me.cells[posX + (posY * me.gridX)];
							if (c.cellColor == current.cellColor && c.isActive) {
								count++;
							}
						}
					}
				}
			}
		}

		return count;
	};

	// ## mostPopulousColor
	// Returns the most populous color of the neighboring cells (minimum of 3 cells).
	// Returns null when there are not at least 3 neighboring cells with the same color.
	this.mostPopulousColor = function (x, y) {
		var me = this, 
			radius = 1,
			populousColor = null,
			neighborColors = {},
			c, current, posX, posY,

		current = me.cells[x + (y * me.gridX)];

		for (var nx = -radius; nx <= radius; nx++) {
			posX = x + nx;
			if (posX < 0 || posX >= me.gridX) {
				// out of bounds
			} else {
				for (var ny = -radius; ny <= radius; ny++) {
					// skip myself
					if (!(nx == 0 && ny == 0)) {
						posY = y + ny;

						if (posY < 0 || posY >= me.gridY) {
							// out of bounds
						} else {
							// valid position
							// only consider active cells
							c = me.cells[posX + (posY * me.gridX)];
							if (c.isActive) {
								if (neighborColors[c.cellColor]) {
									neighborColors[c.cellColor] = neighborColors[c.cellColor] + 1;
								} else {
									// new entry
									neighborColors[c.cellColor] = 1;
								}
							}
						}
					}
				}
			}
		}

		// iterate and find most populous color
		// there must be at least 3 neighbors with the same color to count
		var max = 2,
			k;

		for (k in neighborColors) {
			if (neighborColors[k] > max) {
				max = neighborColors[k];
				// number coercion
				populousColor = k * 1;
			}
		}

		return populousColor;
	};

	// ## step
	// Calculates the next step of the simulation.
	this.step = function () {
		var me = this,
			x, y, i, c, newCell, neighborCount;

		// calculate new values
		for (x = 0; x < me.gridX; x++) {
			for (y = 0; y < me.gridY; y++) {
				c = me.cells[x + (y * me.gridX)];
				newCell = me.newCells[x + (y * me.gridX)];

				neighborCount = me.sameNeighborCount(x, y);

				if (c.isActive) {
					if (neighborCount < 2) {
						// all alone, die of loneliness
						newCell.isActive = false;
						newCell.cellColor = app.color(me.deadColor);
					}
					else if (neighborCount > 3) {
						newCell.isActive = false;
						newCell.cellColor = app.color(me.deadColor);
					}
				} else {
					// Dead cells can be reborn if surrounded by enough neighbors of the same
					// color. The cell will be reborn using the most prominent color.
					var popColor = me.mostPopulousColor(x, y);
					if (popColor !== null) {
						newCell.isActive = true;
						newCell.cellColor = popColor;
					}
				}
			}
		}

		// update to new state
		for (i = 0; i < me.cells.length; i++) {
			me.cells[i].isActive = me.newCells[i].isActive;
			me.cells[i].cellColor = me.newCells[i].cellColor;
		}
	};

	// ## explode
	// Explodes the simulation, with the force centered at (x, y)
	// and defined by PVector `force`.
	this.explode = function (posX, posY, force) {
		console.log("explode()", arguments);
		var me = this;
		if (posX >= me.gridX || posY >= me.gridY) {
			return;
		}

		me.hasExploded = true;

		// explosion force is a direct, linear blast
		var vPos = new app.PVector(posX, posY),
			unitForce = new PVector(force.x, force.y);

		unitForce.normalize();
		console.log("unitForce", unitForce);

		while (vPos.x < me.gridX && vPos.y < me.gridY && vPos.x >= 0 & vPos.y >= 0) {
			me.cells[me.app.round(vPos.x) + (me.app.round(vPos.y) * me.gridX)].setVelocity(force);
			vPos.add(unitForce);

			vPos.x = app.round(vPos.x);
			vPos.y = app.round(vPos.y);
		}
	}

	// ## physicsUpdate
	// Calculates collision forces for all cells.
	this.physicsUpdate = function () {
		var c, c2, i, j,
			normal,
			mag,
			cMagNormal,
			cMagTangent,
			c2MagNormal,
			c2MagTangent,
			tangent,
			cNew,
			c2New;

		for (i = 0; i < this.cells.length; i++) {
			c = this.cells[i];

			// check for collisions
			// one check per unique combination
			for (j = i + 1; j < this.cells.length; j++) {
				c2 = this.cells[j];

				// apply force to colliding neighbor
				if (this.doOverlap(c, c2)) {
					// calculate normal
					normal = new app.PVector(c2.position.x, c2.position.y);
					normal.sub(c.position);

					mag = normal.mag();
					normal.normalize();

					// calculate tangent
					tangent = new app.PVector(-normal.y, normal.x);
					tangent.normalize();

					// calculate new velocity magnitudes
					cMagNormal = app.PVector.dot(c.getVelocity(), normal);
					cMagTangent = app.PVector.dot(c.getVelocity(), tangent);
					c2MagNormal = app.PVector.dot(c2.getVelocity(), normal);
					c2MagTangent = app.PVector.dot(c2.getVelocity(), tangent);

					// NOTE: tangential velocities remain unchanged
					// we just need to calculate new normal velocities
					// Use the [one-dimensional elastic collision formula](http://en.wikipedia.org/wiki/Elastic_collision)
					// when simplified, assuming same mass for every cell,
					// the equation reduces down to a simple switching of velocities
					cNew = app.PVector.mult(normal, c2MagNormal);
					c2New = app.PVector.mult(normal, cMagNormal);
					cNew.add(app.PVector.mult(tangent, cMagTangent));
					c2New.add(app.PVector.mult(tangent, c2MagTangent));

					c.setVelocity(cNew);
					c2.setVelocity(c2New);
				}
			}

			// execute cell's physics calc
			c.physicsUpdate();
		}
	}

	// ## doOverlap
	// Returns true if two cells overlap
	this.doOverlap = function (a, b) {
		var dx = a.position.x - b.position.x,
			dy = a.position.y - b.position.y,
			cellSizeF = this.cellSize;

		// simple box check
		if (this.app.abs(dx) < cellSizeF && this.app.abs(dy) < cellSizeF) {
			return true;
		}

		return false;
	}
}
