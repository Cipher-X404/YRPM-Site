(() => {
  // HERO: Three.js + GSAP ScrollTrigger
  // Expects hero markup to exist in DOM.

  // --------- Globals (scoped) ---------
  let mouseX = 0;
  let mouseY = 0;
  let targetRotX = 0;
  let targetRotY = 0;
  let currentRotX = 0;
  let currentRotY = 0;

  const LERP_SPEED = 0.05;
  const MAX_TILT = 0.14;

  // --------- Guard: only run if hero viewport exists ---------
  const stage = document.getElementById("webgl-stage");
  const heroViewport = document.getElementById("hero-viewport");
  if (!stage || !heroViewport) return;

  // --------- Resolve dimensions ---------
  let stageWidth = stage.clientWidth;
  let stageHeight = stage.clientHeight;

  // --------- Three.js Renderer ---------
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });

  renderer.setSize(stageWidth, stageHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  // r128: outputEncoding exists
  renderer.outputEncoding = THREE.sRGBEncoding;

  stage.appendChild(renderer.domElement);

  // --------- Scene ---------
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.008);

  // --------- Camera ---------
  const camera = new THREE.PerspectiveCamera(
    50,
    stageWidth / stageHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 32);

  const cameraTargetZ = 1.8;

  // --------- Knot container + geometry ---------
  const knotContainer = new THREE.Group();
  scene.add(knotContainer);

  const knotGeometry = new THREE.TorusKnotGeometry(
    8,
    1.8,
    300,
    20,
    5,
    2
  );

  const knotMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0c0c0c,
    roughness: 0.12,
    metalness: 0.98,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    reflectivity: 1.0,
    envMapIntensity: 0.5,
  });

  const knotMesh = new THREE.Mesh(knotGeometry, knotMaterial);
  knotContainer.add(knotMesh);

  // --------- Environment map (procedural cube render target) ---------
  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128);
  const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
  scene.add(cubeCamera);

  // --------- Lighting ---------
  const ambientLight = new THREE.AmbientLight(0x111111, 1.0);
  scene.add(ambientLight);

  const goldSpot = new THREE.SpotLight(0xfba92c, 4, 120, Math.PI / 5, 0.6, 1);
  goldSpot.position.set(18, 12, 18);
  goldSpot.target.position.set(0, 0, 0);
  scene.add(goldSpot);
  scene.add(goldSpot.target);

  const fillLight = new THREE.DirectionalLight(0x1a1a2e, 0.8);
  fillLight.position.set(-15, -8, -12);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0xfba92c, 0.5, 60);
  rimLight.position.set(-12, 6, -15);
  scene.add(rimLight);

  // --------- Mouse tracking ---------
  document.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    targetRotX = mouseY * MAX_TILT;
    targetRotY = mouseX * MAX_TILT;
  });

  // --------- Render loop ---------
  let envMapUpdated = false;

  function animate() {
    requestAnimationFrame(animate);

    knotMesh.rotation.y += 0.0015;
    knotMesh.rotation.z += 0.0005;

    currentRotX += (targetRotX - currentRotX) * LERP_SPEED;
    currentRotY += (targetRotY - currentRotY) * LERP_SPEED;

    knotContainer.rotation.x = currentRotX;
    knotContainer.rotation.y = currentRotY;

    if (!envMapUpdated) {
      knotMesh.visible = false;
      cubeCamera.position.copy(knotMesh.position);
      cubeCamera.update(renderer, scene);
      knotMesh.visible = true;
      knotMaterial.envMap = cubeRenderTarget.texture;
      knotMaterial.needsUpdate = true;
      envMapUpdated = true;
    }

    renderer.render(scene, camera);
  }
  animate();

  // --------- Resize ---------
  function onResize() {
    stageWidth = stage.clientWidth;
    stageHeight = stage.clientHeight;

    if (!stageWidth || !stageHeight) return;

    camera.aspect = stageWidth / stageHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(stageWidth, stageHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  }
  window.addEventListener("resize", onResize);

  // --------- GSAP orchestration ---------
  if (window.gsap && window.ScrollTrigger && window.THREE) {
    gsap.registerPlugin(ScrollTrigger);

    const heroTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero-viewport",
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onLeaveBack: () => {
          const header = document.getElementById("mainHeader");
          if (header) header.classList.remove("is-sticky");
        },
      },
    });

    heroTimeline
      .to(
        ".title-yashua",
        {
          xPercent: -35,
          yPercent: -45,
          scale: 0.8,
          opacity: 0,
          ease: "none",
          duration: 0.4,
        },
        0
      )
      .to(
        ".title-resurrection",
        {
          xPercent: 35,
          yPercent: 45,
          scale: 0.8,
          opacity: 0,
          ease: "none",
          duration: 0.4,
        },
        0
      )
      .to(
        ".context-subtitle",
        {
          opacity: 0,
          y: 30,
          ease: "none",
          duration: 0.3,
        },
        0
      )
      .to(
        ".magnetic-cta",
        {
          opacity: 0,
          scale: 0.5,
          ease: "none",
          duration: 0.3,
        },
        0
      );

    heroTimeline.to(
      camera.position,
      {
        z: cameraTargetZ,
        ease: "power2.in",
        duration: 0.6,
        onUpdate: () => {
          camera.updateProjectionMatrix();
        },
      },
      0.3
    );

    heroTimeline.to(
      camera.rotation,
      {
        x: 0.05,
        y: -0.03,
        ease: "none",
        duration: 0.6,
      },
      0.35
    );

    heroTimeline.to(
      "#transition-overlay",
      {
        opacity: 1,
        ease: "power2.in",
        duration: 0.25,
      },
      0.75
    );

    // About section may or may not exist in your current site.
    // Only animate if present to avoid runtime errors.
    if (document.getElementById("about")) {
      heroTimeline.to(
        "#about",
        {
          opacity: 1,
          ease: "power2.out",
          duration: 0.2,
        },
        0.82
      );
    }

    // Header scroll state is managed by the megamenu in main.js

    // Magnetic CTA effect
    const magneticElements = document.querySelectorAll("[data-magnetic]");
    magneticElements.forEach((el) => {
      const strength = 0.35;
      const ease = 0.15;

      let currentX = 0;
      let currentY = 0;
      let targetX = 0;
      let targetY = 0;

      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        targetX = deltaX * strength;
        targetY = deltaY * strength;
      });

      el.addEventListener("mouseleave", () => {
        targetX = 0;
        targetY = 0;
      });

      function updateMagnetic() {
        currentX += (targetX - currentX) * ease;
        currentY += (targetY - currentY) * ease;
        el.style.transform = `translate(${currentX}px, ${currentY}px)`;
        requestAnimationFrame(updateMagnetic);
      }
      updateMagnetic();
    });

    // About section scroll animations (only if elements exist)
    const about = document.getElementById("about");
    if (about) {
      if (document.querySelector(".about-eyebrow")) {
        gsap.from(".about-eyebrow", {
          scrollTrigger: {
            trigger: "#about",
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
        });
      }

      if (document.querySelector(".about-heading")) {
        gsap.from(".about-heading", {
          scrollTrigger: {
            trigger: "#about",
            start: "top 65%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          y: 50,
          duration: 1,
          ease: "power3.out",
          delay: 0.15,
        });
      }

      if (document.querySelector(".about-text")) {
        gsap.from(".about-text", {
          scrollTrigger: {
            trigger: "#about",
            start: "top 55%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "power3.out",
          delay: 0.3,
        });
      }

      if (document.querySelector(".about-cta")) {
        gsap.from(".about-cta", {
          scrollTrigger: {
            trigger: "#about",
            start: "top 50%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.45,
        });
      }
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) target.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  // Touch support
  if ("ontouchstart" in window) {
    document.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches.length > 0) {
          const touch = e.touches[0];
          mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
          mouseY = (touch.clientY / window.innerHeight) * 2 - 1;
          targetRotX = mouseY * MAX_TILT;
          targetRotY = mouseX * MAX_TILT;
        }
      },
      { passive: true }
    );
  }
})();

