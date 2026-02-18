import { useState, useEffect } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState(null);
  const [lastAddedId, setLastAddedId] = useState(null);

  // Load users from backend
  const loadUsers = () => {
    fetch("http://127.0.0.1:5000/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.log("Failed to fetch", err));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Add or Update user
  const addOrUpdate = () => {
    if (editId === null) {
      // Add
      fetch("http://127.0.0.1:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
      })
        .then(() => loadUsers())
        .then(() => {
          setName("");
          setEmail("");
          if (users.length > 0) setLastAddedId(users[users.length - 1][0] + 1);
        });
    } else {
      // Update
      fetch(`http://127.0.0.1:5000/users/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
      }).then(() => window.location.reload());
    }
  };

  // Delete a single user
  const deleteUser = (id) => {
    fetch(`http://127.0.0.1:5000/users/${id}`, { method: "DELETE" })
      .then(() => loadUsers());
  };

  // Sort users by name
  const sortByName = () => {
    const sorted = [...users].sort((a, b) =>
      a[1].toLowerCase() > b[1].toLowerCase() ? 1 : -1
    );
    setUsers(sorted);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Simple User CRUD</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <button onClick={addOrUpdate}>
        {editId === null ? "Add" : "Update"}
      </button>
      <button onClick={sortByName}>Sort by Name</button>

      <table border="1" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr
              key={u[0]}
              style={{ backgroundColor: u[0] === lastAddedId ? "#d4f4dd" : "white" }}
            >
              <td>{u[0]}</td>
              <td>{u[1]}</td>
              <td>{u[2]}</td>
              <td>
                <button onClick={() => {
                  setEditId(u[0]);
                  setName(u[1]);
                  setEmail(u[2]);
                }}>Edit</button>
                <button onClick={() => deleteUser(u[0])}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
