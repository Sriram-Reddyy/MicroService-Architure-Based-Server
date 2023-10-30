const jwt = require("jsonwebtoken");

async function authHandler(req, res, next) {
  const token = req.headers["authorization"].split(' ')[1];
  console.log(req.headers["authorization"]);
  console.log(req.headers)
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
    if(err.message == "jwt expired"){
        // var decoded = await jwt.verify(refreshToken, process.env.REFRESH_KEY);
        // if(decoded){
        //   next();
        // }
        // else{
          res.status(401).send({ message:   err.message});
        //}
    }
    else{
      res.status(401).send({ message:   err.message});
    }
  }
}


async function adminAuthHandler(req, res, next) {
  const { token, refreshToken } = req.body;
  console.log(token);
  if (!token) {
    res.status(400).send({ message: "No token present" });
  }
  try {
    result = await jwt.verify(token, process.env.TOKEN_KEY);
    let decodedToekn = await jwt.decode(token, process.env.TOKEN_KEY);
    if(!decodedToekn.isAdmin){
      res.status(401).send({ message: "Not an admin, trying to access admin routes" });
    }
    if(result){
        next();
    }else{
        res.status(401).send({ message: "Token is invalid" });
    }
  } catch (err) {
    if(err.message == "jwt expired"){
        var decoded = await jwt.verify(refreshToken, process.env.REFRESH_KEY);
        if(decoded){
          next();
        }
        else{
          res.status(401).send({ message:   err.message});
        }
    }
    else{
      res.status(401).send({ message:   err.message});
    }
  }
}

module.exports = {authHandler:authHandler,adminAuthHandler:adminAuthHandler}