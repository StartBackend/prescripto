import jwt from 'jsonwebtoken'
// user authentiaction
const authUser=async(req,res,next )=>{
    try {
     const {token}=req.headers
     // not token available 
     if(!token){
        return res.json({success:false,message:"Not Autorized login again"})

     }
     const token_decode=jwt.verify(token,process.env.JWT_SECRET)
    //  if(token_decode!==process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD){
    //     return res.json({sucess:false,message:'Not authorized login again'})
    //  }

   req.body.userId = token_decode.id
    next()
    } catch (error) {
        console.log(error)
        
    }
}

export default authUser