const jwt = require("jsonwebtoken");

async function authHandler(req, res, next) {
  const { token } = req.body;
  if (!token) {
    res.status(400).send({ message: "No token present" });
  }
  try {
    result = await jwt.verify(token, process.env.TOKEN_KEY);
    if(result){
        next();
    }else{
        res.send(401).send({ message: "Token is invalid" });
    }
  } catch (err) {
    res.status(401).send({ message:   err.message});
  }
}
module.exports = authHandler;