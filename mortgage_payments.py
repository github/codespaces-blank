def principal_remaining_by(principal,
                           annual_interest_rate, duration_in_months, by_month):
    # First, convert the annual interest rate to monthly interest rate
    monthly_interest_rate = (annual_interest_rate / 100) / 12

    # Second, calculate the monthly payment
    top_half = (monthly_interest_rate *
                (1 + monthly_interest_rate) ** duration_in_months)
    bottom_half = (1 + monthly_interest_rate) ** duration_in_months - 1
    monthly_payment = principal * (top_half / bottom_half)

    # Once we have monthly payment,
    # we can calculate the amount that goes towards the principal
    while by_month > 0:
        interest_payment = monthly_interest_rate * principal
        principal_payment = monthly_payment - interest_payment

        # Let's update the principal by subtracting the principal payment
        principal = principal - principal_payment
        by_month -= 1

    # Return the principal remaining
    # to avoid negative values for the last month, we make it absolute
    return abs(principal)


"""
def main():
    principal = 600000
    annual_interest_rate = 6
    duration_in_months = 360
    by_month = 359
    p_remain = (principal_remaining_by(principal, annual_interest_rate,
                                       duration_in_months, by_month))
    print(f"{p_remain:.2f}")


# to make sure that 'main' runs only if we run this file directly
# when we run with import, ::  __name__ == mortgage_payments.py
#                                 if run directly, __name__ ==  __main__
if __name__ == '__main__':
    main()
"""
