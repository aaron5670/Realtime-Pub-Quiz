# Realtime Pub Quiz Game
**A Dutch realtime pub quiz**
This project was made as a school assignment.\
**See live demo:** [Demo](https://quizzer.now.sh/)


### Features
- Build with Nodejs 8.1
- ReactJS 16
- React Redux 7.1
- Redux 4
- ExpressJS 4.13
- Mongoose 5.7.6
- WS (Websockets) 7.1.2

### How to install

1. ``git clone https://github.com/aaron5670/Realtime-Pub-Quizz.git``
2. Create a config.js file on the **server** with the following settings: 
```javascript
//CLOUD.MONGODB.COM DEVELOPMENT  
const USERNAME = "username";  
const PASSWORD = "password";  
const HOST = "yourhostname.mongodb.net";  
const PORT = "27017";  
const DB = "quizzer";  
  
var exports = module.exports = {USERNAME, PASSWORD, HOST, PORT, DB};
```
3. Edit **quizzer/src/config.js**.
4. Run ```npm install``` in the **server** folder and **client** folder.
5. Run the server: ``node server.js``.
6. Run the Webpack server (client) ```npm start```.
7. Go to http://localhost:3000.
