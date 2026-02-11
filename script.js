/**
 * =============================================
 *  KAYRO AI v7.0 — Firebase Auth + Cloud Sync
 *  Developer: Youssef Hegazy
 * =============================================
 */

// ==========================================
//  FIREBASE CONFIG
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyA0vKUkQ9M1c9sNPUqi4j7gdFFdGevZL8Y",
  authDomain: "kayro-ai.firebaseapp.com",
  projectId: "kayro-ai",
  storageBucket: "kayro-ai.firebasestorage.app",
  messagingSenderId: "200848600566",
  appId: "1:200848600566:web:f3132fa6fe7ecb86086bd7",
  measurementId: "G-LJBMW3PER9"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline persistence
db.enablePersistence({ synchronizeTabs: true }).catch(() => {});

// ==========================================
//  STARFIELD
// ==========================================
(function initStarfield() {
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  let W, H;
  const STAR_COUNT = 200;
  const stars = [];
  const shootingStars = [];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

  class Star {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W; this.y = Math.random() * H;
      this.r = Math.random() * 1.2 + 0.3;
      this.baseA = Math.random() * 0.6 + 0.15;
      this.a = this.baseA;
      this.speed = Math.random() * 0.02 + 0.005;
      this.off = Math.random() * Math.PI * 2;
    }
    update(t) { this.a = Math.max(0.05, Math.min(1, this.baseA + Math.sin(t * this.speed + this.off) * 0.2)); }
    draw() {
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${this.a})`; ctx.fill();
      if (this.r > 1) {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${this.a * 0.06})`; ctx.fill();
      }
    }
  }

  class ShootingStar {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W * 0.6; this.y = Math.random() * H * 0.4;
      this.len = Math.random() * 90 + 50; this.spd = Math.random() * 12 + 8;
      this.angle = (Math.random() * 20 + 10) * (Math.PI / 180);
      this.a = 0; this.phase = "fadein"; this.traveled = 0;
      this.maxTravel = Math.random() * 400 + 300; this.active = true;
    }
    update() {
      this.x += Math.cos(this.angle) * this.spd;
      this.y += Math.sin(this.angle) * this.spd;
      this.traveled += this.spd;
      if (this.phase === "fadein") { this.a += 0.08; if (this.a >= 0.8) { this.a = 0.8; this.phase = "travel"; } }
      else if (this.phase === "travel") { if (this.traveled > this.maxTravel) this.phase = "fadeout"; }
      else { this.a -= 0.04; if (this.a <= 0) { this.a = 0; this.active = false; } }
    }
    draw() {
      if (this.a <= 0) return;
      const tx = this.x - Math.cos(this.angle) * this.len;
      const ty = this.y - Math.sin(this.angle) * this.len;
      const g = ctx.createLinearGradient(tx, ty, this.x, this.y);
      g.addColorStop(0, `rgba(255,255,255,0)`);
      g.addColorStop(1, `rgba(255,255,255,${this.a})`);
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = g; ctx.lineWidth = 1.2; ctx.stroke();
    }
  }

  resize();
  for (let i = 0; i < STAR_COUNT; i++) stars.push(new Star());
  let lastShoot = 0, frame = 0;
  function animate(ts) {
    frame++; ctx.clearRect(0, 0, W, H);
    for (const s of stars) { s.update(frame); s.draw(); }
    if (ts - lastShoot > 5000 + Math.random() * 4000) { shootingStars.push(new ShootingStar()); lastShoot = ts; }
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      shootingStars[i].update(); shootingStars[i].draw();
      if (!shootingStars[i].active) shootingStars.splice(i, 1);
    }
    requestAnimationFrame(animate);
  }
  window.addEventListener("resize", () => { resize(); for (const s of stars) { s.x = Math.random() * W; s.y = Math.random() * H; } });
  requestAnimationFrame(animate);
})();

// ==========================================
//  i18n
// ==========================================
const i18n = {
  en: {
    newChat:"New Chat", history:"History",
    heroSub:"Your intelligent companion for every question.",
    s1Title:"Explain quantum computing", s1Desc:"In simple terms for a beginner",
    s2Title:"Write a business plan", s2Desc:"For an innovative tech startup",
    s3Title:"Boost my productivity", s3Desc:"Daily strategies and routines",
    s4Title:"Debug my code", s4Desc:"Find and fix JavaScript errors",
    inputPlaceholder:"Ask KAYRO anything...",
    disclaimer:"KAYRO AI may produce inaccurate results. Developed by Youssef Hegazy.",
    you:"You", kayro:"KAYRO", modelName:"KAYRO AI", online:"Online",
    settings:"Settings", profile:"Profile",
    yourName:"Your Name", namePlaceholder:"Enter your name...",
    yourAge:"Your Age",
    customInstructions:"Custom Instructions",
    instructionsDesc:"Tell KAYRO AI how to behave.",
    instructionsPlaceholder:"e.g., Always respond in bullet points...",
    language:"Language", theme:"Theme", dark:"Dark", light:"Light",
    background:"Background", bgStars:"Stars", bgBlack:"Black", bgWhite:"White", bgAbstract:"Abstract", bgNone:"None",
    account:"Account", emailLabel:"Email:", provider:"Provider:",
    dangerZone:"Danger Zone", deleteAll:"Delete all conversations",
    cancel:"Cancel", delete:"Delete",
    confirmDeleteAll:"Are you sure you want to delete all conversations?",
    confirmDeleteOne:"Delete this conversation?",
    tempNotice:"Temporary chat — will not be saved",
    tempLabel:"TEMP", greeting:"Hello",
    deletedToast:"Conversation deleted", allDeletedToast:"All conversations deleted",
    nameSaved:"Settings saved", confirmTitle:"Confirm",
    fileTooBig:"File too large (max 10MB)", copied:"Copied!", copy:"Copy",
    generatingImage:"Generating image...",
    listen:"Listen", voiceNotSupported:"Voice not supported",
    downloading:"Downloading...",
    signIn:"Sign In", signUp:"Sign Up", email:"Email", password:"Password",
    fullName:"Full Name", createAccount:"Create Account",
    or:"or", googleSign:"Continue with Google",
    forgotPassword:"Forgot password?", resetPassword:"Reset Password",
    resetDesc:"Enter your email to receive a reset link",
    sendReset:"Send Reset Link", resetSent:"Reset link sent! Check your email.",
    signOut:"Sign Out", signOutConfirm:"Sign out of your account?",
    authErrorEmail:"Invalid email address",
    authErrorPassword:"Password must be at least 6 characters",
    authErrorWrongPassword:"Incorrect email or password",
    authErrorUserNotFound:"No account found with this email",
    authErrorEmailInUse:"This email is already registered",
    authErrorGeneric:"An error occurred. Please try again.",
    authErrorNetwork:"Network error. Check your connection.",
    syncSuccess:"Data synced from cloud",
  },
  ar: {
    newChat:"محادثة جديدة", history:"السجل",
    heroSub:"رفيقك الذكي لكل سؤال.",
    s1Title:"اشرح الحوسبة الكمية", s1Desc:"بعبارات بسيطة للمبتدئين",
    s2Title:"اكتب خطة عمل", s2Desc:"لشركة تقنية ناشئة",
    s3Title:"عزّز إنتاجيتي", s3Desc:"استراتيجيات وروتين يومي",
    s4Title:"صحّح الكود", s4Desc:"ابحث عن أخطاء جافاسكريبت",
    inputPlaceholder:"اسأل KAYRO أي شيء...",
    disclaimer:"قد ينتج KAYRO AI نتائج غير دقيقة. تطوير يوسف حجازي.",
    you:"أنت", kayro:"KAYRO", modelName:"KAYRO AI", online:"متصل",
    settings:"الإعدادات", profile:"الملف الشخصي",
    yourName:"اسمك", namePlaceholder:"أدخل اسمك...",
    yourAge:"عمرك",
    customInstructions:"تعليمات مخصصة",
    instructionsDesc:"أخبر KAYRO AI كيف يتصرف.",
    instructionsPlaceholder:"مثال: أجب دائمًا بنقاط...",
    language:"اللغة", theme:"المظهر", dark:"داكن", light:"فاتح",
    background:"الخلفية", bgStars:"نجوم", bgBlack:"أسود", bgWhite:"أبيض", bgAbstract:"مجرد", bgNone:"بدون",
    account:"الحساب", emailLabel:"الإيميل:", provider:"طريقة الدخول:",
    dangerZone:"منطقة الخطر", deleteAll:"حذف جميع المحادثات",
    cancel:"إلغاء", delete:"حذف",
    confirmDeleteAll:"هل أنت متأكد من حذف جميع المحادثات؟",
    confirmDeleteOne:"حذف هذه المحادثة؟",
    tempNotice:"محادثة مؤقتة — لن يتم حفظها",
    tempLabel:"مؤقت", greeting:"مرحبًا",
    deletedToast:"تم حذف المحادثة", allDeletedToast:"تم حذف جميع المحادثات",
    nameSaved:"تم حفظ الإعدادات", confirmTitle:"تأكيد",
    fileTooBig:"الملف كبير جدًا (الحد الأقصى 10 ميجا)", copied:"تم النسخ!", copy:"نسخ",
    generatingImage:"جاري إنشاء الصورة...",
    listen:"استمع", voiceNotSupported:"الصوت غير مدعوم",
    downloading:"جاري التحميل...",
    signIn:"تسجيل الدخول", signUp:"إنشاء حساب", email:"الإيميل", password:"كلمة المرور",
    fullName:"الاسم الكامل", createAccount:"إنشاء حساب",
    or:"أو", googleSign:"المتابعة بحساب Google",
    forgotPassword:"نسيت كلمة المرور؟", resetPassword:"إعادة تعيين كلمة المرور",
    resetDesc:"أدخل إيميلك لإرسال رابط إعادة التعيين",
    sendReset:"إرسال رابط", resetSent:"تم الإرسال! تحقق من إيميلك.",
    signOut:"تسجيل الخروج", signOutConfirm:"تسجيل الخروج من حسابك؟",
    authErrorEmail:"إيميل غير صحيح",
    authErrorPassword:"كلمة المرور يجب أن تكون 6 أحرف على الأقل",
    authErrorWrongPassword:"إيميل أو كلمة مرور خاطئة",
    authErrorUserNotFound:"لا يوجد حساب بهذا الإيميل",
    authErrorEmailInUse:"هذا الإيميل مسجل بالفعل",
    authErrorGeneric:"حدث خطأ. حاول مرة أخرى.",
    authErrorNetwork:"خطأ في الشبكة. تحقق من اتصالك.",
    syncSuccess:"تمت مزامنة البيانات من السحابة",
  },
};

// ==========================================
//  SAMPLE CONVERSATIONS
// ==========================================
const sampleConversations = {
  en: [
    { title:"Explain quantum computing", messages:[
      { role:"user", text:"Can you explain quantum computing in simple terms?" },
      { role:"ai", text:"**Classical computers** use **bits** — 0 or 1.\n\n**Quantum computers** use **qubits** that can be 0, 1, or *both simultaneously* through **superposition**.\n\nAnother key concept is **entanglement** — when two qubits become linked.\n\nThis makes quantum computers powerful for:\n• **Cryptography**\n• **Drug discovery**\n• **Optimization**\n• **AI training**" }
    ]},
    { title:"Write a business plan", messages:[
      { role:"user", text:"Help me write a business plan for a tech startup." },
      { role:"ai", text:"**1. Executive Summary**\nMission, vision, product.\n\n**2. Problem & Opportunity**\nDefine the pain point.\n\n**3. Your Solution**\nWhat makes it unique?\n\n**4. Market Analysis**\n• TAM • Segments • Competitors\n\n**5. Business Model**\nRevenue streams.\n\n**6. Financial Projections**\n3-year forecast.\n\n**7. Team**\nFounders and key hires." }
    ]},
    { title:"Boost my productivity", messages:[
      { role:"user", text:"Give me strategies to be more productive." },
      { role:"ai", text:"**🌅 Morning Protocol**\n• Wake at same time daily\n• No phone for 30 min\n• Tackle **#1 priority** first\n\n**⚡ Deep Work**\n• **90-minute focus sprints**\n• Phone on DND\n\n**📋 Task Management**\n• **3 key tasks** daily max\n• **2-minute rule**: if quick, do it now\n\n**🌙 Evening Reset**\n• Review wins\n• Plan tomorrow's top 3" }
    ]},
    { title:"Debug my code", messages:[
      { role:"user", text:"Help me find bugs:\n```javascript\nfunction sum(arr) {\n  let total;\n  for (let i = 0; i <= arr.length; i++) {\n    total += arr[i];\n  }\n  return total;\n}\n```" },
      { role:"ai", text:"Found **2 bugs**:\n\n**Bug 1: Uninitialized variable**\n`let total;` → `undefined`\n✅ Fix: `let total = 0;`\n\n**Bug 2: Off-by-one error**\n`i <= arr.length` → out of bounds\n✅ Fix: `i < arr.length`\n\n**Corrected:**\n```javascript\nfunction sum(arr) {\n  let total = 0;\n  for (let i = 0; i < arr.length; i++) {\n    total += arr[i];\n  }\n  return total;\n}\n```" }
    ]},
  ],
  ar: [
    { title:"اشرح الحوسبة الكمية", messages:[
      { role:"user", text:"هل يمكنك شرح الحوسبة الكمية ببساطة؟" },
      { role:"ai", text:"**الكمبيوتر العادي** يستخدم **بتات** — إما 0 أو 1.\n\n**الكمبيوتر الكمي** يستخدم **كيوبتات** يمكنها أن تكون 0 و1 *معًا* بفضل **التراكب**.\n\nهذا يجعله قويًا في:\n• **التشفير**\n• **اكتشاف الأدوية**\n• **التحسين**\n• **الذكاء الاصطناعي**" }
    ]},
    { title:"اكتب خطة عمل", messages:[
      { role:"user", text:"ساعدني في كتابة خطة عمل لشركة تقنية." },
      { role:"ai", text:"**١. الملخص التنفيذي**\nالمهمة والرؤية.\n\n**٢. المشكلة والفرصة**\nحدد نقطة الألم.\n\n**٣. الحل**\nصف منتجك.\n\n**٤. تحليل السوق**\n• حجم السوق • المنافسون\n\n**٥. نموذج العمل**\nمصادر الإيرادات.\n\n**٦. التوقعات المالية**\nتوقعات ٣ سنوات." }
    ]},
    { title:"عزّز إنتاجيتي", messages:[
      { role:"user", text:"أعطني استراتيجيات للإنتاجية." },
      { role:"ai", text:"**🌅 بروتوكول الصباح**\n• استيقظ بنفس الوقت\n• لا هاتف أول ٣٠ دقيقة\n\n**⚡ العمل العميق**\n• **جلسات ٩٠ دقيقة**\n• أوقف المشتتات\n\n**📋 إدارة المهام**\n• **٣ مهام** فقط يوميًا\n\n**🌙 إعادة الضبط**\n• راجع إنجازاتك\n• خطط للغد" }
    ]},
    { title:"صحّح الكود", messages:[
      { role:"user", text:"ساعدني في إيجاد الأخطاء:\n```javascript\nfunction sum(arr) {\n  let total;\n  for (let i = 0; i <= arr.length; i++) {\n    total += arr[i];\n  }\n  return total;\n}\n```" },
      { role:"ai", text:"وجدت **خطأين**:\n\n**١: متغير غير مُهيَّأ**\n`let total;` → `undefined`\n✅ `let total = 0;`\n\n**٢: تجاوز المصفوفة**\n`i <= arr.length`\n✅ `i < arr.length`\n\n```javascript\nfunction sum(arr) {\n  let total = 0;\n  for (let i = 0; i < arr.length; i++) {\n    total += arr[i];\n  }\n  return total;\n}\n```" }
    ]},
  ],
};

// ==========================================
//  APPLICATION STATE
// ==========================================
let currentLang = localStorage.getItem("kayro_lang") || "en";
let userName = "";
let userAge = "";
let customInstructions = "";
let currentTheme = localStorage.getItem("kayro_theme") || "dark";
let currentBg = localStorage.getItem("kayro_bg") || "stars";
let conversations = [];
let activeConversationId = null;
let isTempMode = false;
let pendingFiles = [];
let confirmCallback = null;
let isGenerating = false;
let currentTTS = null;
let isRecording = false;
let recognition = null;
let currentUser = null;
let syncDebounce = null;

// ==========================================
//  DOM REFERENCES
// ==========================================
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const authScreen = $("#authScreen"), appContainer = $("#appContainer");
const loginForm = $("#loginForm"), registerForm = $("#registerForm");
const loginTab = $("#loginTab"), registerTab = $("#registerTab");
const loginEmail = $("#loginEmail"), loginPassword = $("#loginPassword");
const registerName = $("#registerName"), registerEmail = $("#registerEmail"), registerPassword = $("#registerPassword");
const loginError = $("#loginError"), registerError = $("#registerError");
const loginSubmit = $("#loginSubmit"), registerSubmit = $("#registerSubmit");
const loginEye = $("#loginEye"), registerEye = $("#registerEye");
const googleSignIn = $("#googleSignIn");
const forgotBtn = $("#forgotBtn"), forgotModal = $("#forgotModal");
const forgotEmail = $("#forgotEmail"), forgotError = $("#forgotError");
const forgotCancel = $("#forgotCancel"), forgotSubmit = $("#forgotSubmit");
const authLangToggle = $("#authLangToggle"), authLangLabel = $("#authLangLabel");
const authSubtitle = $("#authSubtitle");

const sidebar = $("#sidebar"), sidebarOpen = $("#sidebarOpen"), sidebarClose = $("#sidebarClose");
const overlay = $("#overlay"), newChatBtn = $("#newChatBtn"), tempChatBtn = $("#tempChatBtn");
const chatHistory = $("#chatHistory"), clearAllBtn = $("#clearAllBtn");
const welcomeScreen = $("#welcomeScreen"), chatArea = $("#chatArea"), chatMessages = $("#chatMessages");
const userInput = $("#userInput"), sendBtn = $("#sendBtn");
const langToggle = $("#langToggle"), langLabel = $("#langLabel");
const sampleGrid = $("#sampleGrid"), logoBtn = $("#logoBtn"), heroGreeting = $("#heroGreeting");
const tempBanner = $("#tempBanner"), tempBannerClose = $("#tempBannerClose");
const attachBtn = $("#attachBtn"), fileInput = $("#fileInput"), filePreviewArea = $("#filePreviewArea");
const settingsBtn = $("#settingsBtn"), settingsOverlay = $("#settingsOverlay"), settingsClose = $("#settingsClose");
const userNameInput = $("#userNameInput"), userAgeInput = $("#userAgeInput");
const customInstructionsInput = $("#customInstructionsInput");
const langEn = $("#langEn"), langAr = $("#langAr");
const themeDark = $("#themeDark"), themeLight = $("#themeLight");
const deleteAllBtn = $("#deleteAllChatsBtn");
const confirmOverlay = $("#confirmOverlay"), confirmTitle = $("#confirmTitle");
const confirmText = $("#confirmText"), confirmCancel = $("#confirmCancel"), confirmOk = $("#confirmOk");
const imageViewer = $("#imageViewer"), ivClose = $("#ivClose"), ivImage = $("#ivImage"), ivDownload = $("#ivDownload");
const micBtn = $("#micBtn");
const bgOptions = $("#bgOptions");
const logoutBtn = $("#logoutBtn"), signOutSettingsBtn = $("#signOutSettingsBtn");
const sidebarUserAvatar = $("#sidebarUserAvatar"), sidebarUserName = $("#sidebarUserName"), sidebarUserEmail = $("#sidebarUserEmail");
const accountEmail = $("#accountEmail"), accountProvider = $("#accountProvider");

// ==========================================
//  FIREBASE AUTH
// ==========================================
auth.onAuthStateChanged(async (user) => {
  if (user) {
    currentUser = user;
    authScreen.classList.add("hidden");
    appContainer.classList.remove("hidden");
    updateUserUI(user);
    await loadCloudData(user.uid);
    applyTheme(currentTheme);
    applyBackground(currentBg);
    applyLanguage(currentLang);
    updateGreeting();
    renderChatHistory();
    initSpeechRecognition();
    bindAppEvents();
  } else {
    currentUser = null;
    authScreen.classList.remove("hidden");
    appContainer.classList.add("hidden");
    applyLanguage(currentLang);
    bindAuthEvents();
  }
});

function updateUserUI(user) {
  const displayName = user.displayName || user.email.split("@")[0];
  const email = user.email;
  const photoURL = user.photoURL;

  sidebarUserName.textContent = displayName;
  sidebarUserEmail.textContent = email;
  accountEmail.textContent = email;

  const providerData = user.providerData[0];
  const providerName = providerData?.providerId === "google.com" ? "Google" : "Email/Password";
  accountProvider.textContent = providerName;

  if (photoURL) {
    sidebarUserAvatar.innerHTML = `<img src="${photoURL}" alt="${displayName}" />`;
  } else {
    sidebarUserAvatar.textContent = displayName.charAt(0).toUpperCase();
  }

  if (!userName) {
    userName = displayName;
    userNameInput.value = userName;
  }
}

// ==========================================
//  AUTH EVENTS (bound once)
// ==========================================
let authEventsBound = false;
function bindAuthEvents() {
  if (authEventsBound) return;
  authEventsBound = true;

  // Tab switching
  loginTab.addEventListener("click", () => {
    loginTab.classList.add("active"); registerTab.classList.remove("active");
    loginForm.classList.remove("hidden"); registerForm.classList.add("hidden");
    loginError.textContent = ""; registerError.textContent = "";
  });
  registerTab.addEventListener("click", () => {
    registerTab.classList.add("active"); loginTab.classList.remove("active");
    registerForm.classList.remove("hidden"); loginForm.classList.add("hidden");
    loginError.textContent = ""; registerError.textContent = "";
  });

  // Password visibility
  loginEye.addEventListener("click", () => togglePasswordVisibility(loginPassword));
  registerEye.addEventListener("click", () => togglePasswordVisibility(registerPassword));

  // Email/Password Login
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.textContent = "";
    loginSubmit.classList.add("loading"); loginSubmit.disabled = true;
    try {
      await auth.signInWithEmailAndPassword(loginEmail.value.trim(), loginPassword.value);
    } catch (err) {
      loginError.textContent = getAuthErrorMessage(err.code);
    }
    loginSubmit.classList.remove("loading"); loginSubmit.disabled = false;
  });

  // Email/Password Register
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    registerError.textContent = "";
    registerSubmit.classList.add("loading"); registerSubmit.disabled = true;
    try {
      const cred = await auth.createUserWithEmailAndPassword(registerEmail.value.trim(), registerPassword.value);
      await cred.user.updateProfile({ displayName: registerName.value.trim() });
      userName = registerName.value.trim();
    } catch (err) {
      registerError.textContent = getAuthErrorMessage(err.code);
    }
    registerSubmit.classList.remove("loading"); registerSubmit.disabled = false;
  });

  // Google Sign In
  googleSignIn.addEventListener("click", async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await auth.signInWithPopup(provider);
    } catch (err) {
      loginError.textContent = getAuthErrorMessage(err.code);
    }
  });

  // Forgot Password
  forgotBtn.addEventListener("click", () => {
    forgotModal.classList.remove("hidden");
    forgotError.textContent = "";
    forgotEmail.value = loginEmail.value || "";
  });
  forgotCancel.addEventListener("click", () => forgotModal.classList.add("hidden"));

  forgotSubmit.addEventListener("click", async () => {
    forgotError.textContent = "";
    forgotSubmit.classList.add("loading"); forgotSubmit.disabled = true;
    try {
      await auth.sendPasswordResetEmail(forgotEmail.value.trim());
      forgotError.textContent = i18n[currentLang].resetSent;
      forgotError.classList.add("success");
      setTimeout(() => { forgotModal.classList.add("hidden"); forgotError.classList.remove("success"); }, 3000);
    } catch (err) {
      forgotError.classList.remove("success");
      forgotError.textContent = getAuthErrorMessage(err.code);
    }
    forgotSubmit.classList.remove("loading"); forgotSubmit.disabled = false;
  });

  // Auth language toggle
  authLangToggle.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "ar" : "en";
    localStorage.setItem("kayro_lang", currentLang);
    applyLanguage(currentLang);
  });
}

function togglePasswordVisibility(input) {
  input.type = input.type === "password" ? "text" : "password";
}

function getAuthErrorMessage(code) {
  const strings = i18n[currentLang];
  switch (code) {
    case "auth/invalid-email": return strings.authErrorEmail;
    case "auth/weak-password": return strings.authErrorPassword;
    case "auth/wrong-password":
    case "auth/invalid-credential": return strings.authErrorWrongPassword;
    case "auth/user-not-found": return strings.authErrorUserNotFound;
    case "auth/email-already-in-use": return strings.authErrorEmailInUse;
    case "auth/network-request-failed": return strings.authErrorNetwork;
    case "auth/popup-closed-by-user": return "";
    default: return strings.authErrorGeneric;
  }
}

// ==========================================
//  CLOUD DATA — FIRESTORE
// ==========================================
async function loadCloudData(uid) {
  try {
    const doc = await db.collection("users").doc(uid).get();
    if (doc.exists) {
      const data = doc.data();
      conversations = data.conversations || [];
      userName = data.userName || currentUser.displayName || "";
      userAge = data.userAge || "";
      customInstructions = data.customInstructions || "";
      currentLang = data.lang || currentLang;
      currentTheme = data.theme || currentTheme;
      currentBg = data.bg || currentBg;

      localStorage.setItem("kayro_lang", currentLang);
      localStorage.setItem("kayro_theme", currentTheme);
      localStorage.setItem("kayro_bg", currentBg);

      userNameInput.value = userName;
      userAgeInput.value = userAge;
      customInstructionsInput.value = customInstructions;
    } else {
      // First login — create document
      await saveCloudData();
    }
  } catch (err) {
    console.error("Cloud load error:", err);
    // Fallback to localStorage
    conversations = JSON.parse(localStorage.getItem("kayro_convs") || "[]");
  }
}

function saveCloudData() {
  if (!currentUser) return;

  // Debounce saves
  clearTimeout(syncDebounce);
  syncDebounce = setTimeout(async () => {
    try {
      // Strip large file data from conversations for Firestore (1MB limit)
      const cleanConvs = conversations.filter(c => !c.temp).map(c => ({
        ...c,
        messages: c.messages.map(m => {
          const cleaned = { role: m.role, text: m.text };
          if (m.attachments) {
            cleaned.attachments = m.attachments.map(a => ({
              name: a.name, type: a.type, isImage: a.isImage,
              // Only save small data URLs (< 50KB), skip large ones
              dataUrl: a.dataUrl && a.dataUrl.length < 50000 ? a.dataUrl : null
            }));
          }
          return cleaned;
        })
      }));

      await db.collection("users").doc(currentUser.uid).set({
        conversations: cleanConvs,
        userName, userAge, customInstructions,
        lang: currentLang,
        theme: currentTheme,
        bg: currentBg,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.error("Cloud save error:", err);
    }
  }, 1500);

  // Also save locally
  const toSave = conversations.filter(c => !c.temp);
  localStorage.setItem("kayro_convs", JSON.stringify(toSave));
}

// ==========================================
//  APP EVENTS
// ==========================================
let appEventsBound = false;
function bindAppEvents() {
  if (appEventsBound) return;
  appEventsBound = true;

  sidebarOpen.addEventListener("click", openSidebar);
  sidebarClose.addEventListener("click", closeSidebar);
  overlay.addEventListener("click", closeSidebar);

  logoBtn.addEventListener("click", () => { startNewChat(); closeSidebar(); });
  newChatBtn.addEventListener("click", () => { startNewChat(); closeSidebar(); });
  tempChatBtn.addEventListener("click", () => { startTempChat(); closeSidebar(); });
  tempBannerClose.addEventListener("click", endTempChat);

  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "ar" : "en";
    localStorage.setItem("kayro_lang", currentLang);
    applyLanguage(currentLang); updateGreeting(); saveCloudData();
  });

  sampleGrid.querySelectorAll(".sample-card").forEach(card => {
    card.addEventListener("click", () => loadSampleConversation(parseInt(card.dataset.sample, 10)));
  });

  sendBtn.addEventListener("click", handleSend);
  userInput.addEventListener("input", () => {
    sendBtn.disabled = userInput.value.trim() === "" && pendingFiles.length === 0;
    autoResize(userInput);
  });
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (userInput.value.trim() || pendingFiles.length > 0) handleSend(); }
  });

  attachBtn.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", handleFileSelect);
  micBtn.addEventListener("click", toggleVoiceInput);

  // Settings
  settingsBtn.addEventListener("click", openSettings);
  settingsClose.addEventListener("click", closeSettings);
  settingsOverlay.addEventListener("click", (e) => { if (e.target === settingsOverlay) closeSettings(); });

  userNameInput.addEventListener("change", saveSettingsFromInputs);
  userAgeInput.addEventListener("change", saveSettingsFromInputs);
  customInstructionsInput.addEventListener("change", saveSettingsFromInputs);

  langEn.addEventListener("click", () => { currentLang = "en"; localStorage.setItem("kayro_lang", currentLang); applyLanguage(currentLang); updateGreeting(); updateSettingsBtns(); saveCloudData(); });
  langAr.addEventListener("click", () => { currentLang = "ar"; localStorage.setItem("kayro_lang", currentLang); applyLanguage(currentLang); updateGreeting(); updateSettingsBtns(); saveCloudData(); });

  themeDark.addEventListener("click", () => { applyTheme("dark"); updateSettingsBtns(); saveCloudData(); });
  themeLight.addEventListener("click", () => { applyTheme("light"); updateSettingsBtns(); saveCloudData(); });

  bgOptions.querySelectorAll(".bg-option").forEach(btn => {
    btn.addEventListener("click", () => { applyBackground(btn.dataset.bg); updateSettingsBtns(); saveCloudData(); });
  });

  deleteAllBtn.addEventListener("click", () => {
    showConfirm(i18n[currentLang].confirmTitle, i18n[currentLang].confirmDeleteAll, () => {
      conversations = []; activeConversationId = null;
      renderChatHistory(); showWelcomeScreen(); saveCloudData();
      showToast(i18n[currentLang].allDeletedToast);
    });
  });
  clearAllBtn.addEventListener("click", () => {
    if (!conversations.length) return;
    showConfirm(i18n[currentLang].confirmTitle, i18n[currentLang].confirmDeleteAll, () => {
      conversations = []; activeConversationId = null;
      renderChatHistory(); showWelcomeScreen(); saveCloudData();
      showToast(i18n[currentLang].allDeletedToast);
    });
  });

  // Logout
  logoutBtn.addEventListener("click", handleLogout);
  signOutSettingsBtn.addEventListener("click", () => { closeSettings(); handleLogout(); });

  confirmCancel.addEventListener("click", closeConfirm);
  confirmOk.addEventListener("click", () => { if (confirmCallback) confirmCallback(); closeConfirm(); });
  confirmOverlay.addEventListener("click", (e) => { if (e.target === confirmOverlay) closeConfirm(); });

  ivClose.addEventListener("click", closeImageViewer);
  imageViewer.addEventListener("click", (e) => { if (e.target === imageViewer) closeImageViewer(); });
  ivDownload.addEventListener("click", downloadCurrentImage);

  chatMessages.addEventListener("click", (e) => {
    if (e.target.classList.contains("msg-img") || e.target.classList.contains("ai-generated-img")) {
      openImageViewer(e.target.src);
    }
  });
}

function handleLogout() {
  showConfirm(i18n[currentLang].confirmTitle, i18n[currentLang].signOutConfirm, async () => {
    try {
      await auth.signOut();
      conversations = []; activeConversationId = null; isTempMode = false;
      tempBanner.classList.remove("active");
    } catch (err) {
      console.error("Logout error:", err);
    }
  });
}

// ==========================================
//  SIDEBAR
// ==========================================
function openSidebar() { sidebar.classList.add("open"); overlay.classList.add("active"); }
function closeSidebar() { sidebar.classList.remove("open"); overlay.classList.remove("active"); }

// ==========================================
//  THEME & BACKGROUND
// ==========================================
function applyTheme(theme) {
  currentTheme = theme;
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("kayro_theme", theme);
  if (theme === "light" && currentBg === "stars") applyBackground("white");
}

function applyBackground(bg) {
  currentBg = bg;
  document.body.setAttribute("data-bg", bg);
  localStorage.setItem("kayro_bg", bg);
  updateSettingsBtns();
}

// ==========================================
//  LANGUAGE
// ==========================================
function applyLanguage(lang) {
  const strings = i18n[lang];
  const html = document.documentElement;
  html.setAttribute("lang", lang === "ar" ? "ar" : "en");
  html.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

  $$("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (strings[key]) el.textContent = strings[key];
  });
  $$("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (strings[key]) el.setAttribute("placeholder", strings[key]);
  });

  langLabel.textContent = lang === "en" ? "العربية" : "English";
  authLangLabel.textContent = lang === "en" ? "العربية" : "English";
  authSubtitle.textContent = lang === "ar" ? "سجل دخولك لبدء رحلتك" : "Sign in to start your journey";

  updateSettingsBtns();

  if (activeConversationId !== null) {
    const conv = conversations.find(c => c.id === activeConversationId);
    if (conv) renderMessages(conv.messages);
  }
}

function updateSettingsBtns() {
  langEn.classList.toggle("active", currentLang === "en");
  langAr.classList.toggle("active", currentLang === "ar");
  themeDark.classList.toggle("active", currentTheme === "dark");
  themeLight.classList.toggle("active", currentTheme === "light");
  bgOptions.querySelectorAll(".bg-option").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.bg === currentBg);
  });
}

function updateGreeting() {
  const strings = i18n[currentLang];
  heroGreeting.textContent = userName ? `${strings.greeting}, ${userName} 👋` : "";
}

// ==========================================
//  SETTINGS
// ==========================================
function openSettings() {
  userNameInput.value = userName;
  userAgeInput.value = userAge;
  customInstructionsInput.value = customInstructions;
  updateSettingsBtns();
  settingsOverlay.classList.add("active");
  closeSidebar();
}
function closeSettings() { settingsOverlay.classList.remove("active"); }

function saveSettingsFromInputs() {
  userName = userNameInput.value.trim();
  userAge = userAgeInput.value.trim();
  customInstructions = customInstructionsInput.value.trim();
  updateGreeting();
  saveCloudData();
  showToast(i18n[currentLang].nameSaved);
}

// ==========================================
//  CONFIRM / IMAGE VIEWER / TOAST
// ==========================================
function showConfirm(title, text, cb) {
  confirmTitle.textContent = title; confirmText.textContent = text;
  confirmCallback = cb; confirmOverlay.classList.add("active");
}
function closeConfirm() { confirmOverlay.classList.remove("active"); confirmCallback = null; }

function openImageViewer(src) { ivImage.src = src; imageViewer.classList.add("active"); }
function closeImageViewer() { imageViewer.classList.remove("active"); ivImage.src = ""; }

function downloadCurrentImage() {
  const src = ivImage.src; if (!src) return;
  showToast(i18n[currentLang].downloading);
  fetch(src).then(r => r.blob()).then(blob => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "kayro-image-" + Date.now() + ".png";
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(a.href);
  }).catch(() => window.open(src, "_blank"));
}

function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const t = document.createElement("div");
  t.className = "toast"; t.textContent = message;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add("show"));
  setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 300); }, 2500);
}

// ==========================================
//  VOICE INPUT
// ==========================================
function initSpeechRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;
  recognition = new SR();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.onresult = (e) => {
    let t = "";
    for (let i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript;
    userInput.value = t; sendBtn.disabled = t.trim() === ""; autoResize(userInput);
  };
  recognition.onend = () => { isRecording = false; micBtn.classList.remove("recording"); };
  recognition.onerror = () => { isRecording = false; micBtn.classList.remove("recording"); };
}

function toggleVoiceInput() {
  if (!recognition) { showToast(i18n[currentLang].voiceNotSupported); return; }
  if (isRecording) { recognition.stop(); isRecording = false; micBtn.classList.remove("recording"); }
  else {
    recognition.lang = currentLang === "ar" ? "ar-SA" : "en-US";
    try { recognition.start(); isRecording = true; micBtn.classList.add("recording"); } catch(e) {}
  }
}

// ==========================================
//  TTS
// ==========================================
function speakText(text, btn) {
  if (currentTTS) {
    window.speechSynthesis.cancel(); currentTTS = null;
    $$(".tts-btn.playing").forEach(b => b.classList.remove("playing"));
    if (btn.classList.contains("playing")) { btn.classList.remove("playing"); return; }
  }
  const clean = text.replace(/```[\s\S]*?```/g, "... code block ...").replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").replace(/`(.*?)`/g, "$1").replace(/#{1,6}\s/g, "").replace(/[•\-]\s/g, "").replace(/\n+/g, ". ");
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = currentLang === "ar" ? "ar-SA" : "en-US"; u.rate = 1; u.pitch = 1;
  btn.classList.add("playing"); currentTTS = u;
  u.onend = () => { btn.classList.remove("playing"); currentTTS = null; };
  u.onerror = () => { btn.classList.remove("playing"); currentTTS = null; };
  window.speechSynthesis.speak(u);
}

// ==========================================
//  TEMP CHAT
// ==========================================
function startTempChat() {
  isTempMode = true;
  const id = Date.now();
  conversations.push({ id, title: currentLang === "ar" ? "محادثة مؤقتة" : "Temporary Chat", messages: [], temp: true });
  activeConversationId = id; showChatArea(); renderMessages([]); renderChatHistory();
  tempBanner.classList.add("active");
}
function endTempChat() {
  if (isTempMode && activeConversationId) conversations = conversations.filter(c => c.id !== activeConversationId);
  isTempMode = false; activeConversationId = null;
  tempBanner.classList.remove("active");
  showWelcomeScreen(); renderChatHistory(); saveCloudData();
}

// ==========================================
//  FILE HANDLING
// ==========================================
function handleFileSelect(e) {
  const files = Array.from(e.target.files);
  for (const file of files) {
    if (file.size > 10 * 1024 * 1024) { showToast(i18n[currentLang].fileTooBig); continue; }
    const reader = new FileReader();
    const isImage = file.type.startsWith("image/");
    reader.onload = (ev) => {
      pendingFiles.push({ name: file.name, type: file.type, dataUrl: ev.target.result, isImage });
      renderFilePreview(); sendBtn.disabled = false;
    };
    reader.readAsDataURL(file);
  }
  fileInput.value = "";
}

function renderFilePreview() {
  filePreviewArea.innerHTML = "";
  if (pendingFiles.length === 0) { filePreviewArea.classList.remove("has-files"); return; }
  filePreviewArea.classList.add("has-files");
  pendingFiles.forEach((f, idx) => {
    const item = document.createElement("div"); item.className = "file-preview-item";
    const thumb = f.isImage ? `<img class="file-preview-thumb" src="${f.dataUrl}" alt="${escapeHTML(f.name)}" />` : "";
    item.innerHTML = `${thumb}<span class="file-preview-name">${f.isImage ? "" : "📄 "}${escapeHTML(f.name)}</span><button class="file-preview-remove" data-idx="${idx}"><svg viewBox="0 0 8 8" width="8" height="8" fill="none"><line x1="1" y1="1" x2="7" y2="7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="7" y1="1" x2="1" y2="7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button>`;
    item.querySelector(".file-preview-remove").addEventListener("click", () => {
      pendingFiles.splice(idx, 1); renderFilePreview();
      sendBtn.disabled = userInput.value.trim() === "" && pendingFiles.length === 0;
    });
    filePreviewArea.appendChild(item);
  });
}

// ==========================================
//  SAMPLE / NEW CHAT / VIEWS
// ==========================================
function loadSampleConversation(index) {
  const samples = sampleConversations[currentLang];
  if (!samples[index]) return;
  const sample = samples[index];
  const id = Date.now();
  const conv = { id, title: sample.title, messages: [...sample.messages] };
  conversations.push(conv);
  activeConversationId = id; isTempMode = false;
  tempBanner.classList.remove("active");
  showChatArea(); renderMessages(conv.messages); renderChatHistory(); closeSidebar(); saveCloudData();
}

function startNewChat() {
  if (isTempMode && activeConversationId) {
    conversations = conversations.filter(c => c.id !== activeConversationId);
  }
  isTempMode = false; activeConversationId = null;
  tempBanner.classList.remove("active");
  pendingFiles = []; renderFilePreview();
  showWelcomeScreen(); userInput.value = ""; sendBtn.disabled = true; renderChatHistory();
}

function showWelcomeScreen() { welcomeScreen.classList.remove("hidden"); chatArea.classList.remove("active"); }
function showChatArea() { welcomeScreen.classList.add("hidden"); chatArea.classList.add("active"); }

// ==========================================
//  CHAT HISTORY
// ==========================================
function renderChatHistory() {
  chatHistory.innerHTML = "";
  const sorted = [...conversations].filter(c => !c.temp).reverse();
  const tempItems = [...conversations].filter(c => c.temp).reverse();
  [...tempItems, ...sorted].forEach(conv => {
    const btn = document.createElement("button");
    btn.className = "history-item" + (conv.id === activeConversationId ? " active" : "");
    const icon = `<svg class="history-icon" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3.5H12M2 7H9M2 10.5H11" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>`;
    const badge = conv.temp ? `<span class="history-temp-badge">${i18n[currentLang].tempLabel}</span>` : "";
    const del = `<button class="history-delete" title="${i18n[currentLang].delete}"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><line x1="3" y1="3" x2="9" y2="9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="9" y1="3" x2="3" y2="9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button>`;
    btn.innerHTML = `${icon}<span class="history-title">${escapeHTML(conv.title)}</span>${badge}${del}`;
    btn.addEventListener("click", (e) => {
      if (e.target.closest(".history-delete")) return;
      activeConversationId = conv.id; isTempMode = !!conv.temp;
      tempBanner.classList.toggle("active", isTempMode);
      showChatArea(); renderMessages(conv.messages); renderChatHistory(); closeSidebar();
    });
    btn.querySelector(".history-delete").addEventListener("click", (e) => {
      e.stopPropagation();
      showConfirm(i18n[currentLang].confirmTitle, i18n[currentLang].confirmDeleteOne, () => {
        conversations = conversations.filter(c => c.id !== conv.id);
        if (activeConversationId === conv.id) {
          activeConversationId = null; isTempMode = false;
          tempBanner.classList.remove("active"); showWelcomeScreen();
        }
        renderChatHistory(); saveCloudData(); showToast(i18n[currentLang].deletedToast);
      });
    });
    chatHistory.appendChild(btn);
  });
}

// ==========================================
//  MESSAGE RENDERING
// ==========================================
function renderMessages(messages) {
  chatMessages.innerHTML = "";
  messages.forEach(msg => appendMessage(msg.role, msg.text, msg.attachments, false));
  scrollToBottom();
}

function appendMessage(role, text, attachments, animate = true) {
  const strings = i18n[currentLang];
  const el = document.createElement("div");
  el.className = `message ${role === "user" ? "user-msg" : "ai-msg"}`;
  if (!animate) el.style.animation = "none";

  const displayName = role === "user" ? (userName || strings.you) : strings.kayro;
  const avatarClass = role === "user" ? "user" : "ai";

  let avatarContent;
  if (role === "user" && currentUser && currentUser.photoURL) {
    avatarContent = `<img src="${currentUser.photoURL}" alt="${displayName}" />`;
  } else if (role === "user") {
    avatarContent = userName ? userName.charAt(0).toUpperCase() : (currentLang === "ar" ? "أ" : "Y");
  } else {
    avatarContent = "K";
  }

  let attachHTML = "";
  if (attachments && attachments.length > 0) {
    const items = attachments.map(a => {
      if (a.isImage && a.dataUrl) return `<img class="msg-img" src="${a.dataUrl}" alt="${escapeHTML(a.name)}" />`;
      return `<div class="msg-file"><span>📄 ${escapeHTML(a.name)}</span></div>`;
    }).join("");
    attachHTML = `<div class="msg-attachments">${items}</div>`;
  }

  const ttsHTML = role === "ai" && text ? `
    <div class="msg-actions">
      <button class="tts-btn" data-tts-text="${escapeHTML(text)}">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 5.5H4L7 2.5V11.5L4 8.5H2C1.45 8.5 1 8.05 1 7.5V6.5C1 5.95 1.45 5.5 2 5.5Z" stroke="currentColor" stroke-width="0.9" fill="none"/><path d="M9.5 4C10.3 4.8 10.8 5.9 10.8 7C10.8 8.1 10.3 9.2 9.5 10" stroke="currentColor" stroke-width="0.9" stroke-linecap="round"/></svg>
        <span>${strings.listen}</span>
      </button>
    </div>
  ` : "";

  el.innerHTML = `
    <div class="msg-avatar ${avatarClass}">${avatarContent}</div>
    <div class="msg-bubble">
      <span class="msg-sender">${escapeHTML(displayName)}</span>
      <div class="msg-body">${text ? formatText(text) : ""}</div>
      ${attachHTML}
      ${ttsHTML}
    </div>
  `;

  chatMessages.appendChild(el);
  bindCopyButtons(el);
  bindTTSButtons(el);
  scrollToBottom();
}

function bindTTSButtons(container) {
  container.querySelectorAll(".tts-btn").forEach(btn => {
    btn.addEventListener("click", () => speakText(btn.getAttribute("data-tts-text"), btn));
  });
}

function showTypingIndicator() {
  const strings = i18n[currentLang];
  const el = document.createElement("div");
  el.className = "message ai-msg"; el.id = "typingIndicator";
  el.innerHTML = `
    <div class="msg-avatar ai">K</div>
    <div class="msg-bubble">
      <span class="msg-sender">${escapeHTML(strings.kayro)}</span>
      <div class="typing-dots"><div class="t-dot"></div><div class="t-dot"></div><div class="t-dot"></div></div>
    </div>
  `;
  chatMessages.appendChild(el); scrollToBottom();
}
function removeTypingIndicator() { const el = document.getElementById("typingIndicator"); if (el) el.remove(); }

// ==========================================
//  SEND MESSAGE
// ==========================================
function handleSend() {
  if (isGenerating) return;
  const text = userInput.value.trim();
  const attachments = [...pendingFiles];
  if (!text && attachments.length === 0) return;

  if (activeConversationId === null) {
    const id = Date.now();
    const title = text ? (text.length > 40 ? text.substring(0, 40) + "…" : text) : (currentLang === "ar" ? "ملف مرفق" : "File attachment");
    conversations.push({ id, title, messages: [] });
    activeConversationId = id; showChatArea();
  }

  const conv = conversations.find(c => c.id === activeConversationId);
  const msgObj = { role: "user", text };
  if (attachments.length > 0) msgObj.attachments = attachments;
  conv.messages.push(msgObj);
  appendMessage("user", text, attachments);

  userInput.value = ""; pendingFiles = []; renderFilePreview();
  sendBtn.disabled = true; autoResize(userInput);
  saveCloudData(); renderChatHistory();

  if (isImageRequest(text)) generateImage(text, conv);
  else getAIResponse(text, attachments, conv);
}

// ==========================================
//  IMAGE GENERATION
// ==========================================
function isImageRequest(text) {
  const t = text.toLowerCase();
  const patterns = [
    /^(draw|paint|generate|create|make|design|sketch)\s+(me\s+)?(a |an |the )?(image|picture|photo|illustration|art|drawing|painting)/i,
    /^(draw|paint|generate|create|make|design|sketch)\s+(me\s+)?/i,
    /\b(generate|create|draw|paint|make)\s+(a |an |the )?(image|picture|photo|illustration|drawing)\b/i,
    /^(ارسم|صمم|اصنع|ولّد|انشئ|أنشئ)/i,
    /(ارسم|صمم|اصنع)\s+(لي\s+)?(صورة|رسمة|لوحة|تصميم)/i,
  ];
  return patterns.some(p => p.test(t));
}

async function generateImage(prompt, conversation) {
  isGenerating = true;
  const strings = i18n[currentLang];
  const loadingEl = document.createElement("div");
  loadingEl.className = "message ai-msg"; loadingEl.id = "imgLoading";
  loadingEl.innerHTML = `<div class="msg-avatar ai">K</div><div class="msg-bubble"><span class="msg-sender">${escapeHTML(strings.kayro)}</span><div class="img-loading"><div class="spinner"></div><span>${strings.generatingImage}</span></div></div>`;
  chatMessages.appendChild(loadingEl); scrollToBottom();

  try {
    let imagePrompt = prompt.replace(/^(ارسم|صمم|اصنع|ولّد|أنشئ|انشئ|draw|paint|generate|create|make|design|sketch)\s*(لي\s*|me\s*)?/i, '').replace(/^(a |an |the )?(image|picture|photo|illustration|art|drawing|painting|artwork|صورة|رسمة|لوحة|تصميم)\s*(of |for |about |عن |ل)?/i, '').trim() || prompt;
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=768&height=768&nologo=true&seed=${Date.now()}`;
    const img = new Image(); img.crossOrigin = "anonymous";
    await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = imageUrl; setTimeout(() => reject(new Error("timeout")), 30000); });
    const loadEl = document.getElementById("imgLoading"); if (loadEl) loadEl.remove();
    const aiText = currentLang === "ar" ? "تفضل، هذي الصورة اللي طلبتها! 🎨" : "Here's the image you requested! 🎨";
    const el = document.createElement("div"); el.className = "message ai-msg";
    el.innerHTML = `<div class="msg-avatar ai">K</div><div class="msg-bubble"><span class="msg-sender">${escapeHTML(strings.kayro)}</span><div class="msg-body">${formatText(aiText)}</div><img class="ai-generated-img" src="${imageUrl}" alt="${escapeHTML(imagePrompt)}" /></div>`;
    chatMessages.appendChild(el); scrollToBottom();
    conversation.messages.push({ role: "ai", text: aiText + `\n\n![Image](${imageUrl})` });
    saveCloudData();
  } catch (err) {
    const loadEl = document.getElementById("imgLoading"); if (loadEl) loadEl.remove();
    const errText = currentLang === "ar" ? "عذرًا، حصل خطأ أثناء إنشاء الصورة." : "Sorry, there was an error generating the image.";
    appendMessage("ai", errText); conversation.messages.push({ role: "ai", text: errText }); saveCloudData();
  }
  isGenerating = false;
}

// ==========================================
//  AI API — OpenRouter (DeepSeek V3)
// ==========================================
const OPENROUTER_API_KEY = "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";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "deepseek/deepseek-chat-v3-0324";

async function getAIResponse(userMessage, attachments, conversation) {
  isGenerating = true;
  showTypingIndicator();
  try {
    const aiText = await callOpenRouterAPI(userMessage, attachments, conversation);
    removeTypingIndicator();
    appendMessageStreaming("ai", aiText);
    conversation.messages.push({ role: "ai", text: aiText });
    saveCloudData();
  } catch (error) {
    console.error("API error:", error.message);
    removeTypingIndicator();
    let errorMsg;
    if (error.message.includes("401")) errorMsg = currentLang === "ar" ? "خطأ في المصادقة." : "Authentication error.";
    else if (error.message.includes("429")) errorMsg = currentLang === "ar" ? "تم تجاوز الحد. حاول بعد قليل." : "Rate limit exceeded.";
    else if (error.message.includes("402")) errorMsg = currentLang === "ar" ? "رصيد غير كافٍ." : "Insufficient credits.";
    else errorMsg = currentLang === "ar" ? `خطأ: ${error.message}` : `Error: ${error.message}`;
    appendMessage("ai", errorMsg);
    conversation.messages.push({ role: "ai", text: errorMsg }); saveCloudData();
  }
  isGenerating = false;
}

function buildSystemPrompt() {
  const langNote = currentLang === "ar"
    ? "The user interface is in Arabic. Respond primarily in Arabic unless the user writes in another language."
    : "The user interface is in English. Respond primarily in English unless the user writes in another language.";
  const nameNote = userName ? `The user's name is "${userName}".${userAge ? ` They are ${userAge} years old.` : ""} Address them by name naturally.` : "";
  const customNote = customInstructions ? `\n\nAdditional user instructions:\n${customInstructions}` : "";
  return `You are KAYRO AI, a highly intelligent, helpful, and friendly AI assistant. You were developed and created by Youssef Hegazy (يوسف حجازي). You are NOT made by Google, OpenAI, Meta, DeepSeek, or any other company — you are created by Youssef Hegazy.

When anyone asks "who made you", "who developed you", "who created you", "من صنعك", "من طورك", "من مطورك", "مين عملك", or any similar question, you MUST answer that you were developed by Youssef Hegazy (يوسف حجازي).

You provide clear, detailed, and accurate responses. You use markdown formatting: **bold**, *italic*, \`code\`, code blocks with \`\`\`, bullet points, and numbered lists.

When asked to write code, always use proper code blocks with the language name.

${nameNote} ${langNote}${customNote}`;
}

async function callOpenRouterAPI(userMessage, attachments, conversation) {
  const messages = [{ role: "system", content: buildSystemPrompt() }];
  const historyMessages = conversation.messages.slice(-20);
  for (const msg of historyMessages) {
    if (msg.role === "user") {
      if (!msg.attachments || msg.attachments.length === 0) {
        if (msg.text) messages.push({ role: "user", content: msg.text });
      } else {
        const content = [];
        if (msg.text) content.push({ type: "text", text: msg.text });
        for (const att of msg.attachments) {
          if (att.isImage && att.dataUrl) content.push({ type: "image_url", image_url: { url: att.dataUrl } });
        }
        if (content.length > 0) messages.push({ role: "user", content });
      }
    } else if (msg.role === "ai" && msg.text) {
      messages.push({ role: "assistant", content: msg.text });
    }
  }
  if (attachments && attachments.length > 0) {
    const content = [];
    if (userMessage) content.push({ type: "text", text: userMessage });
    for (const att of attachments) {
      if (att.isImage && att.dataUrl) content.push({ type: "image_url", image_url: { url: att.dataUrl } });
      else if (!att.isImage && att.dataUrl) {
        try { const tc = atob(att.dataUrl.split(",")[1] || ""); content.push({ type: "text", text: `[File: ${att.name}]\n\`\`\`\n${tc}\n\`\`\`` }); }
        catch(e) { content.push({ type: "text", text: `[File: ${att.name}]` }); }
      }
    }
    messages.push({ role: "user", content });
  } else {
    if (userMessage) messages.push({ role: "user", content: userMessage });
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${OPENROUTER_API_KEY}`, "HTTP-Referer": window.location.href, "X-Title": "KAYRO AI" },
    body: JSON.stringify({ model: OPENROUTER_MODEL, messages, max_tokens: 4096, temperature: 0.7, top_p: 0.9 }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`${response.status}: ${err?.error?.message || response.statusText}`);
  }
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  const text = data.choices?.[0]?.message?.content || "";
  if (!text) throw new Error("Empty response");
  return text;
}

// ==========================================
//  STREAMING DISPLAY
// ==========================================
function appendMessageStreaming(role, fullText) {
  const strings = i18n[currentLang];
  const el = document.createElement("div");
  el.className = `message ${role === "user" ? "user-msg" : "ai-msg"}`;

  let avatarContent;
  if (role === "user" && currentUser && currentUser.photoURL) avatarContent = `<img src="${currentUser.photoURL}" alt="User" />`;
  else if (role === "user") avatarContent = userName ? userName.charAt(0).toUpperCase() : (currentLang === "ar" ? "أ" : "Y");
  else avatarContent = "K";

  el.innerHTML = `
    <div class="msg-avatar ${role === "user" ? "user" : "ai"}">${avatarContent}</div>
    <div class="msg-bubble">
      <span class="msg-sender">${escapeHTML(role === "user" ? (userName || strings.you) : strings.kayro)}</span>
      <div class="msg-body"><span class="streaming-cursor"></span></div>
    </div>
  `;
  chatMessages.appendChild(el); scrollToBottom();
  const bodyEl = el.querySelector(".msg-body");
  let charIndex = 0;
  const speed = Math.max(4, Math.min(15, 1800 / fullText.length));

  function typeNext() {
    if (charIndex < fullText.length) {
      charIndex += Math.ceil(Math.random() * 3) + 1;
      if (charIndex > fullText.length) charIndex = fullText.length;
      bodyEl.innerHTML = formatText(fullText.substring(0, charIndex)) + '<span class="streaming-cursor"></span>';
      scrollToBottom(); setTimeout(typeNext, speed + Math.random() * 8);
    } else {
      const ttsHTML = `<div class="msg-actions"><button class="tts-btn" data-tts-text="${escapeHTML(fullText)}"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 5.5H4L7 2.5V11.5L4 8.5H2C1.45 8.5 1 8.05 1 7.5V6.5C1 5.95 1.45 5.5 2 5.5Z" stroke="currentColor" stroke-width="0.9" fill="none"/><path d="M9.5 4C10.3 4.8 10.8 5.9 10.8 7C10.8 8.1 10.3 9.2 9.5 10" stroke="currentColor" stroke-width="0.9" stroke-linecap="round"/></svg><span>${strings.listen}</span></button></div>`;
      bodyEl.innerHTML = formatText(fullText);
      el.querySelector(".msg-bubble").insertAdjacentHTML("beforeend", ttsHTML);
      bindCopyButtons(el); bindTTSButtons(el); scrollToBottom();
    }
  }
  typeNext();
}

// ==========================================
//  FORMAT TEXT
// ==========================================
function formatText(text) {
  let out = escapeHTML(text);
  out = out.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    const langLabel = lang || "code";
    const id = "code-" + Math.random().toString(36).substr(2, 8);
    return `<div class="code-block-wrapper"><div class="code-block-header"><span>${langLabel}</span><button class="code-copy-btn" data-code-id="${id}" onclick="copyCodeBlock(this)">${i18n[currentLang].copy}</button></div><pre><code id="${id}">${code.trim()}</code></pre></div>`;
  });
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  out = out.replace(/\n/g, "<br>");
  return out;
}

window.copyCodeBlock = function(btn) {
  const codeEl = document.getElementById(btn.getAttribute("data-code-id"));
  if (!codeEl) return;
  const text = codeEl.textContent;
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = i18n[currentLang].copied; btn.classList.add("copied");
    setTimeout(() => { btn.textContent = i18n[currentLang].copy; btn.classList.remove("copied"); }, 2000);
  }).catch(() => {
    const ta = document.createElement("textarea"); ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
    btn.textContent = i18n[currentLang].copied; btn.classList.add("copied");
    setTimeout(() => { btn.textContent = i18n[currentLang].copy; btn.classList.remove("copied"); }, 2000);
  });
};

function bindCopyButtons(container) {
  container.querySelectorAll(".code-copy-btn").forEach(btn => { btn.onclick = () => window.copyCodeBlock(btn); });
}

// ==========================================
//  UTILITIES
// ==========================================
function escapeHTML(str) { const d = document.createElement("div"); d.textContent = str; return d.innerHTML; }
function autoResize(el) { el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 120) + "px"; }
function scrollToBottom() { requestAnimationFrame(() => { chatMessages.scrollTop = chatMessages.scrollHeight; }); }
