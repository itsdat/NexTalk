import React from 'react';
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import { useEffect } from 'react';
import MessageSkeleton from './MessageSkeleton';
import { useAuthSrore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';
import { Image } from 'antd';
import { useRef } from 'react';

const ChatContainer = () => {

    const { messages, getMessages, isMessagesLoading, selectedUser, subcribeToMessage, unSubcribeToMessage } = useChatStore()
    const { authUser } = useAuthSrore()
    const messageEndRef = useRef(null)

    useEffect(() => {
        if (selectedUser?._id) {
            getMessages(selectedUser._id);
        }
        subcribeToMessage()

        return () => unSubcribeToMessage()
    }, [selectedUser?._id, getMessages, subcribeToMessage, unSubcribeToMessage]);

    useEffect(() => {
        if (messageEndRef.current && messages) {
             messageEndRef.current.scrollIntoView({
        })
        }
       
    },[messages])


    if (isMessagesLoading) return (
        <div className='flex-1 flex flex-col overflow-auto'>
            <ChatHeader />
            <MessageSkeleton />
            <MessageInput />
        </div>
    )


    return (
        <div className='flex-1 flex flex-col overflow-auto'>

            <ChatHeader />

            <div className='flex-1 overflow-y-auto p-4 space-y-4 '>
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`chat animate-fadeIn ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                        ref={messageEndRef}
                    >
                        <div className='chat-image avatar'>
                            <div className='size-10 rounded-full border'>
                                <img src={message.senderId === authUser._id ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"} alt="profilePic" />
                            </div>
                        </div>

                        <div className='chat-header mb-1'>
                            <time className='text-xs opacity-50 ml-1'>
                                {formatMessageTime(message.createdAt)}
                            </time>
                        </div>

                        <div className='chat-bubble chat-bubble-primary flex flex-col '>
                            {message.image && (
                                <div
                                    className={`grid gap-2 ${message.image.length === 1
                                            ? 'grid-cols-1'
                                            : message.image.length === 2
                                                ? 'grid-cols-2'
                                                : 'grid-cols-3'
                                        }`}

                                >
                                    {message.image.map((img) => (
                                        <Image
                                            key={img.url}
                                            src={img.url}
                                            alt="image"
                                            className={`rounded-md ${message.image.length === 1
                                                ? 'sm:max-w-[300px]' // 1 hình: giữ nguyên kích thước
                                                : 'sm:max-w-[200px] h-auto' // Nhiều hình: thu nhỏ và chia lưới
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                            {message.text && <p className="mt-2 text-sm break-words">{message.text}</p>}
                        </div>
                    </div>
                ))}
            </div>

            <MessageInput />

        </div>
    );
};

export default ChatContainer;