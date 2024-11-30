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

import { autobind } from "core-decorators";
import { EventEmitter } from "events";

import type { SpectrumGameEventEmitter } from "@/types/data";

function asyncSleep(time: number): Promise<void> {
	return new Promise((r) => window.setTimeout(r, time));
}

const TIMEOUT = 100;

export class Socket extends (EventEmitter as any as {
	new (): SpectrumGameEventEmitter;
}) {
	private socket?: WebSocket;

	constructor(private sockURL: string) {
		super();
	}

	@autobind
	private onMessage(event: MessageEvent): void {
		try {
			let { type, data } = JSON.parse(event.data);
			if (type) {
				this.emit(type, data);
			}

			console.debug("Message: %s %O", type, data);
		} catch (e) {
			console.error(
				"Got invalid data %o from the server!",
				event.data,
				e,
			);
		}
	}

	private async actualConnect(): Promise<void> {
		console.info("Connecting...");
		let sock = new WebSocket(this.sockURL);
		this.socket = sock;

		await new Promise((resolve, reject) => {
			function onError(): void {
				reject(new Error("Failed to connect!"));
			}
			sock.addEventListener("error", onError);
			sock.addEventListener("open", () => {
				sock.removeEventListener("error", onError);
				this.emit("connected");
				resolve(sock);
			});
		});
		console.info("Connected!");
		this.connectionPromise = undefined;

		sock.addEventListener("message", this.onMessage);
		sock.addEventListener("close", (ev) => {
			if (!ev.wasClean) {
				console.warn("Socket closed, retrying");
				this.connectionPromise = this.infiniteRetry();
			}
		});
	}

	private async infiniteRetry(): Promise<void> {
		while (!this.socket || this.socket.readyState != WebSocket.OPEN) {
			await asyncSleep(TIMEOUT);
			try {
				await this.actualConnect();
			} catch (e) {
				console.error("Failed to connect", e);
			}
		}
	}

	private connectionPromise?: Promise<void>;

	public connect(): Promise<void> {
		if (this.connectionPromise) {
			return this.connectionPromise;
		} else if (this.socket && this.socket.readyState == WebSocket.OPEN) {
			return Promise.resolve();
		}

		this.connectionPromise = this.actualConnect();

		return this.connectionPromise;
	}
}
