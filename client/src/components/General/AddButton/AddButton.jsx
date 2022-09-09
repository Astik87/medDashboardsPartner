import React from "react"
import {Button, Icon, styled} from "@mui/material"

import {addBtnStyle, addIconStyle} from "@styles/Button"

const AddButtonStyled = styled(Button)(addBtnStyle)

const AddButton = (props) => {
    const {children, onClick, className} = props

    return (
        <AddButtonStyled className={className} variant="contained" startIcon={<Icon style={addIconStyle}>add</Icon>}
                   onClick={onClick}>{children}</AddButtonStyled>
    )
}

export default AddButton
