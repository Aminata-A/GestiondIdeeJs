document.addEventListener("DOMContentLoaded", () => {
  
  const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvbmFxenRjYnJwcHRkZGt0bHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEwNjQ0NTgsImV4cCI6MjAzNjY0MDQ1OH0.LoS70UL-Gm-TXJwOJHYKIpIHx7YlKMnU7uVJmhy5jjg";
  
  const SUPABASE_URL = "https://conaqztcbrpptddktlsh.supabase.co";
  
  const database = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);  
  
  const formulaire = document.querySelector("#idea-form");
  const listeIdees = document.querySelector("#idea-list");
  const ideeModal = new bootstrap.Modal(document.querySelector("#ideaModal"));
  
  // Fonction pour afficher des alertes
  function afficherAlerte(message, classe) {
    const div = document.createElement("div");
    div.className = `alert alert-${classe}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const formContainer = document.querySelector(".form-container");
    container.insertBefore(div, formContainer);
    setTimeout(() => document.querySelector(".alert").remove(), 2000);
  }
  
  // Fonction pour effacer les champs du formulaire
  function effacerChamps() {
    document.querySelector("#label").value = "";
    document.querySelector("#category").value = "";
    document.querySelector("#description").value = "";
  }
  
  // Fonction pour afficher les idées
  async function afficherIdees() {
    const { data, error } = await database.from("ideas").select("*");
    if (error) {
      console.error("Erreur lors de la récupération des idées:", error.message);
      return;
    }
    listeIdees.innerHTML = "";
    data.forEach((idee, index) => {
      const carte = document.createElement("div");
      carte.className = "card idea-card";
      carte.innerHTML = `
              <div class="card-body">
                  <h5 class="card-title">${idee.label}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">${idee.category}</h6>
                  <p class="card-text">${idee.description}</p>
              </div>
              <div class="card-footer">
                  <span class="status">${idee.status}</span>
                  <div class="actions">
                      ${idee.status === "En attente" ? `<button class="btn btn-success btn-sm approuver" data-id="${idee.id}">Approuver</button>` : ""}
                      ${idee.status === "En attente" ? `<button class="btn btn-danger btn-sm refuser" data-id="${idee.id}">Refuser</button>` : ""}
                      <button class="btn btn-light btn-sm voir" data-id="${idee.id}"><i class="bi bi-eye"></i></button>
                      <button class="btn btn-light btn-sm supprimer" data-id="${idee.id}"><i class="bi bi-trash"></i></button>
                  </div>
              </div>
          `;
      listeIdees.appendChild(carte);
    });
  }
  
  // Ajouter une idée
  formulaire.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const label = document.querySelector("#label").value;
    const category = document.querySelector("#category").value;
    const description = document.querySelector("#description").value;
    
    if (label === "" || category === "" || description === "") {
      afficherAlerte("Veuillez remplir tous les champs", "danger");
    } else {
      const { data, error } = await database.from("ideas").insert([{ label, category, description, status: "En attente" }]);
      if (error) {
        afficherAlerte("Erreur lors de l'ajout de l'idée", "danger");
      } else {
        afficherAlerte("Idée ajoutée", "success");
        effacerChamps();
        afficherIdees();
      }
    }
  });
  
  // Gérer les actions sur les idées
  listeIdees.addEventListener("click", async (e) => {
    const id = e.target.closest("button").dataset.id;
    
    if (e.target.classList.contains("approuver")) {
      const { data, error } = await database.from("ideas").update({ status: "Approuvée" }).eq("id", id);
      if (error) {
        afficherAlerte("Erreur lors de l'approbation de l'idée", "danger");
      } else {
        afficherAlerte(`Idée approuvée`, "success");
        afficherIdees();
      }
    } else if (e.target.classList.contains("refuser")) {
      const { data, error } = await database.from("ideas").update({ status: "Refusée" }).eq("id", id);
      if (error) {
        afficherAlerte("Erreur lors du refus de l'idée", "danger");
      } else {
        afficherAlerte(`Idée refusée`, "warning");
        afficherIdees();
      }
    } else if (e.target.classList.contains("supprimer")) {
      const { data, error } = await database.from("ideas").delete().eq("id", id);
      if (error) {
        afficherAlerte("Erreur lors de la suppression de l'idée", "danger");
      } else {
        afficherAlerte("Idée supprimée", "danger");
        afficherIdees();
      }
    } else if (e.target.classList.contains("voir")) {
      const { data, error } = await database.from("ideas").select("*").eq("id", id).single();
      if (error) {
        afficherAlerte("Erreur lors de l'affichage de l'idée", "danger");
      } else {
        document.querySelector(".modal-title").textContent = data.label;
        document.querySelector(".modal-body").innerHTML = `
                  <strong>Catégorie:</strong> ${data.category}<br>
                  <strong>Description:</strong><br>${data.description}
              `;
        ideeModal.show();
      }
    }
  });
  
  // Rendu initial
  afficherIdees();
});
