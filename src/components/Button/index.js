import React, { useEffect } from 'react';

const MButton = (props) => {
  let sizeClasses = 'px-2 py-2 text-sm';
  if (props.xSmall) {
    sizeClasses = 'px-2 py-1 text-xs';
  } else if (props.small) {
    sizeClasses = 'px-2 py-1 text-sm';
  } else if (props.large) {
    sizeClasses = 'px-3 py-2 text-sm';
  } else if (props.xlarge) {
    sizeClasses = 'px-3.5 py-2.5 text-l';
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleEnter = async (event) => {
    const { key } = event;
    if (key === 'Enter') {
      await props.onClick(event);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleEnter);
    return () => {
      window.removeEventListener('keydown', handleEnter);
    };
  }, [ handleEnter ]);

  return (
      <button
          tabIndex={0}
          type='button'
          className={`rounded bg-primary opacity-100 font-semibold text-white shadow-sm hover:bg-primary/85 focus:outline-none focus-visible:outline-none flex items-center justify-center ${props.classNames} ${sizeClasses}`}
          onClick={props.onClick}>
        {props.children}
      </button>
  );
};

export default MButton;