import { app } from "../src/app.js";
import { expect } from 'chai';
import supertest from "supertest";
import userModel from "../src/dao/models/users.model.js";

const requester = supertest(app);

describe("Testing the carts router", () => {

    it("The endpoint get /api/carts/ should return all carts", async function () {
        const result = await requester.get("/api/carts/");
        const { statusCode, body } = result;
        expect(statusCode).to.be.equal(200);
        expect(body.carts).to.be.an('array');
    })

    it("The endpoint post /api/carts/ creates a product successfully ", async function () {
        const cartsMock = {
            products: [
                {
                    product: "6071ef280a2bfc2a50fb41dd",
                    quantity: 2
                }
            ]
        }
        const result = await requester.post("/api/carts/").send(cartsMock);
        const { statusCode, body } = result;
        expect(statusCode).to.be.equal(201);
        expect(body.status).to.be.equal("success");
    })

    it("The endpoint get /api/carts/:cid should return a specific cart", async function () {
        const existingCartId = '660ca3e06e484532355f5758';
        const result = await requester.get(`/api/carts/${existingCartId}`);
        const { statusCode, body } = result;
        expect(statusCode).to.be.equal(200);
        expect(body).to.have.property('product');
    })
})

let ck;

describe("Testing the products router", () => {

    it("GET /api/products/ should return all products", async () => {
        const result = await requester.get("/api/products/");
        const {statusCode, body} = result;
        expect(statusCode).to.be.equal(200);
        expect(body.products.msg.docs).to.be.an('array');
    });

    it("The endpoint post /api/products/ creates a product successfully ", async function () {

        const userMock = {
            email: "testadmin@gmail.com",
            password: "angelo"
        }
        const responseSigned = await requester.post('/api/sessions/login').send(userMock);
        expect(responseSigned.statusCode).to.be.equal(200)
        const cookieResult = responseSigned.headers['set-cookie'][0];
        expect(cookieResult).to.be.ok;

        // Divida la cadena según el punto y coma para obtener partes individuales
        const parts = cookieResult.split(";");

        // Iterar sobre las partes para encontrar la que contiene el valor de la cookie
        let cookieValue;
        parts.forEach(part => {
            const keyValue = part.trim().split("=");
            if (keyValue.length === 2 && keyValue[0] === "connect.sid") {
                cookieValue = keyValue[1];
            }
        });


        let cookie = {
            name: cookieResult.split('=')[0],
            value: cookieValue,
            full: cookieResult
        };
        expect(cookie.name).to.be.ok.and.eql('connect.sid');
        expect(cookie.value).to.be.ok;
        const productMock = {
            title: "Musculosa blanca",
            description: "Remera musculosa blanca",
            price: 5000,
            code: "RMB",
            stock: 27,
            category: "indumentaria",
            thumbnail: "google.com",
            owner: "admin"
        }
        ck = [`${cookie.name}=${cookie.value}`]
        const result = await requester.post("/api/products/").send(productMock).set('Cookie', ck);
        const {statusCode, _body} = result;
        expect(statusCode).to.be.equal(200)
        expect(_body.status).to.be.equal("success")
    })

    it("PUT /api/products/:pid most return 200", async function () {
        const productMock = {
            title: "Musculosa blanca",
            description: "Remera musculosa blanca",
            price: 5000,
            code: "RMB",
            stock: 27,
            category: "indumentaria",
            thumbnail: "google.com",
            owner: "admin"
        }
        const {body, statusCode, ok} = await requester.post("/api/products").send(productMock).set('Cookie', ck);
        const response = await requester.put(`/api/products/${body.message._id}`).send({title: "Pantalon"}).set('Cookie', ck);
        expect(response.status).to.be.equal(200)
    })

    it("DELETE /api/products/:pid most return 200", async function () {
        const productMock = {
            title: "Musculosa blanca",
            description: "Remera musculosa blanca",
            price: 5000,
            code: "RMB",
            stock: 27,
            category: "indumentaria",
            thumbnail: "google.com",
            owner: "admin"
        }
        const {body, statusCode, ok} = await requester.post("/api/products").send(productMock).set('Cookie', ck);
        const responseDelete = await requester.delete(`/api/products/${body.message._id}`)
        const response = await requester.get(`/api/products/${body.message._id}`)
        expect(response.body.payload).to.be.equal(undefined);

    })
})

let cookie;

describe("Testing the users router", () => {

    it('You must correctly register a user', async function () {
        await userModel.deleteOne({email: "test@gmail.com" });
        const userMock = {
            first_name: "Angelo",
            last_name: "Padoan",
            age: 22,
            email: "test@gmail.com",
            password: "2024"
        }
        const responseSigned = await requester.post('/api/sessions/register').send(userMock);
        expect(responseSigned.statusCode).to.be.equal(200)
        const cookieResult = responseSigned.headers['set-cookie'][0];
        expect(cookieResult).to.be.ok;

        // Divida la cadena según el punto y coma para obtener partes individuales
        const parts = cookieResult.split(";");

        // Iterar sobre las partes para encontrar la que contiene el valor de la cookie
        let cookieValue;
        parts.forEach(part => {
            const keyValue = part.trim().split("=");
            if (keyValue.length === 2 && keyValue[0] === "connect.sid") {
                cookieValue = keyValue[1];
            }
        });

        cookie = {
            name: cookieResult.split('=')[0],
            value: cookieValue,
            full: cookieResult
        };

        expect(cookie.name).to.be.ok.and.eql('connect.sid');
        expect(cookie.value).to.be.ok;
    })

    it("login", async function(){
        const userMock = {
            email: "test@gmail.com",
            password: "2024"
        }
        const responseSigned = await requester.post('/api/sessions/login').send(userMock);
        expect(responseSigned.statusCode).to.be.equal(200)
    })

    it("You must send the cookie containing the user and return it", async function(){

        const ck =  [`${cookie.name}=${cookie.value}`]
        const {_body} = await requester.get('/api/sessions/current').set('Cookie', ck)
        expect(_body.user.email).to.be.eql('test@gmail.com')
    })
});