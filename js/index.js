const table = document.querySelector(".chemTable table");
const tbody = table.querySelector("tbody");
const thead = table.querySelector("thead");
let selectedRow = -1;
let chemicals = [];
function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}
const addTickListener = (img) => {
  img.addEventListener("click", (event) => {
    const grandParent = img.parentElement.parentElement;
    const id = grandParent.id;
    const row = tbody.rows[id - 1];
    event.stopPropagation();
    selectedRow = -1;
    console.log("event image clicked", id);
    chemicals[id - 1].selected = !chemicals[id - 1].selected;

    if (chemicals[id - 1].selected) {
      img.src = "../assets/icons/tick-mark-blue.png";
      row.classList.add("highlight");
    } else {
      img.src = "../assets/icons/tick-mark-light.png";
      row.classList.remove("highlight");
    }
    for (let i = 0; i < tbody.rows.length; i++) {
      if (i === id - 1) continue;
      if (chemicals[i].selected) continue;
      tbody.rows[i].classList.remove("highlight");
      tbody.rows[i].querySelector("img").src =
        "../assets/icons/tick-mark-light.png";
    }
  });
}
const addRow = (data, tbody) => {
  const row = tbody.insertRow();
  row.id = data.id;
  const cell = row.insertCell();
  const img = document.createElement("img");
  img.src = "../assets/icons/tick-mark-light.png";
  img.style.width = "30px";
  img.style.height = "30px";
  img.alt = "tickmark";
  img.classList.add("tick");

  addTickListener(img);
  cell.appendChild(img);
  Object.entries(data).forEach(([key, value], i) => {
    const cell = row.insertCell();
    if (i === 0) {
      cell.textContent = value;
      return;
    }
    if (key === "selected") return;
    const textarea = document.createElement('textarea');
    textarea.rows = 1;


    cell.appendChild(textarea);
    textarea.innerHTML = value;
    autoResize(textarea);
    textarea.addEventListener('input', () => {
      autoResize(textarea);
    });
  });

  row.addEventListener("click", (event) => {
    event.stopPropagation();



    console.log("event row clicked");
    for (const r of tbody.rows) {
      r.classList.remove("highlight");
    }
    for (const chem of chemicals) {
      chem.selected = false;
      tbody.rows[chem.id - 1].querySelector("img").src =
        "../assets/icons/tick-mark-light.png";
    }

    row.classList.add("highlight");
    selectedRow = row.id;
    console.log(selectedRow);
  });
};
const showSelected = () => {
  const selectedChemicals = chemicals.filter((chem) => chem.selected);
  console.log(selectedChemicals);
};
const loadData = async () => {
  const response = await fetch("../assets/data/data.json");
  const data = await response.json();

  data.forEach((chem) => {
    chemicals.push({ ...chem, selected: false });
    addRow(chem, tbody);
  });
};

document.addEventListener("click", (event) => {
  console.log("event document clicked");
  const rows = tbody.rows;
  for (const row of rows) {
    row.classList.remove("highlight");
  }
  for (const chem of chemicals) {
    chem.selected = false;
    rows[chem.id - 1].querySelector("img").src =
      "../assets/icons/tick-mark-light.png";
  }
  selectedRow = -1;
  showSelected();

});

window.onload = loadData;

const addNewRow = () => {
  const newRow = {
    id: chemicals.length + 1,
    chemical_name: "",
    vendor: "",
    density: "",
    viscosity: "",
    packaging: "",
    pack_size: "",
    unit: "",
    quantity: "",
    selected: false,
  };
  chemicals.push(newRow);
  addRow(newRow, tbody);
};
let isAnimating = false;
const moveRowUp = (event) => {
  event.stopPropagation();
  if (selectedRow <= 1 || isAnimating) {
    console.log("selectedRow", selectedRow);
    return;
  }
  const row = tbody.rows[selectedRow - 1];
  const prevRow = row.previousElementSibling;
  if (!prevRow) return;
  isAnimating = true;
  row.classList.add("moving-row", "row-up", "move-on-top");
  prevRow.classList.add("moving-row", "row-down");
  [chemicals[selectedRow - 1].id, chemicals[selectedRow - 2].id] = [
    chemicals[selectedRow - 2].id,
    chemicals[selectedRow - 1].id,
  ];
  row.id--;
  prevRow.id++;
  row.cells[1].textContent = row.id;
  prevRow.cells[1].textContent = prevRow.id;
  setTimeout(() => {
    tbody.insertBefore(row, prevRow);
    row.classList.remove("moving-row", "row-up", "move-on-top");
    prevRow.classList.remove("moving-row", "row-down");
    selectedRow = selectedRow - 1;
    row.classList.add("highlight");
    isAnimating = false;
    sortWithComp((a, b) => a.id - b.id);
  }, 500);
  console.log(chemicals);
  console.log(selectedRow);
};

const moveRowDown = (event) => {
  event.stopPropagation();
  if (selectedRow >= tbody.rows.length || selectedRow === -1 || isAnimating) {
    console.log("selectedRow", selectedRow);
    return;
  }

  const row = tbody.rows[selectedRow - 1];
  const nextRow = row.nextElementSibling;
  if (!nextRow) return;
  row.classList.add("moving-row", "row-down", "move-on-top");
  nextRow.classList.add("moving-row", "row-up");
  isAnimating = true;
  [chemicals[selectedRow - 1].id, chemicals[selectedRow].id] = [
    chemicals[selectedRow].id,
    chemicals[selectedRow - 1].id,
  ];
  row.id++;
  nextRow.id--;
  row.cells[1].textContent = row.id;
  nextRow.cells[1].textContent = nextRow.id;
  setTimeout(() => {
    tbody.insertBefore(nextRow, row);


    row.classList.remove("moving-row", "row-down", "move-on-top");
    nextRow.classList.remove("moving-row", "row-up");
    row.classList.add("highlight");
    isAnimating = false;
    selectedRow++;
    sortWithComp((a, b) => a.id - b.id);
  }, 500);
  console.log(chemicals);
  console.log(selectedRow);
};

const deleteSelected = (event) => {
  event.stopPropagation();
  const selected = chemicals.filter((chem) => chem.selected);
  if(selected.length === 0){
    if(selectedRow === -1){
      return;
    }
    selected.push(chemicals[selectedRow - 1]);
    chemicals[selectedRow - 1].selected = true;
    selectedRow = -1;
  }

  selected.forEach((chem) => {
    const rowToDelete = tbody.querySelector(`tr[id='${chem.id}']`);
    if (rowToDelete) {
      tbody.removeChild(rowToDelete);
    }
  });


  chemicals = chemicals.filter((chem) => !chem.selected);


  Array.from(tbody.rows).forEach((row, index) => {
    row.id = index + 1;
    row.cells[1].textContent = index + 1;
    chemicals[index].id = index + 1;
  });

  console.log('after del', chemicals);
};

const flagsForSort = {
  chemical_name: 0,
  vendor: 0,
  density: 0,
  viscosity: 0,
  packaging: 0,
  pack_size: 0,
  unit: 0,
  quantity: 0,
};
const sort = (key) => {


  const comparator = (a, b) => {
    const valueA = a[key];
    const valueB = b[key];


    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return valueA - valueB;
    } else {

      return valueA.toString().localeCompare(valueB.toString(), undefined, { sensitivity: 'base' });
    }
  };


  if (flagsForSort[key] === 0) {
    sortWithComp(comparator);
    flagsForSort[key] = 1;
    Object.keys(flagsForSort).forEach((flag) => {
      if (flag !== key) {
        flagsForSort[flag] = 0;
      }
    });
  } else {
    sortWithComp((a, b) => comparator(b, a));
    flagsForSort[key] = 0;
    Object.keys(flagsForSort).forEach((flag) => {
      if (flag !== key) {
        flagsForSort[flag] = 0;
      }
    });
  }

};
const sortWithComp = (comp) => {
  chemicals.sort(comp);
  chemicals.forEach((chem, index) => {
    chem.id = index + 1;
  });
  tbody.innerHTML = "";
  chemicals.forEach((chem) => {
    addRow(chem, tbody);
  });
}

const reloadScreen = () => {
  window.location.reload();
}
