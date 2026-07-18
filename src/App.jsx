import DocumentPanel from './Screen/DocumentPanel';
import ChatPanel from './Screen/ChatPanel';

function App() {
  return (
    <div className="min-h-screen bg-[#f4ece3] p-4 text-[#2f241c] sm:p-6 lg:p-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-stretch">
        <div className="w-full lg:w-[35%]">
          <DocumentPanel />
        </div>
        <div className="w-full lg:w-[65%]">
          <ChatPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
