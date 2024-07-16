const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvbmFxenRjYnJwcHRkZGt0bHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEwNjQ0NTgsImV4cCI6MjAzNjY0MDQ1OH0.LoS70UL-Gm-TXJwOJHYKIpIHx7YlKMnU7uVJmhy5jjg";
const url = "https://conaqztcbrpptddktlsh.supabase.co";
const database = supabase.createClient(url, key);

let save = document.querySelector("#save");
save.addEventListener("click", async (e) => {
  e.preventDefault();
  let label = document.querySelector("#label").value;
  let category = document.querySelector("#category").value;
  let description = document.querySelector("#description").value;
  save.innerText = "Enregistrement....";
  save.setAttribute("disabled", true);
  let res = await database.from("ideas").insert({
    label: label,
    category: category,
    description: description,
  }); 
  if (res.error == null) {
    alert("Idée ajoutée avec succès");
    save.innerText = "Enregistrer";
    save.removeAttribute("disabled");
    document.querySelector("#label").value = "";
    document.querySelector("#category").value = "";
    document.querySelector("#description").value = "";
    getIdeas();
    getTotalCount();
  } else {
    alert("L'idée n'a pas été ajoutée");
    save.innerText = "Enregistrer";
    save.removeAttribute("disabled");
  }
});

const getIdeas = async () => {
  let tbody = document.getElementById("tbody");
  let loading = document.getElementById("loading");
  let tr = "";
  loading.innerText = "Chargement....";
  const res = await database.from("ideas").select("*");
  if (res.error == null) {
    for (var i in res.data) {
      tr += `<tr>
         <td>${parseInt(i) + 1}</td>
         <td>${res.data[i].label}</td>
         <td>${res.data[i].category}</td>
         <td>${res.data[i].description}</td>
         <td><button class="btn btn-primary" data-bs-toggle="modal" onclick='editIdea(${res.data[i].id})' data-bs-target="#editModal">Modifier</button></td>
         <td><button onclick='deleteIdea(${res.data[i].id})' class="btn btn-danger">Supprimer</button></td>
         </tr>`;
    }
    tbody.innerHTML = tr;
    loading.innerText = "";
  }
};

getIdeas();

const getTotalCount = async () => {
  let total = document.querySelector("#total");
  const res = await database.from("ideas").select("*", { count: "exact" });
  total.innerText = res.data.length;
};

getTotalCount();

const editIdea = async (id) => {
    const { data, error } = await database.from("ideas").select("*").eq("id", id);
    if (error) {
        console.error('Erreur lors de la récupération de l\'idée:', error.message);
        return;
    }
    // Remplir les champs du formulaire de modification avec les données récupérées
    document.getElementById("edit-id").value = id;
    document.getElementById("edit-label").value = data[0].label;
    document.getElementById("edit-category").value = data[0].category;
    document.getElementById("edit-description").value = data[0].description;
};


const update = document.getElementById("update");
update.addEventListener("click", async () => {
  let id = document.getElementById("edit-id").value;
  let label = document.getElementById("edit-label").value;
  let category = document.getElementById("edit-category").value;
  let description = document.getElementById("edit-description").value;
  
  update.innerText = "Mise à jour....";
  update.setAttribute("disabled", true);

  const { data, error } = await database.from("ideas").update({
    label,
    category,
    description,
  }).eq("id", id);

  if (error) {
    console.error('Erreur lors de la mise à jour de l\'idée:', error.message);
    alert("L'idée n'a pas été mise à jour");
  } else {
    console.log('Idée mise à jour avec succès:', data);
    alert("Idée mise à jour avec succès");
    update.innerText = "Mettre à jour";
    update.removeAttribute("disabled");
    getIdeas();
    getTotalCount();
  }
});


const deleteIdea = async (id) => {
  const res = await database.from("ideas").delete().eq("id", id);
  if (res.error == null) {
    alert("Supprimé avec succès");
    getIdeas();
    getTotalCount();
  } else {
    alert("Non supprimé");
  }
};
