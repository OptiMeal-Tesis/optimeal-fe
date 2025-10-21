import Logo from "../assets/icons/Logo";
import CustomButton from "../components/CustomButton";
import { Link } from "react-router-dom";

export default function SuccessScreen() {
  return (
    <div className="min-h-screen flex items-center p-8">
      <div className="w-full flex flex-col gap-8 text-center">
        <div className="flex justify-center">
          <Logo width={222} height={74}/>
        </div>

        <div className="flex flex-col gap-8">
          <p className="text-sub1-bold text-primary-500">
            ¡Cuenta Creada!
          </p>
          
          <p className="text-sub1 text-gray-700">
            Tu cuenta ha sido creada exitosamente en OptiMeal.
          </p>
          
          <p className="text-sub1 text-gray-700">
            Revisa tu casilla de correo para activar tu cuenta y realizá tu primer pedido.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link to="/login">
            <CustomButton fullWidth>
              Iniciar Sesión
            </CustomButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
