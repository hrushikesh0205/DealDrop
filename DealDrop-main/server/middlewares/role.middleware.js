function roleMiddleware(allowedRoles=[])
{
    return(req,res,next) => 
    {
        try
        {
            const userRole = req.user?.role;

            if(!userRole)
            {
                return res.status(401).json({message : "Unauthorized access"});
            }

            if(!allowedRoles.includes(userRole))
            {
                return res.status(403).json({message : "Access denied for this role"});
            }

            next();
        }catch(e)
        {
            return res.status(500).json({message : "Role authorization failed"});
        }
    }
}

export {roleMiddleware};