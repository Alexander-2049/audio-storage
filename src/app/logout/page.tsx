import { redirect } from "next/navigation";

const Logout = () => {
  redirect("/api/auth/logout");
};

export default Logout;
