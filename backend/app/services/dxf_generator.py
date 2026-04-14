import ezdxf, os
from svgpathtools import svg2paths

OUTPUT_DIR = "/tmp/outputs"
SCALE = 0.1  # SVG px -> mm (assuming 96dpi -> ~0.264 mm/px, adjusted to 0.1 for typical laser scale)

def svg_to_dxf(svg_path: str, job_id: str) -> str:
    dxf_path = os.path.join(OUTPUT_DIR, f"{job_id}.dxf")
    doc = ezdxf.new("R2010")
    doc.units = ezdxf.units.MM
    msp = doc.modelspace()
    try:
        paths, _ = svg2paths(svg_path)
        for path in paths:
            for segment in path:
                start = segment.start
                end = segment.end
                msp.add_line(
                    (start.real * SCALE, -start.imag * SCALE),
                    (end.real * SCALE, -end.imag * SCALE),
                    dxfattribs={"layer": "SNIJLIJN"}
                )
    except Exception:
        msp.add_text("DXF placeholder", dxfattribs={"layer": "SNIJLIJN"})
    doc.saveas(dxf_path)
    return dxf_path
