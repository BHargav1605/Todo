import React, { useState, useEffect } from "react";
import {
  registerUser,
  loginUser,
  getTodos,
  addTodo,
  toggleDone,
} from "./api";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [todos, setTodos] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState("");

  // 🧠 Fetch todos when logged in
  useEffect(() => {
    if (token) {
      getTodos(token)
        .then(setTodos)
        .catch((err) => console.error("Failed to load todos:", err));
    }
  }, [token]);

  // 🧠 Handle logout
  function handleLogout() {
    localStorage.removeItem("token");
    setToken("");
    setTodos([]);
    setEmail("");
    setPassword("");
    setName("");
  }

  // 🧠 Register
  async function handleRegister(e) {
    e.preventDefault();
    try {
      const data = await registerUser(email, password, name);
      setToken(data.token);
      localStorage.setItem("token", data.token);
    } catch {
      alert("Registration failed. Try a different email.");
    }
  }

  // 🧠 Login
  async function handleLogin(e) {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      setToken(data.token);
      localStorage.setItem("token", data.token);
    } catch {
      alert("Invalid credentials");
    }
  }

  // 🧠 Add new todo
  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const newTodo = await addTodo(token, title, "", dueAt);
      setTodos([...todos, newTodo]);
      setTitle("");
      setDueAt("");
    } catch {
      alert("Failed to add todo");
    }
  }

  // 🧠 Toggle done/undone
  async function handleToggle(todo) {
    try {
      const updated = await toggleDone(token, todo._id, !todo.done);
      setTodos(todos.map((t) => (t._id === updated._id ? updated : t)));
    } catch {
      alert("Failed to update todo");
    }
  }

  // 🧾 Show login/register form if not logged in
  if (!token)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-md w-96 text-center">
          <h1 className="text-2xl font-semibold mb-6 text-blue-600">
            Todo App Login / Register
          </h1>

          <form onSubmit={handleRegister} className="space-y-3 mb-6">
            <input
              className="w-full p-2 border rounded"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full p-2 border rounded"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="w-full p-2 border rounded"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Register
            </button>
          </form>

          <form onSubmit={handleLogin} className="space-y-3">
            <input
              className="w-full p-2 border rounded"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="w-full p-2 border rounded"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );

  // ✅ Logged-in UI
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="bg-white rounded-2xl shadow-md w-[420px] p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">✅ Your Todo List</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>

        <form onSubmit={handleAdd} className="flex flex-col gap-2 mb-6">
          <input
            className="p-2 border rounded"
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="datetime-local"
            className="p-2 border rounded"
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Add Task
          </button>
        </form>

        <ul className="space-y-3">
          {todos.length === 0 && (
            <p className="text-gray-500 text-center">No tasks yet ✏️</p>
          )}
          {todos.map((t) => (
            <li
              key={t._id}
              onClick={() => handleToggle(t)}
              className={`p-3 rounded-lg shadow cursor-pointer transition 
              ${
                t.done
                  ? "line-through bg-gray-200 text-gray-500 grayscale"
                  : "bg-blue-50 hover:bg-blue-100"
              }`}
            >
              <div className="flex justify-between">
                <span>{t.title}</span>
                {t.dueAt && (
                  <span className="text-xs text-gray-500">
                    {new Date(t.dueAt).toLocaleString()}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
