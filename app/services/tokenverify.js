const jsonwebtoken = require("jsonwebtoken")

const tokenVerify = async (tokenJWT) => {
    try{
        return jsonwebtoken.verify(tokenJWT, process.env.JWT_SECRET)
    }catch(e){
        return null
    }
}

module.exports = {tokenVerify}