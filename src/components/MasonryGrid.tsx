'use client';

import { ReactNode } from 'react';

interface MasonryGridProps {
    children: ReactNode;
}

export default function MasonryGrid({ children }: MasonryGridProps) {
    return (
        <div
            className="
        columns-1 
        sm:columns-2 
        md:columns-3 
        lg:columns-4 
        xl:columns-5 
        gap-4
      "
        >
            {children}
        </div>
    );
}
