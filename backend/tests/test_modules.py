import unittest
from backend.app.data.store import db
from backend.app.models.demand_forecaster import demand_engine
from backend.app.models.inventory_optimizer import inventory_engine
from backend.app.models.shelf_scanner import shelf_scanner
from backend.app.models.customer_retention import retention_engine
from backend.app.models.cashflow_predictor import cashflow_engine
from backend.app.models.merchantmind_scorer import scorer_engine
from backend.app.models.competitor_radar import competitor_radar
from backend.app.models.agentic_action_engine import agentic_engine
from backend.app.models.voice_copilot import voice_copilot

class TestDukaanSaathiModules(unittest.TestCase):
    
    def setUp(self):
        self.merchant_id = "PAYTM_M_1001"

    def test_01_merchant_and_store(self):
        merchant = db.get_merchant(self.merchant_id)
        self.assertIsNotNone(merchant)
        self.assertEqual(merchant["merchant_id"], self.merchant_id)
        self.assertTrue(len(db.get_all_merchants()) >= 10)

    def test_02_demand_forecasting(self):
        res = demand_engine.predict_demand(self.merchant_id, horizon_days=7)
        self.assertEqual(len(res["forecast_points"]), 7)
        self.assertTrue(res["historical_sales_mape"] <= 12.0)
        self.assertTrue(len(res["top_products_forecast"]) >= 3)
        self.assertIn("hindi_audio_summary", res)

    def test_03_inventory_and_knowledge_graph(self):
        res = inventory_engine.get_inventory_status(self.merchant_id)
        self.assertTrue(res["total_skus"] >= 15)
        self.assertIn("stock_health", res)
        # Check knowledge graph
        recs = inventory_engine.get_complementary_recommendations("Brooke Bond Red Label Tea 250g")
        self.assertTrue(len(recs) >= 1)
        self.assertTrue(recs[0]["affinity_score"] > 0)

    def test_04_camera_shelf_scanner(self):
        scan = shelf_scanner.process_shelf_image()
        self.assertTrue(scan["detected_products_count"] >= 3)
        self.assertTrue(len(scan["low_stock_items"]) >= 1)
        self.assertIn("image_annotated_url", scan)
        self.assertTrue(scan["image_annotated_url"].startswith("data:image/jpeg;base64,"))

    def test_05_customer_retention(self):
        res = retention_engine.analyze_retention(self.merchant_id)
        self.assertTrue(res["total_tracked_customers"] >= 50)
        self.assertEqual(len(res["segments"]), 5)
        self.assertTrue(len(res["at_risk_customers"]) >= 1)
        self.assertIn("suggested_winback_campaign", res)

    def test_06_cashflow_predictor(self):
        res = cashflow_engine.project_cashflow(self.merchant_id, days=30)
        self.assertEqual(len(res["projected_days"]), 30)
        self.assertIsNotNone(res["crunch_alert"])
        self.assertEqual(res["crunch_alert"]["risk_level"], "HIGH")
        self.assertTrue(res["crunch_alert"]["preapproved_loan_amount_inr"] >= 20000)

    def test_07_merchantmind_score(self):
        res = scorer_engine.calculate_score(self.merchant_id)
        self.assertTrue(300 <= res["total_score"] <= 900)
        self.assertEqual(len(res["dimensions"]), 5)
        self.assertTrue(len(res["shap_top_contributors"]) >= 3)
        self.assertTrue(len(res["immediate_actions_to_boost_score"]) >= 2)

    def test_08_competitor_radar(self):
        res = competitor_radar.scan_neighborhood(self.merchant_id)
        self.assertTrue(res["total_peer_merchants_in_radius"] > 10)
        self.assertTrue(len(res["trending_products"]) >= 2)
        self.assertTrue(len(res["threat_alerts"]) >= 1)

    def test_09_agentic_actions(self):
        actions = agentic_engine.get_pending_actions(self.merchant_id)
        self.assertTrue(len(actions) >= 1)
        act_id = actions[0]["action_id"]
        # Approve action
        resolved = agentic_engine.execute_action(self.merchant_id, act_id, approved=True)
        self.assertEqual(resolved["status"], "EXECUTED")
        self.assertIn("execution_log", resolved)

    def test_10_voice_copilot(self):
        res = voice_copilot.process_query(self.merchant_id, text_query="Bhaiya, aaj kya bikega?")
        self.assertEqual(res["detected_intent"], "DEMAND_FORECAST")
        self.assertIn("तुषार जी", res["response_text_hindi"])
        self.assertIn("Tushar ji", res["response_text_english"])

if __name__ == "__main__":
    unittest.main()
