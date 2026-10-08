'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen, Check, Clock, ListChecks, Search, X } from 'lucide-react';
import { useAuth } from '@/lib/state/auth';
import { LEGAL } from '@/lib/config/legal';
import { DOORS, SCHOOL_LEVELS, SCHOOL_YEARS, SUBJECTS, YEAR_NAMES, type Door, type SchoolLevel, type SubjectId } from '@/lib/onboarding/config';
import { REFERRAL } from '@/lib/referrals/config';
import { inviteCode } from '@/lib/referrals/cookie';
import { TRIAL_DAYS } from '@/lib/stripe/config';
import type { WelcomeFigure, WelcomeLesson, WelcomeSubjects } from '@/lib/server/onboarding';
import { Alert } from '@/components/ui/Alert';
import { Button, buttonClass } from '@/components/ui/Button';
import { Html } from '@/components/ui/Html';
import { checkboxClass } from '@/components/ui/Field';
import { cn } from '@/lib/utils/cn';
import { CoverCard, Notebook, NotebookStrip, type LabelLine, type StickerArt } from './Notebook';
import { Slot, StageProvider, useStage } from './Stage';
import './onboarding.css';

/**
 * The way in, one question a screen (vault/Prodotti/Studenti/Onboarding.md). A visitor says who they are. A
 * student then says their school and, unless it is the university, their age. One at high school, the only level
 * with exercises today, goes on to their year, the subjects they study with Sapiens and, one subject a screen, what
 * the class is doing in each: every subject is a notebook of its own colour whose label fills in with the
 * answers. They pick the notebook to start from, see it open on its first page, and only then make the account,
 * which opens on that lesson's exercises. From the subjects on, what is chosen wears its subject's colour; the bar
 * on top and the button that moves on stay in the site's red. The other roles see what Sapiens has for them today and make their
 * account; a school is sent to the contacts. Nothing is sent to the server before the account is made. With
 * `signedIn`, the same questions from the school on for an account that has not answered them (/benvenuto).
 */

/** `topic:<subject>` is the screen that asks one subject's lesson. */
type StepId = 'who' | 'level' | 'age' | 'year' | 'subjects' | `topic:${SubjectId}` | 'plan' | 'today' | 'account' | 'parent';
type Age = 'under14' | '14plus';
/** A lesson chosen for a subject, with its chapter's name and sticker. */
type Topic = { lesson: WelcomeLesson; chapterHtml: string; sticker: StickerArt | null };

const EMPTY_FORM = { name: '', surname: '', email: '', password: '', parentEmail: '', terms: false, adult: false };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** How long a step takes to leave, and a chosen answer stays on screen before the next step: the first matches onboarding.css. */
const LEAVE_MS = 160;
const CHOSEN_MS = 520;

/** How the notebooks under the one in hand lie: a turn and a shift each, so their edges show. */
const PILE = [
	{ r: '-4deg', x: '-14px', y: '10px' },
	{ r: '6deg', x: '16px', y: '14px' },
	{ r: '-1deg', x: '6px', y: '22px' }
];

const still = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fold = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const subjectOf = (step: StepId): SubjectId | null => (step.startsWith('topic:') ? (step.slice(6) as SubjectId) : null);
const nameOf = (id: SubjectId) => SUBJECTS.find((s) => s.id === id)!;

export interface OnboardingProps {
	subjects: WelcomeSubjects;
	/** The sticker pressed on the notebook when the account is made. */
	stamp: StickerArt | null;
	signedIn?: boolean;
	firstName?: string;
}

export function Onboarding(props: OnboardingProps) {
	return (
		<StageProvider>
			<Flow {...props} />
		</StageProvider>
	);
}

function Flow({ subjects: catalogue, stamp, signedIn = false, firstName = '' }: OnboardingProps) {
	const router = useRouter();
	const { openModal, completeLogin } = useAuth();
	const { hop } = useStage();
	const [door, setDoor] = useState<Door | null>(signedIn ? 'student' : null);
	const [age, setAge] = useState<Age | null>(null);
	const [level, setLevel] = useState<SchoolLevel | null>(null);
	const [year, setYear] = useState<number | null>(null);
	const [chosen, setChosen] = useState<SubjectId[]>([]);
	const [topics, setTopics] = useState<Partial<Record<SubjectId, Topic>>>({});
	/** The drawing of each lesson chosen so far, by the lesson's path: null once known to have none. */
	const [figures, setFigures] = useState<Record<string, WelcomeFigure | null>>({});
	const [start, setStart] = useState<SubjectId | null>(null);
	const [chapter, setChapter] = useState(0);
	const [query, setQuery] = useState('');
	const [pencil, setPencil] = useState<{ year?: string; topic?: string }>({});
	const [form, setForm] = useState(EMPTY_FORM);
	const [status, setStatus] = useState<{ loading?: boolean; error?: string; done?: boolean }>({});
	const [parentEmail, setParentEmail] = useState('');
	const [view, setView] = useState<{ step: StepId; phase: 'in' | 'out'; dir: 'forward' | 'back' }>({ step: signedIn ? 'level' : 'who', phase: 'in', dir: 'forward' });
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
	const heading = useRef<HTMLHeadingElement>(null);

	const { step } = view;
	const student = door === 'student';
	const companion = door ?? 'student';
	const copy = DOORS.find((d) => d.id === door);
	const invite = useMemo(() => (signedIn ? null : inviteCode()), [signedIn]);
	const trialDays = invite ? REFERRAL.trialDays : TRIAL_DAYS;

	/** The subjects that have lessons for a year, and among the chosen ones those a lesson can be asked for. */
	const offered = useCallback((y: number | null) => SUBJECTS.filter((s) => y && catalogue[s.id][y]?.length).map((s) => s.id), [catalogue]);
	const askable = useCallback((y: number | null, picked: SubjectId[]) => offered(y).filter((id) => picked.includes(id)), [offered]);

	/** The steps of a path: each is a segment of the bar on top, so the bar grows with the subjects chosen. */
	const pathOf = useCallback(
		(forDoor: Door | null, lvl: SchoolLevel | null, y: number | null, picked: SubjectId[]): StepId[] => {
			// Until the school is said the path is the longest one, high school's.
			const school: StepId[] = lvl && lvl !== 'high_school' ? ['level', 'plan'] : ['level', 'year', 'subjects', ...askable(y, picked).map((id): StepId => `topic:${id}`), 'plan'];
			if (signedIn) return school;
			// At the university nobody is under 14: the age is not asked.
			if (forDoor === 'student' || forDoor === null) return ['who', school[0], ...(lvl === 'university' ? [] : (['age'] as StepId[])), ...school.slice(1), 'account'];
			if (forDoor === 'school') return ['who', 'today'];
			return ['who', 'today', 'account'];
		},
		[askable, signedIn]
	);
	const order = useMemo(() => pathOf(door, level, year, chosen), [pathOf, door, level, year, chosen]);
	const at = order.indexOf(step);

	const compiled = askable(year, chosen).filter((id) => topics[id]);
	const asking = subjectOf(step);
	// The notebook in hand: the subject being asked, then the one to start from; before any is chosen, the plain one.
	const inHand: SubjectId | null = asking ?? (step === 'plan' || step === 'account' ? (start ?? compiled[0] ?? chosen[0] ?? null) : step === 'subjects' ? (chosen[chosen.length - 1] ?? null) : null);
	const chapters = useMemo(() => (asking && year ? (catalogue[asking][year] ?? []) : []), [asking, year, catalogue]);
	/** More than one notebook is compiled and none is picked yet: the screen that asks which. */
	const choosing = step === 'plan' && compiled.length > 1 && !start;

	useEffect(() => () => clearTimeout(timer.current), []);

	/** The step leaves, then the next one arrives; a screen reader lands on its question. */
	const show = useCallback((next: StepId, dir: 'forward' | 'back' = 'forward', wait = 0) => {
		clearTimeout(timer.current);
		const leave = () => {
			setView((v) => ({ ...v, phase: 'out', dir }));
			timer.current = setTimeout(
				() => {
					setView({ step: next, phase: 'in', dir });
					setPencil({});
					setChapter(0);
					setQuery('');
					requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
					window.scrollTo({ top: 0 });
				},
				still() ? 0 : LEAVE_MS
			);
		};
		if (wait && !still()) timer.current = setTimeout(leave, wait);
		else leave();
	}, []);

	/** The step after `from`, on the path the answers lead to: `next` are those given a moment ago, not yet in the state. */
	const after = (from: StepId, next: { door?: Door; level?: SchoolLevel; year?: number; chosen?: SubjectId[] } = {}): StepId | null => {
		const steps = pathOf(next.door ?? door, next.level ?? level, next.year ?? year, next.chosen ?? chosen);
		return steps[steps.indexOf(from) + 1] ?? null;
	};

	const back = useCallback(() => {
		if (step === 'parent' || view.phase === 'out') return;
		// From the open notebook, first back to the choice among the notebooks.
		if (step === 'plan' && start && compiled.length > 1) return setStart(null);
		const previous = order[at - 1];
		if (previous) show(previous, 'back');
	}, [step, view.phase, start, compiled.length, order, at, show]);

	/** What the student answered, as the server takes it. */
	const answers = () => ({
		level,
		year,
		subjects: chosen,
		topics: Object.fromEntries(compiled.map((id) => [id, topics[id]!.lesson.path])),
		start: start ?? compiled[0] ?? null
	});

	/** Saves the answers of an account that already exists and opens the page they lead to. */
	const saveSignedIn = async () => {
		setStatus({ loading: true });
		try {
			const response = await fetch('/api/onboarding', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(answers()) });
			const result = await response.json().catch(() => ({}));
			if (!response.ok || typeof result.next !== 'string') throw new Error(result.error || 'Non riesco a salvare. Riprova.');
			router.push(result.next);
		} catch (err) {
			setStatus({ error: err instanceof Error ? err.message : String(err) });
		}
	};

	const chooseDoor = (id: Door) => {
		setDoor(id);
		hop(id);
		show(after('who', { door: id })!, 'forward', CHOSEN_MS + 120);
	};
	const chooseLevel = (value: SchoolLevel) => {
		if (value !== level) {
			setYear(null);
			setChosen([]);
			setTopics({});
			setStart(null);
			setAge(value === 'university' ? '14plus' : null);
		}
		setLevel(value);
		hop(value);
		show(after('level', { level: value })!, 'forward', CHOSEN_MS + 120);
	};
	const chooseAge = (value: Age) => {
		setAge(value);
		hop(companion);
		show(after('age')!, 'forward', CHOSEN_MS);
	};
	const chooseYear = (value: number) => {
		if (value !== year) {
			setChosen([]);
			setTopics({});
			setStart(null);
		}
		setYear(value);
		hop(companion);
		show(after('year', { year: value, chosen: value === year ? chosen : [] })!, 'forward', CHOSEN_MS);
	};
	const toggleSubject = (id: SubjectId) => {
		const next = chosen.includes(id) ? chosen.filter((s) => s !== id) : SUBJECTS.map((s) => s.id).filter((s) => s === id || chosen.includes(s));
		setChosen(next);
		setStart(null);
		if (next.includes(id)) hop(id);
	};
	/** Asks for the lesson's drawing as soon as it is chosen, so it is on the page by the time the notebook opens. */
	const loadFigure = (path: string) => {
		if (path in figures) return;
		fetch(`/api/onboarding?lesson=${encodeURIComponent(path)}`)
			.then((response) => (response.ok ? response.json() : null))
			.then((result) => {
				const figure: WelcomeFigure | null = result?.figure ?? null;
				if (figure) new Image().src = figure.url;
				setFigures((all) => ({ ...all, [path]: figure }));
			})
			.catch(() => {});
	};
	const chooseTopic = (id: SubjectId, topic: Topic | null) => {
		setTopics((all) => {
			const rest = { ...all };
			delete rest[id];
			return topic ? { ...rest, [id]: topic } : rest;
		});
		setStart(null);
		if (topic) {
			hop(id);
			loadFigure(topic.lesson.path);
		}
		show(after(`topic:${id}`)!, 'forward', topic ? CHOSEN_MS + 260 : 0);
	};
	const chooseStart = (id: SubjectId) => {
		hop(id);
		setStart(id);
	};

	// On a keyboard, the number of an answer chooses it and Escape goes back.
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement).closest('input, textarea, [role="dialog"]')) return;
			if (e.key === 'Escape') return back();
			const n = Number(e.key);
			if (!Number.isInteger(n) || n < 1) return;
			document.querySelector<HTMLElement>(`.ob-step [data-key="${n}"]`)?.click();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [back]);

	const field = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
		if (status.error) setStatus({});
	};

	const submit = async (e: FormEvent) => {
		e.preventDefault();
		if (status.loading || status.done) return;
		setStatus({ loading: true });
		try {
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					role: door,
					firstName: form.name,
					lastName: form.surname,
					email: form.email,
					password: form.password,
					terms: form.terms,
					age: student ? age : form.adult ? 'adult' : null,
					parentEmail: form.parentEmail,
					invite,
					...(student ? answers() : {})
				})
			});
			const result = await response.json().catch(() => ({}));
			if (!response.ok) throw new Error(result.error || 'Iscrizione non riuscita. Riprova.');
			if (result.state === 'parent') {
				setParentEmail(result.parentEmail);
				setStatus({});
				return show('parent');
			}
			const { getBrowserClient } = await import('@/lib/auth/client');
			const { data, error } = await getBrowserClient().auth.signInWithPassword({ email: form.email, password: form.password });
			if (error || !data.user) throw new Error('Account creato, ma non riesco a farti entrare: prova ad accedere.');
			// The notebook is theirs: the stamp goes on, then the first lesson opens. The rest of the site hears of
			// the login only then: told now, this page would be refreshed as a signed-in one and sent to /benvenuto.
			const user = data.user;
			const next = typeof result.next === 'string' ? result.next : '/';
			setStatus({ done: true });
			hop(companion);
			timer.current = setTimeout(
				async () => {
					await completeLogin(user);
					router.push(next);
				},
				still() ? 0 : 1100
			);
		} catch (err) {
			setStatus({ error: err instanceof Error ? err.message : String(err) });
		}
	};

	/** What is written on a subject's notebook (or on the plain one). */
	const linesOf = (id: SubjectId | null, live = true): LabelLine[] => [
		{ name: 'Nome', value: signedIn ? firstName : `${form.name} ${form.surname}`.trim(), typed: true },
		{ name: 'Classe', value: year ? `${year}ª superiore` : level && level !== 'high_school' ? SCHOOL_LEVELS.find((l) => l.id === level)!.school : '', pencil: live ? pencil.year : undefined },
		{ name: 'Materia', value: id ? nameOf(id).name : '' },
		{ name: 'Oggi', value: (id && topics[id]?.lesson.title) || '', pencil: live ? pencil.topic : undefined, wrap: true }
	];
	const lines = linesOf(inHand);
	const topic = inHand ? (topics[inHand] ?? null) : null;

	const found = useMemo(() => {
		const q = fold(query.trim());
		if (!q) return null;
		return chapters.flatMap((c) => c.lessons.filter((l) => fold(l.title).includes(q)).map((lesson) => ({ lesson, chapterHtml: c.titleHtml, sticker: c.sticker })));
	}, [query, chapters]);
	const listed = found ?? (chapters[chapter]?.lessons ?? []).map((lesson) => ({ lesson, chapterHtml: chapters[chapter].titleHtml, sticker: chapters[chapter].sticker }));

	// The first two questions stand alone: the notebook comes in with the one after.
	const split = step !== 'who' && step !== 'level' && step !== 'parent';
	const spread = step === 'plan' && student && !choosing;
	const layout = choosing ? 'choose' : spread ? 'spread' : 'side';
	// The other notebooks of the pile, under the one in hand.
	const under = chosen.filter((id) => id !== inHand);

	// The notebook changes place when the screen of the open notebook comes or goes: it travels there.
	const book = useRef<HTMLDivElement>(null);
	const bookAt = useRef<{ x: number; y: number } | null>(null);
	useLayoutEffect(() => {
		const el = book.current;
		if (!el || el.offsetParent === null) {
			bookAt.current = null;
			return;
		}
		el.getAnimations().forEach((animation) => animation.cancel());
		const rect = el.getBoundingClientRect();
		const now = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
		const was = bookAt.current;
		bookAt.current = now;
		if (was && !still() && Math.hypot(now.x - was.x, now.y - was.y) > 24) {
			el.animate([{ translate: `${was.x - now.x}px ${was.y - now.y}px` }, { translate: '0px 0px' }], { duration: 800, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
		}
	}, [step, layout]);

	/** A level without lessons yet: what the last screen says instead of a lesson. */
	const coming = level && level !== 'high_school' ? SCHOOL_LEVELS.find((l) => l.id === level)! : null;
	const opening = coming
		? { heading: coming.id === 'middle_school' ? 'Matematica, scienze e tecnologia' : 'Analisi, fisica, chimica, informatica e intelligenza artificiale', note: 'Le lezioni sono in arrivo.' }
		: { heading: chosen.length ? chosen.map((id) => nameOf(id).name).join(', ') : 'Matematica, fisica, chimica e informatica', note: 'La prima lezione la scegli tu, dalla biblioteca.' };
	const page = <StartPage topic={topic} subject={inHand ? nameOf(inHand).name : null} figure={topic ? (figures[topic.lesson.path] ?? null) : null} opening={opening} />;
	// The colour of the screen: the subject being asked, or the one whose notebook lies open.
	const tone = asking ?? (step === 'plan' && !choosing ? inHand : null);
	const topicIndex = asking ? askable(year, chosen).indexOf(asking) : -1;
	const topicCount = askable(year, chosen).length;

	return (
		<div className="ob-page">
			<header className="relative z-30 mx-auto flex w-full max-w-3xl items-center gap-3 px-4 pt-4 sm:px-6 sm:pt-6">
				{at > 0 && step !== 'parent' ? (
					<button type="button" onClick={back} className="grid size-11 shrink-0 place-items-center rounded-full text-fg-muted transition-colors hover:bg-surface-3 hover:text-fg focus-ring" aria-label="Indietro">
						<ArrowLeft className="size-5" aria-hidden="true" />
					</button>
				) : (
					<Link href="/" className="grid size-11 shrink-0 place-items-center rounded-full text-fg-muted transition-colors hover:bg-surface-3 hover:text-fg focus-ring" aria-label="Chiudi e torna al sito">
						<X className="size-5" aria-hidden="true" />
					</Link>
				)}
				<div className="flex flex-1 gap-1 sm:gap-1.5" role="progressbar" aria-label="A che punto sei" aria-valuemin={0} aria-valuemax={order.length} aria-valuenow={step === 'parent' || status.done ? order.length : Math.max(at, 0)}>
					{/* One segment a step: it fills when the step is left behind. */}
					{order.map((id, i) => (
						<div key={id} className="ob-track">
							<div className="ob-fill" style={{ '--ob-done': step === 'parent' || status.done || i < at ? 1 : 0 } as CSSProperties} />
						</div>
					))}
				</div>
				{!signedIn && step !== 'parent' ? (
					<button type="button" onClick={() => openModal()} className="shrink-0 rounded-full px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-3 hover:text-fg focus-ring">
						Accedi
					</button>
				) : (
					<span className="w-11 shrink-0" />
				)}
			</header>

			{step === 'who' && (
				<main key="who" data-phase={view.phase} data-dir={view.dir} className="ob-step mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 pb-16 pt-8 sm:justify-center sm:px-8 sm:pb-[14vh] sm:pt-6">
					<Question ref={heading} centred lead="Sapiens è fatto per chi studia e per chi lo aiuta.">
						Ciao! Chi <Mark>sei</Mark>?
					</Question>
					<div className="ob-keys mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-5 sm:gap-5" role="radiogroup" aria-label="Chi sei?" data-chosen={door ? '' : undefined}>
						{DOORS.map((d, i) => (
							<Key key={d.id} n={i + 1} checked={door === d.id} onClick={() => chooseDoor(d.id)} index={i} className={cn('px-2 pb-4 pt-2 sm:pb-7 sm:pt-6', i === DOORS.length - 1 && 'ob-key-wide col-span-2 sm:col-span-1')}>
								<Slot id={d.id} className={cn('w-24 sm:w-[86%]', i === DOORS.length - 1 && 'w-20')} />
								<span className="text-lg font-semibold sm:text-xl">{d.label}</span>
							</Key>
						))}
					</div>
				</main>
			)}

			{step === 'level' && (
				<main key="level" data-phase={view.phase} data-dir={view.dir} className="ob-step mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 pb-16 pt-8 sm:justify-center sm:px-8 sm:pb-[14vh] sm:pt-6">
					<Question ref={heading} centred lead="Così ti portiamo alle lezioni giuste.">
						{signedIn && firstName ? `Ciao ${firstName}, che ` : 'Che '}
						<Mark>scuola</Mark> fai?
					</Question>
					<div className="ob-keys mt-8 grid grid-cols-3 gap-3 sm:mt-12 sm:gap-6" role="radiogroup" aria-label="Che scuola fai?" data-chosen={level ? '' : undefined}>
						{SCHOOL_LEVELS.map((l, i) => (
							<Key key={l.id} n={i + 1} checked={level === l.id} onClick={() => chooseLevel(l.id)} index={i} className="px-1.5 pb-5 pt-3 sm:px-4 sm:pb-10 sm:pt-8">
								<Slot id={l.id} className="w-[92%] sm:w-[84%]" />
								<span className="mt-1 text-base font-semibold sm:mt-3 sm:text-2xl">{l.label}</span>
								<span className="text-xs text-fg-muted sm:text-base">{l.who}</span>
							</Key>
						))}
					</div>
				</main>
			)}

			{step === 'parent' && (
				<main key="parent" data-phase={view.phase} data-dir={view.dir} className="ob-step mx-auto flex w-full max-w-xl flex-1 flex-col items-center px-5 pb-28 pt-8 text-center sm:pt-[8vh]">
					<Slot id="email" className="w-48 sm:w-64" />
					<h1 ref={heading} tabIndex={-1} className="ob-rise mt-4 font-display text-4xl font-semibold text-fg-strong outline-none sm:text-5xl" style={{ '--i': 1 } as CSSProperties}>
						Manca solo un <Mark>genitore</Mark>
					</h1>
					<p className="ob-rise mt-4 max-w-md text-lg text-fg-muted" style={{ '--i': 2 } as CSSProperties}>
						Abbiamo scritto a <strong className="font-semibold text-fg">{parentEmail}</strong>. Quando apre il link e conferma, entri con la tua email e la tua password.
					</p>
					<p className="ob-rise mt-3 max-w-md text-fg-subtle" style={{ '--i': 3 } as CSSProperties}>
						Nel frattempo le lezioni sono aperte a tutti.
					</p>
					<Footer>
						<Link href="/materiale/scuola-superiore/matematica" className={buttonClass('primary', 'lg', 'w-full no-underline sm:w-72')}>
							Vai alle lezioni
						</Link>
					</Footer>
				</main>
			)}

			{split && (
				<div className="ob-split mx-auto w-full max-w-6xl flex-1 px-5 pb-28 pt-6 sm:px-8 lg:pb-16" data-layout={layout}>
					<aside className="ob-aside ob-in">
						{student ? (
							<>
								<div className="ob-stack hidden lg:block">
									{under.map((id, i) => (
										<div key={id} className="ob-slab" data-subject={id} style={{ '--r': PILE[i % PILE.length].r, '--x': PILE[i % PILE.length].x, '--y': PILE[i % PILE.length].y } as CSSProperties} />
									))}
									<div key={inHand ?? 'plain'} className="ob-deal relative">
										<Notebook
											ref={book}
											subject={inHand}
											lines={lines}
											open={spread}
											sticker={topic?.sticker ?? null}
											stamp={status.done ? stamp : null}
											companion={companion}
											object={inHand && step !== 'subjects' ? inHand : null}
											page={page}
											inside={<InsideCover lesson={topic?.lesson ?? null} trialDays={trialDays} />}
										/>
									</div>
								</div>
								{step !== 'plan' && <NotebookStrip subject={inHand} lines={lines} companion={companion} className="lg:hidden" />}
							</>
						) : (
							<div className="flex justify-center lg:pt-6">
								<Slot id={companion} className="w-32 lg:w-72" />
							</div>
						)}
					</aside>

					<main key={step} data-phase={view.phase} data-dir={view.dir} data-subject={tone ?? undefined} className="ob-step flex min-w-0 flex-col">
						{step === 'age' && (
							<>
								<Question ref={heading} lead="Ci serve per sapere se all’iscrizione deve esserci un genitore.">
									Quanti <Mark>anni</Mark> hai?
								</Question>
								<div className="ob-keys mt-8 grid max-w-xl grid-cols-2 gap-4 sm:mt-10 sm:gap-5" role="radiogroup" aria-label="Quanti anni hai?" data-chosen={age ? '' : undefined}>
									{(
										[
											['under14', `<${LEGAL.digitalConsentAge}`, `Meno di ${LEGAL.digitalConsentAge} anni`],
											['14plus', `${LEGAL.digitalConsentAge}+`, `${LEGAL.digitalConsentAge} anni o più`]
										] as const
									).map(([value, figure, label], i) => (
										<Key key={value} n={i + 1} checked={age === value} onClick={() => chooseAge(value)} index={i} className="px-3 py-9 sm:py-12">
											<span className="ob-figure text-6xl sm:text-7xl" aria-hidden="true">
												{figure}
											</span>
											<span className="mt-2 font-semibold">{label}</span>
										</Key>
									))}
								</div>
							</>
						)}

						{step === 'year' && (
							<>
								<Question ref={heading} lead="Lo scriviamo sull’etichetta dei tuoi quaderni.">
									Che <Mark>anno</Mark> fai?
								</Question>
								<div className="ob-keys mt-8 grid grid-cols-3 gap-3 sm:mt-10 sm:grid-cols-5 sm:gap-4" role="radiogroup" aria-label="Che anno fai?" data-chosen={year ? '' : undefined}>
									{SCHOOL_YEARS.map((y, i) => (
										<Key key={y} n={y} checked={year === y} onClick={() => chooseYear(y)} onPreview={(on) => setPencil(on ? { year: `${y}ª superiore` } : {})} index={i} className="px-2 py-7 sm:py-9">
											<span className="ob-figure text-5xl sm:text-6xl" aria-hidden="true">
												{y}
												<span className="align-top text-2xl">ª</span>
											</span>
											<span className="mt-1 font-semibold">{YEAR_NAMES[y]}</span>
										</Key>
									))}
								</div>
							</>
						)}

						{step === 'subjects' && (
							<>
								<Question ref={heading} lead="Scegli tutte quelle che vuoi: per ognuna prepariamo un quaderno.">
									Quali <Mark>materie</Mark> studi con Sapiens?
								</Question>
								<div className="ob-keys mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4" role="group" aria-label="Materie">
									{SUBJECTS.map((s, i) => {
										const lessons = (year ? (catalogue[s.id][year] ?? []) : []).reduce((sum, c) => sum + c.lessons.length, 0);
										return (
											<Key key={s.id} n={i + 1} role="checkbox" subject={s.id} checked={chosen.includes(s.id)} onClick={() => toggleSubject(s.id)} index={i} className="ob-key-side px-4 py-4 sm:px-5 sm:py-5">
												<Slot id={s.id} className="w-16 shrink-0 sm:w-24" />
												<span className="flex min-w-0 flex-col items-start gap-1 text-left">
													<span className="text-lg font-semibold sm:text-xl">{s.name}</span>
													{lessons ? <span className="text-sm text-fg-muted">{lessons} lezioni</span> : <span className="ob-soon">in arrivo</span>}
												</span>
											</Key>
										);
									})}
								</div>
								<Footer>
									<Button size="lg" className="w-full sm:w-72" disabled={!chosen.length} onClick={() => show(after('subjects')!)}>
										Continua
									</Button>
								</Footer>
							</>
						)}

						{asking && (
							<>
								<Question ref={heading} eyebrow={topicCount > 1 ? `Quaderno ${topicIndex + 1} di ${topicCount}` : undefined} lead="Scegli l’argomento: lo scriviamo sull’etichetta.">
									Cosa state facendo in <Mark>{nameOf(asking).in}</Mark>?
								</Question>
								<label className="ob-rise relative mt-7 block max-w-md" style={{ '--i': 2 } as CSSProperties}>
									<Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-fg-faint" aria-hidden="true" />
									<input
										type="search"
										value={query}
										onChange={(e) => setQuery(e.target.value)}
										placeholder={`Cerca tra le lezioni di ${YEAR_NAMES[year ?? 1]?.toLowerCase()}`}
										aria-label="Cerca un argomento"
										className="ob-search w-full rounded-full border-[1.5px] border-edge-strong bg-surface py-3 pl-12 pr-4 text-fg-strong outline-none transition placeholder:text-fg-faint"
									/>
								</label>
								{!found && (
									<div className="ob-rise -mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" style={{ '--i': 3 } as CSSProperties} role="tablist" aria-label="Capitoli">
										{chapters.map((c, i) => (
											<button key={i} type="button" role="tab" aria-selected={chapter === i} onClick={() => setChapter(i)} className="ob-key ob-chip">
												<Html html={c.titleHtml} as="span" />
											</button>
										))}
									</div>
								)}
								<div key={found ? `q:${query}` : chapter} className="ob-list ob-keys ob-scroll mt-4 grid content-start gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Argomenti" data-chosen={topics[asking] ? '' : undefined}>
									{listed.map(({ lesson, chapterHtml, sticker }, i) => (
										<Key key={lesson.path} checked={topics[asking]?.lesson.path === lesson.path} onClick={() => chooseTopic(asking, { lesson, chapterHtml, sticker })} onPreview={(on) => setPencil(on ? { topic: lesson.title } : {})} index={i} className="ob-row">
											<Html html={lesson.titleHtml} as="span" />
											<ArrowRight className="size-4 shrink-0 text-fg-faint" aria-hidden="true" />
										</Key>
									))}
								</div>
								{found && !found.length && <p className="mt-2 text-fg-muted">Nessuna lezione con questo nome. Prova con una parola sola, o scegli dal capitolo.</p>}
								<button type="button" onClick={() => chooseTopic(asking, null)} className="mt-6 self-start rounded px-1 py-1 text-sm text-fg-subtle underline-offset-4 hover:text-fg hover:underline focus-ring">
									Lo scelgo dopo
								</button>
							</>
						)}

						{step === 'plan' && choosing && (
							<>
								<Question ref={heading} centred lead="Tocca il quaderno da aprire: gli altri ti aspettano nel Diario.">
									Da quale vuoi <Mark>cominciare</Mark>?
								</Question>
								<div className="ob-choose mt-10 self-center sm:mt-12" style={{ '--n': compiled.length } as CSSProperties}>
									{compiled.map((id, i) => (
										<div key={id} className="ob-rise" style={{ '--i': i + 2 } as CSSProperties}>
											<CoverCard subject={id} lines={linesOf(id, false)} sticker={topics[id]?.sticker ?? null} object={id} data-key={i + 1} aria-label={`${nameOf(id).name}: ${topics[id]!.lesson.title}`} onClick={() => chooseStart(id)} style={{ '--r': `${[-3, 2, -1.5, 3][i]}deg` } as CSSProperties} />
										</div>
									))}
								</div>
							</>
						)}

						{step === 'plan' && !choosing && (
							<>
								<Question ref={heading} lead={topic && inHand ? `Il quaderno di ${nameOf(inHand).in} è aperto alla pagina giusta. Appena crei l’account si comincia da qui.` : coming ? 'Le stiamo scrivendo. Intanto hai le lezioni delle superiori e tutti gli strumenti.' : 'Crea l’account e scegli tu la prima lezione.'}>
									{topic ? (
										<>
											Sappiamo da dove <Mark>cominciare</Mark>.
										</>
									) : coming ? (
										<>
											Le lezioni {coming.of} sono in <Mark>arrivo</Mark>.
										</>
									) : (
										<>
											Ti aspetta tutta la <Mark>biblioteca</Mark>.
										</>
									)}
								</Question>
								<div className="ob-sheet ob-rise mt-7 aspect-[4/3.8] max-w-lg lg:hidden" style={{ '--i': 2 } as CSSProperties}>
									<div className="ob-leaf rounded-none">{page}</div>
								</div>
								{topic && (
									<div className="ob-index ob-rise mt-5 max-w-lg text-[15px] lg:hidden" style={{ '--i': 3 } as CSSProperties}>
										<LevelPath lesson={topic.lesson} />
									</div>
								)}
								<ul className="mt-6 flex max-w-lg flex-col gap-4 text-fg sm:text-lg lg:hidden">
									{!topic && (
										<Point icon={ListChecks} index={2}>
											Esercizi a livelli su ogni lezione: passi al successivo quando ti riesce.
										</Point>
									)}
									<Point icon={BookOpen} index={3}>
										Teoria, formulario e passaggi svolti accanto a ogni esercizio.
									</Point>
									<Point icon={Clock} index={4}>
										Studio completo per {trialDays} giorni, senza carta. Poi teoria e formulari restano gratis.
									</Point>
								</ul>
								<Footer>
									<Button size="lg" className="w-full sm:w-72" loading={signedIn && status.loading} onClick={() => (signedIn ? saveSignedIn() : show('account'))}>
										{signedIn ? 'Comincia' : 'Continua'}
									</Button>
								</Footer>
							</>
						)}

						{step === 'today' && (
							<>
								<Question ref={heading} lead={copy?.today}>
									{door === 'school' ? (
										<>
											Per le <Mark>scuole</Mark>
										</>
									) : door === 'parent' ? (
										<>
											Per i <Mark>genitori</Mark>
										</>
									) : door === 'tutor' ? (
										<>
											Per i <Mark>tutor</Mark>
										</>
									) : (
										<>
											Per i <Mark>docenti</Mark>
										</>
									)}
								</Question>
								<Footer>
									{door === 'school' ? (
										<Link href="/contacts" className={buttonClass('primary', 'lg', 'w-full no-underline sm:w-72')}>
											Scrivici
										</Link>
									) : (
										<Button size="lg" className="w-full sm:w-72" onClick={() => show('account')}>
											Continua
										</Button>
									)}
								</Footer>
							</>
						)}

						{step === 'account' && (
							<>
								<Question ref={heading} lead={student ? 'Crea il tuo account: mettiamo il nome sull’etichetta e i tuoi progressi restano salvati.' : 'Ti servono solo un’email e una password.'}>
									{student ? (
										<>
											Di chi {chosen.length > 1 ? 'sono questi' : 'è questo'} <Mark>{chosen.length > 1 ? 'quaderni' : 'quaderno'}</Mark>?
										</>
									) : (
										<>
											Crea il tuo <Mark>account</Mark>
										</>
									)}
								</Question>
								<form onSubmit={submit} className="mt-8 flex w-full max-w-md flex-col gap-3.5">
									<div className="ob-rise grid grid-cols-2 gap-3.5" style={{ '--i': 2 } as CSSProperties}>
										<Field id="ob-name" label="Nome" autoComplete="given-name" value={form.name} onChange={field('name')} />
										<Field id="ob-surname" label="Cognome" autoComplete="family-name" value={form.surname} onChange={field('surname')} />
									</div>
									<Field id="ob-email" label={student ? 'La tua email' : 'Email'} type="email" autoComplete="email" value={form.email} onChange={field('email')} ok={EMAIL.test(form.email)} index={3} />
									<Field id="ob-password" label="Password" type="password" minLength={6} autoComplete="new-password" value={form.password} onChange={field('password')} ok={form.password.length >= 6} index={4} hint="Almeno 6 caratteri" />
									{student && age === 'under14' && (
										<div className="ob-rise rounded-2xl border-[1.5px] border-edge bg-surface/70 p-3.5" style={{ '--i': 5 } as CSSProperties}>
											<Field id="ob-parent" label="Email di un genitore" type="email" autoComplete="off" value={form.parentEmail} onChange={field('parentEmail')} ok={EMAIL.test(form.parentEmail) && form.parentEmail !== form.email} bare />
											<p className="mt-2.5 px-1 text-sm text-fg-muted">Sotto i {LEGAL.digitalConsentAge} anni serve il suo consenso. Gli mandiamo un link: il tuo account parte quando conferma, e non deve crearne uno suo.</p>
										</div>
									)}
									<div className="ob-rise mt-1 flex flex-col gap-3 text-sm text-fg-muted" style={{ '--i': 6 } as CSSProperties}>
										{!student && (
											<label className="flex cursor-pointer items-start gap-3">
												<input type="checkbox" checked={form.adult} onChange={field('adult')} required className={checkboxClass} />
												<span>Ho almeno 18 anni.</span>
											</label>
										)}
										<label className="flex cursor-pointer items-start gap-3">
											<input type="checkbox" checked={form.terms} onChange={field('terms')} required className={checkboxClass} />
											<span>
												Ho letto e accetto i{' '}
												<a href="/terms" target="_blank" className="font-medium text-accent-fg hover:underline">
													Termini e condizioni
												</a>{' '}
												e ho preso visione dell&apos;
												<a href="/privacy" target="_blank" className="font-medium text-accent-fg hover:underline">
													informativa sulla privacy
												</a>
												.
											</span>
										</label>
									</div>
									{invite && <Alert tone="success">Sei qui con un invito: la prova di Studio dura {REFERRAL.trialDays} giorni invece di {TRIAL_DAYS}.</Alert>}
									{status.error && <Alert tone="error">{status.error}</Alert>}
									<Button type="submit" size="lg" className="ob-rise mt-2 w-full" style={{ '--i': 7 } as CSSProperties} loading={status.loading} disabled={status.done || !form.terms || (!student && !form.adult)}>
										{status.done ? 'Fatto! Si comincia…' : student && age !== 'under14' ? 'Crea l’account e comincia' : 'Crea l’account'}
									</Button>
								</form>
							</>
						)}

						{signedIn && status.error && <Alert tone="error" className="mt-6">{status.error}</Alert>}
					</main>
				</div>
			)}
		</div>
	);
}

/** The question of a step, in the display face, with a line under it and, above, where the step stands among its like. */
function Question({ ref, eyebrow, lead, centred = false, children }: { ref: React.Ref<HTMLHeadingElement>; eyebrow?: string; lead?: string; centred?: boolean; children: ReactNode }) {
	return (
		<div className={cn('ob-q', centred && 'text-center')}>
			{eyebrow && <p className="ob-rise mb-3 font-hand text-2xl font-semibold leading-none text-[color:var(--ob-tone-fg)]">{eyebrow}</p>}
			<h1 ref={ref} tabIndex={-1} className="ob-rise text-balance font-display text-[2.1rem] font-semibold leading-[1.08] tracking-tight text-fg-strong outline-none sm:text-5xl lg:text-[3.4rem]">
				{children}
			</h1>
			{lead && (
				<p className={cn('ob-rise mt-3 max-w-xl text-pretty text-fg-muted sm:mt-4 sm:text-xl', centred && 'mx-auto')} style={{ '--i': 1 } as CSSProperties}>
					{lead}
				</p>
			)}
		</div>
	);
}

/** The word of a question the highlighter goes over. */
function Mark({ children }: { children: ReactNode }) {
	return <span className="ob-hl">{children}</span>;
}

/**
 * An answer. Where one is chosen (`radio`), pressing it moves the step on; where several can be (`checkbox`), it
 * goes down and stays. `n` is the key that chooses it from a keyboard; with a `subject` it wears that subject's colour.
 */
function Key({ n, role = 'radio', subject, checked, onClick, onPreview, index, className, children }: { n?: number; role?: 'radio' | 'checkbox'; subject?: SubjectId; checked: boolean; onClick: () => void; onPreview?: (on: boolean) => void; index: number; className?: string; children: ReactNode }) {
	return (
		<button
			type="button"
			role={role}
			aria-checked={checked}
			data-key={n}
			data-subject={subject}
			data-stage-hover=""
			onClick={onClick}
			onPointerEnter={onPreview && ((e) => e.pointerType === 'mouse' && onPreview(true))}
			onPointerLeave={onPreview && (() => onPreview(false))}
			onFocus={onPreview && (() => onPreview(true))}
			onBlur={onPreview && (() => onPreview(false))}
			className={cn('ob-key ob-rise', className)}
			style={{ '--i': index + 2 } as CSSProperties}
		>
			{n !== undefined && (
				<kbd className="ob-kbd" aria-hidden="true">
					{n}
				</kbd>
			)}
			{children}
			{checked && (
				<span className="ob-check" aria-hidden="true">
					<Check className="size-4" strokeWidth={3} />
				</span>
			)}
		</button>
	);
}

/** A field of the account: its name rests inside it and moves up when there is something written. */
function Field({ id, label, ok, hint, index, bare, ...rest }: { id: string; label: string; ok?: boolean; hint?: string; index?: number; bare?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
	return (
		<div className={cn('ob-field', !bare && index !== undefined && 'ob-rise')} style={index !== undefined ? ({ '--i': index } as CSSProperties) : undefined}>
			<input id={id} required placeholder=" " aria-describedby={hint ? `${id}-hint` : undefined} {...rest} />
			<label htmlFor={id}>{label}</label>
			{ok && (
				<span className="ob-field-ok" aria-hidden="true">
					<Check className="size-3.5" strokeWidth={3.5} />
				</span>
			)}
			{hint && !ok && (
				<span id={`${id}-hint`} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-fg-faint">
					{hint}
				</span>
			)}
		</div>
	);
}

function Point({ icon: Icon, index, children }: { icon: typeof Check; index: number; children: ReactNode }) {
	return (
		<li className="ob-rise flex items-start gap-3.5" style={{ '--i': index } as CSSProperties}>
			<span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-[color:var(--ob-tone-soft)] text-[color:var(--ob-tone-fg)]">
				<Icon className="size-[1.1rem]" aria-hidden="true" />
			</span>
			<span>{children}</span>
		</li>
	);
}

/**
 * The first page of the notebook: the lesson the student starts from, the chapter it belongs to and a drawing
 * from the lesson, stuck on the page like a cutting (the chapter's sticker where the lesson has none). Sized in
 * the notebook's `em`.
 */
function StartPage({ topic, subject, figure, opening }: { topic: Topic | null; subject: string | null; figure: WelcomeFigure | null; /** What it says without a lesson. */ opening: { heading: string; note: string } }) {
	if (!topic) {
		return (
			<div className="ob-start justify-center">
				<p className="ob-start-eyebrow">Per cominciare</p>
				<h2 className="mt-[0.3em] text-balance font-display text-[1.65em] font-semibold leading-tight">{opening.heading}</h2>
				<p className="mt-[0.7em] font-hand text-[1.25em] leading-tight text-[color:var(--graphite)]">{opening.note}</p>
			</div>
		);
	}
	const { lesson, chapterHtml, sticker } = topic;
	return (
		<div className="ob-start">
			<p className="ob-start-eyebrow">Punto di partenza</p>
			<h2 className="mt-[0.3em] text-balance font-display text-[1.5em] font-semibold leading-[1.15]">
				<Html html={lesson.titleHtml} as="span" />
			</h2>
			<p className="mt-[0.55em] text-[0.74em] font-medium leading-snug text-[#5b6076]">
				{subject} · <Html html={chapterHtml} as="span" />
			</p>
			<div className="ob-start-art">
				{figure ? (
					<figure key={figure.url} className="ob-cutout" style={{ '--ar': figure.w / figure.h } as CSSProperties}>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src={figure.url} alt={figure.alt} width={figure.w} height={figure.h} decoding="async" draggable={false} />
					</figure>
				) : (
					sticker && (
						// eslint-disable-next-line @next/next/no-img-element
						<img src={sticker.url} alt="" width={sticker.w} height={sticker.h} draggable={false} className="ob-start-sticker" />
					)
				)}
			</div>
		</div>
	);
}

/** The exercise path of a lesson: its levels by name, the first marked as the one to start from. Sized in `em`. */
function LevelPath({ lesson }: { lesson: WelcomeLesson }) {
	return (
		<>
			<p className="ob-start-eyebrow">Il percorso</p>
			<p className="mt-[0.35em] text-[0.74em] font-medium leading-snug text-[#5b6076]">{lesson.levels} livelli di esercizi: passi al successivo quando ti riesce.</p>
			<ol className="ob-path" data-dense={lesson.levels > 7 ? '' : undefined}>
				{lesson.levelNames.map((name, i) => (
					<li key={i} data-first={i === 0 ? '' : undefined} style={{ '--i': i } as CSSProperties}>
						<span className="ob-level" data-first={i === 0 ? '' : undefined} aria-hidden="true">
							{i + 1}
						</span>
						<span>{name}</span>
						{i === 0 && <span className="ob-path-here">si parte da qui</span>}
					</li>
				))}
			</ol>
		</>
	);
}

/**
 * The inside of the cover, seen when the notebook lies open: card of the cover's own colour, with the lesson's
 * exercise path on a sheet glued to it and, under it, what the account comes with. Sized in the notebook's `em`.
 */
function InsideCover({ lesson, trialDays }: { lesson: WelcomeLesson | null; trialDays: number }) {
	return (
		<div className="ob-inside">
			<div className="ob-index">
				{lesson ? (
					<LevelPath lesson={lesson} />
				) : (
					<>
						<p className="ob-start-eyebrow">In questo quaderno</p>
						<p className="mt-[0.6em] flex items-start gap-[0.6em] text-[0.88em] leading-snug">
							<ListChecks className="mt-[0.15em] size-[1.2em] shrink-0 text-[color:var(--ob-tone)]" aria-hidden="true" />
							Esercizi a livelli su ogni lezione: passi al successivo quando ti riesce.
						</p>
					</>
				)}
			</div>
			<p className="ob-inside-note">
				<Clock className="size-[1.25em] shrink-0" aria-hidden="true" />
				<span>Studio completo per {trialDays} giorni, senza carta. Poi teoria e formulari restano gratis.</span>
			</p>
		</div>
	);
}

/** The action of a step: under the content on a computer, held at the bottom of the screen on a phone. */
function Footer({ children }: { children: ReactNode }) {
	return (
		<div className="ob-foot ob-rise fixed inset-x-0 bottom-0 z-30 flex justify-center border-t border-edge-soft bg-surface/90 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:static sm:mt-10 sm:justify-start sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none" style={{ '--i': 6 } as CSSProperties}>
			{children}
		</div>
	);
}
