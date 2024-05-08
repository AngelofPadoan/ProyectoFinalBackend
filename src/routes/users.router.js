import {Router} from "express";
import {upload} from "../middlewares/multer.js";
import {UsersController} from "../controller/users.controller.js";
import {checkRole} from "../middlewares/auth.js";
import methodOverride from 'method-override';

const router = Router();

router.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

router.get('/', UsersController.getUsers);
router.post("/premium/:uid", UsersController.changeRole);
router.post("/:uid/documents", upload.single('document'), UsersController.addDocuments);
router.put("/updateUser",checkRole(["admin"]), UsersController.updateUser)
router.get("/usersView", checkRole(["admin"]), UsersController.getUsers)
router.delete("/deleteUser",checkRole(["admin"]), UsersController.deleteUser)
router.delete('/', UsersController.removeInactiveUsers);

export {router as userRouter};