import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstanace } from "../lib/axios";
import { useAuthSrore } from "./useAuthStore";


export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstanace.get("/messages/users")
            set({ users: res.data })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUsersLoading: false })
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstanace.get(`/messages/${userId}`)
            set({ messages: res.data })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isMessagesLoading: false })
        }
    },



    sendMessage: async (messageData) => {
        
        const { selectedUser, messages } = get()
        try {
            const res = await axiosInstanace.post(`/messages/send/${selectedUser._id}`, messageData)
            set({ messages: [...messages, res.data] })
            
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    subcribeToMessage: (userId) => {
        const { selectedUser } = get()

        if (!selectedUser) return

        const socket = useAuthSrore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            set({
                messages: [...get().messages, newMessage],
            })
        })
    },

    unSubcribeToMessage: () => {
        const socket = useAuthSrore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}))