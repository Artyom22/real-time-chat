import { User } from "./user";

export interface Message {
  id: string;
  msg: {
    text?: string;
    sendFrom?: string;
    attachment?: Array<any>;
    createdAt?: number;
    edited?: boolean;
  };
  sender: User;
  newMsg?: boolean;
}
