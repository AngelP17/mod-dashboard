// src/components/FileViewer.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { X, Download, FileText } from 'lucide-react';

const FileViewer = ({ file, onClose }) => {
  const [fileContent, setFileContent] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!file) return;

    // Determine file type
    let type = 'unknown';
    if (file.name.endsWith('.pdf')) {
      type = 'pdf';
    } else if (file.name.endsWith('.txt')) {
      type = 'text';
    } else if (file.name.match(/\.(jpe?g|png|gif|bmp)$/i)) {
      type = 'image';
    }
    setFileType(type);

    // Read file content
    const reader = new FileReader();
    
    reader.onload = (e) => {
      setFileContent(e.target.result);
    };
    
    reader.onerror = () => {
      setError('Failed to read file');
    };
    
    if (type === 'text') {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  }, [file]);

  if (!file) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">{file.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const url = URL.createObjectURL(file);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          {error ? (
            <div className="text-destructive">{error}</div>
          ) : fileContent ? (
            fileType === 'text' ? (
              <pre className="whitespace-pre-wrap font-mono text-sm p-4 bg-muted rounded-md">
                {fileContent}
              </pre>
            ) : fileType === 'pdf' ? (
              <iframe
                src={fileContent}
                className="w-full h-[calc(90vh-120px)]"
                title={file.name}
              />
            ) : fileType === 'image' ? (
              <div className="flex justify-center">
                <img
                  src={fileContent}
                  alt={file.name}
                  className="max-w-full max-h-[calc(90vh-120px)]"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                <FileText className="h-12 w-12 mb-4" />
                <p>This file type cannot be previewed</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    const url = URL.createObjectURL(file);
                    window.open(url, '_blank');
                  }}
                >
                  Open in New Tab
                </Button>
              </div>
            )
          ) : (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FileViewer;