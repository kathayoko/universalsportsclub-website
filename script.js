// header: background once scrolled, hide on scroll-down, reveal on scroll-up
const header = document.getElementById('site-header');
let lastY = window.scrollY;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 40);
  if(y > lastY && y > 120){
    header.classList.add('hide');
  } else {
    header.classList.remove('hide');
  }
  lastY = y;
});

// reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// mobile menu toggle
const navToggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');
if(navToggle && mobileMenu){
  navToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// forms (only present on join.html and schedule.html, but harmless elsewhere)
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mwvgakoa";

const allForms = ['trial-form', 'member-form', 'host-form'];
function toggleForm(id){
  const el = document.getElementById(id);
  if(!el) return;
  const wasOpen = el.classList.contains('open');
  allForms.forEach(fid => { const f = document.getElementById(fid); if(f) f.classList.remove('open'); });
  if(!wasOpen){
    el.classList.add('open');
    el.scrollIntoView({behavior:'smooth', block:'center'});
  }
}

async function submitToFormspree(form){
  try{
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    return response.ok;
  }catch(err){
    return false;
  }
}

function handleSubmit(e, type){
  e.preventDefault();
  const form = e.target;
  const messages = {
    trial: "Thanks — we'll be in touch about your trial session!",
    member: "Thanks — we'll review your application and follow up!",
    host: "Thanks — we'll review your host application and follow up personally!"
  };
  submitToFormspree(form).then(ok => {
    alert(ok ? messages[type] : "Something went wrong — please try again or email us directly.");
    if(ok) form.reset();
  });
  return false;
}

function handleCityRequest(e){
  e.preventDefault();
  const form = e.target;
  submitToFormspree(form).then(ok => {
    alert(ok ? "Thanks — noted! We're mapping demand city by city." : "Something went wrong — please try again.");
    if(ok) form.reset();
  });
  return false;
}

function handleNewsletterSignup(e){
  e.preventDefault();
  const form = e.target;
  submitToFormspree(form).then(ok => {
    alert(ok ? "You're on the list!" : "Something went wrong — please try again.");
    if(ok) form.reset();
  });
  return false;
}
