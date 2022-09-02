const express = require("express");
const app = express();
const router = express.Router();
const HomeController = require("../controllers/HomeController");
const UserController = require("../controllers/UserController");
const AdminAuth = require("../middleware/AdminAuth");

router.get("/", HomeController.index);

router.post("/user", AdminAuth, UserController.create);

router.get("/user", AdminAuth, UserController.index);

router.get("/user/:id", UserController.findUser);

router.put("/user", AdminAuth, UserController.edit);

router.delete("/user/:id", AdminAuth, UserController.remove);

router.post("/passwordrecovery", UserController.recoverPassword);

router.post("/changePassword", UserController.changePassword);

router.post("/login", UserController.login);

module.exports = router;
