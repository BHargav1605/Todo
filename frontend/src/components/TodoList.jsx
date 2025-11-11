import React, { useEffect, useState } from 'react';
import TodoCard from './TodoCard';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('/api/todos', { headers: { Authorization: 'Bearer ' + token }})
      .then(r => r.json()).then(setTodos);
  }, []);

  async function toggleDone(todo) {
    const res = await fetch(`/api/todos/${todo._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type':'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ done: !todo.done })
    });
    const upd = await res.json();
    setTodos(todos.map(t => t._id === upd._id ? upd : t));
  }

  async function del(id) {
    await fetch(`/api/todos/${id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + token }});
    setTodos(todos.filter(t => t._id !== id));
  }

  const undone = todos.filter(t => !t.done);
  const done = todos.filter(t => t.done);

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold mb-3">Pending</h2>
        <div className="grid gap-4">
          {undone.map(t => <TodoCard key={t._id} todo={t} onToggleDone={toggleDone} onDelete={del} />)}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Completed</h2>
        <div className="grid gap-4">
          {done.map(t => <TodoCard key={t._id} todo={t} onToggleDone={toggleDone} onDelete={del} />)}
        </div>
      </section>
    </div>
  );
}
