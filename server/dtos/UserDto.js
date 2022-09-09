/**
 * @property {number} id id
 * @property {string} name Имя
 * @property {string} login Логин
 * @property {string} accessToken accessToken
 * @property {string} refreshToken refreshToken
 */
class UserDto {
    id = false
    name = false
    login = false
    isAdmin = false
    accessToken = false
    refreshToken = false

    /**
     * @param {User} user
     * @param {string|boolean} accessToken
     * @param {string|boolean} refreshToken
     */
    constructor(user, accessToken = false, refreshToken = false) {
        this.id = user.id
        this.name = user.name
        this.login = user.login
        this.isAdmin = user.isAdmin
        this.accessToken = accessToken
        this.refreshToken = refreshToken
    }
}

module.exports = UserDto
