import React, {useContext, useEffect, useState} from "react";
import {Button, Stack, TextField, Alert, Backdrop, CircularProgress, styled} from '@mui/material'

import './style.css'

import {sendBtnStyle} from '@styles/Button'
import UserApi from "@api/UserApi";
import {Context} from "@/index";
import {observer} from "mobx-react";

const SendButton = styled(Button)(sendBtnStyle)

const Auth = observer(() => {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [isValid, setIsValid] = useState(false)
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const validate = () => {
        return login.length && password.length >= 6
    }

    const {userState} = useContext(Context)

    const auth = async () => {
        if(!isValid)
            return false

        setLoading(true)
        const response = await UserApi.login(login, password)

        if(!response.success) {
            setError(response.message)
        } else {
            setSuccess(true)
            setError(false)
            setTimeout(() => {
                userState.setIsAuth(true)
                userState.setUser(response.data)
                setSuccess(false)
            }, 500)
        }
        setLoading(false)
    }

    const logout = async () => {
        const response = await UserApi.logout()
        if(!response.success)
            return setError(response.message)

        userState.setIsAuth(false)
        userState.setUser(false)
    }

    useEffect(() => {
        setIsValid(validate())
    }, [login, password])

    if(userState.isAuth)
        return (
            <div className="page" style={{height: '100%'}}>
                <div className="auth-page">
                    <Stack className="auth-form" spacing={2}>
                        <Alert severity="success">Вы уже авторизованы</Alert>
                        <Button variant="outlined" onClick={logout}>Выйти</Button>
                    </Stack>
                </div>
            </div>
            )

    return (
        <div className="page">
            <div className="auth-page">
                <Stack className="auth-form" spacing={2}>
                    <TextField label="Login" value={login} error={!login} onChange={({target}) => setLogin(target.value)} />
                    <TextField type="password" label="Password" error={password.length < 6} onChange={({target}) => setPassword(target.value)} />
                    {
                        error
                        &&
                        <Alert severity="error">{error}</Alert>
                    }
                    {
                        success
                        &&
                        <Alert severity="success">Вы авторизованы</Alert>
                    }
                    <SendButton onClick={auth} disabled={!isValid || loading} variant="contained">Войти</SendButton>
                    <Backdrop
                        sx={{ color: '#fff', zIndex: 1000, top: -20}}
                        open={loading}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </Stack>
            </div>
        </div>
    )
})

export default Auth
