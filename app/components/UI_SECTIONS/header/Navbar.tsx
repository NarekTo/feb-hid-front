import React from "react";
import Image from "next/image";
import Logo from "../../../../public/logo.png"

import LoginInfo from "./LoginInfo";

const Navbar: React.FC = () => {
  return (
    <nav>
      <Image src={Logo} width={70} quality={100} alt="Hesco Logo" />
      <LoginInfo/>
    </nav>
  );
};

export default Navbar;