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
  const [country, setCountry] = useState('Honduras');
  const [strategicDirection, setStrategicDirection] = useState('All');
  const [fy, setFy] = useState('FY25');
  const [chartType, setChartType] = useState('Pie');

  const [projects, setProjects] = useState([
    { id: 'PRJ2980', name: 'CODESO Seasonal Hunger', type: 'Project', country: 'Honduras', fy: 'FY25', budget: 30760, allocations: { 'Food Security & Livelihoods': 100 } },
    { id: 'CN1597', name: 'El Porvenir Watershed Mgmt', type: 'CN', country: 'Nicaragua', fy: 'FY26', budget: 30000, allocations: { 'Food Security & Livelihoods': 60, 'Peacebuilding': 40 } },
  ]);

  // Compute totals (baseline dummy example)
  const baseline = useMemo(() => {
    return {
      'Education': 2.0,
      'Food Security & Livelihoods': 22.4,
      'Health': 0.0,
      'Humanitarian Assistance': 18.1,
      'Peacebuilding': 55.2,
    };
  }, []);

  const totalsByType = useMemo(() => {
    const result = { projects: {}, projected: {} };
    SECTORS.forEach(s => {
      result.projects[s] = 0;
      result.projected[s] = 0;
    });

    projects.forEach(p => {
      SECTORS.forEach(s => {
        const value = ((p.allocations[s] || 0) / 100) * (parseFloat(p.budget) || 0);
        if (p.type === 'Project') result.projects[s] += value;
        result.projected[s] += value;
      });
    });
    return result;
  }, [projects]);

  const addProject = () => {
    setProjects([...projects, { id: '', name: '', type: 'Project', country, fy: 'FY25', budget: 0, allocations: {} }]);
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

  const totalBudgetProjects = Object.values(totalsByType.projects).reduce((a,b)=>a+b,0);
  const totalBudgetProjected = Object.values(totalsByType.projected).reduce((a,b)=>a+b,0);

  const summaryData = SECTORS.map(s => ({
    sector: s,
    target: baseline[s] || 0,
    actual: totalBudgetProjects>0 ? (totalsByType.projects[s]/totalBudgetProjects)*100 : 0,
    projected: totalBudgetProjected>0 ? (totalsByType.projected[s]/totalBudgetProjected)*100 : 0,
    targetVal: baseline[s]/100 * totalBudgetProjected,
    actualVal: totalsByType.projects[s],
    projectedVal: totalsByType.projected[s]
  }));

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2>MCC Nicaragua / Honduras Allocation Tracker</h2>

      {/* Filters */}
      <div style={{ marginBottom: 20 }}>
        <label>Country: </label>
        <select value={country} onChange={e=>setCountry(e.target.value)}>
          <option>Honduras</option>
          <option>Nicaragua</option>
        </select>
        <label style={{ marginLeft: 20 }}>Strategic Direction: </label>
        <select value={strategicDirection} onChange={e=>setStrategicDirection(e.target.value)}>
          <option>All</option>
          {SECTORS.map(s => <option key={s}>{s}</option>)}
        </select>
        <label style={{ marginLeft: 20 }}>Fiscal Year: </label>
        <select value={fy} onChange={e=>setFy(e.target.value)}>
          <option>FY25</option>
          <option>FY26</option>
          <option>FY27</option>
        </select>
      </div>

      {/* Baseline, Actual, Projected */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ flex: 1, marginRight: 10 }}>
          <h3>Strategic Plan Baseline</h3>
          <table border="1" cellPadding="4" style={{ borderCollapse:'collapse', width:'100%' }}>
            <thead><tr><th>Sector</th><th>Target %</th></tr></thead>
            <tbody>
              {SECTORS.map(s=>(<tr key={s}><td>{s}</td><td>{baseline[s]}</td></tr>))}
            </tbody>
          </table>
        </div>
        <div style={{ flex: 1, marginRight: 10 }}>
          <h3>Actuals (Projects)</h3>
          <table border="1" cellPadding="4" style={{ borderCollapse:'collapse', width:'100%' }}>
            <thead><tr><th>Sector</th><th>Actual %</th></tr></thead>
            <tbody>
              {summaryData.map(r=>(<tr key={r.sector}><td>{r.sector}</td><td>{r.actual.toFixed(1)}</td></tr>))}
            </tbody>
          </table>
        </div>
        <div style={{ flex: 1 }}>
          <h3>Projected (Projects+CNs)</h3>
          <table border="1" cellPadding="4" style={{ borderCollapse:'collapse', width:'100%' }}>
            <thead><tr><th>Sector</th><th>Projected %</th></tr></thead>
            <tbody>
              {summaryData.map(r=>(<tr key={r.sector}><td>{r.sector}</td><td>{r.projected.toFixed(1)}</td></tr>))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div style={{ marginBottom: 30 }}>
        <h3>Charts</h3>
        <label>Select Chart: </label>
        <select value={chartType} onChange={e=>setChartType(e.target.value)}>
          <option>Pie</option>
          <option>Bar</option>
          <option>Line</option>
        </select>
        <ResponsiveContainer width="100%" height={300}>
          {chartType==='Pie' && (
            <PieChart>
              <Pie data={summaryData} dataKey="projected" nameKey="sector" cx="50%" cy="50%" outerRadius={100} label>
                {summaryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
          {chartType==='Bar' && (
            <BarChart data={summaryData}>
              <XAxis dataKey="sector" /><YAxis /><Tooltip /><Legend />
              <Bar dataKey="target" fill="#8884d8" name="Target %" />
              <Bar dataKey="actual" fill="#82ca9d" name="Actual %" />
              <Bar dataKey="projected" fill="#ffc658" name="Projected %" />
            </BarChart>
          )}
          {chartType==='Line' && (
            <LineChart>
              <XAxis dataKey="sector" /><YAxis /><Tooltip /><Legend />
              <Line dataKey="target" data={summaryData} name="Target %" stroke="#8884d8" />
              <Line dataKey="actual" data={summaryData} name="Actual %" stroke="#82ca9d" />
              <Line dataKey="projected" data={summaryData} name="Projected %" stroke="#ffc658" />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Allocation Table */}
      <h3>Editable Allocation Table</h3>
      <button onClick={addProject} style={{ marginBottom: 10 }}>+ Add Project</button>
      <table border="1" cellPadding="6" style={{ borderCollapse:'collapse', width:'100%', marginBottom: 30 }}>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Type</th><th>FY</th><th>Budget</th>
            {SECTORS.map(s=><th key={s}>{s} %</th>)}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p, idx)=>(
            <tr key={idx}>
              <td><input value={p.id} onChange={e=>updateProject(idx,'id',e.target.value)} /></td>
              <td><input value={p.name} onChange={e=>updateProject(idx,'name',e.target.value)} /></td>
              <td>
                <select value={p.type} onChange={e=>updateProject(idx,'type',e.target.value)}>
                  <option>Project</option>
                  <option>CN</option>
                </select>
              </td>
              <td>
                <select value={p.fy} onChange={e=>updateProject(idx,'fy',e.target.value)}>
                  <option>FY25</option>
                  <option>FY26</option>
                  <option>FY27</option>
                </select>
              </td>
              <td><input type="number" value={p.budget} onChange={e=>updateProject(idx,'budget',e.target.value)} /></td>
              {SECTORS.map(s=>(
                <td key={s}><input type="number" value={p.allocations[s]||''} onChange={e=>updateAllocation(idx,s,e.target.value)} style={{ width:'60px' }}/></td>
              ))}
              <td><button onClick={()=>deleteProject(idx)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary Comparison */}
      <h3>Summary Comparison</h3>
      <table border="1" cellPadding="6" style={{ borderCollapse:'collapse', width:'100%' }}>
        <thead>
          <tr>
            <th>Sector</th><th>Target %</th><th>Actual %</th><th>Projected %</th>
            <th>Target $</th><th>Actual $</th><th>Projected $</th>
          </tr>
        </thead>
        <tbody>
          {summaryData.map(r=>(
            <tr key={r.sector}>
              <td>{r.sector}</td>
              <td>{r.target.toFixed(1)}</td>
              <td>{r.actual.toFixed(1)}</td>
              <td>{r.projected.toFixed(1)}</td>
              <td>{r.targetVal.toFixed(0)}</td>
              <td>{r.actualVal.toFixed(0)}</td>
              <td>{r.projectedVal.toFixed(0)}</td>
            </tr>
          ))}
          <tr>
            <td><b>TOTAL</b></td>
            <td>100.0</td>
            <td>100.0</td>
            <td>100.0</td>
            <td>{totalBudgetProjected.toFixed(0)}</td>
            <td>{totalBudgetProjects.toFixed(0)}</td>
            <td>{totalBudgetProjected.toFixed(0)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
