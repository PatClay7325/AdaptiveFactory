import React, { useState, useEffect } from 'react';
import { supabase } from '../../configs/supabaseClient';
import type { Todo } from '../../configs/supabaseClient';

interface TodosProps {
  isAdmin?: boolean;
}

const Todos: React.FC<TodosProps> = ({ isAdmin = false }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [allUsersTodos, setAllUsersTodos] = useState<Todo[]>([]);
  const [viewAllUsers, setViewAllUsers] = useState<boolean>(false);

  useEffect(() => {
    fetchTodos();
    if (isAdmin) {
      fetchAllUsersTodos();
    }
  }, [isAdmin]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('You must be logged in to view todos');
        return;
      }
      
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setTodos(data || []);
    } catch (error: any) {
      console.error('Error fetching todos:', error);
      setError('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsersTodos = async () => {
    if (!isAdmin) return;
    
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setAllUsersTodos(data || []);
    } catch (error: any) {
      console.error('Error fetching all todos:', error);
    }
  };

  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTodoText.trim()) return;
    
    try {
      setLoading(true);
      
      // Get user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('You must be logged in to create todos');
        return;
      }
      
      const { data, error } = await supabase
        .from('todos')
        .insert([{ 
          task: newTodoText, 
          is_complete: false,
          user_id: session.user.id 
        }])
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setTodos([data[0], ...todos]);
        setNewTodoText('');
        
        // Refresh all users todos if admin is viewing all
        if (isAdmin && viewAllUsers) {
          fetchAllUsersTodos();
        }
      }
    } catch (error: any) {
      console.error('Error creating todo:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTodoCompletion = async (id: number, is_complete: boolean) => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .update({ is_complete: !is_complete })
        .eq('id', id)
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setTodos(todos.map(todo => todo.id === id ? data[0] : todo));
        
        // Update in all users todos list if admin
        if (isAdmin && viewAllUsers) {
          setAllUsersTodos(allUsersTodos.map(todo => 
            todo.id === id ? data[0] : todo
          ));
        }
      }
    } catch (error: any) {
      console.error('Error updating todo:', error);
      alert(error.message);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setTodos(todos.filter(todo => todo.id !== id));
      
      // Update all users todos list if admin
      if (isAdmin && viewAllUsers) {
        setAllUsersTodos(allUsersTodos.filter(todo => todo.id !== id));
      }
    } catch (error: any) {
      console.error('Error deleting todo:', error);
      alert(error.message);
    }
  };

  const toggleView = () => {
    setViewAllUsers(!viewAllUsers);
  };

  const displayTodos = viewAllUsers ? allUsersTodos : todos;

  return (
    <div className="todos-container">
      <h1>Todo List</h1>
      
      {isAdmin && (
        <div className="admin-controls">
          <button onClick={toggleView} className="button">
            {viewAllUsers ? 'View My Todos' : 'View All Users Todos'}
          </button>
        </div>
      )}
      
      <form onSubmit={createTodo} className="todo-form">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          className="todo-input"
        />
        <button type="submit" disabled={loading} className="todo-button">
          Add
        </button>
      </form>
      
      {error && <p className="error">{error}</p>}
      
      {loading && displayTodos.length === 0 ? (
        <p>Loading todos...</p>
      ) : (
        <ul className="todo-list">
          {displayTodos.length === 0 ? (
            <p>No todos yet. Create one to get started!</p>
          ) : (
            displayTodos.map((todo) => (
              <li key={todo.id} className="todo-item">
                <input
                  type="checkbox"
                  checked={todo.is_complete}
                  onChange={() => toggleTodoCompletion(todo.id, todo.is_complete)}
                />
                <span style={{ textDecoration: todo.is_complete ? 'line-through' : 'none' }}>
                  {todo.task}
                </span>
                {viewAllUsers && (
                  <span className="todo-user-id">{todo.user_id.substring(0, 8)}...</span>
                )}
                <button onClick={() => deleteTodo(todo.id)} className="delete-button">
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default Todos;