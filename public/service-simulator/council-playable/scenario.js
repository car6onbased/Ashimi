/* Authored fictional scenario. Consequences describe one case, not measured client results. */
export const archetypes = [
  {id:'hippo',name:'HiPPO',behaviour:'Uses seniority to settle a disputed solution.',pressure:'Accountable for a visible improvement before the next committee.',constructive:'Clarify the intended outcome and agree what evidence will decide.',adverse:'Automatic deference silences other accounts; humiliation damages sponsorship.',later:'A bounded test can win approval despite initial discomfort.'},
  {id:'zebra',name:'ZEBRA',behaviour:'States an assumption as though it has already been established.',pressure:'Has experience but little direct evidence about this repair.',constructive:'Make the claim a hypothesis and agree a proportionate check.',adverse:'An untested claim becomes embedded in the as-is and proposed change.',later:'Test results may confirm or overturn the claim without making its author a villain.'},
  {id:'gatekeeper',name:'Gatekeeper',behaviour:'Controls access to staff, records and introductions.',pressure:'Must protect a busy team and resident confidentiality.',constructive:'Agree purpose, consent, short observation slots and an alternative route.',adverse:'Bypassing a legitimate boundary closes access; indefinite waiting leaves gaps.',later:'An agreed access route makes further observation possible.'},
  {id:'seagull',name:'Seagull',behaviour:'Joins occasionally and redirects work without knowing its history.',pressure:'Has new external demands but little continuity with the team.',constructive:'Share the decision history, examine the new information and name its owner.',adverse:'Unrecorded instructions create rework and conflicting commitments.',later:'An explicit checkpoint can replace repeated last-minute redirection.'},
  {id:'firefighter',name:'Firefighter',behaviour:'Prioritises the latest incident over planned investigation.',pressure:'A missed visit today may cause immediate harm.',constructive:'Check urgency, contain the incident and agree what work moves.',adverse:'Treating all requests as emergencies consumes capacity; ignoring real harm fails residents.',later:'A separate incident and improvement plan can protect both recovery and discovery.'},
  {id:'sceptic',name:'Sceptic',behaviour:'Challenges evidence, practicality and promised value.',pressure:'Has seen previous programmes leave no operational benefit.',constructive:'Invite the objection and test the weakness it identifies.',adverse:'Dismissing the concern leaves a feasibility problem for approval.',later:'Credible evidence can make a critic a reliable ally.'},
  {id:'traditionalist',name:'Traditionalist',behaviour:'Defends an existing process or useful workaround.',pressure:'The current arrangement carries exceptions a new design may miss.',constructive:'Observe the work and preserve essential exceptions during a reversible test.',adverse:'Removing a workaround prematurely transfers effort or breaks the service.',later:'A jointly agreed transition can improve adoption without losing knowledge.'},
  {id:'expert',name:'Expert',behaviour:'Has specialist knowledge but may dominate discussion.',pressure:'Must prevent an unworkable integration being promised.',constructive:'Ask for a plain-language account and combine it with resident and staff evidence.',adverse:'Blind deference misses lived experience; ignoring expertise creates an infeasible change.',later:'A clear feasibility check enables a bounded test, not an unlimited promise.'},
  {id:'risk',name:'Risk guardian',behaviour:'Raises a binding safety, policy, data or accessibility constraint.',pressure:'Accountable for a safe, accessible service and valid use of contact details.',constructive:'Involve early, identify the exact rule and design a compliant alternative.',adverse:'Late involvement causes rework; rapport cannot waive a binding requirement.',later:'A constrained test may proceed after access and fallback routes are confirmed.'},
  {id:'champion',name:'Champion',behaviour:'Opens doors and advocates change, sometimes beyond the evidence.',pressure:'Wants visible momentum and a story colleagues can support.',constructive:'Agree a realistic ask, evidence boundary and permission to make commitments.',adverse:'Overpromising wins early confidence but creates delivery pressure and later disappointment.',later:'A bounded claim sustains sponsorship when the first test reveals a limitation.'},
  {id:'quiet',name:'Quiet insider',behaviour:'Knows operational detail but contributes little in a crowded senior meeting.',pressure:'Needs preparation time and confidence that findings will not become blame.',constructive:'Offer private or asynchronous input and agree attribution.',adverse:'Forced disclosure or interruptions reduce later contribution.',later:'Protected input can reveal a missing handoff; disclosure does not make it validated automatically.'},
  {id:'political',name:'Political operator',behaviour:'Weighs support against influence, credit and departmental accountability.',pressure:'Cannot accept unresourced work or blame for another organisation\'s failure.',constructive:'Make dependencies transparent and record resources and commitments with owners.',adverse:'Private incompatible promises produce nominal approval with no delivery support.',later:'A recorded joint commitment can survive the next pressure on capacity.'}
];

export const people = [
  {id:'sam',name:'Sam',role:'Service sponsor',archetypes:['hippo','champion'],location:'leadership',colour:'#c87850',opening:'The committee wants an app. Can you show me something by Friday?'},
  {id:'priya',name:'Priya',role:'Housing lead',archetypes:['gatekeeper','traditionalist'],location:'housing',colour:'#6e8767',opening:'My team is already covering absences. Tell me exactly what access you need.'},
  {id:'nia',name:'Nia',role:'Contact adviser',archetypes:['quiet'],location:'contact',colour:'#d5a843',opening:'I can explain the chase calls. Could we talk somewhere quieter?'},
  {id:'ellis',name:'Ellis',role:'Technology lead',archetypes:['expert','sceptic'],location:'systems',colour:'#698b9d',opening:'A new interface will still show the wrong status if the completion record never arrives.'},
  {id:'ruth',name:'Ruth',role:'Policy and access lead',archetypes:['risk'],location:'meeting',colour:'#9b7b9e',opening:'Some residents cannot use a link. The service needs a working phone route and contact preferences.'},
  {id:'mo',name:'Mo',role:'Repairs contractor lead',archetypes:['firefighter','political'],location:'contractor',colour:'#ae8061',opening:'I have an urgent missed visit to cover. I can agree a short test, not an unresourced new process.'}
];

export const steps = [
  {id:'firstweek',title:'Understand the commission',question:'Sam wants an app by Friday. What do you commit to?',context:'Day one. Residents report repairs by phone or online. The sponsor wants fewer chase calls, but the commission names an app before the problem has been investigated.',people:['sam','priya'],options:[
    {id:'frame',label:'Agree the service outcome first',detail:'Respectfully challenge the app assumption. Ask for a bounded investigation and an evidence checkpoint.'},
    {id:'app',label:'Promise an app demonstration',detail:'Keep the sponsor confident and use existing reports to get a visible prototype moving.'},
    {id:'confront',label:'Reject the app in front of the team',detail:'Insist on investigating the service, but describe Sam’s suggestion as uninformed.'}
  ]},
  {id:'discovery',title:'Make room for missing voices',question:'How do you get beyond the available reports?',context:'Priya can offer two short observation slots. Nia would prefer a private conversation. Alex, a fictional tenant working shifts, needs a supported phone appointment to describe the experience.',people:['priya','nia','ruth'],options:[
    {id:'inclusive',label:'Agree short, supported conversations',detail:'Respect staff capacity, offer Alex a phone slot and agree how Nia’s account will be attributed.'},
    {id:'reports',label:'Use the dashboard and senior accounts',detail:'Save time now. Record that frontline work and assisted-service needs have not been explored.'},
    {id:'force',label:'Require access and name the source publicly',detail:'Use the sponsor’s mandate to gather the information immediately, overriding Priya’s agreed slots and Nia’s request.'}
  ]},
  {id:'sensemaking',title:'Find the unfinished handoff',question:'What goes into your account of the current service?',context:'The contractor marks the repair complete. Council records do not receive that event. Nobody is explicitly responsible for telling the resident. A finished repair can therefore leave an unfinished service.',people:['nia','ellis','mo'],options:[
    {id:'map',label:'Compare accounts in an as-is blueprint',detail:'Separate evidence from assumptions and validate the missing information and ownership with the receiving teams.'},
    {id:'polish',label:'Present a polished app concept',detail:'Treat status visibility as the solution and leave the operational handoff untested.'},
    {id:'mock',label:'Map the gap, but make it a blame exercise',detail:'Get the technical diagnosis right while publicly accusing the operational teams of incompetence.'}
  ]},
  {id:'alignment',title:'Bring the decision together',question:'Who needs to shape and authorise the test?',context:'A completion feed needs Ellis and Mo to agree its scope. Priya owns the resident update. Ruth must confirm the contact and fallback route. Sam can release a bounded test budget.',people:['sam','priya','ellis','ruth','mo'],options:[
    {id:'workshop',label:'Gather the owners around the service',detail:'Use the blueprint, supported resident input and structured airtime. Record a small test and what each owner can commit.'},
    {id:'presentation',label:'Get Sam to endorse the finished proposal',detail:'Save meeting time, but leave technical, operational and access decisions with people who were not involved.'},
    {id:'async',label:'Seek the same decisions asynchronously',detail:'Share an accessible brief and collect named owner responses. Mo can attend the urgent incident without silently losing a voice.'}
  ]},
  {id:'delivery',title:'Choose a bounded intervention',question:'Which change do you ask the owners to test?',context:'The council can test completion data and resident-update ownership independently. Neither changes the repair itself or the scheduling queue. Implementation still depends on evidence and the right approvals.',people:['priya','ellis','mo','ruth'],options:[
    {id:'both',label:'Connect the record and name an update owner',detail:'Test a completion feed plus Priya’s team taking responsibility for a preferred-channel resident update.'},
    {id:'feed',label:'Test the completion feed only',detail:'Remove a manual status check. Receiving data alone will not make somebody contact Alex.'},
    {id:'owner',label:'Assign the resident update only',detail:'Priya’s team checks completion manually and contacts Alex. The chase can stop while staff still do the check.'},
    {id:'neither',label:'Keep the current handoff for now',detail:'Avoid committing capacity before uncertainties are resolved. The original service failure remains visible.'}
  ]},
  {id:'recovery',title:'Test, listen and recover',question:'The message route fails for a resident. What happens next?',context:'At the test checkpoint, an SMS link is unusable for a resident. A phone update is available, but it needs an owner and an agreed contact preference. Mo’s urgent visit also tests whether commitments were realistic.',people:['ruth','nia','mo','priya'],options:[
    {id:'repair',label:'Use the fallback and correct the test',detail:'Arrange the preferred phone update, document the failed message, acknowledge any mishandling and agree the next check.'},
    {id:'blame',label:'Restore the phone route, then blame the teams',detail:'Resolve this resident’s immediate problem but publicly attribute failure to colleagues and dismiss their concerns.'},
    {id:'hold',label:'Pause the notification trial',detail:'Keep the existing contact route, record the failure honestly and seek the missing access or ownership decision before extending.'}
  ]}
];

const clone = value => JSON.parse(JSON.stringify(value));
function relationshipLabel(trust) { return trust >= 2 ? 'Working with you' : trust <= -2 ? 'Trust damaged' : trust < 0 ? 'Concerned' : 'Cautiously involved'; }
function affect(s,id,change,detail) {
  const r=s.relationships[id]; r.trust=Math.max(-5,Math.min(5,r.trust+change));r.status=relationshipLabel(r.trust);r.detail=detail;
}
function note(s,text){if(!s.evidence.includes(text))s.evidence.push(text);}
export function initialState(){return {step:0,choices:[],history:[],evidence:[],visited:[],invited:[],relationships:Object.fromEntries(people.map(p=>[p.id,{trust:0,status:'Not yet involved',detail:'No commitment has been requested.',availability:'Unconfirmed',commitment:'None'}])),flags:{access:false,research:false,mapped:false,approved:false,feed:false,owner:false,accessible:false,implemented:false,workshop:false,trustDamaged:false,dependencies:[]},metrics:{residentChases:1,manualChecks:1},complete:false};}

export function resourceDependencies(s){
  if(!s.entry)return [];
  const e=s.entry,missing=[...(e.handoverGaps||[])];
  if(!e.brief)missing.push('Record a working brief and a bounded next decision.');
  if(!e.facts.includes('funding'))missing.push('Ask Sam to confirm the available allowance and authority.');
  if(!e.facts.includes('capacity'))missing.push('Ask Priya to confirm actual staff availability.');
  if(!e.facts.includes('promise'))missing.push('Ask Ruth to distinguish case promises, agreements and access requirements.');
  if(!e.plan)missing.push('Agree a resource plan for this entry point.');
  else {
    if(e.plan.cost>e.budget)missing.push(`Proposed £${e.plan.cost.toLocaleString('en-GB')} exceeds the £${e.budget.toLocaleString('en-GB')} allowance. Revise the plan; extra funding is not approved.`);
    if(e.plan.days>e.days)missing.push(`Proposed ${e.plan.days} analyst days exceeds the ${e.days} available. Revise the plan or secure authorised capacity.`);
  }
  if(e.overloaded)missing.push('Resolve the unresourced incident commitment before allocating improvement capacity.');
  return missing;
}

export function getDependencies(s,mode){
  const visited=s.visited||[],invited=s.invited||[];const f=s.flags;
  const alignment=mode||s.choices.find(c=>c.step==='alignment')?.id;
  const missing=[];
  if(!f.research)missing.push(s.entry&&s.entry.id!=='discovery'?'Ask Nia to check the inherited resident and frontline evidence.':'Choose a supported discovery route, not reports alone.');
  if(!visited.includes('nia'))missing.push('Speak with Nia to hear the frontline and supported resident account.');
  if(!f.mapped)missing.push('Validate the information and responsibility gaps in the as-is.');
  for(const id of ['sam','priya','ellis','ruth','mo'])if(!visited.includes(id))missing.push('Speak with '+people.find(p=>p.id===id).name+' about their decision or constraint.');
  if(alignment==='workshop')for(const id of ['sam','priya','mo'])if(!invited.includes(id))missing.push('Invite '+people.find(p=>p.id===id).name+' so the sponsor, receiving owner and supplier are represented.');
  if(alignment==='presentation')missing.push('Sponsor endorsement alone cannot replace the other owners’ decisions.');
  if(!alignment)missing.push('Choose a workshop or a documented asynchronous decision route.');
  return [...missing,...resourceDependencies(s)];
}

export function choose(previous,optionId){
  if(previous.complete)return previous;
  const def=steps[previous.step];const option=def.options.find(o=>o.id===optionId);if(!option)throw new Error('Unknown choice for this decision: '+optionId);
  const s=clone(previous);const f=s.flags;let response='',immediate='',later='';
  s.choices.push({step:def.id,id:optionId,label:option.label});
  if(def.id==='firstweek'){
    if(optionId==='frame'){
      f.framed=true;affect(s,'sam',-1,'You challenged the app assumption. Sam is uncomfortable but agrees to an evidence checkpoint.');affect(s,'priya',1,'The commission now includes staff effort and the resident outcome.');
      response='Sam: “I still need something visible. Show me what the investigation changes.”';immediate='A short investigation is commissioned. Sponsor confidence dips before any outcome is known.';later='The evidence checkpoint gives later findings a legitimate route to the sponsor.';
      note(s,'Commission: reduce avoidable resident chasing while preserving phone and assisted access.');
    }else if(optionId==='app'){
      f.appPromise=true;affect(s,'sam',2,'Sam has an app demonstration to promise, before the cause of chasing is understood.');
      response='Sam: “Good. I will tell the committee there is an app coming.”';immediate='Sponsor confidence rises. The promise narrows attention before research.';later='A service change may still be possible, but the original app promise must be corrected in the debrief.';
      note(s,'Untested assumption: a new app will reduce chase calls.');
    }else{
      f.framed=true;f.disrespect=true;affect(s,'sam',-3,'The service question was legitimate, but you publicly belittled Sam.');affect(s,'priya',-1,'Priya is wary of how the team will be represented.');
      response='Sam: “Investigate it, then. But do not speak to my team like that again.”';immediate='You secure investigation while damaging the working relationship.';later='Authority remains available for a sound test, but future willingness to work together is reduced.';
      note(s,'Commission: investigate the cause of chase calls; the opening interaction damaged trust.');
    }
  }
  if(def.id==='discovery'){
    if(optionId==='inclusive'){
      f.access=true;f.research=true;f.supported=true;affect(s,'priya',2,'You agreed two short observation slots instead of assuming unlimited access.');affect(s,'nia',2,'You offered a private conversation and agreed attribution.');affect(s,'ruth',1,'Phone research and assisted-service needs are in scope.');
      response=(s.visited||[]).includes('nia')?'Nia: “Alex called again even though the contractor had finished. We had no completion message to give them.”':'Priya: “The short slots are agreed. Speak with Nia to hear the frontline and supported resident account.”';immediate='A supported phone research route is agreed; the account becomes available through Nia’s conversation.';later='The protected access arrangement makes operational validation possible. The designer must still hear the account.';
      note(s,'Research plan: short staff observations and a supported resident phone account agreed. Read Nia’s conversation to obtain the account.');
    }else if(optionId==='reports'){
      f.reportsOnly=true;affect(s,'priya',0,'No staff capacity was taken, but the proposed service has not been observed.');affect(s,'nia',0,'Nia’s operational account has not been heard.');
      response='Priya: “The dashboard counts completed jobs. It does not tell you whether the resident understood the outcome.”';immediate='The report establishes completed jobs, not residents’ understanding or accessibility needs.';later='An evidence gap remains even if later operational testing succeeds.';
      note(s,'Dashboard: the job is marked complete. Resident understanding and assisted access remain unresearched.');
    }else{
      f.access=true;f.research=false;f.exposed=true;f.disrespect=true;affect(s,'priya',-3,'You bypassed agreed capacity and disclosure arrangements.');affect(s,'nia',-3,'You did not protect Nia’s request for a private contribution.');
      response=(s.visited||[]).includes('nia')?'Nia: “That is what happened. But I asked you not to put my name against it in that meeting.”':'Priya: “You have directed staff to provide information outside the agreed slots. You still need to speak with them.”';immediate='You require the information, while damaging access and participation.';later='Nia limits further open discussion. Her account must still be read, and the handoff requires an operational check.';
      note(s,'Research approach: access mandated outside the agreed arrangements; source attribution protection was not respected.');
    }
  }
  if(def.id==='sensemaking'){
    if(optionId==='map'||optionId==='mock'){
      f.mapped=true;f.technical=true;note(s,'As-is synthesis from supplied case records: contractor completion is not received by the council, and no resident-update owner is assigned. Technical and supplier conversations are still required for a test.');
      if(optionId==='map'){
        affect(s,'ellis',2,'You asked Ellis and Mo to validate what information actually crosses the boundary.');affect(s,'mo',1,'You distinguished the completed repair from the missing council handoff.');
        response=(s.visited||[]).includes('ellis')?'Ellis: “The missing feed and the missing owner are different problems. We can test them separately.”':'Your as-is separates the missing completion event from the missing update owner. Consult Ellis and Mo to verify feasibility.';immediate='The supplied case-record comparison now separates information flow from responsibility.';later=f.exposed?'Source mishandling remains a relationship consequence even if technical records later validate the gap.':'A bounded proposal is possible; it still needs stakeholder validation and the receiving owner’s agreement.';
      }else{
        f.disrespect=true;affect(s,'ellis',-2,'Your diagnosis is sound, but you used it to humiliate the operational team.');affect(s,'mo',-2,'You publicly blamed Mo’s team for a shared responsibility gap.');affect(s,'nia',-2,'The as-is meeting became a blame session.');
        response=(s.visited||[]).includes('mo')?'Mo: “The completion record exists. We will help test the handoff, but the accusation was unfair.”':'The case-record comparison identifies the gap, but you have used it to blame operational teams before securing their account.';immediate='The case-record gap is documented while operational relationships deteriorate.';later='A recorded, properly resourced test can still work after consultation. That does not repair how colleagues were treated.';
      }
    }else{
      f.polished=true;affect(s,'sam',1,'The concept gives Sam something visible, without a validated handoff.');affect(s,'ellis',-1,'The app still has no reliable source for completion status.');
      response='Ellis: “The screen looks finished. Where does its status come from?”';immediate='The interface concept advances. The completion and ownership assumptions remain untested.';later='The test cannot implement a new handoff until feasibility has been established.';note(s,'Unvalidated proposal: show completion in an app, without confirming the data source or update owner.');
    }
  }
  if(def.id==='alignment'){
    if(optionId==='workshop'||optionId==='async'){
      f.dependencies=getDependencies(s,optionId);f.approved=f.dependencies.length===0;f.workshop=optionId==='workshop';f.async=optionId==='async';f.authority=f.approved;
      for(const id of ['priya','ellis','ruth','mo']){s.relationships[id].commitment=f.approved?'Bounded test agreed, subject to the documented scope.':'Decision pending: '+f.dependencies[0];s.relationships[id].availability=(s.visited||[]).includes(id)?(optionId==='workshop'&&(s.invited||[]).includes(id)?'Workshop contribution':'Conversation recorded'):'Not consulted';}
      if(f.approved){
        affect(s,'ruth',2,'The phone fallback and contact preferences were considered before approval.');
        if(optionId==='async')affect(s,'mo',2,'You respected the urgent visit and obtained a written capacity commitment.');else affect(s,'mo',1,'The workshop records a small trial with named responsibilities.');
        if(f.framed&&!f.disrespect)affect(s,'sam',2,'The evidence checkpoint produced an actionable test rather than an unsupported promise.');
      }
      response=f.approved?(optionId==='workshop'?'Priya: “My team can own the resident update for this test. Record the scope and the fallback.”':'Mo: “I can cover the urgent visit and confirm the test commitment in writing.”'):'The proposed decision is not authorised yet. '+f.dependencies[0];immediate=f.approved?(optionId==='workshop'?'The consulted owners agree a bounded test with the sponsor, receiving owner and supplier present.':'The consulted owners agree the recorded decision brief; no approval is inferred from silence.'):'A decision route is prepared, with named gaps still preventing approval.';later=f.approved?'Recorded authority and capacity allow the selected handoff changes to be tested.':'Complete the missing conversations or invitations before the delivery decision. Otherwise implementation stays blocked.';
      note(s,f.approved?'Decision record: consulted sponsor, receiving owner, technology, supplier and access owner agree the trial boundary and phone fallback.':'Pending decision: '+f.dependencies.join(' '));
    }else{
      f.approved=false;f.workshop=false;affect(s,'sam',1,'Sam endorsed the presentation but could not commit the absent receiving teams.');affect(s,'priya',-1,'Operational responsibility was proposed without Priya’s agreement.');
      response='Priya: “Sam’s endorsement does not allocate my team’s capacity or approve the contact route.”';immediate='The proposal has sponsor support but lacks operational and technical commitment.';later='No new feed or resident-update owner can be activated by endorsement alone.';
      note(s,'Decision gap: sponsor endorsement obtained; operational, supplier and access approvals remain outstanding.');
    }
  }
  if(def.id==='delivery'){
    f.dependencies=getDependencies(s);f.approved=f.dependencies.length===0;f.authority=f.approved;
    f.requestedFeed=optionId==='both'||optionId==='feed';f.requestedOwner=optionId==='both'||optionId==='owner';
    f.implemented=Boolean(f.approved&&f.mapped&&optionId!=='neither');f.feed=f.implemented&&f.requestedFeed;f.owner=f.implemented&&f.requestedOwner;
    f.accessible=false; // A real notification test still has to expose the failure in decision six.
    if(optionId==='neither'){
      response='Priya: “Then we keep the current handoff while the open questions are resolved.”';immediate='No new commitments are made and the original chase and manual check remain.';later='The next test must still address information, ownership and an accessible update route.';
    }else if(!f.implemented){
      response='The test remains a proposal. '+(f.dependencies[0]||'The receiving process has not been validated.');immediate='The selected change is recorded as proposed, not implemented.';later='No service improvement is credited for an unapproved or unvalidated change. Outstanding: '+f.dependencies.join(' ');
    }else{
      response=f.feed&&f.owner?'Priya: “We will receive the completion record and own Alex’s update.”':f.feed?'Ellis: “The record will arrive. Someone still needs to own the resident update.”':'Priya: “We will check with the contractor and contact Alex. The check remains manual.”';
      immediate=f.feed&&f.owner?'The bounded test connects completion data and assigns resident-update responsibility.':f.feed?'The completion feed is active; resident-update ownership is still missing.':'The update owner is assigned; staff still check completion manually.';
      later='The test now checks whether the resident actually receives an accessible update, not just whether data arrives.';
      for(const id of ['priya','ellis','mo'])s.relationships[id].commitment='The selected bounded test is underway.';
    }
    note(s,'Test scope: '+option.label+'. '+(f.implemented?'Approved and operationally validated.':'Not activated.'));
  }
  if(def.id==='recovery'){
    f.tested=true;f.accessible=Boolean(f.owner&&optionId!=='hold');
    if(optionId==='repair'){
      f.repaired=true;affect(s,'ruth',1,'You retained a phone fallback and recorded the unusable SMS link.');affect(s,'nia',1,f.exposed||f.disrespect?'You acknowledged the mishandling and offered a protected way to validate the next test. Nia agrees to one short check, not open-ended participation.':'You represented the failure honestly and invited a protected follow-up check.');
      response=f.owner?'Ruth: “The preferred phone route reaches Alex. Keep the link failure in the evidence.”':'Ruth: “The phone route exists, but nobody has accepted responsibility for the update. A polite request cannot assign that duty.”';
      immediate=f.owner?'The named owner makes a phone update. Alex understands that the repair is resolved.':'You document the notification failure, but no agreed owner can deliver the new update.';later=f.disrespect||f.exposed?'A limited follow-up conversation reopens, but prior disclosure and conduct damage remain in the record.':'The next check will include people using assisted routes; this one case cannot establish population-wide accessibility.';
    }else if(optionId==='blame'){
      f.disrespect=true;f.blamed=true;for(const id of ['priya','nia','mo'])affect(s,id,-3,'The immediate fault was handled, but you publicly blamed colleagues instead of examining the shared failure.');affect(s,'ruth',-1,'The access failure was fixed for one resident but dismissed as somebody else’s fault.');
      response=f.owner?'Nia: “Alex has the phone update. I would not volunteer for another project run this way.”':'Nia: “Blaming us does not create the owner the proposal was missing.”';immediate=f.owner?'The owner completes the phone update, so this case can improve despite damaged relationships.':'No new update is delivered because ownership was never agreed.';later='Colleagues reduce voluntary involvement in future work. A resolved case does not erase that behaviour.';
    }else{
      f.held=true;f.accessible=false;affect(s,'ruth',1,'You stopped the notification trial and kept the failure visible.');
      response='Ruth: “Pausing is defensible. Keep the existing phone contact available while we resolve the notification route.”';immediate='The notification trial is paused. The existing service still relies on the resident chasing for confirmation.';later='The decision log retains an explicit restart condition; no resident-outcome improvement is claimed.';
    }
    if(f.appPromise){affect(s,'sam',-2,'The first-week app promise was not the change delivered. Sam wants future claims agreed against evidence.');}
    f.trustDamaged=Object.values(s.relationships).some(r=>r.trust<=-2);
  }
  s.metrics.residentChases=f.owner&&f.accessible?0:1;s.metrics.manualChecks=f.feed?0:1;
  s.history.push({step:def.id,title:def.title,choice:option.label,response,immediate,later,people:def.people});
  s.step+=1;s.complete=s.step===steps.length;
  return s;
}

export function talk(s,personId){
  const p=people.find(p=>p.id===personId);if(!p)return {quote:'This person is not part of this scenario.',source:'Scenario',insight:''};
  const f=s.flags;let quote=p.opening,insight='A stakeholder account is evidence to examine, not an automatic statement of fact.';
  if(personId==='sam'){
    if(f.disrespect){quote='I will approve a properly scoped test, but the way you spoke to the team has consequences for working together.';insight='Authority and willingness to work with you are separate.';}
    else if(f.approved&&f.framed){quote='The app was my first idea. The handoff evidence gives us a smaller, more useful test.';insight='A sponsor can change position after a credible evidence checkpoint.';}
    else if(f.appPromise){quote='You said an app was coming. The committee has heard that now.';insight='Early confidence has created a later commitment you must account for.';}
  }
  if(personId==='priya'){
    if(f.exposed){quote='You got information by overruling the arrangements. I will honour a written test commitment, but further access needs careful agreement.';insight='Formal commitment can remain while voluntary access narrows.';}
    else if(f.access){quote='The short slots worked. My team can check the draft without losing a whole morning.';insight='A proportionate request protects operations and makes further participation feasible.';}
    else if(f.approved){quote='My approval is for a small trial, with contact preferences and a named update owner. It is not unlimited capacity.';}
  }
  if(personId==='nia'){
    if(f.blamed){quote='The case may be closed, but I am not volunteering for another blame session.';insight='The service result and the working relationship have diverged.';}
    else if((f.exposed||f.disrespect)&&f.repaired){quote='I can check the draft privately. That does not undo what happened in the meeting.';insight='Relevant repair reopens limited participation without resetting trust.';}
    else if(f.exposed||f.disrespect){quote='The account is already in the record. I am not adding more in an open meeting.';insight='A source can withdraw further contribution without invalidating evidence already obtained.';}
    else if(f.research){quote='Alex called after the tap was fixed. We had to ask Mo whether the job was complete, then call Alex back.';insight='Repair completion, receipt of data and responsibility to update the resident are three different things.';}
  }
  if(personId==='ellis'){
    quote=f.mapped?'We validated the record gap. A feed removes the manual check; it does not make a person responsible for an update.':'The contractor has a completion event. Let us compare the two records before promising a new interface.';
    insight=f.approved?'Technical feasibility and owner agreement are both needed before a test is activated.':'Expert knowledge can expose a constraint; it does not replace resident evidence.';
  }
  if(personId==='ruth'){
    quote=f.tested?'The SMS link failed in this test. A preferred phone update can work, but only with a named owner.':'Phone and assisted routes must remain available. A consented contact preference is a requirement, not an optional extra.';
    insight='A valid access constraint cannot be removed by improving rapport or pleasing the sponsor.';
  }
  if(personId==='mo'){
    quote=f.async?'The asynchronous decision let me cover the urgent visit and still commit a short capacity slot.':f.approved?'We have named the test scope and capacity. That is why the commitment can survive an urgent visit.':'I need to cover a missed appointment. Can we separate that immediate risk from the improvement work?';
    insight='Urgency may be real. Recorded scope and responsibilities prevent a private promise from becoming an unsupported dependency.';
  }
  return {quote,source:p.name+', '+p.role.toLowerCase(),insight};
}

export function getSummary(s){
  const f=s.flags;const improved=s.metrics.residentChases===0&&s.metrics.manualChecks===0;const damaged=Object.values(s.relationships).some(r=>r.trust<=-2);
  const residentEvidence=f.research&&(s.visited||[]).includes('nia');const validated=f.mapped&&['ellis','mo'].every(id=>(s.visited||[]).includes(id));
  let heading=!f.tested?'A test is taking shape':improved?(damaged?'The service improved. Trust did not.':'A resolved repair and a clearer service.'):(f.feed?'The data arrived. The resident still chased.':f.owner&&f.accessible?'The resident was updated. The check stayed manual.':f.held?'An honest pause, with work still to do.':'The proposal has not resolved the handoff.');
  const resident=s.metrics.residentChases===0?'No chase needed':'One chase remains';const manual=s.metrics.manualChecks===0?'No manual status check':'One manual status check';
  return {heading,description:!s.complete?'Your decisions are changing the test and the working relationships. Finish all six to review the outcome.':'These are authored outcomes for one fictional repair. The repair and scheduling queue are unchanged; no real service savings or timings are claimed.',metrics:[
    {label:'Resident outcome',value:resident,detail:f.owner&&f.accessible?'The named owner uses the preferred phone route after the SMS failure.':'Completion alone does not give the resident an understood update.'},
    {label:'Operational effort',value:manual,detail:f.feed?'The validated contractor completion event reaches the council.':'Staff must still ask the contractor for the completion status.'},
    {label:'Inclusion',value:f.accessible?'Fallback used':f.held?'Trial paused':'Access gap remains',detail:residentEvidence?'A supported resident account was explored, but this case cannot establish that the service works for all users.':'The supported resident account has not been obtained. Record that limitation even if a case-record comparison exists.'},
    {label:'Evidence',value:validated?'Handoff validated':f.mapped?'Record comparison':'Assumptions remain',detail:validated?'Technical and supplier accounts plus the supplied case records separate data from responsibility.':'A case-record synthesis, polished concept or sponsor agreement alone is not a validated operating model.'},
    {label:'Capacity and cost',value:f.implemented?'Bounded trial':'Not committed',detail:f.implemented?'Named owners agreed a limited capacity commitment. No cost or time saving is quantified.':'No unapproved implementation or saving is credited.'},
    {label:'Working relationships',value:damaged?'Trust damaged':'Participation sustained',detail:damaged?'Specific disclosure, blame or conduct choices reduced future voluntary contribution.':'Recorded scope and evidence allow constructive disagreement without losing the working relationship.'},
    {label:'Sponsor confidence',value:s.relationships.sam.status,detail:s.relationships.sam.detail}
  ],relationships:people.map(p=>({id:p.id,name:p.name,status:s.relationships[p.id].status,detail:s.relationships[p.id].detail})),findings:[...s.evidence,...(residentEvidence?['Source: Nia’s operational conversation and supported fictional resident account describe a chase after the repair was finished.']:[])],unresolved:[
    ...(!residentEvidence?['Seek the supported resident and frontline account through Nia’s conversation.']:[]),
    ...(!f.mapped?['Validate the completion record and receiving process before implementation.']:[]),
    ...(!f.approved?['Obtain explicit operational, technical, supplier and access decisions.']:[]),
    ...(!f.feed?['Resolve whether and how the contractor completion event should reach council records.']:[]),
    ...(!f.owner?['Agree who is responsible for the resident update and what capacity it requires.']:[]),
    ...(!f.accessible?['Retest a preferred-channel resident update with the receiving owner.']:[]),
    ...(damaged?['Rebuild participation through specific actions; a successful test is not a substitute for trust.']:[]),
    'Test more than one case, including exceptions, contact preferences, supplier capacity and data handling.'
  ],alternative:f.feed&&!f.owner?'Assigning an update owner as well could stop the chase, but requires explicit operational capacity and an accessible route.':f.owner&&!f.feed?'Connecting completion data could remove the manual check, but needs a validated technical and supplier commitment.':damaged?'The same technical intervention could be pursued through protected evidence sharing and respectful challenge. That may preserve participation without changing the service diagnosis.':'A smaller owner-only test could preserve the resident update while leaving the manual check in place. The model does not establish which option is best at scale.'};
}

export function getArtefacts(s){
  const f=s.flags;
  const residentEvidence=f.research&&(s.visited||[]).includes('nia');const validated=f.mapped&&['ellis','mo'].every(id=>(s.visited||[]).includes(id));
  return [
    {title:'Commission',status:s.step?'Recorded':'Starting point',body:f.appPromise?'Sam has promised an app demonstration before the handoff was understood. That commitment needs correcting.':f.framed?'Reduce resident chasing and staff status-checking. Investigate before committing to a solution.':'Initial request: an app by Friday. The intended resident outcome needs clarification.'},
    {title:'As-is and evidence',status:validated?'Validated handoff':f.mapped?'Record comparison':residentEvidence?'Account gathered':'Evidence gap',body:f.mapped?'Supplied fictional case records: contractor marks repair complete → no completion event reaches council records → no owner is assigned to update the resident → resident chases → adviser checks manually. '+(validated?'Ellis and Mo’s consulted accounts support this comparison.':'Technical and supplier conversations are still required to validate a test.'):residentEvidence?'Source: Nia’s conversation and the supported resident account report a missing update. Compare operational records before treating that account as a validated model.':'Supplied dashboard: the job is complete. It does not establish whether the resident understands the outcome.'},
    {title:'Resident journey',status:f.tested?'Test observed':'Authored case journey',body:'Fictional case: report by phone or online → assess → wait for scheduling → arrange visit → repair → seek an understood outcome. '+(f.owner&&f.accessible?'Observed in the test: the owner phones Alex after the SMS link fails.':f.tested?'Observed in this branch: the resident still needs to chase for confirmation.':'The update and notification route have not yet been tested.')},
    {title:'Service blueprint',status:f.implemented?'Bounded future test':'Current / proposed',body:'Frontstage: contact adviser and resident-update route. Backstage: housing owner, scheduling and contractor visit. Data: '+(f.feed?'completion event received.':'completion remains outside council records.')+' Responsibility: '+(f.owner?'Priya’s team owns the resident update.':'resident-update owner unassigned.')+' The repair and scheduling queue are unchanged.'},
    {title:'Responsibilities and access',status:f.approved?'Owners committed':'Decisions outstanding',body:'Sam: bounded test funding. Priya: housing capacity and resident-update ownership. Ellis: feasibility and council record. Mo: supplier scope and capacity. Ruth: access, preferences and fallback. Nia: operational evidence, not authority to commit another team. '+(f.approved?'Required owners have agreed the trial scope.':'Sponsor endorsement alone cannot bind the other owners.')},
    {title:'Test and decision log',status:f.tested?'Reviewed':f.implemented?'Under test':'Draft',body:(f.requestedFeed||f.requestedOwner?'Requested: '+(f.requestedFeed?'completion feed':'')+(f.requestedFeed&&f.requestedOwner?' and ':'')+(f.requestedOwner?'resident-update owner':'')+'. ':'No handoff intervention committed yet. ')+(f.tested?'Observed: unusable SMS link. '+(f.accessible?'Preferred phone fallback delivered by the named owner.':f.held?'Notification trial paused pending a valid route.':'No effective new update route delivered.'):'Next: test whether the resident actually receives an accessible update. Limit claims to this fictional case.')}
  ];
}
