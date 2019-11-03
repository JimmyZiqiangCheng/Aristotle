## How to setup the environment

### Project
---
1. `git pull origin master`
2. go to the Aristotle/backend/sever-api
3. `npm update`
4. to start node server `npm start`
5. to test node server `npm test`
---
### How to install and run a MongoDB Server on Local
There are two options:

--- (for MacOS Only)
#### 1. Install Docker (mongodb run inside docker)
1. Install Docker + Docker Compose: https://docs.docker.com/compose/install/ or https://runnable.com/docker/install-docker-on-macos
2. Start Docker Application
3. Start `Terminal` application and navigate to the project dir.
`2019-S2-SEP-PG3/Aristotle/backend/`
4. Run command `docker-compose up -d`
**Note:** You can stop docker after used `docker-compose stop`, remember to start it again `^_^`.

#### 2. Install Mongodb on your local machine
https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/
1. Install Homebrew `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
2. Install Mongo `brew tap mongodb/brew` and then `brew install mongodb-community@4.2`
3. Run MongoDB `brew services start mongodb-community@4.2` (Background Service) or `mongod --config /usr/local/etc/mongod.conf` (Foreground Service)
4. Connect to your MongoDB `mongo` 

Mongo IP: localhost or 127.0.0.1
Mongo Port: 27017

---

### 🐰  	💤
__Node Version:__ 12.0+
__Mongo Version:__ Community@4.2

### 😃 NodeJs Dependencies

"dependencies":
- "@hapi/joi": "15.1.1",
- "config": "3.2.2",
- "express": "4.17.1",
- "mongoose": "5.6.13",
- "morgan": "1.9.1"
  
"devDependencies":
- "chai": "4.2.0",
- "mocha": "6.2.0",
- "nodemon": "1.19.2",
- "sinon": "7.4.2",
- "supertest": "4.0.2"

---
## Backend Members

- Keith
- Jimmy
- Yuning
- Ziang

