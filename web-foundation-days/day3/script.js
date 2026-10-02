// Starting data
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

// 1. searchNotes
function searchNotes(word) {
  const searchTerm = word.toLowerCase();
  return notes.filter((note) => note.text.toLowerCase().includes(searchTerm));
}

// 2. longestNote
function longestNote() {
  if (notes.length === 0) return null;
  let longest = notes[0];
  for (const note of notes) {
    if (note.text.length > longest.text.length) {
      longest = note;
    }
  }
  return longest;
}

// 3. countByCategory
function countByCategory() {
  const counts = { personal: 0, work: 0, study: 0 };
  for (const note of notes) {
    if (counts[note.category] !== undefined) {
      counts[note.category]++;
    }
  }
  return counts;
}

// 4. getSummary
function getSummary() {
  const counts = countByCategory();
  const noteWord = notes.length === 1 ? "note" : "notes";
  return `${notes.length} ${noteWord}: ${counts.personal} personal, ${counts.work} work, ${counts.study} study.`;
}

// 5. isDuplicate
function isDuplicate(text) {
  const cleanedText = text.trim().toLowerCase();
  return notes.some((note) => note.text.trim().toLowerCase() === cleanedText);
}

// 6. addNote
function addNote(text, category) {
  const cleaned = text.trim();
  const validCategories = ["personal", "work", "study"];

  if (cleaned.length < 1 || cleaned.length > 200) {
    console.log("❌ Rejected: Note must be between 1 and 200 characters.");
    return false;
  }
  if (!validCategories.includes(category)) {
    console.log("❌ Rejected: Invalid category.");
    return false;
  }
  if (isDuplicate(cleaned)) {
    console.log("❌ Rejected: Duplicate note already exists.");
    return false;
  }

  const newNote = {
    id: Date.now(),
    text: cleaned,
    category: category,
  };
  notes.push(newNote);
  console.log(`✅ Added note: "${newNote.text}"`);
  return true;
}

// --- Tests with Expected Outputs ---

// Test searchNotes
console.log(searchNotes("study")); // Expected: Array with 2 study notes
console.log(searchNotes("xyz"));   // Expected: [] (empty array)

// Test longestNote
console.log(longestNote());        // Expected: Note object with text "Email the project report to Grace"

// Test countByCategory
console.log(countByCategory());    // Expected: { personal: 2, work: 1, study: 2 }

// Test getSummary
console.log(getSummary());         // Expected: "5 notes: 2 personal, 1 work, 2 study."

// Test isDuplicate
console.log(isDuplicate("call mum")); // Expected: true (ignoring case)
console.log(isDuplicate("Workout"));  // Expected: false

// Test addNote
console.log(addNote("Go for a run", "personal")); // Expected: true (and logs success)
console.log(addNote("Call mum", "personal"));     // Expected: false (duplicate rejection)