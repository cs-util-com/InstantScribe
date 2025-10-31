Fetch ONNX Runtime Web dist assets

This folder contains a small helper script to download the ESM/UMD build and WASM
assets for `onnxruntime-web` into the project `./ort/` folder so the app can
load the WASM locally and avoid cross-origin or CDN transform issues.

Usage

1. Run the script (requires `npm` and `tar` available on the PATH):

```bash
./scripts/fetch-onnx-dist.sh 1.19.0
```

2. Serve the repository (or your static files) so `/ort/` is accessible from the
app root. The code already defaults to `DEFAULT_ORT_WASM_PATH = '/ort/'` in
`src/stt/config.js`.

3. Optionally set `window.ORT_WASM_PATH = '/ort/'` and `window.SILERO_VAD_MODEL = '/model/silero_vad.onnx'` in
`index.html` to be explicit during development (you would need to download the Silero VAD v6 model to `/model/silero_vad.onnx`).
