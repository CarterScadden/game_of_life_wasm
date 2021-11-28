export default `#version 300 es

precision mediump float;

in vec2 a_position;
in vec4 a_color;
out vec4 frag_color;

// all shaders have a main function
void main() {
  frag_color = a_color;
  gl_Position = vec4(a_position.x, a_position.y, 0.0, 1);
}`;
