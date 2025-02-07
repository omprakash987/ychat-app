import { Router } from "express";
import { signUp,Login,Logout,updateProfile,checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = Router(); 

router.post("/signup",signUp); 
router.post('/login',Login); 
router.post('/logout',Logout);
router.put('/update-profile',protectRoute,updateProfile);
router.get("/check",protectRoute,checkAuth); 

export default router;