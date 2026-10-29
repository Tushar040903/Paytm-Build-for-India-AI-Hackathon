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
  loadCashflowProjection(currentMerchantId);
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

    // 1. Update KPI 1 - Today's Estimated Sales (GMV) & Growth %
    const todayEst = data.today_estimated_sales_inr || (data.forecast_points[0] ? data.forecast_points[0].predicted_sales_inr : 16420);
    const growthPct = data.growth_vs_normal_pct !== undefined ? data.growth_vs_normal_pct : 18.2;

    const kpiGmvVal = document.getElementById("kpiGmvVal");
    if (kpiGmvVal) {
      kpiGmvVal.textContent = `₹${Math.round(todayEst).toLocaleString('en-IN')}`;
    }

    const kpiGmvPct = document.getElementById("kpiGmvPct");
    const kpiGmvSubContainer = document.getElementById("kpiGmvSubContainer");
    if (kpiGmvPct) {
      const isPositive = growthPct >= 0;
      kpiGmvPct.textContent = `${isPositive ? '▲ +' : '▼ '}${growthPct}%`;
      if (kpiGmvSubContainer) {
        kpiGmvSubContainer.className = isPositive ? "kpi-sub positive" : "kpi-sub warning";
      }
    }

    const kpiGmvSubText = document.getElementById("kpiGmvSubText");
    if (kpiGmvSubText) {
      kpiGmvSubText.textContent = currentLanguage === 'hi' 
        ? "दैनिक औसत से ज्यादा" 
        : "higher than normal weekday avg";
    }

    // 2. Update KPI 2 - 7-Day Total Sales
    const total7d = data.forecast_points.reduce((sum, p) => sum + p.predicted_sales_inr, 0);
    const kpi7dDemandVal = document.getElementById("kpi7dDemandVal");
    if (kpi7dDemandVal) {
      kpi7dDemandVal.textContent = `₹${Math.round(total7d).toLocaleString('en-IN')}`;
    }

    // 3. Dynamic Store-Specific External & Market Factors
    const extFactorsContainer = document.getElementById("externalFactorsList");
    if (extFactorsContainer && data.external_factors) {
      extFactorsContainer.innerHTML = data.external_factors.map(f => {
        const title = currentLanguage === 'hi' ? f.title_hi : f.title_en;
        const badgeClass = f.badge || 'badge-blue';
        return `<span class="card-header-badge ${badgeClass}">${title}</span>`;
      }).join("");
    }

    // 4. Dynamic Store-Specific Pro Tip
    const proTipElem = document.getElementById("proTipText");
    if (proTipElem) {
      const tipText = currentLanguage === 'hi' 
        ? (data.pro_tip_hi || "शुक्रवार को दोपहर 3 से 8 बजे तक सबसे ज्यादा रश रहेगा। हेल्पर को दुकान पर पहले से तैयार रखें।")
        : (data.pro_tip_en || "Peak footfall expected Friday between 3 PM and 8 PM. Keep extra store helper ready.");
      proTipElem.textContent = tipText;
    }

    // 5. Top predicted products table with verified expected revenue
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
            <td><strong>₹${rev}</strong></td>
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
  const footfall = forecastPoints.map(p => p.predicted_footfall || Math.round(p.predicted_transactions * 1.25) || 50);

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

    const alertCard = document.getElementById("cashCrunchAlertCard");
    const crunchIcon = document.getElementById("crunchCardIcon");
    const crunchHeading = document.getElementById("crunchCardHeading");
    const crunchDaysElem = document.getElementById("crunchDaysVal");
    const crunchActionText = document.getElementById("crunchActionText");
    const shortfallLabel = document.getElementById("crunchShortfallLabel");
    const shortfallElem = document.getElementById("crunchShortfallVal");
    const loanTitleElem = document.getElementById("crunchLoanTitle");
    const loanSubElem = document.getElementById("crunchLoanSub");
    const loanElem = document.getElementById("loanAmountVal");
    const btnLoanClaim = document.getElementById("btnLoanClaim");

    if (data.crunch_alert) {
      // High/Medium Risk: Active Crunch Alert with merchant-tailored expense & date
      if (alertCard) {
        alertCard.style.display = "block";
        alertCard.style.borderLeft = "4px solid var(--accent-danger)";
        alertCard.style.background = "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(18,24,41,0.85))";
      }
      if (crunchIcon) crunchIcon.textContent = "🚨";
      if (crunchHeading) {
        crunchHeading.textContent = currentLanguage === 'hi' ? "रोकड़े की संभावित तंगी का अलर्ट" : "Predictive Cash Crunch Alert";
        crunchHeading.style.color = "#ef4444";
      }
      if (crunchDaysElem) {
        crunchDaysElem.className = "card-header-badge badge-red";
        crunchDaysElem.textContent = currentLanguage === 'hi' 
          ? `${data.crunch_alert.days_until_crunch} दिन में` 
          : `In ${data.crunch_alert.days_until_crunch} days`;
      }
      if (crunchActionText) {
        const reason = currentLanguage === 'hi' 
          ? (data.crunch_alert.expense_reason_hi || "होलसेलर आपूर्ति व दुकान किराया देय")
          : (data.crunch_alert.expense_reason_en || "Distributor restock and rent payments due");
        const action = currentLanguage === 'hi'
          ? (data.crunch_alert.suggested_action_hi || "1-क्लिक प्री-एप्रूव्ड लोन से नकदी संकट टालें।")
          : (data.crunch_alert.suggested_action_en || "Bridge temporary dip with pre-approved credit.");
        crunchActionText.textContent = `${reason}। ${action}`;
      }
      if (shortfallLabel) {
        shortfallLabel.textContent = currentLanguage === 'hi' ? "संभावित कमी (Shortfall)" : "Projected Shortfall";
      }
      if (shortfallElem) {
        shortfallElem.style.color = "#ef4444";
        shortfallElem.textContent = `₹${Math.round(data.crunch_alert.shortfall_amount_inr).toLocaleString('en-IN')}`;
      }
      if (loanTitleElem) {
        loanTitleElem.textContent = currentLanguage === 'hi' 
          ? "घबराएं नहीं! पेटीएम तुरंत व्यापारी क्रेडिट प्री-एप्रूव्ड है" 
          : "No worries! Pre-approved Paytm Merchant Credit is ready";
      }
      if (loanSubElem) {
        loanSubElem.textContent = currentLanguage === 'hi'
          ? `साउंडबॉक्स UPI लेनदेन पर आधारित • बिना कागज़ात • ${data.crunch_alert.preapproved_loan_interest_pct}% मासिक ब्याज`
          : `Underwritten by Soundbox UPI transaction flows • Zero paperwork • ${data.crunch_alert.preapproved_loan_interest_pct}% monthly interest`;
      }
      if (loanElem) {
        loanElem.textContent = `₹${Math.round(data.crunch_alert.preapproved_loan_amount_inr).toLocaleString('en-IN')}`;
      }
      if (btnLoanClaim) {
        btnLoanClaim.textContent = currentLanguage === 'hi' ? "1-क्लिक में वॉलेट में लें" : "1-Click Disburse to Wallet";
      }
    } else {
      // Healthy Positive Cashflow (Zero Crunch)
      if (alertCard) {
        alertCard.style.display = "block";
        alertCard.style.borderLeft = "4px solid #10b981";
        alertCard.style.background = "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(18,24,41,0.85))";
      }
      if (crunchIcon) crunchIcon.textContent = "✅";
      if (crunchHeading) {
        crunchHeading.textContent = currentLanguage === 'hi' ? "रोकड़ा स्थिति सुरक्षित • कोई कमी नहीं" : "Healthy Cashflow — Zero Projected Shortfall";
        crunchHeading.style.color = "#10b981";
      }
      if (crunchDaysElem) {
        crunchDaysElem.className = "card-header-badge badge-green";
        crunchDaysElem.textContent = currentLanguage === 'hi' ? "मजबूत तरलता ✓" : "Strong Liquidity ✓";
      }
      if (crunchActionText) {
        crunchActionText.textContent = currentLanguage === 'hi' 
          ? (data.health_summary_hi || "अगले 30 दिनों में कोई नकदी संकट नहीं। दुकान का रोकड़ा निरंतर सुरक्षित सीमा से ऊपर रहेगा।")
          : (data.health_summary_en || "Zero projected shortfall over the next 30 days. Operating balance remains well above safety reserves.");
      }
      if (shortfallLabel) {
        shortfallLabel.textContent = currentLanguage === 'hi' ? "30 दिनों का अनुमानित अधिशेष (Surplus)" : "30-Day Net Cash Surplus";
      }
      if (shortfallElem) {
        shortfallElem.style.color = "#10b981";
        const netChange = data.net_30d_projected_cash_change_inr || 45000;
        shortfallElem.textContent = `+₹${Math.round(netChange).toLocaleString('en-IN')}`;
      }
      if (loanTitleElem) {
        loanTitleElem.textContent = currentLanguage === 'hi' 
          ? "व्यापार विस्तार हेतु प्री-एप्रूव्ड ग्रोथ क्रेडिट उपलब्ध" 
          : "Pre-Approved Growth Capital Available for Expansion";
      }
      if (loanSubElem) {
        loanSubElem.textContent = currentLanguage === 'hi'
          ? "दुकान नवीनीकरण व त्योहारी थोक स्टॉक के लिए तुरंत क्रेडिट • 0.85% प्राइम दर"
          : "Instant credit line for bulk festive purchasing & store expansion • 0.85% prime rate";
      }
      if (loanElem) {
        loanElem.textContent = currentLanguage === 'hi' ? "₹1,00,000+" : "₹100,000+";
      }
      if (btnLoanClaim) {
        btnLoanClaim.textContent = currentLanguage === 'hi' ? "ग्रोथ क्रेडिट देखें" : "Explore Growth Line";
      }
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
  const inflows = projectedDays.map(d => d.expected_inflow_inr);
  const outflows = projectedDays.map(d => d.expected_outflow_inr);

  if (cashflowChartInstance) cashflowChartInstance.destroy();

  const isNetPositive = (cumulative[cumulative.length - 1] >= startingCash);
  const balanceColor = isNetPositive ? '#10b981' : '#f59e0b';
  const balanceBg = isNetPositive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)';

  cashflowChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: currentLanguage === 'hi' ? 'तिजोरी का कुल रोकड़ा (Cash Balance)' : 'Cumulative Cash Balance (₹)',
          data: cumulative,
          borderColor: balanceColor,
          backgroundColor: balanceBg,
          fill: true,
          tension: 0.3,
          borderWidth: 3,
          pointRadius: 2,
          yAxisID: 'y'
        },
        {
          label: currentLanguage === 'hi' ? 'दैनिक बिक्री आवक (Daily Inflow)' : 'Daily Sales Inflow (₹)',
          data: inflows,
          borderColor: '#00b9f1',
          borderDash: [3, 3],
          fill: false,
          tension: 0.25,
          borderWidth: 2,
          pointRadius: 1,
          yAxisID: 'y1'
        },
        {
          label: currentLanguage === 'hi' ? 'दैनिक खर्च व सप्लायर बिल (Daily Outflow)' : 'Daily Expenses & Bills (₹)',
          data: outflows,
          borderColor: '#ef4444',
          borderDash: [5, 4],
          fill: false,
          tension: 0.2,
          borderWidth: 2,
          pointRadius: 1,
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
              const val = Math.round(context.raw).toLocaleString('en-IN');
              return `${context.dataset.label}: ₹${val}`;
            },
            afterBody: function(contexts) {
              const idx = contexts[0].dataIndex;
              const dayData = projectedDays[idx];
              if (dayData && dayData.scheduled_expenses && dayData.scheduled_expenses.length > 0) {
                return ['\n📌 ' + (currentLanguage === 'hi' ? 'आज का देय बिल:' : 'Scheduled bills:'), ...dayData.scheduled_expenses.map(e => '  • ' + e)];
              }
              return [];
            }
          }
        }
      },
      scales: {
        x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: balanceColor, callback: val => '₹' + Math.round(val).toLocaleString('en-IN') },
          position: 'left',
          title: {
            display: true,
            text: currentLanguage === 'hi' ? 'कुल रोकड़ा (₹)' : 'Cash Balance (₹)',
            color: balanceColor
          }
        },
        y1: {
          grid: { drawOnChartArea: false },
          ticks: { color: '#00b9f1', callback: val => '₹' + Math.round(val).toLocaleString('en-IN') },
          position: 'right',
          title: {
            display: true,
            text: currentLanguage === 'hi' ? 'दैनिक आवक/खर्च (₹)' : 'Daily Flow (₹)',
            color: '#00b9f1'
          }
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

    // Dynamic Tier Badge and Color Class
    const badgeText = currentLanguage === 'hi' 
      ? (data.tier_badge_hi || data.tier_badge || "गोल्ड श्रेणी 🥇")
      : (data.tier_badge_en || `${data.tier} Tier 🥇`);
    
    const tierBadgeElem = document.getElementById("scoreTierBadge");
    if (tierBadgeElem) {
      tierBadgeElem.textContent = badgeText;
      tierBadgeElem.className = data.total_score >= 800 ? "score-tier-badge badge-platinum"
                              : data.total_score >= 700 ? "score-tier-badge badge-gold"
                              : data.total_score >= 600 ? "score-tier-badge badge-silver"
                              : "score-tier-badge badge-bronze";
    }

    // Dynamic Circular SVG Gauge Animation
    const circle = document.getElementById("scoreMeterCircle");
    if (circle) {
      const circ = 390;
      const offset = Math.max(0, circ - (data.total_score / 900.0) * circ);
      circle.style.strokeDashoffset = offset;
      circle.style.stroke = data.total_score >= 800 ? "#8b5cf6" 
                          : data.total_score >= 700 ? "#10b981" 
                          : data.total_score >= 600 ? "#00b9f1" 
                          : "#f59e0b";
    }

    // Dynamic Underwriting-Driven KPI 4 Tag & Subtext
    const kpiScoreCard = document.getElementById("kpiScoreCard");
    const kpiScoreTag = document.getElementById("kpiScoreTag");
    const kpiScoreSubText = document.getElementById("kpiScoreSubText");

    if (data.is_preapproved) {
      if (kpiScoreCard) {
        kpiScoreCard.className = data.total_score >= 800 ? "glass-panel kpi-card purple" : "glass-panel kpi-card success";
      }
      if (kpiScoreTag) {
        const tagText = currentLanguage === 'hi' 
          ? (data.total_score >= 800 ? "★ प्राइम क्रेडिट लाइन" : "✓ प्री-एप्रूव्ड लोन")
          : (data.total_score >= 800 ? "★ Prime Line of Credit" : "✓ Pre-Approved Loan");
        kpiScoreTag.textContent = tagText;
      }
      if (kpiScoreSubText) {
        kpiScoreSubText.textContent = currentLanguage === 'hi' ? data.loan_subtext_hi : data.loan_subtext_en;
      }
    } else {
      if (kpiScoreCard) {
        kpiScoreCard.className = "glass-panel kpi-card warning";
      }
      if (kpiScoreTag) {
        kpiScoreTag.textContent = currentLanguage === 'hi' ? "⚠️ साख सुधार आवश्यक" : "⚠️ Rebuilding Credit";
      }
      if (kpiScoreSubText) {
        kpiScoreSubText.textContent = currentLanguage === 'hi' 
          ? "30 दिन लगातार साउंडबॉक्स लेनदेन से क्रेडिट अनलॉक होगा" 
          : "Requires 30 days active Soundbox volume to unlock credit";
      }
    }

    // Update hero stat pills dynamically
    const heroScoreElem = document.getElementById("heroScoreSummary");
    if (heroScoreElem) {
      heroScoreElem.textContent = `${data.total_score} / 900`;
    }
    const heroStatusElem = document.getElementById("heroBusinessStatus");
    if (heroStatusElem) {
      heroStatusElem.textContent = badgeText;
    }
    const homeStoreTierElem = document.getElementById("homeStoreTier");
    if (homeStoreTierElem) {
      homeStoreTierElem.textContent = badgeText;
    }
    const metricTierElem = document.getElementById("metricTierBadge");
    if (metricTierElem) {
      metricTierElem.textContent = badgeText;
    }

    // Update Tab 5 explanation heading
    const explainHeading = document.getElementById("scoreExplainHeading");
    if (explainHeading) {
      const ratingWord = data.total_score >= 800 ? (currentLanguage === "hi" ? "उत्कृष्ट प्रतिष्ठा (Prime Tier 💎)" : "Outstanding Prime Tier 💎")
                       : data.total_score >= 700 ? (currentLanguage === "hi" ? "शानदार प्रतिष्ठा (Growth Tier 🥇)" : "Excellent Growth Tier 🥇")
                       : data.total_score >= 600 ? (currentLanguage === "hi" ? "संतोषजनक प्रतिष्ठा (Standard Tier 🥈)" : "Good Standard Tier 🥈")
                       : (currentLanguage === "hi" ? "साख निर्माणधीन (Emerging Tier 🥉)" : "Emerging Subprime Tier 🥉");
      explainHeading.textContent = currentLanguage === "hi"
        ? `आपकी दुकान का साख स्कोर: ${data.total_score} / 900 (${ratingWord})`
        : `Your Store Credit Score: ${data.total_score} / 900 (${ratingWord})`;
    }

    // Render 5 dimensions
    const dimsContainer = document.getElementById("scoreDimensionsList");
    if (dimsContainer && data.dimensions) {
      dimsContainer.innerHTML = data.dimensions.map(d => {
        const dimName = currentLanguage === "hi" ? (d.name_hi || d.name) : (d.name_en || d.name);
        const scoreVal = d.score || 70;
        const maxScore = d.max_score || 100;
        const pct = Math.min(100, Math.round((scoreVal / maxScore) * 100));
        const barColor = scoreVal >= 80 ? "linear-gradient(90deg, #10b981, #059669)"
                       : scoreVal >= 70 ? "linear-gradient(90deg, #00b9f1, #0284c7)"
                       : scoreVal >= 60 ? "linear-gradient(90deg, #f59e0b, #d97706)"
                       : "linear-gradient(90deg, #ef4444, #dc2626)";
        const gradeBadgeClass = scoreVal >= 80 ? "badge-green" : scoreVal >= 70 ? "badge-blue" : "badge-amber";
        return `
        <div class="dim-item" style="margin-bottom: 0.85rem;">
          <div class="dim-top" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.3rem;">
            <span>
              <strong style="color:#f1f5f9; font-size:0.88rem">${dimName}</strong>
              <small style="color:#64748b; margin-left:0.35rem">(${d.weight_pct}% ${currentLanguage === "hi" ? "महत्व" : "weight"})</small>
            </span>
            <span style="font-weight:700; font-size:0.88rem; color:#f8fafc">
              ${scoreVal} / ${maxScore}
              <span class="card-header-badge ${gradeBadgeClass}" style="margin-left:0.35rem; font-size:0.7rem; padding:1px 6px;">${d.grade || 'A'}</span>
            </span>
          </div>
          <div class="dim-bar-track" style="height:6px; background:rgba(255,255,255,0.06); border-radius:3px; overflow:hidden;">
            <div class="dim-bar-fill" style="width: ${pct}%; height:100%; background: ${barColor}; border-radius:3px; transition: width 0.6s ease;"></div>
          </div>
        </div>
      `;
      }).join("");
    }

    // Dynamic score boost checklist title based on score & tier
    const checklistTitleElem = document.getElementById("scoreChecklistTitle");
    if (checklistTitleElem) {
      const s = data.total_score;
      let nextMilestone, targetTierHi, targetTierEn;
      if (s >= 850) {
        nextMilestone = 900;
        targetTierHi = "सर्वोच्च 900 अंक (Perfect Diamond 💎)";
        targetTierEn = "Perfect 900 Score (Diamond 💎)";
      } else if (s >= 800) {
        nextMilestone = 850;
        targetTierHi = "सुपर-प्राइम 850 (Super-Prime 💎)";
        targetTierEn = "Super-Prime 850 (Tier 1 Prime 💎)";
      } else if (s >= 700) {
        nextMilestone = 800;
        targetTierHi = "प्लैटिनम श्रेणी 800 (Platinum 💎)";
        targetTierEn = "Platinum Tier 800 (Tier 1 Prime 💎)";
      } else if (s >= 600) {
        nextMilestone = 700;
        targetTierHi = "गोल्ड श्रेणी 700 (Gold 🥇)";
        targetTierEn = "Gold Tier 700 (Tier 2 Growth 🥇)";
      } else {
        nextMilestone = 650;
        targetTierHi = "सिल्वर श्रेणी 650 (Silver 🥈)";
        targetTierEn = "Silver Tier 650 (Tier 3 Standard 🥈)";
      }
      const ptsToGain = nextMilestone - s;
      checklistTitleElem.textContent = currentLanguage === 'hi'
        ? `🎯 ${targetTierHi} तक पहुँचने के आसान उपाय (+${ptsToGain} अंक):`
        : `🎯 Steps to reach ${targetTierEn} (+${ptsToGain} pts):`;
    }

    // Action checklist items
    const checklist = document.getElementById("scoreBoostChecklist");
    if (checklist) {
      const actions = currentLanguage === 'hi'
        ? (data.immediate_actions_to_boost_score_hi || data.immediate_actions_to_boost_score)
        : (data.immediate_actions_to_boost_score_en || data.immediate_actions_to_boost_score);

      if (Array.isArray(actions) && actions.length > 0) {
        checklist.innerHTML = actions.map(a => `
          <li style="padding:0.45rem 0.55rem; margin-bottom:0.35rem; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:6px; font-size:0.84rem; color:#cbd5e1; display:flex; align-items:flex-start; gap:0.55rem; line-height:1.4">
            <span style="color:#10b981; font-weight:700; margin-top:1px">✓</span>
            <span style="flex:1">${a}</span>
          </li>
        `).join("");
      }
    }

    renderShapChart(data.shap_top_contributors);
  } catch (err) {
    console.error("Score error:", err);
  }
}

function renderShapChart(shapContributors) {
  const canvasElem = document.getElementById("shapChartCanvas");
  if (!canvasElem) return;
  const ctx = canvasElem.getContext("2d");
  if (!ctx) return;

  if (!shapContributors || !shapContributors.length) {
    if (shapChartInstance) shapChartInstance.destroy();
    return;
  }

  // Bilingual dynamic labels and impact values
  const labels = shapContributors.map(s => {
    if (currentLanguage === 'hi') {
      return s.factor_hi || s.factor || s.feature || "";
    } else {
      return s.factor_en || s.factor || s.feature || "";
    }
  });

  const values = shapContributors.map(s => {
    if (s.impact_pts !== undefined) return s.impact_pts;
    if (s.impact_points !== undefined) return s.impact_points;
    return 0;
  });

  const colors = values.map(v => v >= 0 ? 'rgba(16, 185, 129, 0.85)' : 'rgba(239, 68, 68, 0.85)');
  const borderColors = values.map(v => v >= 0 ? '#10b981' : '#ef4444');

  if (shapChartInstance) shapChartInstance.destroy();

  shapChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: currentLanguage === 'hi' ? 'साख स्कोर प्रभाव (अंक)' : 'Credit Score Impact (pts)',
        data: values,
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleColor: '#f8fafc',
          bodyColor: '#cbd5e1',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 8,
          callbacks: {
            label: function(context) {
              const val = context.raw;
              const sign = val > 0 ? '+' : '';
              return currentLanguage === 'hi'
                ? ` स्कोर प्रभाव: ${sign}${val} अंक`
                : ` Score Impact: ${sign}${val} pts`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: {
            color: '#94a3b8',
            callback: val => (val > 0 ? `+${val}` : `${val}`)
          },
          title: {
            display: true,
            text: currentLanguage === 'hi' ? 'स्कोर में प्रभाव (अंक)' : 'Impact on Credit Score (Points)',
            color: '#64748b',
            font: { size: 10 }
          }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: {
            color: '#cbd5e1',
            font: { size: 10.5 }
          }
        }
      }
    }
  });
}

// 7. आस-पास का बाज़ार (Competitor Radar)
async function loadCompetitorRadar(merchantId) {
  try {
    const res = await fetch(`/api/competitor/radar/${merchantId}`);
    if (!res.ok) return;
    const data = await res.json();

    const clusterName = currentLanguage === 'hi' 
      ? (data.neighborhood_cluster_hi || data.neighborhood_cluster || "स्थानीय व्यापार क्लस्टर")
      : (data.neighborhood_cluster_en || data.neighborhood_cluster || "Hyperlocal Commercial Cluster");

    // 1. Cluster Names & Subheadings
    const clusterNameEl = document.getElementById("radarClusterName");
    if (clusterNameEl) clusterNameEl.textContent = clusterName;

    const clusterPillEl = document.getElementById("radarClusterPill");
    if (clusterPillEl) clusterPillEl.textContent = clusterName;

    const pincodeTagEl = document.getElementById("radarPincodeTag");
    if (pincodeTagEl) {
      pincodeTagEl.textContent = currentLanguage === 'hi' ? `पिन कोड: ${data.pincode}` : `PIN: ${data.pincode}`;
    }

    // 2. Peer count
    const peerText = currentLanguage === 'hi' 
      ? `${data.total_peer_merchants_in_radius} पड़ौसी दुकानें` 
      : `${data.total_peer_merchants_in_radius} Active Peer Merchants`;
    const peerHeaderBadge = document.getElementById("radarPeerCount");
    if (peerHeaderBadge) peerHeaderBadge.textContent = peerText;

    const peerValEl = document.getElementById("radarPeerCountVal");
    if (peerValEl) {
      peerValEl.textContent = currentLanguage === 'hi'
        ? `${data.total_peer_merchants_in_radius} दुकानें`
        : `${data.total_peer_merchants_in_radius} Stores`;
    }

    // 3. Percentile Rank
    const rankValEl = document.getElementById("radarRankVal");
    if (rankValEl) {
      rankValEl.textContent = currentLanguage === 'hi'
        ? (data.percentile_rank_label_hi || `शीर्ष ${Math.max(5, Math.round(100 - data.merchant_percentile))}% स्टोर`)
        : (data.percentile_rank_label_en || `Top ${Math.max(5, Math.round(100 - data.merchant_percentile))}% Store`);
    }

    const rankSubEl = document.getElementById("radarRankSub");
    if (rankSubEl) {
      const diffPct = Math.round(((data.merchant_daily_sales_inr - data.peer_avg_daily_sales_inr) / (data.peer_avg_daily_sales_inr || 1)) * 100);
      if (diffPct > 0) {
        rankSubEl.textContent = currentLanguage === 'hi' 
          ? `औसत दुकान से +${diffPct}% अधिक बिक्री` 
          : `+${diffPct}% higher than peer average`;
        rankSubEl.style.color = "#10b981";
      } else {
        rankSubEl.textContent = currentLanguage === 'hi' 
          ? `क्लस्टर के औसत के अनुरूप` 
          : `Tracking with peer baseline`;
        rankSubEl.style.color = "#38bdf8";
      }
    }

    // 4. GMV Benchmark
    const peerGmvEl = document.getElementById("radarPeerGmvVal");
    if (peerGmvEl) {
      peerGmvEl.textContent = `₹${Math.round(data.peer_avg_monthly_gmv_inr).toLocaleString('en-IN')}`;
    }

    const yourGmvEl = document.getElementById("radarYourGmvCompare");
    if (yourGmvEl) {
      const myMonthly = Math.round((data.merchant_daily_sales_inr || 15000) * 30);
      yourGmvEl.textContent = currentLanguage === 'hi'
        ? `आपकी दुकान: ₹${myMonthly.toLocaleString('en-IN')}`
        : `Your Store: ₹${myMonthly.toLocaleString('en-IN')}`;
    }

    // 5. Trending Products
    const trendContainer = document.getElementById("radarTrendingProductsList");
    if (trendContainer && data.trending_products) {
      trendContainer.innerHTML = data.trending_products.map(p => {
        const prodName = currentLanguage === 'hi' 
          ? (p.title_hi || p.product_name || p.title) 
          : (p.title_en || p.title || p.product_name);
        const catName = currentLanguage === 'hi' 
          ? (p.category_hi || p.category) 
          : (p.category_en || p.category);
        const detailText = currentLanguage === 'hi' 
          ? (p.details_hi || p.details) 
          : (p.details_en || p.details);
        const urgencyText = currentLanguage === 'hi' 
          ? (p.urgency_hi || (p.urgency === "High Opportunity" ? "उच्च अवसर" : p.urgency === "Opportunity" ? "अच्छा अवसर" : "प्रतिस्पर्धा अलर्ट"))
          : (p.urgency_en || p.urgency);
        const urgencyClass = (p.urgency || "").includes("High") ? "badge-green" 
                           : (p.urgency || "").includes("Threat") ? "badge-amber" 
                           : "badge-blue";
        const growthVal = p.local_growth_pct || p.growth_rate_pct || 25;
        const stockUnits = p.suggested_stock_units || 20;
        const extraRev = p.estimated_extra_revenue_inr || 15000;

        return `
        <div style="padding:0.9rem; margin-bottom:0.75rem; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:var(--radius-sm); transition:background 0.2s ease;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem; margin-bottom:0.4rem;">
            <div>
              <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                <strong style="color:#f8fafc; font-size:0.95rem;">${prodName}</strong>
                <span class="card-header-badge ${urgencyClass}" style="font-size:0.7rem; padding:1px 6px;">${urgencyText}</span>
              </div>
              <div style="font-size:0.76rem; color:#64748b; margin-top:0.15rem;">
                ${catName} • <span style="color:#38bdf8;">${p.nearby_adoption_pct}% ${currentLanguage === 'hi' ? 'दुकानों में उपलब्ध' : 'peer adoption'}</span>
              </div>
            </div>
            <div style="text-align:right; flex-shrink:0;">
              <span class="card-header-badge badge-green" style="font-size:0.8rem; font-weight:700;">+${growthVal}% ${currentLanguage === 'hi' ? 'मांग बढ़ी' : 'growth'}</span>
            </div>
          </div>
          
          <div style="font-size:0.82rem; color:#cbd5e1; line-height:1.45; margin-bottom:0.6rem;">
            ${detailText}
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; padding-top:0.5rem; border-top:1px solid rgba(255,255,255,0.04);">
            <div style="font-size:0.78rem; color:#00b9f1; font-weight:600;">
              📦 ${currentLanguage === 'hi' ? 'सुझाया गया स्टॉक' : 'Suggested Stock'}: <strong>${stockUnits} ${currentLanguage === 'hi' ? 'यूनिट' : 'units'}</strong>
              <span style="color:#64748b; margin-left:0.4rem;">(≈ +₹${extraRev.toLocaleString('en-IN')})</span>
            </div>
            <button class="btn-action-success" style="padding:0.25rem 0.65rem; font-size:0.75rem;" onclick="showToast('${currentLanguage === 'hi' ? '✅ ' + prodName + ' का होलसेलर आर्डर तैयार किया गया!' : '✅ Order queued for ' + prodName + '!'}')">
              🛒 ${currentLanguage === 'hi' ? '+ स्टॉक ऑर्डर जोड़ें' : '+ Reorder Stock'}
            </button>
          </div>
        </div>
      `;
      }).join("");
    }

    // 6. Threats & Competition Alerts
    const alertsContainer = document.getElementById("radarThreatAlertsList");
    if (alertsContainer && data.threat_alerts) {
      alertsContainer.innerHTML = data.threat_alerts.map(t => {
        const title = currentLanguage === 'hi' ? (t.threat_type_hi || t.threat_type) : (t.threat_type_en || t.threat_type);
        const desc = currentLanguage === 'hi' ? (t.description_hi || t.description) : (t.description_en || t.description);
        const countermeasure = currentLanguage === 'hi' 
          ? (t.suggested_countermeasure_hi || t.suggested_countermeasure) 
          : (t.suggested_countermeasure_en || t.suggested_countermeasure);
        const isHigh = t.severity === "HIGH";

        return `
        <div style="padding:0.85rem 1rem; margin-bottom:0.75rem; background:rgba(255,255,255,0.02); border-left:4px solid ${isHigh ? '#ef4444' : '#f59e0b'}; border-radius:4px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
            <div style="font-size:0.88rem; font-weight:700; color:${isHigh ? '#f87171' : '#fbbf24'};">${title}</div>
            <span class="card-header-badge ${isHigh ? 'badge-amber' : 'badge-blue'}" style="font-size:0.68rem; padding:1px 6px;">
              ${isHigh ? (currentLanguage === 'hi' ? 'उच्च प्रभाव' : 'HIGH IMPACT') : (currentLanguage === 'hi' ? 'मध्यम' : 'MODERATE')}
            </span>
          </div>
          <div style="font-size:0.82rem; color:#cbd5e1; line-height:1.45; margin-bottom:0.5rem;">
            ${desc}
          </div>
          <div style="font-size:0.8rem; color:#34d399; background:rgba(16,185,129,0.08); padding:0.4rem 0.6rem; border-radius:4px; display:flex; align-items:flex-start; gap:0.4rem;">
            <span>💡</span>
            <div><strong>${currentLanguage === 'hi' ? 'पेटीएम साथी रणनीति' : 'Paytm Strategy'}:</strong> ${countermeasure}</div>
          </div>
        </div>
      `;
      }).join("");
    }

    // 7. Untapped Hyperlocal Opportunities
    const oppContainer = document.getElementById("radarOpportunitiesList");
    if (oppContainer && data.untapped_opportunities) {
      oppContainer.innerHTML = data.untapped_opportunities.map(o => {
        const title = currentLanguage === 'hi' ? (o.title_hi || o.title) : (o.title_en || o.title);
        const plan = currentLanguage === 'hi' ? (o.action_plan_hi || o.action_plan) : (o.action_plan_en || o.action_plan);
        const potential = o.potential_revenue_inr || 15000;

        return `
        <div style="padding:0.75rem 0.9rem; margin-bottom:0.65rem; background:rgba(255,255,255,0.02); border:1px solid rgba(16,185,129,0.2); border-radius:var(--radius-sm);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.3rem;">
            <strong style="color:#f1f5f9; font-size:0.88rem;">${title}</strong>
            <span style="font-size:0.8rem; font-weight:700; color:#10b981; background:rgba(16,185,129,0.12); padding:1px 6px; border-radius:4px;">
              +₹${potential.toLocaleString('en-IN')} ${currentLanguage === 'hi' ? 'अतिरिक्त' : 'revenue'}
            </span>
          </div>
          <div style="font-size:0.81rem; color:#94a3b8; line-height:1.4;">
            ${plan}
          </div>
        </div>
      `;
      }).join("");
    }

  } catch (err) {
    console.error("Radar error:", err);
  }
}

// 8. 1-टैप दुकान साथी काम (Agentic Actions)
let activeActionSubTab = 'pending';

function switchActionSubTab(tab) {
  activeActionSubTab = tab;
  const btnPending = document.getElementById("btnTabPendingActions");
  const btnHistory = document.getElementById("btnTabHistoryActions");
  const pendingCont = document.getElementById("pendingActionsContainer");
  const historyCont = document.getElementById("historyActionsContainer");
  const panelHeading = document.getElementById("actionPanelHeading");

  if (tab === 'pending') {
    if (btnPending) btnPending.classList.add("active");
    if (btnHistory) btnHistory.classList.remove("active");
    if (pendingCont) pendingCont.style.display = "block";
    if (historyCont) historyCont.style.display = "none";
    if (panelHeading) {
      panelHeading.textContent = currentLanguage === 'hi' 
        ? "⚡ दुकान साथी के तैयार फैसले (बस 1-क्लिक में मंज़ूर करें)" 
        : "⚡ Dukaan Saathi Autonomous Action Queue (1-Tap Approve)";
    }
  } else {
    if (btnPending) btnPending.classList.remove("active");
    if (btnHistory) btnHistory.classList.add("active");
    if (pendingCont) pendingCont.style.display = "none";
    if (historyCont) historyCont.style.display = "block";
    if (panelHeading) {
      panelHeading.textContent = currentLanguage === 'hi' 
        ? "📜 निष्पादित कार्य व ऑडिट ट्रेल (Execution History)" 
        : "📜 Execution History & Action Audit Trail";
    }
  }
}

async function loadPendingActions(merchantId) {
  try {
    const [pendingRes, allRes] = await Promise.all([
      fetch(`/api/actions/pending/${merchantId}`),
      fetch(`/api/actions/history/${merchantId}`)
    ]);

    const pendingActions = pendingRes.ok ? await pendingRes.json() : [];
    const allActions = allRes.ok ? await allRes.json() : [];
    const executedActions = allActions.filter(a => a.status === "EXECUTED" || a.status === "REJECTED");

    // 1. Update Badges & Counters
    const pendingBadge = document.getElementById("pendingActionsBadge");
    if (pendingBadge) pendingBadge.textContent = pendingActions.length;

    const pendingTabBadge = document.getElementById("pendingTabBadge");
    if (pendingTabBadge) pendingTabBadge.textContent = pendingActions.length;

    const historyTabBadge = document.getElementById("historyTabBadge");
    if (historyTabBadge) historyTabBadge.textContent = executedActions.length;

    const countValEl = document.getElementById("actionsPendingCountVal");
    if (countValEl) {
      countValEl.textContent = currentLanguage === 'hi' 
        ? `${pendingActions.length} कार्य` 
        : `${pendingActions.length} Actions`;
    }

    const execValEl = document.getElementById("actionsExecutedCountVal");
    if (execValEl) {
      execValEl.textContent = currentLanguage === 'hi' 
        ? `${executedActions.length} पूर्ण` 
        : `${executedActions.length} Completed`;
    }

    // Calculate Total Estimated ROI
    const totalRoi = pendingActions.reduce((sum, a) => sum + (a.estimated_roi_inr || 0), 0);
    const totalRoiEl = document.getElementById("actionsTotalRoiVal");
    if (totalRoiEl) {
      totalRoiEl.textContent = `₹${Math.round(totalRoi).toLocaleString('en-IN')}`;
    }

    // 2. Render Pending Actions Container
    const container = document.getElementById("pendingActionsContainer");
    if (container) {
      if (pendingActions.length === 0) {
        container.innerHTML = `
          <div style="text-align:center; padding:3rem 1rem; color:#94a3b8;">
            <div style="font-size:2.5rem; margin-bottom:0.6rem;">🎉</div>
            <div style="font-size:1.1rem; font-weight:700; color:#f8fafc; margin-bottom:0.3rem;">
              ${currentLanguage === 'hi' ? 'शाबाश! सभी जरूरी व्यापार फैसले पूरे हो चुके हैं।' : 'All pending actions resolved!'}
            </div>
            <div style="font-size:0.85rem; color:#64748b;">
              ${currentLanguage === 'hi' ? 'दुकान साथी आपकी बिक्री और स्टॉक की लगातार निगरानी कर रहा है।' : 'Dukaan Saathi is continuously monitoring your inventory velocity and sales.'}
            </div>
          </div>
        `;
      } else {
        container.innerHTML = pendingActions.map(act => {
          const title = currentLanguage === 'hi' ? (act.title_hi || act.title) : (act.title_en || act.title);
          const desc = currentLanguage === 'hi' ? (act.description_hi || act.description) : (act.description_en || act.description);
          const roiText = currentLanguage === 'hi' ? (act.expected_roi_hi || act.expected_roi) : (act.expected_roi_en || act.expected_roi);
          const isHigh = act.priority === 'HIGH';
          const priorityText = isHigh 
            ? (currentLanguage === 'hi' ? 'अति आवश्यक (HIGH)' : 'HIGH URGENT')
            : (currentLanguage === 'hi' ? 'सुझाव (MEDIUM)' : 'SUGGESTION');
          const borderStyle = isHigh ? 'border-left: 4px solid #f59e0b;' : 'border-left: 4px solid #00b9f1;';

          // Render contextual details grid
          let detailsHtml = "";
          const d = act.details || {};
          if (act.action_type === "REORDER_WHATSAPP") {
            detailsHtml = `
              <div style="background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.06); border-radius:6px; padding:0.6rem 0.8rem; margin:0.6rem 0 0.8rem; font-size:0.78rem; display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:0.4rem;">
                <div><span style="color:#64748b;">🏢 ${currentLanguage === 'hi' ? 'सप्लायर' : 'Supplier'}:</span> <strong style="color:#f1f5f9;">${d.supplier_name || 'Wholesale Distributor'}</strong></div>
                <div><span style="color:#64748b;">📞 ${currentLanguage === 'hi' ? 'व्हाट्सएप' : 'WhatsApp'}:</span> <span style="color:#38bdf8;">${d.supplier_phone || '+91 9811223344'}</span></div>
                <div><span style="color:#64748b;">📦 ${currentLanguage === 'hi' ? 'सामान' : 'Item'}:</span> <strong style="color:#10b981;">${d.item_name || 'Inventory'} (${d.quantity || '2 cartons'})</strong></div>
                <div><span style="color:#64748b;">💰 ${currentLanguage === 'hi' ? 'लागत' : 'Cost'}:</span> <strong style="color:#f8fafc;">₹${(d.total_cost_inr || 0).toLocaleString('en-IN')}</strong></div>
                <div><span style="color:#64748b;">🚚 ${currentLanguage === 'hi' ? 'आगमन' : 'Arrival'}:</span> <span style="color:#f59e0b;">${d.estimated_arrival || 'Tomorrow morning'}</span></div>
              </div>
            `;
          } else if (act.action_type === "CUSTOMER_WINBACK_COUPON") {
            detailsHtml = `
              <div style="background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.06); border-radius:6px; padding:0.6rem 0.8rem; margin:0.6rem 0 0.8rem; font-size:0.78rem; display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:0.4rem;">
                <div><span style="color:#64748b;">👥 ${currentLanguage === 'hi' ? 'लक्षित ग्राहक' : 'Target'}:</span> <strong style="color:#f1f5f9;">${d.target_customers_count || 8} ${currentLanguage === 'hi' ? 'पुराने पक्के ग्राहक' : 'Lapsed Regulars'}</strong></div>
                <div><span style="color:#64748b;">🎁 ${currentLanguage === 'hi' ? 'कैशबैक' : 'Voucher'}:</span> <strong style="color:#10b981;">₹${d.cashback_per_customer_inr || 20} ${currentLanguage === 'hi' ? 'प्रति ग्राहक' : 'per user'}</strong></div>
                <div><span style="color:#64748b;">🛒 ${currentLanguage === 'hi' ? 'न्यूनतम खरीद' : 'Min Bill'}:</span> <strong style="color:#f8fafc;">₹${d.min_bill_inr || 150}</strong></div>
                <div><span style="color:#64748b;">⏳ ${currentLanguage === 'hi' ? 'वैधता' : 'Validity'}:</span> <span style="color:#f59e0b;">${d.validity_days || 5} ${currentLanguage === 'hi' ? 'दिन' : 'days'}</span></div>
                <div><span style="color:#64748b;">📈 ${currentLanguage === 'hi' ? 'संभावित बिक्री' : 'Lift'}:</span> <strong style="color:#38bdf8;">+₹${(d.estimated_spend_lift_inr || 0).toLocaleString('en-IN')}</strong></div>
              </div>
            `;
          } else if (act.action_type === "LOAN_APPLY") {
            detailsHtml = `
              <div style="background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.06); border-radius:6px; padding:0.6rem 0.8rem; margin:0.6rem 0 0.8rem; font-size:0.78rem; display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:0.4rem;">
                <div><span style="color:#64748b;">🏦 ${currentLanguage === 'hi' ? 'पार्टनर' : 'Partner'}:</span> <strong style="color:#f1f5f9;">${d.lending_partner || 'Paytm Lending'}</strong></div>
                <div><span style="color:#64748b;">💵 ${currentLanguage === 'hi' ? 'प्री-एप्रूव्ड लोन' : 'Pre-Approved'}:</span> <strong style="color:#10b981;">₹${(d.preapproved_amount_inr || 0).toLocaleString('en-IN')}</strong></div>
                <div><span style="color:#64748b;">📅 ${currentLanguage === 'hi' ? 'अवधि' : 'Tenure'}:</span> <strong style="color:#f8fafc;">${d.tenure_months || 3} ${currentLanguage === 'hi' ? 'महीने' : 'Months'}</strong></div>
                <div><span style="color:#64748b;">💳 ${currentLanguage === 'hi' ? 'मासिक EMI' : 'EMI'}:</span> <span style="color:#f59e0b;">₹${(d.monthly_emi_inr || 0).toLocaleString('en-IN')}/mo</span></div>
                <div><span style="color:#64748b;">⚡ ${currentLanguage === 'hi' ? 'डिस्बर्सल' : 'Disbursal'}:</span> <span style="color:#38bdf8;">${d.processing_time || 'Instant'}</span></div>
              </div>
            `;
          } else if (act.action_type === "SUPPLIER_DISCOUNT") {
            detailsHtml = `
              <div style="background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.06); border-radius:6px; padding:0.6rem 0.8rem; margin:0.6rem 0 0.8rem; font-size:0.78rem; display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:0.4rem;">
                <div><span style="color:#64748b;">🏢 ${currentLanguage === 'hi' ? 'सप्लायर' : 'Supplier'}:</span> <strong style="color:#f1f5f9;">${d.supplier_name || 'Wholesaler'}</strong></div>
                <div><span style="color:#64748b;">🧾 ${currentLanguage === 'hi' ? 'चालान राशि' : 'Invoice'}:</span> <strong style="color:#f8fafc;">₹${(d.invoice_amount_inr || 0).toLocaleString('en-IN')}</strong></div>
                <div><span style="color:#64748b;">💵 ${currentLanguage === 'hi' ? 'सीधी नकद बचत' : 'Cash Discount'}:</span> <strong style="color:#10b981;">₹${(d.cash_discount_inr || 0).toLocaleString('en-IN')}</strong></div>
                <div><span style="color:#64748b;">⏳ ${currentLanguage === 'hi' ? 'समय पूर्व' : 'Early By'}:</span> <span style="color:#38bdf8;">${d.days_ahead || 5} ${currentLanguage === 'hi' ? 'दिन पहले' : 'days ahead'}</span></div>
              </div>
            `;
          } else if (act.action_type === "FESTIVE_PROMOTION") {
            detailsHtml = `
              <div style="background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.06); border-radius:6px; padding:0.6rem 0.8rem; margin:0.6rem 0 0.8rem; font-size:0.78rem; display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:0.4rem;">
                <div><span style="color:#64748b;">📢 ${currentLanguage === 'hi' ? 'चैनल' : 'Channel'}:</span> <strong style="color:#f1f5f9;">${d.channel || 'Paytm App & Soundbox'}</strong></div>
                <div><span style="color:#64748b;">📍 ${currentLanguage === 'hi' ? 'दायरा' : 'Radius'}:</span> <strong style="color:#38bdf8;">${d.radius_km || 2} km</strong></div>
              </div>
            `;
          }

          return `
            <div class="action-card ${isHigh ? 'high-impact' : ''}" style="${borderStyle}" id="actionCard_${act.action_id}">
              <div class="action-header">
                <div class="action-title">
                  <span style="font-size:1.15rem;">⚡</span>
                  <span style="font-size:0.95rem; font-weight:700; color:#f8fafc;">${title}</span>
                </div>
                <span class="card-header-badge ${isHigh ? 'badge-amber' : 'badge-blue'}">${priorityText}</span>
              </div>
              <div class="action-body" style="font-size:0.83rem; color:#cbd5e1; line-height:1.5;">${desc}</div>
              
              ${detailsHtml}

              <div class="action-footer">
                <span class="action-roi" style="font-size:0.82rem; font-weight:700; color:#10b981;">
                  📈 ${currentLanguage === 'hi' ? 'संभावित लाभ' : 'Est. ROI'}: ${roiText}
                </span>
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
          `;
        }).join("");
      }
    }

    // 3. Render Execution History / Audit Trail Container
    const historyContainer = document.getElementById("historyActionsContainer");
    if (historyContainer) {
      if (executedActions.length === 0) {
        historyContainer.innerHTML = `
          <div style="text-align:center; padding:2.5rem 1rem; color:#64748b;">
            <div style="font-size:2rem; margin-bottom:0.5rem;">📜</div>
            <div style="font-size:0.95rem; font-weight:600; color:#94a3b8;">
              ${currentLanguage === 'hi' ? 'अभी तक कोई फैसला निष्पादित नहीं हुआ है।' : 'No executed actions recorded yet.'}
            </div>
            <div style="font-size:0.8rem; color:#64748b; margin-top:0.2rem;">
              ${currentLanguage === 'hi' ? 'जैसे ही आप किसी फैसले को 1-क्लिक में मंज़ूर करेंगे, उसका लाइव रिकॉर्ड यहाँ दर्ज होगा।' : 'Actions approved via 1-Click will be logged here with complete execution telemetry.'}
            </div>
          </div>
        `;
      } else {
        historyContainer.innerHTML = executedActions.map(act => {
          const isApproved = act.status === "EXECUTED";
          const title = currentLanguage === 'hi' ? (act.title_hi || act.title) : (act.title_en || act.title);
          const logText = currentLanguage === 'hi' ? (act.execution_log_hi || act.execution_log) : (act.execution_log_en || act.execution_log);
          const badgeClass = isApproved ? "badge-green" : "badge-blue";
          const badgeText = isApproved 
            ? (currentLanguage === 'hi' ? '✓ निष्पादित व प्रेषित' : '✓ EXECUTED')
            : (currentLanguage === 'hi' ? '✕ खारिज किया गया' : '✕ DECLINED');

          return `
            <div class="action-card" style="border-left:4px solid ${isApproved ? '#10b981' : '#64748b'}; padding:1rem; margin-bottom:0.75rem; background:rgba(255,255,255,0.02);">
              <div class="action-header" style="margin-bottom:0.35rem;">
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <span>${isApproved ? '✅' : '❌'}</span>
                  <strong style="color:#f1f5f9; font-size:0.9rem;">${title}</strong>
                </div>
                <span class="card-header-badge ${badgeClass}" style="font-size:0.72rem; padding:1px 6px;">${badgeText}</span>
              </div>
              <div style="font-size:0.8rem; color:#94a3b8; margin:0.3rem 0 0.5rem; line-height:1.45;">
                ${logText || (isApproved ? 'Executed successfully via Paytm API.' : 'Declined by merchant.')}
              </div>
              <div style="font-size:0.74rem; color:#64748b; border-top:1px solid rgba(255,255,255,0.04); padding-top:0.35rem; display:flex; justify-content:space-between;">
                <span>ID: ${act.action_id}</span>
                <span>📅 ${act.created_at || 'Just now'}</span>
              </div>
            </div>
          `;
        }).join("");
      }
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
    const log = currentLanguage === 'hi' 
      ? (result.execution_log_hi || result.execution_log)
      : (result.execution_log_en || result.execution_log);
    showToast(log);
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
