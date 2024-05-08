const form = document.getElementById('registerForm');
form.addEventListener('submit', e=>{
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=>obj[key]=value);

    fetch("/api/sessions/register", {
        method: "POST",
        body: JSON.stringify(obj),
        headers:{
            "Content-Type":"application/json"
        }
    }).then(result=>result.json()).then(result=>{
        if(result.status==="success"){
            alert("Usuario registrado exitosamente")
            window.location.replace('/')
        }else{
            alert("Ha ocurrido un error. Usuario existente o debes ingresar todos los campos")
        }
    })
})