import { Router } from "express";
import { saveToken } from "./tokenRoute";


const router = Router();


router.post('/token', saveToken)

export default router