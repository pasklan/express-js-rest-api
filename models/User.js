const knex = require("../database/connection");
const bcrypt = require("bcrypt");
const PasswordToken = require("./PasswordToken");

class User {
  async delete(id) {
    const user = await this.findById(id);

    if (user != undefined) {
      try {
        await knex.delete().where({ id: id }).table("users");
        return { status: true };
      } catch (error) {
        return { status: false, err: error };
      }
    } else {
      return { status: false, err: "id informado não existe" };
    }
  }

  async update(id, email, name, role) {
    const user = await this.findById(id);

    if (user != undefined) {
      let editUser = {};

      if (email != undefined) {
        if (email != user.email) {
          let result = await this.findEmail(email);
          if (result === false) {
            editUser.email = email;
          } else {
            return { status: false, err: "E-mail já cadastrado" };
          }
        }
      }

      if (name != undefined) {
        editUser.name = name;
      }
      if (role != undefined) {
        editUser.role = role;
      }

      try {
        await knex.update(editUser).where({ id: id }).table("users");
        return { status: true };
      } catch (error) {
        return { status: false, err: "Usuário não existe" };
      }
    } else {
      return { status: false, err: "Usuário não existe" };
    }
  }

  async new(email, password, name) {
    try {
      const hash = await bcrypt.hash(password, 10);
      await knex
        .insert({ email, password: hash, name, role: 0 })
        .table("users");
    } catch (error) {
      console.log(error);
    }
  }

  async findEmail(email) {
    try {
      const result = await knex
        .select("*")
        .from("users")
        .where({ email: email });
      if (result.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async findAll() {
    try {
      const result = await knex
        .select(["id", "name", "email", "role"])
        .table("users");
      return result;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async findById(id) {
    try {
      const result = await knex
        .select(["id", "name", "email", "role"])
        .where({ id: id })
        .table("users");
      if (result.length > 0) {
        return result[0];
      } else {
        return undefined;
      }
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }
  async findByEmail(email) {
    try {
      const result = await knex
        .select(["id", "name", "email", "password", "role"])
        .where({ email: email })
        .table("users");
      if (result.length > 0) {
        return result[0];
      } else {
        return undefined;
      }
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  async changePassword(newPassword, id, token) {
    const hash = await bcrypt.hash(newPassword, 10);
    try {
      await knex.update({ password: hash }).where({ id: id }).table("users");
      await PasswordToken.setUsed(token);
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new User();
