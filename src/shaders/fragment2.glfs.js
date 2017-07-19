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