#!/bin/bash

# CV Analyzer - Script untuk menjalankan aplikasi
# Menjalankan backend (FastAPI) dan frontend (Vite) secara bersamaan

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"

# Warna output
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${GREEN}=== CV Analyzer ===${NC}"
echo ""

# Cek .env di backend
if [ ! -f "$BACKEND_DIR/.env" ]; then
    echo -e "${CYAN}[!] File .env tidak ditemukan di backend/.${NC}"
    echo "    Salin dari .env.example dan isi API key Anda:"
    echo "    cp backend/.env.example backend/.env"
    echo ""
fi

# Install dependensi frontend jika belum
if [ ! -d "$PROJECT_DIR/node_modules" ]; then
    echo -e "${CYAN}[Frontend] Menginstall dependensi...${NC}"
    cd "$PROJECT_DIR" && npm install
    echo ""
fi

# Install dependensi backend jika belum
if [ ! -d "$BACKEND_DIR/.venv" ] && [ ! -d "$BACKEND_DIR/venv" ]; then
    echo -e "${CYAN}[Backend] Membuat virtual environment...${NC}"
    python3 -m venv "$BACKEND_DIR/.venv"
    source "$BACKEND_DIR/.venv/bin/activate"
    pip install -r "$BACKEND_DIR/requirements.txt"
    echo ""
fi

# Fungsi cleanup saat di-Ctrl+C
cleanup() {
    echo ""
    echo -e "${GREEN}Menghentikan aplikasi...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}
trap cleanup SIGINT SIGTERM

# Jalankan backend
echo -e "${CYAN}[Backend] Menjalankan FastAPI di http://localhost:8000${NC}"
cd "$BACKEND_DIR"
if [ -d ".venv" ]; then
    source .venv/bin/activate
elif [ -d "venv" ]; then
    source venv/bin/activate
fi
python main.py &
BACKEND_PID=$!

# Jalankan frontend
echo -e "${CYAN}[Frontend] Menjalankan Vite dev server di http://localhost:5173${NC}"
cd "$PROJECT_DIR"
npx vite &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}Aplikasi berjalan!${NC}"
echo -e "  Frontend: http://localhost:5173"
echo -e "  Backend:  http://localhost:8000"
echo -e "  API Docs: http://localhost:8000/docs"
echo ""
echo "Tekan Ctrl+C untuk menghentikan."

wait
