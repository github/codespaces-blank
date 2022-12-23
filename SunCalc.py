# -*- coding: utf-8 -*-

from skyfield import api
from skyfield import almanac
from skyfield.api import wgs84 
from pytz import timezone

ts = api.load.timescale()
planets = api.load('de421.bsp')
Mstein = wgs84.latlon(47.521183, 7.613215, 335.78)
myzone = timezone('Europe/Zurich')

# rises and sets
t0 = ts.utc(2022, 12, 30)
t1 = ts.utc(2024, 1, 22)
t, y = almanac.find_discrete(t0, t1, almanac.sunrise_sunset(planets, Mstein))

print(t.utc_strftime(format='%d.%m.%Y %H:%M:%S'))
res = t.astimezone(myzone)

import pandas as pd
df = pd.DataFrame(y, res)
df.to_csv('SunRiseSet1.csv')


#transits
#ungelöst: Time intervall!
import datetime as dt

t = ts.utc(2022, 1, range(1, 13))
now = myzone.localize(dt.datetime.t())
midnight = now.replace(hour=0, minute=0, second=0, microsecond=0)
next_midnight = midnight + dt.timedelta(days=1)

t0 = ts.from_datetime(midnight)
t1 = ts.from_datetime(next_midnight)

f = almanac.meridian_transits(planets, planets['Sun'], Mstein)
times, events = almanac.find_discrete(t0, t1, f)

# Select transits instead of antitransits.
times = times[events == 1]

tstr = str(t.astimezone(myzone))[:19]
print('Solar noon:', tstr)
