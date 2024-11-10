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
import { provide, readonly, ref, shallowReactive } from "vue";
import { RouterView } from "vue-router";

import { EVENT_KEY, GAMEOVER_KEY, HEARTBEAT_KEY } from "@/constants";
import type { HeartbeatEvent } from "@/types/data";
import { Socket } from "@/utils/socket";

let sockURL = new URL("/socket", window.location.href);
sockURL.protocol = "ws";
let sock = new Socket(sockURL.href);

const lastHeartbeat = shallowReactive({
	phase: "",
	terror: 0,
	timer: { state: "hidden" },
	turn: 0,
} as HeartbeatEvent);
const gameOver = ref(false);

sock.on("heartbeat", (beat) => {
	lastHeartbeat.phase = beat.phase;
	lastHeartbeat.terror = beat.terror;
	lastHeartbeat.timer = beat.timer;
	lastHeartbeat.turn = beat.turn;
});
sock.on("gameOver", () => {
	gameOver.value = true;
});

sock.connect();

provide(HEARTBEAT_KEY, readonly(lastHeartbeat));
provide(EVENT_KEY, sock);
provide(GAMEOVER_KEY, gameOver);
</script>

<template>
	<RouterView />
</template>

<style>
#app {
	height: 100%;
	padding: 0;
	margin: 0;
}
</style>
