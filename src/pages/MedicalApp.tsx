import React, { useContext, useEffect } from "react";
import UnauthenticatedNavigation from "../navigation/UnauthenticatedNavigation";
import { AuthContext } from "../context/AuthContext";
import AuthenticatedNavigation from "../navigation/AuthenticatedNavigation";
import { CallProvider } from "../context/CallContext";
import { NewCallProvider } from "../context/NewCallContext";

const MedicalApp = (): any => {
  const { isLogin, login, logout } = useContext(AuthContext);
  useEffect(() => {
    console.log('isLogin', isLogin)
    const sessionInfo = localStorage.getItem("userData");
    console.log('sessionINfo', sessionInfo)
    if (typeof sessionInfo !== "undefined" && sessionInfo !== null) {
      login(JSON.parse(sessionInfo));
    } else {
      logout()
      localStorage.clear();
    }
  }, []);

  if (!isLogin) return <UnauthenticatedNavigation />;
  if (isLogin) return (
    <CallProvider>
      <NewCallProvider>
        <AuthenticatedNavigation />
      </NewCallProvider>
    </CallProvider>
  )
};

export default MedicalApp;
