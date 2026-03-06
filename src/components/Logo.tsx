import React from 'react';
import Image from "next/image";

type LogoProps = {
  width?: number | `${number}`;
  height?: number | `${number}`;
  className?: string;
};

const Logo = ({...ui}: LogoProps) => {
  return (
    <Image
      src="/images/logo/logo.png"
      alt="Logo"
      width={ui?.width ?? 100}
      height={ui?.height ?? 100}
      className={ui?.className}
    />
  );
};

export default Logo;