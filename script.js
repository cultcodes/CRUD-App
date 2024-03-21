let selectedRow = null;

// Function to display alert messages
function showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;

    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const main = document.querySelector(".main");
    container.insertBefore(div, main);

    setTimeout(() => document.querySelector(".alert").remove(), 3000);
}

// Function to clear form fields
function clearFields() {
    document.querySelector("#firstName").value = "";
    document.querySelector("#lastName").value = "";
    document.querySelector("#rollNo").value = "";
}

// Function to load data from local storage and populate the table
function loadDataFromStorage() {
    const storedData = JSON.parse(localStorage.getItem('studentData')) || [];
    const list = document.querySelector("#student-list");

    list.innerHTML = ''; // Clear existing table rows

    storedData.forEach((student) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.firstName}</td>
            <td>${student.lastName}</td>
            <td>${student.rollNo}</td>
            <td>
                <button type="button" class="btn btn-warning btn-sm edit">Edit</button>
                <button type="button" class="btn btn-danger btn-sm delete">Delete</button>
                <button type="button" class="btn btn-info btn-sm view">View</button>
            </td>
        `;
        list.appendChild(row);
    });
}

// Load data from local storage on page load
window.addEventListener('load', () => {
    loadDataFromStorage();
});

// Edit data
document.querySelector("#student-list").addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("edit")) {
        selectedRow = target.closest("tr");
        document.querySelector("#firstName").value = selectedRow.children[0].textContent;
        document.querySelector("#lastName").value = selectedRow.children[1].textContent;
        document.querySelector("#rollNo").value = selectedRow.children[2].textContent;

        // Change submit button to update button
        document.querySelector(".add-btn").value = "Update";
        document.querySelector("#updateBtnContainer").style.display = "block";
        document.querySelector(".add-btn").style.display = "none";
    }
});

// Update data
document.querySelector("#updateBtn").addEventListener("click", () => {
    const updatedFirstName = document.querySelector("#firstName").value;
    const updatedLastName = document.querySelector("#lastName").value;
    const updatedRollNo = document.querySelector("#rollNo").value;

    if (updatedFirstName === "" || updatedLastName === "" || updatedRollNo === "") {
        showAlert("Please fill all the fields", "danger");
    } else {
        selectedRow.children[0].textContent = updatedFirstName;
        selectedRow.children[1].textContent = updatedLastName;
        selectedRow.children[2].textContent = updatedRollNo;

        // Change update button back to submit button
        document.querySelector(".add-btn").value = "Submit";
        document.querySelector("#updateBtnContainer").style.display = "none";
        document.querySelector(".add-btn").style.display = "block";

        showAlert("Student Updated", "success");
        clearFields();
    }
});

// Add or Edit data
document.querySelector("#student-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const firstName = document.querySelector("#firstName").value;
    const lastName = document.querySelector("#lastName").value;
    const rollNo = document.querySelector("#rollNo").value;

    if (firstName === "" || lastName === "" || rollNo === "") {
        showAlert("Please fill all the fields", "danger");
    } else {
        if (document.querySelector(".add-btn").value === "Submit") {
            // Add new data
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${firstName}</td>
                <td>${lastName}</td>
                <td>${rollNo}</td>
                <td>
                    <button type="button" class="btn btn-warning btn-sm edit">Edit</button>
                    <button type="button" class="btn btn-danger btn-sm delete">Delete</button>
                    <button type="button" class="btn btn-info btn-sm view">View</button>
                </td>
            `;
            document.querySelector("#student-list").appendChild(row);

            showAlert("Student Added", "success");
            clearFields();
        }
    }
});

// Delete data
document.querySelector("#student-list").addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("delete")) {
        const rollNoToDelete = target.closest("tr").querySelector("td:nth-child(3)").textContent;

        let storedData = JSON.parse(localStorage.getItem('studentData')) || [];
        storedData = storedData.filter(student => student.rollNo !== rollNoToDelete);
        localStorage.setItem('studentData', JSON.stringify(storedData));

        loadDataFromStorage(); // Refresh table with updated data
        showAlert("Student Data Deleted", "danger");
    }
});

// View data
document.querySelector("#student-list").addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("view")) {
        const selectedStudent = target.closest("tr").querySelectorAll("td");
        const studentData = {
            firstName: selectedStudent[0].textContent,
            lastName: selectedStudent[1].textContent,
            rollNo: selectedStudent[2].textContent
        };
        localStorage.setItem("selectedStudent", JSON.stringify(studentData));
        window.location.href = "view.html"; // Redirect to view.html
    }
});
