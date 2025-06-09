export const getRolesFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return [];

  try {
    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(atob(payloadBase64));
    return payload.roles || [];
  } catch (error) {
    console.error("Invalid token", error);
    return [];
  }
};
