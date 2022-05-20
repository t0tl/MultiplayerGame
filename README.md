# MultiplayerGame 

## A 2D snake genre game

### General info
If you are interested in hosting the game, go further down to [Hosting](https://github.com/t0tl/MultiplayerGame#hosting).

MultiplayerGame is a multiplayer real-time snake strategy game where you compete versus your friends for the most area, inspired by splix.io and paper.io. The game uses vanilla Javascript, express and socket.io.

### Rules
1. Each player get their own starting area.
<img src="/img/StartingArea.gif" alt="StartingArea" width="200" height="417"/>
3. If you eat your own snake you restart.
4. If you eat another snake they die.
5. The area enclosed by your snake will be claimed when when you return to your already claimed area.

### Launching the game
To play the game there are two alternatives. 
* You find someone who is hosting the game and connect to their server. 
* You host your own server (offline or online)

Given the likelihood of finding someone else who is hosting, you are likely to end up hosting yourself. Therefore, we have included a guide for hosting.

#### Hosting

To run a server for the game you need to have `node.js`, `npm`, `express`, `socket.io` and `uuidv4` installed. You can install node.js from `https://nodejs.org/en/download/`. Thereafter, you need to run `npm install express`, `npm install socket.io`, `npm install uuidv4` in the terminal. 

Now you are ready to launch the server. Locate to the directory where you have stored the repo and run `node .\src\server\server.js`. Running the command will open a server on port 80. To connect locally, you can type `localhost:80` in your web browsers url bar to play the game on your own PC. Alternatively, you can access from within LAN by connecting to the server on port 80. (You need to know the servers local IP address).



