(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var FisheyeGl = function FisheyeGl(options){

  // Defaults:
  options = options || {};

  options.width = options.width || 800;
  options.height = options.height || 600;

  var model = options.model || {
    vertex :[
      -1.0, -1.0, 0.0,
       1.0, -1.0, 0.0,
       1.0,  1.0, 0.0,
      -1.0,  1.0, 0.0
    ],
    indices :[
      0, 1, 2,
      0, 2, 3,
      2, 1, 0,
      3, 2, 0
    ],
    textureCoords : [
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0
    ]
  };

  var lens = options.lens || {
    a : 1.0,
    b : 1.0,
    Fx : 0.0,
    Fy : 0.0,
    scale : 1.5
  };
  var fov = options.fov || {
    x : 1.0,
    y : 1.0
  }
  var image = options.image || "images/barrel-distortion.png";

  var selector = options.selector || "#canvas";
  var gl = getGLContext(selector);

  var shaders = require('./shaders');

  var vertexSrc = loadFile(options.vertexSrc || "vertex");
  var fragmentSrc = loadFile(options.fragmentSrc || "fragment3");

  var program = compileShader(gl, vertexSrc, fragmentSrc)
  gl.useProgram(program);

  var aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
  var aTextureCoord = gl.getAttribLocation(program, "aTextureCoord");
  var uSampler = gl.getUniformLocation(program, "uSampler");
  var uLensS = gl.getUniformLocation(program, "uLensS");
  var uLensF = gl.getUniformLocation(program, "uLensF");
  var uFov = gl.getUniformLocation(program, "uFov");

  var vertexBuffer,
      indexBuffer,
      textureBuffer;

  function createBuffers() {

    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertex), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.textureCoords), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

  }

  createBuffers();

  function getGLContext(selector){
    var canvas = document.querySelector(selector);

    if(canvas == null){
      throw new Error("there is no canvas on this page");
    }

    var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    for (var i = 0; i < names.length; ++i) {
      var gl;
      try {
        gl = canvas.getContext(names[i], { preserveDrawingBuffer: true });
      } catch(e) {
        continue;
      }
      if (gl) return gl;
    }

    throw new Error("WebGL is not supported!");
  }

  function compileShader(gl, vertexSrc, fragmentSrc){
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSrc);
    gl.compileShader(vertexShader);

    _checkCompile(vertexShader);

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSrc);
    gl.compileShader(fragmentShader);

    _checkCompile(fragmentShader);

    var program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    return program;

    function _checkCompile(shader){
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader));
      }
    }
  }

  function loadFile(url, callback){

    if(shaders.hasOwnProperty(url)) {
      return shaders[url];
    }

    var ajax = new XMLHttpRequest();

    if(callback) {
      ajax.addEventListener("readystatechange", on)
      ajax.open("GET", url, true);
      ajax.send(null);
    } else {
      ajax.open("GET", url, false);
      ajax.send(null);

      if(ajax.status == 200){
        return ajax.responseText;
      }
    }

    function on(){
      if(ajax.readyState === 4){
        //complete requset
        if(ajax.status === 200){
          //not error
          callback(null, ajax.responseText);
        } else {
          callback(new Error("fail to load!"));
        }
      }
    }
  }

  function loadImage(gl, img, callback, texture){
    texture = texture || gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating).
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating).
    //gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);

    if(callback) callback(null, texture);
    return texture;
  }

  function loadImageFromUrl(gl, url, callback){
    var texture = gl.createTexture();
    var img = new Image();
    img.addEventListener("load", function onload(){
      loadImage(gl, img, callback, texture);
      options.width = img.width;
      options.height = img.height;
      resize(
        options.width,
        options.height
      )
    });
    img.src = url;
    return texture;
  }

  function run(animate, callback){
    var f = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    // ugh
    if(animate === true){
      if(f){
        f(on);
      } else {
        throw new Error("do not support 'requestAnimationFram'");
      }
    } else {
      f(on);
    }

    var current = null;
    function on(t){
      if(!current) current = t;
      var dt = t - current;
      current = t;
      options.runner(dt);
      if (callback) callback();
      if (animate === true) f(on);
    }
  }

  function resize(w, h) {
    gl.viewport(0, 0, w, h);
    gl.canvas.width = w;
    gl.canvas.height = h;
  }

  options.runner = options.runner|| function runner(dt){

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enableVertexAttribArray(aVertexPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(aTextureCoord);

    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.vertexAttribPointer(aTextureCoord, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(uSampler, 0);

    gl.uniform3fv(uLensS, [lens.a, lens.b, lens.scale]);
    gl.uniform2fv(uLensF, [lens.Fx, lens.Fy]);
    gl.uniform2fv(uFov, [fov.x, fov.y]);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);
  }

  var texture;

  function setImage(imageUrl, callback) {
    texture = loadImageFromUrl(gl, imageUrl, function onImageLoad() {

      run(options.animate, callback);

    });
  }

  setImage(image);

  // asynchronous!
  function getImage(format) {

    var img = new Image();

    img.src = gl.canvas.toDataURL(format || 'image/jpeg');

    return img;

  }

  function getSrc(format) {

    return gl.canvas.toDataURL(format || 'image/jpeg');

  }

  // external API:
  var distorter = {
    options:  options,
    gl:       gl,
    lens:     lens,
    fov:      fov,
    run:      run,
    getImage: getImage,
    setImage: setImage,
    getSrc:   getSrc
  }

  return distorter;

}

if (typeof(document) != 'undefined')
  window.FisheyeGl = FisheyeGl;
else
  module.exports = FisheyeGl;

},{"./shaders":2}],2:[function(require,module,exports){
module.exports = {
  fragment: require('./shaders/fragment.glfs'),
  fragment2: require('./shaders/fragment2.glfs'),
  fragment3: require('./shaders/fragment3.glfs'),
  method1: require('./shaders/method1.glfs'),
  method2: require('./shaders/method2.glfs'),
  vertex: require('./shaders/vertex.glvs')
};

},{"./shaders/fragment.glfs":3,"./shaders/fragment2.glfs":4,"./shaders/fragment3.glfs":5,"./shaders/method1.glfs":6,"./shaders/method2.glfs":7,"./shaders/vertex.glvs":8}],3:[function(require,module,exports){
module.exports = "\
#ifdef GL_ES\n\
precision highp float;\n\
#endif\n\
uniform vec4 uLens;\n\
uniform vec2 uFov;\n\
uniform sampler2D uSampler;\n\
varying vec3 vPosition;\n\
varying vec2 vTextureCoord;\n\
vec2 GLCoord2TextureCoord(vec2 glCoord) {\n\
	return glCoord  * vec2(1.0, -1.0)/ 2.0 + vec2(0.5, 0.5);\n\
}\n\
void main(void){\n\
	float scale = uLens.w;\n\
	float F = uLens.z;\n\
	\n\
	float L = length(vec3(vPosition.xy/scale, F));\n\
	vec2 vMapping = vPosition.xy * F / L;\n\
	vMapping = vMapping * uLens.xy;\n\
	vMapping = GLCoord2TextureCoord(vMapping/scale);\n\
	vec4 texture = texture2D(uSampler, vMapping);\n\
	if(vMapping.x > 0.99 || vMapping.x < 0.01 || vMapping.y > 0.99 || vMapping.y < 0.01){\n\
		texture = vec4(0.0, 0.0, 0.0, 1.0);\n\
	} \n\
	gl_FragColor = texture;\n\
}\n\
";
},{}],4:[function(require,module,exports){
module.exports = "\
#ifdef GL_ES\n\
precision highp float;\n\
#endif\n\
uniform vec4 uLens;\n\
uniform vec2 uFov;\n\
uniform sampler2D uSampler;\n\
varying vec3 vPosition;\n\
varying vec2 vTextureCoord;\n\
vec2 TextureCoord2GLCoord(vec2 textureCoord) {\n\
	return (textureCoord - vec2(0.5, 0.5)) * 2.0;\n\
}\n\
vec2 GLCoord2TextureCoord(vec2 glCoord) {\n\
	return glCoord / 2.0 + vec2(0.5, 0.5);\n\
}\n\
void main(void){\n\
	float correctionRadius = 0.5;\n\
	float distance = sqrt(vPosition.x * vPosition.x + vPosition.y * vPosition.y) / correctionRadius;\n\
	float theta = 1.0;\n\
	if(distance != 0.0){\n\
		theta = atan(distance);\n\
	}\n\
	vec2 vMapping = theta * vPosition.xy;\n\
	vMapping = GLCoord2TextureCoord(vMapping);\n\
		\n\
	vec4 texture = texture2D(uSampler, vMapping);\n\
	if(vMapping.x > 0.99 || vMapping.x < 0.01 || vMapping.y > 0.99 || vMapping.y < 0.01){\n\
		texture = vec4(0.0, 0.0, 0.0, 1.0);\n\
	} \n\
	gl_FragColor = texture;\n\
}\n\
";
},{}],5:[function(require,module,exports){
module.exports = "\
#ifdef GL_ES\n\
precision highp float;\n\
#endif\n\
uniform vec3 uLensS;\n\
uniform vec2 uLensF;\n\
uniform vec2 uFov;\n\
uniform sampler2D uSampler;\n\
varying vec3 vPosition;\n\
varying vec2 vTextureCoord;\n\
vec2 GLCoord2TextureCoord(vec2 glCoord) {\n\
	return glCoord  * vec2(1.0, -1.0)/ 2.0 + vec2(0.5, 0.5);\n\
}\n\
void main(void){\n\
	float scale = uLensS.z;\n\
	vec3 vPos = vPosition;\n\
	float Fx = uLensF.x;\n\
	float Fy = uLensF.y;\n\
	vec2 vMapping = vPos.xy;\n\
	vMapping.x = vMapping.x + ((pow(vPos.y, 2.0)/scale)*vPos.x/scale)*-Fx;\n\
	vMapping.y = vMapping.y + ((pow(vPos.x, 2.0)/scale)*vPos.y/scale)*-Fy;\n\
	vMapping = vMapping * uLensS.xy;\n\
	vMapping = GLCoord2TextureCoord(vMapping/scale);\n\
	vec4 texture = texture2D(uSampler, vMapping);\n\
	if(vMapping.x > 0.99 || vMapping.x < 0.01 || vMapping.y > 0.99 || vMapping.y < 0.01){\n\
		texture = vec4(0.0, 0.0, 0.0, 1.0);\n\
	}\n\
	gl_FragColor = texture;\n\
}\n\
";
},{}],6:[function(require,module,exports){
module.exports = "\
#ifdef GL_ES\n\
precision highp float;\n\
#endif\n\
uniform vec4 uLens;\n\
uniform vec2 uFov;\n\
uniform sampler2D uSampler;\n\
varying vec3 vPosition;\n\
varying vec2 vTextureCoord;\n\
vec2 TextureCoord2GLCoord(vec2 textureCoord) {\n\
	return (textureCoord - vec2(0.5, 0.5)) * 2.0;\n\
}\n\
vec2 GLCoord2TextureCoord(vec2 glCoord) {\n\
	return glCoord / 2.0 + vec2(0.5, 0.5);\n\
}\n\
void main(void){\n\
	vec2 vMapping = vec2(vTextureCoord.x, 1.0 - vTextureCoord.y);\n\
	vMapping = TextureCoord2GLCoord(vMapping);\n\
	//TODO insert Code\n\
	float F = uLens.x/ uLens.w;\n\
	float seta = length(vMapping) / F;\n\
	vMapping = sin(seta) * F / length(vMapping) * vMapping;\n\
	vMapping *= uLens.w * 1.414;\n\
	vMapping = GLCoord2TextureCoord(vMapping);\n\
	vec4 texture = texture2D(uSampler, vMapping);\n\
	if(vMapping.x > 0.99 || vMapping.x < 0.01 || vMapping.y > 0.99 || vMapping.y < 0.01){\n\
		texture = vec4(0.0, 0.0, 0.0, 1.0);\n\
	} \n\
	gl_FragColor = texture;\n\
}\n\
";
},{}],7:[function(require,module,exports){
module.exports = "\
#ifdef GL_ES\n\
precision highp float;\n\
#endif\n\
uniform vec4 uLens;\n\
uniform vec2 uFov;\n\
uniform sampler2D uSampler;\n\
varying vec3 vPosition;\n\
varying vec2 vTextureCoord;\n\
vec2 TextureCoord2GLCoord(vec2 textureCoord) {\n\
	return (textureCoord - vec2(0.5, 0.5)) * 2.0;\n\
}\n\
vec2 GLCoord2TextureCoord(vec2 glCoord) {\n\
	return glCoord / 2.0 + vec2(0.5, 0.5);\n\
}\n\
void main(void){\n\
	vec2 vMapping = vec2(vTextureCoord.x, 1.0 - vTextureCoord.y);\n\
	vMapping = TextureCoord2GLCoord(vMapping);\n\
	//TOD insert Code\n\
	float F = uLens.x/ uLens.w;\n\
	float seta = length(vMapping) / F;\n\
	vMapping = sin(seta) * F / length(vMapping) * vMapping;\n\
	vMapping *= uLens.w * 1.414;\n\
	vMapping = GLCoord2TextureCoord(vMapping);\n\
	vec4 texture = texture2D(uSampler, vMapping);\n\
	if(vMapping.x > 0.99 || vMapping.x < 0.01 || vMapping.y > 0.99 || vMapping.y < 0.01){\n\
		texture = vec4(0.0, 0.0, 0.0, 1.0);\n\
	} \n\
	gl_FragColor = texture;\n\
}\n\
";
},{}],8:[function(require,module,exports){
module.exports = "\
#ifdef GL_ES\n\
precision highp float;\n\
#endif\n\
attribute vec3 aVertexPosition;\n\
attribute vec2 aTextureCoord;\n\
varying vec3 vPosition;\n\
varying vec2 vTextureCoord;\n\
void main(void){\n\
	vPosition = aVertexPosition;\n\
	vTextureCoord = aTextureCoord;\n\
	gl_Position = vec4(vPosition,1.0);\n\
}\n\
";
},{}]},{},[1]);
