/* eslint-disable react/prop-types */
import React from 'react';

/** Animated circular spinner (border ring with transparent top). */
function Loader({ size = 'h-9 w-9', color = 'border-blue-600' }) {
  return (
    <span
      className={`${size} inline-block animate-spin rounded-full border-2 ${color} border-t-transparent`}
      aria-hidden="true"
      role="status"
    />
  );
}

export default Loader;
