import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js"
import cloudinary from "../lib/cloudi.js"

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body
    try {

        if (!fullName || !password || !email) {
            return res.status(400).json({ message: "Please fill in all fields." })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters " })
        }
        const user = await User.findOne({ email })

        if (user) {
            return res.status(400).json({ message: "Email already exists " })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        })

        if (newUser) {
            //jwt
            generateToken(newUser._id, res)
            await newUser.save();
            return res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        } else {
            return res.status(400).json({ message: "Invalid user data" })
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Serer Error" })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const isPassword = await bcrypt.compare(password, user.password)
        if (!isPassword) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        generateToken(user._id, res)
        return res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body
        const userId = req.user._id

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" })
        }

        const uploadReponse = await cloudinary.uploader.upload(profilePic)
        const updateUser = await User.findByIdAndUpdate(userId, { profilePic: uploadReponse.secure_url }, { new: true })
        res.status(200).json(updateUser)
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const checkAuth = async(req, res) =>{
    try {
        res.status(200).json(req.user)
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}