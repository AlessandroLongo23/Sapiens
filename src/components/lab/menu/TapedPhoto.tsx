import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

/*
 * A photo from the game taped onto the notebook's page, a little crooked: the bridge between the site's paper and the
 * lab's 3D. Without a photo yet, the frame holds a pencil sketch on squared paper and says the photo is coming.
 *
 * The tilt is a custom property with a fallback (`--tilt`, else the `tilt` prop), so a parent can straighten the photo
 * on hover or selection with `group-hover:[--tilt:0deg]`. The print stays light paper in the dark theme too: it is a
 * photo on the page, not a panel of the interface.
 */

const TAPE = 'absolute h-5 bg-[#f3e2a6]/80 shadow-[0_1px_2px_rgba(60,50,20,0.15)] mix-blend-multiply dark:bg-[#e9d9a0]/75 dark:mix-blend-normal';

export function TapedPhoto({
	src,
	alt = '',
	caption,
	tilt = -2,
	tape = 'top',
	pixelated = false,
	sketch,
	className,
	priority = false,
	sizes = '(min-width: 1024px) 30vw, 90vw',
	small = false,
	selected = false,
	ratio = 'aspect-[8/5]',
	position
}: {
	/** Where the crop centres, as an object-position class (object-[50%_30%]). */
	position?: string;
	src?: string;
	alt?: string;
	caption?: ReactNode;
	tilt?: number;
	/** One strip across the top, or two across the top corners. */
	tape?: 'top' | 'corners';
	/** Draw a low-resolution photo in big square pixels. */
	pixelated?: boolean;
	/** What to draw while there is no photo. */
	sketch?: ReactNode;
	className?: string;
	priority?: boolean;
	sizes?: string;
	/** A thumbnail, or a sketch under a stamp: no "foto in arrivo" note. */
	small?: boolean;
	/** Chosen: a red edge in place of the grey one. */
	selected?: boolean;
	/** The crop of the print. */
	ratio?: string;
}) {
	return (
		<figure
			className={cn(
				'relative rounded-[3px] bg-[#fdfbf6] p-1.5 shadow-lift ring-1 transition-[transform,box-shadow] duration-500 ease-out-soft [transform:rotate(var(--tilt,var(--tilt-base)))] motion-reduce:transition-none dark:bg-[#ece6d8]',
				selected ? 'ring-2 ring-accent' : 'ring-edge dark:ring-black/30',
				caption ? 'pb-7' : 'pb-1.5',
				className
			)}
			style={{ '--tilt-base': `${tilt}deg` } as CSSProperties}
		>
			{tape === 'top' ? (
				<span className={cn(TAPE, 'left-1/2 -top-2.5 w-[34%] max-w-24 -translate-x-1/2')} style={{ rotate: `${-tilt * 1.6 + 2}deg` }} aria-hidden="true" />
			) : (
				<>
					<span className={cn(TAPE, '-left-3 top-1 w-12 -rotate-45')} aria-hidden="true" />
					<span className={cn(TAPE, '-right-3 top-1 w-12 rotate-45')} aria-hidden="true" />
				</>
			)}
			{src ? (
				<Image
					src={src}
					alt={alt}
					width={960}
					height={600}
					sizes={sizes}
					priority={priority}
					className={cn(ratio, 'w-full rounded-[2px] object-cover', position, pixelated && '[image-rendering:pixelated]')}
					unoptimized={pixelated}
				/>
			) : (
				<div
					className={cn('grid-paper relative flex w-full flex-col items-center justify-center overflow-hidden rounded-[2px] bg-[#f6f2e8] text-[#4a4f5c] [--grid:#d8dde6]', ratio)}
					role={alt ? 'img' : undefined}
					aria-label={alt || undefined}
					aria-hidden={alt ? undefined : true}
				>
					<div className="aspect-[4/3] h-[78%] [&>svg]:size-full">{sketch}</div>
					{!small && <span className="absolute bottom-1.5 right-2 font-mono text-[11px] tracking-wide text-[#5e6472] uppercase">foto in arrivo</span>}
				</div>
			)}
			{caption && <figcaption className="absolute inset-x-0 bottom-1 truncate px-2 text-center font-hand text-base leading-tight text-[#4a4f5c]">{caption}</figcaption>}
		</figure>
	);
}
