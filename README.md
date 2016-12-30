FisheyeGl
====

A library for correcting fisheye, or barrel distortion, on images in the browser in JavaScript with WebGL.

Adapted from [fisheye-correction-webgl](https://github.com/bluemir/fisheye-correction-webgl) by @bluemir.

## Usage


## Using it in your code

See `main.js` in the examples folder for a working implementation, but the basics are:

```js
var distorter = FisheyeGl({
  image: 'path/to/image.jpg',
  selector: '#canvas', // your canvas element
  lens: {
    a: 1,    // 0 to 4;  default 1
    b: 1,    // 0 to 4;  default 1
    F: 1,    // 0 to 4;  default 1
    scale: 1.5 // 0 to 20; default 1.5
  },
  fov: {
    x: 1, // 0 to 2; default 1
    y: 1  // 0 to 2; default 1
  },
  fragmentSrc: "../shaders/fragment.glfs", // these are provided in the /shaders/ directory
  vertexSrc:   "../shaders/vertex.glvs"
});

distorter.getImage(); // <= returns a native JavaScript Image object based on the DOM element

distorter.setImage('path/to/image.jpg'); // <= load a new image with the same distortion settings
```

## To do

Image sizing - set canvas size from options on `setImage()`.

See more in GitHub Issues: https://github.com/jywarren/fisheyegl/issues



