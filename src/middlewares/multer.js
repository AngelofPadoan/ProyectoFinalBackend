import multer from "multer";
import { join } from 'path';
import __dirname from "../utils.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = "";
        const route = req.originalUrl
        if (route.startsWith('/products')) {
            folder = join(__dirname, '/public/files/products');
        } else if (route.startsWith('/api/sessions/register')) {
            folder = join(__dirname, '/public/files/profiles');
        } else if (route.startsWith('/api/users')) {
            if (route.includes('/documents')) {
                folder = join(__dirname, '/public/files/documents');
            }
        }

        if (folder === "") {
            folder = join(__dirname, '/public/files');
        }

        cb(null, folder);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});


export const upload = multer({ storage });