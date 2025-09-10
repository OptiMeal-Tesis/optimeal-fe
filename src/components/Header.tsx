import Logo from "../assets/icons/Logo";
import MenuIcon from "../assets/icons/MenuIcon";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <div className="bg-white px-6 py-4 flex items-center justify-between">
      <Logo width={138} height={32} />
      <button
        onClick={onMenuClick}
        aria-label="Abrir menú"
      >
        <MenuIcon width={24} height={25} color="var(--color-primary-500)"/>
      </button>
    </div>
  );
}
