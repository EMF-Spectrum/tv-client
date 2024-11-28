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
import { computed, inject, type DeepReadonly } from "vue";

import AdminTurnPhase from "@/components/AdminTurnPhase.vue";
import { API_KEY, GAME_KEY } from "@/constants";
import type { TurnConfig } from "@/types/data";

const props = defineProps({
	turnId: { type: String, required: true },
});

const game = inject(GAME_KEY)!;
const callAPI = inject(API_KEY)!;

const turn = computed<DeepReadonly<TurnConfig> | undefined>(
	() => game.turns[props.turnId],
);

function onAddPhase() {
	let label = prompt("Name?");
	if (!label) {
		return;
	}
	callAPI("newPhase", {
		turnID: props.turnId,
		phaseConfig: { label, length: null },
	});
}
</script>

<template>
	<tbody class="game-turn">
		<tr class="heading">
			<th scope="rowgroup" colSpan="2" class="name fs-5 ps-3">
				Turn {{ turn?.label ?? "⚠️" }}
			</th>
			<td class="control">
				<div class="d-flex">
					<button
						class="btn btn-outline-light btn-sm w-100"
						type="button"
						@click="onAddPhase"
					>
						Add Phase
					</button>
				</div>
			</td>
		</tr>

		<AdminTurnPhase
			v-for="phaseID in turn?.phases ?? []"
			:key="phaseID"
			:phase-id="phaseID"
			:is-current="phaseID == game.currentPhase?.id"
		/>
	</tbody>
</template>

<style lang="scss">
.game-turn {
	// Remove the double border for repeated tbodys
	.table tbody + & {
		border-top: 0;
	}

	$old-bs-info-colour: #d9edf7;

	> .heading > * {
		background-color: darken($old-bs-info-colour, 15%);

		[data-bs-theme="dark"] & {
			background-color: darken($old-bs-info-colour, 40%);
		}
	}

	// Chrome does not support position:sticky on trs
	> .heading > .name,
	> .heading > .control {
		position: sticky;
		top: 0;
		// Move above button groups
		z-index: 2;
	}
}
</style>
