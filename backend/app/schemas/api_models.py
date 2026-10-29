from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import date, datetime

# --- Merchant Schemas ---
class MerchantProfile(BaseModel):
    merchant_id: str
    name: str
    business_name: str
    business_name_en: Optional[str] = None
    category: str
    city: str
    pincode: str
    latitude: float
    longitude: float
    joined_date: str
    paytm_soundbox: bool = True
    paytm_postpaid_enabled: bool = True
    tier: str = "Silver"
    tier_badge: str = "गोल्ड व्यापारी 🥇"
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
    growth_rate_pct: float
    recommendation: str

class DemandForecastResponse(BaseModel):
    merchant_id: str
    forecast_horizon_days: int
    historical_sales_mape: float
    forecast_points: List[DemandForecastPoint]
    top_products_forecast: List[ProductDemandForecast]
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
    preapproved_loan_amount_inr: float
    preapproved_loan_interest_pct: float

class CashFlowResponse(BaseModel):
    merchant_id: str
    current_cash_reserve_inr: float
    forecast_days: int
    projected_days: List[CashFlowDay]
    crunch_alert: Optional[CashCrunchAlert] = None

# --- MerchantMind Score Schemas ---
class DimensionScore(BaseModel):
    name: str
    weight_pct: int
    score: int # 0 to 100
    grade: str # A+, A, B, C, D
    key_driver: str
    improvement_tip: str

class MerchantMindScoreResponse(BaseModel):
    merchant_id: str
    total_score: int # 0 to 900
    tier: str # "Platinum (800+)", "Gold (700-799)", "Silver (550-699)", "Bronze (<550)"
    percentile_in_category: float
    dimensions: List[DimensionScore]
    shap_top_contributors: List[Dict[str, Any]]
    preapproved_benefits: List[str]
    immediate_actions_to_boost_score: List[str]

# --- Hyperlocal Competitor Radar Schemas ---
class CompetitorTrend(BaseModel):
    title: str
    category: str
    growth_rate_pct: float
    nearby_adoption_pct: float
    urgency: str # "High", "Medium", "Opportunity"
    details: str

class CompetitorRadarResponse(BaseModel):
    merchant_id: str
    neighborhood: str
    pincode: str
    total_peer_merchants_in_radius: int
    peer_avg_monthly_gmv_inr: float
    merchant_percentile: float
    trending_products: List[CompetitorTrend]
    threat_alerts: List[str]
    untapped_opportunities: List[str]

# --- Agentic Actions Schemas ---
class AgenticAction(BaseModel):
    action_id: str
    action_type: str # "REORDER_WHATSAPP", "CUSTOMER_WINBACK_COUPON", "PRICE_UPDATE", "LOAN_APPLY"
    title: str
    description: str
    details: Dict[str, Any]
    status: str # "PENDING_APPROVAL", "EXECUTED", "REJECTED"
    created_at: str
    requires_confirmation: bool = True
    estimated_roi_inr: float

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
