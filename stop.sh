#!/bin/bash

# CV Analyzer - Script untuk mematikan aplikasi
# Menghentikan backend (FastAPI :8000) dan frontend (Vite :5173)

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== CV Analyzer - Stop ===${NC}"
echo ""

STOPPED=0

# Matikan proses di port 8000 (backend)
PID_8000=$(lsof -ti :8000 2>/dev/null)
if [ -n "$PID_8000" ]; then
    echo -e "${CYAN}[Backend]${NC} Menghentikan proses di port 8000 (PID: $PID_8000)..."
    kill $PID_8000 2>/dev/null
    STOPPED=1
else
    echo -e "${YELLOW}[Backend]${NC} Tidak ada proses di port 8000"
fi

# Matikan proses di port 5173 (frontend)
PID_5173=$(lsof -ti :5173 2>/dev/null)
if [ -n "$PID_5173" ]; then
    echo -e "${CYAN}[Frontend]${NC} Menghentikan proses di port 5173 (PID: $PID_5173)..."
    kill $PID_5173 2>/dev/null
    STOPPED=1
else
    echo -e "${YELLOW}[Frontend]${NC} Tidak ada proses di port 5173"
fi

if [ $STOPPED -eq 1 ]; then
    sleep 1
    # Force kill jika masih berjalan
    PID_8000=$(lsof -ti :8000 2>/dev/null)
    PID_5173=$(lsof -ti :5173 2>/dev/null)
    [ -n "$PID_8000" ] && kill -9 $PID_8000 2>/dev/null
    [ -n "$PID_5173" ] && kill -9 $PID_5173 2>/dev/null
    echo ""
    echo -e "${GREEN}Aplikasi berhasil dihentikan.${NC}"
else
    echo ""
    echo -e "${YELLOW}Tidak ada proses yang berjalan.${NC}"
fi
