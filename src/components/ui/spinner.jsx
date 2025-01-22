export function Spinner({ size = "md" }) {
    const spinnerSize = size === "lg" ? "h-10 w-10" : size === "sm" ? "h-4 w-4" : "h-6 w-6";
  
    return (
      <div className={`animate-spin rounded-full border-t-2 border-r-2 border-gray-500 ${spinnerSize}`}></div>
    );
  }