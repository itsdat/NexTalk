import React, { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import SidebarSkeleton from './SidebarSkeleton';
import { User } from 'lucide-react';
import { useAuthSrore } from '../store/useAuthStore';

const Sidebar = () => {

    const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore()

    const {onlineUsers} = useAuthSrore()

    useEffect(() => {
        getUsers()
    }, [getUsers])

    if (isUsersLoading) return <SidebarSkeleton />

    return (
        <aside className='h-full lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200'>
            <div className='border-y border-base-300 w-full py-5 px-3'>
                <div className='flex items-center justify-center gap-2'>
                    <User className='size-6' />
                    <span className='font-medium hidden lg:block'>Contacts</span>
                </div>
            </div>

            <div className='overflow-y-auto w-full py-3'>
                {users.map((user) => (
                    <button
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={`
                            w-full p3 flex items-center gap-3
                            hover:bg-base-300 transition-colors
                            ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                        `}
                    >

                        <div className='relative mx-auto lg:mx-0 py-3 md:pl-3 '>
                            <img
                                src={user.profilePic || "/avatar.png"}
                                alt={user.fullName}
                                className='size-10 object-cover rounded-full flex items-center justify-center'
                            />

                            {onlineUsers.includes(user._id) && (
                                <span
                                    className='absolute bottom-3 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900'
                                />
                            )}

                        </div>

                        <div className="hidden lg:block text-left min-w-0">
                            <div className="font-medium truncate">{user.fullName}</div>
                            <div className="text-sm text-zinc-400">
                                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                            </div>
                        </div>
                    </button>
                ))}
            </div>

        </aside>
    );
};

export default Sidebar;