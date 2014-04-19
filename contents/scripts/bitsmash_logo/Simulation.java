import java.util.*;
import processing.core.*;

// TODO: apply explosion force to multiple cells
// # Simulation
// The cellular automata simulation.
public class Simulation {
	public int gridX;
	public int gridY;
	public Cell[] cells;
	public Cell[] newCells;
	public int[] colors;
	public int cellSize;
	private PApplet app;
	private int deadColor = 0;
	public PVector offset;
	public int randomSeed = Integer.MIN_VALUE;
	public boolean hasExploded = false;

	// ## Constructor
	// Creates a new simluation.
	public Simulation(PApplet app, int x, int y, int cellSize, int[] colors) {
		this.app = app;
		gridX = x;
		gridY = y;
		cells = new Cell[gridX * gridY];	
		newCells = new Cell[gridX * gridY];	
		this.cellSize = cellSize;
		this.colors = colors;
	}

	// ## initialize
	// Initializes the simulation, filling the board with cells
	public void initialize() {
		// set seed, if defined
		if (randomSeed > Integer.MIN_VALUE) {
			app.randomSeed(randomSeed);
		}

		for (int x = 0; x < gridX; x++) {
			for (int y = 0; y < gridY; y++) {
				Cell c = new Cell(
					app,
					cellSize,
					colors[(int)app.random(colors.length)],
					true
				);
				c.position = PVector.add(offset, new PVector(x * cellSize, y * cellSize));
				cells[x + (y * gridX)] = c;
				newCells[x + (y * gridX)] = c;
			}
		}
	}

	public void draw() {
		for (int x = 0; x < gridX; x++) {
			for (int y = 0; y < gridY; y++) {
				Cell c = cells[x + (y * gridX)];
				c.draw();
			}
		}
	}

	// ## sameNeighborCount
	// Returns the number of surrounding neighbors that have the same color
	public int sameNeighborCount(int x, int y) {
		int radius = 1;
		int count = 0;
		int posX, posY;
		Cell c, me;

		me = cells[x + (y * gridX)];

		for (int nx = -radius; nx <= radius; nx++) {
			posX = x + nx;
			if (posX < 0 || posX >= gridX) {
				// out of bounds
			} else {
				for (int ny = -radius; ny <= radius; ny++) {
					// skip myself
					if (nx != 0 && ny != 0) {
						posY = y + ny;
						if (posY < 0 || posY >= gridY) {
							// out of bounds
						} else {
							// valid position
							// make sure the cell has the same color and is active
							c = cells[posX + (posY * gridX)];
							if (c.cellColor == me.cellColor && c.isActive) {
								count++;
							}
						}
					}
				}
			}
		}

		return count;
	}

	// ## mostPopulousColor
	// Returns the most populous color of the neighboring cells (minimum of 3 cells).
	// Returns Integer.MIN_VALUE when there are not at least 3 neighboring cells with the same
	// color.
	public int mostPopulousColor(int x, int y) {
		int radius = 1;
		int posX, posY;
		int populousColor = Integer.MIN_VALUE;
		HashMap<Integer, Integer> neighborColors = new HashMap<Integer, Integer>();
		Cell c, me;

		me = cells[x + (y * gridX)];

		for (int nx = -radius; nx <= radius; nx++) {
			posX = x + nx;
			if (posX < 0 || posX >= gridX) {
				// out of bounds
			} else {
				for (int ny = -radius; ny <= radius; ny++) {
					// skip myself
					if (!(nx == 0 && ny == 0)) {
						posY = y + ny;

						if (posY < 0 || posY >= gridY) {
							// out of bounds
						} else {
							// valid position
							// only consider active cells
							c = cells[posX + (posY * gridX)];
							if (c.isActive) {
								if (neighborColors.get(c.cellColor) != null) {
									neighborColors.put(c.cellColor, neighborColors.get(c.cellColor) + 1);
								} else {
									// new entry
									neighborColors.put(c.cellColor, 1);
								}
							}
						}
					}
				}
			}
		}

		// iterate and find most populous color
		// there must be at least 3 neighbors with the same color to count
		int max = 2;
		for (Map.Entry<Integer, Integer> entry : neighborColors.entrySet()) {
			if (entry.getValue() > max) {
				max = entry.getValue();
				populousColor = entry.getKey();
			}
		}

		return populousColor;
	}


	// ## step
	// Calculates the next step of the simulation.
	public void step() {
		// calculate new values
		for (int x = 0; x < gridX; x++) {
			for (int y = 0; y < gridY; y++) {
				Cell c = cells[x + (y * gridX)];
				Cell newCell = newCells[x + (y * gridX)];

				int neighborCount = sameNeighborCount(x, y);

				if (c.isActive) {
					if (neighborCount < 2) {
						// all alone, die of loneliness
						newCell.isActive = false;
						newCell.cellColor = app.color(deadColor);
					}
					else if (neighborCount > 3) {
						newCell.isActive = false;
						newCell.cellColor = app.color(deadColor);
					}
				} else {
					// Dead cells can be reborn if surrounded by enough neighbors of the same
					// color. The cell will be reborn using the most prominent color.
					int populousColor = mostPopulousColor(x, y);
					if (populousColor > Integer.MIN_VALUE) {
						newCell.isActive = true;
						newCell.cellColor = populousColor;
					}
				}
			}
		}

		// update to new state
		for (int i = 0; i < cells.length; i++) {
			cells[i].isActive = newCells[i].isActive;
			cells[i].cellColor = newCells[i].cellColor;
		}
	}

	// ## explode
	// Explodes the simulation, with the force centered at (x, y)
	// and defined by PVector `force`.
	public void explode(int posX, int posY, PVector force) {
		if (posX >= gridX || posY >= gridY) {
			return;
		}

		hasExploded = true;

		// explosion force is a direct, linear blast
		PVector vPos = new PVector(posX, posY);
		PVector unitForce = force.normalize(null);
		app.println(unitForce);

		while (vPos.x < gridX && vPos.y < gridY && vPos.x >= 0 & vPos.y >= 0) {
			cells[app.round(vPos.x) + (app.round(vPos.y) * gridX)].setVelocity(force);
			vPos.add(unitForce);

			vPos.x = app.round(vPos.x);
			vPos.y = app.round(vPos.y);
		}
		// cells[posX + (posY * gridX)].setVelocity(force);
	}

	public void physicsUpdate() {
		for (int i = 0; i < cells.length; i++) {
			Cell c = cells[i];

			// check for collisions
			// one check per unique combination
			for (int j = i + 1; j < cells.length; j++) {
				Cell c2 = cells[j];

				// apply force to colliding neighbor
				if (doOverlap(c, c2)) {
					// calculate normal
					PVector normal = new PVector(c2.position.x, c2.position.y);
					normal.sub(c.position);

					float mag = normal.mag();
					normal.normalize();

					// minimum translation distance
					PVector mtd = PVector.mult(normal, cellSize - mag);

					// calculate tangent
					PVector tangent = new PVector(-normal.y, normal.x);
					tangent.normalize();

					// calculate new velocity magnitudes
					float cMagNormal = PVector.dot(c.getVelocity(), normal);
					float cMagTangent = PVector.dot(c.getVelocity(), tangent);
					float c2MagNormal = PVector.dot(c2.getVelocity(), normal);
					float c2MagTangent = PVector.dot(c2.getVelocity(), tangent);

					// NOTE: tangential velocities remain unchanged
					// we just need to calculate new normal velocities
					// Use the [one-dimensional elastic collision formula](http://en.wikipedia.org/wiki/Elastic_collision)
					// when simplified, assuming same mass for every cell,
					// the equation reduces down to a simple switching of velocities
					PVector cNew = PVector.mult(normal, c2MagNormal);
					PVector c2New = PVector.mult(normal, cMagNormal);
					cNew.add(PVector.mult(tangent, cMagTangent));
					c2New.add(PVector.mult(tangent, c2MagTangent));

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
	public boolean doOverlap(Cell a, Cell b) {
		float dx = a.position.x - b.position.x;
		float dy = a.position.y - b.position.y;
		float cellSizeF = (float) cellSize;
		//cellSizeF = cellSizeF - .2f;
		//app.println("cellSizeF: " + cellSizeF);

		// simple box check
		if (app.abs(dx) < cellSizeF && app.abs(dy) < cellSizeF) {
			return true;
		}

		return false;
	}
}
