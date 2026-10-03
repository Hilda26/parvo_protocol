def test_parvo_deploys_and_starts_empty(direct_deploy):
    parvo = direct_deploy("contracts/Parvo.py")
    ledger = parvo.get_ledger()
    assert ledger["bonds_created"] == "0"
    assert ledger["checks_run"] == "0"
    assert ledger["total_escrowed"] == "0"
    assert parvo.list_bonds() == []


def test_unknown_bond_read_reverts(direct_deploy, direct_vm):
    parvo = direct_deploy("contracts/Parvo.py")
    with direct_vm.expect_revert("no bond"):
        parvo.get_bond("missing")
