import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {useNavigate} from "react-router-dom";

export default function Navigation({isAuth, logoutHandler}) {
    const navigate = useNavigate();

    function changeNavHandler(path) {
        navigate(path);
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Boulder DB
                    </Typography>
                    {isAuth ? (
                        <>
                            <Button color="inherit" onClick={() => changeNavHandler('/')}>Boulders</Button>
                            <Button color="inherit" onClick={() => changeNavHandler('/climbers')}>Climbers</Button>
                            <Button color="inherit" onClick={() => changeNavHandler('/grades')}>Grades</Button>
                            <Button color="inherit" onClick={() => changeNavHandler('/videos')}>Videos</Button>
                            <Button color="inherit" onClick={() => changeNavHandler('/areas')}>Areas</Button>
                            <Button color="inherit" onClick={() => changeNavHandler('/sources')}>Sources</Button>
                            <Button color="inherit" onClick={logoutHandler}>Logout</Button>
                        </>
                        ) : (
                        <>
                            <Button color="inherit" onClick={() => changeNavHandler('/signup')}>Signup</Button>
                            <Button color="inherit" onClick={() => changeNavHandler('/')}>Login</Button>
                        </>
                    )}

                </Toolbar>
            </AppBar>
        </Box>
    );
}