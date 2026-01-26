// ✅ Login Function
function login() {
  const username = document.getElementById("username").value;
  const rollno = document.getElementById("rollno").value;

  fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, rollNo: rollno })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Login failed");
      }
      return response.json();
    })
    .then(data => {
      if (data.role === "student") {
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("rollno", rollno);
        window.location.href = "student.html";
      } else if (data.role === "teacher") {
        window.location.href = "teacher.html";
      } else {
        alert("Invalid role");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Something went wrong. Check credentials.");
    });
}

// ✅ Student Page – Display Grades
function loadStudentGrades() {
  const rollno = sessionStorage.getItem("rollno");

  fetch(`http://localhost:8080/api/student/grades/${rollno}`)
    .then(response => response.json())
    .then(data => {
      const tableBody = document.getElementById("gradeTableBody");
      tableBody.innerHTML = "";
      data.forEach(item => {
        const row = `<tr><td>${item.subject}</td><td>${item.grade}</td></tr>`;
        tableBody.innerHTML += row;
      });
    })
    .catch(error => {
      console.error("Error fetching grades:", error);
    });
}

// ✅ Teacher Page – Load Students Dropdown
function loadStudentList() {
  fetch("http://localhost:8080/api/teacher/students")
    .then(response => response.json())
    .then(data => {
      const select = document.getElementById("studentSelect");
      data.forEach(student => {
        const option = document.createElement("option");
        option.value = student.rollNo;
        option.textContent = student.name + " (" + student.rollNo + ")";
        select.appendChild(option);
      });
    })
    .catch(error => {
      console.error("Error loading students:", error);
    });
}

// ✅ Teacher Page – Add/Update Grade
function updateGrade() {
  const rollno = document.getElementById("studentSelect").value;
  const subject = document.getElementById("subject").value;
  const grade = document.getElementById("grade").value;

  fetch("http://localhost:8080/api/teacher/update-grade", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ rollNo: rollno, subject: subject, grade: grade })
  })
    .then(response => {
      if (response.ok) {
        alert("Grade updated successfully!");
      } else {
        alert("Error updating grade");
      }
    })
    .catch(error => {
      console.error("Update error:", error);
    });
}
