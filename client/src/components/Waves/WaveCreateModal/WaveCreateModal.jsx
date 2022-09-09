import React, {useEffect, useState} from "react";
import {Modal, Fade, Box, TextField, Stack, Button, Typography} from "@mui/material"
import Select from 'react-select'

import './style.css'

import {modalBoxStyle} from '@styles/Modal'
import {Loading} from "@components/General";

const WaveCreateModal = (props) => {
    const {isOpen, isLoading, onClose, plansSelectOptions, sendForm} = props

    const [isValid, setIsValid] = useState(false)
    const [formData, setFormData] = useState({name: false, visitPlanId: false, eventPlanId: false, longReadPlanId: false})
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState(false)

    const validateForm = (formData) => {
        return formData.name.length >= 3 && formData.visitPlanId && formData.eventPlanId && formData.longReadPlanId
    }

    useEffect(() => {
        setIsValid(validateForm(formData))
    }, [formData])

    if(isLoading)
        return (
            <Modal
                open={isOpen}>
                <Fade in={isOpen}>
                    <Box sx={modalBoxStyle}>
                        <Loading />
                    </Box>
                </Fade>
            </Modal>
        )

    const setName = ({target}) => {
        const {value} = target

        setFormData({...formData, name: value})
    }

    const setVisitPlanId = ({value}) => {
        setFormData({...formData, visitPlanId: value})
    }

    const setEventPlanId = ({value}) => {
        setFormData({...formData, eventPlanId: value})
    }

    const setLongReadPlanId = ({value}) => {
        setFormData({...formData, longReadPlanId: value})
    }

    const closeModal = (reload) => {
        if(typeof onClose === 'function')
            onClose(reload)
    }

    const onSendForm = async () => {
        if(!isValid)
            return

        const {name, visitPlanId, eventPlanId, longReadPlanId} = formData

        const result = await sendForm(name, visitPlanId, eventPlanId, longReadPlanId)
        if(!result.success)
            return setError(result.message)

        setIsSuccess(true)
    }

    return (
        <Modal
            open={isOpen}
            onClose={closeModal}>
            <Fade in={isOpen}>
                <Box
                    sx={modalBoxStyle}>
                    <Modal
                        onClose={() => setError(false)}
                        open={!!error}>
                        <Fade
                            in={!!error}>
                            <Box sx={modalBoxStyle}>
                                <Typography style={{color: '#d32f2f'}}>{error}</Typography>
                            </Box>
                        </Fade>
                    </Modal>

                    <Modal
                        onClose={() => {
                            setIsSuccess(false)
                            closeModal(true)
                        }}
                        open={isSuccess}>
                        <Fade
                            in={isSuccess}>
                            <Box sx={modalBoxStyle}>
                                <Typography style={{color: '#34c759'}}>План успешно создан</Typography>
                            </Box>
                        </Fade>
                    </Modal>

                    <Stack spacing={2}>
                        <TextField label="Название" value={formData.name || ''} onChange={setName} error={formData.name.length < 3}/>
                        <Select
                            placeholder="План визитов"
                            classNamePrefix="wave-create-select"
                            onChange={setVisitPlanId}
                            options={plansSelectOptions.visitOptions}/>
                        <Select
                            placeholder="План мероприятий"
                            classNamePrefix="wave-create-select"
                            onChange={setEventPlanId}
                            options={plansSelectOptions.eventOptions}/>
                        <Select
                            placeholder="План LongRead'a"
                            classNamePrefix="wave-create-select"
                            onChange={setLongReadPlanId}
                            options={plansSelectOptions.longReadOptions}/>
                            <Button onClick={onSendForm} variant="contained" disabled={!isValid}>Создать</Button>
                    </Stack>
                </Box>
            </Fade>
        </Modal>
    )
}

export default WaveCreateModal
