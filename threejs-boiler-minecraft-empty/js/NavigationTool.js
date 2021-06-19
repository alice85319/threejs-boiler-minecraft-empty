/**
 * Point lock navigation tool
 * Ref: https://ithelp.ithome.com.tw/articles/10208322
 */
 
/**
 * Point lock navigation tool
 * Ref: https://ithelp.ithome.com.tw/articles/10208322
 */
 
class NavigationTool {
  constructor( camera, pos, walking) {
    this.camera = camera;
    this.controls = null;
    this.raycaster = null;
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.canJump = false;
    this.prevTime = Date.now(); // 初始時間
    this.velocity = new THREE.Vector3(); // 移動速度向量
    this.direction = new THREE.Vector3(); // 移動方向向量
    this.score = 0;
    this.look = new THREE.Vector3();

    this.onControlLockedHandler = ( event ) => this.onControlLocked( event );
    this.onControlUnlockedHandler = ( event ) => this.onControlUnlocked( event );
    this.onInstructionsClickedHandler = ( event ) => this.onInstructionsClicked( event );
    this.onEndClickedHandler = ( event ) => this.onEndClicked( event );
    this.onKeyDownHandler = ( event ) => this.onKeyDown( event );
    this.onKeyUpHandler = ( event ) => this.onKeyUp( event );
 
    this.initialize(pos);
    this.bindEvents();
  }
 
  //設定開始或esc的畫面
  createUI() {
    const blocker = document.createElement( 'div' );
    blocker.id = 'blocker';
    document.body.appendChild( blocker );
 
    const instructions = document.createElement( 'div' );
    instructions.id = 'instructions';
    blocker.appendChild( instructions );
 
    const scoreTitle = document.createElement( 'span' );
    scoreTitle.id = 'scoreTitle';
    scoreTitle.style.fontSize = '40px';
    scoreTitle.innerText = '你的分數:\t'+this.score;
    instructions.appendChild( scoreTitle );

    const breakLine = document.createElement( 'br' );
    const breakLine2 = document.createElement( 'br' );
    instructions.appendChild( breakLine );
    
    const spanTitle = document.createElement( 'span' );
    spanTitle.style.fontSize = '40px';
    spanTitle.innerText = '點擊開始';
    instructions.appendChild( spanTitle );
 
    
    instructions.appendChild( breakLine2 );
 
    const spanControl = document.createElement( 'span' );
    spanControl.innerText = '(W, A, S, D = 控制方向, SPACE = 跳躍, MOUSE = 轉動視角)';
    instructions.appendChild( spanControl );
   
  }
  
 
  initialize(pos) {
    this.createUI();
 
    const controls = new THREE.PointerLockControls( this.camera );
   
    console.log(controls.getObject().position);
    controls.getObject().rotation.y=-Math.PI/2;
    this.controls = controls;
    
 
    // 使用 Raycaster 實現簡單碰撞偵測
    this.raycaster = new THREE.Raycaster(
      new THREE.Vector3(),
      new THREE.Vector3( 0, -1, 0 ),
      0,
      10
    );
  }
 
  uninitialize() {
    this.clearEvents();
  }
 
  attach( scene ) {
    if( !(scene instanceof THREE.Scene) ) return;
 
    scene.add( this.controls.getObject() );
  }
 
  detach( scene ) {
    if( !(scene instanceof THREE.Scene) ) return;
 
    scene.remove( this.controls.getObject() );
  }
 
  //相機移動
  cameramove(point, point2){
    //camera.position.set(sb.snake[4].point.getWorldPosition().x, sb.snake[4].point.getWorldPosition().y, sb.snake[4].point.getWorldPosition().z);
    //controls.update();
    this.controls.getObject().position.set(point.x, point.y, point.z);
    //this.controls.getObject().lookAt(point2.x, point2.y, point2.z);
  }
  bindEvents() {
    const instructions = document.getElementById( 'instructions' );
    const end = document.getElementById( 'end' );
 
    const havePointerLock = 'pointerLockElement' in document ||
                            'mozPointerLockElement' in document ||
                            'webkitPointerLockElement' in document;
 
    if( havePointerLock ) {
      instructions.addEventListener(
        'click',
        this.onInstructionsClickedHandler,
        false
      );
      
 
      this.controls.addEventListener(
        'lock',
        this.onControlLockedHandler
      );
 
      this.controls.addEventListener(
        'unlock',
        this.onControlUnlockedHandler
      );
    } else {
      instructions.innerHTML = '你的瀏覽器似乎不支援 Pointer Lock API，建議使用電腦版 Google Chrome 取得最佳體驗！';
    }
   
    document.addEventListener(
      'keydown',
      this.onKeyDownHandler,
      false
    );
 
    document.addEventListener(
      'keyup',
      this.onKeyUpHandler,
      false
    );
  }
 
  clearEvents() {
    const instructions = document.getElementById( 'instructions' );
 
    instructions.removeEventListener(
      'click',
      this.onInstructionsClickedHandler,
      false
    );
 
    this.controls.removeEventListener(
      'lock',
      this.onControlLockedHandler
    );
 
    this.controls.removeEventListener(
      'unlock',
      this.onControlUnlockedHandler
    );
 
    document.removeEventListener(
      'keydown',
      this.onKeyDownHandler,
      false
    );
 
    document.removeEventListener(
      'keyup',
      this.onKeyUpHandler,
      false
    );
  }
 
  //不會用到
  update( scene ) {
    
    if( !(scene instanceof THREE.Scene) || this.controls.isLocked !== true ) return;
 
    // 使用 Raycaster 判斷腳下是否與場景中物體相交
    this.raycaster.ray.origin.copy( this.controls.getObject().position ); // 複製控制器的位置
    const intersections = this.raycaster.intersectObjects( scene.children, true ); // 判斷是否在任何物體上
    const onObject = intersections.length > 0;
 
    // 計算時間差
    const time = Date.now();
    const delta = ( time - this.prevTime ) / 1000; // 大約為 0.016
 
    // 設定初始速度變化
    this.velocity.x -= this.velocity.x * 10.0 * delta;
    this.velocity.z -= this.velocity.z * 10.0 * delta;
    this.velocity.y -= 9.8 * 100.0 * delta; // 預設墜落速度
 
    // 判斷按鍵朝什麼方向移動，並設定對應方向速度變化
    this.direction.z = Number( this.moveForward ) - Number( this.moveBackward );
    this.direction.x = Number( this.moveLeft ) - Number( this.moveRight );
    // direction.normalize() // 向量正規化（長度為 1），確保每個方向保持一定移動量
    if( this.moveForward || this.moveBackward )
      this.velocity.z -= this.direction.z * 400.0 * delta;
    if( this.moveLeft || this.moveRight )
      this.velocity.x -= this.direction.x * 400.0 * delta;
 
    // 處理跳躍對應 y 軸方向速度變化
    if( onObject === true ) {
      this.velocity.y = Math.max( 0, this.velocity.y );
      this.canJump = true;
    }
 
    // 根據速度值移動控制器位置
    this.controls.getObject().translateX( this.velocity.x * delta );
    this.controls.getObject().translateY( this.velocity.y * delta );
    this.controls.getObject().translateZ( this.velocity.z * delta );
 
    // 控制器下墜超過 -2000 則重置位置
    if( this.controls.getObject().position.y < -2000 ) {
      this.velocity.y = 0;
      this.controls.getObject().position.set( 10, 100, 60 );
      this.canJump = true;
    }
 
    this.prevTime = time;
    
  }
 
  onInstructionsClicked() {
    console.log("onInstructionsClicked");
    this.controls.lock();
  }
 
 
  onControlLocked() {
    const blocker = document.getElementById( 'blocker' );
    const instructions = document.getElementById( 'instructions' );
 
    instructions.style.display = 'none';
    blocker.style.display = 'none';
  }
 
  onControlUnlocked() {
    console.log("onControlUnlocked");
    const blocker = document.getElementById( 'blocker' );
    const instructions = document.getElementById( 'instructions' );
 
    blocker.style.display = 'block';
    instructions.style.display = '';
  }
 
  onKeyUp( event ) {
    
    switch( event.keyCode ) {
      case 38: // up
      case 87: // w
        this.moveForward = false;
        //this.controls.rotateZ(Math.PI/2);
        console.log("w")
        break;
      case 37: // left
      case 65: // a
        this.moveLeft = false;
        //this.controls.rotateY(+Math.PI/2);
        break;
      case 40: // down
      case 83: // s
        this.moveBackward = false;
        //this.controls.rotateZ(-Math.PI/2);
        break;
      case 39: // right
      case 68: // d
        this.moveRight = false;
        //this.controls.rotateY(-Math.PI/2);
        break;
    }
  }
 
  endview(){
    
    //更新分數
    const scoreTitle = document.getElementById( 'scoreTitle' );
    scoreTitle.innerText = '你的分數:\t'+this.score;
    
    //鎖定畫面
    this.controls.unlock();
    
  }
  onKeyDown( event ) {
    var flag1 = false,flag2 = false;
    var Y_AXIS = new THREE.Vector3( 0, 1, 0 );
    switch( event.keyCode ) {
      case 38: // up
      case 87: // w
        this.moveForward = true;
        break;
      case 37: // left
      case 65: // a
        this.moveLeft = true;
        break;
      case 40: // down
      case 83: // s
        this.moveBackward = true;
        break
      case 39: // right
      case 68: // d
        this.moveRight = true;
        break;
      case 32: // space
      /*
        if( this.canJump === true )
          this.velocity.y += 350; // 跳躍高度
 
        this.canJump = false;
        */
        break;
    }
  }
  
}








