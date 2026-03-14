import { useState, useEffect, useRef, memo, useCallback } from "react";

interface Todo {
  id: string;
  text: string;
  done: number;
  created_at: number;
}

const API = "/mptodo/api";

const TodoItem = memo(function TodoItem({
  todo,
  onToggle,
  onDelete,
}: {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <li className="flex items-start gap-3 bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2.5 group hover:border-zinc-700 transition-colors">
      <button
        onClick={() => onToggle(todo.id)}
        className={`w-4 h-4 mt-0.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
          todo.done ? "bg-zinc-500 border-zinc-500" : "border-zinc-600 hover:border-zinc-400"
        }`}
      >
        {!!todo.done && (
          <svg className="w-2.5 h-2.5 text-zinc-950" fill="none" viewBox="0 0 10 10">
            <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <span className={`flex-1 text-sm select-none ${todo.done ? "line-through text-zinc-600" : "text-zinc-200"}`}>
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="text-zinc-700 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-all p-0.5 flex-shrink-0 mt-0.5"
        aria-label="Delete"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
          <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </li>
  );
});

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  async function fetchTodos() {
    try {
      const r = await fetch(`${API}/todos`);
      setTodos(await r.json());
    } catch {}
    setLoading(false);
  }

  useEffect(() => {
    fetchTodos();
    const es = new EventSource(`${API}/events`);
    es.onmessage = () => fetchTodos();
    es.onerror = () => {}; // auto-reconnects
    return () => es.close();
  }, []);

  async function addTodo() {
    const text = input.trim();
    if (!text) return;
    await fetch(`${API}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    setInput("");
    inputRef.current?.focus();
    fetchTodos();
  }

  const toggleTodo = useCallback(async (id: string) => {
    await fetch(`${API}/todos/${id}`, { method: "PATCH" });
    fetchTodos();
  }, []);

  const deleteTodo = useCallback(async (id: string) => {
    await fetch(`${API}/todos/${id}`, { method: "DELETE" });
    fetchTodos();
  }, []);

  const doneCount = todos.filter((t) => t.done).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-lg">
        <div className="flex items-baseline justify-between mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white">mptodo</h1>
          {todos.length > 0 && (
            <span className="text-xs text-zinc-600">
              {doneCount}/{todos.length} done
            </span>
          )}
        </div>

        {/* Add input */}
        <div className="flex gap-2 mb-6">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="Add a todo..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-base md:text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 transition-colors"
          />
          <button
            onClick={addTodo}
            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            Add
          </button>
        </div>

        {/* List */}
        {loading ? (
          <p className="text-zinc-600 text-sm">Loading...</p>
        ) : todos.length === 0 ? (
          <p className="text-zinc-700 text-sm">No todos yet.</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
