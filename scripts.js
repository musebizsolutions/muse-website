(function(){
  function loadApollo(){
    /* Apollo nocache param removed - use a stable URL so the browser can cache it */
    var o=document.createElement("script");
    o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js";
    o.async=true;o.defer=true;
    o.onload=function(){window.trackingFunctions.onLoad({appId:"69e10e7c5eefd70021ef2c70"})};
    document.head.appendChild(o);
  }
  if('requestIdleCallback' in window){
    requestIdleCallback(loadApollo, {timeout:4000});
  } else {
    window.addEventListener('load', function(){ setTimeout(loadApollo, 2000); });
  }
})();

// ── COA Easter Egg Modal ──
function openCOAPreview(){
  var modal = document.getElementById('coa-modal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  startCOACountdown();
}
function closeCOAModal(){
  document.getElementById('coa-modal').style.display = 'none';
  document.body.style.overflow = '';
  clearInterval(window._coaTimer);
  // Reset for next open
  document.getElementById('coa-countdown').textContent = '8';
  document.getElementById('coa-paywall').style.display = 'none';
  document.getElementById('coa-content-wrap').style.filter = '';
  document.getElementById('coa-scroll-area').style.overflowY = 'auto';
}
function startCOACountdown(){
  var n = 8;
  var el = document.getElementById('coa-countdown');
  el.textContent = n;
  clearInterval(window._coaTimer);
  window._coaTimer = setInterval(function(){
    n--;
    el.textContent = n;
    if(n <= 0){
      clearInterval(window._coaTimer);
      // blur content and show paywall
      document.getElementById('coa-content-wrap').style.filter = 'blur(6px)';
      document.getElementById('coa-scroll-area').style.overflowY = 'hidden';
      document.getElementById('coa-paywall').style.display = 'block';
      el.textContent = '0';
    }
  }, 1000);
}
// close on backdrop click
document.addEventListener('DOMContentLoaded', function(){
  document.getElementById('coa-modal').addEventListener('click', function(e){
    if(e.target === this) closeCOAModal();
  });
});

function toggleFaq(btn) {
  var answer = btn.nextElementSibling;
  var icon = btn.querySelector('.faq-icon');
  var isOpen = answer.style.display === 'block';
  // close all
  document.querySelectorAll('.faq-answer').forEach(function(a){ a.style.display='none'; });
  document.querySelectorAll('.faq-icon').forEach(function(i){ i.textContent='+'; i.style.transform='rotate(0deg)'; });
  if (!isOpen) {
    answer.style.display = 'block';
    icon.textContent = '+';
    icon.style.transform = 'rotate(45deg)';
  }
}

const form = document.getElementById('contact-form');
        const success = document.getElementById('form-success');
        form.addEventListener('submit', async function(e) {
          e.preventDefault();
          const btn = form.querySelector('button[type="submit"]');
          btn.textContent = 'Sending...';
          btn.disabled = true;
          const data = new FormData(form);
          const response = await fetch('https://formspree.io/f/meepwawk', {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
          });
          if (response.ok) {
            form.style.display = 'none';
            success.style.display = 'block';
          } else {
            btn.textContent = 'Something went wrong - try again';
            btn.style.background = '#3a3550';
            btn.style.color = '#9990b8';
            btn.disabled = false;
          }
        });

(function(){
  var wrapper = document.getElementById('shop-lazy-wrapper');
  var tmpl = document.getElementById('shop-template');
  if(!wrapper || !tmpl) return;
  var io = new IntersectionObserver(function(entries){
    if(entries[0].isIntersecting){
      var frag = tmpl.content.cloneNode(true);
      wrapper.parentNode.replaceChild(frag, wrapper);
      tmpl.remove();
      io.disconnect();
    }
  }, {rootMargin:'200px'});
  io.observe(wrapper);
})();

(function(){
  // Phone format
  var ph=document.getElementById('pp-phone');
  if(ph) ph.addEventListener('input',function(e){
    var v=e.target.value.replace(/\D/g,'').substring(0,10);
    if(v.length>=6) v='('+v.substring(0,3)+') '+v.substring(3,6)+'-'+v.substring(6);
    else if(v.length>=3) v='('+v.substring(0,3)+') '+v.substring(3);
    e.target.value=v;
  });
  // Zip digits only
  var zp=document.getElementById('pp-zip');
  if(zp) zp.addEventListener('input',function(){this.value=this.value.replace(/\D/g,'').substring(0,5);});
  // Dollar fields
  ['pp-vol','pp-avg','pp-high'].forEach(function(id){
    var el=document.getElementById(id);
    if(!el) return;
    el.addEventListener('blur',function(){
      var r=this.value.replace(/[^0-9.]/g,'');
      if(r&&!isNaN(r)) this.value='$'+parseFloat(r).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:2});
    });
    el.addEventListener('focus',function(){this.value=this.value.replace(/[$,]/g,'');});
  });
  // Drop zone
  var dz=document.getElementById('pp-drop-zone');
  var fi=document.getElementById('pp-statement');
  var fn=document.getElementById('pp-file-name');
  if(fi) fi.addEventListener('change',function(){if(this.files[0]) fn.textContent='✓ '+this.files[0].name;});
  if(dz){
    dz.addEventListener('dragover',function(e){e.preventDefault();dz.classList.add('drag-over');});
    dz.addEventListener('dragleave',function(){dz.classList.remove('drag-over');});
    dz.addEventListener('drop',function(e){
      e.preventDefault();dz.classList.remove('drag-over');
      if(e.dataTransfer.files[0]){fi.files=e.dataTransfer.files;fn.textContent='✓ '+e.dataTransfer.files[0].name;}
    });
  }
  // Submit
  var form=document.getElementById('pp-lead-form');
  if(form) form.addEventListener('submit',function(e){
    e.preventDefault();
    var req=this.querySelectorAll('[required]');
    var valid=true;
    req.forEach(function(f){f.style.borderColor='';if(!f.value.trim()){f.style.borderColor='#e85a4a';valid=false;}});
    if(!valid) return;
    form.style.display='none';
    document.getElementById('pp-success').style.display='block';
    document.getElementById('payment-processing').scrollIntoView({behavior:'smooth'});
  });
})();

(function(){
  let shown = false;
  function showPopup(){
    if(shown) return;
    shown = true;
    sessionStorage.setItem('exitShown','1');
    const p = document.getElementById('exit-popup');
    p.style.display = 'flex';
  }
  function closePopup(){
    document.getElementById('exit-popup').style.display = 'none';
  }
  window.closePopup = closePopup;

  if(sessionStorage.getItem('exitShown')) return;

  // Exit intent: mouse leaves toward top of window
  document.addEventListener('mouseleave', function(e){
    if(e.clientY < 10) showPopup();
  });

  // Fallback: show after 45s of inactivity
  let timer = setTimeout(showPopup, 45000);
  document.addEventListener('mousemove', function(){ clearTimeout(timer); timer = setTimeout(showPopup, 45000); });

  // Close on backdrop click
  document.getElementById('exit-popup').addEventListener('click', function(e){
    if(e.target === this) closePopup();
  });

  // Form submission - swap for your email provider endpoint if needed
  document.getElementById('popup-form').addEventListener('submit', async function(e){
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    btn.textContent = 'Subscribing...';
    btn.disabled = true;
    // If you use Formspree, swap the URL below; otherwise hook into your ESP
    await new Promise(r => setTimeout(r, 800)); // simulate
    document.getElementById('popup-form').style.display = 'none';
    document.getElementById('popup-success').style.display = 'block';
    setTimeout(closePopup, 3000);
  });
})();

function toggleNav(){
  var nav=document.getElementById('nav-links');
  var btn=document.getElementById('hamburger');
  var open=nav.classList.toggle('open');
  btn.classList.toggle('open',open);
  btn.setAttribute('aria-expanded',open);
  document.body.style.overflow=open?'hidden':'';
}
function closeNav(){
  var nav=document.getElementById('nav-links');
  var btn=document.getElementById('hamburger');
  nav.classList.remove('open');
  btn.classList.remove('open');
  btn.setAttribute('aria-expanded','false');
  document.body.style.overflow='';
}

