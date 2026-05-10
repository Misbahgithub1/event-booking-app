type StatusBadgeProps = {
  status: string;
};

const StatusBadge = ({
  status,
}: StatusBadgeProps) => {
  const styles =
    status === "confirmed"
      ? "bg-green-100 text-green-700"
      : status === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <span
      className={`px-2 py-1 text-xs rounded ${styles}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;