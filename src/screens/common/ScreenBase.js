import { RoutesMenu } from "./RoutesMenu";


export function ScreenBase({ openRoutesMenu }) {
  return (
    <RoutesMenu open={openRoutesMenu}/>
  )
}