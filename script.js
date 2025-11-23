
const btnAdd = document.querySelector(".btn-add");
const addWorkerOverlay = document.querySelector(".add-worker-overlay");
const btnSave = document.querySelector(".btn-save-worker");
const btnAddExperience = document.querySelector(".btn-add-experience");
const experienceList = document.querySelector(".experience-list");
const unassignedList = document.querySelector(".unassigned-list");

const inputName = document.querySelector(".input-name");
const inputRole = document.querySelector(".input-role");
const inputPhotoFile = document.querySelector(".input-photo-file");
const photoFrame = document.querySelector(".photo-preview-frame");
const photoImg = document.querySelector(".photo-preview-img");
const inputEmail = document.querySelector(".input-email");
const inputPhone = document.querySelector(".input-phone");


const errName = document.querySelector(".name-error");
const errEmail = document.querySelector(".email-error");
const errPhone = document.querySelector(".phone-error");



const closeButtons = document.querySelectorAll(".modal-close");








const zoneButtons = document.querySelectorAll(".zone-add-btn");


let workers = [];


const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(?:\+212|0)([ \-]?\d){9}$/;


btnAdd.addEventListener("click", () => {
  addWorkerOverlay.classList.add("active");
});

closeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".modal-overlay")
      .forEach((o) => o.classList.remove("active"));
  });
});


function setPhotoPreview(src) {
  if (!photoImg || !photoFrame) return;

  if (src) {
    photoImg.src = src;
    photoFrame.classList.add("has-image");
  } else {
    photoImg.src = "";
    photoFrame.classList.remove("has-image");
  }
}

if (inputPhotoFile) {
  inputPhotoFile.addEventListener("change", function () {
    const file = inputPhotoFile.files[0];
    if (!file) {
      setPhotoPreview("");
      return;
    }
    const reader = new FileReader();
    reader.onload = function () {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  });
}


function createExperienceRow() {
  const row = document.createElement("div");
  row.classList.add("experience-row");

  row.innerHTML = `
      <input type="text" class="exp-company" placeholder="Entreprise">
      <input type="text" class="exp-role" placeholder="Poste">


      <input type="date" class="exp-start" placeholder="Date début">
      <input type="date" class="exp-end" placeholder="Date fin">

      
      <button type="button" class="btn-delete-experience">Delete</button>
  `;

  const deleteBtn = row.querySelector(".btn-delete-experience");
  deleteBtn.addEventListener("click", function () {
    row.remove();
  });

  return row;
}


experienceList.appendChild(createExperienceRow());


btnAddExperience.addEventListener("click", function () {
  experienceList.appendChild(createExperienceRow());
});


inputName.addEventListener("input", function () {
  if (!errName) return;
  errName.textContent = nameRegex.test(inputName.value)
    ? ""
    : "Nom invalide (min 2 lettres)";
});

inputEmail.addEventListener("input", function () {
  if (!errEmail) return;
  errEmail.textContent = emailRegex.test(inputEmail.value)
    ? ""
    : "Email invalide";
});

inputPhone.addEventListener("input", function () {
  if (!errPhone) return;
  errPhone.textContent = phoneRegex.test(inputPhone.value)
    ? ""
    : "Numéro invalide (+212 ou 0...)";
});


function validateForm() {
  let isValid = true;

  
  if (!nameRegex.test(inputName.value.trim())) {
    if (errName) errName.textContent = "Nom invalide";
    isValid = false;
  } else if (errName) {
    errName.textContent = "";
  }

  
  if (inputRole.value === "") {
   
    alert("Veuillez sélectionner un rôle.");
    isValid = false;
  }

  
  if (!emailRegex.test(inputEmail.value.trim())) {
    if (errEmail) errEmail.textContent = "Email invalide";
    isValid = false;
  } else if (errEmail) {
    errEmail.textContent = "";
  }

  
  if (!phoneRegex.test(inputPhone.value.trim())) {
    if (errPhone) errPhone.textContent = "Numéro invalide";
    isValid = false;
  } else if (errPhone) {
    errPhone.textContent = "";
  }

  
  if (!inputPhotoFile.files.length) {
    alert("Veuillez choisir une photo.");
    isValid = false;
  }

  return isValid;
}


function createWorkerCard(worker, index) {
  const card = document.createElement("div");
  card.classList.add("worker-card");
  card.dataset.index = index;

  card.innerHTML = `
      <button class="remove-worker">X</button>
      <img src="${worker.photo}" style="width:50px; height:50px; border-radius:50%;">
      <p>${worker.name}</p>
      <p>${worker.role}</p>
  `;






   const removeBtn = card.querySelector(".remove-worker");
removeBtn.addEventListener("click", function (event) {
  event.stopPropagation();

  const oldLocation = workers[index].location; // فين كان خدام
  workers[index].location = "unassigned";
  unassignedList.appendChild(card);

  if (oldLocation && oldLocation !== "unassigned") {
    updateZoneCounter(oldLocation);
  }
});


 
  card.addEventListener("click", function () {
    openProfile(index);
  });

  unassignedList.appendChild(card);
}


btnSave.addEventListener("click", function () {
  
  const ok = validateForm();
  if (!ok) return;

  
  const file = inputPhotoFile.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    const photoValue = reader.result;

    
    const worker = {
      name: inputName.value.trim(),
      role: inputRole.value,
      photo: photoValue,
      email: inputEmail.value.trim(),
      phone: inputPhone.value.trim(),
      experiences: [],
      location: "unassigned",
    };

    
    const rows = document.querySelectorAll(".experience-row");
    rows.forEach((row) => {
      const c = row.querySelector(".exp-company").value.trim();
      const r = row.querySelector(".exp-role").value.trim();


    //   const d = row.querySelector(".exp-duration").value.trim();

     const d1 = row.querySelector(".exp-start").value;
     const d2 = row.querySelector(".exp-end").value;

      if (c || r || d1 || d2) {
        worker.experiences.push(`${c} | ${r} | ${d1} → ${d2}`);
      }
    });

    
    workers.push(worker);
    const index = workers.length - 1;

    
    createWorkerCard(worker, index);


    inputPhotoFile.value = "";
    setPhotoPreview("");
  };

  reader.readAsDataURL(file);
});


function openProfile(index) {
  const worker = workers[index];
  const overlay = document.querySelector(".profile-overlay");

  document.querySelector(".profile-photo").src = worker.photo;
  document.querySelector(".profile-name").textContent = worker.name;
  document.querySelector(".profile-role").textContent = worker.role;
  document.querySelector(".profile-email").textContent = worker.email;
  document.querySelector(".profile-phone").textContent = worker.phone;

  const ul = document.querySelector(".profile-experiences");
  ul.innerHTML = "";
  worker.experiences.forEach((exp) => {
    const li = document.createElement("li");
    li.textContent = exp;
    ul.appendChild(li);
  });

  document.querySelector(".profile-location").textContent =
    worker.location || "Unassigned";

  overlay.classList.add("active");
}


const zoneLimits = {
  conference: 10,
  reception: 3,
  serveurs: 4,
  security: 2,
  personnel: 15,
  archives: 3,
};



//zone


function updateZoneCounter(zoneName) {
  const zone = document.querySelector(`.zone[data-zone="${zoneName}"]`);
  if (!zone) return;

  const staffContainer = zone.querySelector(".zone-staff");
  const count = staffContainer ? staffContainer.children.length : 0;
  const limit = zoneLimits[zoneName] ?? 0;

  const badge = document.querySelector(`.zone-counter[data-zone="${zoneName}"]`);
  if (badge) {
    badge.textContent = `${count}/${limit}`;
  }
}




Object.keys(zoneLimits).forEach(updateZoneCounter);










function canEnter(role, zone) {
  
  role = role.trim().toLowerCase();
  zone = zone.trim().toLowerCase();

  if (zone === "reception") return role === "réception";
  if (zone === "serveurs") return role === "techniciens it";
  if (zone === "security") return role === "agents de sécurité";

  if (role === "manager") return true;

  if (role === "nettoyage") return zone !== "archives";

  if (["reception", "serveurs", "security"].includes(zone)) return false;


  return true;
}










function openSimpleModal(list, callback) {
  const modal = document.getElementById("chooseWorkerModal");
  const container = document.getElementById("simpleWorkerList");

  container.innerHTML = "";

  list.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "simple-list-item";
    div.textContent = item.worker.name + " (" + item.worker.role + ")";
    div.onclick = () => {
      callback(i);
      closeSimpleModal();
    };
    container.appendChild(div);
  });

  modal.style.display = "flex";
}

function closeSimpleModal() {
  document.getElementById("chooseWorkerModal").style.display = "none";
}










zoneButtons.forEach((btn) => {
  btn.addEventListener("click", function () {
    const zoneElement = btn.closest(".zone");
    const zoneName = zoneElement.dataset.zone; 

   
    const available = [];
    workers.forEach((w, i) => {
      if (w.location === "unassigned" && canEnter(w.role, zoneName)) {
        available.push({ worker: w, index: i });
      }
    });

    if (available.length === 0) {
      alert("Aucun employé autorisé pour cette zone.");
      return;
    }





    openSimpleModal(available, function(chosenIndex) {
  const selected = available[chosenIndex];
  const card = unassignedList.querySelector('[data-index="' + selected.index + '"]');

  if (!card) {
    alert("Carte introuvable.");
    return;
  }

  const zoneStaff = zoneElement.querySelector(".zone-staff");
  const currentCount = zoneStaff.children.length;
  const limit = zoneLimits[zoneName] ?? Infinity;

  if (currentCount >= limit) {
    alert("Cette zone est pleine. Limite: " + limit);
    return;
  }

  unassignedList.removeChild(card);
  zoneStaff.appendChild(card);
  workers[selected.index].location = zoneName;


  
  updateZoneCounter(zoneName);
});


  });

});







