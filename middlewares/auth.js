const isLogin = (req, res, next)=>{
    try {
        if (req.session.user) {
            
        } else {
            res.redirect("/")
        }
        next();
    } catch (error) {
        console.error(error);
    }
}

const isLogout = (req, res, next)=>{
    try {
        if (req.session.user) {
            res.redirect("/dashboard")
        } 
        next();
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    isLogin,
    isLogout
}