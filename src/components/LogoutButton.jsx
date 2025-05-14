import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="ml-3 text-center  text-white bg-red-500 hover:opacity-80 p-3 px-7 rounded-full"
    >
      Logout
    </button>
  );
}
