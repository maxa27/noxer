import clsx from "clsx";
import TelegramLogo from "@assets/Logo.svg?react";
import common from "../common/Icon.module.scss";
import type { IconProps } from "../common/types";

export default function Telegram({ styles, onClick }: IconProps) {
  return (
    <div
      className={clsx(common["default-svg"], styles?.container ?? "")}
      onClick={() => onClick?.()}
    >
      <TelegramLogo className={styles?.svg} />
    </div>
  );
}