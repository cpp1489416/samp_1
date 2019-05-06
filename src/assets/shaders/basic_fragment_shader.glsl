#ifdef GL_ES
precision mediump float;
#endif

varying vec3 colorVarying;

void main()
{
    gl_FragColor = vec4(colorVarying, 1);
}
