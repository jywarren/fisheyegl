(function(global){
	var model = {
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

	var lens = [
		1.0, //a
		1.0, //b
		1.0, //F
		1.5  //scale
	];
	var fov = {
		x : 1.0,
		y : 1.0
	}
	var images = [
		"images/barrel-distortion.png", "images/test2.jpg", "images/test3.jpg", "images/test4.jpg", "images/test5.jpg"
	]
	
	var gl = glu.getGLContext("#screen");

	var vertexSrc = glu.loadFile("shaders/vertex.glvs");
	var fragmentSrc = glu.loadFile("shaders/fragment.glfs");

	var program = glu.compileShader(gl, vertexSrc, fragmentSrc)
	gl.useProgram(program);

	var aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
	var aTextureCoord = gl.getAttribLocation(program, "aTextureCoord");
	var uSampler = gl.getUniformLocation(program, "uSampler");
	var uLens = gl.getUniformLocation(program, "uLens");
	var uFov = gl.getUniformLocation(program, "uFov");

	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertex), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	var indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

	var textureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.textureCoords), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	gl.viewport(0, 0, 800, 600);

	var textures = images.map(function(name){
		return glu.loadTexture(gl, name);
	});
	
	var texture = textures[0];


	var $fps = document.querySelector("#fps");
	var count = 0;
	glu.run(function(dt){
		if(count++ > 10){
			$fps.innerHTML = parseInt(10000/dt) / 10 + " - " + parseInt(dt*10)/10 + "ms/frame";
			console.log($fps.innerHTML);
			count = 0;
		}
		
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

		gl.uniform4fv(uLens, lens);
		gl.uniform2fv(uFov, [fov.x, fov.y]);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);
	});

	function $(query){
		return document.querySelector(query);
	}

	$("dl").addEventListener("change", function(e){

		lens[0] = $("#a_label").innerHTML = $("#a").value;
		lens[1] = $("#b_label").innerHTML = $("#b").value;
		lens[2] = $("#F_label").innerHTML = $("#F").value;
		lens[3] = $("#scale_label").innerHTML = $("#scale").value;
		texture = textures[$("#image").value];
		fov.x = $("#fovx").value;
		fov.y = $("#fovy").value;
	});


	$("#a").value = $("#a_label").innerHTML = lens[0];
	$("#b").value = $("#b_label").innerHTML = lens[1];
	$("#F").value = $("#F_label").innerHTML = lens[2];
	$("#scale").value = $("#scale_label").innerHTML = lens[3];
	$("#image").value = 0;
	$("#fovx").value = fov.x;
	$("#fovy").value = fov.y;
})(this);
