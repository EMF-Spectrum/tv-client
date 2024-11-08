/**
 * Copyright (C) 2024 EMF Spectrum Team
 *
 * This file is part of The EMF Spectrum TV System.
 *
 * The EMF Spectrum TV System is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The EMF Spectrum TV System is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with The EMF Spectrum TV System.  If not, see <https://www.gnu.org/licenses/>.
 */
import { createRouter, createWebHistory } from "vue-router";
import { nextTick } from "vue";
import _ from "lodash";

import AdminView from "@/views/AdminView.vue";
import ClockView from "@/views/ClockView.vue";
import InitialView from "@/views/InitialView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "picker",
			component: InitialView,
			meta: { title: "There can only be one" },
		},
		{
			path: "/admin",
			name: "admin",
			component: AdminView,
			meta: {
				title: "Clarence Fortinbras' Stylish God-Panel for Event Control",
			},
		},
		{
			path: "/clock",
			name: "clock",
			component: ClockView,
			meta: { title: "EMF Spectrum - So good they named it once" },
		},
	],
});

const ORIGINAL_TITLE = document.title;

router.afterEach((to, from) => {
	document.body.classList.remove(`route-${from.name?.toString()}`);
	document.body.classList.add(`route-${to.name?.toString()}`);
	// https://stackoverflow.com/a/51640162
	nextTick(() => {
		let title = to.meta.title;
		if (_.isString(title)) {
			document.title = title;
		} else {
			document.title = ORIGINAL_TITLE;
		}
	});
});

export default router;
