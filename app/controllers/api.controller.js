class ApiController {
  static getHealthCheck(req, res) {
    res.status(200).send();
  }
}

module.exports = ApiController;
