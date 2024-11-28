<!--
 Copyright (C) 2024 EMF Spectrum Team

 This file is part of The EMF Spectrum TV System.

 The EMF Spectrum TV System is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 The EMF Spectrum TV System is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with The EMF Spectrum TV System.  If not, see <https://www.gnu.org/licenses/>.
-->

<script setup lang="ts">
import { Temporal } from "temporal-polyfill";
import { computed, inject, onWatcherCleanup, ref, watchEffect } from "vue";

import { API_KEY, HEARTBEAT_KEY } from "@/constants";

const heartbeat = inject(HEARTBEAT_KEY)!;

const timerDisplay = ref("-");

function setTimerDisplay(duration: Temporal.Duration) {
	duration = duration.round({
		largestUnit: "minutes",
		smallestUnit: "seconds",
	});
	// Fantastic, sane language
	let mins = duration.minutes.toString().padStart(2, "0");
	let secs = duration.seconds.toString().padStart(2, "0");
	timerDisplay.value = mins + ":" + secs;
}

watchEffect(() => {
	let timer = heartbeat.timer;
	if (timer.state == "hidden") {
		timerDisplay.value = "-";
		return;
	} else if (timer.state == "paused") {
		setTimerDisplay(
			Temporal.Duration.from({ milliseconds: timer.timeLeft }),
		);
	}
	let updateHandle: number;
	function update() {
		let timer = heartbeat.timer;
		if (timer.state != "running") {
			// This shouldn't happen because Vue should unregister the interval automatically
			window.clearInterval(updateHandle);
			return;
		}
		let now = Temporal.Now.instant();
		let then = Temporal.Instant.fromEpochMilliseconds(timer.endTime);
		setTimerDisplay(then.since(now));
	}
	updateHandle = setInterval(update, 1000);
	update();
	onWatcherCleanup(() => window.clearInterval(updateHandle));
});

const enum ButtonState {
	StartGame,
	NextPhase,
	Pause,
	Resume,
}

const buttonState = computed(() => {
	if (heartbeat.timer.state == "hidden") {
		if (heartbeat.turn == 0) {
			return ButtonState.StartGame;
		}
		return ButtonState.NextPhase;
	}
	if (heartbeat.timer.state == "paused") {
		return ButtonState.Resume;
	}
	return ButtonState.Pause;
});

const buttonText = computed(() => {
	switch (buttonState.value) {
		case ButtonState.StartGame:
			return "Start game";
		case ButtonState.NextPhase:
			return "Next";
		case ButtonState.Pause:
			return "Pause";
		case ButtonState.Resume:
			return "Resume";
		// Typescript says this switch statement is exhaustive (correct) but
		// eslint disagrees so we need to have this line to make it shut up
		default:
			throw new Error("This should never happen");
	}
});

const callAPI = inject(API_KEY)!;

function buttonClick() {
	let apiName;
	switch (buttonState.value) {
		case ButtonState.StartGame:
			apiName = "startGame";
			break;
		case ButtonState.NextPhase:
			apiName = "advancePhase";
			break;
		case ButtonState.Pause:
			apiName = "pause";
			break;
		case ButtonState.Resume:
			apiName = "unpause";
			break;
	}

	callAPI(apiName);
}
</script>

<template>
	<div class="admin-hud">
		<div class="turn turn-display">
			<span class="text">Turn</span>
			<span class="turn">{{ heartbeat.turn || "-" }}</span>
		</div>
		<div class="phase">
			{{ heartbeat.phase || "Game Setup" }}
		</div>
		<div
			class="timer"
			:class="{ '-paused': heartbeat.timer.state == 'paused' }"
		>
			{{ timerDisplay }}
		</div>

		<button
			type="button"
			class="btn btn-lg control my-2 ml-3"
			:class="{
				'btn-success':
					buttonState == ButtonState.StartGame ||
					buttonState == ButtonState.NextPhase,
				'btn-warning': buttonState == ButtonState.Resume,
				'btn-outline-warning': buttonState == ButtonState.Pause,
			}"
			@click="buttonClick"
		>
			{{ buttonText }}
		</button>
	</div>
</template>

<style lang="scss">
.admin-hud {
	& {
		display: flex;
	}

	> .turn,
	> .phase,
	> .timer {
		border-right: 2px solid black;
		padding: 0.1em 30px;
	}

	> .phase {
		flex-grow: 1;
		font-size: 48px;
	}

	> .timer {
		font-size: 48px;
		// Fixed width for the numbers
		text-align: center;
		font-family:
			Roboto Mono,
			"Courier New",
			Courier,
			monospace;
		flex-basis: 4.3em;
	}

	> .timer.-paused {
		color: red;
	}

	> .control {
		// margin-left: 30px;
		width: 10em;
	}
}

.turn-display {
	& {
		display: flex;
		flex-direction: column;
		text-align: center;
	}

	> .text {
		font-size: 20px;
	}

	> .turn {
		font-size: 30px;
		font-weight: 700;
	}
}
</style>
