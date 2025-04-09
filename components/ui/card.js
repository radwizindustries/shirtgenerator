
export function Card({ children, className }) {
  return <div className={`rounded-lg shadow-lg ${className}`}>{children}</div>;
}

export function CardContent({ children, className }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
