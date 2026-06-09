#!/bin/bash
clear
echo "==================================================="
echo "       Uzmanis Egitim - Otomatik Ileri Robotu"
echo "==================================================="
echo ""
echo "Robot baslatiliyor... Lutfen acilan tarayicida giris yapin."
echo ""

# Dosyanın bulunduğu klasöre git
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$DIR"

# Node scriptini çalıştır
node autoclick.js

echo ""
read -p "Cikmak icin Enter'a basin..."
