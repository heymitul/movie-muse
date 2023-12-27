import React, { Fragment } from 'react';

const MInput = (props) => {
  const error = props.error?.message;

  return (
      <Fragment>
        <label htmlFor='email' className={props.showLabel ? 'text-white mb-1 block' : 'sr-only'}>
          {props.label}
        </label>
        <input
            id={props.id}
            type={props.type}
            name={props.name}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
            className={`block caret-white rounded-md border-0 py-2 shadow-sm ring-inset text-white placeholder:text-white-900  focus:ring-inset ${error ?
                'focus:ring-error bg-transparent ring-error ring-2 text-red-600 caret-red-600' :
                'bg-input focus:ring-input'} focus:ring-2 focus:bg-transparent sm:text-sm sm:leading-6 ${props.classNames ? props.classNames : 'w-full'}`}/>
        <p className={`mt-1 text-xs text-red-600 ${!error ? 'invisible' : 'visible'}`} id='email-error'>{error || 'Enter Valid Email'}</p>
      </Fragment>
  );
};

export default MInput;