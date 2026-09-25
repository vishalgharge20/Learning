export const seedQuizzes = [
  {
    id: 'quiz-01-frametime-budget',
    subjectId: 'xr-qa',
    moduleId: 'mod-10-performance-testing',
    conceptId: 'concept-performance-fps-frametime',
    title: 'XR Frame Time & Refresh Rate Calculation',
    type: 'multiple_choice',
    difficulty: 'intermediate',
    question: 'A VR game is targeting 90 Hz refresh rate on Meta Quest 3. What is the maximum combined frame time budget available to the CPU and GPU before reprojection (frame dropping) occurs?',
    options: [
      '16.67 milliseconds',
      '11.11 milliseconds',
      '13.88 milliseconds',
      '8.33 milliseconds'
    ],
    correctAnswer: 1, // 11.11ms
    explanation: 'Frame time is calculated as 1000ms / Hz. For 90 Hz, 1000 / 90 = 11.11 milliseconds. (60 Hz = 16.67ms, 72 Hz = 13.88ms, 120 Hz = 8.33ms). Exceeding 11.11ms causes reprojection/judder.',
    qaTakeaway: 'Always measure millisecond frame times rather than average FPS. In 90Hz VR, an 11.5ms frame is a failed frame.'
  },
  {
    id: 'quiz-02-bottleneck-diagnosis',
    subjectId: 'xr-qa',
    moduleId: 'mod-10-performance-testing',
    conceptId: 'concept-cpu-gpu-bottlenecks',
    title: 'Diagnostic Test for GPU Bottlenecks',
    type: 'scenario',
    difficulty: 'intermediate',
    question: 'You notice frame time is 22 ms (target is 11.1 ms). You reduce the eye texture render resolution scale from 1.0 to 0.5 using ADB commands. The frame time drops from 22 ms to 11.0 ms. What does this confirm?',
    options: [
      'The application is CPU Main Thread bound (too many physics calculations)',
      'The application is GPU bound (fill rate, fragment shading, or overdraw)',
      'The application is CPU Render Thread bound (too many draw calls)',
      'The garbage collector is causing stop-the-world pauses'
    ],
    correctAnswer: 1,
    explanation: 'Decreasing render resolution reduces pixel rasterization and fragment shader work without altering CPU game logic, physics, or draw call count. Because frame time dropped proportionally, the bottleneck was conclusively GPU fill-rate/shading.',
    qaTakeaway: 'Resolution scaling is the fastest heuristic test to separate GPU fill-rate issues from CPU bottlenecks.'
  },
  {
    id: 'quiz-03-adb-logcat-command',
    subjectId: 'xr-qa',
    moduleId: 'mod-12-debugging',
    conceptId: 'concept-adb-commands',
    title: 'ADB Logcat Filter for Unity Crashes',
    type: 'multiple_choice',
    difficulty: 'beginner',
    question: 'Which ADB command correctly captures and filters logs specifically for Unity engine output and crashes on a connected Android headset?',
    options: [
      'adb pull /sdcard/Android/logs.txt',
      'adb logcat -s Unity ActivityManager DEBUG',
      'adb install -r unity.apk',
      'adb devices -l --filter Unity'
    ],
    correctAnswer: 1,
    explanation: 'The `-s` parameter in `adb logcat` sets the tag filter spec. Filtering by `Unity ActivityManager DEBUG` catches C# exceptions, app lifecycle states, and Android fatal crash tombstones without flood from background services.',
    qaTakeaway: 'Always use tag filters with ADB Logcat to isolate crashes and avoid missing exceptions in huge log buffers.'
  },
  {
    id: 'quiz-04-3dof-fallback',
    subjectId: 'xr-qa',
    moduleId: 'mod-03-xr-fundamentals',
    conceptId: 'concept-3dof-6dof',
    title: 'Tracking Degeneration Safety',
    type: 'true_false',
    difficulty: 'beginner',
    question: 'True or False: If a 6DoF standalone headset loses positional tracking due to darkness or covered cameras, it is safe and acceptable for the game to seamlessly continue running in 3DoF mode without notifying or pausing the user.',
    options: [
      'True - Seamless continuation prevents gameplay interruption',
      'False - World-locking causes severe vestibular mismatch and nausea; the app must pause or alert the user'
    ],
    correctAnswer: 1,
    explanation: 'False! When a 6DoF experience drops to 3DoF, leaning or moving the head moves the entire world with the user head (world-locking). This induces instant simulator sickness and violates Meta VRC and Apple store certification rules.',
    qaTakeaway: 'Loss of 6DoF tracking must immediately trigger a pause state, tracking lost overlay, or camera fade.'
  },
  {
    id: 'quiz-05-openxr-profiles',
    subjectId: 'xr-qa',
    moduleId: 'mod-05-openxr',
    conceptId: 'concept-openxr-interaction-profiles',
    title: 'OpenXR Action Mapping Architecture',
    type: 'multiple_choice',
    difficulty: 'advanced',
    question: 'Why does OpenXR utilize abstract Action Maps (e.g., "TeleportAction", "GrabAction") rather than querying hardware buttons directly (e.g., "OculusTouch_ButtonA_Pressed")?',
    options: [
      'To reduce C# memory allocations in the Unity garbage collector',
      'To allow cross-platform hardware compatibility by binding abstract actions to device-specific Interaction Profiles at runtime',
      'Because OpenXR does not support physical buttons on controllers',
      'To encrypt player input for multiplayer networking security'
    ],
    correctAnswer: 1,
    explanation: 'OpenXR abstracts user intent into Actions. The active hardware runtime maps these Actions to physical hardware controls via Interaction Profiles (Touch, Knuckles, Vive Wand, Apple Hand Pinch) without requiring code modifications for every new device.',
    qaTakeaway: 'Test action bindings across every controller model in your target device matrix.'
  },
  {
    id: 'quiz-06-unity-lifecycle-execution',
    subjectId: 'xr-qa',
    moduleId: 'mod-14-csharp-basics',
    conceptId: 'concept-csharp-unity-lifecycle',
    title: 'Unity Lifecycle Execution Sequence',
    type: 'multiple_choice',
    difficulty: 'beginner',
    question: 'What is the correct execution order of Unity script lifecycle methods when a scene loads with an enabled GameObject?',
    options: [
      'Start -> Awake -> OnEnable -> Update',
      'Awake -> OnEnable -> Start -> Update',
      'OnEnable -> Awake -> Update -> Start',
      'Update -> FixedUpdate -> Awake -> Start'
    ],
    correctAnswer: 1,
    explanation: 'Unity executes `Awake()` first upon instantiation, followed by `OnEnable()` when the object activates, then `Start()` before the first frame runs, and then `Update()` every frame.',
    qaTakeaway: 'Timing bugs and NullReferenceExceptions often occur when Script A queries Script B in Awake before B has initialized.'
  },
  {
    id: 'quiz-07-vr-motion-sickness-causes',
    subjectId: 'xr-qa',
    moduleId: 'mod-16-xr-ux-accessibility',
    conceptId: 'concept-motion-sickness',
    title: 'Primary Cause of VR Simulator Sickness',
    type: 'multiple_choice',
    difficulty: 'intermediate',
    question: 'Which of the following camera movement implementations is most prone to causing acute simulator sickness in VR users?',
    options: [
      'Instantaneous teleportation locomotion with black screen fade',
      'Snap turning in 45-degree increments with comfort vignetting',
      'Artificial forced camera roll/rotation during an in-game cinematic cutscene without user input',
      'Stationary seating mode with 1:1 head rotation'
    ],
    correctAnswer: 2,
    explanation: 'Taking rotational or translational control away from the user head creates severe vestibular-ocular conflict (the eyes see acceleration that the inner ear fluid does not detect). Artificial camera rotation is the most nauseating design pattern in XR.',
    qaTakeaway: 'Never take head rotation control away from the user in VR. Cutscenes should be viewed from a fixed vantage point.'
  },
  {
    id: 'quiz-08-gc-alloc-framerate',
    subjectId: 'xr-qa',
    moduleId: 'mod-11-unity-profiler',
    conceptId: 'concept-unity-profiler-memory',
    title: 'Garbage Collection Impact in XR',
    type: 'true_false',
    difficulty: 'intermediate',
    question: 'True or False: In Unity VR development, allocating 50 KB of garbage per frame on the managed heap is completely harmless as long as the total device RAM has 4 GB free.',
    options: [
      'True - 50 KB is negligible compared to multi-gigabyte device RAM',
      'False - Continuous allocations trigger periodic Garbage Collection pauses (Stop-The-World), causing frame drops and visual stutter'
    ],
    correctAnswer: 1,
    explanation: 'False! Heap allocations trigger `GC.Collect()`. The Mono/IL2CPP garbage collector pauses the Main Thread to scan references. A 10ms GC pause will cause a dropped frame spike, resulting in reprojection judder regardless of available RAM.',
    qaTakeaway: 'Target 0 B GC Alloc per frame during active VR gameplay. Use object pools and avoid string concatenation in Update.'
  }
];
