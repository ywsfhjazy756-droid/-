/**
 * =============================================
 *  KAYRO AI v7.3 — ALL ISSUES FIXED
 *  Developer: Youssef Hegazy
 *  
 *  FIXES:
 *  1. Instant response after login (no delay)
 *  2. Firestore saves ALL chats properly
 *  3. Each conversation shows its OWN messages only
 *  4. Settings/themes/preferences saved to cloud
 *  5. TTS stop button works
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
db.enablePersistence({ synchronizeTabs: true }).catch(function() {});

// ==========================================
//  STARFIELD
// ==========================================
(function initStarfield() {
  var canvas = document.getElementById("starfield");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var W, H, stars = [];
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  function Star() {
    this.x = Math.random() * W; this.y = Math.random() * H;
    this.r = Math.random() * 1.2 + 0.3;
    this.baseA = Math.random() * 0.6 + 0.15;
    this.a = this.baseA;
    this.speed = Math.random() * 0.02 + 0.005;
    this.off = Math.random() * Math.PI * 2;
  }
  Star.prototype.update = function(t) { this.a = Math.max(0.05, Math.min(1, this.baseA + Math.sin(t * this.speed + this.off) * 0.2)); };
  Star.prototype.draw = function() {
    ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255," + this.a + ")"; ctx.fill();
  };
  resize();
  for (var i = 0; i < 200; i++) stars.push(new Star());
  var frame = 0;
  function animate() {
    frame++; ctx.clearRect(0, 0, W, H);
    for (var j = 0; j < stars.length; j++) { stars[j].update(frame); stars[j].draw(); }
    requestAnimationFrame(animate);
  }
  window.addEventListener("resize", function() { resize(); for (var j = 0; j < stars.length; j++) { stars[j].x = Math.random() * W; stars[j].y = Math.random() * H; } });
  requestAnimationFrame(animate);
})();

// ==========================================
//  i18n
// ==========================================
var i18n = {
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
    listen:"Listen", stopListening:"Stop", voiceNotSupported:"Voice not supported",
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
    copyMsg:"Copy message", editMsg:"Edit message",
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
    listen:"استمع", stopListening:"إيقاف", voiceNotSupported:"الصوت غير مدعوم",
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
    copyMsg:"نسخ الرسالة", editMsg:"تعديل الرسالة",
  },
};

var sampleConversations = {
  en: [
    { title:"Explain quantum computing", messages:[
      { role:"user", text:"Can you explain quantum computing in simple terms?" },
      { role:"ai", text:"**Classical computers** use **bits** — 0 or 1.\n\n**Quantum computers** use **qubits** that can be 0, 1, or *both simultaneously* through **superposition**.\n\nThis makes quantum computers powerful for:\n• **Cryptography**\n• **Drug discovery**\n• **Optimization**\n• **AI training**" }
    ]},
    { title:"Write a business plan", messages:[
      { role:"user", text:"Help me write a business plan for a tech startup." },
      { role:"ai", text:"**1. Executive Summary**\nMission, vision, product.\n\n**2. Problem & Opportunity**\nDefine the pain point.\n\n**3. Your Solution**\nWhat makes it unique?\n\n**4. Market Analysis**\n• TAM • Segments • Competitors\n\n**5. Business Model**\nRevenue streams.\n\n**6. Financial Projections**\n3-year forecast." }
    ]},
    { title:"Boost my productivity", messages:[
      { role:"user", text:"Give me strategies to be more productive." },
      { role:"ai", text:"**🌅 Morning Protocol**\n• Wake at same time daily\n• No phone for 30 min\n\n**⚡ Deep Work**\n• **90-minute focus sprints**\n• Phone on DND\n\n**📋 Task Management**\n• **3 key tasks** daily max\n• **2-minute rule**: if quick, do it now" }
    ]},
    { title:"Debug my code", messages:[
      { role:"user", text:"Help me find bugs:\n```javascript\nfunction sum(arr) {\n  let total;\n  for (let i = 0; i <= arr.length; i++) {\n    total += arr[i];\n  }\n  return total;\n}\n```" },
      { role:"ai", text:"Found **2 bugs**:\n\n**Bug 1:** `let total;` → `undefined`\n✅ Fix: `let total = 0;`\n\n**Bug 2:** `i <= arr.length` → out of bounds\n✅ Fix: `i < arr.length`\n\n```javascript\nfunction sum(arr) {\n  let total = 0;\n  for (let i = 0; i < arr.length; i++) {\n    total += arr[i];\n  }\n  return total;\n}\n```" }
    ]},
  ],
  ar: [
    { title:"اشرح الحوسبة الكمية", messages:[
      { role:"user", text:"هل يمكنك شرح الحوسبة الكمية ببساطة؟" },
      { role:"ai", text:"**الكمبيوتر العادي** يستخدم **بتات** — إما 0 أو 1.\n\n**الكمبيوتر الكمي** يستخدم **كيوبتات** يمكنها أن تكون 0 و1 *معًا* بفضل **التراكب**.\n\nهذا يجعله قويًا في:\n• **التشفير**\n• **اكتشاف الأدوية**\n• **التحسين**" }
    ]},
    { title:"اكتب خطة عمل", messages:[
      { role:"user", text:"ساعدني في كتابة خطة عمل لشركة تقنية." },
      { role:"ai", text:"**١. الملخص التنفيذي**\nالمهمة والرؤية.\n\n**٢. المشكلة والفرصة**\nحدد نقطة الألم.\n\n**٣. الحل**\nصف منتجك.\n\n**٤. تحليل السوق**\n• حجم السوق • المنافسون" }
    ]},
    { title:"عزّز إنتاجيتي", messages:[
      { role:"user", text:"أعطني استراتيجيات للإنتاجية." },
      { role:"ai", text:"**🌅 بروتوكول الصباح**\n• استيقظ بنفس الوقت\n• لا هاتف أول ٣٠ دقيقة\n\n**⚡ العمل العميق**\n• **جلسات ٩٠ دقيقة**\n• أوقف المشتتات" }
    ]},
    { title:"صحّح الكود", messages:[
      { role:"user", text:"ساعدني في إيجاد الأخطاء:\n```javascript\nfunction sum(arr) {\n  let total;\n  for (let i = 0; i <= arr.length; i++) {\n    total += arr[i];\n  }\n  return total;\n}\n```" },
      { role:"ai", text:"وجدت **خطأين**:\n\n**١:** `let total;` → `undefined`\n✅ `let total = 0;`\n\n**٢:** `i <= arr.length`\n✅ `i < arr.length`\n\n```javascript\nfunction sum(arr) {\n  let total = 0;\n  for (let i = 0; i < arr.length; i++) {\n    total += arr[i];\n  }\n  return total;\n}\n```" }
    ]},
  ],
};

// ==========================================
//  STATE
// ==========================================
var currentLang = localStorage.getItem("kayro_lang") || "en";
var userName = "";
var userAge = "";
var customInstructions = "";
var currentTheme = localStorage.getItem("kayro_theme") || "dark";
var currentBg = localStorage.getItem("kayro_bg") || "stars";
var conversations = [];
var activeConversationId = null;
var isTempMode = false;
var pendingFiles = [];
var confirmCallback = null;
var isGenerating = false;
var currentTTS = null;
var isRecording = false;
var recognition = null;
var currentUser = null;
var syncDebounce = null;
var appInitialized = false;

// ==========================================
//  BOOT — wait for DOM
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
  initAuthUI();
  initAuthListener();
});

// ==========================================
//  AUTH LISTENER — FIX #1: instant response
// ==========================================
function initAuthListener() {
  auth.onAuthStateChanged(function(user) {
    var authScreen = document.getElementById("authScreen");
    var appContainer = document.getElementById("appContainer");

    if (user) {
      currentUser = user;
      // Show app IMMEDIATELY — don't wait for cloud data
      if (authScreen) authScreen.classList.add("hidden");
      if (appContainer) appContainer.classList.remove("hidden");

      // Update user info immediately
      updateUserUI(user);

      // Apply local settings immediately (from localStorage)
      applyTheme(currentTheme);
      applyBackground(currentBg);
      applyLanguage(currentLang);
      updateGreeting();

      // Init app UI immediately
      initAppUI();

      // Load cloud data in background — then refresh UI
      loadCloudData(user.uid).then(function() {
        // After cloud data loads, refresh everything
        applyTheme(currentTheme);
        applyBackground(currentBg);
        applyLanguage(currentLang);
        updateGreeting();
        renderChatHistory();
        updateSettingsBtns();
        // Update settings inputs if open
        var ni = document.getElementById("userNameInput");
        var ai = document.getElementById("userAgeInput");
        var ci = document.getElementById("customInstructionsInput");
        if (ni) ni.value = userName;
        if (ai) ai.value = userAge;
        if (ci) ci.value = customInstructions;
      });

      initSpeechRecognition();
    } else {
      currentUser = null;
      if (authScreen) authScreen.classList.remove("hidden");
      if (appContainer) appContainer.classList.add("hidden");
      applyLanguage(currentLang);
      appInitialized = false;
    }
  });
}

function updateUserUI(user) {
  var displayName = user.displayName || (user.email ? user.email.split("@")[0] : "User");
  var email = user.email || "";
  var photoURL = user.photoURL;

  var sn = document.getElementById("sidebarUserName");
  var se = document.getElementById("sidebarUserEmail");
  var ae = document.getElementById("accountEmail");
  var ap = document.getElementById("accountProvider");
  var sa = document.getElementById("sidebarUserAvatar");

  if (sn) sn.textContent = displayName;
  if (se) se.textContent = email;
  if (ae) ae.textContent = email;

  var pd = user.providerData && user.providerData[0];
  if (ap) ap.textContent = (pd && pd.providerId === "google.com") ? "Google" : "Email/Password";

  if (sa) {
    if (photoURL) {
      sa.innerHTML = '<img src="' + photoURL + '" alt="avatar" />';
    } else {
      sa.textContent = displayName.charAt(0).toUpperCase();
    }
  }

  if (!userName) {
    userName = displayName;
    var ni = document.getElementById("userNameInput");
    if (ni) ni.value = userName;
  }
}

// ==========================================
//  AUTH UI
// ==========================================
function initAuthUI() {
  var loginTab = document.getElementById("loginTab");
  var registerTab = document.getElementById("registerTab");
  var loginForm = document.getElementById("loginForm");
  var registerForm = document.getElementById("registerForm");

  if (loginTab) loginTab.onclick = function() {
    loginTab.classList.add("active"); registerTab.classList.remove("active");
    loginForm.classList.remove("hidden"); registerForm.classList.add("hidden");
    clearAuthErrors();
  };
  if (registerTab) registerTab.onclick = function() {
    registerTab.classList.add("active"); loginTab.classList.remove("active");
    registerForm.classList.remove("hidden"); loginForm.classList.add("hidden");
    clearAuthErrors();
  };

  var loginEye = document.getElementById("loginEye");
  var registerEye = document.getElementById("registerEye");
  if (loginEye) loginEye.onclick = function() { var i = document.getElementById("loginPassword"); if (i) i.type = i.type === "password" ? "text" : "password"; };
  if (registerEye) registerEye.onclick = function() { var i = document.getElementById("registerPassword"); if (i) i.type = i.type === "password" ? "text" : "password"; };

  if (loginForm) loginForm.onsubmit = async function(e) {
    e.preventDefault(); clearAuthErrors();
    var email = document.getElementById("loginEmail").value.trim();
    var password = document.getElementById("loginPassword").value;
    var btn = document.getElementById("loginSubmit");
    btn.classList.add("loading"); btn.disabled = true;
    try { await auth.signInWithEmailAndPassword(email, password); }
    catch (err) { showAuthError("loginError", err.code); }
    btn.classList.remove("loading"); btn.disabled = false;
  };

  if (registerForm) registerForm.onsubmit = async function(e) {
    e.preventDefault(); clearAuthErrors();
    var name = document.getElementById("registerName").value.trim();
    var email = document.getElementById("registerEmail").value.trim();
    var password = document.getElementById("registerPassword").value;
    var btn = document.getElementById("registerSubmit");
    btn.classList.add("loading"); btn.disabled = true;
    try {
      var cred = await auth.createUserWithEmailAndPassword(email, password);
      await cred.user.updateProfile({ displayName: name });
      userName = name;
    } catch (err) { showAuthError("registerError", err.code); }
    btn.classList.remove("loading"); btn.disabled = false;
  };

  var googleBtn = document.getElementById("googleSignIn");
  if (googleBtn) googleBtn.onclick = async function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try { await auth.signInWithPopup(provider); }
    catch (err) {
      if (err.code === "auth/popup-blocked") {
        try { await auth.signInWithRedirect(provider); } catch (e2) { showAuthError("loginError", e2.code); }
      } else if (err.code !== "auth/popup-closed-by-user" && err.code !== "auth/cancelled-popup-request") {
        showAuthError("loginError", err.code);
      }
    }
  };

  var forgotBtn = document.getElementById("forgotBtn");
  var forgotCancel = document.getElementById("forgotCancel");
  var forgotSubmit = document.getElementById("forgotSubmit");
  if (forgotBtn) forgotBtn.onclick = function() {
    var m = document.getElementById("forgotModal"); if (m) m.classList.remove("hidden");
    var fe = document.getElementById("forgotEmail"); var le = document.getElementById("loginEmail");
    if (fe && le) fe.value = le.value || "";
  };
  if (forgotCancel) forgotCancel.onclick = function() { var m = document.getElementById("forgotModal"); if (m) m.classList.add("hidden"); };
  if (forgotSubmit) forgotSubmit.onclick = async function() {
    var ei = document.getElementById("forgotEmail"); var ee = document.getElementById("forgotError");
    if (!ei || !ei.value.trim()) return;
    forgotSubmit.classList.add("loading"); forgotSubmit.disabled = true;
    try {
      await auth.sendPasswordResetEmail(ei.value.trim());
      if (ee) { ee.textContent = i18n[currentLang].resetSent; ee.classList.add("success"); }
      setTimeout(function() { var m = document.getElementById("forgotModal"); if (m) m.classList.add("hidden"); if (ee) ee.classList.remove("success"); }, 3000);
    } catch (err) { if (ee) { ee.classList.remove("success"); ee.textContent = getAuthErrorMsg(err.code); } }
    forgotSubmit.classList.remove("loading"); forgotSubmit.disabled = false;
  };

  var authLang = document.getElementById("authLangToggle");
  if (authLang) authLang.onclick = function() {
    currentLang = currentLang === "en" ? "ar" : "en";
    localStorage.setItem("kayro_lang", currentLang);
    applyLanguage(currentLang);
  };
}

function clearAuthErrors() {
  ["loginError", "registerError", "forgotError"].forEach(function(id) { var e = document.getElementById(id); if (e) e.textContent = ""; });
}
function showAuthError(id, code) { var e = document.getElementById(id); if (e) e.textContent = getAuthErrorMsg(code); }
function getAuthErrorMsg(code) {
  var s = i18n[currentLang];
  var map = {
    "auth/invalid-email": s.authErrorEmail, "auth/weak-password": s.authErrorPassword,
    "auth/wrong-password": s.authErrorWrongPassword, "auth/invalid-credential": s.authErrorWrongPassword,
    "auth/user-not-found": s.authErrorUserNotFound, "auth/email-already-in-use": s.authErrorEmailInUse,
    "auth/network-request-failed": s.authErrorNetwork,
    "auth/popup-closed-by-user": "", "auth/cancelled-popup-request": ""
  };
  return map[code] || s.authErrorGeneric;
}

// ==========================================
//  CLOUD DATA — FIX #2: proper save/load
// ==========================================
async function loadCloudData(uid) {
  try {
    var doc = await db.collection("users").doc(uid).get();
    if (doc.exists) {
      var data = doc.data();
      conversations = data.conversations || [];
      userName = data.userName || (currentUser ? currentUser.displayName : "") || "";
      userAge = data.userAge || "";
      customInstructions = data.customInstructions || "";
      currentLang = data.lang || currentLang;
      currentTheme = data.theme || currentTheme;
      currentBg = data.bg || currentBg;
      localStorage.setItem("kayro_lang", currentLang);
      localStorage.setItem("kayro_theme", currentTheme);
      localStorage.setItem("kayro_bg", currentBg);
    } else {
      // First time user — save initial data
      await saveCloudDataNow();
    }
  } catch (err) {
    console.error("Cloud load error:", err);
    // Fallback to localStorage
    try { conversations = JSON.parse(localStorage.getItem("kayro_convs") || "[]"); } catch(e) { conversations = []; }
  }
}

// Immediate save (no debounce)
async function saveCloudDataNow() {
  if (!currentUser) return;
  try {
    var cleanConvs = [];
    for (var i = 0; i < conversations.length; i++) {
      var c = conversations[i];
      if (c.temp) continue;
      var msgs = [];
      for (var j = 0; j < c.messages.length; j++) {
        var m = c.messages[j];
        var cleaned = { role: m.role, text: m.text };
        if (m.attachments) {
          cleaned.attachments = [];
          for (var k = 0; k < m.attachments.length; k++) {
            var a = m.attachments[k];
            cleaned.attachments.push({
              name: a.name, type: a.type, isImage: a.isImage,
              dataUrl: (a.dataUrl && a.dataUrl.length < 50000) ? a.dataUrl : null
            });
          }
        }
        msgs.push(cleaned);
      }
      cleanConvs.push({ id: c.id, title: c.title, messages: msgs });
    }
    await db.collection("users").doc(currentUser.uid).set({
      conversations: cleanConvs,
      userName: userName, userAge: userAge,
      customInstructions: customInstructions,
      lang: currentLang, theme: currentTheme, bg: currentBg,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  } catch (err) { console.error("Save error:", err); }
  // Also save to localStorage as backup
  try {
    var localConvs = conversations.filter(function(c) { return !c.temp; });
    localStorage.setItem("kayro_convs", JSON.stringify(localConvs));
  } catch(e) {}
}

// Debounced save
function saveCloudData() {
  clearTimeout(syncDebounce);
  syncDebounce = setTimeout(function() { saveCloudDataNow(); }, 800);
  // Always save to localStorage immediately
  try {
    var localConvs = conversations.filter(function(c) { return !c.temp; });
    localStorage.setItem("kayro_convs", JSON.stringify(localConvs));
  } catch(e) {}
}

// ==========================================
//  APP UI — bind events once
// ==========================================
function initAppUI() {
  if (appInitialized) return;
  appInitialized = true;

  // Sidebar
  var sidebarOpen = document.getElementById("sidebarOpen");
  var sidebarClose = document.getElementById("sidebarClose");
  var overlay = document.getElementById("overlay");
  if (sidebarOpen) sidebarOpen.onclick = function() {
    var s = document.getElementById("sidebar"); if (s) s.classList.add("open");
    var o = document.getElementById("overlay"); if (o) o.classList.add("active");
  };
  if (sidebarClose) sidebarClose.onclick = closeSidebar;
  if (overlay) overlay.onclick = closeSidebar;

  // Logo & New Chat
  var logoBtn = document.getElementById("logoBtn");
  var newChatBtn = document.getElementById("newChatBtn");
  var tempChatBtn = document.getElementById("tempChatBtn");
  var tempBannerClose = document.getElementById("tempBannerClose");
  if (logoBtn) logoBtn.onclick = function() { startNewChat(); closeSidebar(); };
  if (newChatBtn) newChatBtn.onclick = function() { startNewChat(); closeSidebar(); };
  if (tempChatBtn) tempChatBtn.onclick = function() { startTempChat(); closeSidebar(); };
  if (tempBannerClose) tempBannerClose.onclick = endTempChat;

  // Language toggle sidebar
  var langToggle = document.getElementById("langToggle");
  if (langToggle) langToggle.onclick = function() {
    currentLang = currentLang === "en" ? "ar" : "en";
    localStorage.setItem("kayro_lang", currentLang);
    applyLanguage(currentLang); updateGreeting(); saveCloudData();
  };

  // Sample cards
  document.querySelectorAll(".sample-card").forEach(function(card) {
    card.onclick = function() { loadSampleConversation(parseInt(card.dataset.sample, 10)); };
  });

  // Send
  var sendBtn = document.getElementById("sendBtn");
  var userInput = document.getElementById("userInput");
  if (sendBtn) sendBtn.onclick = handleSend;
  if (userInput) {
    userInput.oninput = function() {
      var sb = document.getElementById("sendBtn");
      if (sb) sb.disabled = userInput.value.trim() === "" && pendingFiles.length === 0;
      autoResize(userInput);
    };
    userInput.onkeydown = function(e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (userInput.value.trim() || pendingFiles.length > 0) handleSend();
      }
    };
  }

  // Attach
  var attachBtn = document.getElementById("attachBtn");
  var fileInput = document.getElementById("fileInput");
  if (attachBtn) attachBtn.onclick = function() { if (fileInput) fileInput.click(); };
  if (fileInput) fileInput.onchange = handleFileSelect;

  // Mic
  var micBtn = document.getElementById("micBtn");
  if (micBtn) micBtn.onclick = toggleVoiceInput;

  // Settings
  var settingsBtn = document.getElementById("settingsBtn");
  var settingsClose = document.getElementById("settingsClose");
  var settingsOverlay = document.getElementById("settingsOverlay");
  if (settingsBtn) settingsBtn.onclick = function() { openSettings(); closeSidebar(); };
  if (settingsClose) settingsClose.onclick = closeSettings;
  if (settingsOverlay) settingsOverlay.onclick = function(e) { if (e.target === settingsOverlay) closeSettings(); };

  // Settings inputs
  var userNameInput = document.getElementById("userNameInput");
  var userAgeInput = document.getElementById("userAgeInput");
  var customInstructionsInput = document.getElementById("customInstructionsInput");
  if (userNameInput) { userNameInput.value = userName; userNameInput.onchange = saveSettingsFromInputs; }
  if (userAgeInput) { userAgeInput.value = userAge; userAgeInput.onchange = saveSettingsFromInputs; }
  if (customInstructionsInput) { customInstructionsInput.value = customInstructions; customInstructionsInput.onchange = saveSettingsFromInputs; }

  // Language settings buttons
  var langEn = document.getElementById("langEn");
  var langAr = document.getElementById("langAr");
  if (langEn) langEn.onclick = function() { currentLang = "en"; localStorage.setItem("kayro_lang", "en"); applyLanguage("en"); updateGreeting(); updateSettingsBtns(); saveCloudData(); };
  if (langAr) langAr.onclick = function() { currentLang = "ar"; localStorage.setItem("kayro_lang", "ar"); applyLanguage("ar"); updateGreeting(); updateSettingsBtns(); saveCloudData(); };

  // Theme buttons
  var themeDark = document.getElementById("themeDark");
  var themeLight = document.getElementById("themeLight");
  if (themeDark) themeDark.onclick = function() { applyTheme("dark"); updateSettingsBtns(); saveCloudData(); };
  if (themeLight) themeLight.onclick = function() { applyTheme("light"); updateSettingsBtns(); saveCloudData(); };

  // Background options
  document.querySelectorAll("#bgOptions .bg-option").forEach(function(btn) {
    btn.onclick = function() { applyBackground(btn.dataset.bg); updateSettingsBtns(); saveCloudData(); };
  });

  // Delete all
  var deleteAllBtn = document.getElementById("deleteAllChatsBtn");
  var clearAllBtn = document.getElementById("clearAllBtn");
  if (deleteAllBtn) deleteAllBtn.onclick = confirmDeleteAll;
  if (clearAllBtn) clearAllBtn.onclick = function() { if (conversations.length) confirmDeleteAll(); };

  // Logout
  var logoutBtn = document.getElementById("logoutBtn");
  var signOutSettingsBtn = document.getElementById("signOutSettingsBtn");
  if (logoutBtn) logoutBtn.onclick = handleLogout;
  if (signOutSettingsBtn) signOutSettingsBtn.onclick = function() { closeSettings(); handleLogout(); };

  // Confirm dialog
  var confirmCancel = document.getElementById("confirmCancel");
  var confirmOk = document.getElementById("confirmOk");
  var confirmOverlay = document.getElementById("confirmOverlay");
  if (confirmCancel) confirmCancel.onclick = closeConfirm;
  if (confirmOk) confirmOk.onclick = function() { if (confirmCallback) confirmCallback(); closeConfirm(); };
  if (confirmOverlay) confirmOverlay.onclick = function(e) { if (e.target === confirmOverlay) closeConfirm(); };

  // Image viewer
  var ivClose = document.getElementById("ivClose");
  var imageViewer = document.getElementById("imageViewer");
  var ivDownload = document.getElementById("ivDownload");
  if (ivClose) ivClose.onclick = closeImageViewer;
  if (imageViewer) imageViewer.onclick = function(e) { if (e.target === imageViewer) closeImageViewer(); };
  if (ivDownload) ivDownload.onclick = downloadCurrentImage;

  // Click images in chat
  var chatMessages = document.getElementById("chatMessages");
  if (chatMessages) chatMessages.onclick = function(e) {
    if (e.target.classList.contains("msg-img") || e.target.classList.contains("ai-generated-img")) {
      openImageViewer(e.target.src);
    }
  };

  updateSettingsBtns();
  renderChatHistory();
}

function closeSidebar() {
  var s = document.getElementById("sidebar"); if (s) s.classList.remove("open");
  var o = document.getElementById("overlay"); if (o) o.classList.remove("active");
}

// ==========================================
//  THEME & BACKGROUND — FIX #4: saved to cloud
// ==========================================
function applyTheme(t) {
  currentTheme = t;
  document.body.setAttribute("data-theme", t);
  localStorage.setItem("kayro_theme", t);
  if (t === "light" && currentBg === "stars") applyBackground("white");
}

function applyBackground(b) {
  currentBg = b;
  document.body.setAttribute("data-bg", b);
  localStorage.setItem("kayro_bg", b);
}

// ==========================================
//  LANGUAGE
// ==========================================
function applyLanguage(lang) {
  var strings = i18n[lang];
  document.documentElement.setAttribute("lang", lang === "ar" ? "ar" : "en");
  document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

  document.querySelectorAll("[data-i18n]").forEach(function(el) {
    var key = el.getAttribute("data-i18n");
    if (strings[key]) el.textContent = strings[key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(function(el) {
    var key = el.getAttribute("data-i18n-placeholder");
    if (strings[key]) el.setAttribute("placeholder", strings[key]);
  });

  var ll = document.getElementById("langLabel");
  var al = document.getElementById("authLangLabel");
  var as = document.getElementById("authSubtitle");
  if (ll) ll.textContent = lang === "en" ? "العربية" : "English";
  if (al) al.textContent = lang === "en" ? "العربية" : "English";
  if (as) as.textContent = lang === "ar" ? "سجل دخولك لبدء رحلتك" : "Sign in to start your journey";

  updateSettingsBtns();

  // FIX #3: only re-render current conversation's messages
  if (activeConversationId !== null) {
    var conv = getActiveConversation();
    if (conv) renderMessages(conv.messages);
  }
}

function updateSettingsBtns() {
  var le = document.getElementById("langEn");
  var la = document.getElementById("langAr");
  var td = document.getElementById("themeDark");
  var tl = document.getElementById("themeLight");
  if (le) le.classList.toggle("active", currentLang === "en");
  if (la) la.classList.toggle("active", currentLang === "ar");
  if (td) td.classList.toggle("active", currentTheme === "dark");
  if (tl) tl.classList.toggle("active", currentTheme === "light");
  document.querySelectorAll("#bgOptions .bg-option").forEach(function(b) {
    b.classList.toggle("active", b.dataset.bg === currentBg);
  });
}

function updateGreeting() {
  var hg = document.getElementById("heroGreeting");
  if (hg) hg.textContent = userName ? i18n[currentLang].greeting + ", " + userName + " 👋" : "";
}

// ==========================================
//  SETTINGS
// ==========================================
function openSettings() {
  var ni = document.getElementById("userNameInput");
  var ai = document.getElementById("userAgeInput");
  var ci = document.getElementById("customInstructionsInput");
  if (ni) ni.value = userName;
  if (ai) ai.value = userAge;
  if (ci) ci.value = customInstructions;
  updateSettingsBtns();
  var so = document.getElementById("settingsOverlay");
  if (so) so.classList.add("active");
}

function closeSettings() {
  var so = document.getElementById("settingsOverlay");
  if (so) so.classList.remove("active");
}

function saveSettingsFromInputs() {
  var ni = document.getElementById("userNameInput");
  var ai = document.getElementById("userAgeInput");
  var ci = document.getElementById("customInstructionsInput");
  userName = ni ? ni.value.trim() : "";
  userAge = ai ? ai.value.trim() : "";
  customInstructions = ci ? ci.value.trim() : "";
  updateGreeting();
  saveCloudData();
  showToast(i18n[currentLang].nameSaved);
}

// ==========================================
//  CONFIRM / IMAGE VIEWER / TOAST
// ==========================================
function showConfirm(title, text, cb) {
  var ct = document.getElementById("confirmTitle");
  var cx = document.getElementById("confirmText");
  var co = document.getElementById("confirmOverlay");
  if (ct) ct.textContent = title;
  if (cx) cx.textContent = text;
  confirmCallback = cb;
  if (co) co.classList.add("active");
}
function closeConfirm() {
  var co = document.getElementById("confirmOverlay");
  if (co) co.classList.remove("active");
  confirmCallback = null;
}
function confirmDeleteAll() {
  showConfirm(i18n[currentLang].confirmTitle, i18n[currentLang].confirmDeleteAll, function() {
    conversations = []; activeConversationId = null;
    renderChatHistory(); showWelcomeScreen(); saveCloudData();
    showToast(i18n[currentLang].allDeletedToast);
  });
}

function openImageViewer(src) {
  var img = document.getElementById("ivImage"); if (img) img.src = src;
  var iv = document.getElementById("imageViewer"); if (iv) iv.classList.add("active");
}
function closeImageViewer() {
  var iv = document.getElementById("imageViewer"); if (iv) iv.classList.remove("active");
  var img = document.getElementById("ivImage"); if (img) img.src = "";
}
function downloadCurrentImage() {
  var img = document.getElementById("ivImage"); var src = img ? img.src : "";
  if (!src) return;
  showToast(i18n[currentLang].downloading);
  fetch(src).then(function(r) { return r.blob(); }).then(function(blob) {
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "kayro-image-" + Date.now() + ".png";
    document.body.appendChild(a); a.click(); a.remove();
  }).catch(function() { window.open(src, "_blank"); });
}
function showToast(msg) {
  var old = document.querySelector(".toast"); if (old) old.remove();
  var t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(function() { t.classList.add("show"); });
  setTimeout(function() { t.classList.remove("show"); setTimeout(function() { t.remove(); }, 300); }, 2500);
}

// ==========================================
//  VOICE INPUT
// ==========================================
function initSpeechRecognition() {
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;
  recognition = new SR();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.onresult = function(e) {
    var t = "";
    for (var i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript;
    var ui = document.getElementById("userInput");
    if (ui) { ui.value = t; autoResize(ui); }
    var sb = document.getElementById("sendBtn");
    if (sb) sb.disabled = t.trim() === "";
  };
  recognition.onend = function() { isRecording = false; var mb = document.getElementById("micBtn"); if (mb) mb.classList.remove("recording"); };
  recognition.onerror = function() { isRecording = false; var mb = document.getElementById("micBtn"); if (mb) mb.classList.remove("recording"); };
}

function toggleVoiceInput() {
  if (!recognition) { showToast(i18n[currentLang].voiceNotSupported); return; }
  var mb = document.getElementById("micBtn");
  if (isRecording) { recognition.stop(); isRecording = false; if (mb) mb.classList.remove("recording"); }
  else {
    recognition.lang = currentLang === "ar" ? "ar-SA" : "en-US";
    try { recognition.start(); isRecording = true; if (mb) mb.classList.add("recording"); } catch(e) {}
  }
}

// ==========================================
//  TTS — FIX #5: proper stop
// ==========================================
function speakText(text, btn) {
  // If already speaking, stop
  if (currentTTS) {
    window.speechSynthesis.cancel();
    currentTTS = null;
    document.querySelectorAll(".tts-btn.playing, .msg-action-btn.playing").forEach(function(b) { b.classList.remove("playing"); });
    // If clicking same button, just stop
    if (btn._isPlaying) { btn._isPlaying = false; return; }
  }

  var clean = text.replace(/```[\s\S]*?```/g, "code block").replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").replace(/`(.*?)`/g, "$1").replace(/\n+/g, ". ");
  var u = new SpeechSynthesisUtterance(clean);
  u.lang = currentLang === "ar" ? "ar-SA" : "en-US";
  btn.classList.add("playing");
  btn._isPlaying = true;
  currentTTS = u;
  u.onend = function() { btn.classList.remove("playing"); btn._isPlaying = false; currentTTS = null; };
  u.onerror = function() { btn.classList.remove("playing"); btn._isPlaying = false; currentTTS = null; };
  window.speechSynthesis.speak(u);
}

// ==========================================
//  CONVERSATIONS — FIX #3: separate messages
// ==========================================
function getActiveConversation() {
  if (activeConversationId === null) return null;
  for (var i = 0; i < conversations.length; i++) {
    if (conversations[i].id === activeConversationId) return conversations[i];
  }
  return null;
}

function startTempChat() {
  isTempMode = true;
  var id = Date.now();
  conversations.push({ id: id, title: currentLang === "ar" ? "محادثة مؤقتة" : "Temporary Chat", messages: [], temp: true });
  activeConversationId = id;
  showChatArea();
  renderMessages([]); // Clear and show empty
  renderChatHistory();
  var tb = document.getElementById("tempBanner"); if (tb) tb.classList.add("active");
}

function endTempChat() {
  if (isTempMode && activeConversationId) {
    conversations = conversations.filter(function(c) { return c.id !== activeConversationId; });
  }
  isTempMode = false; activeConversationId = null;
  var tb = document.getElementById("tempBanner"); if (tb) tb.classList.remove("active");
  showWelcomeScreen(); renderChatHistory(); saveCloudData();
}

function startNewChat() {
  if (isTempMode && activeConversationId) {
    conversations = conversations.filter(function(c) { return c.id !== activeConversationId; });
  }
  isTempMode = false; activeConversationId = null;
  var tb = document.getElementById("tempBanner"); if (tb) tb.classList.remove("active");
  pendingFiles = []; renderFilePreview();
  showWelcomeScreen();
  var ui = document.getElementById("userInput"); if (ui) ui.value = "";
  var sb = document.getElementById("sendBtn"); if (sb) sb.disabled = true;
  renderChatHistory();
}

function showWelcomeScreen() {
  var ws = document.getElementById("welcomeScreen"); if (ws) ws.classList.remove("hidden");
  var ca = document.getElementById("chatArea"); if (ca) ca.classList.remove("active");
}

function showChatArea() {
  var ws = document.getElementById("welcomeScreen"); if (ws) ws.classList.add("hidden");
  var ca = document.getElementById("chatArea"); if (ca) ca.classList.add("active");
}

function loadSampleConversation(index) {
  var samples = sampleConversations[currentLang];
  if (!samples || !samples[index]) return;
  var sample = samples[index];
  var id = Date.now();
  // Create NEW conversation with copied messages
  var conv = { id: id, title: sample.title, messages: [] };
  for (var i = 0; i < sample.messages.length; i++) {
    conv.messages.push({ role: sample.messages[i].role, text: sample.messages[i].text });
  }
  conversations.push(conv);
  activeConversationId = id;
  isTempMode = false;
  var tb = document.getElementById("tempBanner"); if (tb) tb.classList.remove("active");
  showChatArea();
  renderMessages(conv.messages); // Only THIS conversation's messages
  renderChatHistory();
  closeSidebar();
  saveCloudData();
}

// ==========================================
//  FILE HANDLING
// ==========================================
function handleFileSelect(e) {
  var files = Array.from(e.target.files);
  for (var i = 0; i < files.length; i++) {
    (function(file) {
      if (file.size > 10 * 1024 * 1024) { showToast(i18n[currentLang].fileTooBig); return; }
      var reader = new FileReader();
      var isImage = file.type.startsWith("image/");
      reader.onload = function(ev) {
        pendingFiles.push({ name: file.name, type: file.type, dataUrl: ev.target.result, isImage: isImage });
        renderFilePreview();
        var sb = document.getElementById("sendBtn"); if (sb) sb.disabled = false;
      };
      reader.readAsDataURL(file);
    })(files[i]);
  }
  e.target.value = "";
}

function renderFilePreview() {
  var area = document.getElementById("filePreviewArea");
  if (!area) return;
  area.innerHTML = "";
  if (pendingFiles.length === 0) { area.classList.remove("has-files"); return; }
  area.classList.add("has-files");
  for (var i = 0; i < pendingFiles.length; i++) {
    (function(f, idx) {
      var item = document.createElement("div"); item.className = "file-preview-item";
      var thumb = f.isImage ? '<img class="file-preview-thumb" src="' + f.dataUrl + '" />' : "";
      item.innerHTML = thumb + '<span class="file-preview-name">' + (f.isImage ? "" : "📄 ") + escapeHTML(f.name) + '</span><button class="file-preview-remove">✕</button>';
      item.querySelector(".file-preview-remove").onclick = function() {
        pendingFiles.splice(idx, 1); renderFilePreview();
        var sb = document.getElementById("sendBtn");
        var ui = document.getElementById("userInput");
        if (sb && ui) sb.disabled = ui.value.trim() === "" && pendingFiles.length === 0;
      };
      area.appendChild(item);
    })(pendingFiles[i], i);
  }
}

// ==========================================
//  LOGOUT
// ==========================================
function handleLogout() {
  showConfirm(i18n[currentLang].confirmTitle, i18n[currentLang].signOutConfirm, async function() {
    try {
      // Stop any TTS
      if (currentTTS) { window.speechSynthesis.cancel(); currentTTS = null; }
      await auth.signOut();
      conversations = []; activeConversationId = null; isTempMode = false;
      var tb = document.getElementById("tempBanner"); if (tb) tb.classList.remove("active");
      appInitialized = false;
    } catch (err) { console.error("Logout error:", err); }
  });
}

// ==========================================
//  CHAT HISTORY — FIX #3: clicking loads ONLY that conversation
// ==========================================
function renderChatHistory() {
  var ch = document.getElementById("chatHistory");
  if (!ch) return;
  ch.innerHTML = "";

  // Temp first, then non-temp reversed
  var temps = [], normals = [];
  for (var i = 0; i < conversations.length; i++) {
    if (conversations[i].temp) temps.push(conversations[i]);
    else normals.push(conversations[i]);
  }
  var all = temps.reverse().concat(normals.reverse());

  for (var j = 0; j < all.length; j++) {
    (function(conv) {
      var btn = document.createElement("button");
      btn.className = "history-item" + (conv.id === activeConversationId ? " active" : "");
      var icon = '<svg class="history-icon" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3.5H12M2 7H9M2 10.5H11" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>';
      var badge = conv.temp ? '<span class="history-temp-badge">' + i18n[currentLang].tempLabel + '</span>' : "";
      var del = '<button class="history-delete"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><line x1="3" y1="3" x2="9" y2="9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="9" y1="3" x2="3" y2="9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button>';
      btn.innerHTML = icon + '<span class="history-title">' + escapeHTML(conv.title) + '</span>' + badge + del;

      btn.onclick = function(e) {
        if (e.target.closest(".history-delete")) return;
        // FIX #3: Switch to THIS conversation and show ONLY its messages
        activeConversationId = conv.id;
        isTempMode = !!conv.temp;
        var tb = document.getElementById("tempBanner");
        if (tb) tb.classList.toggle("active", isTempMode);
        showChatArea();
        renderMessages(conv.messages); // Only THIS conversation's messages
        renderChatHistory();
        closeSidebar();
      };

      btn.querySelector(".history-delete").onclick = function(e) {
        e.stopPropagation();
        showConfirm(i18n[currentLang].confirmTitle, i18n[currentLang].confirmDeleteOne, function() {
          conversations = conversations.filter(function(c) { return c.id !== conv.id; });
          if (activeConversationId === conv.id) {
            activeConversationId = null; isTempMode = false;
            var tb = document.getElementById("tempBanner"); if (tb) tb.classList.remove("active");
            showWelcomeScreen();
          }
          renderChatHistory(); saveCloudData(); showToast(i18n[currentLang].deletedToast);
        });
      };

      ch.appendChild(btn);
    })(all[j]);
  }
}

// ==========================================
//  MESSAGE RENDERING — FIX #3: clear before render
// ==========================================
function renderMessages(messages) {
  var cm = document.getElementById("chatMessages");
  if (!cm) return;
  // CLEAR everything first
  cm.innerHTML = "";
  // Only render messages from the current conversation
  for (var i = 0; i < messages.length; i++) {
    appendMessage(messages[i].role, messages[i].text, messages[i].attachments, false, i);
  }
  scrollToBottom();
}

function appendMessage(role, text, attachments, animate, msgIndex) {
  if (animate === undefined) animate = true;
  if (msgIndex === undefined) msgIndex = -1;
  var cm = document.getElementById("chatMessages");
  if (!cm) return;
  var s = i18n[currentLang];
  var el = document.createElement("div");
  el.className = "message " + (role === "user" ? "user-msg" : "ai-msg");
  if (!animate) el.style.animation = "none";

  var displayName = role === "user" ? (userName || s.you) : s.kayro;
  var avatarContent;
  if (role === "user" && currentUser && currentUser.photoURL) {
    avatarContent = '<img src="' + currentUser.photoURL + '" alt="avatar" />';
  } else if (role === "user") {
    avatarContent = userName ? userName.charAt(0).toUpperCase() : "U";
  } else {
    avatarContent = "K";
  }

  var attachHTML = "";
  if (attachments && attachments.length > 0) {
    var items = "";
    for (var i = 0; i < attachments.length; i++) {
      var a = attachments[i];
      if (a.isImage && a.dataUrl) items += '<img class="msg-img" src="' + a.dataUrl + '" alt="' + escapeHTML(a.name) + '" />';
      else items += '<div class="msg-file">📄 ' + escapeHTML(a.name) + '</div>';
    }
    attachHTML = '<div class="msg-attachments">' + items + '</div>';
  }

  var actions = '<div class="msg-actions">';
  actions += '<button class="msg-action-btn copy-msg-btn" data-text="' + escapeHTML(text || '') + '" title="' + s.copyMsg + '"><svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1"/><path d="M10 4V3C10 2.45 9.55 2 9 2H3C2.45 2 2 2.45 2 3V9C2 9.55 2.45 10 3 10H4" stroke="currentColor" stroke-width="1"/></svg></button>';
  if (role === "ai" && text) {
    actions += '<button class="msg-action-btn tts-btn" data-tts-text="' + escapeHTML(text) + '" title="' + s.listen + '"><svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 5.5H4L7 2.5V11.5L4 8.5H2C1.45 8.5 1 8.05 1 7.5V6.5C1 5.95 1.45 5.5 2 5.5Z" stroke="currentColor" stroke-width="0.9" fill="none"/><path d="M9.5 4C10.3 4.8 10.8 5.9 10.8 7C10.8 8.1 10.3 9.2 9.5 10" stroke="currentColor" stroke-width="0.9" stroke-linecap="round"/></svg></button>';
  }
  if (role === "user" && msgIndex >= 0) {
    actions += '<button class="msg-action-btn edit-msg-btn" data-msg-index="' + msgIndex + '" title="' + s.editMsg + '"><svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M9.5 2.5L11.5 4.5L4.5 11.5H2.5V9.5L9.5 2.5Z" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/></svg></button>';
  }
  actions += '</div>';

  el.innerHTML = '<div class="msg-avatar ' + (role === "user" ? "user" : "ai") + '">' + avatarContent + '</div><div class="msg-bubble"><span class="msg-sender">' + escapeHTML(displayName) + '</span><div class="msg-body">' + (text ? formatText(text) : "") + '</div>' + attachHTML + actions + '</div>';

  cm.appendChild(el);
  bindMsgActions(el);
  scrollToBottom();
}

function bindMsgActions(el) {
  el.querySelectorAll(".copy-msg-btn").forEach(function(btn) {
    btn.onclick = function() {
      var text = btn.getAttribute("data-text");
      navigator.clipboard.writeText(text).then(function() { showToast(i18n[currentLang].copied); }).catch(function() {
        var ta = document.createElement("textarea"); ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
        document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
        showToast(i18n[currentLang].copied);
      });
    };
  });
  el.querySelectorAll(".tts-btn").forEach(function(btn) {
    btn.onclick = function() { speakText(btn.getAttribute("data-tts-text"), btn); };
  });
  el.querySelectorAll(".edit-msg-btn").forEach(function(btn) {
    btn.onclick = function() {
      var idx = parseInt(btn.getAttribute("data-msg-index"), 10);
      var conv = getActiveConversation();
      if (!conv || !conv.messages[idx]) return;
      var ui = document.getElementById("userInput");
      if (ui) { ui.value = conv.messages[idx].text; autoResize(ui); ui.focus(); }
      var sb = document.getElementById("sendBtn"); if (sb) sb.disabled = false;
      conv.messages = conv.messages.slice(0, idx);
      renderMessages(conv.messages);
      saveCloudData();
    };
  });
  el.querySelectorAll(".code-copy-btn").forEach(function(btn) {
    btn.onclick = function() { copyCodeBlock(btn); };
  });
}

function showTypingIndicator() {
  var cm = document.getElementById("chatMessages"); if (!cm) return;
  var el = document.createElement("div");
  el.className = "message ai-msg"; el.id = "typingIndicator";
  el.innerHTML = '<div class="msg-avatar ai">K</div><div class="msg-bubble"><span class="msg-sender">' + escapeHTML(i18n[currentLang].kayro) + '</span><div class="typing-dots"><div class="t-dot"></div><div class="t-dot"></div><div class="t-dot"></div></div></div>';
  cm.appendChild(el); scrollToBottom();
}

function removeTypingIndicator() {
  var el = document.getElementById("typingIndicator"); if (el) el.remove();
}

// ==========================================
//  SEND MESSAGE
// ==========================================
function handleSend() {
  if (isGenerating) return;
  var ui = document.getElementById("userInput");
  var text = ui ? ui.value.trim() : "";
  var attachments = pendingFiles.slice();
  if (!text && attachments.length === 0) return;

  // Create new conversation if needed
  if (activeConversationId === null) {
    var id = Date.now();
    var title = text ? (text.length > 40 ? text.substring(0, 40) + "…" : text) : "File attachment";
    conversations.push({ id: id, title: title, messages: [] });
    activeConversationId = id;
    showChatArea();
  }

  var conv = getActiveConversation();
  if (!conv) return;

  var msgObj = { role: "user", text: text };
  if (attachments.length > 0) msgObj.attachments = attachments;
  conv.messages.push(msgObj);
  appendMessage("user", text, attachments, true, conv.messages.length - 1);

  if (ui) ui.value = "";
  pendingFiles = []; renderFilePreview();
  var sb = document.getElementById("sendBtn"); if (sb) sb.disabled = true;
  if (ui) autoResize(ui);
  saveCloudData(); renderChatHistory();

  if (isImageRequest(text)) generateImage(text, conv);
  else getAIResponse(text, attachments, conv);
}

// ==========================================
//  IMAGE GENERATION
// ==========================================
function isImageRequest(text) {
  var t = text.toLowerCase();
  return /^(draw|paint|generate|create|make|design|sketch)\s/i.test(t) ||
    /\b(generate|create|draw|paint|make)\s+(a |an |the )?(image|picture|photo|illustration|drawing)\b/i.test(t) ||
    /^(ارسم|صمم|اصنع|ولّد|انشئ|أنشئ)/i.test(t);
}

async function generateImage(prompt, conv) {
  isGenerating = true;
  var cm = document.getElementById("chatMessages");
  var s = i18n[currentLang];
  var loadingEl = document.createElement("div");
  loadingEl.className = "message ai-msg"; loadingEl.id = "imgLoading";
  loadingEl.innerHTML = '<div class="msg-avatar ai">K</div><div class="msg-bubble"><span class="msg-sender">' + escapeHTML(s.kayro) + '</span><div class="img-loading"><div class="spinner"></div><span>' + s.generatingImage + '</span></div></div>';
  if (cm) cm.appendChild(loadingEl);
  scrollToBottom();

  try {
    var imagePrompt = prompt.replace(/^(ارسم|صمم|اصنع|ولّد|أنشئ|انشئ|draw|paint|generate|create|make|design|sketch)\s*/i, '').replace(/^(me\s+|لي\s+)?/i, '').replace(/^(a |an |the )?(image|picture|photo|illustration|صورة|رسمة|لوحة)\s*(of |for |about |عن |ل)?/i, '').trim() || prompt;
    var imageUrl = "https://image.pollinations.ai/prompt/" + encodeURIComponent(imagePrompt) + "?width=768&height=768&nologo=true&seed=" + Date.now();
    var img = new Image(); img.crossOrigin = "anonymous";
    await new Promise(function(resolve, reject) { img.onload = resolve; img.onerror = reject; img.src = imageUrl; setTimeout(function() { reject(new Error("timeout")); }, 30000); });
    var le = document.getElementById("imgLoading"); if (le) le.remove();
    var aiText = currentLang === "ar" ? "تفضل، هذي الصورة! 🎨" : "Here's the image you requested! 🎨";
    var el = document.createElement("div"); el.className = "message ai-msg";
    el.innerHTML = '<div class="msg-avatar ai">K</div><div class="msg-bubble"><span class="msg-sender">' + escapeHTML(s.kayro) + '</span><div class="msg-body">' + formatText(aiText) + '</div><img class="ai-generated-img" src="' + imageUrl + '" alt="Generated" /></div>';
    if (cm) cm.appendChild(el); scrollToBottom();
    conv.messages.push({ role: "ai", text: aiText }); saveCloudData();
  } catch (err) {
    var le2 = document.getElementById("imgLoading"); if (le2) le2.remove();
    var errText = currentLang === "ar" ? "عذرًا، حصل خطأ أثناء إنشاء الصورة." : "Sorry, error generating the image.";
    appendMessage("ai", errText);
    conv.messages.push({ role: "ai", text: errText }); saveCloudData();
  }
  isGenerating = false;
}

// ==========================================
//  AI API — OpenRouter (DeepSeek V3)
// ==========================================
var OPENROUTER_API_KEY = "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";
var OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
var OPENROUTER_MODEL = "deepseek/deepseek-chat-v3-0324";

async function getAIResponse(userMessage, attachments, conv) {
  isGenerating = true;
  showTypingIndicator();
  try {
    var aiText = await callOpenRouterAPI(userMessage, attachments, conv);
    removeTypingIndicator();
    appendMessageStreaming("ai", aiText, conv);
  } catch (error) {
    console.error("API error:", error);
    removeTypingIndicator();
    var errorMsg = "Error: " + (error.message || "Unknown error");
    if (error.message && error.message.indexOf("401") !== -1) errorMsg = "Authentication error.";
    else if (error.message && error.message.indexOf("429") !== -1) errorMsg = "Rate limit. Try again shortly.";
    else if (error.message && error.message.indexOf("402") !== -1) errorMsg = "Insufficient credits.";
    appendMessage("ai", errorMsg);
    conv.messages.push({ role: "ai", text: errorMsg }); saveCloudData();
  }
  isGenerating = false;
}

function buildSystemPrompt() {
  var langNote = currentLang === "ar"
    ? "The user interface is in Arabic. Respond primarily in Arabic unless the user writes in another language."
    : "The user interface is in English. Respond primarily in English unless the user writes in another language.";
  var nameNote = userName ? 'The user\'s name is "' + userName + '".' + (userAge ? ' They are ' + userAge + ' years old.' : '') + ' Address them by name naturally.' : "";
  var customNote = customInstructions ? "\n\nAdditional user instructions:\n" + customInstructions : "";
  return 'You are KAYRO AI, a highly intelligent, helpful, and friendly AI assistant. You were developed and created by Youssef Hegazy (يوسف حجازي). You are NOT made by Google, OpenAI, Meta, DeepSeek, or any other company — you are created by Youssef Hegazy.\n\nWhen anyone asks "who made you", "who developed you", "who created you", "من صنعك", "من طورك", "من مطورك", "مين عملك", or any similar question, you MUST answer that you were developed by Youssef Hegazy (يوسف حجازي).\n\nYou provide clear, detailed, and accurate responses. You use markdown formatting: **bold**, *italic*, `code`, code blocks with ```, bullet points, and numbered lists.\n\n' + nameNote + ' ' + langNote + customNote;
}

async function callOpenRouterAPI(userMessage, attachments, conv) {
  var messages = [{ role: "system", content: buildSystemPrompt() }];

  // Add history from THIS conversation only (last 20 messages)
  var history = conv.messages.slice(-20);
  for (var i = 0; i < history.length; i++) {
    var msg = history[i];
    if (msg.role === "user") {
      if (!msg.attachments || msg.attachments.length === 0) {
        if (msg.text) messages.push({ role: "user", content: msg.text });
      } else {
        var content = [];
        if (msg.text) content.push({ type: "text", text: msg.text });
        for (var j = 0; j < msg.attachments.length; j++) {
          if (msg.attachments[j].isImage && msg.attachments[j].dataUrl) {
            content.push({ type: "image_url", image_url: { url: msg.attachments[j].dataUrl } });
          }
        }
        if (content.length > 0) messages.push({ role: "user", content: content });
      }
    } else if (msg.role === "ai" && msg.text) {
      messages.push({ role: "assistant", content: msg.text });
    }
  }

  // Add current message
  if (attachments && attachments.length > 0) {
    var content = [];
    if (userMessage) content.push({ type: "text", text: userMessage });
    for (var k = 0; k < attachments.length; k++) {
      var att = attachments[k];
      if (att.isImage && att.dataUrl) {
        content.push({ type: "image_url", image_url: { url: att.dataUrl } });
      } else if (!att.isImage && att.dataUrl) {
        try {
          var textContent = atob(att.dataUrl.split(",")[1] || "");
          content.push({ type: "text", text: "[File: " + att.name + "]\n```\n" + textContent + "\n```" });
        } catch(e) { content.push({ type: "text", text: "[File: " + att.name + "]" }); }
      }
    }
    if (content.length > 0) messages.push({ role: "user", content: content });
  } else if (userMessage) {
    messages.push({ role: "user", content: userMessage });
  }

  var response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + OPENROUTER_API_KEY,
      "HTTP-Referer": window.location.href,
      "X-Title": "KAYRO AI"
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: messages,
      max_tokens: 4096,
      temperature: 0.7,
      top_p: 0.9
    })
  });

  if (!response.ok) {
    var err = {};
    try { err = await response.json(); } catch(e) {}
    throw new Error(response.status + ": " + ((err.error && err.error.message) || response.statusText));
  }

  var data = await response.json();
  if (data.error) throw new Error(data.error.message);
  var text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!text) throw new Error("Empty response");
  return text;
}

// ==========================================
//  STREAMING DISPLAY
// ==========================================
function appendMessageStreaming(role, fullText, conv) {
  var cm = document.getElementById("chatMessages"); if (!cm) return;
  var s = i18n[currentLang];
  var el = document.createElement("div");
  el.className = "message " + (role === "user" ? "user-msg" : "ai-msg");

  var avatarContent = role === "user" ? (userName ? userName.charAt(0).toUpperCase() : "U") : "K";
  if (role === "user" && currentUser && currentUser.photoURL) avatarContent = '<img src="' + currentUser.photoURL + '" />';

  el.innerHTML = '<div class="msg-avatar ' + (role === "user" ? "user" : "ai") + '">' + avatarContent + '</div><div class="msg-bubble"><span class="msg-sender">' + escapeHTML(role === "user" ? (userName || s.you) : s.kayro) + '</span><div class="msg-body"><span class="streaming-cursor"></span></div></div>';
  cm.appendChild(el); scrollToBottom();

  var bodyEl = el.querySelector(".msg-body");
  var charIndex = 0;
  var speed = Math.max(4, Math.min(15, 1800 / fullText.length));

  function typeNext() {
    if (charIndex < fullText.length) {
      charIndex += Math.ceil(Math.random() * 3) + 1;
      if (charIndex > fullText.length) charIndex = fullText.length;
      bodyEl.innerHTML = formatText(fullText.substring(0, charIndex)) + '<span class="streaming-cursor"></span>';
      scrollToBottom();
      setTimeout(typeNext, speed + Math.random() * 8);
    } else {
      var actionsHTML = '<div class="msg-actions"><button class="msg-action-btn copy-msg-btn" data-text="' + escapeHTML(fullText) + '" title="' + s.copyMsg + '"><svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1"/><path d="M10 4V3C10 2.45 9.55 2 9 2H3C2.45 2 2 2.45 2 3V9C2 9.55 2.45 10 3 10H4" stroke="currentColor" stroke-width="1"/></svg></button><button class="msg-action-btn tts-btn" data-tts-text="' + escapeHTML(fullText) + '" title="' + s.listen + '"><svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 5.5H4L7 2.5V11.5L4 8.5H2C1.45 8.5 1 8.05 1 7.5V6.5C1 5.95 1.45 5.5 2 5.5Z" stroke="currentColor" stroke-width="0.9" fill="none"/><path d="M9.5 4C10.3 4.8 10.8 5.9 10.8 7C10.8 8.1 10.3 9.2 9.5 10" stroke="currentColor" stroke-width="0.9" stroke-linecap="round"/></svg></button></div>';
      bodyEl.innerHTML = formatText(fullText);
      el.querySelector(".msg-bubble").insertAdjacentHTML("beforeend", actionsHTML);
      bindMsgActions(el); scrollToBottom();
      conv.messages.push({ role: "ai", text: fullText });
      saveCloudData();
    }
  }
  typeNext();
}

// ==========================================
//  FORMAT TEXT
// ==========================================
function formatText(text) {
  var out = escapeHTML(text);
  out = out.replace(/```(\w*)\n?([\s\S]*?)```/g, function(_, lang, code) {
    var langLabel = lang || "code";
    var id = "code-" + Math.random().toString(36).substr(2, 8);
    return '<div class="code-block-wrapper"><div class="code-block-header"><span>' + langLabel + '</span><button class="code-copy-btn" data-code-id="' + id + '">' + i18n[currentLang].copy + '</button></div><pre><code id="' + id + '">' + code.trim() + '</code></pre></div>';
  });
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  out = out.replace(/\n/g, "<br>");
  return out;
}

function copyCodeBlock(btn) {
  var codeEl = document.getElementById(btn.getAttribute("data-code-id"));
  if (!codeEl) return;
  var text = codeEl.textContent;
  navigator.clipboard.writeText(text).then(function() {
    btn.textContent = i18n[currentLang].copied; btn.classList.add("copied");
    setTimeout(function() { btn.textContent = i18n[currentLang].copy; btn.classList.remove("copied"); }, 2000);
  }).catch(function() {
    var ta = document.createElement("textarea"); ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
    btn.textContent = i18n[currentLang].copied; btn.classList.add("copied");
    setTimeout(function() { btn.textContent = i18n[currentLang].copy; btn.classList.remove("copied"); }, 2000);
  });
}

// ==========================================
//  UTILITIES
// ==========================================
function escapeHTML(str) {
  if (!str) return "";
  var d = document.createElement("div"); d.textContent = str; return d.innerHTML;
}
function autoResize(el) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 120) + "px";
}
function scrollToBottom() {
  var cm = document.getElementById("chatMessages");
  if (cm) requestAnimationFrame(function() { cm.scrollTop = cm.scrollHeight; });
}
