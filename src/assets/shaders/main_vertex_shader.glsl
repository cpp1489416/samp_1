precision mediump float;

attribute vec3  position;
attribute vec3 textureCoord;
attribute vec3 normal;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 normalMatrix;

varying vec3 textureCoordVarying;
varying vec3 positionVarying;
varying vec3 normalVarying;

void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1);
 	positionVarying = modelPosition.xyz / modelPosition.w;
  textureCoordVarying = textureCoord;
  normalVarying = normal;
 	gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
