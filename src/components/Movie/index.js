import React from 'react';

const Movie = ({ movie, onOpenDetails }) => {
  return (
      <li key={movie.coverUrl} className='cursor-pointer select-none relative col-span-1 rounded-lg flex flex-col sm:gap-0.5 focus-visible:outline-none'>
        <div className='h-full w-full group aspect-h-7 block w-full overflow-hidden rounded-lg focus-visible:outline-none'>
          <img src={movie.coverUrl} alt='' className='h-full w-full inline-block object-fill group-hover:opacity-75' onClick={onOpenDetails}/>
          {/*<button type='button' className='absolute inset-0 focus:outline-none'>*/}
          {/*  <span className='sr-only'>View details for {movie.title}</span>*/}
          {/*</button>*/}
        </div>
        <h6 className='mt-2 block truncate sm:body-l text-white'>{movie.title}</h6>
        <p className={`block body-s text-white`}>{movie.releasedYear}</p>
      </li>
  );
};

export default Movie;