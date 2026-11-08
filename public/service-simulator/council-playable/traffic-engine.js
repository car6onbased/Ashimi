// Small deterministic movement controller. Oriented footprints, swept steps and shared reservations.
const TAU=Math.PI*2;
export function overlap(a,b,padding=0){
 const dx=b.x-a.x,dz=b.z-a.z;
 if(Math.abs(dx)>a.halfWidth+a.halfLength+b.halfWidth+b.halfLength+padding||Math.abs(dz)>a.halfWidth+a.halfLength+b.halfWidth+b.halfLength+padding)return false;
 const ar={x:Math.cos(a.angle),z:-Math.sin(a.angle)},af={x:Math.sin(a.angle),z:Math.cos(a.angle)},br={x:Math.cos(b.angle),z:-Math.sin(b.angle)},bf={x:Math.sin(b.angle),z:Math.cos(b.angle)};
 for(const n of [ar,af,br,bf]){
  const r=a.halfWidth*Math.abs(ar.x*n.x+ar.z*n.z)+a.halfLength*Math.abs(af.x*n.x+af.z*n.z)+b.halfWidth*Math.abs(br.x*n.x+br.z*n.z)+b.halfLength*Math.abs(bf.x*n.x+bf.z*n.z)+padding;
  if(Math.abs(dx*n.x+dz*n.z)>=r)return false;
 }
 return true;
}
export class TrafficEngine{
 constructor(obstacles=[]){this.obstacles=obstacles;this.cars=[];this.walkers=[];this.externalPeople=[];this.time=0;this.stats={carStops:0,pedestrianStops:0,buildingStops:0,brakingSteps:0,roundaboutYields:0};}
 body(agent,distance=agent.distance){if(distance===agent.distance&&agent.pose)return agent.pose;return {...agent.path.sample(distance),halfWidth:agent.halfWidth,halfLength:agent.halfLength,id:agent.id};}
 blocked(body,agent,{cars=true,people=true,staticOnly=false,padding=.12}={}){
  for(const obstacle of this.obstacles)if(overlap(body,obstacle,padding))return 'building';
  if(staticOnly)return null;
  if(cars)for(const car of this.cars)if(car!==agent&&car.active&&overlap(body,this.body(car),padding))return 'car';
  if(people){for(const person of this.walkers)if(person!==agent&&person.active&&overlap(body,this.body(person),padding))return 'pedestrian';for(const p of this.externalPeople)if(overlap(body,p,padding))return 'pedestrian';}
  return null;
 }
 add({id,path,phase=0,speed=2.4,kind='car',priority=1,loop=true,junction=null}){
  const a={id,path,distance:phase*path.length,speed:0,targetSpeed:speed,halfWidth:kind==='car'?.64:.3,halfLength:kind==='car'?1.13:.3,kind,priority,loop,junction,travelled:0,active:false,wait:0};
  // Spawn into a clear reservation, never into another vehicle or pedestrian.
  for(let i=0;i<Math.ceil(path.length/.35);i++){const d=(phase*path.length+i*.35)%path.length;if(!this.blocked(this.body(a,d),a)){a.distance=d;a.active=true;break;}}
  a.pose=this.body(a);(kind==='car'?this.cars:this.walkers).push(a);return a;
 }
 canTravel(a,to,options={}){
  const from=a.distance,steps=Math.max(1,Math.ceil(Math.abs(to-from)/.08));
  for(let i=1;i<=steps;i++){const reason=this.blocked(this.body(a,from+(to-from)*i/steps),a,options);if(reason)return reason;}
  return null;
 }
 tick(dt,{paused=false,people=[]}={}){
  this.externalPeople=people;
  if(paused)return;
  let remaining=Math.min(Math.max(dt,0),.5);
  while(remaining>1e-8){const h=Math.min(.04,remaining);this.advance(h);remaining-=h;}
 }
 advance(dt){
  this.time+=dt;
  // Pedestrians cannot step into a vehicle already occupying the crossing.
  for(const w of this.walkers){if(!w.active)continue;const next=w.distance+w.targetSpeed*dt,reason=this.canTravel(w,next,{people:false,padding:.16});if(!reason){w.distance=next;w.pose=null;w.pose=this.body(w);w.travelled+=w.targetSpeed*dt;}else this.stats.pedestrianStops++;}
  // Roundabout traffic reserves its next position first; joining traffic must wait for space.
  const ordered=this.cars.slice().sort((a,b)=>a.priority-b.priority||a.id.localeCompare(b.id));
  for(const car of ordered){
   if(!car.active)continue;
   let target=car.targetSpeed;
   const horizon=1.4+car.speed*car.speed/(2*3.5);
   for(let d=.25;d<=horizon+car.targetSpeed*.35;d+=.25){if(this.blocked(this.body(car,car.distance+d),car,{padding:.2})){target=Math.min(target,Math.sqrt(2*3.5*Math.max(0,d-1.4)));break;}}
   // Joining cars wait outside the circular carriageway for a gap to their right.
   const here=this.body(car),radius=Math.hypot(here.x-4,here.z-13);
   if(car.junction!==null&&radius>9.2){
    let gate=Infinity;
    for(let d=.2;d<=5;d+=.2){const p=car.path.sample(car.distance+d);if(Math.hypot(p.x-4,p.z-13)<9.2){gate=d;break;}}
    if(gate<Infinity){
     const conflict=this.cars.some(other=>{if(other===car||!other.active)return false;const p=this.body(other),r=Math.hypot(p.x-4,p.z-13),angle=Math.atan2(p.z-13,p.x-4),ahead=((car.junction-angle)%TAU+TAU)%TAU;return r<8.5&&(ahead<1.2||ahead>TAU-.65);});
     if(conflict){target=Math.min(target,Math.sqrt(2*3.5*Math.max(0,gate-.3)));this.stats.roundaboutYields++;}
    }
   }
   if(target<car.targetSpeed)this.stats.brakingSteps++;
   const change=(target>car.speed?1.1:3.5)*dt;
   car.speed+=Math.max(-change,Math.min(change,target-car.speed));
   const amount=car.speed*dt,next=car.distance+amount,reason=this.canTravel(car,next);
   if(reason){car.speed=0;car.wait+=dt;this.stats[reason==='car'?'carStops':reason==='pedestrian'?'pedestrianStops':'buildingStops']++;}
   else{car.distance=next;car.pose=null;car.pose=this.body(car);car.travelled+=amount;car.wait=0;}
  }
 }
}
