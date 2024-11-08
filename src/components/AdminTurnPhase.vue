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
import { computed, inject, ref, watchEffect } from "vue";
import _ from "lodash";

import { API_KEY, GAME_KEY } from "@/constants";
import type { PhaseConfig } from "@/types/data";
import GlyphIcon from "@/components/GlyphIcon.vue";
import { Temporal } from "temporal-polyfill";

const props = defineProps({
	phaseId: { type: String, required: true },
	isCurrent: { type: Boolean },
});

const enum DisplayState {
	Display,
	Edit,
	Save,
}

const game = inject(GAME_KEY)!;
const callAPI = inject(API_KEY)!;

const phase = computed<Readonly<PhaseConfig> | undefined>(
	() => game.phases[props.phaseId],
);

function calculatePhaseMinutes(phase: PhaseConfig) {
	let duration = Temporal.Duration.from({ milliseconds: phase.length ?? 0 });
	return duration.total("minutes");
}

const phaseLength = computed(() => {
	let thisPhase = phase.value;
	if (!thisPhase || thisPhase.length == null) {
		return "-";
	}
	return `${calculatePhaseMinutes(thisPhase)} Minutes`;
});
const displayState = ref(DisplayState.Display);
const rowClass = computed(() => {
	if (displayState.value != DisplayState.Display) {
		if (props.isCurrent) {
			return "danger";
		}
		return "warning";
	} else if (props.isCurrent) {
		return "success";
	}
	return undefined;
});
const formID = computed(() => `edit-${props.phaseId}`);
const formLabel = ref("");
const formLength = ref<number | string>(0);
watchEffect(() => {
	if (phase.value != null) {
		formLabel.value = phase.value.label;
		formLength.value = calculatePhaseMinutes(phase.value);
	}
});
async function onSubmit(event: Event) {
	event.preventDefault();
	let label = formLabel.value.trim();
	let length = formLength.value;
	// The form validation should handle this automatically but...
	if (label == "") {
		alert("Invalid label!");
		return;
	} else if (!_.isNumber(length) || length < 0 || length > 99) {
		alert(`Invalid length "${length}"`);
		return;
	}
	displayState.value = DisplayState.Save;
	let duration = Temporal.Duration.from({ minutes: length });
	length = duration.total("milliseconds");
	let phaseConfig: PhaseConfig = {
		...phase.value!,
		label,
		length,
	};
	// RIP anyone who wanted a 0 minute round
	if (phaseConfig.length == 0) {
		phaseConfig.length = null;
	}
	try {
		await callAPI("editPhase", {
			phaseID: phaseConfig.id,
			phaseConfig,
		});
		displayState.value = DisplayState.Display;
	} catch (_) {
		displayState.value = DisplayState.Edit;
	}
}
</script>

<template>
	<tr class="game-phase" :class="rowClass" v-if="phase != undefined">
		<th scope="row" class="name">
			<template v-if="displayState == DisplayState.Display">
				{{ phase.label }}
			</template>
			<input
				v-else
				class="form-control"
				:disabled="displayState == DisplayState.Save"
				:form="formID"
				v-model.trim="formLabel"
				required
			/>
		</th>
		<td class="length">
			<template v-if="displayState == DisplayState.Display">
				{{ phaseLength }}
			</template>
			<input
				v-else
				class="form-control"
				:disabled="displayState == DisplayState.Save"
				:form="formID"
				v-model="formLength"
				required
				type="number"
				min="0"
				max="99"
				step="1"
			/>
		</td>
		<td class="controls">
			<div
				class="btn-group btn-group-justified"
				v-if="displayState == DisplayState.Display"
			>
				<div class="btn-group">
					<button
						type="button"
						class="btn btn-primary"
						title="Edit"
						@click="displayState = DisplayState.Edit"
					>
						<GlyphIcon name="edit" />
					</button>
				</div>
				<div class="btn-group">
					<button
						type="button"
						class="btn btn-danger"
						@click="callAPI('setPhase', { phaseID: props.phaseId })"
						:title="isCurrent ? 'Restart' : 'Jump here'"
					>
						<GlyphIcon
							:name="isCurrent ? 'refresh' : 'play-circle'"
						/>
					</button>
				</div>
				<div class="btn-group">
					<button
						type="button"
						class="btn btn-default"
						title="Move up"
						@click="
							callAPI('bumpPhase', {
								phaseID: props.phaseId,
								direction: 'up',
							})
						"
					>
						<GlyphIcon name="chevron-up" />
					</button>
				</div>
				<div class="btn-group">
					<button
						type="button"
						class="btn btn-default"
						title="Move down"
						@click="
							callAPI('bumpPhase', {
								phaseID: props.phaseId,
								direction: 'down',
							})
						"
					>
						<GlyphIcon name="chevron-down" />
					</button>
				</div>
			</div>
			<form :id="formID" @submit="onSubmit" v-else>
				<button
					class="btn btn-primary"
					:disabled="displayState == DisplayState.Save"
					type="submit"
				>
					Save
				</button>
				<button
					class="btn btn-link"
					:disabled="displayState == DisplayState.Save"
					type="button"
					@click="displayState = DisplayState.Display"
				>
					Cancel
				</button>
			</form>
		</td>
	</tr>
</template>

<style lang="scss">
.game-phase {
	> .name {
		padding-left: 2em;
		font-weight: normal;
		vertical-align: middle;
	}

	> .length {
		vertical-align: middle;
	}

	> .controls > form {
		display: flex;
		justify-content: space-between;
	}
}
</style>
