const User = require("../models/User");

module.exports = {
  getIndex: async (req, res) => {
    try {
      const user = req.user
      res.json({ user})
    } catch (err) {
      console.log(err)
    }
  },
  getLoggedInUser: async (req, res) => {
    console.log(req.user)
    try {
      const user = req.user
      console.log(user)
      res.json(user)
    } catch (err) {
      console.log(err)
    }
  },
}    