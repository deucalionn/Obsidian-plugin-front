import { Plugin, TFile } from "obsidian";

export default class SaveAndSendPlugin extends Plugin {
	async onload() {
		console.log("SaveAndSendPlugin loaded");
		// listen to file changes event
		this.registerEvent(
			this.app.vault.on("modify", async (file: TFile) => {
				const name = file.name;
				const content = await this.app.vault.read(file);

				const name_formated = name
					.replace(/ /g, "_")
					.toLowerCase()
					.replace(/.md/g, "");

				this.sendToServer(name_formated, content);
			})
		);
	}

	onunload() {
		console.log("SaveAndSendPlugin unloaded");
	}

	// send file to server (see back-end repo)
	async sendToServer(filename: string, content: string) {
		try {
			const response = await fetch(
				"http://localhost:8000/update_obsidian_file/" + filename,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ filename, content }),
				}
			);

			if (!response.ok) {
				console.error(`Error sending file: ${response.statusText}`);
			} else {
				console.log(`File ${filename} sent successfully!`);
			}
		} catch (error) {
			console.error("Error sending file:", error);
		}
	}
}
