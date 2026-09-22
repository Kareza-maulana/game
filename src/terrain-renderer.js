function setupTerrainRendering(scene,level){
  const get=name=>scene.getObjects(name),game=scene.getGame();
  // Collision rectangles stay at their original coordinates and dimensions.
  for(const name of ['Upper','Stone','StoneFill','Faded','Raft','Ladder'])get(name).forEach(o=>o.hide());
  game.__ckRoadFaces??=new Map();
  for(const name of ['Road','GroundRoad','FadedRoad','RoadFill','BarrierFace'])for(const o of get(name)){
    const r=o.getRendererObject();
    const face=name==='RoadFill'||name==='BarrierFace';
    if(face){
      const original=r.texture,key=original.baseTexture.uid;
      if(!game.__ckRoadFaces.has(key)){const y=Math.floor(original.height*.42);game.__ckRoadFaces.set(key,new PIXI.Texture(original.baseTexture,new PIXI.Rectangle(0,y,original.width,original.height-y)));}
      r.texture=game.__ckRoadFaces.get(key);
    }
    // Tile full texture modules; never stretch a single bitmap along the whole road.
    r.tileScale.set(144/r.texture.width,(face?32:48)/r.texture.height);
    r.tilePosition.set(-o.getVariables().get('roadOffset').getAsNumber(),0);
  }
  if(level.id==='Bukit')for(const o of get('Garden')){
    // Fade only the last part of the existing cave painting into the new vista.
    // This is a render-time mask; both original image files remain intact.
    const r=o.getRendererObject();const filter=new PIXI.Filter(undefined,`
      varying vec2 vTextureCoord;
      uniform sampler2D uSampler;
      uniform vec4 inputSize;
      uniform vec4 outputFrame;
      void main(){vec4 color=texture2D(uSampler,vTextureCoord);float x=vTextureCoord.x*inputSize.x/outputFrame.z;gl_FragColor=color*(1.0-smoothstep(0.84,1.0,x));}
    `);r.filters=[filter];
  }
  return ()=>{const colliders=get('Faded');get('FadedRoad').forEach((o,i)=>o.setOpacity(colliders[i]?.getOpacity()??55));get('RaftRoad').forEach(o=>{const raft=get('Raft')[0];o.setPosition(raft.getX(),raft.getY()-8);});get('BarrierFace').forEach(o=>o.hide(get('Barrier')[0].isHidden()));};
}
