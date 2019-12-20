function authenticationMiddleware() {
    return function (req, res, next) {
        if (req.session.passport && req.session.passport.user) {
            return next()
        }
        res.json({error: "Authentication failed"})
    }
}

module.exports = authenticationMiddleware;
