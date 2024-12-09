import React, { useState, useEffect } from "react";
import WorkerHoursForm from "./WorkerHoursForm";
import Summary from "./Summary";
import { db } from "./firebase";
import { deleteDoc } from "firebase/firestore";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import PincodeAuth from "./PincodeAuth"; // Import the PincodeAuth component
import "./App.css";

function App() {
  const [workers, setWorkers] = useState([]);
  const [days, setDays] = useState(getDaysInMonth());
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Firestore collection reference
  const workersCollection = collection(db, "workers");

  // Generate days for the current month
  function getDaysInMonth() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth(); // Current month (0-indexed)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = new Date(year, month, i + 1);
      return day.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
      });
    });
  }

  // Load workers from Firestore on mount
  useEffect(() => {
    const fetchWorkers = async () => {
      const data = await getDocs(workersCollection);
      const workersData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setWorkers(workersData);
    };
    fetchWorkers();
  }, []);

  // Add a new worker
  const addWorker = async (name) => {
    const newWorker = { name, hours: Array(days.length).fill(0) };
    const docRef = await addDoc(workersCollection, newWorker);
    setWorkers([...workers, { ...newWorker, id: docRef.id }]);
  };

  // Update worker hours
  const updateHours = async (workerIndex, dayIndex, value) => {
    const updatedWorkers = [...workers];
    updatedWorkers[workerIndex].hours[dayIndex] = value;

    // Update in Firestore
    const workerId = updatedWorkers[workerIndex].id;
    const workerDoc = doc(db, "workers", workerId);
    await updateDoc(workerDoc, { hours: updatedWorkers[workerIndex].hours });

    setWorkers(updatedWorkers);
  };

  // Check if the user is authenticated from localStorage
  useEffect(() => {
    const storedAuthentication = localStorage.getItem("isAuthenticated");
    if (storedAuthentication === "true") {
      setIsAuthenticated(true); // Set the state to authenticated if stored in localStorage
    }
  }, []);

  // Handle successful authentication
  const handleAuthentication = (status) => {
    setIsAuthenticated(status);

    // If authenticated, store this in localStorage
    if (status) {
      localStorage.setItem("isAuthenticated", "true");
    }
  };

  // Reset all workers' hours to zero
  const resetHours = async () => {
    try {
      // Create an array of promises to reset all worker hours in Firestore
      const resetPromises = workers.map((worker) => {
        const updatedWorker = { ...worker, hours: Array(days.length).fill(0) };
        const workerDoc = doc(db, "workers", worker.id);
        return updateDoc(workerDoc, { hours: updatedWorker.hours });
      });

      // Wait for all update operations to finish
      await Promise.all(resetPromises);

      // Update the local state with reset hours
      const updatedWorkers = workers.map((worker) => ({
        ...worker,
        hours: Array(days.length).fill(0),
      }));

      setWorkers(updatedWorkers);
    } catch (error) {
      console.error("Error resetting hours:", error);
    }
  };

  // If not authenticated, show pincode authentication
  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="pincode-container">
          <PincodeAuth onAuthenticated={handleAuthentication} />
        </div>
      </div>
    );
  }

  // Main app content after authentication
  return (
    <div className="container">
      <div className="tracker-container">
        <img src="/kaiyo-logo.png" alt="Kaiyo Logo" className="logo" />
        <WorkerHoursForm
          workers={workers}
          days={days}
          onAddWorker={addWorker}
          onUpdateHours={updateHours}
          onResetHours={resetHours}
        />
        <div className="summary-container">
          <Summary workers={workers} days={days} />
        </div>
      </div>
    </div>
  );
}

export default App;
