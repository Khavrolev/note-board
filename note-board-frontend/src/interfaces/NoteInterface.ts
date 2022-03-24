import { UserInterface } from "./UserInterface";

export interface NoteInterface {
  _id: string;
  user: UserInterface;
  left: number;
  top: number;
  color: string;
  text: string;
}
