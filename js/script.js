baseURL = "https://6622ed703e17a3ac846e40e5.mockapi.io/api"

let users;
let isEditing = null;
const tableBodyHTML = document.getElementById("table-body");
const userFormHTML = document.getElementById("user-form");
const formContainerHTML = document.getElementById("form-container");
const btnSubmitHTML = document.getElementById("btn-submit");
const formTitleHTML = document.getElementById("form-title");

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
    
    const usuarioEnForm ={
        fullName: el.fullName.value,
        email: el.email.value,
        phone: +el.phone.value, 
        bornDate: new Date(el.bornDate.value).getTime(), 
        urlImg: el.urlImg.value
    }

    if(isEditing){
        console.log("Entro editor y el id es" + isEditing)
        //Buscar un usuario y reemplazarlo
        axios.put(`${baseURL}/contact-list/${isEditing}`, usuarioEnForm )
            .then(()=>{
                getUsers();
                Swal.fire({
                    icon: "success",
                    title: "¡Genial!",
                    text: "El usuario fue editado correctamente 🎉"
                });
            })
            .catch((error)=>{
                console.log(error)
            })
    }else{
        //Agregar un usuario ya que es un user nuevo
        axios.post(`${baseURL}/contact-list`, usuarioEnForm)
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
    formContainerHTML.classList.remove('form-edit')
    btnSubmitHTML.classList.add('btn-primary')
    btnSubmitHTML.classList.remove('btn-success')
    formTitleHTML.innerHTML = "Registro";
    btnSubmitHTML.innerText = "Registrar";

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
    updateEditButtons();
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

/* ===== UPDATE BOTONES EDIT ===== */
function updateEditButtons(){
    userButtonsEdit = document.querySelectorAll('button[data-edit]') 
    
    userButtonsEdit.forEach((btn) =>{ 
         
        btn.addEventListener('click', (evt) =>{
        
            const id = evt.currentTarget.dataset.edit

            console.log(id) //Imprimo para corroborar

            completeUserForm(id);
        }) 
    }) 
}
/* ===== END UPDATE BOTONES EDIT ===== */
/*===== EDITAR USUARIO POR FORMULARIO ======*/
function completeUserForm(idUser){
    console.log(`Complete Form ${idUser}`)
    
    isEditing = idUser; 
    const user = users.find((usr) =>{
        if(usr.id === idUser){
            return true
        }
        return false
    })
    
    if(!user){
        Swal.fire("Error", "No se encontro usuario")
        return
    }
    //Rellenar el formulario con los datos de este usuario
    const el = userFormHTML.elements;

    el.fullName.value = user.fullName;
    el.email.value = user.email;
    el.phone.value = user.phone;
    el.bornDate.valueAsNumber = user.bornDate;
    el.urlImg.value = user.urlImg;
    


    formContainerHTML.classList.add('form-edit');
    btnSubmitHTML.classList.remove('btn-primary');
    btnSubmitHTML.classList.add('btn-success');
    formTitleHTML.innerHTML = `Editar usuario: <h5 style="color:grey;">${user.fullName}</h5>`
    btnSubmitHTML.innerText = "Editar";

}
/*===== END EDITAR USUARIO POR FORMULARIO ======*/
