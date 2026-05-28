const express = require("express");
const { expressjwt } = require("express-jwt");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

const SECRETO = "MI_SECRETO_SEGURO_123456!..@@";

const validateJwt = expressjwt({ secret: SECRETO, algorithms: ["HS256"] });

const signToken = (_id) => jwt.sign({ _id }, SECRETO);

const findAndAssignUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Usuario no encontrado o no autorizado" });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const isAuthenticated = express.Router().use(validateJwt, findAndAssignUser);

const Auth = {
  login: async (req, res) => {
    const { body } = req;
    try {
      const user = await User.findOne({ email: body.email });

      if (!user) {
        return res
          .status(401)
          .send({ message: "Usuario y/o contraseña inválida!" });
      }

      const isMatch = await bcrypt.compare(body.password, user.password);

      if (!isMatch) {
        return res
          .status(401)
          .send({ message: "Usuario y/o contraseña inválida!" });
      }

      const signed = signToken(user._id);
      return res.status(200).json({
        token: signed,
        user: {
          _id: user._id,
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          rol: user.rol,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error interno del servidor");
    }
  },
  register: async (req, res) => {
    const { body } = req;
    try {
      const isUser = await User.findOne({ email: body.email });

      if (isUser) {
        return res.status(409).send({ message: "Este usuario ya existe" });
      }

      const salt = await bcrypt.genSalt();
      const hashed = await bcrypt.hash(body.password, salt);

      const user = await User.create({
        name: body.name,
        lastname: body.lastname,
        email: body.email,
        rol: body.rol,
        password: hashed,
        salt,
      });

      const signed = signToken(user._id);
      return res.status(201).json({ token: signed });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error interno del servidor");
    }
  },
};

const UserController = {
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error interno del servidor");
    }
  },
};

module.exports = { Auth, UserController };
