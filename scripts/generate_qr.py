#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "Pillow>=11.0,<13",
#   "qrcode>=8.2,<9",
# ]
# ///

"""Generate a high-error-correction QR code with a centered logo."""

from __future__ import annotations

import argparse
from pathlib import Path
from urllib.parse import urlparse

import qrcode
from PIL import Image, ImageDraw

DEFAULT_BOX_SIZE = 12
DEFAULT_BORDER = 4
DEFAULT_LOGO_SCALE = 0.2


def validate_url(value: str) -> str:
    parsed = urlparse(value)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise argparse.ArgumentTypeError("URL must start with http:// or https://")
    return value


def parse_arguments() -> argparse.Namespace:
    repository_root = Path(__file__).resolve().parents[1]

    parser = argparse.ArgumentParser(
        description="Generate a QR code with a centered logo."
    )
    parser.add_argument(
        "url",
        type=validate_url,
        help="URL to encode in the QR code",
    )
    parser.add_argument(
        "--logo",
        type=Path,
        default=repository_root / "public/logo.png",
        help="Logo image path (default: public/logo.png)",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=repository_root / "public/dtc-logo.png",
        help="Output PNG path (default: public/dtc-logo.png)",
    )
    parser.add_argument(
        "--box-size",
        type=int,
        default=DEFAULT_BOX_SIZE,
        help=f"Pixels per QR module (default: {DEFAULT_BOX_SIZE})",
    )
    parser.add_argument(
        "--border",
        type=int,
        default=DEFAULT_BORDER,
        help=f"Quiet-zone width in QR modules (default: {DEFAULT_BORDER})",
    )
    parser.add_argument(
        "--logo-scale",
        type=float,
        default=DEFAULT_LOGO_SCALE,
        help=f"Logo size as a fraction of QR width (default: {DEFAULT_LOGO_SCALE})",
    )
    return parser.parse_args()


def resolve_path(path: Path) -> Path:
    return path.expanduser().resolve()


def validate_options(arguments: argparse.Namespace) -> None:
    if arguments.box_size < 1:
        raise SystemExit("--box-size must be at least 1")
    if arguments.border < 4:
        raise SystemExit("--border must be at least 4 modules")
    if not 0.1 <= arguments.logo_scale <= 0.25:
        raise SystemExit("--logo-scale must be between 0.1 and 0.25")


def create_logo_badge(
    logo_path: Path,
    qr_width: int,
    logo_scale: float,
) -> Image.Image:
    logo = Image.open(logo_path).convert("RGBA")
    logo_size = max(1, int(qr_width * logo_scale))
    logo.thumbnail((logo_size, logo_size), Image.Resampling.LANCZOS)

    padding = max(8, qr_width // 40)
    badge = Image.new(
        "RGBA",
        (logo.width + padding * 2, logo.height + padding * 2),
        "white",
    )
    mask = Image.new("L", badge.size, 0)
    ImageDraw.Draw(mask).ellipse(
        (0, 0, badge.width - 1, badge.height - 1),
        fill=255,
    )
    badge.putalpha(mask)
    badge.alpha_composite(logo, (padding, padding))
    return badge


def generate_qr(
    url: str,
    logo_path: Path,
    output_path: Path,
    box_size: int,
    border: int,
    logo_scale: float,
) -> None:
    qr_code = qrcode.QRCode(
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=box_size,
        border=border,
    )
    qr_code.add_data(url)
    qr_code.make(fit=True)

    image = qr_code.make_image(fill_color="black", back_color="white").convert("RGBA")
    badge = create_logo_badge(logo_path, image.width, logo_scale)
    position = (
        (image.width - badge.width) // 2,
        (image.height - badge.height) // 2,
    )
    image.alpha_composite(badge, position)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    image.convert("RGB").save(output_path, format="PNG", optimize=True)


def main() -> None:
    arguments = parse_arguments()
    validate_options(arguments)

    logo_path = resolve_path(arguments.logo)
    output_path = resolve_path(arguments.output)
    if not logo_path.is_file():
        raise SystemExit(f"Logo file not found: {logo_path}")

    generate_qr(
        url=arguments.url,
        logo_path=logo_path,
        output_path=output_path,
        box_size=arguments.box_size,
        border=arguments.border,
        logo_scale=arguments.logo_scale,
    )
    print(f"Generated {output_path} for {arguments.url}")


if __name__ == "__main__":
    main()
