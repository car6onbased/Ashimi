export function initPortfolioNavigation(){
 const dialog=document.getElementById('portfolio-menu'),toggle=document.getElementById('portfolio-menu-toggle'),close=document.getElementById('portfolio-menu-close'),rail=document.querySelector('.portfolio-rail');
 if(!dialog||!toggle)return;
 const restart=document.getElementById('restart');
 if(restart)document.getElementById('portfolio-restart-slot').append(restart);
 let returnFocus=toggle,scrollFrame=0;
 function finish(){toggle.setAttribute('aria-expanded','false');document.documentElement.classList.remove('portfolio-menu-open');returnFocus?.focus({preventScroll:true});updateProgress();}
 function dismiss(){if(dialog.open)dialog.close();}
 toggle.addEventListener('click',()=>{returnFocus=document.activeElement;dialog.showModal();toggle.setAttribute('aria-expanded','true');document.documentElement.classList.add('portfolio-menu-open');close.focus();});
 close.addEventListener('click',dismiss);dialog.addEventListener('close',finish);
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dismiss();});
 dialog.querySelectorAll('[data-nav-view]').forEach(button=>button.addEventListener('click',()=>{dialog.querySelectorAll('[data-nav-view]').forEach(b=>b.setAttribute('aria-expanded',String(b===button)));for(const view of ['work','about','approach'])document.getElementById('portfolio-nav-'+view).hidden=button.dataset.navView!==view;}));
 restart?.addEventListener('click',dismiss);
 document.getElementById('portfolio-return-world').addEventListener('click',()=>{dismiss();document.getElementById('world-stage').scrollIntoView({behavior:'instant',block:'start'});});
 document.getElementById('portfolio-workspace-link').addEventListener('click',event=>{event.preventDefault();dismiss();document.getElementById('evidence-title').scrollIntoView({behavior:'instant',block:'start'});});
 document.querySelector('.portfolio-brand').addEventListener('click',event=>{event.preventDefault();document.getElementById('world-stage').scrollIntoView({behavior:'instant',block:'start'});});
 function updateProgress(){const doc=document.documentElement,max=Math.max(0,doc.scrollHeight-window.innerHeight),percent=max?Math.max(0,Math.min(100,window.scrollY/max*100)):0;rail.style.setProperty('--reading-progress',percent+'%');document.getElementById('portfolio-reading-value').textContent=Math.round(percent)+'%';scrollFrame=0;}
 function queueProgress(){if(!scrollFrame)scrollFrame=requestAnimationFrame(updateProgress);}
 window.addEventListener('scroll',queueProgress,{passive:true});window.addEventListener('resize',queueProgress);if(typeof ResizeObserver!=='undefined')new ResizeObserver(queueProgress).observe(document.body);updateProgress();
}
