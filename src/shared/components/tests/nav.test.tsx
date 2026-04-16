import { describe,it } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Avatar } from "@/shared/components/Avatar";

describe("Nav", ()=>{
  const setup = ()=>{
    const animalList  = "🐸"
    const nickname = "frag"
    const avatar = render(<Avatar/>)
  }
  it("nav 컴포넌트 렌더링",()=>{
    
  })
})

