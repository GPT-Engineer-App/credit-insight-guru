import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

const FileUpload = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onabort = () => console.log('File reading was aborted');
    reader.onerror = () => console.log('File reading has failed');
    reader.onload = () => {
      const content = JSON.parse(reader.result);
      onFileUpload(content);
    };

    reader.readAsText(file);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/json': ['.json'] } });

  return (
    <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 transition-colors">
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      {
        isDragActive ?
          <p className="mt-4 text-lg">Drop the Firestore keyfile here ...</p> :
          <p className="mt-4 text-lg">Drag 'n' drop the Firestore keyfile here, or click to select it</p>
      }
    </div>
  );
};

export default FileUpload;
