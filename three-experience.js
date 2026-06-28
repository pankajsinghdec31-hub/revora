/* ==========================================================================
   REVORA LUXURY BRAND EXPERIENCE - CONFIGURATOR THREE.JS ENGINE
   ========================================================================== */

class RevoraCampaignExperience {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.cardMesh = null;
    
    // Configurator state
    this.activeColor = "brown"; // brown, green, blue, lavender, pink
    this.activeView = "front";  // front, back
    
    // Animation transitions
    this.transitionProgress = 1.0;
    this.targetRotationY = 0;
    this.currentRotationY = 0;
    this.targetRotationX = 0;
    this.currentRotationX = 0;
    
    // Parallax mouse coordinates
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.idleTime = 0;
    
    // Colorways specifications
    this.colorways = {
      brown: {
        front: "assets/images/bra_brown_front.png",
        back: "assets/images/bra_brown_back_trans.png",
        lightColor: 0xDFCDAA, // warm cream/bronze
        bgColor: 0x3d2314
      },
      green: {
        front: "assets/images/bra_green_front_trans.png",
        back: "assets/images/bra_green_back.png",
        lightColor: 0xD4AF37, // soft gold
        bgColor: 0x2a3126
      },
      blue: {
        front: "assets/images/bra_blue_front_trans.png",
        back: "assets/images/bra_blue_back.png",
        lightColor: 0x4CA6A4, // soft teal
        bgColor: 0x0f2427
      },
      lavender: {
        front: "assets/images/bra_lavender_front_trans.png",
        back: "assets/images/bra_lavender_back.png",
        lightColor: 0xB57EDC, // soft purple
        bgColor: 0x231b2c
      },
      pink: {
        front: "assets/images/bra_pink_front.png",
        back: "assets/images/bra_pink_back_trans.png",
        lightColor: 0xFFD1DC, // soft blush/pearl
        bgColor: 0x2f1d21
      }
    };
    
    // Textures cash preloader
    this.textures = {};

    this.preloadTextures();
  }

  preloadTextures() {
    const manager = new THREE.LoadingManager();
    const loader = new THREE.TextureLoader(manager);
    
    // Load all front and back textures in advance for instant configurations
    Object.keys(this.colorways).forEach(color => {
      this.textures[color] = {
        front: loader.load(this.colorways[color].front),
        back: loader.load(this.colorways[color].back)
      };
      
      // Fix texture orientation filters
      this.textures[color].front.minFilter = THREE.LinearFilter;
      this.textures[color].back.minFilter = THREE.LinearFilter;
    });

    manager.onLoad = () => {
      this.init();
    };
  }

  init() {
    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x111111, 0.05);

    // 2. Camera setup
    this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0, 7.5);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 4. Create Campaign Configurator Card
    this.createCardMesh();

    // 5. Setup dynamic lights
    this.setupLights();

    // 6. Event listeners
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));

    // 7. Start Loop
    this.animate();
  }

  createCardMesh() {
    // Dimensions matching editorial campaign frames
    const width = 2.4;
    const height = 3.2;
    const depth = 0.002; // extremely thin box card

    const geometry = new THREE.BoxGeometry(width, height, depth);

    // Edge material - transparent/invisible
    const edgeMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0
    });

    // Create textures configurations materials
    this.rebuildMaterials();

    // Box faces layout: Right, Left, Top, Bottom, Front, Back
    this.materialsList = [
      edgeMaterial, // Right
      edgeMaterial, // Left
      edgeMaterial, // Top
      edgeMaterial, // Bottom
      this.frontMaterial, // Front (+Z)
      this.backMaterial  // Back (-Z)
    ];

    this.cardMesh = new THREE.Mesh(geometry, this.materialsList);
    this.cardMesh.castShadow = true;
    this.cardMesh.receiveShadow = true;
    
    // Position floating in space
    this.cardMesh.position.set(0, 0, 0);
    this.scene.add(this.cardMesh);
  }

  rebuildMaterials() {
    const activeFrontTex = this.textures[this.activeColor].front;
    const activeBackTex = this.textures[this.activeColor].back;

    // Front Material mapping Front Bra
    this.frontMaterial = new THREE.MeshPhysicalMaterial({
      map: activeFrontTex,
      transparent: true,
      roughness: 0.45,
      metalness: 0.1,
      clearcoat: 0.3,
      clearcoatRoughness: 0.35,
      side: THREE.FrontSide,
      alphaTest: 0.05
    });

    // Back Material mapping Back Bra (must be flipped on Y to render right-side up)
    activeBackTex.wrapS = THREE.RepeatWrapping;
    activeBackTex.repeat.x = -1; // Flip texture horizontally so it isn't mirrored when rotated
    
    this.backMaterial = new THREE.MeshPhysicalMaterial({
      map: activeBackTex,
      transparent: true,
      roughness: 0.45,
      metalness: 0.1,
      clearcoat: 0.3,
      clearcoatRoughness: 0.35,
      side: THREE.FrontSide,
      alphaTest: 0.05
    });

    // Apply directly if the card is already built
    if (this.cardMesh) {
      this.cardMesh.material[4] = this.frontMaterial;
      this.cardMesh.material[5] = this.backMaterial;
      this.cardMesh.material[4].needsUpdate = true;
      this.cardMesh.material[5].needsUpdate = true;
    }
  }

  setupLights() {
    // Warm Ambient Light
    this.ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.45);
    this.scene.add(this.ambientLight);

    // Directional Key spotlight
    this.keyLight = new THREE.SpotLight(0xFFFFFF, 2.5);
    this.keyLight.position.set(2, 4, 5);
    this.keyLight.angle = Math.PI / 4;
    this.keyLight.penumbra = 0.6;
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.scene.add(this.keyLight);

    // Dynamic accent reflection spotlight
    const activeSpecColor = this.colorways[this.activeColor].lightColor;
    this.accentLight = new THREE.PointLight(activeSpecColor, 3, 12);
    this.accentLight.position.set(-2, 2, 4);
    this.scene.add(this.accentLight);

    // Back rim spotlight
    this.rimLight = new THREE.DirectionalLight(0xFFFFFF, 1.2);
    this.rimLight.position.set(-3, -1, -4);
    this.scene.add(this.rimLight);
  }

  // Trigger Color Transition Morph (tilt + fade + load)
  setColor(colorName) {
    if (colorName === this.activeColor) return;

    this.activeColor = colorName;
    this.transitionProgress = 0.0; // Start morph timeline

    // Animate spotlight color highlights
    const targetLightColor = new THREE.Color(this.colorways[colorName].lightColor);
    
    // Smooth spotlight color lerping
    gsap.to(this.accentLight.color, {
      r: targetLightColor.r,
      g: targetLightColor.g,
      b: targetLightColor.b,
      duration: 0.6,
      ease: "power2.out"
    });

    // Morph rotation & scale trigger
    const initialTiltY = this.targetRotationY;
    // Add a 20 degree quick tilt during swap
    const tiltDirection = Math.random() > 0.5 ? 0.35 : -0.35;
    
    gsap.to(this.cardMesh.scale, {
      x: 0.95,
      y: 0.95,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });

    gsap.to(this.cardMesh.rotation, {
      y: initialTiltY + tiltDirection,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        // Swap textures halfway through rotation tilt
        this.rebuildMaterials();
        
        // Return back to standard rotation
        gsap.to(this.cardMesh.rotation, {
          y: this.targetRotationY,
          duration: 0.4,
          ease: "power2.out"
        });
      }
    });
  }

  // Trigger View Rotation (180 degree flip)
  setView(viewName) {
    if (viewName === this.activeView) return;
    this.activeView = viewName;

    // Y Rotation calculations
    // Front View = 0; Back View = Math.PI (3.14159)
    this.targetRotationY = viewName === "front" ? 0 : Math.PI;

    gsap.to(this.cardMesh.rotation, {
      y: this.targetRotationY,
      duration: 0.8,
      ease: "power3.inOut"
    });
  }

  onMouseMove(event) {
    // Range from -1 to 1
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.mouse.targetX = x;
    this.mouse.targetY = y;
  }

  onResize() {
    if (!this.container) return;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.idleTime += 0.006;

    // Lerped mouse coords for inertia delay
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.06;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.06;

    // Natural breathing / floating offsets (sin wave)
    const breatheOffset = Math.sin(this.idleTime) * 0.15;
    
    if (this.cardMesh) {
      this.cardMesh.position.y = breatheOffset;
      
      // Merge natural float + mouse tilt parallax
      this.cardMesh.position.x = this.mouse.x * 0.2;
      
      // Subtle tilt rotation offset based on mouse
      this.cardMesh.rotation.x = (this.mouse.y * 0.15) + Math.sin(this.idleTime * 0.6) * 0.02;
      
      // If we are not currently executing a GSAP rotation transition, apply mouse Y-parallax
      if (!gsap.isTweening(this.cardMesh.rotation)) {
        this.cardMesh.rotation.y = this.targetRotationY + (this.mouse.x * 0.2);
        this.cardMesh.rotation.z = (this.mouse.x * 0.05) + Math.cos(this.idleTime * 0.6) * 0.01;
      }
    }

    // Move spotlight reflection mapping to hover coordinates
    if (this.accentLight) {
      this.accentLight.position.x = -2 + (this.mouse.x * 3);
      this.accentLight.position.y = 2 + (this.mouse.y * 3);
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Global script instantiator hook
document.addEventListener("DOMContentLoaded", () => {
  // Load GSAP dynamically if not present (GSAP makes custom easing animations extremely simple)
  if (typeof gsap === "undefined") {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    script.onload = () => {
      initializeCampaign3D();
    };
    document.head.appendChild(script);
  } else {
    initializeCampaign3D();
  }
});

function initializeCampaign3D() {
  setTimeout(() => {
    if (typeof THREE !== "undefined") {
      window.revora3D = new RevoraCampaignExperience("hero-3d-canvas");
    }
  }, 100);
}
