import { Switch } from "@heroui/switch";

interface DashboardSwitchProps {
  switchLabel: string;
  initialState: string;
  defaultSelected: boolean;
}

export default function DashboardSwitch({
  switchLabel,
  defaultSelected,
}: DashboardSwitchProps) {
  return <Switch defaultSelected={defaultSelected}>{switchLabel}</Switch>;
}
