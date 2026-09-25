/**
 * XR QA Complete Curriculum
 * 24 Structured Modules with Topics and Concepts.
 * Contains realistic, high-value QA notes, XR scenarios, and common pitfalls.
 */

export const xrQaCurriculum = [
  {
    id: 'mod-01-qa-fundamentals',
    subjectId: 'xr-qa',
    order: 1,
    code: '01',
    title: 'QA Fundamentals',
    description: 'Core software testing life cycle, methodology, severity vs priority, and XR-specific test strategies.',
    icon: 'SafetyCertificateOutlined',
    topics: [
      {
        id: 'topic-01-1-sdlc-stlc',
        title: 'SDLC & STLC in Immersive Tech',
        description: 'How traditional test life cycles adapt to spatial computing and rapid hardware iterations.',
        concepts: [
          {
            id: 'concept-sdlc-stlc',
            title: 'SDLC / STLC in XR',
            summary: 'Understanding development and test phases when hardware and spatial environments introduce physical variables.',
            difficulty: 'beginner',
            explanation: 'Software Development Life Cycle (SDLC) and Software Testing Life Cycle (STLC) provide the structured phases of building and verifying applications. In XR, STLC must incorporate physical room boundaries, headset tracking states, and device thermal thresholds from day one.',
            whyItMattersForQa: 'Standard web apps do not fail when ambient lighting dims or when a user moves their head abruptly. XR STLC requires environmental matrix validation early in test planning.',
            xrExample: 'Validating an XR surgical training application across alpha, beta, and release candidates on Meta Quest 3 and Apple Vision Pro.',
            realWorldExample: 'A sprint where boundary guardrails fail only after a 20-minute continuous play session due to sensor thermal drift.',
            commonMistakes: ['Treating XR testing identically to desktop 2D UI testing', 'Skipping physical space calibration in test scenarios'],
            keyTakeaways: ['STLC must account for hardware, firmware, and physical room conditions', 'Define entry/exit criteria including frame rate compliance'],
            relatedConceptIds: ['concept-xr-test-strategy', 'concept-severity-priority'],
            tags: ['STLC', 'SDLC', 'Strategy']
          },
          {
            id: 'concept-xr-test-strategy',
            title: 'XR-Specific Testing Strategy',
            summary: 'Formulating test strategies tailored for 3D spatial interactions, stereoscopic displays, and physiological safety.',
            difficulty: 'intermediate',
            explanation: 'An XR test strategy defines scope, device matrices, comfort requirements, thermal guidelines, and locomotion accessibility. It balances automated smoke tests with physical ergonomic test sessions.',
            whyItMattersForQa: 'Without a clear XR test strategy, teams miss severe VR comfort issues, tracking edge-cases, and platform submission compliance (Meta VRCs).',
            xrExample: 'Creating a matrix covering Standalone Quest 2, Quest 3, Quest Pro, and PCVR Link Cable modes with room-scale vs stationary boundaries.',
            realWorldExample: 'Failing Meta Virtual Reality Checks (VRC) due to lack of a pause menu trigger during tracking loss.',
            commonMistakes: ['Testing only on the latest headset generation', 'Ignoring user fatigue during test scheduling'],
            keyTakeaways: ['Always include device matrix and physical room constraints', 'Include comfort and simulator sickness evaluations in test criteria'],
            relatedConceptIds: ['concept-sdlc-stlc', 'concept-meta-quest'],
            tags: ['Strategy', 'VRC', 'Compliance']
          }
        ]
      },
      {
        id: 'topic-01-2-testing-types',
        title: 'Core Test Types & Execution',
        description: 'Smoke, sanity, regression, exploratory testing, and bug life cycles in XR.',
        concepts: [
          {
            id: 'concept-smoke-sanity',
            title: 'Smoke vs Sanity Testing in XR',
            summary: 'Rapid build verification of headset boot, tracking initialization, and primary interaction loop.',
            difficulty: 'beginner',
            explanation: 'Smoke testing verifies the build boots on the target headset, displays stereoscopic imagery without instant crash, and initializes 6DoF tracking. Sanity testing verifies specific bug fixes (e.g. grab handle fixed).',
            whyItMattersForQa: 'Installing a broken APK on 5 standalone headsets wastes hours; a 3-minute smoke test gates deployment to the QA team.',
            xrExample: 'Verifying an APK boots into the main lobby and controllers render in 6DoF before distributing to test team.',
            realWorldExample: 'Smoke test caught missing Android manifest permission causing immediate black-screen crash on Quest OS v64.',
            commonMistakes: ['Running full regression on an APK that fails fundamental controller binding', 'Skipping audio output verification in smoke tests'],
            keyTakeaways: ['Automate or standardize a 5-step headset smoke checklist', 'Never accept a build that drops below 60fps on launch'],
            relatedConceptIds: ['concept-regression-testing', 'concept-adb-commands'],
            tags: ['Smoke', 'Sanity', 'BuildVerification']
          },
          {
            id: 'concept-severity-priority',
            title: 'Severity vs Priority in XR',
            summary: 'Classifying bugs that induce nausea, disorientation, or violate platform store requirements.',
            difficulty: 'intermediate',
            explanation: 'Severity measures technical impact (crash, black screen, inverted camera axes causing vestibular nausea). Priority measures business urgency (critical path block, platform VRC violation).',
            whyItMattersForQa: 'In traditional software, visual glitches are often cosmetic (Low severity). In VR, camera hitching or inverted stereoscopic eye rendering induces nausea and is immediately Critical/P0.',
            xrExample: 'Left eye and right eye render different camera culling planes, causing visual tearing: High Severity, P0 Priority.',
            realWorldExample: 'Misaligned UI tooltip floating at depth zero: Low Severity, P3 Priority.',
            commonMistakes: ['Marking camera stutter as Minor visual defect', 'Ignoring store-rejection checklist items as low priority'],
            keyTakeaways: ['Vestibular and motion sickness issues are always Critical severity in XR', 'Platform store guideline violations are top priority'],
            relatedConceptIds: ['concept-bug-reporting-standards', 'concept-motion-sickness'],
            tags: ['Bugs', 'Triage', 'Comfort']
          }
        ]
      }
    ]
  },
  {
    id: 'mod-02-unity-fundamentals',
    subjectId: 'xr-qa',
    order: 2,
    code: '02',
    title: 'Unity Fundamentals',
    description: 'GameObjects, Components, Transform hierarchy, Prefabs, Physics, Cameras, and Build Pipelines for QA inspection.',
    icon: 'AppstoreOutlined',
    topics: [
      {
        id: 'topic-02-1-scene-gameobjects',
        title: 'Engine Architecture & Scene Graph',
        description: 'How Unity structures scenes, coordinate hierarchies, and component lifecycles.',
        concepts: [
          {
            id: 'concept-gameobjects-components',
            title: 'GameObjects & Components',
            summary: 'The building blocks of Unity scenes and how missing components cause runtime failures.',
            difficulty: 'beginner',
            explanation: 'GameObjects are containers; Components attach functionality (Transform, MeshRenderer, Collider, XRGrabInteractable). QA must understand what components an entity requires to interact properly.',
            whyItMattersForQa: 'When a tester cannot interact with a virtual mug, inspecting whether it has a Collider and an XRGrabInteractable component immediately isolates whether it is an art bug or a logic bug.',
            xrExample: 'Inspecting an interactive lever to verify it contains a Rigidbody, BoxCollider, and XRBaseInteractable.',
            realWorldExample: 'Missing MeshCollider on a desk caused dropped VR tools to fall through the floor endlessly.',
            commonMistakes: ['Blaming code when a GameObject is simply missing a required component', 'Confusing active state of GameObject with component enabled state'],
            keyTakeaways: ['Every GameObject has a Transform', 'Interaction requires both collision and interactor components'],
            relatedConceptIds: ['concept-transform-coordinates', 'concept-xr-grab-interactable'],
            tags: ['Unity', 'GameObjects', 'Components']
          },
          {
            id: 'concept-transform-coordinates',
            title: 'Transform & Coordinate Systems',
            summary: 'Position, Rotation, Scale and local vs world coordinates in 3D spatial space.',
            difficulty: 'intermediate',
            explanation: 'Transforms define where an object exists in 3D space (X, Y, Z) and its orientation (Euler angles or Quaternions). In XR, world scale is 1 unit = 1 meter. Improper scaling causes massive distortion.',
            whyItMattersForQa: 'If a 3D artist exports an asset in centimeters without scaling, a coffee cup appears 100 meters wide in the headset.',
            xrExample: 'Verifying that character eye-level matches real-world floor height (Y=0 at physical floor).',
            realWorldExample: 'A non-uniform scale (e.g. scale X: 1, Y: 2, Z: 1) on a parent object causing warped physics collisions on child interactables.',
            commonMistakes: ['Overlooking non-uniform scaling on parent objects', 'Ignoring local vs global coordinate differences when logging position bugs'],
            keyTakeaways: ['In Unity XR, 1 unit equals 1 real-world meter', 'Non-uniform scaling breaks physics and collision shapes'],
            relatedConceptIds: ['concept-physics-rigidbody', 'concept-xr-origin'],
            tags: ['Unity', 'Transform', 'Coordinates']
          }
        ]
      },
      {
        id: 'topic-02-2-physics-builds',
        title: 'Physics & Build Pipeline',
        description: 'Colliders, Rigidbodies, Build Settings, Development vs Release builds.',
        concepts: [
          {
            id: 'concept-physics-rigidbody',
            title: 'Physics, Colliders & Rigidbodies',
            summary: 'Understanding collision boundaries, kinematic vs dynamic physics, and physics step frequencies.',
            difficulty: 'intermediate',
            explanation: 'Colliders define invisible physical boundaries; Rigidbodies enable objects to respond to gravity and forces. In VR, kinematic rigidbodies are used for items attached to hands to prevent physics jitter.',
            whyItMattersForQa: 'Physics desyncs cause objects to vibrate violently in the user hands, fly through walls, or jitter uncontrollably.',
            xrExample: 'Testing throwing mechanics: verifying velocity transfer calculation when releasing an object with continuous collision detection.',
            realWorldExample: 'Discrete collision detection causing fast-moving virtual arrows to pass straight through thin target colliders.',
            commonMistakes: ['Testing physics only on high-end PC instead of target mobile chipsets with lower fixed timestep rates', 'Missing IsTrigger check on detection zones'],
            keyTakeaways: ['Use Continuous Speculative or Continuous Dynamic collision detection for fast XR objects', 'FixedUpdate runs on physics tick, not frame rate'],
            relatedConceptIds: ['concept-vr-grab-release', 'concept-xr-grab-interactable'],
            tags: ['Physics', 'Rigidbodies', 'Colliders']
          },
          {
            id: 'concept-unity-build-pipeline',
            title: 'Development vs Release Builds',
            summary: 'Build settings, stripping levels, symbol files, and enabling script debugging.',
            difficulty: 'intermediate',
            explanation: 'Development builds include profiler hooks, script debugging symbols, and log outputs. Release builds strip debug symbols and apply code optimization (IL2CPP / ProGuard).',
            whyItMattersForQa: 'Performance tests MUST be run on Release builds because Development builds have overhead that skews frame times. Conversely, crash logs without symbol files produce obfuscated stack traces.',
            xrExample: 'Building an APK with "Autoconnect Profiler" enabled for bottleneck identification, versus creating a final Release APK for certification.',
            realWorldExample: 'A bug where a debug log was called every frame in Development build dropped FPS by 15; in Release build the issue vanished, hiding a runaway loop.',
            commonMistakes: ['Benchmarking frame rate on Development builds', 'Failing to archive mapping.txt / symbol files for release crash investigation'],
            keyTakeaways: ['Always measure final performance on Release / Production builds', 'Use Development builds when profiling or capturing stack traces'],
            relatedConceptIds: ['concept-adb-commands', 'concept-unity-profiler-cpu'],
            tags: ['Builds', 'IL2CPP', 'Pipeline']
          }
        ]
      }
    ]
  },
  {
    id: 'mod-03-xr-fundamentals',
    subjectId: 'xr-qa',
    order: 3,
    code: '03',
    title: 'XR Fundamentals',
    description: 'VR, AR, MR definitions, 3DoF vs 6DoF, Inside-out vs Outside-in tracking, Passthrough, Spatial Anchors, and Coordinate Systems.',
    icon: 'RadarChartOutlined',
    topics: [
      {
        id: 'topic-03-1-dof-tracking',
        title: 'Degrees of Freedom & Spatial Tracking',
        description: '3DoF vs 6DoF, head and controller tracking, coordinate spaces, and tracking loss behavior.',
        concepts: [
          {
            id: 'concept-3dof-6dof',
            title: '3DoF vs 6DoF Tracking',
            summary: 'Rotational tracking (Pitch, Yaw, Roll) versus Rotational + Positional tracking (Surge, Sway, Heave).',
            difficulty: 'beginner',
            explanation: '3DoF tracks only orientation (turning your head in place). 6DoF tracks orientation plus position in space (walking, ducking, leaning). Modern VR/AR headsets (Quest 3, Apple Vision Pro, Vive Focus) are 6DoF.',
            whyItMattersForQa: 'If a 6DoF headset drops to 3DoF due to low light or covered tracking cameras, the world locks to the user head, immediately inducing severe motion sickness.',
            xrExample: 'Verifying the app gracefully pauses and displays an alert when 6DoF positional tracking is lost.',
            realWorldExample: 'A user bends down to pick up a virtual key; in 3DoF the floor moves with their head, making the action impossible.',
            commonMistakes: ['Not testing degraded tracking fallback states', 'Assuming tracking works equally in darkness or mirror-filled rooms'],
            keyTakeaways: ['6DoF allows natural movement in 3D volume', 'Tracking degradation to 3DoF must pause the virtual world immediately'],
            relatedConceptIds: ['concept-tracking-loss-recovery', 'concept-xr-origin'],
            tags: ['6DoF', '3DoF', 'Tracking']
          },
          {
            id: 'concept-tracking-loss-recovery',
            title: 'Tracking Loss & Reacquisition',
            summary: 'Testing how applications react when headset or controller tracking is occluded or lost.',
            difficulty: 'intermediate',
            explanation: 'Inside-out headsets use computer vision and IMUs. Tracking loss occurs when cameras are covered, lighting changes drastically, or featureless white walls provide no optical anchor points.',
            whyItMattersForQa: 'Improper tracking loss handling can teleport the player to coordinate (0,0,0) or freeze hands mid-air, destroying game state or sickening the user.',
            xrExample: 'Covering headset tracking cameras with hands for 5 seconds, walking 2 meters, and releasing: checking if scene re-aligns without sudden rotational snap.',
            realWorldExample: 'A user puts controllers behind their back (outside camera FOV); controllers freeze or drift wildly instead of smoothly interpolating or hiding.',
            commonMistakes: ['Never testing rapid occlusion or boundary crossing during active gameplay', 'Failing to verify audio cues on tracking pause'],
            keyTakeaways: ['VRC guideline: application must pause rendering or blur/fade on tracking loss', 'Controllers should fade or predictively snap back on reacquisition'],
            relatedConceptIds: ['concept-3dof-6dof', 'concept-xr-controller'],
            tags: ['TrackingLoss', 'Recovery', 'IMU']
          }
        ]
      },
      {
        id: 'topic-03-2-passthrough-anchors',
        title: 'Mixed Reality & Spatial Anchors',
        description: 'Passthrough video pipelines, spatial mapping, and persistent world coordinates.',
        concepts: [
          {
            id: 'concept-passthrough-mr',
            title: 'Passthrough & Mixed Reality',
            summary: 'Video see-through feeds, latency, distortion, and blending virtual objects with physical reality.',
            difficulty: 'intermediate',
            explanation: 'Passthrough captures the physical room via external cameras and displays it stereoscopically in real-time. MR overlays digital assets onto this video stream.',
            whyItMattersForQa: 'Passthrough latency causes perceptual sickness. Incorrect depth occlusion makes virtual objects render over real hands when they should be behind them.',
            xrExample: 'Testing depth sorting when real hands hold a virtual weapon in front of real furniture.',
            realWorldExample: 'High dynamic range light changes (turning room lights off) causing noisy video feed and lost spatial tracking in MR mode.',
            commonMistakes: ['Neglecting testing in both brightly lit and dim environments', 'Skipping color accuracy and distortion edge verification around screen boundaries'],
            keyTakeaways: ['Passthrough combines camera feeds with predictive reprojection', 'Occlusion testing requires physical objects in the camera foreground'],
            relatedConceptIds: ['concept-spatial-anchors', 'concept-ar-occlusion'],
            tags: ['Passthrough', 'MixedReality', 'Depth']
          },
          {
            id: 'concept-spatial-anchors',
            title: 'Spatial Anchors & Coordinate Systems',
            summary: 'Pinning virtual objects to physical room points that survive app restarts and re-localization.',
            difficulty: 'advanced',
            explanation: 'Spatial anchors attach virtual objects to physical environment features recognized by the spatial mapping engine. Shared anchors allow multiple headsets to view the same object in identical physical space.',
            whyItMattersForQa: 'Anchors can drift over time or fail to restore if the physical room changes (furniture moved, lighting changed). QA must verify anchor persistence across sessions.',
            xrExample: 'Placing a virtual whiteboard on a real meeting room wall, quitting the app, restarting next day, and verifying sub-centimeter placement accuracy.',
            realWorldExample: 'Moving a chair in the room caused anchor re-localization failure, displacing the whole virtual UI by 2 meters.',
            commonMistakes: ['Testing anchors only in identical static room conditions', 'Not testing anchor synchronization latency across multiple connected headsets'],
            keyTakeaways: ['Test anchor recovery under varying room conditions and lighting', 'Validate anchor save, load, and erase lifecycle events'],
            relatedConceptIds: ['concept-passthrough-mr', 'concept-plane-detection'],
            tags: ['SpatialAnchors', 'Persistence', 'Multiplayer']
          }
        ]
      }
    ]
  },
  {
    id: 'mod-04-xr-interaction-toolkit',
    subjectId: 'xr-qa',
    order: 4,
    code: '04',
    title: 'XR Interaction Toolkit',
    description: 'XR Origin, Camera, Controllers, Ray Interactor, Direct Interactor, Grab Interactable, Teleportation, and Input Actions.',
    icon: 'ApiOutlined',
    topics: [
      {
        id: 'topic-04-1-rig-interactors',
        title: 'XR Rig Architecture & Interactors',
        description: 'XR Origin setup, Ray vs Direct interactors, and Interaction Managers.',
        concepts: [
          {
            id: 'concept-xr-origin',
            title: 'XR Origin & XR Camera',
            summary: 'The central rig coordinating headset tracking, floor offset, and user camera space in Unity.',
            difficulty: 'beginner',
            explanation: 'XR Origin transforms headset and controller tracking data into Unity world coordinates. It handles camera height modes: Device (origin at floor) or Tracking Origin Mode (floor vs eye level).',
            whyItMattersForQa: 'Misconfigured Tracking Origin Mode makes players spawn buried halfway into the floor or floating in the ceiling.',
            xrExample: 'Testing player height calibration when switching from seated to standing boundary modes.',
            realWorldExample: 'XR Origin Camera Offset missing, causing the user head to start at world origin (0,0,0) inside the floor geometry.',
            commonMistakes: ['Manually moving the Main Camera instead of moving the XR Origin parent transform', 'Setting eye-level tracking in an app designed for room-scale floor tracking'],
            keyTakeaways: ['XR Origin controls the coordinate bridge between physical headset and virtual scene', 'Never animate or move the XR Camera GameObject directly'],
            relatedConceptIds: ['concept-xr-controller', 'concept-xr-grab-interactable'],
            tags: ['XROrigin', 'Rig', 'Camera']
          },
          {
            id: 'concept-xr-grab-interactable',
            title: 'XR Grab Interactable & Attach Transforms',
            summary: 'Object manipulation, attach points, velocity damping, throw estimation, and interaction layers.',
            difficulty: 'intermediate',
            explanation: 'XRGrabInteractable allows an object to be picked up by Ray or Direct Interactors. It defines movement type (Kinematic, Instantaneous, VelocityTracking), attach transforms, and throw smoothing.',
            whyItMattersForQa: 'Improper attach transforms cause grabbed weapons or tools to snap backward into the player hand or rotate at bizarre angles.',
            xrExample: 'Grabbing a virtual flashlight: checking whether it aligns naturally with the controller grip angle or snaps to the center of the hand.',
            realWorldExample: 'Selecting Instantaneous movement on an object with a heavy Rigidbody, causing it to punch through walls and crash physics simulations.',
            commonMistakes: ['Missing custom Attach Transform on non-symmetrical objects', 'Wrong Interaction Layer Mask allowing weapons to interact with UI layers'],
            keyTakeaways: ['Use VelocityTracking movement type for dynamic physics-reactive objects', 'Verify throw velocity calculation on fast releases'],
            relatedConceptIds: ['concept-xr-origin', 'concept-physics-rigidbody'],
            tags: ['Interactable', 'Grab', 'Throw']
          }
        ]
      },
      {
        id: 'topic-04-2-locomotion-input',
        title: 'Locomotion & Input System',
        description: 'Teleportation, continuous movement, snap turn, smooth turn, and Input Actions.',
        concepts: [
          {
            id: 'concept-teleport-locomotion',
            title: 'Teleportation vs Continuous Locomotion',
            summary: 'Comfort options, teleport anchors, parabolic rays, tunneling vignettes, and motion sickness mitigation.',
            difficulty: 'intermediate',
            explanation: 'Teleportation instantly moves the player viewpoint to prevent sensory conflict between visual movement and vestibular inertia. Continuous locomotion glides the player via thumbstick, requiring comfort vignettes.',
            whyItMattersForQa: 'Teleportation boundaries must prevent players from teleporting through closed security doors, into walls, or off cliff edges.',
            xrExample: 'Testing teleport ray collision against sloped terrain and navmesh boundaries.',
            realWorldExample: 'A player aims teleport ray through a tiny seam between two wall colliders and teleports into unrendered void space.',
            commonMistakes: ['Missing Teleportation Area / Teleportation Mask on ground geometry', 'Not testing snap turn angle increments (30°, 45°, 90°) for nausea reduction'],
            keyTakeaways: ['Teleportation is the primary accessibility locomotion method for comfort', 'Always test boundary edge clipping with teleportation'],
            relatedConceptIds: ['concept-motion-sickness', 'concept-xr-origin'],
            tags: ['Teleport', 'Locomotion', 'Comfort']
          }
        ]
      }
    ]
  },
  {
    id: 'mod-05-openxr',
    subjectId: 'xr-qa',
    order: 5,
    code: '05',
    title: 'OpenXR',
    description: 'OpenXR architecture, XR Runtimes, OpenXR Features, Interaction Profiles, and Cross-Platform device compatibility.',
    icon: 'BranchesOutlined',
    topics: [
      {
        id: 'topic-05-1-architecture-profiles',
        title: 'OpenXR Standard & Profiles',
        description: 'How OpenXR replaces vendor-locked SDKs and standardizes action-based input.',
        concepts: [
          {
            id: 'concept-openxr-architecture',
            title: 'OpenXR Architecture & Runtimes',
            summary: 'The Khronos Group open standard bridging engine applications with hardware runtimes (Oculus, SteamVR, Windows Mixed Reality).',
            difficulty: 'intermediate',
            explanation: 'OpenXR provides a unified API between game engines and XR hardware runtimes. Instead of coding separate Oculus SDK and Vive SDK logic, developers build once for the OpenXR API, and the active runtime translates it.',
            whyItMattersForQa: 'Testing OpenXR builds requires verifying behavior across different runtimes (e.g. Meta Quest Link Runtime vs SteamVR Runtime). Different runtimes have subtle differences in boundary APIs and frame pacing.',
            xrExample: 'Switching active PC OpenXR runtime between Oculus and SteamVR to verify controller tracking parity.',
            realWorldExample: 'An app crashed on startup on HTC Vive Focus because an optional OpenXR feature extension was marked as mandatory in project settings.',
            commonMistakes: ['Assuming OpenXR eliminates all device-specific bugs', 'Testing only on one runtime and assuming cross-platform compliance'],
            keyTakeaways: ['OpenXR separates application layer from runtime hardware layer', 'Check OpenXR Feature Groups in Unity Project Settings'],
            relatedConceptIds: ['concept-openxr-interaction-profiles', 'concept-xr-devices-cross'],
            tags: ['OpenXR', 'Runtimes', 'Khronos']
          },
          {
            id: 'concept-openxr-interaction-profiles',
            title: 'Interaction Profiles & Action Mapping',
            summary: 'Mapping abstract user actions (Select, Teleport, Grip) to physical device button profiles.',
            difficulty: 'advanced',
            explanation: 'OpenXR does not check "Is Button A pressed?". Instead, it binds an abstract Action (e.g. "PrimaryAction") to Interaction Profiles (Oculus Touch Controller, Index Controller, Simple Controller).',
            whyItMattersForQa: 'If an Interaction Profile is missing for a target device (e.g. Pico Neo 3 controller profile omitted), the user controllers appear in-game but buttons do not respond.',
            xrExample: 'Verifying that "Select Action" responds to Trigger on Quest Touch and Index Knuckles, and Trackpad Click on Vive Wands.',
            realWorldExample: 'A Vive Wand user was unable to reload a weapon because the game only bound secondary action to physical buttons that Vive Wands lack.',
            commonMistakes: ['Hardcoding button names in UI prompts instead of dynamically querying the active OpenXR interaction profile', 'Failing to test fallback bindings'],
            keyTakeaways: ['Test action bindings on every target controller model in the device matrix', 'Verify UI button glyphs match the actual physical controller in hand'],
            relatedConceptIds: ['concept-openxr-architecture', 'concept-xr-controller'],
            tags: ['Input', 'ActionMaps', 'Profiles']
          }
        ]
      }
    ]
  },
  {
    id: 'mod-06-ar-foundation',
    subjectId: 'xr-qa',
    order: 6,
    code: '06',
    title: 'AR Foundation',
    description: 'AR Session, Plane Detection, Raycasting, Image/Object Tracking, Light Estimation, Occlusion, and Environment Variation.',
    icon: 'ScanOutlined',
    topics: [
      {
        id: 'topic-06-1-planes-raycast',
        title: 'Plane Detection & Spatial Sensing',
        description: 'Detecting horizontal and vertical surfaces, point clouds, and raycasting into physical space.',
        concepts: [
          {
            id: 'concept-plane-detection',
            title: 'Plane Detection & Surface Tracking',
            summary: 'How ARKit and ARCore detect horizontal and vertical physical planes (floors, tables, walls).',
            difficulty: 'beginner',
            explanation: 'AR Foundation uses feature point clusters to identify flat geometric surfaces. Planes expand as the camera scans more of the room, merging overlapping planes as confidence increases.',
            whyItMattersForQa: 'Testing plane detection requires diverse surfaces: reflective glass tables, low-contrast white tiles, patterned carpets, and varying lighting levels.',
            xrExample: 'Testing whether plane detection recognizes glass tabletops or mistakes mirrored wardrobe doors for open floor.',
            realWorldExample: 'A home furniture placement app placing virtual couches through walls because vertical plane classification was disabled.',
            commonMistakes: ['Testing only on textured office carpets under optimal fluorescent lighting', 'Not testing plane merging behavior when walking between rooms'],
            keyTakeaways: ['Plane detection fails on featureless or highly reflective surfaces', 'Always test horizontal, vertical, and plane boundary updates'],
            relatedConceptIds: ['concept-ar-raycasting', 'concept-ar-lighting-occlusion'],
            tags: ['AR', 'Planes', 'ARFoundation']
          },
          {
            id: 'concept-ar-lighting-occlusion',
            title: 'Light Estimation & Depth Occlusion',
            summary: 'Adapting virtual lighting to real-world environments and hiding virtual geometry behind real obstacles.',
            difficulty: 'intermediate',
            explanation: 'Light estimation estimates ambient color temperature, intensity, and main light direction from camera frames. Occlusion masks virtual objects when physical people or objects step in front of them.',
            whyItMattersForQa: 'If light estimation fails, virtual objects glow bright neon in a dark room. If occlusion fails, virtual pets appear on top of a user leg that is in front of them.',
            xrExample: 'Walking a virtual dog behind a real table leg to verify depth occlusion mask cuts the dog model cleanly.',
            realWorldExample: 'Virtual shadow cast in opposite direction of real room sunlight, ruining realism and immersion.',
            commonMistakes: ['Ignoring device hardware limitations (e.g. non-LiDAR iPhones vs LiDAR Pro models)', 'Not testing rapid light transitions (walking from indoor shade to bright sunlight)'],
            keyTakeaways: ['Test both with and without LiDAR/TOF depth sensors', 'Validate shadow direction matches physical light sources'],
            relatedConceptIds: ['concept-plane-detection', 'concept-passthrough-mr'],
            tags: ['Lighting', 'Occlusion', 'LiDAR']
          }
        ]
      }
    ]
  },
  {
    id: 'mod-07-vr-testing',
    subjectId: 'xr-qa',
    order: 7,
    code: '07',
    title: 'VR Testing',
    description: 'VR interaction testing, grab/release physics, throwing velocity, boundary collisions, spatial positioning, and scale verification.',
    icon: 'ExperimentOutlined',
    topics: [
      {
        id: 'topic-07-1-vr-interaction-qa',
        title: 'Core VR Interaction Testing',
        description: 'Physical ergonomics, object handling, throwing calculations, and collision verification.',
        concepts: [
          {
            id: 'concept-vr-grab-release',
            title: 'Grab, Release & Throwing Physics QA',
            summary: 'Testing velocity curve buffers, release angle preservation, and throwing trajectory accuracy in VR.',
            difficulty: 'intermediate',
            explanation: 'Throwing in VR does not happen automatically. When a user releases a grip button, the engine samples the last 5-10 frames of controller velocity and angular momentum to apply forward force.',
            whyItMattersForQa: 'Poor velocity sampling makes objects drop straight down like lead weights or launch into the ceiling when thrown gently.',
            xrExample: 'Testing basketball or grenade throwing: executing 20 throws with underhand, overhand, and flick releases to verify consistent arc.',
            realWorldExample: 'A bug where high frame rate (120Hz) caused velocity buffer to calculate double the intended release impulse, launching objects off the map.',
            commonMistakes: ['Testing throws with only gentle, slow hand motions', 'Ignoring frame rate dependency on physics release impulses'],
            keyTakeaways: ['Sample velocity across multiple frames to smooth controller jitter', 'Test both light flick and heavy swing releases'],
            relatedConceptIds: ['concept-xr-grab-interactable', 'concept-physics-rigidbody'],
            tags: ['VRTesting', 'Throwing', 'Physics']
          },
          {
            id: 'concept-boundary-collision-qa',
            title: 'Guardian / Boundary & Collision Testing',
            summary: 'Verifying headset behavior when user physically walks through virtual walls or exits the tracking boundary.',
            difficulty: 'advanced',
            explanation: 'In VR, physical room movement cannot be blocked by virtual colliders. If a player physically walks forward, their head passes through virtual walls unless the game pushes back the camera, fades to black, or repositions them.',
            whyItMattersForQa: 'If boundary clipping is unhandled, players can stick their head through bank vault doors, peek through combat walls, or fall out of level geometry.',
            xrExample: 'Physically walking 1 meter forward while character stands against a virtual wall: screen should fade out or prevent vision past the wall.',
            realWorldExample: 'Speedrunners physically walking across their real living rooms to bypass locked security gates in a VR puzzle game.',
            commonMistakes: ['Assuming virtual colliders prevent physical human movement', 'Testing only with thumbstick locomotion without physically stepping around'],
            keyTakeaways: ['Implement fade-to-black or camera pushback on wall penetration', 'Test headset boundary triggers on floor and edge thresholds'],
            relatedConceptIds: ['concept-3dof-6dof', 'concept-teleport-locomotion'],
            tags: ['Boundary', 'Guardian', 'Clipping']
          }
        ]
      }
    ]
  },
  {
    id: 'mod-08-ar-testing',
    subjectId: 'xr-qa',
    order: 8,
    code: '08',
    title: 'AR Testing',
    description: 'Plane detection stability, object persistence, anchoring, camera permissions, and real-world environment variations.',
    icon: 'MobileOutlined',
    topics: [
      {
        id: 'topic-08-1-ar-test-methodology',
        title: 'Environmental & Camera Testing',
        description: 'Testing against lighting changes, low-texture surfaces, and thermal mobile throttling.',
        concepts: [
          {
            id: 'concept-ar-environment-variation',
            title: 'Environmental Stress Testing in AR',
            summary: 'Validating tracking stability under variable sunlight, shadows, textures, and physical motion.',
            difficulty: 'intermediate',
            explanation: 'AR algorithms depend on visual odometry and IMU sensors. Environmental testing systematically stresses camera sensors across dynamic range, direct sunlight, reflective surfaces, and featureless planes.',
            whyItMattersForQa: 'An AR app that performs flawlessly in a brightly lit studio frequently fails in a dimly lit living room or outdoor park.',
            xrExample: 'Executing plane placement test matrix: dark wood floor, white porcelain tile, grass lawn, asphalt, and glass coffee table.',
            realWorldExample: 'Camera auto-exposure hunting caused sudden tracking drift when pointing phone from carpet towards sunny window.',
            commonMistakes: ['Confining AR testing to a single desk environment', 'Failing to test camera permission denial and recovery workflows'],
            keyTakeaways: ['Create an environmental test matrix including surface materials and lux levels', 'Verify graceful failure messages when tracking is degraded'],
            relatedConceptIds: ['concept-plane-detection', 'concept-ar-lighting-occlusion'],
            tags: ['ARTesting', 'Environment', 'Sensors']
          }
        ]
      }
    ]
  },
  {
    id: 'mod-09-xr-devices',
    subjectId: 'xr-qa',
    order: 9,
    code: '09',
    title: 'XR Devices',
    description: 'Meta Quest, Pico, HTC Vive, Apple Vision Pro, HoloLens, Developer Mode, permissions, and cross-device testing.',
    icon: 'DesktopOutlined',
    topics: [
      {
        id: 'topic-09-1-headset-ecosystem',
        title: 'Headset Architecture & Developer Setup',
        description: 'Enabling developer mode, ADB access, and managing firmware variations across headsets.',
        concepts: [
          {
            id: 'concept-meta-quest',
            title: 'Meta Quest Architecture & Developer Mode',
            summary: 'Android standalone XR operating system, Meta Horizon OS, Developer Hub, and VRC compliance.',
            difficulty: 'beginner',
            explanation: 'Meta Quest headsets run a specialized Android-based OS. Enabling Developer Mode allows sideloading APKs, capturing system logcat, overriding refresh rates (72Hz, 90Hz, 120Hz), and running performance metrics.',
            whyItMattersForQa: 'QA must configure Developer Mode and understand Meta Quest Developer Hub (MQDH) for wireless log recording, cast streaming, and metric overlays.',
            xrExample: 'Using Meta Quest Developer Hub to record a video bug with simultaneous performance HUD displaying frame time.',
            realWorldExample: 'Meta OS update v62 introduced a runtime permission dialog that stole input focus from an in-development build, crashing input bindings.',
            commonMistakes: ['Testing on a single refresh rate when game supports 72Hz, 90Hz, and 120Hz', 'Forgetting to test when Guardian boundary is disabled in developer settings'],
            keyTakeaways: ['Master Meta Quest Developer Hub for rapid sideloading and profiling', 'Track OS firmware versions in bug reports'],
            relatedConceptIds: ['concept-adb-commands', 'concept-unity-profiler-cpu'],
            tags: ['MetaQuest', 'Android', 'DeveloperMode']
          },
          {
            id: 'concept-xr-devices-cross',
            title: 'Cross-Device QA & Compatibility Matrix',
            summary: 'Testing across differing field-of-view, display resolutions, chipsets (XR2 Gen 1 vs XR2 Gen 2), and controller tracking.',
            difficulty: 'intermediate',
            explanation: 'Standalone headsets vary significantly in compute power (Snapdragon XR2 Gen 1 on Quest 2 vs XR2 Gen 2 on Quest 3), IPD adjustment mechanisms, and controller tracking volumes.',
            whyItMattersForQa: 'A shader that runs at 90fps on Quest 3 will cause severe reprojection and dropped frames on Quest 2 if not scaled appropriately.',
            xrExample: 'Verifying UI text readability across 90° FOV (Quest 2) vs 110° FOV (Quest 3) and pancake vs fresnel lens sweet spots.',
            realWorldExample: 'Small 12pt UI text completely unreadable on Quest 2 fresnel lenses due to chromatic aberration at periphery, while looking crisp on Quest 3.',
            commonMistakes: ['Assuming identical rendering budgets across headset generations', 'Ignoring physical IPD slider hardware callback events'],
            keyTakeaways: ['Maintain separate performance budgets for legacy and current-gen headsets', 'Check peripheral readability across differing lens types'],
            relatedConceptIds: ['concept-meta-quest', 'concept-performance-fps-frametime'],
            tags: ['CrossDevice', 'Hardware', 'Resolution']
          }
        ]
      }
    ]
  },
  {
    id: 'mod-10-performance-testing',
    subjectId: 'xr-qa',
    order: 10,
    code: '10',
    title: 'Performance Testing',
    description: 'FPS, Frame Time, CPU/GPU bottlenecks, Draw Calls, Garbage Collection, Reprojection, and Thermal Throttling.',
    icon: 'DashboardOutlined',
    topics: [
      {
        id: 'topic-10-1-framerate-bottlenecks',
        title: 'Frame Time & Bottlenecks',
        description: 'Why frame time is the supreme metric in XR, and how to identify CPU vs GPU bound rendering.',
        concepts: [
          {
            id: 'concept-performance-fps-frametime',
            title: 'FPS vs Frame Time in XR',
            summary: 'Understanding the millisecond budget (13.88ms for 72Hz, 11.11ms for 90Hz, 8.33ms for 120Hz).',
            difficulty: 'beginner',
            explanation: 'In 2D gaming, 60fps is acceptable and occasional frame drops are annoying. In VR, missing a single frame causes the display to repeat or reproject frames, causing visual judder and immediate motion sickness. Frame time (milliseconds per frame) is the true metric.',
            whyItMattersForQa: 'At 90Hz, the CPU and GPU have exactly 11.11ms combined to complete physics, logic, culling, and rendering. QA must measure frame time spikes rather than averaged FPS.',
            xrExample: 'An app averages 90fps over 5 minutes, but drops to 45fps for 200ms every time a door opens; QA must catch these frame spikes.',
            realWorldExample: 'Garbage collection allocation of 500KB triggering a 14ms GC pause, causing a severe dropped frame hitch mid-combat.',
            commonMistakes: ['Relying on average FPS instead of 99th percentile frame times', 'Ignoring thermal throttling that sets in only after 15 minutes of play'],
            keyTakeaways: ['72Hz = 13.88ms budget, 90Hz = 11.11ms budget, 120Hz = 8.33ms budget', 'Frame time spikes cause reprojection judder and nausea'],
            relatedConceptIds: ['concept-cpu-gpu-bottlenecks', 'concept-unity-profiler-cpu'],
            tags: ['FrameTime', 'FPS', 'Performance']
          },
          {
            id: 'concept-cpu-gpu-bottlenecks',
            title: 'CPU vs GPU Bottlenecks in XR',
            summary: 'Isolating whether draw calls and script logic (CPU) or fill-rate and complex shaders (GPU) are stalling frames.',
            difficulty: 'intermediate',
            explanation: 'CPU bound: Main thread spends excessive time executing scripts, physics, or issuing draw calls to the graphics API. GPU bound: Chipset stalls rasterizing pixels, calculating complex fragment shaders, or handling overdraw.',
            whyItMattersForQa: 'Recommending the wrong optimization wastes engineering sprints. If the bottleneck is GPU overdraw from transparent smoke particles, reducing polygon count does nothing.',
            xrExample: 'Lowering eye texture resolution via OVRPlugin: if frame time improves immediately, the app was GPU fill-rate bound.',
            realWorldExample: 'Spawning 50 enemy ragdolls caused CPU Main Thread to spike to 22ms due to physics calculations, while GPU render time remained under 4ms.',
            commonMistakes: ['Assuming high polygon count is always the problem when draw calls or shaders are the culprit', 'Not testing stationary vs moving camera scenes separately'],
            keyTakeaways: ['If reducing render resolution drops frame time, you are GPU bound', 'If frame time remains unchanged after lowering resolution, you are CPU bound'],
            relatedConceptIds: ['concept-performance-fps-frametime', 'concept-unity-profiler-cpu'],
            tags: ['CPU', 'GPU', 'Bottlenecks']
          }
        ]
      }
    ]
  },
  {
    id: 'mod-11-unity-profiler',
    subjectId: 'xr-qa',
    order: 11,
    code: '11',
    title: 'Unity Profiler',
    description: 'CPU Usage, GPU, Rendering, Memory, Physics, Timeline, GC Allocations, and Profiling Before/After changes.',
    icon: 'LineChartOutlined',
    topics: [
      {
        id: 'topic-11-1-profiler-modules',
        title: 'CPU, Memory & Rendering Profiling',
        description: 'Connecting the Unity Profiler over ADB, reading timeline traces, and catching GC allocations.',
        concepts: [
          {
            id: 'concept-unity-profiler-cpu',
            title: 'CPU Profiler & Timeline View',
            summary: 'Connecting Unity Profiler to standalone headset via ADB and isolating script execution spikes.',
            difficulty: 'intermediate',
            explanation: 'The Unity Profiler captures real-time data from the executing headset build over USB or Wi-Fi. The Timeline view displays thread execution (Main Thread, Render Thread, Worker Threads) frame-by-frame down to microsecond resolution.',
            whyItMattersForQa: 'QA engineers who can read the Unity Profiler can pinpoint the exact script or engine subsystem (e.g. `Physics.Simulate`, `GC.Collect`, `RenderPipeline.Render`) causing hitching.',
            xrExample: 'Connecting to Quest 3 via ADB port forwarding and identifying that `Update()` on 200 interactive objects is calling `GetComponent` every frame.',
            realWorldExample: 'A 18ms frame spike traced to `MeshCollider.Bake` executing synchronously on the Main Thread during runtime object spawning.',
            commonMistakes: ['Profiling in the Unity Editor instead of a standalone target build', 'Leaving Deep Profiling on during performance measurement, which distorts timing'],
            keyTakeaways: ['Always profile on target hardware via Development Build + Autoconnect Profiler', 'Timeline view shows exact thread synchronization stalls'],
            relatedConceptIds: ['concept-performance-fps-frametime', 'concept-unity-profiler-memory'],
            tags: ['UnityProfiler', 'CPU', 'Timeline']
          },
          {
            id: 'concept-unity-profiler-memory',
            title: 'Memory & Garbage Collection (GC) Allocations',
            summary: 'Detecting managed heap allocations, garbage collection pauses, and texture VRAM leaks.',
            difficulty: 'advanced',
            explanation: 'In C# Unity, allocating objects on the managed heap (strings, LINQ, instantiations) generates garbage. When the heap is exhausted, Unity freezes the Main Thread to run `GC.Collect()`.',
            whyItMattersForQa: 'A 10ms GC freeze in 2D gaming is barely noticeable; in VR it causes a sickening visual stutter. Zero GC allocation during active gameplay is a primary XR QA requirement.',
            xrExample: 'Inspecting the `GC Alloc` column in the Hierarchy Profiler view to verify 0 B allocated per frame during locomotion.',
            realWorldExample: 'A UI score script string concatenation (`"Score: " + score`) allocating 48 bytes every frame, accumulating until triggering a GC hitch every 40 seconds.',
            commonMistakes: ['Ignoring small GC allocations (32 bytes) that accumulate into periodic frame hitches', 'Confusing Mono Managed Heap memory with Native VRAM texture memory'],
            keyTakeaways: ['Zero GC Alloc per frame during active gameplay is the target standard for XR', 'Use Object Pooling for recurring items, bullets, and particles'],
            relatedConceptIds: ['concept-unity-profiler-cpu', 'concept-csharp-unity-lifecycle'],
            tags: ['Memory', 'GarbageCollection', 'Allocations']
          }
        ]
      }
    ]
  },
  {
    id: 'mod-12-debugging',
    subjectId: 'xr-qa',
    order: 12,
    code: '12',
    title: 'Debugging',
    description: 'Unity Console, Stack Traces, Exceptions (NullReference, MissingReference), Crash Analysis, ADB & Logcat Mastery.',
    icon: 'BugOutlined',
    topics: [
      {
        id: 'topic-12-1-adb-logcat',
        title: 'ADB & Device Logcat Mastery',
        description: 'Android Debug Bridge commands, log filtering, tombstone extraction, and crash triage.',
        concepts: [
          {
            id: 'concept-adb-commands',
            title: 'Essential ADB Commands for XR QA',
            summary: 'Direct command-line control of standalone headsets (Meta Quest, Pico, HTC Vive Focus).',
            difficulty: 'beginner',
            explanation: 'Android Debug Bridge (ADB) communicates directly with the Unix subsystem of Android XR headsets. It enables APK installation, wireless debugging, real-time log capturing, file transfer, and process termination.',
            whyItMattersForQa: 'QA engineers cannot rely on GUI tools alone. Knowing ADB commands allows rapid test deployment, capturing logs on launch crashes, and pulling screen recordings effortlessly.',
            xrExample: 'Running `adb logcat -s Unity ActivityManager` during launch to catch native startup exception.',
            realWorldExample: 'App failed to install with error `INSTALL_FAILED_INSUFFICIENT_STORAGE`; diagnosed instantly via adb command output.',
            commonMistakes: ['Forgetting to authorize USB debugging popup inside headset', 'Not filtering logcat, resulting in millions of spam lines burying the exception'],
            keyTakeaways: [
              'adb devices: lists connected headsets',
              'adb install -r <apk>: installs/updates build preserving data',
              'adb logcat -s Unity: streams Unity-specific logs and stack traces',
              'adb shell: opens Unix terminal on headset',
              'adb pull / push: transfers files to and from headset storage'
            ],
            relatedConceptIds: ['concept-logcat-crash-analysis', 'concept-meta-quest'],
            tags: ['ADB', 'Logcat', 'Terminal', 'Android']
          },
          {
            id: 'concept-logcat-crash-analysis',
            title: 'Logcat Crash Analysis & Stack Traces',
            summary: 'Decoding FATAL EXCEPTION, signal 11 (SIGSEGV), native tombstones, and NullReferenceExceptions.',
            difficulty: 'intermediate',
            explanation: 'When a standalone build crashes to the home dashboard, Logcat records the fatal signal and call stack. QA must identify whether the crash is a managed C# exception or native C++ memory corruption.',
            whyItMattersForQa: 'A bug report saying "the app closed" is useless. Attaching the 20-line stack trace from `adb logcat` allows developers to fix the bug in minutes.',
            xrExample: 'Capturing `NullReferenceException: Object reference not set to an instance of an object at PlayerController.Update()` in Logcat.',
            realWorldExample: 'Signal 11 (SIGSEGV) native crash caused by an OpenXR plugin attempting to read a null controller buffer on disconnect.',
            commonMistakes: ['Capturing logs after restarting the headset, losing the crash buffer', 'Not checking for out of memory (OOM) killer terminations'],
            keyTakeaways: ['Search logcat for "FATAL", "Exception", "CRASH", or "Unity"', 'Attach the full call stack to your bug report'],
            relatedConceptIds: ['concept-adb-commands', 'concept-bug-reporting-standards'],
            tags: ['Crash', 'StackTrace', 'Exceptions']
          }
        ]
      }
    ]
  },
  {
    id: 'mod-13-bug-reporting',
    subjectId: 'xr-qa',
    order: 13,
    code: '13',
    title: 'Bug Reporting',
    description: 'Writing effective bug reports, Environment, Preconditions, Steps, Expected vs Actual, Severity/Priority, Reproduction rates, and XR evidence.',
    icon: 'FileTextOutlined',
    topics: [
      {
        id: 'topic-13-1-xr-bug-standards',
        title: 'Professional XR Bug Reporting',
        description: 'Structuring bug reports that capture physical spatial states, device telemetry, and video evidence.',
        concepts: [
          {
            id: 'concept-bug-reporting-standards',
            title: 'XR Bug Report Structure & Standards',
            summary: 'Creating unambiguous, reproducible defect tickets with physical and digital preconditions.',
            difficulty: 'beginner',
            explanation: 'XR bug reports require parameters absent in web testing: headset model, tracking mode (room-scale vs stationary), boundary size, physical lighting level, firmware build, and stereo video recordings.',
            whyItMattersForQa: 'Bugs in 3D space are notoriously difficult to reproduce without exact player orientation, eye gaze, and interaction sequence.',
            xrExample: 'Documenting that an object falls through the floor only when grabbed with the left hand while standing at the boundary corner.',
            realWorldExample: 'A bug closed as "Cannot Reproduce" for 3 weeks because the tester did not note they were testing on a Quest 2 with 72Hz refresh rate while devs tested on Quest 3 at 90Hz.',
            commonMistakes: ['Omitting headset firmware and controller battery states', 'Recording single-eye flat video that cuts off peripheral visual bugs'],
            keyTakeaways: [
              'Include: Environment (Device, OS, Build), Preconditions, Steps to Reproduce, Expected, Actual',
              'Include reproduction rate (e.g. 5/5 = 100%) and ADB logcat snippet',
              'Record video showing both hands and the full interaction sequence'
            ],
            relatedConceptIds: ['concept-severity-priority', 'concept-adb-commands'],
            tags: ['BugReporting', 'QA', 'Documentation']
          }
        ]
      }
    ]
  },
  {
    id: 'mod-14-csharp-basics',
    subjectId: 'xr-qa',
    order: 14,
    code: '14',
    title: 'C# Basics for QA',
    description: 'Variables, loops, methods, OOP, GetComponent, Debug.Log, and Unity Lifecycle methods (Awake, Start, Update, OnEnable).',
    icon: 'CodeOutlined',
    topics: [
      {
        id: 'topic-14-1-unity-csharp-lifecycle',
        title: 'C# Syntax & Unity Execution Order',
        description: 'Reading script logic, understanding when methods execute, and catching timing bugs.',
        concepts: [
          {
            id: 'concept-csharp-unity-lifecycle',
            title: 'Unity Lifecycle: Awake, Start, Update, OnEnable',
            summary: 'The deterministic order in which Unity executes script methods from initialization to teardown.',
            difficulty: 'beginner',
            explanation: 'Awake initializes script references; OnEnable runs when object activates; Start executes before the first frame; Update executes every frame; FixedUpdate executes on physics steps. LateUpdate runs after all Updates.',
            whyItMattersForQa: 'Race conditions often occur because Script A tries to read a variable in `Start()` before Script B initializes it in its own `Start()`. Knowing lifecycle order isolates timing defects.',
            xrExample: 'XR Camera rig updating position in `Update` while weapon position updates in `LateUpdate`, causing weapon jitter when turning head.',
            realWorldExample: 'NullReferenceException on level load because GameObject was accessed in Awake before the singleton Manager called its own Awake.',
            commonMistakes: ['Confusing Update (frame-rate dependent) with FixedUpdate (physics interval)', 'Putting heavy queries inside Update() loops'],
            keyTakeaways: ['Awake is for self-initialization; Start is for cross-object queries', 'Update runs every frame; FixedUpdate runs on physics ticks'],
            relatedConceptIds: ['concept-gameobjects-components', 'concept-unity-profiler-cpu'],
            tags: ['CSharp', 'Lifecycle', 'Unity']
          }
        ]
      }
    ]
  },
  {
    id: 'mod-15-git',
    subjectId: 'xr-qa',
    order: 15,
    code: '15',
    title: 'Git & Version Control',
    description: 'Repository, Clone, Pull, Commit, Branch, Merge, Git LFS for 3D binary assets, and resolving test conflicts.',
    icon: 'GithubOutlined',
    topics: [
      {
        id: 'topic-15-1-git-for-qa',
        title: 'Git & Large File Storage (LFS)',
        description: 'Branching strategies, pulling candidate release tags, and handling large 3D models.',
        concepts: [
          {
            id: 'concept-git-workflows-lfs',
            title: 'Git Workflows & Git LFS in Game Projects',
            summary: 'Managing binary 3D assets (textures, audio, FBX) and checking out specific build commits for regression triage.',
            difficulty: 'beginner',
            explanation: 'Git tracks text source code; Git LFS (Large File Storage) replaces large binary files with text pointers to keep repos lean. QA engineers use Git to checkout bugged release branches and perform bisect debugging.',
            whyItMattersForQa: 'If a tester clones a repo without Git LFS installed, all 3D models and textures become 1KB corrupt pointer files, causing scenes to render pink and empty.',
            xrExample: 'Running `git bisect` to discover the exact commit that introduced a frame rate drop between v1.4 and v1.5.',
            realWorldExample: 'Missing `git lfs pull` caused missing texture shaders in build, leading QA to report false graphic bugs.',
            commonMistakes: ['Committing large `.unitypackage` or `.apk` files directly to Git without LFS', 'Not pulling latest tags before regression test cycles'],
            keyTakeaways: ['Ensure Git LFS is installed and initialized before cloning XR repos', 'Use git tags to verify test builds match exact commit hashes'],
            relatedConceptIds: ['concept-unity-build-pipeline', 'concept-smoke-sanity'],
            tags: ['Git', 'GitLFS', 'VersionControl']
          }
        ]
      }
    ]
  },
  {
    id: 'mod-16-xr-ux-accessibility',
    subjectId: 'xr-qa',
    order: 16,
    code: '16',
    title: 'XR UX & Accessibility',
    description: 'Comfort ratings, Motion sickness, UI readability, Interaction distance, Reachability, Contrast, and User fatigue.',
    icon: 'SmileOutlined',
    topics: [
      {
        id: 'topic-16-1-comfort-ergonomics',
        title: 'Ergonomics, Comfort & Motion Sickness',
        description: 'Vestibular-ocular mismatch, artificial acceleration, comfort options, and accessibility guidelines.',
        concepts: [
          {
            id: 'concept-motion-sickness',
            title: 'Motion Sickness & Simulator Sickness Mitigation',
            summary: 'Sensory conflict theory, artificial acceleration, FOV tunneling vignettes, and comfort rating audits.',
            difficulty: 'intermediate',
            explanation: 'Motion sickness occurs when the eyes perceive motion that the inner ear vestibular system does not feel. Artificial linear or rotational acceleration without visual cues is the #1 cause.',
            whyItMattersForQa: 'An application that causes motion sickness cannot pass platform certification (Meta Store guidelines require explicit comfort ratings). QA must audit comfort options.',
            xrExample: 'Verifying that dynamic peripheral vignetting (darkening screen edges) activates automatically during thumbstick turning.',
            realWorldExample: 'An in-game cutscene took camera control away from the player head, rotating the camera artificially and inducing immediate vomiting in playtesters.',
            commonMistakes: ['Never taking camera control away from the player: never force head rotation in code', 'Testing only on testers with high "VR legs" who are immune to motion sickness'],
            keyTakeaways: ['Never accelerate or rotate the player camera without user input', 'Provide both snap turn and smooth turn comfort options'],
            relatedConceptIds: ['concept-teleport-locomotion', 'concept-severity-priority'],
            tags: ['MotionSickness', 'Comfort', 'Accessibility']
          }
        ]
      }
    ]
  },
  {
    id: 'mod-17-multiplayer-xr',
    subjectId: 'xr-qa',
    order: 17,
    code: '17',
    title: 'Multiplayer XR',
    description: 'Player & avatar synchronization, object interaction sync, latency, packet loss, disconnect/reconnect, and voice chat.',
    icon: 'TeamOutlined',
    topics: [
      {
        id: 'topic-17-1-network-sync',
        title: 'Network Sync & Shared Physical Interactions',
        description: 'Network authority, interpolation, shared grab collisions, and high ping latency stress tests.',
        concepts: [
          {
            id: 'concept-multiplayer-sync',
            title: 'Avatar & Object Ownership Synchronization',
            summary: 'Handling network authority transfer when two players attempt to grab the same virtual object simultaneously.',
            difficulty: 'advanced',
            explanation: 'In multiplayer XR (e.g. using Photon Fusion or Unity Netcode), headsets must synchronize head and hand transforms at 60-90Hz. When Player A grabs a tool held by Player B, ownership authority must transfer cleanly.',
            whyItMattersForQa: 'Network race conditions cause objects to duplicate, desynchronize between headsets, or launch into infinity due to conflicting physics authority.',
            xrExample: 'Testing simultaneous grab: both headsets grab the same virtual handle simultaneously under 150ms simulated network latency.',
            realWorldExample: 'A desync bug where Player A saw the door open while Player B saw it closed, trapping Player B permanently.',
            commonMistakes: ['Testing multiplayer only on high-speed local LAN without latency simulators', 'Overlooking audio spatialization in multiplayer voice chat'],
            keyTakeaways: ['Simulate 100ms+ latency and 2% packet loss during multiplayer testing', 'Verify object ownership handoff and reconnect recovery'],
            relatedConceptIds: ['concept-xr-grab-interactable', 'concept-spatial-audio'],
            tags: ['Multiplayer', 'Networking', 'Authority']
          }
        ]
      }
    ]
  },
  {
    id: 'mod-18-spatial-audio',
    subjectId: 'xr-qa',
    order: 18,
    code: '18',
    title: 'Spatial Audio',
    description: '3D audio positioning, Head-Related Transfer Functions (HRTF), distance attenuation, occlusion, and audio sync.',
    icon: 'SoundOutlined',
    topics: [
      {
        id: 'topic-18-1-hrtf-audio',
        title: '3D Spatial Audio & Audio Occlusion',
        description: 'Testing directional audio cues, distance rolloff, and obstacle acoustic dampening.',
        concepts: [
          {
            id: 'concept-spatial-audio',
            title: '3D Audio & HRTF Spatialization',
            summary: 'Simulating sound wave arrival time differences between ears to localize virtual sound sources in 3D.',
            difficulty: 'beginner',
            explanation: 'Spatial audio uses Head-Related Transfer Functions (HRTF) to filter frequencies based on angle and distance. Sound behind a player sounds muffled; sound to the left reaches the left ear milliseconds earlier.',
            whyItMattersForQa: 'In VR, audio is a critical directional cue. If a sound behind the player plays in flat stereo, the player cannot locate enemies or warnings without visual markers.',
            xrExample: 'Closing eyes in headset and pointing controller towards a chirping virtual bird to verify exact directional alignment.',
            realWorldExample: 'Audio listener attached to XR Origin floor instead of the Main Camera, causing sound direction to invert when player tilted head.',
            commonMistakes: ['Attaching AudioListener to the wrong GameObject instead of the active VR Camera', 'Ignoring volume clipping when multiple spatial sound sources overlap'],
            keyTakeaways: ['Ensure AudioListener is always mounted on the center eye camera', 'Verify distance rolloff curves prevent sounds from cutting off abruptly'],
            relatedConceptIds: ['concept-xr-origin', 'concept-xr-ux-accessibility'],
            tags: ['Audio', 'SpatialAudio', 'HRTF']
          }
        ]
      }
    ]
  },
  {
    id: 'mod-19-graphics-rendering',
    subjectId: 'xr-qa',
    order: 19,
    code: '19',
    title: 'Graphics & Rendering Pipelines',
    description: 'Shaders, URP vs HDRP, single-pass instanced rendering, stereoscopic artifacts, aliasing, and Z-fighting.',
    icon: 'PictureOutlined',
    topics: [
      {
        id: 'topic-19-1-xr-render-pipeline',
        title: 'Stereoscopic Rendering & Visual Artifacts',
        description: 'Single-Pass Instanced rendering, Z-fighting, and anti-aliasing on mobile VR displays.',
        concepts: [
          {
            id: 'concept-stereoscopic-rendering',
            title: 'Single-Pass Instanced & Z-Fighting',
            summary: 'Rendering two eye viewpoints in a single draw call, and resolving depth buffer precision flickering.',
            difficulty: 'intermediate',
            explanation: 'Multi-pass rendering draws the entire scene twice (once per eye), halving performance. Single-Pass Instanced renders both eyes in one pass using texture arrays. Z-fighting occurs when two polygons share the exact same depth.',
            whyItMattersForQa: 'Z-fighting in VR causes intense eye strain as each eye flickers alternate pixels. Shaders not configured for Single-Pass Instancing render in the left eye only.',
            xrExample: 'A post-processing bloom effect rendering only in the left eye because the shader missed `UNITY_SETUP_STEREO_EYE_INDEX_POST_VERTEX`.',
            realWorldExample: 'Road markings placed 0.001 units above asphalt flickering wildly at distance due to depth buffer precision limits.',
            commonMistakes: ['Testing shaders only in Editor without stereoscopic single-pass verification', 'Setting Near Clipping Plane too close (e.g. 0.001m), crushing depth precision'],
            keyTakeaways: ['Single-Pass Instanced is mandatory for mobile XR performance', 'Z-fighting causes acute visual discomfort in VR and must be fixed at asset level'],
            relatedConceptIds: ['concept-cpu-gpu-bottlenecks', 'concept-3d-model-qa'],
            tags: ['Rendering', 'SinglePass', 'ZFighting', 'Shaders']
          }
        ]
      }
    ]
  },
  {
    id: 'mod-20-3d-blender-basics',
    subjectId: 'xr-qa',
    order: 20,
    code: '20',
    title: '3D & Asset Basics for QA',
    description: 'QA-relevant 3D knowledge: meshes, polygon budgets, draw calls, materials, textures, scale, UVs, and missing textures.',
    icon: 'GoldOutlined',
    topics: [
      {
        id: 'topic-20-1-mesh-texture-qa',
        title: '3D Asset Triage & Polygon Budgets',
        description: 'Inspecting polygon density, texture resolutions, inverted normals, and pivot points.',
        concepts: [
          {
            id: 'concept-3d-model-qa',
            title: 'Mesh Budgets, Inverted Normals & Scale',
            summary: 'Identifying non-uniform scale, inverted normal backfaces, and runaway triangle counts.',
            difficulty: 'beginner',
            explanation: 'In standalone VR, total scene polygon budgets are typically 500,000 to 1,000,000 triangles. Inverted normals cause faces to appear invisible from the outside. Incorrect pivot points make objects rotate off-center.',
            whyItMattersForQa: 'If a single decorative vase asset contains 200,000 triangles, it will bottleneck the GPU. QA can open the asset in Unity or Blender to inspect polycount and normals.',
            xrExample: 'An imported virtual table has an inverted normal: looking at it in headset reveals the floor through a see-through tabletop.',
            realWorldExample: 'A 3D door imported with pivot at the center instead of the hinge edge, making the door rotate through the wall when opened.',
            commonMistakes: ['Blaming the graphics programmer when a 3D artist imported uncompressed 8K textures', 'Ignoring object scale transforms in import settings'],
            keyTakeaways: ['Check polygon counts and material counts in Unity Statistics window', 'Verify pivot points align with physical rotation handles'],
            relatedConceptIds: ['concept-transform-coordinates', 'concept-stereoscopic-rendering'],
            tags: ['3D', 'Meshes', 'Polycount', 'Blender']
          }
        ]
      }
    ]
  },
  {
    id: 'mod-21-xr-automation',
    subjectId: 'xr-qa',
    order: 21,
    code: '21',
    title: 'XR Automation',
    description: 'Unity Test Framework, EditMode vs PlayMode tests, simulated XR inputs, build validation, and CI/CD pipelines.',
    icon: 'PlayCircleOutlined',
    topics: [
      {
        id: 'topic-21-1-unity-test-framework',
        title: 'Automated Testing in Unity',
        description: 'Writing EditMode and PlayMode integration tests using mock XR input subsystems.',
        concepts: [
          {
            id: 'concept-unity-automation-utf',
            title: 'Unity Test Framework (UTF) & XR Simulation',
            summary: 'Automating smoke tests and interaction mechanics using XR Device Simulator and CI pipelines.',
            difficulty: 'advanced',
            explanation: 'UTF provides NUnit-based unit and integration testing. PlayMode tests run inside the engine lifecycle, allowing automated bots to spawn XR rigs, simulate controller grab inputs, and verify game state without wearing a headset.',
            whyItMattersForQa: 'Manually testing 100 levels on a physical headset for regression every night is impossible. Automated UTF test suites validate core physics and save-states in CI.',
            xrExample: 'A PlayMode test that uses XR Device Simulator to tele-port the player to checkpoint A and asserts that the inventory count is 1.',
            realWorldExample: 'Nightly automated smoke test caught a build regression where level 4 failed to load due to missing asset bundle reference.',
            commonMistakes: ['Relying 100% on manual physical headset testing for pure logic verification', 'Writing PlayMode tests without cleanup, leaving orphan GameObjects in scenes'],
            keyTakeaways: ['EditMode tests run in Editor without playing; PlayMode tests execute engine frames', 'Use XR Device Simulator for automated input playback'],
            relatedConceptIds: ['concept-smoke-sanity', 'concept-unity-build-pipeline'],
            tags: ['Automation', 'UTF', 'NUnit', 'CI/CD']
          }
        ]
      }
    ]
  },
  {
    id: 'mod-22-webxr-webgl',
    subjectId: 'xr-qa',
    order: 22,
    code: '22',
    title: 'WebXR & WebGL',
    description: 'Unity WebGL export, WebXR API, browser compatibility (Meta Quest Browser, Safari, Chrome), memory limits, and build size.',
    icon: 'GlobalOutlined',
    topics: [
      {
        id: 'topic-22-1-webxr-testing',
        title: 'Browser-Based Immersive Testing',
        description: 'Testing immersive VR sessions directly inside mobile and headset web browsers.',
        concepts: [
          {
            id: 'concept-webxr-testing',
            title: 'WebXR Session Lifecycle & Memory Limits',
            summary: 'Testing `navigator.xr.requestSession`, browser permissions, and WebGL memory constraints on mobile headsets.',
            difficulty: 'intermediate',
            explanation: 'WebXR allows immersive VR/AR experiences to execute directly in web browsers (e.g. Meta Quest Browser). It operates under strict browser sandbox memory limits and requires secure HTTPS contexts.',
            whyItMattersForQa: 'Exceeding WebGL memory heap causes the browser tab to crash abruptly with an "Out of Memory" error. WebXR requires explicit user-gesture activation to enter immersive mode.',
            xrExample: 'Clicking "Enter VR" button: verifying that user activation permission prompt appears and switches to 6DoF stereoscopic mode.',
            realWorldExample: 'A WebXR 3D model viewer running out of memory on Quest Browser because asset textures were not downscaled for mobile browser limits.',
            commonMistakes: ['Testing WebXR over insecure HTTP (WebXR is blocked by browsers without HTTPS)', 'Assuming desktop WebGL performance matches standalone headset browser performance'],
            keyTakeaways: ['WebXR requires HTTPS and explicit user interaction to trigger immersive sessions', 'Monitor WebGL memory heap closely to prevent tab crashes'],
            relatedConceptIds: ['concept-xr-devices-cross', 'concept-security-privacy-xr'],
            tags: ['WebXR', 'WebGL', 'Browser']
          }
        ]
      }
    ]
  },
  {
    id: 'mod-23-security-privacy',
    subjectId: 'xr-qa',
    order: 23,
    code: '23',
    title: 'Security & Privacy in XR',
    description: 'Camera permissions, microphone permissions, spatial room mesh data, biometric telemetry, and user privacy.',
    icon: 'LockOutlined',
    topics: [
      {
        id: 'topic-23-1-spatial-privacy',
        title: 'Spatial Data & Hardware Permissions',
        description: 'Ensuring camera feeds, room meshes, and microphone recordings comply with privacy regulations.',
        concepts: [
          {
            id: 'concept-security-privacy-xr',
            title: 'Camera Permissions & Spatial Mesh Privacy',
            summary: 'Verifying user consent flows for passthrough cameras, room scanning, and voice chat telemetry.',
            difficulty: 'intermediate',
            explanation: 'XR devices have multiple inward and outward facing cameras scanning private living rooms. Operating systems enforce sandboxed access: raw camera pixel data is restricted, and spatial meshes require explicit runtime user permission.',
            whyItMattersForQa: 'Failing to handle permission denial or revocation gracefully can lead to instant app crashes or severe privacy compliance violations and store removal.',
            xrExample: 'Denying microphone permission in system settings and verifying the multiplayer lobby displays a clear warning rather than crashing.',
            realWorldExample: 'An enterprise training app storing raw spatial room mesh files unencrypted on public external storage.',
            commonMistakes: ['Assuming permissions are always granted by the user', 'Not testing runtime permission revocation while the app is running in background'],
            keyTakeaways: ['Never store unencrypted spatial or biometric data', 'Test graceful fallback when camera or spatial permissions are rejected'],
            relatedConceptIds: ['concept-passthrough-mr', 'concept-meta-quest'],
            tags: ['Security', 'Privacy', 'Permissions']
          }
        ]
      }
    ]
  },
  {
    id: 'mod-24-advanced-unity',
    subjectId: 'xr-qa',
    order: 24,
    code: '24',
    title: 'Advanced Unity Architecture',
    description: 'ScriptableObjects, Addressables, Asset Bundles, custom render passes, and advanced memory optimization.',
    icon: 'ThunderboltOutlined',
    topics: [
      {
        id: 'topic-24-1-addressables-architecture',
        title: 'Asset Bundles & Dynamic Loading',
        description: 'Managing dynamic asset loading, memory unloads, and remote content delivery in large XR apps.',
        concepts: [
          {
            id: 'concept-addressables-asset-bundles',
            title: 'Addressables & Memory Management in XR',
            summary: 'Loading assets asynchronously to keep initial download sizes small and unloading unused assets to prevent OOM.',
            difficulty: 'advanced',
            explanation: 'Addressables allow loading scenes, 3D assets, and audio over the network or local storage asynchronously using address strings. This prevents massive initial APK sizes and enables memory unloading when switching levels.',
            whyItMattersForQa: 'Memory leaks frequently occur when developers load an Addressable asset bundle but fail to call `Addressables.Release()`, causing memory to climb until the OS kills the process.',
            xrExample: 'Transitioning between 5 virtual hospital rooms and verifying that total RAM usage does not increase linearly after each room load.',
            realWorldExample: 'A game exceeding Meta Quest 1GB maximum initial download threshold because all audio tracks were packed into the base APK instead of Addressable remote bundles.',
            commonMistakes: ['Not testing on slow 3G network connections when downloading remote Addressable catalogs', 'Forgetting to verify memory cleanup after unloading asset bundles'],
            keyTakeaways: ['Verify Addressables release handles to prevent native memory leaks', 'Check download size and caching behavior under network loss'],
            relatedConceptIds: ['concept-unity-profiler-memory', 'concept-unity-build-pipeline'],
            tags: ['Addressables', 'AssetBundles', 'Memory']
          }
        ]
      }
    ]
  }
];
