import * as THREE from "three";
const G=window.GAME_DATA;
const {MAP,TEAM,PLAYER,CHATTER,CLEANERS}=G;
const SMALLTALK=G.SMALLTALK||[["Coffee or tea today?","Coffee. Definitely."]];
const SOLO=G.SOLO||["Ahh, I needed this."];
const REACT=G.REACT||["Haha, true."];
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const PI=Math.PI, rad=d=>d*PI/180, rnd=a=>a[Math.random()*a.length|0], clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const wrap=a=>{while(a>PI)a-=2*PI;while(a<-PI)a+=2*PI;return a;};

const scene=new THREE.Scene(); scene.background=new THREE.Color('#9ec9e8');
const cam=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,.1,700);
const ren=new THREE.WebGLRenderer({antialias:true}); ren.setSize(innerWidth,innerHeight); ren.setPixelRatio(Math.min(devicePixelRatio,2));
document.body.prepend(ren.domElement);
scene.add(new THREE.HemisphereLight('#fff','#889',1.1));
const sun=new THREE.DirectionalLight('#fff',1.2); sun.position.set(5,10,3); scene.add(sun);

const mat=c=>new THREE.MeshLambertMaterial({color:c});
const box=(w,h,d,c,x=0,y=0,z=0,p=scene)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),(c.isMaterial||Array.isArray(c))?c:mat(c));m.position.set(x,y,z);p.add(m);return m;};

// ---- characters (blocky rig) ----
const shade=(h,a)=>{const n=parseInt(h.slice(1),16),c=v=>Math.max(0,Math.min(255,v+a));return '#'+((1<<24)|(c(n>>16)<<16)|(c((n>>8)&255)<<8)|c(n&255)).toString(16).slice(1);};
const px=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;t.colorSpace=THREE.SRGBColorSpace;return t;};
const tmat=t=>new THREE.MeshLambertMaterial({map:t});
function faceTex(skin,hair,style){ // fallback drawn face (used for the player)
  const t=px(8,8,g=>{
    g.fillStyle=skin;g.fillRect(0,0,8,8);g.fillStyle=hair;g.fillRect(0,0,8,2);g.fillRect(0,0,1,3);g.fillRect(7,0,1,3);
    g.fillStyle='#fff';g.fillRect(1,4,2,1);g.fillRect(5,4,2,1);g.fillStyle='#223';g.fillRect(2,4,1,1);g.fillRect(5,4,1,1);
  });return t;
}
function circle(g,x,y,r,col){g.fillStyle=col;g.beginPath();g.arc(x,y,r,0,7);g.fill();}
function tri(g,col,a,b,c){g.fillStyle=col;g.beginPath();g.moveTo(...a);g.lineTo(...b);g.lineTo(...c);g.closePath();g.fill();}
function torsoFront(L,skin){return px(80,112,(g,w,h)=>{
  const top=L.top,shirt=L.shirt||'#f2f2f2',dk=shade(top,-30),o=L.outfit;
  g.fillStyle=top;g.fillRect(0,0,w,h);
  if(L.pattern){L.pattern.forEach((c,i)=>{g.fillStyle=c;g.beginPath();g.moveTo(i*22,0);g.lineTo(i*22+26,0);g.lineTo(i*22-10,h);g.lineTo(i*22-36,h);g.fill();});}
  if(o==='suit'){
    g.fillStyle=shade(top,12);g.beginPath();g.moveTo(12,0);g.lineTo(27,0);g.lineTo(42,72);g.lineTo(28,78);g.fill();
    g.beginPath();g.moveTo(68,0);g.lineTo(53,0);g.lineTo(38,72);g.lineTo(52,78);g.fill();
    tri(g,shirt,[27,0],[53,0],[40,62]);
    if(!L.tie)tri(g,skin,[34,0],[46,0],[40,17]);
    tri(g,shade(shirt,-12),[27,0],[39,0],[29,17]);tri(g,shade(shirt,-12),[53,0],[41,0],[51,17]);
    if(L.tie){g.fillStyle=L.tie;g.fillRect(36,4,8,8);g.beginPath();g.moveTo(36,12);g.lineTo(44,12);g.lineTo(46,52);g.lineTo(40,58);g.lineTo(34,52);g.fill();g.fillStyle=shade(L.tie,22);g.fillRect(39,14,2,36);}
    g.strokeStyle=dk;g.lineWidth=2;g.beginPath();g.moveTo(26,0);g.lineTo(40,64);g.lineTo(54,0);g.stroke();
    circle(g,40,76,2.4,dk);circle(g,40,90,2.4,dk);
    g.strokeStyle=dk;g.strokeRect(10,42,16,3);
  }else if(o==='zip'){
    g.fillStyle=shade(top,-16);g.fillRect(0,0,w,10);g.fillStyle='#8c8c93';g.fillRect(39,0,2,h);g.fillStyle='#c8c8cf';g.fillRect(37,12,6,5);
    g.strokeStyle=dk;g.lineWidth=2;g.beginPath();g.moveTo(8,70);g.lineTo(22,100);g.moveTo(72,70);g.lineTo(58,100);g.stroke();
    if(L.logo){g.fillStyle=L.logo;g.fillRect(56,30,10,10);g.fillStyle=top;g.fillRect(58,32,6,6);}
  }else if(o==='shirt'||o==='polo'){
    const fl=shade(top,o==='polo'?-14:18);
    tri(g,skin,[33,0],[47,0],[40,14]);tri(g,fl,[25,0],[40,14],[40,0]);tri(g,fl,[55,0],[40,14],[40,0]);
    g.fillStyle=shade(top,10);g.fillRect(37,14,6,o==='polo'?30:h);
    [24,36,48].slice(0,o==='polo'?2:3).forEach(y=>circle(g,40,y,1.8,shade(top,-40)));
    if(o==='shirt'){circle(g,40,62,1.8,shade(top,-40));circle(g,40,76,1.8,shade(top,-40));circle(g,40,90,1.8,shade(top,-40));g.strokeStyle=dk;g.strokeRect(12,36,15,13);}
    if(o==='polo'){g.fillStyle='#d9d9de';g.fillRect(56,32,10,9);g.fillStyle=top;g.fillRect(58,34,6,5);}
    if(L.belt){g.fillStyle='#15151a';g.fillRect(0,102,w,9);g.fillStyle='#b8962e';g.fillRect(36,103,8,7);}
  }else if(o==='baju'){
    g.fillStyle=shade(top,-26);g.fillRect(28,0,24,7);circle(g,40,3.5,2,'#d4af37');circle(g,40,20,2,'#d4af37');
    g.strokeStyle=shade(top,-26);g.lineWidth=2;g.beginPath();g.moveTo(40,7);g.lineTo(40,h);g.stroke();g.strokeRect(11,40,15,14);
  }else if(o==='blouse'){
    tri(g,skin,[27,0],[53,0],[40,34]);g.strokeStyle=shade(top,-25);g.lineWidth=2;g.beginPath();g.moveTo(26,0);g.lineTo(40,36);g.lineTo(54,0);g.stroke();
    g.fillStyle=shade(top,10);g.beginPath();g.moveTo(10,60);g.lineTo(70,60);g.lineTo(70,64);g.lineTo(10,64);g.fill();
  }
});}
function torsoBack(L){return px(80,112,(g,w,h)=>{
  g.fillStyle=L.top;g.fillRect(0,0,w,h);
  if(L.pattern){L.pattern.forEach((c,i)=>{g.fillStyle=c;g.beginPath();g.moveTo(i*22,0);g.lineTo(i*22+26,0);g.lineTo(i*22-10,h);g.lineTo(i*22-36,h);g.fill();});}
  if(L.outfit==='suit'){g.strokeStyle=shade(L.top,-30);g.lineWidth=2;g.beginPath();g.moveTo(40,10);g.lineTo(40,h);g.moveTo(40,84);g.lineTo(34,h);g.stroke();g.fillStyle=shade(L.top,-18);g.fillRect(0,0,w,8);}
});}


function drawFace(L,skin){return px(16,16,g=>{
  const P=(x,y,c,w=1,h=1)=>{g.fillStyle=c;g.fillRect(x,y,w,h);};
  const hair=L.hair,hj=L.hijab,st=L.style,sd=shade(skin,-30),sd2=shade(skin,-58),bc=L.beardColor||hair;
  const eye=L.eyeColor||'#2a1d16',white='#f4f1ec',lipC=L.lip||(L.beard||L.moustache?'#5a2f2c':shade(skin,-52));
  P(0,0,skin,16,16);
  if(hj){
    P(0,0,hj,16,16);
    [[5,10],[4,11],[3,12],[3,12],[3,12],[3,12],[3,12],[3,12],[3,12],[4,11],[4,11],[5,10]].forEach((r,i)=>P(r[0],3+i,skin,r[1]-r[0]+1,1));
    P(2,5,shade(hj,-24),1,6);P(13,5,shade(hj,-24),1,6);P(5,2,shade(hj,-18),6,1);
  }else if(st==='songkok'){P(0,0,'#0c0c0e',16,4);P(0,3,'#2e2e33',16,1);P(0,4,hair,2,3);P(14,4,hair,2,3);}
  else if(st==='bob'){P(0,0,hair,16,4);P(0,4,hair,3,9);P(13,4,hair,3,9);P(3,3,hair,4,1);P(9,3,hair,4,1);}
  else if(st==='quiff'){P(0,0,hair,16,3);P(0,3,hair,5,1);P(11,3,hair,5,1);P(0,4,hair,2,3);P(14,4,hair,2,3);}
  else{P(0,0,hair,16,2);P(0,2,hair,3,1);P(13,2,hair,3,1);P(0,3,hair,1,3);P(15,3,hair,1,3);}
  // brows, lids, eyes
  const brw=L.browColor||(hj?'#2c211c':shade(hair,-8));
  [3,9].forEach(x=>{P(x,5,brw,4,1);if(L.brow===2)P(x,4,brw,4,1);});
  P(3,6,sd,3,1);P(10,6,sd,3,1);
  P(3,7,white);P(4,7,eye,2,1);P(10,7,eye,2,1);P(12,7,white);
  if(L.lash){P(3,6,'#2a2220',3,1);P(10,6,'#2a2220',3,1);}
  // nose
  P(7,8,shade(skin,-12),2,1);P(7,9,sd,2,1);P(7,10,sd2,2,1);
  // facial hair
  if(L.beard==='full'){P(1,9,bc,2,3);P(13,9,bc,2,3);P(4,11,bc,8,1);P(2,12,bc,12,4);}
  else if(L.beard==='goatee'){P(5,13,bc,6,3);if(L.moustache)P(4,11,bc,8,1);}
  else if(L.moustache)P(4,11,bc,8,1);
  if(L.stubble)for(let y=10;y<16;y++)for(let x=2;x<14;x++)if((x*7+y*13)%5===0)P(x,y,shade(skin,-26));
  // mouth
  if(L.smile){P(5,11,lipC);P(10,11,lipC);P(5,12,lipC);P(10,12,lipC);P(6,12,L.teeth?'#f6f2ee':lipC,4,1);P(6,13,lipC,4,1);}
  else P(6,12,lipC,4,1);
  // glasses
  if(L.glasses){const gc=L.glasses;
    [2,9].forEach(x0=>{for(let i=0;i<5;i++){P(x0+i,6,gc);P(x0+i,9,gc);}for(let j=0;j<4;j++){P(x0,6+j,gc);P(x0+4,6+j,gc);}
      if(L.glassStyle==='round'){P(x0,6,hj?skin:skin);P(x0+4,6,skin);P(x0,9,skin);P(x0+4,9,skin);}});
    P(7,7,gc,2,1);P(0,7,gc,2,1);P(14,7,gc,2,1);}
  if(!L.beard&&!L.goatee)P(5,15,shade(skin,-14),6,1);
});}
function makeRig(p){
  
  const L={outfit:'shirt',sleeve:'long',style:'short',eyeY:.46,mouthY:.12,...(p.look||{})};
  if(L.style==='cap'||L.style==='long'||L.style==='bun')L.style='short';
  const skin=shade(L.skin||p.skin,16),hair=L.hair||p.hair;
  L.top=L.top||p.shirt;const pants=L.pants||p.pants,shoes=L.shoes||'#17171a';
  const sk=mat(skin),root=new THREE.Group(),body=new THREE.Group();root.add(body);
  // torso
  const side=mat(shade(L.top,-8));
  box(.5,.7,.28,[side,side,side,mat(pants),tmat(torsoFront(L,skin)),tmat(torsoBack(L))],0,1.05,0,body);
  if(L.vest){box(.53,.46,.29,L.vest,0,1.12,0,body);box(.535,.05,.295,'#e8e8e8',0,1.0,0,body);}
  if(L.apron){const ap=L.apron;box(.34,.36,.03,ap,0,1.22,.155,body);box(.46,.42,.03,ap,0,.85,.155,body);box(.52,.05,.3,ap,0,.74,0,body);
    [-1,1].forEach(sx=>box(.05,.03,.3,ap,sx*.09,1.405,0,body));box(.2,.05,.03,ap,0,.8,-.155,body);box(.18,.12,.01,shade(ap,22),0,.88,.175,body);}
  // head
  const head=new THREE.Group();head.position.set(0,1.4,0);body.add(head);
  const hj=L.hijab,sideTex=px(8,8,g=>{g.fillStyle=hj||hair;g.fillRect(0,0,8,8);if(!hj){g.fillStyle=skin;g.fillRect(0,3,8,5);g.fillStyle=hair;g.fillRect(0,3,2,2);}});
  const backTex=px(8,8,g=>{g.fillStyle=hj||hair;g.fillRect(0,0,8,8);if(!hj){g.fillStyle=skin;g.fillRect(0,7,8,1);}});
  L.hair=hair;const faceT=drawFace(L,skin),faceM=tmat(faceT);
  box(.5,.5,.5,[tmat(sideTex),tmat(sideTex),mat(hj||hair),sk,faceM,tmat(backTex)],0,.27,0,head);
  const hc=mat(hair);
  if(hj){                                                        // hijab
    box(.54,.04,.5,hj,0,.52,-.02,head);box(.54,.54,.04,hj,0,.27,-.27,head);
    [-1,1].forEach(sx=>box(.03,.54,.5,hj,sx*.265,.27,-.02,head));
    box(.52,.12,.42,hj,0,-.03,-.03,head);
    box(.66,.13,.38,L.drape||hj,0,1.36,0,body);                 // shoulder cape
    box(L.drapeW||.46,.52,.04,L.drape||hj,0,1.08,.16,body);               // chest drape
    box(L.drapeW||.46,.5,.04,L.drape||hj,0,1.08,-.16,body);               // back drape
  }else if(L.style==='songkok'){
    box(.54,.17,.5,'#0c0c0e',0,.57,-.02,head);box(.55,.03,.5,'#2a2a2e',0,.49,-.02,head);
  }else if(L.style==='bob'){
    box(.54,.08,.5,hc,0,.5,-.02,head);
    [-1,1].forEach(sx=>box(.06,.46,.5,hc,sx*.28,.25,-.03,head));
    box(.5,.46,.06,hc,0,.25,-.28,head);
  }else{
    box(.54,.08,.5,hc,0,.5,-.02,head);                          // hair top layer
    if(L.style==='quiff')box(.42,.09,.32,hc,0,.58,.04,head);
  }
  if(L.beard==='full')box(.52,.13,.46,mat(L.beardColor||hair),0,0,-.015,head);
  else if(L.beard==='goatee')box(.2,.1,.05,mat(L.beardColor||hair),0,.05,.27,head);
  if(L.glasses){                                                 // temple arms (the photo already shows the frames)
    const gm=new THREE.MeshLambertMaterial({color:L.glasses}),ey=.285;
    [-1,1].forEach(sx=>box(.012,.014,.2,gm,sx*.256,ey,.16,head));
  }
  const mouth=box(.16,.05,.02,'#3a1414',0,L.mouthY,.258,head);mouth.visible=false;
  // arms
  const sleeveM=mat(L.top),cuff=L.outfit==='suit'?(L.shirt||'#f2f2f2'):null;
  const arm=sx=>{const a=new THREE.Group();a.position.set(sx*.37,1.35,0);body.add(a);
    const sl=L.sleeve==='short'?.24:.55;
    box(.22,sl,.22,sleeveM,0,-sl/2,0,a);
    if(cuff&&sl>.5)box(.225,.05,.225,cuff,0,-sl+.025,0,a);
    box(.22,.7-sl,.22,sk,0,-sl-(.7-sl)/2,0,a);return a;};
  // legs
  const leg=sx=>{const l=new THREE.Group();l.position.set(sx*.13,.7,0);body.add(l);box(.24,.35,.24,pants,0,-.175,0,l);
    const k=new THREE.Group();k.position.y=-.35;l.add(k);box(.24,.35,.24,pants,0,-.175,0,k);box(.26,.08,.3,shoes,0,-.34,.03,k);return [l,k];};
  const [legL,kneeL]=leg(-1),[legR,kneeR]=leg(1);
  const rig={faceCanvas:faceT.image,root,body,head,mouth,armL:arm(-1),armR:arm(1),legL,legR,kneeL,kneeR};
  scene.add(root);return rig;
}
function setPose(r,sit){
  r.body.position.y=sit?-.2:0;
  r.legL.rotation.x=r.legR.rotation.x=sit?-PI/2:0;
  r.kneeL.rotation.x=r.kneeR.rotation.x=sit?PI/2:0;
  r.armL.rotation.x=r.armR.rotation.x=sit?-1.1:0;
}
function swing(r,v){r.legL.rotation.x=v;r.legR.rotation.x=-v;r.armL.rotation.x=-v;r.armR.rotation.x=v;}

// ---- text sprites / plates ----
function makeTag(text,big){
  const c=document.createElement('canvas');c.width=big?512:256;c.height=big?96:64;const g=c.getContext('2d');
  g.fillStyle='#000a';g.fillRect(0,0,c.width,c.height);g.fillStyle='#fff';g.font='bold '+(big?40:28)+'px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(text,c.width/2,c.height/2+2,c.width-16);
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c)}));sp.scale.set(big?3.6:1.6,big?.68:.4,1);return sp;
}

function plateTex(name,role){
  const c=document.createElement('canvas');c.width=320;c.height=84;const g=c.getContext('2d');
  g.fillStyle='#f7f4ec';g.fillRect(0,0,320,84);g.strokeStyle='#445';g.lineWidth=4;g.strokeRect(2,2,316,80);
  g.fillStyle='#222';g.textAlign='center';g.textBaseline='middle';g.font='bold 34px sans-serif';g.fillText(name,160,30,300);
  g.fillStyle='#667';g.font='19px sans-serif';g.fillText(role,160,62,300);
  return new THREE.CanvasTexture(c);
}
function makeBubble(text){
  const f='600 24px sans-serif',m=document.createElement('canvas').getContext('2d');m.font=f;
  const words=text.split(' '),lines=[];let cur='';
  for(const w of words){const t=cur?cur+' '+w:w;if(m.measureText(t).width>300&&cur){lines.push(cur);cur=w;}else cur=t;}
  lines.push(cur);
  const lw=Math.max(...lines.map(l=>m.measureText(l).width)),pad=14,lh=30;
  const c=document.createElement('canvas');c.width=Math.ceil(lw+pad*2);c.height=lines.length*lh+pad*2+12;
  const g=c.getContext('2d');g.font=f;g.textBaseline='top';
  g.fillStyle='#fff';g.strokeStyle='#334';g.lineWidth=3;
  const bh=c.height-12,r=12;g.beginPath();g.roundRect(2,2,c.width-4,bh-2,r);g.fill();g.stroke();
  g.beginPath();g.moveTo(c.width/2-8,bh-2);g.lineTo(c.width/2,c.height-2);g.lineTo(c.width/2+8,bh-2);g.fillStyle='#fff';g.fill();
  g.fillStyle='#222';lines.forEach((l,i)=>g.fillText(l,pad,pad+i*lh));
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false}));
  sp.center.set(.5,0);sp.scale.set(c.width/140,c.height/140,1);sp.renderOrder=10;return sp;
}


// ================= world built from the floor plan =================
const S=MAP.scale,OX=MAP.origin[0],OY=MAP.origin[1];
const P=a=>[(a[0]-OX)*S,(a[1]-OY)*S];
const OUT=MAP.outline.map(P),CORE=MAP.core.map(P);
function inPoly(x,z,poly){let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])c=!c;}return c;}
function segDist(x,z,a,b){const dx=b[0]-a[0],dz=b[1]-a[1];let t=((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz||1);t=clamp(t,0,1);return Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz);}
function polyDist(x,z,poly){let d=1e9;for(let i=0,j=poly.length-1;i<poly.length;j=i++)d=Math.min(d,segDist(x,z,poly[i],poly[j]));return d;}
const OBS=[];
function addObs(poly,tall){let a=1e9,b=-1e9,c=1e9,d=-1e9;for(const q of poly){a=Math.min(a,q[0]);b=Math.max(b,q[0]);c=Math.min(c,q[1]);d=Math.max(d,q[1]);}OBS.push({p:poly,tall:!!tall,a,b,c,d});}
const rectPoly=(cx,cz,hx,hz,ang)=>[[-hx,-hz],[hx,-hz],[hx,hz],[-hx,hz]].map(q=>[cx+q[0]*Math.cos(ang)+q[1]*Math.sin(ang),cz-q[0]*Math.sin(ang)+q[1]*Math.cos(ang)]);
function blockedAt(x,z,r,tallOnly){
  if(!inPoly(x,z,OUT)||polyDist(x,z,OUT)<r)return true;
  for(const o of OBS){if(tallOnly&&!o.tall)continue;if(x<o.a-r||x>o.b+r||z<o.c-r||z>o.d+r)continue;if(inPoly(x,z,o.p)||polyDist(x,z,o.p)<r)return true;}
  return false;
}
addObs(CORE,true);

// floor (2 m carpet tiles), glass outer walls, solid core
{const t=px(64,64,(g,w,h)=>{g.fillStyle='#cbbd9f';g.fillRect(0,0,w,h);g.strokeStyle='#baac8e';g.lineWidth=2;g.strokeRect(1,1,w-2,h-2);});
 t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(.5,.5);t.magFilter=t.minFilter=THREE.LinearFilter;
 const fl=new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape(OUT.map(p=>new THREE.Vector2(p[0],-p[1])))),new THREE.MeshLambertMaterial({map:t}));
 fl.rotation.x=-PI/2;scene.add(fl);}
// floor-to-ceiling glass windows (we are high up in a skyscraper)
{const glass=new THREE.MeshPhongMaterial({color:'#bfe3f5',transparent:true,opacity:.16,shininess:90,specular:'#ffffff',depthWrite:false,side:THREE.DoubleSide}),frame=mat('#aeb7bf');
 for(let i=0;i<OUT.length;i++){
   const a=OUT[i],b=OUT[(i+1)%OUT.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]),g=new THREE.Group();
   g.position.set(a[0],0,a[1]);g.rotation.y=-Math.atan2(b[1]-a[1],b[0]-a[0]);scene.add(g);
   box(L,3,.05,glass,L/2,1.5,0,g);
   box(L,.12,.14,frame,L/2,.06,0,g);box(L,.12,.14,frame,L/2,2.94,0,g);
   const n=Math.max(1,Math.round(L/1.8));for(let k=0;k<=n;k++)box(.07,3,.12,frame,L*k/n,1.5,0,g);
 }}
// the view outside: sky, haze, and a city of towers far below and around
{const c=document.createElement('canvas');c.width=4;c.height=256;const g=c.getContext('2d'),gr=g.createLinearGradient(0,0,0,256);
 gr.addColorStop(0,'#3f86d1');gr.addColorStop(.5,'#8fc3ee');gr.addColorStop(.62,'#dcecf7');gr.addColorStop(1,'#e9f1f6');g.fillStyle=gr;g.fillRect(0,0,4,256);
 const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;
 const dome=new THREE.Mesh(new THREE.SphereGeometry(480,24,16),new THREE.MeshBasicMaterial({map:tx,side:THREE.BackSide,fog:false,depthWrite:false}));dome.renderOrder=-10;scene.add(dome);
 scene.fog=new THREE.Fog('#d9e8f3',200,440);
 const ground=new THREE.Mesh(new THREE.CircleGeometry(560,32),mat('#8ea3b3'));ground.rotation.x=-PI/2;ground.position.y=-150;scene.add(ground);
 let seed=7;const rn=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
 const cols=['#6f8499','#8497aa','#9db0c0','#5f7388','#7d8fa1'];
 for(let i=0;i<110;i++){const an=rn()*2*PI,r=110+rn()*260,w=8+rn()*20,d=8+rn()*20,top=-140+rn()*(r>150?170:60),h=top+150;
   box(w,h,d,cols[(rn()*cols.length)|0],Math.cos(an)*r,top-h/2,Math.sin(an)*r);}
}

{const m=new THREE.Mesh(new THREE.ExtrudeGeometry(new THREE.Shape(CORE.map(p=>new THREE.Vector2(p[0],-p[1]))),{depth:3,bevelEnabled:false}),mat('#8f969d'));m.rotation.x=-PI/2;scene.add(m);}

// "area under cleaning" barriers where the plan is cut off
function stripeTex(len){const t=px(64,16,g=>{g.fillStyle='#f5c518';g.fillRect(0,0,64,16);g.fillStyle='#111';for(let i=-1;i<5;i++){g.beginPath();g.moveTo(i*16,16);g.lineTo(i*16+8,16);g.lineTo(i*16+16,0);g.lineTo(i*16+8,0);g.fill();}});t.wrapS=THREE.RepeatWrapping;t.repeat.set(Math.max(1,len),1);return t;}
for(const br of MAP.barriers){
  const a=P(br.a),b=P(br.b),L=Math.hypot(b[0]-a[0],b[1]-a[1]),mx=(a[0]+b[0])/2,mz=(a[1]+b[1])/2,ang=-Math.atan2(b[1]-a[1],b[0]-a[0]);
  const m=box(L,1.05,.3,tmat(stripeTex(L)),mx,.525,mz);m.rotation.y=ang;
  addObs(rectPoly(mx,mz,L/2,.5,ang),true);
  const s=makeTag('AREA UNDER CLEANING',true);s.position.set(mx,1.9,mz);scene.add(s);
}
MAP.labels.forEach(l=>{const s=makeTag(l[0],true);const q=P(l[1]);s.position.set(q[0],l[2]||2.9,q[1]);s.scale.multiplyScalar(.75);scene.add(s);});

// tables, sofas, armchairs, pantry counter. Every chair / sofa seat is a spot you can sit on (E).
const chairSpots=[];
MAP.blocks.forEach((b,bi)=>{
  const q=P(b.at),a=-rad(b.ang),g=new THREE.Group();g.position.set(q[0],0,q[1]);g.rotation.y=a;scene.add(g);
  const addSit=(lx,lz,faceLocalDeg)=>{chairSpots.push({x:q[0]+lx*Math.cos(a)+lz*Math.sin(a),z:q[1]-lx*Math.sin(a)+lz*Math.cos(a),a:a+rad(faceLocalDeg),num:null,person:null,taken:false,chair:true,table:bi,eat:!!b.eat});};
  if(b.chairs){                                           // table on legs, chairs along both long sides
    box(b.w,.06,b.d,b.color,0,.72,0,g);
    [-1,1].forEach(sx=>[-1,1].forEach(sz=>box(.07,.7,.07,'#6b5035',sx*(b.w/2-.08),.35,sz*(b.d/2-.08),g)));
    const n=b.chairs;
    for(let i=0;i<n;i++){const lx=(i+.5)/n*b.w-b.w/2;[-1,1].forEach(sg=>{
      box(.45,.08,.45,'#3a4660',lx,.43,sg*(b.d/2+.4),g);box(.07,.4,.07,'#222',lx,.2,sg*(b.d/2+.4),g);box(.45,.4,.07,'#2c3550',lx,.67,sg*(b.d/2+.62),g);
      addSit(lx,sg*(b.d/2+.4),sg<0?0:180);});}
  }else if(b.sofa){                                       // sofa / armchair
    const dk=shade(b.color,-14);
    box(b.w,.4,b.d,b.color,0,.2,0,g);box(b.w,.5,.2,dk,0,.65,-b.d/2+.1,g);
    box(.14,.6,b.d,dk,-b.w/2+.07,.4,0,g);box(.14,.6,b.d,dk,b.w/2-.07,.4,0,g);
    const n=b.sits||1;for(let i=0;i<n;i++)addSit((i+.5)/n*b.w-b.w/2,.05,0);
  }else box(b.w,b.h,b.d,b.color,0,b.h/2+(b.nosolid?1.0:0),0,g);
  if(!b.nosolid)addObs(rectPoly(q[0],q[1],b.w/2,b.d/2,a),!!b.tall);
});

// vending machines against the east window + a trash can
const MACHINES=[],VEND=[],TSPOTS=[];let TRASHCAN=null;
function machineTex(label,color,drinks){return px(64,128,(g,w,h)=>{
  g.fillStyle='#2b2f36';g.fillRect(0,0,w,h);g.fillStyle=color;g.fillRect(3,3,w-6,16);
  g.fillStyle='#fff';g.font='bold 11px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(label,w/2,11);
  g.fillStyle='#bfe3f0';g.fillRect(5,24,42,80);
  const cols=drinks?['#d33','#2b7fd0','#2ca05a','#e8a21a','#7b3fa0']:['#f0b429','#e07a2f','#8b5a2b','#c0392b','#3c9d4e'];
  for(let r=0;r<5;r++)for(let c=0;c<4;c++){g.fillStyle=cols[(r*3+c*2)%cols.length];if(drinks)g.fillRect(7+c*10,27+r*15,7,12);else g.fillRect(7+c*10,28+r*15,8,10);}
  g.fillStyle='#111';g.fillRect(8,108,36,12);g.fillStyle='#777';g.fillRect(50,28,10,22);g.fillStyle='#2ecc71';g.fillRect(52,54,6,4);g.fillStyle='#eee';g.fillRect(51,66,8,8);
});}
(MAP.machines||[]).forEach(m=>{
  const q=P(m.at),g=new THREE.Group();g.position.set(q[0],0,q[1]);g.rotation.y=-PI/2;scene.add(g);   // front faces west
  const dk=mat('#2b2f36');box(1,1.9,.85,[dk,dk,dk,dk,tmat(machineTex(m.label,m.color,m.drinks)),dk],0,.95,0,g);
  addObs(rectPoly(q[0],q[1],.5,.425,-PI/2),false);
  MACHINES.push({x:q[0]-1.25,z:q[1],drinks:!!m.drinks});
  [[1.3,0],[2.2,.6],[2.2,-.6]].forEach((o,k)=>VEND.push({x:q[0]-o[0],z:q[1]+o[1],used:false,type:m.drinks?'drink':'snack',k}));
});
if(MAP.trash){
  const q=P(MAP.trash.at);
  box(.5,.75,.5,'#2f6f4e',q[0],.375,q[1]);box(.56,.07,.56,'#245a3e',q[0],.78,q[1]);box(.34,.02,.34,'#0b0b0b',q[0],.82,q[1]);
  addObs(rectPoly(q[0],q[1],.3,.3,0),false);
  const s=makeTag('TRASH');s.scale.multiplyScalar(.8);s.position.set(q[0],1.25,q[1]);scene.add(s);
  TRASHCAN={x:q[0]+1.0,z:q[1]};
  [[1.0,0],[1.0,.7],[1.0,-.7]].forEach((o,k)=>TSPOTS.push({x:q[0]+o[0],z:q[1]+o[1],used:false,k}));
}
// what you / people carry: drinks in the LEFT hand, food in the RIGHT hand
const DRINK_COLS=['#d33','#2b7fd0','#2ca05a','#e8a21a'],SNACK_COLS=['#f0b429','#e07a2f','#8b5a2b','#c0392b'];
function makeHeld(type,arm){const col=rnd(type==='drink'?DRINK_COLS:SNACK_COLS);return type==='drink'?box(.075,.13,.075,col,0,-.7,.1,arm):box(.13,.17,.03,col,0,-.7,.1,arm);}
const dropHeld=m=>{if(m)m.parent.remove(m);return null;};

// ================= desks, pods, people =================
function makePanel(len,h){
  const g=new THREE.Group(),fab=mat('#9ea3a8'),fr=mat('#1a1b1f'),gl=new THREE.MeshPhongMaterial({color:'#cfe6f2',transparent:true,opacity:.28,shininess:80,depthWrite:false,side:THREE.DoubleSide});
  const fh=h*.62,top=h-fh-.08;
  box(len,fh,.05,fab,0,fh/2+.07,0,g);box(len,top,.02,gl,0,fh+.07+top/2,0,g);
  box(len,.04,.07,fr,0,h,0,g);box(len,.04,.07,fr,0,fh+.07,0,g);box(len,.05,.07,fr,0,.05,0,g);
  const n=Math.max(1,Math.round(len/1.8));
  for(let k=0;k<=n;k++){const x=-len/2+len*k/n;box(.04,h,.07,fr,x,h/2,0,g);box(.04,.04,.6,fr,x,.02,0,g);}
  return g;
}
const seats=[],plates=[],DESK={},frames={};
{const c=CORE.reduce((s,p)=>[s[0]+p[0]/CORE.length,s[1]+p[1]/CORE.length],[0,0]);
 for(const k in MAP.walls){const a=P(MAP.walls[k].from),b=P(MAP.walls[k].to),L=Math.hypot(b[0]-a[0],b[1]-a[1]),u=[(b[0]-a[0])/L,(b[1]-a[1])/L];
   let n=[-u[1],u[0]];if((c[0]-a[0])*n[0]+(c[1]-a[1])*n[1]<0)n=[-n[0],-n[1]];frames[k]={o:a,u,n};}}
const KEY={highCorr:[1,1],lowCorr:[-1,1],highWin:[1,-1],lowWin:[-1,-1]};
const faceOf=v=>Math.atan2(v[0],v[1])*180/PI;
for(const [num,wall,u,row] of MAP.desks){
  const f=frames[wall],sv=row==='corr'?1:-1,dir=sv>0?f.n:[-f.n[0],-f.n[1]],o=MAP.podOffset+sv*1.6;
  DESK[num]={num,x:f.o[0]+f.u[0]*u+f.n[0]*o,z:f.o[1]+f.u[1]*u+f.n[1]*o,face:faceOf(dir)};
}
for(const dv of MAP.dividers||[]){                    // thick dividers between pods
  const f=frames[dv.wall],cx=f.o[0]+f.u[0]*dv.u+f.n[0]*MAP.podOffset,cz=f.o[1]+f.u[1]*dv.u+f.n[1]*MAP.podOffset,a=Math.atan2(f.n[0],f.n[1]);
  const ra=Math.atan2(-f.n[1],f.n[0]),g=makePanel(6.8,1.75);g.position.set(cx,0,cz);g.rotation.y=ra;scene.add(g);addObs(rectPoly(cx,cz,3.4,.05,ra),false);
}
for(const s of MAP.screens||[]){                      // long partition walls
  const a=P(s.a),b=P(s.b),L=Math.hypot(b[0]-a[0],b[1]-a[1]),mx=(a[0]+b[0])/2,mz=(a[1]+b[1])/2,ang=-Math.atan2(b[1]-a[1],b[0]-a[0]);
  const g=makePanel(L,1.6);g.position.set(mx,0,mz);g.rotation.y=ang;scene.add(g);addObs(rectPoly(mx,mz,L/2,.05,ang),false);
}
MAP.clusters.forEach(c=>{const q=P([c[1],c[2]]);DESK[c[0]]={num:c[0],x:q[0],z:q[1],face:c[3]};});

const l2w=(s,lx,lz)=>[s.x+lx*Math.cos(s.a)+lz*Math.sin(s.a),s.z-lx*Math.sin(s.a)+lz*Math.cos(s.a)];
function makeSeat(d,info){
  const x=d.x,z=d.z,a=rad(d.face),f=new THREE.Group();f.position.set(x,0,z);f.rotation.y=a;scene.add(f);
  box(.6,.08,.6,'#333',0,.46,0,f);box(.6,.6,.08,'#333',0,.8,-.3,f);box(.08,.44,.08,'#222',0,.22,0,f);
  box(1.6,.08,.8,'#a0714f',0,.78,1.2,f);
  [[-.75,.85],[.75,.85],[-.75,1.55],[.75,1.55]].forEach(q=>box(.06,.78,.06,'#654',q[0],.39,q[1],f));
  const chop=info&&info.look&&info.look.workstation==='chop';let knife=null;
  if(!chop){box(.6,.35,.04,'#111',0,1.1,1.45,f);box(.58,.33,.02,'#4ac',0,1.1,1.43,f);box(.06,.2,.06,'#111',0,.92,1.45,f);box(.5,.03,.18,'#bbb',0,.83,1.05,f);}
  else{ // cutting board with fruit and veg, and a knife
    box(.8,.04,.5,'#c9a46a',0,.84,1.12,f);box(.8,.012,.5,'#b48d55',0,.865,1.12,f);
    box(.1,.1,.1,'#d93a2b',-.22,.92,1.0,f);box(.045,.045,.22,'#f08a1c',-.02,.89,1.05,f).rotation.y=.4;
    [0,1,2,3,4].forEach(i=>box(.075,.02,.075,'#7bc043',.12+i*.085,.88,1.25-(i%2)*.04,f));
    box(.12,.08,.12,'#e8d23a',-.28,.9,1.28,f);box(.2,.1,.2,'#f4f4f6',-.5,.84,1.3,f);box(.17,.05,.17,'#d93a2b',-.5,.9,1.3,f);
    knife=new THREE.Group();knife.position.set(.3,.9,.9);f.add(knife);
    box(.03,.03,.13,'#3a2a20',0,0,-.02,knife);box(.012,.06,.2,'#d0d4da',0,-.02,.14,knife);
  }
  const pm=new THREE.MeshBasicMaterial({map:plateTex(info.name,info.role)}),dm=mat('#8f6a4a');
  plates.push(box(1.6,.4,.04,[dm,dm,dm,dm,pm,dm],0,.56,1.58,f));                // front panel with the name plate (faces away from the chair)
  const s={x,z,a,face:d.face,num:d.num,person:null,knife};seats.push(s);
  const dc=l2w(s,0,1.2);addObs(rectPoly(dc[0],dc[1],.8,.4,a),false);
  return s;
}
const seatByNum={};
Object.values(DESK).sort((p,q)=>p.num-q.num).forEach(d=>{const info=TEAM.find(p=>p.desk===d.num);if(info)seatByNum[d.num]=makeSeat(d,info);});
const people=TEAM.map(p=>{
  const seat=seatByNum[p.desk];if(!seat)throw new Error('no desk '+p.desk+' for '+p.name);
  const rig=makeRig(p);rig.root.position.set(seat.x,0,seat.z);rig.root.rotation.y=seat.a;setPose(rig,true);
  const o={...p,x:seat.x,z:seat.z,rig,seat,ry:seat.a,phase:0,state:'seated',talkUntil:0,met:false,tag:null,bubble:null,group:null,spot:null,path:null,wi:0,waitUntil:0};
  seat.person=o;return o;
});

// ---- team (department) signs above each group of desks ----
{const by={};people.forEach(p=>{(by[p.dept]=by[p.dept]||[]).push(p);});
 for(const dep in by){const l=by[dep],cx=l.reduce((s,p)=>s+p.seat.x,0)/l.length,cz=l.reduce((s,p)=>s+p.seat.z,0)/l.length;
   const sp=makeTag(dep,true);sp.scale.multiplyScalar(.8);sp.position.set(cx,2.7,cz);scene.add(sp);}}

// ---- cleaners guarding the unmapped north ----
const cleaners=CLEANERS.map(c=>{
  const q=P(c.at),look={outfit:'shirt',top:'#3b82c4',pants:'#2f3b4a',hair:'#222222',skin:'#c68642',style:'short',vest:'#f5c518',smile:1,teeth:1,belt:1};
  const rig=makeRig({name:c.name,skin:'#c68642',hair:'#222222',shirt:'#3b82c4',pants:'#2f3b4a',look});
  const mop=new THREE.Group();mop.position.set(.5,.95,.5);rig.root.add(mop);box(.04,.95,.04,'#8b6b3e',0,-.475,0,mop);box(.3,.08,.2,'#d9d9d9',0,-.93,0,mop);
  const sg=new THREE.Group();sg.position.set(q[0]+Math.sin(rad(c.face))*1.3+.8,0,q[1]+Math.cos(rad(c.face))*1.3);scene.add(sg); // wet floor sign
  [-1,1].forEach(k=>{const b=box(.4,.65,.04,'#f5c518',0,.33,k*.13,sg);b.rotation.x=k*.25;});
  box(.34,.2,.02,'#c0392b',0,.4,.135,sg);
  return {name:c.name,role:c.role,says:c.says,extra:true,x:q[0],z:q[1],ry:rad(c.face),face:rad(c.face),rig,mop,phase:Math.random()*6,talkUntil:0};
});

// ================= walking grid (pathfinding for the pantry trips) =================
const CELL=.35,GX0=-40,GZ0=-34,GNX=Math.ceil(82/CELL),GNZ=Math.ceil(72/CELL);
const WALK=new Uint8Array(GNX*GNZ);
for(let j=0;j<GNZ;j++)for(let i=0;i<GNX;i++)WALK[j*GNX+i]=blockedAt(GX0+(i+.5)*CELL,GZ0+(j+.5)*CELL,.32)?0:1;
const cellI=(x,z)=>{const i=Math.floor((x-GX0)/CELL),j=Math.floor((z-GZ0)/CELL);return i<0||j<0||i>=GNX||j>=GNZ?-1:j*GNX+i;};
const walkAt=(x,z)=>{const c=cellI(x,z);return c>=0&&WALK[c]===1;};
function nearestWalk(x,z){
  const c=cellI(x,z);if(c>=0&&WALK[c])return c;
  const ci=Math.floor((x-GX0)/CELL),cj=Math.floor((z-GZ0)/CELL);
  for(let r=1;r<14;r++)for(let dj=-r;dj<=r;dj++)for(let di=-r;di<=r;di++){if(Math.max(Math.abs(di),Math.abs(dj))!==r)continue;const i=ci+di,j=cj+dj;if(i<0||j<0||i>=GNX||j>=GNZ)continue;if(WALK[j*GNX+i])return j*GNX+i;}
  return -1;
}
function findPath(sx,sz,tx,tz){
  const s=nearestWalk(sx,sz),t=nearestWalk(tx,tz);if(s<0||t<0)return null;
  const N=GNX*GNZ,g=new Float32Array(N).fill(1e9),par=new Int32Array(N).fill(-1),done=new Uint8Array(N),H=[];
  const push=(f,i)=>{H.push([f,i]);let k=H.length-1;while(k>0){const p=(k-1)>>1;if(H[p][0]<=H[k][0])break;[H[p],H[k]]=[H[k],H[p]];k=p;}};
  const pop=()=>{const top=H[0],last=H.pop();if(H.length){H[0]=last;let k=0;for(;;){const l=2*k+1,r=l+1;let m=k;if(l<H.length&&H[l][0]<H[m][0])m=l;if(r<H.length&&H[r][0]<H[m][0])m=r;if(m===k)break;[H[m],H[k]]=[H[k],H[m]];k=m;}}return top;};
  const tx0=t%GNX,tz0=(t/GNX)|0,h=i=>{const dx=Math.abs(i%GNX-tx0),dz=Math.abs(((i/GNX)|0)-tz0);return dx+dz-.586*Math.min(dx,dz);};
  g[s]=0;push(h(s),s);
  while(H.length){
    const i=pop()[1];if(done[i])continue;done[i]=1;if(i===t)break;
    const ci=i%GNX,cj=(i/GNX)|0;
    for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){
      if(!di&&!dj)continue;const ni=ci+di,nj=cj+dj;if(ni<0||nj<0||ni>=GNX||nj>=GNZ)continue;
      const n=nj*GNX+ni;if(!WALK[n]||done[n])continue;
      if(di&&dj&&(!WALK[cj*GNX+ni]||!WALK[nj*GNX+ci]))continue;
      const ng=g[i]+(di&&dj?1.414:1);if(ng<g[n]){g[n]=ng;par[n]=i;push(ng+h(n),n);}
    }
  }
  if(!done[t])return null;
  const cells=[];for(let i=t;i>=0;i=par[i])cells.push(i);cells.reverse();
  const pts=[[sx,sz],...cells.map(i=>[GX0+((i%GNX)+.5)*CELL,GZ0+(((i/GNX)|0)+.5)*CELL]),[tx,tz]];
  const los=(a,b)=>{const d=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.ceil(d/.15);for(let k=1;k<n;k++){const f=k/n;if(!walkAt(a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f))return false;}return true;};
  const out=[pts[0]];let i=0;while(i<pts.length-1){let j=pts.length-1;while(j>i+1&&!los(pts[i],pts[j]))j--;out.push(pts[j]);i=j;}
  return out;
}


// ================= player =================
function blocked(x,z){
  if(blockedAt(x,z,.3))return true;
  for(const s of seats){const p=s.person;if(p&&(p.state==='seated'||p.state==='wait')&&Math.hypot(x-s.x,z-s.z)<.75)return true;}
  for(const c of cleaners)if(Math.hypot(x-c.x,z-c.z)<.6)return true;
  return false;
}
function freeSpot(x,z,bx,bz){
  const base=Math.atan2(bx,bz);
  for(const d of [1,1.3,1.7,2.2,2.8])for(const k of [0,.6,-.6,1.2,-1.2,2.4,-2.4,3.1]){const tx=x+Math.sin(base+k)*d,tz=z+Math.cos(base+k)*d;if(!blocked(tx,tz))return [tx,tz];}
  return [x,z];
}
const st0=P(MAP.start),sp0=freeSpot(st0[0],st0[1],0,1);
const me={x:sp0[0],z:sp0[1],face:PI,rig:makeRig(PLAYER),seat:null,phase:0};
me.rig.root.position.set(me.x,0,me.z);
// ---- art on the inner walls (only where you can actually walk) ----
{
  const reach=new Uint8Array(GNX*GNZ),q=[nearestWalk(me.x,me.z)];reach[q[0]]=1;
  for(let h=0;h<q.length;h++){const i=q[h],ci=i%GNX,cj=(i/GNX)|0;for(const d of [[1,0],[-1,0],[0,1],[0,-1]]){const ni=ci+d[0],nj=cj+d[1];if(ni<0||nj<0||ni>=GNX||nj>=GNZ)continue;const n=nj*GNX+ni;if(WALK[n]&&!reach[n]){reach[n]=1;q.push(n);}}}
  const reachable=(x,z)=>{const c=cellI(x,z);return c>=0&&reach[c]===1;};
  let seed=11;const rn=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
  const pals=[['#e63946','#f1faee','#a8dadc','#457b9d','#1d3557'],['#264653','#2a9d8f','#e9c46a','#f4a261','#e76f51'],['#ffbe0b','#fb5607','#ff006e','#8338ec','#3a86ff'],['#003049','#d62828','#f77f00','#fcbf49','#eae2b7']];
  const drawArt=(g,w,h,style,p)=>{
    if(style===0){g.fillStyle=p[1];g.fillRect(0,0,w,h);for(let i=0;i<9;i++){g.fillStyle=p[(rn()*5)|0];g.fillRect(rn()*w*.8,rn()*h*.8,20+rn()*90,20+rn()*90);}}
    else if(style===1){const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,p[3]);gr.addColorStop(.6,p[2]);gr.addColorStop(1,p[4]);g.fillStyle=gr;g.fillRect(0,0,w,h);g.fillStyle=p[0];g.beginPath();g.arc(w*.65,h*.45,h*.16,0,7);g.fill();g.fillStyle=p[4];g.beginPath();g.moveTo(0,h);g.lineTo(0,h*.7);g.quadraticCurveTo(w*.3,h*.5,w*.55,h*.75);g.quadraticCurveTo(w*.8,h*.6,w,h*.8);g.lineTo(w,h);g.fill();}
    else if(style===2){g.fillStyle=p[1];g.fillRect(0,0,w,h);for(let i=5;i>0;i--){g.fillStyle=p[i%5];g.beginPath();g.arc(w*.5,h*.5,i*h*.09,0,7);g.fill();}}
    else if(style===3){g.fillStyle=p[1];g.fillRect(0,0,w,h);g.lineWidth=6;for(let k=0;k<7;k++){g.strokeStyle=p[k%5];g.beginPath();for(let x=0;x<=w;x+=8){const y=h*(.12+k*.12)+Math.sin(x/28+k)*14;x?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();}}
    else if(style===4){const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,p[4]);gr.addColorStop(1,p[3]);g.fillStyle=gr;g.fillRect(0,0,w,h);g.fillStyle=p[0];for(let x=0;x<w;x+=26){const bh=30+rn()*h*.5;g.fillRect(x,h-bh,22,bh);}}
    else{g.fillStyle='#efe6d2';g.fillRect(0,0,w,h);for(let i=0;i<14;i++){g.fillStyle=p[(i%3)+1];g.save();g.translate(rn()*w,rn()*h);g.rotate(rn()*3);g.beginPath();g.ellipse(0,0,10+rn()*26,5+rn()*10,0,0,7);g.fill();g.restore();}}
  };
  const art=[];for(let i=0;i<12;i++)art.push((()=>{const c=document.createElement('canvas');c.width=c.height=256;drawArt(c.getContext('2d'),256,256,i%6,pals[i%4]);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;})());
  let area=0;for(let i=0;i<CORE.length;i++){const a=CORE[i],b=CORE[(i+1)%CORE.length];area+=a[0]*b[1]-b[0]*a[1];}
  const sgn=area>0?1:-1;
  for(let i=0;i<CORE.length;i++){
    const a=CORE[i],b=CORE[(i+1)%CORE.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(L<8)continue;
    const ex=(b[0]-a[0])/L,ez=(b[1]-a[1])/L,nx=sgn>0?ez:-ez,nz=sgn>0?-ex:ex;
    for(let s=3.5;s<L-3;s+=5+rn()*3){
      const w=[1.8,1.2,2.4,1.5][(rn()*4)|0],h=[1.1,1.5,1.2,1.5][(rn()*4)|0],cx=a[0]+ex*s,cz=a[1]+ez*s;
      if(!reachable(cx+nx*1.8,cz+nz*1.8))continue;
      const g=new THREE.Group();g.position.set(cx+nx*.04,1.6,cz+nz*.04);g.rotation.y=Math.atan2(nx,nz);scene.add(g);
      box(w+.12,h+.12,.05,'#26262b',0,0,0,g);
      const mm=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:art[(rn()*art.length)|0]}));mm.position.z=.03;g.add(mm);
      if(rn()<.55&&reachable(cx+nx*.8,cz+nz*.8)){const px0=cx+nx*.55,pz0=cz+nz*.55;box(.42,.38,.42,'#8a5a3b',px0,.19,pz0);box(.5,.95,.5,'#2d7a4a',px0,.85,pz0);box(.3,.4,.3,'#3f9b5e',px0,1.45,pz0);}
    }
  }
}
let yaw=0,pitch=.35,dist=4.2,locked=false,started=false;
const keys={};
let mode='explore',target=null,score=0,tries=0,flash='',dlg=null;

$('start').onclick=()=>ren.domElement.requestPointerLock();
document.addEventListener('pointerlockchange',()=>{locked=document.pointerLockElement===ren.domElement;if(locked)started=true;$('start').style.display=locked?'none':'flex';});
document.addEventListener('mousemove',e=>{if(!locked)return;yaw-=e.movementX*.0025;pitch=Math.max(-.15,Math.min(1.3,pitch+e.movementY*.0025));});
document.addEventListener('wheel',e=>{dist=Math.max(1.8,Math.min(9,dist+e.deltaY*.004));});
document.addEventListener('mousedown',()=>{if(locked&&dlg)advance();});
addEventListener('keydown',e=>{keys[e.code]=1;if(e.code==='KeyM')toggleMode();if(e.code==='KeyE'&&!e.repeat)interact();});
addEventListener('keyup',e=>keys[e.code]=0);
addEventListener('resize',()=>{cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();ren.setSize(innerWidth,innerHeight);});

// ================= interaction =================
const dist2=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
function nearest(list,max){let b=null,bd=max;for(const p of list){const d=dist2(p,me);if(d<bd){bd=d;b=p;}}return b;}
function nearestEmptySeat(max){let b=null,bd=max;for(const s of [...seats,...chairSpots]){if(s.person||s.taken)continue;const d=dist2(s,me);if(d<bd){bd=d;b=s;}}return b;}
function context(){
  if(dlg)return null;
  if(me.seat)return{t:'stand',label:'E: Stand up'};
  const c=[];
  const p=nearest(people,mode==='quiz'?3.2:2.4);
  if(p)c.push({d:dist2(p,me),t:mode==='quiz'?'guess':'talk',p,label:mode==='quiz'?'E: This is the one!':'E: Talk to '+p.name});
  const cl=nearest(cleaners,2.2);
  if(cl)c.push({d:dist2(cl,me),t:'talk',p:cl,label:'E: Talk to the cleaner'});
  for(const m of MACHINES){const d=Math.hypot(m.x-me.x,m.z-me.z);if(d<1.5)c.push({d:d-.6,t:'vend',m,label:'E: Get a '+(m.drinks?'drink':'snack')});}
  if(TRASHCAN){const d=Math.hypot(TRASHCAN.x-me.x,TRASHCAN.z-me.z);if(d<1.5)c.push({d:d-.6,t:'trash',label:'E: Throw away trash'});}
  const s=nearestEmptySeat(1.8);
  if(s)c.push({d:dist2(s,me)+.2,t:'sit',s,label:s.chair?'E: Sit down':'E: Sit at desk '+String(s.num).padStart(3,'0')});
  c.sort((a,b)=>a.d-b.d);return c[0]||null;
}
function say(text){toast=text;toastUntil=performance.now()/1000+3;}
function interact(){
  if(!locked)return;
  if(dlg){advance();return;}
  const c=context();if(!c)return;
  if(c.t==='vend'){
    const type=c.m.drinks?'drink':'snack';
    if(type==='drink'){if(me.itemL)say('Your left hand already has a drink.');else{me.itemL=makeHeld('drink',me.rig.armL);say('You got '+rnd(['an ice-cold cola','a canned coffee','an orange juice','a cold tea'])+'! (left hand)');}}
    else{if(me.itemR)say('Your right hand already has food.');else{me.itemR=makeHeld('snack',me.rig.armR);say('You got '+rnd(['a bag of chips','a chocolate bar','some biscuits','a pack of peanuts'])+'! (right hand)');}}
  }
  else if(c.t==='trash'){if(me.itemL||me.itemR){me.itemL=dropHeld(me.itemL);me.itemR=dropHeld(me.itemR);say('Thrown away. Thanks for keeping it clean!');}else say('You have nothing to throw away.');}
  else if(c.t==='sit'){if(c.s.chair)c.s.taken=true;me.seat=c.s;me.x=c.s.x;me.z=c.s.z;me.face=c.s.a;setPose(me.rig,true);dist=3;}
  else if(c.t==='stand'){const s=me.seat,f=freeSpot(s.x,s.z,-Math.sin(s.a),-Math.cos(s.a));if(s.chair)s.taken=false;me.x=f[0];me.z=f[1];me.seat=null;setPose(me.rig,false);dist=4.2;}
  else if(c.t==='talk')startTalk(c.p);
  else if(c.t==='guess')guess(c.p);
}
function startTalk(p){
  const lines=p.says||[`Hi! I'm ${p.name}.`,`I'm the ${p.role}. ${p.does||''}`,p.fact||'Nice to meet you!'];
  dlg={p,lines,i:0,shown:0};p.met=true;
  if(!p.tag&&!p.extra){p.tag=makeTag(p.name);scene.add(p.tag);}
  me.face=Math.atan2(p.x-me.x,p.z-me.z);
  const d=$('dlg');d.style.display='flex';
  d.innerHTML=`<div id="pic"></div><div style="flex:1"><div class="nm">${esc(p.name)}</div><div class="rl">${esc(p.role)}</div><div class="tx" id="tx"></div><div class="nx">E ▸</div></div>`;
  const cv=document.createElement('canvas');cv.className='pic';cv.width=cv.height=96;const cg=cv.getContext('2d');cg.imageSmoothingEnabled=false;cg.drawImage(p.rig.faceCanvas,0,0,96,96);$('pic').replaceWith(cv);
}
function advance(){
  const L=dlg.lines[dlg.i];
  if(dlg.shown<L.length){dlg.shown=L.length;return;}
  if(++dlg.i>=dlg.lines.length){dlg=null;$('dlg').style.display='none';return;}
  dlg.shown=0;
}
function toggleMode(){mode=mode==='explore'?'quiz':'explore';score=tries=0;flash='';if(mode==='quiz'){newTarget();if(dlg){dlg=null;$('dlg').style.display='none';}}}
function newTarget(){let t;do{t=rnd(people);}while(people.length>1&&t===target);target=t;}
function guess(n){tries++;if(n===target){score++;flash='✅ Correct! That is '+n.name;newTarget();}else flash='❌ That is '+n.name+', not '+target.name;}

// ---- edge chatter ----
let nextChat=5;
function chatter(now){
  const e=rnd(CHATTER);let who,text;
  if(Array.isArray(e)){who=people.find(p=>p.name===e[0])||rnd(people);text=e[1];}else{who=rnd(people);text=e;}
  who.talkUntil=now+Math.min(4,1+text.length*.05);
  const cb=$('chatbox');while(cb.children.length>=2)cb.children[0].remove();
  const d=document.createElement('div');d.className='chat';
  d.style.top=(15+Math.random()*40)+'%';d.style[Math.random()<.5?'left':'right']='14px';
  d.innerHTML=`<b style="color:${esc(who.shirt)}">${esc(who.name)}</b>${esc(text)}`;cb.appendChild(d);
  requestAnimationFrame(()=>d.classList.add('show'));
  setTimeout(()=>d.classList.remove('show'),5200);setTimeout(()=>d.remove(),6000);
}

// ================= NPCs: work, then pantry trips (vending machine, table, eat) =================
let groups=[],nextTrip=10;
function showBubble(p,text,dur,now){
  clearBubble(p);
  const sp=makeBubble(text);scene.add(sp);p.bubble={sp,until:now+dur};
  p.talkUntil=now+Math.min(dur,1+text.length*.06);
}
function clearBubble(p){if(!p.bubble)return;scene.remove(p.bubble.sp);p.bubble.sp.material.map.dispose();p.bubble.sp.material.dispose();p.bubble=null;}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;}
const dropItems=p=>{p.itemL=dropHeld(p.itemL);p.itemR=dropHeld(p.itemR);};

// a trip: desk -> vending machine(s) (drink = left hand, food = right hand) -> table (sit, eat, chat) -> trash can -> desk
function startTrip(now){
  if(people.filter(p=>p.state!=='seated').length>5)return;
  const seated=people.filter(p=>p.state==='seated'&&!(dlg&&dlg.p===p));if(!seated.length)return;
  const lead=rnd(seated),r=Math.random(),size=r<.5?1:r<.85?2:3;
  const pool=[...shuffle(seated.filter(p=>p!==lead&&p.dept===lead.dept)),...shuffle(seated.filter(p=>p!==lead&&p.dept!==lead.dept))];
  const members=[lead,...pool.slice(0,size-1)];
  const tables={};chairSpots.forEach(c=>{if(c.eat&&!c.taken)(tables[c.table]=tables[c.table]||[]).push(c);});
  const cand=Object.values(tables).filter(l=>l.length>=members.length);
  if(!cand.length||!TSPOTS.length)return;
  const tc=rnd(cand),plans=[];
  for(let k=0;k<members.length;k++){
    const p=members[k],c=tc[k],rr=Math.random(),w=rr<.4?['drink']:rr<.7?['snack']:['drink','snack'],wants=Math.random()<.5?w:w.slice().reverse();
    const stops=wants.map(t=>VEND.find(v=>v.type===t&&v.k===k&&!v.used)),ts=TSPOTS.find(t=>t.k===k&&!t.used);
    if(stops.some(s=>!s)||!ts)return;
    const legs=[];let cur={x:p.seat.x,z:p.seat.z};
    for(const s of stops){legs.push(findPath(cur.x,cur.z,s.x,s.z));cur=s;}
    legs.push(findPath(cur.x,cur.z,c.x,c.z));
    const legBin=findPath(c.x,c.z,ts.x,ts.z),legHome=findPath(ts.x,ts.z,p.seat.x,p.seat.z);
    if(legs.some(l=>!l)||!legBin||!legHome)return;
    plans.push({wants,stops,legs,legBin,legHome,ts});
  }
  const g={members,arrived:0,leaveAt:0,nextLine:0,script:null,si:0};groups.push(g);
  members.forEach((p,k)=>{const pl=plans[k],c=tc[k];c.taken=true;pl.ts.used=true;pl.stops.forEach(s=>s.used=true);
    Object.assign(p,{group:g,chair:c,state:'wait',waitUntil:now+k*.9,wants:pl.wants,stops:pl.stops,legs:pl.legs,legBin:pl.legBin,legHome:pl.legHome,ts:pl.ts,stopI:0,path:pl.legs[0],wi:1});});
}
function arriveVend(p,now){p.state='vend';p.vend=p.stops[p.stopI];p.vendT=now+2.6;}
function afterVend(p){p.vend.used=false;p.stopI++;if(p.stopI<p.stops.length){p.path=p.legs[p.stopI];p.wi=1;p.state='out';}else{p.path=p.legs[p.stops.length];p.wi=1;p.state='mid';}}
function arriveChair(p,now){
  const g=p.group,c=p.chair;p.state='eat';p.x=c.x;p.z=c.z;p.ry=c.a;setPose(p.rig,true);g.arrived++;
  if(g.arrived===g.members.length){
    g.leaveAt=now+(g.members.length>1?20+Math.random()*8:12+Math.random()*5);g.nextLine=now+.8;
    if(g.members.length===1)showBubble(p,rnd(SOLO),4,now);
  }
}
function leaveChair(p){setPose(p.rig,false);p.chair.taken=false;p.path=p.legBin;p.wi=1;p.state='bin';}
function arriveTrash(p,now){p.state='trash';p.trashT=now+1.7;}
function sitBack(p){const s=p.seat;p.state='seated';p.x=s.x;p.z=s.z;p.ry=s.a;setPose(p.rig,true);p.group=null;p.vend=p.chair=p.ts=null;}

function updateNPCs(dt,now){
  for(const p of people){
    const talk=dlg&&dlg.p===p;let moving=false;
    const toMe=()=>wrap(Math.atan2(me.x-p.x,me.z-p.z)-p.ry),faceMe=()=>{p.ry+=toMe()*Math.min(1,dt*6);};
    const working=p.state==='seated'||p.state==='wait';
    if(working){
      if(talk)faceMe();else p.ry+=wrap(p.seat.a-p.ry)*Math.min(1,dt*5);                 // swivel back to the screen
      if(p.state==='wait'&&now>=p.waitUntil&&!talk){setPose(p.rig,false);p.state='out';p.path=p.legs[0];p.wi=1;}
    }else if(p.state==='out'||p.state==='mid'||p.state==='bin'||p.state==='back'){
      if(talk)faceMe();
      else{
        const wp=p.path[p.wi],dx=wp[0]-p.x,dz=wp[1]-p.z,d=Math.hypot(dx,dz);
        if(d<.12){p.wi++;if(p.wi>=p.path.length){if(p.state==='out')arriveVend(p,now);else if(p.state==='mid')arriveChair(p,now);else if(p.state==='bin')arriveTrash(p,now);else sitBack(p);}}
        else{const stp=Math.min(d,4.2*dt);p.x+=dx/d*stp;p.z+=dz/d*stp;p.ry+=wrap(Math.atan2(dx,dz)-p.ry)*Math.min(1,dt*10);p.phase+=dt*8.5;moving=true;}
      }
    }else if(p.state==='vend'){
      if(talk){faceMe();p.vendT+=dt;}
      else{
        p.ry+=wrap(PI/2-p.ry)*Math.min(1,dt*6);
        const type=p.wants[p.stopI];
        if(now>p.vendT-1.2&&!((type==='drink')?p.itemL:p.itemR)){if(type==='drink')p.itemL=makeHeld('drink',p.rig.armL);else p.itemR=makeHeld('snack',p.rig.armR);}
        if(now>p.vendT)afterVend(p);
      }
    }else if(p.state==='eat'){
      if(talk)faceMe();
      else{p.ry+=wrap(p.chair.a-p.ry)*Math.min(1,dt*5);if(p.group.leaveAt&&now>p.group.leaveAt)leaveChair(p);}
    }else if(p.state==='trash'){
      if(talk){faceMe();p.trashT+=dt;}
      else{
        p.ry+=wrap(-PI/2-p.ry)*Math.min(1,dt*6);
        if(now>p.trashT-.9)dropItems(p);
        if(now>p.trashT){p.ts.used=false;p.path=p.legHome;p.wi=1;p.state='back';}
      }
    }
    const sitting=working||p.state==='eat';
    if(!sitting){
      swing(p.rig,moving?Math.sin(p.phase)*.7:0);
      if(p.itemL)p.rig.armL.rotation.x=-.6;if(p.itemR)p.rig.armR.rotation.x=-.6;
      if(p.state==='vend'){const dr=p.wants[p.stopI]==='drink';(dr?p.rig.armL:p.rig.armR).rotation.x=(dr?p.itemL:p.itemR)?-.5:-1.3;}
      if(p.state==='trash'&&(p.itemL||p.itemR)){p.rig.armL.rotation.x=p.rig.armR.rotation.x=-1.3;}
    }
    p.rig.root.position.set(p.x,0,p.z);p.rig.root.rotation.y=p.ry;
    // where they look: at the screen while working, at their friend while chatting, at the player when walking around
    let ty=0,tp=0;
    const partner=p.state==='eat'&&p.group.members.length>1?p.group.members.find(m=>m!==p&&m.state==='eat'):null;
    if(talk){ty=clamp(toMe(),-1.1,1.1);}
    else if(working){tp=p.seat.knife?.38:.24;}
    else if(partner){ty=clamp(wrap(Math.atan2(partner.x-p.x,partner.z-p.z)-p.ry),-1.1,1.1);}
    else if(p.state==='vend'||p.state==='trash'){tp=.1;}
    else if(dist2(p,me)<10){ty=clamp(toMe(),-1.1,1.1);}
    const hk=Math.min(1,dt*6);p.rig.head.rotation.y+=(ty-p.rig.head.rotation.y)*hk;p.rig.head.rotation.x+=(tp-p.rig.head.rotation.x)*hk;
    if(p.state==='seated'&&!talk&&!p.seat.knife){const k=Math.sin(now*13+p.x)*.04;p.rig.armL.rotation.x=-1.1+k;p.rig.armR.rotation.x=-1.1-k;}   // typing
    if(p.state==='eat'&&!talk){                                                                                                                  // bites (right hand) and sips (left hand)
      const kb=Math.max(0,Math.sin(now*1.5+p.x*2)),ks=Math.max(0,Math.sin(now*1.5+p.x*2+2.2));
      p.rig.armR.rotation.x=p.itemR?-1.2-kb*kb*.8:-1.1;p.rig.armL.rotation.x=p.itemL?-1.2-ks*ks*.8:-1.1;
    }
    const typing=talk&&dlg.shown<dlg.lines[dlg.i].length;
    {const sp=typing||now<p.talkUntil;p.rig.mouth.visible=sp;p.rig.mouth.scale.y=sp?.5+Math.abs(Math.sin(now*17+p.x))*1.1:1;}
    if(p.seat.knife&&p.state==='seated'){const act=!talk;p.rig.armR.rotation.x=-1.2+(act?Math.sin(now*9)*.2:0);p.rig.armL.rotation.x=-1.25;p.seat.knife.rotation.x=act?Math.sin(now*9)*.28:0;}
    if(p.tag){p.tag.visible=mode==='explore';p.tag.position.set(p.x,2.3,p.z);}
    if(p.bubble){if(now>p.bubble.until)clearBubble(p);else p.bubble.sp.position.set(p.x,2.55,p.z);}
  }
  for(const c of cleaners){
    const talk=dlg&&dlg.p===c,toMe=wrap(Math.atan2(me.x-c.x,me.z-c.z)-c.ry);
    c.ry+=(talk?toMe:wrap(c.face-c.ry))*Math.min(1,dt*5);
    c.mop.rotation.z=talk?0:Math.sin(now*2.2+c.phase)*.5;
    c.rig.armR.rotation.x=-.85;c.rig.armL.rotation.x=talk?0:-.3+Math.sin(now*2.2+c.phase)*.25;
    c.rig.head.rotation.y+=((dist2(c,me)<9?clamp(toMe,-1.1,1.1):0)-c.rig.head.rotation.y)*Math.min(1,dt*6);
    const typing=talk&&dlg.shown<dlg.lines[dlg.i].length;c.rig.mouth.visible=typing;c.rig.mouth.scale.y=.5+Math.abs(Math.sin(now*17))*1.1;
    c.rig.root.position.set(c.x,0,c.z);c.rig.root.rotation.y=c.ry;
  }
  for(const g of groups){
    if(g.members.length<2||g.arrived<g.members.length||now<g.nextLine||!g.leaveAt||now>g.leaveAt-2)continue;
    if(!g.script){const ex=rnd(SMALLTALK);g.script=[[0,ex[0]],[1,ex[1]]];if(g.members.length>2)g.script.push([2,rnd(REACT)]);g.si=0;}
    const [wi,t]=g.script[g.si++],sp=g.members[wi];
    if(sp.state==='eat')showBubble(sp,t,3.4,now);
    g.nextLine=now+3.8;if(g.si>=g.script.length){g.script=null;g.nextLine=now+3;}
  }
  groups=groups.filter(g=>!g.members.every(m=>m.state==='seated'));
}

// ================= UI =================
const cache={};const setHTML=(id,h)=>{if(cache[id]!==h){cache[id]=h;$(id).innerHTML=h;}};
let toast='',toastUntil=0;
function ui(){
  const met=people.filter(p=>p.met).length,tt=performance.now()/1000<toastUntil?`<br><small>${esc(toast)}</small>`:'';
  setHTML('top',(mode==='explore'?`Explore mode — met ${met}/${people.length} teammates · M: quiz`
    :`Quiz: find <b>${esc(target.name)}</b> — ${esc(target.role)} &nbsp;|&nbsp; ${score}/${tries}<br><small>${esc(flash)}</small>`)+tt);
  const c=context();setHTML('prompt',c?`<span>${esc(c.label)}</span>`:'');
}

// ================= main loop =================
let last=performance.now()/1000;
ren.setAnimationLoop(t=>{
  const now=t/1000,dt=Math.min(now-last,.05);last=now;
  const fx=-Math.sin(yaw),fz=-Math.cos(yaw),rx=-fz,rz=fx;
  let mx=0,mz=0;
  if(!dlg&&!me.seat){mx=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0);mz=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0);}
  const moving=mx||mz;
  if(moving){
    const vx=fx*mx+rx*mz,vz=fz*mx+rz*mz,l=Math.hypot(vx,vz),sp=(keys.ShiftLeft?9:5.1)*dt;
    const nx=me.x+vx/l*sp,nz=me.z+vz/l*sp;
    if(!blocked(nx,me.z))me.x=nx; if(!blocked(me.x,nz))me.z=nz;
    me.face+=wrap(Math.atan2(vx,vz)-me.face)*Math.min(1,dt*12);
    me.phase+=dt*(keys.ShiftLeft?18:12);
  }
  if(!me.seat)swing(me.rig,moving?Math.sin(me.phase)*.7:0);
  me.rig.root.position.set(me.x,0,me.z);me.rig.root.rotation.y=me.face;

  if(started&&now>nextTrip){startTrip(now);nextTrip=now+9+Math.random()*14;}
  updateNPCs(dt,now);
  plates.forEach(p=>p.visible=mode==='explore');
  if(dlg){const L=dlg.lines[dlg.i];dlg.shown=Math.min(L.length,dlg.shown+dt*38);const s=L.slice(0,dlg.shown|0),tx=$('tx');if(tx&&tx.textContent!==s)tx.textContent=s;}
  if(started&&!dlg&&mode==='explore'&&now>nextChat){chatter(now);nextChat=now+8+Math.random()*8;}

  // third-person camera: pulled in when a wall or the core is in the way
  const ty=me.seat?1.3:1.5,cp=Math.cos(pitch),ox=Math.sin(yaw)*cp*dist,oy=Math.sin(pitch)*dist,oz=Math.cos(yaw)*cp*dist;
  let k=1;while(k>.12&&blockedAt(me.x+ox*k,me.z+oz*k,.25,true))k-=.08;
  cam.position.set(me.x+ox*k,clamp(ty+oy*k,.3,2.8),me.z+oz*k);
  cam.lookAt(me.x,ty,me.z);
  ui();ren.render(scene,cam);
});






