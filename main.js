const apiUrl = "https://students-management-mu.vercel.app/students";

async function getStudents() {
    try {
        const response = await fetch(apiUrl);
        const students = await response.json();
        
        const list = document.getElementById('studentsList');
        list.innerHTML = ""; 

        if (students.length === 0) {
            list.innerHTML = `<li style="color: #94a3b8; text-align:center;">No student records found.</li>`;
            return;
        }

        students.forEach(student => {
            list.innerHTML += `
                <li class="student-item">
                    <div class="student-info">
                        <span class="student-id">#${student.id}</span>
                        <strong>${student.name}</strong>
                        <span class="student-badge">Grade: ${student.grade}</span>
                    </div>
                    <div class="action-buttons">
                        <button class="btn-action btn-edit" onclick="prepareUpdate(${student.id}, '${student.name}', ${student.grade})">✏️ Edit</button>
                        <button class="btn-action btn-delete" onclick="deleteStudent(${student.id})">🗑️ Delete</button>
                    </div>
                </li>
            `;
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to connect to the server.");
    }
}

async function createStudent(e) {
    e.preventDefault(); 

    const studentData = {
        id: parseInt(document.getElementById('studentId').value),
        name: document.getElementById('studentName').value,
        grade: parseInt(document.getElementById('studentGrade').value)
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });

        if (response.ok) {
            alert("Student added successfully!");
            document.getElementById('studentForm').reset();
            getStudents(); 
        } else {
            alert("Something went wrong. Please check your data.");
        }
    } catch (error) {
        console.error("Error sending data:", error);
    }
}

async function deleteStudent(studentId) {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
        const response = await fetch(`https://students-management-mu.vercel.app/student/${studentId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message); 
            getStudents(); 
        } else {
            alert(result.error || "Failed to delete student");
        }
    } catch (error) {
        console.error("Error deleting data:", error);
    }
}

function prepareUpdate(id, name, grade) {
    document.getElementById('studentId').value = id;
    document.getElementById('studentName').value = name;
    document.getElementById('studentGrade').value = grade;
    
    document.getElementById('studentId').disabled = true; 

    const submitBtn = document.querySelector('#studentForm button[type="submit"]');
    submitBtn.innerText = "🔄 Update Student Data";
    submitBtn.className = "btn btn-update"; 
}

async function updateStudent() {
    const studentId = parseInt(document.getElementById('studentId').value);
    
    const updatedData = {
        id: studentId,
        name: document.getElementById('studentName').value,
        grade: parseInt(document.getElementById('studentGrade').value)
    };

    try {
        const response = await fetch(`${apiUrl}/${studentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            alert("Student updated successfully!");
            
            document.getElementById('studentForm').reset();
            document.getElementById('studentId').disabled = false;
            
            const submitBtn = document.querySelector('#studentForm button[type="submit"]');
            submitBtn.innerText = "Add Student";
            submitBtn.className = "btn btn-success";

            getStudents(); 
        } else {
            alert("Failed to update student.");
        }
    } catch (error) {
        console.error("Error updating data:", error);
    }
}

document.getElementById('studentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = document.querySelector('#studentForm button[type="submit"]');
    if (submitBtn.classList.contains('btn-update')) {
        updateStudent();
    } else {
        createStudent(e);
    }
});

document.getElementById('refreshBtn').addEventListener('click', getStudents);

getStudents();