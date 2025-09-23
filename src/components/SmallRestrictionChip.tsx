interface RestrictionChipProps {
  children: React.ReactNode;
}

export default function SmallRestrictionChip({ children }: RestrictionChipProps) {
  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center"
      style={{ backgroundColor: 'rgba(13, 71, 161, 0.10)' }}
    >
      {children}
    </div>
  );
}
