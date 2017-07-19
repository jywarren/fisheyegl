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