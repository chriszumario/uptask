export default function ErrorMessage({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mt-1 text-sm text-red-500 font-bold"
      role="alert"
      aria-label="Validation error"
    >
      {children}
    </p>
  );
};
;