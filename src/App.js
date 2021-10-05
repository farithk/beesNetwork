import { React , useState, useEffect} from "react";
import { Canvas } from "react-three-fiber";
import { OrbitControls } from "drei";
import "./App.css";

function Sphere({position, scale, color}) {
  return (
    <mesh position={position} scale={scale} color={color}>
      <sphereGeometry attach="geometry" />
      <meshBasicMaterial
        attach="material"
        color={color}
        opacity={1}
        transparent
      />
    </mesh>
  );
}

function Box({position, scale, color}) {
  return (
    <mesh position={position} scale={scale} color={color}>
      <boxBufferGeometry attach="geometry" />
      <meshBasicMaterial
        attach="material"
        color={color}
        opacity={1}
        transparent
      />
    </mesh>
  );
}


export default function App() {

  const [allMovements, setAllMovements] = useState([0,0,0]);
  const [allPaths, setAllPaths] = useState([[0,0,0]]);

  let ind = 20;
  let target = [20,20,0];
  let steps = 99;

  useEffect(() => {
    let initialPositions = [];
    for (let i = 0; i < ind; i++) {
      initialPositions.push([0,0,0]);
    }
    let initialPaths = [];
    for (let i = 0; i < ind; i++) {
      initialPaths.push([[0,0,0]]);
    }
    setAllMovements(()=>{
      return initialPositions;
    });

    setAllPaths(()=>{
      return initialPaths;
    });

    let counter = 0;
    let timer = setInterval(()=>{
      counter = counter + 1;

      setAllMovements((old) => {
        if(counter > steps){
          clearInterval(timer);
        }

        //Multiple Points
        let newStep = [];
        for(let i = 0; i < ind; i++){
          let x = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
          if(x === 2){
            x = -1;
          };
          let y = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
          if(y === 2){
            y = -1;
          };
          let z = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
          if(z === 2){
            z = -1;
          };

          let newPoint = [old[i][0] + x * 2, old[i][1] + y * 2, old[i][2] + z * 2];
          if(old[i][0] > 15 && old[i][0] < 25 && old[i][1] > 15 && old[i][1] < 25 && old[i][2] > -5 && old[i][2] < 5){
            newStep.push(old[i]);
            setAllPaths((oldPaths) => {
              oldPaths[i].push(old[i]);
              return oldPaths;
            });
          } else {
            newStep.push(newPoint);
            setAllPaths((oldPaths) => {
              oldPaths[i].push(newPoint);
              return oldPaths;
            });
          }
        }

        return newStep;

      })
    }, 100);
    return () => {
      clearInterval(timer);
    }
  }, []);

  useEffect(() => {
    if(allPaths[0].length === steps + 2){
      let finalDistances = [];
      for (let i = 0; i < allPaths.length; i++) {
        let x = allPaths[i][allPaths[i].length - 1][0];
        let aa = (x - target[0]) * (x - target[0]);
        let y = allPaths[i][allPaths[i].length - 1][1];
        let bb = (y - target[1]) * (y - target[1]);
        let z = allPaths[i][allPaths[i].length - 1][2];
        let cc = (z - target[2]) * (z - target[2]);
        finalDistances.push((1/Math.sqrt(aa + bb + cc)) * (1/Math.sqrt(aa + bb + cc)));
      }
      let sum = finalDistances.reduce(function (previousValue, currentValue) {
        return previousValue + currentValue
      }, 0);
      //console.log(sum);
      let percentage = finalDistances.map((value) => Math.round((value/sum) * 100));
      //console.log(percentage);
      let newWheel = [];
      for (let j = 0; j < percentage.length; j++) {
        for (let i = 0; i < percentage[j]; i++) {
          //console.log(j);
          newWheel.push(j);
        }
      }
      //console.log(newWheel);
      let parent1 = Math.floor(Math.random() * newWheel.length - 1);
      let parent2 = Math.floor(Math.random() * newWheel.length - 1);
      //console.log(parent1, parent2);
      console.log(allPaths[newWheel[parent1]], allPaths[newWheel[parent2]]);
    }
  }, [allPaths[0].length])

  return (
    <div className="main">
      <div className="evolve_title">Evolutionary Algorithm</div>
      <Canvas style={{ background: "#ffffff" }} camera={{ position: [0, 0, 50] }}>
        <OrbitControls />
          {allMovements.map((bee) =>
            {
              return(
                <Sphere position={[bee[0],bee[1],bee[2]]} scale={[0.5, 0.5, 0.5]} color={"red"}/>
              )
            })
          }
          <Box position={target} scale={[6, 6, 6]} color={"#e03c00"}/>
          {allPaths.length > 1 &&
          <>
          {allPaths.map((paths) => {
            return(
                paths.map((beePath)=>{
                  return <Sphere position={[beePath[0],beePath[1],beePath[2]]} scale={[0.3, 0.3, 0.3]} color={"#1184f7"}/>
                })
            )
          })}
          </>
          }
      </Canvas>
    </div>
  );
}
