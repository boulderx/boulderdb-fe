import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function SourceOverview({token}){
    const [sources, setSources] = useState(null);
    const navigate = useNavigate();

    const loadSources = async () => {
        const response = await fetch('http://localhost:8090/sources', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if(response?.status === 200) {
            setSources(data?.sources);
        }
    }

    useEffect(() => {
        loadSources();
    }, [])

    function changeNavHandler(path) {
        navigate(path);
    }

    return (
        <Container component="main" maxWidth="xl">
            <CssBaseline />
            <Box sx={{ width: 1, marginTop: 5 }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Name</StyledTableCell>
                                <StyledTableCell>Description</StyledTableCell>
                                <StyledTableCell align="right">
                                    <Button
                                        type="button"
                                        variant="contained"
                                        onClick={() => changeNavHandler('/sources/new')}
                                    >
                                        Create New
                                    </Button>
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sources ? (sources.map((source) => (
                                <StyledTableRow key={source._id}>
                                    <StyledTableCell>
                                        {source.name}
                                    </StyledTableCell>
                                    <StyledTableCell>{source.desc}</StyledTableCell>
                                    <StyledTableCell align="right">
                                        <IconButton onClick={() => changeNavHandler(`/sources/${source._id}`)}>
                                            <EditIcon />
                                        </IconButton>
                                        {/*<IconButton>
                                            <DeleteIcon />
                                        </IconButton>*/}
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))) : null}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );

}