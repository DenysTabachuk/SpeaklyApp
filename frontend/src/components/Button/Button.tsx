import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  glowing?: boolean;
  children: ReactNode;
};

export default function GlowingButton({
  children,
  glowing = false,
  ...props
}: ButtonProps) {
  const className = `
    ${styles.button}
    ${glowing ? styles.glowing : ""}
  `.trim();

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}
