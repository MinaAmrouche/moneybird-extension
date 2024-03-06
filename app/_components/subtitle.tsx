const Subtitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <h6 className="mt-1 mb-5 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
      {children}
    </h6>
  );
};

export default Subtitle;
