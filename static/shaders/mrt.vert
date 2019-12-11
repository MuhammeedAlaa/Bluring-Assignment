#version 300 es

//TODO: Modify as needed

layout(location=0) in vec3 position;
layout(location=1) in vec4 color;
layout(location=2) in vec2 texcoord;

out vec4 v_color;
out vec2 v_texcoord;
out vec4 motion_vector;

uniform mat4 M_Curr;
uniform mat4 M_Prev;
uniform mat4 VP;

void main(){
    vec4 world = M_Curr * vec4(position, 1.0f);
    gl_Position = VP * world; 
    v_color = color;
    v_texcoord = texcoord;
    vec4 prev_world = M_Prev * vec4(position, 1.0f);
    motion_vector = world - prev_world;
}