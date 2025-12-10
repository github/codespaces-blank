#!/usr/bin/env python3
"""
CLI Interface for the Infinite Inaugural Exchange Ledger

Commands:
- create: Create a new ledger
- add-participant: Add a participant to the ledger
- add-asset: Add an asset to a quadrant
- show: Display the ledger
- export: Export ledger to file
- import: Import ledger from file
- verify: Verify ledger integrity and piracy status
"""

import argparse
import sys
from infinite_ledger import InfiniteLedger, Participant, Asset


def create_ledger(args):
    """Create a new ledger"""
    ledger = InfiniteLedger(
        treasurer=args.treasurer,
        jurisdiction=args.jurisdiction
    )
    
    if args.output:
        ledger.save_to_file(args.output, format=args.format)
        print(f"✓ Ledger created and saved to {args.output}")
    else:
        print(ledger.to_yaml() if args.format == 'yaml' else ledger.to_json())
    
    return ledger


def add_participant(args):
    """Add a participant to the ledger"""
    try:
        ledger = InfiniteLedger.load_from_file(args.ledger)
    except FileNotFoundError:
        print(f"✗ Error: Ledger file not found: {args.ledger}")
        sys.exit(1)
    
    participant = Participant(
        name=args.name,
        z_dna_id=args.z_dna_id,
        e_cattle_id=args.enft_id,
        lineage_hash=args.lineage_hash,
        praise_code=args.praise_code
    )
    
    try:
        ledger.add_participant(participant)
        ledger.save_to_file(args.ledger)
        print(f"✓ Participant '{args.name}' added successfully")
        print(f"  Z-DNA ID: {participant.z_dna_id}")
        print(f"  ENFT Address: {participant.e_cattle_id}")
        print(f"  Lineage Hash: {participant.lineage_hash}")
        print(f"  Praise Code: {participant.praise_code}")
    except ValueError as e:
        print(f"✗ Error: {e}")
        sys.exit(1)


def add_asset(args):
    """Add an asset to a quadrant"""
    try:
        ledger = InfiniteLedger.load_from_file(args.ledger)
    except FileNotFoundError:
        print(f"✗ Error: Ledger file not found: {args.ledger}")
        sys.exit(1)
    
    quadrant_map = {
        "north": ("gold_refinery", "add_gold_refinery_asset"),
        "east": ("oil_liquidity", "add_oil_liquidity_asset"),
        "south": ("healing_milk_honey", "add_healing_asset"),
        "west": ("energy", "add_energy_asset")
    }
    
    if args.quadrant not in quadrant_map:
        print(f"✗ Error: Invalid quadrant '{args.quadrant}'. Must be one of: north, east, south, west")
        sys.exit(1)
    
    category, method_name = quadrant_map[args.quadrant]
    method = getattr(ledger, method_name)
    method(args.type, args.source, args.value)
    
    ledger.save_to_file(args.ledger)
    print(f"✓ Asset added to {args.quadrant.upper()} quadrant ({category})")
    print(f"  Type: {args.type}")
    print(f"  Source: {args.source}")
    print(f"  Value: {args.value}")


def show_ledger(args):
    """Display the ledger"""
    try:
        ledger = InfiniteLedger.load_from_file(args.ledger)
    except FileNotFoundError:
        print(f"✗ Error: Ledger file not found: {args.ledger}")
        sys.exit(1)
    
    print("=" * 80)
    print("📜 INFINITE INAUGURAL EXCHANGE LEDGER")
    print("=" * 80)
    print()
    print(f"Ledger ID: {ledger.ledger_id}")
    print(f"Timestamp: {ledger.timestamp}")
    print(f"Treasurer: {ledger.treasurer}")
    print(f"Jurisdiction: {ledger.jurisdiction}")
    print()
    print(f"Participants: {len(ledger.participants)}")
    for i, p in enumerate(ledger.participants, 1):
        print(f"  {i}. {p.name}")
        print(f"     Z-DNA: {p.z_dna_id}")
        print(f"     ENFT: {p.e_cattle_id}")
    print()
    print("Assets by Quadrant:")
    print(f"  NORTH (Gold Refinery): {len(ledger.assets['gold_refinery'])} assets")
    print(f"  EAST (Oil Liquidity): {len(ledger.assets['oil_liquidity'])} assets")
    print(f"  SOUTH (Healing): {len(ledger.assets['healing_milk_honey'])} assets")
    print(f"  WEST (Energy): {len(ledger.assets['energy'])} assets")
    print()
    print(f"Audit Hash: {ledger.exchange_logic['audit_hash']}")
    print(f"Vault Sync: {ledger.exchange_logic['vault_sync']}")
    print(f"Piracy Flag: {ledger.exchange_logic['piracy_flag']}")
    print()
    
    if args.verbose:
        print("=" * 80)
        print("Full Ledger:")
        print("=" * 80)
        print(ledger.to_yaml() if args.format == 'yaml' else ledger.to_json())


def export_ledger(args):
    """Export ledger to file"""
    try:
        ledger = InfiniteLedger.load_from_file(args.ledger)
    except FileNotFoundError:
        print(f"✗ Error: Ledger file not found: {args.ledger}")
        sys.exit(1)
    
    ledger.save_to_file(args.output, format=args.format)
    print(f"✓ Ledger exported to {args.output} ({args.format.upper()} format)")


def verify_ledger(args):
    """Verify ledger integrity"""
    try:
        ledger = InfiniteLedger.load_from_file(args.ledger)
    except FileNotFoundError:
        print(f"✗ Error: Ledger file not found: {args.ledger}")
        sys.exit(1)
    
    print("=" * 80)
    print("🔍 LEDGER VERIFICATION")
    print("=" * 80)
    print()
    
    # Check quadrant integrity
    integrity_ok = ledger.check_quadrant_integrity()
    print(f"Quadrant Integrity: {'✓ VERIFIED' if integrity_ok else '✗ FAILED'}")
    
    # Check piracy status
    piracy_free = ledger.verify_piracy_free()
    print(f"Piracy Status: {'✓ CLEAN' if piracy_free else '⚠ FLAGGED'}")
    
    # Check audit hash
    current_hash = ledger.exchange_logic['audit_hash']
    ledger._update_audit_hash()
    new_hash = ledger.exchange_logic['audit_hash']
    hash_valid = current_hash == new_hash
    print(f"Audit Hash: {'✓ VALID' if hash_valid else '✗ INVALID'}")
    
    print()
    if integrity_ok and piracy_free and hash_valid:
        print("✓ Ledger is VALID and ready for exchange")
        sys.exit(0)
    else:
        print("✗ Ledger has ERRORS that must be resolved")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="Infinite Inaugural Exchange Ledger - CLI Interface",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Create a new ledger
  %(prog)s create -o ledger.yaml
  
  # Add a participant
  %(prog)s add-participant ledger.yaml -n "Commander Bleu"
  
  # Add an asset to the North quadrant
  %(prog)s add-asset ledger.yaml -q north -t "Blood-Iron" -s "Hemoglobin" -v "$1000 USD"
  
  # Show ledger details
  %(prog)s show ledger.yaml -v
  
  # Verify ledger integrity
  %(prog)s verify ledger.yaml
  
  # Export to JSON
  %(prog)s export ledger.yaml -o ledger.json -f json
        """
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Command to execute')
    
    # Create command
    create_parser = subparsers.add_parser('create', help='Create a new ledger')
    create_parser.add_argument('-o', '--output', help='Output file path')
    create_parser.add_argument('-t', '--treasurer', default='Commander Bleu', help='Treasurer name')
    create_parser.add_argument('-j', '--jurisdiction', default='BLEUchain • Overscale Grid • MirrorVaults', help='Jurisdiction')
    create_parser.add_argument('-f', '--format', choices=['yaml', 'json'], default='yaml', help='Output format')
    
    # Add participant command
    participant_parser = subparsers.add_parser('add-participant', help='Add a participant to the ledger')
    participant_parser.add_argument('ledger', help='Ledger file path')
    participant_parser.add_argument('-n', '--name', required=True, help='Participant name')
    participant_parser.add_argument('-z', '--z-dna-id', help='Z-DNA ID (auto-generated if not provided)')
    participant_parser.add_argument('-e', '--enft-id', help='ENFT address (auto-generated if not provided)')
    participant_parser.add_argument('-l', '--lineage-hash', help='Lineage hash (auto-generated if not provided)')
    participant_parser.add_argument('-p', '--praise-code', help='Praise code (auto-generated if not provided)')
    
    # Add asset command
    asset_parser = subparsers.add_parser('add-asset', help='Add an asset to a quadrant')
    asset_parser.add_argument('ledger', help='Ledger file path')
    asset_parser.add_argument('-q', '--quadrant', required=True, choices=['north', 'east', 'south', 'west'], help='Quadrant (north/east/south/west)')
    asset_parser.add_argument('-t', '--type', required=True, help='Asset type')
    asset_parser.add_argument('-s', '--source', required=True, help='Asset source')
    asset_parser.add_argument('-v', '--value', required=True, help='Vault value')
    
    # Show command
    show_parser = subparsers.add_parser('show', help='Display the ledger')
    show_parser.add_argument('ledger', help='Ledger file path')
    show_parser.add_argument('-v', '--verbose', action='store_true', help='Show full ledger details')
    show_parser.add_argument('-f', '--format', choices=['yaml', 'json'], default='yaml', help='Display format')
    
    # Export command
    export_parser = subparsers.add_parser('export', help='Export ledger to file')
    export_parser.add_argument('ledger', help='Source ledger file path')
    export_parser.add_argument('-o', '--output', required=True, help='Output file path')
    export_parser.add_argument('-f', '--format', choices=['yaml', 'json'], default='yaml', help='Output format')
    
    # Verify command
    verify_parser = subparsers.add_parser('verify', help='Verify ledger integrity')
    verify_parser.add_argument('ledger', help='Ledger file path')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        sys.exit(1)
    
    # Execute command
    commands = {
        'create': create_ledger,
        'add-participant': add_participant,
        'add-asset': add_asset,
        'show': show_ledger,
        'export': export_ledger,
        'verify': verify_ledger
    }
    
    commands[args.command](args)


if __name__ == "__main__":
    main()
