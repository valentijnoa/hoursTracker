import React, { useState } from "react";

function WorkerHoursForm({
  workers,
  days,
  onAddWorker,
  onUpdateHours,
  onResetHours,
}) {
  const [newWorker, setNewWorker] = useState("");

  const handleAddWorker = () => {
    if (newWorker.trim()) {
      onAddWorker(newWorker.trim());
      setNewWorker("");
    }
  };

  return (
    <div className="worker-row">
      <h2>Werknemers</h2>
      <input
        className="inputName"
        type="text"
        placeholder="Naam"
        value={newWorker}
        onChange={(e) => setNewWorker(e.target.value)}
      />
      <button onClick={handleAddWorker}>Werknemer Toevoegen</button>

      <button onClick={onResetHours}>Reset Alle Uren</button>

      <table className="workerTable">
        <thead>
          <tr>
            <th>Datum</th>
            {days.map((day, dayIndex) => (
              <th key={dayIndex}>{day}</th> // Dates at the top, only once
            ))}
          </tr>
        </thead>
        <tbody>
          {workers.map((worker, workerIndex) => (
            <tr key={workerIndex}>
              <td>{worker.name}</td> {/* Worker name in the first column */}
              {days.map((_, dayIndex) => (
                <td key={dayIndex}>
                  <input
                    type="number"
                    value={worker.hours[dayIndex]}
                    onChange={(e) =>
                      onUpdateHours(
                        workerIndex,
                        dayIndex,
                        parseFloat(e.target.value) || 0
                      )
                    }
                    min="0"
                    max="24"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WorkerHoursForm;
