import { useState, useEffect } from "react";
import { animalList, getRandomAdj } from "../../util/randomAvatar";

export default function Header(...children) {
  return <header>{children}</header>;
}
