#!/bin/bash
# Termux Setup Script for Cryptography Analysis Parser
# Run: bash termux/setup.sh

echo ""
echo "🔐 Cryptography Analysis Parser - Termux Setup"
echo "==============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    pkg install -y nodejs
else
    echo "✅ Node.js already installed: $(node --version)"
fi

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "📦 Installing Git..."
    pkg install -y git
else
    echo "✅ Git already installed"
fi

# Navigate to app directory
echo ""
echo "📁 Setting up application directory..."

if [ ! -d "cryptography-analysis-parser" ]; then
    echo "Cloning repository..."
    git clone https://github.com/Dj26355/cryptography-analysis-parser.git
fi

cd cryptography-analysis-parser || exit

# Install dependencies (if any)
if [ -f "package.json" ]; then
    echo ""
    echo "📚 Installing dependencies..."
    npm install
fi

# Create alias for easy access
echo ""
echo "⚙️  Creating terminal alias..."

echo 'alias cap="node $(pwd)/cli.js"' >> ~/.bashrc
echo 'alias cap="node $(pwd)/cli.js"' >> ~/.zshrc 2>/dev/null

echo "✅ Setup complete!"
echo ""
echo "🚀 Quick Start:"
echo "  node cli.js --help              # Show help"
echo "  node cli.js --input \"hash\"    # Analyze input"
echo "  node cli.js --decode \"data\"   # Detect encoding"
echo "  node cli.js --batch file.txt    # Batch process"
echo ""
echo "📱 Browser Mode:"
echo "  Open index.html in your browser for full GUI"
echo ""
echo "💡 Pro Tip: Add this to your PATH for quick access:"
echo "  export PATH=\"$(pwd):\$PATH\""
echo ""
echo "📖 More info: cat docs/README_USAGE.md"
echo ""
