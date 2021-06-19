
class SB {
    constructor(padding, halfCubeSize, scene, keysQueue){
        this.snake = [];
        this.scene = scene;
        this.walking = true;
        this.keysQueue = keysQueue;
        this.up = false;
        this.down = false;
        this.uptimes =0;
        this.downtimes =0;
        this.padding = padding;
        this.halfCubeSize = halfCubeSize;
        this.init( halfCubeSize, scene);
    }

    init(halfCubeSize, scene){

    var BACKGROUND_COLOR = 0x6200ee, BODY_COLOR = 0x388e3c, HEAD_COLOR = 0x004D40, score = 0;
    
    this.direction = new THREE.Vector3(1, 0, 0);
    //test0630
    const textureLoader = new THREE.TextureLoader();
    const snakebody = textureLoader.load( 'img/7.png' );
    const snakehead = textureLoader.load( 'img/8.png' );
    for(var i = 0; i < 5; i++){
    var snakeCubeMaterial = new THREE.MeshPhongMaterial( { map: (i == 4) ? snakehead : snakebody} );
    //test
    
    this.snake.push(new Cube( new THREE.Vector3((i + i * this.padding) -halfCubeSize + 0.5 , 0.5 + this.padding / 2, 0.5 + this.padding / 2 ), snakeCubeMaterial, scene));

    }


    } 


snakeAminate() {
   
        var BACKGROUND_COLOR = 0x6200ee, BODY_COLOR = 0x388e3c, HEAD_COLOR = 0x004D40, score = 0;
        
        if( !this.walking ) return;
        
        this.direction = this.keysQueue.length > 0 ? this.keysQueue.pop(0) : this.direction;
        for(var i = 0; i < this.snake.length-1; i++){
            this.snake[i].setPosition(new THREE.Vector3(this.snake[i+1].mesh.position.x, this.snake[i+1].mesh.position.y,this.snake[i+1].mesh.position.z));
        }
        this.snake[this.snake.length-1].mesh.translateX(1+Math.sign(1) * this.padding);
    

    

}
restart(){
    //先把蛇全部丟掉
    while(this.snake.length > 0) this.scene.remove(this.snake.shift().mesh);
    var BACKGROUND_COLOR = 0x6200ee, BODY_COLOR = 0x388e3c, HEAD_COLOR = 0x004D40, score = 0;
    //重新加入方塊
    for(var i = 0; i < 5; i++){
        //test0630
        const textureLoader = new THREE.TextureLoader();
        const snakebody = textureLoader.load( 'img/7.png' );
        const snakehead = textureLoader.load( 'img/8.png' );
        var snakeCubeMaterial = new THREE.MeshPhongMaterial( { map: (i == 4) ? snakehead : snakebody} );
        //test
        //var snakeCubeMaterial = new THREE.MeshPhongMaterial( { color: (i == 4) ? HEAD_COLOR : BODY_COLOR} );
        this.snake.push(new Cube( new THREE.Vector3((i + i * this.padding) -this.halfCubeSize + 0.5 , 0.5 + this.padding / 2, 0.5 + this.padding / 2 ), snakeCubeMaterial, this.scene));
        
    }
}
turnaround(dir){
    
    switch(dir){
        case 87://w
            this.snake[this.snake.length-1].mesh.rotateZ(Math.PI/2);
            this.snake[this.snake.length-5].mesh.rotateZ(Math.PI/2);
            this.uptimes++;
            this.downtimes = 0;
            if(this.uptimes == 2){
                this.snake[this.snake.length-1].mesh.rotateX(Math.PI);
                this.snake[this.snake.length-5].mesh.rotateX(Math.PI);
                this.uptimes = 0;
            }
            this.up = !this.up;

            break;
        case 83://s
        this.uptimes = 0;
            this.snake[this.snake.length-1].mesh.rotateZ(-Math.PI/2);
            this.snake[this.snake.length-5].mesh.rotateZ(-Math.PI/2);
            this.down = !this.down;
            if(this.uptimes == 2){
                this.snake[this.snake.length-1].mesh.rotateX(Math.PI);
                this.snake[this.snake.length-5].mesh.rotateX(Math.PI);
                this.downtimes = 0;
            }
            break;
        case 65://a
        this.uptimes = 0;
        this.downtimes = 0;
            this.snake[this.snake.length-1].mesh.rotateY(Math.PI/2);
            this.snake[this.snake.length-5].mesh.rotateY(Math.PI/2);
            if(this.up == true){
                console.log(this.up);
                this.snake[this.snake.length-1].mesh.rotateX(Math.PI/2);
                this.snake[this.snake.length-5].mesh.rotateX(Math.PI/2);
                this.up = false;
            }
            if(this.down == true){
                console.log(this.down);
                this.snake[this.snake.length-1].mesh.rotateX(-Math.PI/2);
                this.snake[this.snake.length-5].mesh.rotateX(-Math.PI/2);
                this.down = false;
            }
            break;
        case 68://d
        this.uptimes = 0;
        this.downtimes = 0;
            this.snake[this.snake.length-1].mesh.rotateY(-Math.PI/2);
            this.snake[this.snake.length-5].mesh.rotateY(-Math.PI/2);
            if(this.up == true){
                console.log(this.up);
                this.snake[this.snake.length-1].mesh.rotateX(-Math.PI/2);
                this.snake[this.snake.length-5].mesh.rotateX(-Math.PI/2);
                this.up = false;
            }
            if(this.down == true){
                console.log(this.down);
                this.snake[this.snake.length-1].mesh.rotateX(Math.PI/2);
                this.snake[this.snake.length-5].mesh.rotateX(Math.PI/2);
                this.down = false;
            }
            break;
            case 32: // space //0628
                blocker.style.display = '';
                this.walking = false;
                console.log('space');
                break;
    } 
}

animate(){
    this.snakeAnimate();
}


}

 
