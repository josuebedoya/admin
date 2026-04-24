import type {ClassValue as CV} from "clsx";
import {clsx} from "clsx";
import {twMerge} from "tailwind-merge";

const cn = (...cls: CV[]) => {
  return twMerge(clsx(cls));
};

export default cn;
