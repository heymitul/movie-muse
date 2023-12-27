import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { FileUpload, Loader, MButton, MInput } from '../index';
import { FirebaseService, MoviesService } from '../../services';
import { AuthContext } from '../../context/auth.context';

export default function Modal({ open, onClose, title, movieInfo }) {
  const {
    currentUser,
    toggleError
  } = useContext(AuthContext);

  const [ currentMovieInfo, setCurrentMovieInfo ] = useState({
    id: movieInfo?.id || '',
    title: movieInfo?.title || '',
    releasedYear: movieInfo?.title || '',
    coverUrl: movieInfo?.title || '',
    isNewMovie: !movieInfo?.id
  });

  const [ movieCover, setMovieCover ] = useState(null);
  const [ movieCoverUpdated, setMovieCoverUpdated ] = useState(false);

  const [ upsertMovieLoader, setUpsertMovieLoader ] = useState(false);

  useEffect(() => {
    setCurrentMovieInfo({
      id: movieInfo?.id || '',
      title: movieInfo?.title || '',
      releasedYear: movieInfo?.releasedYear || '',
      coverUrl: movieInfo?.coverUrl || '',
      isNewMovie: !movieInfo?.id
    });
  }, [ movieInfo ]);

  const upsertMovie = async () => {
    try {
      setUpsertMovieLoader(true);
      let coverUrl;
      if (movieCover && movieCoverUpdated) {
        coverUrl = await FirebaseService.uploadFile(currentUser.id, movieCover[0]);
      }

      if (currentMovieInfo.isNewMovie) {
        let movieInfo = {
          title: currentMovieInfo.title,
          releasedYear: currentMovieInfo.releasedYear,
          coverUrl
        };

        movieInfo = await MoviesService.create(movieInfo);
        setUpsertMovieLoader(false);

        setCurrentMovieInfo({
          id: '',
          title: '',
          releasedYear: '',
          coverUrl: ''
        });

        onClose(true, {
          id: movieInfo.id,
          title: movieInfo.title,
          coverUrl: movieInfo.coverUrl,
          releasedYear: movieInfo.releasedYear
        });

        return;
      }

      let updatedMovieInfo = { ...currentMovieInfo };

      if (movieCoverUpdated) {
        console.log({
          coverUrl
        });
        updatedMovieInfo.coverUrl = coverUrl;
      }

      await MoviesService.update(currentMovieInfo.id, updatedMovieInfo);
      setUpsertMovieLoader(false);

      updatedMovieInfo = {
        id: updatedMovieInfo.id,
        title: updatedMovieInfo.title,
        coverUrl: updatedMovieInfo.coverUrl,
        releasedYear: updatedMovieInfo.releasedYear
      };

      setCurrentMovieInfo(updatedMovieInfo);
      onClose(false, updatedMovieInfo);
    } catch (error) {
      setUpsertMovieLoader(false);
      toggleError(error.message, 'MOVIE');
    }
  };

  return (
      <Transition.Root show={open} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={() => onClose(false)}>
          <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'>
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'/>
          </Transition.Child>

          <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
            <div className='flex min-h-full justify-center p-4 text-center items-center sm:p-0'>
              <Transition.Child
                  as={Fragment}
                  enter='ease-out duration-300'
                  enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                  enterTo='opacity-100 translate-y-0 sm:scale-100'
                  leave='ease-in duration-200'
                  leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                  leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-background p-8 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm w-full min-w-auto md:min-w-[550px]'>
                  <div className='flex items-center justify-between mb-12'>
                    <h5 className='text-white truncate mr-8 disabled'>{title}</h5>
                    <XMarkIcon className='h-8 w-8 cursor-pointer absolute top-4 right-4' color='#2BD17E' onClick={() => onClose(false)}/>
                  </div>
                  <form className='bg-background shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl'>
                    <div className='grid max-w-2xl grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6'>
                      <div className='col-span-6 sm:col-span-4'>
                        <MInput
                            id='name'
                            name='name'
                            type='text'
                            value={currentMovieInfo.title}
                            showLabel={true}
                            label='Title'
                            onChange={(event) => {
                              setCurrentMovieInfo((prevState) => {
                                return {
                                  ...prevState,
                                  title: event.target.value
                                };
                              });
                            }}
                            placeholder='Avengers: Endgame'
                            required/>
                      </div>

                      <div className='col-span-6 sm:col-span-4'>
                        <MInput
                            id='year'
                            name='year'
                            type='number'
                            showLabel={true}
                            label='Release Year'
                            value={currentMovieInfo.releasedYear}
                            onChange={(event) => {
                              if (event.target.value?.length < 5) {
                                setCurrentMovieInfo((prevState) => {
                                  return {
                                    ...prevState,
                                    releasedYear: event.target.value
                                  };
                                });
                              }
                            }}
                            placeholder='2019'
                            required/>
                      </div>
                      <div className='col-span-6 sm:col-span-full'>
                        <label htmlFor='cover-photo' className='block mb-1 text-sm font-medium leading-6 text-white'>
                          Cover photo
                        </label>
                        <FileUpload
                            imageUrl={currentMovieInfo.coverUrl}
                            onFileDrop={(files) => {
                              setMovieCoverUpdated(true);
                              setMovieCover(files);
                              setCurrentMovieInfo((prevState) => {
                                return {
                                  ...prevState,
                                  coverUrl: URL.createObjectURL(files[0])
                                };
                              });
                            }}/>
                      </div>
                    </div>
                    <div className='flex items-center justify-end gap-x-2 border-t border-gray-900/10 py-4 mt-8'>
                      <MButton
                          large={true}
                          type='button'
                          classNames='!bg-transparent border !border-1 rounded-lg'
                          onClick={() => onClose(false)}>
                        Cancel
                      </MButton>
                      <MButton
                          large={true}
                          type='button'
                          classNames='rounded-lg w-[80px]'
                          onClick={upsertMovie}>
                        {
                          upsertMovieLoader
                              ? (
                                  <Loader/>
                              )
                              : (
                                  <div>{currentMovieInfo?.isNewMovie ? 'Create' : 'Update'}</div>
                              )
                        }
                      </MButton>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
  );
}
