import { useState, useEffect } from "react";

export default function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editId, setEditId] = useState(null);
  const [lastAddedId, setLastAddedId] = useState(null);

  const api = "http://127.0.0.1:5000/users";

  const load = () => fetch(api).then(r => r.json()).then(setUsers).catch(console.log);
  useEffect(() => load(), []);

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

  const del = id => fetch(`${api}/${id}`, { method: "DELETE" }).then(load);

  const sortByName = () => setUsers([...users].sort((a,b)=>a[1].localeCompare(b[1])));

  const inputStyle = { flex:1, padding:8, borderRadius:5, border:"1px solid #ccc" };
  const btnStyle = bg => ({ padding:"6px 12px", margin:2, borderRadius:5, border:"none", backgroundColor:bg, color:"white", cursor:"pointer" });
  const tableStyle = { width:"100%", borderCollapse:"collapse", backgroundColor:"white", borderRadius:5, overflow:"hidden" };
  const thStyle = { padding:10, backgroundColor:"#4CAF50", color:"white" };
  const tdStyle = { padding:8, textAlign:"center" };

  return (
    <div style={{ fontFamily:"Arial,sans-serif", padding:30, maxWidth:700, margin:"auto", backgroundColor:"#f5f5f5", borderRadius:10 }}>
      <h2 style={{ textAlign:"center", color:"#333" }}>User CRUD Application</h2>

      <div style={{ display:"flex", gap:10, marginBottom:20 }}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={inputStyle}/>
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} style={inputStyle}/>
        <button onClick={save} style={btnStyle("#4CAF50")}>{editId?"Update":"Add"}</button>
      </div>

      <button onClick={sortByName} style={btnStyle("#2196F3")}>Sort by Name</button>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u=>(
            <tr key={u[0]} style={{ backgroundColor:u[0]===lastAddedId?"#d4f4dd":"white" }}>
              <td style={tdStyle}>{u[0]}</td>
              <td style={tdStyle}>{u[1]}</td>
              <td style={tdStyle}>{u[2]}</td>
              <td style={tdStyle}>
                <button onClick={()=>{setEditId(u[0]); setForm({name:u[1],email:u[2]})}} style={btnStyle("#2196F3")}>Edit</button>
                <button onClick={()=>del(u[0])} style={btnStyle("#f44336")}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
