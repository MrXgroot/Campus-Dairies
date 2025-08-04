import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const ffmpeg = new FFmpeg({
  log: true,
  // Add progress callback for FFmpeg compression progress
  progress: ({ progress, time }) => {
    if (progress > 0) {
      self.postMessage({
        type: "compression_progress",
        progress: Math.round(progress * 100),
        time,
      });
    }
  },
});

self.onmessage = async (e) => {
  try {
    console.log("[Worker] Received file:", e.data);
    const file = e.data;

    if (!ffmpeg.loaded) {
      console.log("[Worker] Loading ffmpeg...");

      // Notify that FFmpeg is downloading
      self.postMessage({
        type: "ffmpeg_loading_start",
        message: "Downloading FFmpeg modules (may take a moment)...",
      });

      try {
        await ffmpeg.load();
        console.log("[Worker] ffmpeg loaded");

        self.postMessage({
          type: "ffmpeg_loading_complete",
          message: "FFmpeg modules downloaded successfully",
        });
      } catch (loadError) {
        console.error("[Worker] FFmpeg loading failed:", loadError);
        self.postMessage({
          type: "ffmpeg_loading_error",
          error:
            "Failed to download FFmpeg modules. Please check your internet connection and try again.",
        });
        return;
      }
    }

    console.log("[Worker] Writing file...");
    self.postMessage({
      type: "compression_status",
      message: "Preparing video for compression...",
    });

    await ffmpeg.writeFile("input.mp4", await fetchFile(file));

    console.log("[Worker] Running ffmpeg command...");
    self.postMessage({
      type: "compression_status",
      message: "Compressing video...",
    });

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
      "-progress",
      "pipe:1", // Enable progress reporting
      outputName,
    ]);

    console.log("[Worker] Reading output file...");
    self.postMessage({
      type: "compression_status",
      message: "Finalizing compressed video...",
    });

    const data = await ffmpeg.readFile("output.mp4");
    const compressedBlob = new Blob([data.buffer], { type: "video/mp4" });

    console.log("[Worker] Sending back compressed file...");
    self.postMessage({
      type: "compression_complete",
      file: compressedBlob,
    });
  } catch (error) {
    console.error("[Worker] Compression failed:", error);
    self.postMessage({
      type: "compression_error",
      error: error.message || "Video compression failed. Please try again.",
    });
  }
};
