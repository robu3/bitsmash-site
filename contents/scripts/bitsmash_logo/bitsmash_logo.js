// ## triadicPalette
// Returns a triad of colors evenly spaced on the color wheel,
// based on the provided color.
function triadicPalette(base) {
	var a = (base >> 24) & 0xFF,
		r = (base >> 16) & 0xFF,
		g = (base >> 8) & 0xFF,
		b = base & 0xFF,
		colors = [];

	 // rgb
	colors[0] = base;
	// bgr
	colors[1] = a << 24 | b << 16 | r << 8 | g;
	// gbr
	colors[2] = a << 24 | g << 16 | b << 8 | r;

	return colors;
}

// ## stringToBytes
// Converts a js string to byte array
// original code from:
// http://stackoverflow.com/questions/1240408/reading-bytes-from-a-javascript-string
function stringToBytes(str) {
	var ch, stack, i,
		bytes = [];

	for (i = 0; i < str.length; i++) {
		ch = str.charCodeAt(i);
		stack = [];

		while (ch) {
			// push byte to stack
			// and shift char down one byte
			stack.push(ch & 0xFF);
			ch = ch >> 8;
		}

		// reverse the stack, because chars has the "wrong" endianess
		bytes = bytes.concat(stack.reverse());
	}

	return bytes;
}

// ## bytesToInt
// converts an array of bytes to an integer
// currently capped at 4 bytes (the size of an int in javascript)
function bytesToInt(bytes) {
	var val = 0,
		max = bytes.length > 4 ? 4 : bytes.length,
		i;

	// have to read it backwards
	for (i = max - 1; i >= 0; i--) {
		val = (val * 256) + (bytes[i] * 1);
	}

	return val;
}


// ## bootstrap
// Bootstraps the logo generation process.
//
// Params:
//
// - app: processing.js app instance
// - seedText: text to be used as the seed for the logo
// - options: hashmap defining additional (optional) parameters
//		* angle: angle to explode along (in degrees)
//
function bootstrap(app, seedText, options) {
	console.log("bootstrap()");
	options = options || {};

	var sim,
		maxSteps,
		steps;

	app.setup = function () {
		app.size(1000, 400);
		app.background(255);

		// set offset
		app.offset = new app.PVector(100, 0);

		// removing for now; displaying using regular page html & css
		// setup fonts
		//app.bitsmashFontSize = (app.height * .25);
		//app.subtitleFontSize = (app.height * .22);
		//app.bitsmashFont = app.createFont("Open Sans Bold", app.bitsmashFontSize);
		//app.subtitleFont = app.createFont("Open Sans", app.subtitleFontSize);

		sim = new Simulation(
			app,
			20,
			20,
			app.height / 20 * .5,
			triadicPalette(app.color(0, 345, 341))
		);

		sim.offset = app.PVector.add(
				app.offset,
				new app.PVector(app.width * .5 + (sim.gridX * sim.cellSize * .5), (app.height *.5) - (sim.gridY * sim.cellSize * .5))
		);

		// set the seed
		sim.randomSeed = app.getSeed(seedText);
		console.log("randomSeed: " + sim.randomSeed);

		maxSteps = 20;//new Date().getSeconds();
		steps = 0;

		sim.initialize();
	};

	app.draw = function () {
		if (app.doDraw) {
			// draw bitsmash graphic
			app.background(255);
			sim.draw();

			// then text
			// handling in html & css for now
			/*
			app.fill(0);
			app.textFont(app.bitsmashFont);
			app.text("BITSMASH", app.offset.x, app.height / 2 - 5);
			app.textFont(app.subtitleFont);
			app.text("Studios, LLC", app.offset.x, app.height / 2 + app.subtitleFontSize - 5);
			*/

			if (steps < maxSteps) {
				sim.step();
				steps++;
			} else {
				// finished stepping
				if (!sim.hasExploded) {
					app.smash();
				} else {
					sim.physicsUpdate();
				}
			}
		}
	};

	app.smash = function () {
		// use the provided angle, or if not defined,
		// the current position of the second hand on the clock the determine our explosion angle
		// make sure that there is a slight angle, for a more interesting explosion
		// add to angles that are close the cardinal directions
		var angle;
		if (options.angle) {
			angle = options.angle;
			angle = app.radians(angle);
		} else {
			angle = app.max(1, (new Date()).getSeconds() * 60);

			angle = app.radians(angle);
			if (angle % 45 < 20) {
				angle += 10;
			}
		}

		smashVector = new app.PVector(app.cos(angle), app.sin(angle));
		smashVector.mult(25);

		console.log("Smash angle: " + angle);
		console.log("Smash vector: ", smashVector);

		sim.explode(sim.gridX / 2, sim.gridY / 2, smashVector);
	};

	app.getSeed = function (str) {
		var bytes = stringToBytes(str);
		return bytesToInt(bytes);
	};

	// adding a flag to turn on/off the rendering of the logo
	// after the generation and physics sim are done, we don't
	// need to keep on drawing it.
	app.doDraw = true;

	// run it
	app.setup();
	app.loop();

	// stop rendering after 8 seconds
	// this should be enough time to finish the logo sim
	setTimeout(function () {
		app.doDraw = false;
	}, 8000);
}

