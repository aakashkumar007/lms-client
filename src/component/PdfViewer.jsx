import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist/webpack';

// Set the worker path for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PdfViewer = ({ pdfUrl }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        // Step 1: Fetch the raw file data from the URL
        const response = await fetch(pdfUrl);
        const rawFile = await response.arrayBuffer(); // Get the raw binary data (ArrayBuffer)

        // Step 2: Convert raw data into a Blob
        const blob = new Blob([rawFile], { type: 'application/pdf' });

        // Step 3: Create an Object URL for the Blob
        const pdfBlobUrl = URL.createObjectURL(blob);

        // Step 4: Load and render the PDF using pdf.js
        const pdf = await pdfjsLib.getDocument(pdfBlobUrl).promise;
        const page = await pdf.getPage(1); // Get the first page of the PDF

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 1.5 });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        // Render the page on the canvas
        await page.render(renderContext).promise;
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPdf(); // Call the function to load and render the PDF
  }, [pdfUrl]);

  return <canvas ref={canvasRef} style={{ width: '100%', maxHeight: '80vh' }} />;
};

export default PdfViewer;
