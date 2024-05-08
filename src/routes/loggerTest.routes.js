import {Router} from 'express';
import {LoggerTestController} from "../controller/loggerTest.controller.js";
const router = Router();

router.get("/", LoggerTestController.loggerTest);

export default router;