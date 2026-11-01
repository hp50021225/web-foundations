const API_URL = "https://jsonplaceholder.typicode.com/users";

const loadBtn = document.querySelector("#load-users");
const filterInput = document.querySelector("#filter-input");
const statusText = document.querySelector("#status");
const usersList = document.querySelector("#users-list");

let allUsers = [];

function renderUsers(usersToRender) {
  usersList.innerHTML = "";

  if (usersToRender.length === 0 && allUsers.length > 0) {
    const li = document.createElement("li");
    li.textContent = "No users match your filter.";
    usersList.appendChild(li);
    return;
  }

  usersToRender.forEach(user => {
    const li = document.createElement("li");
    li.textContent = `${user.name} — Email: ${user.email} | City: ${user.address.city} | Company: ${user.company.name}`;
    usersList.appendChild(li);
  });
}

async function loadUsers() {
  statusText.textContent = "Loading users...";
  loadBtn.disabled = true;
  usersList.innerHTML = "";

  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    allUsers = await response.json();
    renderUsers(allUsers);
    statusText.textContent = `Loaded ${allUsers.length} users successfully.`;
  } catch (error) {
    statusText.textContent = "Could not load users. Please try again.";
    console.error(error);
  } finally {
    loadBtn.disabled = false;
  }
}

loadBtn.addEventListener("click", loadUsers);

filterInput.addEventListener("input", () => {
  const searchTerm = filterInput.value.toLowerCase();
  const filtered = allUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm)
  );
  renderUsers(filtered);
});