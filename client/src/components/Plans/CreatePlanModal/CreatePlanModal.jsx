import React, {useState} from "react"
import {styled} from "@mui/material"
import {
    Stack, TextField,
    Button, Modal,
    Fade, Box,
    Typography
} from "@mui/material"
import 'dayjs/locale/ru';
import {LocalizationProvider} from "@mui/x-date-pickers"
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs"
import {DateTimePicker} from "@mui/x-date-pickers"

import './style.css'

import Loading from "@components/General/Loading"
import {modalBoxStyle} from "@styles/Modal"
import {sendBtnStyle} from "@styles/Button";

const CreateBtn = styled(Button)(sendBtnStyle)

const messageModalStyle = {
    ...modalBoxStyle,
    minWidth: 250,
    maxWidth: '90vw',
    overflow: 'hidden'
}

/**
 * Валидаця данных формы
 * @param {{name: string, start: {$d: Date}, end: {$d: Date}, plan: number}} data
 * @return {boolean}
 */
const validateFormData = (data) => {
    const {name, start, end, plan} = data

    return name.trim().length > 3 && start && end && start.$d < end.$d && plan > 0
}

const CreatePlanModal = (props) => {

    const {onClose, isOpen, onSendForm} = props

    const [formData, setFormData] = useState({name: '', start: '', end: '', plan: false})
    const [status, setStatus] = useState({success: false, loading: false, error: false})

    const createBtnHandler = () => {
        if (typeof onSendForm !== 'function')
            return

        const {name, start, end, plan} = formData

        const planName = name.trim()

        if (!validateFormData(formData))
            return

        setStatus({...status, loading: true})
        onSendForm(planName, start.$d.getTime(), end.$d.getTime(), plan).then((response) => {
            setStatus({...status, success: response.success, loading: false})
        })
    }

    return (
        <Modal
            onClose={onClose}
            open={isOpen}>
            <Fade in={isOpen}>
                <Box sx={modalBoxStyle}>

                    {/* Success modal */}
                    <Modal
                        onClose={() => onClose(true)}
                        open={isOpen && status.success}>

                        <Fade in={isOpen && status.success}>
                            <Box sx={messageModalStyle}>
                                <Typography variant="h6" style={{textAlign: 'center'}} color="#34c759">
                                    План успешно создан
                                </Typography>
                            </Box>
                        </Fade>

                    </Modal>

                    {/*Loading modal*/}
                    <Modal
                        open={isOpen && status.loading}>

                        <Fade in={isOpen && status.loading}>
                            <Box sx={messageModalStyle}>
                                <Loading/>
                            </Box>
                        </Fade>

                    </Modal>

                    {/*Error modal*/}
                    <Modal
                        onClose={() => setStatus({...status, error: false})}
                        open={isOpen && !!status.error}>

                        <Fade in={isOpen && !!status.error}>
                            <Box sx={messageModalStyle}>
                                <Typography variant="h6" style={{textAlign: 'center'}}
                                            color="#d32f2f">{status.error}</Typography>
                            </Box>
                        </Fade>

                    </Modal>

                    <div className="create-plan">
                        <LocalizationProvider adapterLocale="ru" dateAdapter={AdapterDayjs}>
                            <Stack spacing={3}>
                                <TextField required={true} error={formData.name.trim().length < 3} label="Название"
                                           value={formData.name}
                                           onChange={({target}) => setFormData({...formData, name: target.value})}/>

                                <TextField type="number" required={true} error={formData.plan <= 0}
                                           value={formData.plan}
                                           onChange={({target}) => setFormData({...formData, plan: target.value})}/>

                                <DateTimePicker
                                    className="create-plan__date-start"
                                    label="Дата начала"
                                    inputFormat="DD.MM.YYYY HH:mm"
                                    value={formData.start}
                                    onChange={(value) => setFormData({...formData, start: value})}
                                    renderInput={(params) => <TextField required={true} {...params} />}
                                />
                                <DateTimePicker
                                    className="create-plan__date-start"
                                    label="Дата окончания"
                                    inputFormat="DD.MM.YYYY HH:mm"
                                    disabled={!formData.start}
                                    minDateTime={formData.start}
                                    value={formData.end}
                                    onChange={(value) => setFormData({...formData, end: value})}
                                    renderInput={(params) => <TextField required={true} {...params} />}
                                />
                                <CreateBtn disabled={!validateFormData(formData)} onClick={createBtnHandler}
                                           variant="contained">Создать</CreateBtn>
                            </Stack>
                        </LocalizationProvider>
                    </div>
                </Box>
            </Fade>
        </Modal>
    )
}

export default CreatePlanModal
