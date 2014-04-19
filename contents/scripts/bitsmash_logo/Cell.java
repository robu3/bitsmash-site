import java.util.*;
import processing.core.*;

// # Cell
// A single cell in our cellular automata simulation.
// A cell has the following properties:
// 
// - size: the length of a single side (every cell is square)
// - cellColor: the color of the cell
// - isActive: whether or not the cell is active (displayed)
// - position: the cell's current position
public class Cell {
	public int size;
	public int cellColor;
	public boolean isActive;
	public PVector position;
	private PApplet app;
	private PVector velocity;
	private float velocityDecay;

	// ## Constructor
	public Cell(PApplet app, int size, int cellColor, boolean isActive) {
		this.app = app;
		this.size = size;
		this.cellColor = cellColor;
		this.isActive = isActive;
		this.velocity = new PVector(0, 0);
		velocityDecay = .05f;
	}

	// ## draw()
	// Draws the cell at its current position
	public void draw() {
		app.noStroke();
		app.fill(cellColor);
		app.rect((int)position.x, (int)position.y, size, size);
	}

	public PVector addVelocity(PVector v) {
		velocity.add(v);
		return velocity;
	}

	public PVector setVelocity(PVector v) {
		velocity = v;
		return velocity;
	}

	public void decayVelocity() {
		if (velocity.mag() > 0f) {
			velocity.lerp(0, 0, 0, velocityDecay);
		}
	}
	
	public PVector getVelocity() {
		return velocity;
	}

	// ## physicsUpdate
	public void physicsUpdate() {
		position = PVector.add(position, velocity);
		decayVelocity();
	}
}
