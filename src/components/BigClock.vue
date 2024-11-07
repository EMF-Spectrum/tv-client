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
import { inject, ref } from "vue";

import { HEARTBEAT_KEY } from "@/constants";

const heartbeat = inject(HEARTBEAT_KEY)!;

function timeBreakdown(num: DOMHighResTimeStamp): [number, number, number] {
	let ms = num % 1000;
	let temp = Math.floor(num / 1000);
	let s = temp % 60;
	let m = Math.floor(temp / 60);
	return [m, s, ms];
}

function digit(num: number, which: number): string {
	return (Math.floor(num / 10 ** which) % 10).toFixed(0);
}

const secondsTenthRef = ref("0");
const secondsRef = ref("0");
const tenSecondsRef = ref("0");
const minutesRef = ref("0");
const tenMinutesRef = ref("0");

function animationFrame() {
	window.requestAnimationFrame(animationFrame);
	let status = heartbeat.timer;
	if (status.state == "hidden") {
		return;
	}

	let display: number;
	if (status.state == "paused") {
		display = status.timeLeft;
	} else {
		display = Math.max(0, status.endTime - Date.now());
	}

	let [m, s, ms] = timeBreakdown(display);

	tenMinutesRef.value = digit(m, 1);
	minutesRef.value = digit(m, 0);
	tenSecondsRef.value = digit(s, 1);
	secondsRef.value = digit(s, 0);
	secondsTenthRef.value = digit(ms, 2);
}
window.requestAnimationFrame(animationFrame);
</script>

<template>
	<main
		class="big-clock"
		:class="{
			'-paused': heartbeat.timer.state != 'running',
			'-hidden': heartbeat.timer.state == 'hidden',
		}"
	>
		<div class="number digit-holder">
			<Transition>
				<div class="digit" :key="tenMinutesRef">
					{{ tenMinutesRef }}
				</div>
			</Transition>
		</div>
		<div class="number digit-holder">
			<Transition>
				<div class="digit" :key="minutesRef">
					{{ minutesRef }}
				</div>
			</Transition>
		</div>
		<div class="separator">:</div>
		<div class="number digit-holder">
			<Transition>
				<div class="digit" :key="tenSecondsRef">
					{{ tenSecondsRef }}
				</div>
			</Transition>
		</div>
		<div class="number digit-holder">
			<Transition>
				<div class="digit" :key="secondsRef">
					{{ secondsRef }}
				</div>
			</Transition>
		</div>
		<div class="separator">:</div>
		<div class="number digit-holder">
			<Transition>
				<div class="digit -fast" :key="secondsTenthRef">
					{{ secondsTenthRef }}
				</div>
			</Transition>
		</div>
		<!-- <div class="number digit-reel">
			<div class="reel -tenths">
				<div>8</div>
				<div>9</div>
				<div v-for="n in 10" :key="n">{{ n - 1 }}</div>
				<div>0</div>
				<div>1</div>
			</div>
		</div> -->
		<div class="number digit-reel">
			<div class="reel -hundredths">
				<div>8</div>
				<div>9</div>
				<div v-for="n in 10" :key="n">{{ n - 1 }}</div>
				<div>0</div>
				<div>1</div>
			</div>
		</div>
	</main>
</template>

<style lang="scss">
$height: 250px;

.big-clock {
	& {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;

		transition: opacity 0.5s;
	}

	&::after {
		content: "";
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(
			0deg,
			white calc(45% - ($height/2)),
			transparent calc(50% - ($height/2)),
			transparent calc(50% + ($height/2)),
			white calc(55% + ($height/2))
		);
		pointer-events: none;
	}

	&.-hidden {
		opacity: 0;
	}

	> .number,
	> .separator {
		font-size: $height;
		line-height: 1;
		text-align: center;
	}

	> .separator {
		flex: 0 0 auto;
	}

	> .number {
		flex: 0 0 1em;
	}
}

@keyframes digit-reel {
	0% {
		top: $height * -12;
	}

	100% {
		top: $height * -2;
	}
}

.digit-holder {
	& {
		position: relative;
		height: $height;
	}

	> .digit {
		& {
			height: $height;
			line-height: 1;
			width: 1em;
			text-align: center;
		}

		&.v-enter-active,
		&.v-leave-active {
			transition: top 0.2s ease-in-out;
			position: absolute;

			&.-fast {
				transition-duration: 0.05s;
			}
		}

		&.v-enter-from {
			top: $height * -1;
		}

		&.v-enter-to,
		&.v-leave-from {
			top: 0px;
		}

		&.v-leave-to {
			top: $height;
		}
	}
}

.digit-reel {
	& {
		position: relative;
		height: $height;
	}

	> .reel {
		position: absolute;
		animation: digit-reel 0s linear 0s infinite;

		.-paused & {
			filter: none !important;
			animation-play-state: paused;
		}
	}

	> .reel.-tenths {
		animation-duration: 1s;
		filter: blur(1px);
	}

	> .reel.-hundredths {
		animation-duration: 0.1s;
		filter: blur(3px);
	}
}
</style>
