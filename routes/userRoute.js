const express =  require("express");
const router = express();
const cookieParser = require('cookie-parser');

router.use(cookieParser())
const path = require('path');
const multer= require("multer")
const userController = require('../controller/userController')
const auth = require("../middlewares/auth")


const bodyParser = require("body-parser");
const session = require("express-session");

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}));
router.use(express.static('public'))



router.use(session({
    secret: 'thisismyss',
    resave: false,
    saveUninitialized: true,
    // other options...
  }));

router.set("view engine", "ejs");
router.set('register', './views')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname,'../public/images'));
    },
    filename:function(req, file, cb){
        const name = Date.now() + '-'+ file.originalname;
        cb(null, name);
    }
});


const upload = multer({storage: storage});

router.get("/register",auth.isLogout, userController.registerLoad);
router.post("/register",upload.single("image"),userController.register);
router.get("/",auth.isLogout, userController.loginLoad);
router.post("/", userController.login);
router.get("/logout",auth.isLogin, userController.logout);
router.get("/dashboard",auth.isLogin,  userController.dashboard);
router.get('/groups',auth.isLogin, userController.loadgroups);
router.post('/groups',upload.single("image"), userController.creategroup);
router.post('/get-members',auth.isLogin, userController.getmembers);
router.post('/add-members',auth.isLogin, userController.addmembers);
router.get('/group-chat',auth.isLogin, userController.groupchat);
router.post('/save-chat',auth.isLogin, userController.saveChat)
router.post('/group-chat-save',auth.isLogin, userController.groupChatSave)
router.post('/load-group-chat',auth.isLogin, userController.loadGroupChat)
router.get("*", (req, res)=>{
    res.redirect("/")
});

module.exports = router;