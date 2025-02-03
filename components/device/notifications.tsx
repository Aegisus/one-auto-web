import { useEffect } from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Badge } from "@heroui/badge";
import { motion } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";

type NotificationType = "success" | "fail" | "warning";

interface NotificationsProps {
  type: NotificationType;
  content: string;
  onClose: () => void;
}

const cardProps: Record<NotificationType, object> = {
  success: {},
  fail: { color: "danger" },
  warning: { color: "warning" },
};

export default function Notifications({
  type,
  content,
  onClose,
}: NotificationsProps) {
  const badgeColor =
    type === "fail" ? "danger" : type === "warning" ? "warning" : "default";

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-4 right-4 z-10"
    >
      <Badge
        color={badgeColor}
        onClick={onClose}
        content={<AiOutlineClose className="w-2.5 h-2.5" />}
        className="p-1.5 cursor-pointer"
      >
        <Card className="relative p-1 w-56" {...cardProps[type]}>
          <CardHeader className="flex justify-between items-center">
            <p className="text-xs">{content}</p>
          </CardHeader>
        </Card>
      </Badge>
    </motion.div>
  );
}
