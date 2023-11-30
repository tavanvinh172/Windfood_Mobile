const jwt = require('jsonwebtoken');

module.exports = (request: any, response: any, next: any) => {
    let token: String = request.header('Authorization');
    if (!token || !token.startsWith("Bearer")) return response.status(401).send('Access Denied');
    token = token.split(" ")[1]
    try {
        const verified = jwt.verify(token, process.env.JWT_KEY);
        next();
    } catch (err) {
        return response.status(400).send('Invalid Token');
    }
};
