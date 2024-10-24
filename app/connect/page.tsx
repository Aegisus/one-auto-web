"use client";
import { useEffect } from "react";
import DeviceCard from "@/components/connect/devicecard";
import { getDevices } from "@/stores/useFlaskAPIStore";

// Type guards
function isComportDevice(device: any): device is {
  com_port: string;
  ID_MODEL: string;
  ID_SERIAL: string;
  ID_FROM_DATABASE: string;
} {
  return "ID_SERIAL" in device;
}

export default function Connect() {
  const { devices, connectDeviceToSSE } = getDevices();

  useEffect(() => {
    const disconnect = connectDeviceToSSE();
    return () => {
      disconnect();
    };
  }, [connectDeviceToSSE]);

  useEffect(() => {
    console.log(devices);
  }, [devices]);

  return (
    <div className="max-w-7xl">
      <h1>Connected Devices</h1>
      {devices.length > 0 ? (
        devices.flat().map((device, index) => (
          <div
            key={isComportDevice(device) ? device.ID_SERIAL : device.IDN}
            className="mt-3"
          >
            <DeviceCard
              data={device}
              name={isComportDevice(device) ? device.ID_SERIAL : device.IDN}
              actionButton={"Register"}
            />
          </div>
        ))
      ) : (
        <p>No devices connected.</p>
      )}
    </div>
  );
}
