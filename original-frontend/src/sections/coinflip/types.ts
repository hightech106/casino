import { DialogProps } from "@mui/material";

export interface IUserType {
    _id: string;
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    avatar: string;
    balance: number;
};

export interface ICoinflipRoom {
    api: any;
    _id: string;
    side: boolean;
    amount: number;
    joiner: IUserType;
    createdAt: string;
    creator: IUserType;
    state: 'not' | 'end';
    result: 'creator' | 'joiner';
};

export interface GameDialogProps extends DialogProps {
    open: boolean;
    onClose: () => void;
    data: ICoinflipRoom;
}