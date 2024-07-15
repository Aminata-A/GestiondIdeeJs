document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#idea-form");
    const ideaList = document.querySelector("#idea-list");
    const ideaModal = new bootstrap.Modal(document.querySelector("#ideaModal"));
    let ideas = [];

    // Fonction pour afficher les alertes
    function showAlert(message, className) {
        const div = document.createElement("div");
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector(".container");
        const formContainer = document.querySelector(".form-container");
        container.insertBefore(div, formContainer);
        setTimeout(() => document.querySelector(".alert").remove(), 2000);
    }

    // Fonction pour effacer les champs du formulaire
    function clearFields() {
        document.querySelector("#label").value = "";
        document.querySelector("#category").value = "";
        document.querySelector("#description").value = "";
    }

    // Fonction pour afficher les idées
    function renderIdeas() {
        ideaList.innerHTML = "";
        ideas.forEach((idea, index) => {
            const card = document.createElement("div");
            card.className = "card idea-card";
            card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${idea.label}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${idea.category}</h6>
                    <p class="card-text">${idea.description}</p>
                </div>
                <div class="card-footer">
                    <span class="status">${idea.status}</span>
                    <div class="actions">
                        ${idea.status === "En attente" ? `<button class="btn btn-success btn-sm approve" data-index="${index}">Approuver</button>` : ""}
                        ${idea.status === "En attente" ? `<button class="btn btn-danger btn-sm disapprove" data-index="${index}">Refuser</button>` : ""}
                        <button class="btn btn-light btn-sm view" data-index="${index}"><i class="bi bi-eye"></i></button>
                        <button class="btn btn-light btn-sm delete" data-index="${index}"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
            `;
            ideaList.appendChild(card);
        });
    }

    // Ajouter une idée
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const label = document.querySelector("#label").value;
        const category = document.querySelector("#category").value;
        const description = document.querySelector("#description").value;

        if (label === "" || category === "" || description === "") {
            showAlert("Veuillez remplir tous les champs", "danger");
        } else {
            ideas.unshift({ label, category, description, status: "En attente" });
            showAlert("Idée ajoutée", "success");
            clearFields();
            renderIdeas();
        }
    });

    // Gérer les actions sur les idées
    ideaList.addEventListener("click", (e) => {
        const index = e.target.closest("button").dataset.index;
        const idea = ideas[index];

        if (e.target.classList.contains("approve")) {
            idea.status = "Approuvée";
            showAlert(`Idée "${idea.label}" approuvée`, "success");
            renderIdeas();
        } else if (e.target.classList.contains("disapprove")) {
            idea.status = "Refusée";
            showAlert(`Idée "${idea.label}" refusée`, "warning");
            renderIdeas();
        } else if (e.target.classList.contains("delete")) {
            ideas.splice(index, 1);
            showAlert("Idée supprimée", "danger");
            renderIdeas();
        } else if (e.target.classList.contains("view")) {
            document.querySelector(".modal-title").textContent = idea.label;
            document.querySelector(".modal-body").innerHTML = `
                <strong>Catégorie:</strong> ${idea.category}<br>
                <strong>Description:</strong><br>${idea.description}
            `;
            ideaModal.show();
        }
    });

    // Initialisation du rendu des idées
    renderIdeas();
});
