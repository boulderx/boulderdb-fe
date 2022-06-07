import * as React from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css';
import Navigation from "./navigation/components/Navigation";
import SignUp from "./login/components/Signup";
import Login from "./login/components/Login";
import {useCallback, useEffect, useState} from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from '@mui/material/Alert';
import ClimbersOverview from "./climber/components/ClimbersOverview";
import EditClimber from "./climber/components/EditClimber";
import BoulderOverview from './boulder/components/BoulderOverview';
import GradeOverview from "./grade/components/GradeOverview";
import EditGrade from "./grade/components/EditGrade";
import AreaOverview from "./area/components/AreaOverview";
import EditArea from "./area/components/EditArea";
import EditBoulder from "./boulder/components/EditBoulder";
import BoulderDetail from "./boulder/components/BoulderDetail";
import VideoUpload from "./video/components/VideoUpload";
import VideoOverview from "./video/components/VideoOverview";
import SourceOverview from "./source/components/SourceOverview";
import EditSource from "./source/components/EditSource";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        vertical: 'top',
        horizontal: 'center',
        type: 'success'
    });
    const [isAuth, setIsAuth] = useState(false);
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);

    const logoutHandler = () => {
        setIsAuth(false);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('expiryDate');
        localStorage.removeItem('userId');
    }

    const setAutoLogout = milliseconds => {
        setTimeout(() => {
            logoutHandler();
        }, milliseconds);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const expiryDate = localStorage.getItem('expiryDate');
        if (!token || !expiryDate) {
            return;
        }
        if (new Date(expiryDate) <= new Date()) {
            logoutHandler();
            return;
        }
        const userId = localStorage.getItem('userId');
        const remainingMilliseconds =
            new Date(expiryDate).getTime() - new Date().getTime();
        setIsAuth(true);
        setToken(token);
        setUserId(userId);
        setAutoLogout(remainingMilliseconds);
    }, [])

    const snackbarHandler = (open, message, type) => {
        setSnackbar({
            ...snackbar,
            open: open,
            message: message,
            type: type
        })
    };

    const handleClose = () => {
        setSnackbar({
            ...snackbar,
            open: false,
            message: ''
        });
    };

    const authHandler = useCallback((token, userId) => {
        setIsAuth(true);
        setToken(token);
        setUserId(userId);
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
            new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem('expiryDate', expiryDate.toISOString());
        setAutoLogout(remainingMilliseconds);
    }, [setIsAuth]);

    let routes = (
        <Routes>
            <Route path='/' element={<Login snackbarHandler={snackbarHandler} authHandler={authHandler}/>} />
            <Route path='/signup' element={<SignUp snackbarHandler={snackbarHandler}/>} />
        </Routes>
    );
    if(isAuth && token) {
        routes = (
            <Routes>
                <Route path='/' element={<BoulderOverview token={token}/>} />
                <Route path='/boulders/new' element={<EditBoulder token={token} snackbarHandler={snackbarHandler}/>} />
                <Route path='/boulders/details/:id' element={<BoulderDetail token={token} snackbarHandler={snackbarHandler}/>} />
                <Route path='/boulders/:id' element={<EditBoulder token={token} snackbarHandler={snackbarHandler}/>} />

                <Route path='/climbers' element={<ClimbersOverview token={token}/>} />
                <Route path='/climbers/new' element={<EditClimber token={token} snackbarHandler={snackbarHandler}/>} />
                <Route path='/climbers/:id' element={<EditClimber token={token} snackbarHandler={snackbarHandler}/>} />

                <Route path='/grades' element={<GradeOverview token={token} snackbarHandler={snackbarHandler}/>} />
                <Route path='/grades/new' element={<EditGrade token={token} snackbarHandler={snackbarHandler}/>} />
                <Route path='/grades/:id' element={<EditGrade token={token} snackbarHandler={snackbarHandler}/>} />

                <Route path='/areas' element={<AreaOverview token={token} snackbarHandler={snackbarHandler}/>} />
                <Route path='/areas/new' element={<EditArea token={token} snackbarHandler={snackbarHandler}/>} />
                <Route path='/areas/:id' element={<EditArea token={token} snackbarHandler={snackbarHandler}/>} />

                <Route path='/sources' element={<SourceOverview token={token} snackbarHandler={snackbarHandler}/>} />
                <Route path='/sources/new' element={<EditSource token={token} snackbarHandler={snackbarHandler}/>} />
                <Route path='/sources/:id' element={<EditSource token={token} snackbarHandler={snackbarHandler}/>} />

                <Route path='/videos' element={<VideoOverview token={token} snackbarHandler={snackbarHandler}/>} />
                <Route path='/videos/new' element={<VideoUpload token={token} snackbarHandler={snackbarHandler}/>} />
                <Route path='/videos/:id' element={<VideoUpload token={token} snackbarHandler={snackbarHandler}/>} />
            </Routes>
        )
    }
    return (
        <div className="App">
            <Navigation isAuth={isAuth} logoutHandler={logoutHandler}/>
            {routes}
            <Snackbar
                anchorOrigin={{
                    vertical: snackbar?.vertical,
                    horizontal: snackbar?.horizontal,
                }}
                open={snackbar?.open}
                onClose={handleClose}
                key={'snackbar'}
                autoHideDuration={6000}
            >
                <Alert severity="success">{snackbar?.message}</Alert>
            </Snackbar>
        </div>
  );
}

export default App;
