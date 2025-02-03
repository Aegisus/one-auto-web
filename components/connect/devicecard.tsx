import { Card, CardHeader, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { Badge } from "@heroui/badge";

export default function DeviceCard({
  data,
  name,
  actionRequired,
}: // setSelectedDevice,
{
  data: any;
  name: string;
  actionRequired: string;
  // selectedDevice: string | undefined;
  // setSelectedDevice: React.Dispatch<React.SetStateAction<string | undefined>>;
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
      <CardHeader className="flex justify-between">
        <p className="text-md">{name}</p>
        {actionRequired !== "" && (
          <Badge content="" color="warning" variant="shadow">
            <Button
              radius="lg"
              disableRipple
              disableAnimation
              size="sm"
              className="cursor-default"
            >
              {actionRequired}
            </Button>
          </Badge>
        )}
      </CardHeader>
      <Divider />
      <CardBody className="w-[70%]">
        {Object.keys(data).map((key) => (
          <p key={key}>
            {key}: {data[key]}
          </p>
        ))}
      </CardBody>
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
