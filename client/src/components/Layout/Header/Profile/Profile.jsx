import React, {useContext, useState} from "react"
import {Link} from 'react-router-dom'
import {List, ListItem, Avatar, Menu, MenuItem} from "@mui/material";

import './style.css'
import notAva from './img/not-ava.svg'
import Notifications from "./Notifications"
import {observer} from "mobx-react";
import {Context} from "@/index";
import {deepPurple, blue} from "@mui/material/colors";
import UserApi from "@api/UserApi";

const Profile = observer(() => {

    const {userState} = useContext(Context)
    const {isAuth, user} = userState
    // const [menuOpened, setMenuOpened] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)

    const menuOpened = Boolean(anchorEl);

    const logout = async () => {
        await UserApi.logout()
        userState.setIsAuth(false)
        userState.setUser(false)
    }

    return (
        <div className="header-profile">
            {
                !isAuth
                &&
                <Link to="/auth">
                    <div className="ava">
                        <img src={notAva} alt="not-ava"/>
                    </div>
                </Link>
            }

            {
                isAuth
                &&
                <>
                    <List className="profile-list">
                        <ListItem
                            button
                            id="lock-button"
                            aria-haspopup="listbox"
                            aria-controls="lock-menu"
                            onClick={(event) => setAnchorEl(event.target)}
                        >
                            <div className="ava">
                                <Avatar sx={{bgcolor: blue[600]}}/>
                            </div>
                            <div className="user-name">
                                {user.name}
                            </div>
                        </ListItem>
                        <Menu
                            anchorEl={anchorEl}
                            // MenuListProps={{
                            //     'aria-labelledby': 'lock-button',
                            //     role: 'listbox',
                            // }}
                            open={menuOpened}
                            onClose={() => setAnchorEl(null)}>
                            {
                                userState.user.isAdmin
                                &&
                                <Link
                                    to="/admin">
                                    <MenuItem
                                        onClick={() => setAnchorEl(null)}>

                                        Админ панель
                                    </MenuItem>
                                </Link>
                            }
                            <MenuItem
                                onClick={() => setAnchorEl(null)}>
                                <div
                                    onClick={logout}>
                                    Выйти
                                </div>
                            </MenuItem>
                        </Menu>
                    </List>
                    <Notifications/>
                </>
            }
        </div>
    )
})

export default Profile
