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

import { HEARTBEAT_KEY } from "@/constants";

const heartbeat = inject(HEARTBEAT_KEY)!;

const disabled = computed(() => heartbeat.turn == 0);
</script>

<template>
	<p class="terror-controller">
		<button
			type="button"
			:disabled="disabled || heartbeat.terror < 1"
			class="btn btn-default btn-lg"
		>
			-
		</button>
		{{ " " }}
		<button type="button" disabled class="btn btn-default btn-lg">
			Terror Tracker: {{ heartbeat.terror }}
		</button>
		{{ " " }}
		<button
			type="button"
			class="btn btn-default btn-lg"
			:disabled="disabled"
		>
			+
		</button>
		<span class="divider">|</span>
		<button
			type="button"
			class="btn btn-default btn-lg"
			:disabled="disabled"
		>
			Add Terror
		</button>
		{{ " " }}
		<button
			type="button"
			class="btn btn-default btn-lg"
			:disabled="disabled"
		>
			Set Terror
		</button>
		{{ " " }}
		<button
			type="button"
			class="btn btn-danger btn-lg"
			:disabled="disabled"
		>
			Reveal Aliens
		</button>
	</p>
</template>

<style lang="scss">
.terror-controller {
	& {
		margin-top: 1em;
	}

	> .divider {
		display: inline-block;
		margin: 0 2em;
	}
}
</style>
