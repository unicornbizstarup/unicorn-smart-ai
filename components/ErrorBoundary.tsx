import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Notify LINE via Backend
    try {
      // Get user session from localStorage
      const authSessionRaw = localStorage.getItem('sb-fihryxlyovxrqtzqylxw-auth-token'); 
      let userContext = null;
      if (authSessionRaw) {
         try {
             const session = JSON.parse(authSessionRaw);
             const user = session?.user;
             if (user) {
                 userContext = {
                     fullName: user.user_metadata?.full_name,
                     email: user.email,
                     ubcLevel: user.user_metadata?.ubc_level,
                 };
             }
         } catch (e) {
             console.error("Failed to parse auth token:", e);
         }
      }

      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'System Error',
          message: `${error.name}: ${error.message}\n\nStack: ${error.stack}\n\nComponent Stack: ${errorInfo.componentStack}`,
          userContext
        })
      });
    } catch (notifyError) {
      console.error('Failed to send error notification', notifyError);
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">ขออภัย ระบบขัดข้อง</h1>
            <p className="text-gray-500 mb-6 font-thai">
              เกิดข้อผิดพลาดขึ้นในระบบ เราได้ส่งรายละเอียดปัญหานี้ให้ทีมผู้พัฒนาทราบแล้ว กรุณาลองโหลดหน้าเว็บใหม่อีกครั้ง
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors font-thai shadow-md shadow-primary-500/20"
            >
              โหลดหน้าเว็บใหม่
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
