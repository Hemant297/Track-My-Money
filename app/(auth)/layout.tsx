import React, { ReactNode } from "react";
import Logo from "@/components/Logo";

function layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-screen w-full flex flex-col justify-center items-center">
      <Logo />
      <div className="mt-12">{children}</div>
    </div>
  );
}

export default layout;
