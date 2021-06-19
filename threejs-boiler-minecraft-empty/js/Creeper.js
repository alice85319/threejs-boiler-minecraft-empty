/**
 * Minecraft Creeper model
 * Ref: https://ithelp.ithome.com.tw/articles/10200287
 */

class Creeper extends THREE.Group {
  constructor(sizeScale, massScale, scene, world) {
    super();
    //苦力怕再動
    this.rotateHeadOffset = 0;
    this.walkOffset = 0;
    this.scaleHeadOffset = 0;
    this.walking = true;
    this.headSwinging = true;
    this.bodyScaking = true;
    this.scene = scene;
    this.world = world;
    
    this.sizeScale = sizeScale;
    this.massScale = massScale;
    
    this.counter = 0;
    this.explosions = [];
    this.isExposed = false;
    this.init();

  }

  init() {

    this.scene.add(this);

    const sizeScale = this.sizeScale;
    const massScale = this.massScale;
    // Geometries for head, body and foot
    
    // Skin Color
    /*
    const faceMap = new THREE.TextureLoader().load( 'img/creeper_face.png' );
    const skinMap = new THREE.TextureLoader().load( 'img/creeper_skin.png' );
    const skinMat = new THREE.MeshStandardMaterial({
      roughness: 0.3,
      metalness: 0.8,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      map: skinMap
    });
    const headMaterials = [];
    for( let i = 0; i < 6; i++ ) {
        let map;
    
        if( i === 4 ) map = faceMap;
        else map = skinMap;
    
        headMaterials.push(new THREE.MeshStandardMaterial({ map }));
    }
    */
    // Skin Color
    const textureLoader = new THREE.TextureLoader();
    const faceMap = textureLoader.load( 'img/creeper_face.png' );
    const skinMap = textureLoader.load( 'img/creeper_skin.png' );
 
    const skinMat = new THREE.MeshPhongMaterial({
      map: skinMap
    });
   
    const headMaterials = [];
    for( let i = 0; i < 6; i++ ) {
        let map;
 
        if( i === 4 ) map = faceMap;
        else map = skinMap;
 
        headMaterials.push(new THREE.MeshPhongMaterial({ map }));
    }

    // head
    /*
    
    const creeperMat = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
    this.head = new THREE.Mesh( headGeo, headMaterials );
    this.head.position.set( 0, 6, 0 );
    */
   const headGeo = new THREE.BoxGeometry(
      4 * sizeScale,
      4 * sizeScale,
      4 * sizeScale
    );
    this.head = new THREE.Mesh( headGeo, headMaterials );
    this.head.position.set( 0, 12 * sizeScale, 0 );
    const headShape = new CANNON.Box(
      new CANNON.Vec3( 2 * sizeScale, 2 * sizeScale, 2 * sizeScale )
    );
    // body
    
    const bodyGeo = new THREE.BoxGeometry(
      4 * sizeScale,
      8 * sizeScale,
      2 * sizeScale
    );
    /*
    this.body = new THREE.Mesh( bodyGeo, skinMat );
    this.body.position.set( 0, 0, 0 );
    */
   this.headBody = new CANNON.Body({
    mass: 5 * massScale,
    position: new CANNON.Vec3( 0, 12 * sizeScale, 0 )
  });
  this.headBody.addShape( headShape );
  this.headBody.position.copy( this.head.position );
  this.headBody.addEventListener(
    'collide',
    ( event ) => this.onCollide( event )
  );

  this.body = new THREE.Mesh( bodyGeo, skinMat );
  this.body.position.set( 0, 6 * sizeScale, 0 );

  const bodyShape = new CANNON.Box(
    new CANNON.Vec3( 2 * sizeScale, 4 * sizeScale, 1 * sizeScale )
  );
  this.bodyBody = new CANNON.Body({
    mass: 10 * massScale,
    position: new CANNON.Vec3( 0, 6 * sizeScale, 0 )
  });
  this.bodyBody.addShape( bodyShape );

    // 4 feet
    const footGeo = new THREE.BoxGeometry(
      2 * sizeScale,
      3 * sizeScale,
      2 * sizeScale
    );
    /*
    this.foot1 = new THREE.Mesh( footGeo, skinMat );
    this.foot1.position.set( -1, -5.5, -2 );
    
    this.foot2 = this.foot1.clone();
    this.foot2.position.set( -1, -5.5, 2 );
    
    this.foot3 = this.foot1.clone();
    this.foot3.position.set( 1, -5.5, 2 );
    
    this.foot4 = this.foot1.clone();
    this.foot4.position.set( 1, -5.5, -2 );
    */
   this.leftFrontLeg = new THREE.Mesh( footGeo, skinMat );
   this.leftFrontLeg.position.set(
     -1 * sizeScale,
     1.5 * sizeScale,
     2 * sizeScale
   );
   this.leftBackLeg = this.leftFrontLeg.clone();
   this.leftBackLeg.position.set(
     -1 * sizeScale,
     1.5 * sizeScale,
     -2 * sizeScale
   );
   this.rightFrontLeg = this.leftFrontLeg.clone();
   this.rightFrontLeg.position.set(
     1 * sizeScale,
     1.5 * sizeScale,
     2 * sizeScale
   );
   this.rightBackLeg = this.leftFrontLeg.clone();
   this.rightBackLeg.position.set(
     1 * sizeScale,
     1.5 * sizeScale,
     -2 * sizeScale
   );

   const footShape = new CANNON.Box(
     new CANNON.Vec3( 1 * sizeScale, 1.5 * sizeScale, 1 * sizeScale )
   );
   this.leftFrontLegBody = new CANNON.Body({
     mass: 10 * massScale,
     position: new CANNON.Vec3( -1 * sizeScale, 1.5 * sizeScale, 2 * sizeScale )
   });
   this.leftFrontLegBody.addShape( footShape );
   this.leftBackLegBody = new CANNON.Body({
     mass: 10 * massScale,
     position: new CANNON.Vec3( -1 * sizeScale, 1.5 * sizeScale, -2 * sizeScale )
   })
   this.leftBackLegBody.addShape( footShape );
   this.rightFrontLegBody = new CANNON.Body({
     mass: 10 * massScale,
     position: new CANNON.Vec3( 1 * sizeScale, 1.5 * sizeScale, 2 * sizeScale )
   });
   this.rightFrontLegBody.addShape( footShape );
   this.rightBackLegBody = new CANNON.Body({
     mass: 10 * massScale,
     position: new CANNON.Vec3( 1 * sizeScale, 1.5 * sizeScale, -2 * sizeScale )
   });
   this.rightBackLegBody.addShape( footShape );

   // Neck joint
   this.neckJoint = new CANNON.LockConstraint( this.headBody, this.bodyBody );

   // Knee joint
   this.leftFrontKneeJoint = new CANNON.LockConstraint(
     this.bodyBody,
     this.leftFrontLegBody
   );
   this.leftBackKneeJoint = new CANNON.LockConstraint(
     this.bodyBody,
     this.leftBackLegBody
   );
   this.rightFrontKneeJoint = new CANNON.LockConstraint(
     this.bodyBody,
     this.rightFrontLegBody
   );
   this.rightBackKneeJoint = new CANNON.LockConstraint(
     this.bodyBody,
     this.rightBackLegBody
   );

    // Combine 4 feet as a group
    /*
    this.feet = new THREE.Group();
    this.feet.add( this.foot1 );
    this.feet.add( this.foot2 );
    this.feet.add( this.foot3 );
    this.feet.add( this.foot4 );
    */
    this.feet = new THREE.Group();
    this.feet.add(this.leftFrontLeg) // 前腳左
    this.feet.add(this.leftBackLeg) // 後腳左
    this.feet.add(this.rightFrontLeg) // 前腳右
    this.feet.add(this.rightBackLeg) // 後腳右
    //shadow
    this.head.castShadow = true;
    this.head.receiveShadow = true;
    
    this.body.castShadow = true;
    this.body.receiveShadow = true;
    
    //this.foot1.castShadow = true;
    //this.foot1.receiveShadow = true;
    // Put head, body and feet into a single group
    this.add( this.head );
    this.add( this.body );
    this.add( this.feet );
    this.name = 'creeper';
    
    this.traverse(function( object ) {
      if( object instanceof THREE.Mesh ) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    this.attach();
  }
  onCollide( event ) {
    this.counter++;
 
    if( this.counter > 6 ) {
      setTimeout(() => {
        this.explosion();
      }, 100 );
    }
  }
  attach() {
    const world = this.world;
    const scene = this.scene;
    if( !world || !scene ) return;
 
    scene.add( this );
 
    world.addBody( this.headBody );
    world.addBody( this.bodyBody );
    world.addBody( this.leftFrontLegBody );
    world.addBody( this.leftBackLegBody );
    world.addBody( this.rightFrontLegBody );
    world.addBody( this.rightBackLegBody );
    world.addConstraint( this.neckJoint );
    world.addConstraint( this.leftFrontKneeJoint );
    world.addConstraint( this.leftBackKneeJoint );
    world.addConstraint( this.rightFrontKneeJoint );
    world.addConstraint( this.rightBackKneeJoint );
  }
  detach() {
    const world = this.world;
    const scene = this.scene;
    if( !world || !scene ) return;
 
    for( let i=0; i < this.explosions.length; i++ ) {
      this.explosions[i].destroy();
      this.scene.remove( this.explosions[i] );
    }
 
    this.explosions.length = 0;
    this.isExposed = false;
 
    scene.remove( this );
 
    world.removeBody( this.headBody );
    world.removeBody( this.bodyBody );
    world.removeBody( this.leftFrontLegBody );
    world.removeBody( this.leftBackLegBody );
    world.removeBody( this.rightFrontLegBody );
    world.removeBody( this.rightBackLegBody );
    world.removeConstraint( this.neckJoint );
    world.removeConstraint( this.leftFrontKneeJoint );
    world.removeConstraint( this.leftBackKneeJoint );
    world.removeConstraint( this.rightFrontKneeJoint );
    world.removeConstraint( this.rightBackKneeJoint );
  }
  dispose() {
    this.detach();
 
    this.scene = null;
    this.world = null;
  }
  update() {
    this.head.position.copy( this.headBody.position );
    this.head.quaternion.copy( this.headBody.quaternion );
    this.body.position.copy( this.bodyBody.position );
    this.body.quaternion.copy( this.bodyBody.quaternion );
    this.leftFrontLeg.position.copy( this.leftFrontLegBody.position );
    this.leftFrontLeg.quaternion.copy( this.leftFrontLegBody.quaternion );
 
    this.leftBackLeg.position.copy( this.leftBackLegBody.position );
    this.leftBackLeg.quaternion.copy( this.leftBackLegBody.quaternion );
    this.rightFrontLeg.position.copy( this.rightFrontLegBody.position );
    this.rightFrontLeg.quaternion.copy( this.rightFrontLegBody.quaternion );
    this.rightBackLeg.position.copy( this.rightBackLegBody.position );
    this.rightBackLeg.quaternion.copy( this.rightBackLegBody.quaternion );
 
    this.animate();
  }
  feetAminate() {
    if( !this.walking ) return;
 
    this.walkOffset += 0.04;
    this.leftFrontLeg.rotation.x = Math.sin( this.walkOffset ) / 4; // 前腳左
    this.leftBackLeg.rotation.x = -Math.sin( this.walkOffset ) / 4; // 後腳左
    this.rightFrontLeg.rotation.x = -Math.sin( this.walkOffset ) / 4; // 前腳右
    this.rightBackLeg.rotation.x = Math.sin( this.walkOffset ) / 4; // 後腳右
  }

  headAnimate() {
    if( !this.headSwinging ) return;

    this.rotateHeadOffset += 0.04;
    this.head.rotation.y = Math.sin( this.rotateHeadOffset );
  }
  bodyAnimate() {
    if( !this.bodyScaling ) return;

    this.scaleHeadOffset += 0.04;

    const scaleRate = Math.abs( Math.sin( this.scaleHeadOffset ) ) / 16 + 1;
    this.scale.set( scaleRate, scaleRate, scaleRate );
  }
  explosionAnimate() {
    if( !this.isExposed ) return;

    for( let i=0; i < this.explosions.length; i++ ) {
        this.explosions[i].update();
    }
  }
  toggleAnimate() {
    this.headSwinging = !this.headSwinging;
    this.bodyScaling = !this.bodyScaling;
    this.walking = !this.walking;
  }
  animate() {
    this.headAnimate();
    this.bodyAnimate();
    this.feetAminate();
    this.explosionAnimate();
    this.explosionAnimate();
  }
  trigger() {
    this.counter++;

    if( this.counter < 3 ) return;

    setTimeout(() => {
        this.explosion();
    }, 100 );
  }
  explosion() {
    this.rotateHeadOffset = 0;
    this.walkOffset = 0;
    this.scaleHeadOffset = 0;

    this.walking = false;
    this.headSwinging = false;
    this.bodyScaking = false;
    this.counter = 0;

    const scene = this.scene;
    scene.remove( this );
    this.explosions[0] = new Explosion( 0, 0, 0, 0x000000, scene );
    this.explosions[1] = new Explosion( 5, 5, 5, 0x333333, scene );
    this.explosions[2] = new Explosion( -5, 5, 10, 0x666666, scene );
    this.explosions[3] = new Explosion( -5, 5, 5, 0x999999, scene );
    this.explosions[4] = new Explosion( 5, 5, -5, 0xcccccc, scene );

    this.isExposed = true;
  }

  reset() {
      if( !this.isExposed ) return;

      for( let i=0; i < this.explosions.length; i++ ) {
          this.explosions[i].destroy();
      }
      this.walking = true;
      this.headSwinging = true;
      this.bodyScaking = true;
      this.explosions.length = 0;
      this.isExposed = false;

      this.scene.add( this );
      this.position.set( 0, 0, 0 );
  }
}
