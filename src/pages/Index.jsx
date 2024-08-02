import { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import Dashboard from '../components/Dashboard';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Index = () => {
  const [keyfileContent, setKeyfileContent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedKeyfile = localStorage.getItem('keyfileContent');
    if (savedKeyfile) {
      try {
        const parsedKeyfile = JSON.parse(savedKeyfile);
        if (isValidKeyfile(parsedKeyfile)) {
          setKeyfileContent(parsedKeyfile);
        } else {
          throw new Error('Invalid keyfile format');
        }
      } catch (err) {
        setError('Saved keyfile is invalid. Please upload a new one.');
        localStorage.removeItem('keyfileContent');
      }
    }
  }, []);

  const isValidKeyfile = (content) => {
    return content && content.project_id && content.private_key && content.client_email;
  };

  const handleFileUpload = (content) => {
    if (isValidKeyfile(content)) {
      setKeyfileContent(content);
      localStorage.setItem('keyfileContent', JSON.stringify(content));
      setError(null);
    } else {
      setError('Invalid keyfile format. Please check your file and try again.');
    }
  };

  const handleClearKeyfile = () => {
    setKeyfileContent(null);
    setError(null);
    localStorage.removeItem('keyfileContent');
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">Firestore User Credits Dashboard</h1>
      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
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
