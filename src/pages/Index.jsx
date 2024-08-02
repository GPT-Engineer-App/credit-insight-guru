import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import Dashboard from '../components/Dashboard';

const Index = () => {
  const [keyfileContent, setKeyfileContent] = useState(null);

  const handleFileUpload = (content) => {
    setKeyfileContent(content);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">Firestore User Credits Dashboard</h1>
      {!keyfileContent ? (
        <FileUpload onFileUpload={handleFileUpload} />
      ) : (
        <Dashboard keyfileContent={keyfileContent} />
      )}
    </div>
  );
};

export default Index;
