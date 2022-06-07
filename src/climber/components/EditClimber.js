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

export default function EditClimber({token, snackbarHandler}){
    const [accountType, setAccountType] = React.useState('');
    const [editMode, setEditMode] = React.useState(false);
    const navigate = useNavigate();
    const {id = null} = useParams();

    const loadClimber = async (climberId) => {
        const response = await fetch('http://localhost:8090/climber/' + climberId, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if(response?.status === 200) {
            await formik?.setFieldValue('firstName', data?.climber?.firstName);
            await formik?.setFieldValue('lastName', data?.climber?.lastName);
            await formik?.setFieldValue('accounts', data?.climber?.media);
        }
    }

    useEffect(() => {
        if(id) {
            loadClimber(id);
            setEditMode(true);
        }
    }, [])

    const handleAccountChange = (event) => {
        setAccountType(event.target.value);
    };

    const addLineHandler = () => {
        const accounts = formik?.values?.accounts;
        const newAccounts = [...accounts];
        const sequence = accounts?.length;
        newAccounts.push({
            sequence: sequence,
            type: accountType
        })
        formik?.setFieldValue('accounts', newAccounts);
    }

    const changeAccountNameHandler = (sequence, event, field) => {
        const account = formik?.values?.accounts?.find(account => account?.sequence === sequence);
        const newAccount = {...account};
        const accountIdx = formik?.values?.accounts?.findIndex(account => account?.sequence === sequence);
        newAccount[field] = event.target.value;
        const accounts = formik?.values?.accounts;
        let updatedAccounts = [...accounts];
        updatedAccounts?.splice(accountIdx, 1, newAccount);
        formik?.setFieldValue('accounts', updatedAccounts);
    }

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            accounts: [],
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('Required'),
            lastName: Yup.string().required('Required'),
            accounts: Yup.array()
                .of(
                    Yup.object().shape({
                        sequence: Yup.number().required('Required'),
                        type: Yup.string().required('Required'),
                        name: Yup.string(),
                        link: Yup.string()
                    })
                )
        }),
        onSubmit: async (values, actions) => {
            const url = editMode ? `http://localhost:8090/climber/${id}` : 'http://localhost:8090/climber'
            const response = await fetch(url, {
                method: editMode ? 'PUT' : 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: values?.firstName,
                    lastName: values?.lastName,
                    media: values?.accounts
                })
            });
            const data = await response.json();
            data?.data?.forEach(({param, msg}) => {
                actions.setFieldError(param, msg);
            });
            if([201, 200].includes(response?.status)) {
                snackbarHandler(true, data?.message, 'success');
                navigate('/climbers');
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
                            label="First name"
                            name="firstName"
                            autoComplete="firstName"
                            onChange={formik?.handleChange}
                            value={formik?.values?.firstName}
                        />
                        {formik.touched.firstName && formik.errors.firstName ? (
                            <div>{formik.errors.firstName}</div>
                        ) : null}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            label="Last name"
                            name="lastName"
                            autoComplete="lastName"
                            onChange={formik?.handleChange}
                            value={formik?.values?.lastName}
                        />
                        {formik.touched.lastName && formik.errors.lastName ? (
                            <div>{formik.errors.lastName}</div>
                        ) : null}
                    </Grid>
                    <Grid item xs={8}>
                        <InputLabel id="accountSelect">Select Account type</InputLabel>
                        <Select
                            labelId="accountSelect"
                            id="accountSelectId"
                            value={accountType}
                            label="Account Type"
                            onChange={handleAccountChange}
                        >
                            <MenuItem value={'instagram'}>Instagram</MenuItem>
                            <MenuItem value={'facebook'}>Facebook</MenuItem>
                            <MenuItem value={'youtube'}>Youtube</MenuItem>
                            <MenuItem value={'vimeo'}>Vimeo</MenuItem>
                            <MenuItem value={'twitter'}>Twitter</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={4}>
                        <Button variant="outlined" disabled={accountType === ''} onClick={addLineHandler}>
                            Add new account
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel id="accounts">Mapped Accounts</InputLabel>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 700 }} id="accounts" aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Type</StyledTableCell>
                                        <StyledTableCell>Name</StyledTableCell>
                                        <StyledTableCell>Link</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {formik?.values?.accounts.map((account) => (
                                        <StyledTableRow key={account.sequence}>
                                            <StyledTableCell>{account?.type}</StyledTableCell>
                                            <StyledTableCell>
                                                <TextField
                                                    name="accountName"
                                                    autoComplete="accountName"
                                                    onChange={(e) => changeAccountNameHandler(account?.sequence, e, 'name')}
                                                    value={account?.name || ''}
                                                />
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <TextField
                                                    name="accountLink"
                                                    autoComplete="accountLink"
                                                    onChange={(e) => changeAccountNameHandler(account?.sequence, e, 'link')}
                                                    value={account?.link || ''}
                                                />
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
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