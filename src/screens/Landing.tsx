import { Link } from "react-router-dom";
import Logo from "../assets/icons/Logo";
import CustomButton from "../components/CustomButton";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 text-center">
        {/* Hero Section */}
        <div className="max-w-2xl mx-auto flex flex-col gap-8">
          {/* Logo - Larger version for landing */}
          <div className="flex justify-center mb-4">
            <Logo width={280} height={96} />
          </div>

          {/* Main heading */}
          <h1 className="text-h2 text-black">
            Tu comida favorita, 
            <span className="text-primary-500"> cuando la necesites</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sub2 text-gray-600 max-w-lg mx-auto">
            Descubrí una nueva forma de disfrutar tus comidas favoritas con Optimeal.
            Hacé tus pedidos en línea y disfrutá de una experiencia única.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link to="/login" className="w-full sm:w-auto">
              <CustomButton 
                fullWidth 
                className="text-body1 py-3 h-14 min-w-[200px]"
              >
                Iniciar Sesión
              </CustomButton>
            </Link>
            
            <Link to="/register" className="w-full sm:w-auto">
              <CustomButton 
                variant="outlined" 
                fullWidth 
                className="text-body1 py-3 h-14 min-w-[200px]"
              >
                Crear Cuenta
              </CustomButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 py-6 px-6" style={{ borderTopColor: 'var(--color-gray-200)' }}>
        <div className="text-center">
          <p className="text-body2 text-gray-500">
            © 2024 Optimeal. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
