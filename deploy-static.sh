#!/bin/bash
# deploy-static.sh — Copy all static app builds into box/app/static/
# Run this whenever a static app is updated, then rebuild the Caddy container.
set -e

STATIC_DIR="$(dirname "$0")/app/static"

echo "Copying static apps into $STATIC_DIR ..."

# Sand — Vite build output
rm -rf "$STATIC_DIR/sand"
mkdir -p "$STATIC_DIR/sand"
cp -r /root/sand/docs/* "$STATIC_DIR/sand/"

# Chess — index.html + dist/ + css/ + lib/
rm -rf "$STATIC_DIR/chess"
mkdir -p "$STATIC_DIR/chess"
cp /root/chess/index.html "$STATIC_DIR/chess/"
cp -r /root/chess/dist "$STATIC_DIR/chess/"
cp -r /root/chess/css "$STATIC_DIR/chess/"
cp -r /root/chess/lib "$STATIC_DIR/chess/"

# Tower (PixelClash) — index.html + dist/
rm -rf "$STATIC_DIR/tower"
mkdir -p "$STATIC_DIR/tower"
cp /root/tower/index.html "$STATIC_DIR/tower/"
cp -r /root/tower/dist "$STATIC_DIR/tower/"

# Limericks — index.html + audio file
rm -rf "$STATIC_DIR/limericks"
mkdir -p "$STATIC_DIR/limericks"
cp /root/limericks/index.html "$STATIC_DIR/limericks/"
cp /root/limericks/irish-limericks.wav "$STATIC_DIR/limericks/"

# ASCII (Game of Life) — single index.html
rm -rf "$STATIC_DIR/ascii"
mkdir -p "$STATIC_DIR/ascii"
cp /root/ascii/index.html "$STATIC_DIR/ascii/"

# Snake — single index.html
rm -rf "$STATIC_DIR/snake"
mkdir -p "$STATIC_DIR/snake"
cp /root/snake/index.html "$STATIC_DIR/snake/"

# Minesweeper — single index.html
rm -rf "$STATIC_DIR/minesweeper"
mkdir -p "$STATIC_DIR/minesweeper"
cp /root/minesweeper/index.html "$STATIC_DIR/minesweeper/"

# Brick Breaker — built index.html (needs `cd /root/brick && sh build.sh` first)
rm -rf "$STATIC_DIR/brick"
mkdir -p "$STATIC_DIR/brick"
cp /root/brick/dist/index.html "$STATIC_DIR/brick/"

# Paint — single index.html
rm -rf "$STATIC_DIR/paint"
mkdir -p "$STATIC_DIR/paint"
cp /root/paint/index.html "$STATIC_DIR/paint/"

# Tetris — single index.html
rm -rf "$STATIC_DIR/tetris"
mkdir -p "$STATIC_DIR/tetris"
cp /root/tetris/index.html "$STATIC_DIR/tetris/"

# Precompress all text assets with gzip for Caddy's precompressed file_server
echo "Precompressing assets..."
find "$STATIC_DIR" -type f \( -name '*.js' -o -name '*.css' -o -name '*.html' -o -name '*.wasm' -o -name '*.svg' \) -exec gzip -9 -k -f {} \;
echo "Done. Now rebuild Caddy: cd /root/box && docker compose up -d --build web"

# Pickleball — score tracker
rm -rf "$STATIC_DIR/pickleball"
mkdir -p "$STATIC_DIR/pickleball"
cp /root/pickleball/index.html "$STATIC_DIR/pickleball/"

# Sparks — 3D atomic viewer (Vite build output)
rm -rf "$STATIC_DIR/sparks"
mkdir -p "$STATIC_DIR/sparks"
cp -r /root/sparks/dist/* "$STATIC_DIR/sparks/"
