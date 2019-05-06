attribute vec3 position;
attribute vec3 color;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

varying vec3 colorVarying;

void main()
{
	colorVarying = color;
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1);
}
