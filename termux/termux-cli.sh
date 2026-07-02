#!/bin/bash
# Termux Wrapper Script - Enhanced CLI with color output
# Usage: ./termux-cli.sh --input "address" --format json

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${CYAN}"
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║  🔐 CRYPTOGRAPHY ANALYSIS PARSER - CLI                          ║"
    echo "║     Multi-chain Blockchain Intelligence Suite                  ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

show_help() {
    print_header
    echo -e "${CYAN}USAGE:${NC}"
    echo "  $0 [options]"
    echo ""
    echo -e "${CYAN}OPTIONS:${NC}"
    echo "  --input <string>        Hash/address/tx ID to analyze"
    echo "  --batch <filepath>      Process file with multiple items"
    echo "  --decode <string>       Detect and decode encoding"
    echo "  --cipher <name>         Specify cipher to use"
    echo "  --format <format>       Output format (json, csv, text)"
    echo "  --output <filepath>     Save results to file"
    echo "  --chain <chain>         Specify blockchain (btc, bch, bsv)"
    echo "  --help                  Show this help message"
    echo ""
    echo -e "${CYAN}EXAMPLES:${NC}"
    echo "  $0 --input \"1A1z7agoat\" --format json"
    echo "  $0 --batch addresses.txt --output results.csv"
    echo "  $0 --decode \"aGVsbG8\" --recommend-cipher"
    echo ""
    echo -e "${CYAN}CHAINS:${NC}"
    echo "  btc   Bitcoin"
    echo "  bch   Bitcoin Cash"
    echo "  bsv   Bitcoin SV"
    echo "  all   All chains (default)"
    echo ""
}

# Main execution
if [ $# -eq 0 ] || [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    show_help
    exit 0
fi

print_header
echo -e "${BLUE}Processing command...${NC}"
echo ""

# Pass all arguments to Node.js CLI
node cli.js "$@"

if [ $? -eq 0 ]; then
    echo ""
    print_success "Operation completed successfully"
    echo ""
else
    print_error "Operation failed"
    exit 1
fi
