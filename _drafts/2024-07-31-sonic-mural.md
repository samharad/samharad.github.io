---
layout: post
title:  "Untitled"
---

What do you see when you zoom into an image? You see pixelation. You see the raw pixels that make up the image. Pixels of a given color are fungible. Using hexadecimal notation, we can represent the colors `#000000` through `#FFFFFF` - 16^6 colors, about 16.8 million.

What do you see when you zoom into an audio file, say, a song? If you zoom in far enough, you see discrete samples, or frames. Each frame is a number representing an amplitude. Just like colors are represented using a finite set, so are our amplitudes -- with 16-bit quantization, or bit depth, there are 2^16 possible values. Frames of a given value are fungible.

Now let's consider photo mosaics. In a photo mosaic, we divide an image into regions, each region being, say, an N by N square of pixels. Then, from a pool of N by N images, we try and find one that resembles a given region. Of course we might happen to have an image which is a perfect pixel-for-pixel match, but it's unlikely -- even if our region is just 2x2, there are (16^6)^4 possible images!

How do we find an image that resembles a region? The easiest way is to take the "average" color of the region, and find the image with the closest average color (easy if we've pre-indexed them).

Now, what if we apply the same idea to a song? We divide it into segments, each of N frames. We have a library of N-frame "mini-songs". 