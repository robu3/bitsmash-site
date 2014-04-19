import java.nio.*;
import java.util.*;

// # BITSMASH
// Random generation of the BITSMASH logo
Simulation sim;
int maxSteps, steps;
PFont bitsmashFont, subtitleFont;
int bitsmashFontSize, subtitleFontSize;

void setup()  {
	size(1000, 500);
	background(255);

	// initialize font
	bitsmashFontSize = (int)(width * .1f);
	subtitleFontSize = (int)(width * .089f);
	println(bitsmashFontSize);
	println(subtitleFontSize);

	bitsmashFont = createFont("Helvetica", bitsmashFontSize);
	subtitleFont = createFont("Helvetica", subtitleFontSize);

	sim = new Simulation(
		this,
		width / 50,
		width / 50,
		width / 100,
		triadicPalette(color(0, 345, 341))
	);

	sim.offset = new PVector(width * .5f + (sim.gridX * sim.cellSize * .5f), (height *.5f) - (sim.gridY * sim.cellSize * .5f));
	sim.randomSeed = getSeed("BITSMASH");

	// set the number of steps to be the current seconds
	Calendar calendar = Calendar.getInstance();
	maxSteps = calendar.get(Calendar.SECOND);
	steps = 0;

	println("Steps: " + maxSteps);

	sim.initialize();
}

void draw() {
	// draw bitsmash graphic
	background(255);
	sim.draw();

	// then text
	fill(0);
	textFont(bitsmashFont);
	text("BITSMASH", 0, height / 2);
	textFont(subtitleFont);
	text("Studios, LLC", 0, height / 2 + subtitleFontSize);

	if (steps < maxSteps) {
		sim.step();
		steps++;
	} else {
		// finished stepping
		if (!sim.hasExploded) {
			smash();
		} else {
			sim.physicsUpdate();
		}
	}
}

// increment the sim on `ENTER`
void keyPressed() {
	/*
	if (keyCode == ENTER || keyCode == RETURN) {
		sim.step();
	}

	else {
		smash();
	}
	*/
}

// ## getSeed
// Converts a string to an integer.
// This intended use is for a random generator's seed.
int getSeed(String str) {
	byte[] bytes = str.getBytes();
	return ByteBuffer.wrap(bytes).getInt();
}

void smash() {
	println("");
	println("SMASH");

	// use the current position of the second hand on the clock the determine our explosion angle
	Calendar calendar = Calendar.getInstance();
	float angle = max(1f, calendar.get(Calendar.SECOND) * 60f);
	angle = radians(angle);
	PVector smashVector = new PVector(cos(angle), sin(angle));
	smashVector.mult(25);

	println("Smash angle: " + angle);

	sim.explode(sim.gridX / 2, sim.gridY / 2, smashVector);
}

int[] triadicPalette(int base) {
	int a = (base >> 24) & 0xFF;
	int r = (base >> 16) & 0xFF;
	int g = (base >> 8) & 0xFF;
	int b = base & 0xFF;

	int[] colors = new int[3];;
	 // rgb
	colors[0] = base;
	// bgr
	colors[1] = a << 24 | b << 16 | r << 8 | g;
	// gbr
	colors[2] = a << 24 | g << 16 | b << 8 | r;
	return colors;
}
