const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function registerUser(email, password, name) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  if (!res.ok) throw new Error("Failed to register");
  return res.json();
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function getTodos(token) {
  const res = await fetch(`${API_URL}/api/todos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json();
}


export async function toggleDone(token, id, done) {
  const res = await fetch(`${API_URL}/api/todos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ done }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Failed to update todo: ${msg}`);
  }

  return res.json();
}

export async function addTodo(token, title, description = "", dueAt = null) {
  const res = await fetch(`${API_URL}/api/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description, dueAt }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Failed to add todo: ${msg}`);
  }
  return res.json();
}

