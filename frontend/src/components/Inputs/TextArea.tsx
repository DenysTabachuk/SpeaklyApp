import React from "react";
import styles from "./Inputs.module.css";

type TextareaProps = React.ComponentProps<"textarea"> & {
  label: string;
  className?: string;
};

export default function Textarea({
  className,
  label,
  ...props
}: TextareaProps) {
  return (
    <div className={className || styles.labelInputItem}>
      <label>{label}</label>
      <textarea {...props} />
    </div>
  );
}
