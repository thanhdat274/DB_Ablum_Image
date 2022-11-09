const jsonServer = require("json-server");
const auth = require("json-server-auth");
const path = require("path");
const cors = require("cors");
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "api.json"));
// const middlewares = jsonServer.defaults({
//   noCors: false
// });
server.db = router.db;

const rules = auth.rewriter({
  // Permission rules
  // users: 600,
  // messages: 640
});

// You must apply the middlewares in the following order
server.use(rules);
server.use(auth);
server.use(cors());
server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://bee-navy.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  if (req.method === "POST") {
    req.body.createAt = Date.now();
    req.body.updateAt = Date.now();
  } else if (req.method === "PATCH") {
    req.body.updateAt = Date.now();
  }
  next();
});

server.use("/api", router);
const port = 8080;
server.listen(port, () => {
  console.log(`Server is running on ${port}`);
})