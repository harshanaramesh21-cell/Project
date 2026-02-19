import { useState, useEffect } from "react";

export default function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editId, setEditId] = useState(null);
  const [lastAddedId, setLastAddedId] = useState(null);

  const api = "http://127.0.0.1:5000/users";

  // Load users
  const load = () => fetch(api).then(r => r.json()).then(setUsers).catch(console.log);
  useEffect(() => { load(); }, []);

  // Save (Add or Update)
  const save = () => {
    fetch(editId ? `${api}/${editId}` : api, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    }).then(() => {
      if (!editId && users.length) setLastAddedId(users[users.length - 1][0] + 1);
      setForm({ name: "", email: "" });
      setEditId(null);
      load();
    });
  };

  // Delete
  const del = id => fetch(`${api}/${id}`, { method: "DELETE" }).then(load);

  // Sort by name only
  const sortByName = () => setUsers([...users].sort((a,b)=>a[1].localeCompare(b[1])));

  return (
    <div style={{padding:20}}>
      <h2>CRUD App</h2>
      <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
      <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
      <button onClick={save}>{editId?"Update":"Add"}</button>
      <button onClick={sortByName}>Sort by Name</button>

      <table border="1" style={{marginTop:20}}>
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Action</th></tr></thead>
        <tbody>
          {users.map(u=>(
            <tr key={u[0]} style={{ backgroundColor: u[0]===lastAddedId ? "#d4f4dd" : "white" }}>
              <td>{u[0]}</td>
              <td>{u[1]}</td>
              <td>{u[2]}</td>
              <td>
                <button onClick={()=>{setEditId(u[0]); setForm({name:u[1],email:u[2]})}}>Edit</button>
                <button onClick={()=>del(u[0])}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
