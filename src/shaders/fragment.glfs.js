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