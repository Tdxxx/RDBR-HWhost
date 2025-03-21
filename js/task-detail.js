document.addEventListener("DOMContentLoaded", function () {
    // Get the task ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('id'); // Get the ID from the URL (e.g., task-detail.html?id=894)

    console.log("Task ID from URL:", taskId); // Debugging log to check if the task ID is correct

    if (taskId) {
        // Fetch tasks data from tasks.json
        fetch('./tasks.json')
            .then(response => response.json())
            .then(tasks => {
                console.log("Fetched tasks:", tasks); // Debugging log to check if tasks are fetched correctly

                // Find the task based on the ID
                const task = tasks.find(task => task.id == taskId);
                console.log("Found task:", task); // Debugging log to check if task is found

                if (task) {
                    // Populate task details on the page
                    document.getElementById("task-name").textContent = task.name;
                    document.getElementById("task-description").textContent = task.description;
                    document.getElementById("task-department").textContent = task.department.name;
                    document.getElementById("priority-name").textContent = task.priority.name;
                    document.getElementById("task-status").textContent = task.status.name;
                    document.getElementById("employee-name").textContent = `${task.employee.name} ${task.employee.surname}`;
                    document.getElementById("employee-avatar").src = task.employee.avatar;
                    document.getElementById("employee-department").textContent = task.employee.department.name;
                    document.getElementById("task-due-date").textContent = new Date(task.due_date).toLocaleDateString();
                } else {
                    console.error('Task not found');
                }
            })
            .catch(error => console.error('Error fetching task details:', error));
    } else {
        console.error("Task ID not found in the URL");
    }
});
