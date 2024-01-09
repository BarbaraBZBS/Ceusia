import express from "express";
const messageRoutes = express.Router();
import auth from "../../middleware/auth.js";
import * as messageCtrl from "../controllers/message.controller.js";

//Add new message
messageRoutes.post("/addmsg", auth, messageCtrl.createMessage);

//Get messages
messageRoutes.post("/getmsgs", messageCtrl.getAllMessages);

//Update on read
//messageRoutes.put("/upd/:id", messageCtrl.updateMsgOnRead);

//Delete chat messages
messageRoutes.delete("/del", auth, messageCtrl.deleteAllMessages);

export default messageRoutes;
