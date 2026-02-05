precision mediump float;

uniform sampler2D uMap;

varying vec2 vUv;
varying float vElevation;

void main(){
  vec4 texture = texture2D(uMap, vUv);
  texture.rgb *= vElevation * 2.0 + 1.0;
  gl_FragColor = texture;
}
