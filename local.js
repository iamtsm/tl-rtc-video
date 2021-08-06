const express = require("express"); //express
const conf = require("./conf/cfg"); //conf
const fileApiRouters = require("./src/router")(conf); //file routers
let resRouter = conf.router.res;

let app = express();
console.log("resource including...")

//res
for(let key in resRouter) app.use(key,express.static(resRouter[key]));

//file api
for(let key in fileApiRouters) app.use(key,fileApiRouters[key])


app.listen(conf.node.port);
console.log("express init...")


console.log("server runing on ",conf.node.port," successful");