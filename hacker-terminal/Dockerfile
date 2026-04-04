# Utiliser une image légère de Nginx
FROM nginx:alpine

# Copier les fichiers du terminal dans le dossier Servi par Nginx
COPY . /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
