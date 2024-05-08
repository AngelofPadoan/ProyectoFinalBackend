const socket = io();
let username;

/**
 * Solicita al usuario que ingrese su nombre de usuario y emite un evento de "nuevo usuario" al servidor.
 */
Swal.fire({
    title: "Identifícate",
    input: "text",
    text: "Ingresa tu nombre de usuario.",
    inputValidator: (value) => {
        return !value && "Es obligatorio un nombre de usuario.";
    },
    allowOutsideClick: false,
}).then((result)=>{
    username = result.value;
    socket.emit("new-user", username);
});

/**
 * Escucha el evento "keyup" en la entrada del chat y envía un evento de "mensaje de chat" al servidor
 * cuando se presiona la tecla "Enter", junto con el nombre de usuario y el contenido del mensaje.
 */
const chatInput = document.getElementById("chat-input");

chatInput.addEventListener("keyup", (ev)=>{
    if(ev.key === "Enter"){
        const inputMessage = chatInput.value;
        if(inputMessage.trim().length > 0){
            socket.emit("chat-message", {username, message: inputMessage});
            chatInput.value = "";
        }
    }
});

/**
 * Actualiza el panel de mensajes con mensajes de chat entrantes.
 */
const messagesPanel = document.getElementById("messages-panel");

socket.on("messages", (data)=>{
    let messages = "";

    data.forEach((m) => {
        messages += `<b>${m.username}:</b>${m.message}</br>`;
    });
    messagesPanel.innerHTML = messages;
});

socket.on("new-user",(username)=>{
    Swal.fire({
        title: `${username} se ha unido al chat`,
        toast: true,
        position:"top-end"
    });
});