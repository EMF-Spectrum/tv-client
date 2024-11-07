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
import { inject, ref, watchEffect } from "vue";

import { HEARTBEAT_KEY } from "@/constants";

const enum Doing {
	IN,
	OUT,
	STATIC,
}

const DELETING_SPEED = 50;
const TYPING_SPEED = 100;

const heartbeat = inject(HEARTBEAT_KEY)!;
const currentPhaseText = ref("");
let targetPhaseText = "";
let doing = Doing.STATIC;

let timerKey: number;

function timer() {
	if (doing == Doing.IN) {
		let ctext = currentPhaseText.value;
		if (ctext == targetPhaseText) {
			doing = Doing.STATIC;
			window.clearInterval(timerKey);
			return;
		}
		ctext = targetPhaseText.substring(0, ctext.length + 1);
		currentPhaseText.value = ctext;
	} else if (doing == Doing.OUT) {
		let ctext = currentPhaseText.value;
		if (ctext == "") {
			doing = Doing.IN;
			window.clearInterval(timerKey);
			timerKey = window.setInterval(timer, TYPING_SPEED);
			return;
		}
		ctext = ctext.substring(0, ctext.length - 1);
		currentPhaseText.value = ctext;
	} else {
		window.clearInterval(timerKey);
	}
}

watchEffect(() => {
	if (heartbeat.phase != targetPhaseText) {
		targetPhaseText = heartbeat.phase;
		doing = Doing.OUT;
		window.clearInterval(timerKey);
		timerKey = window.setInterval(timer, DELETING_SPEED);
	}
});
</script>

<template>
	<h1 class="phase-tracker">{{ currentPhaseText }}</h1>
</template>

<style lang="scss">
@use "@/assets/sizes";

.phase-tracker {
	& {
		text-align: center;
		font-size: 160px;
		font-weight: 500;
		margin: 0;

		line-height: sizes.$header-height;
		height: sizes.$header-height;

		white-space: nowrap;
	}
}
</style>
