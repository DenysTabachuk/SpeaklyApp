import React from "react";
import styles from "./Inputs.module.css";

//  це утилітний тип TypeScript з React, який дозволяє отримати всі пропси,
// які приймає стандартний HTML-елемент <input>.
type InputProps = React.ComponentProps<"input"> & {
  label: string;
  className?: string;
};

export default function Input({ className, label, ...props }: InputProps) {
  return (
    <div className={className || styles.labelInputItem}>
      <label htmlFor="nickname">{label}</label>
      <input required {...props} />
    </div>
  );
}
