function adminAuthenticationMiddleware() {
    return function (req, res, next) {
        if (req.session.passport && req.session.passport.user.admin) {
            return next()
        }
        res.status(403);
        res.json({error: "403 Forbidden"})
    }
}

module.exports = adminAuthenticationMiddleware;
