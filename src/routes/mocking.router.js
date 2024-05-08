import {Router} from 'express';
import {MockingController} from "../controller/mocking.controller.js";

const router = Router();

router.get("/", MockingController.getMockingProducts);

export default router;