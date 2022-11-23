import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";

/* React 18 removed the memory leak warning as the issue isn't 
with trying to update state in an unmounted component, 
it's that you have other code running in the background.

So using a ref here and checking for the component is mounted 
or not isn't actually a true cleanup.

There will still be a Firebase event listener running in the 
background, that is the actual memory leak.

Fortunately onAuthStateChanged returns an unsubscribe function 
which removes the event listener, so you can use that as a 
cleanup here... */
const useAuthStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    // FIX: use the unsubscribe returned from onAuthStateChanged for cleanup
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      }
      setCheckingStatus(false);
    });

    return unsubscribe;
  }, []);

  return { isLoggedIn, checkingStatus };
};

export default useAuthStatus;
