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
    .catch(() =>{
        Swal.fire({
            icon: "error",
            title: "¡Algo salió mal!",
            text: "No se pudo realizar la carga de usuarios 😢"
          });
    })
}
/*===== END OBTENER USUARIOS ======*/

/*===== ALTA / EDICIÓN USUARIO ======*/

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
            .catch(()=>{
                Swal.fire({
                    icon: "error",
                    title: "Algo salió mal! 😭",
                    text: "No pudimos registrar los cambios"
                });
            })
    }else{
        //Agregar un usuario ya que es un user nuevo
        axios.post(`${baseURL}/contact-list`, usuarioEnForm)
            .then(()=>{
                getUsers();
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                      toast.onmouseenter = Swal.stopTimer;
                      toast.onmouseleave = Swal.resumeTimer;
                    }
                  });
                  Toast.fire({
                    icon: "success",
                    title: "Usuario registrado con éxito"
                  });
            })
            .catch(()=>{
                Swal.fire({
                    icon: "error",
                    title: "Algo salió mal! 😭",
                    text: "No pudimos registrar los cambios"
                });
            })
    }

    

    //Reset el formulario
    isEditing = null;
    formContainerHTML.classList.remove('form-edit')
    btnSubmitHTML.classList.add('btn-primary')
    btnSubmitHTML.classList.remove('btn-success')
    formTitleHTML.innerHTML = "Registro";
    btnSubmitHTML.innerText = "Registrar";

    userFormHTML.reset();
    el.fullName.focus();
})

/*===== END ALTA / EDICIÓN USUARIO ======*/


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
    updateDeleteButtons();
}
/*===== END RENDER USERS ======*/

/*===== TRANSFORMAR TIMESTAMP A DATE ======*/
function transformTimestampToDate(dateTimeStamp){

    const dateFormat = new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
        })
    
    const offset = new Date().getTimezoneOffset() * 60 * 1000;
    dateTimeStamp += offset;
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

/* ===== ELIMINAR USUARIO */

function updateDeleteButtons(){
    userButtonsDelete = document.querySelectorAll('button[data-delete]') 
    
    userButtonsDelete.forEach((btn) =>{ 
         
        btn.addEventListener('click', (evt) =>{
        
            const id = evt.currentTarget.dataset.delete


            Swal.fire({
                title: "¿Estás seguro?",
                text: "Estás por eliminar un usuario",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#2b285b",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar"
              }).then((result) => {
                    if (result.isConfirmed) {
                        axios.delete(`${baseURL}/contact-list/${id}`) 
                        .then( () => {
                            getUsers();
                            Swal.fire({
                                icon: "success",
                                title: "¡Genial!",
                                text: "El usuario fue eliminado correctamente ♻"
                            });
                        })
                        .catch(() => {
                            Swal.fire({
                                icon: "error",
                                title: "Algo salió mal!",
                                text: "No se pudo eliminar el usuario 😪"
                            });
                        })
                    }
              });

            
        }) 
    }) 
}

/* ===== END ELIMINAR USUARIO */

