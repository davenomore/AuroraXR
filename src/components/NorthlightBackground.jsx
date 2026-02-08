import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NORTHLIGHT_VERTEX = `
varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

const NORTHLIGHT_FRAGMENT = `
precision highp float;

uniform float time;
uniform vec2 resolution;
varying vec3 vWorldPosition;
varying vec2 vUv;

// --- GLSL Aurora Code adapted/ported from Northlight project ---

mat2 mm2(in float a){float c = cos(a), s = sin(a);return mat2(c,s,-s,c);}
mat2 m2 = mat2(0.95534, 0.29552, -0.29552, 0.95534);
float tri(in float x){return clamp(abs(fract(x)-.5),0.01,0.49);}
vec2 tri2(in vec2 p){return vec2(tri(p.x)+tri(p.y),tri(p.y+tri(p.x)));}

float triNoise2d(in vec2 p, float spd)
{
    float z=1.8;
    float z2=2.5;
    float rz = 0.;
    p *= mm2(p.x*0.06);
    vec2 bp = p;
    
    // Loop count: 4 (Balanced quality)
    for (float i=0.; i<4.; i++ )
    {
        vec2 dg = tri2(bp*1.85)*.75;
        dg *= mm2(time*spd);
        p -= dg/z2;

        bp *= 1.3;
        z2 *= .45;
        z *= .42;
        p *= 1.21 + (rz-1.0)*.02;
        
        rz += tri(p.x+tri(p.y))*z;
        p*= -m2;
    }
    return clamp(1./pow(rz*29., 1.3),0.,.55);
}

float hash21(in vec2 n){ return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }

vec4 aurora(vec3 ro, vec3 rd)
{
    vec4 col = vec4(0);
    vec4 avgCol = vec4(0);
    
    // Loop count: 40 (Restored for quality)
    for(float i=0.;i<40.;i++)
    {
        float dist = i;
        float of = 0.006*hash21(vUv * 500.0)*smoothstep(0.,15., dist);
        
        float pt = ((.8+pow(dist,1.4)*.002)-ro.y)/(rd.y*2.+0.4);
        pt -= of;
        vec3 bpos = ro + pt*rd;
        vec2 p = bpos.zx;
        float rzt = triNoise2d(p, 0.06);
        vec4 col2 = vec4(0,0,0, rzt);
        col2.rgb = (sin(1.-vec3(2.15,-.5, 1.2)+dist*0.043)*0.5+0.5)*rzt;
        avgCol =  mix(avgCol, col2, .5);
        
        col += avgCol*exp2(-dist*0.065 - 2.5)*smoothstep(0.,5., dist);
    }
    
    col *= (clamp(rd.y*15.+.4,0.,1.));
    
    return clamp(col*1.8, 0.0, 1.0); 
}

vec3 stars(in vec3 p)
{
    vec3 c = vec3(0.);
    float res = 800.0; // resolution base
    
    for (float i=0.;i<3.;i++)
    {
        vec3 q = fract(p*(.15*res))-0.5;
        vec3 id = floor(p*(.15*res));
        vec2 rn = hash21(id.xy)*vec2(1.0); // Simple hash reuse
        float c2 = 1.-smoothstep(0.,.6,length(q));
        c2 *= step(rn.x,.0005+i*i*0.001);
        c += c2*(mix(vec3(1.0,0.49,0.1),vec3(0.75,0.9,1.),rn.y)*0.1+0.9);
        p *= 1.3;
    }
    return c*c*.8;
}

vec3 bg(in vec3 rd)
{
    float sd = dot(normalize(vec3(-0.5, -0.6, 0.9)), rd)*0.5+0.5;
    sd = pow(sd, 5.);
    vec3 col = mix(vec3(0.05,0.1,0.2), vec3(0.1,0.05,0.2), sd); 
    return col*.63;
}

void main() {
    vec3 rd = normalize(vWorldPosition);
    vec3 ro = vec3(0., 0., -6.7); 
    
    vec3 col = vec3(0.);
    float fade = smoothstep(0.,0.01,abs(rd.y))*0.1+0.9;
    col = bg(rd)*fade;
    
    if (rd.y > 0.0){
        vec4 aur = aurora(ro,rd);
        aur = clamp(aur, 0.0, 1.0); 
        aur *= smoothstep(0., 1.5, aur);
        aur *= fade;
        
        // Stars restored
        col += stars(rd); 
        
        col = col*(1.-aur.a) + aur.rgb;
    }
    else 
    {
        // Reflections
        vec3 srd = rd;
        srd.y = abs(srd.y);
        col = bg(srd)*fade*0.6;
        vec4 aur = smoothstep(0.0,2.5,aurora(ro,srd));
        col = col*(1.-aur.a) + aur.rgb;
        vec3 pos = ro + ((0.5-ro.y)/srd.y)*srd;
        float nz2 = triNoise2d(pos.xz*vec2(.5,.7), 0.);
        col += mix(vec3(0.2,0.25,0.5)*0.08,vec3(0.3,0.3,0.5)*0.7, nz2*0.4);
    }

    gl_FragColor = vec4(col, 1.0);
}
`;

function SkyDome() {
    const mesh = useRef();

    const uniforms = useMemo(() => ({
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    }), []);

    useFrame((state) => {
        if (mesh.current) {
            mesh.current.material.uniforms.time.value = state.clock.getElapsedTime();
        }
    });

    return (
        <mesh ref={mesh} scale={[-1, 1, 1]}>
            <sphereGeometry args={[100, 64, 64]} />
            <shaderMaterial
                vertexShader={NORTHLIGHT_VERTEX}
                fragmentShader={NORTHLIGHT_FRAGMENT}
                uniforms={uniforms}
                side={THREE.BackSide}
            />
        </mesh>
    );
}

export default function NorthlightBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none bg-black">
            <Canvas camera={{ position: [0, 0, 0.1], fov: 60 }} gl={{ alpha: false }} dpr={[1, 1]}>
                <SkyDome />
            </Canvas>
        </div>
    );
}
