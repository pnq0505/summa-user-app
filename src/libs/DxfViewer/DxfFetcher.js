var RNFS = require('react-native-fs');

import DxfParser from './parser/DxfParser';
import {test} from './test5.js';

/** Fetches and parses DXF file. */
export class DxfFetcher {
  constructor(url) {
    this.url = url;
  }

  /** @param progressCbk {Function} (phase, receivedSize, totalSize) */
  async Fetch(progressCbk = null) {
    let buffer = null;
    // let _body = null
    // const response = await RNFS.readFile(this.url, "utf8");
    const response = await fetch(this.url);
    buffer = await response.text();

    // .then(resp => {
    //     console.log('Printing out not json');
    //     return resp;
    // }).then(body => {
    //     console.log('body', body.getReader())
    //     _body = body
    //     return body;
    // })
    // const totalSize = response.headers.get('Content-Length')
    // console.log(response.body)
    // const reader = _body.getReader()
    // let receivedSize = 0
    // //XXX streaming parsing is not supported in dxf-parser for now (its parseStream() method
    // // just accumulates chunks in a string buffer before parsing. Fix it later.
    // let buffer = ""
    // let decoder = new TextDecoder("utf-8")
    // while(true) {
    //     const {done, value} = await reader.read()
    //     if (done) {
    //         buffer += decoder.decode(new ArrayBuffer(0), {stream: false})
    //         break
    //     }
    //     buffer += decoder.decode(value, {stream: true})
    //     receivedSize += value.length
    //     if (progressCbk !== null) {
    //         progressCbk("fetch", receivedSize, totalSize)
    //     }
    // }

    // if (progressCbk !== null) {
    //     progressCbk("parse", 0, null)
    // }
    const parser = new DxfParser();
    // console.log("co vo day ko 1", response);
    return JSON.parse(buffer);
  }
}
