import React from 'react';

function Loader(props) {
  return (
      <div className={`border-t-transparent border-solid animate-spin rounded-full border-2 border-input ${props.classNames ? props.classNames : 'h-6 w-6'}`}/>
  );
}

export default Loader;