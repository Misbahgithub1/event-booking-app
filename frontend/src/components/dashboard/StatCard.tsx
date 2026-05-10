type StatCardProps = {
  title: string;
  value: number;
};

const StatCard = ({ title, value }: StatCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-gray-500 text-sm">
        {title}
      </h3>

      <p className="text-3xl font-bold mt-2 text-gray-800">
        {value}
      </p>
    </div>
  );
};

export default StatCard;