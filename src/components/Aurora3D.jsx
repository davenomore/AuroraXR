import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

// --- ROBUST SIMPLEX NOISE FUNCTION (Ashima Arts) ---
const NOISE_GLSL = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
  // First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v - i + dot(i, C.xx);

  // Other corners
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  // Permutations
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

  // Gradients
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  // Normalise gradients
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

  // Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

const AURORA_VERTEX = `
varying vec2 vUv;
varying vec3 vPos;
uniform float time;

${NOISE_GLSL}

void main() {
  vUv = uv;
  vec3 pos = position;
  
  // DISPLACEMENT: Move vertices to create 3D wave
  float wave = sin(uv.x * 4.0 + time * 0.5) * 1.5;
  float noise = snoise(vec2(uv.x * 2.0 + time * 0.2, uv.y * 0.5));
  
  // Z-axis displacement for volumetric feel
  pos.z += wave + noise * 1.0;
  pos.y += noise * 0.5;
  
  vPos = pos;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const AURORA_FRAGMENT = `
uniform float time;
varying vec2 vUv;
varying vec3 vPos;

${NOISE_GLSL}

void main() {
    vec2 uv = vUv;
    float t = time * 0.2;
    
    // Vertical Ray Noise
    float rays = snoise(vec2(uv.x * 10.0 + t, t * 1.5));
    // Sharpen rays
    rays = smoothstep(0.1, 0.6, rays); 
    
    // Base wave shape
    float wave = sin(uv.x * 3.0 + uv.y * 2.0 + t);
    
    // Mask edges (Top and Bottom Fade)
    float bottomFade = smoothstep(0.0, 0.2, uv.y);
    float topFade = 1.0 - smoothstep(0.6, 1.0, uv.y); 
    float alpha = bottomFade * topFade;
    
    // Combine for structure
    float structure = (smoothstep(-0.2, 1.0, wave) * 0.4 + rays * 0.6) * alpha;
    
    // Colors - Dynamic shifting
    vec3 green = vec3(0.0, 1.2, 0.6); 
    vec3 lightBlue = vec3(0.0, 0.8, 1.0);
    vec3 purple = vec3(0.8, 0.2, 1.5);
    
    // Time-based variation
    float shift = sin(time * 0.5) * 0.5 + 0.5; // 0.0 to 1.0
    
    // Mix in some Deep Blue/Pink based on time
    green = mix(green, vec3(0.0, 1.0, 1.0), shift * 0.3); // Shift to Cyan
    purple = mix(purple, vec3(1.0, 0.2, 1.0), shift * 0.3); // Shift to Magenta
    
    // Gradient mix vertically
    vec3 color = mix(green, lightBlue, uv.y * 0.7);
    color = mix(color, purple, smoothstep(0.5, 1.2, uv.y));
    
    // Add a moving "shimmer" of white/bright
    float shimmer = snoise(vec2(uv.x * 5.0 - time * 0.5, uv.y * 2.0));
    color += vec3(0.2) * smoothstep(0.6, 0.8, shimmer);
    
    // Brightness boost based on structure
    color *= structure * 3.0; // Glow intensity
    
    // Final opacity
    float opacity = structure * 0.8;
    
    // Ensure minimal opacity for debug visibility if structure is low
    // opacity = max(opacity, 0.1); 
    
    gl_FragColor = vec4(color, opacity);
}
`;

function AuroraMesh() {
    const mesh = useRef();

    const uniforms = useMemo(() => ({
        time: { value: 0 },
    }), []);

    useFrame((state) => {
        if (mesh.current) {
            mesh.current.material.uniforms.time.value = state.clock.getElapsedTime();
        }
    });

    return (
        <mesh ref={mesh} position={[0, -2, -8]} rotation={[0.4, 0, 0]}>
            <planeGeometry args={[30, 15, 64, 64]} />
            <shaderMaterial
                vertexShader={AURORA_VERTEX}
                fragmentShader={AURORA_FRAGMENT}
                uniforms={uniforms}
                transparent={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

export default function Aurora3D() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }} gl={{ alpha: true }}>
                <AuroraMesh />
                <group position={[0, -2, -4]} rotation={[-0.2, 0, 0]} scale={[1.2, 1, 1]}>
                    <AuroraMesh />
                </group>
            </Canvas>
        </div>
    );
}
