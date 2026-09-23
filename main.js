
// ===== CHANGE THIS NUMBER BEFORE PUBLISHING =====
const WHATSAPP_NUMBER = "601XXXXXXXXX";

const waMessage = "Hi Jason, I would like to know more about Rawang property.";
document.querySelectorAll("[data-wa-link]").forEach(a=>{
  a.href=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;
});

const header=document.getElementById("siteHeader");
window.addEventListener("scroll",()=>header.classList.toggle("scrolled",window.scrollY>40));

const menuBtn=document.getElementById("menuBtn");
const mobileNav=document.getElementById("mobileNav");
menuBtn.addEventListener("click",()=>mobileNav.classList.toggle("open"));
mobileNav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>mobileNav.classList.remove("open")));

const grid=document.getElementById("projectGrid");
const selected=new Set();

function renderProjects(){
  grid.innerHTML=PROJECTS.map(p=>`
    <article class="project-card">
      <div class="project-image" style="background-image:url('${p.image}')"></div>
      <div class="project-info">
        <div class="project-kicker">${p.area}</div>
        <h3>${p.name}</h3>
        <div class="project-meta">
          <span>${p.type}</span><span>${p.tenure}</span><span>${p.price}</span>
        </div>
        <div class="project-actions">
          <button onclick="toggleProject('${p.id}')">${selected.has(p.id)?"✓ Selected":"+ Compare"}</button>
          <button class="ghost" onclick="viewProject('${p.id}')">View Details</button>
        </div>
      </div>
    </article>`).join("");
}
function toggleProject(id){
  if(selected.has(id)) selected.delete(id);
  else if(selected.size<3) selected.add(id);
  else { alert("Please compare up to 3 projects at a time."); return; }
  renderProjects(); renderCompare();
}
function askProject(name){
  const text=`Hi Jason, I would like to know more about ${name}.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,"_blank");
}
function renderCompare(){
  const chosen=PROJECTS.filter(p=>selected.has(p.id));
  document.getElementById("selectedHint").textContent=chosen.length?`${chosen.length} project${chosen.length>1?"s":""} selected.`:"Select up to 3 projects from the portfolio.";
  if(!chosen.length){
    document.getElementById("compareHead").innerHTML="";
    document.getElementById("compareBody").innerHTML=`<tr><td>Select projects above to compare them here.</td></tr>`;
    return;
  }
  document.getElementById("compareHead").innerHTML=`<tr><th>DETAIL</th>${chosen.map(p=>`<th>${p.name}</th>`).join("")}</tr>`;
  const rows=[["Developer","developer"],["Area","area"],["Type","type"],["Price","price"],["Tenure","tenure"],["Title","title"],["Land / Township","landSize"],["Units","units"],["Completion","completion"],["Land Area","landArea"],["Built-up","builtUp"],["Bedrooms","beds"],["Bathrooms","baths"],["To Mall","mall"],["To Toll","toll"]];
  document.getElementById("compareBody").innerHTML=rows.map(([label,key])=>`<tr><th>${label}</th>${chosen.map(p=>`<td>${p[key]}</td>`).join("")}</tr>`).join("");
}
document.getElementById("compareBtn").addEventListener("click",()=>document.getElementById("compare").scrollIntoView({behavior:"smooth"}));

function calculateLoan(){
  const income=Number(document.getElementById("income").value)||0;
  const commitment=Number(document.getElementById("commitment").value)||0;
  const rate=(Number(document.getElementById("rate").value)||4.2)/100/12;
  const years=Number(document.getElementById("tenure").value)||35;
  const available=(income*0.60)-commitment;
  if(available<=0){document.getElementById("loanResult").textContent="RM0";document.getElementById("loanNote").textContent="The entered commitments exceed this simple planning assumption.";return;}
  const n=years*12;
  const loan=available*((1-Math.pow(1+rate,-n))/rate);
  const price=loan/0.90;
  document.getElementById("loanResult").textContent="RM"+Math.round(price).toLocaleString();
  document.getElementById("loanNote").textContent="Illustrative estimate using a 60% total-debt-service assumption and 90% financing. Actual bank assessment varies.";
}
document.getElementById("calculateBtn").addEventListener("click",calculateLoan);

document.getElementById("leadForm").addEventListener("submit",(e)=>{
  e.preventDefault();
  const name=document.getElementById("leadName").value;
  const phone=document.getElementById("leadPhone").value;
  const budget=document.getElementById("leadBudget").value;
  const message=document.getElementById("leadMessage").value;
  const text=`Hi Jason, I would like to enquire about Rawang property.%0A%0AName: ${name}%0AWhatsApp: ${phone}%0ABudget: ${budget}%0AWhat I'm looking for: ${message}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`,"_blank");
});

renderProjects(); renderCompare();

function viewProject(id){
  const p=PROJECTS.find(x=>x.id===id); if(!p)return;
  document.getElementById("modalContent").innerHTML=`
    <div class="modal-kicker">${p.area} · ${p.type}</div>
    <h3>${p.name}</h3>
    <div class="project-meta"><span>Price ${p.price}</span><span>${p.tenure}</span><span>${p.size}</span></div>
    <div class="modal-source">${p.sourceData || "No detailed workbook text available for this project yet."}</div>
    <p class="modal-note">Project information is reproduced from the uploaded project workbook for internal reference. Verify the latest pricing, availability, specifications and incentives with the relevant developer / official source before publishing.</p>
    <div class="project-actions"><button onclick="askProject('${p.name.replace(/'/g,"\\'")}')">WhatsApp Jason</button></div>`;
  document.getElementById("projectModal").classList.add("open");
  document.getElementById("projectModal").setAttribute("aria-hidden","false");
}
document.getElementById("modalClose").addEventListener("click",()=>{
  document.getElementById("projectModal").classList.remove("open");
  document.getElementById("projectModal").setAttribute("aria-hidden","true");
});
document.getElementById("projectModal").addEventListener("click",(e)=>{
  if(e.target.id==="projectModal") document.getElementById("modalClose").click();
});
