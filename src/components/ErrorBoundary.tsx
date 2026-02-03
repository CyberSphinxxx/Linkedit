'use client';

import { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        // TODO: Send to error reporting service (e.g., Sentry)
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex items-center justify-center p-8">
                    <div className="text-center max-w-md">
                        <div className="text-6xl mb-4">💥</div>
                        <h2 className="text-xl font-bold text-foreground mb-2">
                            Something went wrong
                        </h2>
                        <p className="text-foreground-muted mb-6">
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleRetry}
                                className="px-4 py-2 rounded-lg bg-primary text-background font-medium hover:opacity-90 transition-opacity"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 rounded-lg border border-surface-elevated text-foreground-muted hover:text-foreground transition-colors"
                            >
                                Reload Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Feature-level error boundary with more context
interface FeatureErrorBoundaryProps {
    children: ReactNode;
    featureName: string;
    onReset?: () => void;
}

export function FeatureErrorBoundary({
    children,
    featureName,
    onReset
}: FeatureErrorBoundaryProps) {
    return (
        <ErrorBoundary
            fallback={
                <div className="p-6 rounded-xl bg-error/10 border border-error/20">
                    <div className="flex items-start gap-3">
                        <div className="text-2xl">⚠️</div>
                        <div>
                            <h3 className="font-semibold text-foreground mb-1">
                                {featureName} failed to load
                            </h3>
                            <p className="text-sm text-foreground-muted mb-3">
                                This feature encountered an error. Your data is safe.
                            </p>
                            {onReset && (
                                <button
                                    onClick={onReset}
                                    className="text-sm text-primary hover:underline"
                                >
                                    Try again
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            }
        >
            {children}
        </ErrorBoundary>
    );
}
