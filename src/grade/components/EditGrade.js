import * as React from 'react';
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {useFormik} from "formik";
import * as Yup from "yup";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";

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

export default function EditGrade({token, snackbarHandler}){
    const [editMode, setEditMode] = React.useState(false);
    const navigate = useNavigate();
    const {id = null} = useParams();

    const loadGrade = async (gradeId) => {
        const response = await fetch('http://localhost:8090/grade/' + gradeId, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if(response?.status === 200) {
            await formik?.setFieldValue('fbGrade', data?.grade?.fbGrade);
            await formik?.setFieldValue('vGrade', data?.grade?.vGrade);
        }
    }

    useEffect(() => {
        if(id) {
            loadGrade(id);
            setEditMode(true);
        }
    }, [])

    const formik = useFormik({
        initialValues: {
            fbGrade: '',
            vGrade: '',
        },
        validationSchema: Yup.object({
            fbGrade: Yup.string().required('Required'),
            vGrade: Yup.string().required('Required'),
        }),
        onSubmit: async (values, actions) => {
            const url = editMode ? `http://localhost:8090/grade/${id}` : 'http://localhost:8090/grade'
            const response = await fetch(url, {
                method: editMode ? 'PUT' : 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fbGrade: values?.fbGrade,
                    vGrade: values?.vGrade
                })
            });
            const data = await response.json();
            data?.data?.forEach(({param, msg}) => {
                actions.setFieldError(param, msg);
            });
            if([201, 200].includes(response?.status)) {
                snackbarHandler(true, data?.message, 'success');
                navigate('/grades');
            }
        },
    });

    return (
        <Container component="main" maxWidth="lg">
            <CssBaseline />
            <Box component="form" onSubmit={formik?.handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            label="Fb Grade"
                            name="fbGrade"
                            autoComplete="fbGrade"
                            onChange={formik?.handleChange}
                            value={formik?.values?.fbGrade}
                        />
                        {formik.touched.fbGrade && formik.errors.fbGrade ? (
                            <div>{formik.errors.fbGrade}</div>
                        ) : null}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            label="V Grade"
                            name="vGrade"
                            autoComplete="vGrade"
                            onChange={formik?.handleChange}
                            value={formik?.values?.vGrade}
                        />
                        {formik.touched.vGrade && formik.errors.vGrade ? (
                            <div>{formik.errors.vGrade}</div>
                        ) : null}
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={formik?.isSubmitting}
                >
                    {editMode ? 'Update' : 'Create new'}
                </Button>
            </Box>
        </Container>
    )
}