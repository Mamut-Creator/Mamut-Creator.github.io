import * as THREE from 'three';

export function mountObsidian(host:HTMLElement){
 const canvas=host.querySelector<HTMLCanvasElement>('canvas')!;
 let renderer:THREE.WebGLRenderer;
 try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});}catch{return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
 renderer.setClearColor(0x000000,0);
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.5;
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(35,1,.1,40);camera.position.set(0,.25,7.2);
 const sculpture=new THREE.Group();scene.add(sculpture);
 const geometry=new THREE.IcosahedronGeometry(1.22,0);geometry.scale(.84,1.3,.84);
 const surface=new THREE.MeshStandardMaterial({color:0x33303e,metalness:.72,roughness:.3,flatShading:true});
 const core=new THREE.Mesh(geometry,surface);core.rotation.set(.12,.15,.12);sculpture.add(core);
 const edgeGeometry=new THREE.EdgesGeometry(geometry);
 const edgeMaterial=new THREE.LineBasicMaterial({color:0xc1b0e1,transparent:true,opacity:.55});
 const edges=new THREE.LineSegments(edgeGeometry,edgeMaterial);core.add(edges);
 const innerGeometry=new THREE.IcosahedronGeometry(.58,0);
 const innerMaterial=new THREE.MeshBasicMaterial({color:0x9484b8,wireframe:true,transparent:true,opacity:.18});
 const inner=new THREE.Mesh(innerGeometry,innerMaterial);sculpture.add(inner);
 const rings:THREE.Mesh[]=[];
 const ringMaterial=new THREE.MeshBasicMaterial({color:0x8e7fae,transparent:true,opacity:.3});
 for(let i=0;i<2;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(1.83+i*.22,.006,5,120),ringMaterial);ring.rotation.set(1.05+i*.7,.25+i*.45,-.45);rings.push(ring);sculpture.add(ring);}
 const satelliteGeometry=new THREE.OctahedronGeometry(.075);
 const satelliteMaterial=new THREE.MeshStandardMaterial({color:0xd2bfdc,metalness:.5,roughness:.3});
 const satellites=Array.from({length:3},()=>{const mesh=new THREE.Mesh(satelliteGeometry,satelliteMaterial);sculpture.add(mesh);return mesh});
 scene.add(new THREE.AmbientLight(0x91859f,1.8));
 const key=new THREE.DirectionalLight(0xd8c8ff,5);key.position.set(-3,4,4);scene.add(key);
 const rim=new THREE.DirectionalLight(0x7f9dcc,4);rim.position.set(3,0,-2);scene.add(rim);
 const fill=new THREE.PointLight(0xc39fb5,12,15);fill.position.set(1,-2,3);scene.add(fill);
 const motion=matchMedia('(prefers-reduced-motion: reduce)');let visible=true,disposed=false;
 const pointer={x:0,y:0};let elapsed=0,lastFrame=0;
 const onPointer=(event:PointerEvent)=>{pointer.x=(event.clientX/innerWidth-.5)*.3;pointer.y=(event.clientY/innerHeight-.5)*.2};
 window.addEventListener('pointermove',onPointer,{passive:true});
 const draw=(time=0)=>{
  if(disposed)return;if(time && time-lastFrame<32)return;
  const delta=lastFrame?Math.min((time-lastFrame)/1000,.05):0;lastFrame=time;
  if(!motion.matches)elapsed+=delta;
  sculpture.rotation.y=elapsed*.13+(motion.matches?0:pointer.x);
  sculpture.rotation.x=motion.matches?0:pointer.y;
  sculpture.position.y=motion.matches?0:Math.sin(elapsed*.7)*.075;
  core.rotation.y=.15+elapsed*.1;inner.rotation.y=-elapsed*.22;
  rings[0].rotation.z=-.45+elapsed*.05;rings[1].rotation.z=-.45-elapsed*.04;
  satellites.forEach((mesh,i)=>{const angle=i*Math.PI*2/3+elapsed*.23;mesh.position.set(Math.cos(angle)*1.84,Math.sin(angle)*.8,Math.sin(angle)*1.1);mesh.rotation.y=angle});
  renderer.render(scene,camera);host.classList.add('is-rendered');
 };
 function sync(){lastFrame=0;renderer.setAnimationLoop(visible&&!document.hidden&&!motion.matches?draw:null);draw();}
 const resize=new ResizeObserver(()=>{const {width,height}=host.getBoundingClientRect();renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();draw();});resize.observe(host);
 const visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()});visibility.observe(host);
 document.addEventListener('visibilitychange',sync);motion.addEventListener('change',sync);
 const onContextLost=(event:Event)=>{event.preventDefault();host.classList.remove('is-rendered');renderer.setAnimationLoop(null)};canvas.addEventListener('webglcontextlost',onContextLost);
 const cleanup=()=>{if(disposed)return;disposed=true;renderer.setAnimationLoop(null);resize.disconnect();visibility.disconnect();window.removeEventListener('pointermove',onPointer);document.removeEventListener('visibilitychange',sync);motion.removeEventListener('change',sync);canvas.removeEventListener('webglcontextlost',onContextLost);geometry.dispose();edgeGeometry.dispose();innerGeometry.dispose();satelliteGeometry.dispose();rings.forEach(ring=>ring.geometry.dispose());[surface,edgeMaterial,innerMaterial,ringMaterial,satelliteMaterial].forEach(material=>material.dispose());renderer.dispose()};
 window.addEventListener('pagehide',(event)=>{if(event.persisted)renderer.setAnimationLoop(null);else cleanup()});
 window.addEventListener('pageshow',()=>{if(!disposed)sync()});draw();sync();
}
