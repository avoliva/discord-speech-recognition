/* eslint-disable no-invalid-this */
import { expect } from "chai";
import fs from "fs";
import {
  getDurationFromMonoBuffer,
  VoiceMessage,
  wavUrlToBuffer,
} from "../src";
import { data } from "./sampleData.json";
import { readFileToAudioBuffer } from "./utils";

describe("Voice message", () => {
  const mockData = undefined as never;

  const filename = "./test.wav";

  let audioBuffer: Buffer;
  let voiceMessage: VoiceMessage;

  before(async function before() {
    this.timeout(6000);
    audioBuffer = await wavUrlToBuffer(data[0].url);
    voiceMessage = new VoiceMessage({
      client: mockData,
      data: {
        audioBuffer,
        author: mockData,
        duration: mockData,
        connection: mockData,
      },
      channel: mockData,
    });
  });

  it("Save to .wav file", async function saveToWav() {
    this.timeout(4000);
    voiceMessage.saveToFile(filename);
    expect(fs.existsSync(filename));
    const audioBufferFromFile = await readFileToAudioBuffer(filename);
    expect(audioBuffer.toString()).to.be.equal(audioBufferFromFile.toString());
  });

  it("Duration", () => {
    const duration = getDurationFromMonoBuffer(voiceMessage.audioBuffer);
    expect(duration.toPrecision(3)).to.be.equal("2.09");
  });

  after(() => {
    fs.unlinkSync(filename);
  });
});
