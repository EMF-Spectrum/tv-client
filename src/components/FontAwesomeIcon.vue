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
import "@fortawesome/fontawesome-free/css/all.css";
import { computed } from "vue";

const props = defineProps<{
	name: string;
	type?: "solid" | "regular" | "brand";
}>();

const type = computed(() => {
	if (props.type == null) {
		return "solid";
	} else if (props.type == "brand") {
		return "brands";
	}
	return props.type;
});
</script>

<template>
	<i :class="`fa fa-${type} fa-${props.name}`" />
</template>
