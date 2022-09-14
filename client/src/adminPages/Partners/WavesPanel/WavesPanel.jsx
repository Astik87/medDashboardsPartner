import AddButton from "@components/General/AddButton";
import {
    Alert,
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Fade,
    LinearProgress,
    MenuItem,
    Modal,
    Select,
    Stack,
    TextField
} from "@mui/material";
import {Delete} from "@mui/icons-material";
import React, {useEffect, useState} from "react";
import {modalBoxStyle} from "@styles/Modal";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import WavesApi from "@api/WavesApi";

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
    const [formData, setFormData] = useState({name: '', visitPlanId: '', eventPlanId: '', longReadPlanId: false})
    const [createError, setCreateError] = useState(false)
    const [createSuccess, setCreateSuccess] = useState(false)

    const getWaves = (limit, page) => {
        setLoading(true)
        WavesApi.get(limit, page)
            .then(response => {
                if(!response.success)
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
        getWaves(limit, newPage+1)
    }

    return (
        <div className="panel plans-panel">
            <div className="panel__top plans-panel__top">
                <AddButton onClick={() => setOpenedCreateModal(true)}>Create</AddButton>
                <Button variant="outlined"
                        startIcon={<Delete/>}>Delete</Button>
            </div>

            <Modal
                onClose={() => setOpenedCreateModal(false)}
                open={openedCreateModal}>
                <Fade
                    in={openedCreateModal}>
                    <Box
                        sx={modalBoxStyle}>
                        <LocalizationProvider adapterLocale="ru" dateAdapter={AdapterDayjs}>
                            <Stack spacing={2}>
                                <TextField
                                    value={formData.name}
                                    label="Название"/>
                                <Select
                                    value={10}
                                    label="Test">
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </Stack>
                        </LocalizationProvider>
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
