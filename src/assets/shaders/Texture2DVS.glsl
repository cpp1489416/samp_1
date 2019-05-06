
attribute vec3  position;
attribute vec2 textureCoord;
varying vec2 textureCoordVarying;

void main()
{
  gl_Position =   vec4(position, 1);
  textureCoordVarying = textureCoord;
}
