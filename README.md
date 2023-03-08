# Langages utilisé
- **Backend : NodeJS**
  - Facile à apprendre, rapide, trés populaire, facile à tester, bonne communauté, on a tous déjà touché à du js, architecture plutôt intéressante pour le projet avec système de event queue
- **Front web : ReactJS**
  - Trés populaire, on a déjà tous touché à du js, grosse communauté
- **Front Mobile : ReactNative / Flutter (pas encore choisit)**
    - uwu

# How to start

## Docker
Run `docker-compose up --build` in root.

First, run `npm install` in all the following directory.
## Database
Run `mysql -u your_user -p < DataBase.sql` with *your_user* being the mysql user that you use.

## API
Run `node app.js` in the API folder.
## Front Web
Run `npm start` in the front-web folder.
## Front Mobile
Run `npx react-native run` with `-android` or `-ios` depending on the os you want.
