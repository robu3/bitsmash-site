---
title: The BITSMASH Studios Logo
author: Rob
date: 2013-04-23
template: article.jade
---

I spent a fair amount of time on the logo for BITSMASH Studios.

<span class="more"></span>

Several acquaintances have me asked me why, and the answer is simple: your company's logo is the first thing a client sees, and is therefore probably their first impression of your business. We have all been to an establishment where the logo was sub-par, and your first impression is _"Wow, they could use some re-branding. I wonder if the interior is any better. How about the food and beverages?"_

Often times, you are pleasantly suprised by your meal / service / what-not, and you leave perfectly content. But how many people never even bother to step in the door?

In order to avoid that scenario, I wanted to create a logo that really represented my company. I came up with the following criteria:

- __Eye-catching__: My logo had to grab your attention and make you want to really look at.
- __Dynamic__: My logo had to be dynamic, reflecting the dynamic, active nature of the company. I was very much inspired by the [MIT Media Lab's logo](http://www.thegreeneyl.com/mit-media-lab-identity-1).
- __Sans-serif__: I like serif fonts on my classic literature books, not on my business card. Sans-serif fonts convey a more modern feeling than serif ones, in my opinion.
- __Neon__: I had to save some bright colors in my logo (I love neons). I'm still not 100% certain I'm happy with the color palette, or even if I should keep a fixed one instead of going dynamic. However, the current one is very similar to my current Vim color scheme, so I'm kind of partial towards it.

What I ended up with is little program I wrote in Processing that runs a [cellular automata](http://en.wikipedia.org/wiki/Cellular_automaton) simulation, with an initial configuration determined by text seed (a name, for example).
Colored cells spawn and die based upon the proximity of their neighbors of the same color; this leads to a tendency for cells of the same color to gather together into blocks of color.
Finally, a linear segment of cells, starting from the center, are exploded out along a random angle because, well, the company is called BIT_SMASH_ Studios and I wanted something to allude to the _smash_ part of the name. 

I put together a simple [business card generator](../bitsmash-business-card/), the generates a sample BITSMASH business card, for my use and your amusement (^_^). Please check it out!
