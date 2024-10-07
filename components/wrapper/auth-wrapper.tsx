import { ReactNode } from "react";

import config from "@/config";

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  if (!config.auth.enabled) {
    return <>{children}</>;
  }

  return { children };
};

export default AuthWrapper;
