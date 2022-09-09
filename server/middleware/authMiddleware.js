const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1]

        if(!token)
            return res.status(401).json({message: 'Вы не авторизованы'})

        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        req.user = decoded
        next()
    } catch (e) {
        return res.status(401).json({message: 'Вы не авторизованы'})
    }
}
