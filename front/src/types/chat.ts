export interface IChatMessage {
    _id: string;
    text: string;
    userId: string;
    user: {
        username: string;
        avatar?: string;
        role: string;
    };
    userColor: string;
    replyTo?: string;
    casino_game_id?: string;
    game_name?: string;
    game_banner?: string;
    attachment?: string;
    createdAt: string;
}


export interface IChatUser {
    username: string;
    avatar?: string;
    role: string;
};


export interface ISupportChatMessage {
    _id: string;
    text: string;
    senderId: string;
    receiverId: string;
    isAi: boolean;
    sender?: IChatUser;
    receiver?: IChatUser;
    userColor: string;
    replyTo?: string;
    casino_game_id?: string;
    game_name?: string;
    game_banner?: string;
    attachment?: string;
    createdAt: string;
}