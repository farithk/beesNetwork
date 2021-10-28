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
  const [allPaths, setAllPaths] = useState({
    one: [[0,0,0,0,0,0]],
    two: [[0,0,0,0,0,0]],
    three: [[0,0,0,0,0,0]],
    four: [[0,0,0,0,0,0]]
  });
  const [generation, setGeneration] = useState(0);

  let hexaColors = ["F43B86", "3D087B", "77D970", "172774", "A2D2FF", "FF865E", "1C7947", "00C1D4", "185ADB", "FC92E3",
                    "A6F0C6", "FF414D", "480032", "FEE440", "290FBA", "F8485E", "8236CB", "99154E", "005792", "1F441E"];
  let generationStep = ["one", "two", "three", "four"];

  let ind = 20;
  let target = [20,20,0];
  let steps = 49;

  useEffect(() => {
    let initialPositions = [];
    for (let i = 0; i < ind; i++) {
      initialPositions.push([0,0,0]);
    }
    let initialPaths = [];
    for (let i = 0; i < ind; i++) {
      initialPaths.push([[0,0,0,0,0,0]]);
    }
    setAllMovements(()=>{
      return initialPositions;
    });

    setAllPaths((oldPaths)=>{
      return {...oldPaths, [generationStep[generation]]: initialPaths};
    });

    let counter = 0;
    let timer = setInterval(()=>{
      counter = counter + 1;

      setAllMovements((old) => {
        if(counter > steps){
          clearInterval(timer);
          setGeneration(generation + 1);
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

          let newPoint = [old[i][0] + x * 2, old[i][1] + y * 2, old[i][2] + z * 2, x, y, z];
          if(old[i][0] > 15 && old[i][0] < 25 && old[i][1] > 15 && old[i][1] < 25 && old[i][2] > -5 && old[i][2] < 5){
            newStep.push(old[i]);
            setAllPaths((oldPaths) => {
              oldPaths[generationStep[generation]][i].push(old[i]);
              return oldPaths;
            });
          } else {
            newStep.push(newPoint);
            setAllPaths((oldPaths) => {
              oldPaths[generationStep[generation]][i].push(newPoint);
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
    console.log(allPaths);
    console.log(generation);
    if(generation > 0){
      console.log("here");
      let finalDistances = [];
      for (let i = 0; i < allPaths[generationStep[generation - 1]].length; i++) {
        let x = allPaths[generationStep[generation - 1]][i][allPaths[generationStep[generation - 1]][i].length - 1][0];
        let aa = (x - target[0]) * (x - target[0]);
        let y = allPaths[generationStep[generation - 1]][i][allPaths[generationStep[generation - 1]][i].length - 1][1];
        let bb = (y - target[1]) * (y - target[1]);
        let z = allPaths[generationStep[generation - 1]][i][allPaths[generationStep[generation - 1]][i].length - 1][2];
        let cc = (z - target[2]) * (z - target[2]);
        finalDistances.push((1/Math.sqrt(aa + bb + cc)) * (1/Math.sqrt(aa + bb + cc)));
      }
      let sum = finalDistances.reduce(function (previousValue, currentValue) {
        return previousValue + currentValue
      }, 0);
      let percentage = finalDistances.map((value) => Math.round((value/sum) * 100));
      let newWheel = [];
      for (let j = 0; j < percentage.length; j++) {
        for (let i = 0; i < percentage[j]; i++) {
          newWheel.push(j);
        }
      }
      //console.log(newWheel);

      let newPopulation = [];

      for (let i = 0; i < ind; i++) {
        let parent1 = Math.floor(Math.random() * (newWheel.length - 1));
        let parent2 = Math.floor(Math.random() * (newWheel.length - 1));

        let crossPoint = Math.floor(Math.random() * (allPaths[generationStep[generation]][0].length - 1));

        let whichParent = Math.floor(Math.random() * (2));

        let newChild = [];
/*
        console.log(newWheel);
        console.log(newWheel[parent1]);

        console.log(allPaths[generationStep[generation - 1]]);

        console.log(allPaths[generationStep[generation - 1]][newWheel[parent1]]);
*/
        if(whichParent){
          for (let i = 0; i < allPaths[generationStep[generation - 1]][0].length; i++) {
            if(crossPoint > i){
              newChild.push(allPaths[generationStep[generation - 1]][newWheel[parent1]][i]);
            } else {
              newChild.push(allPaths[generationStep[generation - 1]][newWheel[parent2]][i])
            }
          }
        } else {
          for (let i = 0; i < allPaths[generationStep[generation - 1]][0].length; i++) {
            if(crossPoint > i){
              newChild.push(allPaths[generationStep[generation - 1]][newWheel[parent2]][i]);
            } else {
              newChild.push(allPaths[generationStep[generation - 1]][newWheel[parent1]][i])
            }
          }
        }
        newPopulation.push(newChild);
      }

      //console.log(newPopulation);

      let initialPaths = [];
      for (let i = 0; i < ind; i++) {
        initialPaths.push([[0,0,0,0,0,0]]);
      }
      let initialPositions = [];
      for (let i = 0; i < ind; i++) {
        initialPositions.push([0,0,0]);
      };
      setAllMovements(()=>{
        return initialPositions;
      });

      setAllPaths((oldPaths)=>{
        return {...oldPaths, [generationStep[generation]]: initialPaths};
      });

      console.log(generation);

      let counter = 0;
      let timer = setInterval(()=>{
        counter = counter + 1;

        setAllMovements((old) => {
          if(counter > steps){
            clearInterval(timer);
            if(generation < 3){
              setGeneration(generation + 1);
            }
          }

          //Multiple Points
          let newStep = [];
          for(let i = 0; i < ind; i++){
            let x = newPopulation[i][counter][3];
            let y = newPopulation[i][counter][4];
            let z = newPopulation[i][counter][5];

            let newPoint = [old[i][0] + x * 2, old[i][1] + y * 2, old[i][2] + z * 2, x, y, z];
            if(old[i][0] > 15 && old[i][0] < 25 && old[i][1] > 15 && old[i][1] < 25 && old[i][2] > -5 && old[i][2] < 5){
              newStep.push(old[i]);
              setAllPaths((oldPaths) => {
                oldPaths[generationStep[generation]][i].push(old[i]);
                return oldPaths;
              });
            } else {
              newStep.push(newPoint);
              setAllPaths((oldPaths) => {
                oldPaths[generationStep[generation]][i].push(newPoint);
                return oldPaths;
              });
            }
          }

          return newStep;

        })
      }, 100);

    }
  }, [generation])

  useEffect(() => {
    //console.log(allPaths[generationStep[generation]]);
  }, [allPaths[generationStep]])

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
          {allPaths.one.length > 1 &&
          <>
            {allPaths.one.map((paths, index) => {
              return(
                  paths.map((beePath)=>{
                    //console.log(index);
                    return <Sphere position={[beePath[0],beePath[1],beePath[2]]} scale={[0.3, 0.3, 0.3]} color={"#2ded07"}/>
                  })
              )
            })}
          </>
          }

          {allPaths.two.length > 1 &&
          <>
            {allPaths.two.map((paths, index) => {
              return(
                  paths.map((beePath)=>{
                    //console.log(index);
                    return <Sphere position={[beePath[0],beePath[1],beePath[2]]} scale={[0.3, 0.3, 0.3]} color={"#373de6"}/>
                  })
              )
            })}
          </>
          }

          {allPaths.three.length > 1 &&
          <>
            {allPaths.three.map((paths, index) => {
              return(
                  paths.map((beePath)=>{
                    //console.log(index);
                    return <Sphere position={[beePath[0],beePath[1],beePath[2]]} scale={[0.3, 0.3, 0.3]} color={"#f26005"}/>
                  })
              )
            })}
          </>
          }

          {allPaths.four.length > 1 &&
          <>
            {allPaths.four.map((paths, index) => {
              return(
                  paths.map((beePath)=>{
                    //console.log(index);
                    return <Sphere position={[beePath[0],beePath[1],beePath[2]]} scale={[0.3, 0.3, 0.3]} color={"#f2f205"}/>
                  })
              )
            })}
          </>
          }
      </Canvas>
    </div>
  );
}
