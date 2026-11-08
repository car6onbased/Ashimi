import {TrafficEngine,overlap} from './traffic-engine.js?v=traffic-safety-20261105';
import {roadPoints,roadCurve,circulatingRoute,pathForCurve,pathForWalk,buildingObstacles,houseSites,townOrganisations} from './traffic-layout.js?v=traffic-safety-20261105';
import * as THREE from '../../council-interactive/three.module.js';

// A separate, locally rendered miniature. No network assets or previous prototypes are changed.
export async function createWorld(host, { onSelect = () => {}, onEnter = () => {}, onOrganisation = () => {} } = {}) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 620px)');
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .96;
  renderer.setClearColor(0xe7eee5, 0);
  renderer.domElement.setAttribute('aria-label', 'Explorable miniature service-design district. Council is playable; ten other organisation buildings are planned. Use the labelled destinations and view controls.');
  renderer.domElement.setAttribute('role', 'img');
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:pan-y pinch-zoom;';
  host.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 800);
  const target = new THREE.Vector3(0, 1.5, .4);
  let zoom=1;
  let azimuth = .35, distance = 91, elevation = .76, cameraBlend = 0, overviewDistance = 91, closeDistance = 34;
  const cameraPosition = () => {
    target.set(THREE.MathUtils.lerp(-4, 0, cameraBlend), THREE.MathUtils.lerp(.2, 1.5, cameraBlend), THREE.MathUtils.lerp(0, .4, cameraBlend));
    distance=THREE.MathUtils.lerp(overviewDistance*zoom,closeDistance,cameraBlend);
    camera.position.set(target.x + Math.sin(azimuth) * Math.cos(elevation) * distance,
      target.y + Math.sin(elevation) * distance,
      target.z + Math.cos(azimuth) * Math.cos(elevation) * distance);
    camera.lookAt(target);
  };
  cameraPosition();
  scene.add(new THREE.HemisphereLight(0xfffbef, 0x638358, 1.65));
  const sun = new THREE.DirectionalLight(0xffedce, 2.65);
  sun.position.set(-35, 60, 40); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -48, right: 48, top: 48, bottom: -48, near: .5, far: 150 });
  sun.shadow.bias = -.0006; sun.shadow.normalBias = .04; sun.shadow.radius = 4;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xe6f4ff, .65); fill.position.set(12, 9, -9); scene.add(fill);
  const materials = {};
  const mat = (name, colour, extra = {}) => materials[name] || (materials[name] = new THREE.MeshStandardMaterial({ color: colour, roughness: .79, ...extra }));
  const cream = mat('cream', 0xf2e6ce), white = mat('white', 0xfff7e3), sage = mat('sage', 0x57a65b), grass = mat('grass', 0x78b84e);
  const dark = mat('dark', 0x315447), wood = mat('wood', 0xcda77c), rust = mat('rust', 0xe46d48), blue = mat('blue', 0x81a8b0);
  const road = mat('road', 0x536779), path = mat('path', 0xf0dfb9), glass = mat('glass', 0x89babc, { roughness: .27, metalness: .12 });
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
  slab(260, 230, 12, .55, [-4, -.5, 0], cream);
  const terrain = slab(259, 229, 12, .11, [-4, .08, 0], grass); drawables.push(terrain);
  // The council frontage uses the same street surface as the district.
  // Its crossing is painted after all road surfaces, without a second road or kerb.
  slab(2, 6.2, .3, .035, [-1.25, .25, 1.15], path);
  slab(5.2, 5.4, .7, .035, [6.85, .24, -.8], mat('paving', 0xe7d6b4));
  // A small stream and a crossing make the external service boundary visible.
  slab(3.2, 14.4, 1.2, .045, [9.15, .25, -.45], mat('water', 0x9bc5c8, { roughness: .35 }));
  box(3.65, .13, 1.7, [8.55, .42, 3.3], wood);
  for (let x = 7; x < 10.5; x += .38) box(.05, .03, 1.7, [x, .5, 3.3], cream);
  for (const z of [2.5, 4.1]) { box(3.7, .08, .08, [8.55, .85, z], white); for (const x of [6.8, 8.5, 10.3]) box(.07, .7, .07, [x, .53, z], white); }
  const shadowGround = mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: .12 }), [0, -.62, 0], scene, false); shadowGround.rotation.x = -Math.PI / 2;

  const civicGold = mat('civic-gold', 0xe8ba63);
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
  box(10, 5.6, .2, [0, 2.95, 3.2], civicGold, facade);
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
  mesh(roofGeo, mat('roof', 0x246d78, { side: THREE.DoubleSide }), [0,0,0], roof);
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
    const leaf = [mat('leaf1',0x388b36),mat('leaf2',0x83b73d),mat('leaf3',0x4c9b47)][kind%3];
    if(kind%2) { const c=mesh(new THREE.ConeGeometry(.7*size,1.9*size,12),leaf,[x,1.65*size,z]); c.scale.z=.85; sphere(.49*size,[x,1.6*size,z],leaf); }
    else { sphere(.68*size,[x,1.68*size,z],leaf,root,1.45); sphere(.46*size,[x+.35*size,1.6*size,z+.04],leaf,root,1.3); }
  }
  for(const [x,z,s,k] of [[-9,-6,1.1,0],[-8,-3,.9,1],[-9,1,1,2],[-7,7.9,.7,1],[-4,8,.6,2],[5.5,-7.3,.9,2],[8,-7,.8,1],[9.8,-7.7,.7,0],[-5,-7.6,.7,1],[1.4,-7.8,.7,2]]) tree(x,z,s,k);
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
  const van = new THREE.Group(); van.position.set(-7.8,.32,3.2); van.rotation.y=-.15; root.add(van);
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
  for(const [x,z] of [[-7.9,1]]) {
    box(1.65,.12,.45,[x,.79,z],wood);box(1.65,.48,.08,[x,1,z-.2],wood);
    for(const dx of [-.6,.6])box(.08,.57,.42,[x+dx,.45,z],dark);
  }
  for(const [x,z] of [[-3.3,3.3],[1.1,3.3],[6.8,.2]]) {cylinder(.045,.055,1.6,[x,1.03,z],dark);sphere(.17,[x,1.92,z],white);}


  // One connected district. The surrounding buildings are planned scenarios, not fake playable routes.
  const organisations = townOrganisations;
  const organisationGroups=[council], organisationMarkers=new Map();
  council.traverse(o=>{if(o.isMesh)o.userData.organisationId='council';});
  function pitched(w,d,h,y,parent,material=rust){
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([
      -w/2,0,-d/2,w/2,0,-d/2,w/2,h,0,-w/2,h,0,
      -w/2,h,0,w/2,h,0,w/2,0,d/2,-w/2,0,d/2,
      -w/2,0,-d/2,-w/2,h,0,-w/2,0,d/2,
      w/2,0,-d/2,w/2,0,d/2,w/2,h,0],3));
    g.setIndex([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,11,12,13]);g.computeVertexNormals();
    return mesh(g,material,[0,y,0],parent);
  }
  const districtPaving=mat('district-paving',0xe7dcc1);
  // Curved streets share their exact splines with the vehicles, so traffic stays on the road.
  const streetCurves = [];
  function ribbon(curve, width, y, material, offset=0) {
    const positions=[],indices=[],steps=180;
    for(let i=0;i<=steps;i++) {
      const t=i/steps,p=curve.getPointAt(t),v=curve.getTangentAt(t);
      const n=new THREE.Vector3(-v.z,0,v.x).normalize();
      for(const side of [-1,1]) {const q=p.clone().addScaledVector(n,offset+side*width/2);positions.push(q.x,y,q.z);}
      if(i<steps){const k=i*2;indices.push(k,k+1,k+2,k+1,k+3,k+2);}
    }
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setIndex(indices);geo.computeVertexNormals();
    return mesh(geo,material,[0,0,0],root,false);
  }
  function street(points,closed=false) {
    const curve=roadCurve(points,closed);
    streetCurves.push(curve);return curve;
  }
  const roundabout=street(roadPoints[0],true);
  for(const points of roadPoints.slice(1,4))street(points);
  street(roadPoints[4]);
  // Lay every pavement first, then every carriageway. Junctions are one asphalt
  // surface, with no pavement ribbon or frontage kerb cutting across a merge.
  for(const curve of streetCurves)ribbon(curve,5.1,.22,districtPaving);
  for(const curve of streetCurves)ribbon(curve,3.8,.28,road);
  const roadSamples=streetCurves.map(curve=>Array.from({length:361},(_,i)=>curve.getPointAt(i/360)));
  for(let index=1;index<streetCurves.length;index++){
    const curve=streetCurves[index],length=curve.getLength();
    for(let d=1.35;d<length-1;d+=2.7){
      const p=curve.getPointAt(d/length),v=curve.getTangentAt(d/length);
      // Stop the whole dash before any adjoining carriageway, including the ring.
      const atJunction=roadSamples.some((samples,j)=>j!==index&&samples.some(q=>Math.hypot(p.x-q.x,p.z-q.z)<2.65));
      const atCrossing=Math.abs(p.x)<1.6&&Math.abs(p.z-5.6)<1.4;
      if(atJunction||atCrossing)continue;
      const dash=box(.1,.025,.85,[p.x,.3,p.z],white);dash.rotation.y=Math.atan2(v.x,v.z);
    }
  }
  // The roundabout has a clear circulating surface, without conflicting centre dashes.
  for(let x=-.8;x<1;x+=.38)box(.22,.025,2.6,[x,.3,5.6],white);
  // Turning heads beyond the district let vehicles turn without cutting across pedestrians.
  for(const [index,atStart]of [[1,true],[2,false],[3,false]]){
    const c=streetCurves[index],p=c.getPointAt(atStart?0:1),v=c.getTangentAt(atStart?0:1).multiplyScalar(atStart?-1:1);p.addScaledVector(v,3.5);
    cylinder(5.4,5.4,.04,[p.x,.23,p.z],districtPaving,root,48);cylinder(5,5,.04,[p.x,.29,p.z],road,root,48);
  }
  // Flower-filled raised roundabout with a miniature civic tree.
  cylinder(3.35,3.5,.23,[4,.32,13],cream,root,64);
  cylinder(3.13,3.13,.16,[4,.49,13],grass,root,64);
  tree(4,13,1.65,0);
  for(let i=0;i<32;i++){const a=i*Math.PI/16;const x=4+Math.cos(a)*2.65,z=13+Math.sin(a)*2.65;sphere(.22,[x,.67,z],i%3===0?mat('flowers-pink',0xe35996):i%3===1?white:mat('flowers-gold',0xffc74b),root,.75);}
  const traffic=[];
  function motor(colour,curve,lane,phase,speed,vanBody=false) {
    const g=new THREE.Group();root.add(g);const paint=mat('car-'+colour,colour);
    slab(1.04,2.05,.22,.25,[0,.32,0],paint,g);
    box(.94,.55,vanBody?1.5:1.1,[0,.8,vanBody?-.15:-.1],paint,g);
    box(.96,.32,.58,[0,.87,.28],glass,g);
    if(!vanBody)box(.98,.08,.7,[0,1.1,-.1],paint,g);
    for(const x of [-.55,.55])for(const z of [-.66,.66]){const tyre=cylinder(.22,.22,.15,[x,.38,z],dark,g,12);tyre.rotation.z=Math.PI/2;}
    for(const x of [-.32,.32]){box(.2,.13,.04,[x,.57,1.04],white,g);box(.2,.12,.04,[x,.57,-1.04],rust,g);}
    traffic.push({g,curve,lane,phase,speed,length:curve.getLength()});return g;
  }
  // Left-hand traffic. Roundabout circulation is clockwise when viewed from above.
  for(let i=0;i<2;i++)motor([0xd75042,0xf3c954][i],roundabout,-.72,i/2,2.5);
  // Each outer route enters the roundabout, circulates and leaves on the other lane.
  // Its return turn is beyond the district edge, rather than teleporting at a visible junction.
  for(const [index,angle,outside]of [[1,Math.PI,true],[2,0,false],[3,Math.PI/2,false]]){
    const route=circulatingRoute(streetCurves[index],angle,outside);
    for(let i=0;i<2;i++)motor([0x417da4,0xf0e6cf,0xc65d44,0x5d9281][(index+i)%4],route,0,(index*.19+i*.5)%1,2.4,index===3&&i===1);
  }
  let townTime=0, motionPaused=reduced.matches;
  const motionButton=document.createElement('button');motionButton.type='button';motionButton.className='town-motion';
  function motionLabel(){const label=motionPaused?'Play town movement':'Pause town movement';motionButton.textContent=motionPaused?'▶':'Ⅱ';motionButton.setAttribute('aria-label',label);motionButton.title=label;motionButton.setAttribute('aria-pressed',String(motionPaused));}
  motionLabel();motionButton.onclick=()=>{motionPaused=!motionPaused;motionLabel();};document.getElementById('view-toggle').after(motionButton);
  const stage=document.getElementById('world-stage'),viewDock=document.querySelector('.scene-controls'),staffBar=document.getElementById('people-strip');
  const sheet=stage.querySelector('.world-sheet');
  const caseTop=stage.querySelector('.mobile-case-top');
  const rail=document.querySelector('.portfolio-rail');
  function measureDock(){stage.style.setProperty('--view-toolbar-height',Math.ceil(viewDock.getBoundingClientRect().height)+'px');stage.style.setProperty('--staff-bar-height',Math.ceil(staffBar.getBoundingClientRect().height)+'px');}
  const dockObserver=new ResizeObserver(measureDock);dockObserver.observe(viewDock);dockObserver.observe(staffBar);measureDock();
  const reducedChange=()=>{motionPaused=reduced.matches;motionLabel();};reduced.addEventListener('change',reducedChange);
  function windows(parent,w,d,levels=1){
    for(let f=0;f<levels;f++)for(let x=-w/2+.85;x<w/2-.3;x+=1.45){
      box(.78,.8,.1,[x,1.35+f*1.45,d/2+.055],glass,parent);
      box(.06,.88,.11,[x,1.35+f*1.45,d/2+.12],white,parent);
      box(.86,.06,.11,[x,.91+f*1.45,d/2+.12],white,parent);
    }
    box(.75,1.5,.11,[0,.98,d/2+.16],dark,parent);
    box(.54,1.29,.12,[0,1,d/2+.23],glass,parent);
  }
  for(const org of organisations.filter(o=>!o.playable)){
    const g=new THREE.Group();g.position.set(org.x,.3,org.z);root.add(g);organisationGroups.push(g);
    const wall=mat('sector-'+org.id,org.colour),accent=org.kind==='games'?blue:org.kind==='environment'||org.kind==='grocery'?sage:rust;
    const w=org.kind==='ecommerce'?9:org.kind==='grocery'?8:org.kind==='restaurant'?5.2:7;
    const d=org.kind==='ecommerce'?6.8:org.kind==='environment'?5.8:5.6;
    slab(w+2,d+3,.8,.04,[0,0,.6],districtPaving,g);
    let height=org.kind==='games'?5.6:org.kind==='consular'?4.8:org.kind==='health'?4:3.2;
    box(w,height,d,[0,height/2+.2,0],wall,g);
    windows(g,w,d,org.kind==='games'||org.kind==='consular'||org.kind==='health'?2:1);
    if(['restaurant','education','environment'].includes(org.kind))pitched(w+.6,d+.8,1.4,height+.22,g,accent);
    else box(w+.5,.22,d+.5,[0,height+.32,0],accent,g);
    sign(org.short.toUpperCase(),Math.min(w-1,5.6),.6,[0,height-.35,d/2+.25],g);
    if(org.kind==='bank'){
      for(const x of [-2.4,-.9,.9,2.4]){cylinder(.18,.22,2.65,[x,1.6,d/2+.8],white,g);cylinder(.3,.3,.18,[x,.38,d/2+.8],cream,g);}
      box(w+.5,.25,1.5,[0,3.08,d/2+.5],white,g);
      const p=new THREE.Shape();p.moveTo(-w/2,0);p.lineTo(w/2,0);p.lineTo(0,1.5);p.closePath();mesh(new THREE.ExtrudeGeometry(p,{depth:.4,bevelEnabled:false}),cream,[-0,3.4,d/2-.1],g);
    }
    if(org.kind==='consular'){
      box(3.2,1.6,3,[0,height+1.05,-.6],wall,g);box(3.5,.25,3.3,[0,height+1.9,-.6],sage,g);
      for(let i=0;i<3;i++){cylinder(.04,.04,3.8,[-2+i*2,2.1,d/2+1],dark,g);box(.9,.55,.05,[-1.57+i*2,3.5,d/2+1],i===0?rust:i===1?sage:blue,g);}
    }
    if(org.kind==='environment'){
      const greenhouse=new THREE.Group();greenhouse.position.set(-1,.3,4.6);g.add(greenhouse);box(3,1.5,1.8,[0,.75,0],glass,greenhouse);pitched(3.2,2,1,.7,greenhouse,sage);
      for(const x of [-1,0,1])box(.05,1.6,1.9,[x,.8,0],white,greenhouse);
      for(let i=0;i<4;i++){const solar=box(1.15,.06,1.45,[-2+i*1.3,height+.6,-.6],blue,g);solar.rotation.x=.25;}
      cylinder(.08,.15,4.4,[4.8,2.2,-.7],white,g);sphere(.19,[4.8,4.5,-.7],cream,g);
      for(let i=0;i<3;i++){const blade=box(.13,2,.08,[4.8+Math.sin(i*2.094),4.5+Math.cos(i*2.094),-.62],white,g);blade.rotation.z=-i*2.094;}
    }
    if(org.kind==='health'){
      box(1.8,.6,.18,[0,3,d/2+.24],rust,g);box(.6,1.8,.18,[0,3,d/2+.24],rust,g);
      box(3,.17,1.4,[0,2.2,d/2+.75],sage,g);
      const ambulance=new THREE.Group();ambulance.position.set(4.7,.1,2);g.add(ambulance);box(2,1.2,1,[0,.8,0],white,ambulance);box(.7,.55,1,[-1.1,.65,0],sage,ambulance);box(.5,.17,.15,[0,1.5,0],rust,ambulance);
      for(const x of [-.85,.75])for(const z of [-.55,.55]){const tyre=cylinder(.22,.22,.12,[x,.35,z],dark,ambulance);tyre.rotation.x=Math.PI/2;}
    }
    if(org.kind==='apprenticeships'){
      for(const x of [-2,1.8]){box(2.1,1.7,.12,[x,1.15,d/2+.13],sage,g);for(let j=0;j<5;j++)box(2.1,.035,.14,[x,.5+j*.3,d/2+.2],cream,g);}
      for(let i=0;i<3;i++){const saw=new THREE.Mesh(new THREE.ConeGeometry(1.4,1.1,4),cream);saw.rotation.y=Math.PI/4;saw.position.set(-2.3+i*2.3,height+.95,0);saw.scale.z=1.6;saw.castShadow=true;g.add(saw);}
      for(let i=0;i<4;i++)box(.55,.6,.55,[-2+i*.9,.4,4.1],i%2?rust:wood,g);
    }
    if(org.kind==='education'){
      box(2.3,2.1,2,[0,height+1.2,-.1],cream,g);pitched(2.7,2.4,.9,height+2.3,g,rust);
      const clockFace=cylinder(.58,.58,.08,[0,height+1.25,1.02],white,g);clockFace.rotation.x=Math.PI/2;box(.035,.42,.1,[0,height+1.4,1.08],dark,g);box(.32,.035,.1,[.15,height+1.25,1.08],dark,g);
      box(1.6,.1,1.6,[-4.8,1.1,1.3],sage,g);box(.1,1.6,.1,[-4.8,.4,1.3],dark,g);
    }
    if(org.kind==='restaurant'){
      for(let i=0;i<8;i++){const awning=box(.63,.14,1.5,[-2.2+i*.63,2.4,d/2+.65],i%2?white:rust,g);awning.rotation.x=.17;}
      for(const x of [-1.5,1.5]){cylinder(.65,.65,.1,[x,.8,4.9],wood,g);cylinder(.06,.06,.7,[x,.4,4.9],white,g);cylinder(0,1.05,.55,[x,2.3,4.9],sage,g);cylinder(.035,.035,2.2,[x,1.2,4.9],white,g);for(const dx of [-.85,.85]){cylinder(.23,.23,.1,[x+dx,.45,4.9],rust,g);cylinder(.04,.04,.4,[x+dx,.2,4.9],dark,g);}}
    }
    if(org.kind==='ecommerce'){
      for(const x of [-2.8,0,2.8]){box(2,1.8,.1,[x,1.15,d/2+.13],dark,g);box(2.2,.16,1,[x,.36,d/2+.5],cream,g);}
      for(let i=0;i<6;i++)box(.6,.65,.6,[-3+(i%3)*.75,.6+Math.floor(i/3)*.65,5],wood,g);
      for(const x of [-2,1.5])box(2.4,.08,1.2,[x,height+.5,-.8],blue,g).rotation.x=.1;
    }
    if(org.kind==='grocery'){
      box(w+.3,.24,1.4,[0,2.55,d/2+.6],sage,g);for(const x of [-3,-1.5,1.5,3])box(1.1,1.5,.1,[x,1.3,d/2+.15],glass,g);
      for(let i=0;i<5;i++){box(.45,.6,.35,[4.8,.5,-1+i*.55],sage,g);box(.5,.06,.08,[4.8,.82,-1+i*.55],dark,g);}
      for(const x of [-2,2])plant(x,.25,4.8,g,.8);
    }
    if(org.kind==='games'){
      for(let i=0;i<4;i++)box(w+.1,.09,.1,[0,1+i*1.2,d/2+.18],white,g);
      const controller=new THREE.Group();controller.position.set(0,height+1,0);g.add(controller);slab(3.6,1.9,.8,.2,[0,0,0],cream,controller);box(.8,.12,.25,[-.8,.28,0],dark,controller);box(.25,.12,.8,[-.8,.28,0],dark,controller);sphere(.17,[.8,.3,-.2],rust,controller);sphere(.17,[1.1,.3,.2],sage,controller);
    }
    // Front path, a bench and a pair of trees connect each place to the shared streets.
    const roadZ=org.z<-10?-11:org.z>10?28:9;
    const start=org.z+d/2+1.4;
    if(Math.abs(roadZ-start)>.2)slab(1.15,Math.abs(roadZ-start),.15,.02,[org.x,.25,(roadZ+start)/2],path);
    for(const dx of [-w/2-1.1,w/2+1.1])tree(org.x+dx,org.z-d/2-1,.8,Math.floor(Math.abs(org.x+dx))%3);
    g.traverse(o=>{if(o.isMesh)o.userData.organisationId=org.id;});
  }
  for(const [x,z] of [[-40,-23],[-38,26],[-29,-29],[-15,-29],[0,-29],[26,-19],[30,1],[29,27],[-4,30]])tree(x,z,1.2,Math.floor(Math.abs(x))%3);
  // Calm planting and a few street lights provide scale without making an unrelated new game.
  for(const x of [-31,-22,-4,7,25])for(const z of [-12.8,10.8]){cylinder(.05,.06,2.4,[x,1.4,z],dark);sphere(.2,[x,2.7,z],white);}

  // A connected residential neighbourhood and planted public realm frame the service buildings.
  for(const [x,z] of houseSites) {
    const h=new THREE.Group();h.position.set(x,.3,z);root.add(h);
    box(3.6,3.5,3.5,[0,1.8,0],mat('house-'+x, x%2?0xf2ce83:0xf3e4c2),h);pitched(4,3.9,1.5,3.55,h,rust);windows(h,3.6,3.5,2);box(.4,1,.5,[1,4.6,-.5],cream,h);
    slab(1,3,.1,.03,[x,.26,z+3.2],path);tree(x-2.8,z+1,.9,1);
  }
  for(const [x,z] of [[-38,-17],[-31,-15],[-24,-15],[-17,-17],[-10,-28],[-2,-28],[6,-28],[24,-28],[-36,5],[-28,7],[-21,7],[-17,13],[-10,17],[12,19],[25,23],[34,22],[-32,33],[-22,35],[-13,36],[3,36],[13,34],[25,34],[35,32],[35,-18],[38,0]]) {
    tree(x,z,1.1+Math.abs(Math.sin(x*z))*.5,Math.round(Math.abs(x))%3);
    for(let j=0;j<3;j++)sphere(.38,[x-.8+j*.65,.5,z+1.2],sage,root,.7);
  }
  // Café terrace, seats and striped parasols beside the southern street.
  for(const x of [-3,0,3]){
    cylinder(.65,.65,.1,[x,.9,26],wood);cylinder(.06,.06,.7,[x,.5,26],white);
    const parasol=cylinder(0,1.15,.55,[x,2.6,26],x===0?rust:sage);cylinder(.035,.035,2.2,[x,1.45,26],white);
    for(const dx of [-.95,.95]){cylinder(.24,.24,.13,[x+dx,.5,26],rust);cylinder(.05,.05,.4,[x+dx,.24,26],dark);}
  }
  // Civic clock tower moves away with the roof when the council opens.
  box(1.45,1.55,1.45,[0,7.65,0],cream,roof);
  pitched(1.8,1.8,.8,8.45,roof,mat('roof'));
  const civicClock=cylinder(.48,.48,.055,[0,7.72,.755],white,roof,32);civicClock.rotation.x=Math.PI/2;
  box(.035,.32,.04,[0,7.86,.8],dark,roof);box(.27,.035,.04,[.12,7.72,.8],dark,roof);
  for(const [x,z] of [[-19,6],[-26,6],[12,23],[24,10],[-30,-9]]){
    box(1.8,.12,.5,[x,.8,z],wood);box(1.8,.45,.1,[x,1,z-.22],wood);
    for(const dx of [-.7,.7])box(.08,.65,.4,[x+dx,.44,z],dark);
  }
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
    g.userData.limbs=[];
    for(const dx of [-.105,.105]) {
      const leg=new THREE.Group();leg.position.set(dx,.41,0);g.add(leg);cylinder(.065,.075,.39,[0,-.19,0],trouser,leg);box(.15,.09,.24,[0,-.37,.055],dark,leg);
      const arm=new THREE.Group();arm.position.set(dx*2,.81,0);g.add(arm);cylinder(.06,.065,.44,[0,-.21,0],cloth,arm);sphere(.065,[0,-.45,.01],skinmat,arm);arm.rotation.z=dx>0?-.14:.14;
      g.userData.limbs.push({leg,arm,side:dx>0?1:-1});
    }
    sphere(.19,[0,1.06,0],skinmat,g,1.15);const h=sphere(.195,[0,1.14,-.025],hairmat,g,.7);
    if(id==='nia'||id==='priya'||id==='ruth') {sphere(.16,[0,1.18,-.1],hairmat,g);sphere(.12,[0,1.08,-.2],hairmat,g);}
    sphere(.035,[0,1.06,.177],skinmat,g);
    if(id==='designer') {box(.14,.17,.03,[0,.67,.17],sage,g);box(.035,.3,.035,[0,.87,.16],white,g);}
    if(id==='mo') {const cap=cylinder(.2,.2,.09,[0,1.25,0],sage,g);box(.26,.035,.23,[0,1.26,.12],sage,g);}
    g.traverse(o=>{if(o.isMesh)o.userData.personId=id;});chars[id]=g;return g;
  }
  Object.entries(homes).forEach(([id,p])=>person(id,p));
  const walkers=[];
  for(let i=0;i<16;i++){
    const id='neighbour-'+i;palettes[id]=Object.values(palettes)[i%8];
    const g=person(id,[0,.32,0]);delete chars[id];g.traverse(o=>{delete o.userData.personId;});
    const curve=streetCurves[1+i%3];walkers.push({g,curve,phase:i/16,lane:i%2?2.35:-2.35,length:curve.getLength()});
  }
  const trafficEngine=new TrafficEngine(buildingObstacles(organisations));
  const groundPeople=()=>Object.values(chars).filter(c=>c.position.y<1.6).map(c=>({id:c.userData.personId,x:c.position.x,z:c.position.z,angle:0,halfWidth:.32,halfLength:.32}));
  trafficEngine.externalPeople=groundPeople();
  for(const [i,car]of traffic.entries())car.agent=trafficEngine.add({id:'car-'+String(i).padStart(2,'0'),path:pathForCurve(car.curve,car.lane),phase:car.phase,speed:car.speed,priority:i<2?0:1,junction:i<2?null:[Math.PI,0,Math.PI/2][Math.floor((i-2)/2)]});
  for(const [i,w]of walkers.entries())w.agent=trafficEngine.add({id:'walker-'+i,path:pathForWalk(w.curve,w.lane),phase:w.phase,speed:.65,kind:'pedestrian'});
  function updateTown(dt){
    const paused=motionPaused||document.hidden;
    trafficEngine.tick(dt,{paused,people:groundPeople()});townTime=trafficEngine.time;
    for(const car of traffic){const a=car.agent,p=trafficEngine.body(a);car.g.visible=a.active;car.g.position.set(p.x,.3,p.z);car.g.rotation.y=p.angle;}
    for(const w of walkers){const a=w.agent,p=trafficEngine.body(a);w.g.visible=a.active;w.g.position.set(p.x,.3,p.z);w.g.rotation.y=p.angle;
      for(const limb of w.g.userData.limbs){const swing=paused?0:Math.sin(a.travelled*7)*.35*limb.side;limb.leg.rotation.x=swing;limb.arm.rotation.x=-swing;}}
    host.dataset.trafficTime=townTime.toFixed(2);
    host.dataset.trafficMoving=String(trafficEngine.cars.filter(c=>c.speed>.05).length);
    host.dataset.trafficSafety=JSON.stringify(trafficEngine.stats);
  }
  function characterClear(position){
    if(position.y>1.6)return true;
    const body={x:position.x,z:position.z,halfWidth:.32,halfLength:.32,angle:0};
    return !trafficEngine.cars.some(car=>car.active&&overlap(body,trafficEngine.body(car),.16))&&!trafficEngine.obstacles.some(o=>o.id.startsWith('parked-')&&overlap(body,o,.08));
  }

  const selectedRing = mesh(new THREE.RingGeometry(.4,.49,36),new THREE.MeshBasicMaterial({color:0x306a51,side:THREE.DoubleSide}),[0,.5,0],root,false);selectedRing.rotation.x=-Math.PI/2;selectedRing.visible=false;
  const designerRing=mesh(new THREE.RingGeometry(.24,.31,24),new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide}),[0,0,0],chars.designer,false);designerRing.rotation.x=-Math.PI/2;designerRing.position.y=.025;
  let opened=0, openTarget=0, state={step:0,selected:null,invited:[],workshop:false,flags:{},complete:false}, previousSelection=null;
  const labels = new Map(), overlay=document.createElement('div');
  overlay.className='world-label-layer'; overlay.style.cssText='position:absolute;inset:0;pointer-events:none;overflow:hidden;';host.append(overlay);
  const style = document.createElement('style');style.textContent=`.world-label{position:absolute;transform:translate(-50%,-100%);border:1px solid #d1dec8;background:#fffdf2ed;color:#294e3c;border-radius:24px;padding:5px 10px;min-width:44px;min-height:44px;font:600 11px/1.1 system-ui,sans-serif;box-shadow:0 3px 12px #274f3520;cursor:pointer;pointer-events:auto;white-space:nowrap;display:flex;align-items:center;justify-content:center}.world-label:hover,.world-label[aria-pressed=true]{background:#d8ecc7;border-color:#457458}.world-label:focus-visible{outline:3px solid #b76c48;outline-offset:2px}.world-label-layer[hidden]{display:none}`;host.append(style);
  const mapOverlay=document.createElement('div');mapOverlay.className='map-label-layer';mapOverlay.style.cssText='position:absolute;inset:0;pointer-events:none;overflow:hidden;';host.append(mapOverlay);
  const mapStyle=document.createElement('style');mapStyle.textContent=`.map-label{position:absolute;transform:translate(-50%,-100%);border:1px solid #b6c8aa;background:#fafceded;color:#294b39;border-radius:11px;padding:7px 11px;min-height:44px;max-width:142px;box-shadow:0 5px 16px #35573518;pointer-events:auto;cursor:pointer;font:600 11px/1.12 system-ui,sans-serif;text-align:left;white-space:normal}.map-label small{display:block;font-size:8px;line-height:1.3;letter-spacing:.8px;text-transform:uppercase;font-weight:500;color:#687d62;margin-top:4px}.map-label.playable{background:#285b3e;border-color:#285b3e;color:#fff;box-shadow:0 5px 22px #244b3938;z-index:3}.map-label.playable small{color:#d1e6bf}.map-label:hover{background:#e5f0db}.map-label.playable:hover{background:#17472d}.map-label:focus-visible{outline:3px solid #b76c48;outline-offset:3px}.map-label:after{content:'';position:absolute;bottom:-6px;left:50%;width:9px;height:9px;background:inherit;border-right:1px solid #b6c8aa;border-bottom:1px solid #b6c8aa;transform:translateX(-50%) rotate(45deg)}.map-label-layer[hidden]{display:none}@media(max-width:650px){.map-label{font-size:9px;max-width:92px;min-height:44px;padding:5px 7px}.map-label small{font-size:7px;letter-spacing:.35px}}`;
  host.append(mapStyle);
  for(const org of organisations){const b=document.createElement('button');b.type='button';b.className='map-label'+(org.playable?' playable':'');b.style.visibility='hidden';b.innerHTML=org.playable?'<strong>Start here ↗</strong><small>Council · Housing repairs</small>':org.short+'<small>Coming later</small>';b.setAttribute('aria-label',org.name+(org.playable?', Start here, play housing repairs':', planned scenario, not playable'));b.onclick=()=>org.playable?onEnter():onOrganisation(org.id);mapOverlay.append(b);organisationMarkers.set(org.id,b);}
  const names={sam:'Sam',priya:'Priya',nia:'Nia',ellis:'Ellis',ruth:'Ruth',mo:'Mo'};
  for(const [id,name] of Object.entries(names)) {const b=document.createElement('button');b.type='button';b.className='world-label';b.textContent=name;b.setAttribute('aria-label','Walk over and speak to '+name);b.setAttribute('aria-pressed','false');b.hidden=true;b.onclick=()=>{if(state.knownPeople&&!state.knownPeople.includes(id))return;select(id);onSelect(id);};overlay.append(b);labels.set(id,b);}
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
    if(reduced.matches&&characterClear(destination)){char.position.copy(destination);motions.delete(id);return;}
    const start=char.position.clone(), waypoints=[];
    // Indoor movement follows the clear front aisle; floor changes use the exterior stairs.
    if(start.y>2 && destination.y<2) waypoints.push(new THREE.Vector3(start.x,start.y,1),new THREE.Vector3(3.35,start.y,1),new THREE.Vector3(3.35,.38,3));
    if(start.y<2 && destination.y>2) waypoints.push(new THREE.Vector3(start.x,.38,3),new THREE.Vector3(3.35,.38,3),new THREE.Vector3(3.35,3.41,1),new THREE.Vector3(destination.x,3.41,1));
    else if(Math.abs(destination.x-start.x)>2 && destination.y>.6)waypoints.push(new THREE.Vector3(start.x,start.y,1),new THREE.Vector3(destination.x,destination.y,1));
    waypoints.push(destination.clone());motions.set(id,{points:waypoints});
  }
  function select(id) {
    if(!chars[id]||!names[id]||(state.knownPeople&&!state.knownPeople.includes(id)))return;
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
  function mapWindow(){
    if(!mobile.matches)return null;
    const origin=host.getBoundingClientRect().top;
    const top=Math.max(rail.getBoundingClientRect().bottom,caseTop.getBoundingClientRect().bottom)-origin;
    return {top,bottom:sheet.getBoundingClientRect().top-origin};
  }
  let viewOffset=null;
  function frameMap(windowBounds,w,h){
    if(!windowBounds){
      if(camera.view?.enabled)camera.clearViewOffset();
      return;
    }
    if(w===0||h===0)return;
    const offset=Math.round((h-windowBounds.top-windowBounds.bottom)/2);
    if(offset===viewOffset&&camera.view?.enabled)return;
    camera.setViewOffset(w,h,0,offset,w,h);
    viewOffset=offset;
  }
  function placeLabels(windowBounds){
    overlay.hidden=opened<.82||cameraBlend<.95;
    mapOverlay.hidden=openTarget>0||cameraBlend>.08;
    const w=host.clientWidth,h=host.clientHeight;
    const top=windowBounds?windowBounds.top+44:25,bottom=windowBounds?windowBounds.bottom-6:h;
    for(const [id,b]of labels){projected.copy(chars[id].position).add(new THREE.Vector3(0,1.5,0)).project(camera);const x=(projected.x*.5+.5)*w,y=(-projected.y*.5+.5)*h;b.style.left=x+'px';b.style.top=y+'px';b.style.visibility=projected.z>1||x<20||x>w-20||y<top||y>bottom?'hidden':'visible';}
  }
  function placeMapLabels(windowBounds){
    const w=host.clientWidth,h=host.clientHeight;if(mapOverlay.hidden)return;
    const mobileLayout=mobile.matches;
    const items=organisations.map(org=>{
      projected.set(org.x,org.playable?7.9:6,org.z).project(camera);
      const b=organisationMarkers.get(org.id);
      const width=mobileLayout?b.offsetWidth:org.playable?154:w<650?88:Math.min(142,org.short.length*6+25);
      const height=mobileLayout?b.offsetHeight:org.playable?56:45;
      return {org,b,x:(projected.x*.5+.5)*w,y:(-projected.y*.5+.5)*h,width,height};
    });
    // Keep destinations clear of the floating briefing panels.
    const bounds=host.getBoundingClientRect();
    const panels=mobileLayout?[]:[document.querySelector('.intro'),document.querySelector('.right-column')].filter(Boolean).map(el=>el.getBoundingClientRect());
    for(const item of items)for(const panel of panels){
      const left=panel.left-bounds.left,right=panel.right-bounds.left,top=panel.top-bounds.top,bottom=panel.bottom-bounds.top;
      if(item.x+item.width/2>left-12&&item.x-item.width/2<right+12&&item.y>top&&item.y-item.height<bottom+12){
        if(panel.width>w*.7)item.y=top<180?bottom+item.height+12:top-12;
        else if(left>w/2)item.x=left-item.width/2-18;
        else item.x=right+item.width/2+18;
      }
    }
    // Resolve label collisions gently, while keeping the playable council above its building.
    for(let pass=0;pass<5;pass++)for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){
      const a=items[i],b=items[j],dx=b.x-a.x,dy=b.y-a.y,overX=(a.width+b.width)/2+7-Math.abs(dx),overY=(a.height+b.height)/2+7-Math.abs(dy);
      if(overX>0&&overY>0){const shift=overY/2+1;const direction=dy>=0?1:-1;if(!a.org.playable)a.y-=shift*direction;if(!b.org.playable)b.y+=shift*direction;}
    }
    const visibleHeight=windowBounds?windowBounds.bottom-6:h;
    const visibleLabels=[];
    for(const item of items){
      item.x=Math.max(item.width/2+6,Math.min(w-item.width/2-6,item.x));
      const topLimit=windowBounds?windowBounds.top+item.height+8:108;
      item.y=Math.max(topLimit,Math.min(h-52,item.y));
      const overlaps=mobileLayout&&visibleLabels.some(other=>
        Math.abs(item.x-other.x)<(item.width+other.width)/2+6&&
        item.y>other.y-other.height-6&&other.y>item.y-item.height-6);
      const visible=item.y<=visibleHeight&&!overlaps;
      item.b.style.left=item.x+'px';
      item.b.style.top=item.y+'px';
      item.b.style.visibility=visible?'visible':'hidden';
      if(mobileLayout&&visible)visibleLabels.push(item);
    }
  }
  const zoomControls=document.createElement('div');zoomControls.className='town-zoom';zoomControls.setAttribute('role','group');zoomControls.setAttribute('aria-label','Zoom the world');const zoomLabel=document.createElement('span');zoomLabel.className='view-control-label';zoomLabel.textContent='Zoom';zoomControls.append(zoomLabel);
  for(const [label,delta,glyph]of [['Zoom out',.15,'−'],['Zoom in',-.15,'+']]){const b=document.createElement('button');b.type='button';b.textContent=glyph;b.setAttribute('aria-label',label);b.onclick=()=>{zoom=THREE.MathUtils.clamp(zoom+delta,.7,1.65);cameraPosition();};zoomControls.append(b);}document.querySelector('.view-rotate').after(zoomControls);
  let down=null,dragging=false;
  const pointerDown=e=>{if(!e.isPrimary||e.button!==0)return;down={id:e.pointerId,x:e.clientX,y:e.clientY,azimuth,elevation};dragging=false;};
  const pointerMove=e=>{
    if(down?.id!==e.pointerId)return;
    const dx=e.clientX-down.x,dy=e.clientY-down.y,touch=e.pointerType==='touch';
    if(touch&&(!mobile.matches||(!dragging&&Math.abs(dx)<=Math.abs(dy))))return;
    if(!dragging&&Math.hypot(dx,dy)<=6)return;
    dragging=true;
    azimuth=down.azimuth-dx*.006;
    if(!touch)elevation=Math.max(.35,Math.min(1.14,down.elevation+dy*.004));
    cameraPosition();
  };
  const pointerUp=e=>{if(down?.id!==e.pointerId)return;const wasDrag=dragging;down=null;if(wasDrag)return;const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);if(openTarget<1){const hits=ray.intersectObjects(organisationGroups,true);const id=hits.find(hit=>hit.object.userData.organisationId)?.object.userData.organisationId;if(id==='council')onEnter();else if(id)onOrganisation(id);return;}if(opened<.82||cameraBlend<.95)return;
    const peopleHits=ray.intersectObjects(Object.values(chars),true);if(peopleHits.length){const id=peopleHits[0].object.userData.personId;if(names[id]&&(!state.knownPeople||state.knownPeople.includes(id))){select(id);onSelect(id);return;}}
    const hits=ray.intersectObjects(drawables,true);if(hits.length){const p=hits[0].point.clone();p.y+=.04;p.x=Math.max(-9,Math.min(7,p.x));p.z=Math.max(-3,Math.min(7,p.z));moveTo('designer',p);}
  };
  renderer.domElement.addEventListener('pointerdown',pointerDown);renderer.domElement.addEventListener('pointermove',pointerMove);renderer.domElement.addEventListener('pointerup',pointerUp);
  const cancelPointer=e=>{if(down?.id===e.pointerId)down=null;};
  renderer.domElement.addEventListener('pointerleave',cancelPointer);
  renderer.domElement.addEventListener('pointercancel',cancelPointer);
  const resize=()=>{
    const w=host.clientWidth||800,h=host.clientHeight||520;
    renderer.setSize(w,h,false);
    camera.aspect=w/h;
    overviewDistance=91*Math.max(1,(mobile.matches?.86:1.03)/camera.aspect);
    closeDistance=34*Math.max(1,(mobile.matches?.98:1.05)/camera.aspect);
    viewOffset=null;
    frameMap(mapWindow(),w,h);
    cameraPosition();
    camera.updateProjectionMatrix();
  };
  const observer=new ResizeObserver(resize);observer.observe(host);resize();
  const clock=new THREE.Clock();
  renderer.setAnimationLoop(()=>{
    const dt=Math.min(.05,clock.getDelta());cameraBlend=reduced.matches?openTarget:THREE.MathUtils.damp(cameraBlend,openTarget,2.8,dt);if(Math.abs(cameraBlend-openTarget)<.001)cameraBlend=openTarget;cameraPosition();
    const revealTarget=openTarget?Math.max(0,(cameraBlend-.35)/.65):0;opened=reduced.matches?revealTarget:THREE.MathUtils.damp(opened,revealTarget,4.5,dt);
    if(Math.abs(opened-openTarget)<.001)opened=openTarget;
    roof.position.set(0,opened*2.25,-opened*3.65);roof.rotation.x=-opened*.04;roof.visible=opened<.96;
    facade.position.set(-opened*3.5,0,opened*4);facade.visible=opened<.88;
    for(const [id,motion]of motions){const c=chars[id],dest=motion.points[0];const delta=dest.clone().sub(c.position),length=delta.length();if(length<.08){if(!characterClear(dest))continue;c.position.copy(dest);motion.points.shift();if(!motion.points.length)motions.delete(id);}else{const step=Math.min(length,dt*4.2);const next=c.position.clone().addScaledVector(delta.normalize(),step);if(characterClear(next))c.position.copy(next);if(Math.abs(delta.x)+Math.abs(delta.z)>.01)c.rotation.y=Math.atan2(delta.x,delta.z);}}
    if(state.selected&&chars[state.selected]){selectedRing.visible=opened>.8;selectedRing.position.copy(chars[state.selected].position);selectedRing.position.y+=.03;}
    const windowBounds=mapWindow();
    frameMap(windowBounds,host.clientWidth,host.clientHeight);
    updateTown(dt);placeLabels(windowBounds);placeMapLabels(windowBounds);renderer.render(scene,camera);
  });
  return {
    setState(next={}){
      const beforeWorkshop=state.workshop,beforeInvited=JSON.stringify(state.invited);
      state={...state,...next};for(const [id,b]of labels)b.hidden=!!state.knownPeople&&!state.knownPeople.includes(id);openTarget=next.opened===undefined?openTarget:(next.opened?1:0);
      if(beforeWorkshop!==state.workshop||beforeInvited!==JSON.stringify(state.invited))gather();
      if(state.selected&&state.selected!==previousSelection)select(state.selected);
      if(!state.selected){previousSelection=null;selectedRing.visible=false;for(const b of labels.values())b.setAttribute('aria-pressed','false');}
      updateRoute();
    },
    select,
    rotate(dir){azimuth+=Number(dir)*.3;cameraPosition();},
    reset(){motions.clear();Object.entries(homes).forEach(([id,p])=>{chars[id].position.set(...p);chars[id].rotation.set(0,0,0);});state={step:0,selected:null,invited:[],workshop:false,flags:{},complete:false};previousSelection=null;openTarget=0;opened=0;selectedRing.visible=false;caseMarker.visible=false;for(const b of labels.values())b.setAttribute('aria-pressed','false');zoom=1;azimuth=.35;cameraBlend=0;distance=overviewDistance;elevation=.76;cameraPosition();updateRoute();},
    destroy(){dockObserver.disconnect();zoomControls.remove();motionButton.remove();reduced.removeEventListener('change',reducedChange);renderer.setAnimationLoop(null);observer.disconnect();scene.traverse(o=>{o.geometry?.dispose();const ms=Array.isArray(o.material)?o.material:[o.material];for(const m of ms){m?.map?.dispose();m?.dispose();}});renderer.dispose();overlay.remove();mapOverlay.remove();style.remove();mapStyle.remove();renderer.domElement.remove();motions.clear();}
  };
}
