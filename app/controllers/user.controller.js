const userModel = require("../models/user.model");
const AppError = require("../utils/app-error");

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const users = await userModel.getAllUsers();

      if (!users.length) {
        throw AppError.notFound("Not Found");
      }

      res.json({ users });
    } catch (error) {
      next(error);
    }
  }

  async getUser(req, res, next) {
    try {
      const { user_name } = req.params;
      const users = await userModel.getUserByName(user_name);

      if (!users.length) {
        throw AppError.notFound("Not found");
      }

      res.json({ user: users[0] });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { user_name } = req.params;
      const srUpdates = req.body;

      const user = await userModel.updateUserSR(user_name, srUpdates);

      res.json({ user });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
