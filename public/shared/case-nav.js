(()=>{
 const dialog=document.getElementById('portfolio-menu'),toggle=document.getElementById('portfolio-menu-toggle'),close=document.getElementById('portfolio-menu-close');
 if(!dialog)return;
 toggle.addEventListener('click',()=>{dialog.showModal();toggle.setAttribute('aria-expanded','true');document.documentElement.classList.add('portfolio-menu-open');close.focus();});
 close.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{toggle.setAttribute('aria-expanded','false');document.documentElement.classList.remove('portfolio-menu-open');toggle.focus({preventScroll:true});});
 dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
 dialog.querySelectorAll('[data-nav-view]').forEach(button=>button.addEventListener('click',()=>{dialog.querySelectorAll('[data-nav-view]').forEach(b=>b.setAttribute('aria-expanded',String(b===button)));for(const view of ['work','about','approach'])document.getElementById('portfolio-nav-'+view).hidden=button.dataset.navView!==view;}));
 const routes={takumi:'/takumi',richmond:'/richmond_case_study',council:'/council-sites'},current=routes[document.body.dataset.case];
 dialog.querySelectorAll('#portfolio-nav-work a').forEach(a=>{if(a.pathname.toLowerCase().replace(/\.html$/,'')===current)a.setAttribute('aria-current','page');});
 let frame=0;function draw(){const max=document.documentElement.scrollHeight-innerHeight,p=max?Math.min(100,Math.max(0,scrollY/max*100)):0;document.querySelector('.portfolio-rail').style.setProperty('--reading-progress',p+'%');document.getElementById('portfolio-reading-value').textContent=Math.round(p)+'%';frame=0;}
 function update(){if(!frame)frame=requestAnimationFrame(draw);}
 window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);new ResizeObserver(update).observe(document.body);draw();
})();
