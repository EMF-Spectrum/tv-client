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
import { computed, inject } from "vue";

import BigClock from "@/components/BigClock.vue";
import NewsTicker from "@/components/NewsTicker.vue";
import PhaseDisplay from "@/components/PhaseDisplay.vue";
import TerrorTracker from "@/components/TerrorTracker.vue";
import TurnDisplay from "@/components/TurnDisplay.vue";
import { GAMEOVER_KEY, HEARTBEAT_KEY } from "@/constants";

const heartbeat = inject(HEARTBEAT_KEY)!;
const gameOver = inject(GAMEOVER_KEY)!;

const pageClass = computed(() => {
	let className: _.Dictionary<boolean> = {};
	className["main-page"] = true;
	className[`-timer-${heartbeat.timer.state}`] = true;
	className["-not-started"] = heartbeat.turn == 0 && !gameOver.value;
	className["-game-over"] = heartbeat.turn == 0 && gameOver.value;
	return className;
});
</script>

<template>
	<section :class="pageClass">
		<header class="header clock-header">
			<TurnDisplay class="turn" />
			<PhaseDisplay class="phase" />
		</header>
		<BigClock class="clock" />
		<footer class="footer clock-footer">
			<TerrorTracker class="terror" />
			<NewsTicker class="ticker" />
		</footer>
		<div class="overlay -paused">Game Paused</div>
		<div class="overlay -game-over">Thank you for playing!</div>
		<div class="overlay -not-started">Please Wait</div>
	</section>
</template>

<style lang="scss">
@use "@/assets/sizes";

body.route-clock {
	overflow: hidden;
	background: white;
	color: black;
}

.main-page {
	& {
		grid-template-rows:
			[header] sizes.$header-height
			[clock] 1fr
			[footer] sizes.$footer-height;
		grid-template-columns: 1fr;
		height: 100%;
		display: grid;
	}

	> .overlay {
		text-align: center;
		line-height: 100vh;
		position: absolute;
		z-index: 10;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		$transition-time: 0.5s;
		transition:
			opacity $transition-time linear,
			background-color $transition-time linear,
			transform $transition-time linear;
		background-color: rgba(255, 255, 255, 0);
		transform: scale(1.2);
	}

	> .overlay.-paused {
		font-size: 200px;
		background: url("@/assets/frost-border.png");
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
	}

	&.-timer-paused > .overlay.-paused {
		opacity: 1;
		transform: scale(1);
		background-color: rgba($color: lightblue, $alpha: 0.8);
	}

	.overlay.-game-over,
	.overlay.-not-started {
		font-size: 100px;
		color: white;
	}

	&.-game-over > .overlay.-game-over {
		opacity: 1;
		transform: scale(1);
		background-color: black;
	}

	&.-not-started > .overlay.-not-started {
		opacity: 1;
		transform: scale(1);
		background-color: black;
	}

	> * {
		position: relative;
	}

	> .header {
		grid-row: header;
	}

	> .clock {
		grid-row: clock;
	}

	> .footer {
		grid-row: footer;
	}
}
</style>
