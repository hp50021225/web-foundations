-- Enable foreign key support in SQLite
PRAGMA foreign_keys = ON;

-- ==========================================
-- 1. CREATE TABLES
-- ==========================================

CREATE TABLE students (
  id          INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  created_at  TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
  id          INTEGER PRIMARY KEY,
  title       TEXT NOT NULL,
  code        TEXT NOT NULL UNIQUE
);

CREATE TABLE enrolments (
  student_id  INTEGER NOT NULL,
  course_id   INTEGER NOT NULL,
  grade       TEXT,
  PRIMARY KEY (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id)  REFERENCES courses(id)  ON DELETE CASCADE
);

-- ==========================================
-- 2. INSERT SAMPLE DATA
-- ==========================================

INSERT INTO students (name, email) VALUES ('Amina Otieno', 'amina@example.com');
INSERT INTO students (name, email) VALUES ('Brian Kamau', 'brian@example.com');
INSERT INTO students (name, email) VALUES ('Wanjiru Mwangi', 'wanjiru@example.com');
INSERT INTO students (name, email) VALUES ('Juma Ali', 'juma@example.com');

INSERT INTO courses (title, code) VALUES ('Database Systems', 'CS101');
INSERT INTO courses (title, code) VALUES ('Web Development', 'CS102');
INSERT INTO courses (title, code) VALUES ('Data Structures', 'CS103');

INSERT INTO enrolments (student_id, course_id, grade) VALUES (1, 1, 'A');
INSERT INTO enrolments (student_id, course_id, grade) VALUES (1, 2, 'B');
INSERT INTO enrolments (student_id, course_id, grade) VALUES (2, 1, 'B');
INSERT INTO enrolments (student_id, course_id, grade) VALUES (2, 3, 'A');
INSERT INTO enrolments (student_id, course_id, grade) VALUES (3, 2, 'C');

-- ==========================================
-- 3. REQUIRED QUERIES
-- ==========================================

-- Query 1: All courses for one student (by name)
SELECT courses.title, courses.code, enrolments.grade
FROM courses
JOIN enrolments ON enrolments.course_id = courses.id
JOIN students   ON students.id = enrolments.student_id
WHERE students.name = 'Amina Otieno';

-- Query 2: All students on one course
SELECT students.name, students.email, enrolments.grade
FROM students
JOIN enrolments ON enrolments.student_id = students.id
JOIN courses    ON courses.id = enrolments.course_id
WHERE courses.title = 'Database Systems';

-- Query 3: The number of students per course
SELECT courses.title, COUNT(enrolments.student_id) AS student_count
FROM courses
LEFT JOIN enrolments ON enrolments.course_id = courses.id
GROUP BY courses.id;

-- Query 4: Students who have no enrolments
SELECT students.name, students.email
FROM students
LEFT JOIN enrolments ON enrolments.student_id = students.id
WHERE enrolments.course_id IS NULL;

-- Query 5: Update of one enrolment's grade
UPDATE enrolments 
SET grade = 'A+' 
WHERE student_id = 1 AND course_id = 1;