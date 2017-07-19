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