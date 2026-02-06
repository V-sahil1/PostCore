import { Router } from "express";
import { saveToken } from "../controller/token.controller";


const router = Router();


router.post('/token', saveToken)

export default router