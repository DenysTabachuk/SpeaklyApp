import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  glowing?: boolean;
  decline?: boolean;
  accept?: boolean;
  children: ReactNode;
};

export default function GlowingButton({
  children,
  glowing = false,
  decline = false,
  accept = false,
  ...props
}: ButtonProps) {
  const className = `
    ${styles.button}
    ${glowing ? styles.glowing : ""}
    ${decline ? styles.decline : ""}
    ${accept ? styles.accept : ""}
  `.trim();

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}
