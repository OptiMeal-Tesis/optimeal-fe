import { useNavigate } from "react-router-dom";
import BackArrowIcon from "../assets/icons/BackArrowIcon";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onNavigate?: () => void;
}

export default function PageHeader({ title, subtitle, onNavigate }: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onNavigate) {
      onNavigate();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-white p-4 flex items-center relative border-b border-gray-100">
      <button
        onClick={handleBack}
        className="py-3 absolute left-4 z-10"
      >
        <BackArrowIcon width={24} height={25} color="var(--color-black)" />
      </button>
      <div className="flex flex-col w-full items-center px-12">
        <p className="text-sub1 text-black truncate w-full text-center leading-relaxed py-1">
          {title}
        </p>
        <p className="text-body2 text-gray-400 truncate w-full text-center leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
