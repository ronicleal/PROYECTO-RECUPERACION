import { Producto } from "../src/modules/producto.js";

const REGEX_NOMBRE = /^[A-Z][a-zA-Z\s]{3,19}$/;

let producto;

//Capturar todos los campos del formulario
const nombre = document.getElementById("nombre-producto");
const precio = document.getElementById("precio-input");
const rareza = document.getElementById("rareza");
const tipo = document.getElementById("tipo");
const bonus = document.getElementById("bonus");
const imagen = document.getElementById("imagen");
const btnEnviar = document.getElementById("enviar");


const errorUsuario = document.getElementById("errorUsuario");

nombre.addEventListener("blur", ()=>{
    if(nombre !==REGEX_NOMBRE){
        errorUsuario.style.color = "red";
        errorUsuario.textContent = "Primera letra mayúscula y min 3 caracteres.";
    }else{
        errorUsuario.textContent=""
    }
})

precio.addEventListener("blur", ()=>{
    if(precio > 0 || precio < 99 ){
        errorUsuario.textContent=""
    }else{
        errorUsuario.style.color = "red";
        errorUsuario.textContent = "No debe ser superior a 99 ni menor que 0";
    }
})



btnEnviar.addEventListener("click", function() {
    const nombreInput = nombre.value.trim();
    const precioInput = parseInt(document.getElementById("precio-input").value) || 0;
    const rarezaInput = document.getElementById("rareza").value;
    const tipoInput =  document.getElementById("tipo").value;
    const bonusInput = document.getElementById("bonus").value;
    const imagenInput = document.getElementById("imagen").value;

    
    producto = new Producto(nombreInput, precioInput, rarezaInput, tipoInput, bonusInput, imagenInput)

    console.log("Producto añadido!!")

    if(localStorage.getItem("producto_Ronic")){
        document.getElementById("nombre-producto").value = localStorage.getItem("nombre");
        document.getElementById("precio-input").value = localStorage.getItem("precio");
        document.getElementById("rareza").value = localStorage.getItem("rareza");
        document.getElementById("tipo").value = localStorage.getItem("tipo");
        document.getElementById("bonus").value = localStorage.getItem("bonus");
    }else{
        localStorage.setItem("producto_Ronic", nombreInput);
        localStorage.setItem("precio", precioInput);
        localStorage.setItem("tipo", tipoInput);
        localStorage.setItem("bonus", bonusInput);
        alert("El objeto se ha guardado correctamente!!")
    }

})

