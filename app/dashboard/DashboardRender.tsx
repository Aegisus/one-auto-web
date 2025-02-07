import ComponentMapping from "@/components/dashboard/ComponentMapping";
import { useSelectedKeysStore } from "@/config/store";

const DashboardRenderer: React.FC<{ layouts: any[] }> = ({ layouts }) => {
  // Selected device UID from Zustand store
  const selectedKeys = useSelectedKeysStore((state) => state.selectedKeys);

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
                {/* Handle tabbed components inside sections */}
                {"tabs" in components ? (
                  <ComponentMapping.tabs key={index} items={components.tabs} />
                ) : (
                  <div className="flex flex-col space-y-4">
                    {Object.entries(components as Record<string, any[]>).map(
                      ([key, componentArray]) =>
                        componentArray.map((component, idx) => {
                          const Component = ComponentMapping[component.type];
                          if (!Component) return null;

                          return (
                            <Component
                              key={idx}
                              label={component.label}
                              submitLabel={component.submitLabel}
                              switchLabel={component.switchLabel}
                              placeholder={component.placeholder}
                              title={component.title}
                              function={component.function}
                              dataSource={component.dataSource}
                              {...component} // Pass any additional properties
                            />
                          );
                        })
                    )}
                  </div>
                )}
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
