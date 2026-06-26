@echo off
title Socios Gorev Robotu - Manuel Baslat
color 0A
echo ===================================================
echo        Socios Gorev Robotu - Manuel Mod
echo ===================================================
echo.
echo  Robot simdi hemen calistirilacak!
echo  Config zamanlayici gecici olarak su ana ayarlaniyor...
echo.
cd /d "%~dp0"

:: Config'i su ana ayarla ki robot hemen calissin
echo { > config.json
echo     "lastRunTime": null, >> config.json
echo     "nextScheduledTime": "%date:~6,4%-%date:~3,2%-%date:~0,2%T00:00:00.000Z" >> config.json
echo } >> config.json

:: Robotu baslat
node socios.js
pause
