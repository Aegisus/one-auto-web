"use client";
import { useEffect } from "react";
import DeviceCard from "@/components/card";
import {
  getDevices,
  type ComportDeviceType,
  type PyvisaDeviceType,
} from "@/stores/useFlaskAPIStore";

const Comport = () => {
  const {
    comportDevices,
    connectComportToSSE,
    pyvisaDevices,
    connectPyvisaToSSE,
  } = getDevices();

  useEffect(() => {
    connectComportToSSE();
    connectPyvisaToSSE();
  }, [connectComportToSSE, connectPyvisaToSSE]);

  const allDevices: Record<string, ComportDeviceType | PyvisaDeviceType> = {
    ...comportDevices,
    ...pyvisaDevices,
  };

  // useEffect(() => {
  //   console.log(allDevices);
  // }, [allDevices]);

  return (
    <div>
      <h1>Connected Devices</h1>
      {Object.keys(allDevices).length > 0 ? (
        Object.values(allDevices).map(
          (device: ComportDeviceType | PyvisaDeviceType) => {
            return (
              <div
                key={"IDN" in device ? device.IDN : device.ID_SERIAL}
                className="mt-3"
              >
                <DeviceCard
                  data={device}
                  title={"IDN" in device ? device.IDN : device.ID_SERIAL}
                />
              </div>
            );
          }
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Comport;
