const jwt = require('jsonwebtoken')

const {User} = require('../models')
const ApiError = require('../utils/ApiError')
const UserDto = require('../dtos/UserDto')

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1]

        console.log(token)
        if(!token)
            return res.status(401).json({message: 'Вы не авторизованы'})

        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        const user = await User.findOne({
            where: {
                id: decoded.id
            }
        })

        if(!user)
            return ApiError.UnauthorizedError()

        const {refreshToken} = req.cookies
        const userDto = new UserDto(user, decoded.accessToken, refreshToken)

        if(!userDto.isAdmin)
            return ApiError.Forbidden()

        req.user = userDto
        next()
    } catch (e) {
        return res.status(401).json({message: 'Вы не авторизованы'})
    }
}
