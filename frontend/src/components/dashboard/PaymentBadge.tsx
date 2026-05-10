type PaymentBadgeProps = {
  payment: string;
};

const PaymentBadge = ({
  payment,
}: PaymentBadgeProps) => {
  const styles =
    payment === "paid"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span
      className={`px-2 py-1 text-xs rounded ${styles}`}
    >
      {payment}
    </span>
  );
};

export default PaymentBadge;