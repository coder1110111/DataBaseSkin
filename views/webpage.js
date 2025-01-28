const sideMenu = document.getElementById("side-menu");
const mainContent = document.getElementById("main-content");
const popupForm = document.getElementById("popup-form");

async function fetchTables() {
    const response = await fetch("http://localhost:3800/tables");
    const { tables } = await response.json();
    sideMenu.innerHTML = "";
    tables.forEach((table) => {
        const tableItem = document.createElement("div");
        tableItem.textContent = table;
        tableItem.addEventListener("click", () => fetchTableData(table));
        sideMenu.appendChild(tableItem);
    });
}

async function fetchTableData(tableName) {
    const response = await fetch(`http://localhost:3800/table/${tableName}`);
    const { data } = await response.json();

    const tableDisplay = document.getElementById("table-display");
    tableDisplay.innerHTML = `<h3>${tableName}</h3><table border="1"><thead></thead><tbody></tbody></table>`;
      
    const table = tableDisplay.querySelector("table");
    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");

    if (data.length > 0) {
        const headers = Object.keys(data[0]);
        const headerRow = document.createElement("tr");
        headers.forEach((header) => {
            const th = document.createElement("th");
            th.textContent = header;
            headerRow.appendChild(th);
        });
        headerRow.innerHTML += `<th>Actions</th>`; // For delete button
        thead.appendChild(headerRow);
    }

      // Render rows
    data.forEach((row) => {
        const tr = document.createElement("tr");
        Object.values(row).forEach((value) => {
            const td = document.createElement("td");
            td.textContent = value;
            tr.appendChild(td);
        });

        // Add delete button
        const deleteTd = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", async () => {
            await fetch(`/table/${tableName}/${row.id}`, { method: "DELETE" });
            fetchTableData(tableName); // Refresh table
        });
        deleteTd.appendChild(deleteButton);
        tr.appendChild(deleteTd);

        tbody.appendChild(tr);
    });

      // Add row button
    const addRowButton = document.createElement("button");
    addRowButton.textContent = "Add Row";
    addRowButton.addEventListener("click", () => showAddRowForm(tableName));
    tableDisplay.appendChild(addRowButton);
}

function showAddRowForm(tableName) {
    popupForm.innerHTML = `
    <form id="row-form">
        <!-- Dynamically generate fields -->
        <button type="submit">Add Row</button>
    </form>`;
    popupForm.style.display = "block";

    const rowForm = document.getElementById("row-form");
    rowForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(rowForm);
        const row = Object.fromEntries(formData.entries());
        await fetch(`/table/${tableName}/add-row`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ row }),
        });
        popupForm.style.display = "none";
        fetchTableData(tableName);
    });
}

const createTableBtn = document.getElementById("create-table-btn");
const popupForm2 = document.getElementById("popup-form2");
const addColumnBtn = document.getElementById("add-column-btn");
const tableForm2 = document.getElementById("table-form2");
const columnsContainer = document.getElementById("columns");

createTableBtn.addEventListener("click", () => {    // Show form to create table
    popupForm2.style.display='block';
});

addColumnBtn.addEventListener("click", () => {
    const columnDiv = document.createElement("div");
    columnDiv.classList.add("column");
    columnDiv.innerHTML = `
    <input type="text" placeholder="Column Name" class="column-name" required />
    <select class="column-type" required >
        <option value="STRING">STRING</option>
        <option value="INTEGER">INTEGER</option>
        <option value="FLOAT">FLOAT</option>
        <option value="BOOLEAN">BOOLEAN</option>
        <option value="DATE">DATE</option>
    </select>
    `;
    columnsContainer.appendChild(columnDiv);
});

tableForm2.addEventListener("submit", async(e) => {
    e.preventDefault();
    const tableName = document.getElementById("table-name").value;
    const columns = Array.from(document.querySelectorAll(".column")).map((col) => ({
        name: col.querySelector(".column-name").value,
        type: col.querySelector(".column-type").value,
    }));

    try {
        const response = await fetch("http://localhost:3800/create-table", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify( { tableName, columns })
        });

        const result = await response.json();
        alert(result.message);
        if(response.ok) popupForm2.style.display="none";
    } catch(err) {
        alert("Error in crating table");
    }
});

    // Initial load
fetchTables();