"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface FlippingCardProps {
    className?: string;
    height?: number;
    width?: number;
    frontContent: React.ReactNode;
    backContent: React.ReactNode;
}

export function FlippingCard({
    className,
    frontContent,
    backContent,
    height = 300,
    width = 350,
}: FlippingCardProps) {
    return (
        <div
            className="group/flipping-card perspective:1000px"
            style={
                {
                    "--height": `${height}px`,
                    "--width": `${width}px`,
                } as React.CSSProperties
            }
        >
            <div
                className={cn(
                    "relative h-(--height) w-(--width) rounded-xl border bg-card shadow-sm",
                    "transition-transform duration-700 transform-3d",
                    "group-hover/flipping-card:transform-[rotateY(180deg)]",
                    className
                )}
            >
                {/* FRONT */}
                <div className="absolute inset-0 backface-hidden">
                    {frontContent}
                </div>

                {/* BACK */}
                <div className="absolute inset-0 transform-[rotateY(180deg)] backface-hidden">
                    {backContent}
                </div>
            </div>
        </div>
    );
}
