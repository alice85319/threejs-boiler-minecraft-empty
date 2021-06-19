// Put your three.js codes below
(function() {

    var clock = new THREE.Clock();
    var tetha = 0.0, edgeSize = 10, padding = 0.15;
    var cubeSize = edgeSize + (edgeSize - 1) * padding;
    var mov = 4;
    var delta = 1 / mov;
    var halfCubeSize = cubeSize/2;
    var keysQueue = [];
    var score = 0;
    var text = document.createElement("div");
    var length = 4;
    var end = false;
    var bind = 0;
    
    text.style.position = "absolute";
    text.style.width = 200;
    text.style.height = 100;
    text.innerHTML = "<p style='color:white;'>Score: " + score+"</p>";

    text.style.top = 20 + "px";
    text.style.left = 20 + "px";
    text.style.fontSize = 50 + "px";

    var buttonhtml = document.createElement("div");
    //buttonhtml.innerHTML ="<button type='button' id='pause'>Pause</button>";//0701
    buttonhtml.style.top = 20 + "px";
    buttonhtml.style.left = 500 + "px";
    buttonhtml.style.fontSize = 50 + "px";

    /*---------暫停畫面0701--------------- */
      const blocker = document.createElement('div');
      blocker.id = 'blocker';
      document.body.appendChild(blocker);
      const instructions = document.createElement('div');
      instructions.id = 'instructions';
      blocker.appendChild(instructions);

      const breakLine = document.createElement('br');
      const breakLine2 = document.createElement('br');
      const breakLine3 = document.createElement('br');
      const breakLine4 = document.createElement('br');


      const scoreTitle = document.createElement('span');
      scoreTitle.id = 'scoreTitle';
      scoreTitle.style.fontSize = '40px';
      scoreTitle.innerText = 'Score:\t' + score;
      instructions.appendChild(scoreTitle);
      instructions.appendChild(breakLine);

      const img1 = document.createElement('span');
      img1.innerHTML = '<img src="img/start.png" style="height:300px;width:300px">';
      instructions.appendChild(img1);

      instructions.appendChild(breakLine2);

      const spanPause = document.createElement('span');
      spanPause.style.width = '520px';
      spanPause.style.fontSize = '40px';
      spanPause.innerHTML = 'Pause<img src="img/space1.png" style="height:50px;width:150px">';
      //spanPause.innerText = 'Pause';
      instructions.appendChild(spanPause);


      instructions.appendChild(breakLine3);

      const spanControl = document.createElement('span');
      //spanControl.innerText = 'Control Direction';
      spanControl.style.width = '520px';
      spanControl.innerHTML = 'Control Direction<img src="img/wasd2.png" style="height:70px;width:150px">';
      spanControl.style.fontSize = '40px';
      instructions.appendChild(spanControl);

      instructions.appendChild(breakLine4);

      const spanChange = document.createElement('span');
      //spanChange.innerText = 'Change the angle of view';
      spanChange.style.width = '520px';
      spanChange.innerHTML = 'Change the angle of view<img src="img/mouse.png" style="height:70px;width:70px">';
      spanChange.style.fontSize = '40px';
      instructions.appendChild(spanChange);
      /*----------------------------*/
     
      blocker.addEventListener(
        'click',function (event) {
          blocker.style.display = 'none';
          bind = 0;
          sb.walking = true;
        });
      
      
    
    document.body.appendChild(text);
    document.body.appendChild(buttonhtml);
    // Prepare stage scene
    const scene = new THREE.Scene();
  
    // Add actors of this scene
  
 
    //snake
    const sb = new SB(padding, halfCubeSize, scene, keysQueue);
    //sb.snake[4].mesh.add( axes );
    sb.walking = false;
    //test 0630
    const textureLoader = new THREE.TextureLoader();
    const faceMap = textureLoader.load( 'img/4.png' );
    const skinMap = textureLoader.load( 'img/5.png' );
    const headMaterials = [];
    for( let i = 0; i < 6; i++ ) {
        let map;
        if( i < 4 ) map = faceMap;
        else map = skinMap;
        headMaterials.push(new THREE.MeshPhongMaterial({ map }));
    }
    //test
    //apple
    var appleCubeMaterial = new THREE.MeshPhongMaterial( { color: 0xc62828} );
    apple = new Cube(spawnAppleVector(), headMaterials, scene);
    //apple = new Cube(spawnAppleVector(), appleCubeMaterial, scene);

    //外框
    var gameCube = new THREE.BoxGeometry( 2*cubeSize, 2*cubeSize, 2*cubeSize );
    var edgesMaterial = new THREE.LineBasicMaterial( { color: 	0xFF7575 } );
    new Cube(new THREE.Vector3(0,0,0), edgesMaterial, scene, gameCube, true).setPosition(0,0,0);
    
    /*
    // Ground
    const planeGeometry = new THREE.PlaneGeometry( 300, 300, 50, 50 );
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.receiveShadow = true;//苦力怕影子
    plane.name = 'floor';
    plane.rotation.x = -0.5 * Math.PI; //plane變成水平
   // plane.position.set( 0, -7, 0 );//plane位置
    //scene.add( plane );
  */

    // Add camera
    //const camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 ); 
    //const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );//第一人稱
    camera.position.z = 30;
        camera.position.y = 30;
  
    // Set up stage light
    /*
    const spotLight = new THREE.SpotLight( 0x00AEAE );
    //spotLight.castShadow = true;
    spotLight.position.set( -10, 40, 30 );
    scene.add( spotLight );
        */
    //環境燈
    // Set up stage light
    //const ambientLight = new THREE.AmbientLight( 0xE35F69 );
    //scene.add( ambientLight );
    //const pointLight = new THREE.PointLight( 0xf0f0f0, 1, 100 );
    //pointLight.castShadow = true;
    //pointLight.position.set( -30, 30, 30 );
    //scene.add( pointLight );

    //會顯示出燈的位置
    
    //const spotLightHelper = new THREE.SpotLightHelper( ambientLight );
    //scene.add( spotLightHelper );
    
    //加入spotlite 顯示影子
    
    //const pointLight = new THREE.PointLight( 0xB87070, 1, 100 );
    //pointLight.castShadow = true;              //!<<< add this line
    //pointLight.position.set( -30, 30, 30 );
    //scene.add( pointLight );
     // Set up stage light
     const spotLight = new THREE.SpotLight( 0xffffff );
     //spotLight.castShadow = true;
     spotLight.position.set( -10, 40, 30 );
     scene.add( spotLight );
   
     //環境燈
     // Set up stage light
     const ambientLight = new THREE.AmbientLight( 0x404040 );
     scene.add( ambientLight );
     const pointLight = new THREE.PointLight( 0xf0f0f0, 1, 100 );
     pointLight.castShadow = true;
     pointLight.position.set( -30, 30, 30 );
     scene.add( pointLight );

    //可用滑鼠旋轉環境  
    const navTool = new THREE.OrbitControls( camera );   //0623
    //const navTool = new NavigationTool( camera, sb.snake[length].mesh );
    //navTool.enableDamping = true;
    //navTool.dampingFactor = 0.10;
   // navTool.attach( scene );
    
  
    // Set up renderer
    const renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0xDEFFFF, 1.0); //0701改成黑色
    renderer.shadowMap.enabled = true;//影子
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;//影子
    document.body.appendChild( renderer.domElement );
  
    
    
    function spawnAppleVector(){
      var x = randInRange(0, edgeSize - 1), y =  randInRange(0, edgeSize - 1), z =  randInRange(0, edgeSize - 1);
      return new THREE.Vector3(x + x*padding -halfCubeSize + 0.5, y + y * padding -halfCubeSize + 0.5, z + z * padding -halfCubeSize + 0.5);
    }
    function randInRange(a, b){
    return a + Math.floor((b - a) * Math.random());
    }
    
  
    
    // Start rendering.
    function render() {
      requestAnimationFrame( render );
      tetha += clock.getDelta();
      if(tetha > delta){
        sb.snakeAminate();
        apple.cubeAminate();//0630 apple animate
        tetha = 0;
        //navTool.look = sb.snake[length].point2.getWorldPosition();
        
        //吃到蘋果
        if(sb.snake[length].mesh.position.distanceTo(apple.mesh.position) < 1){
          apple.setPosition(spawnAppleVector());
          text.innerHTML = "<p style='color:black;'>Score: " + (++score)+"</p>";//更新分數
          scoreTitle.innerText = '你的分數:\t'+score;
          //text.innerHTML +="<button type='button' id='pause'>Pause</button>";
          //test 0630
          //test
          sb.snake.unshift(new Cube( new THREE.Vector3(sb.snake[0].mesh.position.x, sb.snake[0].mesh.position.y, sb.snake[0].mesh.position.z), new THREE.MeshPhongMaterial( {  map : skinMap} ), scene));
          //test
          length+=1;
        }

        //撞到自己的判定
        for(var i = length - 2; i > -1; i--){
          if(sb.snake[length].mesh.position.distanceTo(sb.snake[i].mesh.position) < 1){
              end = true;
              break;
          }
        }

        //遊戲結束
        if(end) {
                /*------------------------ */
          
          blocker.style.display = '';
          sb.walking = false;
          
          
          
        /*----------------------------*/
          end = false;
          text.innerHTML = "<p style='color:white;'>Score: " + 0+"</p>";
          //text.innerHTML +="<button type='button' id='pause'>Pause</button>";
          //sb.walking = false;
          length = 4;
          //navTool.score = score;
          score = 0;
          //navTool.endview();//出現畫面
          sb.restart();
          
        }

        //撞到牆壁
        if(sb.snake[length].mesh.position.x < -2*halfCubeSize){
         end = true;
        }
        else if(sb.snake[length].mesh.position.x > 2*halfCubeSize){
          end = true;
        }
        else if(sb.snake[length].mesh.position.y < -2*halfCubeSize){
          end = true;
        }
        else if(sb.snake[length].mesh.position.y > 2*halfCubeSize){
          end = true;
        }
        else if(sb.snake[length].mesh.position.z < -2*halfCubeSize){
          end = true;
        }
        else if(sb.snake[length].mesh.position.z > 2*halfCubeSize){
          end = true;
        }
        
        //移動相機
        //navTool.cameramove(sb.snake[length-4].point.getWorldPosition(),sb.snake[length].mesh.position);
      
      }
      renderer.render( scene, camera );
    }
    
    render();
  
    //轉彎
    document.addEventListener('keydown', logKey);
    function logKey(e) {
        sb.turnaround(e.keyCode);
      }

    //使畫面會根據視窗調整size
    window.addEventListener( 'resize', function() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
    });
  
    //控制蛇動的按鈕
    
    const animateBtn = document.getElementById( 'pause' );
    animateBtn.addEventListener( 'click', function() {
      blocker.style.display = '';
      sb.walking = false;
    });
    
  })();