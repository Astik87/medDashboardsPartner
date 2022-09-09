import {makeAutoObservable} from 'mobx'

class UserState {
    constructor() {
        this._isAuth = false
        this._user = false

        makeAutoObservable(this)
    }

    setIsAuth(isAuth) {
        this._isAuth = isAuth
    }

    setUser(user) {
        this._isAuth = !!user
        this._user = user
    }

    get isAuth() {
        return this._isAuth
    }

    get isAdmin() {
        return this.user.isAdmin
    }

    get user() {
        return this._user
    }

    async check() {
        return false
    }


}

export default new UserState()
