import { Fragment, useContext } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Outlet } from 'react-router';
import { AuthContext } from '../../context/auth.context';

const userNavigation = [
  { name: 'Sign out', href: '#' }
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Layout() {
  const {
    logoutUser
  } = useContext(AuthContext);
  return (
      <>
        <div className='min-h-full'>
          <Disclosure as='nav' className='bg-gray-800'>
            {({ open }) => (
                <>
                  <div className='bg-primary/50 mx-auto px-4 sm:px-6 lg:px-8 container'>
                    <div className='flex h-16 items-center justify-between'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0'>
                          <img
                              className='h-8 w-auto'
                              src={require('../../assets/logo.png')}
                              alt='Your Company'
                          />
                        </div>
                      </div>
                      <div className='hidden md:block'>
                        <div className='ml-4 flex items-center md:ml-6'>
                          {/* Profile dropdown */}
                          <Menu as='div' className='relative ml-3'>
                            <div>
                              <Menu.Button className='relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus-visible:outline-none'>
                                <span className='absolute -inset-1.5 focus:outline-none focus-visible:outline-none'/>
                                <span className='sr-only'>Open user menu</span>
                                <img className='h-8 w-8 rounded-full' src='https://i.pravatar.cc/500' alt=''/>
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
                                          <div
                                              onClick={logoutUser}
                                              className={classNames(
                                                  active ? 'bg-gray-100' : '',
                                                  'block px-4 py-2 text-sm text-gray-700 cursor-pointer'
                                              )}>
                                            {item.name}
                                          </div>
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
                        <Disclosure.Button className='relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus-visible:outline-none'>
                          <span className='absolute -inset-0.5 focus:outline-none focus-visible:outline-none'/>
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
                    <div className='border-t border-gray-700 pb-3 pt-4'>
                      <div className='space-y-1 px-2'>
                        {userNavigation.map((item) => (
                            <Disclosure.Button
                                key={item.name}
                                as='div'
                                onClick={logoutUser}
                                className='block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white cursor-pointer'>
                              {item.name}
                            </Disclosure.Button>
                        ))}
                      </div>
                    </div>
                  </Disclosure.Panel>
                </>
            )}
          </Disclosure>
          <main className='bg-background overflow-y-auto'>
            <Outlet/>
          </main>
        </div>
      </>
  );
}