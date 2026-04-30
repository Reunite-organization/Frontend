import { Component } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

class ErrorBoundaryClass extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Log to error reporting service
    if (import.meta.env.PROD) {
      // Send to error tracking service
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback 
          error={this.state.error}
          onReset={this.handleReset}
          language={this.props.language || 'en'}
        />
      );
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ error, onReset, language = 'en' }) => {
  const isDevelopment = import.meta.env.DEV;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-[60vh] flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-error/10 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-error" />
        </div>

        {/* Title */}
        <h2 className="font-display text-2xl font-bold text-charcoal mb-3">
          {language === 'am' 
            ? 'የሆነ ችግር ተፈጥሯል' 
            : 'Something went wrong'
          }
        </h2>

        {/* Message */}
        <p className="text-stone mb-8">
          {language === 'am'
            ? 'ይቅርታ እንጠይቃለን። ገጹን እንደገና ለመጫን ይሞክሩ።'
            : 'We apologize for the inconvenience. Please try refreshing the page.'
          }
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <button
            onClick={onReset}
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {language === 'am' ? 'እንደገና ሞክር' : 'Try Again'}
          </button>
          
          <Link
            to="/wanted"
            className="btn-outline inline-flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            {language === 'am' ? 'ወደ መነሻ' : 'Go Home'}
          </Link>
        </div>

        {/* Help Link */}
        <p className="text-sm text-stone">
          {language === 'am' ? 'ችግሩ ከቀጠለ፡ ' : 'If the problem persists: '}
          <a 
            href="/help" 
            className="text-terracotta hover:text-clay"
          >
            {language === 'am' ? 'የእርዳታ ማዕከል' : 'Help Center'}
          </a>
          {' • '}
          <a 
            href="/contact" 
            className="text-terracotta hover:text-clay"
          >
            {language === 'am' ? 'ያግኙን' : 'Contact Us'}
          </a>
        </p>

        {/* Development Error Details */}
        {isDevelopment && error && (
          <div className="mt-8 p-4 bg-charcoal/5 rounded-xl text-left">
            <p className="text-xs font-medium text-stone mb-2">Error Details (Dev Only):</p>
            <pre className="text-xs text-error overflow-auto max-h-48 p-2 bg-charcoal/10 rounded">
              {error.toString()}
              {error.stack && '\n\n' + error.stack}
            </pre>
          </div>
        )}

        {/* Heart Footer */}
        <div className="mt-12 flex items-center justify-center gap-1 text-stone">
          <Heart className="w-4 h-4" />
          <span className="text-xs">Reunite</span>
        </div>
      </div>
    </motion.div>
  );
};

// Wrapper component with language support
export const ErrorBoundary = ({ children, language, onReset }) => {
  return (
    <ErrorBoundaryClass language={language} onReset={onReset}>
      {children}
    </ErrorBoundaryClass>
  );
};

export const withErrorBoundary = (Component, options = {}) => {
  return function WithErrorBoundaryWrapper(props) {
    return (
      <ErrorBoundary {...options}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};
