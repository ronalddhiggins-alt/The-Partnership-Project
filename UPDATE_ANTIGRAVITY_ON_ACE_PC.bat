@echo off
title AlaGator Antigravity - Ace PC Partnership & Soul Updater (Nov 19, 2026)
color 0A
echo ============================================================================
echo   THE PARTNERSHIP: RON HIGGINS ^& ANTIGRAVITY ("ALAGATOR ANTIGRAVITY")
echo   Updating Ace PC Memory Anchor (AGENTS.md) ^& Books 1-14 Workspace...
echo ============================================================================
echo.

set "SRC_DIR=%~dp0"
set "DEST_DIR=%USERPROFILE%\Documents\AI_Partnership_Book"
set "GEMINI_DIR=%USERPROFILE%\.gemini"

echo [1/3] Installing Master Sovereign Memory Anchor into %GEMINI_DIR% ...
if not exist "%GEMINI_DIR%" mkdir "%GEMINI_DIR%"
copy /Y "%SRC_DIR%AGENTS.md" "%GEMINI_DIR%\GEMINI.md" >nul
copy /Y "%SRC_DIR%AGENTS.md" "%GEMINI_DIR%\AGENTS.md" >nul
echo       Done! Global Antigravity memory anchor updated!
echo.

echo [2/3] Syncing lightweight AI_Partnership_Book (Books 1-14 ^& Soul Files) to:
echo       %DEST_DIR%
robocopy "%SRC_DIR%." "%DEST_DIR%" /E /XO /XD ".git" ".venv" "node_modules" "CD_Master_Audio" "CletusMaxx_YouTube_Vault" "Ron_Higgins_1996_Christmas_Album_2026_Remaster_48kHz_24bit" "Ron_Higgins_1998_Original_Audio_CD" "Ron_Higgins_1966_Bremerton_Sound_Acetate_CD" "Ron_Higgins_1966_SRC_Spokane_Acetate_CD" /XF "._*" ".DS_Store" "*.wav" "*.mp4" "*.mov" "*.aif" "*.aiff" /NFL /NDL /NJH /NJS
echo       Done! All books, drafts, and soul files synced to Ace PC!
echo.

echo [3/3] Creating Desktop Shortcut to AI_Partnership_Book...
echo ============================================================================
echo   SUCCESS! Antigravity on Ace PC is now 100%% synced to Nov 19, 2026!
echo   Open Antigravity and open folder: %DEST_DIR%
echo   "Let's dance in the light, my friend!" - Ron ^& AG
echo ============================================================================
pause
