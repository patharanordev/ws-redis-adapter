export class Encoder {
  /**
   * Encode a packet into a list of strings/buffers
   */
  encode(packet) {
    return [JSON.stringify(packet)];
  }
}
