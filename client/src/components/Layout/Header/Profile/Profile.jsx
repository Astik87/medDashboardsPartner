import React, {useContext} from "react"
import {Link} from 'react-router-dom'

import './style.css'
import notAva from './img/not-ava.svg'
import Notifications from "./Notifications"
import {observer} from "mobx-react";
import {Context} from "@/index";

const Profile = observer(() => {

    const {userState} = useContext(Context)
    const {isAuth, user} = userState

    return (
        <div className="header-profile">
            <div className="ava">
                {
                    isAuth
                    ?
                        <img src={notAva} alt="not-ava"/>
                        :
                        <Link to="/auth" >
                            <img src={notAva} alt="not-ava"/>
                        </Link>
                }
            </div>

            {
                isAuth
                &&
                <>
                    <div className="user-name">
                        {user.name}
                    </div>
                    <Notifications/>
                </>
            }
        </div>
    )
})

export default Profile
