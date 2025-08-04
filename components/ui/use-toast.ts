"use client"

import toast from 'react-hot-toast'

// Toast types
export type ToastType = 'success' | 'error' | 'loading' | 'default'

export interface ToastOptions {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  duration?: number
}

// Custom toast hook that mimics the original useToast API
export function useToast() {
  const showToast = ({ title, description, variant = 'default', duration = 4000 }: ToastOptions) => {
    const message = description || title || ''

    if (variant === 'destructive') {
      return toast.error(message, {
        duration,
        style: {
          background: '#fef2f2',
          border: '1px solid #ef4444',
          color: '#991b1b',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#fef2f2',
        },
      })
    }

    return toast.success(message, {
      duration,
      style: {
        background: '#f0f9ff',
        border: '1px solid #10b981',
        color: '#065f46',
      },
      iconTheme: {
        primary: '#10b981',
        secondary: '#f0f9ff',
      },
    })
  }

  return {
    toast: showToast,
  }
}

// Export individual toast functions for direct use
export const toastSuccess = (message: string, options?: { duration?: number }) => {
  return toast.success(message, {
    duration: options?.duration || 3000,
    style: {
      background: '#f0f9ff',
      border: '1px solid #10b981',
      color: '#065f46',
    },
    iconTheme: {
      primary: '#10b981',
      secondary: '#f0f9ff',
    },
  })
}

export const toastError = (message: string, options?: { duration?: number }) => {
  return toast.error(message, {
    duration: options?.duration || 4000,
    style: {
      background: '#fef2f2',
      border: '1px solid #ef4444',
      color: '#991b1b',
    },
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fef2f2',
    },
  })
}

export const toastLoading = (message: string) => {
  return toast.loading(message, {
    style: {
      background: '#f8fafc',
      border: '1px solid #64748b',
      color: '#334155',
    },
  })
}

export const toastPromise = <T>(
  promise: Promise<T>,
  messages: {
    loading: string
    success: string | ((data: T) => string)
    error: string | ((error: any) => string)
  }
) => {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  }, {
    style: {
      minWidth: '250px',
    },
    success: {
      duration: 3000,
      style: {
        background: '#f0f9ff',
        border: '1px solid #10b981',
        color: '#065f46',
      },
    },
    error: {
      duration: 4000,
      style: {
        background: '#fef2f2',
        border: '1px solid #ef4444',
        color: '#991b1b',
      },
    },
  })
}

// Dismiss all toasts
export const dismissToast = (toastId?: string) => {
  if (toastId) {
    toast.dismiss(toastId)
  } else {
    toast.dismiss()
  }
}

// Default export for compatibility
export default toast
