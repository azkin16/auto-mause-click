@echo off
title Socios Gorev Robotunu Durdur
color 0C
echo ===================================================
echo             Socios Gorev Robotu Durduruluyor
echo ===================================================
echo.

taskkill /f /im node.exe >nul 2>&1
taskkill /f /im wscript.exe >nul 2>&1

echo.
echo [Robot] Arka planda calisan robot basariyla durduruldu.
echo.
pause
