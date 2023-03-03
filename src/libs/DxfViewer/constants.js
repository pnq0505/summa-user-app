export const TextRenderer = {
  DefaultOptions: {
    /** Number of segments for each curve in a glyph. Currently Three.js does not have more
     * adequate angle-based or length-based tessellation option.
     */
    curveSubdivision: 2,
    /** Character to use when the specified fonts does not contain necessary glyph. Several ones can
     * be specified, the first one available is used.
     */
    fallbackChar: "\uFFFD?"
  }
}

export const DxfScene = {
  DefaultOptions: {
    /** Target angle for each segment of tessellated arc. */
    arcTessellationAngle: 10 / 180 * Math.PI,
    /** Divide arc to at least the specified number of segments. */
    minArcTessellationSubdivisions: 8,
    /** Text rendering options. */
    textOptions: TextRenderer.DefaultOptions
  }
}
