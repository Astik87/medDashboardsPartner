const UserService = require('../services/UserService')

class UserController {

    setCookieToken(res, token) {
        res.cookie('refreshToken', token, {maxAge: 30 * 24 * 60 * 60 * 1000})
    }

    registration = async (req, res, next) => {
        const {name, login, password, isAdmin} = req.body

        try {
            const userService = new UserService()
            const user = await userService.registration(name, login, password, isAdmin)

            return res.json({...user})
        } catch (error) {
            next(error)
        }
    }

    login = async (req, res, next) => {
        try {
            const {login, password} = req.body

            const userService = new UserService()
            const user = await userService.login(login, password)
            this.setCookieToken(res, user.refreshToken)
            delete user.refreshToken

            return res.json({...user})
        } catch (error) {
            next(error)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const userService = new UserService()
            await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.send('')
        } catch (error) {
            next(error)
        }
    }

    refresh = async (req, res, next) => {
        try {
            const {refreshToken} = req.cookies
            const userService = new UserService()
            const user = await userService.refresh(refreshToken)
            this.setCookieToken(res, user.refreshToken)
            delete user.refreshToken

            return res.json({...user})
        } catch (error) {
            next(error)
        }
    }

    getUsers = async (req, res, next) => {
        try {
            let {limit, page} = req.query

            if(!limit)
                limit = 25

            if(!page)
                page = 1

            const userService = new UserService()
            const users = await userService.getUsers(+limit, +page)
            return res.json(users)
        } catch (error) {
            next(error)
        }
    }

    deleteUsers = async (req, res, next) => {
        try {
            const {userIds} = req.body

            const userService = new UserService()
            const result = userService.deleteUsers(userIds)

            return res.json(result)
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new UserController()
