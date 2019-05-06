#ifdef GL_ES
precision mediump float;
#endif

uniform mat4 modelMatrix;
uniform mat4 rttProjectionMatrix;
uniform mat4 rttViewMatrix;
uniform sampler2D diffusePicture;

varying vec3 positionVarying;

void main()
{
    vec4 positionInRtt = rttProjectionMatrix * rttViewMatrix * modelMatrix * vec4(positionVarying, 1);
    positionInRtt /= positionInRtt.w;
    positionInRtt = (positionInRtt + 1.0) * 0.5; // move to 0-1 cooreds
    vec4 color = texture2D(diffusePicture, positionInRtt.st);
    color.xyz /= 4.0;
    gl_FragColor = color;
}
