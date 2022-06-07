import * as React from 'react';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {useFormik} from "formik";
import * as Yup from "yup";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function PictureUpload({handleClose, boulderId, token, setBoulderHandler, snackbarHandler}){

    const formik = useFormik({
        initialValues: {
            file: null,
        },
        validationSchema: Yup.object().shape({
            file: Yup.mixed().required(),
        }),
        onSubmit: async (values, actions) => {
            const formData = new FormData();
            formData.append('image', values?.file);
            formData.append('boulderId', boulderId);
            const response = await fetch('http://localhost:8090/boulder/pictureUpload', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                body: formData,
            });
            const data = await response.json();
            if(response?.status === 200) {
                setBoulderHandler(data?.boulder);
                snackbarHandler(true, data?.message, 'success');
                handleClose();
            }
        },
    });

    return (
        <>
        <DialogTitle>Upload Picture</DialogTitle>
            <DialogContent>
                <form id="pictureUploadForm" onSubmit={formik?.handleSubmit}>
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
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" disabled={formik?.isSubmitting} form="pictureUploadForm">Upload</Button>
            </DialogActions>
        </>
    );
}