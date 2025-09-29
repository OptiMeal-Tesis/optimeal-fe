import PageHeader from "../components/PageHeader";
import { useNavigate } from "react-router-dom"; 
export default function Orders() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Pedidos" onNavigate={() => navigate('/home')}/>
      
      <div className="p-8">
        <h2 className="text-body1 text-gray-500 mb-6">
          Pedidos activos
        </h2>
        
      </div>
    </div>
  );
}
