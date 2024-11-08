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
import { RouterLink } from "vue-router";

import { useBootstrap } from "@/composables/use-bootstap";

useBootstrap();
</script>

<template>
	<div class="container">
		<h1>Pick a side</h1>
		<RouterLink to="/clock" class="btn btn-primary btn-lg"
			>Giant clock</RouterLink
		>
		<div class="inline-divider">|</div>
		<RouterLink to="/admin" class="btn btn-primary btn-lg"
			>Admin</RouterLink
		>
	</div>
</template>

<style lang="css" scoped>
.inline-divider {
	display: inline-block;
	width: 3em;
	text-align: center;
}
</style>
