import { createPortal } from "react-dom";
import styles from "./Modal.module.css";
import Button from "../Button/Button";

type ModalProps = {
  children: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function Modal({ children, onConfirm, onCancel }: ModalProps) {
  return createPortal(
    <div className={styles.ModalOverlay}>
      <div className={styles.Modal}>
        {children}
        <div className={styles.ButtonContainer}>
          <Button glowing accept onClick={onConfirm}>
            Так
          </Button>
          <Button glowing decline onClick={onCancel}>
            Ні
          </Button>
        </div>
      </div>
    </div>,
    document.getElementById("modal")! // 👉 напряму в body
  );
}
