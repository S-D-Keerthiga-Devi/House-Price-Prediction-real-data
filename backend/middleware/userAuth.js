import jwt from 'jsonwebtoken';

const userAuth = async(req, res, next) => {
    // Check Authorization header first (prioritize this for cross-domain requests)
    let token;
    
    if (req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }
    
    // If no token in Authorization header, check cookies as fallback
    if (!token) {
        token = req.cookies?.token;
    }

    if(!token){
        return res.status(401).json({success: false, message: "Not Authorized. Login Again"})
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

        if(tokenDecode.id){
            // Set complete user object with id
            req.user = { id: tokenDecode.id };
            
            // Log successful authentication
            console.log(`User authenticated: ${tokenDecode.id}`);
        }
        else{
            return res.status(401).json({success: false, message: "Not Authorized. Login Again"})
        }

        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        return res.status(401).json({success: false, message: "Authentication failed. Please login again."})
    }
}

export default userAuth;