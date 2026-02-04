'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useSettings } from '@/context/SettingsContext';

interface MasonryGridProps {
    children: ReactNode;
}

export default function MasonryGrid({ children }: MasonryGridProps) {
    const { settings } = useSettings();
    const maxColumns = settings.gridColumns;
    const [columns, setColumns] = useState(1);

    useEffect(() => {
        const updateColumns = () => {
            const width = window.innerWidth;
            // Responsive columns, capped at user's maxColumns setting
            if (width >= 1280) setColumns(Math.min(maxColumns, 4));      // xl
            else if (width >= 1024) setColumns(Math.min(maxColumns, 3)); // lg
            else if (width >= 640) setColumns(Math.min(maxColumns, 2));  // sm
            else setColumns(1);                                          // mobile always 1
        };

        // Debounce resize handler to prevent excessive re-renders
        let timeoutId: ReturnType<typeof setTimeout>;
        const debouncedUpdate = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(updateColumns, 100);
        };

        updateColumns();
        window.addEventListener('resize', debouncedUpdate);
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', debouncedUpdate);
        };
    }, [maxColumns]);

    // Distribute children into columns (Row-Major strategy)
    const columnWrapper: ReactNode[][] = Array.from({ length: columns }, () => []);
    const items = Array.isArray(children) ? children : [children];

    items.forEach((child, index) => {
        if (child) {
            columnWrapper[index % columns].push(child);
        }
    });

    return (
        <div className="flex gap-4 items-start">
            {columnWrapper.map((col, columnIndex) => (
                <div key={columnIndex} className="flex-1 flex flex-col gap-4 min-w-0">
                    {col}
                </div>
            ))}
        </div>
    );
}

