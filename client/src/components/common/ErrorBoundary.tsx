import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
                    <p className="text-sm">{this.state.error?.message}</p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Try again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
} 