const { verifyToken } = require("../Helpers/generateToken");
const { db } = require("../cnn")


const checkRoleAuth = (roles) => async (req, res, next) => {
  try {
    console.log(roles)

    const token = req.headers.authorization.split(" ").pop();
    const tokenData = await verifyToken(token);

    const result = await db.query('select tipo_usuario from tbl_usuario  where id_usuario=$1', [tokenData._id])
    console.log(result)

    if ([].concat(roles).includes(result[0].tipo_usuario)) {
      next();
    } else {
      res.status(409).send(`{ "Error":"No rol"}`)
    }





  } catch (e) {
    res.status(409).send(`{ "Error":"No found"}`)
  }
};

module.exports = checkRoleAuth;
