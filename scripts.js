"use strict";

// These sample records are kept in a JavaScript array, not a database.
let students = [
  {id: 1, name: "Priya Kumar", roll: "IT001", course: "B.Tech IT", mark: 92},
  {id: 2, name: "Arun Raj", roll: "IT002", course: "B.Tech CSE", mark: 78},
  {id: 3, name: "Meena Devi", roll: "IT003", course: "BCA", mark: 77}
];
let nextId = 4;
const form = document.getElementById("studentForm");
const nameInput = document.getElementById("name");
const rollInput = document.getElementById("roll");
const courseInput = document.getElementById("course");
const markInput = document.getElementById("mark");
const editingId = document.getElementById("editingId");
const message = document.getElementById("message");

function showMessage(text, type) {
  message.textContent = text;
  message.className = "message show " + type;
}
function clearMessage() {
  message.textContent = "";
  message.className = "message";
}
function render() {
  const query = document.getElementById("search").value.trim().toLowerCase();
  const filtered = students.filter(s =>
    [s.name, s.roll, s.course].some(value => value.toLowerCase().includes(query))
  );
  document.getElementById("totalCount").textContent = students.length;
  const average = students.length ? students.reduce((sum, s) => sum + s.mark, 0) / students.length : 0;
  document.getElementById("averageMark").textContent = average.toFixed(1) + "%";
  const top = students.reduce((best, s) => !best || s.mark > best.mark ? s : best, null);
  document.getElementById("topStudent").textContent = top ? top.name.split(" ")[0] : "—";
  document.getElementById("topMark").textContent = top ? top.mark + " marks" : "No records";
  const rows = document.getElementById("studentRows");
  rows.replaceChildren();
  document.getElementById("emptyState").hidden = filtered.length !== 0;
  for (const student of filtered) {
    const tr = document.createElement("tr");
    const studentCell = document.createElement("td");
    const studentName = document.createElement("div");
    studentName.className = "student-name";
    studentName.textContent = student.name;
    const studentId = document.createElement("div");
    studentId.className = "student-id";
    studentId.textContent = "Roll: " + student.roll;
    studentCell.append(studentName, studentId);
    const courseCell = document.createElement("td");
    courseCell.textContent = student.course;
    const markCell = document.createElement("td");
    const grade = document.createElement("span");
    grade.className = "grade";
    grade.textContent = student.mark + "/100";
    markCell.append(grade);
    const actionsCell = document.createElement("td");
    const actions = document.createElement("div");
    actions.className = "row-actions";
    const edit = document.createElement("button");
    edit.type = "button"; edit.className = "btn secondary small"; edit.textContent = "Edit";
    edit.addEventListener("click", () => startEdit(student.id));
    const remove = document.createElement("button");
    remove.type = "button"; remove.className = "btn danger small"; remove.textContent = "Delete";
    remove.addEventListener("click", () => deleteStudent(student.id));
    actions.append(edit, remove); actionsCell.append(actions);
    tr.append(studentCell, courseCell, markCell, actionsCell);
    rows.append(tr);
  }
}
function resetForm() {
  form.reset();
  editingId.value = "";
  document.getElementById("formTitle").textContent = "Add a student";
  document.getElementById("submitBtn").textContent = "Add student";
  document.getElementById("cancelBtn").hidden = true;
}
function startEdit(id) {
  const student = students.find(s => s.id === id);
  if (!student) return;
  editingId.value = String(id);
  nameInput.value = student.name;
  rollInput.value = student.roll;
  courseInput.value = student.course;
  markInput.value = String(student.mark);
  document.getElementById("formTitle").textContent = "Edit student";
  document.getElementById("submitBtn").textContent = "Save changes";
  document.getElementById("cancelBtn").hidden = false;
  clearMessage();
  nameInput.focus();
}
function deleteStudent(id) {
  const student = students.find(s => s.id === id);
  if (!student) return;
  if (!window.confirm("Delete " + student.name + "?")) return;
  students = students.filter(s => s.id !== id);
  if (Number(editingId.value) === id) resetForm();
  showMessage("Student deleted.", "success");
  render();
}
form.addEventListener("submit", event => {
  event.preventDefault();
  const name = nameInput.value.trim();
  const roll = rollInput.value.trim();
  const course = courseInput.value;
  const mark = Number(markInput.value);
  if (!name || !roll || !course || markInput.value === "" || !Number.isInteger(mark) || mark < 0 || mark > 100) {
    showMessage("Enter a name, roll number, course, and whole-number mark from 0 to 100.", "error");
    return;
  }
  const id = editingId.value ? Number(editingId.value) : null;
  if (students.some(s => s.roll.toLowerCase() === roll.toLowerCase() && s.id !== id)) {
    showMessage("That roll number already exists. Use a unique roll number.", "error");
    return;
  }
  if (id !== null) {
    const index = students.findIndex(s => s.id === id);
    if (index < 0) { showMessage("Student not found. Refresh and try again.", "error"); return; }
    students[index] = {...students[index], name, roll, course, mark};
    resetForm();
    showMessage("Student updated successfully.", "success");
  } else {
    students.push({id: nextId++, name, roll, course, mark});
    resetForm();
    showMessage("Student added successfully.", "success");
  }
  render();
});
document.getElementById("cancelBtn").addEventListener("click", () => { resetForm(); clearMessage(); });
document.getElementById("search").addEventListener("input", render);
render();
