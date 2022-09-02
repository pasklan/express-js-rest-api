const User = require("../models/User");
const PasswordToken = require("../models/PasswordToken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secret = "159357";

class UserController {
  async index(req, res) {
    const users = await User.findAll();
    res.json(users);
  }

  async findUser(req, res) {
    const id = req.params.id;
    const user = await User.findById(id);

    if (user === undefined) {
      res.status(404);
      res.json({});
    } else {
      res.status(200);
      res.json(user);
    }
  }

  async create(req, res) {
    const { name, email, password } = req.body;

    if (email === undefined) {
      res.status(400);
      res.json({ error: "Invalid e-mail" });
      return;
    }

    if (password === undefined) {
      res.status(400);
      res.json({ error: "Invalid password" });
      return;
    }

    const emailExist = await User.findEmail(email);
    if (emailExist) {
      console.log("E-mail cadastrado, utilize outro");
      res.status(406);
      res.json({ error: "Este e-mail já foi cadastrado" });
      return;
    }

    await User.new(email, password, name);
    res.status(200);
    res.send("Everything is fine");
  }

  async edit(req, res) {
    const { id, name, role, email } = req.body;
    const result = await User.update(id, email, name, role);

    if (result != undefined) {
      if (result.status) {
        res.status("200");
        res.send("Tudo OK!");
      } else {
        res.status(406);
        res.send(result.err);
      }
    } else {
      res.status(406);
      res.send("Erro no servidor!");
    }
  }

  async remove(req, res) {
    const id = req.params.id;
    const result = await User.delete(id);
    if (result.status) {
      res.status(200);
      res.send("Tudo ok");
    } else {
      res.status(406);
      res.send(result.err);
    }
  }

  async recoverPassword(req, res) {
    const email = req.body.email;

    const result = await PasswordToken.create(email);
    if (result.status) {
      res.status(200);
      res.send("" + result.token);
    } else {
      res.status(406);
      res.send(result.err);
    }
  }

  async changePassword(req, res) {
    const token = req.body.token;
    const password = req.body.password;

    const isTokenValid = await PasswordToken.validate(token);

    if (isTokenValid.status) {
      try {
        await User.changePassword(
          password,
          isTokenValid.token.user_id,
          isTokenValid.token.token
        );
        res.status(200);
        res.send("Senha alterada");
      } catch (error) {}
    } else {
      res.status(406);
      res.send("Token Inválido!");
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    if (user != undefined) {
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        const token = jwt.sign({ email: user.email, role: user.role }, secret);
        res.status(200);
        res.json({ token: token });
      } else {
        res.status(406);
        res.send("Senha incorreta");
      }
    } else {
      res.json({ status: false });
    }
  }
}

module.exports = new UserController();
