import * as React from 'react';
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import PictureUpload from "../../picture/components/PictureUpload";
import Image from './Image';

export default function BoulderDetail({token, snackbarHandler}){
    const [boulder, setBoulder] = useState(null);
    const {id = null} = useParams();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const setBoulderHandler = (boulder) => {
        setBoulder(boulder);
    }

    const loadBoulder = async (boulderId) => {
        const response = await fetch('http://localhost:8090/boulder/' + boulderId, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if(response?.status === 200) {
            setBoulder(data?.boulder);
        }
    }

    useEffect(() => {
        loadBoulder(id)
    }, [])

    return (
        <Container component="main" maxWidth="xl">
            <CssBaseline />
            <Box sx={{ width: 1, marginTop: 5 }}>
                <h1>{boulder?.name}</h1>
                <div>
                    Grade: {boulder?.grade}
                </div>
                <div>
                    First climber: {boulder?.firstClimber}
                </div>
                <div>
                    <Typography>Comments</Typography>
                    <Button>Add new Comment</Button>
                </div>
                <div>
                    <Button variant="outlined" onClick={handleClickOpen}>
                        Add new picture
                    </Button>
                    <Dialog open={open} onClose={handleClose}>
                        <PictureUpload
                            handleClose={handleClose}
                            boulderId={id}
                            token={token}
                            setBoulderHandler={setBoulderHandler}
                            snackbarHandler={snackbarHandler}
                        />
                    </Dialog>
                </div>
                <div>Pictures</div>
                {boulder?.imageUrls?.map((imageUrl, idx) => {
                    return (
                        <div key={'boulderImage-' + idx}>
                            <Image imageUrl={imageUrl}/>
                        </div>
                    )
                })}
            </Box>
        </Container>
    )
}