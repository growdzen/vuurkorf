import vtracer, os

OUTPUT_DIR = "/tmp/outputs"

def png_to_svg(png_path: str, job_id: str) -> str:
    svg_path = os.path.join(OUTPUT_DIR, f"{job_id}.svg")
    vtracer.convert_image_to_svg_py(
        png_path,
        svg_path,
        colormode="binary",
        hierarchical="cutout",
        mode="spline",
        filter_speckle=4,
        color_precision=6,
        layer_difference=16,
        corner_threshold=60,
        length_threshold=4.0,
        max_iterations=10,
        splice_threshold=45,
        path_precision=8,
    )
    return svg_path
