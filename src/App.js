import React, { useState, useEffect } from "react";
import WorkerHoursForm from "./WorkerHoursForm";
import Summary from "./Summary";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth"; // Import auth functions
import "./App.css";

function App() {
  const [workers, setWorkers] = useState([]);
  const [days, setDays] = useState(getDaysInMonth());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState(""); // Manage email input
  const [password, setPassword] = useState(""); // Manage password input
  const [error, setError] = useState(""); // Handle errors

  const auth = getAuth(); // Get the auth instance

  // Firestore collection reference
  const workersCollection = collection(db, "workers");

  // Generate days for the current month
  function getDaysInMonth() {
    return Array.from({ length: 31 }, (_, i) =>
      (i + 1).toString().padStart(2, "0")
    );
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
    const newWorker = { name, hours: Array(days.length).fill("") };
    const docRef = await addDoc(workersCollection, newWorker);
    setWorkers([...workers, { ...newWorker, id: docRef.id }]);
  };

  // Update worker hours
  const updateHours = async (workerIndex, dayIndex, value) => {
    // Prevent empty input
    if (value === "") {
      value = "0"; // Revert to default value
    }

    // Validate input to ensure only numbers are accepted
    if (!isNaN(value) && Number(value) >= 0) {
      const updatedWorkers = [...workers];
      updatedWorkers[workerIndex].hours[dayIndex] = value;

      // Update in Firestore
      const workerId = updatedWorkers[workerIndex].id;
      const workerDoc = doc(db, "workers", workerId);
      await updateDoc(workerDoc, { hours: updatedWorkers[workerIndex].hours });

      setWorkers(updatedWorkers);
    }
  };

  // Handle authentication state change
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
    return unsubscribe;
  }, [auth]);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset errors
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful");
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message); // Display error message
    }
  };

  // // Handle logout
  // const handleLogout = async () => {
  //   try {
  //     await signOut(auth);
  //   } catch (err) {
  //     console.error("Error during logout:", err);
  //   }
  // };

  // Reset all workers' hours to zero
  const resetHours = async () => {
    try {
      const resetPromises = workers.map((worker) => {
        const updatedWorker = { ...worker, hours: Array(days.length).fill("") };
        const workerDoc = doc(db, "workers", worker.id);
        return updateDoc(workerDoc, { hours: updatedWorker.hours });
      });
      await Promise.all(resetPromises);

      const updatedWorkers = workers.map((worker) => ({
        ...worker,
        hours: Array(days.length).fill(""),
      }));

      setWorkers(updatedWorkers);
    } catch (error) {
      console.error("Error resetting hours:", error);
    }
  };

  // Main app content after authentication
  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="tracker-container">
        <img src="kaiyo-logo.png" alt="Kaiyo Logo" className="logo" />
        {/* <button onClick={handleLogout}>Logout</button> */}
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
