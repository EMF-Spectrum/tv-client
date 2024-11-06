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
		},
		{
			path: "/admin",
			name: "admin",
			component: AdminView,
		},
		{
			path: "/clock",
			name: "clock",
			component: ClockView,
		},
	],
});

export default router;
