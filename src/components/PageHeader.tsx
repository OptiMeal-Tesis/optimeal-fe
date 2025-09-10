import { useNavigate } from "react-router-dom";
import BackArrowIcon from "../assets/icons/BackArrowIcon";

interface PageHeaderProps {
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-white p-4 flex items-center">
      <button
        onClick={handleBack}
        className="py-3"
      >
        <BackArrowIcon width={24} height={25} color="var(--color-black)" />
      </button>
      <h1 className="text-sub1 font-bold text-black flex-1 text-center">
        {title}
      </h1>
    </div>
  );
}
