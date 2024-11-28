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

import AdminTurnRow from "@/components/AdminTurnRow.vue";
import { API_KEY, GAME_KEY } from "@/constants";

const game = inject(GAME_KEY)!;
const callAPI = inject(API_KEY)!;
</script>

<template>
	<table class="table table-striped mt-3">
		<colgroup>
			<col width="40%" />
			<col width="40%" />
			<col width="15%" />
		</colgroup>
		<AdminTurnRow
			v-for="turnID in game.turnOrder"
			:key="turnID"
			:turn-id="turnID"
		/>
	</table>
	<div class="mb-5 d-flex">
		<button
			type="button"
			className="btn btn-outline-secondary btn-lg w-100"
			@click="callAPI('newTurn')"
		>
			Add Turn
		</button>
	</div>
</template>
