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
import { Vue3Marquee } from "vue3-marquee";

const heartbeat = inject(HEARTBEAT_KEY)!;

const TICKER_TEXT = [
	"one",
	"two",
	"three",
	"four",
	"five",
	"six",
	"seven",
	"eight",
	"nine",
	"ten",
	"eleven",
];
</script>

<template>
	<div class="news-ticker" v-if="heartbeat.turn != 0">
		<Vue3Marquee
			:pause="heartbeat.timer.state == 'paused'"
			:duration="60"
			:clone="true"
		>
			<span
				class="item"
				v-for="(text, index) in TICKER_TEXT"
				:key="`${heartbeat.phase}-${index}`"
			>
				{{ heartbeat.phase }} {{ index }}
			</span>
			<!-- <span class="item">{{ heartbeat.phase }}</span> -->
		</Vue3Marquee>
	</div>
</template>

<style lang="scss">
$height: 100px;
$item-padding: 0.7em;

.news-ticker {
	& {
		background-color: black;

		position: absolute;
		bottom: 0;
		left: -300px;
		right: 0;
		height: $height;

		font-family: "Roboto Mono", "STIX Two Math";
		color: white;
		font-size: 60px;
		font-weight: 400;
		line-height: $height;
	}

	.item::after {
		padding-right: $item-padding;
		padding-left: $item-padding;
		content: "⍭";
	}
}
</style>
