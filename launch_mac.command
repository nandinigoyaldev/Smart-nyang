#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "=========================================="
echo "🐱 Namyang Kitty Desktop Pet launching..."
echo "=========================================="

HTML_PATH="$DIR/pet.html"

if [ -d "/Applications/Google Chrome.app" ]; then
    open -na "Google Chrome" --args --app="file://$HTML_PATH" --window-size=280,340
elif [ -d "/Applications/Microsoft Edge.app" ]; then
    open -na "Microsoft Edge" --args --app="file://$HTML_PATH" --window-size=280,340
elif [ -d "/Applications/Brave Browser.app" ]; then
    open -na "Brave Browser" --args --app="file://$HTML_PATH" --window-size=280,340
elif command -v python3 >/dev/null 2>&1; then
    python3 "$DIR/mac_pet.py"
else
    open "$HTML_PATH"
fi
