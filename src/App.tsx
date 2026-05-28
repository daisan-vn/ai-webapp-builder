import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data.data || []);
  };

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    setName("");
    setEmail("");
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif", maxWidth: 600, margin: "0 auto" }}>
      <h1>AI Web Builder MVP</h1>

      <form onSubmit={addUser} style={{ marginBottom: 20 }}>
        <input
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ marginRight: 8, padding: 8 }}
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ marginRight: 8, padding: 8 }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>Thêm</button>
      </form>

      <h3>Danh sách Users ({users.length})</h3>
      {users.length === 0 ? (
        <p>Chưa có user nào.</p>
      ) : (
        <ul>
          {users.map((u) => (
            <li key={u.id}>{u.name} — {u.email}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
