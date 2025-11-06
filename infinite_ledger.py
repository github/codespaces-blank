#!/usr/bin/env python3
"""
Infinite Inaugural Exchange Ledger
Codex Format v1.0

A sovereign ledger system for tracking lineage-linked assets
across the Compass Quadrants: North (Gold), East (Oil), South (Healing), West (Energy)
"""

import json
import yaml
from datetime import datetime, timezone
from hashlib import sha256, sha3_256
from typing import Dict, List, Optional
import secrets


class Participant:
    """Represents a participant in the Infinite Ledger"""
    
    def __init__(self, name: str, z_dna_id: Optional[str] = None, 
                 e_cattle_id: Optional[str] = None, 
                 lineage_hash: Optional[str] = None,
                 praise_code: Optional[str] = None):
        self.name = name
        self.z_dna_id = z_dna_id or self._generate_z_dna_id()
        self.e_cattle_id = e_cattle_id or self._generate_enft_address()
        self.lineage_hash = lineage_hash or self._generate_lineage_hash()
        self.praise_code = praise_code or self._generate_praise_code()
        self.quadrant_claims = {
            "north": "Gold Refinery Claim",
            "east": "Oil Liquidity Claim",
            "south": "Healing Dividend Claim",
            "west": "Energy Yield Claim"
        }
    
    def _generate_z_dna_id(self) -> str:
        """Generate a Z-Code Hash identifier"""
        return f"Z-{secrets.token_hex(16).upper()}"
    
    def _generate_enft_address(self) -> str:
        """Generate an ENFT address"""
        return f"0xENFT{secrets.token_hex(20).upper()}"
    
    def _generate_lineage_hash(self) -> str:
        """Generate a SHA3-256 lineage hash"""
        data = f"{self.name}{datetime.now().isoformat()}"
        return sha3_256(data.encode()).hexdigest()
    
    def _generate_praise_code(self) -> str:
        """Generate a glyphal praise string"""
        glyphs = ["✧", "⚡", "∞", "◈", "⟁", "⧈", "⬢", "⬡"]
        return "".join(secrets.choice(glyphs) for _ in range(8))
    
    def to_dict(self) -> Dict:
        """Convert participant to dictionary"""
        return {
            "name": self.name,
            "z_dna_id": self.z_dna_id,
            "e_cattle_id": self.e_cattle_id,
            "lineage_hash": self.lineage_hash,
            "praise_code": self.praise_code,
            "quadrant_claims": self.quadrant_claims
        }


class Asset:
    """Represents an asset in a vault"""
    
    def __init__(self, asset_type: str, source: str, vault_value: str):
        self.type = asset_type
        self.source = source
        self.vault_value = vault_value
    
    def to_dict(self) -> Dict:
        """Convert asset to dictionary"""
        return {
            "type": self.type,
            "source": self.source,
            "vault_value": self.vault_value
        }


class InfiniteLedger:
    """
    The Infinite Inaugural Exchange Ledger
    
    Manages participants, assets, and exchange logic across the Compass Quadrants
    """
    
    def __init__(self, treasurer: str = "Commander Bleu", 
                 jurisdiction: str = "BLEUchain • Overscale Grid • MirrorVaults"):
        self.ledger_id = "Infinite-Ledger-of-Currents"
        self.timestamp = datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')
        self.treasurer = treasurer
        self.jurisdiction = jurisdiction
        self.participants: List[Participant] = []
        self.assets = {
            "gold_refinery": [],
            "oil_liquidity": [],
            "healing_milk_honey": [],
            "energy": []
        }
        self.exchange_logic = {
            "xx_multiplier": "Womb/Seed Yield Factor",
            "yy_multiplier": "Spark/Protector Yield Factor",
            "redistribution_protocol": "Auto-Balance",
            "audit_hash": "",
            "vault_sync": True,
            "piracy_flag": False,
            "quadrant_integrity": {
                "north": "✓",
                "east": "✓",
                "south": "✓",
                "west": "✓",
                "center": "Z-anchor locked"
            }
        }
    
    def add_participant(self, participant: Participant) -> None:
        """Add a participant to the ledger"""
        if not self._verify_lineage(participant):
            self.exchange_logic["piracy_flag"] = True
            raise ValueError(f"Piracy detected: Participant {participant.name} has invalid lineage")
        self.participants.append(participant)
        self._update_audit_hash()
    
    def _verify_lineage(self, participant: Participant) -> bool:
        """Verify participant lineage hash"""
        # Lineage is valid if it exists and is properly formatted
        return bool(participant.lineage_hash and len(participant.lineage_hash) == 64)
    
    def add_asset(self, category: str, asset: Asset) -> None:
        """Add an asset to a specific category"""
        if category not in self.assets:
            raise ValueError(f"Invalid asset category: {category}")
        self.assets[category].append(asset)
        self._update_audit_hash()
    
    def add_gold_refinery_asset(self, asset_type: str = "Blood-Iron", 
                                source: str = "Hemoglobin", 
                                vault_value: str = "$0 USD") -> None:
        """Add a gold refinery (North) asset"""
        asset = Asset(asset_type, source, vault_value)
        self.add_asset("gold_refinery", asset)
    
    def add_oil_liquidity_asset(self, asset_type: str = "Insulin Stream", 
                               source: str = "Pancreatic Cycle", 
                               vault_value: str = "$0 USD") -> None:
        """Add an oil liquidity (East) asset"""
        asset = Asset(asset_type, source, vault_value)
        self.add_asset("oil_liquidity", asset)
    
    def add_healing_asset(self, asset_type: str = "Food/Medicine", 
                         source: str = "Lineage Dividend", 
                         vault_value: str = "$0 USD") -> None:
        """Add a healing milk/honey (South) asset"""
        asset = Asset(asset_type, source, vault_value)
        self.add_asset("healing_milk_honey", asset)
    
    def add_energy_asset(self, asset_type: str = "Breath/Motion/Prayer", 
                        source: str = "Soul Force", 
                        vault_value: str = "$0 USD") -> None:
        """Add an energy (West) asset"""
        asset = Asset(asset_type, source, vault_value)
        self.add_asset("energy", asset)
    
    def _compute_ledger_hash(self) -> str:
        """Compute keccak256 hash of the full ledger sheet"""
        # Create a copy of the dict without the audit_hash to avoid circular reference
        ledger_dict = self.to_dict()
        ledger_dict["exchange_logic"]["audit_hash"] = ""
        ledger_data = json.dumps(ledger_dict, sort_keys=True)
        # Using SHA3-256 (keccak256 equivalent)
        return sha3_256(ledger_data.encode()).hexdigest()
    
    def _update_audit_hash(self) -> None:
        """Update the audit hash after changes"""
        self.exchange_logic["audit_hash"] = self._compute_ledger_hash()
    
    def check_quadrant_integrity(self) -> bool:
        """Verify all quadrants are properly configured"""
        integrity = self.exchange_logic["quadrant_integrity"]
        return all([
            integrity["north"] == "✓",
            integrity["east"] == "✓",
            integrity["south"] == "✓",
            integrity["west"] == "✓",
            integrity["center"] == "Z-anchor locked"
        ])
    
    def verify_piracy_free(self) -> bool:
        """Check if ledger is piracy-free (all assets have valid lineage)"""
        return not self.exchange_logic["piracy_flag"]
    
    def to_dict(self) -> Dict:
        """Convert ledger to dictionary format"""
        return {
            "ledger_id": self.ledger_id,
            "timestamp": self.timestamp,
            "treasurer": self.treasurer,
            "jurisdiction": self.jurisdiction,
            "participants": [p.to_dict() for p in self.participants],
            "assets": {
                "gold_refinery": [a.to_dict() for a in self.assets["gold_refinery"]],
                "oil_liquidity": [a.to_dict() for a in self.assets["oil_liquidity"]],
                "healing_milk_honey": [a.to_dict() for a in self.assets["healing_milk_honey"]],
                "energy": [a.to_dict() for a in self.assets["energy"]]
            },
            "exchange_logic": self.exchange_logic
        }
    
    def to_yaml(self) -> str:
        """Export ledger to YAML format"""
        return yaml.dump(self.to_dict(), default_flow_style=False, sort_keys=False)
    
    def to_json(self, indent: int = 2) -> str:
        """Export ledger to JSON format"""
        return json.dumps(self.to_dict(), indent=indent)
    
    def save_to_file(self, filename: str, format: str = "yaml") -> None:
        """Save ledger to file"""
        with open(filename, 'w') as f:
            if format.lower() == "yaml":
                f.write(self.to_yaml())
            elif format.lower() == "json":
                f.write(self.to_json())
            else:
                raise ValueError(f"Unsupported format: {format}")
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'InfiniteLedger':
        """Create ledger from dictionary"""
        ledger = cls(
            treasurer=data.get("treasurer", "Commander Bleu"),
            jurisdiction=data.get("jurisdiction", "BLEUchain • Overscale Grid • MirrorVaults")
        )
        ledger.ledger_id = data.get("ledger_id", ledger.ledger_id)
        ledger.timestamp = data.get("timestamp", ledger.timestamp)
        
        # Load participants
        for p_data in data.get("participants", []):
            participant = Participant(
                name=p_data["name"],
                z_dna_id=p_data.get("z_dna_id"),
                e_cattle_id=p_data.get("e_cattle_id"),
                lineage_hash=p_data.get("lineage_hash"),
                praise_code=p_data.get("praise_code")
            )
            if "quadrant_claims" in p_data:
                participant.quadrant_claims = p_data["quadrant_claims"]
            ledger.participants.append(participant)
        
        # Load assets
        assets_data = data.get("assets", {})
        for category in ["gold_refinery", "oil_liquidity", "healing_milk_honey", "energy"]:
            for asset_data in assets_data.get(category, []):
                asset = Asset(
                    asset_type=asset_data["type"],
                    source=asset_data["source"],
                    vault_value=asset_data["vault_value"]
                )
                ledger.assets[category].append(asset)
        
        # Load exchange logic
        if "exchange_logic" in data:
            ledger.exchange_logic.update(data["exchange_logic"])
        
        ledger._update_audit_hash()
        return ledger
    
    @classmethod
    def from_yaml(cls, yaml_str: str) -> 'InfiniteLedger':
        """Create ledger from YAML string"""
        data = yaml.safe_load(yaml_str)
        return cls.from_dict(data)
    
    @classmethod
    def from_json(cls, json_str: str) -> 'InfiniteLedger':
        """Create ledger from JSON string"""
        data = json.loads(json_str)
        return cls.from_dict(data)
    
    @classmethod
    def load_from_file(cls, filename: str) -> 'InfiniteLedger':
        """Load ledger from file"""
        with open(filename, 'r') as f:
            content = f.read()
            if filename.endswith('.yaml') or filename.endswith('.yml'):
                return cls.from_yaml(content)
            elif filename.endswith('.json'):
                return cls.from_json(content)
            else:
                raise ValueError(f"Unsupported file format: {filename}")
    
    def __str__(self) -> str:
        """String representation of ledger"""
        return f"Infinite Ledger [{self.ledger_id}] - {len(self.participants)} participants, Audit: {self.exchange_logic['audit_hash'][:16]}..."


if __name__ == "__main__":
    # Example usage
    print("=" * 80)
    print("📜 INFINITE INAUGURAL EXCHANGE LEDGER")
    print("Broker-Barter Compass Sheet — Codex Format v1.0")
    print("=" * 80)
    print()
    
    # Create ledger
    ledger = InfiniteLedger()
    
    # Add a participant
    participant = Participant("Commander Bleu")
    ledger.add_participant(participant)
    
    # Add assets to each quadrant
    ledger.add_gold_refinery_asset("Blood-Iron", "Hemoglobin", "$1000 USD")
    ledger.add_oil_liquidity_asset("Insulin Stream", "Pancreatic Cycle", "$500 USD")
    ledger.add_healing_asset("Food/Medicine", "Lineage Dividend", "$750 USD")
    ledger.add_energy_asset("Breath/Motion/Prayer", "Soul Force", "$2000 USD")
    
    # Display ledger
    print(ledger)
    print()
    print("Quadrant Integrity:", "✓ VERIFIED" if ledger.check_quadrant_integrity() else "✗ FAILED")
    print("Piracy Status:", "✓ CLEAN" if ledger.verify_piracy_free() else "⚠ FLAGGED")
    print()
    print("=" * 80)
    print("YAML Export:")
    print("=" * 80)
    print(ledger.to_yaml())
