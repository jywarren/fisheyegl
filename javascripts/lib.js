var glu = {
	getGLContext : function getGLContext(selector){
		var canvas = document.querySelector(selector);

		if(canvas == null){
			throw new Error("there is no canvas on this page");
		}

		var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
		for (var i = 0; i < names.length; ++i) {
			var gl;
			try {
				gl = canvas.getContext(names[i]);
			} catch(e) {
				continue;
			}
			if (gl) return gl;
		}

		throw new Error("WebGL is not supported!");
	},
	compileShader : function compileShader(gl, vertexSrc, fragmentSrc){
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
	},
	loadFile : function loadFile(url, callback){
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
	},
	loadTexture: function loadTexture(gl, url, callback){
		var texture = gl.createTexture();
		var img = new Image();
		img.addEventListener("load", function onload(){
			gl.bindTexture(gl.TEXTURE_2D, texture);

			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating).
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating).
			//gl.generateMipmap(gl.TEXTURE_2D);
			gl.bindTexture(gl.TEXTURE_2D, null);

			if(callback) callback(null, texture);
		});
		img.src = url;
		return texture;
	},
	run : function run(onframe){
		var f = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

		if(f){
			f(on);
		} else {
			throw new Error("do not support 'requestAnimationFram'");
		}

		var current = null;
		function on(t){
			if(!current) current = t;
			var dt = t - current;
			current = t;
			onframe(dt);
			f(on);
		}
	}
}
