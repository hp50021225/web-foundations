# School Database Design

## Table Descriptions
- **`students`**: Stores individual student profile details including a unique primary key ID, mandatory name, and a unique email address to prevent duplicate registrations.
- **`courses`**: Stores available school subjects and class details, featuring a unique primary key ID and a unique course code.
- **`enrolments`**: A junction (join) table connecting students to courses. It features a composite primary key made of `(student_id, course_id)` to prevent duplicate sign-ups and holds the student's `grade`.

## Relationships
- **Many-to-Many Relationship**: Students and courses share a many-to-many relationship (one student takes many courses, one course has many students). 
- **Why a Join Table is Needed**: Relational databases cannot store lists inside a single column efficiently. The `enrolments` join table bridges this gap by mapping individual IDs together while storing relation-specific attributes like grades.

## Indexing
- **Index**: `CREATE INDEX idx_enrolments_course ON enrolments(course_id);`
- **Reason**: When running queries to fetch all students enrolled in a specific course or calculating counts per course, the database frequently queries this relationship. Adding an index on `course_id` speeds up lookups.

## SQL vs. NoSQL Selection
For a school system handling students, courses, enrolments, and grades, a **Relational SQL database** is the ideal choice. Academic data is strictly structured, heavily interconnected, and relies on strict referential integrity, foreign key constraints, and ACID transactions.