@echo off
set "HTML_PATH=%~dp0pet.html"

echo Launching Namyang Kitty Desktop Pet...
start chrome --app="file:///%HTML_PATH%" --window-size=280,340 2>nul || (
    start msedge --app="file:///%HTML_PATH%" --window-size=280,340 2>nul || (
        start "" "%HTML_PATH%"
    )
)
