const {Op} = require('sequelize')
const bcrypt = require('bcrypt')

const ApiError = require('../utils/ApiError')
const TokenService = require('./TokenService')
const {User} = require('../models')
const UserDto = require('../dtos/UserDto')

class UserService {

    /**
     * Валидация полей
     * @param {string|boolean} name
     * @param {string} login
     * @param {string} password
     */
    validate(name, login, password) {
        if(name !== false && (!name || name.length < 1))
            throw new ApiError(400, 'Имя является обязательным полем')

        if(!login || login.length < 3)
            throw new ApiError(400, 'Логин не может быть меньше 3 симвалов')

        if(!password || password.length < 6)
            throw new ApiError(400, 'Пароль не может быть меньше 6 симвалов')
    }

    /**
     * Получить всех пользователей
     * @param {number} limit
     * @param {number} page
     * @return {Promise<{count: number | UserDto[]}>}
     */
    async getUsers(limit = 10, page = 1) {
        const users = await User.findAndCountAll({
            limit,
            offset: (page-1)*limit
        })

        const result = {count: users.count}
        result.rows = users.rows.map((user) => {
            user = new UserDto(user)
            return user
        })

        return result
    }

    /**
     * Удалить пользователей
     * @param {[number]} userIds
     * @return {Promise<number>}
     */
    async deleteUsers(userIds) {
        return await User.destroy({
            where: {
                id: {
                    [Op.in]: userIds
                }
            }
        })
    }

    /**
     * Регистрация пользователя
     * @param {string} name
     * @param {string} login
     * @param {string} password
     * @return {Promise<UserDto>}
     */
    async registration(name, login, password, isAdmin) {
        this.validate(name, login, password)

        const candidate = await User.findOne({
            where: {
                login: login
            }
        })

        if(candidate)
            throw new ApiError(400, 'Пользователь с таким логином уже зарегистрирован')

        const passwordHash = await bcrypt.hash(password, 3)

        const user = await User.create({
            name,
            login,
            passwordHash,
            isAdmin
        })

        return new UserDto(user)
    }

    /**
     * Авторизация пользователя
     * @param {string} login
     * @param {string} password
     * @return {Promise<UserDto>}
     */
    async login(login, password) {
        this.validate(false, login, password)

        const user = await User.findOne({
            where: {
                login
            }
        })

        if(!user)
            throw ApiError.BadRequest('Пользователь с таким логином не найден')

        const passwordEquals = await bcrypt.compare(password, user.passwordHash)

        if(!passwordEquals)
            throw new ApiError(400, 'Неверный логин или пароль')

        const tokenService = new TokenService()
        const userPayload = new UserDto(user)
        const {refreshToken, accessToken} = tokenService.generate({...userPayload})
        await tokenService.save(user.id, refreshToken)
        return new UserDto(user, accessToken, refreshToken)
    }

    /**
     * Выход
     * @param {string} refreshToken
     * @return {Promise<void>}
     */
    async logout(refreshToken) {
        const user = await User.findOne({
            where: {
                refreshToken
            }
        })

        if(!user)
            throw ApiError.UnauthorizedError()

        user.refreshToken = null
        await user.save()
    }

    /**
     * Обновление refresh и access токенов
     * @return {Promise<UserDto>}
     */
    async refresh(refreshToken) {
        const tokenService = new TokenService()
        const tokenIsValid = await tokenService.validate(refreshToken)

        if(!tokenIsValid)
            throw ApiError.UnauthorizedError()

        const user = await User.findOne({
            where: {
                refreshToken
            }
        })

        if(!user)
            throw ApiError.UnauthorizedError()

        const userPayload = new UserDto(user)
        const tokens = tokenService.generate({...userPayload})
        await tokenService.save(user.id, tokens.refreshToken)

        return new UserDto(user, tokens.accessToken, tokens.refreshToken)
    }
}

module.exports = UserService
