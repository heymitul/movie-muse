import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Loader, MButton, Modal, Movie } from '../../components';
import { PlusIcon } from '@heroicons/react/24/outline';
import MoviesService from '../../services/movies.service';
import { toast, ToastContainer } from 'react-toastify';
import css from './index.module.css';
import { cloneDeep } from 'lodash';
import { AuthContext } from '../../context/auth.context';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/solid';

const Home = () => {
  const {
    error,
    toggleError
  } = useContext(AuthContext);

  if (error && error.type === 'MOVIE') {
    toast.error(error.message);
    toggleError();
  }

  const [ currentPageNo, setCurrentPage ] = useState(1);
  const [ totalMovies, setTotalMovies ] = useState(0);
  const [ totalPages, setTotalPages ] = useState(0);
  const [ itemsPerPage, setItemsPerPage ] = useState(null);

  const [ openNewMovie, setOpenNewMovie ] = useState(false);

  const [ currentSelectedMovie, setCurrentSelectedMovie ] = useState({});
  const [ fetchingMovies, setFetchingMovies ] = useState(false);
  const [ movies, setMovies ] = useState([]);

  const calculateItemsPerPage = () => {
    const innerWidth = window.innerWidth;
    if (innerWidth < 639) {
      setItemsPerPage(12);
    } else if (innerWidth < 1023) {
      setItemsPerPage(16);
    } else {
      setItemsPerPage(24);
    }
  };

  useEffect(() => {
    calculateItemsPerPage();

    window.addEventListener('resize', calculateItemsPerPage);
    return () => window.removeEventListener('resize', calculateItemsPerPage);
  }, []);

  const refreshPageInfo = () => {
    try {
      if (!itemsPerPage) {
        return;
      }

      setFetchingMovies(true);
      const getData = async () => {
        const paginationInfo = {
          page: currentPageNo,
          limit: itemsPerPage || 24
        };

        const moviesRes = await MoviesService.list(paginationInfo);
        setMovies(moviesRes.records);
        setTotalMovies(moviesRes.totalRecords);
        setTotalPages(moviesRes.totalPages);
        setFetchingMovies(false);
      };

      getData();
    } catch (error) {
      toast.error('Error while fetching movies');
    }
  };

  useEffect(() => {
    refreshPageInfo();
  }, [ currentPageNo, itemsPerPage ]);

  const onCloseModal = (isNewMovieAdded, movieInfo) => {
    setOpenNewMovie(false);
    let clonedMovies = cloneDeep(movies);

    if (isNewMovieAdded) {
      refreshPageInfo();
      return;
    }

    if (!movieInfo) {
      return;
    }

    clonedMovies = clonedMovies.map(((movie) => {
      if (movie.id === movieInfo.id) {
        return {
          ...movieInfo
        };
      }

      return {
        ...movie
      };
    }));

    setMovies(clonedMovies);
  };

  if (!fetchingMovies && !movies.length) {
    return (
        <div className={`h-full mx-auto py-6 px-4 sm:px-6 lg:px-8 container ${css.mainContainer}`}>
          <div className='flex items-center flex-col justify-center'>
            <img src={require('../../assets/Movie illustration.gif')}/>
            <div className='mt-6'>
              <MButton
                  xlarge={true}
                  type='button'
                  onClick={() => {
                    setCurrentSelectedMovie({});
                    setOpenNewMovie(true);
                  }}>
                <PlusIcon className='-ml-0.5 mr-1.5 h-5 w-5' aria-hidden='true'/>
                New Movie
              </MButton>
            </div>
          </div>
          <Modal
              title={'Add new movie'}
              open={openNewMovie} onClose={onCloseModal}
              movieInfo={currentSelectedMovie}/>
        </div>
    );
  }

  return (
      <Fragment>
        <ToastContainer autoClose={2000} position='top-right'/>
        <div className={`${css.mainContainer} mx-auto py-6 px-4 sm:px-6 lg:px-8 container`}>
          <div className='flex items-center justify-between wrap'>
            <div className='flex items-center'>
              <h2 className='text-2xl font-bold leading-7 text-white sm:truncate'>
                My Movies
              </h2>
              <div className='flex'>
                <MButton
                    onClick={() => {
                      setCurrentSelectedMovie({});
                      setOpenNewMovie(true);
                    }}
                    type='button'
                    classNames='ml-3 rounded-full'>
                  <PlusIcon className='h-5 w-5' aria-hidden='true'/>
                </MButton>
              </div>
            </div>
            <div className='flex items-center gap-1'>
              <div className='hidden sm:block body-s mr-2 text-white'>{`Showing ${currentPageNo === 1 ? 1 : ((currentPageNo * itemsPerPage) - itemsPerPage + 1)} to ${currentPageNo * itemsPerPage > totalMovies ?
                  totalMovies :
                  currentPageNo * itemsPerPage} of ${totalMovies} results`}</div>
              <button disabled={currentPageNo < 2} onClick={() => {
                setCurrentPage(currentPageNo - 1);
              }}>
                <ArrowLeftCircleIcon height={32} width={32} color={`${currentPageNo < 2 ? 'darkgray' : 'white'}`} className={`cursor-pointer`}/>
              </button>
              <button disabled={currentPageNo >= totalPages} onClick={() => {
                setCurrentPage(currentPageNo + 1);
              }}>
                <ArrowRightCircleIcon height={32} width={32} color={`${currentPageNo >= totalPages ? 'darkgray' : 'white'}`} className={`cursor-pointer`}/>
              </button>
            </div>
          </div>
          {
            fetchingMovies ? (
                <div className={`flex items-center justify-center mx-auto py-6 px-4 sm:px-6 lg:px-8 container ${css.mainContainer}`}>
                  <Loader classNames='h-12 w-12'/>
                </div>
            ) : (
                <ul role='list' className='mt-12 grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-6 xl:gap-x-8'>
                  {
                    movies.map((movie, index) => (
                        <Movie key={index} movie={movie} onOpenDetails={() => {
                          setCurrentSelectedMovie(movie);
                          setOpenNewMovie(true);
                        }}/>
                    ))
                  }
                </ul>
            )
          }
          <Modal
              title={currentSelectedMovie ? `Edit ${currentSelectedMovie.title}` : 'Add new movie'}
              open={openNewMovie} onClose={onCloseModal}
              movieInfo={currentSelectedMovie}/>
        </div>
      </Fragment>
  );
};

export default Home;