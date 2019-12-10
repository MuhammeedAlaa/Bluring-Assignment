#version 300 es

//TODO: Modify as needed

layout(location=0) in vec3 position;
layout(location=1) in vec4 color;
layout(location=2) in vec2 texcoord;

out vec4 v_color;
out vec2 v_texcoord;
out vec3 v_Prev;

uniform mat4 M;
uniform mat4 Prev_M;
uniform mat4 VP;

void main(){
    vec4 world = M * vec4(position, 1.0f);
    vec4 pre = Prev_M * vec4(position, 1.0f);     
    gl_Position = VP * world; 
    v_color = color;
    v_texcoord = texcoord;
    v_Prev = world.xyz - pre.xyz;

}