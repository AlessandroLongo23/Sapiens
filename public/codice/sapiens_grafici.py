"""matplotlib's backend in Sapiens's Python editor: figures are drawn with Agg, and plt.show() sends them to the
console as images (sapiens.mostra_figure)."""

from matplotlib.backend_bases import FigureManagerBase as FigureManager  # noqa: F401
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas  # noqa: F401

import sapiens


def show(*args, **kwargs):
    sapiens.mostra_figure()
