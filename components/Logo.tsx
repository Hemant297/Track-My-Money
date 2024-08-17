import { Coins } from "lucide-react";
import React from "react";

function Logo() {
  return (
    <a href="/" className="flex items-center gap-2">
      <Coins className="stroke h-11 w-11 stroke-blue-500 stroke-[1.5]" />
      <p className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
        Track My Money
      </p>
    </a>
  );
}

export function MobileLogo() {
  return (
    <a href="/" className="flex items-center gap-2">
      <p className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
        Track My Money
      </p>
    </a>
  );
}

export default Logo;
