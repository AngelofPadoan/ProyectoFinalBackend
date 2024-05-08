import userModel from "../dao/models/users.model.js";
import {userService} from "../repository/index.repository.js";
import {sendEmailInactiveUser} from "../config/gmail.js";

class UsersController {

    static async getUsers(req, res) {
        try {
            const users = await userService.getAll();
            res.send({
                status: "success",
                users: users
            });
        } catch (error) {
            req.logger.error("Error getting all users");
            res.status(500).send({
                status: 'error',
                msg: 'Error interno en el servidor',
            });
        }
    }

    static async updateUser(req, res) {
        try {
            const uid = req.body.uid;
            const newRole = req.body.role
            const user = await userModel.findOne({_id: uid});

            if(newRole === user.role){
                return res.status(404).send({ error: 'Cannot update a user with a role they already had' });
            }
            user.role = newRole

            const result = await userService.updateUser(uid, user);
            return res.status(200).send({ message: 'Usuario modificado', result });
        } catch (error) {
            return res.status(500).send({ error: 'Internal server error' });
        }
    }

    static deleteUser = async (req, res) => {
        try {
            const userId = req.query.id;
            const user = await userModel.findOne({_id: userId});
            const deleteUser = await userService.deleteUser(user)

            res.status(200).send({ status: "success", payload: deleteUser })

        } catch (error) {
            console.log(error)
            res.status(500).send({ status: "error", error: "Error removing user" })

        }
    }

    static async removeInactiveUsers(req, res) {
        try {
            const twoDaysAgo  = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
            const inactiveUsers = await userModel.find({ last_connection: { $lt: twoDaysAgo  } }, 'email');
            const deleteResult = await userModel.deleteMany({ last_connection: { $lt: twoDaysAgo  } });

            const deletedCount = deleteResult.deletedCount;

            if (deletedCount > 0) {
                await Promise.all(inactiveUsers.map(async (user) => {
                    await sendEmailInactiveUser(user.email);
                    console.log(`Correo electrónico enviado a ${user.email}`);
                }));
            }

            res.send({
                status: "success",
                message: `${deletedCount} usuarios inactivos eliminados exitosamente`
            });
        } catch (error) {
            console.error("Error removing inactive users:", error);
            res.status(500).send({
                status: 'error',
                msg: 'Error interno en el servidor',
            });
        }
    }

    static addDocuments = async(req,res)=> {

        const uid = req.params.uid;
        const filename = req.file.filename
        const user = await userModel.findOne({_id: uid});



        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if(!filename) {
            return res.status(400).send({status:"error", error:"The document could not be loaded"})
        }

        const document = {
            name: filename,
            reference: `http://localhost:8080/files/documents/${filename}`
        }

        user.documents.push(document)

        const result = await userModel.updateOne({_id: uid}, {$set: user});

        return res.status(200).json({ message: 'Documento cargado exitosamente', result });

    }

    static async changeRole(req, res) {
        const {uid} = req.params;

        if (!uid) return res.status(400).send({
            status: "error",
            message: "datos incorrectos"
        });

        const user = await userModel.findOne({_id: uid});
        if (!user) return res.status(400).send({
            status: "error",
            message: "Usuario inexistente"
        });

        // Comprueba si el usuario ha subido al menos 3 documentos
        if (user.documents.length < 3 && user.role !== "premium") {
            return res.status(400).send({
                status: "error",
                message: "El usuario debe cargar al menos 3 documentos para actualizar al rol premium"
            });
        }

        // Verifique si el usuario ha subido todos los documentos requeridos antes de actualizar a premium
        if (user.role === "user" && user.documents.length < 3) {
            return res.status(400).send({
                status: "error",
                message: "El usuario no ha terminado de procesar su documentación"
            });
        }

        let newRole
        if (user.role === "user"){
            newRole = "premium";
        }else {
            newRole = "user"
        }

        const response = await userModel.updateOne({_id: user._id}, {$set: {role: newRole}});

        res.send({
            status: "success",
            message: "Rol modificado",
            response
        });
    }
}

export {UsersController}