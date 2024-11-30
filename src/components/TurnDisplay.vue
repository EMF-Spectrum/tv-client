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
import { inject } from "vue";

import { HEARTBEAT_KEY } from "@/constants";

const heartbeat = inject(HEARTBEAT_KEY)!;
</script>

<template>
	<div class="turn-holder" v-if="heartbeat.turn != 0">
		<Transition>
			<div class="turn-tracker" :key="heartbeat.turn">
				<span class="label">Turn</span>
				<span class="number">{{ heartbeat.turn }}</span>
			</div>
		</Transition>
	</div>
</template>

<style lang="scss">
@use "@/assets/sizes";
@use "sass:math";

$half-turn: math.div(sizes.$turn-size, 2);

.turn-holder {
	margin: sizes.$turn-padding;

	transform-style: preserve-3d;
	position: absolute;
	transform: translateZ(-($half-turn));
	// perspective: 600px;
	// perspective-origin: center;
	width: sizes.$turn-size;
	height: sizes.$turn-size;
}

.turn-tracker {
	& {
		text-align: center;
		width: sizes.$turn-size;
		height: sizes.$turn-size;
		// width: 100%;
		// height: 100%;
		border: 10px solid black;
		position: absolute;
		transform: rotateY(0deg) translateZ(($half-turn));
		transform-style: preserve-3d;
	}

	&.v-enter-active,
	&.v-leave-active {
		transition: transform 0.5s linear;
		// transition: transform 10s linear;
	}

	&.v-enter-from {
		transform: rotateY(90deg) translateZ(($half-turn));
	}

	&.v-enter-to,
	&.v-leave-from {
		transform: rotateY(0deg) translateZ(($half-turn));
	}

	&.v-leave-to {
		transform: rotateY(-90deg) translateZ(($half-turn));
	}

	> .label {
		display: block;
		font-size: 72px;
		font-weight: 500;
	}

	> .number {
		display: block;
		position: relative;
		top: -2rem;
		font-size: 150px;
		font-weight: 700;
	}
}
</style>
