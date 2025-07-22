import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const ffmpeg = new FFmpeg({ log: true });

self.onmessage = async (e) => {
  try {
    console.log("[Worker] Received file:", e.data);
    const file = e.data;

    if (!ffmpeg.loaded) {
      console.log("[Worker] Loading ffmpeg...");
      await ffmpeg.load();
      console.log("[Worker] ffmpeg loaded");
    }

    console.log("[Worker] Writing file...");
    await ffmpeg.writeFile("input.mp4", await fetchFile(file));

    console.log("[Worker] Running ffmpeg command...");
    const inputName = "input.mp4";
    const outputName = "output.mp4";
    await ffmpeg.exec([
      "-i",
      inputName,
      "-vcodec",
      "libx264",
      "-crf",
      "32",
      "-preset",
      "ultrafast",
      outputName,
    ]);
    console.log("[Worker] Reading output file...");
    const data = await ffmpeg.readFile("output.mp4");

    const compressedBlob = new Blob([data.buffer], { type: "video/mp4" });

    console.log("[Worker] Sending back compressed file...");
    self.postMessage({ file: compressedBlob });
  } catch (error) {
    console.error("[Worker] Compression failed:", error);
    self.postMessage({ error: error.message });
  }
};
