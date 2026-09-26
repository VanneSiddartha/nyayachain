from fastapi import FastAPI

from alerts import alerts_router
from documents import router as documents_router
from ledger import ledger_router
from transfers import transfers_router
from verify import verify_router

app = FastAPI(title="NyayaChain")
app.include_router(alerts_router)
app.include_router(documents_router)
app.include_router(ledger_router)
app.include_router(transfers_router)
app.include_router(verify_router)
