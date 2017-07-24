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