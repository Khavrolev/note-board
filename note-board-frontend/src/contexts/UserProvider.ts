import { createContext } from "react";
import { UserInterface } from "../interfaces/UserInterface";

export const UserContext = createContext<UserInterface | null>(null);
