import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import React, { ReactNode } from "react";

interface ModalProps {
  header: ReactNode;
  body: ReactNode;
  footer: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  size:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full";
  isDismissable: boolean;
  placement:
    | "center"
    | "auto"
    | "top"
    | "top-center"
    | "bottom"
    | "bottom-center";
  backdrop: "transparent" | "opaque" | "blur";
}

export default function CustomModal({
  header,
  body,
  footer,
  isOpen,
  onClose,
  size,
  isDismissable,
  placement,
  backdrop,
}: ModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      size={size}
      isDismissable={isDismissable}
      placement={placement}
      backdrop={backdrop}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{header}</ModalHeader>
        <ModalBody>{body}</ModalBody>
        <ModalFooter>{footer}</ModalFooter>
      </ModalContent>
    </Modal>
  );
}
