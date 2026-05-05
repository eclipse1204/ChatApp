/* eslint-disable react/prop-types */
import React from 'react';

function Loader({ size = 'h-5 w-5', color = 'border-white' }) {
  return (
    <span
      className={`${size} inline-block animate-spin rounded-full border-2 ${color} border-t-transparent`}
      aria-hidden="true"
    />
  );
}

export function Button({
  type = 'button',
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  loaderText = 'Please wait...',
  children,
}) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-80`}
    >
      <span className="inline-flex items-center justify-center gap-2">
        {isLoading && <Loader size="h-4 w-4" />}
        {isLoading ? loaderText : children}
      </span>
    </button>
  );
}

export default Button;
