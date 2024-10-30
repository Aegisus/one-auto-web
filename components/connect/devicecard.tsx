import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Button } from "@nextui-org/button";

export default function DeviceCard({
  data,
  name,
  actionButton,
  setSelectedDevice,
}: {
  data: any;
  name: string;
  actionButton: string;
  selectedDevice: string | undefined;
  setSelectedDevice: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  // const handlePostRequest = async () => {
  //   try {
  //     const response = await fetch("/api/devices/insert", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ data, name }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }

  //     const result = await response.json();
  //     console.log("Success:", result);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  return (
    <Card className="relative p-4">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md">{name}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="w-[70%]">
        {Object.keys(data).map((key) => (
          <p key={key}>
            {key}: {data[key]}
          </p>
        ))}
      </CardBody>
      {actionButton !== "" && (
        <div className="absolute bottom-3 right-2">
          <Button onClick={() => setSelectedDevice(name)}>
            {actionButton}
          </Button>
        </div>
      )}
    </Card>
  );
}

// (() => {
//   const selectedDeviceObject = findSelectedDevice(
//     devices,
//     selectedDevice
//   );
//   return selectedDeviceObject ? (
//     Object.keys(selectedDeviceObject).map((key) => (
//       <Input
//         key={key}
//         isReadOnly
//         type="text"
//         label={key}
//         variant="bordered"
//         defaultValue={selectedDeviceObject[key]}
//         className="max-w-xs"
//       />
//     ))
//   ) : (
//     <p>Selected device not found</p>
//   );
// })()
