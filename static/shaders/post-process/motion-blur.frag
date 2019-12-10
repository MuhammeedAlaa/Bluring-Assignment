#version 300 es
precision highp float;

//TODO: Modify as needed
//layout(location=0) out vec4 color;
//layout(location=1) in vec4 motion; // Send the motion vectors here

in vec2 v_screencoord;

out vec4 color;
uniform mat4 VP;
uniform mat4 VP_Prev;
uniform sampler2D color_sampler;
uniform sampler2D depth_sampler;
uniform sampler2D motion_sampler;

void main(){
    
    float depth = texture(depth_sampler, v_screencoord).x; // read the depth from the depth texture
    
    vec4 inv_projected =   inverse(VP) * vec4(v_screencoord.x, v_screencoord.y, depth, 1.0); // regenerate the NDC and multiply by projection inverse
    vec4 inv_projected_prev =  inv_projected - texture(motion_sampler,v_screencoord); // regenerate the NDC and multiply by projection inverse
    vec4 shifted = VP_Prev * inv_projected_prev;
    
    ivec2 size = textureSize(color_sampler, 0);
    vec2 texelSize = 1.0/vec2(size);

    float two_sigma_sqr = 2.0*45.0*45.0;
    vec2 delta_step = vec2(shifted.x ,shifted.y) * length(texelSize);

    float total_weight = 0.0;
    color = vec4(0);
    // Here we calculate a weighted mean from samples located on a radial direction
    for(int i = 0; i <= 45; i++){
        float weight = 2.0;
        color += texture(color_sampler, v_screencoord + float(i) * delta_step) * weight;
        total_weight += weight;
    }
    color /= total_weight;

    
    //color = texture(color_sampler, v_screencoord); // Sample texture color and send it as is



    
    
}