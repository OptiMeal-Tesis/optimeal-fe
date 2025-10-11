import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import CustomTextField from "../components/CustomTextField";
import CustomButton from "../components/CustomButton";
import { apiService } from "../services/api";
import toast from "react-hot-toast";

export default function EditProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    national_id: "",
    email: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    name: false,
    national_id: false
  });
  const [userId, setUserId] = useState<number | null>(null);
  const [originalFormData, setOriginalFormData] = useState({
    name: "",
    national_id: ""
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getCurrentUser();
        
        if (response.success && response.data) {
          const userData = {
            name: response.data.name || "",
            national_id: response.data.national_id?.toString() || "",
            email: response.data.email || ""
          };
          setFormData(userData);
          setOriginalFormData({
            name: userData.name,
            national_id: userData.national_id
          });
          setUserId(Number(response.data.id));
        } else {
          toast.error(response.message || "Error al cargar datos del usuario");
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al cargar datos del usuario");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (field: keyof typeof formData) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      
      if (field === 'national_id') {
        value = value.replace(/\D/g, '');
        value = value.slice(0, 10);
      }
      
      setFormData(prev => ({ ...prev, [field]: value }));
      
      // Real-time validation
      const hasError = validateField(field, value);
      setFieldErrors(prev => ({ ...prev, [field]: hasError }));
    };
  };

  const validateField = (field: keyof typeof formData, value: string): boolean => {
    switch (field) {
      case 'name':
        return value.trim() === "" || value.trim().length < 2;
      case 'national_id':
        return value.trim() === "" || !/^\d{7,10}$/.test(value);
      default:
        return false;
    }
  };

  const formHasChanges = (): boolean => {
    return formData.name.trim() !== originalFormData.name.trim() ||
           formData.national_id.trim() !== originalFormData.national_id.trim();
  };

  const handleSave = async () => {
    
    const errors = {
      name: validateField('name', formData.name),
      national_id: validateField('national_id', formData.national_id),
    };
    
    setFieldErrors(errors);
    if (errors.name || errors.national_id) {
      toast.error("Error al guardar cambios");
      return;
    }

    if (!userId) {
      toast.error("Error: ID de usuario no encontrado");
      return;
    }

    const numericUserId = Number(userId);
    if (isNaN(numericUserId)) {
      toast.error("Error: ID de usuario inválido");
      return;
    }

    setIsSaving(true);
    try {
      const response = await apiService.updateUser(numericUserId, {
        name: formData.name.trim(),
        national_id: formData.national_id.trim(),
      });
      
      if (response.success) {
        toast.success("Perfil actualizado correctamente");
        // Navigate back after showing success message
        setTimeout(() => navigate('/home'), 1500);
      } else {
        toast.error(response.message || "Error al actualizar el perfil");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al actualizar el perfil");
    } finally {
      setIsSaving(false);
    }
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
            helperText={fieldErrors.name ? (formData.name.trim().length < 2 ? "El nombre debe tener al menos 2 caracteres" : "El nombre es obligatorio") : ""}
          />

          <CustomTextField
            label="DNI"
            placeholder="Ingrese su DNI"
            type="tel"
            autoComplete="off"
            value={formData.national_id}
            onChange={handleInputChange('national_id')}
            error={fieldErrors.national_id}
            helperText={fieldErrors.national_id ? (formData.national_id.trim() === "" ? "El DNI es obligatorio" : "El DNI debe tener entre 7-10 dígitos") : ""}
          />

          <CustomTextField
            label="Email"
            placeholder="Ingrese su email"
            type="email"
            autoComplete="email"
            value={formData.email}
            disabled={true}
            helperText="El email no se puede editar"
          />

        </div>

        <div className="mt-6 w-full">
          <CustomButton 
            type="button" 
            fullWidth
            onClick={handleSave}
            disabled={isSaving || !formHasChanges()}
            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300"
          >
            {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
