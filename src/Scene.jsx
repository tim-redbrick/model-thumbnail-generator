import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const Scene = ({ urlGlb }) => {
  const canvasRef = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const loader = new THREE.TextureLoader();

    loader.load(
      "https://redbrick.land/studio/asset/sky/bluesky/bluesky_pz.png",
      function (texture) {
        scene.background = texture;
      }
    );

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );
    camera.position.set(0.0, 2.0, -1.25);
    camera.lookAt(new THREE.Vector3(0.0, 1.0, 0.0));

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 3);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 50);
    scene.add(hemiLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 4);
    dirLight1.color.setHSL(0.1, 1, 0.95);
    dirLight1.position.set(5, 10, -5);
    dirLight1.position.multiplyScalar(30);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 2);
    dirLight2.color.setHSL(0.1, 1, 0.95);
    dirLight2.position.set(-5, 10, 5);
    dirLight2.position.multiplyScalar(30);

    scene.add(dirLight1);
    scene.add(dirLight2);

    const adjustCamera = (object) => {
      const boundingBox = new THREE.Box3().setFromObject(object);
      const size = boundingBox.getSize(new THREE.Vector3());
      const center = boundingBox.getCenter(new THREE.Vector3());
      const maxSize = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxSize / (2 * Math.tan(fov / 2)));
      cameraZ *= 1.3;
      camera.far = 10000;
      camera.updateProjectionMatrix();
      const offset = new THREE.Vector3(1, 0.5, -1)
        .normalize()
        .multiplyScalar(cameraZ);
      camera.position.copy(center.clone().add(offset));
      camera.lookAt(center);

      controls.target.copy(center);
      controls.update();
    };

    new GLTFLoader().load(
      urlGlb,
      (gltf) => {
        scene.add(gltf.scene);
        adjustCamera(gltf.scene);
        animate();
      },
      undefined,
      (error) => console.error("An error happened", error)
    );

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0);
    controls.update();

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [urlGlb]);

  return (
    <canvas ref={canvasRef} style={{ width: "100%", height: "100vh" }}></canvas>
  );
};

export default Scene;
