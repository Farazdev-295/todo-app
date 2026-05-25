import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '/App.css';
import { 
  FaEdit, FaTrash, FaSave, FaTimes, FaPlus, 
  FaClipboardList, FaChartLine, FaCheckCircle, 
  FaRegCircle, FaSearch, FaSun, FaMoon, FaCode 
} from 'react-icons/fa';

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim()) {
      const newTodo = {
        id: Date.now(),
        text: input.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTodos([newTodo, ...todos]);
      setInput('');
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  }).filter(todo => 
    todo.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      setTodos(todos.map(todo => 
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      ));
      setEditingId(null);
      setEditText('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const deleteTodo = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  const clearCompleted = () => {
    if (window.confirm('Delete all completed tasks?')) {
      setTodos(todos.filter(todo => !todo.completed));
    }
  };

  const deleteAll = () => {
    if (window.confirm('⚠️ Warning: This will delete ALL tasks! Are you sure?')) {
      setTodos([]);
    }
  };

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  };

  const getProgressPercentage = () => {
    if (stats.total === 0) return 0;
    return (stats.completed / stats.total) * 100;
  };

  return (
    <div className={`app-wrapper py-5 position-relative overflow-hidden ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      
      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-8 col-md-10">
            
            {/* Top Header - Updated with Faraz's Taskflow */}
            <div className="text-center mb-5 position-relative">
              <div className="brand-box mx-auto mb-3 d-flex align-items-center justify-content-center shadow-sm">
                <FaClipboardList className="fs-2 text-white" />
              </div>
              <h1 className="display-6 brand-title m-0 mb-1">
                Faraz's <span className="gradient-accent">Taskflow</span>
              </h1>
              <p className="small opacity-75 m-0 app-subtitle">Organize, track, and accomplish your goals smoothly</p>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="theme-toggle d-flex align-items-center justify-content-center shadow-sm"
              >
                {darkMode ? <FaSun className="text-warning" /> : <FaMoon className="text-primary" />}
              </button>
            </div>

            <div className="row g-3 mb-4 text-center">
              <div className="col-4">
                <div className="glass-card p-3">
                  <FaChartLine className="fs-4 text-info mb-1" />
                  <h4 className="fw-bold m-0">{stats.total}</h4>
                  <span className="text-uppercase tracking-wider opacity-60" style={{ fontSize: '10px' }}>Total</span>
                </div>
              </div>
              <div className="col-4">
                <div className="glass-card p-3">
                  <FaRegCircle className="fs-4 text-warning mb-1" />
                  <h4 className="fw-bold m-0">{stats.active}</h4>
                  <span className="text-uppercase tracking-wider opacity-60" style={{ fontSize: '10px' }}>Active</span>
                </div>
              </div>
              <div className="col-4">
                <div className="glass-card p-3">
                  <FaCheckCircle className="fs-4 text-success mb-1" />
                  <h4 className="fw-bold m-0">{stats.completed}</h4>
                  <span className="text-uppercase tracking-wider opacity-60" style={{ fontSize: '10px' }}>Done</span>
                </div>
              </div>
            </div>

            {stats.total > 0 && (
              <div className="glass-card p-3 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2 small">
                  <span className="fw-bold">🎯 Overall Progress</span>
                  <span className="fw-bold">{Math.round(getProgressPercentage())}%</span>
                </div>
                <div className="progress style-progress" style={{ height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '10px' }}>
                  <div 
                    className="progress-bar bg-success progress-bar-striped progress-bar-animated" 
                    role="progressbar" 
                    style={{ width: `${getProgressPercentage()}%`, borderRadius: '10px' }}
                  ></div>
                </div>
              </div>
            )}

            <div className="glass-card p-2 mb-4">
              <div className="input-group input-premium-wrapper">
                <input
                  type="text"
                  className="form-control field-premium shadow-none"
                  placeholder="What do you want to achieve today?"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                />
                <button 
                  className="btn btn-premium-add d-flex align-items-center gap-2"
                  onClick={addTodo}
                  disabled={!input.trim()}
                >
                  <FaPlus /> <span>Add</span>
                </button>
              </div>
            </div>

            <div className="row g-3 mb-4 align-items-center">
              <div className="col-sm-6 col-12">
                <div className="position-relative search-container">
                  <FaSearch className="position-absolute search-icon opacity-70" />
                  <div className="input-premium-wrapper">
                    <input
                      type="text"
                      className="form-control field-premium shadow-none"
                      placeholder="Search tasks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-12 d-flex justify-content-sm-end justify-content-center gap-2">
                {['all', 'active', 'completed'].map((f) => (
                  <button
                    key={f}
                    className={`btn pill-filter flex-fill flex-sm-grow-0 ${filter === f ? 'active-pill' : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f === 'all' && 'All'}
                    {f === 'active' && 'Active'}
                    {f === 'completed' && 'Done'}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card p-3 todo-list-box">
              {filteredTodos.length === 0 ? (
                <div className="text-center py-5 opacity-70">
                  <div className="fs-1 mb-2">🎯</div>
                  <h6 className="fw-bold m-0">No tasks found</h6>
                  <p className="small opacity-60 m-0">Add a new goal to kickstart your day!</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {filteredTodos.map(todo => (
                    <div key={todo.id} className="fade-in-row">
                      {editingId === todo.id ? (
                        <div className="d-flex gap-2 p-2 bg-white rounded shadow-sm">
                          <input
                            type="text"
                            className="form-control border-0 shadow-none text-dark fw-medium"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                            autoFocus
                          />
                          <button className="btn btn-success btn-sm px-3" onClick={saveEdit}><FaSave /></button>
                          <button className="btn btn-secondary btn-sm px-3" onClick={cancelEdit}><FaTimes /></button>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center justify-content-between p-3 todo-row rounded-3">
                          <div className="d-flex align-items-center gap-3 overflow-hidden flex-grow-1">
                            <button
                              onClick={() => toggleTodo(todo.id)}
                              className="btn btn-link p-0 text-decoration-none shadow-none border-0"
                            >
                              {todo.completed ? (
                                <FaCheckCircle className="fs-4 text-success" />
                              ) : (
                                <FaRegCircle className="fs-4 text-white-50" />
                              )}
                            </button>
                            <span className={`text-truncate fw-medium ${todo.completed ? 'completed-strike' : ''}`} style={{ fontSize: '0.95rem' }}>
                              {todo.text}
                            </span>
                          </div>
                          
                          <div className="d-flex gap-1">
                            <button className="btn btn-link text-warning p-2 border-0 shadow-none" onClick={() => startEdit(todo)}>
                              <FaEdit />
                            </button>
                            <button className="btn btn-link text-danger p-2 border-0 shadow-none" onClick={() => deleteTodo(todo.id)}>
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {(stats.completed > 0 || stats.total > 0) && (
              <div className="d-flex justify-content-center gap-2 mt-4">
                {stats.completed > 0 && (
                  <button className="btn btn-sm clear-btn-custom rounded-pill px-3 shadow-sm" onClick={clearCompleted}>
                    Clear Completed ({stats.completed})
                  </button>
                )}
                {stats.total > 0 && (
                  <button className="btn btn-sm btn-danger rounded-pill px-3 shadow-sm" onClick={deleteAll}>
                    Delete All
                  </button>
                )}
              </div>
            )}

            {/* Footer Branding - Updated with Faraz Shahbaz */}
            <div className="text-center mt-5 pt-3 border-top border-white-10 opacity-75">
              <p className="small m-0 d-flex align-items-center justify-content-center gap-2 app-subtitle">
                <FaCode className="text-warning" /> 
                <span>Designed & Developed by</span> 
                <span className="fw-bold gradient-accent fs-6">Faraz Shahbaz</span>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;