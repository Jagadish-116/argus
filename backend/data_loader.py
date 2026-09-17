import os
import json
from typing import List, Dict
from models import Entity, Asset, Alert, Case
from data_generator import generate_synthetic_data

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

class DataLoader:
    def __init__(self, data_dir: str = DATA_DIR):
        self.data_dir = data_dir
        self.ensure_data_exists()
        
        self.entities: Dict[str, Entity] = {}
        self.assets: Dict[str, Asset] = {}
        self.alerts: Dict[str, Alert] = {}
        self.cases: Dict[str, Case] = {}
        
        self.load_all()

    def ensure_data_exists(self):
        required_files = ["entities.json", "assets.json", "alerts.json", "cases.json"]
        missing = [f for f in required_files if not os.path.exists(os.path.join(self.data_dir, f))]
        if missing:
            print(f"Data files missing {missing}. Generating synthetic dataset...")
            generate_synthetic_data()

    def load_all(self):
        # Load Entities
        with open(os.path.join(self.data_dir, "entities.json"), "r") as f:
            raw_entities = json.load(f)
            for item in raw_entities:
                e = Entity(**item)
                self.entities[e.entity_id] = e

        # Load Assets
        with open(os.path.join(self.data_dir, "assets.json"), "r") as f:
            raw_assets = json.load(f)
            for item in raw_assets:
                a = Asset(**item)
                self.assets[a.asset_id] = a

        # Load Alerts
        with open(os.path.join(self.data_dir, "alerts.json"), "r") as f:
            raw_alerts = json.load(f)
            for item in raw_alerts:
                al = Alert(**item)
                self.alerts[al.alert_id] = al

        # Load Cases
        with open(os.path.join(self.data_dir, "cases.json"), "r") as f:
            raw_cases = json.load(f)
            for item in raw_cases:
                c = Case(**item)
                self.cases[c.case_id] = c

    def get_entity(self, entity_id: str) -> Entity:
        return self.entities.get(entity_id)

    def get_entity_assets(self, entity_id: str) -> List[Asset]:
        return [a for a in self.assets.values() if a.entity_id == entity_id]

    def get_entity_alerts(self, entity_id: str) -> List[Alert]:
        return [al for al in self.alerts.values() if al.entity_id == entity_id]

    def get_entity_cases(self, entity_id: str) -> List[Case]:
        return [c for c in self.cases.values() if c.entity_id == entity_id]


if __name__ == "__main__":
    loader = DataLoader()
    print(f"Loaded {len(loader.entities)} entities, {len(loader.assets)} assets, {len(loader.alerts)} alerts, {len(loader.cases)} cases.")
