fisheyegl
====

A library for performing fisheye, or barrel distortion, on images in the browser in JavaScript with WebGL.

Adapted from [fisheye-correction-webgl](https://github.com/bluemir/fisheye-correction-webgl) by @bluemir.

## Usage

See `main.js` in examples folder, but basics are:

```js
var distorter = FisheyeGl({
  image: 'path/to/image.jpg',
  selector: '#canvas', // your canvas element
  lens: {
    a: $("#a").value,    // 0 to 4;  default 1
    b: $("#a").value,    // 0 to 4;  default 1
    F: $("#a").value,    // 0 to 4;  default 1
    scale: $("#a").value // 0 to 20; default 1.5
  },
  fov: {
    x: $("#fovx").value, // 0 to 2; default 1
    y: $("#fovy").value  // 0 to 2; default 1
  },
  fragmentSrc: "../shaders/fragment.glfs", // these are provided in the /shaders/ directory
  vertexSrc:   "../shaders/vertex.glvs"
});

distorter.getImage(); // <= returns a native JavaScript Image object based on the DOM element
```

## Issues

  // Use distorter.run() again when an image is drag/dropped in



drag/drop image

image resizing - set canvas size from options

