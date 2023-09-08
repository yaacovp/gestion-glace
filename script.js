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

// Fonction pour vérifier le stock et afficher une alerte si nécessaire
function checkStockAlert(flavor, size) {
  const key = `${flavor}-${size}`;
  const quantity = parseInt(localStorage.getItem(key)) || 0;

  if (quantity === 2) {
    // Afficher une alerte
    alert(`Attention ! Il ne reste plus que 2 ${flavor} ${size}.`);
  }
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

    if (amount < 0) {
      // Vérifier le stock après avoir retiré une glace
      checkStockAlert(flavor, size);
      
      // Mettre à jour le stock de boîtes en fonction de la taille de la glace
      if (size === "500 ml") {
        const boxKey = "box-500ml";
        const boxQuantity = parseInt(localStorage.getItem(boxKey)) || 0;
        if (boxQuantity > 0) {
          localStorage.setItem(boxKey, boxQuantity - 1);
          updateBoxStockDisplay();
          
          // Vérifier si le stock de boîtes est à 10 et afficher une alerte
          if (boxQuantity === 10) {
            alert("Attention ! Le stock de boîtes de 500 ml est à 10.");
          }
        }
      } else if (size === "1L") {
        const boxKey = "box-1L";
        const boxQuantity = parseInt(localStorage.getItem(boxKey)) || 0;
        if (boxQuantity > 0) {
          localStorage.setItem(boxKey, boxQuantity - 1);
          updateBoxStockDisplay();
          
          // Vérifier si le stock de boîtes est à 10 et afficher une alerte
          if (boxQuantity === 10) {
            alert("Attention ! Le stock de boîtes de 1L est à 10.");
          }
        }
      }
    }
  }
}

// Ajoutez ces gestionnaires d'événements dans votre fichier script.js
// Fonction pour retirer 50 boîtes du stock de boîtes
function removeBoxStock(size, amount) {
  const key = `box-${size}`;
  let quantity = parseInt(localStorage.getItem(key)) || 0;

  // Vérifiez si la quantité est suffisante pour retirer
  if (quantity >= amount) {
    quantity -= amount;
    localStorage.setItem(key, quantity);
    updateBoxStockDisplay();
    const message = `Retiré ${amount} boîtes de ${size} du stock de boîtes.`;
    showMessage(message);
  } else {
    showMessage(`Impossible de retirer ${amount} boîtes de ${size}. Le stock est insuffisant.`);
  }
}

// Gestionnaire d'événement pour retirer 50 boîtes de 500 ml
document.getElementById("removeBoxStock500ml").addEventListener("click", () => {
  removeBoxStock("500ml", 10);
});

// Gestionnaire d'événement pour retirer 50 boîtes de 1L
document.getElementById("removeBoxStock1L").addEventListener("click", () => {
  removeBoxStock("1L", 10);
});


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
      // Si vous voulez exclure "box 1L" de la liste des glaces, ajoutez cette condition :
      if (!(size === "1L" && flavor === "box 1L")) {
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

// Fonction pour mettre à jour l'affichage du stock de boîtes
function updateBoxStockDisplay() {
  const boxStock500ml = document.getElementById("boxStock500ml");
  const boxStock1L = document.getElementById("boxStock1L");

  // Récupérer les quantités de boîtes de 500 ml et de 1L depuis le stock local
  const quantity500ml = parseInt(localStorage.getItem("box-500ml")) || 0;
  const quantity1L = parseInt(localStorage.getItem("box-1L")) || 0;

  // Mettre à jour l'affichage du stock de boîtes
  boxStock500ml.textContent = `Stock de 500 ml : ${quantity500ml} boîtes`;
  boxStock1L.textContent = `Stock de 1L : ${quantity1L} boîtes`;
}

// Fonction pour incrémenter le stock de boîtes
function incrementBoxStock(size, amount) {
  const key = `box-${size}`;
  let quantity = parseInt(localStorage.getItem(key)) || 0;
  quantity += amount;

  if (quantity >= 0) {
    localStorage.setItem(key, quantity);
    updateBoxStockDisplay();
    const message = `${amount > 0 ? "Ajouté" : "Retiré"} ${amount} boîtes de ${size} au stock de boîtes.`;
    showMessage(message);
  }
}

// Fonction pour ajouter 50 boîtes de 500 ml au stock de boîtes
document.getElementById("addStock500ml").addEventListener("click", () => {
  incrementBoxStock("500ml", 50);
});

// Fonction pour ajouter 50 boîtes de 1L au stock de boîtes
document.getElementById("addStock1L").addEventListener("click", () => {
  incrementBoxStock("1L", 50);
});


// Fonction pour mettre à jour l'affichage du stock
function updateStockDisplay() {
  const stock = document.getElementById("stock");
  stock.innerHTML = "<h2>Votre stock de Glaces</h2>";

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
        sortedFlavors500ml.push({ flavor, stockEntry, quantity });
      } else if (size === "1L") {
        sortedFlavors1L.push({ flavor, stockEntry, quantity });
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
    const stockItem = document.createElement("div");
    stockItem.innerHTML = entry.stockEntry;

    // Appliquer la mise en forme orange si la quantité est inférieure à 3
    if (entry.quantity < 3) {
      stockItem.style.color = entry.quantity < 2 ? "red" : "orange";
    }

    stock500mlDiv.appendChild(stockItem);
  }

  // Ajouter les glaces triées dans la div du stock 1L
  for (const entry of sortedFlavors1L) {
    const stockItem = document.createElement("div");
    stockItem.innerHTML = entry.stockEntry;

    // Appliquer la mise en forme orange si la quantité est inférieure à 3
    if (entry.quantity < 3) {
      stockItem.style.color = entry.quantity < 2 ? "red" : "orange";
    }

    stock1LDiv.appendChild(stockItem);
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
  updateBoxStockDisplay();
};


/*voici mon code actuel: index.html: 
voici mon style.css:
et voici mon sript.js: 
je voudrais ajouter des bouton pour ajouter la puree de fruit pour les glaces suivante: Café, Citron, Citron vert, Coco, Fraise, Framboise, Mangue, Passion, Pistache. il faudrais egalement un stock de purée de fruit
*/