document.addEventListener('DOMContentLoaded', () => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // Alpha true for transparency
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Particles
    const geometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    const color1 = new THREE.Color(0x00f7ff); // Cyan
    const color2 = new THREE.Color(0xbc13fe); // Purple

    for (let i = 0; i < particlesCount * 3; i += 3) {
        // x, y, z
        posArray[i] = (Math.random() - 0.5) * 100; // Spread x
        posArray[i + 1] = (Math.random() - 0.5) * 100; // Spread y
        posArray[i + 2] = (Math.random() - 0.5) * 100; // Spread z

        // Colors
        const mixedColor = color1.clone().lerp(color2, Math.random());
        colors[i] = mixedColor.r;
        colors[i + 1] = mixedColor.g;
        colors[i + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material
    const material = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    // Mesh
    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);

    // Connecting Lines (Optional - can be heavy, let's keep it to particles wave for performance + aesthetics)
    // If user wants "more complex", I can add a wireframe terrain or just animate these particles in a wave.

    // Let's create a secondary object: A rotating wireframe icosahedron for a "Tech Core" look
    const geo2 = new THREE.IcosahedronGeometry(15, 1); // Increased size
    const mat2 = new THREE.MeshBasicMaterial({
        color: 0x00f7ff,
        wireframe: true,
        transparent: true,
        opacity: 0.3 // Increased opacity
    });
    const wireframeMesh = new THREE.Mesh(geo2, mat2);
    scene.add(wireframeMesh);

    // Add an inner glowing core for better visibility
    const geo3 = new THREE.IcosahedronGeometry(5, 2);
    const mat3 = new THREE.MeshBasicMaterial({
        color: 0xbc13fe,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });
    const innerCore = new THREE.Mesh(geo3, mat3);
    scene.add(innerCore);


    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Rotate particles slowly
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = elapsedTime * 0.02;

        // Wave effect on particles
        // Access positions and modify them? No, that's heavy on CPU.
        // Instead, just rotate the entire system and maybe move camera slightly.

        // Wireframe Core Rotation
        wireframeMesh.rotation.x += 0.005;
        wireframeMesh.rotation.y += 0.005;

        innerCore.rotation.x -= 0.01;
        innerCore.rotation.y -= 0.01;

        // Interactive Camera Movement
        // Smoothly interpolate camera position towards mouse
        const targetX = (mouseX / window.innerWidth - 0.5) * 2;
        const targetY = (mouseY / window.innerHeight - 0.5) * 2;

        particlesMesh.rotation.y += 0.002 * (mouseX - window.innerWidth / 2) * 0.001;
        particlesMesh.rotation.x += 0.002 * (mouseY - window.innerHeight / 2) * 0.001;

        renderer.render(scene, camera);
    }

    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
