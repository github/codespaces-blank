"""
Reusable rate limiting tracker with manual counting and header parsing.
Tracks requests in a rolling 1-hour window and can throttle proactively.
"""

from collections import deque
from datetime import datetime, timedelta
from typing import Optional, Mapping
import time


class RateLimitTracker:
    """
    Manually track API requests in a rolling hour and surface status.
    Optionally parses X-RateLimit-* headers to align with server limits.
    """

    def __init__(self, hourly_limit: int = 1000, min_interval_seconds: float = 0.0):
        self.hourly_limit = hourly_limit
        self.requests = deque()  # request timestamps
        self.total_requests = 0
        self.min_interval_seconds = min_interval_seconds
        self._last_request_ts: Optional[float] = None

    def _prune(self) -> None:
        cutoff = datetime.now() - timedelta(hours=1)
        while self.requests and self.requests[0] < cutoff:
            self.requests.popleft()

    def can_make_request(self) -> bool:
        self._prune()
        return len(self.requests) < self.hourly_limit

    def time_until_reset(self) -> float:
        if not self.requests:
            return 0.0
        oldest = self.requests[0]
        reset_at = oldest + timedelta(hours=1)
        remaining = (reset_at - datetime.now()).total_seconds()
        return max(0.0, remaining)

    def before_request(self) -> None:
        """Optionally sleep to respect min interval and hard limit."""
        # Respect min inter-request interval
        now = time.time()
        if self._last_request_ts is not None and self.min_interval_seconds > 0:
            delta = now - self._last_request_ts
            if delta < self.min_interval_seconds:
                time.sleep(self.min_interval_seconds - delta)

        # Hard limit check
        if not self.can_make_request():
            wait = self.time_until_reset()
            if wait > 0:
                time.sleep(min(wait, 2.0))  # brief backoff; caller may implement longer waits

    def after_response(self, headers: Optional[Mapping[str, str]] = None) -> None:
        """Record the request and update limits from headers if provided."""
        self.requests.append(datetime.now())
        self.total_requests += 1
        self._last_request_ts = time.time()

        if headers:
            # Normalize header keys to lowercase for robust access
            lower = {k.lower(): v for k, v in headers.items()}
            limit = lower.get('x-ratelimit-limit')
            if limit:
                try:
                    self.hourly_limit = int(limit)
                except ValueError:
                    pass

    def status(self) -> dict:
        self._prune()
        used = len(self.requests)
        remaining = max(0, self.hourly_limit - used)
        return {
            'hourly_limit': self.hourly_limit,
            'used': used,
            'remaining': remaining,
            'total_requests': self.total_requests,
            'seconds_to_reset': self.time_until_reset(),
        }
