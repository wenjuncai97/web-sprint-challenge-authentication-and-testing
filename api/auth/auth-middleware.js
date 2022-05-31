const User = require('../auth/user-model');

const required = (req, res, next) => {
    if(!req.body.username || !req.body.password) {
        return next({status: 422, message: "username and password required"})
    } else {
        next();
    }
}

const unique = async (req, res, next) => {
    try {
        const users = await User.findBy({ username: req.body.username })
        if (!users.length) {
            next()
        } else {
            next({ message: 'username taken', status: 422 })
        }
    } catch(err) {
        next(err)
    } 
};

const usernameExists = async (req, res, next) => {
    if(!req.body.username || !req.body.password) {
        next({ status: 401, message: 'username and password required' })
    } else {
        try {
            const users = await User.findBy({ username: req.body.username })
            if (users.length) {
                req.user = users[0]
                next()
            } else {
                next({ message: 'Invalid credentials', status: 401 })
            }
        } catch(err) {
            next(err)
        }    
    }
}

module.exports = {
    required,
    unique,
    usernameExists,
}