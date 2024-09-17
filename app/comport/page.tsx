"use client";
import { useEffect } from "react";
import DeviceCard from "@/components/comport/devicecard";
import { getDevices, type DeviceType } from "@/stores/useFlaskAPIStore";

const Comport = () => {
  const { devices, connectToSSE } = getDevices();

  useEffect(() => {
    connectToSSE();
  }, [connectToSSE]);

  // useEffect(() => {
  //   console.log(devices);
  // }, [devices]);

  return (
    <div>
      <h1>Connected Devices</h1>
      {Object.keys(devices).length > 0 ? (
        Object.values(devices).map((device: DeviceType) => (
          <div key={device.ID_SERIAL} className="mt-3">
            <DeviceCard device={device} />
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Comport;
