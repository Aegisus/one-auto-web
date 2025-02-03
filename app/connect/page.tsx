"use client";

import { useState, useEffect } from "react";
import DeviceCard from "@/components/connect/devicecard";
import { getSimulationDevices, getDevices } from "@/stores/useFlaskAPIStore";
import { useDBDeviceStore, useDBDevices } from "@/stores/useDeviceStore";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import { type DeviceType, type DevicesArray } from "@/db/zod/zodDeviceSchema";
import { type DBDevicesArray } from "@/db/zod/zodDBDeviceSchema";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import CustomModal from "@/components/modal";
import {
  handleFlaskUpdateRequest,
  handleFlaskInsertRequest,
  handleFlaskDeleteRequest,
} from "@/stores/useDeviceStore";

type SingleDevice = DeviceType extends Array<infer U> ? U : never;
type SingleDeviceField = {
  [K in keyof SingleDevice]: SingleDevice[K] | null;
};

type DBDeviceField = {
  uid: string;
  name: string;
  description: string;
  data: SingleDeviceField | null;
  created_at: string | null;
  updated_at: string | null;
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

interface additionalModalProps {
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

const modalConfig: additionalModalProps = {
  size: "md",
  isDismissable: true,
  placement: "center",
  backdrop: "opaque",
};

export default function Connect() {
  const { devices, connectDeviceToSSE } = getSimulationDevices();
  // const { devices, connectDeviceToSSE } = getDevices();
  const { isLoading, error, isValidating } = useDBDevices();
  const { dbDevices } = useDBDeviceStore();

  useEffect(() => {
    const disconnect = connectDeviceToSSE();
    return () => {
      disconnect();
    };
  }, [connectDeviceToSSE]);

  function compareDevices(
    device: SingleDevice,
    dbDevices: DBDevicesArray
  ): string {
    let deviceIdentifier: string | undefined;

    if (isComportDevice(device)) {
      deviceIdentifier = device.ID_SERIAL;
    } else if (isPyvisaDevice(device)) {
      deviceIdentifier = device.IDN;
    } else {
      return "Register Required";
    }

    const matchedDBDevice = findSelectedDBDevice(dbDevices, deviceIdentifier);

    if (!matchedDBDevice || !matchedDBDevice.data) {
      return "Register Required";
    }

    const dbData = matchedDBDevice.data;
    const deviceKeys = Object.keys(device) as (keyof typeof device)[];
    const dbDataKeys = Object.keys(dbData) as (keyof typeof dbData)[];

    if (
      deviceKeys.length === dbDataKeys.length &&
      deviceKeys.every((key) => device[key] === dbData[key])
    ) {
      return "Exact";
    }

    if (deviceKeys.some((key) => device[key] !== dbData[key])) {
      return "Update Required";
    }

    return "Register Required";
  }

  const [selectedDevice, setSelectedDevice] = useState<string | undefined>(
    undefined
  );

  const [selectedDeviceUID, setSelectedDeviceUID] = useState<
    string | undefined
  >(undefined);

  const [deviceRequestData, setDeviceRequestData] =
    useState<DBDeviceField | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<string | undefined>(
    undefined
  );

  const handleDeleteClick = (deviceUID: string | undefined) => {
    setDeviceToDelete(deviceUID);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (deviceToDelete) {
      handleFlaskDeleteRequest(deviceToDelete);
    }
    setIsModalOpen(false);
  };

  const findSelectedDevice = (
    devices: DevicesArray,
    selectedDevice: string | undefined
  ): SingleDeviceField | null => {
    for (const device of devices) {
      if (
        ("ID_SERIAL" in device && device.ID_SERIAL === selectedDevice) ||
        ("IDN" in device && device.IDN === selectedDevice)
      ) {
        return device;
      }
    }
    return null;
  };

  const findSelectedDBDevice = (
    dbdevices: DBDevicesArray,
    selectedDevice: string | undefined
  ): DBDeviceField | null => {
    for (const device of dbdevices) {
      if (
        ("ID_SERIAL" in device.data &&
          device.data.ID_SERIAL === selectedDevice) ||
        ("IDN" in device.data && device.data.IDN === selectedDevice)
      ) {
        return device;
      }
    }
    return null;
  };

  const handleInputChange = (key: string, value: string) => {
    if (deviceRequestData) {
      const keys = key.split(".");
      if (keys.length === 2 && keys[0] === "data") {
        setDeviceRequestData({
          ...deviceRequestData,
          data: {
            ...deviceRequestData.data,
            [keys[1]]: value,
          },
        });
      } else {
        setDeviceRequestData({
          ...deviceRequestData,
          [key]: value,
        });
      }
    }
  };

  const resetStates = () => {
    setSelectedDevice(undefined);
    setDeviceRequestData(null);
    setSelectedDeviceUID(undefined);
  };

  const copyDeviceToDBDeviceField = (
    device: SingleDeviceField,
    selectedDBDeviceObject: DBDeviceField
  ) => {
    setDeviceRequestData({
      ...selectedDBDeviceObject,
      data: {
        ...device,
      },
    });
  };

  return (
    <div className="max-w-7xl">
      <div className="mb-7">
        <Breadcrumbs>
          <BreadcrumbItem onPress={resetStates}>Connect Device</BreadcrumbItem>
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
            setSelectedDeviceUID(selectedDBDeviceObject.uid);
          } else if (!deviceRequestData) {
            const newDBDeviceField: DBDeviceField = {
              uid: "",
              name: "",
              description: "",
              data: selectedDeviceObject,
              created_at: "",
              updated_at: "",
            };
            setDeviceRequestData(newDBDeviceField);
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
                      defaultValue={value as string | undefined}
                      className="max-w-xs mb-4"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex justify-center mb-4">
                    <h2 className="text-lg">Database Device</h2>
                  </div>
                  <Input
                    type="text"
                    label="Name"
                    variant="flat"
                    defaultValue={selectedDBDeviceObject.name}
                    className="max-w-xs mb-4"
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                  <Input
                    type="text"
                    label="UID"
                    variant="flat"
                    defaultValue={selectedDBDeviceObject.uid}
                    className="max-w-xs mb-4"
                    onChange={(e) => handleInputChange("uid", e.target.value)}
                  />
                  <Input
                    type="text"
                    label="Description"
                    variant="flat"
                    defaultValue={selectedDBDeviceObject.description}
                    className="max-w-xs mb-4"
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                  />
                  {Object.entries(deviceRequestData?.data || {}).map(
                    ([key, value]) => (
                      <Input
                        key={key}
                        type="text"
                        label={key}
                        variant="flat"
                        value={String(value)}
                        className="max-w-xs mb-4"
                        onChange={(e) =>
                          handleInputChange(`data.${key}`, e.target.value)
                        }
                      />
                    )
                  )}
                </div>
              </div>
              <div className="flex justify-center gap-3">
                <Button className="w-42" onPress={() => resetStates()}>
                  Back
                </Button>
                <Button
                  className="w-42"
                  color="warning"
                  onPress={() =>
                    copyDeviceToDBDeviceField(
                      selectedDeviceObject,
                      selectedDBDeviceObject
                    )
                  }
                >
                  Retrieve flask data
                </Button>
                <Button
                  className="w-36"
                  color="danger"
                  onPress={() => handleDeleteClick(selectedDeviceUID)}
                >
                  Forget device
                </Button>
                <Button
                  className="w-24 "
                  onPress={() =>
                    handleFlaskUpdateRequest(
                      selectedDeviceUID,
                      deviceRequestData
                    )
                  }
                >
                  Update
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col max-w-7xl">
              <h2 className="text-lg mx-auto mb-3">Register Flask Device</h2>
              <Input
                type="text"
                label="Name"
                variant="flat"
                className="max-w-xs mb-4 mx-auto"
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              <Input
                type="text"
                label="UID"
                variant="flat"
                className="max-w-xs mb-4 mx-auto"
                onChange={(e) => handleInputChange("uid", e.target.value)}
              />
              <Input
                type="text"
                label="Description"
                variant="flat"
                className="max-w-xs mb-4 mx-auto"
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
              {selectedDeviceObject &&
                Object.entries(selectedDeviceObject).map(([key, value]) => (
                  <Input
                    key={key}
                    type="text"
                    label={key}
                    variant="bordered"
                    value={String(value)}
                    className="max-w-xs mb-4 mx-auto"
                    onChange={(e) =>
                      handleInputChange(`data.${key}`, e.target.value)
                    }
                  />
                ))}
              <div className="flex justify-center gap-3">
                <Button className="w-42" onPress={() => resetStates()}>
                  Back
                </Button>
                <Button
                  className="w-24"
                  onPress={() => handleFlaskInsertRequest(deviceRequestData)}
                >
                  Register
                </Button>
              </div>
            </div>
          );
        })()
      ) : devices.length > 0 ? (
        devices.flat().map((device, index) => (
          <div
            key={isComportDevice(device) ? device.ID_SERIAL : device.IDN}
            className="mt-3"
          >
            <div
              onClick={() =>
                setSelectedDevice(
                  isComportDevice(device) ? device.ID_SERIAL : device.IDN
                )
              }
              className="cursor-pointer"
            >
              <DeviceCard
                data={device}
                name={isComportDevice(device) ? device.ID_SERIAL : device.IDN}
                actionRequired={
                  compareDevices(device, dbDevices) === "Exact"
                    ? ""
                    : compareDevices(device, dbDevices)
                }
              />
            </div>
          </div>
        ))
      ) : (
        <p>No devices connected. {devices.length}</p>
      )}

      {isModalOpen && (
        <CustomModal
          {...modalConfig}
          header={<h2>Confirm Delete</h2>}
          body={<p>Are you sure you want to delete this device?</p>}
          footer={
            <>
              <Button onPress={() => setIsModalOpen(false)}>Close</Button>
              <Button color="danger" onPress={confirmDelete}>
                Delete
              </Button>
            </>
          }
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
