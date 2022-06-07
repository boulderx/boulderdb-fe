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
import {useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import {FormLabel} from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import format from 'date-fns/format'

export default function EditBoulder({token, snackbarHandler}){
    const [accountType, setAccountType] = React.useState('');
    const [allClimbers, setAllClimbers] = React.useState(null);
    const [allGrades, setAllGrades] = React.useState(null);
    const [allAreas, setAllAreas] = React.useState(null);
    const [editMode, setEditMode] = React.useState(false);
    const navigate = useNavigate();
    const {id = null} = useParams();

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
            await formik?.setFieldValue('name', data?.boulder?.name);
            await formik?.setFieldValue('lat', data?.boulder?.lat);
            await formik?.setFieldValue('long', data?.boulder?.long);
            await formik?.setFieldValue('desc', data?.boulder?.desc);
            await formik?.setFieldValue('wayDesc', data?.boulder?.wayDesc);
            await formik?.setFieldValue('found', data?.boulder?.found);
            await formik?.setFieldValue('firstClimber', data?.boulder?.firstClimber || '');
            await formik?.setFieldValue('area', data?.boulder?.area || '');
            await formik?.setFieldValue('grade', data?.boulder?.grade || '');
            await formik?.setFieldValue('firstAscentDate', data?.boulder?.firstAscentDate);
        }
    }

    const loadClimbers = async () => {
        const response = await fetch('http://localhost:8090/climbers', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if(response?.status === 200) {
            setAllClimbers(data?.climbers);
        }
    }

    const loadGrades = async () => {
        const response = await fetch('http://localhost:8090/grades', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if(response?.status === 200) {
            setAllGrades(data?.grades);
        }
    }

    const loadAreas = async () => {
        const response = await fetch('http://localhost:8090/areas', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if(response?.status === 200) {
            setAllAreas(data?.areas);
        }
    }

    useEffect(() => {
        loadClimbers();
        loadGrades();
        loadAreas();
        if(id) {
            loadBoulder(id);
            setEditMode(true);
        }
    }, [])

    const handleAccountChange = (event) => {
        setAccountType(event.target.value);
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            desc: '',
            lat: '',
            long: '',
            found: false,
            firstClimber: '',
            grade: '',
            area: '',
            wayDesc: '',
            firstAscentDate: new Date(null)
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
        }),
        onSubmit: async (values, actions) => {
            const url = editMode ? `http://localhost:8090/boulder/${id}` : 'http://localhost:8090/boulder'
            const response = await fetch(url, {
                method: editMode ? 'PUT' : 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: values?.name,
                    desc: values?.desc,
                    lat: values?.lat,
                    long: values?.long,
                    found: values?.found,
                    firstClimber: values?.firstClimber,
                    grade: values?.grade,
                    area: values?.area,
                    wayDesc: values?.wayDesc,
                    firstAscentDate: values?.firstAscentDate
                })
            });
            const data = await response.json();
            data?.data?.forEach(({param, msg}) => {
                actions.setFieldError(param, msg);
            });
            if([201, 200].includes(response?.status)) {
                snackbarHandler(true, data?.message, 'success');
                navigate('/');
            }
        },
    });

    const changeDateHandler = (e) => {
        formik?.setFieldValue('firstAscentDate', e)
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
                        <InputLabel id="grade">Select grade</InputLabel>
                        <Select
                            labelId="grade"
                            id="gradeId"
                            value={formik?.values?.grade}
                            onChange={formik?.handleChange}
                            name={'grade'}
                        >
                            {allGrades && allGrades.map(grade => (
                                <MenuItem key={`grade-${grade?._id}`} value={grade?._id}>{grade?.fbGrade}</MenuItem>
                            ))}
                        </Select>
                        {formik.touched.grade && formik.errors.grade ? (
                            <div>{formik.errors.grade}</div>
                        ) : null}
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Lat"
                            name="lat"
                            autoComplete="lat"
                            onChange={formik?.handleChange}
                            value={formik?.values?.lat}
                        />
                        {formik.touched.lat && formik.errors.lat ? (
                            <div>{formik.errors.lat}</div>
                        ) : null}
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Long"
                            name="long"
                            autoComplete="long"
                            onChange={formik?.handleChange}
                            value={formik?.values?.long}
                        />
                        {formik.touched.long && formik.errors.long ? (
                            <div>{formik.errors.long}</div>
                        ) : null}
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel control={<Checkbox checked={formik?.values?.found} onChange={(e) => {
                            formik?.setFieldValue('found', !!e?.target?.checked)
                        }} name={'found'} />} label="Found the boulder" />
                        {formik.touched.found && formik.errors.found ? (
                            <div>{formik.errors.found}</div>
                        ) : null}
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel id="firstClimber">Select first climber</InputLabel>
                        <Select
                            labelId="firstClimber"
                            id="firstClimberId"
                            value={formik?.values?.firstClimber}
                            onChange={formik?.handleChange}
                            name={'firstClimber'}
                        >
                            {allClimbers && allClimbers.map(climber => (
                                <MenuItem key={`climber-${climber?._id}`} value={climber?._id}>{`${climber?.firstName} ${climber?.lastName}`}</MenuItem>
                            ))}
                        </Select>
                        {formik.touched.firstClimber && formik.errors.firstClimber ? (
                            <div>{formik.errors.firstClimber}</div>
                        ) : null}
                    </Grid>
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                                mask="__.__.____"
                                label="First ascent date"
                                inputFormat="dd.MM.yyyy"
                                value={formik?.values?.firstAscentDate}
                                onChange={(e) => changeDateHandler(e)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel id="area">Select area</InputLabel>
                        <Select
                            labelId="area"
                            id="areaId"
                            value={formik?.values?.area}
                            onChange={formik?.handleChange}
                            name={'area'}
                        >
                            {allAreas && allAreas.map(area => (
                                <MenuItem key={`area-${area?._id}`} value={area?._id}>{area.name}</MenuItem>
                            ))}
                        </Select>
                        {formik.touched.area && formik.errors.area ? (
                            <div>{formik.errors.area}</div>
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
                        <FormLabel htmlFor="wayDesc">How to find it</FormLabel>
                    </Grid>
                    <Grid item xs={12}>
                        <TextareaAutosize
                            style={{ width: 1000, height: 100 }}
                            name="wayDesc"
                            autoComplete="wayDesc"
                            onChange={formik?.handleChange}
                            value={formik?.values?.wayDesc}
                        />
                        {formik.touched.wayDesc && formik.errors.wayDesc ? (
                            <div>{formik.errors.wayDesc}</div>
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