import { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Index = () => {
  const [firebaseConfig, setFirebaseConfig] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  });

  useEffect(() => {
    const savedConfig = localStorage.getItem('firebaseConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        if (isValidFirebaseConfig(parsedConfig)) {
          setFirebaseConfig(parsedConfig);
          setFormData(parsedConfig);
        } else {
          throw new Error('Invalid Firebase configuration');
        }
      } catch (err) {
        setError('Saved configuration is invalid. Please enter a new one.');
        localStorage.removeItem('firebaseConfig');
      }
    }
  }, []);

  const isValidFirebaseConfig = (config) => {
    const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    return requiredFields.every(field => config && config[field]);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValidFirebaseConfig(formData)) {
      setFirebaseConfig(formData);
      localStorage.setItem('firebaseConfig', JSON.stringify(formData));
      setError(null);
    } else {
      setError('Invalid Firebase configuration. Please fill in all fields.');
    }
  };

  const handleClearConfig = () => {
    setFirebaseConfig(null);
    setFormData({
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
    });
    setError(null);
    localStorage.removeItem('firebaseConfig');
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
      {!firebaseConfig ? (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <Label htmlFor={key}>{key}</Label>
              <Input
                type="text"
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleInputChange}
                required
              />
            </div>
          ))}
          <Button type="submit" className="w-full">Submit Firebase Configuration</Button>
        </form>
      ) : (
        <>
          <Dashboard firebaseConfig={firebaseConfig} />
          <div className="mt-8 text-center">
            <Button onClick={handleClearConfig} variant="destructive">
              Clear Firebase Configuration
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
