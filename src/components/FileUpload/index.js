import React, { useCallback } from 'react';

import { useDropzone } from 'react-dropzone';

import './FileUpload.css';

function FileUpload({ onFileDrop, imageUrl, dropAreaStyle, dropAndUpload, disabled = false }) {
  const onDrop = useCallback(async (files) => {
    onFileDrop(files);
  }, [ onFileDrop ]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
      <div {...getRootProps()} className={`mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10 cursor-pointer focus-within:outline-none ${isDragActive ?
          '!border-primary/75' :
          ''} min-h-[200px]`}>
        <input {...getInputProps()} disabled={disabled}/>
        {
          isDragActive ? (
              <div className='flex items-center justify-center text-white cursor-pointer' style={dropAreaStyle}>
                <div style={dropAndUpload} className='text-transparent'>Drop here</div>
              </div>
          ) : (
              <div className='flex items-center justify-center text-white cursor-pointer' style={dropAreaStyle}>
                {
                  imageUrl ? (
                      <img src={imageUrl} height={75} width={75} style={{ borderRadius: '8px', objectFit: 'contain' }} alt='file-upload'/>
                  ) : (
                      <div>Click here or Drop image here</div>
                  )
                }
              </div>
          )
        }
      </div>
  );
}

export default FileUpload;