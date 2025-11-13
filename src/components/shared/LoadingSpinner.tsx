export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-border rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-accent-success border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

