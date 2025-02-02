'use client'

import React from 'react'
import './globals.css'
import { AuthProvider } from './hooks/useAuth'
import { ToastContainer, Bounce } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { SocketProvider } from './hooks/useSocket'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <SocketProvider>
      <AuthProvider>
        <html lang='en'>
          <ToastContainer
            position='top-right'
            autoClose={300}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='colored'
            transition={Bounce}
          />
          <body className='flex flex-col min-h-screen bg-white text-gray-900'>
            {children}
            <footer className='mt-auto bg-gray-800 text-white py-4'>
              <div className='text-center text-sm'>
                <p>
                  Made with{' '}
                  <span role='img' aria-label='love'>
                    ❤️
                  </span>
                  &nbsp; by&nbsp;
                  <a
                    href='https://www.instagram.com/smoif.buu'
                    target='blank'
                    className='hover:text-blue-700 hover:underline'
                  >
                    SMOIF2024
                  </a>{' '}
                  and{' '}
                  <a
                    href='https://www.bsospace.com'
                    target='blank'
                    className='hover:text-blue-700 hover:underline'
                  >
                    BSO Space
                  </a>
                </p>
              </div>
            </footer>
          </body>
        </html>
      </AuthProvider>
    </SocketProvider>
  )
}
