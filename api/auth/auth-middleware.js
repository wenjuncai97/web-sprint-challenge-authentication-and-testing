const User = require('../auth/user-model');

const required = (req, res, next) => {
    if(!req.body.username || !req.body.password) {
        return next({status: 400, message: "username and password required"})
    } else {
        next();
    }
}

const unique = async (req, res, next) => {
    try {
        const user = await User.findBy({ username: req.body.username });
        user.length !== 0
          ? next({ status: 401, message: "username taken" })
          : next();
      } catch (err) {
        next(err);
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