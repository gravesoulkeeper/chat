// const myIp = "http://192.168.0.106:3000"  //"http://192.168.0.104:3000"
const myIp = ""
const ip = myIp ? myIp : "http://localhost:3000"

const isLoggedIn = async () => {
    try {
        const response = await fetch(`${ip}/api/is-logged-in`, {
            method: 'GET',
            credentials: 'include'
        })
        const data = await response.json()
        return response.ok ? [true, data] : [false, []]
    } catch (error) {
        console.error("Error while getting Authenticate!", error)
        return [false, []]
    }
}

const signIn = async (credentials) => {
    try {
        const response = await fetch(`${ip}/api/sign-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',  // Include cookies in the request
            body: JSON.stringify(credentials)
        })
        const data = await response.json(); // or .text() if the server sends JSON
        return response.ok ? [true, data] : [false, []]

    } catch (error) {
        console.error("Error while Sign in!", error)
        return [false, false]
    }
}

const signUp = async (credentials) => {
    try {
        const response = await fetch(`${ip}/api/sign-up`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',  // Include cookies in the request
            body: JSON.stringify(credentials)
        });

        const data = await response.json(); // or .text() if the server sends JSON
        return response.ok ? [true, data] : [false, []]

    } catch (error) {
        console.error("Error while Sign up!", error)
        return [false, []]
    }
}

const signOut = async () => {
    try {
        const response = await fetch(`${ip}/api/sign-out`, {
            credentials: 'include'
        })
        return response.ok ? true : false
    } catch (error) {
        console.error("Error while Sign out!", error)
        return false
    }
}

const SetProfilePicture = async (img) => {
    try {
        const response = await fetch(`${ip}/api/set-profilePicture`, {
            method: 'POST',
            body: img,
            credentials: 'include'
        })
        return response.ok ? true : false
    } catch (error) {
        console.error("Error while fetching profileImage!", error)
        return false
    }
}

const GetProfilePicture = async () => {
    console.log("Insdie getprofilpicture...")
    try {
        const response = await fetch(`${ip}/api/get-profilePicture`, {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();
        return response.ok ? [true, data] : [false, []]

    } catch (error) {
        console.error("Error while fetching profile!", error)
        return [false, []]
    }
}

//Fetching the username via pagination
const search = async (name, page) => {
    try {
        const response = await fetch(`${ip}/api/search?name=${name}&page=${page}`, {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();
        return response.ok ? [true, data] : [false, []]

    } catch (error) {
        console.error("Error while fetching usernames!", error)
        return [false, []]
    }
}

const getPendings = async (page) => {
    try {
        const response = await fetch(`${ip}/api/get-pendings?page=${page}`, {
            credentials: 'include'
        })
        const data = await response.json()
        return response.ok ? [true, data] : [false, []]
    } catch (error) {
        console.error("Error while fetching pendings!", error)
        return [false, []]
    }
}

const removePending = async (receiver) => {
    try {
        const response = await fetch(`${ip}/api/remove-pending`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(receiver)
        })
        return response.ok ? true : false
    } catch (error) {
        console.error("Error while fetching remove pendings!", error)
        return false
    }
}

//Requesting friends
const sendRequest = async (receiver) => {
    try {
        const response = await fetch(`${ip}/api/send-request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(receiver)
        })
        return response.ok ? true : false

    } catch (error) {
        console.error("Error while Request friend!", error)
        return false
    }
}

const getRequests = async (page) => {
    try {
        const response = await fetch(`${ip}/api/get-requests?page=${page}`, {
            credentials: 'include'
        })
        const data = await response.json()
        return response.ok ? [true, data] : [false, []]

    } catch (error) {
        console.error("Error while fetching request", error)
        return [false, []]
    }
}

const acceptRequest = async (receiver) => {
    try {
        console.log(receiver)
        const response = await fetch(`${ip}/api/accept-request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(receiver)
        })
        return response.ok ? true : false

    } catch (error) {
        console.error("Error while Request friend!", error)
        return false
    }
}

const removeRequest = async (receiver) => {
    try {
        console.log(receiver)
        const response = await fetch(`${ip}/api/remove-request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(receiver)
        })
        return response.ok ? true : false

    } catch (error) {
        console.error("Error while Request friend!", error)
        return false
    }
}

const getFriends = async (page, limit) => {
    try {
        const response = await fetch(`${ip}/api/get-friends?page=${page}&limit=${limit}`, {
            method: 'GET',
            credentials: 'include'
        })
        const data = await response.json()
        return response.ok ? [true, data] : [false, []]

    } catch (error) {
        console.error("Error while fetching request", error)
        return [false, []]
    }
}

const removeFriend = async ({ relationId, senChatId, username }) => {
    try {
        const response = await fetch(`${ip}/api/remove-friend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ relationId, senChatId, username })
        })
        const data = await response.json()
        return response.ok ? true : false
    } catch (error) {
        console.error("Error while remove friends", error)
        return false
    }
}

const searchFriends = async ({ username, page }) => {
    try {
        const response = await fetch(`${ip}/search-friends?username=${username}&page=${page}`, {
            credentials: 'include'
        });
        const data = await response.json();
        return response.ok ? [true, data] : [false, data]
    } catch (error) {
        console.error("Error while search friends", error)
        return false;
    }
}

const createGroup = async (formData) => {
    try {
        const response = await fetch(`${ip}/api/create-group`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        const data = await response.json()
        return response.ok ? [data, true] : ["", false]
    } catch (error) {
        console.error("Error while create group", error)
        return false;
    }
}

const exitGroup = async ({ groupId }) => {
    try {
        const response = await fetch(`${ip}/api/exit-group`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(groupId)
        })

        if (response.ok) return true
        return false

    } catch (error) {
        console.log("Error in exitGoup", error)
        return false
    }
}

const deleteMember = async ({ groupId, friendRelationId, participants, friendChatId }) => {
    try {
        const response = await fetch(`${ip}/api/delete-member`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ groupId, friendRelationId, participants, friendChatId })
        })
        if (response.ok) return true
        return false
    } catch (error) {
        console.log("Error in deleteteMember", error)
        return false;
    }
}

const getMessages = async (page, limit, chatId, timestamp) => {
    console.log("Inside getMessages...", timestamp)
    try {
        const response = await fetch(`${ip}/api/get-messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ page, limit, chatId, timestamp }) //same as {page:page,receiverId:receiverId,timestamp:timestamp}
        })
        const { messages, totalMsgs } = await response.json()
        return response.ok ? [true, { msgs: messages, total_msgs: totalMsgs }] : [false, []]
    } catch (error) {
        console.error("Error while remove friends", error)
        return [false, []]
    }
}


export {
    isLoggedIn,
    signIn,
    signUp,
    signOut,
    GetProfilePicture,
    SetProfilePicture,
    search,
    getPendings,
    removePending,
    sendRequest,
    getRequests,
    acceptRequest,
    removeRequest,
    getFriends,
    removeFriend,
    searchFriends,
    createGroup,
    exitGroup,
    deleteMember,
    getMessages
}