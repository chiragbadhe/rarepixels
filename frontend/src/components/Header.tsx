import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { ReactNode, useState } from "react";
import ConnectButtonCustom from "./ConnectButton";
import Router, { useRouter } from "next/router";

type Props = {
  setActiveLink: any;
  activeLink: any;
};

function Header({ setActiveLink, activeLink }: Props) {
  //   const [activeLink, setActiveLink] = useState("Create");

  const handleClick = (link: React.SetStateAction<string>) => {
    setActiveLink(link);
  };

  const router = useRouter();

  return (
    <div className="border-b border-white/20">
      <div className="container mx-auto flex justify-between items-center py-[12px]">
        <div
          onClick={() => router.push("/")}
          className="text-green-500 font-bold text-[24px]"
        >
          RarePixels
        </div>
        <nav className="space-x-[20px] text-[16px] opacity-70">
          <span
            className={`${
              activeLink === "Create"
                ? "text-green-400"
                : "hover:text-green-400"
            } duration-300 animate cursor-pointer`}
            onClick={() => handleClick("Create")}
          >
            Create
          </span>
          <span
            className={`${
              activeLink === "Buy" ? "text-green-400" : "hover:text-green-400"
            } duration-300 animate cursor-pointer`}
            onClick={() => handleClick("Buy")}
          >
            Buy
          </span>
          <span
            className={`${
              activeLink === "Dashboard"
                ? "text-green-400"
                : "hover:text-green-400"
            } duration-300 animate cursor-pointer`}
            onClick={() => handleClick("Dashboard")}
          >
            Dashboard
          </span>
        </nav>
        <ConnectButtonCustom />
      </div>
    </div>
  );
}

export default Header;
