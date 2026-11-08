import {getOperatingModel} from './operating-model.js?v=operating-20261105-r4';
import {getCaseHistory} from './case-history.js?v=contact-story-20261105-r3';
/* One fictional housing repair, expressed as connected service-design views.
 * This module interprets the existing scenario state. It never changes that state.
 * Current, proposed and tested views deliberately have different evidence boundaries.
 */

export const blueprintStages = [
  {id:'report',title:'Report',subtitle:'A leaking kitchen tap',touchpoint:'Phone or online form',feeling:'Concerned',feelingLevel:2},
  {id:'assess',title:'Assess',subtitle:'Understand the repair',touchpoint:'Adviser conversation',feeling:'Heard',feelingLevel:3},
  {id:'schedule',title:'Schedule',subtitle:'Wait for capacity',touchpoint:'No new resident contact',feeling:'Uncertain',feelingLevel:2},
  {id:'book',title:'Arrange a visit',subtitle:'Make access workable',touchpoint:'Booking conversation',feeling:'Reassured',feelingLevel:4},
  {id:'visit',title:'Repair',subtitle:'The operative attends',touchpoint:'At home',feeling:'Relieved',feelingLevel:4},
  {id:'complete',title:'Record completion',subtitle:'A finished job, a missing update',touchpoint:'No council confirmation',feeling:'Unsure',feelingLevel:2},
  {id:'confirm',title:'Close the loop',subtitle:'An understood outcome',touchpoint:'Resident chase call',feeling:'Frustrated',feelingLevel:1}
];

export const blueprintLanes = [
  {id:'resident',title:'Alex’s experience',subtitle:'Needs, actions and feelings',icon:'◉'},
  {id:'touchpoints',title:'Touchpoints',subtitle:'What Alex can encounter',icon:'↔'},
  {id:'frontstage',title:'Frontstage',subtitle:'People and service visible to Alex',icon:'☷'},
  {id:'backstage',title:'Backstage',subtitle:'Operational work behind the experience',icon:'⚙'},
  {id:'systems',title:'Systems & data',subtitle:'Records, events and information',icon:'⌘'},
  {id:'ownership',title:'Ownership & rules',subtitle:'Responsibilities, authority and exceptions',icon:'✓'}
];

const boundaries = [
  {id:'interaction',title:'Line of interaction',afterLane:'touchpoints',detail:'The resident encounters a channel or person. An internal queue is not itself a resident touchpoint.'},
  {id:'visibility',title:'Line of visibility',afterLane:'frontstage',detail:'Visible contact and on-site work sit above this line. Coordination and operational decisions sit below it.'},
  {id:'support',title:'Line of internal support',afterLane:'backstage',detail:'Operational teams depend on systems, information and enabling responsibilities.'}
];

const personas = [
  {id:'alex',name:'Alex Morgan',role:'Resident',imageKey:'alex',summary:'42 · council tenant · parent · rotating shifts',needs:['A workable appointment around shifts and school','A clear repair outcome without repeated chasing','Phone and assisted routes as well as digital contact'],quote:'“The tap is fixed. I still need to know whether the job is closed.”',assumptions:['Fictional authored persona, not a research segment.','Age, family situation, preferences and feelings are scenario assumptions.','A supported phone account is obtained through the discovery route and Nia; the portrait is an illustration.']},
  {id:'nia',name:'Nia',role:'Contact adviser',imageKey:'nia',summary:'Frontline knowledge · repeated chase calls',needs:['A status she can trust','A safe way to describe workarounds','Clear responsibility for the next resident update'],quote:'“We had to ask the contractor, then call Alex back.”',assumptions:['Fictional role and authored account.','The account becomes available through investigation; it needs comparison with operational records.','The illustrated face does not represent a real council employee.']},
  {id:'priya',name:'Priya',role:'Housing lead',imageKey:'priya',summary:'Receiving owner · constrained staff capacity',needs:['A bounded request her team can fulfil','A clear escalation and contact route','Operational responsibility agreed with the right people'],quote:'“Tell me exactly what my team is agreeing to own.”',assumptions:['Fictional role and authored constraints.','Trial agreement is distinct from a signed organisation-wide service agreement.','Capacity and responsibilities must be confirmed, not inferred from attendance.']},
  {id:'mo',name:'Mo',role:'Repairs contractor lead',imageKey:'mo',summary:'Supplier boundary · work orders and capacity',needs:['An agreed completion payload','Capacity for urgent incidents and planned work','A receiving team that accepts the handoff'],quote:'“The completion record exists. Who needs it, and who accepts it?”',assumptions:['Fictional supplier role and authored account.','The operative’s visit is visible to the resident although the contractor is an external organisation.','A completion record does not, by itself, allocate council responsibility.']}
];

const baseSource='Supplied fictional case record · H104';
const sourceFor=(state,id,fallback=baseSource)=>state.visited?.includes(id)?`Supplied fictional case record · ${id==='nia'?'Nia':id==='priya'?'Priya':id==='mo'?'Mo':id==='ellis'?'Ellis':id==='ruth'?'Ruth':'Sam'}’s role perspective consulted`:fallback;
const asArray=value=>Array.isArray(value)?value:[];
const labelForStage=id=>blueprintStages.find(s=>s.id===id)?.title||id;

function cell(lane,stage,title,detail,actor,extra={}) {
  return {id:`${lane}-${stage}`,lane,stage,title,detail,actor,status:'record',source:baseSource,system:'',dependencies:[],risk:'',record:'',payload:'',acceptance:'',...extra};
}

function stateContext(state,view){
  const f=state.flags||{};
  const kind=['current','proposed','tested'].includes(view)?view:'current';
  const requestedFeed=Boolean(f.requestedFeed),requestedOwner=Boolean(f.requestedOwner);
  const observed=kind==='tested'&&Boolean(f.tested);
  const feed=kind==='proposed'?requestedFeed:observed&&Boolean(f.feed);
  const owner=kind==='proposed'?requestedOwner:observed&&Boolean(f.owner);
  const accessible=observed&&Boolean(f.accessible);
  const proposalSelected=requestedFeed||requestedOwner||state.choices?.some(c=>c.step==='delivery');
  const dependencies=asArray(f.dependencies).slice();
  if(kind==='proposed'&&(feed||owner)&&!f.approved&&!dependencies.length)dependencies.push('The receiving owner, supplier, technology and access decisions have not all been obtained.');
  const blocked=kind==='proposed'&&(feed||owner)&&(!f.approved||!f.mapped||dependencies.length>0);
  return {f,kind,requestedFeed,requestedOwner,observed,feed,owner,accessible,proposalSelected,dependencies,blocked};
}

function buildCells(state,c){
  const f=c.f;
  const residentAccount=Boolean(f.research&&state.visited?.includes('nia'));
  const compared=Boolean(f.mapped);
  const validated=Boolean(compared&&['ellis','mo'].every(id=>state.visited?.includes(id)));
  const residentSource=residentAccount?'Supported fictional resident account, represented through Nia':'Authored scenario assumption · resident experience not yet investigated';
  const changeStatus=c.kind==='proposed'?(c.blocked?'blocked':'proposed'):'observed';
  const changeSource=c.kind==='proposed'?'Selected test proposal · not an observed outcome':'Observed in this authored simulation · one fictional case';
  const feedStatus=c.feed?changeStatus:'gap';
  const ownerStatus=c.owner?changeStatus:'gap';
  const proposedRoute=c.kind==='proposed'&&c.owner;
  const updated=c.observed&&c.owner&&c.accessible;
  const atHome='At Alex’s home · external to the council';
  const records=[
    cell('resident','report','Ask for a repair','Alex submits the online repair form on Day 1 at 09:12. An acknowledgement email arrives one minute later; the form includes contact and access preferences.','alex',{status:residentAccount?'account':'assumption',source:residentSource}),
    cell('resident','assess','Explain the impact','Alex describes the fault, access needs and circumstances relevant to the appointment. Demographic details do not determine urgency.','alex',{status:residentAccount?'account':'assumption',source:residentSource}),
    cell('resident','schedule','Wait for a slot','Alex is waiting for an appointment while two earlier jobs remain in the illustrative scheduling queue. A delayed acknowledgement letter arrives during this wait with a different contact timescale.','alex',{status:'assumption',source:'Authored fictional contact log · H104'}),
    cell('resident','book','Agree access','Alex agrees a workable appointment. A change in shifts or school arrangements could require another contact.','alex',{status:residentAccount?'account':'assumption',source:residentSource}),
    cell('resident','visit','Let the operative in','The contractor attends and repairs the tap. This repair activity stays the same in every tested branch.','alex',{record:'Repair visit',source:baseSource}),
    cell('resident','complete',updated?'Receive an update':proposedRoute?'Receive a preferred-route update':'Wonder what happens next',updated?'The named owner uses the phone fallback after the SMS link fails. Alex understands the repair outcome.':proposedRoute?'The proposed owner contacts Alex through an agreed route. This remains a proposal until the test is authorised and run.':'The tap is fixed, but no effective council update confirms the service outcome.','alex',{status:updated?'observed':proposedRoute?changeStatus:'gap',source:updated||proposedRoute?changeSource:residentSource,dependencies:proposedRoute?c.dependencies:[],risk:updated?'':'R1'}),
    cell('resident','confirm',updated?'Understand the outcome':proposedRoute?'Confirm understanding':'Chase for confirmation',updated?'No resident chase is needed in this fictional test because the owner delivers an accessible update.':proposedRoute?'Check whether Alex understood the update; sending a notification alone is not proof of understanding.':c.observed&&c.feed?'Alex still contacts the council, but Nia can explain the result from the received completion record without a manual status enquiry.':'Alex contacts the council again. Nia checks the contractor’s status and explains the result.','alex',{status:updated?'observed':proposedRoute?changeStatus:c.observed?'observed':'gap',source:c.observed||proposedRoute?changeSource:residentSource,risk:updated?'':'R1'}),

    cell('touchpoints','report','Online form + email','Alex uses the online form. The automatic acknowledgement email arrives after one minute. Other reporting routes may exist, but this case has a specific contact history.','alex',{system:'Contact channels'}),
    cell('touchpoints','assess','Adviser conversation','A conversation makes the reported fault and access context explicit.','nia',{source:sourceFor(state,'nia')}),
    cell('touchpoints','schedule','Delayed postal letter','A duplicate acknowledgement letter posted on Day 1 arrives on Day 4, after the assessment call. Its ten-working-day wording differs from the earlier email.','alex',{status:'record',source:'Authored fictional contact log · H104'}),
    cell('touchpoints','book','SMS + correction call','A booking SMS omits the recorded access need. Alex waits 18 minutes on the phone to agree the revised Day 9 visit window, 11:00–13:00.','nia',{status:'record',record:'Authored booking SMS and correction call · H104'}),
    cell('touchpoints','visit','At-home visit','The resident meets the operative at home. The supplier organisation crosses into the frontstage experience here.','mo',{record:atHome}),
    cell('touchpoints','complete',updated?'Preferred phone update':proposedRoute?'Agreed contact + fallback':'Missing completion message',updated?'A failed SMS link triggers the agreed phone update.':proposedRoute?'Confirm contact preference, understandable wording and an assisted alternative before testing.':'No effective completion message reaches Alex from the council.','priya',{status:updated?'observed':proposedRoute?changeStatus:'gap',source:updated||proposedRoute?changeSource:baseSource,risk:updated?'':'R3'}),
    cell('touchpoints','confirm',updated?'Acknowledged outcome':proposedRoute?'Check the update worked':'Another phone call',updated?'Alex receives an understood outcome in the preferred channel. This does not establish accessibility for all residents.':proposedRoute?'Check receipt and understanding, including people using assisted routes.':'The resident’s chase creates a new contact that staff must resolve.','nia',{status:updated?'observed':proposedRoute?changeStatus:c.observed?'observed':'gap',source:c.observed||proposedRoute?changeSource:baseSource,risk:updated?'':'R1'}),

    cell('frontstage','report','Automatic acknowledgement','The form creates H104 and triggers an email promising adviser contact by Wednesday 17:00. The first human conversation follows on Day 3.','contact service',{source:sourceFor(state,'nia'),payload:'Reported fault, property reference, access and contact information',acceptance:'Repair case is created and can be retrieved by the receiving team.'}),
    cell('frontstage','assess','Clarify the need','The adviser clarifies the fault and relevant circumstances, escalating an urgent issue through the appropriate route.','nia',{source:sourceFor(state,'nia'),risk:'R5'}),
    cell('frontstage','schedule','Old template arrives by post','An acknowledgement letter arrives after the adviser call and does not reflect what has already happened. Its wording adds a different timescale and warns against duplicate enquiries.','contact service',{status:'record',source:'Authored fictional postal record · H104'}),
    cell('frontstage','book','Agree an appointment','Staff agree the visit and record the arrangements the operative needs to honour.','nia',{status:'record',payload:'Appointment and access arrangements',acceptance:'Resident and delivery team have a compatible arrangement.'}),
    cell('frontstage','visit','Mo’s operative repairs','An operative performs the repair and explains what has been done. A visible visit does not automatically update council records.','mo',{source:sourceFor(state,'mo'),record:atHome}),
    cell('frontstage','complete',c.owner?'Priya’s team owns the update':'Nobody owns the update',c.owner?(c.kind==='proposed'?'Priya’s team is proposed as the receiving owner, subject to agreed capacity and an accessible route.':'The bounded test assigns the receiving team responsibility for the resident update.'):'The baseline has no explicitly assigned receiving owner for the resident update.','priya',{status:ownerStatus,source:c.owner?changeSource:baseSource,dependencies:c.kind==='proposed'&&c.owner?c.dependencies:[],risk:c.owner?'':'R1',acceptance:c.owner?'Owner accepts the completion information and the duty to update Alex.':'Acceptance owner is missing.'}),
    cell('frontstage','confirm',updated?'Close the loop by phone':c.owner&&c.observed?'Owner exists; route unresolved':proposedRoute?'Test the preferred-route update':'Nia handles the chase',updated?'The owner delivers the phone fallback and confirms an understood outcome.':c.owner&&c.observed?'The owner is named, but the notification trial has not delivered an accessible update.':proposedRoute?'The owner must check receipt and understanding, rather than count messages sent.':c.observed&&c.feed?'Nia responds to Alex’s chase using the shared completion record. The missing update owner still caused another contact.':'Nia responds to Alex’s chase and obtains the status through a manual check if needed.',updated||proposedRoute||c.owner&&c.observed?'priya':'nia',{status:updated?'observed':proposedRoute?changeStatus:c.observed?'observed':'gap',source:c.observed||proposedRoute?changeSource:sourceFor(state,'nia'),risk:updated?'':'R3'}),

    cell('backstage','report','Create repair H104','The request becomes an operational case that can move across teams and the supplier.','priya',{record:'Council repair case H104',payload:'Case reference + fault + access context'}),
    cell('backstage','assess','Triage the case','The team checks the repair need, responsibility and any urgent exception. No priority timetable is asserted by this example.','priya',{status:'assumption',source:'Authored operating sequence · local policy not recovered',risk:'R5'}),
    cell('backstage','schedule','Queue the work','The scheduler places the job behind two earlier jobs in the supplied illustration. Capacity and urgency can change the order.','priya',{record:'Scheduling queue',risk:'R4'}),
    cell('backstage','book','Allocate the visit','The council and supplier coordinate an operative, appointment and access arrangement.','mo',{source:sourceFor(state,'mo'),payload:'Work order + agreed appointment + access instructions',acceptance:'Supplier accepts the job within the agreed scope.'}),
    cell('backstage','visit','Complete the work order','The operative performs the repair and records the result in the contractor’s system.','mo',{source:sourceFor(state,'mo'),record:'Supplier work order H104'}),
    cell('backstage','complete','Supplier marks complete','Mo’s organisation holds the completed job. The baseline failure is the onward handoff, not failure to repair the tap.','mo',{source:sourceFor(state,'mo'),payload:'Case reference + completion result + exceptions',acceptance:c.feed?'Council receives and matches the completion event.':'No shared receiving process in the baseline.',status:c.feed?changeStatus:'record'}),
    cell('backstage','confirm',c.feed?'Use the received status':'Check with the contractor',c.feed?(c.kind==='proposed'?'The proposed feed could remove the manual status check once implemented and tested.':'The completion feed supplies the status without the adviser checking manually.'):'The adviser contacts the contractor for the completion result. Naming an update owner alone does not remove this manual check.','nia',{status:c.feed?changeStatus:c.observed?'observed':'record',source:c.feed||c.observed?changeSource:sourceFor(state,'nia'),record:c.feed?'Received completion event':'Manual completion enquiry'}),

    cell('systems','report','Council repair record','A council record links the reported issue to H104.','ellis',{system:'Council repair record',record:'H104',payload:'Repair ID, fault and relevant contact/access fields'}),
    cell('systems','assess','Case and policy context','Triage needs the case context and the appropriate operational policy. The exact policy and its targets have not been supplied.','ruth',{system:'Case record + operational policy',status:'assumption',source:'Authored system view · policy document not recovered'}),
    cell('systems','schedule','Scheduling queue','The queue represents operational demand and capacity. It is not automatically shared with the resident.','ellis',{system:'Scheduling record',record:'Two earlier illustrative jobs'}),
    cell('systems','book','Appointment record','Appointment and access information must agree across the council and supplier records.','ellis',{system:'Council diary ↔ supplier work order',status:'assumption',risk:'R2'}),
    cell('systems','visit','Supplier work order','The operative works against the supplier’s job record.','mo',{system:'Supplier work-order system',record:'Contractor job H104',source:sourceFor(state,'mo')}),
    cell('systems','complete',c.feed?'Completion event shared':'Completion stays outside',c.feed?(c.kind==='proposed'?'Selected proposal: share a bounded completion payload, with acceptance and exception handling agreed.':'In this authored test, the contractor’s completion event reaches council records.'):'The supplier record says complete; the council does not receive that event in the baseline.','ellis',{system:'Supplier → council boundary',status:feedStatus,source:c.feed?changeSource:validated?'Case-record comparison with consulted Ellis and Mo':compared?'Designer synthesis of supplied case records':baseSource,dependencies:c.kind==='proposed'&&c.feed?c.dependencies:[],risk:c.feed?'':'R2',payload:'Repair ID + completion result + exception indicator',acceptance:c.feed?'Council matches H104 and accepts or rejects the event explicitly.':'No accepted completion payload across the boundary.'}),
    cell('systems','confirm',c.feed?'A usable completion status':'Council status is incomplete',c.feed?'The receiving record contains a completion status. It still needs a human update owner and an accessible resident route.':'The receiving system cannot confirm the result without someone asking the contractor.','ellis',{system:'Council repair record',status:c.feed?changeStatus:'gap',source:c.feed?changeSource:baseSource,risk:c.feed?'':'R2'}),

    cell('ownership','report','Contact responsibility','The receiving contact team captures the request. Wider repair policy and service expectations must be recovered before treating them as agreed standards.','nia',{source:'Authored role outline · not an approved RACI'}),
    cell('ownership','assess','Operational authority','Housing owns triage and the relevant priority rules. Safety exceptions need the appropriate operational authority.','priya',{source:'Authored role outline · local policy not recovered',risk:'R5'}),
    cell('ownership','schedule','Capacity & escalation','The delivery team must distinguish an urgent incident from an ordinary queue change. A designer cannot allocate additional staff by drawing a map.','priya',{source:sourceFor(state,'priya'),risk:'R4'}),
    cell('ownership','book','Supplier acceptance','The supplier accepts the work and appointment boundary; the resident needs a workable access arrangement.','mo',{source:sourceFor(state,'mo'),payload:'Accepted work and appointment',acceptance:'Named supplier role accepts the work, not simply receives a message.'}),
    cell('ownership','visit','Resident and operative safety','Existing responsibilities, access and safety rules still apply to the visit. This simulation does not set new legal or contractual duties.','ruth',{source:'Authored control question · actual local requirements not supplied',risk:'R5'}),
    cell('ownership','complete',c.owner?'Named receiving owner':'Receiving owner missing',c.owner?'Priya’s team accepts the responsibility for Alex’s update within the bounded test. Receiving data and owning the update are separate commitments.':'No receiving role accepts responsibility for the resident update after completion.','priya',{status:ownerStatus,source:c.owner?changeSource:baseSource,dependencies:c.kind==='proposed'&&c.owner?c.dependencies:[],risk:c.owner?'':'R1',acceptance:c.owner?'Priya accepts update responsibility within the agreed capacity.':'No update responsibility accepted.'}),
    cell('ownership','confirm',updated?'Accessible fallback delivered':proposedRoute?'Agree contact and fallback':'Service expectation unresolved',updated?'The named owner uses Alex’s preferred phone route after the SMS failure. Wider service-level targets remain to be agreed.':proposedRoute?'Housing, supplier and access owners agree who contacts the resident, how exceptions are handled and what will be checked. No time target has been invented.':'Recover the existing service commitments and agree who closes the loop. Technical uptime alone is not an end-to-end resident service standard.','ruth',{status:updated?'observed':proposedRoute?changeStatus:'gap',source:updated||proposedRoute?changeSource:sourceFor(state,'ruth','Unknown agreement · not recovered'),risk:updated?'':'R3'})
  ];
  return records;
}

function buildConnections(c){
  const connections=[];
  const add=(from,to,kind,label,extra={})=>connections.push({id:`${from}__${to}`,from,to,kind,label,status:'record',detail:'Linked elements of the same authored service case.',payload:'',acceptance:'',boundary:'',...extra});
  blueprintStages.slice(0,-1).forEach((stage,i)=>add(`resident-${stage.id}`,`resident-${blueprintStages[i+1].id}`,'flow','Resident journey',{detail:'An illustrative sequence of needs and actions. Emotions are authored, not measured.'}));
  for(const stage of ['report','assess','book','visit']){
    add(`resident-${stage}`,`touchpoints-${stage}`,'interaction','Resident contact');
    add(`touchpoints-${stage}`,`frontstage-${stage}`,'interaction','Visible service interaction');
  }
  add('frontstage-report','backstage-report','handoff','Create a repair case',{payload:'Reported fault + property/repair reference + access context',acceptance:'Case can be retrieved for triage.',detail:'The report becomes an operational object. Initial triage roles are an authored outline.'});
  add('backstage-report','backstage-assess','flow','Assess the work');
  add('backstage-assess','backstage-schedule','flow','Place in the queue');
  add('backstage-schedule','backstage-book','handoff','Allocate a visit',{payload:'Work order + agreed appointment + access instructions',acceptance:'Supplier accepts the job within its capacity and scope.',boundary:'Council → repairs supplier'});
  add('backstage-book','frontstage-visit','handoff','Operative attends',{payload:'Accepted job and appointment',acceptance:'Resident access is workable; operative can perform the job.',boundary:'Supplier → resident’s home'});
  add('frontstage-visit','backstage-visit','flow','Record the work');
  add('backstage-visit','systems-visit','data','Update work order');
  add('systems-visit','backstage-complete','data','Completion result');
  add('backstage-complete','systems-complete','data','Supplier completion event',{payload:'H104 + completion result + exception indicator',acceptance:'Supplier completion record exists.',boundary:'Repairs supplier system'});
  add('systems-complete','systems-confirm','data',c.feed?'Completion feed':'Missing completion feed',{status:c.feed?(c.kind==='proposed'?(c.blocked?'blocked':'proposed'):'observed'):'gap',detail:c.feed?'The selected payload crosses the supplier/council boundary and is matched to the receiving case. This is separate from assigning resident-update responsibility.':'The supplier has a completion event but the council does not receive it. The repair can be complete while the information handoff fails.',payload:'Repair ID + completion result + exception indicator',acceptance:c.feed?'Receiving council record matches H104 and accepts or rejects the event.':'No receiving event acceptance in the baseline.',boundary:'Repairs supplier → council'});
  add('systems-confirm','backstage-confirm','data',c.feed?'Use shared status':'Manual status enquiry',{status:c.feed?(c.kind==='proposed'?(c.blocked?'blocked':'proposed'):'observed'):c.observed?'observed':'record',detail:c.feed?'The shared event removes the manual status check in this fictional test.':'The adviser must ask the contractor for confirmation. This manual check remains in an owner-only change.'});
  add('ownership-complete','frontstage-complete','ownership',c.owner?'Named update owner':'Missing update owner',{status:c.owner?(c.kind==='proposed'?(c.blocked?'blocked':'proposed'):'observed'):'gap',detail:'Who accepts the duty to update the resident is a human and operational commitment, not a side effect of receiving data.',payload:'Accepted completion + resident-update responsibility',acceptance:c.owner?'Priya’s team accepts the update task within the trial.':'No receiving owner accepts the task.'});
  const updated=c.observed&&c.accessible&&c.owner;
  const proposed=c.kind==='proposed'&&c.owner;
  add('frontstage-complete','touchpoints-complete','handoff',updated?'Preferred phone fallback':proposed?'Agreed contact route':'No effective resident update',{status:updated?'observed':proposed?(c.blocked?'blocked':'proposed'):'gap',detail:updated?'The SMS link failure is observed and the named owner delivers a preferred phone update.':proposed?'The contact preference and fallback need agreement; a message being sent is not proof of understanding.':'A completed repair and a supplier record do not automatically tell the resident what happened.',acceptance:updated?'Alex receives and understands the outcome.':'Resident understanding is not yet established.'});
  add('touchpoints-complete','resident-confirm','interaction',updated?'Understood outcome':proposed?'Check understanding':'Resident still unsure',{status:updated?'observed':proposed?(c.blocked?'blocked':'proposed'):'gap'});
  if(!updated&&!proposed)add('resident-confirm','frontstage-confirm','feedback','Resident chase',{status:c.observed?'observed':'gap',detail:'A further contact is needed because the service did not close the loop.'});
  return connections;
}

function buildRisks(state,c){
  const f=c.f,observed=c.observed;
  return [
    {id:'R1',title:'A repaired home, an uninformed resident',owner:'Priya · housing receiving owner',status:observed&&c.owner&&c.accessible?'Controlled in this test':c.kind==='proposed'&&c.owner?'Mitigation proposed':'Open',consequence:'Alex chases for confirmation and staff handle avoidable contact.',mitigation:'Assign an accepted update owner, preserve an accessible contact route and check whether the resident understands the outcome.',evidence:observed?'Authored trial outcome':f.research&&state.visited?.includes('nia')?'Nia’s authored account and supplied case record':'Supplied fictional baseline; seek frontline and resident accounts',stages:['complete','confirm']},
    {id:'R2',title:'Completion lost across the supplier boundary',owner:'Ellis + Mo · council technology and supplier',status:observed&&c.feed?'Controlled in this test':c.kind==='proposed'&&c.feed?'Mitigation proposed':'Open',consequence:'Council records cannot confirm the result without a manual enquiry.',mitigation:'Agree the completion payload, matching, receiving acceptance and exception handling. Confirm responsibility separately.',evidence:observed&&c.feed?'Received event in the authored trial':f.mapped?'Case-record synthesis; validate with Ellis and Mo':'Supplied fictional record comparison',stages:['book','complete','confirm']},
    {id:'R3',title:'A notification that cannot be used',owner:'Ruth + Priya · access and operational owners',status:observed&&c.accessible?'Fallback used in this test':observed?'Observed failure':'Needs testing',consequence:'A resident receives a link they cannot use, or receives no understood update.',mitigation:'Confirm contact preference, plain language, assisted alternatives and a named owner for the phone fallback.',evidence:f.tested?'SMS link failure in the authored trial, not a population finding':state.visited?.includes('ruth')?'Ruth’s authored access constraint':'Authored risk hypothesis; consult access expertise and residents',stages:['report','book','complete','confirm']},
    {id:'R4',title:'An urgent incident consumes the promised capacity',owner:'Mo + Priya · delivery and housing',status:c.kind!=='current'&&f.approved?'Bounded capacity commitment recorded':'Open dependency',consequence:'An unsupported promise displaces a genuine urgent repair or the improvement work.',mitigation:'Distinguish incident containment from improvement, agree a small capacity commitment and record who can reprioritise it.',evidence:state.visited?.includes('mo')?'Mo’s authored missed-visit account':'Authored capacity scenario; supplier account not yet heard',stages:['schedule','book','visit']},
    {id:'R5',title:'An exception is hidden by the happy path',owner:'Ruth + housing operational authority',status:'Not resolved by one test',consequence:'A safety, access, repeat-visit or out-of-scope case follows an inappropriate standard route.',mitigation:'Recover the actual policy and existing service standards. Add exception and escalation routes before extending the trial.',evidence:'Scope limitation of this fictional single-case model',stages:['assess','book','visit','confirm']},
    {id:'R6',title:'Useful knowledge stops being shared',owner:'Designer + team leads',status:f.disrespect||f.exposed?'Conduct risk materialised':'Monitor participation',consequence:'Evidence becomes thinner and future voluntary participation falls even if the technical change works.',mitigation:'Agree attribution, facilitate airtime, correct misrepresentation and repair specific broken commitments.',evidence:f.disrespect||f.exposed?'Recorded player conduct and authored stakeholder responses':'Authoring risk; not a diagnosis of a personality type',stages:['assess','complete','confirm']}
  ];
}

function buildAgreements(state,c){
  const f=c.f;
  const trial=f.approved?'Bounded trial agreement recorded':'Draft for the relevant owners';
  return [
    {id:'A1',title:'Resident-facing service standard',parties:['Housing service','Residents'],status:'Case promises available; formal standard unverified',expectation:'Compare the acknowledgement, letter and spoken callback promises in the fictional contact log. Recover the applicable organisation-wide standard and exceptions.',measure:'The case contains authored message promises, not verified service-wide response targets. Check applicability and authority before assessing formal compliance.',authority:'Housing service owner, relevant policy/contract authority and resident input',scope:'End-to-end resident service, across channels and teams'},
    {id:'A2',title:'Completion handoff and supplier commitment',parties:['Council housing','Repairs supplier','Council technology'],status:c.kind==='current'?'Existing agreement unknown':trial,expectation:'Define what completion means, which payload is sent, who receives it and how rejection or missing data is handled.',measure:'Record completion-event receipt, matching and exceptions. Agree any latency or quality target with the contracting authorities.',authority:'Council operational/contract owner and supplier authority, supported by technology',scope:'Cross-organisation operational agreement, not only a technical interface'},
    {id:'A3',title:'Resident-update responsibility',parties:['Housing receiving owner','Contact service','Repairs supplier'],status:c.kind==='current'?'No update owner in this baseline':c.owner?trial:'Owner not yet assigned',expectation:'Name the receiving owner, accepted workload, trigger for the update and escalation if the owner cannot act.',measure:'Check whether an understood update reaches the resident. A future time target must be negotiated rather than assumed.',authority:'Priya and the relevant housing/contact-service authority; supplier input for the completion trigger',scope:'Operational responsibility and service expectation'},
    {id:'A4',title:'Contact preference and accessible fallback',parties:['Resident','Housing owner','Access/policy lead'],status:c.kind==='current'?'Local contact policy not recovered':c.observed&&c.accessible?'Fallback used in this bounded test':trial,expectation:'Agree a usable preferred contact route and an owner for the alternative when a notification fails. Review appropriate use of contact information.',measure:'Check receipt, understanding and fallback use with relevant residents. One successful phone update is not universal accessibility evidence.',authority:'Relevant operational and access/policy authorities, with the resident’s contact preference',scope:'Accessible communication across the service'},
    {id:'A5',title:'Internal technology support arrangement',parties:['Council technology','Housing operations','Supplier technical contact'],status:state.visited?.includes('ellis')?'Support questions identified':'Not yet investigated',expectation:'Agree who supports the completion connection, monitors failures and restores the service when records diverge.',measure:'Define support coverage, error signals and escalation. No uptime or response-time target has been supplied.',authority:'Technology and operational owners; commercial authority where a supplier obligation changes',scope:'Internal support/operating-level arrangement; does not replace resident or supplier service commitments'}
  ];
}

export function getBlueprintModel(state={}, {view='current'}={}) {
  const c=stateContext(state,view);
  const stages=blueprintStages.map(s=>({...s}));
  const caseHistory=getCaseHistory(c);
  for(const stage of stages){const record=caseHistory.stages.find(r=>r.id===stage.id);stage.contactHistory=record;stage.touchpoint=record.channels.length?record.channels.map(id=>caseHistory.channels.find(c=>c.id===id).name).join(' + '):'No contact received';}
  if(c.kind==='proposed'&&c.owner){
    Object.assign(stages[5],{touchpoint:'Proposed preferred-route update',feeling:'Hopes for clarity',feelingLevel:3});
    Object.assign(stages[6],{touchpoint:'Understanding to be tested',feeling:'Outcome untested',feelingLevel:3});
  }
  if(c.observed&&c.owner&&c.accessible){
    Object.assign(stages[5],{touchpoint:'SMS fails; phone fallback',feeling:'Uncertain, then heard',feelingLevel:3});
    Object.assign(stages[6],{touchpoint:'Preferred phone update',feeling:'Informed',feelingLevel:4});
  }
  const gaps=[];
  if(!c.feed)gaps.push('Completion information does not cross into the council record.');
  if(!c.owner)gaps.push('No receiving owner has accepted the resident-update task.');
  if(c.observed&&!c.accessible)gaps.push('The notification trial has not delivered an accessible update.');
  if(c.kind==='proposed')gaps.push(...c.dependencies);
  if(c.kind==='tested'&&!c.observed)gaps.push('The notification trial has not been run. This view retains the supplied baseline.');
  gaps.push('Existing service-level commitments, exceptions and numerical targets still need to be recovered or agreed.');
  const viewStatus=c.kind==='current'?'Supplied fictional baseline':c.kind==='proposed'?(!c.proposalSelected?'No intervention selected':c.blocked?'Proposed, decisions outstanding':'Selected bounded proposal'):c.observed?'Observed authored trial':'Trial not run';
  const summary=c.kind==='current'?'A finished repair can still leave an unfinished service. The completion feed and the resident-update owner are separate gaps.':c.kind==='proposed'?'This is the selected operating proposal. It shows requested changes and their dependencies, not a measured improvement.':c.observed?'This view reflects the actual chosen branch of one authored trial. The repair and scheduling queue stay the same.':'No trial result is available yet. Baseline records are shown without claiming a future outcome.';
  return {view:c.kind,viewStatus,summary,caseHistory,operating:getOperatingModel(state,c),stages,lanes:blueprintLanes.map(l=>({...l})),cells:buildCells(state,c),connections:buildConnections(c),personas:personas.map(p=>({...p,needs:p.needs.slice(),assumptions:p.assumptions.slice()})),risks:buildRisks(state,c),agreements:buildAgreements(state,c),gaps:[...new Set(gaps)],boundaries:boundaries.map(b=>({...b})),legend:[{status:'record',label:'Supplied fictional record'},{status:'account',label:'Authored account heard'},{status:'assumption',label:'Assumption / not yet investigated'},{status:'gap',label:'Missing handoff or responsibility'},{status:'proposed',label:'Selected proposal'},{status:'blocked',label:'Proposal awaiting decisions'},{status:'observed',label:'Observed in the authored trial'}],emotionNote:'Feelings are authored qualitative illustrations. They are not research findings, demographic predictions or numerical emotion scores.'};
}

export function getPracticeContext(state={}, {opened=false,selected=null}={}) {
  if(!opened)return [];
  const f=state.flags||{},step=Number(state.step)||0,visited=asArray(state.visited);
  const has=id=>visited.includes(id),isSelected=ids=>ids.includes(selected);
  const cards=[
    {id:'blueprint',title:'Service blueprint',phase:'Sense-making',available:true,inuse:Boolean(f.mapped),relevant:step>=1&&step<=4||isSelected(['ellis','mo']),priority:step===2?100:70,reason:'Inspect the supplied baseline, then connect resident experience to operations, data, responsibility and evidence.',action:'Open the visual blueprint',actors:['alex','nia','priya','ellis','mo']},
    {id:'research',title:'Research and evidence plan',phase:'First week / discovery',available:true,inuse:Boolean(f.research||f.reportsOnly||f.exposed),relevant:step<=2,priority:step<=1?100:60,reason:'Choose whose account is missing, arrange supported access and distinguish an account from a validated service model.',action:'Plan the next conversation',actors:['nia','priya','ruth','alex']},
    {id:'stakeholders',title:'People, influence and participation',phase:'Investigation / alignment',available:true,inuse:visited.length>0,relevant:step<=3||Boolean(selected),priority:selected?95:75,reason:'Show responsibilities, informal influence and missing voices. Behavioural patterns are useful in the context of a real conversation or meeting.',action:'Inspect the relevant people',actors:selected?[selected]:['sam','priya','nia','ellis','ruth','mo']},
    {id:'journey',title:'Persona and resident journey',phase:'Discovery / testing',available:step>=1||has('nia'),inuse:Boolean(f.research&&has('nia')),relevant:step===1||step===2||step>=5||selected==='nia',priority:selected==='nia'?98:step===1?90:60,reason:'Explore the illustrated resident’s needs, channels and authored feelings. Validate assumptions through supported research.',action:'See Alex’s perspective',actors:['alex','nia']},
    {id:'risks',title:'Risk and assumption register',phase:'Across the service',available:step>=1||has('ruth'),inuse:Boolean(f.tested||has('ruth')),relevant:step>=2||selected==='ruth'||selected==='mo',priority:selected==='ruth'?100:step>=5?95:70,reason:'Track service harm, inaccessible communication, missing information, capacity and participation, with owners and evidence.',action:'Inspect the risk register',actors:['ruth','priya','mo','ellis']},
    {id:'agreements',title:'Service expectations and agreements',phase:'Alignment / delivery',available:step>=3||isSelected(['priya','mo','ruth']),inuse:Boolean(f.approved),relevant:step>=3&&step<=5||isSelected(['priya','mo','ruth']),priority:step===3?98:isSelected(['priya','mo','ruth'])?85:70,reason:'Recover resident-facing standards and supplier commitments, then agree a bounded update/handoff responsibility. Internal technology support is only one part.',action:'Inspect service commitments',actors:['priya','mo','ruth','ellis','sam']},
    {id:'decisions',title:'Options and decision record',phase:'Sense-making / alignment',available:step>=2||Boolean(f.mapped),inuse:step>=3,relevant:step>=2&&step<=4,priority:step===3?95:80,reason:'Compare doing nothing, sharing completion data, assigning an update owner, or both. Record rationale and who can authorise the test.',action:'Compare the operating options',actors:['sam','priya','ellis','mo','ruth']},
    {id:'operating',title:'Future operating model',phase:'Delivery design',available:step>=4||Boolean(f.approved),inuse:Boolean(f.implemented),relevant:step===4||step>=5&&Boolean(f.implemented),priority:step===4?95:65,reason:'Connect the proposed people, process, systems, capacity, governance and supplier handoff. The first trial is not a complete organisation-wide target model.',action:'Inspect the future service',actors:['priya','ellis','mo','ruth']},
    {id:'testing',title:'Prototype and trial plan',phase:'Alpha / beta test',available:step>=4||Boolean(f.polished),inuse:Boolean(f.implemented||f.tested||f.polished),relevant:step>=4,priority:step===5?100:85,reason:'Test the operating change and the resident’s understanding, including notification failure and an assisted fallback. A polished screen is not enough.',action:'Inspect the bounded trial',actors:['alex','nia','priya','ellis','ruth','mo']},
    {id:'monitoring',title:'Live measures and improvement',phase:'Live, after further validation',available:Boolean(f.tested),inuse:false,relevant:Boolean(f.tested),priority:f.tested?90:0,reason:'Plan how to monitor understood outcomes, repeat contacts, exceptions, effort and ownership. The fictional trial is not a live service launch.',action:'Plan the next evidence check',actors:['priya','nia','ellis','mo']}
  ];
  return cards.map(card=>{const {inuse,...rest}=card;const status=!card.available?'later':inuse?'inuse':'available';return {...rest,status,statusLabel:status==='later'?'Later in the work':status==='inuse'?'In use':'Available now',context:card.reason};}).sort((a,b)=>b.priority-a.priority);
}

