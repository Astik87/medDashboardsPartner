import React, {useEffect, useState} from 'react'
import {Delete} from "@mui/icons-material"
import {
    Button,
    LinearProgress,
    Modal,
    Fade,
    Box,
    Stack,
    TextField,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
    Backdrop
} from "@mui/material"
import {DataGrid, GridToolbar} from "@mui/x-data-grid"
import 'dayjs/locale/ru';
import {LocalizationProvider} from "@mui/x-date-pickers"
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs"
import {DateTimePicker} from "@mui/x-date-pickers"

import PlansApi from "@api/PlansApi"
import AddButton from "@components/General/AddButton"
import {modalBoxStyle} from "@styles/Modal"

const cols = [
    {field: 'id', width: 50},
    {field: 'name', headerName: 'Название', width: 150},
    {field: 'dateStart', headerName: 'Дата начала', width: 200},
    {field: 'dateEnd', headerName: 'Дата окончания', width: 200},
    {field: 'plan', headerName: 'Plan', width: 150},
    {field: 'fact', headerName: 'Fact', width: 150},
    {field: 'type', headerName: 'Тип', width: 150},
]

const planTypeOptions = [
    {value: 'event', label: 'Меропричтие'},
    {value: 'longRead', label: 'Longread'},
    {value: 'visits', label: 'Визиты'},
]

const PlansPanel = () => {

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(25)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [plans, setPlans] = useState({count: 0, rows: []})
    const [selected, setSelected] = useState([])
    const [createModalOpened, setCreateModalOpened] = useState(false)
    const [createPlanSuccess, setCreatePlanSuccess] = useState(false)
    const [createPlanError, setCreatePlanError] = useState(false)
    const [createPlanLoading, setCreatePlanLoading] = useState(false)
    const [createFormData, setCreateFormData] = useState({
        name: '',
        dateStart: '',
        dateEnd: '',
        plan: '',
        fact: '',
        type: 'event'
    })

    const getPlans = async (limit, page) => {
        setLoading(true)
        const response = await PlansApi.getAll('', limit, page)

        if (!response.success)
            setError(response.message)

        setPage(page)
        setLimit(limit)
        setPlans(response.data)
        setLoading(false)
    }

    useEffect(() => {
        getPlans(limit, page)
    }, [])

    const changePage = (newPage) => {
        getPlans(limit, newPage + 1)
    }

    const changeLimit = (limit) => {
        getPlans(limit, 1)
    }

    const changeCreateFormData = (fieldName, value) => {
        createFormData[fieldName] = value
        setCreateFormData({...createFormData})
    }

    const validateCreateFormData = ({name, plan, fact, dateStart, dateEnd}) => {
        if (name.length < 3)
            return false

        if (plan <= 0)
            return false

        if (fact <= 0)
            return false

        if (dateStart >= dateEnd)
            return false

        return true
    }

    const createPlan = () => {
        setCreatePlanLoading(true)
        setCreatePlanError(false)
        setCreatePlanSuccess(false)
        PlansApi.create(createFormData)
            .then(response => {
                if (!response.success)
                    return setCreatePlanError(response.message)

                setCreatePlanSuccess(true)
            })
            .finally(() => {
                getPlans(limit, page)
                setCreateFormData({
                    name: '',
                    dateStart: '',
                    dateEnd: '',
                    plan: '',
                    fact: '',
                    type: 'event'
                })
                setCreatePlanLoading(false)
            })
    }

    const deletePlans = () => {
        setLoading(true)
        PlansApi.delete(selected)
            .then(response => {
                if(!response.success)
                    return setError(response.message)

            })
            .finally(() => {
                getPlans(limit, page)
                setLoading(false)
            })
    }

    if(error)
        return (
            <div className="page">
                <Alert severity="error">{error}</Alert>
            </div>
        )

    return (
        <div className="panel plans-panel">
            <div className="panel__top plans-panel__top">
                <AddButton onClick={() => setCreateModalOpened(true)}>Create</AddButton>
                <Button variant="outlined" disabled={!selected.length} onClick={deletePlans}
                        startIcon={<Delete/>}>Delete</Button>
            </div>

            <Backdrop
                sx={{color: '#fff', zIndex: 2000}}
                open={createPlanLoading}>
                <CircularProgress color="inherit"/>
            </Backdrop>

            <Modal
                onClose={() => setCreateModalOpened(false)}
                open={createModalOpened}>
                <Fade
                    in={createModalOpened}>
                    <Box
                        sx={modalBoxStyle}>
                        <LocalizationProvider adapterLocale="ru" dateAdapter={AdapterDayjs}>
                            <Stack spacing={2}>
                                <TextField
                                    error={createFormData.name.length < 3}
                                    value={createFormData.name}
                                    required
                                    label="Название"
                                    onChange={({target}) => changeCreateFormData('name', target.value)}/>

                                <TextField
                                    required
                                    error={createFormData.plan <= 0}
                                    value={createFormData.plan}
                                    type="number"
                                    label="Plan"
                                    onChange={({target}) => changeCreateFormData('plan', target.value)}/>

                                <TextField
                                    required
                                    error={createFormData.fact <= 0}
                                    value={createFormData.fact}
                                    type="number"
                                    label="Fact"
                                    onChange={({target}) => changeCreateFormData('fact', target.value)}/>

                                <DateTimePicker
                                    className="create-plan__date-start"
                                    label="Дата начала"
                                    inputFormat="DD.MM.YYYY HH:mm"
                                    value={createFormData.dateStart}
                                    onChange={(value) => changeCreateFormData('dateStart', value.$d.getTime())}
                                    renderInput={(params) => <TextField required={true} {...params} />}/>

                                <DateTimePicker
                                    className="create-plan__date-start"
                                    label="Дата окончания"
                                    inputFormat="DD.MM.YYYY HH:mm"
                                    disabled={!createFormData.dateStart}
                                    value={createFormData.dateEnd}
                                    minDate={createFormData.dateStart}
                                    onChange={(value) => changeCreateFormData('dateEnd', value.$d.getTime())}
                                    renderInput={(params) => <TextField required={true} {...params}
                                                                        error={createFormData.dateStart >= createFormData.dateEnd}/>}/>

                                <Select
                                    value={createFormData.type}
                                    onChange={({target}) => changeCreateFormData('type', target.value)}
                                    label="Тип">
                                    {
                                        planTypeOptions.map(({value, label}) => {
                                            return <MenuItem key={value} value={value}>{label}</MenuItem>
                                        })
                                    }
                                </Select>

                                <Button onClick={createPlan} disabled={!validateCreateFormData(createFormData)}
                                        variant="contained">Создать</Button>
                                {
                                    createPlanError
                                    &&
                                    <Alert severity="error">{createPlanError}</Alert>
                                }
                                {
                                    !createPlanError && createPlanSuccess
                                    &&
                                    <Alert severity="success">План успешно создан</Alert>
                                }
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
                rows={plans.rows}
                rowCount={plans.count}
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

export default PlansPanel
