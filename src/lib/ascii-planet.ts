// Esfera proyectada en una cuadrícula de caracteres; no usa WebGL ni modelos.
export function mountAsciiPlanet(host:HTMLElement){
 const canvas=host.querySelector<HTMLCanvasElement>('canvas')!;
 const context=canvas.getContext('2d');if(!context)return;
 const ctx=context;
 const hero=host.closest<HTMLElement>('.hero')!;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let width=0,height=0,angle=0,target=0,frame=0,visible=true,destroyed=false;
 const columns=150,rows=88;
 let eyePixels:Uint8ClampedArray|undefined;
 const textureWidth=480,textureHeight=232;
 const reference=new Image();
 reference.onload=()=>{
  const texture=document.createElement('canvas');texture.width=textureWidth;texture.height=textureHeight;
  const textureContext=texture.getContext('2d',{willReadFrequently:true});if(!textureContext)return;
  // Solo el ojo de la referencia: se excluyen el fondo exterior y las letras.
  textureContext.drawImage(reference,8,78,480,232,0,0,textureWidth,textureHeight);
  eyePixels=textureContext.getImageData(0,0,textureWidth,textureHeight).data;
  draw();
 };
 reference.src='/images/nmap-eye-reference.png';
 function draw(){
  if(!width||!height)return;
  ctx.clearRect(0,0,width,height);
  const cw=width/columns,ch=height/rows;
  ctx.font=`${cw*1.72}px "JetBrains Mono", monospace`;
  ctx.textAlign='center';ctx.textBaseline='middle';
  const cosine=Math.cos(angle),sine=Math.sin(angle);
  for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){
   const x=((col+.5)/columns*2-1)*1.08;
   const y=(1-(row+.5)/rows*2)*1.08;
   const radius=x*x+y*y;if(radius>=1)continue;
   const z=Math.sqrt(1-radius);
   const localX=x*cosine-z*sine,localZ=x*sine+z*cosine;
   const longitude=Math.atan2(localX,localZ),latitude=Math.asin(y);
   // Malla tenue para que el ojo sea el protagonista y se lea el volumen.
   const meridian=Math.abs(Math.sin(longitude*12))<.075;
   const parallel=Math.abs(Math.sin(latitude*14))<.09;
   let glyph=meridian||parallel?'+':'.';
   let brightness=(meridian||parallel?.22:.065)*(.25+z*.75);
   let cyan=false;
   const eyeX=longitude,eyeY=latitude-.04;
   const extent=1.05;
   if(eyePixels&&Math.abs(eyeX)<extent&&Math.abs(eyeY)<.53){
    const tx=Math.min(textureWidth-1,Math.floor((eyeX/extent+1)*.5*textureWidth));
    const ty=Math.min(textureHeight-1,Math.floor((1-eyeY/.53)*.5*textureHeight));
    const offset=(ty*textureWidth+tx)*4;
    const r=eyePixels[offset],g=eyePixels[offset+1],b=eyePixels[offset+2];
    const chroma=Math.max(g,b)-r;
    if(chroma>9){
     const ink=1-(r*.2126+g*.7152+b*.0722)/255;
     const density=Math.min(1,ink*1.65);
     const ramp=' .,:;=+*#%@';
     glyph=ramp[Math.min(ramp.length-1,Math.floor(density*(ramp.length-1)))];
     brightness=(.2+density*.8)*(.65+z*.35);cyan=true;
     // Mantiene la pupila oscura y la retícula clara de la referencia.
     if(ink<.13){glyph='.';brightness=.22;}
     const irisX=tx-241,irisY=ty-112,irisRadius=Math.hypot(irisX,irisY);
     const outerIris=Math.hypot(irisX,irisY*1.16);
     if(outerIris>32&&outerIris<87){
      const polar=Math.atan2(irisY*1.16,irisX);
      const radialLine=Math.abs(Math.sin(polar*52+outerIris*.018))<.22;
      const circularLine=Math.abs(Math.sin(outerIris*.55))<.2;
      glyph=radialLine&&circularLine?'#':radialLine?'|':circularLine?'=':':';
      brightness=radialLine||circularLine?.78:.33;
     }
     if(Math.abs(outerIris-86)<2){glyph='*';brightness=.88;}
     if(irisRadius<30){glyph=':';brightness=.13;}
     if(Math.abs(irisRadius-31)<2){glyph='@';brightness=.9;}
     if((Math.abs(irisX)<1.7||Math.abs(irisY)<1.7)&&irisRadius<73){glyph='+';brightness=.86;}
     if(Math.abs(irisRadius-10)<1.8){glyph='@';brightness=1;}
    }
   }else if(!eyePixels&&Math.abs(eyeX)<extent){
    const outline=.34*(1-Math.pow(eyeX/extent,2));
    const distance=Math.abs(Math.abs(eyeY)-outline);
    if(distance<.032){glyph='@';brightness=.95;}
    else if(Math.abs(eyeY)<outline){
     const iris=Math.hypot(eyeX,eyeY*1.08);
     if(iris<.095){glyph=' ';brightness=0;}
     else if(iris<.205){glyph=Math.abs(iris-.18)<.035?'@':'#';brightness=.85;}
     else{glyph=':';brightness=.44;}
    }
    // Segundo borde de párpado para la versión procedural de reserva.
    if(eyeY>0&&Math.abs(eyeY-outline-.09)<.023){glyph='+';brightness=.55;}
   }
   const edge=radius>.955;
   if(edge&&brightness<.25){glyph=':';brightness=.24;}
   ctx.fillStyle=cyan?`rgba(134,200,214,${brightness})`:`rgba(151,163,183,${brightness})`;
   ctx.fillText(glyph,(col+.5)*cw,(row+.5)*ch);
  }
  host.classList.add('is-rendered');host.dataset.rotation=angle.toFixed(3);host.dataset.detail=eyePixels?'reference':'procedural';
 }
 function tick(){frame=0;if(destroyed||!visible||document.hidden)return;
  angle+=(target-angle)*.14;if(Math.abs(target-angle)<.001)angle=target;
  draw();if(angle!==target)frame=requestAnimationFrame(tick);
 }
 function requestDraw(){if(!frame&&!destroyed&&visible&&!document.hidden)frame=requestAnimationFrame(tick);}
 function updateScroll(){
  const distance=Math.max(0,-hero.getBoundingClientRect().top+78);
  target=reduced.matches?0:Math.min(distance/Math.max(hero.offsetHeight,1),1.5)*1.65;
  requestDraw();
 }
 const resize=new ResizeObserver(()=>{const rect=host.getBoundingClientRect();width=rect.width;height=rect.height;
  const dpr=Math.min(devicePixelRatio,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();updateScroll();});resize.observe(host);
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)updateScroll();else if(frame){cancelAnimationFrame(frame);frame=0}});observer.observe(host);
 const onVisibility=()=>{if(!document.hidden)updateScroll()};
 const onReduced=()=>{if(reduced.matches){angle=0;target=0;}draw();updateScroll()};
 window.addEventListener('scroll',updateScroll,{passive:true});document.addEventListener('visibilitychange',onVisibility);reduced.addEventListener('change',onReduced);
 const cleanup=(event:PageTransitionEvent)=>{if(event.persisted)return;destroyed=true;cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();window.removeEventListener('scroll',updateScroll);document.removeEventListener('visibilitychange',onVisibility);reduced.removeEventListener('change',onReduced)};
 window.addEventListener('pagehide',cleanup);window.addEventListener('pageshow',updateScroll);
 document.fonts.ready.then(()=>{if(!destroyed)draw()});updateScroll();
}
