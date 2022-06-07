import * as React from 'react';
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import {useFormik} from "formik";
import * as Yup from "yup";

export default function Login({snackbarHandler, authHandler}) {

    const formik = useFormik({
        initialValues: { email: '', password: ''},
        validationSchema: Yup.object({
            email: Yup.string().required('Required'),
            password: Yup.string().required('Required'),
        }),
        onSubmit: async (values, actions) => {
            const url = new URL('login', process.env.REACT_APP_APP_URL);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password
                })
            });
            const data = await response.json();
            if(data?.message === 'Wrong password') {
                actions.setFieldError('password', data?.message);
            }
            data?.data?.forEach(({param, msg}) => {
                actions.setFieldError(param, msg);
            });
            if(data?.token && data?.userId){
                snackbarHandler(true, 'Successfully logged in!', 'success');
                authHandler(data?.token, data?.userId);
            }
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
                    Login
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
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={formik?.isSubmitting}
                    >
                        Login
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}