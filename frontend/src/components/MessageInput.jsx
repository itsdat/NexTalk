import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { File, Send, X } from "lucide-react";

const MessageInput = () => {
    const [text, setText] = useState("");
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);
    const { sendMessage } = useChatStore();

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const newFiles = selectedFiles.map(file => ({
            file,
            preview: file.type.startsWith('image/') 
            ? URL.createObjectURL(file) 
                : null,
            name: file.name,
            type: file.type
        }));
        
        setFiles(prev => [...prev, ...newFiles]);
    };

    const removeFile = (index) => {
        setFiles(prev => {
            const newFiles = [...prev];
            if (newFiles[index].preview) {
                URL.revokeObjectURL(newFiles[index].preview);
            }
            newFiles.splice(index, 1);
            return newFiles;
        });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && files.length === 0) return;

        try {
            // Convert files to base64 if needed
            const filePromises = files.map(async ({ file }) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve({
                        data: reader.result,
                        name: file.name,
                        type: file.type
                    });
                    reader.readAsDataURL(file);
                });
            });

            const processedFiles = await Promise.all(filePromises);

            await sendMessage({
                text: text.trim(),
                files: processedFiles,
            });

            // Clear form
            setText("");
            setFiles([]);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <div className="py-4 px-1 w-full">
            {files.length > 0 && (
                <div className="mb-3 flex flex-wrap items-center gap-2">
                    {files.map((file, index) => (
                        <div key={index} className="relative">
                            {file.preview ? (
                                <img
                                    src={file.preview}
                                    alt={file.name}
                                    className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                                />
                            ) : (
                                <div className="w-20 h-20 flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800">
                                    <div className="text-xs text-center px-2 break-words">
                                        {file.name}
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={() => removeFile(index)}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
                                type="button"
                            >
                                <X className="size-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 px-5 justify-center">
                <div className="flex-1 flex gap-2 items-center">
                    <input
                        type="text"
                        className="w-full input rounded-full shadow-inner shadow-zinc-200 input-sm sm:input-md py-5"
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                    <button
                        type="button"
                        className={`sm:flex btn btn-circle
                        ${files.length > 0 ? "text-emerald-500" : "text-zinc-400"}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <File size={20} />
                    </button>
                </div>
                <button
                    type="submit"
                    className="btn btn-sm btn-circle size-12"
                    disabled={!text.trim() && files.length === 0}
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default MessageInput;