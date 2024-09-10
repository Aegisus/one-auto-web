// import Image from "next/image";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";

type Device = {
  com_port: string;
  ID_MODEL: string;
  ID_SERIAL: string;
  ID_FROM_DATABASE: string;
};

export default function DeviceCard({ device }: { device: Device }) {
  // console.log("Device Data:", JSON.stringify(device, null, 2));

  return (
    <Card className="max-w-7xl">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md">{device.ID_MODEL}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>com_port: {device.com_port}</p>
        <p>ID_MODEL: {device.ID_MODEL}</p>
        <p>ID_SERIAL: {device.ID_SERIAL}</p>
        <p>ID_FROM_DATABASE: {device.ID_FROM_DATABASE}</p>
      </CardBody>
      <Divider />
    </Card>
  );
}
