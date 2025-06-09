import Forbidden from "./pages/Exception/Forbidden/Forbidden";
import { getRolesFromToken } from "./utils/jwtUtils";

const RequireRole = ({ allowedRoles, children }) => {
  const roles = getRolesFromToken();

  const hasRole = roles.some(role => allowedRoles.includes(role));

  if (!hasRole) {
    return <Forbidden/>;
  }

  return children;
};

export default RequireRole;
