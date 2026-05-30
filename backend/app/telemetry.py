import time
from typing import Any
from app.config import get_settings


_tc = None


def _get_client():
    global _tc
    if _tc is not None:
        return _tc

    settings = get_settings()
    key = settings.APPINSIGHTS_INSTRUMENTATION_KEY
    if not key:
        return None

    try:
        from applicationinsights import TelemetryClient
        _tc = TelemetryClient(instrumentation_key=key)
        return _tc
    except Exception:
        return None


def track_plugin_step(
    plugin: str,
    function: str,
    tokens: int,
    latency_ms: int,
    **props: Any,
) -> None:
    tc = _get_client()
    if tc is None:
        return

    tc.track_event(
        f"sk_plugin_{function}",
        {
            "plugin": plugin,
            "function": function,
            "tokens": str(tokens),
            "latency_ms": str(latency_ms),
            **{k: str(v) for k, v in props.items()},
        },
    )
    tc.flush()


class PluginTimer:
    """Context manager for timing plugin steps and sending telemetry."""

    def __init__(self, plugin: str, function: str):
        self.plugin = plugin
        self.function = function
        self.start = 0.0
        self.latency_ms = 0

    def __enter__(self):
        self.start = time.time()
        return self

    def __exit__(self, *args):
        self.latency_ms = int((time.time() - self.start) * 1000)

    def track(self, tokens: int = 0, **props: Any) -> None:
        track_plugin_step(
            self.plugin,
            self.function,
            tokens=tokens,
            latency_ms=self.latency_ms,
            **props,
        )
