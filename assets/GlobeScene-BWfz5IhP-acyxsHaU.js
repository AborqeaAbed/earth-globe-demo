import{j as a,r as o}from"./index-z6GBakmG.js";import{C as O,V as T,S as P,O as W,u as C,a as L,b as V,c as E,A as z,B as U,T as G,d as Y,e as B,f as H}from"./Stars-Cpl-ocXz.js";const S=`
  varying vec2 vUv;
  varying vec3 vObjectDir;
  varying vec3 vWorldNormal;
  varying vec3 vViewNormal;

  void main() {
    vUv = uv;
    vObjectDir = normalize(position);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vViewNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,X=`
  uniform sampler2D uLights;
  uniform vec3 uSunDir;
  uniform vec3 uTint;
  uniform float uIntensity;
  uniform float uFade;
  varying vec2 vUv;
  varying vec3 vWorldNormal;

  void main() {
    float sun = dot(normalize(vWorldNormal), uSunDir);
    float night = 1.0 - smoothstep(-0.2, 0.15, sun);
    vec3 lights = texture2D(uLights, vUv).rgb * uTint * uIntensity;
    gl_FragColor = vec4(lights * night * uFade, 1.0);
  }
`,q=`
  uniform float uTime;
  uniform vec3 uSunDir;
  uniform float uFade;
  varying vec3 vObjectDir;
  varying vec3 vWorldNormal;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(
        mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x),
        f.y
      ),
      mix(
        mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x),
        f.y
      ),
      f.z
    );
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p = p * 2.03 + vec3(1.7, 9.2, 3.1);
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    float c = cos(uTime);
    float s = sin(uTime);
    vec3 p = vec3(c * vObjectDir.x - s * vObjectDir.z, vObjectDir.y, s * vObjectDir.x + c * vObjectDir.z);

    float clouds = smoothstep(0.5, 0.72, fbm(p * vec3(2.4, 3.6, 2.4)));
    float day = smoothstep(-0.15, 0.35, dot(normalize(vWorldNormal), uSunDir));

    gl_FragColor = vec4(vec3(0.95, 0.97, 1.0) * (0.35 + 0.65 * day), clouds * (0.06 + day * 0.5) * uFade);
  }
`,Z=`
  uniform vec3 uSunDir;
  varying vec3 vWorldNormal;
  varying vec3 vViewNormal;

  void main() {
    float rim = pow(1.0 - clamp(dot(vViewNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 2.5);
    float day = smoothstep(-0.3, 0.5, dot(normalize(vWorldNormal), uSunDir));
    gl_FragColor = vec4(0.45, 0.72, 1.0, clamp(rim * (0.2 + 0.8 * day), 0.0, 1.0));
  }
`,$=`
  uniform vec3 uSunDir;
  varying vec3 vWorldNormal;
  varying vec3 vViewNormal;

  void main() {
    float k = clamp(-vViewNormal.z, 0.0, 1.0);
    float day = 0.3 + 0.7 * smoothstep(-0.5, 0.6, dot(normalize(vWorldNormal), uSunDir));
    gl_FragColor = vec4(0.35, 0.65, 1.0, clamp(pow(k, 2.0) * 2.2 * day, 0.0, 1.0));
  }
`,J="photo",b=new Map;function K(e){let t=b.get(e);return t||(t=new G().loadAsync(e),t.catch(()=>b.delete(e)),b.set(e,t)),t}function Q(){return window.matchMedia("(pointer: coarse)").matches}function ee(e){const t=navigator.connection;return t!=null&&t.saveData?"none":e.capabilities.maxTextureSize>=4096?"4k":"none"}function F(e,t){const n=t.capabilities.getMaxAnisotropy();e.anisotropy!==n&&(e.anisotropy=n,e.needsUpdate=!0)}function _(e,t){const n=L(i=>i.gl),[r,u]=o.useState(null);return o.useLayoutEffect(()=>F(e,n),[e,n]),o.useEffect(()=>{if(!t)return;let i=!1;return K(t).then(c=>{i||(F(c,n),n.initTexture(c),u(c))}).catch(()=>{}),()=>{i=!0}},[t,n]),r??e}const te="#bfd4ff",ne=.9,ae=[0,-Math.PI/2,0],D=()=>null;function re({sunDir:e,dayTextureUrl:t="/textures/earth_2k.jpg",nightTextureUrl:n="/textures/earth_lights_2k.jpg",enableHiRes:r=!0,style:u=J}){const[i,c]=V(G,[t,n]),l=L(M=>M.gl),s=o.useMemo(()=>r?ee(l):"none",[l,r]),f=s==="4k"?t.replace("_2k","_4k"):null,d=s==="4k"&&!Q()?n.replace("_2k","_4k"):null,v=_(i,f),x=_(c,d),p=u==="data",g=p?.12:1,m=o.useMemo(()=>new E("#ffffff").lerp(new E("#0b1630"),p?.97:0),[p]),h=o.useMemo(()=>({uLights:{value:c},uSunDir:{value:e},uTint:{value:new E(te)},uIntensity:{value:ne},uFade:{value:g}}),[c,e,g]);o.useEffect(()=>{h.uLights.value=x},[h,x]);const y=o.useMemo(()=>({uTime:{value:0},uSunDir:{value:e},uFade:{value:g}}),[e,g]);return C(({clock:M})=>{y.uTime.value=M.elapsedTime*.02}),a.jsxs("group",{rotation:ae,children:[a.jsxs("mesh",{children:[a.jsx("sphereGeometry",{args:[1,128,128]}),a.jsx("meshStandardMaterial",{map:v,color:m,roughness:.9,metalness:0})]}),a.jsxs("mesh",{scale:1.001,raycast:D,renderOrder:1,children:[a.jsx("sphereGeometry",{args:[1,128,128]}),a.jsx("shaderMaterial",{transparent:!0,depthWrite:!1,blending:z,uniforms:h,vertexShader:S,fragmentShader:X})]}),a.jsxs("mesh",{scale:1.012,raycast:D,renderOrder:2,children:[a.jsx("sphereGeometry",{args:[1,128,128]}),a.jsx("shaderMaterial",{transparent:!0,depthWrite:!1,uniforms:y,vertexShader:S,fragmentShader:q})]}),p&&a.jsx(ie,{texture:i})]})}function oe(){const e=document.createElement("canvas");e.width=e.height=64;const t=e.getContext("2d"),n=t.createRadialGradient(32,32,0,32,32,32);return n.addColorStop(0,"rgba(255,255,255,1)"),n.addColorStop(.25,"rgba(255,255,255,0.8)"),n.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=n,t.fillRect(0,0,64,64),new H(e)}function se(e,t){const n=e.image,r=1024,u=512,i=document.createElement("canvas");i.width=r,i.height=u;const c=i.getContext("2d");if(!c)return new Float32Array(0);c.drawImage(n,0,0,r,u);const l=c.getImageData(0,0,r,u).data,s=Math.PI*(3-Math.sqrt(5)),f=[];for(let d=0;d<t;d++){const v=1-2*(d+.5)/t,x=Math.sqrt(1-v*v),p=s*d,g=Math.cos(p)*x,m=Math.sin(p)*x;let h=Math.atan2(m,-g);h<0&&(h+=Math.PI*2);const y=Math.min(r-1,Math.floor(h/(Math.PI*2)*r)),j=(Math.min(u-1,Math.floor(Math.acos(v)/Math.PI*u))*r+y)*4;!(l[j+2]>l[j]*1.25+4&&l[j+2]>=l[j+1]*.9)&&Math.abs(v)<.93&&f.push(g*1.004,v*1.004,m*1.004)}return new Float32Array(f)}function ie({texture:e}){const t=o.useMemo(()=>oe(),[]);o.useEffect(()=>()=>t.dispose(),[t]);const n=o.useMemo(()=>{const r=new Y;return r.setAttribute("position",new B(se(e,6e4),3)),r},[e]);return o.useEffect(()=>()=>n.dispose(),[n]),a.jsx("points",{geometry:n,raycast:D,renderOrder:3,children:a.jsx("pointsMaterial",{map:t,size:.013,sizeAttenuation:!0,color:"#8EC5FF",transparent:!0,depthWrite:!1,blending:z})})}const I=()=>null;function ce({sunDir:e}){const t=o.useMemo(()=>({uSunDir:{value:e}}),[e]);return a.jsxs(a.Fragment,{children:[a.jsxs("mesh",{scale:1.004,raycast:I,renderOrder:4,children:[a.jsx("sphereGeometry",{args:[1,96,96]}),a.jsx("shaderMaterial",{transparent:!0,depthWrite:!1,uniforms:t,vertexShader:S,fragmentShader:Z})]}),a.jsxs("mesh",{scale:1.16,raycast:I,children:[a.jsx("sphereGeometry",{args:[1,96,96]}),a.jsx("shaderMaterial",{transparent:!0,depthWrite:!1,side:U,uniforms:t,vertexShader:S,fragmentShader:$})]})]})}const le=6,ue=1.5,de=3,A=new T,N=new T,k=new T;function me({sunDir:e,lightRef:t}){return C(({camera:n})=>{var r;A.setFromMatrixColumn(n.matrixWorld,0),N.setFromMatrixColumn(n.matrixWorld,1),k.copy(n.position).normalize(),e.set(0,0,0).addScaledVector(A,le).addScaledVector(N,ue).addScaledVector(k,de).normalize(),(r=t.current)==null||r.position.copy(e).multiplyScalar(10)}),null}function he(e,t,n){const r=Math.sqrt(e*e+t*t+n*n)||1;return{lat:Math.asin(t/r)*180/Math.PI,lon:Math.atan2(e,n)*180/Math.PI}}function fe(e,t=4e3){const n=o.useRef(null),r=o.useRef(!1),u=o.useRef(!1),i=o.useCallback(()=>{n.current&&(clearTimeout(n.current),n.current=null)},[]),c=o.useCallback(()=>{i();const s=e.current;s&&(s.autoRotate=!1)},[i,e]),l=o.useCallback(()=>{i(),!(r.current||u.current)&&(n.current=setTimeout(()=>{const s=e.current;s&&(s.autoRotate=!0)},t))},[i,e,t]);return o.useEffect(()=>{const s=e.current;if(!s)return;const f=()=>{r.current=!0,c()},d=()=>{r.current=!1,l()};return s.addEventListener("start",f),s.addEventListener("end",d),()=>{i(),s.removeEventListener("start",f),s.removeEventListener("end",d)}},[e,c,l,i]),o.useCallback(s=>{u.current=s,s?c():l()},[c,l])}function ve(){const{camera:e,size:t}=L();return C(()=>{const n=t.width/t.height;if(n>=1)return;const u=e.fov*Math.PI/180,i=2*Math.atan(Math.tan(u/2)*n),c=1.05/Math.tan(i/2),l=Math.min(4.5,Math.max(2.1,c)),s=e.position.length();Math.abs(s-l)>.01&&e.position.setLength(l)}),null}function pe({backgroundColor:e="#0F1117",dayTextureUrl:t="/textures/earth_2k.jpg",nightTextureUrl:n="/textures/earth_lights_2k.jpg",enableHiRes:r=!0,autoRotate:u=!0,autoRotateSpeed:i=1,minZoomDistance:c=2.1,maxZoomDistance:l=4.5,onClick:s}){const f=o.useRef(null);fe(f);const d=o.useMemo(()=>new T(6,1.5,3).normalize(),[]),v=o.useRef(null),x=o.useRef(null),p=m=>{x.current={x:m.nativeEvent.clientX,y:m.nativeEvent.clientY}},g=m=>{if(m.stopPropagation(),!s)return;const h=x.current;if(h){const w=m.nativeEvent.clientX-h.x,R=m.nativeEvent.clientY-h.y;if(w*w+R*R>64)return}const y=m.point.clone().normalize(),{lat:M,lon:j}=he(y.x,y.y,y.z);s(M,j)};return a.jsxs(a.Fragment,{children:[a.jsx("color",{attach:"background",args:[e]}),a.jsx("ambientLight",{intensity:.12}),a.jsx("directionalLight",{ref:v,intensity:3}),a.jsx("directionalLight",{position:[-4,-2,-3],intensity:.15,color:"#3c7dff"}),a.jsx(me,{sunDir:d,lightRef:v}),a.jsx(P,{radius:100,depth:50,count:5e3,factor:4,saturation:0,fade:!0,speed:1}),a.jsx(ve,{}),a.jsxs("group",{onPointerDown:p,onClick:g,children:[a.jsx(re,{sunDir:d,dayTextureUrl:t,nightTextureUrl:n,enableHiRes:r}),a.jsx(ce,{sunDir:d})]}),a.jsx(W,{ref:f,enablePan:!1,enableDamping:!0,dampingFactor:.08,minDistance:c,maxDistance:l,minPolarAngle:.15,maxPolarAngle:Math.PI-.15,autoRotate:u,autoRotateSpeed:i})]})}function ye({...e}){return a.jsx(O,{camera:{position:[0,0,3],fov:45},gl:{antialias:!0,alpha:!1},dpr:[1,2],style:{width:"100%",height:"100%"},children:a.jsx(o.Suspense,{fallback:null,children:a.jsx(pe,{...e})})})}export{ye as default};
