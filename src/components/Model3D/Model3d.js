import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Model3D = ({ cabeza, brazo, pierna, cuello, torso }) => {
  const mountref = useRef(null);
  console.log(cabeza);

  useEffect(() => {
    //Configuracion basica
    const currentRef = mountref.current;
    const { clientWidth: width, clientHeight: height } = currentRef;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xececec);
    const camera = new THREE.PerspectiveCamera(25, width / height, 0.01, 1000);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    currentRef.appendChild(renderer.domElement);

    //Posicion de la Camara
    camera.position.z = 6;
    camera.position.x = 1;
    camera.position.y = 1;

    //Creacion de la figura
    // const geometry = new THREE.BoxGeometry(1.1, 1, 1);
    // const material = new THREE.MeshPhongMaterial({ color: 0x0f2c64 });
    // const cube = new THREE.Mesh(geometry, material);
    const material = new THREE.MeshBasicMaterial({ color: 0xdba86f });
    const geometrybrazo1 = new THREE.CylinderGeometry(
      brazo / 50,
      brazo / 50,
      0.4,
      32
    );
    const brazo1 = new THREE.Mesh(geometrybrazo1, material);
    const brazo2 = new THREE.Mesh(geometrybrazo1, material);
    const brazo3 = new THREE.Mesh(geometrybrazo1, material);
    const brazo4 = new THREE.Mesh(geometrybrazo1, material);
    scene.add(brazo1);
    scene.add(brazo2);
    scene.add(brazo3);
    scene.add(brazo4);
    //Vista de la camara a la figura
    camera.lookAt(brazo1.position);
    brazo1.position.x = -0.5;
    brazo1.position.y = 0.5;
    brazo2.position.x = 0.5;
    brazo2.position.y = 0.5;

    brazo3.position.x = -0.5;
    brazo3.position.y = 0.08;
    brazo4.position.x = 0.5;
    brazo4.position.y = 0.08;

    const geometrypierna1 = new THREE.CylinderGeometry(
      pierna / 50,
      pierna / 50,
      0.4,
      32
    );
    const pierna1 = new THREE.Mesh(geometrypierna1, material);
    const pierna2 = new THREE.Mesh(geometrypierna1, material);
    const pierna3 = new THREE.Mesh(geometrypierna1, material);
    const pierna4 = new THREE.Mesh(geometrypierna1, material);
    scene.add(pierna1);
    scene.add(pierna2);
    scene.add(pierna3);
    scene.add(pierna4);
    //Vista de la camara a la figura
    pierna1.position.x = -0.15;
    pierna1.position.y = -0.4;
    pierna2.position.x = 0.15;
    pierna2.position.y = -0.4;

    pierna3.position.x = -0.15;
    pierna3.position.y = -0.82;
    pierna4.position.x = 0.15;
    pierna4.position.y = -0.82;

    const geometrytorso = new THREE.CylinderGeometry(
      torso / 120,
      torso / 120,
      0.8,
      32
    );
    const torso1 = new THREE.Mesh(geometrytorso, material);
    scene.add(torso1);
    torso1.position.x = 0;
    torso1.position.y = 0.3;

    const geometrycuello = new THREE.CylinderGeometry(
      cuello / 230,
      cuello / 230,
      0.13,
      32
    );
    const cuello1 = new THREE.Mesh(geometrycuello, material);
    scene.add(cuello1);
    cuello1.position.x = 0;
    cuello1.position.y = 0.85;

    const geometrycabeza = new THREE.CylinderGeometry(
      cabeza / 130,
      cabeza / 130,
      0.25,
      32
    );
    const cabeza1 = new THREE.Mesh(geometrycabeza, material);
    scene.add(cabeza1);
    cabeza1.position.x = 0;
    cabeza1.position.y = 1.07;

    //Color
    // const ambientalLight = new THREE.AmbientLight(0x404040, 5);
    // scene.add(ambientalLight);

    // const pointlight = new THREE.PointLight(0xff0000, 10);
    // pointlight.position.set(8, 8, 8);
    // scene.add(pointlight);

    //Movimiento de la figura
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const clock = new THREE.Clock();

    const animate = () => {
      // const clapsedTime = clock.getElapsedTime();
      // // cube.rotation.y = clapsedTime;
      // // cube.rotation.x = clapsedTime;
      // capsule.position.x = Math.sin(clapsedTime);
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    //Reaciendo el tamaño cuando cambia la ventana
    const resize = () => {
      const updatedWidth = currentRef.clientWidth;
      const updatedHeight = currentRef.clientHeight;
      renderer.setSize(updatedWidth, updatedHeight);
      camera.aspect = updatedWidth / updatedHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", resize);

    animate();
    //Render de la escena
    //renderer.render(scene, camera);

    return () => {
      currentRef.removeChild(renderer.domElement);
      window.removeEventListener("resize", resize);
    };
  }, [cabeza, brazo, cuello, pierna, torso]);

  return <div ref={mountref} style={{ width: "100%", height: "100vh" }}></div>;
};

export default Model3D;
