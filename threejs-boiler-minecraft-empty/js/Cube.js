  
class Cube{
    
    constructor(vec, material, scene, geometry, renderWireframe){
        
        //方塊大小
        var cube = new THREE.BoxGeometry( 1, 1, 1 );
        this.geometry = typeof geometry === 'undefined' ? cube : geometry;
        const axes = new THREE.AxesHelper( 10 );//20:線的長度
        var material2 = new THREE.PointsMaterial( { color: 0x888888 } );
        var geometry2 = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
       
        this.point = new THREE.Mesh( );
        this.point2 = new THREE.Mesh();
        
        this.point.position.set(-2,4,0);//當作攝影機的位置
        this.point2.position.set(-1,2,0);
        this.mesh = new THREE.Mesh(this.geometry, material);
        
        this.mesh.add(this.point);
        this.mesh.add(this.point2);
        if(typeof renderWireframe === 'undefined' || !renderWireframe){
            this.mesh.position.set(vec.x, vec.y, vec.z);
            //console.log(this.mesh.position);
            scene.add(this.mesh);
        }
        else {
            var edges = new THREE.EdgesGeometry( this.mesh.geometry );
            scene.add(new THREE.LineSegments( edges, material ));
        }
        
        this.setPosition = function(vec){
            this.mesh.position.set(vec.x, vec.y, vec.z);
        };
    }
    //test 0630 
    cubeAminate() { 
        this.mesh.rotateX(Math.PI/Math.random()/10);
        this.mesh.rotateY(Math.PI/Math.random()/10);
    }
}  