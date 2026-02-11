import React from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const ExportButton = ({ songs }) => {
  const handleExport = async () => {
    const zip = new JSZip();

    for (const song of songs) {
      try {
        const response = await fetch(song.url);
        if (!response.ok) throw new Error(`Ошибка загрузки: ${song.url}`);
        const blob = await response.blob();

        const safeName = `${song.artist} - ${song.album} - ${song.title}.mp3`
          .replace(/[\/\\?%*:|"<>]/g, '_'); 

        zip.file(safeName, blob);
      } catch (err) {
        console.error(err);
      }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'songs.zip');
  };

  return (
    <button onClick={handleExport}>
      Экспорт
    </button>
  );
};

export default ExportButton;
