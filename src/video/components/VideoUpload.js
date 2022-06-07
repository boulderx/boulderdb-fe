import * as React from 'react';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {useFormik} from "formik";
import * as Yup from "yup";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import {FormLabel} from "@mui/material";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Autocomplete from '@mui/material/Autocomplete';

export default function VideoUpload({token, snackbarHandler}){
    const [editMode, setEditMode] = React.useState(false);
    const [options, setOptions] = useState([]);
    const navigate = useNavigate();
    const {id = null} = useParams();

    const loadVideo = async (videoId) => {
        let url = new URL('video', process.env.REACT_APP_APP_URL);
        url = new URL(videoId, url);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if(response?.status === 200) {
            await formik?.setFieldValue('name', data?.video?.name);
            await formik?.setFieldValue('desc', data?.video?.desc);
            await formik?.setFieldValue('boulders', data?.video?.boulders?.map(({_id, name}) => ({title: name, value: _id})))
        }
    }

    const loadBoulders = async () => {
        const url = new URL('boulders', process.env.REACT_APP_APP_URL);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if(response?.status === 200) {
            setOptions(data?.boulders?.map(({_id, name}) => ({title: name, value: _id})))
        }
    }

    useEffect(() => {
        loadBoulders();
        if(id) {
            loadVideo(id);
            setEditMode(true);
        }
    }, [])

    let validationSchema = Yup.object().shape({
        file: Yup.mixed().required(),
        name: Yup.string().required()
    });

    if(editMode) {
        validationSchema = Yup.object().shape({
            name: Yup.string().required()
        });
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            desc: '',
            file: null,
            boulders: []
        },
        validationSchema: validationSchema,
        onSubmit: async (values, actions) => {
            const formData = new FormData();
            let url = process.env.REACT_APP_APP_URL;
            if(!editMode) {
                formData.append('image', values?.file);
                url = new URL('videoUpload', url);
            } else {
                url = new URL('video', url)
                url = new URL(id, url);
            }
            const boulders = values?.boulders?.map(({value}) => value);
            formData.append('boulders', boulders);
            formData.append('name', values?.name);
            formData.append('desc', values?.desc);
            const response = await fetch(url, {
                method: editMode ? 'PUT': 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                body: formData,
            });
            const data = await response.json();
            if([200, 201].includes(response?.status)) {
                snackbarHandler(true, data?.message, 'success');
                navigate('/videos');
            }
        },
    });

    function handleChange(values){
        formik?.setFieldValue('boulders', values)
    }

    return (
        <Container component="main" maxWidth="xl">
            <CssBaseline />
            <Box sx={{ width: 1, marginTop: 5 }}>
                <form id="pictureUploadForm" onSubmit={formik?.handleSubmit}>
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
                        <Autocomplete
                            multiple
                            id="boulders"
                            name="boulders"
                            options={options}
                            getOptionLabel={(option) => option.title}
                            defaultValue={[]}
                            onChange = {(event, value) => handleChange(value)}
                            value={ formik?.values?.boulders }
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Boulders in the video"
                                    onChange={ handleChange }
                                />
                            )}
                            sx={{ width: '500px' }}
                        />
                    </Grid>
                </Grid>
                    {!editMode && (
                        <>
                            <Grid item xs={12}>
                                <FormLabel htmlFor="desc">Upload Video</FormLabel>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                autoFocus
                                margin="dense"
                                id="file"
                                label="File"
                                fullWidth
                                variant="standard"
                                type={'file'}
                                onChange={(event) => {
                                    formik?.setFieldValue("file", event.currentTarget.files[0]);
                                }}
                                />
                            </Grid>
                        </>
                    )}
                <Button type="submit" disabled={formik?.isSubmitting} form="pictureUploadForm">
                    {editMode ? 'Update' : 'Upload'}
                </Button>
                </form>
            </Box>
        </Container>
    );
}