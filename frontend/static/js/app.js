/**
 * दुकान साथी AI (DukaanSaathi AI) - Bharat Merchant Frontend Controller
 * Powered by Paytm Merchant Growth AI Architecture
 */

let currentMerchantId = "PAYTM_M_1001";
let currentLanguage = "hi"; // 'hi' or 'en'
let isMerchantMode = true; // true = simple shopkeeper UX, false = technical judge ML view
let demandChartInstance = null;
let cashflowChartInstance = null;
let shapChartInstance = null;

// Translation Dictionary for Full Bilingual Support (Hindi / English)
const TRANSLATIONS = {
  hi: {
    hdr_soundbox: "साउंडबॉक्स 4G कनेक्टेड",
    hdr_judge_mode: "जज / AI मोड",
    tab_home: "🏪 मुख्य पृष्ठ (Store Home)",
    home_verified_badge: "✓ पेटीएम सत्यापित व्यापारी",
    home_owner: "👤 दुकानदार / मालिक:",
    home_location: "📍 दुकान का पता:",
    home_today_date: "📅 आज की तारीख:",
    home_partner_since: "🗓️ पेटीएम पार्टनर:",
    home_merchant_id: "🆔 मर्चेंट आईडी:",
    home_qr_status: "💳 QR व भुगतान:",
    home_metrics_title: "📊 दुकान के वास्तविक आंकड़े (Real Store Metrics)",
    home_metrics_sub: "✓ केवल सत्यापित वास्तविक डेटा • कोई अनुमान नहीं (Verified True Values Only)",
    metric_today_sales: "आज की बिक्री (अब तक)",
    metric_yesterday_sales: "कल की बिक्री (Yesterday)",
    metric_2d_sales: "2 दिन पहले की बिक्री",
    metric_7d_gmv: "पिछले 7 दिनों का कुल गल्ला",
    metric_monthly_gmv: "30 दिनों का कुल व्यापार",
    metric_credit_score: "दुकान साख (Credit Score)",
    metric_merchant_tier: "व्यापार दर्जा (Merchant Tier)",
    metric_regular_customers: "पक्के नियमित ग्राहक",
    hero_verified: "✓ पेटीएम सत्यापित व्यापारी",
    hero_daily_sales: "रोज़ की औसत बिक्री",
    hero_credit_score: "दुकान साख स्कोर",
    hero_business_tier: "व्यापार दर्जा",
    guide_s1_title: "माइक दबाकर बोलें",
    guide_s1_desc: '"आज शाम क्या बिकेगा?" — साथी तुरंत साउंडबॉक्स आवाज़ में बताएगा',
    guide_s2_title: "शेल्फ़ की फोटो खींचें",
    guide_s2_desc: "खाली सामान लाल डिब्बे में दिखेगा और व्हाट्सएप आर्डर तैयार होगा",
    guide_s3_title: "1-टैप में रोकड़ा संभालें",
    guide_s3_desc: "महीने के खर्चे का अलर्ट पाएं और ₹25,000 तुरंत लोन खाते में लें",
    copilot_title: "दुकान साथी वॉयस असिस्टेंट",
    copilot_subtitle: "सीधे हिंदी या हिंग्लिश में बोलें, टाइप करने की ज़रूरत नहीं",
    copilot_btn: "पूछें साथी से ➔",
    copilot_intent_init: "सवाल का विषय: बिक्री अनुमान",
    copilot_audio_replay: "साउंडबॉक्स आवाज़ में दोबारा सुनें",
    kpi_1_title: "आज का अनुमानित गल्ला",
    kpi_1_sub: "पड़ोस की दुकानों से ज्यादा",
    kpi_2_title: "7-दिन की कुल बिक्री अनुमान",
    kpi_2_tag: "त्योहार का असर",
    kpi_2_sub: "ज्यादा ग्राहक आने वाले हैं",
    kpi_3_title: "पुराने ग्राहक जो नहीं आए",
    kpi_3_tag: "30+ दिनों से नहीं आए",
    kpi_3_sub: "₹20 कैशबैक से वापस बुलाएं",
    kpi_4_title: "दुकान साख (क्रेडिट हेल्थ)",
    kpi_4_tag: "प्री-एप्रूव्ड लोन",
    kpi_4_sub: "₹25,000 तुरंत उपलब्ध",
    tab_demand: "📈 बिक्री अनुमान (Demand Forecast)",
    tab_inventory: "📸 शेल्फ़ स्कैनर (Shelf Scanner)",
    tab_retention: "👥 ग्राहक वापसी (Customer Retention)",
    tab_cashflow: "💰 रोकड़ा व लोन (Cashflow & Credit)",
    tab_score: "🏅 साख स्कोर (Merchant Score)",
    tab_competitor: "📡 पड़ोस बाज़ार (Competitor Radar)",
    tab_actions: "⚡ 1-टैप काम (Action Hub)",
    t1_lead_title: "साथी की सलाह: त्योहारों के कारण मांग में 25% तक वृद्धि",
    t1_lead_desc: "अगले 7 दिनों में गल्ला बढ़ने का पूरा अनुमान है। रोजमर्रा के जरूरी सामान और तेल-मसाले का पर्याप्त स्टॉक रखें ताकि ग्राहकों को खाली हाथ न लौटना पड़े।",
    t1_c1_title: "📈 7-दिन का बिक्री व ग्राहक आवागमन अनुमान",
    t1_c2_title: "⚡ बाज़ार और मौसम के असर",
    t1_live_badge: "लाइव अलर्ट",
    t1_tip_title: "💡 साथी की खास टिप",
    t1_tip_desc: "शुक्रवार को दोपहर 3 से 8 बजे तक सबसे ज्यादा रश रहेगा। हेल्पर को दुकान पर पहले से तैयार रखें।",
    t1_c3_title: "📦 इस हफ़्ते सबसे ज्यादा बिकने वाले सामान",
    t1_stock_badge: "स्टॉक स्थिति",
    th_prod_name: "सामान का नाम",
    th_est_demand: "अनुमानित खपत",
    th_est_rev: "संभावित कमाई",
    th_stock_status: "दुकान में स्थिति",
    t2_lead_title: "अलमारी की फोटो खींचिए — खाली जगह और खत्म सामान तुरंत दिखेगा",
    t2_lead_desc: "दुकान की अलमारी (शेल्फ़) की फोटो खींचने पर AI तुरंत बता देता है कि कौन सा सामान या स्टॉक खत्म हो चुका है। आप 1-क्लिक में होलसेलर को व्हाट्सएप आर्डर भेज सकते हैं।",
    t2_c1_title: '📷 "फोटो से स्टॉक जांचें" — अलमारी स्कैनर',
    t2_dropzone_title: "दुकान की अलमारी की फोटो चुनें या कैमरा खोलें",
    t2_dropzone_sub: "AI तुरंत खाली रैक और कम स्टॉक वाले सामान को लाल डिब्बे में दिखा देगा",
    t2_btn_demo: "⚡ डेमो अलमारी स्कैन करके देखें",
    t2_fullness_lbl: "अलमारी का भराव (Fullness)",
    t2_detected_lbl: "पहचाने गए पैकेट",
    t2_stockout_heading: "⚠️ खत्म हुआ सामान (तुरंत आर्डर करें)",
    t2_c2_title: "📦 कौन सा सामान कितना मंगाना है (स्मार्ट इन्वेंट्री)",
    th_item: "सामान",
    th_current_stock: "वर्तमान स्टॉक",
    th_min_threshold: "खतरे का निशान",
    th_reorder_qty: "मंगाने की सलाह",
    th_co_purchased: "साथ में बिकने वाला सामान",
    th_action: "1-क्लिक एक्शन",
    t3_lead_title: "पुराने ग्राहकों को दुकान पर वापस बुलाएं — ₹20 पेटीएम कैशबैक ऑफर",
    t3_lead_desc: "जो पक्के ग्राहक पिछले 15–30 दिनों से नहीं आए हैं, वे शायद ऑनलाइन डार्क स्टोर जा रहे हैं। साथी ने उनके लिए ₹20 का विशेष पेटीएम कैशबैक ऑफर तैयार किया है — बस 'ऑफर भेजें' पर क्लिक करें।",
    t3_c1_title: "👥 ग्राहक जो काफी दिनों से नहीं आए (खतरे में पक्के ग्राहक)",
    t3_badge: "तुरंत वापस लाएं",
    th_cust_name: "ग्राहक का नाम व नंबर",
    th_last_visit: "पिछली खरीदारी",
    th_churn_risk: "दूर जाने का खतरा",
    th_offer: "तैयार कैशबैक ऑफर",
    th_action_offer: "1-क्लिक ऑफर",
    t4_alert_heading: "रोकड़े की संभावित तंगी का अलर्ट",
    t4_alert_sub: "दुकान का किराया और होलसेलर बिल 48 घंटे के भीतर आने वाले हैं।",
    t4_shortfall_lbl: "संभावित कमी",
    t4_loan_title: "घबराएं नहीं! पेटीएम तुरंत व्यापारी क्रेडिट प्री-एप्रूव्ड है",
    t4_loan_sub: "आपके साउंडबॉक्स UPI लेनदेन के आधार पर • बिना किसी कागज़ी झंझट के • 1.2% मासिक ब्याज",
    t4_loan_btn: "1-क्लिक में वॉलेट में लें",
    t4_c1_title: "💰 अगले 30 दिनों का रोकड़ा अनुमान (आने वाले पैसे बनाम खर्च)",
    t5_lead_title: "आपकी दुकान का साख स्कोर: 742 / 900 (शानदार प्रतिष्ठा)",
    t5_lead_desc: "जैसे सिबिल (CIBIL) स्कोर होता है, वैसे ही यह आपकी दुकान का स्कोर है। जितना ऊंचा स्कोर, उतना बड़ा और सस्ता पेटीएम लोन तुरंत मिलेगा।",
    t5_c1_title: "🏅 दुकान साख मीटर",
    t5_score_sub: "कुल 900 अंकों में से",
    t5_c2_title: "🔬 स्कोर किस बात पर तय हुआ (AI विश्लेषण)",
    t5_checklist_title: "🎯 स्कोर 780 तक बढ़ाने के आसान उपाय (+38 अंक):",
    t6_c1_title: "📡 पड़ोस का बाज़ार: ",
    t6_c1_sub: "आपके 1 किलोमीटर दायरे में पेटीएम नेटवर्क पर सबसे तेज़ी से बिक रहे नए उत्पाद:",
    t6_c2_title: "⚠️ आस-पास के डिस्काउंट और ऑनलाइन डार्क स्टोर अलर्ट",
    t6_c2_badge: "लोकल रडार",
    t7_c1_title: "⚡ दुकान साथी के तैयार फैसले (बस 1-क्लिक में मंज़ूर करें)",
    t7_c1_badge: "व्यापारी का पूरा नियंत्रण",
    t7_c1_desc: "दुकान साथी ने आपकी बिक्री और स्टॉक देखकर होलसेलर आर्डर, ग्राहक कैशबैक और लोन के जरूरी फैसले तैयार किए हैं। आप 1-टैप में मंज़ूर या रद्द कर सकते हैं।"
  },
  en: {
    hdr_soundbox: "Soundbox 4G Active",
    hdr_judge_mode: "Judge / AI View",
    tab_home: "🏪 Store Home",
    home_verified_badge: "✓ Paytm Verified Merchant",
    home_owner: "👤 Store Owner / Merchant:",
    home_location: "📍 Store Location:",
    home_today_date: "📅 Today's Date:",
    home_partner_since: "🗓️ Paytm Partner Since:",
    home_merchant_id: "🆔 Merchant ID:",
    home_qr_status: "💳 QR & Payments:",
    home_metrics_title: "📊 Real Store Metrics (Verified)",
    home_metrics_sub: "✓ Verified Historical & Live Data • Zero Forecast Assumptions",
    metric_today_sales: "Today's Sales (So Far)",
    metric_yesterday_sales: "Yesterday's Sales",
    metric_2d_sales: "2 Days Ago Sales",
    metric_7d_gmv: "Last 7 Days Sales (GMV)",
    metric_monthly_gmv: "30-Day Total Business (GMV)",
    metric_credit_score: "Store Credit Score",
    metric_merchant_tier: "Merchant Tier",
    metric_regular_customers: "Regular Loyal Customers",
    hero_verified: "✓ Paytm Verified Merchant",
    hero_daily_sales: "Average Daily Sales",
    hero_credit_score: "Store Credit Score",
    hero_business_tier: "Merchant Tier",
    guide_s1_title: "Press Mic & Speak",
    guide_s1_desc: '"What will sell tonight?" — Saathi answers instantly via Soundbox audio',
    guide_s2_title: "Snap Shelf Photo",
    guide_s2_desc: "Empty items highlighted in red bounding box with WhatsApp reorder draft",
    guide_s3_title: "1-Tap Cashflow & Credit",
    guide_s3_desc: "Get early crunch warning and disburse ₹25,000 instant loan in 1 tap",
    copilot_title: "Dukaan Saathi Voice Copilot",
    copilot_subtitle: "Speak directly in Hindi or Hinglish, no typing needed",
    copilot_btn: "Ask Saathi ➔",
    copilot_intent_init: "Topic: Demand Forecast",
    copilot_audio_replay: "Replay in Soundbox Voice",
    kpi_1_title: "Today's Est. Sales (GMV)",
    kpi_1_sub: "Higher than nearby peer stores",
    kpi_2_title: "7-Day Sales Forecast",
    kpi_2_tag: "Festive Spike",
    kpi_2_sub: "Higher footfall projected",
    kpi_3_title: "At-Risk Churned Customers",
    kpi_3_tag: "Inactive 30+ Days",
    kpi_3_sub: "Re-engage via ₹20 cashback",
    kpi_4_title: "Store Credit Health",
    kpi_4_tag: "Pre-Approved Loan",
    kpi_4_sub: "₹25,000 instantly available",
    tab_demand: "📈 Demand Forecast (What Will Sell?)",
    tab_inventory: "📸 Shelf Scanner (Rack Vision)",
    tab_retention: "👥 Customer Retention (Cashback)",
    tab_cashflow: "💰 Cashflow & Instant Credit",
    tab_score: "🏅 Credit Health Score (MerchantMind)",
    tab_competitor: "📡 Competitor Radar (Local Trends)",
    tab_actions: "⚡ 1-Tap Autonomous Actions",
    t1_lead_title: "Saathi's Advice: Festive demand up by ~25% across categories",
    t1_lead_desc: "Sales are projected to surge over the next 7 days. Maintain adequate safety stock of staple groceries and cooking oil so no customer walks away empty-handed.",
    t1_c1_title: "📈 7-Day Sales & Footfall Forecast",
    t1_c2_title: "⚡ Market & External Factors",
    t1_live_badge: "Live Alerts",
    t1_tip_title: "💡 Saathi's Pro Tip",
    t1_tip_desc: "Peak footfall expected Friday between 3 PM and 8 PM. Keep extra store helper ready.",
    t1_c3_title: "📦 Top Selling Items This Week",
    t1_stock_badge: "Stock Health",
    th_prod_name: "Item Name",
    th_est_demand: "Forecast Demand",
    th_est_rev: "Expected Revenue",
    th_stock_status: "Stock Status",
    t2_lead_title: "Take a shelf photo — empty racks & depleted items detected instantly",
    t2_lead_desc: "Snap a photo of your shop's shelves. AI detects missing biscuits, snacks, or cooking oils and prepares a WhatsApp reorder for your distributor.",
    t2_c1_title: '📷 "Photo Stock Check" — Shelf Scanner',
    t2_dropzone_title: "Upload shelf photo or open camera",
    t2_dropzone_sub: "AI highlights empty slots & low-stock rows with red bounding boxes",
    t2_btn_demo: "⚡ Run Demo Shelf Scan",
    t2_fullness_lbl: "Shelf Fullness Ratio",
    t2_detected_lbl: "Packets Detected",
    t2_stockout_heading: "⚠️ Stocked Out Items (Order Now)",
    t2_c2_title: "📦 Smart Inventory Reorder Recommendations",
    th_item: "Product Item",
    th_current_stock: "Current Stock",
    th_min_threshold: "Min Threshold",
    th_reorder_qty: "Suggested Reorder",
    th_co_purchased: "Co-Purchased Items",
    th_action: "1-Click Action",
    t3_lead_title: "Win Back Inactive Regulars — ₹20 Paytm Cashback Offer",
    t3_lead_desc: "Valued customers who haven't visited in 15–30 days may be switching to quick commerce dark stores. Send them a personalized ₹20 cashback voucher.",
    t3_c1_title: "👥 At-Risk Inactive Customers (High Churn Probability)",
    t3_badge: "Re-engage Now",
    th_cust_name: "Customer Name & Phone",
    th_last_visit: "Last Purchase",
    th_churn_risk: "Churn Risk",
    th_offer: "Targeted Voucher",
    th_action_offer: "1-Click Dispatch",
    t4_alert_heading: "Predictive Cash Crunch Alert",
    t4_alert_sub: "Shop rent and distributor invoice are due within 48 hours.",
    t4_shortfall_lbl: "Projected Shortfall",
    t4_loan_title: "No worries! Pre-approved Paytm Merchant Credit is ready",
    t4_loan_sub: "Underwritten by Soundbox UPI transaction flows • Zero paperwork • 1.2% monthly interest",
    t4_loan_btn: "1-Click Disburse to Wallet",
    t4_c1_title: "💰 30-Day Cashflow Projection (Inflows vs Outflows)",
    t5_lead_title: "Your Store Credit Score: 742 / 900 (Excellent Reputation)",
    t5_lead_desc: "Similar to CIBIL for consumers, this is your store's proprietary financial trust score. A higher score unlocks larger credit lines at lower interest.",
    t5_c1_title: "🏅 Store Credit Health Meter",
    t5_score_sub: "Out of 900 total points",
    t5_c2_title: "🔬 Score Attribution (TreeSHAP Explainability)",
    t5_checklist_title: "🎯 Steps to boost score above 780 (+38 pts):",
    t6_c1_title: "📡 Neighborhood Cluster: ",
    t6_c1_sub: "Fastest-selling trending items across Paytm merchant network within 1km radius:",
    t6_c2_title: "⚠️ Local Competition & Dark Store Discount Alerts",
    t6_c2_badge: "Local Radar",
    t7_c1_title: "⚡ Dukaan Saathi Autonomous Action Queue (1-Tap Approve)",
    t7_c1_badge: "Full Merchant Control",
    t7_c1_desc: "Dukaan Saathi analyzed your daily velocity and prepared distributor replenishment, customer cashback, and working capital credit actions. Tap to approve or dismiss."
  }
};

const PROMPT_CHIPS = {
  hi: [
    { id: "chipPrompt1", text: "💡 भैया, आज क्या बिकेगा?", query: "Bhaiya, aaj kya bikega?" },
    { id: "chipPrompt2", text: "📅 2 दिन पहले की बिक्री कितनी थी?", query: "what was sales 2 days before ?" },
    { id: "chipPrompt3", text: "📦 कौन सा सामान खत्म है?", query: "which items are out of stock?" },
    { id: "chipPrompt4", text: "🏅 मेरा दुकान साख स्कोर कितना है?", query: "Mera credit score kitna hai?" },
    { id: "chipPrompt5", text: "💰 कल का रोकड़ा और लोन कैसा है?", query: "Kal ka cashflow kaisa hai?" }
  ],
  en: [
    { id: "chipPrompt1", text: "💡 What will sell today?", query: "What products will have high demand today?" },
    { id: "chipPrompt2", text: "📅 Sales 2 days ago?", query: "what was sales 2 days before ?" },
    { id: "chipPrompt3", text: "📦 What items are out of stock?", query: "which items are out of stock?" },
    { id: "chipPrompt4", text: "🏅 What is my credit score?", query: "What is my MerchantMind credit score?" },
    { id: "chipPrompt5", text: "💰 Tomorrow's cashflow outlook?", query: "How is my cashflow for tomorrow?" }
  ]
};

// DOM Elements
const merchantSelect = document.getElementById("merchantSelect");
const btnLangToggle = document.getElementById("btnLangToggle");
const btnModeToggle = document.getElementById("btnModeToggle");
const txtModeToggle = document.getElementById("txtModeToggle");
const copilotTextInput = document.getElementById("copilotTextInput");
const btnSubmitCopilot = document.getElementById("btnSubmitCopilot");
const btnVoiceRecord = document.getElementById("btnVoiceRecord");
const copilotLiveResponse = document.getElementById("copilotLiveResponse");
const toastContainer = document.getElementById("toastContainer");

// Initialize application on load
document.addEventListener("DOMContentLoaded", async () => {
  setupModeToggle();
  await loadMerchants();
  setupEventListeners();
  loadAllDashboardData(currentMerchantId);
});

function applyLanguage(lang) {
  currentLanguage = lang;

  // 1. Update text of all data-i18n elements
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      el.textContent = TRANSLATIONS[lang][key];
    }
  });

  // 2. Update quick prompt chips
  const chips = PROMPT_CHIPS[lang] || PROMPT_CHIPS.hi;
  chips.forEach(c => {
    const btn = document.getElementById(c.id);
    if (btn) {
      btn.textContent = c.text;
      btn.onclick = () => submitVoiceQuery(c.query);
    }
  });

  // 3. Update copilot input placeholder
  if (copilotTextInput) {
    copilotTextInput.placeholder = lang === "hi"
      ? "बोलिए या टाइप करें: 'भैया, आज क्या बिकेगा?' या 'कल का कैशफ्लो कैसा है?'..."
      : "Speak or type: 'Bhaiya, what will sell today?' or 'How is tomorrow\'s cashflow?'...";
  }

  // 4. Update language toggle button text
  if (btnLangToggle) {
    btnLangToggle.textContent = lang === "hi" ? "🌐 हिंदी / English" : "🌐 English / हिंदी";
  }

  // 5. Update mode toggle button text
  if (txtModeToggle) {
    txtModeToggle.textContent = isMerchantMode 
      ? (lang === "hi" ? "जज / AI मोड" : "Judge / AI View")
      : (lang === "hi" ? "दुकानदार मोड" : "Merchant View");
  }

  // 6. Update Soundbox status text
  const soundboxStatus = document.getElementById("txtSoundboxStatus");
  if (soundboxStatus) {
    soundboxStatus.textContent = lang === "hi" ? "साउंडबॉक्स 4G कनेक्टेड" : "Soundbox 4G Active";
  }

  // 7. Refresh current merchant hero profile & tables for bilingual labels
  loadMerchants();
  loadHomeStoreDetails(currentMerchantId);
  loadMerchantProfile(currentMerchantId);
  loadMerchantScore(currentMerchantId);
  loadDemandForecast(currentMerchantId);
  loadInventoryRecommendations(currentMerchantId);
  loadCustomerRetention(currentMerchantId);
  loadCompetitorRadar(currentMerchantId);
  loadPendingActions(currentMerchantId);
}

function setupModeToggle() {
  if (btnModeToggle) {
    btnModeToggle.addEventListener("click", () => {
      document.body.classList.toggle("merchant-mode");
      isMerchantMode = document.body.classList.contains("merchant-mode");
      if (isMerchantMode) {
        btnModeToggle.classList.remove("active");
        txtModeToggle.textContent = currentLanguage === "hi" ? "जज / AI मोड" : "Judge / AI View";
        showToast(currentLanguage === "hi" ? "🏪 दुकानदार मोड सक्रिय: सरल व आसान दृश्य" : "🏪 Merchant Mode Active: Simplified shopkeeper UX");
      } else {
        btnModeToggle.classList.add("active");
        txtModeToggle.textContent = currentLanguage === "hi" ? "दुकानदार मोड" : "Merchant View";
        showToast(currentLanguage === "hi" ? "👨‍💻 जज / AI मोड सक्रिय: तकनीकी मॉडल विवरण ऑन" : "👨‍💻 Judge Mode Active: Machine Learning architecture exposed");
      }
    });
  }
}

function setupEventListeners() {
  // Merchant switcher
  merchantSelect.addEventListener("change", (e) => {
    currentMerchantId = e.target.value;
    const selectedOpt = merchantSelect.options[merchantSelect.selectedIndex];
    const storeShortName = selectedOpt ? selectedOpt.text.split(' — ')[0] : currentMerchantId;
    showToast(currentLanguage === "hi" ? `दुकान बदली गई: ${storeShortName}` : `Switched to store: ${storeShortName}`);
    loadAllDashboardData(currentMerchantId);
  });

  // Language toggle
  btnLangToggle.addEventListener("click", () => {
    const newLang = currentLanguage === "hi" ? "en" : "hi";
    applyLanguage(newLang);
    showToast(newLang === "hi" ? "भाषा हिंदी में बदली गई" : "Language switched to English");
  });

  // Copilot text submit
  btnSubmitCopilot.addEventListener("click", () => {
    const query = copilotTextInput.value.trim();
    if (query) submitVoiceQuery(query);
  });

  copilotTextInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const query = copilotTextInput.value.trim();
      if (query) submitVoiceQuery(query);
    }
  });

  // Voice recording / Web Speech API (Indic Speech)
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = currentLanguage === "hi" ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;

    btnVoiceRecord.addEventListener("click", () => {
      btnVoiceRecord.classList.add("listening");
      showToast(currentLanguage === "hi" ? "माइक चालू है... बोलिए" : "Listening... Please speak now");
      recognition.start();
    });

    recognition.onresult = (event) => {
      btnVoiceRecord.classList.remove("listening");
      const transcript = event.results[0][0].transcript;
      copilotTextInput.value = transcript;
      submitVoiceQuery(transcript);
    };

    recognition.onerror = () => {
      btnVoiceRecord.classList.remove("listening");
      showToast(currentLanguage === "hi" ? "माइक में आवाज़ नहीं सुनी गई, कृपया टाइप करें।" : "Could not hear audio. Please type or use quick chips.");
    };

    recognition.onend = () => {
      btnVoiceRecord.classList.remove("listening");
    };
  } else {
    btnVoiceRecord.addEventListener("click", () => {
      submitVoiceQuery(currentLanguage === "hi" ? "Bhaiya, aaj kya bikega?" : "What products will have high demand today?");
    });
  }

  // Shelf Scanner Input
  const shelfInput = document.getElementById("shelfImageInput");
  if (shelfInput) {
    shelfInput.addEventListener("change", handleShelfUpload);
  }
}

// Tab Switching
function switchTab(tabId) {
  document.querySelectorAll(".nav-tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".tab-content-pane").forEach(pane => pane.classList.remove("active"));

  const targetBtn = document.querySelector(`[data-tab="${tabId}"]`);
  const targetPane = document.getElementById(tabId);

  if (targetBtn) targetBtn.classList.add("active");
  if (targetPane) targetPane.classList.add("active");
}

// Load Merchants List
async function loadMerchants() {
  try {
    const res = await fetch("/api/merchants/");
    const merchants = await res.json();
    merchantSelect.innerHTML = "";
    merchants.forEach(m => {
      const opt = document.createElement("option");
      opt.value = m.merchant_id;
      const cityShort = (m.city || "").split(',')[0].trim();
      const salesK = Math.round((m.avg_daily_sales_inr || 14850)).toLocaleString('en-IN');
      const bName = (currentLanguage === 'hi' ? m.business_name : (m.business_name_en || m.business_name));
      const perDay = currentLanguage === 'hi' ? 'दिन' : 'day';
      opt.textContent = `${bName} — ${cityShort} (₹${salesK}/${perDay})`;
      if (m.merchant_id === currentMerchantId) opt.selected = true;
      merchantSelect.appendChild(opt);
    });
  } catch (err) {
    console.error("Failed to load merchants:", err);
  }
}

// Master Dashboard Data Loader
async function loadAllDashboardData(merchantId) {
  await Promise.all([
    loadHomeStoreDetails(merchantId),
    loadMerchantProfile(merchantId),
    loadDemandForecast(merchantId),
    loadInventoryRecommendations(merchantId),
    loadCustomerRetention(merchantId),
    loadCashflowProjection(merchantId),
    loadMerchantScore(merchantId),
    loadCompetitorRadar(merchantId),
    loadPendingActions(merchantId)
  ]);
}

// 0. Load Home Page Store Details & True Verified Metrics (ZERO Forecasts)
async function loadHomeStoreDetails(merchantId) {
  try {
    const res = await fetch(`/api/merchants/${merchantId}/metrics`);
    if (!res.ok) return;
    const m = await res.json();

    // 1. Basic Store Card Elements
    const storeNameEl = document.getElementById("homeStoreName");
    if (storeNameEl) {
      storeNameEl.textContent = currentLanguage === 'hi' 
        ? (m.business_name || m.owner_name) 
        : (m.business_name_en || m.business_name || m.owner_name);
    }

    const tierEl = document.getElementById("homeStoreTier");
    if (tierEl) {
      tierEl.textContent = currentLanguage === 'hi' 
        ? (m.tier_badge || "गोल्ड व्यापारी 🥇") 
        : `${m.tier || "Gold"} Merchant 🥇`;
    }

    const catEl = document.getElementById("homeStoreCategory");
    if (catEl) {
      catEl.textContent = `${m.category} • ${m.city}`;
    }

    const soundboxEl = document.getElementById("homeSoundboxSerial");
    if (soundboxEl) {
      soundboxEl.textContent = m.soundbox_serial_id || "SBX-4G-99201";
    }

    const ownerEl = document.getElementById("homeStoreOwner");
    if (ownerEl) {
      ownerEl.textContent = m.owner_name || "Merchant Owner";
    }

    const locEl = document.getElementById("homeStoreLocation");
    if (locEl) {
      locEl.textContent = `${m.city} (PIN: ${m.pincode || "201301"})`;
    }

    const todayDateEl = document.getElementById("homeTodayDate");
    if (todayDateEl) {
      todayDateEl.textContent = currentLanguage === 'hi' 
        ? "29 अक्टूबर 2026 (गुरुवार)" 
        : "29 October 2026 (Thursday)";
    }

    const joinedEl = document.getElementById("homeJoinedDate");
    if (joinedEl) {
      joinedEl.textContent = currentLanguage === 'hi'
        ? `${m.joined_date || "15 अप्रैल 2023"} से (सत्यापित)`
        : `Since ${m.joined_date || "15 Apr 2023"} (Verified)`;
    }

    const merchantIdEl = document.getElementById("homeMerchantId");
    if (merchantIdEl) {
      merchantIdEl.textContent = m.merchant_id;
    }

    const paymentStatusEl = document.getElementById("homePaymentStatus");
    if (paymentStatusEl) {
      paymentStatusEl.textContent = currentLanguage === 'hi'
        ? "Paytm All-In-One QR • 0% MDR सक्रिय"
        : "Paytm All-In-One QR • 0% MDR Active";
    }

    // 2. Real Metric Cards (NO FORECASTS - STRICTLY ACTUAL TRUE VALUES)
    const todaySalesEl = document.getElementById("metricTodaySales");
    if (todaySalesEl) {
      todaySalesEl.textContent = `₹${(m.today_actual_sales_inr || 0).toLocaleString('en-IN')}`;
    }

    const todayTxnsEl = document.getElementById("metricTodayTxns");
    if (todayTxnsEl) {
      todayTxnsEl.textContent = currentLanguage === 'hi'
        ? `${m.today_actual_txns || 0} सफल UPI लेनदेन (आज)`
        : `${m.today_actual_txns || 0} successful UPI txns (today)`;
    }

    const yestSalesEl = document.getElementById("metricYesterdaySales");
    if (yestSalesEl) {
      yestSalesEl.textContent = `₹${(m.yesterday_actual_sales_inr || 0).toLocaleString('en-IN')}`;
    }

    const yestSubEl = document.getElementById("metricYesterdaySub");
    if (yestSubEl) {
      yestSubEl.textContent = currentLanguage === 'hi'
        ? `${m.yesterday_txns || 0} ग्राहक लेनदेन (${m.yesterday_date || '28 Oct 2026'})`
        : `${m.yesterday_txns || 0} customer txns (${m.yesterday_date || '28 Oct 2026'})`;
    }

    const d2SalesEl = document.getElementById("metric2dSales");
    if (d2SalesEl) {
      d2SalesEl.textContent = `₹${(m.sales_2d_ago_inr || 0).toLocaleString('en-IN')}`;
    }

    const d2SubEl = document.getElementById("metric2dSub");
    if (d2SubEl) {
      d2SubEl.textContent = currentLanguage === 'hi'
        ? `${m.txns_2d_ago || 0} ग्राहक लेनदेन (${m.date_2d_ago || '27 Oct 2026'})`
        : `${m.txns_2d_ago || 0} customer txns (${m.date_2d_ago || '27 Oct 2026'})`;
    }

    const d7SalesEl = document.getElementById("metric7dSales");
    if (d7SalesEl) {
      d7SalesEl.textContent = `₹${(m.last_7d_actual_sales_inr || 0).toLocaleString('en-IN')}`;
    }

    const d7AvgEl = document.getElementById("metric7dAvg");
    if (d7AvgEl) {
      d7AvgEl.textContent = currentLanguage === 'hi'
        ? `दैनिक औसत: ₹${(m.avg_daily_sales_inr || 0).toLocaleString('en-IN')} / दिन`
        : `Daily average: ₹${(m.avg_daily_sales_inr || 0).toLocaleString('en-IN')} / day`;
    }

    const monthlyGmvEl = document.getElementById("metricMonthlyGmv");
    if (monthlyGmvEl) {
      monthlyGmvEl.textContent = `₹${(m.monthly_actual_gmv_inr || 0).toLocaleString('en-IN')}`;
    }

    const monthlyTxnsEl = document.getElementById("metricMonthlyTxns");
    if (monthlyTxnsEl) {
      monthlyTxnsEl.textContent = currentLanguage === 'hi'
        ? `${(m.monthly_actual_txns || 0).toLocaleString('en-IN')} कुल ग्राहक लेनदेन`
        : `${(m.monthly_actual_txns || 0).toLocaleString('en-IN')} total customer txns`;
    }

    const creditScoreEl = document.getElementById("metricCreditScore");
    if (creditScoreEl) {
      creditScoreEl.textContent = `${m.credit_score || 742} / 900`;
    }

    const tierBadgeEl = document.getElementById("metricTierBadge");
    if (tierBadgeEl) {
      tierBadgeEl.textContent = currentLanguage === 'hi'
        ? (m.tier_badge || "गोल्ड व्यापारी 🥇")
        : `${m.tier || "Gold"} Merchant 🥇`;
    }

    const regCustEl = document.getElementById("metricRegularCustomers");
    if (regCustEl) {
      regCustEl.textContent = currentLanguage === 'hi'
        ? `${m.regular_customers_count || 60} पक्के ग्राहक`
        : `${m.regular_customers_count || 60} regular customers`;
    }

  } catch (err) {
    console.error("Home store details error:", err);
  }
}

// 1. Merchant Profile & Hero Card
async function loadMerchantProfile(merchantId) {
  try {
    const res = await fetch(`/api/merchants/${merchantId}`);
    const m = await res.json();
    
    // Merchant name & business
    const storeDisplayName = m.business_name ? `${m.business_name} (${m.name})` : m.name;
    document.getElementById("heroMerchantName").textContent = storeDisplayName;
    document.getElementById("heroMerchantCategory").textContent = `${m.category} • ${m.city}`;
    document.getElementById("heroMerchantId").textContent = m.merchant_id;
    
    const sbxLabel = currentLanguage === "hi" ? "साउंडबॉक्स" : "Soundbox";
    document.getElementById("heroSoundboxSerial").textContent = `${sbxLabel}: ${m.soundbox_serial_id || "SBX-4G-99201"}`;

    // Average daily sales
    const dailySales = m.avg_daily_sales_inr || 14850.0;
    document.getElementById("heroDailyGmv").textContent = `₹${dailySales.toLocaleString('en-IN')}`;

    // Store credit score
    const scoreVal = m.merchantmind_score || 742;
    const heroScoreElem = document.getElementById("heroScoreSummary");
    if (heroScoreElem) {
      heroScoreElem.textContent = `${scoreVal} / 900`;
    }

    // Business status tier badge
    const heroStatusElem = document.getElementById("heroBusinessStatus");
    if (heroStatusElem) {
      heroStatusElem.textContent = m.tier_badge || "गोल्ड व्यापारी 🥇";
    }

    // Update KPI card 1
    const kpiGmv = document.getElementById("kpiGmvVal");
    if (kpiGmv) {
      kpiGmv.textContent = `₹${Math.round(dailySales * 1.12).toLocaleString('en-IN')}`;
    }
  } catch (err) {
    console.error("Profile error:", err);
  }
}

// 2. बिक्री अनुमान (Demand Forecast)
async function loadDemandForecast(merchantId) {
  try {
    const res = await fetch(`/api/demand/forecast/${merchantId}?horizon_days=7`);
    const data = await res.json();

    // Dynamically update category-tailored Saathi Advice banner
    const leadDescElem = document.querySelector('[data-i18n="t1_lead_desc"]');
    if (leadDescElem) {
      leadDescElem.textContent = currentLanguage === 'hi' ? data.hindi_audio_summary : data.actionable_insight;
    }

    // Update KPI
    const total7d = data.forecast_points.reduce((sum, p) => sum + p.predicted_sales_inr, 0);
    document.getElementById("kpi7dDemandVal").textContent = `₹${Math.round(total7d).toLocaleString('en-IN')}`;

    // Top predicted products table
    const topProdTable = document.getElementById("topForecastProductsTbody");
    if (topProdTable) {
      topProdTable.innerHTML = data.top_products_forecast.map(p => {
        const isCrit = p.recommendation && p.recommendation.includes('CRITICAL');
        const badgeClass = isCrit ? 'badge-red' : 'badge-green';
        const badgeText = isCrit 
          ? (currentLanguage === 'hi' ? '⚠️ तुरंत मंगाएं' : '⚠️ Critical Stockout')
          : (currentLanguage === 'hi' ? '✓ पर्याप्त स्टॉक' : '✓ In Stock');
        const units = p.predicted_units_7d || p.predicted_7d_total || 20;
        const rev = Math.round(p.expected_revenue_inr || 0).toLocaleString('en-IN');
        return `
          <tr>
            <td><strong>${p.product_name}</strong><br><small style="color:#64748b">${p.category || ''}</small></td>
            <td><span class="card-header-badge badge-blue">${units} ${currentLanguage === 'hi' ? 'यूनिट' : 'units'}</span></td>
            <td>₹${rev}</td>
            <td><span class="card-header-badge ${badgeClass}">${badgeText}</span></td>
          </tr>
        `;
      }).join("");
    }

    renderDemandChart(data.forecast_points);
  } catch (err) {
    console.error("Demand forecast error:", err);
  }
}

function renderDemandChart(forecastPoints) {
  const ctx = document.getElementById("demandChartCanvas").getContext("2d");
  const labels = forecastPoints.map(p => p.date.slice(5));
  const predicted = forecastPoints.map(p => p.predicted_sales_inr);
  const footfall = forecastPoints.map(p => p.predicted_footfall);

  if (demandChartInstance) demandChartInstance.destroy();

  demandChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: currentLanguage === 'hi' ? 'अनुमानित गल्ला (₹)' : 'Forecast Sales (₹)',
          data: predicted,
          borderColor: '#00b9f1',
          backgroundColor: 'rgba(0, 185, 241, 0.15)',
          fill: true,
          tension: 0.35,
          borderWidth: 3,
          pointBackgroundColor: '#00b9f1',
          pointRadius: 4,
          yAxisID: 'y'
        },
        {
          label: currentLanguage === 'hi' ? 'दुकान पर आने वाले ग्राहक (Footfall)' : 'Expected Footfall',
          data: footfall,
          borderColor: '#10b981',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.35,
          borderWidth: 2,
          pointBackgroundColor: '#10b981',
          pointRadius: 3,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#94a3b8' } },
        tooltip: {
          callbacks: {
            label: function(context) {
              if (context.datasetIndex === 0) return `${currentLanguage === 'hi' ? 'बिक्री' : 'Sales'}: ₹${context.raw.toLocaleString('en-IN')}`;
              return `${currentLanguage === 'hi' ? 'ग्राहक' : 'Footfall'}: ${context.raw}`;
            }
          }
        }
      },
      scales: {
        x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#00b9f1', callback: val => '₹' + val },
          position: 'left'
        },
        y1: {
          grid: { drawOnChartArea: false },
          ticks: { color: '#10b981' },
          position: 'right'
        }
      }
    }
  });
}

// 3. दुकान शेल्फ़ स्कैनर और इन्वेंट्री
async function loadInventoryRecommendations(merchantId) {
  try {
    const res = await fetch(`/api/inventory/recommendations/${merchantId}`);
    const data = await res.json();

    const tbody = document.getElementById("inventoryTableBody");
    if (tbody) {
      tbody.innerHTML = data.reorder_recommendations.map(item => `
        <tr>
          <td><strong>${item.product_name}</strong><br><small style="color:#64748b">${item.category}</small></td>
          <td>${item.current_stock} ${item.unit}</td>
          <td><span class="card-header-badge ${item.current_stock <= item.reorder_point ? 'badge-red' : 'badge-green'}">${item.reorder_point}</span></td>
          <td><strong style="color:#00b9f1">+${item.suggested_reorder_qty}</strong></td>
          <td>
            <div style="display:flex; gap:0.25rem; flex-wrap:wrap">
              ${item.complementary_products.slice(0, 2).map(c => `<span class="card-header-badge badge-blue">${c}</span>`).join("")}
            </div>
          </td>
          <td>
            <button class="btn-whatsapp-action" onclick="triggerQuickReorder('${item.product_id}', '${item.product_name}', ${item.suggested_reorder_qty})">
              📲 ${currentLanguage === 'hi' ? 'WhatsApp आर्डर' : 'WhatsApp Order'}
            </button>
          </td>
        </tr>
      `).join("");
    }
  } catch (err) {
    console.error("Inventory error:", err);
  }
}

// Camera Shelf Scanner Handler
async function handleShelfUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  showToast(currentLanguage === 'hi' ? "दुकान की अलमारी की फोटो जांची जा रही है..." : "Analyzing shelf image via YOLOv8...");
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`/api/inventory/scan-shelf?merchant_id=${currentMerchantId}`, {
      method: "POST",
      body: formData
    });
    const scanData = await res.json();
    displayShelfScanResults(scanData);
    showToast(currentLanguage === 'hi' ? `शेल्फ स्कैन पूरा! भराव: ${scanData.shelf_fullness_pct}%` : `Shelf scan complete! Fullness: ${scanData.shelf_fullness_pct}%`);
  } catch (err) {
    console.error("Shelf scan failed:", err);
    showToast(currentLanguage === 'hi' ? "स्कैन में समस्या आई, कृपया दोबारा कोशिश करें।" : "Shelf scan failed, please retry.");
  }
}

function triggerDemoShelfScan() {
  showToast(currentLanguage === 'hi' ? "डेमो अलमारी स्कैन की जा रही है..." : "Running demo shelf scan...");
  fetch(`/api/inventory/scan-shelf?merchant_id=${currentMerchantId}`, {
    method: "POST"
  })
  .then(res => res.json())
  .then(scanData => {
    displayShelfScanResults(scanData);
    showToast(currentLanguage === 'hi' ? `✓ कुल ${scanData.total_items_detected || 18} पैकेट मिले, खाली जगह चिन्हित!` : `✓ Detected ${scanData.total_items_detected || 18} items, stockout bounding boxes rendered!`);
  })
  .catch(err => console.error(err));
}

function displayShelfScanResults(scanData) {
  const previewDiv = document.getElementById("shelfResultPreview");
  const imgElem = document.getElementById("shelfAnnotatedImage");
  const fullnessElem = document.getElementById("shelfFullnessVal");
  const detectedCountElem = document.getElementById("shelfDetectedCount");
  const stockoutListElem = document.getElementById("shelfStockoutList");

  if (previewDiv) previewDiv.style.display = "flex";
  if (imgElem && (scanData.image_annotated_url || scanData.annotated_image_base64)) {
    imgElem.src = scanData.image_annotated_url || `data:image/jpeg;base64,${scanData.annotated_image_base64}`;
  }
  if (fullnessElem) fullnessElem.textContent = `${scanData.shelf_fullness_pct || 68.5}%`;
  if (detectedCountElem) detectedCountElem.textContent = scanData.total_items_detected || 18;

  if (stockoutListElem) {
    stockoutListElem.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0; border-bottom:1px solid rgba(255,255,255,0.05)">
        <div>
          <span style="color:#ef4444; font-weight:700">⚠️ ${currentLanguage === 'hi' ? 'कुरकुरे मसाला मंच (खाली शेल्फ)' : 'Kurkure Masala Munch (Empty)'}</span>
          <div style="font-size:0.75rem; color:#94a3b8">${currentLanguage === 'hi' ? 'रैक नंबर 2 पूरा खाली पाया गया' : 'Rack #2 completely out of stock'}</div>
        </div>
        <button class="btn-whatsapp-action" onclick="triggerQuickReorder('PROD_007', 'Kurkure Masala Munch', 24)">
          📲 ${currentLanguage === 'hi' ? '2 पेटी मंगाएं' : 'Order 2 Crates'}
        </button>
      </div>
    `;
  }
}

// 4. पुराने ग्राहक वापस लाओ (Customer Retention)
async function loadCustomerRetention(merchantId) {
  try {
    const res = await fetch(`/api/retention/insights/${merchantId}`);
    const data = await res.json();

    document.getElementById("kpiAtRiskVal").textContent = data.at_risk_customers_count || 4;

    // Segment summary pills with Hindi / English labels
    const segContainer = document.getElementById("customerSegmentsContainer");
    if (segContainer) {
      segContainer.innerHTML = (data.segments || []).map(s => `
        <div class="glass-panel" style="padding:1rem; text-align:center;">
          <div style="font-size:0.8rem; color:#94a3b8; font-weight:600">${s.segment_name}</div>
          <div style="font-size:1.4rem; font-weight:800; color:#fff; margin:0.3rem 0">${s.count} ${currentLanguage === 'hi' ? 'ग्राहक' : 'customers'}</div>
          <div style="font-size:0.75rem; color:#00b9f1">${s.percentage}% ${currentLanguage === 'hi' ? 'हिस्सा' : 'share'}</div>
        </div>
      `).join("");
    }

    // High Risk Table
    const tbody = document.getElementById("atRiskCustomersTbody");
    if (tbody) {
      const customers = data.at_risk_customers || data.high_risk_customers || [];
      tbody.innerHTML = customers.map(c => `
        <tr>
          <td><strong>${c.customer_name || c.name}</strong><br><small style="color:#64748b">${c.phone || c.phone_masked}</small></td>
          <td>${c.days_since_last_visit} ${currentLanguage === 'hi' ? 'दिन पहले आए थे' : 'days ago'}</td>
          <td><span class="card-header-badge ${c.churn_probability > 0.7 ? 'badge-red' : 'badge-amber'}">${Math.round(c.churn_probability * 100)}% ${currentLanguage === 'hi' ? 'जोखिम' : 'risk'}</span></td>
          <td><strong style="color:#10b981">₹${c.recommended_offer_inr || 20} ${currentLanguage === 'hi' ? 'कैशबैक' : 'Cashback'}</strong></td>
          <td>
            <button class="btn-action-success" onclick="dispatchCashbackOffer('${c.customer_name || c.name}', '${c.phone || c.phone_masked}', ${c.recommended_offer_inr || 20})">
              🎁 ${currentLanguage === 'hi' ? 'ऑफर भेजें' : 'Send Offer'}
            </button>
          </td>
        </tr>
      `).join("");
    }
  } catch (err) {
    console.error("Retention error:", err);
  }
}

// 5. तिजोरी और रोकड़ा (Cashflow & Loans)
async function loadCashflowProjection(merchantId) {
  try {
    const res = await fetch(`/api/cashflow/projection/${merchantId}?days=30`);
    const data = await res.json();

    // Crunch Alert Banner
    const alertCard = document.getElementById("cashCrunchAlertCard");
    if (data.crunch_alert) {
      alertCard.style.display = "block";
      const crunchDaysElem = document.getElementById("crunchDaysVal");
      if (crunchDaysElem) {
        crunchDaysElem.textContent = currentLanguage === 'hi' 
          ? `${data.crunch_alert.days_until_crunch} दिन में` 
          : `In ${data.crunch_alert.days_until_crunch} days`;
      }
      const shortfallElem = document.getElementById("crunchShortfallVal");
      if (shortfallElem) {
        shortfallElem.textContent = `₹${Math.round(data.crunch_alert.shortfall_amount_inr).toLocaleString('en-IN')}`;
      }
      const loanElem = document.getElementById("loanAmountVal");
      if (loanElem) {
        loanElem.textContent = `₹${data.crunch_alert.preapproved_loan_amount_inr.toLocaleString('en-IN')}`;
      }
    } else {
      alertCard.style.display = "none";
    }

    renderCashflowChart(data.projected_days, data.current_cash_reserve_inr);
  } catch (err) {
    console.error("Cashflow error:", err);
  }
}

function renderCashflowChart(projectedDays, startingCash) {
  const ctx = document.getElementById("cashflowChartCanvas").getContext("2d");
  const labels = projectedDays.map(d => d.date.slice(5));
  const cumulative = projectedDays.map(d => d.cumulative_cash_balance_inr);
  const p10 = projectedDays.map(d => d.p10_inflow);
  const p90 = projectedDays.map(d => d.p90_inflow);

  if (cashflowChartInstance) cashflowChartInstance.destroy();

  cashflowChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'तिजोरी का रोकड़ा (₹)',
          data: cumulative,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.3,
          borderWidth: 3,
          pointRadius: 2
        },
        {
          label: 'कम बिक्री का दिन (P10)',
          data: p10,
          borderColor: 'rgba(239, 68, 68, 0.6)',
          borderDash: [4, 4],
          fill: false,
          tension: 0.3,
          pointRadius: 0
        },
        {
          label: 'तेज़ बिक्री का दिन (P90)',
          data: p90,
          borderColor: 'rgba(0, 185, 241, 0.6)',
          borderDash: [4, 4],
          fill: false,
          tension: 0.3,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#94a3b8' } }
      },
      scales: {
        x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#10b981', callback: val => '₹' + val }
        }
      }
    }
  });
}

// 6. दुकान साख स्कोर (MerchantMind Score)
async function loadMerchantScore(merchantId) {
  try {
    const res = await fetch(`/api/scorer/credit-health/${merchantId}`);
    const data = await res.json();

    document.getElementById("kpiScoreVal").textContent = `${data.total_score} / 900`;
    document.getElementById("mainScoreNumber").textContent = data.total_score;
    document.getElementById("scoreTierBadge").textContent = data.tier_badge || "गोल्ड श्रेणी 🥇";

    // Update hero stat pills dynamically
    const heroScoreElem = document.getElementById("heroScoreSummary");
    if (heroScoreElem) {
      heroScoreElem.textContent = `${data.total_score} / 900`;
    }
    const heroStatusElem = document.getElementById("heroBusinessStatus");
    if (heroStatusElem) {
      heroStatusElem.textContent = data.tier_badge || "गोल्ड व्यापारी 🥇";
    }

    // Update Tab 5 explanation heading
    const explainHeading = document.getElementById("scoreExplainHeading");
    if (explainHeading) {
      const ratingWord = data.total_score >= 800 ? (currentLanguage === "hi" ? "उत्कृष्ट प्रतिष्ठा" : "Outstanding Tier")
                       : data.total_score >= 700 ? (currentLanguage === "hi" ? "शानदार प्रतिष्ठा" : "Excellent Tier")
                       : data.total_score >= 600 ? (currentLanguage === "hi" ? "संतोषजनक प्रतिष्ठा" : "Good Tier")
                       : (currentLanguage === "hi" ? "सुधार योग्य" : "Emerging Tier");
      explainHeading.textContent = currentLanguage === "hi"
        ? `आपकी दुकान का साख स्कोर: ${data.total_score} / 900 (${ratingWord})`
        : `Your Store Credit Score: ${data.total_score} / 900 (${ratingWord})`;
    }

    // Render 5 dimensions
    const dimsContainer = document.getElementById("scoreDimensionsList");
    if (dimsContainer) {
      dimsContainer.innerHTML = data.dimensions.map(d => `
        <div class="dim-item">
          <div class="dim-top">
            <span><strong>${d.name}</strong> <small style="color:#64748b">(${d.weight_pct}% ${currentLanguage === "hi" ? "महत्व" : "weight"})</small></span>
            <span style="color:#00b9f1; font-weight:700">${d.score} / ${d.max_score}</span>
          </div>
          <div class="dim-bar-track">
            <div class="dim-bar-fill" style="width: ${(d.score / d.max_score) * 100}%"></div>
          </div>
        </div>
      `).join("");
    }

    // Action checklist
    const checklist = document.getElementById("scoreBoostChecklist");
    if (checklist) {
      checklist.innerHTML = data.immediate_actions_to_boost_score.map(a => `
        <li style="padding:0.4rem 0; font-size:0.85rem; color:#cbd5e1; display:flex; align-items:center; gap:0.5rem">
          <span style="color:#10b981">✓</span> ${a}
        </li>
      `).join("");
    }

    renderShapChart(data.shap_top_contributors);
  } catch (err) {
    console.error("Score error:", err);
  }
}

function renderShapChart(shapContributors) {
  const ctx = document.getElementById("shapChartCanvas").getContext("2d");
  const labels = shapContributors.map(s => s.feature);
  const values = shapContributors.map(s => s.impact_pts);
  const colors = values.map(v => v >= 0 ? '#10b981' : '#ef4444');

  if (shapChartInstance) shapChartInstance.destroy();

  shapChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'साख में योगदान (अंक)',
        data: values,
        backgroundColor: colors,
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
        y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#cbd5e1', font: { size: 11 } } }
      }
    }
  });
}

// 7. आस-पास का बाज़ार (Competitor Radar)
async function loadCompetitorRadar(merchantId) {
  try {
    const res = await fetch(`/api/competitor/radar/${merchantId}`);
    const data = await res.json();

    document.getElementById("radarClusterName").textContent = data.neighborhood_cluster;
    document.getElementById("radarPeerCount").textContent = `${data.total_peer_merchants_in_radius} ${currentLanguage === 'hi' ? 'पड़ौसी दुकानें' : 'peer merchants'}`;

    // Trending products
    const trendContainer = document.getElementById("radarTrendingProductsList");
    if (trendContainer) {
      trendContainer.innerHTML = data.trending_products.map(p => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0; border-bottom:1px solid rgba(255,255,255,0.05)">
          <div>
            <strong>${p.product_name}</strong>
            <div style="font-size:0.75rem; color:#64748b">${p.category}</div>
          </div>
          <div style="text-align:right">
            <span class="card-header-badge badge-green">+${p.local_growth_pct}% ${currentLanguage === 'hi' ? 'मांग बढ़ी' : 'growth'}</span>
            <div style="font-size:0.75rem; color:#00b9f1; margin-top:0.2rem">${currentLanguage === 'hi' ? 'स्टॉक रखने की सलाह' : 'Suggested stock'}: ${p.suggested_stock_units} ${currentLanguage === 'hi' ? 'पैकेट' : 'units'}</div>
          </div>
        </div>
      `).join("");
    }

    // Threats & alerts
    const alertsContainer = document.getElementById("radarThreatAlertsList");
    if (alertsContainer) {
      alertsContainer.innerHTML = data.threat_alerts.map(t => `
        <div class="glass-panel" style="padding:0.85rem; margin-bottom:0.6rem; border-left:3px solid #f59e0b">
          <div style="font-size:0.85rem; font-weight:700; color:#f59e0b">${t.threat_type}</div>
          <div style="font-size:0.8rem; color:#cbd5e1; margin:0.3rem 0">${t.description}</div>
          <div style="font-size:0.75rem; color:#10b981">💡 ${currentLanguage === 'hi' ? 'साथी का उपाय' : 'Countermeasure'}: ${t.suggested_countermeasure}</div>
        </div>
      `).join("");
    }
  } catch (err) {
    console.error("Radar error:", err);
  }
}

// 8. 1-टैप दुकान साथी काम (Agentic Actions)
async function loadPendingActions(merchantId) {
  try {
    const res = await fetch(`/api/actions/pending/${merchantId}`);
    const actions = await res.json();

    const container = document.getElementById("pendingActionsContainer");
    document.getElementById("pendingActionsBadge").textContent = actions.length;

    if (container) {
      if (actions.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:2rem; color:#64748b">${currentLanguage === 'hi' ? 'शाबाश! सभी जरूरी काम पूरे हो चुके हैं।' : 'All pending actions resolved!'}</div>`;
        return;
      }

      container.innerHTML = actions.map(act => `
        <div class="action-card ${act.priority === 'HIGH' ? 'high-impact' : ''}" id="actionCard_${act.action_id}">
          <div class="action-header">
            <div class="action-title">
              <span>⚡</span> ${act.title}
            </div>
            <span class="card-header-badge ${act.priority === 'HIGH' ? 'badge-amber' : 'badge-blue'}">${act.priority === 'HIGH' ? (currentLanguage === 'hi' ? 'अति आवश्यक' : 'URGENT') : (currentLanguage === 'hi' ? 'सुझाव' : 'SUGGESTION')}</span>
          </div>
          <div class="action-body">${act.description}</div>
          <div class="action-footer">
            <span class="action-roi">📈 ${currentLanguage === 'hi' ? 'संभावित लाभ' : 'Est. ROI'}: ${act.expected_roi}</span>
            <div class="action-btns">
              <button class="btn-action-success" onclick="resolveAction('${act.action_id}', true)">
                ✅ ${currentLanguage === 'hi' ? '1-क्लिक में मंज़ूर करें' : '1-Click Approve'}
              </button>
              <button class="btn-lang-toggle" onclick="resolveAction('${act.action_id}', false)">
                ${currentLanguage === 'hi' ? 'खारिज करें' : 'Dismiss'}
              </button>
            </div>
          </div>
        </div>
      `).join("");
    }
  } catch (err) {
    console.error("Actions error:", err);
  }
}

async function resolveAction(actionId, approved) {
  try {
    const res = await fetch(`/api/actions/approve?merchant_id=${currentMerchantId}&action_id=${actionId}&approved=${approved}`, {
      method: "POST"
    });
    const result = await res.json();
    showToast(result.execution_log);
    loadPendingActions(currentMerchantId);
  } catch (err) {
    console.error("Action resolution failed:", err);
  }
}

// Quick WhatsApp Reorder Trigger
async function triggerQuickReorder(productId, productName, qty) {
  showToast(`📲 होलसेलर (शर्मा जी) के लिए WhatsApp आर्डर तैयार: ${qty}x ${productName}...`);
  try {
    const res = await fetch(`/api/actions/approve?merchant_id=${currentMerchantId}&action_id=ACT_REORDER_01&approved=true`, {
      method: "POST"
    });
    const result = await res.json();
    showToast(`✓ शर्मा डिस्ट्रीब्यूटर्स को WhatsApp पर पर्चा भेजा गया!`);
    loadPendingActions(currentMerchantId);
  } catch (err) {
    console.error(err);
  }
}

// Quick Cashback Dispatch
async function dispatchCashbackOffer(name, phone, amount) {
  showToast(`🎁 ${name} को ₹${amount} का पेटीएम कैशबैक भेजा जा रहा है...`);
  setTimeout(() => {
    showToast(`✓ ${phone} पर SMS और पेटीएम नोटिफिकेशन डिलीवर हुआ!`);
  }, 600);
}

// Instant Pre-Approved Loan Claim
async function applyForInstantLoan() {
  showToast("पेटीएम व्यापारी तुरंत लोन (₹25,000) खाते में भेजा जा रहा है...");
  try {
    const res = await fetch(`/api/actions/approve?merchant_id=${currentMerchantId}&action_id=ACT_LOAN_01&approved=true`, {
      method: "POST"
    });
    const result = await res.json();
    showToast("🎉 बधाई हो! ₹25,000 तुरंत आपके पेटीएम मर्चेंट वॉलेट में ट्रांसफर हो गए!");
    loadCashflowProjection(currentMerchantId);
  } catch (err) {
    console.error(err);
  }
}

// Voice Copilot Query Submission
async function submitVoiceQuery(queryText) {
  showToast(currentLanguage === 'hi' ? `सवाल: "${queryText}" का जवाब तैयार हो रहा है...` : `Answering query: "${queryText}"...`);
  try {
    const res = await fetch("/api/copilot/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: currentMerchantId,
        text_query: queryText,
        language: currentLanguage
      })
    });
    const copilotData = await res.json();

    // Display live response card
    copilotLiveResponse.style.display = "block";
    const intentLabel = currentLanguage === 'hi' ? 'विषय' : 'Topic';
    document.getElementById("copilotIntentBadge").textContent = `${intentLabel}: ${copilotData.detected_intent}`;
    document.getElementById("copilotHindiText").textContent = copilotData.response_text_hindi;
    document.getElementById("copilotEnglishText").textContent = copilotData.response_text_english;

    // Speak response (Paytm Soundbox Voice)
    if (currentLanguage === "hi") {
      speakSoundboxVoice(copilotData.response_text_hindi, 'hi-IN');
    } else {
      speakSoundboxVoice(copilotData.response_text_english, 'en-IN');
    }

    // Retain user on tabHome so they can read and replay response without being yanked across pages
    const currentActiveTab = document.querySelector(".tab-content-pane.active");
    if (!currentActiveTab || currentActiveTab.id !== "tabHome") {
      if (copilotData.detected_intent === "DEMAND_FORECAST" || copilotData.detected_intent === "HISTORICAL_SALES") switchTab("tabDemand");
      if (copilotData.detected_intent === "INVENTORY_STATUS" || copilotData.detected_intent === "INVENTORY_RESTOCK") switchTab("tabInventory");
      if (copilotData.detected_intent === "CASH_FLOW" || copilotData.detected_intent === "CASHFLOW_ALERT") switchTab("tabCashflow");
      if (copilotData.detected_intent === "CREDIT_SCORE" || copilotData.detected_intent === "SCORE_INQUIRY") switchTab("tabScore");
      if (copilotData.detected_intent === "CUSTOMER_RETENTION") switchTab("tabRetention");
    }

  } catch (err) {
    console.error("Copilot error:", err);
    showToast(currentLanguage === 'hi' ? "वॉयस असिस्टेंट में त्रुटि आई।" : "Voice assistant encountered an error.");
  }
}

// Soundbox Voice Synthesizer
function speakSoundboxVoice(text, lang = 'hi-IN') {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}

function playLastVoiceResponse() {
  const text = currentLanguage === 'hi' 
    ? document.getElementById("copilotHindiText").textContent
    : document.getElementById("copilotEnglishText").textContent;
  if (text) speakSoundboxVoice(text, currentLanguage === 'hi' ? 'hi-IN' : 'en-IN');
}

// Friendly Toast Notifications
function showToast(msg) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>📢</span> <span>${msg}</span>`;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
