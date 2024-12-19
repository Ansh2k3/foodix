import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";

const MobileNavLinks = () => {
    const {logout} = useAuth0();
  return (
    <>
      <Link
        className="flex bg-white items-center font-bold hover:text-orange-500 duration-400 ease-in-out"
        to="/user-profile"
      >
        User Profile
      </Link>
      <Button className="flex items-center font-bold hover:bg-gray-500 px-3" onClick={() => logout()}>
        Log Out
      </Button>
    </>
  );
};

export default MobileNavLinks;
