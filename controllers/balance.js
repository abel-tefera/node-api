const User = require("../models/User");

const sendCoin = async (req, res, next) => {
  const { coins, sendTo } = req.body;

  if (isNaN(coins) || coins < 1) {
    res.status(400).json({ message: "Coins should be a positive integer" });
    return;
  }
  const sender = await User.findById(req.user._id);
  if (sender.coinBalance < coins) {
    res.status(400).json({ message: "Insufficient Funds" });
    return;
  }
  const receiver = await User.findOne({ name: sendTo });

  if (receiver) {
    try {
      receiver.coinBalance += coins;
      sender.coinBalance -= coins;
      await receiver.save();
      await sender.save();
      res.status(200).json({
        message: `Successfully sent ${coins} coins to ${sendTo}`,
      });
      return;
    } catch (err) {
      res.status(500).json({
        message: "Server error",
        error: err.message,
      });
    }
  } else {
    res.status(400).json({ message: "User not found" });
  }
};

const checkBalance = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json({
      message: `Your available balance is ${user.coinBalance} coins`,
    });
  } else {
    res.status(400).json({ message: "User not found" });
  }
};

module.exports = { sendCoin, checkBalance };
