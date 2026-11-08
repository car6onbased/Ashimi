import * as THREE from '../../council-interactive/three.module.js';
export const roadPoints=[
 Array.from({length:32},(_,i)=>[4+Math.cos(i*Math.PI/16)*5.3,13+Math.sin(i*Math.PI/16)*5.3]),
 [[-42,-11],[-24,-11],[-13,-11],[-12,2],[-10,10],[-1,13]],
 [[9,13],[16,10],[17,0],[18,-10],[31,-12],[43,-9]],
 [[4,18.3],[6,24],[14,28],[29,28],[42,25]],
 [[-12,6],[-7,5.6],[0,5.6],[5,5.6],[10,9],[9,13]]
];
export const houseSites=[[-27,30],[-19,33],[-10,34],[1,34],[31,7],[31,16],[30,-25],[-35,-24]];
export function roadCurve(points,closed=false){return new THREE.CatmullRomCurve3(points.map(([x,z])=>new THREE.Vector3(x,.3,z)),closed,'centripetal');}
export function circulatingRoute(source,junctionAngle,fromOutside){
 const points=[];
 const sample=(t,lane)=>{const p=source.getPointAt(t),v=source.getTangentAt(t);return p.addScaledVector(new THREE.Vector3(-v.z,0,v.x).normalize(),lane);};
 const inboundLane=fromOutside?-.85:.85;
 for(let i=0;i<=65;i++)points.push(sample(fromOutside?i/65:1-i/65,inboundLane));
 for(let i=0;i<=90;i++){const a=junctionAngle+.23+i/90*(Math.PI*2-.46);points.push(new THREE.Vector3(4+Math.cos(a)*6.02,.3,13+Math.sin(a)*6.02));}
 for(let i=0;i<=65;i++)points.push(sample(fromOutside?1-i/65:i/65,-inboundLane));
 // A wide turning head keeps the return manoeuvre separate from the opposing lane.
 const at=source.getPointAt(fromOutside?0:1),v=source.getTangentAt(fromOutside?0:1).multiplyScalar(fromOutside?-1:1),n=new THREE.Vector3(-v.z,0,v.x).normalize();
 for(const [forward,side]of [[2,-2],[5,-2.5],[7,0],[5,2.5],[2,2]])points.push(at.clone().addScaledVector(v,forward).addScaledVector(n,side));
 return new THREE.CatmullRomCurve3(points,true,'centripetal');
}
export function pathForCurve(curve,lane=0,direction=1){
 const length=curve.getLength();
 return {length,sample(distance){const t=((distance/length)%1+1)%1,p=curve.getPointAt(t),v=curve.getTangentAt(t),n=new THREE.Vector3(-v.z,0,v.x).normalize();p.addScaledVector(n,lane);return {x:p.x,z:p.z,angle:Math.atan2(v.x*direction,v.z*direction)};}};
}
export function buildingObstacles(organisations){
 const rect=(id,x,z,width,length,angle=0)=>({id,kind:'building',x,z,halfWidth:width/2,halfLength:length/2,angle});
 return [rect('council',-2.1,-1.8,10.4,6.9),rect('council-steps',-2.1,2.5,3,1.4),rect('resident-home',6.1,-3.7,2.9,2.7),
 ...organisations.filter(o=>!o.playable).map(o=>rect(o.id,o.x,o.z,o.kind==='ecommerce'?9:o.kind==='grocery'?8:o.kind==='restaurant'?5.2:7,o.kind==='ecommerce'?6.8:o.kind==='environment'?5.8:5.6)),
 ...houseSites.map(([x,z],i)=>rect('house-'+i,x,z,3.9,3.8)),
 rect('bank-portico',-21,3.55,7.5,1.5),rect('greenhouse',-8,-16.4,3.2,2),rect('parked-repairs-van',-7.8,3.2,3.5,1.5,-.15),rect('parked-ambulance',17.7,-19,3.5,1.3)];
}
export function pathForWalk(curve,lane){
 const total=curve.getLength();
 // Pavements turn back before the roundabout conflict zone, rather than crossing its lanes.
 const start=5,end=total-5,span=end-start;
 return {length:span*2,sample(distance){const d=((distance%(span*2))+span*2)%(span*2),forward=d<span,t=(start+(forward?d:span*2-d))/total,p=curve.getPointAt(t),v=curve.getTangentAt(t);p.addScaledVector(new THREE.Vector3(-v.z,0,v.x).normalize(),lane);return {x:p.x,z:p.z,angle:Math.atan2(v.x*(forward?1:-1),v.z*(forward?1:-1))};}};
}

export const townOrganisations = [
    {id:'council',name:'Council',short:'Council',x:-2.1,z:-1.8,playable:true},
    {id:'bank',shortCase:true,name:'Banking',short:'Bank',x:-21,z:0,kind:'bank',colour:0xe7d8b8},
    {id:'consular',name:'International government',short:'Consular',x:-25,z:-19,kind:'consular',colour:0xd9d8bf},
    {id:'environment',name:'Environment & rural',short:'Environment',x:-7,z:-21,kind:'environment',colour:0x9eb49b},
    {id:'health',name:'Health',short:'Health',x:13,z:-21,kind:'health',colour:0xf0e6d2},
    {id:'apprenticeships',shortCase:true,name:'Apprenticeships',short:'Apprenticeships',x:24,z:-4,kind:'apprenticeships',colour:0xd9b18d},
    {id:'education',name:'Teaching & education',short:'Education',x:20,z:17,kind:'education',colour:0xd5b69a},
    {id:'restaurant',name:'Restaurant',short:'Restaurant',x:-3,z:22,kind:'restaurant',colour:0xe7bd92},
    {id:'ecommerce',name:'E-commerce',short:'E-commerce',x:-18,z:21,kind:'ecommerce',colour:0xe3d9c7},
    {id:'grocery',name:'Grocery & retail',short:'Retail',x:-32,z:16,kind:'grocery',colour:0xd9e0bb},
    {id:'games',name:'Games company',short:'Games',x:-33,z:-4,kind:'games',colour:0x92abb0}
  ];
