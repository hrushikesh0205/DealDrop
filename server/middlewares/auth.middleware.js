import jwt from "jsonwebtoken";

function authMiddleware(req,res,next)
{
    try{    
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer "))
        {
            return res.status(401).json({
                message : "Access token missing or invalid"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded= jwt.verify(token,process.env.JWT_SECRET_KEY);

        req.user={
            userId : decoded.userId,
            role : decoded.role
        };
        next();
    }catch(err)
    {
        return res.status(401).send("Invalid or Expired Token");
    }
}

export {authMiddleware};