import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthWrapper;
