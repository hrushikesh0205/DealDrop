import jwt from "jsonwebtoken";
function socketAuth(socket,next)
{
    try{
        const token = socket.handshake.auth?.token;
        if(!token)
        {
            return next(new Error("Authentication Token Missing"));
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);

        socket.user={
            userId : decoded.userId,
            role : decoded.role
        };
        next();
    }catch(e)
    {
        next(new Error("Invalid or Expired token"));
    }
}

export {socketAuth};