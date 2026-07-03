# API routers will be imported here
from .auth import router as auth
from .rooms import router as rooms
from .reservations import router as reservations
from .assignments import router as assignments
from .sheets import router as sheets
from .cleaning import router as cleaning
from .recommendations import router as recommendations
from .sync import router as sync