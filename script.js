// =========================================
// ShifraCode: إعدادات سهلة التعديل
// =========================================

// 1) أرقام الواتساب: بالكود الدولي، من غير + ومن غير الصفر اللي في الأول
//    مثال: رقم مصري 01012345678 يتكتب "201012345678"
const WHATSAPP_NUMBERS = {
  eg: "201118308203", // مصر
  ae: "971525470063", // الإمارات
};
// الرقم اللي الزراير العادية بتستخدمه (eg أو ae)
const WHATSAPP_DEFAULT = "ae";

// 2) الرسالة اللي هتظهر للعميل جاهزة لما يدوس على الزرار (حسب لغة الصفحة)
const WHATSAPP_MESSAGES = {
  ar: "مرحبًا شفرة كود، لديّ فكرة مشروع وأودّ التحدث معكم.",
  en: "Hi ShifraCode, I have a project idea and would like to talk.",
};
const WHATSAPP_MESSAGE = WHATSAPP_MESSAGES[document.documentElement.lang] || WHATSAPP_MESSAGES.en;

// =========================================
// زراير الواتساب
// =========================================
// أي زرار عليه data-wa="ae" بيستخدم رقم الإمارات، والباقي بيستخدم الرقم الأساسي
document.querySelectorAll(".js-whatsapp").forEach((button) => {
  const number = WHATSAPP_NUMBERS[button.dataset.wa || WHATSAPP_DEFAULT];
  if (!number) return; // لو الرقم فاضي، الزرار هيودّي لقسم التواصل بس
  const url = "https://wa.me/" + number + "?text=" + encodeURIComponent(WHATSAPP_MESSAGE);
  button.href = url;
  button.target = "_blank";
  button.rel = "noopener";
});

// السنة في الفوتر بتتحدث لوحدها
document.getElementById("year").textContent = new Date().getFullYear();

// =========================================
// الكود اللي بينزل في خلفية الواجهة
// =========================================
const canvas = document.querySelector(".hero__rain");
const ctx = canvas.getContext("2d");
const CHARS = "01#$%{}<>/*;=+?&!";
const FONT_SIZE = 16;
const RAIN = "#5B615A";
const LIME = "#C6FF3D";
let columns = [];

function resize() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = canvas.offsetHeight * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  const count = Math.ceil(canvas.offsetWidth / FONT_SIZE);
  const rows = Math.ceil(canvas.offsetHeight / FONT_SIZE);
  columns = Array.from({ length: count }, () => Math.floor(Math.random() * rows) - 10);
}

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function drawFrame() {
  // طبقة شفافة بتمسح ببطء، فيبان ذيل للحروف
  ctx.fillStyle = "rgba(10, 11, 10, 0.12)";
  ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
  ctx.font = FONT_SIZE + "px Consolas, monospace";

  columns.forEach((y, i) => {
    const x = i * FONT_SIZE;
    // أغلب الحروف رمادي، وأحيانًا حرف ليموني
    ctx.fillStyle = Math.random() < 0.025 ? LIME : RAIN;
    ctx.fillText(randomChar(), x, y * FONT_SIZE);
    columns[i] = y * FONT_SIZE > canvas.offsetHeight && Math.random() > 0.975 ? 0 : y + 1;
  });
}

// رسم ثابت (بدون حركة) للي مشغّل "تقليل الحركة"
function drawStatic() {
  ctx.font = FONT_SIZE + "px Consolas, monospace";
  for (let x = 0; x < canvas.offsetWidth; x += FONT_SIZE) {
    for (let y = FONT_SIZE; y < canvas.offsetHeight; y += FONT_SIZE) {
      ctx.globalAlpha = Math.random() * 0.35;
      ctx.fillStyle = Math.random() < 0.02 ? LIME : RAIN;
      ctx.fillText(randomChar(), x, y);
    }
  }
  ctx.globalAlpha = 1;
}

resize();
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion) {
  drawStatic();
  window.addEventListener("resize", () => { resize(); drawStatic(); });
} else {
  window.addEventListener("resize", resize);
  setInterval(drawFrame, 55);
}

// فيديو العرض: يقف لو المستخدم مشغّل "تقليل الحركة" (يقدر يشغّله بنفسه من الزرار)
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll(".demo__video").forEach((video) => {
    video.removeAttribute("autoplay");
    video.pause();
  });
}
