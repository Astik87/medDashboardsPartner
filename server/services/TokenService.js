const jwt = require('jsonwebtoken')

const ApiError = require('../utils/ApiError')
const {User} = require('../models')
const UserDto = require('../dtos/UserDto')

class TokenService {
    /**
     * Гнерация access и refresh токена
     * @param {{}} payload
     * @return {{refreshToken: string, accessToken: string}}
     */
    generate(payload) {
        const refreshToken = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '30d'})
        const accessToken = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '15m'})

        return {
            refreshToken,
            accessToken
        }
    }

    /**
     * Валидация токена
     * @param {string} token
     * @return {{}|boolean} payload токена
     */
    async validate(token) {
        try {
            return await jwt.verify(token, process.env.SECRET_KEY)
        } catch (error) {
            return false
        }
    }

    /**
     * Сохранить новый refreshToken в базу
     * @param {number} userId
     * @param {string} refreshToken
     * @return {Promise<UserDto>}
     */
    async save(userId, refreshToken) {
        const user = await User.findOne({
            where: {
                id: userId
            }
        })

        if(!user)
            throw ApiError.BadRequest(`Пользователь с id ${userId} не найден`)

        user.refreshToken = refreshToken
        await user.save()

        const userDto = new UserDto(user, false, refreshToken)

        return userDto
    }
}

module.exports = TokenService
