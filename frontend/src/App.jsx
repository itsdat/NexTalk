import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import { Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import SettingPage from './pages/SettingsPage';
import { useAuthSrore } from './store/useAuthStore';
import {Loader} from "lucide-react"
import {Toaster} from "react-hot-toast"
import { useThemeStore } from './store/useThemeStore';

const App = () => {
    const {authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthSrore()
    const {theme} = useThemeStore()

    useEffect(() => {
        checkAuth()
    }, [checkAuth])
    console.log({authUser});

    if(isCheckingAuth && !authUser) return (
        <div className='flex items-center justify-center h-screen'>
            <Loader className="size-10 animate-spin"></Loader>
        </div>
    )

    return (
        <div data-theme={theme}>
        {/* <div> */}
            <Navbar />
            <Routes>
                <Route path="/" element={authUser ? <HomePage />: <Navigate to={"/login"} />} />
                <Route path="/signup" element={!authUser ? <SignUpPage />: <Navigate to={"/"} />} />
                <Route path="/login" element={!authUser ? <LoginPage />: <Navigate to={"/"} />} />
                <Route path="/setting" element={<SettingPage />} />
                <Route path="/profile" element={authUser ? <ProfilePage />: <Navigate to={"/login"} />} />
            </Routes>
            <Toaster />
        </div>
    );
};

export default App;