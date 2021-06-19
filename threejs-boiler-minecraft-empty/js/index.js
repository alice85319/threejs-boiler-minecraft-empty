// Put your three.js codes below
(function() {

  
  // Prepare stage scene
  const scene = new THREE.Scene();

  // Add actors of this scene

  // Axes helper
  const axes = new THREE.AxesHelper( 10 );//20:線的長度
  scene.add( axes );

  
  // Ground
  const planeGeometry = new THREE.PlaneGeometry( 300, 300, 50, 50 );
  const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const plane = new THREE.Mesh( planeGeometry, planeMaterial );
  plane.receiveShadow = true;//苦力怕影子
  plane.name = 'floor';
  

  plane.rotation.x = -0.5 * Math.PI; //plane變成水平
 // plane.position.set( 0, -7, 0 );//plane位置
  scene.add( plane );

  // Add camera
  //const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  //camera.position.set( 30,30, 30 );//相機位置
  //camera.lookAt( scene.position );
  

  // Set up stage light
  const spotLight = new THREE.SpotLight( 0x00AEAE );
  //spotLight.castShadow = true;
  spotLight.position.set( -10, 40, 30 );
  scene.add( spotLight );

  
  //會顯示出燈的位置
  /*
  const spotLightHelper = new THREE.SpotLightHelper( spotLight );
  scene.add( spotLightHelper );
  */
  //加入spotlite 顯示影子
  
  //const pointLight = new THREE.PointLight( 0xB87070, 1, 100 );
  //pointLight.castShadow = true;              //!<<< add this line
  //pointLight.position.set( -30, 30, 30 );
  //scene.add( pointLight );
  
  //環境燈
  // Set up stage light
  const ambientLight = new THREE.AmbientLight( 0x404040 );
  scene.add( ambientLight );
  const pointLight = new THREE.PointLight( 0xf0f0f0, 1, 100 );
  pointLight.castShadow = true;
  pointLight.position.set( -30, 30, 30 );
  scene.add( pointLight );


  // Add PhysicsEngine
  const physicsEngine = new PhysicsEngine(scene, camera);
  physicsEngine.initialize();
  //physicsEngine.mock( scene, 30 );
  physicsEngine.mock( 10 );
  
  let groundShape = new CANNON.Plane();
  //let groundCM = new CANNON.Material();
  groundBody = new CANNON.Body({
    mass: 0,
    shape: groundShape,
    material: physicsEngine.physicsMaterial
  });
  // setFromAxisAngle 旋轉 x 軸 -90 度
  groundBody.quaternion.setFromAxisAngle( new CANNON.Vec3( 1, 0, 0 ), -Math.PI / 2 );
  //groundBody.position.set( 0, -7, 0 );
  physicsEngine.world.add( groundBody );
  
  const world = physicsEngine.world;

  // Creeper
  let creeper = new Creeper( 0.19, 10, scene, world );
  //const creeper = new Creeper(scene);
  //creeper.toggleAnimate();//苦力怕再動
  //scene.add( creeper );
  //creeper.position.set( 0, 0, -15 );
  
  
  //可用滑鼠旋轉環境  
  //const navTool = new THREE.OrbitControls( camera );
  const navTool = new NavigationTool( camera, physicsEngine.sphereBody );
  //navTool.enableDamping = true;
  //navTool.dampingFactor = 0.10;
  navTool.attach( scene );

  // Set up renderer
  const renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0xeeeeee, 1.0 );
  renderer.shadowMap.enabled = true;//影子
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;//影子
  document.body.appendChild( renderer.domElement );

  
  

  // Start rendering.
  function render() {
    requestAnimationFrame( render );
    navTool.update( scene, () => {
      physicsEngine.update( navTool );
      creeper.update();
    });
    renderer.render( scene, camera );
    console.log(sb.snake[4].point.position);
    //creeper.animate();//苦力怕再動
  }
  

  render();

  
  //使畫面會根據視窗調整size
  window.addEventListener( 'resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  });

  //控制苦力怕動的按鈕
  const animateBtn = document.getElementById( 'animate' );
  animateBtn.addEventListener( 'click', function() {
      creeper.toggleAnimate();
  });

  const rayHelper = new RayHelper();// 宣告ray
/*
  renderer.domElement.addEventListener( 'dblclick', function( event ) {
    rayHelper.detach( scene );//顯示ray
    
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
  
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
  
    raycaster.setFromCamera( mouse.clone(), camera );
    rayHelper.attach( raycaster, scene ); //顯示ray
    const intersects = raycaster.intersectObjects( creeper.children );
    console.log( intersects );
    const result = intersects[0];
    if( !result ) return;
    const hitPoint = result.point;
    const backVec = hitPoint.clone().add( raycaster.ray.direction.clone().setLength( 1000 ) );
    const backVecH = backVec.projectOnPlane( new THREE.Vector3( 0, 1, 0 ) );
    backVecH.normalize();

    const backwardVec = backVecH.multiplyScalar( 5 );
    const newPos = creeper.position.clone().add( backwardVec );
    creeper.position.set( newPos.x, newPos.y, newPos.z );
    creeper.trigger();//苦力怕被點(爆炸)
      
  });
*/
  const resetBtn = document.getElementById( 'reset' );
  resetBtn.addEventListener( 'click', function() {
    creeper.dispose();
 
    creeper = new Creeper( 0.19, 10, scene, world );
  });
  function save( blob, filename ) {
    const url = URL.createObjectURL( blob );
    const link = document.createElement( 'a' );
    link.href = url;
    link.download = filename || 'data.json';
    link.style = 'display: none';
    document.body.appendChild( link );
    link.click();
    URL.revokeObjectURL( url );
    document.body.removeChild( link );
}
 
function saveArrayBuffer( buffer, filename ) {
    save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
}
 
function saveString( text, filename ) {
    save( new Blob( [ text ], { type: 'text/plain' } ), filename );
}
 
const exportBtn = document.getElementById( 'export' );
exportBtn.addEventListener( 'click', function() {
    let output = scene.toJSON();
    output = JSON.stringify( output, null, '\t' );
    output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );
 
    saveString( output, 'scene.json' );
});

})();