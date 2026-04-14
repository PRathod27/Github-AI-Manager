import React, { useEffect, useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/tasks')
      .then(res => res.json())
      .then(data => {
        console.log("Data Received:", data); // Debugging line
        setTasks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Loading Intelligent Insights...</h2>;

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 GitHub Intelligent Manager</h1>
      {tasks.length === 0 ? (
        <p>No tasks automated yet. Try "Redelivering" a webhook from GitHub!</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead style={{ backgroundColor: '#2d333b', color: 'white' }}>
            <tr>
              <th>Repository</th>
              <th>Type</th>
              <th>AI Suggestion</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.repo_name} [cite: 8]</td>
                <td>
                  <span style={{
                    padding: '5px 10px',
                    borderRadius: '4px',
                    backgroundColor: task.classification === 'BUG' ? '#ff4d4d' : '#4caf50',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {task.classification} [cite: 26]
                  </span>
                </td>
                <td>{task.suggestion} [cite: 27]</td>
                <td>{new Date(task.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;