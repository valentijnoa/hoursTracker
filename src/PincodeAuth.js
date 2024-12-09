// PincodeAuth.js
import React, { useState, useEffect } from "react";
import { db } from "./firebase"; // Firebase configuration
import { doc, getDoc } from "firebase/firestore";

function PincodeAuth({ onAuthenticated }) {
  const [pincode, setPincode] = useState("");
  const [correctPincode, setCorrectPincode] = useState(null);

  // Fetch the pincode from Firestore
  useEffect(() => {
    async function fetchPincode() {
      const docRef = doc(db, "settings", "pincode"); // Firestore document for pincode
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCorrectPincode(docSnap.data().code); // Set the correct pincode from Firestore
      } else {
        console.error("Pincode document does not exist!");
      }
    }

    fetchPincode();
  }, []);

  // Handle login (pincode verification)
  const handleLogin = () => {
    if (pincode === correctPincode) {
      onAuthenticated(true); // Call the parent function to notify authentication success
    } else {
      alert("Invalid pincode! Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Enter Pincode</h1>
      <input
        type="password"
        value={pincode}
        onChange={(e) => setPincode(e.target.value)}
        placeholder="Enter pincode"
      />
      <button onClick={handleLogin}>Submit</button>
    </div>
  );
}

export default PincodeAuth;
