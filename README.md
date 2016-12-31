FisheyeGl
====

A library for correcting fisheye, or barrel distortion, on images in the browser in JavaScript with WebGL.

Adapted from [fisheye-correction-webgl](https://github.com/bluemir/fisheye-correction-webgl) by @bluemir.

## Usage

In the [live demo](https://jywarren.github.io/fisheyegl/example/), you can try it out -- use the default image or drag a new one in, and use the sliders to adjust the distortion. 

Right click the image to save. Drag a new image in to use the same settings for multiple images.

## Lens models

If you can manually correct a particular lens or camera, please [file an issue](https://github.com/jywarren/fisheyegl/issues) or email jeff@publiclab.org to get a preset made; we can save up some presets and add a feature for quick correction of known cameras. 


## Using it in your code

See `main.js` in the examples folder for a working implementation, but the basics are:

```js
var distorter = FisheyeGl({
  image: 'path/to/image.jpg',
  selector: '#canvas', // a canvas element to work with
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
distorter.getImage('image/png'); // <= format can be specified

distorter.setImage('path/to/image.jpg'); // <= load a new image with the same distortion settings
```

## To do

Image sizing - set canvas size from options on `setImage()`.

See more in GitHub Issues: https://github.com/jywarren/fisheyegl/issues


## Resources

Lots of good info here: http://wiki.panotools.org/Lens_correction_model#Lens_distortion_a.2C_b_.26_c_parameters

