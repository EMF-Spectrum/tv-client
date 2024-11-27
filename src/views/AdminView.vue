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
import _ from "lodash";
import { Temporal } from "temporal-polyfill";
import {
	inject,
	onMounted,
	onUnmounted,
	provide,
	reactive,
	readonly,
} from "vue";

import AdminHUD from "@/components/AdminHUD.vue";
import AdminTerror from "@/components/AdminTerror.vue";
import AdminTicker from "@/components/AdminTicker.vue";
import { useBootstrap } from "@/composables/use-bootstap";
import { API_KEY, EVENT_KEY, GAME_KEY } from "@/constants";
import type { SavedGame } from "@/types/data";
import AdminTurnTable from "@/components/AdminTurnTable.vue";

const REFRESH_GAME_EVERY = Temporal.Duration.from({ minutes: 1 });

useBootstrap();

//
// Admin fetch API
//

// TODO: show a loading spinner when API calls are going, display a better modal
// for errors and so on
async function callAPI(func: string, data?: _.Dictionary<any>): Promise<any> {
	let res, resData;
	try {
		res = await fetch(`/api/${func}`, {
			method: "POST",
			body: data && JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (res.status != 204) {
			resData = await res.json();
		}
	} catch (e) {
		console.error(e);
		alert(`Failed to call ${func}! Check console.`);
		throw e;
	}
	if (res.status >= 300) {
		let { error, stack } = resData;
		console.error("Failed to %s:", func, error, stack);
		alert(`Failed to ${func}: ${error}`);
		throw new Error(error);
	}
	return resData;
}
provide(API_KEY, callAPI);

//
// Master saved game
//

const savedGame: SavedGame = reactive({
	currentPhase: null,
	currentTurn: null,
	over: false,
	paused: false,
	phases: {},
	terror: 0,
	turnOrder: [],
	turns: {},
});
provide(GAME_KEY, readonly(savedGame));

//
// Socket events to keep game up to date
//

const socket = inject(EVENT_KEY)!;
socket.on("gameOver", () => {
	savedGame.over = true;
});
socket.on("phaseChange", (currentPhase) => {
	savedGame.currentPhase = currentPhase;
});
socket.on("phaseEdit", (phase) => {
	let id = phase.id;
	if (!(id in savedGame.phases)) {
		savedGame.phases[id] = phase;
		return;
	}
	_.merge(savedGame.phases[id], phase);
});
socket.on("turnChange", (currentTurn) => {
	savedGame.currentTurn = currentTurn;
});
socket.on("turnEdit", (turn) => {
	let id = turn.id;
	if (!(id in savedGame.turns)) {
		savedGame.turns[id] = turn;
		return;
	}
	_.merge(savedGame.turns[id], turn);
});
socket.on("turnOrderEdit", (turnOrder) => {
	savedGame.turnOrder = turnOrder;
});

//
// Regular full refreshes for saved game
//

async function fetchSavedGame() {
	let newGame = await callAPI("getSaveGame");
	_.merge(savedGame, newGame);
}
socket.on("connected", fetchSavedGame);

let fetchHandle: number;
onMounted(() => {
	fetchSavedGame();
	fetchHandle = window.setInterval(
		fetchSavedGame,
		REFRESH_GAME_EVERY.total("milliseconds"),
	);
});

onUnmounted(() => {
	window.clearInterval(fetchHandle);
});
</script>

<template>
	<div className="container">
		<AdminHUD />
		<AdminTerror />
		<AdminTicker />
		<AdminTurnTable />
	</div>
</template>
