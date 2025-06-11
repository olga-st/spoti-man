import React from 'react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
    return (
        <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">404 - Page Not Found</h2>
            <p className="text-gray-300 mb-8">The page you are looking for does not exist.</p>
            <Link to="/" className="text-green-400 hover:underline">
                Go back to the homepage
            </Link>
        </div>
    );
} 