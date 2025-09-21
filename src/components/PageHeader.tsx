import { useNavigate } from "react-router-dom";
import BackArrowIcon from "../assets/icons/BackArrowIcon";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="sticky top-0 z-40 bg-white p-4 flex items-center relative border-b border-gray-100">
      <button
        onClick={handleBack}
        className="py-3 absolute left-4 z-10"
      >
        <BackArrowIcon width={24} height={25} color="var(--color-black)" />
      </button>
      <div className="flex flex-col gap-1 w-full items-center">
        <p className="text-sub1 text-black">
          {title}
        </p>
        <p className="text-body2 text-gray-400">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
