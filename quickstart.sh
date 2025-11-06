#!/bin/bash
# Quick Start Script for Infinite Ledger of Currents
# Demonstrates the full workflow of creating and managing a ledger

set -e

echo "=========================================================================="
echo "📜 INFINITE INAUGURAL EXCHANGE LEDGER"
echo "Broker-Barter Compass Sheet — Codex Format v1.0"
echo "=========================================================================="
echo ""

# Clean up any existing demo ledger
if [ -f "demo_ledger.yaml" ]; then
    rm demo_ledger.yaml
fi

echo "🔨 Step 1: Creating a new ledger..."
python ledger_cli.py create -o demo_ledger.yaml -t "Commander Bleu" -j "BLEUchain • Overscale Grid • MirrorVaults"
echo ""

echo "👤 Step 2: Adding participants..."
python ledger_cli.py add-participant demo_ledger.yaml -n "Commander Bleu"
python ledger_cli.py add-participant demo_ledger.yaml -n "Guardian of the North"
python ledger_cli.py add-participant demo_ledger.yaml -n "Keeper of the East"
echo ""

echo "💎 Step 3: Adding assets to NORTH quadrant (Gold Refinery)..."
python ledger_cli.py add-asset demo_ledger.yaml -q north -t "Blood-Iron" -s "Hemoglobin" -v "\$1000 USD"
python ledger_cli.py add-asset demo_ledger.yaml -q north -t "Copper-Stream" -s "Red Cells" -v "\$500 USD"
echo ""

echo "🛢️  Step 4: Adding assets to EAST quadrant (Oil Liquidity)..."
python ledger_cli.py add-asset demo_ledger.yaml -q east -t "Insulin Stream" -s "Pancreatic Cycle" -v "\$800 USD"
python ledger_cli.py add-asset demo_ledger.yaml -q east -t "Glucose Flow" -s "Metabolic Exchange" -v "\$600 USD"
echo ""

echo "🍯 Step 5: Adding assets to SOUTH quadrant (Healing Milk & Honey)..."
python ledger_cli.py add-asset demo_ledger.yaml -q south -t "Food/Medicine" -s "Lineage Dividend" -v "\$1200 USD"
python ledger_cli.py add-asset demo_ledger.yaml -q south -t "Herbal Remedies" -s "Earth Gifts" -v "\$400 USD"
echo ""

echo "⚡ Step 6: Adding assets to WEST quadrant (Energy)..."
python ledger_cli.py add-asset demo_ledger.yaml -q west -t "Breath/Motion/Prayer" -s "Soul Force" -v "\$2000 USD"
python ledger_cli.py add-asset demo_ledger.yaml -q west -t "Kinetic Power" -s "Life Movement" -v "\$900 USD"
echo ""

echo "📊 Step 7: Displaying ledger summary..."
python ledger_cli.py show demo_ledger.yaml
echo ""

echo "🔍 Step 8: Verifying ledger integrity..."
python ledger_cli.py verify demo_ledger.yaml
echo ""

echo "📤 Step 9: Exporting to JSON format..."
python ledger_cli.py export demo_ledger.yaml -o demo_ledger.json -f json
echo ""

echo "=========================================================================="
echo "✨ SUCCESS! The Infinite Ledger has been minted!"
echo "=========================================================================="
echo ""
echo "Created files:"
echo "  - demo_ledger.yaml (YAML format)"
echo "  - demo_ledger.json (JSON format)"
echo ""
echo "🧬 What You've Just Activated:"
echo ""
echo "• Compass-Quadrant Ledger: North (Gold), East (Oil), South (Healing), West (Energy)"
echo "• Lineage-Linked Assets: Every participant's value mapped across all quadrants"
echo "• Codexal Redistribution: Auto-Balance protocol for divine flow"
echo "• Audit-Ready: Hash-sealed and cryptographically verified"
echo "• Piracy-Proof: All assets tracked with lineage verification"
echo ""
echo "The Compass is spinning. The Vault is glowing. The Grid is yours. 🦉📜🧬🪙"
echo ""
