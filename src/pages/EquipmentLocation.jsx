import PageContainer from '../components/PageContainer';

export default function EquipmentLocation() {
  const panelClasses =
    "p-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-md text-white";

  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold mb-6">Equipment Location</h1>
      <div className="flex flex-col gap-4 h-auto md:flex-row md:h-[500px]">
        <div className={`w-full md:w-1/3 ${panelClasses}`}>Panel 1</div>
        <div className="flex flex-col gap-4 flex-1">
          <div className={`flex-1 ${panelClasses}`}>Panel 2</div>
          <div className="flex flex-col gap-4 flex-1 md:flex-row">
            <div className={`flex-1 ${panelClasses}`}>Panel 3</div>
            <div className={`flex-1 ${panelClasses}`}>Panel 4</div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
