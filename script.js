
const btnadd = document.querySelector(".btn-add");
const addworkeroverlay = document.querySelector(".add-worker-overlay");

const btnaddexpe = document.querySelector(".btn-add-experience");
const expeLIST = document.querySelector(".experience-list");
const btnsave = document.querySelector(".btn-save-worker");
const unassignedList = document.querySelector(".unassigned-list");


const inputName = document.querySelector(".input-name");
const inputRole = document.querySelector(".input-role");
const inputPhoto = document.querySelector(".input-photo");
const inputPhotoFile = document.querySelector(".input-photo-file");
const photoPreviewFrame = document.querySelector(".photo-preview-frame");
const photoPreviewImg = document.querySelector(".photo-preview-img");
const inputEmail = document.querySelector(".input-email");
const inputPhone = document.querySelector(".input-phone");

 




function setPhotoPreview(src) {
    if (!photoPreviewFrame || !photoPreviewImg) return;

    if (src) {
        photoPreviewImg.src = src;
        photoPreviewFrame.classList.add("has-image");
    } else {
        photoPreviewImg.src = "";
        photoPreviewFrame.classList.remove("has-image");
    }
}





function previewSelectedFile(file) {
    if (!file) {
        setPhotoPreview("");
        return;
    }

    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.onerror = () => setPhotoPreview("");
    reader.readAsDataURL(file);
}




if (inputPhotoFile) {
    inputPhotoFile.addEventListener("change", function () {
        const file = inputPhotoFile.files && inputPhotoFile.files[0];
        if (file) {
            previewSelectedFile(file);
        } else {
            setPhotoPreview(inputPhoto.value.trim());
        }
    });
}




if (inputPhoto) {
    inputPhoto.addEventListener("input", function () {
        if (!inputPhotoFile || !inputPhotoFile.files || inputPhotoFile.files.length === 0) {
            const url = inputPhoto.value.trim();
            setPhotoPreview(url);
        }
    });
}










setPhotoPreview(inputPhoto ? inputPhoto.value.trim() : "");



btnadd.addEventListener("click", function () {
    addworkeroverlay.classList.add("active");
}); 









const closeButtons = document.querySelectorAll(".modal-close");

for (let i = 0; i < closeButtons.length; i++) {
    closeButtons[i].addEventListener("click", function () {
        const overlays = document.querySelectorAll(".modal-overlay");

        for (let j = 0; j < overlays.length; j++) {
            overlays[j].classList.remove("active");
        }
    });
}



















function createExperienceRow() {
    const row = document.createElement("div");
    row.classList.add("experience-row");

    const companyInput = document.createElement("input");
    companyInput.type = "text";
    companyInput.placeholder = "Entreprise";
    companyInput.classList.add("exp-company");

    const roleInput = document.createElement("input");
    roleInput.type = "text";
    roleInput.placeholder = "Poste";
    roleInput.classList.add("exp-role");

    const durationInput = document.createElement("input");
    durationInput.type = "text";
    durationInput.placeholder = "Duree";
    durationInput.classList.add("exp-duration");

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.classList.add("btn-delete-experience");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
        row.remove();
    });

    row.appendChild(companyInput);
    row.appendChild(roleInput);
    row.appendChild(durationInput);
    row.appendChild(deleteBtn);

    return row;
}

btnaddexpe.addEventListener("click", function () {
    if (!expeLIST) return;
    expeLIST.appendChild(createExperienceRow());
});





if (expeLIST) {
    expeLIST.appendChild(createExperienceRow());
}



const zoneLimits = {
    conference: Infinity,   
    personnel: Infinity,    
    reception: 1,
    serveurs: 2,
    security: 1,
    archives: 1
};





const zoneButtons = document.querySelectorAll(".zone-add-btn");

for (let i = 0; i < zoneButtons.length; i++) {
    zoneButtons[i].addEventListener("click", function () {

        
        const zoneElement = zoneButtons[i].closest(".zone");
        const zoneName = zoneElement.dataset.zone;   

        console.log("Clicked zone:", zoneName);

        
        chooseWorkerForZone(zoneElement, zoneName);
    });
}





let workers = [];

function resolvePhotoValue() {
    return new Promise((resolve) => {
        if (!inputPhotoFile || !inputPhotoFile.files || inputPhotoFile.files.length === 0) {
            resolve(inputPhoto.value.trim());
            return;
        }

        const file = inputPhotoFile.files[0];
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => resolve(inputPhoto.value.trim());
        reader.readAsDataURL(file);
    });
}






btnsave.addEventListener("click", async function() {

     const expROWS = document.querySelectorAll (".experience-row");
    
    const photoValue = await resolvePhotoValue();

    const worker = {
        name: inputName.value,
        role: inputRole.value,
        photo: photoValue,
        email: inputEmail.value,
        phone: inputPhone.value,
        experiences: [],
        location: "unassigned" 
    };


    for (let i = 0; i < expROWS.length; i++) {
        const row = expROWS[i];
        const company = row.querySelector(".exp-company") ? row.querySelector(".exp-company").value.trim() : "";
        const role = row.querySelector(".exp-role") ? row.querySelector(".exp-role").value.trim() : "";
        const duration = row.querySelector(".exp-duration") ? row.querySelector(".exp-duration").value.trim() : "";

        if (company || role || duration) {
            const experienceText = [company, role, duration].filter(Boolean).join(" | ");
            worker.experiences.push(experienceText);
        }
    }


    

    workers.push(worker);

    console.log(workers);

   


 
 const workerCard = document.createElement("div");
 workerCard.classList.add("worker-card");

  workerCard.dataset.index = workers.length - 1;
  //  workerCard.innerHTML = '<img src="'+ worker.photo +'" style="width:50px; height:50px; border-radius:50%;">' +
 //     '<p>' + worker.name + '</p>' +
 //     '<p>' + worker.role + '</p>' ;





 workerCard.innerHTML =
    '<button class="remove-worker">X</button>' +
    '<img src="' + worker.photo + '" style="width:50px; height:50px; border-radius:50%;">' +
    '<p>' + worker.name + '</p>' +
    '<p>' + worker.role + '</p>';

 
 unassignedList.appendChild(workerCard);


 
 const removeBtn = workerCard.querySelector(".remove-worker");

 removeBtn.addEventListener("click", function (event) {

    
    event.stopPropagation();

   
    workers[workerCard.dataset.index].location = "unassigned";

    
    unassignedList.appendChild(workerCard);
 });








 if (inputPhotoFile) {
    inputPhotoFile.value = "";
 }



 setPhotoPreview(inputPhoto ? inputPhoto.value.trim() : "");


 workerCard.addEventListener("click", function() {
    openProfile(workerCard.dataset.index);
 });

});








let simpleWorkers = [];
let simpleCallback = null;

function openSimpleModal(workers, callback) {
    simpleWorkers = workers;
    simpleCallback = callback;

    const modal = document.getElementById("chooseWorkerModal");
    const list = document.getElementById("simpleWorkerList");

    if (!modal) {
        console.error("❌ chooseWorkerModal not found in HTML");
        return;
    }

    list.innerHTML = "";

    workers.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "simple-list-item";
        div.textContent = item.worker.name + " (" + item.worker.role + ")";
        div.onclick = () => {
            callback(index);
            closeSimpleModal();
        };
        list.appendChild(div);
    });

    modal.style.display = "flex";
}

function closeSimpleModal() {
    document.getElementById("chooseWorkerModal").style.display = "none";
}











function chooseWorkerForZone(zoneElement, zoneName) {

   
    const availableWorkers = [];

    for (let i = 0; i < workers.length; i++) {
        // if (workers[i].location === "unassigned") {
        //     availableWorkers.push({ worker: workers[i], index: i });
        // }

        
      
        if (
    workers[i].location === "unassigned" &&
    canEnter(workers[i].role, zoneName)
 )
 {
    availableWorkers.push({ worker: workers[i], index: i });
 }




    }

    if (availableWorkers.length === 0) {
        alert("No available workers in Unassigned list.");
        return;
    }

   
    let message = "Choose worker number for zone: " + zoneName + "\n\n";

    for (let i = 0; i < availableWorkers.length; i++) {
        message += i + " - " + availableWorkers[i].worker.name + " (" + availableWorkers[i].worker.role + ")\n";
    }























    
    // const choice = prompt(message);

    // const chosenIndex = Number(choice);

    // if (isNaN(chosenIndex) || chosenIndex < 0 || chosenIndex >= availableWorkers.length) {
    //     alert("Invalid choice.");
    //     return;
    // }





     openSimpleModal(availableWorkers, function(chosenIndex) {
    const selected = availableWorkers[chosenIndex];

    const card = unassignedList.querySelector('[data-index="' + selected.index + '"]');
    if (!card) {
        alert("Card not found!");
        return;
    }

    const zoneStaff = zoneElement.querySelector(".zone-staff");

    unassignedList.removeChild(card);
    zoneStaff.appendChild(card);

    workers[selected.index].location = zoneName;

    card.addEventListener("click", function () {
        openProfile(card.dataset.index);
    });
});

































    const selected = availableWorkers[chosenIndex];  

    
    const card = unassignedList.querySelector('[data-index="' + selected.index + '"]');

    if (!card) {
        alert("Card not found!");
        return;
    }

   
    const zoneStaff = zoneElement.querySelector(".zone-staff");

    unassignedList.removeChild(card);
    zoneStaff.appendChild(card);



    card.addEventListener("click", function () {
    openProfile(card.dataset.index);
     
    });

    

    
 const currentCount = zoneStaff.children.length;


 const limit = zoneLimits[zoneName];

 if (currentCount >= limit) {
    alert("This zone is full! Maximum allowed: " + limit);
    return;
 }


 
 workers[selected.index].location = zoneName;

}



















function openProfile(index) {

    const worker = workers[index];

    
    const profileOverlay = document.querySelector(".profile-overlay");

    
    document.querySelector(".profile-photo").src = worker.photo;
    document.querySelector(".profile-name").textContent = worker.name;
    document.querySelector(".profile-role").textContent = worker.role;
    document.querySelector(".profile-email").textContent = worker.email;
    document.querySelector(".profile-phone").textContent = worker.phone;

   
    const ul = document.querySelector(".profile-experiences");
    ul.innerHTML = ""; 

   for (let i = 0; i < worker.experiences.length; i++) {
        const li = document.createElement("li");
        li.textContent = worker.experiences[i];
        ul.appendChild(li);



    }

   
    document.querySelector(".profile-location").textContent =
        
        worker.location || "Unassigned";
    
    profileOverlay.classList.add("active");
}























function normalizeText(value) {
    if (!value) return "";
    return value
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function canEnter(workerRole, zoneName) {

    const normalizedRole = normalizeText(workerRole);
    const normalizedZone = normalizeText(zoneName);

    if (normalizedZone === "reception") {
        return normalizedRole === "reception";
    }

    if (normalizedZone === "serveurs") {
        return normalizedRole === "techniciens it";
    }

    if (normalizedZone === "security") {
        return normalizedRole === "agents de securite";
    }

    if (normalizedRole === "manager") {
        return true;
    }

    if (normalizedRole === "nettoyage") {
        return normalizedZone !== "archives";
    }

    if (normalizedZone === "reception" ||
        normalizedZone === "serveurs" ||
        normalizedZone === "security") {
        return false;
    }

    return true;

}
