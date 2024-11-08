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
import type { InjectionKey } from "vue";

import type { HeartbeatEvent, SpectrumGameEventEmitter } from "@/types/data";

export const API_KEY = Symbol() as InjectionKey<
	(name: string, data?: _.Dictionary<any>) => Promise<any>
>;
export const EVENT_KEY = Symbol() as InjectionKey<SpectrumGameEventEmitter>;
export const HEARTBEAT_KEY = Symbol() as InjectionKey<Readonly<HeartbeatEvent>>;

export const MAXIMUM_TERROR = 250;
