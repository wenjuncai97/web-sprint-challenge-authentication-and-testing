module.exports ={
    BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS || 8,
    NODE_ENV: process.env.NODE_ENV || 'development',
    JWT_SECRET: process.env.JWT_SECRET || 'shh'
}