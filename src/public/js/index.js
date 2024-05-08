const socket = io();

const productInput = document.getElementById("product-input");
const descriptionInput = document.getElementById("description-input");
const codeInput = document.getElementById("code-input");
const priceInput = document.getElementById("price-input");
const stockInput = document.getElementById("stock-input");
const categoryInput = document.getElementById("category-input");
const sendButton = document.getElementById("send-button");
const owner = document.getElementById("input-owner-add");
const role = document.getElementById("input-role-add");

const idInput = document.getElementById("id-input");
const sendButtonDelete = document.getElementById("send-button-delete");

/**
 * Oyente de eventos para el clic del botón enviar.
 * Emite un evento "lista de productos" con los detalles del producto ingresados.
 * @param {Event} ev - El evento de clic.
 */
sendButton.addEventListener("click", function (ev) {

    if (role.value === "admin"){
        owner.value = "admin"
    }
    const payload = {
        "title": productInput.value,
        "description": descriptionInput.value,
        "code": codeInput.value,
        "price": priceInput.value,
        "stock": stockInput.value,
        "category": categoryInput.value,
        "owner": owner.value
    }

    socket.emit("products-list", JSON.stringify(payload));
    alert("Producto creado exitosamente");

})

sendButtonDelete.addEventListener("click", function (ev) {

    const requestOptions = {
        method: "DELETE",
    };

    fetch("/api/products/" + idInput.value, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if (result.status === "success") {
                alert("Producto borrado exitosamente");
            } else {
                console.log(result)
                alert("Producto inexistente o no tienes permisos para borrar este producto");
            }
        })
        .catch((error) => console.error(error));
});

const productsList = document.getElementById("products-list");

socket.on("products-list-update", (data) => {
    productsList.innerText = '';

    for (const el of data) {
        const li = document.createElement("li");
        const product = el;
        li.innerText = `Id: ${product.id} Titulo: ${product.title} Descripción:${product.description} Código:${product.code} Precio:${product.price} Stock:${product.stock} Categoría:${product.category} `;
        productsList.appendChild(li)
    }
})