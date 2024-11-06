<script setup lang="ts">
import BigClock from "@/components/BigClock.vue";
import NewsTicker from "@/components/NewsTicker.vue";
import PhaseDisplay from "@/components/PhaseDisplay.vue";
import TerrorTracker from "@/components/TerrorTracker.vue";
import TurnDisplay from "@/components/TurnDisplay.vue";
</script>

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
<template>
	<section class="main-page">
		<header class="header clock-header">
			<TurnDisplay class="turn" />
			<PhaseDisplay class="phase" />
		</header>
		<BigClock class="clock" />
		<footer class="footer clock-footer">
			<TerrorTracker class="terror" />
			<NewsTicker class="ticker" />
		</footer>
	</section>
</template>

<style lang="scss">
@use "@/assets/sizes";

* {
	box-sizing: border-box;
}

html,
body {
	padding: 0;
	margin: 0;
	height: 100%;
	overflow: hidden;
	font-family: "Orbitron", sans-serif;

	background: white;
	color: black;
}

.main-page {
	& {
		grid-template-rows:
			[header] sizes.$header-height
			[clock] 1fr
			[footer] sizes.$footer-height;
		grid-template-columns: 1fr;
		height: 100%;
		display: grid;
	}

	> * {
		position: relative;
	}

	> .header {
		grid-row: header;
	}

	> .clock {
		grid-row: clock;
	}

	> .footer {
		grid-row: footer;
	}
}
</style>
