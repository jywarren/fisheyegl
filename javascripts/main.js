(function(global){
	var model = {
		vertex :[
			-1.0, -1.0, -1.0,
			 1.0, -1.0, -1.0,
			 1.0,  1.0, -1.0,
			-1.0,  1.0, -1.0
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
	}
	
	var gl = glu.getGLContext("#screen");

	var vertexSrc = glu.loadFile("/shaders/vertex.vs");
	var fragmentSrc = glu.loadFile("/shaders/fragment.fs");

	var program = glu.compileShader(gl, vertexSrc, fragmentSrc)
	gl.useProgram(program);

	var aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
	var aTextureCoord = gl.getAttribLocation(program, "aTextureCoord");
	var uSampler = gl.getUniformLocation(program, "uSampler");

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
	//WebGLFloatArray?
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.textureCoords), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	gl.viewport(0, 0, 800, 600);

	var texture = glu.loadTexture(gl, "/images/test.jpg");

	glu.run(function(dt){
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

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);
	});
})(this);
