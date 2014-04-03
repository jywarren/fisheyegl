#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;

attribute vec2 aTextureCoord;

varying vec3 vPosition;
varying vec2 vTextureCoord;

void main(void){
	vPosition = aVertexPosition;
	vTextureCoord = aTextureCoord;

	gl_Position = vec4(vPosition,1.0);
}
