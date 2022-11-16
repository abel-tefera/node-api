const Mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const UserSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minlength: 5,
      required: true,
    },
    coinBalance: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = Mongoose.model("user", UserSchema);
module.exports = User;
