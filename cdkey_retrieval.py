"""
This script demonstrates how to retrieve CD key information using the provided parameters.

It defines a function `get_cdkey_info` that takes user ID, CD key, and cookie as parameters
and returns JSON response containing CD key information.
P
Usage:
1. Make sure to have the `requests` library installed using: `pip install requests`
2. Run the script to fetch CD key information.
"""

import requests

URL = 'https://sg-hk4e-api.hoyoverse.com/common/apicdkey/api/webExchangeCdkey'

def get_cdkey_info(uid: int, cdkey: str, cookie: str, region: str) -> bool:
    """
    Get information about a CD key exchange.

    Args:
        uid (int): User ID.
        cdkey (str): The CD key to exchange.
        cookie (str): User's cookie for authentication.
        region (str): Region to claim the CD key.

    Returns:
        dict: JSON response containing CD key information.
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

    response = requests.get(URL, params=params, headers=headers, timeout=1)
    cdkey_info = response.json()
    # {'data': None, 'message': 'Invalid redemption code', 'retcode': -2003}
    # {'data': None, 'message': 'This Redemption Code is already in use', 'retcode': -2017}
    print(cdkey_info.get('data'))
    return cdkey_info['data'] is not None

# def main(_uid: int, _cdkey: str, cookie: str):
def main(uid: int, cdkey: str, cookie: str):
    """
    Main function to retrieve and display CD key information for various regions.
    """

    regions = ["os_usa", "os_euro", "os_asia", "os_cht"]

    for region in regions:
        a8734 = requests.get('https://api-account-os.hoyoverse.com/account/'
                                                'binding/api/'
                    'getUserGameRolesByCookieToken', {
        'lang': 'en',
        'region': region,
        'game_biz': 'hk4e_global',
        'sLangKey': 'en-us'
    }, headers={'Cookie': cookie}, timeout=1).json()
        # {"retcode": 0, "message": "OK", "data": {"list": []}}
        # {'retcode': 0, 'message': 'OK', 'data': {'list': [{'game_biz': 'hk4e_global', 'region':
        # 'os_asia'
        # , 'game_uid': '888087899', 'nickname': 'RfadnjdExt', 'level': 5, 'is_chosen': False, '
        # region_name': 'Asia Server', 'is_official': True}]}}

        if not a8734['data']['list']:
            continue

        print(a8734.get('data'))

        cdkey_info = get_cdkey_info(uid, cdkey, cookie, region)
        print(f"CD Key Info for Region {region}: {cdkey_info}")

main(888087899, 'GENSHINGIFT', '_MHYUUID=59a11a9c-1e06-46de-99a0-615e88dcc5fe; '
     'HYV_LOGIN_PLATFORM_OPTIONAL_AGREEMENT={%22content%22:[]}; DEVICEFP_SEED_ID='
     '6b6d5283e0eb704f; DEVICEFP_SEED_TIME=1693119028723; DEVICEFP=38d7eea4b814d; cookie_token_v2='
     'v2_CAQSDGNlMXRidXdiMDB6axokNTlhMTFhOWMtMWUwNi00NmRlLTk5YTAtNjE1ZTg4ZGNjNWZlIKflq6cGKPfP2NAEM'
     'LSFmqYB; account_mid_v2=1ku1zicab5_hy; account_id_v2=348553908')
