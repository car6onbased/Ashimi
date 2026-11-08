import {people, initialState, choose, steps, talk, getSummary, resourceDependencies} from './scenario.js';

// All commissions, budgets, documents and outcomes below are authored fiction.
export const entries = [
  {id:'discovery',name:'Discovery',title:'Shape the brief',subtitle:'A commission, before the answers',
    reason:'It is your first day at Northborough. Sam, the sponsor who commissioned the assignment, is expecting you. Start by finding out what you have been brought in to do.',
    inherited:['An introductory meeting with Sam, your sponsor.'],
    unknowns:['What the commission is intended to achieve.','Who is responsible for the different parts of the service.','Who can contribute, and what evidence and resources are available.'],
    budget:6000,days:2,time:'Two weeks for discovery; Friday is an evidence checkpoint, not a launch date.',
    authority:'Sam controls the discovery allowance. Priya allocates staff time. Any operational trial needs the receiving, technical, supplier and access owners.',
    scope:'Meet your sponsor. Establish the commission and decide whom to approach next.',coreStart:1},
  {id:'alpha',name:'Alpha',title:'Pick up an alpha',subtitle:'An alpha in progress, a personal handover still to do.',
    reason:'You are joining an alpha already in progress. Sam has asked you to pick up the service design work. Meet him to understand the assignment and arrange a handover.',
    inherited:['An invitation to meet Sam about an alpha in progress.'],
    unknowns:['Who has been doing the work and who can help you.','What research, prototypes and decisions you are inheriting.','What remains untested and what you are authorised to do next.'],
    budget:5000,days:2,time:'Ten working days to recommend the next experiment; beta funding is not approved.',
    authority:'Sam can fund a prototype rehearsal. Priya, Ellis, Ruth and Mo must agree the people, records and contact route used. No live-service rollout is authorised.',
    scope:'Prototype and handoff rehearsal only. The existing live service remains unchanged.',coreStart:3},
  {id:'beta',name:'Beta',title:'Join a private beta',subtitle:'A pilot is running. Establish what you are taking over.',
    reason:'You are joining a service in private beta. Sam has asked you to take over the service design work. Meet him to understand the pilot, the handover and who is involved.',
    inherited:['An invitation to meet Sam about a private beta in progress.'],
    unknowns:['Who is delivering and supporting the pilot.','What has been released, tested or promised.','Which decisions, unresolved work and evidence you are taking over.'],
    budget:4000,days:2,time:'Five working days until the release review. Wider rollout remains a decision, not a fixed entitlement.',
    authority:'Sam can fund a limited pilot adjustment. Expansion needs an explicit release decision and support commitment from the responsible owners.',
    scope:'One bounded pilot case. A successful case does not authorise public rollout.',coreStart:3},
  {id:'live',name:'Live / BAU',title:'Join a live service',subtitle:'Find the people, service history and current commitments.',
    reason:'You are joining an established repairs service. Sam has asked you to help with its next improvement. Start with him, then find the people and service history you need to understand the work.',
    inherited:['An invitation to meet Sam about an operating service.'],
    unknowns:['Who runs the service and owns its current commitments.','What service history, performance evidence and open work exist.','What needs attention now and what improvement capacity is available.'],
    budget:3000,days:1,time:'A ten-day improvement window, alongside the normal service.',
    authority:'Priya can allocate one analyst day. Sam controls the improvement allowance. Existing service and incident responsibilities stay with their named owners.',
    scope:'A reversible improvement to one handoff, with live operations protected. BAU is a live context.',coreStart:3}
];

const option=(id,label,detail,effect)=>({id,label,detail,...effect});
const plan=(cost,days)=>({cost,days});
export const entrySteps = {
  discovery:[
    {id:'commission',title:'Question the commission',question:'What do you agree to find out before promising a solution?',context:'The app request is an assumption. There is enough information to start a brief, but not enough to commit to delivery.',people:['sam','priya'],options:[
      option('outcome','Frame the resident outcome','Investigate chasing across phone and online routes; make Friday an evidence checkpoint.',{framed:true}),
      option('promise','Commit to the app','Treat a preferred solution as the brief before establishing the problem.',{appPromise:true})]},
    {id:'resources',title:'Establish room to manoeuvre',question:'What do you ask the available money and people to support?',context:'Ask Sam, Priya and Ellis about funding, usable capacity and current tools. An allowance is not permission to promise more staff or a replacement system.',people:['sam','priya','ellis'],options:[
      option('bounded','Bound the investigation and test','Plan £2,000 and one analyst day. Keep other funding and delivery dates conditional.',{plan:plan(2000,1)}),
      option('stretch','Promise a replacement platform','Assume £12,000 and six analyst days can be found within the current commission.',{plan:plan(12000,6)})]},
    {id:'brief',title:'Agree a working brief',question:'What leaves your kickoff as the commission?',context:'Invite Sam, Priya and Mo for the kickoff, or collect their decisions in writing. Keep assumptions, access requests and decision boundaries visible.',people:['sam','priya','mo'],options:[
      option('living','Record a brief that can change','Name questions, evidence gaps, owners and a review point. Investigate the current service next.',{brief:true}),
      option('fixed','Freeze the requested solution','Treat the app and the current scope as settled requirements.',{appPromise:true}),
      option('stop','Return the commission for a decision','Record what remains unknown and stop before further spending.',{stop:true})]}
  ],
  alpha:[
    {id:'inherit',title:'Examine the inherited evidence',question:'How do you approach the previous team’s research and blueprint?',context:'You do not need to repeat discovery from the beginning. You do need to know which claims support the proposed prototype. Ask Nia for the supplied resident account and Ellis/Mo about the handoff.',people:['nia','ellis','mo'],options:[
      option('audit','Check the consequential assumptions','Target the missing evidence and preserve findings that still hold.',{audit:true}),
      option('accept','Treat the prototype as validation','Assume the existing screens prove the whole service works.',{unchecked:true})]},
    {id:'experiment',title:'Choose what alpha should prove',question:'What experiment is worth the remaining alpha allowance?',context:'Internal screen reviews have not established whether completion data or an update owner will reach the resident.',people:['sam','ruth','priya'],options:[
      option('handoff','Rehearse the end-to-end handoff','Use £2,500 and one analyst day to compare the record, owner and phone fallback.',{plan:plan(2500,1),brief:true}),
      option('screens','Invest in a polished app demonstration','Commit £8,000 and four analyst days without additional funding.',{plan:plan(8000,4),appPromise:true}),
      option('stop','Stop at alpha and record the gaps','Do not recommend progression until the unresolved evidence has an owner.',{stop:true})]}
  ],
  beta:[
    {id:'pilot',title:'Check pilot readiness',question:'What does the announced wider release actually rest on?',context:'An earlier blueprint is available. The pilot’s support and assisted-route evidence still need examination. Ask Nia, Ellis and Mo what was observed, rather than treating the release note as a finding.',people:['nia','ellis','mo'],options:[
      option('audit','Review the pilot and its exceptions','Check the supplied findings and keep the release decision open.',{audit:true}),
      option('announce','Accept the release announcement','Treat a planned date as evidence of operational readiness.',{unchecked:true})]},
    {id:'release',title:'Bound the beta decision',question:'What do you recommend before the release review?',context:'Only a limited pilot adjustment is funded. Existing support must remain usable while the handoff is tested.',people:['sam','priya','ruth'],options:[
      option('limited','Keep the pilot bounded and test the gap','Use £3,000 and two analyst days; require further evidence before expansion.',{plan:plan(3000,2),brief:true}),
      option('expand','Promise public rollout now','Commit £10,000 and five analyst days before support or funding is agreed.',{plan:plan(10000,5),expansion:true}),
      option('hold','Hold expansion and return a clear decision','Preserve the current pilot and record the missing release evidence.',{stop:true})]}
  ],
  live:[
    {id:'operations',title:'Separate incident and improvement',question:'How do you respond to the urgent visit and recurring chase calls?',context:'Mo owns the urgent visit. Priya has limited improvement capacity. An old blueprint is a starting point, not proof that the diagnosis still holds.',people:['mo','priya','nia'],options:[
      option('protect','Protect operations and check the old diagnosis','Keep the incident with its owner and investigate the recurring failure through targeted evidence.',{audit:true}),
      option('absorb','Promise to fix everything together','Take on incident recovery and redesign without checking capacity.',{unchecked:true,overloaded:true})]},
    {id:'improvement',title:'Agree a maintainable change',question:'Which improvement can the service actually support?',context:'The £3,000 allowance and one analyst day do not fund a replacement platform. A sustained update needs a receiving owner and a next check.',people:['sam','priya','ellis','ruth'],options:[
      option('small','Test a reversible handoff change','Use £2,000 and one analyst day, keeping the running service and contact routes available.',{plan:plan(2000,1),brief:true}),
      option('rebuild','Promise a complete rebuild','Commit £15,000 and ten analyst days while absorbing the incident.',{plan:plan(15000,10),appPromise:true}),
      option('stop','Defer the change with a named return condition','Keep the service running. Return at the next capacity review with the unresolved evidence.',{stop:true})]}
  ]
};

export function createEntryState(id='discovery') {
  const entry=entries.find(e=>e.id===id);if(!entry)throw new Error('Unknown entry point: '+id);
  const s=initialState();s.step=entry.coreStart;
  s.entry={id,cursor:0,phase:'arrival',decisions:[],facts:[],plan:null,brief:false,audited:false,stopped:false,budget:entry.budget,days:entry.days,knownPeople:['sam'],context:[],referrals:[],documents:[],documentReceipts:[],checks:[],handoverGaps:[]};
  // A later lifecycle stage does not imply a completed personal handover.
  return s;
}
export const isDiscovery=s=>s.entry?.id==='discovery';
export const isOnboarding=s=>!!s.entry;
export const knownPeople=s=>people.filter(p=>!isOnboarding(s)||(s.entry.knownPeople||['sam']).includes(p.id));
export const canSpeakTo=(s,id)=>knownPeople(s).some(p=>p.id===id);
export const canInspectService=s=>!isOnboarding(s)||(knownPeople(s).length===people.length&&['resident','systems','handoff'].every(id=>s.entry.facts.includes(id))&&(isDiscovery(s)||s.entry.documents.length>0));
export function redactUnknown(s,text){
  if(!isOnboarding(s))return String(text??'');
  const roles={priya:'the housing lead',nia:'a contact adviser',ellis:'the technology lead',ruth:'the policy and access lead',mo:'the contractor lead'};
  let result=String(text??'');
  for(const person of people)if(!canSpeakTo(s,person.id))result=result.replace(new RegExp('\\b'+person.name+'\\b','g'),roles[person.id]||'a service contact');
  return result;
}
export function meetPerson(previous,id){
  if(!canSpeakTo(previous,id))throw new Error('This contact has not been introduced. Ask a known contact who is responsible.');
  const s=JSON.parse(JSON.stringify(previous));s.visited=[...new Set([...s.visited,id])];return s;
}
export function contactQuestions(s,person){
  if(!isOnboarding(s)||!canSpeakTo(s,person))return [];
  const entry=getEntry(s);
  const purposes={discovery:'I commissioned this work because residents keep chasing housing repairs. The committee has asked for an app, but we have not established the cause. I have allowed two weeks for discovery, with an evidence checkpoint on Friday, not an assumed launch. Start by understanding the service and who delivers it.',alpha:'You are taking over service design in alpha. The previous team explored a repair-status screen. I need a recommendation about the next experiment in ten working days; beta funding is not approved. Start by meeting the relevant people and asking for the research, prototype and decision history.',beta:'You are taking over service design for a private-beta pilot. There is a release review in five working days. A wider release has been discussed, but you need to establish what the pilot and support evidence actually justify. Arrange the handover with the people who have done the work.',live:'You are joining the running repairs service to help with improvement. The service has existing commitments and a limited ten-day improvement window. Establish the service history, current priorities and responsible people before accepting a new change commitment.'};
  const named={
    sam:[
      {id:'purpose',label:isDiscovery(s)?'What have I been brought in to understand?':'What am I joining, and what do you need from me?',answer:purposes[entry.id],context:'commission'},
      {id:'operations',label:'Who is responsible for running the repairs service?',answer:'Priya leads housing operations. Ask her about the work, the people who deliver it and what time they can actually contribute. An introduction does not allocate her team to your project.',introduces:['priya']},
      {id:'technology',label:'Who can explain the systems and data?',answer:'Ellis leads technology for this service. Ask what the current tools do and what evidence is available before proposing another platform.',introduces:['ellis']},
      {id:'policy',label:'Who can explain policy, service promises and access?',answer:'Ruth advises on policy and access. She can help distinguish service commitments from assumptions and explain who else needs to be involved.',introduces:['ruth']}
    ],
    priya:[
      {id:'frontline',label:'Who handles resident contacts day to day?',answer:'Nia is a contact adviser. She sees the chasing and workarounds. Ask for a short private conversation and agree how her contribution will be used.',introduces:['nia']},
      {id:'supplier',label:'Who owns the contractor relationship and repair visits?',answer:'Mo leads the repairs contractor. He is a supplier contact, not an automatically allocated member of your project team. Agree access and commitments with him.',introduces:['mo']},
      {id:'access',label:'Who should help with policy and assisted routes?',answer:'Ruth can explain the policy and access requirements. Involve her before assuming one contact channel will work for everyone.',introduces:['ruth']}
    ],
    ellis:[
      {id:'supplier',label:'Who can check the other side of the data handoff?',answer:'Mo holds the contractor-side records. Compare them with the council record together rather than assuming the boundary works.',introduces:['mo']},
      {id:'frontline',label:'Who uses these records to answer residents?',answer:'Nia uses the council record during resident contacts. Ask her what is visible and what she has to check manually.',introduces:['nia']},
      {id:'operations',label:'Who can accept changes to the receiving process?',answer:'Priya leads the receiving operation. Technical agreement cannot commit her team to new work.',introduces:['priya']}
    ],
    nia:[
      {id:'operations',label:'Who decides how your team works?',answer:'Priya leads housing operations and allocates staff time. She needs to agree any new responsibility.',introduces:['priya']},
      {id:'technology',label:'Who can help investigate what the records show?',answer:'Ellis can explain the council system and compare its records with the supplier.',introduces:['ellis']},
      {id:'supplier',label:'Who do you contact when a repair status is unclear?',answer:'Mo is our contractor lead. He can check the repair record on the supplier side.',introduces:['mo']}
    ],
    mo:[
      {id:'technology',label:'Who can check what reaches the council system?',answer:'Ellis can compare the receiving record with our completion export.',introduces:['ellis']},
      {id:'operations',label:'Who should accept the council-side work?',answer:'Priya leads housing operations. A supplier commitment does not allocate the council-side work.',introduces:['priya']}
    ],
    ruth:[
      {id:'frontline',label:'Who understands the supported contact routes?',answer:'Nia can arrange the supplied resident phone account and explain current adviser practice.',introduces:['nia']},
      {id:'operations',label:'Who can authorise the operational contact arrangement?',answer:'Priya leads housing operations. Ask what her team can accept and what needs escalating.',introduces:['priya']}
    ]
  };
  if(!isDiscovery(s)){
    const history={
      alpha:{answer:'The inherited approval cover says residents validated the status prototype and phone fallback. I do not have its linked test report. Ask for the supporting records before relying on that claim.',documents:[2]},
      beta:{answer:'The release cover says support and assisted contact were signed off. The linked sign-off record is not in this pack. Check what the relevant owners actually accepted before carrying that statement forward.',documents:[0]},
      live:{answer:'A service-review note raises missing updates and repeat chasing as a theme, without a verified rate. Ask the operational lead what work and urgent commitments are open, then speak to the people who handle the cases.',documents:[0]}
    }[entry.id];
    if(person==='sam')named.sam.splice(1,0,{id:'history',label:'What work and decisions am I inheriting?',...history});
    const materials={
      alpha:{priya:{answer:'The earlier direction was a status screen. I can explain the operational assumptions, but you need to meet the people who supplied the evidence and test whether the direction is still supported.',documents:[2]},ellis:{answer:'Here is the inherited screen concept. It has been reviewed internally. Walk through the assumptions about incoming data, the receiving team and contact routes before treating the screen as evidence of an end-to-end service.',documents:[1]},nia:{answer:'Here is the earlier research summary. I can walk through the supplied resident account and what it cannot establish. Read it before deciding whether the previous team’s conclusions still hold.',documents:[0]}},
      beta:{priya:{answer:'Here is the draft pilot support arrangement. I can explain who needs to accept the rota and receiving responsibilities, what remains open and which changes have not been agreed.',documents:[1]},ellis:{answer:'Here is the supplied pilot case pack. Check the technical and receiving records with their owners; a single case cannot establish readiness for wider use.',documents:[2]},nia:{answer:'Here is the inherited pilot evidence for H104. I can explain the resident and adviser account. Distinguish what happened in this case from a claim about the whole pilot.',documents:[2]}},
      live:{priya:{answer:'Here is the current-priorities note. An urgent missed visit and improvement work compete for time. Identify the incident owner and confirm the capacity before taking on additional work.',documents:[2]},ellis:{answer:'Here is the inherited supplier/council boundary note. Establish what the systems and people do today rather than assuming the earlier description is still current.',documents:[1]},mo:{answer:'Here is the existing boundary note. I can explain the supplier-side work and the urgent visit. An earlier agreement does not commit my team to a new change.',documents:[1]},nia:{answer:'Here is the service-review note. It reports a complaints theme rather than a measured service-wide rate. I can help you trace an actual contact and identify what further evidence is needed.',documents:[0]}}
    }[entry.id];
    if(materials[person])named[person].unshift({id:'handover',label:entry.id==='alpha'&&person==='ellis'?'Can you walk me through the prototype I am inheriting?':entry.id==='alpha'&&person==='nia'?'Can you hand over the research and its limitations?':'What work, evidence and open commitments are you handing over?',...materials[person]});
    named.sam=named.sam.map(q=>q.id==='operations'?{...q,label:'Who can explain the team and arrange the operational handover?'}:q);
  }
  const followups=investigationQuestions(s,person);
  if(followups.length)named[person]=[...followups,...(named[person]||[])];
  return (named[person]||[]).filter(q=>q.id==='purpose'||(s.entry.context||[]).includes('commission')).map(q=>({...q,heard:(s.entry.context||[]).includes(person+':'+q.id)}));
}
export function askContact(previous,person,id){
  if(!previous.visited.includes(person))throw new Error('Speak with this contact before asking for an introduction.');
  const q=contactQuestions(previous,person).find(q=>q.id===id);if(!q)throw new Error('This introduction is not available from this contact.');
  const s=JSON.parse(JSON.stringify(previous)),key=person+':'+id;
  if(!s.entry.context.includes(key)){
    s.entry.context.push(key);if(q.context)s.entry.context.push(q.context);
    if(q.check&&!s.entry.checks.includes(q.check))s.entry.checks.push(q.check);
    for(const document of q.documents||[])if(!s.entry.documents.includes(document)){s.entry.documents.push(document);s.entry.documentReceipts.push({document,from:person});}
    for(const target of q.introduces||[])if(!s.entry.knownPeople.includes(target)){
      s.entry.knownPeople.push(target);s.entry.referrals.push({from:person,to:target,question:id,reason:q.answer});
    }
    s.evidence.push(people.find(p=>p.id===person).name+' said: '+redactUnknown(s,q.answer));
  }
  s.entry.lastQuestion='contact:'+person+':'+id;
  s.entry.handoverGaps=handoverIssues(s).filter(issue=>!issue.clarified).map(issue=>issue.gate);
  return s;
}
export function arrivalRequirements(s){
  if(!isOnboarding(s)||!isArrival(s))return [];
  if(!s.entry.context.includes('commission'))return ['Meet Sam and establish the assignment before making a decision.'];
  const missing=[];
  if(!isDiscovery(s)){
    const required={alpha:[[0,'Find a research contact and ask for the research handover.'],[1,'Find the technical lead and walk through the inherited prototype.']],beta:[[0,'Ask the sponsor for the release and decision history.'],[1,'Find the operational lead and review the pilot support handover.']],live:[[0,'Ask for the service history and performance context.'],[2,'Find the operational lead and establish current priorities and open commitments.']]}[s.entry.id];
    for(const [id,text] of required)if(!s.entry.documents.includes(id))missing.push(text);
  }
  if(s.entry.cursor===1)missing.push(...['funding','capacity','systems'].filter(id=>!s.entry.facts.includes(id)).map(id=>({funding:'Establish the available funding with the sponsor.',capacity:'Find the operational lead and establish usable staff capacity.',systems:'Find a technical contact and establish the available tools and data.'})[id]));
  return missing;
}

export const getEntry=s=>entries.find(e=>e.id===s.entry?.id)||entries[0];
export function arrivalDocuments(s){
  const entry=getEntry(s);
  const documents={
    discovery:[
      {title:'Sponsor’s initial request',type:'Commission note',status:'Assumption to examine',body:'“Show the committee an app by Friday.” The request does not establish that an app will stop chase calls. The intended outcome, service boundary and delivery commitment need agreement.'},
      {title:'Initial resource envelope',type:'Planning note',status:'Confirm with the owners',body:`Up to £${entry.budget.toLocaleString('en-GB')} and ${entry.days} analyst days are proposed for the bounded work. Sam controls the allowance; Priya allocates staff. There is no approved replacement-platform budget.`},
      {title:'First evidence request',type:'Investigation list',status:'Open questions',body:'Seek the public promise, actual case correspondence, applicable agreements, contractor completion record, council receiving record, supported resident account and the owner of the resident update. Compare definitions before comparing service performance.'}
    ],
    alpha:[
      {title:'Research summary v0.2',type:'Inherited research',status:'One case, revalidation needed',body:'This summary describes one resident phone interview about chasing a repair. No prototype task or assisted-route test is recorded. The participant/session index and original recording link are missing from the handover. It cannot support a claim that residents validated the prototype.'},
      {title:'Repair-status prototype v0.2',type:'Inherited screen concept',status:'Reviewed internally only',body:'The screen says “Repair complete”. The demonstration used authored status data and an internal review. No resident session or phone-fallback result is attached. The concept assumes completion data arrives and someone owns the outbound update.',prototype:true},
      {title:'Alpha decision log',type:'Inherited decision',status:'Direction still open',body:'The approval cover says: “Residents validated the status prototype and phone fallback; ready to progress.” Its test-report link is empty, with no session list or approval signature. The cover and the supporting research/demo notes may describe different activities.'}
    ],
    beta:[
      {title:'Private-beta release note',type:'Inherited release claim',status:'Readiness not established',body:'The release cover says: “Support rota and assisted contact signed off; ready for wider release.” The linked sign-off record is missing. A planned release date and this cover statement are not evidence that the receiving owners accepted the work.'},
      {title:'Pilot scope and support draft',type:'Operating arrangement',status:'Owner acceptance needed',body:'This rota is labelled DRAFT. Acceptance names and dates are blank, and phone-update cover has not been allocated for expansion. It says the receiving owners still need to agree the arrangement, despite the release cover claiming sign-off.'},
      {title:'H104 pilot evidence',type:'Case pack',status:'Bounded case, not rollout evidence',body:'The resident account and draft blueprint identify separate information and responsibility failures. Recheck them with Nia, Ellis and Mo. One corrected pilot case cannot establish that public rollout is ready.'}
    ],
    live:[
      {title:'Service-review note',type:'Operational signal',status:'Rate and scale unknown',body:'Chase calls about missing updates have been raised as a complaints theme. The supplied material does not establish a service-wide rate or trend. Use H104 to investigate the mechanism, then identify what wider evidence is needed.'},
      {title:'Supplier and council boundary',type:'Existing arrangement',status:'Commitment needs checking',body:'The supplier note labels a repaired job “closed” and assumes the council will send the resident update. No receiving acceptance is attached. It does not define whether closed means the physical repair, an accepted completion record or contact with the resident.'},
      {title:'Incident and improvement note',type:'Capacity conflict',status:'Separate responsibilities',body:'Mo is dealing with an urgent missed visit. An old council action sheet assigns the resident update to the contractor, while the supplier note assigns it to the council. The acceptance owner/date are blank. Priya can allocate one analyst day to improvement; this is not acceptance of a new update duty.'}
    ]
  };
  if(isDiscovery(s))return documents.discovery.filter((d,i)=>i===0?s.entry.context.includes('commission'):i===1?s.entry.facts.includes('funding'):s.entry.brief).map(d=>({...d,body:redactUnknown(s,d.body)}));
  return documents[entry.id].flatMap((d,i)=>s.entry.documents.includes(i)?[{...d,body:redactUnknown(s,d.body),providedBy:people.find(p=>p.id===s.entry.documentReceipts.find(receipt=>receipt.document===i)?.from)?.name||'A known contact'}]:[]);
}
export const isArrival=s=>s.entry?.phase==='arrival'&&!s.complete;
export function activeStep(s){
  if(isArrival(s)){const def=entrySteps[s.entry.id][s.entry.cursor];return isOnboarding(s)?{...def,context:redactUnknown(s,def.context),people:def.people.filter(id=>canSpeakTo(s,id)),options:def.options.map(o=>({...o,detail:redactUnknown(s,o.detail)}))}:def;}
  const def=steps[s.step];if(!def)return def;
  if(s.entry.id==='alpha')return {...def,title:def.id==='delivery'?'Choose the rehearsal':def.title,context:'Alpha rehearsal only. No live-service change is authorised. '+redactUnknown(s,def.context),options:def.options.map(o=>({...o,detail:redactUnknown(s,o.detail)}))};
  if(s.entry.id==='beta')return {...def,context:'Bounded private-beta pilot. This decision cannot authorise public rollout. '+redactUnknown(s,def.context),options:def.options.map(o=>({...o,detail:redactUnknown(s,o.detail)}))};
  return isOnboarding(s)?{...def,context:redactUnknown(s,def.context),options:def.options.map(o=>({...o,detail:redactUnknown(s,o.detail)}))}:def;
}
export function progressSteps(s){return [...entrySteps[getEntry(s).id],...steps.slice(getEntry(s).coreStart)];}
export function progressIndex(s){return s.entry.stopped?s.entry.cursor:isArrival(s)?s.entry.cursor:s.complete?progressSteps(s).length:entrySteps[getEntry(s).id].length+s.step-getEntry(s).coreStart;}

export function chooseEntry(previous,id){
  if(previous.complete)return previous;
  if(!isArrival(previous)){
    const next=choose(previous,id);
    const latest=next.history.at(-1);
    if(isOnboarding(next)){for(const field of ['title','choice','response','immediate','later'])latest[field]=redactUnknown(next,latest[field]);next.evidence=next.evidence.map(text=>redactUnknown(next,text));}
    if(previous.entry.id==='alpha'){
      const record=next.history.at(-1);
      record.response='In the alpha rehearsal: '+record.response;
      record.immediate='Prototype rehearsal only. '+record.immediate;
      record.later+=' The existing live service remains unchanged.';
    }
    return next;
  }
  if(arrivalRequirements(previous).length)throw new Error(arrivalRequirements(previous)[0]);
  const def=activeStep(previous),o=def.options.find(o=>o.id===id);if(!o)throw new Error('Unknown arrival choice: '+id);
  const s=JSON.parse(JSON.stringify(previous)),e=s.entry;
  if(o.plan)e.plan={...o.plan};
  if(o.brief)e.brief=true;
  if(o.audit)e.audited=true;
  if(o.unchecked)e.audited=false;
  if(o.framed)s.flags.framed=true;
  if(o.appPromise)s.flags.appPromise=true;
  if(o.overloaded)e.overloaded=true;
  if(o.stop){e.stopped=true;e.phase='closed';s.complete=true;}
  const over=o.plan&&(o.plan.cost>getEntry(s).budget||o.plan.days>getEntry(s).days);
  const immediate=o.stop?'You return an explicit decision without activating a new intervention.':over?'This proposal exceeds the available allowance or staff time. No extra resource or approval has been created.':o.unchecked?'The inherited assumption remains untested. Targeted questions are still available.':o.brief?'A working brief records the outcome, scope, constraints and next evidence check.':'Your decision is recorded. Talk to the relevant owners to establish the evidence and authority.';
  const record={step:def.id,title:def.title,choice:o.label,response:immediate,immediate,later:o.stop?'The evidence gaps and return conditions remain in the brief.':over?'An intervention cannot proceed without changing the plan or obtaining authorised resources.':'Inherited decisions and evidence remain inspectable in the arrival brief.',people:def.people};
  s.history.push(record);e.decisions.push({step:def.id,id:o.id,label:o.label});e.cursor++;
  if(!s.complete&&e.cursor===entrySteps[e.id].length)e.phase='service';
  return s;
}

export function questions(s,id){
  if(!canSpeakTo(s,id))return [];
  if(isOnboarding(s)&&!s.entry.context.includes('commission'))return [];
  const entry=getEntry(s);
  const list={
    sam:{id:'funding',label:'Ask about budget and decision authority',answer:`The ${entry.name.toLowerCase()} allowance is £${entry.budget.toLocaleString('en-GB')}. It is a ceiling for this bounded work, not funding for a new platform. ${entry.authority}`},
    priya:{id:'capacity',label:'Ask what staff time is actually available',answer:`I can allocate ${entry.days} analyst ${entry.days===1?'day':'days'} for this work. Normal repairs must continue. The receiving team must explicitly accept any resident-update duty.`},
    ellis:{id:'systems',label:'Ask which tools and data support the handoff',answer:'Use the existing repairs case record and contractor completion export. H104 shows no accepted completion event in the council record. A new status screen alone does not repair that boundary. Product names and a replacement platform are not established.'},
    mo:{id:'handoff',label:'Check the contractor record and commitment',answer:'The supplied H104 contractor record marks the repair complete. That does not prove the council received it or contacted Alex. I can support a bounded check after the urgent visit; wider changes need an agreed supplier commitment.'},
    nia:{id:'resident',label:entry.id==='discovery'?'Arrange the supported resident account':'Check the inherited resident and frontline account',answer:'The supplied fictional phone account says Alex chased after the repair. We checked with Mo and called Alex back. Alex needs a phone update. This is one supported case account, not a service-wide satisfaction result.'},
    ruth:{id:'promise',label:'Ask about promises, agreements and comparison',answer:'Alex’s acknowledgement and the delayed letter give conflicting expectations. They are case correspondence, not verified organisation-wide SLAs. Compare the current wording, formal agreement and actual event times separately. Phone access remains required for this test.'}
  };
  return list[id]?[{...list[id],answer:redactUnknown(s,list[id].answer),heard:s.entry.facts.includes(list[id].id)}]:[];
}
export function askQuestion(previous,person,id){
  const q=questions(previous,person).find(q=>q.id===id);if(!q)throw new Error('Unknown evidence question');
  const s=JSON.parse(JSON.stringify(previous));
  if(!s.entry.facts.includes(id)){
    s.entry.facts.push(id);s.evidence.push(`Question to ${person}: ${q.answer}`);
    s.visited=[...new Set([...s.visited,person])];
  }
  s.entry.lastQuestion='evidence:'+person+':'+id;
  if(id==='resident'){s.flags.research=true;s.flags.access=true;s.flags.supported=true;}
  if(['systems','handoff'].every(key=>s.entry.facts.includes(key)))s.flags.mapped=true;
  return s;
}

export function entryDependencies(s){return resourceDependencies(s).map(text=>redactUnknown(s,text));}

export function revisePlan(previous){
  const s=JSON.parse(JSON.stringify(previous));
  if(!['funding','capacity'].every(id=>s.entry.facts.includes(id)))throw new Error('Confirm funding and capacity before revising the plan.');
  if(s.flags.implemented||s.complete)throw new Error('The trial has already been decided.');
  s.entry.plan={cost:Math.min(2500,getEntry(s).budget),days:1};s.entry.brief=true;s.entry.overloaded=false;
  s.evidence.push('Revised brief: use the existing tools for a bounded handoff test; one analyst day, within the confirmed allowance. Wider change remains conditional. The incident stays with its operational owner.');
  s.history.push({step:'revision',title:'Revise the brief',choice:'Reduce scope to the confirmed resources',response:'The proposal now fits the allowance and capacity.',immediate:'No new money, staff or wider release is assumed.',later:'Consulted owners must still authorise the bounded test.',people:['sam','priya']});
  return s;
}

export function entryTalk(s,id){
  if(!canSpeakTo(s,id))return {quote:'This person has not been introduced.',source:'Your current knowledge',insight:'Ask a known contact who is responsible for this part of the service.'};
  if(isOnboarding(s)&&id==='sam'&&!s.entry.context.includes('commission'))return {quote:'Welcome. What would you like to understand about the assignment?',source:'Sam, service sponsor',insight:'You know your commissioning contact. The service, people and responsibilities still need investigating.'};
  const base=talk(s,id);base.quote=redactUnknown(s,base.quote);base.insight=redactUnknown(s,base.insight);if(!s.entry||s.flags.tested||s.flags.disrespect)return base;
  const entry=getEntry(s);
  if(id==='sam'&&entry.id!=='discovery')return {...base,quote:entry.id==='alpha'?'The previous alpha is ready for a fresh look. Ask for the evidence and the work people are handing over.':entry.id==='beta'?'Start with what the pilot has actually shown, and who is responsible for the next release decision.':'Meet the people running the service and understand its current commitments before agreeing the improvement.',insight:'An inherited decision is a claim to examine. Funding and authority still need establishing.'};
  if(!s.entry.facts.includes('resident')&&id==='nia')return {...base,quote:'There is a supplied case account. Ask me to check what it says and what it cannot establish.',insight:'An inherited finding is not a conversation you have already held.'};
  return base;
}

export function entrySummary(s){
  const entry=getEntry(s);
  if(s.entry.stopped)return {heading:entry.id==='discovery'?'The commission needs another decision.':entry.id==='beta'?'Expansion held. The pilot stays bounded.':entry.id==='live'?'The running service is protected.':'Progression from alpha is not yet justified.',description:'You ended this episode without activating a new intervention. The brief retains the evidence gaps and the next decision.',metrics:[{label:'Entry point',value:entry.name,detail:entry.scope},{label:'Service change',value:'No new intervention',detail:'No new feed, update owner, funding or service-wide benefit is credited.'}],relationships:[],findings:s.evidence,unresolved:[...entryDependencies(s),'Return at the next funding/capacity or release review with the named owners and the missing evidence.'],alternative:'A targeted investigation and a smaller, authorised test remain possible in another run.'};
  const result=getSummary(s);
  if(isOnboarding(s)){result.relationships=result.relationships.filter(p=>canSpeakTo(s,p.id));result.findings=result.findings.map(t=>redactUnknown(s,t));result.unresolved=result.unresolved.map(t=>redactUnknown(s,t));}
  result.description=`${entry.name} entry. ${entry.scope} All results are authored outcomes for one fictional case.`;
  const issues=handoverIssues(s);
  result.findings.push(...issues.filter(issue=>issue.clarified).map(issue=>issue.outcome));
  result.unresolved=[...new Set([...entryDependencies(s),...result.unresolved,...issues.map(issue=>issue.clarified?issue.limit:issue.question)])];
  if(entry.id==='alpha'){
    result.heading=s.flags.implemented?'The rehearsal exposes the next decision.':'The prototype still has unresolved dependencies.';
    result.metrics=result.metrics.map(m=>({...m,label:m.label==='Resident outcome'?'Resident rehearsal':m.label==='Operational effort'?'Rehearsed effort':m.label,detail:m.detail+' Alpha rehearsal only; no live-service change.'}));
  }
  return result;
}

// Called by the base engine too, so entry constraints cannot be bypassed by its delivery step.
export function chooseService(previous,id){
  return chooseEntry(previous,id);
}


// What the player can currently establish, not a hidden answer key or a fabricated recovered file.
export function handoverIssues(s){
  if(!s.entry||!s.entry.context.includes('commission'))return [];
  const docs=s.entry.documents||[],checks=s.entry.checks||[],id=s.entry.id;
  const definitions={
    discovery:{visible:true,title:'What is actually due on Friday?',question:'The older request asks for an app by Friday, while the sponsor briefing calls Friday an evidence checkpoint. Which expectation is current?',claims:['Older commissioning note: show an app by Friday.','Sponsor briefing: an evidence checkpoint, before a delivery commitment.'],needed:['friday-scope'],gate:'Clarify the conflicting Friday expectations before committing the trial.',outcome:'The sponsor clarified Friday as an evidence checkpoint. The earlier app-delivery wording was not a funded commitment.',limit:'The commission still needs the other owners’ scope and capacity decisions.'},
    alpha:{visible:docs.length>0,title:'What evidence supported the earlier approval?',question:'Is the approval describing a resident prototype test, an interview or an internal demonstration? The linked test report is missing.',claims:[...(docs.includes(2)?['Approval cover: residents validated the prototype and phone fallback; linked test report missing.']:[]),...(docs.includes(1)?['Prototype pack: internal demonstration using authored status data; no resident test attached.']:[]),...(docs.includes(0)?['Research summary: one phone interview; no prototype task; session index/recording link missing.']:[])],needed:['prototype-test-scope','research-provenance'],gate:'Check what the inherited validation claim actually rests on before authorising the rehearsal.',outcome:'The technical and research accounts establish an internal demonstration plus one interview, not a resident prototype test. The earlier validation claim cannot be carried forward.',limit:'The historical test report and session index remain unavailable. Run a new bounded rehearsal; do not claim historic usability validation.'},
    beta:{visible:docs.length>0,title:'Was support actually signed off?',question:'The release cover claims readiness. Establish what the receiving owners accepted and whether assisted contact was tested.',claims:[...(docs.includes(0)?['Release cover: support rota and assisted contact signed off; sign-off record missing.']:[]),...(docs.includes(1)?['Support rota: DRAFT, with blank acceptance names/dates and no expansion phone cover.']:[]),...(docs.includes(2)?['Pilot case pack: one case and unresolved contact/handoff evidence, not a rollout assurance record.']:[])],needed:['support-acceptance','assisted-signoff'],gate:'Check the claimed support and assisted-contact sign-off before activating the pilot adjustment.',outcome:'Operations and access owners confirm that expansion support and assisted-contact sign-off were not accepted. The release cover overstates readiness; a bounded pilot test remains a separate decision.',limit:'Wider release remains unapproved and needs new support acceptance and assisted-route evidence.'},
    live:{visible:docs.length>0,title:'What does “closed” mean, and who owns the update?',question:'Compare the supplier’s closed-job claim with the receiving operation and resident contact. Do the records describe the same end-state?',claims:[...(docs.includes(0)?['Review note: missing updates and repeat chasing are reported, without a verified service-wide rate.']:[]),...(docs.includes(1)?['Supplier note: job closed; council assumed to send the update; no receiving acceptance.']:[]),...(docs.includes(2)?['Council action sheet: contractor assigned the update; acceptance owner/date blank.']:[])],needed:['supplier-closure','receiving-owner'],gate:'Establish the contradictory closure responsibilities before activating a live change.',outcome:'The supplier means the physical repair is complete. Neither side accepted the resident-update duty in the old arrangement. The responsibility gap is established, not fixed.',limit:'A new receiving owner and capacity must still be agreed; the historical records retain their conflicting assignments.'}
  };
  const issue=definitions[id];if(!issue?.visible)return [];
  const clarified=issue.needed.every(check=>checks.includes(check));
  return [{...issue,id,clarified,status:clarified?'Clarified for the next decision':issue.claims.length>1?'Accounts to compare':'Missing supporting evidence',claims:issue.claims.map(text=>redactUnknown(s,text)),outcome:redactUnknown(s,issue.outcome),limit:redactUnknown(s,issue.limit)}];
}
export function investigationQuestions(s,person){
  if(!canSpeakTo(s,person)||!handoverIssues(s).length)return [];
  const bank={
    discovery:{sam:[{id:'friday-scope',label:'What exactly is expected on Friday?',check:'friday-scope',answer:'The app wording is from the older request. Friday is the evidence checkpoint. I have not funded an app launch or committed other teams to one. Keep the old wording in the record and note this clarification.'}]},
    alpha:{sam:[{id:'approval-trace',label:'Which evidence supported the earlier approval?',answer:'I repeated the cover summary. The test-report link is empty and I cannot produce that report. A budget decision from me cannot establish what residents actually tested.'}],ellis:[{id:'prototype-test-scope',label:'What did the prototype demonstration actually test?',check:'prototype-test-scope',answer:'It was an internal screen demonstration using authored status data. No resident took part and the phone fallback was not tested. That is narrower than the approval cover claims; I cannot supply a resident test report that was never produced for this demonstration.'}],nia:[{id:'research-provenance',label:'Who took part in the research, and what did they do?',check:'research-provenance',answer:'The supplied summary concerns one resident phone interview about the repair experience. They did not use the prototype. The handover is missing the session index and original recording link, so those files cannot be treated as recovered evidence. A new supported check is possible.'}]},
    beta:{sam:[{id:'release-origin',label:'What is the release readiness claim based on?',answer:'That cover reused an optimistic planning summary. I do not have the owners’ sign-off attached. The release review must establish what is actually accepted; my announcement is not their approval.'}],priya:[{id:'support-acceptance',label:'What support arrangement has your team actually accepted?',check:'support-acceptance',answer:'The rota is still a draft. The acceptance names and dates are blank because expansion cover was not agreed. Two analyst days for a bounded pilot check do not allocate the staff needed for public rollout.'}],ruth:[{id:'assisted-signoff',label:'What assisted-contact evidence supports the sign-off?',check:'assisted-signoff',answer:'No assisted-contact test result or sign-off was provided to me. The cover must not imply my approval. Keep the pilot bounded and test the phone fallback with a receiving owner before seeking an expansion decision.'}]},
    live:{sam:[{id:'closure-claim',label:'What was meant by the claim that the cases were closed?',answer:'The summary used the supplier’s closed-job status. It did not establish an accepted council handoff or an understood resident update. Check those boundaries with their owners.'}],mo:[{id:'supplier-closure',label:'When you say “closed”, which responsibility is complete?',check:'supplier-closure',answer:'I mean the physical repair is complete in the supplier record. We assumed the council handled the resident update. Our note has no council acceptance attached, and I did not accept the update duty on the old council action sheet.'}],priya:[{id:'receiving-owner',label:'Who accepted the resident-update duty in that arrangement?',check:'receiving-owner',answer:'Nobody in my team accepted it. The old action sheet assigned it to the contractor, while the supplier assumed it was ours. The blank acceptance fields are a real gap. Any new allocation needs an explicit capacity and contact-route decision.'}],nia:[{id:'last-contact',label:'What happened at the last resident contact after closure?',answer:'The job looked closed on the supplier side, but Alex still had no understood update. We chased the contractor and called back. The contact history distinguishes a completed repair from a completed service.'}]}
  };
  return bank[s.entry.id]?.[person]||[];
}
