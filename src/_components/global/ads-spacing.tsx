/**
 * AdSpacing component to fill empty slots when there aren't enough news items
 */
export const AdSpacing: React.FC = () => {
    return (
      <div className="w-full bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center min-h-[10.2rem]">
        <p className="text-gray-500 text-sm">Advertisement Space</p>
      </div>
    );
  };
