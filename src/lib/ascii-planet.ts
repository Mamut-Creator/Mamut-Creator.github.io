// Esfera proyectada en una cuadrícula de caracteres; no usa WebGL ni modelos.
export function mountAsciiPlanet(host:HTMLElement){
 const canvas=host.querySelector<HTMLCanvasElement>('canvas')!;
 const context=canvas.getContext('2d');if(!context)return;
 const ctx=context;
 const hero=host.closest<HTMLElement>('.hero')!;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let width=0,height=0,angle=0,target=0,frame=0,visible=true,destroyed=false;
 const columns=86,rows=50;
 function draw(){
  if(!width||!height)return;
  ctx.clearRect(0,0,width,height);
  const cw=width/columns,ch=height/rows;
  ctx.font=`${cw*1.65}px "JetBrains Mono", monospace`;
  ctx.textAlign='center';ctx.textBaseline='middle';
  const cosine=Math.cos(angle),sine=Math.sin(angle);
  for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){
   const x=((col+.5)/columns*2-1)*1.08;
   const y=(1-(row+.5)/rows*2)*1.08;
   const radius=x*x+y*y;if(radius>=1)continue;
   const z=Math.sqrt(1-radius);
   const localX=x*cosine-z*sine,localZ=x*sine+z*cosine;
   const longitude=Math.atan2(localX,localZ),latitude=Math.asin(y);
   // Méridiens, parallèles et matière granuleuse du globe.
   const meridian=Math.abs(Math.sin(longitude*9))<.11;
   const parallel=Math.abs(Math.sin(latitude*10))<.12;
   const land=Math.sin(longitude*3.3+Math.sin(latitude*5))*Math.cos(latitude*4.1-longitude)>.27;
   let glyph=meridian||parallel?'+':land?':':'.';
   let brightness=(meridian||parallel?.35:land?.25:.10)*(.35+z*.65);
   const eyeX=longitude,eyeY=latitude-.04;
   const extent=.9;
   if(Math.abs(eyeX)<extent){
    const outline=.34*(1-Math.pow(eyeX/extent,2));
    const distance=Math.abs(Math.abs(eyeY)-outline);
    if(distance<.032){glyph='@';brightness=.95;}
    else if(Math.abs(eyeY)<outline){
     const iris=Math.hypot(eyeX,eyeY*1.08);
     if(iris<.095){glyph=' ';brightness=0;}
     else if(iris<.205){glyph=Math.abs(iris-.18)<.035?'@':'#';brightness=.85;}
     else{glyph=':';brightness=.44;}
    }
    // Un second trait de paupière rappelle le regard du logo Nmap.
    if(eyeY>0&&Math.abs(eyeY-outline-.09)<.023){glyph='+';brightness=.55;}
   }
   const edge=radius>.955;
   if(edge&&brightness<.4){glyph=':';brightness=.35;}
   ctx.fillStyle=`rgba(186,181,205,${brightness})`;
   ctx.fillText(glyph,(col+.5)*cw,(row+.5)*ch);
  }
  host.classList.add('is-rendered');host.dataset.rotation=angle.toFixed(3);
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
