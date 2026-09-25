export const seedPracticeScenarios = [
  {
    id: 'practice-01-fps-drop',
    subjectId: 'xr-qa',
    moduleId: 'mod-10-performance-testing',
    conceptId: 'concept-cpu-gpu-bottlenecks',
    title: 'FPS Drops from 72 to 35 Entering Room',
    difficulty: 'intermediate',
    scenario: 'During an exploratory QA playthrough on a Meta Quest 3 standalone release build, the frame rate steadily holds 72 FPS in the outdoor courtyard. However, the instant the player steps through the doorway into the Laboratory room, FPS plummets to 35 FPS and the headset begins severe reprojection judder.',
    environment: {
      device: 'Meta Quest 3',
      platform: 'Android 12 (Horizon OS v65)',
      unityVersion: 'Unity 2022.3.18f1 (URP)',
      buildType: 'Release Build (IL2CPP)'
    },
    symptoms: [
      'FPS drops from 72 to 35 (Frame time jumps from 13.8ms to 28.5ms)',
      'Severe head-pose reprojection / double-vision when turning head',
      'Fan spins up rapidly after 30 seconds inside the room'
    ],
    qaObjective: 'Determine whether the bottleneck is CPU bound (draw calls, physics, scripts) or GPU bound (fill rate, overdraw, post-processing), isolate the offending asset/system, and generate an actionable bug report.',
    investigationSteps: [
      {
        order: 1,
        action: 'Capture OVR Metrics Tool or ADB Profile overlay on device',
        hint: 'Check CPU utilization % vs GPU utilization % in real-time HUD.',
        rationale: 'If GPU is at 99% while CPU is at 45%, you immediately know the bottleneck is rendering/fragment shaders rather than game logic.'
      },
      {
        order: 2,
        action: 'Test eye texture resolution scaling',
        hint: 'Use ADB or developer menu to drop render scale to 0.5x.',
        rationale: 'If frame time drops from 28ms down to 13ms when pixel count is halved, the room is GPU fill-rate/overdraw bound. If frame time remains 28ms, it is CPU or draw call bound.'
      },
      {
        order: 3,
        action: 'Inspect room lighting, transparent particles, and Occlusion Culling',
        hint: 'Look for unbaked realtime lights, transparent alpha-blended glass/smoke, and whether outdoor geometry is still rendering.',
        rationale: 'Multiple realtime point lights or stacked transparent particle effects in a small room crush mobile GPU fill-rate.'
      },
      {
        order: 4,
        action: 'Connect Unity Profiler via ADB to inspect Draw Calls (Batches) and RenderPipeline',
        hint: 'Check `RenderPipeline.Render` and total SetPass calls.',
        rationale: 'If SetPass calls exceed 150 on mobile VR, draw call batching is broken, stalling the CPU Render Thread.'
      }
    ],
    commonTraps: [
      'Assuming 3D mesh polygon count is the cause without checking transparent overdraw or unbaked realtime lights',
      'Profiling only in Unity Editor where high-end desktop GPU masks mobile GPU fill-rate limits'
    ],
    modelSolution: '1. Connect device via USB and run `adb shell setprop debug.oculus.gpuBudget 1` or enable OVR Metrics Tool overlay.\n2. Observe GPU level pinned at Level 5 (100% saturation) while CPU level is low (Level 2). This confirms GPU bottleneck.\n3. Lower eye buffer resolution via `adb shell setprop debug.oculus.eyeResolution 0.7`: FPS immediately recovers to 68 FPS, proving fill-rate / fragment shader overdraw.\n4. Walk through room in Unity Scene view: discover 4 unbaked Realtime Point Lights with Cast Shadows enabled, plus 12 overlapping semi-transparent particle steam emitters.\n5. Defect root cause: Realtime lighting and transparent overdraw exceeding mobile VR GPU rasterization budget.\n6. Fix recommendation: Bake lighting to lightmaps and replace alpha-blended smoke with additive or mesh-based particles.',
    adbCommands: [
      'adb devices',
      'adb logcat -s Unity OVRMetrics',
      'adb shell setprop debug.oculus.profilerHUD 1'
    ]
  },
  {
    id: 'practice-02-grab-failure',
    subjectId: 'xr-qa',
    moduleId: 'mod-04-xr-interaction-toolkit',
    conceptId: 'concept-xr-grab-interactable',
    title: 'XR Object Highlights but Cannot Be Grabbed',
    difficulty: 'intermediate',
    scenario: 'In a VR training simulation, a virtual torque wrench sitting on a workbench displays a blue hover highlight outline when the player points the controller ray at it, confirming interactor detection. However, when the user presses the Grip trigger, the wrench does not snap to the hand or pick up.',
    environment: {
      device: 'Meta Quest 2 & Quest 3',
      platform: 'Standalone Android',
      unityVersion: 'Unity 2022.3 LTS with XR Interaction Toolkit 2.5',
      buildType: 'Development Build'
    },
    symptoms: [
      'Hover outline appears on Ray and Direct Interactors',
      'Pressing Grip trigger performs hand pinch animation, but object remains stationary on workbench',
      'No crash or fatal error occurs'
    ],
    qaObjective: 'Systematically troubleshoot the GameObject component hierarchy and interaction layers to discover why the Select action is rejected.',
    investigationSteps: [
      {
        order: 1,
        action: 'Verify Interaction Layer Masks between Interactor and Interactable',
        hint: 'Check if the Controller Interactor has the same Interaction Layer selected as the Wrench.',
        rationale: 'XR Interaction Toolkit allows separate layers for Hover and Select. If Hover includes "Default" but Select only checks "Tools", hover succeeds while grab fails.'
      },
      {
        order: 2,
        action: 'Check Rigidbody and Collider settings on the Wrench',
        hint: 'Look at `Is Kinematic`, `Collision Detection`, and whether Collider is marked as `Is Trigger`.',
        rationale: 'If Collider is marked `Is Trigger`, physical Direct Interactor triggers may not compute proper grab physics unless configured.'
      },
      {
        order: 3,
        action: 'Inspect XRGrabInteractable component properties',
        hint: 'Examine `Movement Type`, `Attach Transform`, and `Select Mode` (Single vs Multiple).',
        rationale: 'If Select Mode is Single and another hidden interactor or socket secretly holds ownership, subsequent grab attempts fail.'
      },
      {
        order: 4,
        action: 'Check Input Action Bindings for "Select Action"',
        hint: 'Ensure Grip button is correctly bound to `XRI RightHand Interaction/Select`.',
        rationale: 'If Select Action binding was accidentally cleared or bound to Trigger instead of Grip, pressing Grip sends zero value.'
      }
    ],
    commonTraps: [
      'Assuming the 3D model is missing a Collider (it has one, otherwise hover highlight would never trigger)',
      'Blaming the controller hardware without testing other interactable objects in the same room'
    ],
    modelSolution: '1. In Unity Inspector, inspect `XR Grab Interactable` on the Torque Wrench.\n2. Check `Interaction Layer Mask`: The wrench was assigned to "Custom_Props", whereas the Controller Direct Interactor\'s Select Mask only allowed "Default". (Hover mask was set to "Everything", which is why hover outline worked!)\n3. Furthermore, check Rigidbody: `Is Kinematic` was checked, but Movement Type on XRGrabInteractable was set to `Velocity Tracking`. Kinematic bodies cannot be moved via velocity tracking.\n4. Solution: Match Interaction Layer Masks and set Movement Type to `Kinematic` or uncheck `Is Kinematic` on Rigidbody.',
    adbCommands: [
      'adb logcat -s Unity | findstr "XRI"'
    ]
  },
  {
    id: 'practice-03-plane-detection-outdoors',
    subjectId: 'xr-qa',
    moduleId: 'mod-06-ar-foundation',
    conceptId: 'concept-plane-detection',
    title: 'Plane Detection Works Indoors but Fails Outdoors',
    difficulty: 'intermediate',
    scenario: 'An enterprise AR inspection app detects floors and desks cleanly in an indoor office environment within 2 seconds of scanning. However, when the QA tester takes the mobile device onto a sunny outdoor concrete patio, the AR session fails to find any horizontal planes and displays "Scanning..." indefinitely.',
    environment: {
      device: 'Samsung Galaxy S23 (ARCore) & iPhone 14 Pro (ARKit)',
      platform: 'Mobile AR (Android & iOS)',
      unityVersion: 'Unity 2022.3 (AR Foundation 5.1)',
      buildType: 'Release'
    },
    symptoms: [
      'Device scans for over 60 seconds with no plane polygon mesh generated',
      'Feature point cloud visualization shows few or wildly jumping points',
      'Outdoor patio is made of smooth poured concrete in direct midday sunlight'
    ],
    qaObjective: 'Isolate the optical and algorithmic variables causing visual odometry failure and recommend QA test matrix additions.',
    investigationSteps: [
      {
        order: 1,
        action: 'Analyze surface texture and visual feature contrast',
        hint: 'Does the concrete patio have high-frequency visual features or is it a washed-out uniform grey?',
        rationale: 'Visual-Inertial Odometry requires distinct visual gradient contrast to extract corner feature points.'
      },
      {
        order: 2,
        action: 'Evaluate lighting level (Lux) and camera auto-exposure saturation',
        hint: 'Check if bright midday sunlight is blowing out highlights (overexposure) on the camera sensor.',
        rationale: 'Overexposed sensors lose all texture detail, preventing feature extraction.'
      },
      {
        order: 3,
        action: 'Test with a textured reference object (doormat or chalk mark) on the patio',
        hint: 'Place a patterned item on the concrete and scan around it.',
        rationale: 'If plane detection succeeds around the patterned doormat, lack of optical feature points is definitively proven.'
      },
      {
        order: 4,
        action: 'Verify AR Foundation Tracking State callbacks in logs',
        hint: 'Read `ARSession.state` and `ARSession.notTrackingReason`.',
        rationale: 'ARCore and ARKit report explicit reasons such as `ExcessiveMotion`, `InsufficientFeatures`, or `InsufficientLight`.'
      }
    ],
    commonTraps: [
      'Filing a bug as "AR Foundation broken on outdoor builds" without specifying surface texture and lux conditions',
      'Assuming outdoors always provides better tracking because there is more light'
    ],
    modelSolution: '1. Check `ARSession.notTrackingReason` via logcat: shows `InsufficientFeatures`.\n2. Direct midday sunlight caused camera exposure to clamp, washing out the subtle grain of smooth poured concrete into flat RGB #E5E5E5 with zero contrast.\n3. Placing a patterned test newspaper on the patio allowed the plane to initialize within 1.5 seconds.\n4. Defect recommendation: Add UX guidance alert to user: "Surface lacks contrast. Point at textured edges or shadows to initialize tracking."\n5. Test matrix addition: Document plane detection benchmark criteria under 5 lighting tiers: Low Light (<50 lux), Indoor Office (300-500 lux), Overcast Outdoor (1,000-5,000 lux), Direct Sunlight (>10,000 lux).',
    adbCommands: [
      'adb logcat -s Unity ARCore'
    ]
  },
  {
    id: 'practice-04-controller-tracking-loss',
    subjectId: 'xr-qa',
    moduleId: 'mod-03-xr-fundamentals',
    conceptId: 'concept-tracking-loss-recovery',
    title: 'Intermittent Controller Tracking Loss',
    difficulty: 'advanced',
    scenario: 'During high-intensity boxing or archery sessions, the right VR controller intermittently freezes mid-air for 2 to 4 seconds, then snaps back to the hand. The tester notices this occurs most frequently during archery draw motions when the right hand is pulled close to the right ear/cheek.',
    environment: {
      device: 'Meta Quest 2 & Quest 3 (Inside-Out Optical Tracking)',
      platform: 'Standalone Android',
      unityVersion: 'Unity 2022.3 LTS',
      buildType: 'Release'
    },
    symptoms: [
      'Right virtual hand freezes at a fixed position while controller vibration continues',
      'After 3 seconds, hand teleports back to current physical position with an abrupt pop',
      'Only happens during specific archery draw postures near the ear'
    ],
    qaObjective: 'Analyze the physical tracking volume limits of inside-out camera arrays, formulate reproducible test steps, and distinguish hardware occlusion from software prediction bugs.',
    investigationSteps: [
      {
        order: 1,
        action: 'Map the tracking camera field of view (FOV) relative to headset geometry',
        hint: 'Where are the tracking cameras located on the headset faceplate and what are their blind spots?',
        rationale: 'Inside-out optical cameras face forward, down, and laterally. Pulling a hand directly behind the ear puts it outside the optical FOV.'
      },
      {
        order: 2,
        action: 'Test IMU dead-reckoning prediction behavior during occlusion',
        hint: 'When optical tracking is lost, does the system extrapolate position using controller accelerometer/gyroscope?',
        rationale: 'Headsets maintain 3DoF orientation via IMU for ~1-2 seconds after optical loss. If the hand stops moving, positional drift halts and the hand freezes.'
      },
      {
        order: 3,
        action: 'Compare behavior on Quest 2 (ring LEDs) vs Quest 3 (ringless tracking + AI camera fusion)',
        hint: 'Test if the issue reproduces equally on ringless vs ringed controllers.',
        rationale: 'Quest 2 uses infrared LED rings; Quest 3 uses upper tracking cameras and hand tracking fusion.'
      },
      {
        order: 4,
        action: 'Evaluate game-side smoothing and grab anchoring logic',
        hint: 'Does the game hide the hand or interpolate when `InputTracking.trackingAcquired` is false?',
        rationale: 'The game should either lock the arrow notch to the headset position or smoothly interpolate hand position during occlusion.'
      }
    ],
    commonTraps: [
      'Reporting this as a hardware controller defect without understanding optical occlusion geometry',
      'Not testing controller battery level and 50Hz/60Hz indoor LED room flicker interference'
    ],
    modelSolution: '1. Root cause: The archery draw posture places the right controller directly behind the headset\'s lateral tracking camera frustum. Optical line-of-sight is severed.\n2. The tracking runtime falls back to IMU dead-reckoning. Because the player holds still to aim, the IMU accelerometer detects near-zero acceleration, causing the tracking filter to freeze position.\n3. Software mitigation: XR archery games must implement "anchor to head" logic when the draw hand enters the head proximity zone, or blend controller orientation with head look direction.\n4. QA Bug Report: Document exact hand-to-ear distance (<5cm), head angle, and recommend implementing tracking confidence threshold fallback in the weapon grip script.',
    adbCommands: [
      'adb logcat -s Unity OVRPlugin | findstr /I "track"'
    ]
  }
];
