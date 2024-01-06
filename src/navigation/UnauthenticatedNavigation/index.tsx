import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import LoginPage from '../../pages/Auth/LoginPage';
import InfoPage from '../../pages/AllUsers/InfoPage';
import RegisterPage from '../../pages/Auth/RegisterPage';
import ForgotPassword from '../../pages/Auth/ForgotPassword';
import NewPassword from '../../pages/Auth/NewPassword';
import { useEffect } from 'react';

const UnauthenticatedNavigation = () => {
  const navigate = useNavigate()
  const location: any = useLocation()

  useEffect(() => {
    console.log('location', location)
    if (location.pathname === "/login" || location.pathname === "/register") {
      console.log("es login")
    } else {
      console.log('entra...')
      // navigate("/")
    }
    // 

  }, [])


  return (
    <Routes>
      <Route path="/" element={<InfoPage />} />
      <Route path="*" element={<Navigate replace to="/" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forget-password" element={<ForgotPassword />} />
      <Route path="/forget-password/:token" element={<NewPassword />} />
    </Routes>
  )
}

export default UnauthenticatedNavigation;