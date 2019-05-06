#ifdef GL_ES
precision mediump float;
#endif

attribute vec3 position;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

varying vec3 positionVarying;

void main()
{
  positionVarying = position;
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1);
}
