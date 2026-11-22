import * as THREE from "three";
const {OFFICE,TEAM,SEATS,PLAYER,CHATTER}=window.GAME_DATA;
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const PI=Math.PI, rad=d=>d*PI/180;
const wrap=a=>{while(a>PI)a-=2*PI;while(a<-PI)a+=2*PI;return a;};

const scene=new THREE.Scene(); scene.background=new THREE.Color('#9ec9e8');
const cam=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,.1,100);
const ren=new THREE.WebGLRenderer({antialias:true}); ren.setSize(innerWidth,innerHeight); ren.setPixelRatio(Math.min(devicePixelRatio,2));
document.body.prepend(ren.domElement);
scene.add(new THREE.HemisphereLight('#fff','#889',1.1));
const sun=new THREE.DirectionalLight('#fff',1.2); sun.position.set(5,10,3); scene.add(sun);

const mat=c=>new THREE.MeshLambertMaterial({color:c});
const box=(w,h,d,c,x=0,y=0,z=0,p=scene)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),(c.isMaterial||Array.isArray(c))?c:mat(c));m.position.set(x,y,z);p.add(m);return m;};

// ---- room ----
const W=OFFICE.width,D=OFFICE.depth;
box(W,.1,D,'#c9b99a',0,-.05,0);
[[W,3,.2,0,1.5,-D/2],[W,3,.2,0,1.5,D/2],[.2,3,D,-W/2,1.5,0],[.2,3,D,W/2,1.5,0]].forEach(a=>box(a[0],a[1],a[2],'#f2efe9',a[3],a[4],a[5]));
box(1.2,.9,.5,'#556',-W/2+.8,.45,0); box(1.2,.9,.5,'#556',W/2-.8,.45,0);
box(.5,1.3,.5,'#2d6a4f',-W/2+1,.65,D/2-1); box(.5,1.3,.5,'#2d6a4f',W/2-1,.65,-D/2+1);
box(.6,1.4,.6,'#9ecbe0',W/2-1,.7,2); box(.7,.1,.7,'#678',W/2-1,1.45,2); // water cooler

// ---- characters (blocky rig) ----
function faceTex(skin,hair,style){
  const c=document.createElement('canvas');c.width=c.height=8;const g=c.getContext('2d');
  g.fillStyle=skin;g.fillRect(0,0,8,8);
  g.fillStyle=hair;g.fillRect(0,0,8,style==='cap'?3:2);
  if(style==='long'||style==='short'){g.fillRect(0,0,1,style==='long'?6:3);g.fillRect(7,0,1,style==='long'?6:3);}
  g.fillStyle='#fff';g.fillRect(1,4,2,1);g.fillRect(5,4,2,1);
  g.fillStyle='#223';g.fillRect(2,4,1,1);g.fillRect(5,4,1,1);
  const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;return t;
}
function makeRig(p){
  const root=new THREE.Group(),body=new THREE.Group();root.add(body);
  const s=mat(p.skin),h=mat(p.hair);
  box(.5,.7,.28,p.shirt,0,1.05,0,body);
  const head=new THREE.Group();head.position.set(0,1.4,0);body.add(head);
  box(.5,.5,.5,[s,s,h,s,new THREE.MeshLambertMaterial({map:faceTex(p.skin,p.hair,p.style)}),h],0,.27,0,head);
  if(p.style==='bun')box(.2,.2,.2,p.hair,0,.6,-.1,head);
  if(p.style==='cap')box(.5,.07,.25,p.shirt,0,.45,.3,head);
  const mouth=box(.16,.035,.02,'#7a2e2e',0,.12,.255,head);
  const arm=sx=>{const a=new THREE.Group();a.position.set(sx*.37,1.35,0);body.add(a);box(.22,.55,.22,p.shirt,0,-.275,0,a);box(.22,.15,.22,s,0,-.625,0,a);return a;};
  const leg=sx=>{const l=new THREE.Group();l.position.set(sx*.13,.7,0);body.add(l);box(.24,.35,.24,p.pants,0,-.175,0,l);
    const k=new THREE.Group();k.position.y=-.35;l.add(k);box(.24,.35,.24,p.pants,0,-.175,0,k);box(.26,.08,.3,'#222',0,-.34,.03,k);return [l,k];};
  const [legL,kneeL]=leg(-1),[legR,kneeR]=leg(1);
  const rig={root,body,head,mouth,armL:arm(-1),armR:arm(1),legL,legR,kneeL,kneeR};
  scene.add(root);return rig;
}
function setPose(r,sit){
  r.body.position.y=sit?-.2:0;
  r.legL.rotation.x=r.legR.rotation.x=sit?-PI/2:0;
  r.kneeL.rotation.x=r.kneeR.rotation.x=sit?PI/2:0;
  r.armL.rotation.x=r.armR.rotation.x=sit?-1.1:0;
}

// ---- seats / furniture ----
const seats=[];
function makeSeat(x,z,faceDeg){
  const a=rad(faceDeg),f=new THREE.Group();f.position.set(x,0,z);f.rotation.y=a;scene.add(f);
  box(.6,.08,.6,'#333',0,.46,0,f);box(.6,.6,.08,'#333',0,.8,-.3,f);box(.08,.44,.08,'#222',0,.22,0,f);
  box(1.6,.08,.8,'#a0714f',0,.78,1.2,f);
  [[-.75,.85],[.75,.85],[-.75,1.55],[.75,1.55]].forEach(q=>box(.06,.78,.06,'#654',q[0],.39,q[1],f));
  box(.6,.35,.04,'#111',0,1.1,1.45,f);box(.58,.33,.02,'#4ac',0,1.1,1.43,f);box(.06,.2,.06,'#111',0,.92,1.45,f);
  box(.5,.03,.18,'#bbb',0,.83,1.05,f);
  const s={x,z,a,face:faceDeg,person:null};seats.push(s);return s;
}
const people=TEAM.map(p=>{
  const seat=makeSeat(p.x,p.z,p.face),rig=makeRig(p);
  rig.root.position.set(p.x,0,p.z);rig.root.rotation.y=seat.a;setPose(rig,true);
  const o={...p,rig,seat,talkUntil:0,met:false,tag:null};seat.person=o;return o;
});
SEATS.forEach(s=>makeSeat(s.x,s.z,s.face));

function makeTag(name,big){
  const c=document.createElement("canvas");c.width=big?512:256;c.height=big?96:64;const g=c.getContext("2d");
  g.fillStyle="#000a";g.fillRect(0,0,c.width,c.height);g.fillStyle="#fff";g.font="bold "+(big?40:28)+"px sans-serif";g.textAlign="center";g.textBaseline="middle";g.fillText(name,c.width/2,c.height/2+2,c.width-16);
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c)}));sp.scale.set(big?3.6:1.6,big?.68:.4,1);return sp;
}
(OFFICE.labels||[]).forEach(l=>{const s=makeTag(l.text,true);s.position.set(l.x,2.8,l.z);scene.add(s);});

// ---- player ----
const me={x:0,z:3,face:PI,rig:makeRig(PLAYER),seat:null,phase:0};
me.rig.root.position.set(me.x,0,me.z);
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

// ---- collision ----
function blocked(x,z){
  const r=.3;
  for(const s of seats){
    const dx=x-s.x,dz=z-s.z,c=Math.cos(s.a),sn=Math.sin(s.a);
    const lx=dx*c-dz*sn,lz=dx*sn+dz*c;
    if(Math.abs(lx)<.8+r&&Math.abs(lz-1.2)<.4+r)return true;
    if(s.person&&Math.hypot(dx,dz)<.85)return true;
  }
  return false;
}
const clampX=v=>Math.max(-W/2+.5,Math.min(W/2-.5,v)),clampZ=v=>Math.max(-D/2+.5,Math.min(D/2-.5,v));

// ---- interaction ----
const dist2=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
function nearestPerson(max){let b=null,bd=max;for(const p of people){const d=dist2(p,me);if(d<bd){bd=d;b=p;}}return b;}
function nearestEmptySeat(max){let b=null,bd=max;for(const s of seats){if(s.person)continue;const d=dist2(s,me);if(d<bd){bd=d;b=s;}}return b;}
function context(){
  if(dlg)return null;
  if(me.seat)return{t:'stand',label:'E: Stand up'};
  const p=nearestPerson(mode==='quiz'?3.2:2.4);
  if(p)return mode==='quiz'?{t:'guess',p,label:'E: This is the one!'}:{t:'talk',p,label:'E: Talk to '+p.name};
  const s=nearestEmptySeat(1.8);
  if(s)return{t:'sit',s,label:'E: Sit down'};
  return null;
}
function interact(){
  if(!locked)return;
  if(dlg){advance();return;}
  const c=context();if(!c)return;
  if(c.t==='sit'){me.seat=c.s;me.x=c.s.x;me.z=c.s.z;me.face=c.s.a;setPose(me.rig,true);dist=3;}
  else if(c.t==='stand'){const s=me.seat;me.x=s.x-Math.sin(s.a)*1.1;me.z=s.z-Math.cos(s.a)*1.1;me.seat=null;setPose(me.rig,false);dist=4.2;}
  else if(c.t==='talk')startTalk(c.p);
  else if(c.t==='guess')guess(c.p);
}
function startTalk(p){
  const lines=p.says||[`Hi! I'm ${p.name}.`,`I'm the ${p.role}. ${p.does||''}`,p.fact||'Nice to meet you!'];
  dlg={p,lines,i:0,shown:0};p.met=true;
  if(!p.tag){p.tag=makeTag(p.name);p.tag.position.set(p.x,2.3,p.z);scene.add(p.tag);}
  me.face=Math.atan2(p.x-me.x,p.z-me.z);
  const d=$('dlg');d.style.display='flex';
  d.innerHTML=`<div id="pic"></div><div style="flex:1"><div class="nm">${esc(p.name)}</div><div class="rl">${esc(p.role)}</div><div class="tx" id="tx"></div><div class="nx">E ▸</div></div>`;
  const img=new Image();img.className='pic';img.alt='';
  img.onerror=()=>{const x=document.createElement('div');x.className='pic';x.textContent=p.name[0];img.replaceWith(x);};
  img.src=p.photo||'';$('pic').replaceWith(img);
}
function advance(){
  const L=dlg.lines[dlg.i];
  if(dlg.shown<L.length){dlg.shown=L.length;return;}
  if(++dlg.i>=dlg.lines.length){dlg=null;$('dlg').style.display='none';return;}
  dlg.shown=0;
}
function toggleMode(){mode=mode==='explore'?'quiz':'explore';score=tries=0;flash='';if(mode==='quiz'){newTarget();if(dlg){dlg=null;$('dlg').style.display='none';}}}
function newTarget(){let t;do{t=people[Math.random()*people.length|0];}while(people.length>1&&t===target);target=t;}
function guess(n){tries++;if(n===target){score++;flash='✅ Correct! That is '+n.name;newTarget();}else flash='❌ That is '+n.name+', not '+target.name;}

// ---- office chatter ----
let nextChat=5;
function chatter(now){
  const e=CHATTER[Math.random()*CHATTER.length|0];
  let who,text;
  if(Array.isArray(e)){who=people.find(p=>p.name===e[0])||people[Math.random()*people.length|0];text=e[1];}
  else{who=people[Math.random()*people.length|0];text=e;}
  who.talkUntil=now+Math.min(4,1+text.length*.05);
  const cb=$('chatbox');while(cb.children.length>=2)cb.children[0].remove();
  const d=document.createElement('div');d.className='chat';
  d.style.top=(15+Math.random()*40)+'%';d.style[Math.random()<.5?'left':'right']='14px';
  d.innerHTML=`<b style="color:${esc(who.shirt)}">${esc(who.name)}</b>${esc(text)}`;cb.appendChild(d);
  requestAnimationFrame(()=>d.classList.add('show'));
  setTimeout(()=>d.classList.remove('show'),5200);setTimeout(()=>d.remove(),6000);
}

// ---- UI ----
const cache={};const setHTML=(id,h)=>{if(cache[id]!==h){cache[id]=h;$(id).innerHTML=h;}};
function ui(){
  const met=people.filter(p=>p.met).length;
  setHTML('top',mode==='explore'?`Explore mode — met ${met}/${people.length} teammates · M: quiz`
    :`Quiz: find <b>${esc(target.name)}</b> — ${esc(target.role)} &nbsp;|&nbsp; ${score}/${tries}<br><small>${esc(flash)}</small>`);
  const c=context();setHTML('prompt',c?`<span>${esc(c.label)}</span>`:'');
}

// ---- main loop ----
let last=performance.now()/1000;
ren.setAnimationLoop(t=>{
  const now=t/1000,dt=Math.min(now-last,.05);last=now;
  const fx=-Math.sin(yaw),fz=-Math.cos(yaw),rx=-fz,rz=fx;
  let mx=0,mz=0;
  if(!dlg&&!me.seat){mx=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0);mz=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0);}
  const moving=mx||mz;
  if(moving){
    const vx=fx*mx+rx*mz,vz=fz*mx+rz*mz,l=Math.hypot(vx,vz),sp=(keys.ShiftLeft?6:3.4)*dt;
    const nx=clampX(me.x+vx/l*sp),nz=clampZ(me.z+vz/l*sp);
    if(!blocked(nx,me.z))me.x=nx; if(!blocked(me.x,nz))me.z=nz;
    me.face+=wrap(Math.atan2(vx,vz)-me.face)*Math.min(1,dt*12);
    me.phase+=dt*(keys.ShiftLeft?12:8);
  }
  const R=me.rig,sw=moving&&!me.seat?Math.sin(me.phase)*.7:0;
  if(!me.seat){R.legL.rotation.x=sw;R.legR.rotation.x=-sw;R.armL.rotation.x=-sw;R.armR.rotation.x=sw;}
  R.root.position.set(me.x,0,me.z);R.root.rotation.y=me.face;

  for(const p of people){
    const rel=wrap(Math.atan2(me.x-p.x,me.z-p.z)-p.seat.a),near=dist2(p,me)<7;
    const want=near?Math.max(-1,Math.min(1,rel)):0;
    p.rig.head.rotation.y+=(want-p.rig.head.rotation.y)*Math.min(1,dt*6);
    const typing=dlg&&dlg.p===p&&dlg.shown<dlg.lines[dlg.i].length;
    p.rig.mouth.scale.y=(typing||now<p.talkUntil)?1+Math.abs(Math.sin(now*17+p.x))*3.4:1;
    if(p.tag)p.tag.visible=mode==='explore';
  }
  if(dlg){const L=dlg.lines[dlg.i];dlg.shown=Math.min(L.length,dlg.shown+dt*38);const s=L.slice(0,dlg.shown|0),tx=$('tx');if(tx&&tx.textContent!==s)tx.textContent=s;}
  if(started&&!dlg&&mode==='explore'&&now>nextChat){chatter(now);nextChat=now+7+Math.random()*7;}

  // third-person camera
  const ty=me.seat?1.3:1.5,cp=Math.cos(pitch);
  const cx=me.x+Math.sin(yaw)*cp*dist,cy=ty+Math.sin(pitch)*dist,cz=me.z+Math.cos(yaw)*cp*dist;
  cam.position.set(Math.max(-W/2+.3,Math.min(W/2-.3,cx)),Math.max(.3,Math.min(2.8,cy)),Math.max(-D/2+.3,Math.min(D/2-.3,cz)));
  cam.lookAt(me.x,ty,me.z);
  ui();ren.render(scene,cam);
});
