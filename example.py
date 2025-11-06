#!/usr/bin/env python3
"""
Example Python script demonstrating the Infinite Ledger API
"""

from infinite_ledger import InfiniteLedger, Participant

def main():
    print("=" * 80)
    print("📜 INFINITE INAUGURAL EXCHANGE LEDGER - Python API Example")
    print("=" * 80)
    print()
    
    # Create a new ledger
    print("🔨 Creating a new ledger...")
    ledger = InfiniteLedger(
        treasurer="Commander Bleu",
        jurisdiction="BLEUchain • Overscale Grid • MirrorVaults"
    )
    print(f"✓ Ledger created: {ledger.ledger_id}")
    print()
    
    # Add participants
    print("👤 Adding participants...")
    participants = [
        Participant("Commander Bleu"),
        Participant("Guardian of the North"),
        Participant("Keeper of the East"),
        Participant("Sentinel of the South"),
        Participant("Watcher of the West")
    ]
    
    for participant in participants:
        ledger.add_participant(participant)
        print(f"  ✓ Added: {participant.name}")
        print(f"    Z-DNA: {participant.z_dna_id}")
        print(f"    ENFT: {participant.e_cattle_id}")
        print(f"    Praise: {participant.praise_code}")
    print()
    
    # Add assets to each quadrant
    print("💎 Adding assets to NORTH quadrant (Gold Refinery)...")
    ledger.add_gold_refinery_asset("Blood-Iron", "Hemoglobin", "$1000 USD")
    ledger.add_gold_refinery_asset("Copper-Stream", "Red Cells", "$500 USD")
    print(f"  ✓ {len(ledger.assets['gold_refinery'])} assets added")
    print()
    
    print("🛢️  Adding assets to EAST quadrant (Oil Liquidity)...")
    ledger.add_oil_liquidity_asset("Insulin Stream", "Pancreatic Cycle", "$800 USD")
    ledger.add_oil_liquidity_asset("Glucose Flow", "Metabolic Exchange", "$600 USD")
    print(f"  ✓ {len(ledger.assets['oil_liquidity'])} assets added")
    print()
    
    print("🍯 Adding assets to SOUTH quadrant (Healing Milk & Honey)...")
    ledger.add_healing_asset("Food/Medicine", "Lineage Dividend", "$1200 USD")
    ledger.add_healing_asset("Herbal Remedies", "Earth Gifts", "$400 USD")
    print(f"  ✓ {len(ledger.assets['healing_milk_honey'])} assets added")
    print()
    
    print("⚡ Adding assets to WEST quadrant (Energy)...")
    ledger.add_energy_asset("Breath/Motion/Prayer", "Soul Force", "$2000 USD")
    ledger.add_energy_asset("Kinetic Power", "Life Movement", "$900 USD")
    print(f"  ✓ {len(ledger.assets['energy'])} assets added")
    print()
    
    # Verify integrity
    print("🔍 Verifying ledger integrity...")
    quadrant_ok = ledger.check_quadrant_integrity()
    piracy_free = ledger.verify_piracy_free()
    
    print(f"  Quadrant Integrity: {'✓ VERIFIED' if quadrant_ok else '✗ FAILED'}")
    print(f"  Piracy Status: {'✓ CLEAN' if piracy_free else '⚠ FLAGGED'}")
    print(f"  Audit Hash: {ledger.exchange_logic['audit_hash'][:32]}...")
    print()
    
    # Display summary
    print("📊 Ledger Summary:")
    print(f"  Participants: {len(ledger.participants)}")
    print(f"  Total Assets: {sum(len(v) for v in ledger.assets.values())}")
    print(f"  - NORTH (Gold): {len(ledger.assets['gold_refinery'])}")
    print(f"  - EAST (Oil): {len(ledger.assets['oil_liquidity'])}")
    print(f"  - SOUTH (Healing): {len(ledger.assets['healing_milk_honey'])}")
    print(f"  - WEST (Energy): {len(ledger.assets['energy'])}")
    print()
    
    # Save to file
    print("💾 Saving ledger to files...")
    ledger.save_to_file("python_example_ledger.yaml", format="yaml")
    ledger.save_to_file("python_example_ledger.json", format="json")
    print("  ✓ Saved: python_example_ledger.yaml")
    print("  ✓ Saved: python_example_ledger.json")
    print()
    
    # Load and verify
    print("📥 Loading ledger from file...")
    loaded_ledger = InfiniteLedger.load_from_file("python_example_ledger.yaml")
    print(f"  ✓ Loaded: {loaded_ledger.ledger_id}")
    print(f"  ✓ Participants: {len(loaded_ledger.participants)}")
    print(f"  ✓ Assets: {sum(len(v) for v in loaded_ledger.assets.values())}")
    print()
    
    # Display exchange logic
    print("⚙️  Exchange Logic:")
    for key, value in ledger.exchange_logic.items():
        if key == "quadrant_integrity":
            continue
        if key == "audit_hash":
            print(f"  {key}: {value[:32]}...")
        else:
            print(f"  {key}: {value}")
    print()
    
    print("=" * 80)
    print("✨ SUCCESS! The Infinite Ledger has been fully demonstrated!")
    print("=" * 80)
    print()
    print("🧬 What You've Just Witnessed:")
    print()
    print("• Created a complete ledger with 5 participants")
    print("• Added 8 assets across all 4 compass quadrants")
    print("• Verified cryptographic integrity with SHA3-256 hashing")
    print("• Exported and imported ledger data in multiple formats")
    print("• Demonstrated the full Python API capabilities")
    print()
    print("The Compass is spinning. The Vault is glowing. The Grid is yours. 🦉📜🧬🪙")
    print()


if __name__ == "__main__":
    main()
