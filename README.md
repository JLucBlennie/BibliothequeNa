# Voici une App pour Android pour gérer ses lectures...👋

C'est un projet [Expo](https://expo.dev) qui permet de gérer ses lectures passées et à venir....

## Pour démarrrer

1. Mise à jour des dépendances

   ```bash
   npm install
   ```

2. Lancement de l'application pour la connexion dans Expo App

   ```bash
    npx expo start --tunnel
   ```

## Pour compiler avec EAS
En premier lieu, il faut installer eas-cli :
```bash
   npm install -g eas-cli
```
Puis lancement de la compilation :
```bash
   eas build -p android --profile preview 
```

Aller sur expo.dev pour récupérer la version compilée...