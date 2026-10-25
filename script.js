const DATO_EXTRA_EN_MONEDAS=false; // pon false para que las monedas solo sumen al contador y a los XP
/* ====== EDITA AQUÍ lo personal (no está en tu hoja de vida) ====== */
const YO={
  nombre:"Vanessa Espinosa",
  meGusta:["Completa aquí un hobby (ej.: crear contenido audiovisual)","Completa aquí otro gusto (ej.: música, series, deporte)"],
  datoCurioso:"Completa aquí un dato que te haga única"
};
/* ================================================================= */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia("(prefers-reduced-motion:reduce)").matches;
let xp=0,mute=false,AC;const st={items:0,boss:false,game:0};

/* sonido */
function beep(f=520,d=.08,t="square"){if(mute)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=t;o.frequency.value=f;g.gain.value=.05;o.connect(g);g.connect(AC.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);o.stop(AC.currentTime+d)}catch(e){}}
const jingle=()=>{[523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,.12),i*110));PL.hop()};
$("#mute").onclick=e=>{mute=!mute;e.target.textContent=mute?"🔇":"🔊"};

/* sprites pixel */
function sprite(m,c,px=8){let r="";m.forEach((row,y)=>[...row].forEach((k,x)=>{if(c[k])r+=`<rect x="${x}" y="${y}" width="1" height="1" fill="${c[k]}"/>`}));
return `<svg viewBox="0 0 ${m[0].length} ${m.length}" width="${m[0].length*px}" height="${m.length*px}" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`}
const WOMAN=l=>["..HHHP..",".HHHHHH.","HHSSSSHH","HSeSSeSH","HHSSSSHH","H.BBBB.H","SBBBBBBS",".BBBBBB.","BBBBBBBB",l];
const WC={H:"#4a2c1a",S:"#f2c29b",e:"#1b1b3a",B:"#fdda24",L:"#f2c29b",P:"#ff6b8a"};
const HERO=sprite(WOMAN("..L..L.."),WC,8);
const HEROS=HERO.replace(/width="64" height="80"/,'width="40" height="50"');
const BOSS=sprite(["..R..R..",".RRRRRR.","RWeRRWeR","RRRRRRRR","RReeeeRR",".RRRRRR.",".R.RR.R.","R..RR..R"],{R:"#ff6b8a",W:"#f6f2ff",e:"#1b1b3a"},12);

/* efectos */
function tw(el,txt,sp=20){clearInterval(el._t);if(RM){el.textContent=txt;return}el.textContent="";let i=0;el._t=setInterval(()=>{el.textContent=txt.slice(0,++i);if(i>=txt.length)clearInterval(el._t)},sp)}
function burst(x,y,n=14){if(RM)return;const C=["#fdda24","#9a6bff","#5ee0a0","#f6f2ff"];for(let i=0;i<n;i++){const p=document.createElement("i");p.className="pt";p.style.cssText=`left:${x}px;top:${y}px;background:${C[i%4]}`;document.body.appendChild(p);const a=Math.random()*6.28,d=40+Math.random()*80;p.animate([{transform:"translate(0,0)",opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d+30}px) rotate(200deg)`,opacity:0}],{duration:750,easing:"ease-out"}).onfinish=()=>p.remove()}}
function confetti(){for(let k=0;k<7;k++)setTimeout(()=>burst(Math.random()*innerWidth,innerHeight*.25,20),k*170)}
function ctr(el){const r=el.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]}
function toast(t){const d=document.createElement("div");d.className="toast";d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),1300)}
function gain(n){xp+=n;$("#xp").textContent=xp+" XP";toast("+"+n+" XP")}
function anim(el,c){el.classList.remove(c);void el.offsetWidth;el.classList.add(c)}

/* ataque con toques al jefe: cada 4 toques se completa un paso de Ruta Violeta */
function tapBoss(e){const bw=$("#bw",e),bs=$("#bs",e),per=4;let t=0,h0=0;bw.setAttribute("role","button");bw.setAttribute("aria-label","Atacar al jefe");
 bw.addEventListener("pointerdown",ev=>{if(ev.pointerType==="mouse"&&ev.button!==0)return;const bt=$$(".btn.alt",e),h=bt.filter(b=>b.disabled).length;if(h>=3)return;if(h!==h0){t=0;h0=h}
  t++;beep(260+t*60,.07,"sawtooth");anim(bs,"shake");burst(ev.clientX,ev.clientY,8);
  const f=document.createElement("span");f.className="dmg";f.textContent="-"+Math.floor(34/per);f.style.cssText="left:"+Math.max(10,Math.min(bw.clientWidth-40,ev.clientX-bw.getBoundingClientRect().left))+"px;top:20px";bw.appendChild(f);
  f.animate([{transform:"translateY(0)",opacity:1},{transform:"translateY(-40px)",opacity:0}],{duration:700}).onfinish=()=>f.remove();
  if(t>=per){t=0;bt.find(b=>!b.disabled).click()}else $("#hp",e).style.width=(100-h*34-t/per*34)+"%"})}
/* pantallas */
const S=[];
S.push({h:`<h1>JUGADORA 1<br>VS<br>LA VACANTE</h1>
<div class="box y"><p><b>${YO.nombre}</b><br><span class="sub">Ingeniería de Sistemas · ITM · 8.º semestre</span></p><p id="t0" style="min-height:48px"></p></div>
<p class="sub c">Camina con ◀ ▶ (mantén presionado), salta con ▲ y cruza la puerta 🚪 para pasar de nivel. También puedes tocar el suelo. Salta para recoger las monedas: al juntar las 3 de un nivel ganas XP extra. Al final te espera un trofeo 🏆.</p>
<p class="c"><button class="btn blink" id="go">▶ PRESS START</button></p>`,
enter(e){tw($("#t0",e),"Vacante Aprendiz U · Articulación Corporativa, VP de Cumplimiento · Bancolombia")},
init(e){$("#go",e).onclick=()=>{beep(784,.15);PL.auto(1)}}});

S.push({h:`<h2>Selección de personaje</h2>
<div class="box"><p><b>Clase:</b> Tecnóloga en Desarrollo de Software, hoy ingeniera de sistemas en formación.</p><p><b>Poder especial:</b> aprendo por iniciativa propia.</p></div>
<p class="sub">Toca las tarjetas para descubrir más.</p>
<div class="grid">
<button class="stat" data-d="Semillero de ciencia de datos y low code."><b>~2</b><span>años en DataUrban</span></button>
<button class="stat" data-d="Ruta Violeta y Neurolab, ambos en el ITM."><b>2</b><span>proyectos reales</span></button>
<button class="stat" data-d="Cloud Practitioner, obtenida en octubre de 2026."><b>AWS</b><span>certificación</span></button>
<button class="stat" data-d="Tecnología graduada en 2025, ingeniería en curso."><b>8.º</b><span>semestre</span></button></div>
<div id="sk"></div>`,
enter(e){const K=[["Aprendizaje autónomo",95],["Trabajo en equipo",88],["Planificación",85],["Rigor y disciplina",90]];
$("#sk",e).innerHTML=K.map(([n])=>`<div class="skill">${n}<i><u></u></i></div>`).join("");setTimeout(()=>$$("u",e).forEach((u,i)=>u.style.width=K[i][1]+"%"),80)},
init(e){$$(".stat",e).forEach(c=>c.onclick=()=>{const f=!c.dataset.s;c.dataset.s=1;$("span",c).textContent=c.dataset.d;anim(c,"pop");beep(660,.07);if(f)gain(20)})}});

S.push({h:`<h2>Nivel 1 · El origen</h2>
<p class="sub">Mueve a tu personaje por el mapa.</p>
<div class="path"><div id="av" class="sp bob">${HEROS}</div>
<div class="nodes"><button><s></s>2022</button><button><s></s>2025</button><button><s></s>HOY</button></div></div>
<div class="box y"><p id="ot" style="min-height:96px"></p></div>`,
init(e){const T=["Bachiller técnica en Medios Audiovisuales. De ahí viene mi gusto por comunicar de forma visual.","Tecnóloga en Desarrollo de Software en el ITM: aquí empecé a construir soluciones reales.","Ingeniería de Sistemas en el ITM, y lista para mi práctica profesional."],L=["16.6%","50%","83.3%"],done=new Set;
const go=i=>{$("#av",e).style.left=`calc(${L[i]} - 20px)`;$$(".nodes button",e).forEach((b,k)=>b.classList.toggle("on",k===i));tw($("#ot",e),T[i]);beep(400+i*150,.1);if(!done.has(i)){done.add(i);gain(15)}};
$$(".nodes button",e).forEach((b,i)=>b.onclick=()=>go(i));e._go=go},
enter(e){e._go(0)}});

S.push({h:`<h2>Nivel 2 · Misiones</h2><p class="sub">Toca una misión para abrirla.</p>
<button class="box y mis"><span class="stamp">¡COMPLETA!</span><p><b>Ruta Violeta</b><br><span class="sub">Feb 2024 – May 2026</span></p>
<div class="det"><p><b>Reto:</b> un canal seguro para reportar acoso y violencia de género.</p><p><b>Acción:</b> app responsive con Power Apps, listas en SharePoint y alertas con Power Automate.</p><p><b>Resultado:</b> reportes con alertas automáticas y protocolo de la ruta de atención.</p></div></button>
<button class="box mis"><span class="stamp">¡COMPLETA!</span><p><b>Neurolab</b><br><span class="sub">Ago 2025 – May 2026</span></p>
<div class="det"><p><b>Reto:</b> centralizar la gestión de pruebas psicológicas institucionales.</p><p><b>Acción:</b> frontend con React, HTML y CSS, con vistas por rol, y trabajo en equipo con Git.</p><p><b>Resultado:</b> interfaces distintas para estudiante, psicólogo y administrador.</p></div></button>`,
init(e){$$(".mis",e).forEach(m=>m.onclick=()=>{const o=m.classList.toggle("open");if(o){beep(880,.12);burst(...ctr(m),10);if(!m.dataset.x){m.dataset.x=1;gain(40)}}})}});

const OBJ=[["Power Automate","Automatizó las alertas de Ruta Violeta. Es la base para la automatización de procesos."],["SharePoint","Almacenar y consultar reportes: administración centralizada de información."],["Power Apps","Interfaces conectadas a datos, con low code y en poco tiempo."],["Python (académico)","Lo he visto en la academia, junto con Java y SQL Server. Mi punto de partida para seguir automatizando."],["Office 365","Mi entorno diario de trabajo en proyectos y semillero."],["Git + React","Trabajo en equipo con control de versiones y desarrollo de interfaces."],["AWS Cloud","Certificada en octubre de 2026: aprendo rápido y por mi cuenta."],["🔒 Power BI","Se desbloquea al completar el inventario."]];
S.push({h:`<h2>Inventario</h2><p class="sub">Recoge los 7 objetos y desbloquea el último.</p>
<div class="slots" id="sl"></div><div class="items" id="it"></div>
<div class="box y" style="min-height:96px"><p id="why" class="sub">Elige un objeto…</p></div>`,
init(e){const got=new Set,sl=$("#sl",e);sl.innerHTML="<i></i>".repeat(7);
OBJ.forEach(([n,d],i)=>{const b=document.createElement("button");b.className="item"+(i===7?" lock":"");b.textContent=n;
b.onclick=ev=>{if(i===7&&got.size<7){anim(b,"pop");beep(150,.15);$("#why",e).textContent="Aún falta recoger "+(7-got.size)+" objetos.";return}
tw($("#why",e),(i===7?"Power BI: está en mi lista para aprender, y mi historial con AWS dice que lo haré rápido. ":"")+(i===7?"":d));anim(b,"pop");
if(i===7){b.classList.add("open");if(!b.dataset.x){b.dataset.x=1;gain(60);confetti();jingle()}return}
beep(500+i*60,.09);burst(ev.clientX,ev.clientY,10);if(!got.has(i)){got.add(i);st.items=got.size;b.classList.add("got");sl.children[got.size-1].classList.add("f");gain(15);
if(got.size===7){$$(".item",e)[7].textContent="🔓 Power BI";toast("¡Completo!");jingle()}}};
$("#it",e).appendChild(b)})}});

S.push({h:`<h2>Jefe final · El caos de reportes</h2>
<p><b>Reto:</b> sin un canal seguro, los reportes de acoso se pierden y la ruta de atención no se activa.</p>
<div class="bossw" id="bw"><span class="sp bob" id="bs">${BOSS}</span></div>
<div class="hp"><i id="hp"></i></div><div class="moves" id="mv"></div>
<div class="box y" style="min-height:96px"><p id="bm" class="sub">Toca al jefe varias veces para atacarlo, o elige un ataque abajo.</p></div>`,
init(e){const M=[["1. Diseñar los datos","Creé listas en SharePoint para guardar y consultar cada reporte."],["2. Construir la interfaz","Armé una app responsive en Power Apps conectada a SharePoint."],["3. Automatizar las alertas","Con Power Automate, cada reporte dispara notificaciones y activa el protocolo de atención."]];let h=0;
M.forEach(([n,d],i)=>{const b=document.createElement("button");b.className="btn alt";b.textContent=n;
b.onclick=()=>{b.disabled=true;h++;const bs=$("#bs",e),bw=$("#bw",e);beep(200+i*150,.15,"sawtooth");anim(bs,"shake");burst(...ctr(bs),16);
const f=document.createElement("span");f.className="dmg";f.textContent="-34";f.style.cssText="left:55%;top:20px";bw.appendChild(f);f.animate([{transform:"translateY(0)",opacity:1},{transform:"translateY(-50px)",opacity:0}],{duration:900}).onfinish=()=>f.remove();
$("#hp",e).style.width=(h===3?0:100-h*34)+"%";tw($("#bm",e),d);gain(30);
if(h===3){setTimeout(()=>{bs.classList.add("dead");confetti();jingle();st.boss=true;gain(100);setTimeout(()=>{const m=$("#bm",e);clearInterval(m._t);m.innerHTML="<b style='color:var(--mint)'>¡Jefe derrotado!</b> Resultado: un canal funcional con alertas automáticas, hecho con herramientas low code."},1800)},700)}};
$("#mv",e).appendChild(b)});tapBoss(e)}});

const WORDS=["Python","Equipo","Cloud","Low code","Datos","Rigor","Automatizar","Aprender","Excel","Logro"];
S.push({h:`<h2>Nivel bonus · Atrapa mis habilidades</h2>
<p class="sub">Tienes 15 segundos: toca las palabras antes de que caigan.</p>
<div class="arena" id="ar"></div>
<p class="c"><b id="sc">Puntos: 0</b> · <b id="tm">15 s</b></p>
<p class="c"><button class="btn" id="play">▶ JUGAR</button></p>
<div class="box"><p><b>Lo que me motiva</b></p><p>Aprender por iniciativa propia: además de mis clases me certifiqué en AWS y sigo profundizando. Y que lo que construyo tenga un propósito, como la Ruta Violeta.</p></div>
<div class="box"><p><b>Lo que me gusta</b></p>${YO.meGusta.map(g=>`<p>★ ${g}</p>`).join("")}</div>
<div class="box y"><p><b>Dato único</b></p><p>${YO.datoCurioso}</p></div>`,
init(e){const ar=$("#ar",e),play=$("#play",e);let sc=0;
play.onclick=()=>{sc=0;let t=15;play.disabled=true;$("#sc",e).textContent="Puntos: 0";$("#tm",e).textContent="15 s";
const sp=setInterval(()=>{const b=document.createElement("button");b.className="fall";b.textContent=WORDS[Math.random()*WORDS.length|0];b.style.left=Math.random()*(ar.clientWidth-120)+"px";ar.appendChild(b);
const a=b.animate([{top:"-40px"},{top:ar.clientHeight+"px"}],{duration:2600+Math.random()*1400,easing:"linear"});a.onfinish=()=>b.remove();
b.onclick=ev=>{sc++;$("#sc",e).textContent="Puntos: "+sc;beep(600+sc*30,.06);burst(ev.clientX,ev.clientY,8);a.cancel();b.remove()}},520);
const tk=setInterval(()=>{t--;$("#tm",e).textContent=t+" s";if(t<=0){clearInterval(tk);clearInterval(sp);$$(".fall",ar).forEach(x=>x.remove());play.disabled=false;play.textContent="↻ OTRA VEZ";st.game=Math.max(st.game,sc);gain(sc*5);jingle();toast(sc+" habilidades")}},1000)}}});

const REQ=[["Python y programación","Lo he trabajado en la academia, con Java y SQL Server, y lo aplico en mis proyectos."],["Automatizar procesos","Lo hice con Power Automate en Ruta Violeta."],["Office y trabajo en equipo","Office 365, SharePoint y Git en proyectos colaborativos."],["Orientación al logro","Cerré dos proyectos y obtuve la certificación de AWS por iniciativa propia."]];
S.push({h:`<h2>¿Continuar? Por qué esta vacante</h2><p class="sub">Toca cada requisito para validarlo. Al terminar, camina hasta el final del suelo y salta para coger el trofeo 🏆.</p><div id="rq"></div>
<div class="box y"><p><b>Mis primeros 90 días</b></p><p>Entender los procesos de la gerencia, proponer una mejora o automatización pequeña y dejarla funcionando.</p></div>
<p class="c"><button class="btn" id="win" disabled>▶ SÍ, CONTINUAR</button></p><div class="box" id="end" hidden></div>`,
init(e){let n=0;REQ.forEach(([t,d])=>{const b=document.createElement("button");b.className="req";b.innerHTML=`<i>□</i><span>${t}<small>${d}</small></span>`;
b.onclick=ev=>{if(b.classList.contains("ok"))return;b.classList.add("ok");$("i",b).textContent="✔";beep(700,.1);burst(ev.clientX,ev.clientY,10);gain(25);if(++n===4){$("#win",e).disabled=false;$("#win",e).classList.add("blink");jingle()}};$("#rq",e).appendChild(b)});
e._fin=()=>{if($("#md"))return;const first=!e._d;e._d=1;const n=Object.values(got).reduce((a,s)=>a+s.size,0),r=n>=24?"de ORO: ¡juntaste todas las monedas!":n>=12?"de PLATA: ¡muy buen recorrido!":"de BRONCE: ¡aún quedan monedas por descubrir!";
 const w=$("#win",e);w.hidden=true;if(first){confetti();jingle()}
 const m=document.createElement("div");m.id="md";m.setAttribute("role","dialog");m.setAttribute("aria-modal","true");m.setAttribute("aria-labelledby","mt");
 m.innerHTML=`<div class="mc"><div class="mtr">${TROPHY.replace(/width="32" height="32"/,'width="88" height="88"')}</div><h2 id="mt">¡Nivel completado!</h2><p class="th">¡Gracias por jugar!</p>
 <div class="mg"><div><b>${xp}</b><span>XP</span></div><div><b>${n}/24</b><span>Monedas</span></div><div><b>${st.items}/7</b><span>Objetos</span></div><div><b>${st.boss?"✔":"—"}</b><span>Jefe</span></div><div><b>${st.game}</b><span>Récord</span></div><div><b>🏆</b><span>${r.split(":")[0].replace("de ","")}</span></div></div>
 <p>Trofeo ${r}</p><p>Contacto: <a href="https://linkedin.com/in/vanessa-espinosa-cardona" target="_blank" rel="noopener">LinkedIn</a> · vanesaespinosa2013@gmail.com</p><p class="y">Siguiente nivel: trabajar juntos.</p>
 <p><button class="btn" id="mx">Cerrar</button> <button class="btn alt" id="mr">Jugar otra vez</button></p></div>`;
 document.body.appendChild(m);const close=()=>{m.remove();w.hidden=false;w.disabled=false;w.classList.remove("blink");w.textContent="🏆 VER RESUMEN"};
 $("#mx",m).onclick=close;$("#mr",m).onclick=()=>location.reload();m.addEventListener("keydown",ev=>{if(ev.key==="Escape")close()});$("#mx",m).focus()};
$("#win",e).onclick=e._fin}});

/* motor */
const stage=$("#stage"),dots=$("#dots");let cur=0,prev=-1;const seen=new Set;
S.forEach(s=>{const d=document.createElement("section");d.className="screen";d.innerHTML=s.h;stage.appendChild(d);s.el=d;{const b=document.createElement("button"),i=dots.children.length;b.setAttribute("aria-label","Nivel "+i);b.onclick=()=>show(i);dots.appendChild(b)}});
S.forEach(s=>s.init&&s.init(s.el));
function show(i){prev=cur;cur=Math.max(0,Math.min(S.length-1,i));
S.forEach((s,k)=>{s.el.classList.remove("on");if(k===cur){s.el.style.setProperty("--d",cur>=prev?"30px":"-30px");void s.el.offsetWidth;s.el.classList.add("on")}});
if(!seen.has(cur)){seen.add(cur)}if(S[cur].enter)S[cur].enter(S[cur].el);
[...dots.children].forEach((d,k)=>d.className=k===cur?"on":seen.has(k)?"done":"");
lvlUpd();$("#fill").style.width=cur/(S.length-1)*100+"%";
stage.scrollTop=0;if(cur!==prev)beep(330,.06);PL.onShow(cur>=prev?1:-1)}


let x0=null;stage.addEventListener("touchstart",e=>{x0=e.touches[0].clientX},{passive:true});
stage.addEventListener("touchend",e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>90)show(cur+(dx<0?1:-1))});

/* personaje que camina y salta */
const gr=$("#ground"),pl=$("#pl"),COINS=[.22,.5,.78],got={};let taps=0;
const HM=WOMAN,HC=WC;
pl.innerHTML=`<span class="f1">${sprite(HM("..L..L.."),HC,4)}</span><span class="f2">${sprite(HM(".L....L."),HC,4)}</span>`;
const REW=["Busco mi práctica en software, datos o nube.","Además de mis clases, me certifiqué en AWS por iniciativa propia.","Mi formación audiovisual me ayuda a comunicar ideas de forma visual.","En Ruta Violeta implementé alertas automáticas con Power Automate.","Ya he usado Power Apps, Power Automate y SharePoint en proyectos reales.","En Neurolab hice interfaces por rol: estudiante, psicólogo y administrador.","Mi inglés es básico, pero lo estoy estudiando.","Estoy lista para aprender Power BI y lo que haga falta."];
const TROPHY=sprite(["..YYYY..","Y.YWYY.Y","YYYWYYYY",".YYYYYY.","..YYYY..","...YY...","...YY...","..OOOO.."],{Y:"#fdda24",W:"#fff6b0",O:"#b8860b"},4);let TG=0;
function say(t){$$(".say",gr).forEach(b=>b.remove());const b=document.createElement("div");b.className="say";gr.appendChild(b);tw(b,t,16);setTimeout(()=>b.remove(),5500)}
const vib=n=>{try{navigator.vibrate&&navigator.vibrate(n)}catch(e){}};
function coinFx(){vib(15);const n=Object.values(got).reduce((a,s)=>a+s.size,0);$("#cc").textContent="🪙"+n+"/24";if(got[cur].size===3){gain(30);if(DATO_EXTRA_EN_MONEDAS)say("🪙 "+REW[cur])}}
function collectTrophy(){const t=$("#tr",gr);if(!t)return;const[bx,by]=ctr(t);t.remove();TG=1;vib([40,30,80]);beep(1046,.15);burst(bx,by,24);gain(200);setTimeout(()=>S[S.length-1].el._fin(),600)}
const PL={x:8,y:0,vy:0,hold:0,face:1,target:null,lock:0,
 jump(){if(this.y===0){this.vy=400;beep(520,.1)}},
 hop(){if(this.y===0)this.vy=300},
 auto(d){this.target=d>0?gr.clientWidth-30:6},
 onShow(dir){const W=gr.clientWidth,last=cur===S.length-1;this.x=dir>0?8:W-70;this.face=dir;this.target=null;this.hold=0;this.lock=0;this.hop();
  $$(".coin,.say,#tr",gr).forEach(c=>c.remove());got[cur]=got[cur]||new Set;
  COINS.forEach((f,i)=>{if(got[cur].has(i))return;const c=document.createElement("i");c.className="coin";c.style.left=f*100+"%";c.dataset.i=i;gr.appendChild(c)});
  if(last&&!TG){const t=document.createElement("div");t.id="tr";t.innerHTML=TROPHY;t.style.left=(W-92)+"px";gr.appendChild(t)}
  $("#door").textContent=last?"":"🚪";$("#back").textContent=cur?"◀":""}};
let t0=performance.now();
requestAnimationFrame(function loop(t){const dt=Math.min(.05,(t-t0)/1000);t0=t;const P=PL,W=gr.clientWidth;let d=P.hold;
 if(P.target!==null){const df=P.target-P.x;if(Math.abs(df)<5)P.target=null;else d=Math.sign(df)}
 if(d){P.x+=d*150*dt;P.face=d}
 if(P.y>0||P.vy>0){P.vy-=1300*dt;P.y+=P.vy*dt;if(P.y<=0){P.y=0;P.vy=0}}
 if(P.x>W-46){if(cur<S.length-1&&!P.lock){P.lock=1;show(cur+1)}else P.x=W-46}
 else if(P.x<=4){P.x=4;if(d<0&&cur>0&&!P.lock){P.lock=1;show(cur-1)}}
 pl.classList.toggle("walking",!!d&&P.y===0);
 pl.style.transform=`translate(${P.x}px,${-P.y}px) scaleX(${P.face})`;
 $$(".coin",gr).forEach(c=>{const cx=parseFloat(c.style.left)/100*W;if(Math.abs(P.x+16-cx)<24&&P.y>8&&P.y<70){const[bx,by]=ctr(c);got[cur].add(+c.dataset.i);c.remove();beep(988,.08);burst(bx,by,8);gain(10);coinFx()}});
 const tr=$("#tr",gr);if(tr&&Math.abs(P.x+16-(tr.offsetLeft+16))<26&&P.y>10&&P.y<85)collectTrophy();
 requestAnimationFrame(loop)});
gr.addEventListener("pointerdown",e=>{const r=gr.getBoundingClientRect();PL.target=Math.max(4,Math.min(r.width-30,e.clientX-r.left-16))});
pl.addEventListener("pointerdown",e=>{e.stopPropagation();PL.target=null;PL.jump();if(++taps===5){gain(50);toast("¡Secreto!");jingle()}});
[["#prev",-1],["#next",1]].forEach(([s,d])=>{const b=$(s);b.onpointerdown=e=>{e.preventDefault();PL.hold=d;PL.target=null;beep(260,.04)};["pointerup","pointerleave","pointercancel"].forEach(v=>b["on"+v]=()=>{if(PL.hold===d)PL.hold=0})});
$("#jump").onpointerdown=e=>{e.preventDefault();PL.jump()};
addEventListener("keydown",e=>{if(e.key==="ArrowRight")PL.hold=1;else if(e.key==="ArrowLeft")PL.hold=-1;else if(e.key==="ArrowUp"||e.key===" "){e.preventDefault();PL.jump()}});
addEventListener("keyup",e=>{if((e.key==="ArrowRight"&&PL.hold===1)||(e.key==="ArrowLeft"&&PL.hold===-1))PL.hold=0});
addEventListener("contextmenu",e=>{if(e.target.closest(".nav,#ground"))e.preventDefault()});
setInterval(()=>{if(!PL.hold&&PL.target===null)PL.hop()},6500);
/* UX: cronómetro (toca LV), pista si no hay actividad */
const T0=performance.now(),hinted={};let tmOn=false,idle=0,lastX=-1;
function lvlUpd(){const s=((performance.now()-T0)/1000)|0;$("#lvl").textContent="LV "+cur+(tmOn?" ⏱"+String(s/60|0).padStart(2,"0")+":"+String(s%60).padStart(2,"0"):"")}
$("#lvl").onclick=()=>{tmOn=!tmOn;lvlUpd()};setInterval(lvlUpd,1000);
addEventListener("pointerdown",()=>idle=0);addEventListener("keydown",()=>idle=0);
setInterval(()=>{if(PL.x!==lastX){lastX=PL.x;idle=0;return}if(++idle>=15&&cur<S.length-1&&!hinted[cur]&&!$(".say",gr)){hinted[cur]=1;say("Cuando termines aquí, camina ▶ hasta el final del suelo para pasar al siguiente nivel.")}},1000);
show(0);
