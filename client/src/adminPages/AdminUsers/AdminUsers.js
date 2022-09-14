import React, {useEffect, useState} from "react";
import {
    LinearProgress,
    Alert,
    Button,
    Modal,
    Fade,
    Box,
    TextField,
    Checkbox,
    Stack,
    FormGroup,
    FormControlLabel,
    Backdrop,
    CircularProgress,
    styled
} from '@mui/material'
import {Delete} from "@mui/icons-material";
import {DataGrid, GridToolbar} from '@mui/x-data-grid'

import './style.css'
import {sendBtnStyle} from "@styles/Button";
import {modalBoxStyle} from "@styles/Modal";

import UserApi from "@api/UserApi";
import {AddButton} from "@components/General"

const cols = [
    {field: 'id', width: 50},
    {field: 'name', width: 200},
    {field: 'login', width: 200},
    {field: 'isAdmin', width: 200},
    {field: 'refreshToken', width: 200},
]

const AdminUsers = () => {

    const [limit, setLimit] = useState(25)
    const [page, setPage] = useState(1)
    const [users, setUsers] = useState({count: 0, rows: []})
    const [selected, setSelected] = useState([])
    const [openCreateModal, setOpenCreateModel] = useState(false)
    const [newUserData, setNewUserData] = useState({name: '', login: '', password: '', isAdmin: false})
    const [createUserLoading, setCreateUserLoading] = useState(false)
    const [createUserError, setCreateUserError] = useState(false)
    const [createUserSuccess, setCreateUserSuccess] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        getUsers()
    }, [])

    const getUsers = (limit = 25, page = 1) => {
        setLoading(true)
        UserApi.getUsers(limit, page).then((response) => {
            if (!response.success)
                setError(response.message)

            setUsers(response.data)
        }).finally(() => {
            setLimit(limit)
            setPage(page)
            setLoading(false)
        })
    }

    const deleteUsers = async (userIds) => {
        if (loading)
            return

        setLoading(true)
        const response = await UserApi.deleteUsers(userIds)
        if (!response.success)
            setError(response.message)

        getUsers(limit, page)
        setLoading(false)
    }

    const validateCreateUserData = (userData) => {
        const {name, login, password} = userData

        if (!name || !name.length)
            return false

        if (!login || login.length < 3)
            return false

        if (!password || password.length < 6)
            return false

        return true
    }

    const createUser = () => {
        setCreateUserLoading(true)
        UserApi.registration(newUserData).then((response) => {
            if (!response.success)
                return setCreateUserError(response.message)

            console.log(response)
            setNewUserData({name: '', login: '', password: '', isAdmin: false})
            setCreateUserSuccess(true)
            getUsers(limit, page)
        }).finally(() => {
            setCreateUserLoading(false)
        })
    }

    const changeNewUserData = ({target}) => {
        const fieldName = target.name
        if (fieldName === 'isAdmin') {
            newUserData[fieldName] = target.checked
        } else {
            newUserData[fieldName] = target.value
        }

        setNewUserData({...newUserData})
    }

    const deleteUsersHandler = () => {
        deleteUsers(selected)
    }

    const changeLimit = (limit) => {
        getUsers(limit, 1)
    }

    const changePage = (newPage) => {
        getUsers(limit, newPage + 1)
    }

    if (error)
        return (
            <div className="page">
                <Alert severity="error">{error}</Alert>
            </div>
        )

    return (
        <div className="page" style={{height: '100%'}}>
            <div className="user-table-actions">
                <AddButton onClick={() => setOpenCreateModel(true)}>Create</AddButton>
                <Button onClick={deleteUsersHandler} disabled={!selected.length} variant="outlined"
                        startIcon={<Delete/>}>Delete</Button>
            </div>

            <Modal
                onClose={() => {
                    setOpenCreateModel(false)
                    setCreateUserSuccess(false)
                    setCreateUserError(false)
                }}
                open={openCreateModal}>
                <Fade
                    in={openCreateModal}>
                    <Box sx={modalBoxStyle}>
                        <FormGroup>
                            <Stack spacing={2}>
                                <TextField onChange={changeNewUserData} label="Имя" value={newUserData.name} required name="name"
                                           error={!newUserData.name.length}/>
                                <TextField onChange={changeNewUserData} label="Логин" value={newUserData.login} required name="login"
                                           error={newUserData.login.length < 3}/>
                                <TextField onChange={changeNewUserData} label="Пароль" type="password" value={newUserData.password} required
                                           name="password" error={newUserData.password.length < 6}/>
                                <FormControlLabel
                                    control={<Checkbox checked={!!newUserData.isAdmin} onChange={changeNewUserData}
                                                       name="isAdmin"/>} label="Аминнистратор"/>
                                <Button onClick={createUser} disabled={!validateCreateUserData(newUserData)}
                                        variant="contained">Создать</Button>
                                {
                                    createUserError
                                    &&
                                    <Alert severity="error">{createUserError}</Alert>
                                }
                                {
                                    !createUserError && createUserSuccess
                                    &&
                                    <Alert severity="success">Пользователь успешно создан</Alert>
                                }
                            </Stack>
                        </FormGroup>
                    </Box>
                </Fade>

            </Modal>

            <Backdrop
                sx={{color: '#fff', zIndex: 2000}}
                open={createUserLoading}>
                <CircularProgress color="inherit"/>
            </Backdrop>

            <div className="users-table">
                <DataGrid
                    checkboxSelection
                    loading={loading}
                    pagination
                    page={page - 1}
                    pageSize={limit}
                    onPageSizeChange={changeLimit}
                    columns={cols}
                    rows={users.rows}
                    rowCount={users.count}
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
        </div>
    )
}

export default AdminUsers
