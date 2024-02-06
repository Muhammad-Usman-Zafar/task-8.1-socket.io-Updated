const expressAsyncHandler = require("express-async-handler");
const bcryptjs = require("bcryptjs");
const UserDB = require("../models/UserModel");
const Chat = require("../models/ChatModel");
const Group = require("../models/GroupChat");
const Member = require("../models/MemberModal");
const GroupChat = require("../models/groupchatModal");

const register = expressAsyncHandler(async (req, res)=>{
    try {
        const {name, email, password} = req.body;
    const hashpassword = await bcryptjs.hash(password, 10);
    const user = await UserDB.create({
        name,
        email,
        image: 'images/' + req.file.filename,
        password: hashpassword
    });
    res.render("Register",{ message: "Registeration Successfully" })
    } catch (error) {
        console.error(error);
    }
});

const registerLoad = expressAsyncHandler(async (req, res)=>{
    try {
        res.render("register")
    } catch (error) {
        console.error(error);
    }
});

const loginLoad = expressAsyncHandler(async (req, res)=>{
    try {
        res.render("login")
    } catch (error) {
        console.error(error);
    }
});

const login = expressAsyncHandler(async (req, res)=>{
    try {
        const {email, password} = req.body;
        const user = await UserDB.findOne({ email });
        const checkCredentials = user && await bcryptjs.compare(password, user.password);
        if (checkCredentials) {
            req.session.user = user;
            res.cookie('user', JSON.stringify(user))
            res.redirect("/dashboard")
        }else{
            res.render("login", { message: "email/password is Inccorect" })
        }
    } catch (error) {
        console.error(error);
    }
});

const logout = expressAsyncHandler(async (req, res)=>{
    try {
        res.clearCookie('user')
        req.session.destroy();
        res.redirect('/')
    } catch (error) {
        console.error(error);
    }
});

const dashboard = async (req, res)=>{
    try {
        const users = await UserDB.find({_id: {$nin: [req.session.user._id]}})
        res.render('dashboard',{ user: req.session.user, users: users });
    } catch (error) {
        console.error(error);
    }
};

const saveChat = expressAsyncHandler(async(req, res)=>{
    try {
        let chat = new Chat({
            sender_id: req.body.sender_id,
            reciever_id: req.body.reciever_id,
            message:req.body.message
        })
        var newChat = await chat.save();
        res.status(200).send({success: true, msg: 'Chat Successful', data:newChat})
    } catch (error) {
        res.status(400).send({success: false, msg: error.message})
    }
})

const loadgroups = expressAsyncHandler(async(req, res)=>{
    try {
        const groups = await Group.find({ creator_id: req.session.user._id})
        res.render('groups',{ groups: groups});
    } catch (error) {
        console.error(error);
    }
})

const creategroup = expressAsyncHandler(async(req, res)=>{
    try {
        var group = new Group({
            creator_id: req.session.user._id,
            name: req.body.name,
            image: 'images/'+ req.file.filename,
            limit:req.body.limit
        })
        await group.save();

        const groups = await Group.find({ creator_id: req.session.user._id})
        res.render('groups', {message: req.body.name + 'Group Created Successfuly!', groups: groups});
    } catch (error) {
        console.error(error);
    }
})

const getmembers = expressAsyncHandler(async(req, res)=>{
    try {
        const users = await UserDB.find({_id: {$nin: [req.session.user._id]}})
        res.status(200).send({success: true, data:users})
    } catch (error) {
        res.status(400).send({success: false, msg: error.message})
    }
})

const addmembers = expressAsyncHandler(async(req, res)=>{
    try {
        if(!req.body.members){
            res.status(200).send({success:false, msg: "Please select one member"})
        }else if(req.body.members.length >parseInt(req.body.limit)){
            res.status(200).send({success:false, msg: "You can not add more than "+req.body.limit+" Members."})
        }else{

            await Member.deleteMany({ group_id:req.body.group_id })

            var data= [];

            const members = req.body.members;
            
            for (let index = 0; index < members.length; index++) {
                data.push({
                    group_id:req.body.group_id,
                    user_id:members[index]
                })
                
            }
            await Member.insertMany(data);

            res.status(200).send({success:true,msg: "Members added Successfully."})
        }
        res.status(200).send({success: true})
    } catch (error) {
        res.status(400).send({success: false, msg: error.message})
    }
})

const groupchat = expressAsyncHandler(async(req, res)=>{
    try {
        const myGroups = await Group.find({ creator_id:req.session.user._id })
        const joinedGroups = await Member.find({ user_id:req.session.user._id }).populate('group_id')

        res.render('chat-group',{myGroups:myGroups, joinedGroups: joinedGroups})
    } catch (error) {
        res.status(400).send({success: false, msg: error.message})
    }
})

const groupChatSave = expressAsyncHandler(async(req, res)=>{
    try {

        const GroupChats = new GroupChat({
            sender_id : req.body.sender_id,
            group_id : req.body.group_id,
            message : req.body.message
        });

        var newChat = await GroupChats.save();

        res.send({success: true, chat: newChat})
    } catch (error) {
        res.status(400).send({success: false, msg: error.message})
    }
})
const loadGroupChat = expressAsyncHandler(async(req, res)=>{
    try {

        const groupChats = await GroupChat.find({group_id: req.body.group_id})

        res.send({success: true, chats: groupChats})
    } catch (error) {
        res.status(400).send({success: false, msg: error.message})
    }
})

module.exports = {
    register,
    groupchat,
    registerLoad,
    login,
    loginLoad,
    logout,
    dashboard,
    saveChat,
    loadgroups,
    creategroup,
    getmembers,
    addmembers,
    loadGroupChat,
    groupChatSave
}