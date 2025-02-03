import ComponentMapping from "@/components/dashboard/ComponentMapping";

const DashboardRenderer: React.FC<{ layouts: any[] }> = ({ layouts }) => {
  return (
    <div className="space-y-6">
      {layouts.map((layout, index) => {
        if (layout.section) {
          const { title, description, components } = layout.section;
          const SectionComponent = ComponentMapping["section"];

          return (
            <SectionComponent
              key={index}
              title={title}
              description={description}
            >
              {/* Handle tabbed components */}
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
        } else if (layout.type === "tabbed" && layout.tabs) {
          return <ComponentMapping.tabs key={index} items={layout.tabs} />;
        }

        return null;
      })}
    </div>
  );
};

export default DashboardRenderer;
