import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import CustomTextField from "../components/CustomTextField";
import CustomButton from "../components/CustomButton";
import { apiService } from "../services/api";

export default function EditProfile() {
  const [formData, setFormData] = useState({
    name: "",
    national_id: "",
    email: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState({
    name: false,
    national_id: false,
    email: false
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getCurrentUser();
        
        if (response.success && response.data) {
          setFormData({
            name: response.data.name || "",
            national_id: response.data.national_id || "",
            email: response.data.email || ""
          });
        } else {
          setError(response.message || "Error al cargar datos del usuario");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar datos del usuario");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (field: keyof typeof formData) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
      // Clear error when user starts typing
      if (fieldErrors[field]) {
        setFieldErrors(prev => ({ ...prev, [field]: false }));
      }
    };
  };

  const handleSave = () => {
    const errors = {
      name: formData.name.trim() === "",
      national_id: formData.national_id.trim() === "",
      email: formData.email.trim() === ""
    };
    setFieldErrors(errors);
    if (errors.name || errors.national_id || errors.email) {
      return;
    }

    // Missing API call to update profile
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <PageHeader title="Editar Perfil" />
        <div className="p-8 flex justify-center items-center">
          <p className="text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <PageHeader title="Editar Perfil" />
        <div className="p-8">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Editar Perfil" />
      
      <div className="p-8">
        <div className="flex flex-col gap-6 w-full">
          <CustomTextField
            label="Nombre"
            placeholder="Ingrese su nombre completo"
            type="text"
            autoComplete="name"
            value={formData.name}
            onChange={handleInputChange('name')}
            error={fieldErrors.name}
            helperText={fieldErrors.name ? "El nombre es obligatorio" : ""}
          />

          <CustomTextField
            label="DNI"
            placeholder="Ingrese su DNI"
            type="text"
            autoComplete="off"
            value={formData.national_id}
            onChange={handleInputChange('national_id')}
            error={fieldErrors.national_id}
            helperText={fieldErrors.national_id ? "El DNI es obligatorio" : ""}
          />

        </div>

        <div className="mt-6 w-full">
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
