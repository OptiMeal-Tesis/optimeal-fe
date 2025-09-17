import { useState } from "react";
import PageHeader from "../components/PageHeader";
import CustomTextField from "../components/CustomTextField";
import CustomButton from "../components/CustomButton";

export default function EditProfile() {
  const [formData, setFormData] = useState({
    name: "Francisco Cavallaro",
    national_id: "44367288",
    email: "flcavallaro@mail.austral.edu.ar"
  });

  const handleInputChange = (field: keyof typeof formData) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes:", formData);
  };

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Editar Perfil" />
      
      <div className="p-8">
        <div className="flex flex-col gap-6">
          <CustomTextField
            label="Nombre"
            placeholder="Ingrese su nombre completo"
            type="text"
            autoComplete="name"
            value={formData.name}
            onChange={handleInputChange('name')}
          />

          <CustomTextField
            label="DNI"
            placeholder="Ingrese su DNI"
            type="text"
            autoComplete="off"
            value={formData.national_id}
            onChange={handleInputChange('national_id')}
          />

          <CustomTextField
            label="Email"
            placeholder="Ingrese su email institucional"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleInputChange('email')}
          />
        </div>

        <div className="mt-8">
          <CustomButton 
            type="button" 
            fullWidth 
            onClick={handleSave}
            className="bg-gray-500 hover:bg-gray-600"
          >
            Guardar cambios
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
