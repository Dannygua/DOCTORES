import { useRef } from "react"
import { useForwardRaycast } from "./useForwardRaycast"
import { useFrame } from "react-three-fiber"

const ABC = () => {
  const ref:any = useRef(null)
  const raycast = useForwardRaycast(ref)
  useFrame((state, delta) => {
    if(ref.current !== null){
      ref.current.rotation.y += 1 * delta
    }
    const intersections = raycast()
    console.log(intersections.length)
    //...do something here
  })

  return (
    <mesh ref={ref}>
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

export default ABC;