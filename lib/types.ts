export interface Step {
  command?: string;
  loop?: {
    type: string; // "periodic" or "ramp"
    interval?: number; // For periodic loops
    start?: number; // For ramp loops
    end?: number; // For ramp loops
    step?: number; // For ramp loops
    delay?: number; // Delay between steps in ramp loops
    command?: string; // Command to execute within the loop
  };
}

export interface FunctionDetails {
  name: string;
  steps: Step[];
  parameters?: Record<string, any>;
  description?: string;
}
