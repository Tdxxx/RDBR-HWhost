document.addEventListener("DOMContentLoaded", function () {
    const addEmployeeButton = document.getElementById("btn-add-employee");
    const backdrop = document.getElementById("backdrop");
    const modal = document.getElementById("employee-modal");
    const closeButton = document.getElementById("close-btn");
    const cancelButton = document.getElementById("cancel-button");
    const employeeSelect = document.getElementById("employee-filter");
    const departmentSelect = document.getElementById("department-filter");
    const prioritySelect = document.getElementById("priority-filter");

    // Ensure modal and backdrop are hidden on page load
    if (modal) modal.style.display = "none";
    if (backdrop) backdrop.style.display = "none";

    // Show modal function
    function showModal() {
        modal.style.display = "block";
        backdrop.style.display = "block";
    }

    // Close modal function
    function closeModal() {
        modal.style.display = "none";
        backdrop.style.display = "none";
    }

    // Event listeners for modal open and close
    if (addEmployeeButton) addEmployeeButton.addEventListener("click", showModal);
    if (closeButton) closeButton.addEventListener("click", closeModal);
    if (cancelButton) cancelButton.addEventListener("click", closeModal);
    if (backdrop) backdrop.addEventListener("click", closeModal);

    // Fetch and populate employee select options
    fetch("bknd/employees.json")
        .then(response => response.json())
        .then(employees => {
            console.log("Employees loaded:", employees);
            if (Array.isArray(employees)) {
                employeeSelect.innerHTML = '<option value="">ყველა თანამშრომელი</option>';
                employees.forEach(emp => {
                    let option = document.createElement("option");
                    option.value = emp.id;
                    option.textContent = `${emp.name} ${emp.surname}`;
                    employeeSelect.appendChild(option);
                });
            } else {
                console.error("Unexpected format for employees:", employees);
            }
        })
        .catch(error => console.error("Error loading employees:", error));

    // Fetch and populate department select options
    fetch("bknd/Departments.json")
        .then(response => response.json())
        .then(departments => {
            console.log("Departments loaded:", departments);
            if (Array.isArray(departments)) {
                departmentSelect.innerHTML = '<option value="">დეპარტამენტი</option>';
                departments.forEach(department => {
                    let option = document.createElement("option");
                    option.value = department.id;
                    option.textContent = department.name;
                    departmentSelect.appendChild(option);
                });
            } else {
                console.error("Unexpected format for departments:", departments);
            }
        })
        .catch(error => console.error("Error loading departments:", error));

        function createTaskCard(task) {
            const card = document.createElement("div");
            card.classList.add("card");
        
            // Determine which section the task belongs to
            let sectionClass = "";
            switch (task.status.name) {
                case "დასაწყები": // "Must-start"
                    sectionClass = "section-header1";
                    break;
                case "პროგრესში": // "In Progress"
                    sectionClass = "section-header2";
                    break;
                case "მზად ტესტირებისთვის": // "Ready to Test"
                    sectionClass = "section-header3";
                    break;
                case "დასრულებული": // "Finished"
                    sectionClass = "section-header4";
                    break;
                default:
                    sectionClass = "";
                    break;
            }
        
            // Find the section header element based on the class
            const sectionHeader = document.querySelector(`.${sectionClass}`);
            const sectionHeaderColor = sectionHeader ? window.getComputedStyle(sectionHeader).backgroundColor : "#ccc"; // Default to grey if not found
        
            // Set the card's border color to match the section header's background color
            card.style.border = `2px solid ${sectionHeaderColor}`;
        
            card.innerHTML = `
                <a href="task-detail.html?id=${task.id}" class="card-link">
                   <div class="card-header" style="background-color: transparent;"> <!-- Set background to transparent -->
                <!-- Priority Badge with Border Instead of Background -->
                <div class="difficulty-badge" style="border: 2px solid ${task.priority.icon ? sectionHeaderColor : '#ccc'}; color: ${task.priority.icon ? sectionHeaderColor : '#ccc'};">
                    <img src="${task.priority.icon}" alt="priority icon" class="difficulty-icon">
                    ${task.priority.name}
                </div>
                        <!-- Department Badge -->
                        <div class="category-badge ${task.department.name.toLowerCase().split(" ")[0]}">
                            ${task.department.name.split(" ")[0]} <!-- Shortened department name -->
                        </div>
                    </div>
        
                    <div class="card-content">
                        <h4 class="card-title">${task.name}</h4>
                        <p class="card-description">
                            ${task.description.length > 100 ? task.description.slice(0, 100) + "..." : task.description}
                        </p>
                    </div>
        
                    <!-- Publish Date (Deadline) in Top-Right Corner -->
                    <span class="publish-date">${new Date(task.due_date).toLocaleDateString()}</span>
        
                    <div class="card-footer">
                        <img src="${task.employee.avatar}" alt="employee avatar" class="avatar">
                    </div>
        
                    <!-- Comments Icon (Bottom Right Corner) -->
                    <img src="img/Comments.png" alt="comments icon" class="comment-icon">
                </a>
            `;
        
            return card;
        }

    // Load tasks and display them in respective sections based on status
    function loadTasks() {
        fetch("bknd/tasks.json")
            .then(response => response.json())
            .then(tasks => {
                console.log("Tasks loaded:", tasks);
                if (!Array.isArray(tasks)) {
                    console.error("Unexpected format for tasks:", tasks);
                    return;
                }

                // Clear existing task cards
                document.getElementById("Must-start").innerHTML = "";
                document.getElementById("in-progress").innerHTML = "";
                document.getElementById("ready-to-test").innerHTML = "";
                document.getElementById("finished").innerHTML = "";

                const selectedEmployee = employeeSelect.value;
                const selectedDepartment = departmentSelect.value;
                const selectedPriority = prioritySelect.value;

                // Filter tasks based on selected filters
                const filteredTasks = tasks.filter(task => {
                    let employeeMatch = true;
                    let departmentMatch = true;
                    let priorityMatch = true;

                    if (selectedEmployee) {
                        employeeMatch = task.employee.id == selectedEmployee;
                    }

                    if (selectedDepartment) {
                        departmentMatch = task.department.id == selectedDepartment;
                    }

                    if (selectedPriority) {
                        priorityMatch = task.priority.name === selectedPriority;
                    }

                    return employeeMatch && departmentMatch && priorityMatch;
                });

                // Dynamically create task cards and append to the respective sections
                filteredTasks.forEach(task => {
                    const card = createTaskCard(task);
                    let section;
                    switch (task.status.name) {
                        case "დასაწყები":
                            section = document.getElementById("Must-start");
                            break;
                        case "პროგრესში":
                            section = document.getElementById("in-progress");
                            break;
                        case "მზად ტესტირებისთვის":
                            section = document.getElementById("ready-to-test");
                            break;
                        case "დასრულებული":
                            section = document.getElementById("finished");
                            break;
                    }

                    if (section) {
                        section.appendChild(card);
                    }
                });
            })
            .catch(error => console.error("Error loading tasks:", error));
    }

    // Initial task loading
    loadTasks();

    // Event listeners for filtering tasks
    employeeSelect.addEventListener("change", loadTasks);
    departmentSelect.addEventListener("change", loadTasks);
    prioritySelect.addEventListener("change", loadTasks);
});