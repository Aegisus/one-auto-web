import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";
import ComponentMapping from "@/components/dashboard/ComponentMapping";

interface TabItem {
  type: string;
  label?: string;
  title?: string;
  placeholder?: string;
  submitLabel?: string;
  function?: string;
}

interface TabsProps {
  items: TabItem[];
}

const CustomTabs: React.FC<TabsProps> = ({ items }) => {
  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Dynamic Tabs">
        {items.map((item, index) => {
          const Component = ComponentMapping[item.type];

          return (
            <Tab
              key={index}
              title={item.label || item.title || `Tab ${index + 1}`}
            >
              <Card>
                <CardBody>
                  <div className="py-4">
                    {Component ? (
                      item.type === "form" ? (
                        <Component
                          label={item.label || "Untitled"}
                          placeholder={item.placeholder || ""}
                          submitLabel={item.submitLabel}
                          function={item.function}
                        />
                      ) : (
                        <Component {...item} />
                      )
                    ) : (
                      <p>Unsupported component type.</p>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Tab>
          );
        })}
      </Tabs>
    </div>
  );
};

export default CustomTabs;
