"use client"

import { Toaster as HotToaster } from 'react-hot-toast'

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: '',
        duration: 4000,
        style: {
          background: '#fff',
          color: '#363636',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          padding: '16px',
          fontSize: '14px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        // Default options for specific types
        success: {
          duration: 3000,
          style: {
            background: '#f0f9ff',
            border: '1px solid #10b981',
            color: '#065f46',
          },
          iconTheme: {
            primary: '#10b981',
            secondary: '#f0f9ff',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: '#fef2f2',
            border: '1px solid #ef4444',
            color: '#991b1b',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fef2f2',
          },
        },
        loading: {
          duration: Infinity,
          style: {
            background: '#f8fafc',
            border: '1px solid #64748b',
            color: '#334155',
          },
        },
      }}
    />
  )
}
