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
import { computed, inject, ref } from "vue";

import { HEARTBEAT_KEY } from "@/constants";

const MAXIMUM_TERROR = 250;
const TICK_WIDTH = 450;

const heartbeat = inject(HEARTBEAT_KEY)!;

const tickRefs = ref<HTMLLIElement[]>([]);

// TODO: Transition
const offset = computed(() => {
	let terror = heartbeat.terror;
	if (terror < 1) {
		return 0;
	}

	// "It should be noted that the ref array does not guarantee the same order
	// as the source array." 🙄
	let tick = tickRefs.value.find(
		(el) => el.dataset["tick"] == terror.toString(),
	);

	if (!tick) {
		return 0;
	}

	return (window.innerWidth - TICK_WIDTH) / 2 - tick.offsetLeft;
});
</script>

<template>
	<ol
		class="terror-tracker"
		:class="{ '-visible': heartbeat.terror != 0 }"
		:style="{ left: offset + 'px' }"
	>
		<li
			class="tick"
			v-for="n in MAXIMUM_TERROR"
			:key="n"
			:data-tick="n"
			:id="`terror-tick-${n}`"
			ref="tickRefs"
		>
			{{ n == MAXIMUM_TERROR ? "PANIC" : n }}
		</li>
	</ol>
	<div class="terror-fade"></div>
</template>

<style lang="scss">
@use "sass:color";
@use "sass:math";

$height: 150px;
$tick-width: 450px;

$colour-1: rgb(39, 194, 53);
$colour-50: rgb(215, 214, 67);
$colour-200: rgb(218, 68, 19);
$colour-250: rgb(255, 0, 0);

.terror-tracker {
	& {
		position: absolute;

		top: 0;
		// Start on 1, will be updated by JS
		left: calc(50% - (#{$tick-width} / 2));
		height: $height;

		overflow: hidden;
		white-space: nowrap;
		display: flex;
		flex-wrap: nowrap;
		align-items: baseline;

		list-style: none;
		margin: 0;
		padding: 0;

		opacity: 0;

		transition: left 2s cubic-bezier(0.33, -0.15, 0.63, 1.35) 0s;
	}

	&.-visible {
		opacity: 1;
	}

	> .tick {
		display: block;
		position: relative;
		top: -1.5rem;
		// flex: 0 0 auto;
		font-size: 140px;
		font-weight: 400;
		width: 450px;
		text-align: center;
	}

	> .tick:not(:last-child):after {
		content: "";
		display: block;
		position: absolute;
		top: 50px;
		right: 0;
		bottom: 0;
		width: 10px;
		background-color: black;
	}

	> .tick:nth-child(50n) {
		font-size: 160px;
		font-weight: 600;

		// Nasty hack because baselines are terrible
		&::after {
			top: 71px;
		}
	}
}

.terror-fade {
	& {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(
			90deg,
			white 0%,
			transparent 15%,
			transparent 85%,
			white 100%
		);
		pointer-events: none;
	}
}

// I can't think of a better way to do this rn
@for $step from 1 through 250 {
	#terror-tick-#{$step} {
		@if $step < 50 {
			color: color.mix(
				// color.mix is apparently backwards
				$colour-50,
				$colour-1,
				math.div($step, 50) * 100%
			);
		} @else if $step < 200 {
			color: color.mix(
				$colour-200,
				$colour-50,
				math.div(($step - 50), 150) * 100%
			);
		} @else {
			color: color.mix(
				$colour-250,
				$colour-200,
				math.div(($step - 200), 50) * 100%
			);
		}
	}
}
</style>
