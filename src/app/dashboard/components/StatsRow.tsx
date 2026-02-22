'use client';

import { useMemo } from 'react';
import { Link2, Hash } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import { Link as LinkType } from '@/types/link';

interface StatsRowProps {
    links: LinkType[];
    allTags: Array<{ name: string; count: number }>;
}

export default function StatsRow({ links, allTags }: StatsRowProps) {
    const stats = useMemo(() => {
        const videos = links.filter(l => l.media_type === 'video').length;
        const images = links.filter(l => l.media_type === 'image').length;
        const articles = links.filter(l => l.media_type === 'article').length;
        return { total: links.length, videos, images, articles };
    }, [links]);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatsCard
                icon={<Link2 size={20} strokeWidth={2.5} />}
                label="Total Links"
                value={stats.total}
                color="primary"
                delay={0}
            />
            {allTags
                .sort((a, b) => b.count - a.count)
                .slice(0, 3)
                .map((tag, index) => (
                    <StatsCard
                        key={tag.name}
                        icon={<Hash size={20} strokeWidth={2.5} />}
                        label={tag.name}
                        value={tag.count}
                        color={index === 0 ? 'accent' : index === 1 ? 'success' : 'warning'}
                        delay={0.1 * (index + 1)}
                    />
                ))}
        </div>
    );
}
