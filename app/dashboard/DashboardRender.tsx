import ComponentMapping from "@/components/dashboard/ComponentMapping";
import { useSelectedKeysStore } from "@/config/zustand/ListboxKeys";
import { useDBDeviceStore, useDBDevices } from "@/stores/useDeviceStore";

type ComportDevice = {
  type: "comport";
  com_port: string;
  ID_MODEL: string;
  ID_SERIAL: string;
  ID_FROM_DATABASE: string;
};

type PyvisaDevice = {
  type: "pyvisa";
  IDN: string;
  pyvisa_address: string;
};

type Device = {
  id: number;
  uid: string;
  name: string;
  description: string;
  data: ComportDevice | PyvisaDevice;
  created_at: string | null;
  updated_at: string | null;
};

const DashboardRenderer: React.FC<{ layouts: any[] }> = ({ layouts }) => {
  // Selected device UID from Zustand store
  const selectedKeys = useSelectedKeysStore((state) => state.selectedKeys);
  const selectedUID = Array.from(selectedKeys)[0] || null;

  // Get device info from Zustand store
  const { isLoading, error, isValidating } = useDBDevices();
  const { dbDevices } = useDBDeviceStore();

  const selectedDBDevice = dbDevices.find(
    (dbDevice: Device) => dbDevice.uid === selectedUID
  );

  let deviceAddress: string | null = null;
  if (selectedDBDevice) {
    const deviceType = selectedDBDevice.data.type;
    if (deviceType === "comport") {
      deviceAddress = selectedDBDevice.data.com_port;
    } else if (deviceType === "pyvisa") {
      deviceAddress = selectedDBDevice.data.pyvisa_address;
    }
  }

  // console.log(deviceAddress);

  return (
    <div className="space-y-6">
      {layouts.map((layout, index) => {
        if (layout.section) {
          const { uid, title, description, components } = layout.section;

          // Only render if the section's UID matches the selected UID
          if (selectedKeys.has(uid)) {
            const SectionComponent = ComponentMapping["section"];

            return (
              <SectionComponent
                key={index}
                title={title}
                description={description}
              >
                <div className="flex flex-col space-y-4">
                  {/* Render default components */}
                  {"default" in components &&
                    (components.default as any[]).map((component, idx) => {
                      const Component = ComponentMapping[component.type];
                      if (!Component) return null;

                      return (
                        <Component
                          key={idx}
                          deviceUID={selectedUID} // Pass UID
                          deviceType={selectedDBDevice?.data.type} // Pass deviceType from device.data.type
                          label={component.label}
                          submitLabel={component.submitLabel}
                          switchLabel={component.switchLabel}
                          defaultValue={component.defaultValue}
                          placeholder={component.placeholder}
                          title={component.title}
                          exeFunction={component.exeFunction}
                          dropdownID={component.dropdownID}
                          outputID={component.outputID}
                          dataSource={component.dataSource}
                          deviceAddress={deviceAddress}
                          {...component} // Pass any additional properties
                        />
                      );
                    })}

                  {/* Render tabbed components */}
                  {"tabs" in components && (
                    <ComponentMapping.tabs
                      key={index}
                      items={components.tabs}
                    />
                  )}
                </div>
              </SectionComponent>
            );
          }
        }
        return null;
      })}
    </div>
  );
};

export default DashboardRenderer;
