const jwt = require("jsonwebtoken");

const tokenSign = async (id, rol) => {
    return jwt.sign(
        {
            _id: id,
            role: rol,
        },
        "SistemaHUacales",
        {
            expiresIn: "24d",
        }
    );
};

const verifyToken = async (token) => {
    try {
        return jwt.verify(token, "SistemaHuacales");
    } catch (e) {
        return null;
    }
};

const decodeSign = (token) => {
    return jwt.decode(token, null);
};

module.exports = { tokenSign, decodeSign, verifyToken };