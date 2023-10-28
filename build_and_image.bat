@echo off
cd "C:\wamp64\www\tompress\HSTP_2_tempo\hstp_front"
REM Crée le build du front-end angular :
echo "Building Angular project..."
call ng build
REM Supprime l'image puis la recrée
echo "Removing existing Docker image..."
docker rmi hstp_front
echo "Building new Docker image..."
docker build -t hstp_front .
REM Réintégre le conteneur dans le réseau
echo "Starting Docker Compose service..."
cd "C:\wamp64\www\tompress\HSTP_2_tempo"
docker-compose up hstp_front
pause