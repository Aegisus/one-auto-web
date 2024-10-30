"use client";

import { useState, useEffect } from "react";
import DeviceCard from "@/components/connect/devicecard";
import { getDevices } from "@/stores/useFlaskAPIStore";
import { useDBDeviceStore, useDBDevices } from "@/stores/useDeviceStore";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { type DeviceType, type DevicesArray } from "@/db/zodDeviceSchema";
import { type DBDevicesArray } from "@/db/zodDBDeviceSchema";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

type SingleDevice = DeviceType extends Array<infer U> ? U : never;
type SingleDeviceField = {
  [K in keyof SingleDevice]: SingleDevice[K] | null;
};

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
  // useEffect(() => {
  //   // const deviceUIDs = dbDevices.map((device) => device.uid);
  //   console.log("dbDevices:", dbDevices);
  //   // console.log("UIDs:", deviceUIDs);
  // }, [dbDevices]);

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

  const [deviceRequestData, setDeviceRequestData] =
    useState<SingleDeviceField | null>(null);

  useEffect(() => {
    console.log(deviceRequestData);
  }, [deviceRequestData]);

  const findSelectedDevice = (
    devices: DevicesArray,
    selectedDevice: string | undefined
  ): DeviceType | null => {
    for (const device of devices) {
      if (
        ("ID_SERIAL" in device && device.ID_SERIAL === selectedDevice) ||
        ("IDN" in device && device.IDN === selectedDevice)
      ) {
        return device;
      }
    }
    return null; // Return null if no matching device is found
  };

  const findSelectedDBDevice = (
    dbdevices: DBDevicesArray,
    selectedDevice: string | undefined
  ): SingleDeviceField | null => {
    for (const device of dbdevices) {
      if (
        ("ID_SERIAL" in device.data &&
          device.data.ID_SERIAL === selectedDevice) ||
        ("IDN" in device.data && device.data.IDN === selectedDevice)
      ) {
        return device.data;
      }
    }
    return null; // Return null if no matching device is found
  };

  const handleUpdateRequest = async () => {
    try {
      const response = await fetch("/api/devices/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deviceRequestData }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setDeviceRequestData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  return (
    <div className="max-w-7xl">
      <div className="mb-7">
        <Breadcrumbs>
          <BreadcrumbItem onClick={() => setSelectedDevice(undefined)}>
            Connect Device
          </BreadcrumbItem>
          {selectedDevice && <BreadcrumbItem>{selectedDevice}</BreadcrumbItem>}
        </Breadcrumbs>
      </div>

      {selectedDevice ? (
        (() => {
          const selectedDeviceObject = findSelectedDevice(
            devices,
            selectedDevice
          );
          const selectedDBDeviceObject = findSelectedDBDevice(
            dbDevices,
            selectedDevice
          );
          if (selectedDBDeviceObject && !deviceRequestData) {
            setDeviceRequestData(selectedDBDeviceObject);
          }
          return selectedDeviceObject && selectedDBDeviceObject ? (
            <div className="flex flex-col">
              <div className="flex justify-center space-x-10">
                <div>
                  <div className="flex justify-center mb-4">
                    <h2 className="text-lg">Flask Device</h2>
                  </div>
                  {Object.entries(selectedDeviceObject).map(([key, value]) => (
                    <Input
                      key={key}
                      isReadOnly
                      type="text"
                      label={key}
                      variant="bordered"
                      defaultValue={value}
                      className="max-w-xs mb-4"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex justify-center mb-4">
                    <h2 className="text-lg">Database Device</h2>
                  </div>
                  {Object.entries(selectedDBDeviceObject).map(
                    ([key, value]) => (
                      <Input
                        key={key}
                        type="text"
                        label={key}
                        variant="flat"
                        defaultValue={String(value)}
                        className="max-w-xs mb-4"
                        onChange={(e) => handleInputChange(key, e.target.value)}
                      />
                    )
                  )}
                </div>
              </div>
              <Button
                className="w-24 mx-auto"
                onClick={() => handleUpdateRequest()}
              >
                Update
              </Button>
            </div>
          ) : (
            <p>Selected device not found</p>
          );
        })()
      ) : // from
      devices.length > 0 ? (
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
        <p>No devices connected. {devices.length}</p>
      )}
    </div>
  );
}
