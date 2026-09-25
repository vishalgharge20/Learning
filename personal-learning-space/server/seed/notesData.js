export const seedNotes = [
  {
    id: 'note-001',
    subjectId: 'xr-qa',
    conceptId: 'concept-adb-commands',
    title: 'ADB Command Cheat Sheet for Standalone XR Headsets',
    content: `### Essential ADB Commands for Quest & Android XR QA

#### 1. Device Connection & Status
\`\`\`bash
# List all connected headsets & auth status
adb devices -l

# Connect wirelessly over Wi-Fi (headset IP)
adb tcpip 5555
adb connect 192.168.1.120:5555
\`\`\`

#### 2. APK Installation & Package Management
\`\`\`bash
# Clean reinstall preserving app data/save files
adb install -r -d "path/to/build.apk"

# Uninstall app completely
adb uninstall com.company.gamename

# List all third-party installed packages
adb shell pm list packages -3
\`\`\`

#### 3. Logcat & Crash Extraction
\`\`\`bash
# Stream Unity engine logs and fatal crashes in real-time
adb logcat -c && adb logcat -s Unity ActivityManager DEBUG

# Save full timestamped logcat dump to text file
adb logcat -d > crash_log.txt

# Extract Android system crash tombstones
adb pull /data/tombstones/ ./tombstones/
\`\`\`

#### 4. Media & Video Evidence
\`\`\`bash
# Take screenshot directly from headset eye buffer
adb exec-out screencap -p > bug_screenshot.png

# Record 3-minute 60fps MP4 video
adb shell screenrecord --size 1920x1080 --bit-rate 10000000 /sdcard/bug_video.mp4
adb pull /sdcard/bug_video.mp4 .
\`\`\`
`,
    category: 'cheat_sheet',
    tags: ['ADB', 'CommandCheatSheet', 'Android', 'Debugging'],
    updatedAt: '2026-09-24T18:00:00.000Z'
  },
  {
    id: 'note-002',
    subjectId: 'xr-qa',
    conceptId: 'concept-cpu-gpu-bottlenecks',
    title: 'Unity Profiler: CPU Main Thread vs GPU Fill Rate Diagnosis',
    content: `### How to Rapidly Isolate Bottlenecks in Standalone XR

When frame time exceeds budget (e.g. >11.11ms for 90Hz):

1. **Resolution Test (Fastest Heuristic):**
   - Lower eye texture resolution scale to 0.6x.
   - If frame time drops proportionally: **GPU Bound** (fill-rate, fragment shaders, overdraw).
   - If frame time stays unchanged: **CPU Bound** (physics, scripts, or draw calls).

2. **Common GPU Killers in VR:**
   - Overdraw: semi-transparent particle effects (smoke, fire) layered over each other.
   - Unbaked realtime point/spot lights with shadow casting.
   - Inefficient fragment shaders with heavy trigonometric math or multiple texture samples.

3. **Common CPU Killers in VR:**
   - Excessive Draw Calls (>150 batches on mobile XR). Break dynamic/static batching.
   - Physics queries running on Main Thread (\`Physics.Simulate\` or complex mesh colliders).
   - Garbage Collection spikes: \`GC.Alloc\` > 0 KB in \`Update()\`.
`,
    category: 'qa_tip',
    tags: ['Performance', 'UnityProfiler', 'GPU', 'CPU'],
    updatedAt: '2026-09-24T15:20:00.000Z'
  },
  {
    id: 'note-003',
    subjectId: 'xr-qa',
    conceptId: 'concept-meta-quest',
    title: 'Meta Virtual Reality Check (VRC) Critical Failures',
    content: `### Top 5 Reasons Meta Rejects Apps on Store Submission

1. **VRC.Quest.Performance.1 (Frame Rate Consistency):**
   - Dropping frames during normal gameplay. Frame rate must maintain 72/90/120Hz with < 1% dropped frames over a 45-minute play session.
2. **VRC.Quest.Input.1 (Tracking Loss Handling):**
   - App must immediately display a tracking lost alert, pause game simulation, or fade screen to black when 6DoF tracking is interrupted. World must NEVER lock to the user's head in 3DoF.
3. **VRC.Quest.Security.1 (Boundary Enforcement):**
   - Head passing through virtual geometry must prevent seeing through walls (fade to black or pushback camera).
4. **VRC.Quest.Functional.1 (Universal Menu Response):**
   - Pressing the Oculus/Horizon system button must pause game audio and simulation cleanly within 500ms.
5. **VRC.Quest.Input.4 (Controller Disconnect / Battery Depletion):**
   - Disconnecting a controller or dying battery must not crash the app or prevent UI navigation if one controller remains active.
`,
    category: 'qa_tip',
    tags: ['VRC', 'MetaStore', 'Certification', 'Compliance'],
    updatedAt: '2026-09-23T11:45:00.000Z'
  }
];
