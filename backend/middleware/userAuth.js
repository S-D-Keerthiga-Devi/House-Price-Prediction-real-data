import jwt from 'jsonwebtoken';

const userAuth = async(req, res, next) => {
    // Check for token in cookies first
    let token = req.cookies?.token;
    
    // If no token in cookies, check Authorization header
    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }

    if(!token){
        return res.json({success: false, message: "Not Authorized. Login Again"})
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

        if(tokenDecode.id){
            req.user = { id: tokenDecode.id };
        }
        else{
            return res.json({success: false, message: "Not Authorized. Login Again"})
        }

        next();
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export default userAuth;