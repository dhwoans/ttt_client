import {describe , it} from "vitest"
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Bridge from "../Bridge"


describe("bridge test",()=>{
  it("bridge 렌더링 테스트",()=>{
    const imgSrc = ""
    render(<Bridge></Bridge>)
  })
})