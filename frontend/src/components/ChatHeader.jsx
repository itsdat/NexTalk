import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthSrore } from "../store/useAuthStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthSrore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            {onlineUsers.includes(selectedUser._id) ? (
              <p className="text-sm text-base-content/70 text-green-500">
                Online
            </p>
            ):(
              <p className="text-sm text-base-content/70 text-gray-500">
                Offline
              </p>
            )}
            
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;