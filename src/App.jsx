import React, { useState, useMemo } from 'react';

const SECTORS = [
  'Education',
  'Food Security & Livelihoods',
  'Health',
  'Humanitarian Assistance',
  'Peacebuilding',
];

// Preloaded projects and CNs with budgets + splits
const DATA = [
  // Honduras FY25–26
  { id: 'PRJ316', name: '500 Years of Anabaptism', country: 'Honduras', fy: 'FY25', budget: 3016, sectors: { Peacebuilding: 1 } },
  { id: 'PRJ3419', name: 'Emergency Food Assistance', country: 'Honduras', fy: 'FY25', budget: 7713, sectors: { 'Humanitarian Assistance': 1 } },
  { id: 'PRJ3434', name: 'Local Protection Networks (ASM)', country: 'Honduras', fy: 'FY25', budget: 40000, sectors: { 'Food Security & Livelihoods': 0.8, Peacebuilding: 0.2 } },
  { id: 'PRJ3464', name: 'Psychosocial Reintegration', country: 'Honduras', fy: 'FY25', budget: 150000, sectors: { Education: 0.25, 'Humanitarian Assistance': 0.5, Peacebuilding: 0.25 } },
  { id: 'PRJ2980', name: 'CODESO Seasonal Hunger', country: 'Honduras', fy: 'FY25', budget: 30760, sectors: { 'Food Security & Livelihoods': 1 } },
  { id: 'PRJ3337', name: 'Protection Networks & Municipal Coordination (PAG)', country: 'Honduras', fy: 'FY25', budget: 50000, sectors: { Peacebuilding: 1 } },

  // Nicaragua FY25–26
  { id: 'PRJ3421', name: 'Improvement of Classrooms (MINED)', country: 'Nicaragua', fy: 'FY25', budget: 53400, sectors: { Education: 1 } },
  { id: 'PRJ3027', name: 'Safe Water for Families (FSL)', country: 'Nicaragua', fy: 'FY25', budget: 40000, sectors: { Health: 1 } },

  // CNs FY26–27
  { id: 'CN1597', name: 'El Porvenir Watershed Mgmt', country: 'Nicaragua', fy: 'FY26', budget: 30000, sectors: { 'Food Security & Livelihoods': 0.6, Peacebuilding: 0.4 } },
  { id: 'CN1611', name: 'PAG Flor de Campo', country: 'Honduras', fy: 'FY26', budget: 30000, sectors: { 'Food Security & Livelihoods': 0.8, Peacebuilding: 0.2 } },
  { id: 'CN3434', name: 'Local Protection Networks (ASM) – CN', country: 'Honduras', fy: 'FY26', budget: 82173, sectors: { 'Food Security & Livelihoods': 0.8, Peacebuilding: 0.2 } },
  { id: 'CN3464', name: 'Psychosocial Reintegration Ext.', country: 'Honduras', fy: 'FY26', budget: 30000, sectors: { Education: 0.25, 'Humanitarian Assistance': 0.5, Peacebuilding: 0.25 } },
];

// Default strategic plan targets (editable)
const DEFAULTS = {
  Honduras: { Education: 2, 'Food Security & Livelihoods': 22.4, Health: 0, 'Humanitarian Assistance': 18.1, Peacebuilding: 55.2 },
  Nicaragua: { Education: 14.9, 'Food Security & Livelihoods': 35.3, Health: 20.3, 'Humanitarian Assistance': 9, Peacebuilding: 20.4 },
};

export default function App() {
  const [targets, setTargets] = useState(DEFAULTS);
  const [country, setCountry] = useState('Honduras');
  const [fy, setFY] = useState('FY25');

  const items = useMemo(() => DATA.filter(d => d.country === country && d.fy === fy), [country, fy]);

  // Calculate totals
  const totals = {};
  let grand = 0;
  SECTORS.forEach(s => totals[s] = 0);
  items.forEach(it => {
    grand += it.budget;
    SECTORS.forEach(s => totals[s] += (it.sectors[s] || 0) * it.budget);
  });

  const shares = {};
  SECTORS.forEach(s => shares[s] = grand > 0 ? (totals[s] / grand) * 100 : 0);

  const handleChange = (sector, value) => {
    setTargets({
      ...targets,
      [country]: { ...targets[country], [sector]: parseFloat(value) || 0 },
    });
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2>MCC Allocation Driver — Step 2 (Projects Loaded)</h2>

      {/* Country and FY selectors */}
      <div style={{ marginBottom: 20 }}>
        <label>Country: </label>
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          <option>Honduras</option>
          <option>Nicaragua</option>
        </select>
        <label style={{ marginLeft: 20 }}>Fiscal Year: </label>
        <select value={fy} onChange={(e) => setFY(e.target.value)}>
          <option>FY25</option>
          <option>FY26</option>
        </select>
      </div>

      {/* Targets table */}
      <h3>Strategic Targets (Editable) — {country}</h3>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', marginBottom: 20 }}>
        <thead>
          <tr>
            <th>Sector</th>
            <th>Target %</th>
          </tr>
        </thead>
        <tbody>
          {SECTORS.map((s) => (
            <tr key={s}>
              <td>{s}</td>
              <td>
                <input
                  type="number"
                  step="0.1"
                  value={targets[country][s]}
                  onChange={(e) => handleChange(s, e.target.value)}
                  style={{ width: '80px' }}
                /> %
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary of actual allocations */}
      <h3>Actual Allocations ({country}, {fy})</h3>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', marginBottom: 20 }}>
        <thead>
          <tr>
            <th>Sector</th>
            <th>Actual %</th>
            <th>Target %</th>
            <th>Deviation (pp)</th>
          </tr>
        </thead>
        <tbody>
          {SECTORS.map((s) => (
            <tr key={s}>
              <td>{s}</td>
              <td>{shares[s].toFixed(1)}%</td>
              <td>{targets[country][s]}%</td>
              <td>{(shares[s] - targets[country][s]).toFixed(1)} pp</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Project list */}
      <h3>Projects & CNs ({country}, {fy})</h3>
      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Budget</th>
            {SECTORS.map((s) => <th key={s}>{s} %</th>)}
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id}>
              <td>{it.id}</td>
              <td>{it.name}</td>
              <td>{it.id.startsWith('CN') ? 'CN' : 'Project'}</td>
              <td>${it.budget.toLocaleString()}</td>
              {SECTORS.map((s) => <td key={s}>{((it.sectors[s] || 0) * 100).toFixed(0)}%</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
