/* eslint-disable no-invalid-this */
import chai from "chai";
import chaiAsPRosmied from "chai-as-promised";
import { resolveSpeechWithWITAI, wavUrlToBuffer } from "../src/index";
import config from "./env";

chai.use(chaiAsPRosmied);
const { expect } = chai;
const speechRecognitionSamples = [
  [
    "https://cdn.discordapp.com/attachments/838767598778843149/841360475631779861/Hello_my_name_is_John.wav",
    "hello my name is john",
  ],
];

describe("witAI test", function () {
  this.timeout(16000);
  const [url, text] = speechRecognitionSamples[0];
  it("Speech recognition", async () => {
    const audioBuffer = await wavUrlToBuffer(url);
    const response = await resolveSpeechWithWITAI(audioBuffer, {
      key: config.WITAI_KEY,
    });
    expect(response.toLowerCase()).to.equal(text);
  });
  it("Bad request data throws error", () => {
    const badAudioBuffer = Buffer.from("test");
    return expect(
      resolveSpeechWithWITAI(badAudioBuffer, {
        key: config.WITAI_KEY,
      })
    ).to.be.rejectedWith("Wrong request data");
  });
  it("Empty request body throws error", () => {
    const emptyBuffer = Buffer.from("");
    return expect(
      resolveSpeechWithWITAI(emptyBuffer, {
        key: config.WITAI_KEY,
      })
    ).to.be.rejectedWith("Api error, code: 400");
  });
  it("Empty token throws error", async () => {
    const audioBuffer = await wavUrlToBuffer(url);
    return expect(
      resolveSpeechWithWITAI(audioBuffer, {
        key: "",
      })
    ).to.be.rejectedWith("wit.ai API key wasn't specified.");
  });
  it("Bad token throws error", async () => {
    const audioBuffer = await wavUrlToBuffer(url);
    return expect(
      resolveSpeechWithWITAI(audioBuffer, {
        key: "d",
      })
    ).to.be.rejectedWith("Api error, code: 400");
  });
});
