from pathlib import Path


SOURCE = Path(__file__).parents[2] / "contracts" / "Parvo.py"


def test_contract_exposes_archive_bond_surface():
    text = SOURCE.read_text()
    for needle in [
        "class Parvo(gl.Contract)",
        "def create_bond",
        "def check_commitment",
        "def contest_breach",
        "def adjudicate_contest",
        "def settle_breach",
        "def expire_bond",
        "def commitment_status",
        "BREACH_RUN_LENGTH = 2",
        "CONTEST_WINDOW_SECONDS = 604800",
    ]:
        assert needle in text


def test_contract_keeps_archive_safety_guards():
    text = SOURCE.read_text()
    assert "decode_checked" in text
    assert "load_change_points" in text
    assert "Wayback" in text
    assert "Absence is never success" in text
