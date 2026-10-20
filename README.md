# Simple Student Manager

A tiny interactive student-record project built with plain HTML, CSS, and JavaScript.

## Run it
1. Extract the ZIP file.
2. Open `index.html` in Chrome, Edge, Firefox, or another browser.
3. Add, search, edit, and delete student records.

No Python, Node.js, SQL, database server, or external package is required.

## Features
- Three sample student records
- Add a student
- Search by name, roll number, or course
- Edit a student
- Delete a student (asks for confirmation)
- Rejects duplicate roll numbers
- Validates marks from 0 to 100
- Dashboard statistics update automatically

## Important limitation
The records live in a JavaScript array in memory. Refreshing or closing the page resets all changes to the three sample records. This is intentional for learning how CRUD operations work without a database. It is not suitable for storing real student records.
