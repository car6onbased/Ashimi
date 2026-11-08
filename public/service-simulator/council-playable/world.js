import * as THREE from '../../council-interactive/three.module.js';

// A separate, locally rendered miniature. No network assets or previous prototypes are changed.
export async function createWorld(host, { onSelect = () => {} } = {}) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.setClearColor(0xe7eee5, 0);
  renderer.domElement.setAttribute('aria-label', 'Rotatable miniature council. Use the labelled people and view controls to explore.');
  renderer.domElement.setAttribute('role', 'img');
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:pan-y;';
  host.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 150);
  const target = new THREE.Vector3(0, 1.5, .4);
  let azimuth = .69, distance = 31.5, elevation = .7;
  const cameraPosition = () => {
    camera.position.set(target.x + Math.sin(azimuth) * Math.cos(elevation) * distance,
      target.y + Math.sin(elevation) * distance,
      target.z + Math.cos(azimuth) * Math.cos(elevation) * distance);
    camera.lookAt(target);
  };
  cameraPosition();
  scene.add(new THREE.HemisphereLight(0xfffbef, 0x91a98e, 2.25));
  const sun = new THREE.DirectionalLight(0xffedce, 3.1);
  sun.position.set(-8, 19, 13); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18, near: .5, far: 50 });
  sun.shadow.bias = -.0006; sun.shadow.normalBias = .04; sun.shadow.radius = 4;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xe6f4ff, 1.05); fill.position.set(12, 9, -9); scene.add(fill);
  const materials = {};
  const mat = (name, colour, extra = {}) => materials[name] || (materials[name] = new THREE.MeshStandardMaterial({ color: colour, roughness: .79, ...extra }));
  const cream = mat('cream', 0xf2e6ce), white = mat('white', 0xfff7e3), sage = mat('sage', 0x86b58a), grass = mat('grass', 0xb9d49b);
  const dark = mat('dark', 0x315447), wood = mat('wood', 0xcda77c), rust = mat('rust', 0xcf7963), blue = mat('blue', 0x81a8b0);
  const road = mat('road', 0x7c9190), path = mat('path', 0xf0dfb9), glass = mat('glass', 0x89babc, { roughness: .27, metalness: .12 });
  const root = new THREE.Group(); scene.add(root);
  const drawables = [];
  function mesh(geometry, material, p, parent = root, shadow = true) {
    const m = new THREE.Mesh(geometry, material); m.position.set(...p); m.castShadow = shadow; m.receiveShadow = true; parent.add(m); return m;
  }
  const box = (w, h, d, p, material, parent = root) => mesh(new THREE.BoxGeometry(w, h, d), material, p, parent);
  const sphere = (r, p, material, parent = root, sy = 1) => { const m = mesh(new THREE.SphereGeometry(r, 14, 10), material, p, parent); m.scale.y = sy; return m; };
  const cylinder = (top, bottom, h, p, material, parent = root, segments = 16) => mesh(new THREE.CylinderGeometry(top, bottom, h, segments), material, p, parent);
  function roundedShape(w, d, r) {
    const s = new THREE.Shape(), x = -w / 2, z = -d / 2;
    s.moveTo(x + r, z); s.lineTo(x + w - r, z); s.quadraticCurveTo(x + w, z, x + w, z + r);
    s.lineTo(x + w, z + d - r); s.quadraticCurveTo(x + w, z + d, x + w - r, z + d);
    s.lineTo(x + r, z + d); s.quadraticCurveTo(x, z + d, x, z + d - r);
    s.lineTo(x, z + r); s.quadraticCurveTo(x, z, x + r, z); return s;
  }
  function slab(w, d, radius, depth, p, material, parent = root) {
    const geo = new THREE.ExtrudeGeometry(roundedShape(w, d, radius), { depth, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .08, bevelThickness: .06, curveSegments: 10 });
    geo.rotateX(-Math.PI / 2); return mesh(geo, material, p, parent);
  }
  function sign(text, w, h, p, parent = root, colour = '#315447', background = '#fff8e9') {
    const c = document.createElement('canvas'); c.width = 768; c.height = 160;
    const ctx = c.getContext('2d'); ctx.fillStyle = background; ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = colour; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '600 44px system-ui, sans-serif'; ctx.fillText(text, 384, 82, 710);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    return mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }), p, parent, false);
  }
  // A thick, softly edged island grounds the whole composition, as in a physical model.
  slab(23, 18.8, 2.3, .55, [0, -.5, 0], cream);
  const terrain = slab(22.5, 18.3, 2.15, .11, [0, .08, 0], grass); drawables.push(terrain);
  slab(21.7, 3.4, 1.25, .04, [0, .23, 5.6], road);
  // Road edging and pedestrian crossing.
  slab(21.9, .24, .1, .06, [0, .23, 3.76], cream);
  slab(21.9, .24, .1, .06, [0, .23, 7.44], cream);
  for (let x = -9.5; x < 10; x += 2) box(.85, .02, .08, [x, .295, 5.7], white);
  for (let x = -.8; x < 1; x += .38) box(.22, .025, 1.85, [x, .3, 5.7], white);
  slab(2, 6.2, .3, .035, [-1.25, .25, 1.15], path);
  slab(5.2, 5.4, .7, .035, [6.85, .24, -.8], mat('paving', 0xe7d6b4));
  // A small stream and a crossing make the external service boundary visible.
  slab(3.2, 14.4, 1.2, .045, [9.15, .25, -.45], mat('water', 0x9bc5c8, { roughness: .35 }));
  box(3.65, .13, 1.7, [8.55, .42, 3.3], wood);
  for (let x = 7; x < 10.5; x += .38) box(.05, .03, 1.7, [x, .5, 3.3], cream);
  for (const z of [2.5, 4.1]) { box(3.7, .08, .08, [8.55, .85, z], white); for (const x of [6.8, 8.5, 10.3]) box(.07, .7, .07, [x, .53, z], white); }
  const shadowGround = mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: .12 }), [0, -.62, 0], scene, false); shadowGround.rotation.x = -Math.PI / 2;

  const council = new THREE.Group(); council.position.set(-2.1, .3, -1.8); root.add(council);
  const roof = new THREE.Group(), facade = new THREE.Group(); council.add(roof, facade);
  // Council floor plates, rear and side walls, restrained room divisions.
  const groundFloor = box(10, .24, 6.6, [0, .3, 0], white, council); drawables.push(groundFloor);
  const upperFloor = box(10, .18, 6.6, [0, 3, 0], wood, council); drawables.push(upperFloor);
  box(10, 5.5, .22, [0, 2.9, -3.2], cream, council);
  box(.22, 5.5, 6.5, [-4.9, 2.9, 0], cream, council);
  box(.18, 5.5, 6.5, [4.9, 2.9, 0], cream, council);
  for (const y of [.48, 3.12]) {
    box(.13, 1.15, 5.3, [0, y + .55, -.5], white, council);
    box(9.6, .06, .11, [0, y + .05, 2.6], mat('skirting', 0xc6bfa8), council);
    for (const x of [-2.5, 2.5]) {
      box(2, 1.05, .06, [x, y + 1.3, -3.05], glass, council);
      box(2.15, .08, .11, [x, y + .74, -2.98], white, council);
      box(.06, 1.13, .12, [x, y + 1.3, -2.98], white, council);
    }
  }
  // Front wall and windows form the intact exterior. Its removal reveals the actual rooms.
  box(10, 5.6, .2, [0, 2.95, 3.2], cream, facade);
  for (const y of [1.5, 4.1]) for (const x of [-3.4, -1.35, 1.35, 3.4]) {
    box(1.5, 1.4, .12, [x, y, 3.35], dark, facade);
    box(1.32, 1.22, .14, [x, y, 3.43], glass, facade);
    box(.08, 1.4, .14, [x, y, 3.52], white, facade); box(1.5, .08, .14, [x, y, 3.52], white, facade);
    box(1.7, .12, .4, [x, y - .77, 3.45], white, facade);
    if (y < 2) { box(1.6, .28, .4, [x, y - .95, 3.45], rust, facade); for (const dx of [-.5, 0, .5]) sphere(.24, [x + dx, y - .7, 3.45], sage, facade, .65); }
  }
  box(1.12, 1.9, .14, [0, 1.3, 3.5], dark, facade);
  box(.75, 1.5, .15, [0, 1.35, 3.58], glass, facade);
  cylinder(.035, .035, .12, [.3, 1.2, 3.7], wood, facade).rotation.x = Math.PI / 2;
  // Civic portico and a triangular pediment.
  for (const x of [-.95, .95]) { cylinder(.13, .17, 2.3, [x, 1.55, 3.8], white, facade); cylinder(.22, .22, .16, [x, .46, 3.8], white, facade); }
  box(2.6, .19, 1.35, [0, 2.75, 3.6], white, facade);
  const ped = new THREE.Shape(); ped.moveTo(-1.4, 0); ped.lineTo(1.4, 0); ped.lineTo(0, .85); ped.closePath();
  const pedGeo = new THREE.ExtrudeGeometry(ped, { depth: .35, bevelEnabled: false });
  mesh(pedGeo, white, [0, 2.85, 3.05], facade);
  sign('BOROUGH COUNCIL', 3.9, .62, [0, 5.16, 3.4], facade);
  for (let i = 0; i < 3; i++) box(2.9 - i * .25, .14, 1.15 - i * .22, [0, .13 + i * .14, 4.18 - i * .16], cream, council);
  // Pitched slate roof, with tiles and small chimneys.
  box(10.8, .18, 7.3, [0, 5.82, 0], white, roof);
  const roofGeo = new THREE.BufferGeometry();
  roofGeo.setAttribute('position', new THREE.Float32BufferAttribute([
    -5.45, 5.9, -3.7, 5.45, 5.9, -3.7, 5.45, 7.25, 0, -5.45, 7.25, 0,
    -5.45, 7.25, 0, 5.45, 7.25, 0, 5.45, 5.9, 3.7, -5.45, 5.9, 3.7,
    -5.45, 5.9, -3.7, -5.45, 7.25, 0, -5.45, 5.9, 3.7,
    5.45, 5.9, -3.7, 5.45, 5.9, 3.7, 5.45, 7.25, 0
  ], 3));
  roofGeo.setIndex([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,11,12,13]); roofGeo.computeVertexNormals();
  mesh(roofGeo, mat('roof', 0x617e78, { side: THREE.DoubleSide }), [0,0,0], roof);
  box(11, .12, .16, [0, 7.29, 0], dark, roof);
  for (const x of [-4.2, 3.9]) { box(.62, 1.03, .62, [x, 7.1, -1.2], rust, roof); box(.78, .16, .77, [x, 7.68, -1.2], white, roof); }
  for (let x = -4.8; x < 5; x += .75) {
    const l = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, 5.96, 3.65), new THREE.Vector3(x, 7.31, 0), new THREE.Vector3(x, 5.96, -3.65)]);
    roof.add(new THREE.Line(l, new THREE.LineBasicMaterial({ color: 0x7d9790, transparent: true, opacity: .58 })));
  }

  function desk(x, y, z, parent = council, monitor = true) {
    box(2.05, .14, 1.05, [x, y + .84, z], wood, parent);
    for (const dx of [-.85, .85]) for (const dz of [-.4, .4]) box(.09, .8, .09, [x + dx, y + .4, z + dz], white, parent);
    if (monitor) { box(.76, .48, .1, [x, y + 1.23, z - .22], dark, parent); box(.65, .37, .025, [x, y + 1.23, z - .155], blue, parent); box(.08, .23, .08, [x, y + .94, z - .23], dark, parent); box(.66, .035, .21, [x, y + .94, z + .29], white, parent); }
    box(.45, .02, .3, [x + .63, y + .94, z + .1], white, parent);
    cylinder(.07, .07, .15, [x - .7, y + .97, z + .19], rust, parent);
    box(.63, .12, .66, [x, y + .46, z + .95], sage, parent);
    box(.63, .64, .12, [x, y + .79, z + 1.23], sage, parent);
    cylinder(.055, .055, .4, [x, y + .23, z + .96], dark, parent);
    for (const angle of [0, 2.1, 4.2]) box(.5, .055, .05, [x + Math.cos(angle) * .14, y + .06, z + .95 + Math.sin(angle) * .14], dark, parent).rotation.y = -angle;
  }
  desk(-2.4, .45, -.8); desk(2.4, .45, -.8); desk(-2.4, 3.1, -.8); desk(2.4, 3.1, -.8);
  // Reception waiting chairs and readable room identifiers.
  for (let i = 0; i < 3; i++) { box(.58, .12, .56, [-4 + i * .8, .9, 2], rust, council); box(.58, .55, .1, [-4 + i * .8, 1.2, 1.76], rust, council); }
  for (const [label, x, y] of [['CONTACT',-2.5,2.55],['TECHNOLOGY',2.5,2.55],['HOUSING',-2.5,5.2],['LEADERSHIP',2.5,5.2]]) sign(label, 2.2, .4, [x, y, -2.97], council);
  function shelf(x, y, z) {
    box(1.4, 1.8, .42, [x, y + .9, z], wood, council);
    for (const dy of [.4, .9, 1.4]) { box(1.32, .06, .5, [x, y + dy, z + .08], cream, council); for (let i=0;i<6;i++) box(.12,.31,.27,[x-.52+i*.18,y+dy+.2,z+.15],[sage,rust,blue,white][i%4],council); }
  }
  shelf(-4, .46, -2.6); shelf(4, 3.12, -2.6);
  function plant(x, y, z, parent = root, scale = 1) {
    cylinder(.22*scale,.16*scale,.38*scale,[x,y+.19*scale,z],rust,parent);
    for(const [dx,dz,dy] of [[0,0,.75],[.18,.03,.65],[-.13,.06,.66],[0,-.15,.62]]) sphere(.18*scale,[x+dx*scale,y+dy*scale,z+dz*scale],sage,parent,1.7);
  }
  plant(-4.2,.45,1.1,council); plant(4.2,.45,1.7,council); plant(-4,3.1,1.7,council);
  // Exterior stair gives the designer a visible route to the upper rooms.
  for(let i=0;i<12;i++) box(.95,.15+i*.21,.37,[3.35,.3+i*.105,2.8-i*.33],cream);

  function tree(x,z,size=1,kind=0) {
    cylinder(.09*size,.13*size,1.2*size,[x,.8*size,z],wood);
    const leaf = [mat('leaf1',0x7fa96e),mat('leaf2',0x9dbb73),mat('leaf3',0x759b79)][kind%3];
    if(kind%2) { const c=mesh(new THREE.ConeGeometry(.7*size,1.9*size,12),leaf,[x,1.65*size,z]); c.scale.z=.85; sphere(.49*size,[x,1.6*size,z],leaf); }
    else { sphere(.68*size,[x,1.68*size,z],leaf,root,1.45); sphere(.46*size,[x+.35*size,1.6*size,z+.04],leaf,root,1.3); }
  }
  for(const [x,z,s,k] of [[-9,-6,1.1,0],[-8,-3,.9,1],[-9,1,1,2],[-7,7.9,.7,1],[-4,8,.6,2],[3,8,.7,0],[5.5,-7.3,.9,2],[8,-7,.8,1],[9.8,-7.7,.7,0],[-5,-7.6,.7,1],[1.4,-7.8,.7,2]]) tree(x,z,s,k);
  // Ground shrubs and a flower bed.
  for(let i=0;i<7;i++) sphere(.35,[-8.8+i*.64,.6,-7.9],sage,root,.7);
  for(let i=0;i<10;i++) { sphere(.12,[-7.7+i*.21,.45,2.8],[rust,white][i%2]); }
  // Small resident home, deliberately beyond the council.
  const home = new THREE.Group(); home.position.set(6.1,.35,-3.7); root.add(home);
  box(2.6,2,2.4,[0,1.05,0],mat('home',0xf2d5a5),home);
  const hroof = new THREE.Mesh(new THREE.ConeGeometry(2.14,1.25,4),rust); hroof.rotation.y=Math.PI/4; hroof.position.set(0,2.65,0); hroof.scale.z=.92; hroof.castShadow=true; home.add(hroof);
  box(.62,1.3,.1,[0,.72,1.24],sage,home); box(.65,.67,.1,[-.8,1.25,1.25],glass,home); box(.65,.67,.1,[.8,1.25,1.25],glass,home);
  for(const x of [-.8,.8]) {box(.06,.73,.1,[x,1.25,1.33],white,home);box(.7,.06,.1,[x,1.25,1.33],white,home);}
  box(.4,.8,.4,[.75,3.02,-.4],cream,home); sign('ALEX · RESIDENT',2.55,.45,[0,.17,1.45],home);
  slab(1.7,2.5,.1,.03,[6.1,.29,-1.6],path);
  // Contractor's small service van with wheels, glass and modest signage.
  const van = new THREE.Group(); van.position.set(-7.1,.32,5.5); van.rotation.y=-.15; root.add(van);
  box(2.2,1.05,1.18,[0,.87,0],white,van); box(.78,.69,1.15,[1.1,.71,0],sage,van);
  box(.55,.37,1.19,[1.02,1.05,0],glass,van); box(.08,.38,1.19,[1.32,1.05,0],white,van);
  box(2.1,.13,1.24,[0,.48,0],dark,van);
  for(const x of [-.74,1.05]) for(const z of [-.64,.64]) {const wheel=cylinder(.27,.27,.16,[x,.38,z],dark,van);wheel.rotation.x=Math.PI/2; const hub=cylinder(.13,.13,.18,[x,.38,z],cream,van);hub.rotation.x=Math.PI/2;}
  sign('REPAIRS',1.2,.31,[-.25,.94,.604],van);
  // Outdoor workshop table is visible to both staff and external participants.
  const meeting = new THREE.Group(); meeting.position.set(4.4,.3,1.5); root.add(meeting);
  slab(3.2,2.7,.6,.04,[0,0,0],mat('meetingpad',0xd8dfc5),meeting);
  cylinder(.92,.92,.14,[0,.88,0],wood,meeting,24); cylinder(.18,.28,.83,[0,.42,0],white,meeting);
  for(let i=0;i<6;i++){const a=i*Math.PI/3; cylinder(.25,.25,.11,[Math.cos(a)*1.35,.48,Math.sin(a)*1.35],sage,meeting); cylinder(.045,.045,.43,[Math.cos(a)*1.35,.22,Math.sin(a)*1.35],dark,meeting);}
  for(let i=0;i<4;i++) box(.26,.012,.2,[(i%2-.5)*.5,.97,(Math.floor(i/2)-.5)*.4],i%2?white:rust,meeting);
  sign('WORKSHOP',2,.36,[0,.12,1.7],meeting);
  // Benches, little paving lights and a civic clock add recognisable physical detail.
  for(const [x,z] of [[-7.9,1],[3.3,7.9]]) {
    box(1.65,.12,.45,[x,.79,z],wood);box(1.65,.48,.08,[x,1,z-.2],wood);
    for(const dx of [-.6,.6])box(.08,.57,.42,[x+dx,.45,z],dark);
  }
  for(const [x,z] of [[-3.3,3.3],[1.1,3.3],[6.8,.2]]) {cylinder(.045,.055,1.6,[x,1.03,z],dark);sphere(.17,[x,1.92,z],white);}

  const homes = {
    sam: [0.45,3.41,-.1], priya: [-4.55,3.41,-.1], nia: [-4.55,.76,-.1],
    ellis: [.45,.76,-.1], ruth: [2.5,.38,1.6], mo: [-5.55,.38,4.3],
    alex: [6.1,.38,-1.2], designer: [-1.25,.38,3.65]
  };
  const palettes = {
    sam:[0x365e64,0xba7d57,0x45362e],priya:[0xb06b50,0x9b5d3e,0x2b2828],nia:[0xd5aa62,0x70452f,0x28272b],
    ellis:[0x739899,0xe2b79b,0x6a513c],ruth:[0x7d8060,0xae7755,0x4b382a],mo:[0x537466,0xc59d7b,0x37352c],
    alex:[0xd68872,0x8b5940,0x2c2929],designer:[0xe5f0d2,0x996a4a,0x352b27]
  };
  const chars = {}, motions = new Map(), ray = new THREE.Raycaster(), pointer = new THREE.Vector2();
  function person(id, p) {
    const [shirt,skin,hair] = palettes[id], g = new THREE.Group(); g.position.set(...p); root.add(g); g.userData.personId=id;
    const cloth=mat('shirt-'+id,shirt), skinmat=mat('skin-'+id,skin), hairmat=mat('hair-'+id,hair);
    const trouser=mat('trousers',0x3f514d);
    const body=cylinder(.18,.22,.5,[0,.61,0],cloth,g);body.scale.z=.75;
    for(const dx of [-.105,.105]) {cylinder(.065,.075,.39,[dx,.22,0],trouser,g);box(.15,.09,.24,[dx,.04,.055],dark,g);const arm=cylinder(.06,.065,.44,[dx*2,.6,0],cloth,g);arm.rotation.z=dx>0?-.14:.14;sphere(.065,[dx*2.1,.36,.01],skinmat,g);}
    sphere(.19,[0,1.06,0],skinmat,g,1.15);const h=sphere(.195,[0,1.14,-.025],hairmat,g,.7);
    if(id==='nia'||id==='priya'||id==='ruth') {sphere(.16,[0,1.18,-.1],hairmat,g);sphere(.12,[0,1.08,-.2],hairmat,g);}
    sphere(.035,[0,1.06,.177],skinmat,g);
    if(id==='designer') {box(.14,.17,.03,[0,.67,.17],sage,g);box(.035,.3,.035,[0,.87,.16],white,g);}
    if(id==='mo') {const cap=cylinder(.2,.2,.09,[0,1.25,0],sage,g);box(.26,.035,.23,[0,1.26,.12],sage,g);}
    g.traverse(o=>{if(o.isMesh)o.userData.personId=id;});chars[id]=g;return g;
  }
  Object.entries(homes).forEach(([id,p])=>person(id,p));
  const selectedRing = mesh(new THREE.RingGeometry(.4,.49,36),new THREE.MeshBasicMaterial({color:0x306a51,side:THREE.DoubleSide}),[0,.5,0],root,false);selectedRing.rotation.x=-Math.PI/2;selectedRing.visible=false;
  const designerRing=mesh(new THREE.RingGeometry(.24,.31,24),new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide}),[0,0,0],chars.designer,false);designerRing.rotation.x=-Math.PI/2;designerRing.position.y=.025;
  let opened=0, openTarget=0, state={step:0,selected:null,invited:[],workshop:false,flags:{},complete:false}, previousSelection=null;
  const labels = new Map(), overlay=document.createElement('div');
  overlay.className='world-label-layer'; overlay.style.cssText='position:absolute;inset:0;pointer-events:none;overflow:hidden;';host.append(overlay);
  const style = document.createElement('style');style.textContent=`.world-label{position:absolute;transform:translate(-50%,-100%);border:1px solid #d1dec8;background:#fffdf2ed;color:#294e3c;border-radius:24px;padding:5px 10px;min-width:44px;min-height:44px;font:600 11px/1.1 system-ui,sans-serif;box-shadow:0 3px 12px #274f3520;cursor:pointer;pointer-events:auto;white-space:nowrap;display:flex;align-items:center;justify-content:center}.world-label:hover,.world-label[aria-pressed=true]{background:#d8ecc7;border-color:#457458}.world-label:focus-visible{outline:3px solid #b76c48;outline-offset:2px}.world-label-layer[hidden]{display:none}`;host.append(style);
  const names={sam:'Sam',priya:'Priya',nia:'Nia',ellis:'Ellis',ruth:'Ruth',mo:'Mo'};
  for(const [id,name] of Object.entries(names)) {const b=document.createElement('button');b.type='button';b.className='world-label';b.textContent=name;b.setAttribute('aria-label','Walk over and speak to '+name);b.setAttribute('aria-pressed','false');b.onclick=()=>{select(id);onSelect(id);};overlay.append(b);labels.set(id,b);}
  const route = new THREE.Group(); root.add(route);
  const caseMarker=sphere(.14,[-4.5,.52,5],mat('case',0xcc7d52));caseMarker.visible=false;
  function updateRoute(){
    while(route.children.length){const o=route.children[0];route.remove(o);o.geometry?.dispose();o.material?.dispose();}
    caseMarker.visible=false;
    if(openTarget<1)return;
    const flags=state.flags||{}, feed=flags.feed||flags.completionFeed||flags.dataFeed,owner=flags.owner||flags.namedOwner;
    if(feed){const pts=[new THREE.Vector3(-5.55,.43,4.3),new THREE.Vector3(-4.5,.43,3.2),new THREE.Vector3(.5,.43,3.2),new THREE.Vector3(.5,1.2,.3)];const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineDashedMaterial({color:0x3f8a70,dashSize:.22,gapSize:.13}));l.computeLineDistances();route.add(l);}
    if(owner){const pts=[new THREE.Vector3(-4.55,3.44,-.1),new THREE.Vector3(3.3,3.44,2.5),new THREE.Vector3(6.1,.45,-1.2)];const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineDashedMaterial({color:0xbf7657,dashSize:.22,gapSize:.13}));l.computeLineDistances();route.add(l);}
    caseMarker.visible=true;const loc=[[-1.2,.5,3.7],[-4.5,.8,-.1],[.5,.8,-.1],[4.4,1.4,1.5],[-5.55,.6,4.3],[6.1,.6,-1.2]][Math.min(5,Math.max(0,state.step||0))];caseMarker.position.set(...loc);
  }
  function moveTo(id, destination) {
    const char=chars[id];if(!char)return;
    if(reduced.matches){char.position.copy(destination);motions.delete(id);return;}
    const start=char.position.clone(), waypoints=[];
    // Indoor movement follows the clear front aisle; floor changes use the exterior stairs.
    if(start.y>2 && destination.y<2) waypoints.push(new THREE.Vector3(start.x,start.y,1),new THREE.Vector3(3.35,start.y,1),new THREE.Vector3(3.35,.38,3));
    if(start.y<2 && destination.y>2) waypoints.push(new THREE.Vector3(start.x,.38,3),new THREE.Vector3(3.35,.38,3),new THREE.Vector3(3.35,3.41,1),new THREE.Vector3(destination.x,3.41,1));
    else if(Math.abs(destination.x-start.x)>2 && destination.y>.6)waypoints.push(new THREE.Vector3(start.x,start.y,1),new THREE.Vector3(destination.x,destination.y,1));
    waypoints.push(destination.clone());motions.set(id,{points:waypoints});
  }
  function select(id) {
    if(!chars[id]||!names[id])return;
    state.selected=id;previousSelection=id;
    const at=chars[id].position.clone();at.z+=.8;moveTo('designer',at);
    for(const [key,b]of labels)b.setAttribute('aria-pressed',String(key===id));
    selectedRing.visible=!!openTarget;
  }
  function gather(){
    const invited=Array.isArray(state.invited)?state.invited:[];
    Object.keys(names).forEach(id=>{
      const index=invited.indexOf(id);
      if(state.workshop&&index>=0){const a=index*Math.PI/3;moveTo(id,new THREE.Vector3(4.4+Math.cos(a)*1.45,.38,1.5+Math.sin(a)*1.45));}
      else moveTo(id,new THREE.Vector3(...homes[id]));
    });
    if(state.workshop)moveTo('designer',new THREE.Vector3(4.4,.38,3.45));
  }
  const projected = new THREE.Vector3();
  function placeLabels(){
    overlay.hidden=opened<.82;
    const w=host.clientWidth,h=host.clientHeight;
    for(const [id,b]of labels){projected.copy(chars[id].position).add(new THREE.Vector3(0,1.5,0)).project(camera);const x=(projected.x*.5+.5)*w,y=(-projected.y*.5+.5)*h;b.style.left=x+'px';b.style.top=y+'px';b.style.visibility=projected.z>1||x<20||x>w-20||y<25||y>h?'hidden':'visible';}
  }
  let down=null,dragging=false;
  const pointerDown=e=>{down={x:e.clientX,y:e.clientY,azimuth,elevation};dragging=false;};
  const pointerMove=e=>{if(!down||e.pointerType==='touch')return;const dx=e.clientX-down.x,dy=e.clientY-down.y;if(Math.hypot(dx,dy)>6){dragging=true;azimuth=down.azimuth-dx*.006;elevation=Math.max(.35,Math.min(1.14,down.elevation+dy*.004));cameraPosition();}};
  const pointerUp=e=>{if(!down)return;const wasDrag=dragging;down=null;if(wasDrag||opened<.82)return;const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);
    const peopleHits=ray.intersectObjects(Object.values(chars),true);if(peopleHits.length){const id=peopleHits[0].object.userData.personId;if(names[id]){select(id);onSelect(id);return;}}
    const hits=ray.intersectObjects(drawables,true);if(hits.length){const p=hits[0].point.clone();p.y+=.04;p.x=Math.max(-9,Math.min(7,p.x));p.z=Math.max(-3,Math.min(7,p.z));moveTo('designer',p);}
  };
  renderer.domElement.addEventListener('pointerdown',pointerDown);renderer.domElement.addEventListener('pointermove',pointerMove);renderer.domElement.addEventListener('pointerup',pointerUp);
  renderer.domElement.addEventListener('pointerleave',()=>{down=null;});
  const resize=()=>{const w=host.clientWidth||800,h=host.clientHeight||520;renderer.setSize(w,h,false);camera.aspect=w/h;distance=31.5*Math.max(1,1.3/camera.aspect);cameraPosition();camera.updateProjectionMatrix();};
  const observer=new ResizeObserver(resize);observer.observe(host);resize();
  const clock=new THREE.Clock();
  renderer.setAnimationLoop(()=>{
    const dt=Math.min(.05,clock.getDelta());opened=reduced.matches?openTarget:THREE.MathUtils.damp(opened,openTarget,4.5,dt);
    if(Math.abs(opened-openTarget)<.001)opened=openTarget;
    roof.position.set(0,opened*2.25,-opened*3.65);roof.rotation.x=-opened*.04;roof.visible=opened<.96;
    facade.position.set(-opened*3.5,0,opened*4);facade.visible=opened<.88;
    for(const [id,motion]of motions){const c=chars[id],dest=motion.points[0];const delta=dest.clone().sub(c.position),length=delta.length();if(length<.08){c.position.copy(dest);motion.points.shift();if(!motion.points.length)motions.delete(id);}else{const step=Math.min(length,dt*4.2);c.position.addScaledVector(delta.normalize(),step);if(Math.abs(delta.x)+Math.abs(delta.z)>.01)c.rotation.y=Math.atan2(delta.x,delta.z);}}
    if(state.selected&&chars[state.selected]){selectedRing.visible=opened>.8;selectedRing.position.copy(chars[state.selected].position);selectedRing.position.y+=.03;}
    placeLabels();renderer.render(scene,camera);
  });
  return {
    setState(next={}){
      const beforeWorkshop=state.workshop,beforeInvited=JSON.stringify(state.invited);
      state={...state,...next};openTarget=next.opened===undefined?openTarget:(next.opened?1:0);
      if(beforeWorkshop!==state.workshop||beforeInvited!==JSON.stringify(state.invited))gather();
      if(state.selected&&state.selected!==previousSelection)select(state.selected);
      if(!state.selected){previousSelection=null;selectedRing.visible=false;for(const b of labels.values())b.setAttribute('aria-pressed','false');}
      updateRoute();
    },
    select,
    rotate(dir){azimuth+=Number(dir)*.3;cameraPosition();},
    reset(){motions.clear();Object.entries(homes).forEach(([id,p])=>{chars[id].position.set(...p);chars[id].rotation.set(0,0,0);});state={step:0,selected:null,invited:[],workshop:false,flags:{},complete:false};previousSelection=null;openTarget=0;opened=0;selectedRing.visible=false;caseMarker.visible=false;for(const b of labels.values())b.setAttribute('aria-pressed','false');azimuth=.69;distance=31.5;elevation=.7;cameraPosition();updateRoute();},
    destroy(){renderer.setAnimationLoop(null);observer.disconnect();scene.traverse(o=>{o.geometry?.dispose();const ms=Array.isArray(o.material)?o.material:[o.material];for(const m of ms){m?.map?.dispose();m?.dispose();}});renderer.dispose();overlay.remove();style.remove();renderer.domElement.remove();motions.clear();}
  };
}
