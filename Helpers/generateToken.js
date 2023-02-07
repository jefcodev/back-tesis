const jwt = require("jsonwebtoken");

const tokenSign = async (id, rol) => {
    return jwt.sign(
        {
            _id: id,
            role: rol,
        },
        "SistemaHUacales",
        {
            expiresIn: "12h",
        }
    );
};

const verifyToken = async (token) => {
    try {
        return jwt.verify(token, "SistemaHUacales");
    } catch (e) {
        return null;
    }
};

const decodeSign = (token) => {
    return jwt.decode(token, null);
};

module.exports = { tokenSign, decodeSign, verifyToken };