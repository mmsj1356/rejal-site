const ADMIN_PASSWORD = "1378165519";
const WHATSAPP_URL = "https://wa.me/989203028490";
const RUBIKA_URL = "https://rubika.ir/joinc/FHADDBJI0CBMBUFJVWSSOQUTIPXYOHOA";
const RUBIKA_ID = "@Mrejalco";
const K_P = "rejal_products_v6";
const K_S = "rejal_settings_v2";
const K_J = "rejal_join_v2";
const K_O = "rejal_orders_v1";
const K_M = "rejal_media_v2";
const defaults = [
{id:"irani", name:"دستمال کاغذی رجال — تیشو ایرانی اقتصادی", type:"irani", typeFa:"تیشو ایرانی", boxPrice:1850000, packPrice:465000, d1:5, d2:10, stock:"موجود", count:200, img:"rejal-product.png", desc:"ابعاد برگ ۲۰×۲۰ | بسته تکی ۲۵۰ برگ دولایه (۵۰۰ برگ تک‌لایه) — اقتصادی و به‌صرفه برای مغازه و مصرف روزانه | خرده و عمده"},
{id:"khareji", name:"دستمال کاغذی رجال — تیشو خارجی لوکس صادراتی", type:"khareji", typeFa:"تیشو خارجی", boxPrice:2450000, packPrice:615000, d1:6, d2:12, stock:"موجود", count:120, img:"rejal-product.png", desc:"ابعاد برگ ۲۰×۲۰ | بسته تکی ۲۵۰ برگ دولایه (۵۰۰ برگ تک‌لایه) — نرم‌تر و سفیدتر، مناسب فروش لوکس و صادرات | خرده و عمده"}
];
function get(k, fb){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; }catch(e){ return fb; } }
function set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){ alert("حافظه پر شد. فیلم حجیم را با لینک اضافه کن."); } }
let products = get(K_P, defaults);
if(!products || !products.length){ products = defaults; set(K_P, products); }
let settings = get(K_S, {require:true, backend:""});
let joinState = get(K_J, {rubika:false, whatsapp:false});
let orders = get(K_O, []);
let media = get(K_M, []);
const $ = (id)=>document.getElementById(id);
const fa = (n)=> Number(n||0).toLocaleString("fa-IR");
let bypassJoin = false;
function stockBadge(p){
if(p.stock==="ناموجود") return "🔴 ناموجود";
if(p.stock==="کم") return "🟡 موجودی کم: "+fa(p.count)+" باکس";
return "🟢 موجود: "+fa(p.count)+" باکس";
}
function renderProducts(filter="all"){
const box = $("products"); if(!box) return; box.innerHTML="";
products.filter(p=>filter==="all"||p.type===filter).forEach(p=>{
const d=document.createElement("div"); d.className="card";
d.innerHTML=`<img src="${p.img||"rejal-product.png"}" alt="${p.name}" onerror="this.src='rajal_logo.jpg'"><div class="pad"><h4>${p.name}</h4><div class="muted">${p.typeFa} | ۲۰×۲۰ | ${stockBadge(p)}</div><p class="muted">${p.desc||""}</p><div class="sale-badge retail">🛍️ خرده: ۱ تا ۴ باکس با قیمت پایه</div><div class="sale-badge wholesale">📦 عمده: ۵ باکس به بالا با تخفیف</div><div class="price">باکس ۳۲تایی: ${fa(p.boxPrice)} تومان</div><div>پک ۸تایی: ${fa(p.packPrice)} تومان</div><div class="muted">تخفیف ۲۰ تا ۴۹ باکس ٪${fa(p.d1)} | بالای ۵۰ باکس ٪${fa(p.d2)}</div><div class="cta"><a class="btn wa" data-join="whatsapp" href="${WHATSAPP_URL}" target="_blank" rel="noopener">استعلام واتساپ</a><a class="btn rubika" data-join="rubika" href="${RUBIKA_URL}" target="_blank" rel="noopener">سفارش در روبیکا</a></div></div>`;
box.appendChild(d);
});
bindJoin();
fillCalc();
buildSlider();
renderPrice();
renderMedia();
}
function renderPrice(){
const t=$("priceTable"); if(!t) return;
let h=`<tr><th>محصول</th><th>خرده (۱ تا ۴ باکس)</th><th>عمده پایه (۵ تا ۱۹)</th><th>۲۰ تا ۴۹ باکس</th><th>۵۰ باکس به بالا</th><th>موجودی</th></tr>`;
products.forEach(p=>{
const p1=Math.round(p.boxPrice*(1-p.d1/100));
const p2=Math.round(p.boxPrice*(1-p.d2/100));
h+=`<tr><td>${p.name}</td><td>${fa(p.boxPrice)}</td><td>${fa(p.boxPrice)}</td><td>${fa(p1)}</td><td>${fa(p2)}</td><td>${stockBadge(p)}</td></tr>`;
});
t.innerHTML=h;
}
function fillCalc(){
const s=$("calcProduct"); if(!s) return; s.innerHTML="";
products.forEach(p=>{ const o=document.createElement("option"); o.value=p.id; o.textContent=p.name; s.appendChild(o); });
calc();
}
function currentProduct(){
const s=$("calcProduct"); if(!s) return products[0];
return products.find(x=>x.id===s.value)||products[0];
}
function calc(){
const p=currentProduct(); if(!p) return;
let q=parseInt(($("qNumber")||{}).value||$("qRange").value||5);
if($("qRange") && document.activeElement===$("qRange")) $("qNumber").value=q;
if($("qRange") && document.activeElement===$("qNumber")) $("qRange").value=Math.min(100,$("qNumber").value||5);
const isRetail = q<5;
let disc=0;
if(!isRetail){ if(q>=50) disc=p.d2; else if(q>=20) disc=p.d1; }
const unit=Math.round(p.boxPrice*(1-disc/100));
const total=unit*q;
const warn=$("wholesaleWarn");
if(warn){
if(isRetail){
warn.style.display="block";
warn.className="warn retail";
warn.textContent="🛍️ سفارش شما خرده محسوب می‌شود (زیر ۵ باکس) — با قیمت پایه محاسبه شد. برای گرفتن تخفیف پلکانی، ۵ باکس به بالا انتخاب کن.";
}else{
warn.style.display="none";
}
}
if($("calcOut")) $("calcOut").textContent=`مبلغ: ${fa(total)} تومان ${isRetail?"(خرده)":"(عمده)"}`;
if($("calcDetail")) $("calcDetail").textContent=`${fa(q)} باکس × ${fa(unit)} تومان | ${fa(q*32)} بسته تکی | ${fa(q*4)} پک ۸تایی | تخفیف ٪${fa(disc)} | نوع فروش: ${isRetail?"خرده":"عمده"}`;
}
function renderMedia(){
const grid=$("mediaGrid"); if(!grid) return;
grid.innerHTML="";
if(!media.length){
grid.innerHTML=`<div class="empty-box">📷 هنوز عکس و فیلمی ثبت نشده است.<br>به‌زودی عکس خط تولید و محصولات این‌جا قرار می‌گیرد.</div>`;
return;
}
media.forEach(m=>{
const d=document.createElement("div"); d.className="media-card";
if(m.type==="video"){
d.innerHTML=`<video src="${m.src}" controls preload="metadata"></video><div class="pad"><b>${m.title||"فیلم"}</b></div>`;
}else{
d.innerHTML=`<img src="${m.src}" alt="${m.title||""}" onerror="this.src='rajal_logo.jpg'"><div class="pad"><b>${m.title||""}</b></div>`;
}
grid.appendChild(d);
});
}
let sIdx=0, sTimer=null;
function slidesList(){
const arr=[];
products.forEach(p=>{ if(p.img) arr.push(p.img); });
media.forEach(m=>{ if(m.type==="image" && m.src) arr.push(m.src); });
arr.push("rejal-product.png","rajal_logo.jpg");
return [...new Set(arr)];
}
function buildSlider(){
const wrap=$("heroSlides"), dots=$("heroDots"); if(!wrap) return;
const list=slidesList(); wrap.innerHTML=""; if(dots) dots.innerHTML="";
list.forEach((src,i)=>{
const im=document.createElement("img"); im.src=src; im.alt="رجال"; im.onerror=()=>{im.src="rajal_logo.jpg"}; wrap.appendChild(im);
if(!dots) return;
const d=document.createElement("span"); if(i===0) d.className="on"; d.onclick=()=>{sIdx=i;updateSlider()}; dots.appendChild(d);
});
sIdx=0; updateSlider(); startAuto();
}
function updateSlider(){
const wrap=$("heroSlides"), dots=$("heroDots"); if(!wrap) return;
wrap.style.transform=`translateX(${sIdx*100}%)`;
if(dots) [...dots.children].forEach((d,i)=>d.className=i===sIdx?"on":"");
}
function startAuto(){
if(sTimer) clearInterval(sTimer);
sTimer=setInterval(()=>{ const n=slidesList().length; sIdx=(sIdx+1)%n; updateSlider(); },3500);
}
let pending="whatsapp";
let pendingHref=null;
let pendingAction=null;
function bindJoin(){
document.querySelectorAll('[data-join]').forEach(a=>{
a.onclick=(e)=>{
const ch=a.getAttribute("data-join")||"whatsapp";
if(!settings.require || bypassJoin){ return; }
if(joinState[ch]){ return; }
e.preventDefault(); pending=ch; pendingHref=a.href; pendingAction=null; openJoin(ch);
};
});
}
function openJoin(ch){
const m=$("joinModal"); m.style.display="flex";
$("joinStep1").style.display="block"; $("joinStep2").style.display="none";
const help=$("joinHelp"), copyBtn=$("copyIdBtn");
if(ch==="whatsapp"){
$("joinTitle").textContent="ادامه در واتساپ";
$("joinDesc").textContent="برای استعلام و ثبت سفارش عمده و خرده، اول وارد چت واتساپ شو بعد تأیید بزن.";
$("joinLink").href=WHATSAPP_URL; $("joinLink").textContent="۱. ورود به واتساپ فروش"; $("joinLink").className="btn big wa";
if(help) help.textContent="روی دکمه بالا بزن تا چت واتساپ باز شود، بعد برگرد و «عضو شدم» را بزن. اگر نخواستی عضو شوی، «فعلاً بدون عضویت ادامه بده» را بزن.";
if(copyBtn) copyBtn.style.display="none";
}
else{
$("joinTitle").textContent="ادامه در روبیکا";
$("joinDesc").textContent="برای ثبت سفارش، عضو کانال روبیکا شو بعد تأیید بزن. اگر سایت روبیکا گیر کرد از راه دوم استفاده کن.";
$("joinLink").href=RUBIKA_URL; $("joinLink").textContent="۱. ورود به کانال Mrejalco@"; $("joinLink").className="btn big rubika";
if(help) help.textContent="اگر دکمه «مشترک شدن» داخل سایت روبیکا کار نکرد: اپ روبیکا را باز کن و Mrejalco@ را جست‌وجو و عضو شو، بعد برگرد اینجا «عضو شدم» را بزن. عجله داری؟ «فعلاً بدون عضویت ادامه بده» را بزن.";
if(copyBtn) copyBtn.style.display="inline-block";
}
}
function goDirect(ch){
if(ch==="whatsapp") window.open(WHATSAPP_URL,"_blank");
else window.open(RUBIKA_URL,"_blank");
}
function saveAndGo(channel){
if(settings.require && !joinState[channel] && !bypassJoin){
pending=channel; pendingHref=null;
pendingAction=()=>saveAndGo(channel);
openJoin(channel); return;
}
const name=($("oName").value||"").trim();
const mob=($("oMobile").value||"").trim();
const p=currentProduct();
const q=parseInt($("qNumber").value||5);
if(!name||!mob){ alert("نام و موبایل را کامل بنویس."); return; }
const isRetail=q<5;
let disc=0; if(!isRetail){ if(q>=50) disc=p.d2; else if(q>=20) disc=p.d1; }
const unit=Math.round(p.boxPrice*(1-disc/100));
const total=unit*q;
const saleType=isRetail?"خرده":"عمده";
const code="RJ-"+Math.floor(10000+Math.random()*89999);
const order={code, name, mob, city:$("oCity").value||"", type:$("oType").value||"", desc:$("oDesc").value||"", pid:p.id, pname:p.name, qty:q, total, saleType, status:"ثبت شد", date:new Date().toLocaleString("fa-IR")};
orders.push(order); set(K_O, orders);
if($("orderResult")) $("orderResult").textContent=`✅ سفارش ${saleType} ${code} ثبت شد و در پنل مدیریت ذخیره شد. در حال باز کردن ${channel==="whatsapp"?"واتساپ":"روبیکا"}...`;
if(channel==="whatsapp"){
window.open(WHATSAPP_URL+"?text="+encodeURIComponent(`${code} فروش ${saleType} ${name} ${p.name} ${q} باکس مبلغ ${total}`),"_blank");
}else{ window.open(RUBIKA_URL,"_blank"); }
renderAdminOrders();
}
function doSkip(){
const act=pendingAction; const href=pendingHref;
pendingAction=null; pendingHref=null;
if($("joinModal")) $("joinModal").style.display="none";
bypassJoin=true;
try{
if(act){ act(); }
else if(href){ window.open(href,"_blank"); }
}catch(e){}
bypassJoin=false;
}
document.addEventListener("DOMContentLoaded", ()=>{
renderProducts();
if($("qRange")) $("qRange").oninput=()=>{ $("qNumber").value=$("qRange").value; calc(); };
if($("qNumber")) $("qNumber").oninput=()=>{ $("qRange").value=Math.min(100,$("qNumber").value||5); calc(); };
if($("calcProduct")) $("calcProduct").onchange=calc;
if($("submitWhatsapp")) $("submitWhatsapp").onclick=()=>saveAndGo("whatsapp");
if($("submitRubika")) $("submitRubika").onclick=()=>saveAndGo("rubika");
if($("trackBtn")) $("trackBtn").onclick=()=>{
const c=($("trackInput").value||"").trim(); const o=orders.find(x=>x.code===c);
$("trackResult").textContent=o?`سفارش ${o.code} | فروش ${o.saleType||"عمده"} | ${o.pname} | ${fa(o.qty)} باکس | وضعیت: ${o.status}`:"سفارشی با این کد پیدا نشد.";
};
document.querySelectorAll(".fbtn").forEach(b=>b.onclick=()=>{
document.querySelectorAll(".fbtn").forEach(x=>x.classList.remove("active")); b.classList.add("active"); renderProducts(b.dataset.filter);
});
if($("sNext")) $("sNext").onclick=()=>{ const n=slidesList().length; sIdx=(sIdx+1)%n; updateSlider(); };
if($("sPrev")) $("sPrev").onclick=()=>{ const n=slidesList().length; sIdx=(sIdx-1+n)%n; updateSlider(); };
const sl=$("heroSlider");
if(sl){ sl.onmouseenter=()=>clearInterval(sTimer); sl.onmouseleave=startAuto;
let sx=0; sl.addEventListener("touchstart",e=>sx=e.touches[0].clientX,{passive:true});
sl.addEventListener("touchend",e=>{ const dx=e.changedTouches[0].clientX-sx; const n=slidesList().length; if(dx<-40) sIdx=(sIdx+1)%n; if(dx>40) sIdx=(sIdx-1+n)%n; updateSlider(); },{passive:true}); }
if($("joinNext")) $("joinNext").onclick=()=>{ $("joinStep1").style.display="none"; $("joinStep2").style.display="block"; };
if($("joinBack")) $("joinBack").onclick=()=>{ $("joinStep1").style.display="block"; $("joinStep2").style.display="none"; };
if($("joinClose")) $("joinClose").onclick=()=>{ $("joinModal").style.display="none"; pendingAction=null; pendingHref=null; };
if($("joinSkip1")) $("joinSkip1").onclick=doSkip;
if($("joinSkip2")) $("joinSkip2").onclick=doSkip;
if($("copyIdBtn")) $("copyIdBtn").onclick=()=>{
try{ navigator.clipboard.writeText(RUBIKA_ID); alert("آیدی کپی شد: "+RUBIKA_ID); }catch(e){ prompt("کپی کن:", RUBIKA_ID); }
};
if($("joinConfirm")) $("joinConfirm").onclick=()=>{
joinState[pending]=true; set(K_J, joinState);
$("joinModal").style.display="none";
const act=pendingAction; pendingAction=null;
if(act){ act(); return; }
if(pendingHref){ const h=pendingHref; pendingHref=null; window.open(h,"_blank"); return; }
goDirect(pending);
};
if($("adminBtn")) $("adminBtn").onclick=()=>{ $("adminModal").style.display="flex"; };
document.querySelectorAll(".closeAdmin").forEach(b=>b.onclick=()=>$("adminModal").style.display="none");
if($("adminGo")) $("adminGo").onclick=()=>{
if($("adminPass").value===ADMIN_PASSWORD){ $("adminLogin").style.display="none"; $("adminBody").style.display="block"; loadAdmin(); }
else alert("رمز اشتباه است.");
};
if($("saveSettings")) $("saveSettings").onclick=()=>{
settings={require:$("sRequire").checked, backend:$("sBackend").value.trim()}; set(K_S, settings); alert("تنظیمات ذخیره شد.");
};
if($("addProduct")) $("addProduct").onclick=()=>{
products.push({id:"p"+Date.now(), name:"محصول جدید", type:"irani", typeFa:"تیشو ایرانی", boxPrice:1000000, packPrice:250000, d1:5, d2:10, stock:"موجود", count:50, img:"rejal-product.png", desc:"ابعاد ۲۰×۲۰"});
set(K_P, products); renderProducts(); loadAdmin();
};
if($("addMedia")) $("addMedia").onclick=()=>{
const title=($("mediaTitle").value||"").trim();
const url=($("mediaUrl").value||"").trim();
const f=$("mediaFile").files[0];
if(f){
const r=new FileReader();
r.onload=()=>{
const isV=f.type.startsWith("video");
media.push({id:"m"+Date.now(), type:isV?"video":"image", src:r.result, title:title||f.name});
set(K_M, media); renderMedia(); loadAdminMedia();
$("mediaTitle").value=""; $("mediaUrl").value=""; $("mediaFile").value="";
};
r.readAsDataURL(f);
}else if(url){
const isV=/\.(mp4|webm|mov)(\?|$)/i.test(url);
media.push({id:"m"+Date.now(), type:isV?"video":"image", src:url, title:title||"رسانه جدید"});
set(K_M, media); renderMedia(); loadAdminMedia();
$("mediaTitle").value=""; $("mediaUrl").value="";
}else{ alert("یک فایل انتخاب کن یا لینک بده."); }
};
});
function loadAdmin(){
$("sRequire").checked=!!settings.require; $("sBackend").value=settings.backend||"";
const box=$("adminProducts"); box.innerHTML="";
products.forEach((p,i)=>{
const d=document.createElement("div"); d.style.border="1px solid #ddd"; d.style.padding="8px"; d.style.margin="6px 0"; d.style.borderRadius="10px";
d.innerHTML=`<b>${p.name}</b><br>نام محصول:<input data-i="${i}" data-k="name" value="${p.name}" style="width:100%">قیمت باکس:<input data-i="${i}" data-k="boxPrice" type="number" value="${p.boxPrice}"> قیمت پک:<input data-i="${i}" data-k="packPrice" type="number" value="${p.packPrice}">تخفیف1:<input data-i="${i}" data-k="d1" type="number" value="${p.d1}"> تخفیف2:<input data-i="${i}" data-k="d2" type="number" value="${p.d2}">موجودی:<select data-i="${i}" data-k="stock"><option ${p.stock==="موجود"?"selected":""}>موجود</option><option ${p.stock==="کم"?"selected":""}>کم</option><option ${p.stock==="ناموجود"?"selected":""}>ناموجود</option></select>تعداد باکس:<input data-i="${i}" data-k="count" type="number" value="${p.count}"><input data-i="${i}" data-k="imgfile" type="file" accept="image/*"> <button data-del="${i}">حذف</button> <button data-save="${i}">ذخیره</button>`;
box.appendChild(d);
});
box.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{ products.splice(parseInt(b.getAttribute("data-del")),1); set(K_P,products); renderProducts(); loadAdmin(); });
box.querySelectorAll("[data-save]").forEach(b=>b.onclick=()=>{
const i=parseInt(b.getAttribute("data-save"));
box.querySelectorAll(`[data-i="${i}"]`).forEach(inp=>{
const k=inp.getAttribute("data-k");
if(k==="imgfile"){ if(inp.files[0]){ const r=new FileReader(); r.onload=()=>{ products[i].img=r.result; set(K_P,products); renderProducts(); }; r.readAsDataURL(inp.files[0]); } return; }
let v=inp.value; if(["boxPrice","packPrice","d1","d2","count"].includes(k)) v=parseInt(v||0);
products[i][k]=v;
});
set(K_P,products); renderProducts(); alert("ذخیره شد و رفت داخل اسلایدر.");
});
loadAdminMedia();
renderAdminOrders();
}
function loadAdminMedia(){
const box=$("adminMedia"); if(!box) return; box.innerHTML=media.length?"":"هنوز رسانه‌ای نیست.";
media.forEach((m,i)=>{
const d=document.createElement("div"); d.style.border="1px solid #ddd"; d.style.padding="6px"; d.style.margin="6px 0"; d.style.borderRadius="10px"; d.style.display="flex"; d.style.gap="8px"; d.style.alignItems="center";
const thumb=m.type==="video"?"🎬 فیلم":"🖼️ عکس";
d.innerHTML=`<span>${thumb}</span><span style="flex:1">${m.title||""}</span><button data-mdel="${i}">حذف</button>`;
box.appendChild(d);
});
box.querySelectorAll("[data-mdel]").forEach(b=>b.onclick=()=>{
media.splice(parseInt(b.getAttribute("data-mdel")),1); set(K_M, media); renderMedia(); loadAdminMedia();
});
}
function renderAdminOrders(){
const box=$("adminOrders"); if(!box) return; box.innerHTML=orders.length?"":"سفارشی نیست.";
orders.slice().reverse().forEach(o=>{
const d=document.createElement("div"); d.style.borderBottom="1px solid #eee"; d.style.padding="6px 0";
d.innerHTML=`<b>${o.code}</b> [${o.saleType||"عمده"}] | ${o.name} | ${o.mob} | ${o.pname} | ${fa(o.qty)} باکس | ${fa(o.total)} تومان | <select data-c="${o.code}">${["ثبت شد","در حال آماده‌سازی","تحویل باربری تبریز","ارسال شد","تحویل شد","لغو شد"].map(s=>`<option ${o.status===s?"selected":""}>${s}</option>`).join("")}</select>`;
box.appendChild(d);
});
box.querySelectorAll("select").forEach(s=>s.onchange=()=>{ const c=s.getAttribute("data-c"); const o=orders.find(x=>x.code===c); if(o){ o.status=s.value; set(K_O,orders); } });
}
