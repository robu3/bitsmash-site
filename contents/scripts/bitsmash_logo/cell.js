// # Cell
// A single cell in our cellular automata simulation.
// A cell has the following properties:
// 
// - size: the length of a single side (every cell is square)
// - cellColor: the color of the cell
// - isActive: whether or not the cell is active (displayed)
// - position: the cell's current position
function Cell(app, size, cellColor, isActive) {
	this.app = app;
	this.size = size;
	this.cellColor = cellColor;
	this.isActive = isActive;
	this.velocity = new app.PVector(0, 0);
	this.velocityDecay = .05;

	// pull PVector into the global space
	if (!PVector) {
		PVector = app.PVector;
	}

	// ---------
	// functions
	// ---------

	// ## draw()
	// Draws the cell at its current position
	this.draw = function () {
		this.app.noStroke();
		this.app.fill(this.cellColor);
		this.app.rect(this.position.x, this.position.y, this.size, this.size);
	};

	this.addVelocity = function (v) {
		this.velocity.add(v);
		return this.velocity;
	};

	this.setVelocity = function (v) {
		this.velocity = v;
		return this.velocity;
	};

	this.getVelocity = function() {
		return this.velocity;
	};

	this.decayVelocity = function () {
		if (this.velocity.mag() > 0) {
			this.velocity.lerp(0, 0, 0, this.velocityDecay);
		}
	};

	// ## physicsUpdate
	this.physicsUpdate = function () {
		this.position = PVector.add(this.position, this.velocity);
		this.decayVelocity();
	};
}
