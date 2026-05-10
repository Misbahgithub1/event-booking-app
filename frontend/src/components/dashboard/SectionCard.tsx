import { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  children: ReactNode;
};

const SectionCard = ({
  title,
  children,
}: SectionCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-10">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        {title}
      </h2>

      {children}
    </div>
  );
};

export default SectionCard;