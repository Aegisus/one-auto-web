import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";

export default function DeviceCard({
  data,
  title,
}: {
  data: any;
  title: string;
}) {
  return (
    <Card className="max-w-7xl">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md">{title}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        {Object.keys(data).map((key) => (
          <p key={key}>
            {key}: {data[key]}
          </p>
        ))}
      </CardBody>
      <Divider />
    </Card>
  );
}
