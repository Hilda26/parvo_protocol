import json
from pathlib import Path

from gltest import get_contract_factory
from gltest.assertions import tx_execution_succeeded
from gltest.types import TransactionStatus
from gltest.utils import extract_contract_address


CONTRACTS = Path(__file__).parents[2] / "contracts"


def _hash(receipt):
    return str(receipt.get("hash") or receipt.get("transaction_hash") or receipt.get("tx_hash") or receipt.get("tx_id") or "UNKNOWN")


def _record(label, receipt):
    print(f"PARVO_EVIDENCE {label}={_hash(receipt)}")
    print(
        "PARVO_RECEIPT "
        + json.dumps(
            {
                "label": label,
                "result_name": receipt.get("result_name"),
                "execution_result": receipt.get("execution_result"),
                "triggered_transactions": receipt.get("triggered_transactions", []),
            },
            default=str,
            sort_keys=True,
        )
    )


def test_parvo_deploys_on_studionet():
    factory = get_contract_factory(contract_file_path=CONTRACTS / "Parvo.py")
    receipt = factory.deploy_contract_tx(
        args=[],
        wait_transaction_status=TransactionStatus.FINALIZED,
        wait_interval=5000,
        wait_retries=180,
    )
    assert tx_execution_succeeded(receipt), receipt
    address = extract_contract_address(receipt)
    parvo = factory.build_contract(contract_address=address)
    _record("PARVO_DEPLOY", receipt)
    print(f"PARVO_EVIDENCE PARVO_ADDRESS={address}")
    ledger = parvo.get_ledger(args=[]).call()
    assert ledger["bonds_created"] == "0"
    assert ledger["checks_run"] == "0"
    assert ledger["total_escrowed"] == "0"
    assert parvo.list_bonds(args=[]).call() == []
