import React, {useEffect, useState, memo} from "react";
import {
    Modal,
    Fade,
    Box,
    Stack,
    TextField,
    Button,
    Alert, Checkbox, FormControlLabel
} from '@mui/material'

import {modalBoxStyle} from "@styles/Modal";

const getFieldElements = (fields, formData, changeFormData) => {
    const elements = []

    for (const fieldName in fields) {
        const {fieldType, label} = fields[fieldName]
        switch (fieldType) {
            case 'checkbox':
                elements.push(<FormControlLabel
                    key={fieldName}
                    control={
                        <Checkbox
                            checked={!!formData[fieldName]}
                            onChange={changeFormData}
                            name={fieldName}/>
                    }
                    label={label}/>)
                break
            default:
                elements.push(<TextField
                    key={fieldName}
                    name={fieldName}
                    type={fieldType}
                    label={label}
                    value={formData[fieldName]}
                    error={!validateField(fieldName, fields, formData)}
                    onChange={changeFormData}/>)
        }
    }

    return elements
}

const validateField = (fieldName, fields, formData) => {
    const field = fields[fieldName]
    const value = formData[fieldName]
    const {rules} = field

    let isValid = false

    if (!rules)
        return true

    if (rules.required && !value)
        return false

    if (rules.min) {
        if (field.type === 'string')
            isValid = value.length > rules.min
        else
            isValid = value > rules.min
    }

    return isValid
}

const validateForm = (fields, formData) => {
    let isValid = true

    for(const fieldName in fields) {
        if (isValid !== true)
            continue

        isValid = validateField(fieldName, fields, formData)
    }

    return isValid
}

const ModalForm = memo((props) => {
    const {fields, opened, onClose, alert, onSend} = props

    const [formData, setFormData] = useState(false)

    useEffect(() => {
        if(formData !== false)
            return

        const initFormData = {}

        for(const fieldName in fields) {
            const {defaultValue} = fields[fieldName]
            initFormData[fieldName] = defaultValue
        }

        setFormData(initFormData)
    }, [formData])

    if (formData === false)
        return ''

    const changeFormData = ({target}) => {
        const field = fields[target.name]

        if (field.fieldType === 'checkbox')
            formData[target.name] = target.checked
        else
            formData[target.name] = target.value

        setFormData({...formData})
    }

    const send = () => {
        if (typeof onSend !== 'function')
            return false

        onSend(formData)
        setFormData(false)
    }

    return (
        <Modal
            onClose={onClose}
            open={opened}>
            <Fade
                in={opened}>
                <Box
                    sx={modalBoxStyle}>
                    <Stack spacing={2}>
                        {getFieldElements(fields, formData, changeFormData)}
                        {
                            alert
                            &&
                            <Alert color={alert.color}>{alert.text}</Alert>
                        }

                        <Button onClick={send} disabled={!validateForm(fields, formData)}
                                variant="contained">Создать</Button>
                    </Stack>
                </Box>
            </Fade>
        </Modal>
    )
})

export default ModalForm
