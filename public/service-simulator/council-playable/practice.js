import {getBlueprintModel,getPracticeContext} from './blueprint-data.js';
import {canInspectService,knownPeople} from './entry-points.js?v=investigation-20261106-r1';
import {people,archetypes} from './scenario.js';

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const positions={alex:'0% 0%',nia:'100% 0%',priya:'0% 100%',mo:'100% 100%'};
const portrait=(id,name,cls='')=>positions[id]?`<span class="practice-portrait ${cls}" style="background-position:${positions[id]}" role="img" aria-label="Illustrated fictional ${esc(name)}"></span>`:`<span class="practice-role-image ${cls}" aria-hidden="true">${icon('people')}</span>`;
function icon(id){const paths={blueprint:'M3 4h18v16H3zM3 9h18M8 4v16M14 9v11M3 14h18',research:'M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14m5-2 6 6',stakeholders:'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6m8-1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5M2 21v-3a6 6 0 0 1 12 0v3m2-8a5 5 0 0 1 5 5v3',journey:'M3 7h6v5h6v5h6M3 3v7m18 4v7',risks:'M12 3 2 21h20zM12 9v5m0 3v1',agreements:'M5 3h14v18H5zM8 8h8m-8 4h8m-8 4h5',decisions:'M5 3v9h14M5 12v9m14-9-4-4m4 4-4 4',operating:'M3 4h7v6H3zm11 10h7v6h-7zM7 10v7h7m3-3V7h-7',testing:'M8 3v6L3 19v2h18v-2L16 9V3M6 3h12M7 15h10',monitoring:'M3 19h18M3 5v14m1-5 5-5 4 3 7-8',people:'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21v-2a8 8 0 0 1 16 0v2'};return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[id]||paths.blueprint}"/></svg>`;}

export function createPracticeWorkspace({getState,onOpenBlueprint,onPersonSelect}){
  const host=document.querySelector('#artefacts');
  let context={opened:false,selected:null},detail=null;
  function update(next={}){
    context={...context,...next};const s=getState();const title=document.querySelector('#evidence-title');
    if(!context.opened){
      title.textContent='The right tools, at the right moment.';
      host.innerHTML=`<div class="practice-map-intro"><span class="practice-feature-icon">${icon('blueprint')}</span><div><h3>Step inside a service to reveal its working layer.</h3><p>People, evidence, risk and responsibility belong to a particular situation. The council opens into a visual blueprint and the artefacts that support the current decision.</p></div><button class="primary" id="practice-enter">Enter council</button></div>`;
      document.querySelector('#practice-enter').onclick=()=>document.querySelector('#view-toggle').click();
      return;
    }
    title.textContent=s.complete?'What the test tells us.':'Make the service visible.';
    if(!canInspectService(s)){
      detail=null;title.textContent='Find out who knows the service.';
      host.innerHTML=`<div class="practice-investigation"><p class="eyebrow">YOUR INVESTIGATION</p><h3>Follow the responsibilities.</h3><p>Begin with the commissioning contact. Ask what the assignment is for, who runs each part of the service and who can hand over the existing work. Introductions reveal contacts; conversations and records establish the evidence.</p><div class="known-contact-grid">${knownPeople(s).map(p=>`<button data-known-person="${p.id}"><strong>${esc(p.name)}</strong><span>${esc(p.role)}</span></button>`).join('')}</div><p class="current-hint">Your working model develops as you meet the relevant people, obtain the handover and check the evidence.</p></div>`;
      host.querySelectorAll('[data-known-person]').forEach(b=>b.onclick=()=>{onPersonSelect(b.dataset.knownPerson);document.querySelector('#world-stage').scrollIntoView({behavior:'instant',block:'start'});});return;
    }
    const model=getBlueprintModel(s,{view:s.complete?'tested':'current'});const cards=getPracticeContext(s,context);const featured=cards.find(c=>c.id==='blueprint');
    const relevant=cards.filter(c=>c.id!=='blueprint'&&c.available&&c.relevant).slice(0,3);
    const available=cards.filter(c=>c.id!=='blueprint'&&c.available&&!relevant.includes(c));
    while(relevant.length<3&&available.length)relevant.push(available.shift());
    host.innerHTML=`<button class="practice-feature" id="practice-blueprint" aria-label="Open the visual housing-repairs service blueprint"><div class="practice-feature-copy"><span class="practice-eyebrow">THE SHARED SERVICE MODEL</span><h3>${s.complete?'The change.<br>The consequences.':'One repair.<br>Two missing handoffs.'}</h3><p>${s.complete?'Compare the resident outcome, the operating change and the work still to do.':'See the resident experience, the work behind it and the information that never arrives.'}</p><span class="practice-open-label">Open the visual blueprint <span aria-hidden="true">↗</span></span></div><div class="practice-feature-art" aria-hidden="true"><div class="practice-face-stack">${model.personas.map(p=>portrait(p.id,p.name)).join('')}</div><div class="practice-mini-blueprint"><div class="mini-stage-row">${model.stages.map(st=>`<span>${esc(st.title)}</span>`).join('')}</div>${['Resident','Frontstage','Backstage','Data'].map((lane,i)=>`<div class="mini-lane"><span>${lane}</span>${model.stages.map((st,j)=>`<i class="mini-block mini-${i} ${j===5&&!(i===3?s.flags.feed:s.flags.owner&&s.flags.accessible)?'mini-gap':''}"></i>`).join('')}</div>`).join('')}<div class="mini-callout">${s.complete?'Observed fictional trial · inspect the handoffs':'Missing completion data <span>+</span> no update owner'}</div></div></div><span class="practice-feature-status">${s.complete?'Observed fictional test · compare perspectives':s.flags.mapped?'Working synthesis · sources and assumptions visible':'Supplied fictional baseline · inspect to validate'}</span></button><div class="practice-context-head"><p class="practice-eyebrow">USEFUL AT THIS POINT</p><p>${esc(currentPhase(s))}</p></div><div class="practice-context-grid" data-count="${relevant.length}">${relevant.map(card=>renderCard(card,model)).join('')}</div><div id="practice-detail" class="practice-detail" ${detail?'':'hidden'}></div><details class="practice-route"><summary>How the work develops <span>See the practice map</span></summary><p>A route through this council case. These are tools for decisions; using every method is not the objective.</p><div class="practice-route-grid">${cards.map(c=>`<button data-method="${esc(c.id)}" ${c.available?'':'disabled'}><span class="practice-method-icon">${icon(c.id)}</span><span><strong>${esc(c.title)}</strong><small>${esc(c.phase||'Service design')} · ${esc(c.statusLabel)}</small></span><span class="practice-method-state ${c.status}">${c.status==='later'?'Later':c.status==='inuse'?'In use':'Open'}</span></button>`).join('')}</div></details>`;
    document.querySelector('#practice-blueprint').onclick=()=>onOpenBlueprint({view:s.complete?'tested':'current',stage:'complete'});
    host.querySelectorAll('[data-method]').forEach(b=>b.onclick=()=>openMethod(b.dataset.method,cards,model));
    if(detail)renderDetail(detail,cards,model);
  }
  function renderCard(c,model){
    let preview='';
    if(c.id==='risks')preview=`<div class="practice-risk-preview">${model.risks.slice(0,2).map(r=>`<p><span class="practice-risk-dot"></span><strong>${esc(r.title)}</strong><small>${esc(r.owner)} · ${esc(r.status)}</small></p>`).join('')}</div>`;
    else if(c.id==='stakeholders'||c.id==='research'||c.id==='journey')preview=`<div class="practice-people-preview">${(c.id==='journey'?['alex']:(c.actors||[]).filter(id=>positions[id]).slice(0,3)).map(id=>portrait(id,model.personas.find(p=>p.id===id)?.name||id)).join('')}<span>${esc(c.reason)}</span></div>`;
    else preview=`<p class="practice-method-reason">${esc(c.reason)}</p>`;
    return `<button class="practice-context-card" data-method="${esc(c.id)}"><span class="practice-card-top"><span class="practice-method-icon">${icon(c.id)}</span><span class="practice-state">${esc(c.statusLabel)}</span></span><h3>${esc(c.title)}</h3>${preview}<span class="practice-card-action">${esc(c.action||'Inspect the working view')} <span aria-hidden="true">↗</span></span></button>`;
  }
  function openMethod(id,cards,model){
    if(id==='blueprint')return onOpenBlueprint({view:getState().complete?'tested':'current'});
    if(id==='risks'||id==='agreements')return onOpenBlueprint({tab:id,view:getState().complete?'tested':'current'});
    if(id==='journey')return onOpenBlueprint({tab:'blueprint',stage:'report',persona:'alex'});
    detail=id;renderDetail(id,cards,model);const el=document.querySelector('#practice-detail');el.hidden=false;el.focus({preventScroll:true});el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest'});
  }
  function renderDetail(id,cards,model){
    const c=cards.find(c=>c.id===id);if(!c){detail=null;return;}
    const el=document.querySelector('#practice-detail');el.tabIndex=-1;
    let body='';
    if(id==='stakeholders'||id==='research'){
      const actorIds=(c.actors||[]).filter(id=>people.some(p=>p.id===id));const shown=actorIds.length?people.filter(p=>actorIds.includes(p.id)):people.filter(p=>getState().visited.includes(p.id));
      body=`<div class="practice-field-people">${shown.map(p=>{const patterns=p.archetypes.map(id=>archetypes.find(a=>a.id===id));return `<article>${portrait(p.id,p.name)}<div><h4>${esc(p.name)} <small>${esc(p.role)}</small></h4><p>${esc(p.opening)}</p><details><summary>What this interaction may involve</summary>${patterns.map(a=>`<p><strong>${esc(a.name)}:</strong> ${esc(a.behaviour)} ${esc(a.constructive)}</p>`).join('')}</details><button data-speak="${esc(p.id)}">Speak with ${esc(p.name)}</button></div></article>`;}).join('')}</div><p class="practice-source-note">Fictional behaviour patterns, relevant to these conversations. They are not diagnoses or demographic predictions.</p>`;
    }else if(id==='decisions'){
      body=getState().history.length?`<ol class="practice-decision-records">${getState().history.map(h=>`<li><h4>${esc(h.title)}</h4><p>${esc(h.choice)}</p><small>${esc(h.immediate)}</small></li>`).join('')}</ol>`:'<p>No decision recorded yet. First make the commission and evidence boundary clear.</p>';
    }else if(id==='operating'){
      body=`<div class="practice-operating"><article><span>INFORMATION</span><h4>${getState().flags.feed?'Completion event connected':'Completion event outside council'}</h4><p>Mo’s completion record must reach the receiving council system. Technology and supplier feasibility are separate from resident-update ownership.</p></article><article><span>RESPONSIBILITY</span><h4>${getState().flags.owner?'Resident-update owner assigned':'Resident-update owner unassigned'}</h4><p>Priya’s housing team needs an agreed role, capacity and accessible contact route. Receiving data alone does not allocate this work.</p></article><article><span>GOVERNANCE</span><h4>${getState().flags.approved?'Bounded test authorised':'Owner decisions outstanding'}</h4><p>Funding, feasibility, supplier scope, contact preferences and exceptions need the relevant authorities. One approval does not replace the others.</p></article></div>`;
    }else if(id==='testing'||id==='monitoring'){
      body=`<div class="practice-operating"><article><span>OBSERVE</span><h4>Was the outcome understood?</h4><p>Check whether Alex receives a usable update after the repair, and whether staff still need a manual status check.</p></article><article><span>INCLUDE</span><h4>Test the phone fallback</h4><p>The authored SMS-link failure tests ownership and the preferred phone route. One resident case does not establish that the whole service is accessible.</p></article><article><span>NEXT ITERATION</span><h4>Agree measures and monitoring owners</h4><p>Test additional cases, exceptions, supplier capacity and communication preferences. Thresholds, reporting cadence and escalation arrangements are not yet agreed.</p></article></div>`;
    }else body=`<p>${esc(c.reason)}</p><button class="primary" id="practice-detail-blueprint">Inspect the linked blueprint</button>`;
    el.innerHTML=`<div class="practice-detail-header"><div><span class="practice-eyebrow">${esc(c.phase||'WORKING VIEW')}</span><h3>${esc(c.title)}</h3></div><button id="practice-detail-close" aria-label="Close working view">×</button></div>${body}`;
    document.querySelector('#practice-detail-close').onclick=()=>{detail=null;el.hidden=true;};
    el.querySelectorAll('[data-speak]').forEach(b=>b.onclick=()=>{onPersonSelect(b.dataset.speak);document.querySelector('#world-stage').scrollIntoView({behavior:'instant',block:'start'});});
    if(document.querySelector('#practice-detail-blueprint'))document.querySelector('#practice-detail-blueprint').onclick=()=>onOpenBlueprint({view:'current'});
  }
  function currentPhase(s){return ['Briefing and boundaries','Discovery and missing voices','Understanding the current service','Alignment and decisions','Operating arrangements','Testing and recovery','Next iteration'][Math.min(s.step,6)];}
  return {update,destroy(){host.replaceChildren();}};
}
