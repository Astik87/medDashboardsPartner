class ApiError extends Error {
    status

    constructor(status, message) {
        super(message);

        this.status = status
    }

    static UnauthorizedError() {
        return new ApiError(401, 'Вы не авторизованы')
    }

    static BadRequest(message) {
        return new ApiError(400, message)
    }

    static Forbidden() {
        return new ApiError(403, 'Доступ запрещен')
    }
}

module.exports = ApiError
