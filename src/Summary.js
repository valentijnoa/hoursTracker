import React from "react";

function Summary({ workers, days }) {
  return (
    <div className="summary">
      <h2>Totaal Aantal Uren</h2>
      {workers.map((worker, workerIndex) => (
        <div className="summary-workers" key={workerIndex}>
          <h3>{worker.name}</h3>
          <p>
            uren:{" "}
            {worker.hours.reduce((sum, hour) => sum + (Number(hour) || 0), 0)}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Summary;
