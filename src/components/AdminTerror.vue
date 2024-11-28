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

import { API_KEY, HEARTBEAT_KEY, MAXIMUM_TERROR } from "@/constants";

const heartbeat = inject(HEARTBEAT_KEY)!;
const callAPI = inject(API_KEY)!;

const disabled = computed(() => heartbeat.turn == 0);

function onAddTerror() {
	let amount = parseInt(prompt("How much terror?") || "");
	if (amount) {
		callAPI("addTerror", { amount });
	}
}

function onSetTerror() {
	let amount = parseInt(prompt("How much terror?") || "");
	if (amount) {
		callAPI("setTerror", { amount });
	}
}

function onRevealAliens() {
	let amount = Math.floor((MAXIMUM_TERROR - heartbeat.terror) / 2);
	if (amount > 0) {
		callAPI("addTerror", { amount });
	}
}
</script>

<template>
	<div
		:class="[
			'terror-controller',
			'd-flex',
			'align-items-center',
			'justify-content-between',
			'my-3',
		]"
	>
		<div class="btn-group">
			<button
				type="button"
				:disabled="disabled || heartbeat.terror <= 1"
				class="btn btn-outline-secondary btn-lg"
				@click="callAPI('addTerror', { amount: -1 })"
			>
				-
			</button>
			<button
				type="button"
				disabled
				class="btn btn-outline-secondary btn-lg"
			>
				Terror Tracker: {{ heartbeat.terror }}
			</button>
			<button
				type="button"
				class="btn btn-outline-secondary btn-lg"
				:disabled="disabled"
				@click="callAPI('addTerror', { amount: 1 })"
			>
				+
			</button>
		</div>
		<span class="divider flex-grow-1 text-center">|</span>
		<button
			type="button"
			class="btn btn-outline-secondary btn-lg me-2"
			:disabled="disabled"
			@click="onAddTerror"
		>
			Add Terror
		</button>
		<button
			type="button"
			class="btn btn-outline-secondary btn-lg me-2"
			:disabled="disabled"
			@click="onSetTerror"
		>
			Set Terror
		</button>
		<button
			type="button"
			class="btn btn-danger btn-lg"
			:disabled="disabled"
			@click="onRevealAliens"
		>
			Reveal Aliens
		</button>
	</div>
</template>
