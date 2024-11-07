/**
 * Copyright (C) 2024 EMF Spectrum Team
 *
 * This file is part of The EMF Spectrum TV System.
 *
 * The EMF Spectrum TV System is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The EMF Spectrum TV System is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with The EMF Spectrum TV System.  If not, see <https://www.gnu.org/licenses/>.
 */
import type { EventEmitter } from "events";
import type StrictEventEmitter from "strict-event-emitter-types";

// Quickfix - this type used to exist and now apparently doesn't.
export type DOMTimeStamp = number;

/*
 * Heartbeat types
 */
export interface TimerRunningStatus {
	state: "running";
	endTime: DOMTimeStamp;
}

export interface TimerPausedStatus {
	state: "paused";
	timeLeft: DOMTimeStamp;
}

export interface TimerHiddenStatus {
	state: "hidden";
}

export type TimerStatus =
	| TimerRunningStatus
	| TimerPausedStatus
	| TimerHiddenStatus;

export interface HeartbeatEvent {
	turn: number;
	phase: string;
	timer: TimerStatus;
	terror: number;
}

/*
 * Raw game info
 */

export interface PhaseConfig {
	id: string;
	label: string;
	length: number | null;
}

export interface CurrentPhaseData extends PhaseConfig {
	started: DOMTimeStamp;
	ends: DOMTimeStamp;
}

export interface TurnConfig {
	id: string;
	label: number;
	phases: string[];
}

export interface SavedGame {
	phases: {
		[id: string]: PhaseConfig;
	};
	turns: {
		[id: string]: TurnConfig;
	};
	turnOrder: string[];
	currentPhase: CurrentPhaseData | null;
	currentTurn: string | null;
	paused: { timeLeft: DOMTimeStamp } | false;
	terror: number;
	over: boolean;
}

export interface SocketEvents {
	heartbeat: HeartbeatEvent;
	phaseChange: CurrentPhaseData;
	turnChange: string;
	gameOver: void;
	disconnected: void;
	connected: void;
}

export type SpectrumGameEventEmitter = StrictEventEmitter<
	EventEmitter,
	SocketEvents
>;
