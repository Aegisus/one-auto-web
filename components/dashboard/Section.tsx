import React from "react";

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, description, children }) => {
  return (
    <div className="pb-4 rounded-2xl">
      <h2 className="text-xl font-semibold">{title}</h2>
      {description && <p className="text-sm">{description}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
};

export default Section;
