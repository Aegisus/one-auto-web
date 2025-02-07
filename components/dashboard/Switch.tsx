import { Switch } from "@heroui/switch";

interface DashboardSwitchProps {
  switchLabel: string;
}

export default function DashboardSwitch({ switchLabel }: DashboardSwitchProps) {
  return <Switch defaultSelected>{switchLabel}</Switch>;
}
