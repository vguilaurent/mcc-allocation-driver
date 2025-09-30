import React, { useState } from 'react';

const SECTORS = [
  'Education',
  'Food Security & Livelihoods',
  'Health',
  'Humanitarian Assistance',
  'Peacebuilding',
];

export default function App() {
  const [projects, setProjects] = useState([
    { id: 'PRJ2980', name: 'CODESO Seasonal Hunger', country: 'Honduras', fy: 'FY25', budget: 30760, allocations: { 'Food Security & Livelihoods': 100 } },
    { id: 'CN1597', name: 'El Porvenir Watershed Mgmt', country: 'Nicaragua', fy: 'FY26', budget: 30000, allocations: { 'Food Security & Livelihoods': 60, 'Peacebuilding': 40 } },
  ]);

  const addProject = () => {
    setProjects([...projects, { id: '', name: '', country: 'Honduras', fy: 'FY25', budget: 0, allocations: {} }]);
  };

  const updateProject = (index, field, value) => {
    const newProjects = [...projects];
    newProjects[index][field] = value;
    setProjects(newProjects);
  };

  const updateAllocation = (index, sector, value) => {
    const newProjects = [...projects];
    newProjects[index].allocations[sector] = parseFloat(value) || 0;
    setProjects(newProjects);
  };

  const deleteProject = (index) => {
    const newProjects = [...projects];
    newProjects.splice(index, 1);
    setProjects(newProjects);
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2>MCC Allocation Driver — Step 3 (Editable Projects & Allocations)</h2>
      <button onClick={addProject} style={{ marginBottom: 10 }}>+ Add Project</button>
      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Country</th>
            <th>Fiscal Year</th>
            <th>Budget (USD)</th>
            {SECTORS.map(s => <th key={s}>{s} %</th>)}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((proj, idx) => (
            <tr key={idx}>
              <td><input value={proj.id} onChange={e => updateProject(idx, 'id', e.target.value)} /></td>
              <td><input value={proj.name} onChange={e => updateProject(idx, 'name', e.target.value)} /></td>
              <td>
                <select value={proj.country} onChange={e => updateProject(idx, 'country', e.target.value)}>
                  <option>Honduras</option>
                  <option>Nicaragua</option>
                </select>
              </td>
              <td>
                <select value={proj.fy} onChange={e => updateProject(idx, 'fy', e.target.value)}>
                  <option>FY25</option>
                  <option>FY26</option>
                  <option>FY27</option>
                </select>
              </td>
              <td><input type="number" value={proj.budget} onChange={e => updateProject(idx, 'budget', e.target.value)} /></td>
              {SECTORS.map(s => (
                <td key={s}>
                  <input
                    type="number"
                    value={proj.allocations[s] || ''}
                    onChange={e => updateAllocation(idx, s, e.target.value)}
                    style={{ width: '60px' }}
                  />
                </td>
              ))}
              <td><button onClick={() => deleteProject(idx)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginTop: 20, fontSize: '0.9em', color: '#555' }}>
        Projects and allocations are editable. Sector percentages should sum to 100 for each project.
      </p>
    </div>
  );
}
