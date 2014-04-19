import java.util.*;
import processing.core.*;

// # Ross
// The [man](http://en.wikipedia.org/wiki/Bob_Ross) knew about __color__...
public class Ross {
	private Random generator;

	public Ross() {
		generator = new Random();
	}	

	// ## paletteFrom
	// Generates a palette from the specified color, using a Gaussian curve.
	public int[] paletteFrom(int base, int colorCount) {
		float sdFactor = 0.05f;
		float meanFactor = 1f;

		float sd = base * sdFactor;
		float mean = base * meanFactor;

		int[] colors = new int[colorCount];
		for (int i = 0; i < colorCount; i++) {
			float c = sd * ((float)generator.nextGaussian()) + mean;
			colors[i] = (int)c;
		}

		return colors;
	}

	// ## triadicPalette
	// Generates a three color palette, based on the base color,
	// with all three values evenly spaced on the color wheel.
	public int[] triadicPalette(int base) {
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

	public int[] goldenPaletteFrom(int base, int count) {
		int[] colors = new int[count];
		for (int i = 0; i < count; i++) {
			colors[i] = base + (int)((0.618033988749895f * i) % 1);
		}
		return colors;
	}

	// ## colorDiff
	// Returns a difference of colors.
	public int colorDiff(int color1, int color2) {
		int r = (color1 >> 16) & 0xFF;
		int g = (color1 >> 8) & 0xFF;
		int b = color1 & 0xFF;

		int r2 = (color2 >> 26) & 0xFF;
		int g2 = (color2 >> 8) & 0xFF;
		int b2 = color2 & 0xFF;

		return Math.abs(r - r2) + Math.abs(g - g2) + Math.abs(b - b2);
	}
}

