const bg=document.getElementById("bg");
const ctx=bg.getContext("2d");
let w,h,particles=[];
function resize(){
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = window.innerWidth; h = window.innerHeight;
  bg.width = Math.floor(w * dpr); bg.height = Math.floor(h * dpr);
  bg.style.width = w + "px"; bg.style.height = h + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resize();
window.addEventListener("resize", resize, { passive: true });
for(let i=0;i<(window.matchMedia("(max-width: 600px)").matches ? 28 : 75);i++)particles.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.8+.4,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25});
function animate(){
ctx.clearRect(0,0,innerWidth,innerHeight);
particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>innerWidth)p.vx*=-1;if(p.y<0||p.y>innerHeight)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle="rgba(155,92,255,.45)";ctx.fill()});
requestAnimationFrame(animate)}
animate();

const glow=document.querySelector(".cursor-glow");
if (glow && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  window.addEventListener("mousemove", e => {
    glow.style.left=e.clientX+"px"; glow.style.top=e.clientY+"px";
  }, { passive: true });
}

function addTilt(el){
if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
el.addEventListener("mousemove",e=>{
const r=el.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
const rx=((y/r.height)-.5)*-12,ry=((x/r.width)-.5)*12;
el.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
});
el.addEventListener("mouseleave",()=>el.style.transform="perspective(900px) rotateX(0) rotateY(0)");
}
addTilt(document.getElementById("tiltCard"));
document.querySelectorAll(".tilt").forEach(addTilt);

const reveal=document.querySelectorAll(".glass");
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("show")}),{threshold:.1});
reveal.forEach(e=>{e.style.opacity="0";e.style.transform="translateY(25px)";e.style.transition="opacity .7s ease,transform .7s ease";observer.observe(e)});
const css=document.createElement("style");
css.textContent=".glass.show{opacity:1!important;transform:translateY(0)!important}";
document.head.appendChild(css);


/* Accessible mobile navigation */
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    menuToggle.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });
  navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
  }));
}
