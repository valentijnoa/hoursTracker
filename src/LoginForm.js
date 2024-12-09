import React, { useState, useEffect } from "react";
import firebase from "./firebase"; // Import the firebase instance
import LoginForm from "./LoginForm"; // Import the login form
import WorkerHoursForm from "./WorkerHoursForm"; // Import your app content (like worker form)

function App() {
  const [user, setUser] = useState(null); // Store user state

  // Listen for changes in authentication state
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user); // User is logged in
      } else {
        setUser(null); // No user, need to login
      }
    });
    return () => unsubscribe();
  }, []);

  // Handle login success
  const handleLoginSuccess = () => {
    // You can redirect or just update the UI after login
    setUser(firebase.auth().currentUser);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      setUser(null); // Clear the user state
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <div>
      {/* Show login form if no user is logged in */}
      {!user ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div>
          <h2>Welcome, {user.email}!</h2>
          <button onClick={handleLogout}>Logout</button>
          <WorkerHoursForm /> {/* Your main content goes here */}
        </div>
      )}
    </div>
  );
}

export default App;
