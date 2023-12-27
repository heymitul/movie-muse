import React, { Fragment, useContext } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/auth.context';
import { NavLink } from 'react-router-dom';

const navigation = [];

const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' }
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Header() {
  const {
    currentUser,
    logoutUser
  } = useContext(AuthContext);

  const handleItemClick = async (name) => {
    if (name === 'Sign out') {
      await logoutUser();
    }
  };

  return (
      <>
        <div className='min-h-full'>
          <Disclosure as='nav' className='bg-gray-800'>
            {({ open }) => (
                <>
                  <div className='mx-auto px-4 sm:px-6 lg:px-8 container shadow'>
                    <div className='flex h-16 items-center justify-between'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0'>
                          <NavLink
                              to='/'
                              className={({ isActive, isPending }) =>
                                  isPending ? 'pending' : isActive ? 'active' : ''
                              }>
                            <img
                                className='h-12 w-12'
                                src={require('../../assets/logo.png')}
                                alt='Movie Muse'/>
                          </NavLink>
                        </div>
                        <div className='hidden md:block'>
                          <div className='ml-10 flex items-baseline space-x-4'>
                            {navigation.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={classNames(
                                        item.current
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                        'rounded-md px-3 py-2 text-sm font-medium'
                                    )}
                                    aria-current={item.current ? 'page' : undefined}
                                >
                                  {item.name}
                                </a>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className='hidden md:block'>
                        <div className='flex items-center'>

                          {/* Profile dropdown */}
                          <Menu as='div' className='relative'>
                            <div>
                              <Menu.Button className='flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none'>
                                <span className='sr-only'>Open user menu</span>
                                {
                                  currentUser.profilePic ?
                                      (
                                          <img
                                              className='inline-block h-10 w-10 rounded-full'
                                              src={currentUser.profilePic}
                                              alt={currentUser.name || 'Movie Muse User Profile'}/>
                                      ) : (
                                          <span className='inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100'>
                                            <svg className='h-full w-full text-gray-300' fill='currentColor' viewBox='0 0 24 24'>
                                              <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z'/>
                                            </svg>
                                          </span>
                                      )
                                }
                              </Menu.Button>
                            </div>
                            <Transition
                                as={Fragment}
                                enter='transition ease-out duration-100'
                                enterFrom='transform opacity-0 scale-95'
                                enterTo='transform opacity-100 scale-100'
                                leave='transition ease-in duration-75'
                                leaveFrom='transform opacity-100 scale-100'
                                leaveTo='transform opacity-0 scale-95'
                            >
                              <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                                {userNavigation.map((item) => (
                                    <Menu.Item key={item.name}>
                                      {({ active }) => (
                                          <a
                                              onClick={() => handleItemClick(item.name)}
                                              href={item.href}
                                              className={classNames(
                                                  active ? 'bg-gray-100' : '',
                                                  'block px-4 py-2 text-sm text-gray-700'
                                              )}
                                          >
                                            {item.name}
                                          </a>
                                      )}
                                    </Menu.Item>
                                ))}
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                      </div>
                      <div className='-mr-2 flex md:hidden'>
                        {/* Mobile menu button */}
                        <Disclosure.Button className='inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
                          <span className='sr-only'>Open main menu</span>
                          {open ? (
                              <XMarkIcon className='block h-6 w-6' aria-hidden='true'/>
                          ) : (
                              <Bars3Icon className='block h-6 w-6' aria-hidden='true'/>
                          )}
                        </Disclosure.Button>
                      </div>
                    </div>
                  </div>

                  <Disclosure.Panel className='md:hidden'>
                    <div className='space-y-1 px-2 pb-3 pt-2 sm:px-3'>
                      {navigation.map((item) => (
                          <Disclosure.Button
                              key={item.name}
                              as='a'
                              href={item.href}
                              className={classNames(
                                  item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                  'block rounded-md px-3 py-2 text-base font-medium'
                              )}
                              aria-current={item.current ? 'page' : undefined}
                          >
                            {item.name}
                          </Disclosure.Button>
                      ))}
                    </div>
                    <div className='border-t border-gray-700 pb-3 pt-4'>
                      <div className='flex items-center px-5'>
                        <div className='flex-shrink-0'>
                          <img className='h-10 w-10 rounded-full' src={currentUser.profilePic} alt=''/>
                        </div>
                        <div className='ml-3'>
                          <div className='text-base font-medium leading-none text-white'>{`${currentUser.name}`}</div>
                          <div className='text-sm font-medium leading-none text-gray-400'>{currentUser.email}</div>
                        </div>
                        {/*<button*/}
                        {/*    type='button'*/}
                        {/*    className='ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none'*/}
                        {/*>*/}
                        {/*  <span className='sr-only'>View notifications</span>*/}
                        {/*  <BellIcon className='h-6 w-6' aria-hidden='true'/>*/}
                        {/*</button>*/}
                      </div>
                      <div className='mt-3 space-y-1 px-2'>
                        {userNavigation.map((item) => (
                            <Disclosure.Button
                                onClick={() => handleItemClick(item.name)}
                                key={item.name}
                                as='a'
                                href={item.href}
                                className='block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white'
                            >
                              {item.name}
                            </Disclosure.Button>
                        ))}
                      </div>
                    </div>
                  </Disclosure.Panel>
                </>
            )}
          </Disclosure>
        </div>
      </>
  );
}
