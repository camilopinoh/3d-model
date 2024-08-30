import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [RouterOutlet],
  styleUrls: ['./canvas.component.css'],
  template: `
    <!-- "SPACESHIP - CB1" (https://skfb.ly/oI8UU) by Kerem Kavalci is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).-->
    <div id="heading">
      <h1>SPACESHIP - CB1</h1>
      <h3>Modelo creado por Kerem Kavalci</h3>
      <div class="border"></div>
    </div>
    <div #model id="model">
      <div id="progress-container">
        <div id="progress">Cargando...</div>
      </div>
    </div>
    
  `,
})
export class CanvasComponent implements OnInit, AfterViewInit {
  @ViewChild('model', { static: true }) modelContainer!: ElementRef;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private stats = new Stats();
  private mixer!: THREE.AnimationMixer; 
  private clock = new THREE.Clock();

  ngOnInit(): void {
    this.initThree();
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom)
  }

  ngAfterViewInit(): void {
    this.modelContainer.nativeElement.appendChild(this.renderer.domElement);
    this.animate();
    window.addEventListener('resize', () => this.onWindowResize());
  }

  private initThree(): void {
    // Renderer
    //Inicializar el renderer, antialias es para que no se vean los bordes de los objetos
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    //Poner la salida del color del renderer en el espacio de color sRGB
    //sRGB es tipicamente el default para la mayoria de las pantallas
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    //Establecer el tamaño del renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    //Limpiar el renderer a un color negro, el colo por default cuando no hay modelo
    this.renderer.setClearColor(0x000000);
    //Define el pixel ratio para que se pueda renderizar bien en diferentes dispositivos
    this.renderer.setPixelRatio(window.devicePixelRatio);

    //Sombras
    //Habilitar sombras
    this.renderer.shadowMap.enabled = true;
    //Tipo de sombras
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Escena
    //Se crea una escena nueva
    this.scene = new THREE.Scene();

    // Camara
    //Configurar la perspectiva de la camara, 
    //45 grados campo de visión (field of view)
    //Aspect ratio de la camara
    //Near plane
    //Far plane
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    
    //Posicion de camara dependeiendo si es movil o no
    if (window.innerWidth < 768) {
      // Si el ancho de la ventana es menor a 768px (dispositivo móvil), ajustar la posición de la cámara
      this.camera.position.set(9, 4, 3);; // Ajustar la posición de la cámara para dispositivos móviles
    } else {
      this.camera.position.set(6, 4, 3);; // Posición de la cámara para dispositivos no móviles
    }
    //Posicion de la camara segun vector (x,y,z)
    //this.camera.lookAt(0, 0, 0);

    //Controles Orbitales
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 20;
    this.controls.minPolarAngle = 0.5;
    this.controls.maxPolarAngle = 1.5;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.5;
    this.controls.target = new THREE.Vector3(0, 0, 0);
    this.controls.update();


    // Terreno
    //Agregar geometria basica
    //width, height, widthSegments, heigthSegments
    const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
    //Rotar el avion de manera vertical en 90 grados
    groundGeometry.rotateX(-Math.PI / 2);
    //Aplicar un material de color gris y doubleSide para que se vea por ambos lados el modelo renderizado, para no tener problemas con las sombras
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x555555,
      side: THREE.DoubleSide
    });
    //Crear un mesh con la geometria
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    //Deshabilitar que proyecte sombras
    groundMesh.castShadow = false;
    //Habilitar que reciba sombras
    groundMesh.receiveShadow = true;
    //Agregar el mesh a la escena
    this.scene.add(groundMesh);

    // Luz
    //Color blanco, intensidad 3, distancia que el spotLight ilumina, (distancia y angulo) atenuacion de luz en los bordes
    const spotlight = new THREE.SpotLight(0xffffff, 3000, 100, Math.PI / 12, 0.5);
    //Posicion de la luz
    spotlight.position.set(0, 15, 0);
    //Habilitar que las luces proyecten sombras
    spotlight.castShadow = true;

    // Dismnuir la resolución del mapa de sombras en dispositivos móviles
    if (window.innerWidth < 768) {
      // Si el ancho de la ventana es menor a 768px (dispositivo móvil), ajustar las sombras
      spotlight.shadow.mapSize.width = 1024; 
      spotlight.shadow.mapSize.height = 1024; 
    } else {
      spotlight.shadow.mapSize.width = 2048; 
      spotlight.shadow.mapSize.height = 2048; 
    }
    
    // Ajustar los límites del mapa de sombras
    spotlight.shadow.camera.near = 1;
    spotlight.shadow.camera.far = 100;

    // Ajustar la suavidad de las sombras
    spotlight.shadow.radius = 4;

    //Eliminar artefactos de sombras por el detalle del modelo
    spotlight.shadow.bias = -0.0001;
    //Agregar la luz a la escena
    this.scene.add(spotlight);

    // Modelo
    const loader = new GLTFLoader();
    //La ruta del gltf esta en public por la configuracion predeterminada de assets en angular.json
    loader.load('spaceship/scene.gltf', (gltf) => {
      const mesh = gltf.scene;
      // Inicializa el mixer aquí, justo después de cargar el modelo
      

      mesh.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          (child as THREE.Mesh).castShadow = true;
          (child as THREE.Mesh).receiveShadow = true;
        }
      });
      mesh.position.set(2, 0.65, 0);
      // Escalar el modelo para hacerlo más pequeño
      mesh.scale.set(0.10, 0.10, 0.10);
      this.scene.add(mesh);

      // Verificar si el modelo tiene animaciones
      // if (gltf.animations && gltf.animations.length > 0) {
      //   console.log('El modelo tiene las siguientes animaciones:');
      //   gltf.animations.forEach((clip) => {
      //     console.log(`- ${clip.name}`);
      //   });

      //   // Animaciones
      //   this.mixer = new THREE.AnimationMixer(mesh);
      //   gltf.animations.forEach((clip) => {
      //     this.mixer.clipAction(clip).play();
      //   });
      // } else {
      //   console.log('El modelo no tiene animaciones.');
      // }

       // Animaciones
      this.mixer = new THREE.AnimationMixer( gltf.scene );
      gltf.animations.forEach( ( clip ) => {
        const action = this.mixer.clipAction(clip);
        action.timeScale = 1.5; 
        action.play();
      } );

      // Ocultar el mensaje de carga
      const progressContainer = document.getElementById('progress-container');
      if (progressContainer) {
        progressContainer.style.display = 'none';
      }
    });

    // Ambient light to see the scene better
    //const ambientLight = new THREE.AmbientLight(0x404040);
    //this.scene.add(ambientLight);
  }

  //Renderizar la escena con la funcion animate
  private animate(): void {
    //Llamar a la funcion animate para renderizar la escena
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    if (this.mixer) {
      this.mixer.update(delta);
    }
    
    //Renderizar la escena con la camara
    this.renderer.render(this.scene, this.camera);
    this.stats.update();
    this.controls.update();
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
