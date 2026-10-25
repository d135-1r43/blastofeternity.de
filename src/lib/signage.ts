/**
 * What the festival signage at /ps shows at a given moment.
 *
 * The running order only carries start times and a day label, so this turns it
 * into real points in time and works out, for any `now`, which band is on stage,
 * which one comes next and what is still to come. Anything that has already
 * happened is dropped — the screen only ever looks forward.
 *
 * Times are local to the device, which is the display in the venue.
 */

import type { Band, Festival, RunningOrderSlot } from './types';

/** Assumed changeover between two sets when a slot has no explicit `end`. */
const CHANGEOVER_MIN = 15;
/** Assumed length of the last set of a day when it has no explicit `end`. */
const LAST_SET_MIN = 75;

const MINUTE = 60_000;

export type TimedSlot = {
	day: string;
	/** `YYYY-MM-DD` of the day the slot belongs to. */
	date: string;
	time: string;
	name: string;
	doors: boolean;
	band: Band | null;
	start: Date;
	end: Date;
	/** True when `end` comes from `RunningOrderSlot.end` rather than an estimate. */
	endKnown: boolean;
};

export type FestivalDay = {
	label: string;
	date: string;
	doors: TimedSlot | null;
	acts: TimedSlot[];
	start: Date;
	end: Date;
};

export type Moment =
	/** A band is on stage. */
	| {
			mode: 'live';
			day: FestivalDay;
			current: TimedSlot;
			next: TimedSlot | null;
			later: TimedSlot[];
	  }
	/** Doors are open or the stage is being changed over; the next band is up soon. */
	| { mode: 'soon'; day: FestivalDay; doorsOpen: boolean; next: TimedSlot; later: TimedSlot[] }
	/** Nothing is happening yet today, or the evening is over and another day follows. */
	| { mode: 'waiting'; day: FestivalDay; acts: TimedSlot[] }
	/** The festival is over. */
	| { mode: 'over' };

const pad = (n: number) => String(n).padStart(2, '0');

function at(date: string, time: string): Date {
	const [y, m, d] = date.split('-').map(Number);
	const [h, min] = time.split(':').map(Number);
	return new Date(y, m - 1, d, h, min);
}

/** `Freitag 06.11.` plus the festival year → `2026-11-06`. */
function dateOf(day: string, year: number): string {
	const match = day.match(/(\d{1,2})\.(\d{1,2})\./);
	if (!match) throw new Error(`Running order day without a date: "${day}"`);
	return `${year}-${pad(Number(match[2]))}-${pad(Number(match[1]))}`;
}

const normalise = (s: string) => s.toLocaleLowerCase('de-DE').trim();

export function buildDays(festival: Festival): FestivalDay[] {
	const bands = new Map(festival.lineup.map((b) => [normalise(b.name), b]));
	const grouped = new Map<string, RunningOrderSlot[]>();
	for (const slot of festival.running_order) {
		grouped.set(slot.day, [...(grouped.get(slot.day) ?? []), slot]);
	}

	return [...grouped].map(([label, slots]) => {
		const date = dateOf(label, festival.year);
		const starts = slots.map((s) => at(date, s.time));

		const timed = slots.map((slot, i): TimedSlot => {
			const start = starts[i];
			const following = starts[i + 1];
			let end: Date;
			if (slot.end) {
				end = at(date, slot.end);
				// a set that runs past midnight
				if (end <= start) end = new Date(end.getTime() + 24 * 60 * MINUTE);
			} else if (slot.doors) {
				end = following ?? new Date(start.getTime() + 30 * MINUTE);
			} else if (following) {
				end = new Date(following.getTime() - CHANGEOVER_MIN * MINUTE);
			} else {
				end = new Date(start.getTime() + LAST_SET_MIN * MINUTE);
			}
			return {
				day: label,
				date,
				time: slot.time,
				name: slot.band,
				doors: !!slot.doors,
				band: slot.doors ? null : (bands.get(normalise(slot.band)) ?? null),
				start,
				end,
				endKnown: !!slot.end
			};
		});

		const acts = timed.filter((s) => !s.doors);
		const doors = timed.find((s) => s.doors) ?? null;
		return {
			label,
			date,
			doors,
			acts,
			start: timed[0].start,
			end: acts.length ? acts[acts.length - 1].end : timed[timed.length - 1].end
		};
	});
}

export function momentAt(days: FestivalDay[], now: Date): Moment {
	const t = now.getTime();
	// the first day whose programme is not over yet
	const day = days.find((d) => d.end.getTime() > t);
	if (!day) return { mode: 'over' };

	if (t < day.start.getTime()) {
		return { mode: 'waiting', day, acts: day.acts };
	}

	const current = day.acts.find((a) => a.start.getTime() <= t && t < a.end.getTime()) ?? null;
	const ahead = day.acts.filter((a) => a.start.getTime() > t);

	if (current) {
		const [next = null, ...later] = ahead;
		return { mode: 'live', day, current, next, later };
	}

	const [next, ...later] = ahead;
	const doorsOpen = !day.acts.some((a) => a.start.getTime() <= t);
	return { mode: 'soon', day, doorsOpen, next, later };
}

/** The day after `day`, if the festival has one. */
export function dayAfter(days: FestivalDay[], day: FestivalDay): FestivalDay | null {
	return days[days.indexOf(day) + 1] ?? null;
}

/* ------------------------------------------------------------ formatting */

export const clock = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

/** `in 5 Min`, `in 1 Std. 20 Min` — or `gleich` for the last minute. */
export function countdown(from: Date, to: Date): string {
	const minutes = Math.ceil((to.getTime() - from.getTime()) / MINUTE);
	if (minutes <= 1) return 'gleich';
	if (minutes < 60) return `in ${minutes} Min`;
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	return m ? `in ${h} Std. ${m} Min` : `in ${h} Std.`;
}

const dayStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/** `Heute`, `Morgen`, or the label from the running order. */
export function relativeDay(day: FestivalDay, now: Date): string {
	const diff = Math.round((dayStart(day.start) - dayStart(now)) / (24 * 60 * MINUTE));
	if (diff === 0) return 'Heute';
	if (diff === 1) return 'Morgen';
	return day.label;
}

/* ------------------------------------------------------------ debug presets */

export type Preset = { label: string; time: Date };

/**
 * Moments worth checking the screen at, derived from the running order so they
 * follow it when it changes.
 */
export function presets(days: FestivalDay[]): { day: string; items: Preset[] }[] {
	if (!days.length) return [];
	const first = days[0];
	const last = days[days.length - 1];
	const plus = (d: Date, min: number) => new Date(d.getTime() + min * MINUTE);
	const morning = (day: FestivalDay, hour: number) =>
		new Date(day.start.getFullYear(), day.start.getMonth(), day.start.getDate(), hour);

	const groups = days.map((day) => {
		const items: Preset[] = [{ label: 'Vormittag', time: morning(day, 11) }];
		if (day.doors) {
			items.push({ label: 'Kurz vor Einlass', time: plus(day.doors.start, -10) });
			items.push({ label: 'Einlass läuft', time: plus(day.doors.start, 10) });
		}
		day.acts.forEach((act, i) => {
			items.push({ label: act.name, time: plus(act.start, 10) });
			if (i < day.acts.length - 1) {
				items.push({ label: 'Umbau', time: plus(act.end, 3) });
			}
		});
		items.push({ label: 'Nach Programmende', time: plus(day.end, 20) });
		return { day: day.label, items };
	});

	return [
		{
			day: 'Rahmen',
			items: [
				{ label: 'Eine Woche vorher', time: plus(morning(first, 18), -7 * 24 * 60) },
				{ label: 'Am Vorabend', time: plus(morning(first, 20), -24 * 60) },
				{ label: 'Festival vorbei', time: plus(last.end, 3 * 60) }
			]
		},
		...groups
	];
}
