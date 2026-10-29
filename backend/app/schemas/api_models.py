from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import date, datetime

# --- Merchant Schemas ---
class MerchantProfile(BaseModel):
    merchant_id: str
    name: str
    name_hi: Optional[str] = None
    name_en: Optional[str] = None
    business_name: str
    business_name_hi: Optional[str] = None
    business_name_en: Optional[str] = None
    category: str
    category_hi: Optional[str] = None
    category_en: Optional[str] = None
    city: str
    city_hi: Optional[str] = None
    city_en: Optional[str] = None
    pincode: str
    latitude: float
    longitude: float
    joined_date: str
    paytm_soundbox: bool = True
    paytm_postpaid_enabled: bool = True
    tier: str = "Silver"
    tier_badge: str = "गोल्ड व्यापारी 🥇"
    tier_badge_hi: Optional[str] = None
    tier_badge_en: Optional[str] = None
    monthly_gmv: float
    avg_daily_sales_inr: float = 14850.0
    soundbox_serial_id: str = "SBX-4G-99201"
    merchantmind_score: int = 742
    total_transactions_30d: int

class MerchantKPIs(BaseModel):
    today_revenue: float
    yesterday_revenue: float
    week_revenue: float
    month_revenue: float
    top_selling_item: str
    active_customers_count: int
    at_risk_customers_count: int
    pending_actions_count: int
    merchantmind_score: int
    cash_shortfall_risk: bool

# --- Demand Forecasting Schemas ---
class DemandForecastPoint(BaseModel):
    date: str
    predicted_sales_inr: float
    predicted_transactions: int
    predicted_footfall: Optional[int] = None
    confidence_lower: float
    confidence_upper: float
    demand_factors: List[str]
    is_festival: bool = False
    festival_name: Optional[str] = None
    weather_condition: str = "Normal"

class ProductDemandForecast(BaseModel):
    product_name: str
    category: str
    current_daily_avg: float
    predicted_7d_total: float
    predicted_units_7d: Optional[int] = None
    expected_revenue_inr: Optional[float] = None
    growth_rate_pct: float
    recommendation: str

class DemandForecastResponse(BaseModel):
    merchant_id: str
    forecast_horizon_days: int
    historical_sales_mape: float
    today_estimated_sales_inr: Optional[float] = None
    growth_vs_normal_pct: Optional[float] = None
    forecast_points: List[DemandForecastPoint]
    top_products_forecast: List[ProductDemandForecast]
    external_factors: Optional[List[Dict[str, Any]]] = None
    pro_tip_hi: Optional[str] = None
    pro_tip_en: Optional[str] = None
    actionable_insight: str
    hindi_audio_summary: Optional[str] = None

# --- Smart Inventory & Shelf Scanning Schemas ---
class InventoryItem(BaseModel):
    item_id: str
    name: str
    category: str
    current_stock: int
    unit: str
    reorder_point: int
    optimal_stock_level: int
    unit_cost_inr: float
    selling_price_inr: float
    stock_status: str  # "healthy", "low", "critical", "overstocked"
    days_until_stockout: float
    dead_stock: bool = False

class BoundingBox(BaseModel):
    product_name: str
    confidence: float
    bbox: List[float] # [x1, y1, x2, y2] normalized 0-1
    stock_status: str
    estimated_units: int

class ShelfScanResponse(BaseModel):
    scan_id: str
    timestamp: str
    detected_products_count: int
    total_items_detected: Optional[int] = None
    shelf_fullness_pct: Optional[float] = 72.0
    low_stock_items: List[str]
    out_of_stock_items: List[str]
    critical_stockouts: Optional[List[Dict[str, Any]]] = None
    detections: List[BoundingBox]
    reorder_recommendations: List[Dict[str, Any]]
    suggested_cross_sell: List[str]
    image_annotated_url: Optional[str] = None
    annotated_image_base64: Optional[str] = None

# --- Customer Retention & Churn Schemas ---
class CustomerSegment(BaseModel):
    segment_name: str  # "Champions", "Loyalists", "At-Risk Regulars", "Hibernating", "Lost"
    count: int
    percentage: float
    avg_ticket_size_inr: float
    description: str

class ChurnedCustomer(BaseModel):
    customer_id: str
    customer_name: str
    name: Optional[str] = None
    phone_masked: str
    phone: Optional[str] = None
    days_since_last_visit: int
    past_30d_visits: int
    total_lifetime_spend_inr: float
    churn_probability: float
    preferred_category: str
    recommended_offer_inr: float

class CustomerRetentionResponse(BaseModel):
    merchant_id: str
    total_tracked_customers: int
    retention_rate_pct: float
    segments: List[CustomerSegment]
    segments_distribution: Optional[List[Dict[str, Any]]] = None
    at_risk_customers: List[ChurnedCustomer]
    high_risk_customers: Optional[List[ChurnedCustomer]] = None
    at_risk_customers_count: Optional[int] = None
    suggested_winback_campaign: Dict[str, Any]

# --- Cash Flow Predictor Schemas ---
class CashFlowDay(BaseModel):
    date: str
    expected_inflow_inr: float
    expected_outflow_inr: float
    net_daily_inr: float
    cumulative_cash_balance_inr: float
    p10_inflow: float
    p90_inflow: float
    scheduled_expenses: List[str]

class CashCrunchAlert(BaseModel):
    shortfall_date: str
    shortfall_amount_inr: float
    days_until_crunch: int
    risk_level: str # "HIGH", "MEDIUM", "LOW"
    suggested_action: str
    suggested_action_hi: Optional[str] = None
    suggested_action_en: Optional[str] = None
    expense_reason_hi: Optional[str] = None
    expense_reason_en: Optional[str] = None
    preapproved_loan_amount_inr: float
    preapproved_loan_interest_pct: float

class CashFlowResponse(BaseModel):
    merchant_id: str
    current_cash_reserve_inr: float
    forecast_days: int
    projected_days: List[CashFlowDay]
    crunch_alert: Optional[CashCrunchAlert] = None
    cashflow_health_status: str = "HEALTHY" # "CRUNCH_ALERT" or "HEALTHY_SURPLUS"
    health_summary_hi: Optional[str] = None
    health_summary_en: Optional[str] = None
    net_30d_projected_cash_change_inr: Optional[float] = None

# --- MerchantMind Score Schemas ---
class DimensionScore(BaseModel):
    name: str
    name_hi: Optional[str] = None
    name_en: Optional[str] = None
    weight_pct: int
    score: int # 0 to 100
    max_score: int = 100
    grade: str # A+, A, B, C, D
    key_driver: str
    improvement_tip: str

class MerchantMindScoreResponse(BaseModel):
    merchant_id: str
    total_score: int # 0 to 900
    tier: str # "Platinum (800+)", "Gold (700-799)", "Silver (550-699)", "Bronze (<550)"
    tier_badge: Optional[str] = None
    tier_badge_hi: Optional[str] = None
    tier_badge_en: Optional[str] = None
    percentile_in_category: float
    dimensions: List[DimensionScore]
    shap_top_contributors: List[Dict[str, Any]]
    preapproved_benefits: List[str]
    immediate_actions_to_boost_score: List[str]
    immediate_actions_to_boost_score_hi: Optional[List[str]] = None
    immediate_actions_to_boost_score_en: Optional[List[str]] = None
    preapproved_loan_inr: int = 0
    loan_interest_rate_monthly_pct: Optional[float] = None
    loan_status_en: str = "Pre-Approved Loan"
    loan_status_hi: str = "प्री-एप्रूव्ड लोन"
    loan_subtext_en: str = "₹25,000 available"
    loan_subtext_hi: str = "₹25,000 तुरंत उपलब्ध"
    is_preapproved: bool = True

# --- Hyperlocal Competitor Radar Schemas ---
class CompetitorTrend(BaseModel):
    title: str
    title_hi: str = ""
    title_en: str = ""
    product_name: str = ""
    category: str
    category_hi: str = ""
    category_en: str = ""
    growth_rate_pct: float
    local_growth_pct: float = 0.0
    nearby_adoption_pct: float
    urgency: str # "High Opportunity", "Medium", "Opportunity", "Competitive Threat"
    urgency_hi: str = ""
    urgency_en: str = ""
    details: str
    details_hi: str = ""
    details_en: str = ""
    suggested_stock_units: int = 15
    estimated_extra_revenue_inr: float = 12000.0

class CompetitorThreatAlert(BaseModel):
    threat_type: str
    threat_type_hi: str = ""
    threat_type_en: str = ""
    description: str
    description_hi: str = ""
    description_en: str = ""
    severity: str = "MEDIUM" # "HIGH", "MEDIUM", "LOW"
    suggested_countermeasure: str
    suggested_countermeasure_hi: str = ""
    suggested_countermeasure_en: str = ""

class UntappedOpportunity(BaseModel):
    title: str
    title_hi: str = ""
    title_en: str = ""
    potential_revenue_inr: float = 15000.0
    action_plan: str
    action_plan_hi: str = ""
    action_plan_en: str = ""

class CompetitorRadarResponse(BaseModel):
    merchant_id: str
    neighborhood: str
    neighborhood_cluster: str = ""
    neighborhood_cluster_hi: str = ""
    neighborhood_cluster_en: str = ""
    pincode: str
    total_peer_merchants_in_radius: int
    peer_avg_monthly_gmv_inr: float
    peer_avg_daily_sales_inr: float = 12500.0
    merchant_daily_sales_inr: float = 14850.0
    merchant_percentile: float
    percentile_rank_label_hi: str = ""
    percentile_rank_label_en: str = ""
    market_summary_hi: str = ""
    market_summary_en: str = ""
    trending_products: List[CompetitorTrend]
    threat_alerts: List[CompetitorThreatAlert]
    threat_alerts_raw: List[str] = []
    untapped_opportunities: List[UntappedOpportunity]
    untapped_opportunities_raw: List[str] = []

# --- Agentic Actions Schemas ---
class AgenticAction(BaseModel):
    action_id: str
    action_type: str # "REORDER_WHATSAPP", "CUSTOMER_WINBACK_COUPON", "PRICE_UPDATE", "LOAN_APPLY", "SUPPLIER_DISCOUNT", "FESTIVE_PROMOTION"
    action_type_hi: str = ""
    action_type_en: str = ""
    title: str
    title_hi: str = ""
    title_en: str = ""
    description: str
    description_hi: str = ""
    description_en: str = ""
    priority: str = "HIGH" # "HIGH", "MEDIUM", "LOW"
    priority_hi: str = "अति आवश्यक"
    priority_en: str = "HIGH"
    details: Dict[str, Any]
    status: str # "PENDING_APPROVAL", "EXECUTED", "REJECTED"
    created_at: str
    requires_confirmation: bool = True
    estimated_roi_inr: float = 0.0
    expected_roi: str = ""
    expected_roi_hi: str = ""
    expected_roi_en: str = ""
    execution_log: Optional[str] = None
    execution_log_hi: Optional[str] = None
    execution_log_en: Optional[str] = None

class ActionApprovalRequest(BaseModel):
    action_id: str
    approved: bool
    modified_parameters: Optional[Dict[str, Any]] = None

# --- Voice & Chat Copilot Schemas ---
class VoiceQueryRequest(BaseModel):
    merchant_id: str
    language: str = "hi" # "hi", "mr", "ta", "en"
    audio_base64: Optional[str] = None
    text_query: Optional[str] = None

class VoiceQueryResponse(BaseModel):
    recognized_text: str
    detected_intent: str
    response_text_hindi: str
    response_text_english: str
    audio_response_base64: Optional[str] = None
    linked_action: Optional[AgenticAction] = None
    suggested_ui_tab: Optional[str] = None
