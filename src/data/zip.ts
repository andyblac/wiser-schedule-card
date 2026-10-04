interface ZipFile {
  name: string;
  contents: string;
}

const encoder = new TextEncoder();

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date: Date): { date: number; time: number } {
  const year = Math.max(1980, date.getFullYear());
  return {
    date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
  };
}

function concatenate(parts: Uint8Array[]): Uint8Array<ArrayBuffer> {
  const output = new Uint8Array(new ArrayBuffer(parts.reduce((size, part) => size + part.length, 0)));
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }
  return output;
}

export function createZip(files: ZipFile[]): Blob {
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  const stamp = dosDateTime(new Date());
  let localOffset = 0;

  for (const file of files) {
    const name = encoder.encode(file.name);
    const contents = encoder.encode(file.contents);
    const checksum = crc32(contents);
    const localHeader = new Uint8Array(30 + name.length);
    const local = new DataView(localHeader.buffer);
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(6, 0x0800, true);
    local.setUint16(8, 0, true);
    local.setUint16(10, stamp.time, true);
    local.setUint16(12, stamp.date, true);
    local.setUint32(14, checksum, true);
    local.setUint32(18, contents.length, true);
    local.setUint32(22, contents.length, true);
    local.setUint16(26, name.length, true);
    localHeader.set(name, 30);
    localParts.push(localHeader, contents);

    const centralHeader = new Uint8Array(46 + name.length);
    const central = new DataView(centralHeader.buffer);
    central.setUint32(0, 0x02014b50, true);
    central.setUint16(4, 20, true);
    central.setUint16(6, 20, true);
    central.setUint16(8, 0x0800, true);
    central.setUint16(10, 0, true);
    central.setUint16(12, stamp.time, true);
    central.setUint16(14, stamp.date, true);
    central.setUint32(16, checksum, true);
    central.setUint32(20, contents.length, true);
    central.setUint32(24, contents.length, true);
    central.setUint16(28, name.length, true);
    central.setUint32(42, localOffset, true);
    centralHeader.set(name, 46);
    centralParts.push(centralHeader);
    localOffset += localHeader.length + contents.length;
  }

  const centralDirectory = concatenate(centralParts);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(8, files.length, true);
  endView.setUint16(10, files.length, true);
  endView.setUint32(12, centralDirectory.length, true);
  endView.setUint32(16, localOffset, true);
  const archive = concatenate([...localParts, centralDirectory, end]);
  return new Blob([archive.buffer], { type: 'application/zip' });
}
