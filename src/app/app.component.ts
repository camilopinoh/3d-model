import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
//Importar la libreria de three.js
import * as THREE from 'three';
import { CanvasComponent } from './canvas/canvas.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CanvasComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = '3d-model';

  // @ViewChild('model', { static: true }) modelContainer!: ElementRef;

  // private renderer!: THREE.WebGLRenderer;
  // private scene!: THREE.Scene;
  // private camera!: THREE.PerspectiveCamera;

  // ngOnInit(): void {
  //   this.initThree();
  // }

  // ngAfterViewInit(): void {
  //   this.modelContainer.nativeElement.appendChild(this.renderer.domElement);
  //   this.animate();
  //   window.addEventListener('resize', () => this.onWindowResize());
  // }

  // private initThree(): void {

  //   //Inicializar el renderer, antialias es para que no se vean los bordes de los objetos
  //   const renderer = new THREE.WebGLRenderer({ antialias: true});
  //   //Poner la salida del color del renderer en el espacio de color sRGB
  //   //sRGB es tipicamente el default para la mayoria de las pantallas
  //   renderer.outputColorSpace = THREE.SRGBColorSpace;

  //   //Establecer el tamaño del renderer
  //   renderer.setSize(window.innerWidth, window.innerHeight);
  //   //Limpiar el renderer a un color negro, el colo por default cuando no hay modelo
  //   renderer.setClearColor(0x000000);
  //   //Define el pixel ratio para que se pueda renderizar bien en diferentes dispositivos
  //   renderer.setPixelRatio(window.devicePixelRatio);

  //   //Agregar el renderer al HTML
  //   document.body.appendChild(renderer.domElement)

  //   //Creamos una escena nueva
  //   const scene = new THREE.Scene();

  //   //Configurar la perspectiva de la camara, 
  //   //45 grados campo de visión (field of view)
  //   //Aspect ratio de la camara
  //   //Near plane
  //   //Far plane
  //   const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  //   //Posicion de la camara segun vector (x,y,z)
  //   camera.position.set(4, 5, 11);
  //   camera.lookAt(0, 0, 0);

  //   //Agregar geometria basica
  //   //width, height, widthSegments, heigthSegments
  //   const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
  //   //Rotar el avion de manera vertical en 90 grados
  //   groundGeometry.rotateX(-Math.PI / 2);
  //   //Aplicar un material de color gris y doubleSide para que se vea por ambos lados el modelo renderizado, para no tener problemas con las sombras
  //   const groundMaterial = new THREE.MeshStandardMaterial({
  //     color: 0x555555,
  //     side: THREE.DoubleSide
  //   });
  //   //Crear un mesh con la geometria
  //   const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
  //   //Agregar el mesh a la escena
  //   scene.add(groundMesh);

  //   //CREAR LUZ AMBIENTAL
  //   //Color blanco, intensidad 3, distancia que el spotLight ilumina, (distancia y angulo) atenuacion de luz en los bordes
  //   const spotlight = new THREE.SpotLight(0xffffff, 3, 100, 0.2, 0.5);
  //   //Posicion de la luz
  //   spotlight.position.set(0, 25, 0);
  //   //Agregar la luz a la escena
  //   scene.add(spotlight);

  //   //Renderizar la escena con la funcion animate
  //   function animate(){
  //     //Llamar a la funcion animate para renderizar la escena
  //     requestAnimationFrame(animate);
  //     //Renderizar la escena con la camara
  //     renderer.render(scene, camera);
  //   }

  //   //Llamar a la funcion
  //   animate()

  // }

  // private animate(): void {
  //   requestAnimationFrame(() => this.animate());
  //   this.renderer.render(this.scene, this.camera);
  // }

  // private onWindowResize(): void {
  //   this.camera.aspect = window.innerWidth / window.innerHeight;
  //   this.camera.updateProjectionMatrix();
  //   this.renderer.setSize(window.innerWidth, window.innerHeight);
  // }
  
}
