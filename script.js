// Fonction pour afficher un message en haut de la page avec animation
function showMessage(message) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);

  // Ajout de la classe show pour afficher avec l'animation
  messageDiv.classList.add("show");

  // Disparaître après 3 secondes (3000 millisecondes)
  setTimeout(function () {
    // Suppression de la classe show pour masquer avec l'animation
    messageDiv.classList.remove("show");
    // Suppression du message de la page après l'animation de disparition
    setTimeout(function () {
      messageDiv.remove();
    }, 500);
  }, 3000);
}

// Fonction pour incrémenter ou décrémenter la quantité
function changeQuantity(flavor, size, amount) {
  const key = `${flavor}-${size}`;
  let quantity = parseInt(localStorage.getItem(key)) || 0;
  quantity += amount;

  if (quantity >= 0) {
    localStorage.setItem(key, quantity);
    updateStockDisplay();
    const message = `${amount > 0 ? "Ajouté" : "Retiré"} ${flavor} ${size} du stock.`;
    showMessage(message);
  }
}

// Fonction pour générer la liste de glaces
function generateIceCreamList() {
  const iceCreamList = document.getElementById("iceCreamList");

  const flavors = [
    "Crispies", "Café", "Chocolat", "Citron", "Citron vert",
    "Coco", "Fraise", "Framboise", "Mangue", "Menthe chocolat", "Moka",
    "Oréo", "Passion", "Pistache", "Pralin", "Rhum raisin", "Ribat halav",
    "Vanille amande", "Vanille", "Vanille chocolat", "Vanille pécans"
  ];

  const sizes = ["500 ml", "1L"];

  for (const size of sizes) {
    const columnDiv = document.createElement("div");
    columnDiv.classList.add("column");

    const h3 = document.createElement("h3");
    h3.textContent = size;
    columnDiv.appendChild(h3);

    const table = document.createElement("table");

    for (const flavor of flavors) {
      const tr = document.createElement("tr");
      const td1 = document.createElement("td");
      const label = document.createElement("label");
      label.textContent = flavor;
      td1.appendChild(label);
      tr.appendChild(td1);

      const td2 = document.createElement("td");
      const addButton = document.createElement("button");
      addButton.textContent = "+";
      addButton.addEventListener("click", () => changeQuantity(flavor, size, 1));
      td2.appendChild(addButton);

      const minusButton = document.createElement("button");
      minusButton.textContent = "-";
      minusButton.addEventListener("click", () => changeQuantity(flavor, size, -1));
      td2.appendChild(minusButton);

      tr.appendChild(td2);
      table.appendChild(tr);
    }

    columnDiv.appendChild(table);
    iceCreamList.appendChild(columnDiv);
  }
}

// Fonction pour rechercher une glace
function searchIceCream() {
  const searchInput = document.getElementById("search");
  const filter = searchInput.value.toLowerCase();
  const iceCreams = document.getElementsByClassName("column");

  let noMatchFound = true; // Variable pour indiquer si aucun résultat n'a été trouvé

  for (const iceCream of iceCreams) {
    const h3 = iceCream.querySelector("h3");
    const size = h3.textContent;
    const flavorLabels = iceCream.getElementsByTagName("label");

    let flavorMatch = false;
    for (const label of flavorLabels) {
      const flavor = label.textContent.toLowerCase();
      if (filter === "" || flavor.startsWith(filter)) {
        label.parentElement.parentElement.style.display = "block";
        noMatchFound = false; // Il y a un résultat correspondant
        flavorMatch = true;
      } else {
        label.parentElement.parentElement.style.display = "none";
      }
    }

    // Si la recherche correspond à une taille, afficher toute la colonne
    if (filter === size.toLowerCase() && !flavorMatch) {
      iceCream.style.display = "block";
      noMatchFound = false; // Il y a un résultat correspondant
    } else if (!flavorMatch) {
      iceCream.style.display = "none";
    }
  }

  // Afficher le message "Aucun résultat trouvé" si aucun élément ne correspond à la recherche
  const noMatchMessage = document.getElementById("noMatchMessage");
  noMatchMessage.style.display = noMatchFound ? "block" : "none";
}

// Fonction pour mettre à jour l'affichage du stock
function updateStockDisplay() {
  const stock = document.getElementById("stock");
  stock.innerHTML = "<h2>Stock de Glaces</h2>";

  // Créer un tableau pour stocker les clés (noms de glaces) à supprimer
  const keysToRemove = [];

  // Stock séparé pour 500 ml et 1L
  const stock500mlDiv = document.createElement("div");
  const stock1LDiv = document.createElement("div");

  // Tableaux pour stocker les glaces triées
  const sortedFlavors500ml = [];
  const sortedFlavors1L = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const quantity = parseInt(localStorage.getItem(key));

    // Si la quantité est supérieure à 0, ajouter la glace dans le tableau approprié
    if (quantity > 0) {
      const [flavor, size] = key.split("-");
      const stockEntry = `<p><strong>${flavor}</strong> ${size}: <strong>${quantity}</strong></p>`;

      if (size === "500 ml") {
        sortedFlavors500ml.push({ flavor, stockEntry });
      } else if (size === "1L") {
        sortedFlavors1L.push({ flavor, stockEntry });
      }
    } else {
      // Sinon, ajouter la clé (nom de glace) au tableau des clés à supprimer
      keysToRemove.push(key);
    }
  }

  // Trier les glaces par nom avant de les afficher
  sortedFlavors500ml.sort((a, b) => a.flavor.localeCompare(b.flavor));
  sortedFlavors1L.sort((a, b) => a.flavor.localeCompare(b.flavor));

  // Ajouter les glaces triées dans la div du stock 500 ml
  for (const entry of sortedFlavors500ml) {
    stock500mlDiv.innerHTML += entry.stockEntry;
  }

  // Ajouter les glaces triées dans la div du stock 1L
  for (const entry of sortedFlavors1L) {
    stock1LDiv.innerHTML += entry.stockEntry;
  }

  // Supprimer les clés (noms de glaces) avec une quantité nulle du stock
  for (const keyToRemove of keysToRemove) {
    localStorage.removeItem(keyToRemove);
  }

  // Ajouter les sections de stock dans la div principale
  stock.appendChild(stock500mlDiv);
  stock.appendChild(stock1LDiv);
}



// Mise à jour de l'affichage du stock au chargement de la page
window.onload = function () {
  generateIceCreamList();
  updateStockDisplay();
};
