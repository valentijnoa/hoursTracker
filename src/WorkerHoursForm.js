import React, { useState, useEffect } from "react";

function WorkerHoursForm({
  workers,
  days,
  onAddWorker,
  onUpdateHours,
  onResetHours,
}) {
  const [newWorker, setNewWorker] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

      {/* Render Table for Desktop */}
      {!isMobile ? (
        <table className="workerTable">
          <thead>
            <tr>
              <th>Datum</th>
              {days.map((day, dayIndex) => (
                <th key={dayIndex}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {workers.map((worker, workerIndex) => (
              <tr key={workerIndex}>
                <td>{worker.name}</td>
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
      ) : (
        // Render Dropdown for Mobile
        <div className="mobile-worker-list">
          {workers.map((worker, workerIndex) => (
            <details key={workerIndex} className="worker-dropdown">
              <summary>{worker.name}</summary>
              <div className="worker-hours">
                {days.map((day, dayIndex) => (
                  <div key={dayIndex} className="worker-hour-entry">
                    <label htmlFor={`worker-${workerIndex}-day-${dayIndex}`}>
                      {day}
                    </label>
                    <input
                      type="number"
                      id={`worker-${workerIndex}-day-${dayIndex}`}
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
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}

export default WorkerHoursForm;
