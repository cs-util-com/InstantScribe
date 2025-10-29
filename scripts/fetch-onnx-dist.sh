#!/usr/bin/env bash
set -euo pipefail

# Fetch onnxruntime-web dist/ assets and place them in project ./ort/ folder
# Usage: ./scripts/fetch-onnx-dist.sh [version]
# Example: ./scripts/fetch-onnx-dist.sh 1.18.0

VERSION=${1:-1.18.0}
ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
TMPDIR=$(mktemp -d)

echo "Fetching onnxruntime-web@$VERSION into $ROOT_DIR/ort"
cd "$TMPDIR"

# Use npm pack to download the package tarball
echo "Downloading npm package..."
npm pack "onnxruntime-web@$VERSION" >/dev/null 2>&1
TARBALL=$(ls onnxruntime-web-*.tgz | head -n1)
if [ -z "$TARBALL" ]; then
  echo "Failed to download onnxruntime-web@$VERSION"
  exit 1
fi

# Extract tarball
mkdir -p package
tar -xzf "$TARBALL"

# Ensure dist exists
if [ ! -d package/dist ]; then
  echo "package/dist not found inside tarball. Listing package/ contents:" 
  ls -la package
  exit 1
fi

# Copy dist files into repo ./ort/
DEST_DIR="$ROOT_DIR/ort"
# Remove old files and recreate directory
rm -rf "$DEST_DIR"
mkdir -p "$DEST_DIR"
cp -r package/dist/* "$DEST_DIR/"

echo "Copied $(ls -1 "$DEST_DIR" | wc -l) files to $DEST_DIR"

# Cleanup
rm -rf "$TMPDIR"

echo "Done. To serve the ONNX WASM assets locally, ensure your static server serves the ./ort/ folder at '/ort/'.\nYou can also set window.ORT_WASM_PATH = '/ort/' before loading the app to be explicit."