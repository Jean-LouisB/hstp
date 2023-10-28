# Utilisez l'image officielle Node.js comme point de départ
FROM nginx:alpine

# Copiez votre fichier index.js dans le répertoire de travail du conteneur
COPY dist/* /usr/share/nginx/html

# Exposez le port sur lequel votre application écoute (par exemple, 3000)
EXPOSE 80

# Commande pour démarrer l'application
CMD ["nginx", "-g", "daemon off;"]
