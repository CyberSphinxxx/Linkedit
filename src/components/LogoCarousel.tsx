'use client';

import { motion } from 'framer-motion';
import {
    Github,
    Linkedin,
    Twitter,
    Chrome,
    Figma,
    Slack,
    Twitch,
    Youtube,
    Instagram,
    Facebook
} from 'lucide-react';

const icons = [
    { Icon: Twitter, name: 'Twitter' },
    { Icon: Linkedin, name: 'LinkedIn' },
    { Icon: Github, name: 'GitHub' },
    { Icon: Twitch, name: 'Twitch' },
    { Icon: Figma, name: 'Figma' },
    { Icon: Chrome, name: 'Chrome' },
    { Icon: Slack, name: 'Slack' },
    { Icon: Youtube, name: 'YouTube' },
    { Icon: Instagram, name: 'Instagram' },
    { Icon: Facebook, name: 'Facebook' },
];

export default function LogoCarousel() {
    return (
        <div className="w-full py-12 md:py-20 flex flex-col items-center justify-center overflow-hidden">
            <p className="text-xs md:text-sm font-semibold tracking-[0.2em] text-foreground-muted/60 uppercase mb-8">
                Save content from anywhere
            </p>

            <div className="relative flex w-full max-w-5xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
                <motion.div
                    animate={{ x: "-50%" }}
                    transition={{
                        duration: 30,
                        ease: "linear",
                        repeat: Infinity
                    }}
                    className="flex gap-10 md:gap-24 items-center pr-10 md:pr-24 flex-nowrap"
                    style={{ width: "max-content" }}
                >
                    {/* Double the list for seamless loop */}
                    {[...icons, ...icons].map((item, index) => (
                        <div
                            key={index}
                            className="group flex items-center justify-center text-foreground-muted/40 hover:text-foreground-muted transition-colors duration-300"
                        >
                            <item.Icon className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
