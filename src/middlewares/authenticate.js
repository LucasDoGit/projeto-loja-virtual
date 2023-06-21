module.exports = (req, res, next) => {

    console.log('middleware');
    const authHeader = req.headers.authorization;

    console.log(authHeader);

    next();
}