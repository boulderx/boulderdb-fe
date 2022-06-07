import * as React from 'react';
import * as Yup from 'yup';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {useFormik} from 'formik';
import { useNavigate } from "react-router-dom";

export default function SignUp({snackbarHandler}) {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: { email: '', password: '', confirmPassword: '' },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().min(5, 'Password is too short').required('Required'),
            confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], "Passwords don't match").required('Confirm Password is required'),
        }),
        onSubmit: async (values, actions) => {
            const response = await fetch('http://localhost:8090/auth/signup', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                    confirmPassword: values.confirmPassword
                })
            });
            const data = await response.json();
            if(data.message === 'User created'){
                navigate("/", { replace: true });
                snackbarHandler(true, 'Successfully signed up!', 'success');
            }
            data?.data?.forEach(({param, msg}) => {
                actions.setFieldError(param, msg);
            });
        },
    });

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                    <Box component="form" onSubmit={formik?.handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    onChange={formik?.handleChange}
                                    value={formik?.values?.email}
                                />
                                {formik.touched.email && formik.errors.email ? (
                                    <div>{formik.errors.email}</div>
                                ) : null}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    autoComplete="new-password"
                                    onChange={formik?.handleChange}
                                    value={formik?.values?.password}
                                />
                                {formik.touched.password && formik.errors.password ? (
                                    <div>{formik.errors.password}</div>
                                ) : null}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                    autoComplete="new-password"
                                    onChange={formik?.handleChange}
                                    value={formik?.values?.confirmPassword}
                                />
                                {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                    <div>{formik.errors.confirmPassword}</div>
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
                            Sign Up
                        </Button>
                    </Box>
            </Box>
        </Container>
    );
}