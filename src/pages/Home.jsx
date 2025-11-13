import useAuth from "../firebaseServices/auth/useAuth";
import { useState, useEffect } from "react";

import { getUserByUid } from "../firebaseServices/database/usersFunctions";

function Home() {
  const { user, idToken, accessToken, loading, error, signInWithGoogle, signOut } = useAuth();

  

  return (
    <div>
      <h1>Welcome, {user.displayName}</h1>

      <button onClick={signOut}>Sign Out</button>
      


    </div>
  )
}

export default Home;