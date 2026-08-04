const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

mongoose.pluralize(null);

const saltround = 10;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, saltround);
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
