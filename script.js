/* =========================
   1) DATA PRODUK + RENDER
========================= */
const products = [
  { name:"Flower Basket", price:"Rp 180.000,-", image:"bucket-hero.jpeg", desc:"Flower Basket with 11 main flowers, 2 artificial lily's, and additional flowers. You can request the flowers as well.", tag:["classic"] },
  { name:"Teddy Bear Bouquet", price:"Rp 85.000,-", image:"teddybouquet-hero.jpeg", desc:"Teddy Bear Bouquet with 5 main flowers, additional flowers, and a teddy bear.", tag:["classic"] },
  { name:"Small Bouquet", price:"Rp 65.000,-", image:"smallbouquet-hero.jpeg", desc:"Small sized bouquet with 9 main flowers and additional flowers.", tag:["classic"] },
  { name:"Basket of Gerbera's", price:"Rp 150.000,-", image:"bucketofgerbera-hero.jpeg", desc:"17 Gerbera's with additional flowers and leaves.", tag:["classic"] },
  { name:"Medium Bouquet", price:"Rp 200.000,-", image:"mediumbouquet-hero.jpeg", desc:"Special request by Customers.", tag:["classic"] },
  { name:"Medium Flower Basket", price:"Rp 190.000,-", image:"flowerbucket-hero.jpeg", desc:"Medium sized contains 27 main flowers, and additional flowers and leaves.", tag:["classic"] },
  { name:"Teddy Bear with Chocolate", price:"Rp 85.000,-", image:"teddysilverqueen-hero.jpeg", desc:"Teddy Bear & Silverqueen Bouquet with Rose.", tag:["signature"] },
  { name:"Bunny Bouquet with Pocky", price:"Rp 80.000,-", image:"bouquetkelinci-hero.jpeg", desc:"Small Bunny with 2 Pocky.", tag:["signature"] },
  { name:"Flower Board", price:"Start from Rp 250.000,-", image:"papanbunga-hero.jpeg", desc:"Order by request, depends on size and flowers placing.", tag:["classic"] },
];

const gridAll = document.getElementById("produkGrid");
const gridVal = document.getElementById("valentineGrid");

function renderCard(p){
  return `
    <div class="produk-item" data-produk="${p.name}" data-harga="${p.price}">
      <div class="img-wrap">
        <img class="produk-img" src="${p.image}" alt="${p.name}"
          onerror="this.style.display='none'; this.parentElement.classList.add('img-fallback');">
        <div class="img-fallback-ui" aria-hidden="true">
          <div class="fallback-rose">✦</div>
          <div class="fallback-text">Image Preview<br><span>Coming soon</span></div>
        </div>
      </div>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <span class="harga">${p.price}</span>
    </div>
  `;
}

function mountGrid(el, list){
  if(!el) return;
  el.classList.add("is-fading");
  setTimeout(() => {
    el.innerHTML = list.map(renderCard).join("");
    el.classList.remove("is-fading");
  }, 160);
}

mountGrid(gridAll, products);
if (gridVal) mountGrid(gridVal, products.filter(p => p.tag?.includes("signature")));

/* =========================
   2) FILTER BUTTONS
========================= */
const btnAll = document.getElementById("btnAll");
const btnVal = document.getElementById("btnVal");

btnAll?.addEventListener("click", () => {
  btnAll.classList.add("is-active");
  btnVal?.classList.remove("is-active");
  mountGrid(gridAll, products);
});

btnVal?.addEventListener("click", () => {
  btnVal.classList.add("is-active");
  btnAll?.classList.remove("is-active");
  mountGrid(gridAll, products.filter(p => p.tag?.includes("signature")));
});

/* =========================
   3) LIGHTBOX (SAFE)
========================= */
const imgLightbox = document.getElementById("imgLightbox");
const imgPreview  = document.getElementById("imgPreview");
const imgClose    = document.getElementById("imgClose");
const imgPrev     = document.getElementById("imgPrev");
const imgNext     = document.getElementById("imgNext");

let LB_IMAGES = [];
let LB_INDEX = 0;

function lbRender(){
  const item = LB_IMAGES[LB_INDEX];
  if(!item || !imgPreview) return;

  imgPreview.src = item.src;
  imgPreview.alt = item.alt || "Preview";

  const many = LB_IMAGES.length > 1;
  imgPrev?.classList.toggle("is-hidden", !many);
  imgNext?.classList.toggle("is-hidden", !many);
}

function openGallery(images, startIndex = 0){
  if(!imgLightbox) return;
  LB_IMAGES = Array.isArray(images) && images.length ? images : [];
  LB_INDEX = Math.max(0, Math.min(startIndex, LB_IMAGES.length - 1));
  if(!LB_IMAGES.length) return;

  lbRender();
  imgLightbox.classList.add("is-open");
  imgLightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeImage(){
  if(!imgLightbox) return;
  imgLightbox.classList.remove("is-open");
  imgLightbox.setAttribute("aria-hidden", "true");
  if(imgPreview) imgPreview.src = "";
  document.body.style.overflow = "";
  LB_IMAGES = [];
  LB_INDEX = 0;
}

function openImage(src, alt){ openGallery([{ src, alt }], 0); }
function lbNext(){ if(LB_IMAGES.length <= 1) return; LB_INDEX = (LB_INDEX + 1) % LB_IMAGES.length; lbRender(); }
function lbPrev(){ if(LB_IMAGES.length <= 1) return; LB_INDEX = (LB_INDEX - 1 + LB_IMAGES.length) % LB_IMAGES.length; lbRender(); }

imgClose?.addEventListener("click", closeImage);
imgLightbox?.addEventListener("click", (e) => { if (e.target === imgLightbox) closeImage(); });
imgNext?.addEventListener("click", (e)=>{ e.stopPropagation(); lbNext(); });
imgPrev?.addEventListener("click", (e)=>{ e.stopPropagation(); lbPrev(); });

window.addEventListener("keydown", (e) => {
  if (!imgLightbox || !imgLightbox.classList.contains("is-open")) return;
  if (e.key === "Escape") closeImage();
  if (e.key === "ArrowRight") lbNext();
  if (e.key === "ArrowLeft") lbPrev();
});

/* klik gambar produk => openImage */
document.addEventListener("click", (e) => {
  const img = e.target.closest(".produk-img");
  if(!img) return;
  openImage(img.getAttribute("src"), img.getAttribute("alt"));
});

/* =========================
   4) CLICK CARD => AUTOFILL
========================= */
document.addEventListener("click", function (e) {
  if (e.target.closest(".produk-img")) return;

  const card = e.target.closest(".produk-item");
  if (!card) return;

  const namaProduk = card.dataset.produk;
  const hargaProduk = card.dataset.harga;

  const pesanEl = document.getElementById("pesan");
  if(pesanEl){
    pesanEl.value =
      `Product: ${namaProduk}\n` +
      `Price: ${hargaProduk}\n\n` +
      `Delivery date:\n` +
      `Address:\n` +
      `Notes:`;
  }

  document.getElementById("kontak")?.scrollIntoView({ behavior: "smooth" });
});

/* =========================
   5) WHATSAPP + THANK YOU
========================= */
const form = document.getElementById("whatsappForm");
const thankyouModal = document.getElementById("thankyouModal");
const closeBtn = document.getElementById("tyClose");
const okBtn = document.getElementById("tyOk");

function openThankyou(){
  if(!thankyouModal) return;
  thankyouModal.classList.add("is-open");
  thankyouModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeThankyou(){
  if(!thankyouModal) return;
  thankyouModal.classList.remove("is-open");
  thankyouModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

closeBtn?.addEventListener("click", closeThankyou);
okBtn?.addEventListener("click", closeThankyou);
thankyouModal?.addEventListener("click", (ev) => { if (ev.target === thankyouModal) closeThankyou(); });
window.addEventListener("keydown", (ev) => { if (ev.key === "Escape") closeThankyou(); });

form?.addEventListener("submit", function (ev) {
  ev.preventDefault();

  const phone = "6285726057805";
  const nama = document.getElementById("nama")?.value.trim() || "";
  const pesan = document.getElementById("pesan")?.value.trim() || "";

  const message =
    `Hello Semesta Florist\n\n` +
    `My name is ${nama}.\n` +
    `I would like to place an order with the following details:\n\n` +
    `${pesan}\n\n` +
    `Thank you.`;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");

  requestAnimationFrame(openThankyou);
  form.reset();
});

/* =========================
   6) HEADER + NAV + TOP
========================= */
const header = document.getElementById("siteHeader");
const nav = document.getElementById("siteNav");
const navToggle = document.getElementById("navToggle");
const toTop = document.getElementById("toTop");

navToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  navToggle.classList.toggle("is-open-rose", open);
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
});

document.addEventListener("click", e => {
  if(e.target.closest("#navToggle") || e.target.closest("#siteNav")) return;
  nav.classList.remove("is-open");
  navToggle?.classList.remove("is-open-rose");
  navToggle?.setAttribute("aria-expanded", "false");
});

toTop?.addEventListener("click", () => window.scrollTo({ top:0, behavior:"smooth" }));

let lastY = window.scrollY;
window.addEventListener("scroll", () => {
  const y = window.scrollY;

  if (y > 500) toTop?.classList.add("is-show");
  else toTop?.classList.remove("is-show");

  if (y > lastY && y > 80) header?.classList.add("is-hidden");
  else header?.classList.remove("is-hidden");

  lastY = y;
});

/* =========================
   7) MONEY BOUQUET SLIDESHOW
========================= */
(function(){
  const carousel = document.getElementById("mbCarousel");
  if(!carousel) return;

  const slidesWrap = document.getElementById("mbSlides");
  const slides = slidesWrap ? Array.from(slidesWrap.querySelectorAll(".mb-slide")) : [];
  const prevBtn = document.getElementById("mbPrev");
  const nextBtn = document.getElementById("mbNext");
  const dotsWrap = document.getElementById("mbDots");
  const orderFillBtn = document.getElementById("mbOrderFill");

  if(!slides.length || !dotsWrap) return;

  let idx = 0;
  let timer = null;
  const AUTOPLAY = true;
  const INTERVAL = 3800;
  const PAUSE_ON_HOVER = true;

  function setActive(i){
    idx = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle("is-active", k === idx));
    const dots = dotsWrap.querySelectorAll(".mb-dot");
    dots.forEach((d, k) => d.classList.toggle("is-active", k === idx));
  }

  dotsWrap.innerHTML = slides
    .map((_,i)=>`<button class="mb-dot ${i===0?'is-active':''}" type="button" aria-label="Go to slide ${i+1}"></button>`)
    .join("");

  dotsWrap.querySelectorAll(".mb-dot").forEach((dot,i)=>{
    dot.addEventListener("click", ()=>{ setActive(i); restart(); });
  });

  prevBtn?.addEventListener("click", ()=>{ setActive(idx-1); restart(); });
  nextBtn?.addEventListener("click", ()=>{ setActive(idx+1); restart(); });

  slides.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      const imgs = slides
        .map(s => s.querySelector("img"))
        .filter(Boolean)
        .map(im => ({ src: im.getAttribute("src"), alt: im.getAttribute("alt") }));
      openGallery(imgs, i);
    });
  });

  function start(){
    if(!AUTOPLAY) return;
    stop();
    timer = setInterval(()=> setActive(idx+1), INTERVAL);
  }
  function stop(){
    if(timer) clearInterval(timer);
    timer = null;
  }
  function restart(){ if(AUTOPLAY) start(); }

  if(PAUSE_ON_HOVER){
    carousel.addEventListener("