import { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import Dashboard from '../components/Dashboard';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [keyfileContent, setKeyfileContent] = useState(null);

  useEffect(() => {
    const savedKeyfile = localStorage.getItem('keyfileContent');
    if (savedKeyfile) {
      setKeyfileContent(JSON.parse(savedKeyfile));
    }
  }, []);

  const handleFileUpload = (content) => {
    setKeyfileContent(content);
    localStorage.setItem('keyfileContent', JSON.stringify(content));
  };

  const handleClearKeyfile = () => {
    setKeyfileContent(null);
    localStorage.removeItem('keyfileContent');
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">Firestore User Credits Dashboard</h1>
      {!keyfileContent ? (
        <FileUpload onFileUpload={handleFileUpload} />
      ) : (
        <>
          <Dashboard keyfileContent={keyfileContent} />
          <div className="mt-8 text-center">
            <Button onClick={handleClearKeyfile} variant="destructive">
              Clear Keyfile
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
