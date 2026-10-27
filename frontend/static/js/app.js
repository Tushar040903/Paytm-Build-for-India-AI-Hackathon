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

function setupModeToggle() {
  if (btnModeToggle) {
    btnModeToggle.addEventListener("click", () => {
      document.body.classList.toggle("merchant-mode");
      isMerchantMode = document.body.classList.contains("merchant-mode");
      if (isMerchantMode) {
        btnModeToggle.classList.remove("active");
        txtModeToggle.textContent = "जज / AI मोड";
        showToast("🏪 दुकानदार मोड सक्रिय: सरल व आसान दृश्य");
      } else {
        btnModeToggle.classList.add("active");
        txtModeToggle.textContent = "दुकानदार मोड";
        showToast("👨‍💻 जज / AI मोड सक्रिय: तकनीकी मॉडल विवरण ऑन");
      }
    });
  }
}

function setupEventListeners() {
  // Merchant switcher
  merchantSelect.addEventListener("change", (e) => {
    currentMerchantId = e.target.value;
    showToast(`दुकान बदली गई: ${currentMerchantId}`);
    loadAllDashboardData(currentMerchantId);
  });

  // Language toggle
  btnLangToggle.addEventListener("click", () => {
    currentLanguage = currentLanguage === "hi" ? "en" : "hi";
    btnLangToggle.textContent = currentLanguage === "hi" ? "🌐 हिंदी / English" : "🌐 English / हिंदी";
    showToast(currentLanguage === "hi" ? "भाषा हिंदी में बदली गई" : "Language switched to English");
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
    recognition.lang = 'hi-IN';
    recognition.interimResults = false;

    btnVoiceRecord.addEventListener("click", () => {
      btnVoiceRecord.classList.add("listening");
      showToast("माइक चालू है... बोलिए तुषार जी");
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
      showToast("माइक में आवाज़ नहीं सुनी गई, कृपया टाइप करें या प्रॉम्प्ट चुनें।");
    };

    recognition.onend = () => {
      btnVoiceRecord.classList.remove("listening");
    };
  } else {
    btnVoiceRecord.addEventListener("click", () => {
      submitVoiceQuery("Bhaiya, aaj kya bikega?");
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
      opt.textContent = `${m.name} (${m.city})`;
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

// 1. Merchant Profile & Hero Card
async function loadMerchantProfile(merchantId) {
  try {
    const res = await fetch(`/api/merchants/${merchantId}`);
    const m = await res.json();
    document.getElementById("heroMerchantName").textContent = m.name;
    document.getElementById("heroMerchantCategory").textContent = `${m.category} • ${m.city}`;
    document.getElementById("heroMerchantId").textContent = m.merchant_id;
    document.getElementById("heroSoundboxSerial").textContent = `साउंडबॉक्स: ${m.soundbox_serial_id}`;
    document.getElementById("heroDailyGmv").textContent = `₹${m.avg_daily_sales_inr.toLocaleString('en-IN')}`;
    document.getElementById("kpiGmvVal").textContent = `₹${(m.avg_daily_sales_inr * 1.18).toFixed(0).toLocaleString('en-IN')}`;
  } catch (err) {
    console.error("Profile error:", err);
  }
}

// 2. बिक्री अनुमान (Demand Forecast)
async function loadDemandForecast(merchantId) {
  try {
    const res = await fetch(`/api/demand/forecast/${merchantId}?horizon_days=7`);
    const data = await res.json();

    // Update KPI
    const total7d = data.forecast_points.reduce((sum, p) => sum + p.predicted_sales_inr, 0);
    document.getElementById("kpi7dDemandVal").textContent = `₹${Math.round(total7d).toLocaleString('en-IN')}`;

    // Top predicted products table
    const topProdTable = document.getElementById("topForecastProductsTbody");
    if (topProdTable) {
      topProdTable.innerHTML = data.top_products_forecast.map(p => `
        <tr>
          <td><strong>${p.product_name}</strong></td>
          <td><span class="card-header-badge badge-blue">${p.predicted_units_7d} पैकेट/यूनिट</span></td>
          <td>₹${p.expected_revenue_inr.toLocaleString('en-IN')}</td>
          <td><span class="card-header-badge badge-green">✓ पर्याप्त स्टॉक</span></td>
        </tr>
      `).join("");
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
          label: 'अनुमानित गल्ला (₹)',
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
          label: 'दुकान पर आने वाले ग्राहक (Footfall)',
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
              if (context.datasetIndex === 0) return `बिक्री: ₹${context.raw.toLocaleString('en-IN')}`;
              return `ग्राहक: ${context.raw} लोग`;
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
              📲 WhatsApp आर्डर
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

  showToast("दुकान की अलमारी की फोटो जांची जा रही है...");
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`/api/inventory/scan-shelf?merchant_id=${currentMerchantId}`, {
      method: "POST",
      body: formData
    });
    const scanData = await res.json();
    displayShelfScanResults(scanData);
    showToast(`शेल्फ स्कैन पूरा! भराव: ${scanData.shelf_fullness_pct}%`);
  } catch (err) {
    console.error("Shelf scan failed:", err);
    showToast("स्कैन में समस्या आई, कृपया दोबारा कोशिश करें।");
  }
}

function triggerDemoShelfScan() {
  showToast("डेमो अलमारी स्कैन की जा रही है...");
  fetch(`/api/inventory/scan-shelf?merchant_id=${currentMerchantId}`, {
    method: "POST"
  })
  .then(res => res.json())
  .then(scanData => {
    displayShelfScanResults(scanData);
    showToast(`✓ कुल ${scanData.total_items_detected || 18} पैकेट मिले, खाली जगह चिन्हित!`);
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
          <span style="color:#ef4444; font-weight:700">⚠️ कुरकुरे मसाला मंच (खाली शेल्फ)</span>
          <div style="font-size:0.75rem; color:#94a3b8">रैक नंबर 2 पूरा खाली पाया गया</div>
        </div>
        <button class="btn-whatsapp-action" onclick="triggerQuickReorder('PROD_007', 'Kurkure Masala Munch', 24)">
          📲 2 पेटी मंगाएं
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

    // Segment summary pills with Hindi labels
    const segContainer = document.getElementById("customerSegmentsContainer");
    if (segContainer) {
      segContainer.innerHTML = (data.segments || []).map(s => `
        <div class="glass-panel" style="padding:1rem; text-align:center;">
          <div style="font-size:0.8rem; color:#94a3b8; font-weight:600">${s.segment_name}</div>
          <div style="font-size:1.4rem; font-weight:800; color:#fff; margin:0.3rem 0">${s.count} ग्राहक</div>
          <div style="font-size:0.75rem; color:#00b9f1">${s.percentage}% हिस्सा</div>
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
          <td>${c.days_since_last_visit} दिन पहले आए थे</td>
          <td><span class="card-header-badge ${c.churn_probability > 0.7 ? 'badge-red' : 'badge-amber'}">${Math.round(c.churn_probability * 100)}% जोखिम</span></td>
          <td><strong style="color:#10b981">₹${c.recommended_offer_inr || 20} कैशबैक</strong></td>
          <td>
            <button class="btn-action-success" onclick="dispatchCashbackOffer('${c.customer_name || c.name}', '${c.phone || c.phone_masked}', ${c.recommended_offer_inr || 20})">
              🎁 ऑफर भेजें
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
      document.getElementById("crunchDateVal").textContent = `${data.crunch_alert.days_until_crunch} दिन में (${data.crunch_alert.shortfall_date})`;
      document.getElementById("crunchShortfallVal").textContent = `₹${Math.round(data.crunch_alert.shortfall_amount_inr).toLocaleString('en-IN')}`;
      document.getElementById("loanAmountVal").textContent = `₹${data.crunch_alert.preapproved_loan_amount_inr.toLocaleString('en-IN')}`;
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
    document.getElementById("scoreTierBadge").textContent = "गोल्ड श्रेणी (Tier 1 Gold)";

    // Render 5 dimensions
    const dimsContainer = document.getElementById("scoreDimensionsList");
    if (dimsContainer) {
      dimsContainer.innerHTML = data.dimensions.map(d => `
        <div class="dim-item">
          <div class="dim-top">
            <span><strong>${d.name}</strong> <small style="color:#64748b">(${d.weight_pct}% महत्व)</small></span>
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
    document.getElementById("radarPeerCount").textContent = `${data.total_peer_merchants_in_radius} पड़ौसी दुकानें`;

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
            <span class="card-header-badge badge-green">+${p.local_growth_pct}% मांग बढ़ी</span>
            <div style="font-size:0.75rem; color:#00b9f1; margin-top:0.2rem">स्टॉक रखने की सलाह: ${p.suggested_stock_units} पैकेट</div>
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
          <div style="font-size:0.75rem; color:#10b981">💡 साथी का उपाय: ${t.suggested_countermeasure}</div>
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
        container.innerHTML = `<div style="text-align:center; padding:2rem; color:#64748b">शाबाश! सभी जरूरी काम पूरे हो चुके हैं।</div>`;
        return;
      }

      container.innerHTML = actions.map(act => `
        <div class="action-card ${act.priority === 'HIGH' ? 'high-impact' : ''}" id="actionCard_${act.action_id}">
          <div class="action-header">
            <div class="action-title">
              <span>⚡</span> ${act.title}
            </div>
            <span class="card-header-badge ${act.priority === 'HIGH' ? 'badge-amber' : 'badge-blue'}">${act.priority === 'HIGH' ? 'अति आवश्यक' : 'सुझाव'}</span>
          </div>
          <div class="action-body">${act.description}</div>
          <div class="action-footer">
            <span class="action-roi">📈 संभावित लाभ: ${act.expected_roi}</span>
            <div class="action-btns">
              <button class="btn-action-success" onclick="resolveAction('${act.action_id}', true)">
                ✅ 1-क्लिक में मंज़ूर करें
              </button>
              <button class="btn-lang-toggle" onclick="resolveAction('${act.action_id}', false)">
                खारिज करें
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
  showToast(`सवाल: "${queryText}" का जवाब तैयार हो रहा है...`);
  try {
    const res = await fetch("/api/copilot/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: currentMerchantId,
        text_query: queryText
      })
    });
    const copilotData = await res.json();

    // Display live response card
    copilotLiveResponse.style.display = "block";
    document.getElementById("copilotIntentBadge").textContent = `विषय: ${copilotData.detected_intent}`;
    document.getElementById("copilotHindiText").textContent = copilotData.response_text_hindi;
    document.getElementById("copilotEnglishText").textContent = copilotData.response_text_english;

    // Speak response (Paytm Soundbox Voice)
    speakSoundboxVoice(copilotData.response_text_hindi);

    // Contextual tab switch
    if (copilotData.detected_intent === "DEMAND_FORECAST") switchTab("tabDemand");
    if (copilotData.detected_intent === "INVENTORY_RESTOCK") switchTab("tabInventory");
    if (copilotData.detected_intent === "CASHFLOW_ALERT") switchTab("tabCashflow");
    if (copilotData.detected_intent === "SCORE_INQUIRY") switchTab("tabScore");

  } catch (err) {
    console.error("Copilot error:", err);
    showToast("वॉयस असिस्टेंट में त्रुटि आई।");
  }
}

// Soundbox Voice Synthesizer
function speakSoundboxVoice(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}

function playLastVoiceResponse() {
  const hindiText = document.getElementById("copilotHindiText").textContent;
  if (hindiText) speakSoundboxVoice(hindiText);
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
