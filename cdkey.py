"""
CodeScribe
Total time: 72 minute

CD Key Information Retrieval Module

This module contains functions to retrieve CD key information using the provided parameters.

It defines the following functions:
- get_cdkey_info(uid: int, cdkey: str, cookie: str, region: str) -> bool:
  Retrieves CD key information for a specific user, CD key, and region.

- main(uid: int, cdkey: str, cookie: str):
  Main function to retrieve and display CD key information for various regions.

Usage:
1. Make sure to have the `requests` library installed using: `pip install requests`.
2. Call the `main` function with user ID, CD key, and cookie to fetch CD key information.
"""

import requests

URL = 'https://sg-hk4e-api.hoyoverse.com/common/apicdkey/api/webExchangeCdkey'

def get_cdkey_info(uid: int, cdkey: str, cookie: str, region: str) -> bool:
    """
    Retrieve CD key information for a specific user, CD key, and region.

    Args:
        uid (int): User ID.
        cdkey (str): The CD key to exchange.
        cookie (str): User's cookie for authentication.
        region (str): Region to claim the CD key.

    Returns:
        bool: True if CD key information is valid, False otherwise.
    """
    params = {
        'uid': uid,
        'region': region,
        'lang': 'en',
        'cdkey': cdkey,
        'game_biz': 'hk4e_global',
        'sLangKey': 'en-us'
    }
    headers = {
        'Cookie': cookie
    }

    # Example response info:
    # {'data': None, 'message': 'Invalid redemption code', 'retcode': -2003}
    # Expired: {'data': None, 'message': 'This Redemption Code is already in use', 'retcode': -2017}
    response = requests.get(URL, params=params, headers=headers, timeout=1)
    cdkey_info = response.json()
    return cdkey_info.get('data') is not None

def main(uid: int, cdkey: str, cookie: str):
    """
    Main function to retrieve and display CD key information for various regions.

    Args:
        uid (int): User ID.
        cdkey (str): The CD key to exchange.
        cookie (str): User's cookie for authentication.
    """
    regions = ["os_usa", "os_euro", "os_asia", "os_cht"]

    for region in regions:
        # Example response info:
        # {"retcode": 0, "message": "OK", "data": {"list": []}}
        # {'retcode': 0, 'message': 'OK', 'data': {'list': [
        #     {'game_biz': 'hk4e_global', 'region': 'os_usa',
        #      'game_uid': '161818338', 'nickname': 'MortifiedLifter',
        #      'level': 92, 'is_chosen': False, 'region_name': 'America',
        #      'is_official': False}
        # ]}}

        url = ("https://api-account-os.hoyoverse.com/account/binding/api/"
               "getUserGameRolesByCookieToken")

        response = requests.get(url, {
            'lang': 'en',
            'region': region,
            'game_biz': 'hk4e_global',
            'sLangKey': 'en-us'
        }, headers={'Cookie': cookie}, timeout=1).json()

        if not response['data']['list']:
            continue

        cdkey_info = get_cdkey_info(uid, cdkey, cookie, region)
        return cdkey_info
