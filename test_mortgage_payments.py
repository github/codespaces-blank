import mortgage_payments
from mortgage_payments import principal_remaining_by as p_remain_by


def test_mortgage_payments(case, principal, annual_interest_rate,
                           duration_in_months, by_month, check):
    """
    :param case: (int) # for number of case - better identification
    :param principal: (int) amount of principal borrowed
    :param annual_interest_rate: (float) percentage of annual interest rate
    :param duration_in_months: (int) duration of loan in months
    :param by_month: (int) month to check remaining principal by
    :param check: (float) value to check against

    :return: (void) print passed if test passes, else print failed
    """

    # 'test' variable to store the principal remaining
    principal_remain = (mortgage_payments.p_remain_by(principal,
                        annual_interest_rate, duration_in_months, by_month))

    # round to 2 decimal places
    principal_remain = round(principal_remain, 2)

    if principal_remain == check:
        print(f"Test case {case}: Passed")
    else:
        print(f"Test case {case}: Failed")


def main():

    # test cases
    test_mortgage_payments(1, 600000, 6, 360, 359, 3579.41)
    test_mortgage_payments(2, 1000000, 12, 360, 12, 996371.21)
    test_mortgage_payments(3, 1000000, 12, 360, 1, 999713.87)
    test_mortgage_payments(4, 500000, 30, 240, 228, 128565.14)
    test_mortgage_payments(5, 500000, 30, 240, 24, 498918.06)
    test_mortgage_payments(6, 856328, 30, 240, 240, 0)


if __name__ == "__main__":
    main()
