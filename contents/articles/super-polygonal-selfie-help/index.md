---
title: Super Polygonal Selfie Help
author: Rob
date: 2013-05-18
template: article.jade
ignore: true
---

Thank you for installing Super Polygonal Selfie! If you have found this article, then that probably means that you have figured out that double tapping the left side of the screen opens up the in-app menu, and that tapping the gear icon opens the configuration settings.

## Tutorial

This is how you use Super Polygonal Selfie in a nutshell:

1. Open the app
2. Press the camera button
3. Picture is saved to your camera roll

But that wouldn't be any fun; the fun part is tweaking the setting and producing mini works of modern art! Try this instead:

1. Open the app
2. Double-tap on the lefthand side of the screen to open the menu
3. Tap the "ON/OFF" button to turn on colorized mode
4. Notice how the colors in the image are shifted to a new palette
5. Slide the RGB sliders up and down to adjust the colors
6. Take a picture!

You should be getting a feel for how to use SPS. Now try this:

1. Open the app
2. Double-tap on the lefthand side of the screen to open the menu
3. Tap the "ON/OFF" button to turn on colorized mode
4. Tap the gear icon to open up the configuration settings screen
5. Set view mode to "Threshold"
6. Slide "Poly Res." about 75% to the left
7. Slide "Poly Res." to around 40-50%
8. Tap the rotation arrow to activate the front camera
9. Take a selfie!

## Configuration Settings

SPS has a number of configuration settings that control how images are produced:

- __View Mode__: the background drawing mode, which currently consists of the following options:
	- __Outline__: a simple line drawing of detected edges
	- __Threshold__: a thresholded image (see below for more details)
	- __Original Image__: the unmodified original image
	- __Original Image B&W__: a black-and-white version of the original image
- __Threshold__: the cut-off where pixels are ignored based upon their brightness; a higher value here results in darker images, while a lower value produces darker images (when using the threshold view mode). It also affects shape detection.
- __Blur__: how much the image is blurred before thresholding; this affects both the Threshold view mode and shape detection.
- __Detail__: how detailed the outlines are in Outline view mode.
- __Poly Res.__: how many points should be used when drawing polygons over the detected shapes; a higher value results in smoother, rounded shapes, while a lower value results in more angular shapes.
- __Poly Size__: how big the polygons should be compared to the detected shape; a lower value here indicates a close fit to the original shape's size, while a larger values means larger than the original shape. Large values here produce large swaths of color.
- __GIF-atize__: produces short animated GIFs when enabled.
- __Debug__: displays assorted debug information when using the app (bounding boxes for detected shapes, framerate, etc.).
- __Palette__: palette generation mode; there are currently three options:
	- __Triad__: the base option; using the selected color as the root, two additional colors are selected by evenly spacing them on the color wheel.
	- __Tetrad__: same as triad, but with a total of 4 colors
	- __Analogous__: two neighboring colors on the color wheel are selected, produces a palette of 3 similar colors.


