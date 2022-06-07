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
import TextareaAutosize from '@mui/material/TextareaAutosize';
import {FormLabel} from "@mui/material";
import {Label} from "@material-ui/icons";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";

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

export default function EditSource({token, snackbarHandler}){
    const [editMode, setEditMode] = React.useState(false);
    const navigate = useNavigate();
    const {id = null} = useParams();

    const loadSource = async (sourceId) => {
        const response = await fetch('http://localhost:8090/source/' + sourceId, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if(response?.status === 200) {
            await formik?.setFieldValue('name', data?.source?.name);
            await formik?.setFieldValue('desc', data?.source?.desc);
            await formik?.setFieldValue('accountName', data?.source?.accountName);
            await formik?.setFieldValue('link', data?.source?.link);
            await formik?.setFieldValue('lastCheckedDate', data?.source?.lastCheckedDate);
        }
    }

    useEffect(() => {
        if(id) {
            loadSource(id);
            setEditMode(true);
        }
    }, [])

    const formik = useFormik({
        initialValues: {
            name: '',
            desc: '',
            accountName: '',
            link: '',
            lastCheckedDate: new Date()
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
        }),
        onSubmit: async (values, actions) => {
            const url = editMode ? `http://localhost:8090/source/${id}` : 'http://localhost:8090/source'
            const response = await fetch(url, {
                method: editMode ? 'PUT' : 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: values?.name,
                    desc: values?.desc,
                    accountName: values?.accountName,
                    link: values?.link,
                    lastCheckedDate: values?.lastCheckedDate
                })
            });
            const data = await response.json();
            data?.data?.forEach(({param, msg}) => {
                actions.setFieldError(param, msg);
            });
            if([201, 200].includes(response?.status)) {
                snackbarHandler(true, data?.message, 'success');
                navigate('/sources');
            }
        },
    });

    const changeDateHandler = (e) => {
        formik?.setFieldValue('lastCheckedDate', e)
    }

    return (
        <Container component="main" maxWidth="lg">
            <CssBaseline />
            <Box component="form" onSubmit={formik?.handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            label="Name"
                            name="name"
                            autoComplete="name"
                            onChange={formik?.handleChange}
                            value={formik?.values?.name}
                        />
                        {formik.touched.name && formik.errors.name ? (
                            <div>{formik.errors.name}</div>
                        ) : null}
                    </Grid>
                    <Grid item xs={12}>
                        <FormLabel htmlFor="desc">Description</FormLabel>
                    </Grid>
                    <Grid item xs={12}>
                        <TextareaAutosize
                            style={{ width: 1000, height: 100 }}
                            name="desc"
                            autoComplete="desc"
                            onChange={formik?.handleChange}
                            value={formik?.values?.desc}
                        />
                        {formik.touched.desc && formik.errors.desc ? (
                            <div>{formik.errors.desc}</div>
                        ) : null}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Account name"
                            name="accountName"
                            autoComplete="name"
                            onChange={formik?.handleChange}
                            value={formik?.values?.accountName}
                        />
                        {formik.touched.accountName && formik.errors.accountName ? (
                            <div>{formik.errors.accountName}</div>
                        ) : null}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Account Link"
                            name="link"
                            autoComplete="name"
                            onChange={formik?.handleChange}
                            value={formik?.values?.link}
                        />
                        {formik.touched.link && formik.errors.link ? (
                            <div>{formik.errors.link}</div>
                        ) : null}
                    </Grid>
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                                mask="__.__.____"
                                label="Last checked"
                                inputFormat="dd.MM.yyyy"
                                value={formik?.values?.lastCheckedDate}
                                onChange={(e) => changeDateHandler(e)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
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