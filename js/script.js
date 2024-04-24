baseURL = "https://6622ed703e17a3ac846e40e5.mockapi.io/api"

let users;
const tableBodyHTML = document.getElementById("table-body")

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