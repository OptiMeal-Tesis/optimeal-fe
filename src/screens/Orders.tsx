import PageHeader from "../components/PageHeader";

export default function Orders() {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Pedidos" />
      
      <div className="p-8">
        <h2 className="text-body1 text-gray-500 mb-6">
          Pedidos activos
        </h2>
        
      </div>
    </div>
  );
}
