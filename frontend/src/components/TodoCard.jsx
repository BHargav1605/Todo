// TodoCard.jsx
import React from 'react';

export default function TodoCard({ todo, onToggleDone, onDelete }) {
  return (
    <div className={`p-4 rounded-lg shadow ${todo.done ? 'opacity-70 filter grayscale bg-white/80' : 'bg-white'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`text-lg font-medium ${todo.done ? 'line-through' : ''}`}>{todo.title}</h3>
          {todo.description && <p className={`text-sm ${todo.done ? 'line-through' : ''}`}>{todo.description}</p>}
          {todo.dueAt && <p className="text-xs text-gray-500">Due: {new Date(todo.dueAt).toLocaleString()}</p>}
        </div>
        <div className="space-y-2">
          <button className="px-3 py-1 border rounded" onClick={() => onToggleDone(todo)}>
            {todo.done ? 'Mark Undone' : 'Mark Done'}
          </button>
          <button className="px-3 py-1 text-red-600" onClick={() => onDelete(todo._id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}
