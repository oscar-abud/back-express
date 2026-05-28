const mongoose = require("mongoose");

const UserSchema = mongoose.model("user", {
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  rol: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = UserSchema;