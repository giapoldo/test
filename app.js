const submitForm = document.getElementById("submit_form");

submitForm.addEventListener("click", async (e) => {
    e.preventDefault();

    const formData = {};
    const fieldsets = document.querySelectorAll('#liquidacion fieldset');

    fieldsets.forEach(fieldset => {
        
        const fieldsetName = fieldset.name;
        formData[fieldsetName] = {};
        
        const inputs = fieldset.querySelectorAll('input');
        inputs.forEach(input => {
            const name = input.name;
            const value = input.value;
            let skip = false;
            if (input.type==="radio" && input.checked===false) {
                skip = true;
            }
            if (name && !skip) {

                const f = parseFloat(value.trim().replaceAll(',','.'));
                if (Number.isNaN(f)) {
                    formData[fieldsetName][name] = value;
                } else {
                    formData[fieldsetName][name] = f;
                } 
            }
                
        });
    });

    const JSONformData = JSON.stringify(formData);

    console.log(JSONformData)

    const response = await fetch("http://localhost:9090/liquidaciones", {
        method: "POST",
        body: JSONformData,
        });
    console.log(await response.json());
});

// const submitUser = document.querySelector("#submit_user");

// submitUser.addEventListener("click", async () => {
//   const userInfo = {
//     Name: "Gianpaolo Merello",
//     Password: "asdasd123",
//     Email: "correo@dominio.cl",
//   };

//   const JSONformData = JSON.stringify(userInfo);
//   console.log(JSONformData);

//   const response = await fetch("http://localhost:9090/users", {
//     method: "POST",
//     body: JSONformData,
//   });
//   console.log(await response.json());
// });

const getLiquidacion = document.querySelector("#get_liquidacion");

getLiquidacion.addEventListener("click", async () => {

  const response = await fetch("http://localhost:9090/liquidaciones/last", {
    method: "GET",
  });
  console.log(await response.json());
});


let modalOrigin;
const dialog = document.getElementById("dialog-box");
const addRowLiquidacion = document.querySelector("#liquidacion");

addRowLiquidacion.addEventListener("click", (e) => {

    modalOrigin = e.target;
    if (modalOrigin.classList.contains("row_adder")) {
        dialog.showModal();
    }
})

const dialogConfirm = document.getElementById("confirm-dialog");
dialogConfirm.addEventListener("click", () => {
    
    const idName = makeRow();
    if (idName) {
        dialog.close();
        document.getElementById(idName).focus()

    }
});

const dialogClose = document.getElementById("close-dialog");
dialogClose.addEventListener("click", () => {
    const modalInput = document.getElementById("modal-input");
    modalInput.value = "";
    dialog.close();
});

dialog.addEventListener("close", () => {
    const modalInput = document.getElementById("modal-input");
    modalInput.value = "";
    dialog.close();
});

dialog.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const idName = makeRow();
        if (idName) {
           dialog.close();
           document.getElementById(idName).focus()
        }   
    }
});


function makeRow() {

    const modalInput = document.getElementById("modal-input");
    const  idName = modalInput.value
    if (document.getElementById(idName) !== null) {
        alert("Nombre de ítem repetido");
        modalInput.focus()
        return false;
    }
    if (idName === "") {
        alert("Campo vacío");
        modalInput.focus()
        return false;
    }

    const row = document.createElement("div");
    const label = document.createElement("label");
    label.setAttribute("for", idName);
    label.innerHTML=idName;
    const input = document.createElement("input");
    input.type="text";
    input.id=idName;
    row.appendChild(label);
    row.appendChild(input);
    modalOrigin.parentElement.insertBefore(row, modalOrigin);
    return idName;
}