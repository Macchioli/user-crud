baseURL = "https://6622ed703e17a3ac846e40e5.mockapi.io/api"

let users;
let isEditing = false;
const tableBodyHTML = document.getElementById("table-body")
const userFormHTML = document.getElementById("user-form"); 

/*===== OBTENER USUARIOS ======*/
getUsers();

function getUsers(){
    axios.get(`${baseURL}/contact-list`)
    .then(respuesta =>{
        users = respuesta.data;
        renderUsers(users)

    })
    .catch(error =>{
        Swal.fire({
            icon: "error",
            title: "¡Algo salió mal!",
            text: "No se pudo realizar la carga de usuarios 😢"
          });
    })
}
/*===== END OBTENER USUARIOS ======*/

/*===== ALTA USUARIO ======*/

userFormHTML.addEventListener("submit", (evento) =>{ 
    evento.preventDefault()
    
    const el = evento.target.elements 
    
    const nuevoUsuario ={
        fullName: el.fullName.value,
        email: el.email.value,
        phone: +el.phone.value, 
        bornDate: new Date(el.bornDate.value).getTime(), 
        urlImg: el.urlImg.value
    }

    if(isEditing){
        //Buscar un usuario y reemplazarlo
        // const userIndex = users.findIndex(user =>{
        //     return user.id === isEditing;
        // })
        // users[userIndex] = nuevoUsuario

    }else{
        //Agregar un usuario ya que es un user nuevo
        axios.post(`${baseURL}/contact-list`, nuevoUsuario)
            .then(()=>{
                getUsers();
                Swal.fire({
                    icon: "success",
                    title: "¡Genial!",
                    text: "El usuario fue registrado correctamente 🎉"
                });
            })
            .catch((error)=>{
                console.log(error)
            })
    }

    

    //Formateamos el formulario
    isEditing = null;
    // formContainerHTML.classList.remove('form-edit')

    // btnSubmitHTML.classList.add('btn-primary')
    // btnSubmitHTML.classList.remove('btn-success')
    // btnSubmitHTML.innerText = "Agregar";

    /* Formateo Form */
    userFormHTML.reset();
    el.fullName.focus();
})

/*===== END ALTA USUARIO ======*/


/*===== RENDER USERS ======*/
function renderUsers(arrayUsers){
    tableBodyHTML.innerHTML = '';

    arrayUsers.forEach((user) =>{
        tableBodyHTML.innerHTML += `<tr>
                                        <td>
                                            <img class="user-image" src="${user.urlImg}" alt="${user.fullName} avatar">
                                        </td>
                                        <td style="font-weight:bold;">${user.fullName}</td>
                                        <td>${user.email}</td>
                                        <td>${user.phone}</td>
                                        <td>${transformTimestampToDate(user.bornDate)}</td>
                                        <td class="user-actions">
                                            <button class="btn btn-danger btn-sm mt-1" data-delete="${user.id}"> <i class="fa-solid fa-trash"></i></button>
                                            <button class="btn btn-primary btn-sm mt-1" data-edit="${user.id}"><i class="fa-solid fa-pencil"></i></button>
                                        </td>
                                    </tr>`
    })
}
/*===== END RENDER USERS ======*/

/*===== TRANSFORMAR TIMESTAMP A DATE ======*/
function transformTimestampToDate(dateTimeStamp){
    const dateFormat = new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    })

    const date = dateFormat.format(dateTimeStamp)

    return date
}
/*===== END TRANSFORMAR TIMESTAMP A DATE ======*/

/*===== COMPLETAR FORMULARIO DE USUARIO ======*/



/*===== END COMPLETAR FORMULARIO DE USUARIO ======*/
