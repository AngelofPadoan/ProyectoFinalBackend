const form = document.getElementById("recoverPasswordForm");
form.addEventListener("submit",(e)=>{
    e.preventDefault();

    const email = document.getElementById("recoverPasswordEmail").value.trim();

    console.log(email);

    if (email === "") {
        alert("Debes ingresar tu email");
        return;
    }

    fetch("/api/sessions/recoverPassword",{
        method : "POST",
        body : JSON.stringify({email}),
        headers : {
            "Content-Type" : "application/json"
        }
    })
        .then(result => result.json())
        .then(json => {
            if (json.status === "success") {
                alert("Email enviado con exito");
            }
            else{
                alert("Error al enviar email para recuperar la contraseña");
            }
        })
})