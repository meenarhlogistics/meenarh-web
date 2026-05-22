type FormErrorAlertProps = {
  message?: string | null;
  items?: string[];
  className?: string;
};

export function FormErrorAlert({ message, items, className = "" }: FormErrorAlertProps) {
  const list = items && items.length > 0 ? items : null;
  const text = message?.trim();

  if (!text && !list?.length) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm ${className}`}
    >
      {text && <p>{text}</p>}
      {list && list.length > 1 && (
        <ul className={`list-disc list-inside space-y-1 ${text ? "mt-2" : ""}`}>
          {list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {list && list.length === 1 && !text && <p>{list[0]}</p>}
    </div>
  );
}
