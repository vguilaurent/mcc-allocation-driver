import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';

const SECTORS = [
  'Education',
  'Food Security & Livelihoods',
  'Health',
  'Humanitarian Assistance',
  'Peacebuilding',
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f7f', '#8dd1e1'];

export default function App() {
  const [projects, setProjects] = useState([
    { id: 'PRJ2980', name: 'CODESO Seasonal Hunger', country: 'Honduras', fy: 'FY25', budget: 30760, allocations: { 'Food Security & Livelihoods': 100 } },
    { id: 'CN1597', name: 'El Porvenir Watershed Mgmt', country: 'Nicaragua', fy: 'FY26', budget: 30000, allocations: { 'Food Security & Livelihoods': 60, 'Peacebuilding': 40 } },
  ]);

  const [chartType, setChartType] = useState('Pie');

  // Calculate totals
  const totals = useMemo(() => {
    const out = {};
    let grand = 0;
    SECTORS.forEach(s => out[s] = 0);
    projects.forEach(p => {
      grand += parseFloat(p.budget) || 0;
      SECTORS.forEach(s => {
        out[s] += ((p.allocations[s] || 0) / 100) * (parseFloat(p.budget) || 0);
      });
    });
    return { out, grand };
  }, [projects]);

  const sectorData = SECTORS.map((s, i) => ({
    sector: s,
    value: totals.out[s],
    percent: totals.grand > 0 ? (totals.out[s] / totals.grand) * 100 : 0,
  }));

  // Project table editing
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

  const addProject = () => {
    setProjects([...projects, { id: '', name: '', country: 'Honduras', fy: 'FY25', budget: 0, allocations: {} }]);
  };

  const deleteProject = (index) => {
    const newProjects = [...projects];
    newProjects.splice(index, 1);
    setProjects(newProjects);
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2>MCC Allocation Driver — Step 4 (Editable + Graphs)</h2>

      {/* Project Table */}
      <button onClick={addProject} style={{ marginBottom: 10 }}>+ Add Project</button>
      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 30 }}>
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

      {/* Chart Selector */}
      <div style={{ marginBottom: 20 }}>
        <label>Select Chart Type: </label>
        <select value={chartType} onChange={e => setChartType(e.target.value)}>
          <option>Pie</option>
          <option>Bar</option>
          <option>Line</option>
        </select>
      </div>

      {/* Chart Display */}
      <ResponsiveContainer width="100%" height={400}>
        {chartType === 'Pie' && (
          <PieChart>
            <Pie data={sectorData} dataKey="value" nameKey="sector" cx="50%" cy="50%" outerRadius={150} label>
              {sectorData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(value, name, props) => [`$${value.toFixed(0)}`, name]} />
          </PieChart>
        )}
        {chartType === 'Bar' && (
          <BarChart data={sectorData}>
            <XAxis dataKey="sector" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="percent" fill="#8884d8" name="Actual %" />
          </BarChart>
        )}
        {chartType === 'Line' && (
          <LineChart data={sectorData}>
            <XAxis dataKey="sector" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="percent" stroke="#82ca9d" />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
