const jwt = require("jsonwebtoken");
const secret = "159357";

module.exports = (req, res, next) => {
  const authToken = req.headers["authorization"];

  if (authToken != undefined) {
    const bearer = authToken.split(" ");
    const token = bearer[1];

    try {
      const decoded = jwt.verify(token, secret);

      if (decoded.role === 1) {
        next();
      } else {
        res.status(403);
        res.send("Not allowed");
        return;
      }
    } catch (error) {
      res.status(403);
      res.send("Not allowed");
      return;
    }
  } else {
    res.status(403);
    res.send("Not allowed");
    return;
  }
};
