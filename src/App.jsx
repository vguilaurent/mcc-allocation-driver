import React, { useState } from 'react';

const SECTORS = [
  'Education',
  'Food Security & Livelihoods',
  'Health',
  'Humanitarian Assistance',
  'Peacebuilding',
];

const DEFAULTS = {
  Honduras: { Education: 2, 'Food Security & Livelihoods': 22.4, Health: 0, 'Humanitarian Assistance': 18.1, Peacebuilding: 55.2 },
  Nicaragua: { Education: 14.9, 'Food Security & Livelihoods': 35.3, Health: 20.3, 'Humanitarian Assistance': 9, Peacebuilding: 20.4 },
};

export default function App() {
  const [targets, setTargets] = useState(DEFAULTS);
  const [country, setCountry] = useState('Honduras');

  const handleChange = (sector, value) => {
    setTargets({
      ...targets,
      [country]: { ...targets[country], [sector]: parseFloat(value) || 0 },
    });
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2>MCC Allocation Driver (Skeleton)</h2>
      <div style={{ marginBottom: 20 }}>
        <label>Select Country: </label>
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          <option>Honduras</option>
          <option>Nicaragua</option>
        </select>
      </div>

      <h3>Strategic Targets (Editable) — {country}</h3>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
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

      <p style={{ marginTop: 20, fontSize: '0.9em', color: '#555' }}>
        You can edit the sector targets directly above. These values are stored locally for now (refresh will reset them).
        Next step: we’ll add a project/CN input table and calculate allocations dynamically.
      </p>
    </div>
  );
}
