const form = document.getElementById("resetPasswordForm");
form.addEventListener("submit", e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);

    fetch("/api/sessions/resetPassword", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(result => {
        if (result.status === 200) {
            alert("Contraseña modificada correctamente");
            window.location.replace('/');
        } else if (result.status === 400) {
            return result.json().then(error => {
                alert(error.payload);
            });
        } else {
            console.log("error");
        }
    }).catch(error => {
        console.error('Error:', error);
    });
});