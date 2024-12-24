import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase"; // Import your Firebase auth instance

function WorkerHoursForm({
  workers,
  days,
  onAddWorker,
  onUpdateHours,
  onResetHours,
}) {
  const [newWorker, setNewWorker] = useState("");
  const [userEmail, setUserEmail] = useState(null);

  // Check the authenticated user's email
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email); // Get the logged-in user's email
      } else {
        setUserEmail(null); // No user is logged in
      }
    });

    return () => unsubscribe(); // Clean up the subscription
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

      {/* Only show the Reset button if the user email matches */}
      {userEmail === "kaiyo@email.com" && (
        <button onClick={onResetHours}>Reset Alle Uren</button>
      )}

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
                    value={
                      worker.hours[dayIndex] === 0 ? "" : worker.hours[dayIndex]
                    } // Show "" if the value is 0
                    onChange={(e) =>
                      onUpdateHours(
                        workerIndex,
                        dayIndex,
                        e.target.value === "" ? 0 : parseFloat(e.target.value) // Treat "" as 0 internally
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
