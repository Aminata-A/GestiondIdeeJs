document.addEventListener("DOMContentLoaded", () => {
    const formulaire = document.querySelector("#idea-form");
    const listeIdees = document.querySelector("#idea-list");
    const ideeModal = new bootstrap.Modal(document.querySelector("#ideaModal"));
    let idees = JSON.parse(localStorage.getItem("idees")) || [];

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

    // Fonction pour enregistrer les idées dans le local storage
    function enregistrerIdees() {
        localStorage.setItem("idees", JSON.stringify(idees));
    }

    // Fonction pour afficher les idées
    function afficherIdees() {
        listeIdees.innerHTML = "";
        idees.forEach((idee, index) => {
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
                        ${idee.status === "En attente" ? `<button class="btn btn-success btn-sm approuver" data-index="${index}">Approuver</button>` : ""}
                        ${idee.status === "En attente" ? `<button class="btn btn-danger btn-sm refuser" data-index="${index}">Refuser</button>` : ""}
                        <button class="btn btn-light btn-sm voir" data-index="${index}"><i class="bi bi-eye"></i></button>
                        <button class="btn btn-light btn-sm supprimer" data-index="${index}"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
            `;
            listeIdees.appendChild(carte);
        });
    }

    // Ajouter une idée
    formulaire.addEventListener("submit", (e) => {
        e.preventDefault();

        const label = document.querySelector("#label").value;
        const category = document.querySelector("#category").value;
        const description = document.querySelector("#description").value;

        if (label === "" || category === "" || description === "") {
            afficherAlerte("Veuillez remplir tous les champs", "danger");
        } else {
            idees.unshift({ label, category, description, status: "En attente" });
            afficherAlerte("Idée ajoutée", "success");
            effacerChamps();
            enregistrerIdees();
            afficherIdees();
        }
    });

    // Gérer les actions sur les idées
    listeIdees.addEventListener("click", (e) => {
        const index = e.target.closest("button").dataset.index;
        const idee = idees[index];

        if (e.target.classList.contains("approuver")) {
            idee.status = "Approuvée";
            afficherAlerte(`Idée "${idee.label}" approuvée`, "success");
            enregistrerIdees();
            afficherIdees();
        } else if (e.target.classList.contains("refuser")) {
            idee.status = "Refusée";
            afficherAlerte(`Idée "${idee.label}" refusée`, "warning");
            enregistrerIdees();
            afficherIdees();
        } else if (e.target.classList.contains("supprimer")) {
            idees.splice(index, 1);
            afficherAlerte("Idée supprimée", "danger");
            enregistrerIdees();
            afficherIdees();
        } else if (e.target.classList.contains("voir")) {
            document.querySelector(".modal-title").textContent = idee.label;
            document.querySelector(".modal-body").innerHTML = `
                <strong>Catégorie:</strong> ${idee.category}<br>
                <strong>Description:</strong><br>${idee.description}
            `;
            ideeModal.show();
        }
    });

    // Rendu initial
    afficherIdees();
});
