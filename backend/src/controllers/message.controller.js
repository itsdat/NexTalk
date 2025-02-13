import cloudinary from "../lib/cloudi.js"
import { getReceiverSocketId, io } from "../lib/socket.js"
import Message from "../models/message.model.js"
import User from "../models/user.model.js"

export const getUsersForSidebar = async(req, res) => {
    try {
        const loggedInUserId = req.user._id
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password")
        res.status(200).json(filteredUsers)
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"}) 
    }
}

export const getMessages = async(req, res) => {
    try {
        const {id:userToChatId} = req.params
        const myId = req.user._id

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]
        })

        res.status(200).json(messages) 
    } catch (error) {
        res.status(500).json({messages: "Internal Server Error"})
    }
}

export const sendMessageold = async(req, res) => {
    try {
        const {text, image} = req.body
        const {id: receiverId} = req.params
        const senderId = req.user._id

        let imageUrl;
        if (image) {
            const uploadReponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadReponse.secure_url
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })
        await newMessage.save()
        res.status(201).json(newMessage)
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, files } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let fileUrls = [];
        if (files && files.length > 0) {
            for (let file of files) {
                const uploadResponse = await cloudinary.uploader.upload(file.data);
                fileUrls.push({
                    url: uploadResponse.secure_url,
                    name: file.name,
                    type: file.type,
                });
            }
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: fileUrls, // Lưu danh sách file
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId)

        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }
        res.status(201).json(newMessage);
    } catch (error) {
        console.log(
            "Error sending message:",
            error
        );
        
        res.status(500).json({ message: "Internal Server Error" });
    }
};