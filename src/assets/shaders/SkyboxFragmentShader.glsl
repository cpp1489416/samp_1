#ifdef GL_ES
precision mediump float;
#endif

varying vec2 textureCoordVarying;
uniform sampler2D skybox;
uniform samplerCube dd;

void main()
{
	gl_FragColor = texture2D(skybox, textureCoordVarying);
}
