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

  // Totals per sector & FY
  const totalsByFY = useMemo(() => {
    const data = {};
    projects.forEach(p => {
      if (!data[p.fy]) {
        data[p.fy] = {};
        SECTORS.forEach(s => data[p.fy][s] = 0);
      }
      SECTORS.forEach(s => {
        data[p.fy][s] += ((p.allocations[s] || 0) / 100) * (parseFloat(p.budget) || 0);
      });
    });
    return data;
  }, [projects]);

  // Current totals (all FY combined)
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

  const barData = Object.keys(totalsByFY).map(fy => {
    const row = { fy };
    SECTORS.forEach(s => {
      const totalFY = Object.values(totalsByFY[fy]).reduce((a, b) => a + b, 0);
      row[s] = totalFY > 0 ? (totalsByFY[fy][s] / totalFY) * 100 : 0;
    });
    return row;
  });

  const lineData = SECTORS.map(s => ({
    sector: s,
    data: Object.keys(totalsByFY).map(fy => ({
      fy,
      percent: (() => {
        const totalFY = Object.values(totalsByFY[fy]).reduce((a, b) => a + b, 0);
        return totalFY > 0 ? (totalsByFY[fy][s] / totalFY) * 100 : 0;
      })()
    }))
  }));

  // Table Editing
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
      <h2>MCC Allocation Driver — Step 4</h2>

      {/* Top row: Summary + Chart */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30 }}>
        {/* Summary Table */}
        <div style={{ flex: 1, marginRight: 20 }}>
          <h3>Summary (All FYs)</h3>
          <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th>Sector</th>
                <th>Actual %</th>
              </tr>
            </thead>
            <tbody>
              {SECTORS.map((s) => (
                <tr key={s}>
                  <td>{s}</td>
                  <td>{sectorData.find(d => d.sector === s).percent.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chart Panel */}
        <div style={{ flex: 1 }}>
          <h3>Charts</h3>
          <label>Select Chart: </label>
          <select value={chartType} onChange={e => setChartType(e.target.value)}>
            <option>Pie</option>
            <option>Bar</option>
            <option>Line</option>
          </select>
          <ResponsiveContainer width="100%" height={300}>
            {chartType === 'Pie' && (
              <PieChart>
                <Pie data={sectorData} dataKey="value" nameKey="sector" cx="50%" cy="50%" outerRadius={100} label>
                  {sectorData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(0)}`} />
              </PieChart>
            )}
            {chartType === 'Bar' && (
              <BarChart data={barData}>
                <XAxis dataKey="fy" />
                <YAxis />
                <Tooltip />
                <Legend />
                {SECTORS.map((s, i) => (
                  <Bar key={s} dataKey={s} stackId="a" fill={COLORS[i % COLORS.length]} />
                ))}
              </BarChart>
            )}
            {chartType === 'Line' && (
              <LineChart>
                <XAxis dataKey="fy" />
                <YAxis />
                <Tooltip />
                <Legend />
                {lineData.map((line) => (
                  <Line key={line.sector} data={line.data} dataKey="percent" name={line.sector} stroke={COLORS[SECTORS.indexOf(line.sector) % COLORS.length]} />
                ))}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Allocation Table */}
      <h3>Allocation Table</h3>
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

      {/* Geo Heatmap Placeholder */}
      <h3>Geo Heatmap of Allocations (Coming Soon)</h3>
      <div style={{ height: 200, background: '#f0f0f0', textAlign: 'center', lineHeight: '200px' }}>
        [Map Placeholder]
      </div>
    </div>
  );
}
