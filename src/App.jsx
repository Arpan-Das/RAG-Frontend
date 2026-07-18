import DocumentPanel from './Screen/DocumentPanel';
import ChatPanel from './Screen/ChatPanel';

function App() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f4ece3] p-4 text-[#2f241c] sm:p-6 lg:p-8">
      <div className="mx-auto flex h-[calc(100vh-2rem)] max-w-7xl flex-col gap-6 overflow-hidden lg:h-[calc(100vh-3rem)] lg:flex-row lg:items-stretch">
        <div className="w-full lg:w-[35%]">
          <DocumentPanel />
        </div>
        <div className="min-h-0 w-full lg:w-[65%]">
          <ChatPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
