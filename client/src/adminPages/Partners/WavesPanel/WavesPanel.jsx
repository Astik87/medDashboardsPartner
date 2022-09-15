import AddButton from "@components/General/AddButton";
import {
    Alert,
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Fade,
    LinearProgress,
    Modal,
    Stack,
    TextField
} from "@mui/material";
import Select from 'react-select'
import {Delete} from "@mui/icons-material";
import React, {useEffect, useState} from "react";
import {modalBoxStyle} from "@styles/Modal";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import WavesApi from "@api/WavesApi";
import VisitsApi from "@api/VisitsApi";
import PlansApi from "@api/PlansApi";

const cols = [
    {field: 'id', width: 50},
    {field: 'name', headerName: 'Название', width: 150},
    {field: 'visitPlan', headerName: 'План визитов', width: 200},
    {field: 'eventPlan', headerName: 'План мероприятий', width: 200},
    {field: 'longReadPlan', headerName: "План LongRead'a", width: 200},
]

const WavesPanel = () => {

    const [waves, setWaves] = useState({count: 0, rows: []})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [selected, setSelected] = useState([])
    const [limit, setLimit] = useState(25)
    const [page, setPage] = useState(1)
    const [openedCreateModal, setOpenedCreateModal] = useState(false)
    const [formData, setFormData] = useState({name: '', visitPlan: '', eventPlan: '', longReadPlan: false})
    const [formLoading, setFormLoading] = useState(false)
    const [formError, setFormError] = useState(false)
    const [formSuccess, setFormSuccess] = useState(false)
    const [plansForSelector, setPlansForSelector] = useState(false)

    const getWaves = (limit, page) => {
        setLoading(true)
        WavesApi.get(limit, page)
            .then(response => {
                if (!response.success)
                    setError(response.message)

                waves.rows = response.data.rows.map((wave) => {
                    wave.visitPlan = wave.visitPlan.name
                    wave.eventPlan = wave.eventPlan.name
                    wave.longReadPlan = wave.longReadPlan.name

                    return wave
                })

                waves.count = response.data.count

                setWaves({...waves})
            })
            .finally(() => {
                setPage(page)
                setLimit(limit)
                setLoading(false)
            })
    }

    useEffect(() => {
        getWaves(limit, page)
    }, [])

    const changeLimit = (newLimit) => {
        getWaves(newLimit, 1)
    }

    const changePage = (newPage) => {
        getWaves(limit, newPage + 1)
    }

    const getVisitsForSelector = async () => {
        setFormLoading(true)
        const response = await PlansApi.getPlansForSelector()
        if (!response.success) {
            setFormError(response.message)
        } else {
            const plans = response.data
            setPlansForSelector(plans)
            setFormData({
                ...formData,
                longReadPlan: plans.longRead[0],
                visitPlan: plans.visits[0],
                eventPlan: plans.event[0]
            })
        }

        setFormLoading(false)
    }

    const toggleForm = async () => {
        if (openedCreateModal === false && plansForSelector === false && !formLoading)
            await getVisitsForSelector()

        setOpenedCreateModal(!openedCreateModal)
    }

    const deleteWaves = () => {
        setLoading(true)

        WavesApi.deleteWave(selected)
            .then(response => {
                if(!response.success)
                    return setError(response.message)

                getWaves(limit, 1)
            }).finally(() => {
                setLoading(false)
        })
    }

    const createWave = () => {
        if (!validateForm())
            return

        setFormSuccess(false)
        setFormError(false)

        setFormLoading(true)
        WavesApi.createWave(formData.name, formData.visitPlan.value, formData.eventPlan.value, formData.longReadPlan.value)
            .then(response => {
                if(!response.success)
                    return setFormError(response.message)

                setFormSuccess(true)
                getWaves(limit, page)
            })
            .finally(() => {
                setFormLoading(false)
            })
    }

    const validateForm = () => {
        if (!formData.eventPlan)
            return false

        if (!formData.visitPlan)
            return false

        if (!formData.longReadPlan)
            return false

        if (formData.name.length < 3)
            return false

        return true
    }

    return (
        <div className="panel plans-panel">
            <div className="panel__top plans-panel__top">
                <AddButton onClick={toggleForm}>Create</AddButton>
                <Button variant="outlined" onClick={deleteWaves}
                        startIcon={<Delete/>}>Delete</Button>
            </div>

            {
                formLoading
                &&
                <Backdrop
                    sx={{color: '#fff', zIndex: 2000}}
                    open={formLoading}>
                    <CircularProgress color="inherit"/>
                </Backdrop>
            }

            <Modal
                onClose={toggleForm}
                open={openedCreateModal}>
                <Fade
                    in={openedCreateModal}>
                    <Box
                        sx={modalBoxStyle}>
                        <Stack spacing={2}>
                            <TextField
                                onChange={({target}) => {
                                    setFormData({...formData, name: target.value})
                                }}
                                value={formData.name}
                                label="Название"/>

                            {
                                plansForSelector
                                &&
                                <>
                                    <Select
                                        placeholder="План визитов"
                                        value={formData.visitPlan}
                                        onChange={(newValue) => {
                                            setFormData({...formData, visitPlan: newValue})
                                        }}
                                        options={plansForSelector.visits}/>

                                    <Select
                                        placeholder="План мероприятий"
                                        onChange={(newValue) => {
                                            setFormData({...formData, eventPlan: newValue})
                                        }}
                                        value={formData.eventPlan}
                                        options={plansForSelector.event}/>

                                    <Select
                                        placeholder="План Longread'а"
                                        onChange={(newValue) => {
                                            setFormData({...formData, longReadPlan: newValue})
                                        }}
                                        value={formData.longReadPlan}
                                        options={plansForSelector.longRead}/>
                                </>
                            }

                            {
                                formError
                                &&
                                <Alert severity="error">{formError}</Alert>
                            }

                            {
                                formSuccess
                                &&
                                <Alert severity="success">Волна успешно создана</Alert>
                            }

                            <Button onClick={createWave} disabled={!validateForm()}
                                    variant="contained">Создать</Button>

                        </Stack>
                    </Box>
                </Fade>
            </Modal>

            <DataGrid
                checkboxSelection
                loading={loading}
                pagination
                page={page - 1}
                pageSize={limit}
                onPageSizeChange={changeLimit}
                columns={cols}
                rows={waves.rows}
                rowCount={waves.count}
                selectionModel={selected}
                onSelectionModelChange={(res, test) => {
                    setSelected(res)
                }}
                onPageChange={changePage}
                components={{
                    LoadingOverlay: LinearProgress,
                    Toolbar: GridToolbar
                }}
            />

        </div>
    )
}

export default WavesPanel
