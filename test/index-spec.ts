
import * as chai from "chai";

const expect = chai.expect;
import { load } from "../src/executor/index"

describe("index", () => {
  it("should provide Greeter", async () => {
    let ret = await load({})
    console.log(ret)
    // expect(index.Greeter).to.not.be.undefined;
  });
});
