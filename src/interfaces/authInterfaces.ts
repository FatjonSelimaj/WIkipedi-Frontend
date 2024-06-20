import { User } from "./userInterface";

export interface LoginProps {
    onLoginSuccess: (user: User) => void;
}

export interface RegisterProps {
    onRegisterSuccess: () => void;
}
  