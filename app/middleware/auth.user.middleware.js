const {tokenverify} = require("../services/tokenverify");


const auth_user = async (req, res, next) => {
    try{

        if(!req.headers.authorization){
            return res.status(401).json({message: "NOT_TOKEN"});
        };
        
        const token = req.headers.authorization.split(' ').pop();
        const dataToken = await tokenverify(token);
        
        if(!dataToken.userID){
            return res.status(401).json({message: "ERROR_ID_TOKEN"});
        };

        next()
        
    }catch (e){
        return res.status(401).json({message: "NOT_SESSION"});
    };
}

module.exports = auth_user;
