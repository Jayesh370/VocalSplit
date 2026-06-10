# VocalSplit AI — Testing Guide

## Frontend Testing Plan

### Manual Test Cases

#### Landing Page

| Test | Expected |
|------|----------|
| Page loads | Hero, Features, How it Works, FAQ, Footer all visible |
| Scroll navigation | Anchor links work for #features, #how-it-works, #faq |
| Hero drop zone click | Opens file browser |
| Header logo click | Returns to landing screen |
| FAQ expand/collapse | Items open and close correctly |
| Mobile layout (375px) | All sections readable, no overflow |
| Tablet layout (768px) | Grid adapts, no overflow |

#### Upload Flow

| Test | Expected |
|------|----------|
| Drag valid MP3 onto hero | Upload starts, transitions to upload screen |
| Browse and select valid WAV | Upload progress shows |
| Upload 100MB file | Accepted, progress tracks correctly |
| Upload 101MB file | Error: "File too large. Maximum size is 100MB" |
| Upload .txt file | Error: "Unsupported file type…" |
| Upload .jpg file | Error: "Unsupported file type…" |
| Drop 2 files simultaneously | Only first file is processed |
| Cancel mid-upload | UI remains stable (no crash) |

#### Processing Screen

| Test | Expected |
|------|----------|
| Screen displays after upload | Animated loader, status text visible |
| Polling continues | Status checks fire every 2.5s |
| Backend returns `ready` | Automatically navigates to Results |
| Backend returns `error` | Returns to Upload with error message |
| Stays on page >5min | Timeout message shown after 120 polls |

#### Results Screen

| Test | Expected |
|------|----------|
| Two players render | Vocals and Instrumental players both present |
| Play vocals | Audio plays, waveform animates |
| Pause vocals | Audio pauses |
| Seek to 50% | Playhead jumps, time updates |
| Mute vocals | Audio mutes, icon changes |
| Volume slider 0% | Audio inaudible, icon updates |
| Download vocals | MP3 file downloads with correct name |
| Download instrumental | MP3 file downloads with correct name |
| "Split another track" | Returns to landing, state clears |

---

## Backend Testing Plan

### API Endpoint Tests

#### POST /api/upload

```bash
# Valid MP3
curl -X POST http://localhost:3001/api/upload \
  -F "audio=@test.mp3" \
  -H "Origin: http://localhost:5173"
# Expected: 202 { success: true, data: { jobId: "...", message: "..." } }

# No file
curl -X POST http://localhost:3001/api/upload
# Expected: 400 { success: false, error: "No audio file provided." }

# Wrong MIME type
curl -X POST http://localhost:3001/api/upload \
  -F "audio=@test.pdf"
# Expected: 415 { success: false, error: "Unsupported file type..." }

# File too large (create 101MB file first)
dd if=/dev/zero bs=1M count=101 | base64 > /tmp/big.mp3
curl -X POST http://localhost:3001/api/upload \
  -F "audio=@/tmp/big.mp3"
# Expected: 413 { success: false, error: "File too large..." }
```

#### GET /api/status/:jobId

```bash
# Valid job (immediately after upload)
curl http://localhost:3001/api/status/<jobId>
# Expected: { success: true, data: { status: "processing", ... } }

# Invalid jobId
curl http://localhost:3001/api/status/not-a-real-id
# Expected: 404 { success: false, error: "Job not found..." }
```

#### GET /api/download/:jobId/:track

```bash
# Download vocals when ready
curl -o vocals.mp3 http://localhost:3001/api/download/<jobId>/vocals

# Invalid track name
curl http://localhost:3001/api/download/<jobId>/drums
# Expected: 400 { success: false, error: 'Track must be "vocals" or "instrumental".' }
```

#### GET /api/health

```bash
curl http://localhost:3001/api/health
# Expected: { success: true, data: { status: "ok", timestamp: "..." } }
```

### Rate Limiting Tests

```bash
# Hit upload limit (21 requests in 1 hour from same IP)
for i in $(seq 1 21); do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST http://localhost:3001/api/upload \
    -F "audio=@test.mp3"
done
# First 20: 202, 21st: 429
```

### CORS Tests

```bash
# Allowed origin
curl -H "Origin: http://localhost:5173" http://localhost:3001/api/health
# Should have Access-Control-Allow-Origin header

# Disallowed origin
curl -H "Origin: https://evil.com" http://localhost:3001/api/health
# Should NOT have Access-Control-Allow-Origin header
```

---

## Python Service Testing Plan

### Endpoint Tests

```bash
# Health check
curl http://localhost:8000/health
# Expected: { "status": "ok", "model": "htdemucs" }

# Separation (valid MP3)
curl -X POST http://localhost:8000/separate \
  -F "audio=@test.mp3" \
  -F "job_id=test-job-001"
# Expected: { "success": true, "vocals_path": "...", "instrumental_path": "..." }

# Cleanup
curl -X DELETE http://localhost:8000/cleanup/test-job-001
# Expected: { "success": true, "message": "Job test-job-001 cleaned up." }
```

### Audio Quality Checks

After separation, verify:
- Vocals MP3: Contains primarily voice, minimal instrument bleed
- Instrumental MP3: Contains music, minimal voice bleed  
- Both files are valid MP3 (playable)
- Both files are > 0 bytes
- Duration matches original (within a few seconds)

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Upload very short clip (< 1s) | Processes normally, stems may be near-silent |
| Upload silent audio | Processes; both stems are silent |
| Upload mono audio | Demucs converts to stereo internally |
| Upload FLAC at 192kHz | Resampled to 44.1kHz; processes normally |
| Two simultaneous uploads | Both jobs created, both processed independently |
| Network drop during upload | Frontend shows upload error |
| Python service unreachable | Job status → `error` with helpful message |
| Disk full on server | Error propagated to frontend gracefully |
| Job polled after auto-deletion | 404 returned with "Job not found. It may have expired." |
| Download same file twice | Second download returns 404 (file already cleaned up) |
| XSS in filename | Filename sanitized by Content-Disposition header |
| SQL injection in jobId | UUID format validation, no DB to inject |

---

## Suggested Test Audio Files

- `test-pop.mp3` — 3 min pop song (vocals + instruments)
- `test-acapella.mp3` — vocals only (instrumental should be near-silent)
- `test-instrumental.mp3` — no vocals (vocals stem should be near-silent)
- `test-short.mp3` — 5 second clip (fast test cycle)
- `test-large.m4a` — 90MB M4A (size limit test)
