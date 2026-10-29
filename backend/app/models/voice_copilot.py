import os
import re
import json
import requests
import base64
from typing import Dict, Any, Optional
from datetime import datetime
from backend.app.config import settings
from backend.app.core.logger import logger
from backend.app.data.store import db
from backend.app.models.demand_forecaster import demand_engine
from backend.app.models.inventory_optimizer import inventory_engine
from backend.app.models.customer_retention import retention_engine
from backend.app.models.cashflow_predictor import cashflow_engine
from backend.app.models.merchantmind_scorer import scorer_engine
from backend.app.models.competitor_radar import competitor_radar

class VoiceCopilot:
    """Conversational Voice-First Business Copilot powered by Sarvam AI Indic Models + Gemini Reasoning + Local Knowledge Engine."""
    
    def __init__(self):
        self.sarvam_key = settings.SARVAM_API_KEY
        self.gemini_key = settings.GEMINI_API_KEY
        logger.info(f"Initialized VoiceCopilot. Sarvam Key Configured: {bool(self.sarvam_key)}, Gemini Key: {bool(self.gemini_key)}")

    def _build_merchant_context(self, merchant_id: str) -> Dict[str, Any]:
        """Builds a rich, real-time snapshot of the merchant's business for context-aware responses."""
        m = db.get_merchant(merchant_id) or {
            "merchant_id": merchant_id,
            "name": "व्यापारी साथी (Merchant Partner)",
            "business_name": "आपकी दुकान",
            "category": "किराना स्टोर",
            "city": "भारत",
            "tier_badge": "गोल्ड व्यापारी 🥇",
            "avg_daily_sales_inr": 14850.0,
            "soundbox_serial_id": "SBX-4G-99201"
        }
        
        # Name handling (bilingual)
        name_hi = m.get("name_hi")
        name_en = m.get("name_en")
        if not name_hi or not name_en:
            raw_name = m.get("name", "व्यापारी")
            if "(" in raw_name and ")" in raw_name:
                name_en = raw_name.split("(")[1].replace(")", "").strip()
                name_hi = raw_name.split("(")[0].strip()
            else:
                name_hi = raw_name
                name_en = raw_name

        first_name_hi = name_hi.split()[0]
        first_name_en = name_en.split()[0]
        owner_title_hi = f"{first_name_hi} जी"
        owner_title_en = f"{first_name_en} ji"
        store_name_hi = m.get("business_name_hi", m.get("business_name", "आपकी दुकान"))
        store_name_en = m.get("business_name_en", store_name_hi)

        # Sales history
        sales_hist = db.get_sales_history(merchant_id)
        yest = sales_hist[-1] if len(sales_hist) >= 1 else {"revenue_inr": 11650.0, "transactions": 104, "date": "2026-10-28", "day_of_week": "Wednesday"}
        two_d_ago = sales_hist[-2] if len(sales_hist) >= 2 else {"revenue_inr": 10614.0, "transactions": 80, "date": "2026-10-27", "day_of_week": "Tuesday"}
        three_d_ago = sales_hist[-3] if len(sales_hist) >= 3 else {"revenue_inr": 10410.0, "transactions": 100, "date": "2026-10-26", "day_of_week": "Monday"}
        last_7d_total = sum(s["revenue_inr"] for s in sales_hist[-7:]) if len(sales_hist) >= 7 else m.get("avg_daily_sales_inr", 14850.0) * 7

        # Inventory
        inv = db.get_inventory(merchant_id)
        critical_items = [it["name"] for it in inv if it.get("stock_status") == "critical"]
        low_items = [it["name"] for it in inv if it.get("stock_status") == "low"]

        # Demand forecast
        demand = demand_engine.predict_demand(merchant_id, horizon_days=7)
        top_items = demand.get("top_products_forecast", [])

        # Cashflow
        cf = cashflow_engine.project_cashflow(merchant_id)
        crunch = cf.get("crunch_alert")

        # Score
        score = scorer_engine.calculate_score(merchant_id)

        # Retention
        ret = retention_engine.analyze_retention(merchant_id)
        at_risk = ret.get("at_risk_customers", [])

        return {
            "merchant_id": merchant_id,
            "owner_name": m.get("name"),
            "owner_name_hi": owner_title_hi,
            "owner_name_en": owner_title_en,
            "store_name": store_name_hi,
            "store_name_hi": store_name_hi,
            "store_name_en": store_name_en,
            "category": m.get("category"),
            "city": m.get("city"),
            "soundbox_id": m.get("soundbox_serial_id"),
            "tier": m.get("tier_badge", "Gold"),
            "daily_sales": round(m.get("avg_daily_sales_inr", 14850.0)),
            "yesterday_sales": round(yest.get("revenue_inr", 0)),
            "yesterday_date": yest.get("date"),
            "yesterday_dow": yest.get("day_of_week", ""),
            "yesterday_txns": yest.get("transactions", 0),
            "sales_2d_ago": round(two_d_ago.get("revenue_inr", 0)),
            "date_2d_ago": two_d_ago.get("date"),
            "dow_2d_ago": two_d_ago.get("day_of_week", ""),
            "txns_2d_ago": two_d_ago.get("transactions", 0),
            "sales_3d_ago": round(three_d_ago.get("revenue_inr", 0)),
            "date_3d_ago": three_d_ago.get("date"),
            "dow_3d_ago": three_d_ago.get("day_of_week", ""),
            "sales_last_7d": round(last_7d_total),
            "critical_stock": critical_items,
            "low_stock": low_items,
            "top_forecast_items": [f"{p['product_name']} ({int(p.get('predicted_7d_total', p.get('predicted_units_7d', 20)))} units)" for p in top_items[:2]] if top_items else ["दाल व आटा", "खाद्य तेल"],
            "cashflow_crunch": f"{crunch['shortfall_amount_inr']} INR on {crunch['shortfall_date']}" if crunch else "None",
            "preapproved_loan": round(crunch.get("preapproved_loan_amount_inr", 25000.0)) if crunch else 25000,
            "credit_score": score.get("total_score", 742),
            "score_tier": score.get("tier_badge", "Gold"),
            "at_risk_customers_count": len(at_risk),
            "top_at_risk_customer": at_risk[0]["name"] if at_risk else "None"
        }

    def _call_gemini_reasoning(self, query: str, context: Dict[str, Any]) -> Optional[Dict[str, str]]:
        """Invokes Google Gemini with the merchant's real business context."""
        try:
            from dotenv import load_dotenv
            load_dotenv(override=True)
        except Exception:
            pass

        api_key = os.getenv("GEMINI_API_KEY") or self.gemini_key
        if not api_key:
            return None
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            prompt = f"""
You are DukaanSaathi AI (दुकान साथी), an intelligent voice business copilot built for Indian shopkeepers using Paytm Soundbox.
Address the shopkeeper warmly as "{context['owner_name_hi']}" in Hindi, and "{context['owner_name_en']}" in English.

Store Profile:
- Owner: {context['owner_name']}
- Store Name: {context['store_name']}
- Category: {context['category']}
- City: {context['city']}
- Credit Score: {context['credit_score']} / 900 ({context['score_tier']})
- Average Daily Sales: ₹{context['daily_sales']}
- Yesterday Sales ({context['yesterday_date']}, {context['yesterday_dow']}): ₹{context['yesterday_sales']} ({context['yesterday_txns']} transactions)
- 2 Days Ago Sales ({context['date_2d_ago']}, {context['dow_2d_ago']}): ₹{context['sales_2d_ago']} ({context['txns_2d_ago']} transactions)
- 3 Days Ago Sales ({context['date_3d_ago']}): ₹{context['sales_3d_ago']}
- Last 7 Days Total Sales: ₹{context['sales_last_7d']}
- Out of Stock Items: {', '.join(context['critical_stock']) if context['critical_stock'] else 'None'}
- Low Stock Items: {', '.join(context['low_stock']) if context['low_stock'] else 'None'}
- Projected Top Selling Items: {', '.join(context['top_forecast_items'])}
- Cash Shortfall Warning: {context['cashflow_crunch']}
- Pre-approved Loan: ₹{context['preapproved_loan']}
- Inactive / At-Risk Regular Customers: {context['at_risk_customers_count']} (e.g., {context['top_at_risk_customer']})

User Query: "{query}"

Instructions:
1. Answer the query directly and accurately using the store facts above.
2. If the user asks about past sales (yesterday, 2 days before, last week), quote the EXACT numbers from the store profile above.
3. If the user asks about demand or products, ONLY recommend products matching this store's category ({context['category']}) and listed in the store profile above. NEVER recommend grocery items to a non-grocery store.
4. Address the merchant by their actual name: {context['owner_name']}.
5. Output MUST be valid JSON with exactly two fields:
   "response_hindi": "Natural Hindi answer in Devanagari script",
   "response_english": "Natural English answer"
Do not add markdown code fences around the JSON.
"""
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )
            raw = response.text.strip()
            if raw.startswith("```json"):
                raw = raw[7:]
            if raw.startswith("```"):
                raw = raw[3:]
            if raw.endswith("```"):
                raw = raw[:-3]
            parsed = json.loads(raw.strip())
            return {
                "hindi": parsed.get("response_hindi", ""),
                "english": parsed.get("response_english", "")
            }
        except Exception as e:
            logger.warning(f"Gemini API call failed or unavailable: {e}. Falling back to smart local engine.")
            return None

    def _local_reasoning(self, query_text: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """High-precision local business intelligence engine for instant offline response."""
        q_lower = query_text.lower().strip()
        owner_hi = context["owner_name_hi"]
        owner_en = context["owner_name_en"]
        store_hi = context.get("store_name_hi", context["store_name"])
        store_en = context.get("store_name_en", store_hi)

        # A. PAST / HISTORICAL SALES INTENT
        # e.g., "what was sales 2 days before?", "yesterday sales", "2 din pehle", "kal ka galla", "last week"
        is_past = any(w in q_lower for w in ["yesterday", "before", "ago", "pehle", "parson", "beeta", "pichla", "pichle", "history", "past", "last week", "last month", "tarikh", "date"])
        is_sales = any(w in q_lower for w in ["sales", "sale", "bikri", "galla", "kamai", "revenue", "bika", "turnover", "dhandha"])

        if is_past or ("kal" in q_lower and any(w in q_lower for w in ["tha", "thi", "galla", "kitna", "was"])):
            # Check specific days offset
            offset = None
            if "2 days" in q_lower or "2 din" in q_lower or "two days" in q_lower or "do din" in q_lower or "parson" in q_lower or "day before yesterday" in q_lower or "2 day" in q_lower:
                offset = 2
            elif "3 days" in q_lower or "3 din" in q_lower or "three days" in q_lower or "teen din" in q_lower or "3 day" in q_lower:
                offset = 3
            elif "yesterday" in q_lower or "kal" in q_lower or "1 day" in q_lower or "ek din" in q_lower or "last day" in q_lower:
                offset = 1
            else:
                m_match = re.search(r'(\d+)\s*(?:days?|din)\s*(?:before|ago|pehle)', q_lower)
                if m_match:
                    offset = int(m_match.group(1))

            if offset == 2:
                resp_hi = (
                    f"{owner_hi}, 2 दिन पहले ({context['date_2d_ago']}) {store_hi} की कुल बिक्री ₹{context['sales_2d_ago']:,} रही थी, "
                    f"जिसमें {context['txns_2d_ago']} ग्राहकों ने खरीदारी की थी।"
                )
                resp_en = (
                    f"{owner_en}, 2 days ago on {context['date_2d_ago']}, {store_en} recorded total sales of ₹{context['sales_2d_ago']:,} "
                    f"across {context['txns_2d_ago']} customer transactions."
                )
                return {"hi": resp_hi, "en": resp_en, "intent": "HISTORICAL_SALES", "tab": "tabDemand"}

            elif offset == 1:
                resp_hi = (
                    f"{owner_hi}, कल ({context['yesterday_date']}) आपकी दुकान की कुल बिक्री ₹{context['yesterday_sales']:,} रही थी, "
                    f"और {context['yesterday_txns']} ग्राहकों ने खरीदारी की थी।"
                )
                resp_en = (
                    f"{owner_en}, yesterday ({context['yesterday_date']}), total sales at {store_en} were ₹{context['yesterday_sales']:,} "
                    f"across {context['yesterday_txns']} customer transactions."
                )
                return {"hi": resp_hi, "en": resp_en, "intent": "HISTORICAL_SALES", "tab": "tabDemand"}

            elif offset == 3:
                resp_hi = (
                    f"{owner_hi}, 3 दिन पहले ({context['date_3d_ago']}) {store_hi} की कुल बिक्री ₹{context['sales_3d_ago']:,} रही थी।"
                )
                resp_en = (
                    f"{owner_en}, 3 days ago on {context['date_3d_ago']}, total sales at {store_en} were ₹{context['sales_3d_ago']:,}."
                )
                return {"hi": resp_hi, "en": resp_en, "intent": "HISTORICAL_SALES", "tab": "tabDemand"}

            elif any(w in q_lower for w in ["week", "hafte", "7 day", "7 din"]):
                resp_hi = (
                    f"{owner_hi}, पिछले 7 दिनों में {store_hi} की कुल बिक्री ₹{context['sales_last_7d']:,} रही है "
                    f"(औसत ₹{int(context['sales_last_7d']/7):,} प्रतिदिन)।"
                )
                resp_en = (
                    f"{owner_en}, over the past 7 days, total sales at {store_en} reached ₹{context['sales_last_7d']:,} "
                    f"(averaging ₹{int(context['sales_last_7d']/7):,}/day)."
                )
                return {"hi": resp_hi, "en": resp_en, "intent": "HISTORICAL_SALES", "tab": "tabDemand"}

        # B. TODAY'S ESTIMATED SALES
        if any(w in q_lower for w in ["aaj ka galla", "today sales", "today's sale", "today sale", "aaj kitna", "today's revenue", "sales today", "revenue today", "aaj ki bikri", "aaj ki sale"]):
            today_est = round(context["daily_sales"] * 1.12)
            resp_hi = (
                f"{owner_hi}, आज शाम तक {store_hi} का अनुमानित गल्ला लगभग ₹{today_est:,} रहने की उम्मीद है (दैनिक औसत: ₹{context['daily_sales']:,})।"
            )
            resp_en = (
                f"{owner_en}, today's projected sales for {store_en} are approximately ₹{today_est:,} (daily average: ₹{context['daily_sales']:,})."
            )
            return {"hi": resp_hi, "en": resp_en, "intent": "DEMAND_FORECAST", "tab": "tabDemand"}

        # C. FUTURE DEMAND FORECAST / FESTIVAL
        if any(w in q_lower for w in ["bikega", "demand", "forecast", "future", "festiv", "diwali", "aage kya", "what will sell", "what will be sold", "what to sell", "which product", "kya bikega", "highest demand"]):
            top_s = context["top_forecast_items"]
            item_lead = top_s[0] if top_s else "मुख्य उत्पाद"
            resp_hi = (
                f"{owner_hi}, {store_hi} के लिए अगले 7 दिनों में त्योहारों और ग्राहकी के कारण अच्छी बिक्री का अनुमान है। "
                f"सबसे ज्यादा मांग {item_lead} की रहेगी। क्या मैं सप्लायर को व्हाट्सऐप ऑर्डर भेज दूं?"
            )
            resp_en = (
                f"{owner_en}, festive demand is projected to stay strong at {store_en}. "
                f"Highest forecasted sales velocity is for {item_lead}. Would you like me to prepare a distributor WhatsApp order?"
            )
            return {"hi": resp_hi, "en": resp_en, "intent": "DEMAND_FORECAST", "tab": "tabDemand"}

        # D. INVENTORY / STOCK / OUT OF STOCK
        if any(w in q_lower for w in ["stock", "shelf", "reorder", "maal", "saman", "khatam", "inventory", "shortage", "empty", "khali", "depleted", "low stock", "out of stock"]):
            crit_text = ", ".join(context["critical_stock"]) if context["critical_stock"] else "कोई सामान पूरी तरह खत्म नहीं है"
            low_text = ", ".join(context["low_stock"][:2]) if context["low_stock"] else "स्टॉक सामान्य है"
            resp_hi = (
                f"{owner_hi}, {store_hi} की शेल्फ जांच में {crit_text} पाया गया है। "
                f"इसके अलावा {low_text} का स्टॉक भी रीऑर्डर पॉइंट से नीचे है। 1-क्लिक में व्हाट्सऐप आर्डर भेज सकते हैं।"
            )
            resp_en = (
                f"{owner_en}, shelf scanner report for {store_en}: Out of stock: {crit_text}. "
                f"Low stock alert: {low_text}. WhatsApp reorder is ready for approval in your Actions tab."
            )
            return {"hi": resp_hi, "en": resp_en, "intent": "INVENTORY_STATUS", "tab": "tabInventory"}

        # E. CUSTOMER CHURN / RETENTION
        if any(w in q_lower for w in ["customer", "grahak", "churn", "chhod", "regular", "lapsed", "retention", "cashback", "inactive", "purane"]):
            resp_hi = (
                f"{owner_hi}, आपके {context['at_risk_customers_count']} नियमित ग्राहक (जैसे {context['top_at_risk_customer']}) पिछले 15+ दिनों से दुकान नहीं आए हैं। "
                f"उन्हें वापस बुलाने के लिए ₹20 का विशेष पेटीएम कैशबैक ऑफर तैयार है।"
            )
            resp_en = (
                f"{owner_en}, {context['at_risk_customers_count']} regular customers (including {context['top_at_risk_customer']}) haven't visited {store_en} in over 15 days. "
                f"A ₹20 Paytm cashback winback campaign is ready."
            )
            return {"hi": resp_hi, "en": resp_en, "intent": "CUSTOMER_RETENTION", "tab": "tabRetention"}

        # F. CASH FLOW / SHORTFALL / LOAN
        if any(w in q_lower for w in ["paise", "cash", "shortfall", "loan", "karz", "balance", "crunch", "rupaye", "kiraya", "rent", "bill"]):
            resp_hi = (
                f"{owner_hi}, दुकान का किराया और डिस्ट्रीब्यूटर बिल के चलते नकदी की संभावित तंगी का अलर्ट है। "
                f"आपके लिए ₹{context['preapproved_loan']:,} का पेटीएम तुरंत व्यापारी क्रेडिट 1.2% मासिक ब्याज पर प्री-अप्रूव्ड है।"
            )
            resp_en = (
                f"{owner_en}, upcoming rent and wholesaler invoices may cause a temporary cash crunch. "
                f"A pre-approved ₹{context['preapproved_loan']:,} Paytm Merchant Working Capital credit is ready for instant disbursal."
            )
            return {"hi": resp_hi, "en": resp_en, "intent": "CASH_FLOW", "tab": "tabCashflow"}

        # G. CREDIT SCORE / MERCHANTMIND
        if any(w in q_lower for w in ["score", "rating", "cibil", "credit", "health", "merchantmind"]):
            resp_hi = (
                f"{owner_hi}, {store_hi} का मर्चेंटमाइंड साख स्कोर 900 में से {context['credit_score']} ({context['score_tier']}) है! "
                f"इस उत्कृष्ट स्कोर के आधार पर आपको न्यूनतम ब्याज दर पर तुरंत लोन मिल सकता है।"
            )
            resp_en = (
                f"{owner_en}, {store_en}'s MerchantMind Credit Health Score is {context['credit_score']} / 900 ({context['score_tier']})! "
                f"This unlocks preferential rates on Paytm merchant financing."
            )
            return {"hi": resp_hi, "en": resp_en, "intent": "CREDIT_SCORE", "tab": "tabScore"}

        # H. STORE IDENTITY / ASSISTANT INFO
        if any(w in q_lower for w in ["who are you", "who am i", "kaun ho", "meri dukan", "shop name", "my store"]):
            resp_hi = (
                f"नमस्ते {owner_hi}! मैं आपका दुकान साथी AI असिस्टेंट हूँ। आपकी दुकान का नाम '{store_hi}', श्रेणी: {context['category']}, शहर: {context['city']} है। "
                f"आपका साउंडबॉक्स ({context['soundbox_id']}) सक्रिय है।"
            )
            resp_en = (
                f"Hello {owner_en}! I am DukaanSaathi AI, your business copilot for '{store_en}' ({context['category']}, {context['city']}) "
                f"connected to Paytm Soundbox {context['soundbox_id']}."
            )
            return {"hi": resp_hi, "en": resp_en, "intent": "GENERAL_ASSISTANCE", "tab": "tabDemand"}

        # I. DEFAULT FALLBACK
        resp_hi = (
            f"नमस्ते {owner_hi}! मैं {store_hi} का दुकान साथी AI हूँ। आप मुझसे कल की या 2 दिन पहले की बिक्री, आज क्या बिकेगा, "
            f"अलमारी में कौन सा सामान खत्म है, पुराने ग्राहकों के कैशबैक या लोन के बारे में पूछ सकते हैं।"
        )
        resp_en = (
            f"Hello {owner_en}! I am your DukaanSaathi AI partner for {store_en}. You can ask me about past sales (yesterday or 2 days ago), "
            f"demand forecasts, low stock items, customer retention, or instant loan pre-approvals."
        )
        return {"hi": resp_hi, "en": resp_en, "intent": "GENERAL_ASSISTANCE", "tab": "tabDemand"}

    def process_query(self, merchant_id: str, text_query: Optional[str] = None, audio_base64: Optional[str] = None, language: str = "hi") -> Dict[str, Any]:
        """
        Receives speech audio or text query, detects merchant intent, queries relevant module,
        and generates response in both Hindi and English tailored to the specific merchant.
        """
        query_text = text_query or ""
        
        # 1. Speech-to-Text via Sarvam AI if audio is provided and key is active
        if audio_base64 and self.sarvam_key:
            try:
                asr_text = self._sarvam_asr(audio_base64, language)
                if asr_text:
                    query_text = asr_text
            except Exception as e:
                logger.warning(f"Sarvam ASR call failed or timed out: {e}. Using fallback.")
                
        if not query_text:
            query_text = "आज क्या बिकेगा?"

        logger.info(f"Processing Voice Query: '{query_text}' for merchant {merchant_id}")

        # 2. Build live merchant context
        context = self._build_merchant_context(merchant_id)

        # 3. Try online LLM first if API key is configured
        llm_response = None
        if self.gemini_key:
            llm_response = self._call_gemini_reasoning(query_text, context)

        if llm_response and llm_response.get("hindi") and llm_response.get("english"):
            resp_hi = llm_response["hindi"]
            resp_en = llm_response["english"]
            intent = "AI_REASONING"
            suggested_tab = "tabDemand"
        else:
            local_res = self._local_reasoning(query_text, context)
            resp_hi = local_res["hi"]
            resp_en = local_res["en"]
            intent = local_res["intent"]
            suggested_tab = local_res["tab"]

        # 4. Text-to-Speech via Sarvam AI if key is configured
        audio_out = None
        if self.sarvam_key:
            try:
                audio_out = self._sarvam_tts(resp_hi)
            except Exception as e:
                logger.warning(f"Sarvam TTS generation failed: {e}")

        return {
            "recognized_text": query_text,
            "detected_intent": intent,
            "response_text_hindi": resp_hi,
            "response_text_english": resp_en,
            "audio_response_base64": audio_out,
            "suggested_ui_tab": suggested_tab
        }

    def _sarvam_asr(self, audio_base64: str, language: str) -> Optional[str]:
        """Calls Sarvam AI speech-to-text API."""
        url = "https://api.sarvam.ai/speech-to-text"
        headers = {"api-subscription-key": self.sarvam_key}
        data = {
            "model": "saaras:v1",
            "language_code": f"{language}-IN",
            "audio": audio_base64
        }
        res = requests.post(url, json=data, headers=headers, timeout=5)
        if res.status_code == 200:
            return res.json().get("transcript")
        return None

    def _sarvam_tts(self, text_hindi: str) -> Optional[str]:
        """Calls Sarvam AI text-to-speech API."""
        url = "https://api.sarvam.ai/text-to-speech"
        headers = {"api-subscription-key": self.sarvam_key}
        data = {
            "inputs": [text_hindi],
            "target_language_code": "hi-IN",
            "speaker": "meera",
            "pitch": 0,
            "pace": 1.05,
            "loudness": 1.2,
            "speech_sample_rate": 22050,
            "enable_preprocessing": True,
            "model": "bulbul:v1"
        }
        res = requests.post(url, json=data, headers=headers, timeout=6)
        if res.status_code == 200:
            audios = res.json().get("audios", [])
            return audios[0] if audios else None
        return None

voice_copilot = VoiceCopilot()
