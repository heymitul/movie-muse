import React, { Fragment, useContext, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Loader, MButton, MInput } from '../../components/index';
import { AuthContext } from '../../context/auth.context';
import { useNavigate } from 'react-router';

export default function Login() {
  const history = useNavigate();

  const {
    authPending,
    authenticateUser,
    error,
    toggleError
  } = useContext(AuthContext);

  if (error && error.type === 'COMMON') {
    toast.error(error.message);
    toggleError();
  }

  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ repeatPassword, setRepeatPassword ] = useState('');

  const handleButtonClick = async (event) => {
    event.preventDefault();

    const authenticated = await authenticateUser({
      name,
      email,
      password,
      repeatPassword,
      register: true
    });

    if (authenticated) {
      history('/');
    }
  };

  return (
      <Fragment>
        <ToastContainer autoClose={2000} position='top-right'/>
        <div className='flex items-center min-h-full flex-1 bg-background text-white'>
          <div className='mx-auto w-full max-w-sm lg:w-96 px-6 sm:px-0'>
            <div>
              <img
                  className='h-12 sm:h-16 w-auto m-auto '
                  src={require('../../assets/logo.png')}
                  alt='Movie Muse'/>
              <h2 className='mt-8 mb-2 tracking-tight text-white text-[12px] md:text-[14px] text-center'>
                Sign up to find your next cinematic muse
              </h2>
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-4'>
                  <div className='mt-2'>
                    <MInput
                        id='name'
                        name='name'
                        type='text'
                        required
                        onChange={(event) => {
                          setName(event.target.value);
                          if (error) {
                            toggleError();
                          }
                        }}
                        error={error?.type === 'NAME' ? error : null}
                        placeholder='Name'
                        classNames='block w-full rounded-md border-0 py-2 shadow-sm ring-inset text-white placeholder:text-white-900 focus:ring-inset focus:ring-input sm:text-sm sm:leading-6 bg-input'/>
                  </div>

                  <div>
                    <MInput
                        id='email'
                        name='email'
                        type='email'
                        onChange={(event) => {
                          setEmail(event.target.value);
                          if (error) {
                            toggleError();
                          }
                        }}
                        placeholder='Email'
                        error={error?.type === 'EMAIL' ? error : null}
                        required
                        classNames='block w-full rounded-md border-0 py-2 shadow-sm text-white placeholder:text-white-900 focus:ring-input sm:text-sm sm:leading-6 bg-input'/>
                  </div>

                  <div>
                    <MInput
                        id='password'
                        name='password'
                        type='password'
                        onChange={(event) => {
                          setPassword(event.target.value);
                          if (error) {
                            toggleError();
                          }
                        }}
                        error={error?.type === 'PASSWORD' ? error : null}
                        placeholder='Password'
                        required
                        classNames='block w-full rounded-md border-0 py-2 shadow-sm ring-inset text-white placeholder:text-white-900 focus:ring-inset focus:ring-input sm:text-sm sm:leading-6 bg-input'/>
                  </div>

                  <div>
                    <MInput
                        id='rPassword'
                        name='rPassword'
                        type='password'
                        onChange={(event) => {
                          setRepeatPassword(event.target.value);
                          if (error) {
                            toggleError();
                          }
                        }}
                        error={error?.type === 'REPEAT_PASSWORD' ? error : null}
                        placeholder='Repeat Password'
                        required
                        classNames='block w-full rounded-md border-0 py-2 shadow-sm ring-inset text-white placeholder:text-white-900 focus:ring-inset focus:ring-input sm:text-sm sm:leading-6 bg-input'/>
                  </div>
                </div>

                <div>
                  <div className='flex items-center justify-end mb-3'>
                    <p className='text-sm leading-6'>
                      Already a member?{' '}
                      <a href='!#' className='font-semibold text-white hover:text-white-500' onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        history('/login');
                      }}>
                        Login here
                      </a>
                    </p>
                  </div>
                  <MButton
                      xlarge={true}
                      classNames='w-full'
                      onClick={handleButtonClick}>
                    {
                      authPending
                          ? (
                              <Loader classNames='h-7 w-7'/>
                          )
                          : (
                              <div className='p-[2px]'>Register</div>
                          )
                    }
                  </MButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
  );
}
