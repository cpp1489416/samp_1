
precision mediump float;
uniform sampler2D picture;
varying vec2 textureCoordVarying;

void main()
{
  gl_FragColor = texture2D(picture, textureCoordVarying);
  // gl_FragColor = vec4(1, 0, 0, 1);
}
