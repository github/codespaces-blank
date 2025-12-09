tests/test_main.py
from src.main import add

def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0
