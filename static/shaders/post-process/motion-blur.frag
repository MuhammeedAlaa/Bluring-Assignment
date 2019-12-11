#version 300 es
precision highp float;

//TODO: Modify as needed

in vec2 v_screencoord;

out vec4 color;

uniform mat4 VP;
uniform mat4 VP_Prev;
uniform sampler2D color_sampler;
uniform sampler2D depth_sampler;
uniform sampler2D motion_sampler;

void main(){
     vec4 motion_vec = texture(motion_sampler, v_screencoord);
     float depth = texture(depth_sampler, v_screencoord).x; // read the depth from the depth texture
     vec4 inv_projected = VP * vec4(2.0 * v_screencoord.x - 1.0, 2.0 * v_screencoord.y - 1.0, 2.0 * depth - 1.0, 1.0); // regenerate the NDC and multiply by projection inverse
     
     vec4 pre_inv_projected = inv_projected - motion_vec;
     vec4 prev_screen = VP_Prev * pre_inv_projected ;   
     vec2 prev =  0.5 * (prev_screen.xy  + 1.0) ;
    
     ivec2 size = textureSize(color_sampler, 0);
     vec2 texelSize = 1.0/vec2(size);
    float two_sigma_sqr = 2.0*4.0*4.0;
    float avg_num = length(v_screencoord - prev) / length(texelSize);
    float total_weight = 0.0;
    color = vec4(0);
    //Here we calculate a weighted mean from samples located on a radial direction
        for(float i = 0.0; i < avg_num; i++){
            float weight = exp(-float(i*i)/two_sigma_sqr);
            color += texture(color_sampler, v_screencoord + float(i) * texelSize) * weight;
            total_weight += weight;
        }
        color /= total_weight;
    
    
}