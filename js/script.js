var scene = new THREE.Scene();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
// Creating a render and setting the size

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

// Creating a camera with basic position

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-30, 30, 40);
camera.lookAt(scene.position);

// Creating the vertex' coordinates

let cubeVertex = [
    [0, 0, 0], [0, 0, 5], [5, 0, 5], [5, 0, 0],
    [0, 5, 0], [0, 5, 5], [5, 5, 5], [5, 5, 0]
];
let cubeEdges = [
    [cubeVertex[0], cubeVertex[1]],
    [cubeVertex[1], cubeVertex[2]],
    [cubeVertex[2], cubeVertex[3]],
    [cubeVertex[3], cubeVertex[0]],
    [cubeVertex[4], cubeVertex[5]],
    [cubeVertex[5], cubeVertex[6]],
    [cubeVertex[6], cubeVertex[7]],
    [cubeVertex[7], cubeVertex[4]],
    [cubeVertex[4], cubeVertex[0]],
    [cubeVertex[5], cubeVertex[1]],
    [cubeVertex[6], cubeVertex[2]],
    [cubeVertex[7], cubeVertex[3]],
];

//Creating empty arrays for grouping and targeting objects
let edge=[];
let sphere=[];
let edges=[];
let spheres=[];
let endShape=[];
// Geometry creation functions
let controls = new function() {
    this.addCube= function() {
        let finalCube=[];
        (function createEdge() { // Edges creation func
            for (let i = 0; i < cubeEdges.length; i++) {
                let edgeGeometry = new THREE.Geometry();
                edgeGeometry.vertices.push(new THREE.Vector3(cubeEdges[i][0][0], cubeEdges[i][0][1], cubeEdges[i][0][2]));
                edgeGeometry.vertices.push(new THREE.Vector3(cubeEdges[i][1][0], cubeEdges[i][1][1], cubeEdges[i][1][2]));
                let edgesMaterial = new THREE.LineBasicMaterial({color: 0x000000});
                edge[i] = new THREE.Line(edgeGeometry, edgesMaterial);
            }
            edges.push(edge);
            return edge;

        })();

        (function createEdge() { //Spheres creation func
            for (let i = 0; i < cubeVertex.length; i++) {
                var sphereGeometry = new THREE.SphereGeometry(0.6, 32, 32);
                sphere[i] = new THREE.Mesh(sphereGeometry);
                sphere[i].position.set(cubeEdges[i][0][0], cubeEdges[i][0][1], cubeEdges[i][0][2]);
                spheres.push(sphere[i]);
            }
            return sphere;
        })();

        //Assembling geometry into subgroups

        let edgeGroup = new THREE.Group();
        let sphereGroup = new THREE.Group();
        for(let n=0;n<edge.length;n++) {
            edgeGroup.add(edge[n]);
        }
        for(let n=0;n<sphere.length;n++) {
            sphereGroup.add(sphere[n]);
        }

        //Assembling subgroups in one group and setting random position

        endShape = new THREE.Group();
        endShape.add(edgeGroup);
        endShape.add(sphereGroup);
        endShape.position.set((Math.random()*10),(Math.random()*10),(Math.random()*10));
        scene.add(endShape);
        console.log(edges)
    }

}

//Adding GUI using google dat.gui

var gui = new dat.GUI();

gui.add(controls, 'addCube');
render();

//Tracking actual usermouse position and intersections using three.js Raycaster

function onMouseMove( event ) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function render() {
    // Adding rotation to the geometry groups
    scene.traverse(function(e) {
        if (e instanceof THREE.Group) {
            e.rotation.x += 0.001;
            e.rotation.y += 0.001;
            e.rotation.z += 0.005/2;
        }
    });

    requestAnimationFrame( render );

    raycaster.setFromCamera( mouse, camera );
    for(let n=0;n<scene.children.length;n++){
        var intersects = raycaster.intersectObjects(spheres);
        if ( intersects.length > 0 ) {
            var intersectionPosition=[];
            intersects[0].object.position.toArray(intersectionPosition);
            for(let i=0;i<cubeEdges.length;i++) {
                if (cubeEdges[i][0].toString()==intersectionPosition.toString()||cubeEdges[i][1].toString()==intersectionPosition.toString()) {
                    edges[n][i].material.color.set(intersects[0].object.material.color);
                }
            }
        }
    }
    renderer.render( scene, camera );
}
render();
window.addEventListener( 'mousedown', onMouseMove, false );

window.requestAnimationFrame(render);