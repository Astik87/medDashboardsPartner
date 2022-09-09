import React from "react";

import './style.css'

import {formatDate} from '@utils/DateUtils';
import Empty from "@components/General/Empty";
import {Modal, Fade, Box} from "@mui/material";
import {randomString} from "@utils/StringUtils";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    borderRadius: 5,
    p: 2,
    maxWidth: '90vw',
    maxHeight: '90vh',
}

const PlanDetailModal = (props) => {
    const {plan, close} = props

    return (
        <Modal
            open={!!plan}
            onClose={close}>
            <Fade in={!!plan}>
                <Box sx={modalStyle}>
                    {
                        !!plan &&
                        <div>
                            <div className="plan">
                                {
                                    plan.telemarketers.length > 0
                                        ?
                                        plan.telemarketers.map(({name, conducted, total, doctors}) => (
                                            <div key={name+randomString(5)} className="plan-telemarketers-list">
                                                <div className="plan-telemarketer">
                                                    <div className="plan-telemarketer-name">
                                                        {name}
                                                    </div>
                                                    <div className="plan-telemarketer-visits">
                                                        <span className="plan-telemarketer-conducted">{conducted}</span>
                                                        /
                                                        <span className="plan-telemarketer-total">
                                                        {total}
                                                    </span>
                                                    </div>
                                                </div>
                                                <div className="plan__doctors-list">
                                                    {
                                                        doctors.map(({name, status, time}, index) => (
                                                            <div key={name+index+randomString(5)}
                                                                 className={`plan__doctors-item ${status ? 'conducted' : ''}`}>
                                                                <div className="plan__doctors-name">
                                                                    {name}
                                                                </div>
                                                                <div className="plan__doctors-time">
                                                                    {formatDate(new Date(time))}
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        ))
                                        :
                                        <Empty/>
                                }
                            </div>
                        </div>
                    }
                </Box>
            </Fade>
        </Modal>
    )
}

export default PlanDetailModal
