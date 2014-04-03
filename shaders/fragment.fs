#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uSampler;

varying vec3 vPosition;
varying vec2 vTextureCoord;

void main(void){
	vec2 vMapping = vec2(vTextureCoord.x, 1.0 - vTextureCoord.y);
	
	vec4 defualtColor = vec4(0.1, 0.1, 0.1, 1.0);
	vec4 texture = texture2D(uSampler, vMapping);
	gl_FragColor = defualtColor + texture;
}
