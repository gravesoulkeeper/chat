import { removeFriend } from "../../services/api";

const RemoveFriend = ({ setConfirm, friend }) => {

    const handleRemove = async () => {
        console.log("Removing friend : ", friend)
        await removeFriend({ relationId: friend.relationId, senChatId: friend.senChatId, username: friend.username })
        setConfirm(false)
    }
    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-zinc-900 bg-opacity-50">
            <div className="absolute top-1/2 left-1/2 w-[30%] bg-stone-900 rounded-xl hover:cursor-default transform -translate-x-1/2 -translate-y-1/2 shadow-lg">
                {/* Header Section */}
                <div className="bg-stone-700 text-white font-bold text-lg rounded-t-xl p-5 text-center">
                    Confirmation Required
                </div>

                {/* Body Section */}
                <div className="text-center text-white p-6">
                    <p className="text-lg">Are you sure?</p>
                    <p className="mt-2 text-gray-300">
                        Do you want to remove <span className="text-red-700">{friend.username}</span>?
                    </p>
                </div>

                {/* Buttons Section */}
                <div className="flex justify-center gap-8 p-6">
                    <button
                        onClick={handleRemove}
                        className="bg-stone-600 hover:bg-stone-700 text-white font-semibold py-2 px-6 rounded-md shadow-md transition-all duration-300"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={() => setConfirm(false)}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-md shadow-md transition-all duration-300"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RemoveFriend;
