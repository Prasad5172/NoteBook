const jwt = require('jsonwebtoken')
const JWT_SCERETE = 'hithisisprasad'

const fetchuser =  async (req,res,next) => {
    const token = req.header('auth-token')
    try {
        if(!token){
            res.status(401).send("Please authenticate with a valid token")
        }
        const data = jwt.verify(token,JWT_SCERETE)
        req.user = data.user
        next(); 
    } catch (error) {
        res.status(400).send({error:"Please authenticate with a valid token "})
    }
}
module.exports = fetchuser