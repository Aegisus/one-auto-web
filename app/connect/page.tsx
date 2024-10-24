"use client";

import { useState, useEffect } from "react";
import DeviceCard from "@/components/connect/devicecard";
import { getDevices } from "@/stores/useFlaskAPIStore";
import { useDBDeviceStore, useDBDevices } from "@/stores/useDeviceStore";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { type DeviceType } from "@/db/zodDeviceSchema";
import { type DBDevicesArray } from "@/db/zodDBDeviceSchema";

type SingleDevice = DeviceType extends Array<infer U> ? U : never;

// Type guards
function isComportDevice(device: any): device is {
  com_port: string;
  ID_MODEL: string;
  ID_SERIAL: string;
  ID_FROM_DATABASE: string;
} {
  return "ID_SERIAL" in device;
}

function isPyvisaDevice(device: any): device is {
  IDN: string;
  pyvisa_address: string;
} {
  return "IDN" in device;
}

export default function Connect() {
  // from flask
  const { devices, connectDeviceToSSE } = getDevices();

  // db devices
  const { isLoading, error, isValidating } = useDBDevices();
  const { dbDevices } = useDBDeviceStore();
  useEffect(() => {
    // const deviceUIDs = dbDevices.map((device) => device.uid);
    console.log("dbDevices:", dbDevices);
    // console.log("UIDs:", deviceUIDs);
  }, [dbDevices]);

  useEffect(() => {
    const disconnect = connectDeviceToSSE();
    return () => {
      disconnect();
    };
  }, [connectDeviceToSSE]);

  // Get 'device' param
  // const deviceUIDs = dbDevices.map((device) => device.uid);
  // console.log("dbDevices:", dbDevices);
  // console.log("UIDs:", deviceUIDs);

  function compareDevices(
    device: SingleDevice,
    dbDevices: DBDevicesArray
  ): [string, any, any] {
    const deepEqual = (obj1: any, obj2: any) => {
      const keys1 = Object.keys(obj1).sort();
      const keys2 = Object.keys(obj2).sort();
      if (keys1.length !== keys2.length) return false;
      for (let key of keys1) {
        if (obj1[key] !== obj2[key]) return false;
      }
      return true;
    };

    // Level 1: Exact match
    for (const dbDevice of dbDevices) {
      if (deepEqual(device, dbDevice.data)) {
        return ["Exact", device, dbDevice.data];
      }
    }

    // Level 2: Same keys, different values
    for (const dbDevice of dbDevices) {
      const deviceKeys = Object.keys(device).sort();
      const dbDeviceKeys = Object.keys(dbDevice.data).sort();
      if (JSON.stringify(deviceKeys) === JSON.stringify(dbDeviceKeys)) {
        return ["Update", device, dbDevice.data];
      }
    }

    // Level 3: Similar naming keys and values
    for (const dbDevice of dbDevices) {
      const deviceKeys = Object.keys(device).sort();
      const dbDeviceKeys = Object.keys(dbDevice.data).sort();
      const similarKeys = deviceKeys.filter((key) =>
        dbDeviceKeys.includes(key)
      );
      const similarValues = similarKeys.filter((key) => {
        if (isComportDevice(device) && isComportDevice(dbDevice.data)) {
          return (
            key in device &&
            key in dbDevice.data &&
            device[key as keyof typeof device] ===
              dbDevice.data[key as keyof typeof dbDevice.data]
          );
        } else if (isPyvisaDevice(device) && isPyvisaDevice(dbDevice.data)) {
          return (
            key in device &&
            key in dbDevice.data &&
            device[key as keyof typeof device] ===
              dbDevice.data[key as keyof typeof dbDevice.data]
          );
        }
        return false;
      });

      if (similarKeys.length > 0 && similarValues.length > 0) {
        return ["Update", device, dbDevice.data];
      }
    }

    // Level 4: No match found
    return ["Register", null, null];
  }

  const [selectedDevice, setSelectedDevice] = useState<string | undefined>(
    undefined
  );

  // useEffect(() => {
  //   console.log(devices);
  //   console.log("Device Param:", deviceParam); // Log the device param for testing
  // }, [devices, deviceParam]);

  return (
    <div className="max-w-7xl">
      {selectedDevice && (
        <div className="mb-7">
          <Breadcrumbs>
            <BreadcrumbItem href="/connect">Connect Device</BreadcrumbItem>
            <BreadcrumbItem>{selectedDevice}</BreadcrumbItem>
          </Breadcrumbs>
        </div>
      )}
      <h1>Connected Devices</h1>
      {/* {deviceParam && <p>Device Selected: {deviceParam}</p>} */}
      {devices.length > 0 ? (
        devices.flat().map((device, index) => (
          <div
            key={isComportDevice(device) ? device.ID_SERIAL : device.IDN}
            className="mt-3"
          >
            <DeviceCard
              data={device}
              name={isComportDevice(device) ? device.ID_SERIAL : device.IDN}
              actionButton={
                compareDevices(device, dbDevices)[0] === "Exact"
                  ? ""
                  : compareDevices(device, dbDevices)[0]
              }
              selectedDevice={selectedDevice}
              setSelectedDevice={setSelectedDevice}
            />
          </div>
        ))
      ) : (
        <p>No devices connected.</p>
      )}
    </div>
  );
}
