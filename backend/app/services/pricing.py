BASE_PRICES = {
    "cortenstaal": 89.0,
    "rvs": 149.0,
    "zwart_staal": 69.0,
}

THICKNESS_MULTIPLIER = {
    "2mm": 1.0,
    "3mm": 1.15,
    "4mm": 1.30,
    "6mm": 1.55,
}

def calculate_price(material: str, thickness: str) -> float:
    base = BASE_PRICES.get(material, 89.0)
    mult = THICKNESS_MULTIPLIER.get(thickness, 1.0)
    return round(base * mult, 2)
